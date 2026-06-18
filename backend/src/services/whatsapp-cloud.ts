// ============================================
// WhatsApp Cloud API Client
// Handles all communication with Meta's Cloud API
// ============================================

import { logger } from "../lib/logger";

const API_VERSION = "v19.0";
const BASE_URL = `https://graph.facebook.com/${API_VERSION}`;

interface CloudAPIConfig {
  phoneNumberId: string;
  accessToken: string;
  businessAccountId: string;
  appSecret: string;
}

function getConfig(): CloudAPIConfig {
  return {
    phoneNumberId: process.env.WHATSAPP_PHONE_ID || "",
    accessToken: process.env.WHATSAPP_ACCESS_TOKEN || "",
    businessAccountId: process.env.WHATSAPP_BUSINESS_ACCOUNT_ID || "",
    appSecret: process.env.WHATSAPP_APP_SECRET || "",
  };
}

// ============ Send Message (Core) ============

interface SendMessageResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

async function sendMessage(to: string, message: any): Promise<SendMessageResult> {
  const config = getConfig();
  if (!config.phoneNumberId || !config.accessToken) {
    logger.warn("WhatsApp Cloud API not configured");
    return { success: false, error: "API not configured" };
  }

  const url = `${BASE_URL}/${config.phoneNumberId}/messages`;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${config.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to,
        ...message,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      logger.error({ error: data }, "WhatsApp API send failed");
      return { success: false, error: data.error?.message || "Send failed" };
    }

    const messageId = data.messages?.[0]?.id;
    logger.info(`✅ WhatsApp message sent to ${to}: ${messageId}`);
    return { success: true, messageId };
  } catch (e: any) {
    logger.error({ err: e }, "WhatsApp API send error");
    return { success: false, error: e.message };
  }
}

// ============ Send Text Message ============

export async function sendText(to: string, text: string): Promise<SendMessageResult> {
  return sendMessage(to, { type: "text", text: { body: text } });
}

// ============ Send Button Message (max 3 buttons) ============

interface Button {
  id: string;
  title: string;
}

export async function sendButtons(to: string, body: string, buttons: Button[]): Promise<SendMessageResult> {
  // WhatsApp allows max 3 buttons
  const limited = buttons.slice(0, 3);

  return sendMessage(to, {
    type: "interactive",
    interactive: {
      type: "button",
      body: { text: body },
      action: {
        buttons: limited.map((b, i) => ({
          type: "reply",
          reply: {
            id: b.id,
            title: b.title,
          },
        })),
      },
    },
  });
}

// ============ Send List Message (scrollable menu) ============

interface ListSection {
  title: string;
  rows: {
    id: string;
    title: string;
    description?: string;
  }[];
}

export async function sendList(
  to: string,
  header: string,
  body: string,
  buttonText: string,
  sections: ListSection[]
): Promise<SendMessageResult> {
  return sendMessage(to, {
    type: "interactive",
    interactive: {
      type: "list",
      header: { type: "text", text: header },
      body: { text: body },
      action: {
        button: buttonText,
        sections,
      },
    },
  });
}

// ============ Send Image ============

export async function sendImage(to: string, imageUrl: string, caption?: string): Promise<SendMessageResult> {
  return sendMessage(to, {
    type: "image",
    image: {
      link: imageUrl,
      caption: caption || "",
    },
  });
}

// ============ Send Template Message ============

interface TemplateParam {
  type: string;
  text?: string;
  image?: { link: string };
}

export async function sendTemplate(
  to: string,
  templateName: string,
  language: string = "en",
  params?: TemplateParam[],
  components?: any[]
): Promise<SendMessageResult> {
  const message: any = {
    type: "template",
    template: {
      name: templateName,
      language: { code: language },
    },
  };

  if (params && params.length > 0) {
    message.template.components = [
      {
        type: "body",
        parameters: params,
      },
    ];
  }

  if (components) {
    message.template.components = [...(message.template.components || []), ...components];
  }

  return sendMessage(to, message);
}

// ============ Verify Webhook Signature ============

export function verifyWebhookSignature(payload: string, signature: string): boolean {
  const config = getAppConfig();
  const crypto = require("crypto");
  const hmac = crypto.createHmac("sha256", config.appSecret);
  hmac.update(payload);
  const hash = hmac.digest("hex");
  return hash === signature;
}

function getAppConfig(): CloudAPIConfig {
  return getConfig();
}

// ============ Read Environment Variables ============

export function isConfigured(): boolean {
  const config = getConfig();
  return !!(config.phoneNumberId && config.accessToken && config.businessAccountId);
}

export { getConfig };
