// ============================================
// WhatsApp Cloud API Webhook Endpoint
// Receives messages from Meta's servers
// ============================================

import { Router, Request, Response } from "express";
import { handleWhatsAppMessage, getStep } from "../services/whatsapp-bot";
import { isConfigured, verifyWebhookSignature } from "../services/whatsapp-cloud";
import { logger } from "../lib/logger";
import prisma from "../lib/prisma";

const router = Router();

// ============ Webhook Verification (GET) ============
// Meta calls this URL to verify your webhook during setup
router.get("/", (req: Request, res: Response) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || "mbpp-webhook-verify-2026";

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    logger.info("WhatsApp webhook verified successfully");
    res.status(200).send(challenge);
  } else {
    logger.warn("WhatsApp webhook verification failed");
    res.status(403).json({ error: "Forbidden" });
  }
});

// ============ Webhook Messages (POST) ============
// Meta sends messages here when users message the bot
router.post("/", async (req: Request, res: Response) => {
  const signature = req.headers["x-hub-signature-256"] as string;
  const rawBody = req.body;

  // If Cloud API is configured, verify signature
  if (isConfigured() && signature) {
    const rawBodyStr = typeof rawBody === "string" ? rawBody : JSON.stringify(rawBody);
    if (!verifyWebhookSignature(rawBodyStr, signature)) {
      logger.warn("WhatsApp webhook signature mismatch");
      return res.status(401).json({ error: "Invalid signature" });
    }
  }

  // Respond immediately (Meta expects 200 within 5 seconds)
  res.status(200).json({ status: "ok" });

  // Process messages asynchronously
  try {
    const entry = rawBody?.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;

    if (!value) return;

    const contact = value.contacts?.[0];
    const message = value.messages?.[0];

    if (!contact || !message) return;

    const phone = contact.wa_id;
    const name = contact.profile?.name || "Guest";
    const msgType = message.type;

    // Extract message text
    let text = "";

    switch (msgType) {
      case "text":
        text = message.text?.body || "";
        break;
      case "button":
        text = message.button?.payload || message.button?.text || "";
        break;
      case "interactive":
        if (message.interactive?.type === "button_reply") {
          text = message.interactive.button_reply?.id || "";
        } else if (message.interactive?.type === "list_reply") {
          text = message.interactive.list_reply?.id || "";
        }
        break;
      case "image":
        text = message.image?.caption || "[Image]";
        break;
      default:
        logger.info(`Unsupported message type from ${phone}: ${msgType}`);
        return;
    }

    if (!text) return;

    logger.info(`📱 [WhatsApp] ${name}: ${text.substring(0, 80)}`);

    // Save to DB
    try {
      await prisma.$executeRaw`
        INSERT INTO "WhatsAppConversation" (id, phone, name, step, status, "createdAt", "lastMessageAt")
        VALUES (gen_random_uuid(), ${phone}, ${name}, 'menu', 'active', NOW(), NOW())
        ON CONFLICT (phone) DO UPDATE SET
          name = COALESCE(NULLIF(${name}, 'Guest'), "WhatsAppConversation"."name"),
          "lastMessageAt" = NOW()
      `;
    } catch (e: any) {
      // Ignore duplicate errors
      if (!e.message?.includes("duplicate key") && !e.message?.includes("UNIQUE constraint")) {
        logger.error({ err: e }, "Failed to save conversation");
      }
    }

    // Save message
    try {
      const conv = await prisma.$queryRaw`
        SELECT id FROM "WhatsAppConversation" WHERE phone = ${phone} LIMIT 1
      ` as any[];

      if (conv && conv.length > 0) {
        await prisma.$executeRaw`
          INSERT INTO "WhatsAppMessage" (id, "conversationId", phone, message, direction, "fromBot", "createdAt")
          VALUES (gen_random_uuid(), ${conv[0].id}, ${phone}, ${text}, 'incoming', false, NOW())
        `;
      }
    } catch (e: any) {
      logger.error({ err: e }, "Failed to save message");
    }

    // Handle the conversation
    await handleWhatsAppMessage(phone, name, text);

  } catch (e: any) {
    logger.error({ err: e }, "Failed to process webhook");
  }
});

// ============ Send Message Endpoint (called by admin dashboard) ============
router.post("/send", async (req: Request, res: Response) => {
  try {
    const { phone, message } = req.body;
    if (!phone || !message) {
      return res.status(400).json({ error: "Phone and message required" });
    }

    // Import here to avoid circular dependency
    const { sendText } = await import("../services/whatsapp-cloud");
    const result = await sendText(phone, message);

    if (result.success) {
      res.json({ success: true, messageId: result.messageId });
    } else {
      res.status(500).json({ error: result.error });
    }
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
