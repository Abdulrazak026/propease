import { Router, Response } from "express";
import prisma from "../lib/prisma";
import { authenticate, AuthRequest } from "../middleware/auth";
import { authorize } from "../middleware/rbac";
import { logger } from "../lib/logger";
import { emailService } from "../services/email";

const router = Router();

router.post("/subscribe", async (req, res: Response) => {
  try {
    const { email, source } = req.body;
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: "Please enter a valid email" });
    }
    const existing = await prisma.newsletterSubscriber.findUnique({ where: { email } });
    if (existing) {
      if (!existing.isActive) {
        await prisma.newsletterSubscriber.update({
          where: { email },
          data: { isActive: true, source: source || existing.source },
        });
      }
      return res.json({ ok: true, message: "You're already subscribed — thank you!" });
    }
    await prisma.newsletterSubscriber.create({
      data: { email, source: source || "footer" },
    });
    res.json({ ok: true, message: "Thanks! We'll send you new properties." });
  } catch (error) {
    logger.error({ err: error }, "Subscribe error:");
    res.status(500).json({ error: "Failed to subscribe" });
  }
});

router.get("/subscribers", authenticate, authorize("head"), async (req, res: Response) => {
  try {
    const subs = await prisma.newsletterSubscriber.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json({ subscribers: subs, total: subs.length });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch subscribers" });
  }
});

router.delete("/subscribers/:id", authenticate, authorize("head"), async (req, res: Response) => {
  try {
    await prisma.newsletterSubscriber.delete({ where: { id: req.params.id as string } });
    res.json({ message: "Deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete" });
  }
});

router.post("/send", authenticate, authorize("head"), async (req: AuthRequest, res: Response) => {
  try {
    const { subject, body } = req.body;
    if (!subject || !body) {
      return res.status(400).json({ error: "Subject and body are required" });
    }

    const subscribers = await prisma.newsletterSubscriber.findMany({
      where: { isActive: true },
    });

    if (subscribers.length === 0) {
      return res.status(400).json({ error: "No active subscribers" });
    }

    const { templates } = await import("../services/email-templates");
    const newsletterHtml = (templates as any).newsletter
      ? (templates as any).newsletter(body)
      : body;

    let sent = 0;
    for (const sub of subscribers) {
      try {
        await emailService.sendNewsletter(sub.email, subject, newsletterHtml);
        sent++;
      } catch {}
    }

    logger.info(`Newsletter sent to ${sent}/${subscribers.length} subscribers`);
    res.json({ success: true, sent, total: subscribers.length });
  } catch (error) {
    logger.error({ err: error }, "Send newsletter error:");
    res.status(500).json({ error: "Failed to send newsletter" });
  }
});

export default router;
