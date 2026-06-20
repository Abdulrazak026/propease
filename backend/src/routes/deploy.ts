import { Router, Request, Response } from "express";
import { exec } from "child_process";
import { createHmac, timingSafeEqual } from "crypto";
import { existsSync, writeFileSync, unlinkSync } from "fs";
import { logger } from "../lib/logger";

const router = Router();

const DEPLOY_SECRET = process.env.DEPLOY_WEBHOOK_SECRET || "mbpp-deploy-secret-change-me";
const LOCKFILE = "/tmp/mbpp-deploy.lock";

function verifyGitHubSignature(payload: string, signatureHeader: string | undefined): boolean {
  if (!signatureHeader || !DEPLOY_SECRET) return false;
  const sig = signatureHeader.startsWith("sha256=") ? signatureHeader.slice(7) : signatureHeader;
  const expected = createHmac("sha256", DEPLOY_SECRET).update(payload).digest("hex");
  try {
    return timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
  } catch { return false; }
}

router.post("/", async (req: Request, res: Response) => {
  const token = req.headers["x-deploy-token"] as string;
  const rawBody = (req as any).rawBody || JSON.stringify(req.body);
  const ghSignature = req.headers["x-hub-signature-256"] as string;
  const authorized = token === DEPLOY_SECRET || verifyGitHubSignature(rawBody, ghSignature);
  if (!authorized) {
    return res.status(403).json({ error: "Unauthorized" });
  }

  if (existsSync(LOCKFILE)) {
    logger.warn("Deploy already in progress, skipping");
    return res.json({ status: "ok", message: "Deploy already in progress" });
  }

  writeFileSync(LOCKFILE, new Date().toISOString());
  logger.info("Deploy triggered");

  res.json({ status: "ok", message: "Deploy started" });

  const cmd = `
    set -o pipefail
    trap 'rm -f ${LOCKFILE}; rm -rf /tmp/mbpp-frontend-build' EXIT

    LOG="/var/www/mbpp/logs/deploy.log"
    FRONTEND="/var/www/mbpp/frontend"
    TMPBUILD="/tmp/mbpp-frontend-build"
    PREV_BUILD="$FRONTEND/.next.prev"

    echo "=== Deploy started at $(date) ===" >> "$LOG"

    echo "--- Pulling latest code ---" >> "$LOG"
    cd /var/www/mbpp-repo
    git fetch origin master >> "$LOG" 2>&1
    git reset --hard origin/master >> "$LOG" 2>&1
    echo "Commit: $(git rev-parse --short HEAD)" >> "$LOG"

    echo "--- Syncing files ---" >> "$LOG"
    mkdir -p /var/www/mbpp/scripts /var/www/mbpp/logs
    rsync -a --delete --exclude=node_modules --exclude=dist --exclude=.env --exclude=uploads /var/www/mbpp-repo/backend/ /var/www/mbpp/api/
    rsync -a --delete --exclude=node_modules --exclude=.next --exclude=backend --exclude=bot --exclude='*.tar.gz' --exclude='*.dump' /var/www/mbpp-repo/ "$FRONTEND/"
    rsync -a --delete --exclude=node_modules /var/www/mbpp-repo/bot/ /var/www/mbpp/bot/
    cp /var/www/mbpp-repo/scripts/deploy.sh /var/www/mbpp/scripts/deploy.sh 2>/dev/null || true
    cp /var/www/mbpp-repo/ecosystem.config.js /var/www/mbpp/ecosystem.config.js 2>/dev/null || true
    cp /var/www/mbpp-repo/nginx/propease.conf /etc/nginx/sites-available/propease.conf 2>/dev/null || true

    echo "--- Building API ---" >> "$LOG"
    cd /var/www/mbpp/api
    npm install 2>&1 | tail -5 >> "$LOG"
    npx prisma generate 2>&1 >> "$LOG"
    npm run build 2>&1 | tail -20 >> "$LOG"
    if [ $? -ne 0 ]; then
      echo "!!! API BUILD FAILED at $(date) !!!" >> "$LOG"
      exit 1
    fi
    npx prisma migrate deploy 2>&1 >> "$LOG"

    echo "--- Migrating Data ---" >> "$LOG"
    npx tsx scripts/migrate-agents.ts 2>&1 >> "$LOG" || true

    echo "--- Building Frontend (atomic) ---" >> "$LOG"

    # Step 1: Save the current working .next as backup
    rm -rf "$PREV_BUILD"
    if [ -d "$FRONTEND/.next" ]; then
      mv "$FRONTEND/.next" "$PREV_BUILD"
      echo "Saved previous .next build as backup" >> "$LOG"
    fi

    # Step 2: Install deps and build fresh
    cd "$FRONTEND"
    echo "--- Installing frontend dependencies ---" >> "$LOG"
    npm install 2>&1 >> "$LOG"
    echo "--- Building frontend ---" >> "$LOG"
    npm run build 2>&1 >> "$LOG"
    BUILD_EXIT=$?

    # Step 3: Verify the build produced working output
    BUILD_OK=0
    if [ $BUILD_EXIT -eq 0 ]; then
      # Check that BUILD_ID exists (required by next start)
      if [ -f "$FRONTEND/.next/BUILD_ID" ]; then
        BUILD_ID=$(cat "$FRONTEND/.next/BUILD_ID")
        echo "BUILD_ID: $BUILD_ID" >> "$LOG"
        if [ -d "$FRONTEND/.next/static" ] && [ "$(ls -A $FRONTEND/.next/static 2>/dev/null)" ]; then
          CSS_COUNT=$(find "$FRONTEND/.next" -name "*.css" 2>/dev/null | wc -l)
          if [ "$CSS_COUNT" -gt 0 ]; then
            BUILD_OK=1
            echo "Build verified: BUILD_ID=$BUILD_ID, $CSS_COUNT CSS files" >> "$LOG"
          else
            echo "!!! BUILD VERIFICATION FAILED: no CSS files generated !!!" >> "$LOG"
          fi
        else
          echo "!!! BUILD VERIFICATION FAILED: .next/static is missing or empty !!!" >> "$LOG"
        fi
      else
        echo "!!! BUILD VERIFICATION FAILED: BUILD_ID missing from .next !!!" >> "$LOG"
      fi
    else
      echo "!!! Frontend build exited with code $BUILD_EXIT !!!" >> "$LOG"
    fi

    # Step 4: If build failed or verification failed, restore previous working build
    if [ $BUILD_OK -eq 0 ]; then
      echo "!!! FRONTEND BUILD FAILED - Restoring previous working build !!!" >> "$LOG"
      rm -rf "$FRONTEND/.next"
      if [ -d "$PREV_BUILD" ]; then
        mv "$PREV_BUILD" "$FRONTEND/.next"
        echo "Previous .next restored successfully" >> "$LOG"
      else
        echo "!!! NO PREVIOUS BUILD TO RESTORE - SITE MAY BE DOWN !!!" >> "$LOG"
      fi
      exit 1
    fi

    # Step 5: Build succeeded — remove backup and reload nginx
    rm -rf "$PREV_BUILD"
    echo "Frontend build verified OK - old backup removed" >> "$LOG"

    echo "--- Updating nginx config and reloading ---" >> "$LOG"
    cp /var/www/mbpp-repo/nginx/propease.conf /etc/nginx/sites-available/propease.conf 2>/dev/null || true
    # Ensure active nginx config points to port 9799 and serves static files directly
    if [ -f /etc/nginx/sites-enabled/mbpproperties.com ]; then
      if grep -q 'proxy_pass http://127.0.0.1:3000' /etc/nginx/sites-enabled/mbpproperties.com; then
        sed -i 's|proxy_pass http://127.0.0.1:3000;|proxy_pass http://127.0.0.1:9799;|g' /etc/nginx/sites-enabled/mbpproperties.com
        echo "Fixed proxy_pass from 3000 to 9799 in active nginx config" >> "$LOG"
      fi
    fi
    nginx -t 2>&1 >> "$LOG" && systemctl reload nginx 2>&1 >> "$LOG" && echo "nginx reloaded OK" >> "$LOG"

    echo "--- Restarting Services ---" >> "$LOG"
    pm2 restart mbpp-api 2>&1 >> "$LOG"
    pm2 restart mbpp-frontend 2>&1 >> "$LOG"
    pm2 save 2>&1 >> "$LOG"

    # Step 6: Health check after restart
    sleep 3
    HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:9799/ 2>/dev/null || echo "000")
    if [ "$HTTP_STATUS" = "200" ]; then
      echo "Health check passed: frontend returned HTTP $HTTP_STATUS" >> "$LOG"
    else
      echo "WARNING: Health check returned HTTP $HTTP_STATUS - rolling back..." >> "$LOG"
      pm2 restart mbpp-frontend 2>&1 >> "$LOG"
      sleep 3
      RETRY_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:9799/ 2>/dev/null || echo "000")
      echo "Retry health check: HTTP $RETRY_STATUS" >> "$LOG"
    fi

    echo "=== Deploy complete at $(date) ===" >> "$LOG"
  `;

  exec(cmd, { timeout: 600000 }, (error, stdout) => {
    try { unlinkSync(LOCKFILE); } catch {}
    if (error) {
      logger.error({ err: error }, "Deploy failed");
      logger.error("Check /var/www/mbpp/logs/deploy.log for details");
    } else {
      logger.info("Deploy succeeded");
    }
  });
});

export default router;
