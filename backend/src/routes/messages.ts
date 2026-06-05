import { Router, Response } from "express";
import prisma from "../lib/prisma";

const router = Router();

router.get("/conversations", async (req, res: Response) => {
  try {
    const userId = req.headers["x-user-id"] as string;
    if (!userId) return res.status(401).json({ error: "User ID required" });
    const conversations = await prisma.conversation.findMany({
      where: { participants: { some: { userId } } },
      orderBy: { updatedAt: "desc" },
      include: {
        participants: { include: { user: { select: { id: true, name: true, avatar: true } } } },
        messages: { orderBy: { createdAt: "desc" }, take: 1 },
        listing: { select: { id: true, title: true } },
      },
    });
    res.json(conversations);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch conversations" });
  }
});

router.get("/conversations/:id/messages", async (req, res: Response) => {
  try {
    const messages = await prisma.message.findMany({
      where: { conversationId: req.params.id },
      orderBy: { createdAt: "asc" },
      include: { sender: { select: { id: true, name: true, avatar: true } } },
    });
    await prisma.message.updateMany({
      where: { conversationId: req.params.id, senderId: { not: req.headers["x-user-id"] as string }, read: false },
      data: { read: true },
    });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

router.post("/conversations/:id/messages", async (req, res: Response) => {
  try {
    const senderId = req.headers["x-user-id"] as string;
    if (!senderId) return res.status(401).json({ error: "User ID required" });
    const { content } = req.body;
    const message = await prisma.message.create({
      data: { content, conversationId: req.params.id, senderId },
      include: { sender: { select: { id: true, name: true, avatar: true } } },
    });
    await prisma.conversation.update({
      where: { id: req.params.id },
      data: { updatedAt: new Date() },
    });
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ error: "Failed to send message" });
  }
});

router.post("/conversations", async (req, res: Response) => {
  try {
    const senderId = req.headers["x-user-id"] as string;
    if (!senderId) return res.status(401).json({ error: "User ID required" });
    const { recipientId, listingId, subject, content } = req.body;
    const existing = await prisma.conversation.findFirst({
      where: {
        listingId: listingId || undefined,
        participants: { every: { userId: { in: [senderId, recipientId] } } },
      },
    });
    if (existing) {
      const message = await prisma.message.create({
        data: { content, conversationId: existing.id, senderId },
        include: { sender: { select: { id: true, name: true, avatar: true } } },
      });
      await prisma.conversation.update({ where: { id: existing.id }, data: { updatedAt: new Date() } });
      return res.status(201).json({ conversation: existing, message });
    }
    const conversation = await prisma.conversation.create({
      data: {
        subject: subject || null,
        listingId: listingId || null,
        participants: {
          create: [
            { userId: senderId },
            { userId: recipientId },
          ],
        },
        messages: {
          create: { content, senderId },
        },
      },
      include: {
        participants: { include: { user: { select: { id: true, name: true, avatar: true } } } },
        listing: { select: { id: true, title: true } },
      },
    });
    res.status(201).json({ conversation });
  } catch (error) {
    res.status(500).json({ error: "Failed to create conversation" });
  }
});

export default router;
