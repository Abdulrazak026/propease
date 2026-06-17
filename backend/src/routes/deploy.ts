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
    cd /var/www/mbpp/frontend
    git fetch origin master 2>&1
    git reset --hard origin/master 2>&1
    npm run build 2>&1
    pm2 restart mbpp-frontend 2>&1
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
