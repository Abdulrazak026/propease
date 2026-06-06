import { Router, Response } from "express";
import prisma from "../lib/prisma";
import { authenticate, AuthRequest } from "../middleware/auth";
import { authorize } from "../middleware/rbac";

const router = Router();

router.get("/", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const notifications = await prisma.notification.findMany({
      where: { userId: req.user!.id as string },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    const unread = notifications.filter((n) => !n.read).length;
    res.json({ notifications, unread });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
});

router.patch("/:id/read", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const uid = req.user?.id || "";
    await prisma.notification.updateMany({
      where: { id: String(req.params.id), userId: uid },
      data: { read: true },
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to mark as read" });
  }
});

router.patch("/read-all", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    await prisma.notification.updateMany({
      where: { userId: req.user!.id as string, read: false },
      data: { read: true },
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to mark all as read" });
  }
});

router.post("/", authenticate, authorize("head", "admin"), async (req: AuthRequest, res: Response) => {
  try {
    const { type, title, body, link, userId } = req.body;
    const targetUserId = (req.user!.role === "head" || req.user!.role === "admin") ? (userId || req.user!.id) : req.user!.id;
    const notif = await prisma.notification.create({
      data: { type, title, body, link, userId: targetUserId },
    });
    res.status(201).json({ notification: notif });
  } catch (error) {
    res.status(500).json({ error: "Failed to create notification" });
  }
});

export default router;
