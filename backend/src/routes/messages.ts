import { Router, Response } from "express";
import prisma from "../lib/prisma";
import { authenticate, AuthRequest } from "../middleware/auth";
import { emailService } from "../services/email";
import { logger } from "../lib/logger";

const router = Router();

router.get("/conversations", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id as string;
    if (!userId) return res.status(401).json({ error: "User ID required" });
    const conversations = await prisma.conversation.findMany({
      where: { participants: { some: { userId } } },
      orderBy: { updatedAt: "desc" },
      include: {
        participants: { include: { user: { select: { id: true, name: true, email: true } } } },
        messages: { orderBy: { createdAt: "desc" }, take: 1 },
        listing: { select: { id: true, title: true } },
      },
    });
    const result = conversations.map(c => ({
      ...c,
      lastMessage: c.messages[0]?.content || null,
      lastMessageAt: c.messages[0]?.createdAt?.toISOString() || null,
      unread: c.messages.filter(m => !m.read && m.senderId !== userId).length,
    }));
    res.json({ conversations: result });
  } catch (error) { logger.error({ err: error }, "Failed to fetch conversations"); res.status(500).json({ error: "Failed to fetch conversations" }); }
});

router.get("/conversations/:id/messages", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const uid = req.user!.id as string;
    const convId = req.params.id as string;
    const messages = await prisma.message.findMany({
      where: { conversationId: convId },
      orderBy: { createdAt: "asc" },
      include: { sender: { select: { id: true, name: true, email: true } } },
    });
    await prisma.message.updateMany({
      where: { conversationId: convId, senderId: { not: uid }, read: false },
      data: { read: true },
    });
    res.json({ messages });
  } catch (error) { logger.error({ err: error }, "Failed to fetch messages"); res.status(500).json({ error: "Failed to fetch messages" }); }
});

router.post("/conversations/:id/messages", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const senderId = req.user!.id as string;
    const convId = req.params.id as string;
    if (!senderId) return res.status(401).json({ error: "User ID required" });
    const { content } = req.body;
    const message = await prisma.message.create({
      data: { content, conversationId: convId, senderId },
      include: { sender: { select: { id: true, name: true, email: true } } },
    });
    await prisma.conversation.update({
      where: { id: convId },
      data: { updatedAt: new Date() },
    });
    res.status(201).json({ message });

    // Notify recipient about new message
    const conversation = await prisma.conversation.findUnique({
      where: { id: convId },
      include: { participants: { include: { user: { select: { id: true, name: true, email: true } } } } },
    });
    if (conversation) {
      const recipient = conversation.participants.find(p => p.userId !== senderId);
      if (recipient) {
        emailService.newMessage(recipient.user.email, recipient.user.name, message.sender?.name || "Someone").catch(() => {});
      }
    }
  } catch (error) { logger.error({ err: error }, "Failed to send message"); res.status(500).json({ error: "Failed to send message" }); }
});

router.post("/conversations", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const senderId = req.user!.id;
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
        include: { sender: { select: { id: true, name: true, email: true } } },
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
        participants: { include: { user: { select: { id: true, name: true, email: true } } } },
        listing: { select: { id: true, title: true } },
      },
    });

    if (listingId) {
      try {
        const listing = await prisma.listing.findUnique({
          where: { id: listingId },
          select: { assignedAgentId: true, title: true },
        });
        if (listing) {
          const sender = await prisma.user.findUnique({
            where: { id: senderId },
            select: { name: true, email: true },
          });
          const inquiry = await prisma.inquiry.create({
            data: {
              clientName: sender?.name || "Unknown",
              clientContact: sender?.email || "",
              message: content,
              listingId,
              assignedAgentId: listing.assignedAgentId || recipientId,
            },
          });
          const agentId = listing.assignedAgentId || recipientId;
          if (agentId) {
            const agent = await prisma.user.findUnique({
              where: { id: agentId },
              select: { name: true, email: true },
            });
            if (agent) {
              emailService.inquiryNotification(agent.email, agent.name, sender?.name || "A user", listing.title, content).catch(() => {});
            }
          }

          // Notify all head users about the new inquiry
          try {
            const heads = await prisma.user.findMany({
              where: { role: "head", suspendedAt: null },
              select: { id: true, email: true, name: true },
            });
            const supportEmail = process.env.SUPPORT_EMAIL || "support@mbpproperties.com";
            for (const head of heads) {
              await prisma.notification.create({
                data: {
                  userId: head.id,
                  type: "message_received",
                  title: `New inquiry from ${sender?.name || "a client"}`,
                  body: content.slice(0, 120),
                  link: "/admin/crm",
                },
              }).catch(() => {});
              emailService.inquiryNotification(
                head.email, head.name,
                sender?.name || "A user",
                listing?.title || "a property",
                content,
              ).catch(() => {});
            }
            // Also notify the general support email
            if (supportEmail && !heads.find(h => h.email === supportEmail)) {
              emailService.inquiryNotification(
                supportEmail, "Support",
                sender?.name || "A user",
                listing?.title || "a property",
                content,
              ).catch(() => {});
            }
          } catch (e) { logger.error({ err: e }, "Failed to notify admins about inquiry"); }
        }
      } catch (e) { logger.error({ err: e }, "Failed to create inquiry from message"); }
    }

    res.status(201).json({ conversation });
  } catch (error) { logger.error({ err: error }, "Failed to create conversation"); res.status(500).json({ error: "Failed to create conversation" }); }
});

export default router;
