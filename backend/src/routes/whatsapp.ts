import { Router, Response } from "express";
import prisma from "../lib/prisma";
import { authenticate, AuthRequest } from "../middleware/auth";
import * as fs from "fs";

const router = Router();

// Save incoming/outgoing message (called by bot)
router.post("/message", async (req: { body: { phone: string; name?: string; message: string; direction: string; fromBot?: boolean; senderName?: string } }, res: Response) => {
  try {
    const { phone, name, message, direction, fromBot, senderName } = req.body;
    if (!phone || !message) return res.status(400).json({ error: "Phone and message required" });

    // Find or create conversation
    let conv = await prisma.whatsAppConversation.findUnique({ where: { phone } });
    if (!conv) {
      conv = await prisma.whatsAppConversation.create({
        data: { phone, name: name || senderName || phone, step: "menu", status: "active" },
      });
    }

    // Save message
    await prisma.whatsAppMessage.create({
      data: {
        conversationId: conv.id,
        phone,
        message: message.substring(0, 2000),
        direction: direction || "incoming",
        fromBot: fromBot || false,
      },
    });

    // Update last message timestamp
    if (name) {
      await prisma.whatsAppConversation.update({
        where: { id: conv.id },
        data: { name: name || conv.name, lastMessageAt: new Date() },
      });
    } else {
      await prisma.whatsAppConversation.update({
        where: { id: conv.id },
        data: { lastMessageAt: new Date() },
      });
    }

    res.json({ success: true, conversationId: conv.id });
  } catch (e) {
    res.status(500).json({ error: "Failed to save message" });
  }
});

// Get all conversations (admin dashboard)
router.get("/conversations", authenticate, async (_req: AuthRequest, res: Response) => {
  try {
    const conversations = await prisma.whatsAppConversation.findMany({
      orderBy: { lastMessageAt: "desc" },
      take: 50,
      include: {
        messages: { orderBy: { timestamp: "desc" }, take: 1 },
      },
    });
    res.json({ conversations });
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch conversations" });
  }
});

// Get conversation by phone (no auth needed for bot)
router.get("/conversations/:phone", async (req, res: Response) => {
  try {
    const conv = await prisma.whatsAppConversation.findUnique({
      where: { phone: req.params.phone },
      include: { messages: { orderBy: { timestamp: "asc" }, take: 100 } },
    });
    if (!conv) return res.status(404).json({ error: "Not found" });
    res.json({ conversation: conv });
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch" });
  }
});

// Send manual message from admin
router.post("/send", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { phone, message } = req.body;
    if (!phone || !message) return res.status(400).json({ error: "Phone and message required" });

    let conv = await prisma.whatsAppConversation.findUnique({ where: { phone } });
    if (!conv) {
      conv = await prisma.whatsAppConversation.create({
        data: { phone, name: phone, step: "menu", status: "active" },
      });
    }

    await prisma.whatsAppMessage.create({
      data: { conversationId: conv.id, phone, message, direction: "outgoing", fromBot: false },
    });

    await prisma.whatsAppConversation.update({
      where: { id: conv.id },
      data: { status: "active", step: "menu", lastMessageAt: new Date() },
    });

    // Signal bot to send message via file queue
    try {
      const dir = "/tmp/whatsapp-queue";
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(`${dir}/${Date.now()}_${phone.replace(/[^0-9]/g, "")}.json`, JSON.stringify({ phone, message }));
    } catch {}

    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: "Failed to send" });
  }
});

// Update conversation status/step (called by bot and admin)
router.patch("/conversations/:phone/status", async (req, res: Response) => {
  try {
    const { status, step } = req.body;
    const data: any = {};
    if (status) data.status = status;
    if (step) data.step = step;
    if (Object.keys(data).length === 0) return res.status(400).json({ error: "No fields to update" });

    await prisma.whatsAppConversation.update({
      where: { phone: req.params.phone },
      data: { ...data, lastMessageAt: new Date() },
    });
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: "Failed to update" });
  }
});

// Update conversation data (called by bot)
router.patch("/conversations/:phone/data", async (req, res: Response) => {
  try {
    const { key, value } = req.body;
    const conv = await prisma.whatsAppConversation.findUnique({ where: { phone: req.params.phone } });
    if (!conv) return res.status(404).json({ error: "Not found" });

    const currentData = (conv.data as Record<string, any>) || {};
    currentData[key] = value;

    await prisma.whatsAppConversation.update({
      where: { phone: req.params.phone },
      data: { data: currentData, lastMessageAt: new Date() },
    });
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: "Failed to update data" });
  }
});

// Get bot connection status (for dashboard)
router.get("/status", async (_req, res: Response) => {
  try {
    const connected = fs.existsSync("/tmp/whatsapp-connected");
    const sessionsExist = fs.existsSync("/var/www/mbpp/bot/sessions");
    res.json({
      botRunning: true,
      connected,
      sessionsExist,
      needsQR: !connected,
    });
  } catch {
    res.json({ botRunning: false, connected: false, needsQR: true });
  }
});

export default router;
