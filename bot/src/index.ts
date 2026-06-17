// ============================================
// MBPP WhatsApp Bot — Entry Point
// Baileys-based WhatsApp bot with full website access
// ============================================

import { makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion, makeCacheableSignalKeyStore } from "@whiskeysockets/baileys";
import { Boom } from "@hapi/boom";
import NodeCache from "node-cache";
import pino from "pino";
import { CONFIG } from "./config";

const logger = pino({ level: "info" });
const msgCache = new NodeCache({ stdTTL: 60 });

const API = CONFIG.apiUrl;

// ============================================
// API Helpers
// ============================================
async function apiGet(path: string): Promise<any> {
  try {
    const res = await fetch(`${API}${path}`);
    if (!res.ok) return null;
    return await res.json();
  } catch { return null; }
}

// ============================================
// Format Helpers
// ============================================
function formatPrice(price: number, period?: string): string {
  const nf = new Intl.NumberFormat("en-NG").format(price);
  return period ? `₦${nf}/${period}` : `₦${nf}`;
}

function formatListing(item: any, idx: number): string {
  const type = item.type === "sale" ? "For Sale" : "For Rent";
  const price = item.price ? formatPrice(item.price, item.type === "rent" ? "year" : "") : "Price on request";
  return `*${idx + 1}️⃣ ${item.title || "Property"}*
📍 ${item.location || "Kano"}
🏷️ ${type}
💰 ${price}
🛏️ ${item.bedrooms || "?"} bed | 🚿 ${item.bathrooms || "?"} bath
━━━━━━━━━━━━━━`;
}

function formatFullDetail(item: any): string {
  return `🏠 *${item.title || "Property"}*

💰 *Price:* ${item.price ? formatPrice(item.price, item.type === "rent" ? "year" : "") : "Contact agent"}
📍 *Location:* ${item.location || "N/A"}
🏷️ *Type:* ${item.type === "sale" ? "For Sale" : "For Rent"}
🛏️ *Bedrooms:* ${item.bedrooms || "N/A"}
🚿 *Bathrooms:* ${item.bathrooms || "N/A"}
🚗 *Parking:* ${item.parking ? "Yes" : "No"}
⚡ *Features:* ${item.features || "Contact for details"}

📝 *Description:*
${item.description || "No description available."}

👤 *Agent:* ${item.agent || "MBPP Team"}
${item.agentPhone ? `📞 *Call:* ${item.agentPhone}` : ""}

━━━━━━━━━━━━━━
Reply:
 📅 *view* — Schedule a viewing
 💬 *ask* — Send an inquiry
 📞 *call* — Get agent phone`;
}

// ============================================
// WhatsApp Bot Class
// ============================================
async function startBot() {
  const { version, isLatest } = await fetchLatestBaileysVersion();
  logger.info(`Baileys v${version.join(".")}, latest: ${isLatest}`);

  const { state, saveCreds } = await useMultiFileAuthState(CONFIG.sessionDir);

  const sock = makeWASocket({
    version,
    logger: pino({ level: "silent" }),
    printQRInTerminal: true,
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(state.keys, logger as any),
    },
    getMessage: async (key) => {
      const msg = msgCache.get(key.id || key.remoteJid + "_" + key.id);
      return msg as any;
    },
  });

  // ======== Connection Events ========

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", (update) => {
    const { connection, lastDisconnect, qr } = update;
    if (qr) {
      console.log("📱 Scan this QR code with WhatsApp to connect:");
    }
    if (connection === "connecting") {
      logger.info("🔄 Connecting to WhatsApp...");
    } else if (connection === "open") {
      logger.info("✅ WhatsApp bot connected!");
    } else if (connection === "close") {
      const code = (lastDisconnect?.error as Boom)?.output?.statusCode;
      const shouldReconnect = code !== DisconnectReason.loggedOut;
      logger.warn(`Connection closed. Code: ${code}. Reconnecting: ${shouldReconnect}`);
      if (shouldReconnect) {
        setTimeout(startBot, 5000);
      } else {
        logger.error("Logged out of WhatsApp. Please re-scan QR code.");
      }
    }
  });

  // ======== Message Handler ========

  sock.ev.on("messages.upsert", async (m) => {
    for (const msg of m.messages) {
      if (!msg.message || msg.key.fromMe) continue;
      if (m.type !== "notify") continue;

      // Cache message
      if (msg.message) {
        msgCache.set(msg.key.id || msg.key.remoteJid + "_" + msg.key.id, msg.message);
      }

      // Extract text
      const conversation = msg.message.conversation;
      const extendedText = msg.message.extendedTextMessage?.text;
      const imageText = msg.message.imageMessage?.caption;
      const text = (conversation || extendedText || imageText || "").trim();
      if (!text) continue;

      const jid = msg.key.remoteJid!;
      const senderName = msg.pushName || "Guest";

      logger.info(`📩 ${senderName}: ${text.substring(0, 80)}`);

      // Parse intent and respond
      await handleMessage(sock, jid, text, senderName);
    }
  });

  return sock;
}

// ============================================
// Message Router
// ============================================
async function handleMessage(sock: any, jid: string, text: string, name: string) {
  const t = text.toLowerCase().trim();

  // ---- Welcome / Help ----
  if (t === "help" || t === "menu" || t === "start" || t === "hi" || t === "hello") {
    await sock.sendMessage(jid, { text: CONFIG.welcomeMessage });
    return;
  }

  // ---- Viewing / Schedule ----
  if (t.includes("view") || t.includes("schedule")) {
    await sock.sendMessage(jid, {
      text: `📅 *Schedule a Viewing*

To schedule a property viewing, please provide:
1. The property ID or title
2. Your preferred date and time
3. Your name and phone number

Our team will confirm within 24 hours.

📞 Or call us: +234 707 422 2284`
    });
    return;
  }

  // ---- Agents / Team ----
  if (t === "agents" || t === "team" || t === "about") {
    try {
      const data = await apiGet("/api/settings");
      if (data?.settings?.team_members) {
        const members = typeof data.settings.team_members === "string"
          ? JSON.parse(data.settings.team_members)
          : data.settings.team_members;
        let teamMsg = "👥 *MBPP Team*\n\n";
        for (const m of members.slice(0, 4)) {
          teamMsg += `• *${m.name}* — ${m.role}\n`;
        }
        teamMsg += `\nFull team at: ${CONFIG.apiUrl.replace("localhost", "mbpproperties.com")}/about`;
        await sock.sendMessage(jid, { text: teamMsg });
        return;
      }
    } catch {}
    await sock.sendMessage(jid, { text: "Visit our website for the full team list." });
    return;
  }

  // ---- Sell / List Property ----
  if (t === "sell" || t.includes("list property") || t.includes("add listing")) {
    await sock.sendMessage(jid, {
      text: `🏠 *List Your Property*

To list a property on MBPP:

1️⃣ Visit: https://mbpproperties.com/list-property
2️⃣ Fill in property details
3️⃣ Upload photos
4️⃣ Submit for review

Or call our office: +234 707 422 2284

Properties are reviewed within 48 hours.`
    });
    return;
  }

  // ---- Contact / Office ----
  if (t === "contact" || t === "office" || t === "address") {
    await sock.sendMessage(jid, {
      text: `📞 *Contact MBPP*

🏢 NO. 2, Tudun Yola Gate 4, Gwale LGA, Kano State
📞 +234 707 422 2284
📧 support@mbpproperties.com
🌐 https://mbpproperties.com

⏰ Mon–Fri 8 AM – 6 PM | Sat 9 AM – 2 PM`
    });
    return;
  }

  // ---- Property Search (default) ----
  // Treat any other text as a property search
  const searchTerm = t.replace(/show me|find|search for|looking for|i need|i want/g, "").trim();
  const data = await apiGet(`/api/listings?search=${encodeURIComponent(searchTerm)}&limit=5`);

  if (!data || !data.listings || data.listings.length === 0) {
    await sock.sendMessage(jid, {
      text: `🔍 No properties found matching "${text}".\n\nTry a different search or visit:\nhttps://mbpproperties.com/search`
    });
    return;
  }

  const listings = data.listings;
  let response = `🏠 Found *${data.total || listings.length}* properties:\n\n`;

  for (let i = 0; i < Math.min(3, listings.length); i++) {
    response += formatListing(listings[i], i) + "\n";
  }

  response += `\n_Reply with a number (1-3) for details, or search again._`;

  // Store the listings for "reply with number" later
  // (simplified for now)
  await sock.sendMessage(jid, { text: response });
}

// ============================================
// Start Bot
// ============================================
startBot().catch((err) => {
  logger.error(err, "Bot crashed");
  process.exit(1);
});
