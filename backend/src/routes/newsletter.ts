import { Router, Response } from "express";
import prisma from "../lib/prisma";
import { authenticate, AuthRequest } from "../middleware/auth";
import { authorize } from "../middleware/rbac";
import { logger } from "../lib/logger";

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

export default router;
