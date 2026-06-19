import { Router, Request, Response } from "express";
import { exec } from "child_process";
import { createHmac, timingSafeEqual } from "crypto";
import { logger } from "../lib/logger";

const router = Router();

const DEPLOY_SECRET = process.env.DEPLOY_WEBHOOK_SECRET || "mbpp-deploy-secret-change-me";

function verifyGitHubSignature(payload: string, signatureHeader: string | undefined): boolean {
  if (!signatureHeader || !DEPLOY_SECRET) return false;
  const sig = signatureHeader.startsWith("sha256=") ? signatureHeader.slice(7) : signatureHeader;
  const expected = createHmac("sha256", DEPLOY_SECRET).update(payload).digest("hex");
  try {
    return timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
  } catch { return false; }
}

router.post("/", async (req: Request, res: Response) => {
  // Accept either x-deploy-token header (manual) or GitHub webhook signature
  const token = req.headers["x-deploy-token"] as string;
  const rawBody = (req as any).rawBody || JSON.stringify(req.body);
  const ghSignature = req.headers["x-hub-signature-256"] as string;
  const authorized = token === DEPLOY_SECRET || verifyGitHubSignature(rawBody, ghSignature);
  if (!authorized) {
    return res.status(403).json({ error: "Unauthorized" });
  }

  logger.info("Deploy triggered via webhook");

  // Respond immediately, then deploy asynchronously
  res.json({ status: "ok", message: "Deploy started" });

  // Run deploy in background
  const cmd = `
    cd /var/www/mbpp
    echo "=== $(date) ===" >> /var/www/mbpp/logs/deploy.log
    git fetch origin master 2>&1
    git reset --hard origin/master 2>&1
    echo "--- PostgreSQL Security Fix ---" >> /var/www/mbpp/logs/deploy.log
    sed -i 's/\bmd5\b/scram-sha-256/g' /etc/postgresql/16/main/pg_hba.conf 2>&1
    su - postgres -c "psql -c \"ALTER USER mbpp_user WITH PASSWORD 'Mbpp2026!Secure';\" " 2>&1
    systemctl reload postgresql 2>&1
    echo "--- Building API ---" >> /var/www/mbpp/logs/deploy.log
    cd /var/www/mbpp/api
    npm ci 2>/dev/null
    npx prisma generate 2>&1
    npm run build 2>&1
    npx prisma migrate deploy 2>&1
    echo "--- Migrating Existing Data ---" >> /var/www/mbpp/logs/deploy.log
    npx tsx scripts/migrate-agents.ts 2>&1
    echo "--- Building Frontend ---" >> /var/www/mbpp/logs/deploy.log
    cd /var/www/mbpp/frontend
    npm ci 2>/dev/null
    npm run build 2>&1
    echo "--- Restarting Services ---" >> /var/www/mbpp/logs/deploy.log
    pm2 restart mbpp-api 2>&1
    pm2 restart mbpp-frontend 2>&1
    pm2 save 2>&1
    echo "Deploy complete" >> /var/www/mbpp/logs/deploy.log
  `;

  exec(cmd, { timeout: 300000 }, (error, stdout) => {
    if (error) {
      logger.error({ err: error }, "Deploy failed");
    } else {
      logger.info("Deploy succeeded");
    }
  });
});

export default router;
