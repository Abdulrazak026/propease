// ============================================
// MBPP WhatsApp AI Agent — Smart Bot
// Conversation flows: Buy, Rent, Sell, Agent, Support
// ============================================

import { makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion, makeCacheableSignalKeyStore } from "@whiskeysockets/baileys";
import { Boom } from "@hapi/boom";
import NodeCache from "node-cache";
import pino from "pino";
import * as fs from "fs";
import * as path from "path";
import { CONFIG } from "./config";

const logger = pino({ level: "info" });
const msgCache = new NodeCache({ stdTTL: 60 });
const API = CONFIG.apiUrl;

// ============ API Helpers ============
async function apiGet(p: string): Promise<any> {
  try { const r = await fetch(`${API}${p}`); if (!r.ok) return null; return await r.json(); } catch { return null; }
}

async function apiPost(p: string, body: any): Promise<any> {
  try {
    const r = await fetch(`${API}${p}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    return { status: r.status, data: await r.json() };
  } catch { return null; }
}

// ============ Format Helpers ============
function formatPrice(price: number, period?: string): string {
  return period ? `₦${new Intl.NumberFormat("en-NG").format(price)}/${period}` : `₦${new Intl.NumberFormat("en-NG").format(price)}`;
}

function formatListing(item: any, idx: number): string {
  return `*${idx + 1}️⃣ ${item.title || "Property"}*
📍 ${item.city || "Kano"}
💰 ${item.price ? formatPrice(item.price, item.listingType === "rent" ? "year" : "") : "Contact"}
🛏️ ${item.bedrooms || "?"} bed | 🚿 ${item.bathrooms || "?"} bath`;
}

const WELCOME = `🏠 *MBPP Properties*

Welcome! What are you looking for?

*1️⃣* Buy a property
*2️⃣* Rent a property  
*3️⃣* Sell your property
*4️⃣* Become an agent
*5️⃣* Talk to support

_Just reply with a number._`;

async function startBot() {
  const { version } = await fetchLatestBaileysVersion();
  logger.info(`Baileys v${version.join(".")}`);

  const { state, saveCreds } = await useMultiFileAuthState(CONFIG.sessionDir);

  const sock = makeWASocket({
    version,
    logger: pino({ level: "silent" }),
    printQRInTerminal: true,
    auth: { creds: state.creds, keys: makeCacheableSignalKeyStore(state.keys, logger as any) },
    getMessage: async (key: any) => msgCache.get(key.id || key.remoteJid + "_" + key.id) as any,
  });

  // === Connection Events ===
  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", (update: any) => {
    const { connection, lastDisconnect, qr } = update;
    if (qr) { console.log("📱 Scan QR code to connect WhatsApp"); }
    if (connection === "open") {
      logger.info("✅ WhatsApp bot connected!");
      try { fs.writeFileSync("/tmp/whatsapp-connected", "1"); } catch {}
    }
    if (connection === "close") {
      const code = (lastDisconnect?.error as Boom)?.output?.statusCode;
      if (code !== DisconnectReason.loggedOut) setTimeout(startBot, 5000);
      else logger.error("Logged out. Re-scan QR.");
    }
  });

  // === Message Handler ===
  sock.ev.on("messages.upsert", async (m) => {
    for (const msg of m.messages) {
      if (!msg.message || msg.key.fromMe || m.type !== "notify") continue;
      if (msg.message) msgCache.set(msg.key.id || msg.key.remoteJid + "_" + msg.key.id, msg.message);

      const text = (msg.message.conversation || msg.message.extendedTextMessage?.text || msg.message.imageMessage?.caption || "").trim();
      if (!text) continue;

      const jid = msg.key.remoteJid!;
      const sender = msg.pushName || "Guest";
      const phone = jid.split("@")[0];

      logger.info(`📩 ${sender}: ${text.substring(0, 80)}`);

      // Save incoming message to DB
      await saveMessage(phone, sender, text, "incoming");

      // Handle conversation flow
      await handleConversation(sock, jid, text, phone, sender);
    }
  });

  // === Process admin-sent messages from file queue ===
  setInterval(() => processQueue(sock), 3000);

  return sock;
}

// ============ DB Helpers ============
async function getSession(phone: string) {
  try { const r = await fetch(`${API}/api/whatsapp/conversations/${phone}`); if (r.ok) return ((await r.json()) as any).conversation; } catch {}
  return null;
}

async function createSession(phone: string, name: string) {
  await apiPost("/api/whatsapp/send", { phone, name, message: "__create_session__" });
}

async function saveMessage(phone: string, name: string, message: string, direction: string) {
  try {
    const r = await fetch(`${API}/api/whatsapp/conversations/${phone}`);
    if (!r.ok) { await createSession(phone, name); }

    // Save via POST send — we use the body to store conversation info
    await fetch(`${API}/api/whatsapp/message`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, name, message, direction, fromBot: false }),
    }).catch(() => {});
  } catch {}
}

// ============ Queue Processor ============
async function processQueue(sock: any) {
  const dir = "/tmp/whatsapp-queue";
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir).filter(f => f.endsWith(".json"));
  for (const file of files) {
    try {
      const data = JSON.parse(fs.readFileSync(`${dir}/${file}`, "utf-8"));
      const jid = `${data.phone}@s.whatsapp.net`;
      await sock.sendMessage(jid, { text: data.message });
      // Save outgoing
      await fetch(`${API}/api/whatsapp/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: data.phone, message: data.message, direction: "outgoing", fromBot: true, senderName: "Admin" }),
      }).catch(() => {});
      fs.unlinkSync(`${dir}/${file}`);
    } catch (e) { try { fs.unlinkSync(`${dir}/${file}`); } catch {} }
  }
}

// ============ Conversation Router ============
async function handleConversation(sock: any, jid: string, text: string, phone: string, name: string) {
  const t = text.trim();
  const num = t === "1" ? 1 : t === "2" ? 2 : t === "3" ? 3 : t === "4" ? 4 : t === "5" ? 5 : 0;

  // === Step 1: Main Menu ===
  if (num >= 1 && num <= 5) {
    await updateStep(phone, getStepForNumber(num));
    await sock.sendMessage(jid, { text: getStepMessage(num, name) });
    return;
  }

  // === Welcome triggers ===
  if (["hi","hello","hey","menu","start","help"].includes(t.toLowerCase())) {
    await updateStep(phone, "menu");
    await sock.sendMessage(jid, { text: WELCOME });
    return;
  }

  // === Talk to human ===
  if (t.toLowerCase().includes("agent") || t.toLowerCase().includes("human") || t.toLowerCase().includes("support") || num === 5) {
    await updateStep(phone, "awaiting_human");
    await updateStatus(phone, "waiting");
    await sock.sendMessage(jid, { text: `👤 *Connecting you with our team...*

An agent will message you shortly.
Or call now: +234 707 422 2284

_Someone will get back to you within minutes._` });
    return;
  }

  // === Get current session ===
  const session = await getSession(phone);
  const step = session?.step || "menu";

  // === Route based on step ===
  switch (step) {
    case "menu": await sock.sendMessage(jid, { text: WELCOME }); break;

    case "buy_location":
      await updateData(phone, "location", t);
      await updateStep(phone, "buy_budget");
      await sock.sendMessage(jid, { text: `💰 What's your budget?

*1️⃣* Under ₦5M
*2️⃣* ₦5M – ₦10M
*3️⃣* ₦10M – ₦20M
*4️⃣* ₦20M+
*5️⃣* Any budget` }); break;

    case "buy_budget":
      await updateData(phone, "budget", t);
      await updateStep(phone, "buy_bedrooms");
      await sock.sendMessage(jid, { text: `🛏️ How many bedrooms?

*1️⃣* 2 bed
*2️⃣* 3 bed
*3️⃣* 4+ bed
*4️⃣* Any` }); break;

    case "buy_bedrooms":
      await updateData(phone, "bedrooms", t);
      await performSearch(sock, jid, phone);
      break;

    case "sell_type":
      await updateData(phone, "sellType", t);
      await updateStep(phone, "sell_location");
      await sock.sendMessage(jid, { text: `📍 Where is the property located?

Just type the area/city name.
Example: "GRA Kano" or "Nassarawa"` }); break;

    case "sell_location":
      await updateData(phone, "sellLocation", t);
      await updateStep(phone, "sell_price");
      await sock.sendMessage(jid, { text: `💰 What's the asking price?

Just type the amount.
Example: "15000000" for ₦15M` }); break;

    case "sell_price":
      await updateData(phone, "sellPrice", t);
      await updateStep(phone, "sell_agent");
      await sock.sendMessage(jid, { text: `👤 *Property details collected!*

A representative will contact you within 24 hours to:
• Verify the property
• Take photos
• List it on the platform

📞 For faster service, call: +234 707 422 2284` });
      await updateStatus(phone, "waiting");
      break;

    case "agent_info":
      await updateStep(phone, "closed");
      await sock.sendMessage(jid, { text: `🤝 *Become an MBPP Agent*

Apply here: https://mbpproperties.com/apply-as-agent

*Requirements:*
• Valid ID (NIN, BVN, or Driver's License)
• Proof of address
• 2 professional references

*What you get:*
• Commission on every sale/rental
• Access to verified property inventory
• Marketing support
• Payment within 7 days of deal closure

Our team reviews applications within 48 hours.` }); break;

    case "awaiting_human":
      await sock.sendMessage(jid, { text: `⏳ *You're in the support queue.*

Our team will respond shortly. Thank you for your patience.

For urgent matters, call: +234 707 422 2284` }); break;

    default:
      await sock.sendMessage(jid, { text: WELCOME });
  }
}

// ============ Step Helpers ============
function getStepForNumber(num: number): string {
  const steps: Record<number, string> = { 1: "buy_location", 2: "buy_location", 3: "sell_type", 4: "agent_info", 5: "awaiting_human" };
  return steps[num] || "menu";
}

function getStepMessage(num: number, name: string): string {
  switch (num) {
    case 1: return `🏠 *Find a Property to Buy*

Let me help you find the perfect property! 📍

First, *which area* are you interested in?
Just type the area name.
Examples: "GRA Kano", "Nassarawa", "Tarauni", "Fagge"`;
    case 2: return `🏡 *Find a Property to Rent*

Let me help you find the perfect rental! 📍

First, *which area* are you interested in?
Just type the area name.
Examples: "GRA Kano", "Nassarawa", "Tarauni", "Fagge"`;
    case 3: return `💰 *Sell Your Property*

I'll help you list your property on MBPP!

*What type of property?*
1️⃣ House
2️⃣ Flat
3️⃣ Land
4️⃣ Commercial

_Just reply with the number._`;
    case 4: return `🤝 *Become an MBPP Agent*

Join our team and earn commissions on every deal!

_Reply "1" to continue or "back" for the menu._`;
    case 5: return `👤 *Connecting you with support...*

An agent will be with you shortly.`;
    default: return WELCOME;
  }
}

// ============ DB Update Helpers ============
async function updateStep(phone: string, step: string) {
  try {
    await fetch(`${API}/api/whatsapp/conversations/${phone}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ step, status: step === "awaiting_human" ? "waiting" : "active" }),
    }).catch(() => {});
  } catch {}
}

async function updateData(phone: string, key: string, value: string) {
  try {
    await fetch(`${API}/api/whatsapp/conversations/${phone}/data`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, value }),
    }).catch(() => {});
  } catch {}
}

async function updateStatus(phone: string, status: string) {
  try {
    await fetch(`${API}/api/whatsapp/conversations/${phone}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    }).catch(() => {});
  } catch {}
}

async function performSearch(sock: any, jid: string, phone: string) {
  const session = await getSession(phone);
  const location = session?.data?.location || "Kano";
  const budget = session?.data?.budget || "";
  const bedrooms = session?.data?.bedrooms || "";

  let query = `search=${encodeURIComponent(location)}`;
  if (bedrooms && bedrooms !== "4") query += `&minBeds=${bedrooms}`;
  if (budget === "1") query += "&maxPrice=5000000";
  else if (budget === "2") { query += "&minPrice=5000000&maxPrice=10000000"; }

  const data = await apiGet(`/api/listings?${query}&limit=3`);
  if (!data || !data.listings || data.listings.length === 0) {
    await sock.sendMessage(jid, { text: `🔍 No properties found.\n\nTry a different area or budget. Reply *menu* to start over.` });
    await updateStep(phone, "menu");
    return;
  }

  let response = `🏠 Found *${data.total || data.listings.length}* properties:\n\n`;
  for (let i = 0; i < Math.min(3, data.listings.length); i++) {
    response += formatListing(data.listings[i], i) + "\n";
  }
  response += `\n_Reply *1*, *2*, or *3* for details, or *menu* to start over._`;
  await sock.sendMessage(jid, { text: response });
  await updateStep(phone, "menu");
}

// ============ Start ============
startBot().catch(err => { logger.error(err, "Bot crashed"); process.exit(1); });
