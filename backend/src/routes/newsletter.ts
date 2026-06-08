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

    const newsletterWelcomeHtml = `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#f1f5f9;color:#1e293b;padding:32px 16px">
<div style="max-width:560px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.06)">
<div style="background:linear-gradient(135deg,#0d6e4e 0%,#0a5a3e 100%);padding:40px 40px 32px;text-align:center">
<h1 style="color:#fff;font-size:24px;font-weight:700;margin:0 0 6px">MBPP</h1>
<p style="color:rgba(255,255,255,0.8);font-size:13px;margin:0">Mutual Benefit Premier Properties</p>
</div>
<div style="padding:36px 40px">
<h2 style="font-size:17px;font-weight:700;margin:0 0 12px;color:#0f172a">Welcome to Our Newsletter! 📰</h2>
<p style="font-size:15px;line-height:1.7;margin:0 0 14px;color:#334155">Thank you for subscribing to MBPP updates!</p>
<p style="font-size:15px;line-height:1.7;margin:0 0 14px;color:#334155">You'll receive:</p>
<div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:20px;margin:20px 0">
<p style="font-size:14px;color:#334155;margin:0 0 8px">🏠 <strong>New property listings</strong> in Kano</p>
<p style="font-size:14px;color:#334155;margin:0 0 8px">📉 <strong>Price drop alerts</strong> on properties you follow</p>
<p style="font-size:14px;color:#334155;margin:0 0 8px">📊 <strong>Market insights</strong> and trends</p>
<p style="font-size:14px;color:#334155;margin:0">🎯 <strong>Tips</strong> for buyers, renters, and landlords</p>
</div>
<p style="font-size:15px;line-height:1.7;margin:0 0 14px;color:#334155">We send updates every Friday. No spam, just properties and insights.</p>
<div style="margin:24px 0 8px"><a href="https://mbpproperties.com" style="display:inline-block;background:#0d6e4e;color:#fff;padding:14px 32px;border-radius:10px;text-decoration:none;font-size:14px;font-weight:600">Browse Properties</a></div>
</div>
<div style="background:#f8fafc;padding:28px 40px;text-align:center;border-top:1px solid #e2e8f0">
<p style="color:#94a3b8;font-size:12px;margin:0">MBPP — Kano, Nigeria</p>
<p style="color:#94a3b8;font-size:12px;margin:4px 0 0"><a href="https://mbpproperties.com" style="color:#0d6e4e;text-decoration:none;font-weight:600">mbpproperties.com</a></p>
<p style="color:#b0b8c4;font-size:11px;margin:12px 0 0">You received this because you subscribed to our newsletter.<br><a href="https://mbpproperties.com/unsubscribe" style="color:#94a3b8;text-decoration:underline">Unsubscribe</a></p>
</div>
</div></body></html>`;

    emailService.sendNewsletter(email, "Welcome to MBPP Newsletter!", newsletterWelcomeHtml).catch(() => {});

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
