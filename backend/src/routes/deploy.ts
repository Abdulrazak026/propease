import { Router, Request, Response } from "express";
import { exec } from "child_process";
import { logger } from "../lib/logger";

const router = Router();

const DEPLOY_SECRET = process.env.DEPLOY_WEBHOOK_SECRET || "mbpp-deploy-secret-change-me";

router.post("/", async (_req: Request, res: Response) => {
  const token = _req.headers["x-deploy-token"] as string;
  if (!token || token !== DEPLOY_SECRET) {
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
