import { Router, Response, json } from "express";
import prisma from "../lib/prisma";
import { authenticate, AuthRequest } from "../middleware/auth";
import * as fs from "fs";

const router = Router();
router.use(json()); // Explicit JSON parser for this router

// Save incoming/outgoing message (called by bot)
router.post("/message", async (req: any, res: Response) => {
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

// QR code viewer
router.get("/qr", async (_req, res: Response) => {
  try {
    if (!fs.existsSync("/tmp/whatsapp-qr.txt")) {
      return res.send(`<html><body style="font-family:sans-serif;text-align:center;padding:40px"><h2>No QR code available</h2><p>The bot may already be connected, or hasn't generated a QR yet.</p></body></html>`);
    }
    const qrData = fs.readFileSync("/tmp/whatsapp-qr.txt", "utf-8");
    const QRCode = require("qrcode");
    const svg = await QRCode.toString(qrData, { type: "svg", margin: 2, width: 300 });
    const html = `<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><title>WhatsApp QR</title><meta http-equiv="refresh" content="25"><style>body{font-family:-apple-system,BlinkMacSystemFont,sans-serif;text-align:center;padding:24px;background:#f5f5f5}h2{color:#1a1a1a;margin:0 0 8px}.qr-box{display:inline-block;background:#fff;padding:16px;border-radius:16px;box-shadow:0 2px 16px rgba(0,0,0,.08)}.qr-box svg{display:block;max-width:280px;height:auto}.note{color:#555;font-size:14px;margin-top:12px}.small{color:#999;font-size:12px;margin-top:8px}.timer{color:#e53e3e;font-weight:600}</style></head><body><h2>Scan to Connect WhatsApp</h2><div class="qr-box">${svg}</div><p class="note">WhatsApp → Settings → Linked Devices → Scan QR</p><p class="small timer">QR refreshes in 25 seconds — be ready to scan</p></body></html>`;
    res.send(html);
  } catch (e) {
    res.status(500).send("Error generating QR");
  }
});

// QR data endpoint (returns SVG for embedding in dashboard)
router.get("/qr-svg", async (_req, res: Response) => {
  try {
    if (!fs.existsSync("/tmp/whatsapp-qr.txt")) {
      return res.status(404).json({ error: "No QR available", connected: true });
    }
    const qrData = fs.readFileSync("/tmp/whatsapp-qr.txt", "utf-8");
    const QRCode = require("qrcode");
    const svg = await QRCode.toString(qrData, { type: "svg", margin: 1, width: 260 });
    res.type("image/svg+xml").send(svg);
  } catch (e) {
    res.status(500).json({ error: "Error generating QR" });
  }
});

// Reconnect bot — restarts WhatsApp connection
router.post("/reconnect", authenticate, async (_req: AuthRequest, res: Response) => {
  try {
    const { exec } = require("child_process");
    // Kill existing bot session files and restart
    exec("rm -rf /var/www/mbpp/bot/sessions/* && rm -f /tmp/whatsapp-connected && rm -f /tmp/whatsapp-qr.txt && pm2 restart mbpp-bot", (err: any) => {
      if (err) logger.error({ err }, "Reconnect failed");
    });
    res.json({ success: true, message: "Bot reconnecting... QR will appear in 10-15 seconds." });
  } catch (e) {
    res.status(500).json({ error: "Failed to reconnect" });
  }
});

export default router;
