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

// ============ In-Memory Session Store ============
const sessions = new Map<string, { step: string; data: Record<string, string>; updatedAt: number }>();

function getStep(phone: string): string {
  const s = sessions.get(phone);
  if (!s) return "menu";
  // Expire sessions after 30 minutes
  if (Date.now() - s.updatedAt > 30 * 60 * 1000) { sessions.delete(phone); return "menu"; }
  return s.step;
}

function setStep(phone: string, step: string) {
  const s = sessions.get(phone) || { step: "menu", data: {}, updatedAt: Date.now() };
  s.step = step;
  s.updatedAt = Date.now();
  sessions.set(phone, s);
}

function setData(phone: string, key: string, value: string) {
  const s = sessions.get(phone) || { step: "menu", data: {}, updatedAt: Date.now() };
  s.data[key] = value;
  s.updatedAt = Date.now();
  sessions.set(phone, s);
}

function getData(phone: string): Record<string, string> {
  return sessions.get(phone)?.data || {};
}

// ============ API Helpers ============
async function apiGet(p: string): Promise<any> {
  try { const r = await fetch(`${API}${p}`); if (!r.ok) return null; return await r.json(); } catch { return null; }
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
    if (qr) {
      console.log("📱 QR code generated");
      try { fs.writeFileSync("/tmp/whatsapp-qr.txt", qr); } catch {}
      // Try rendering in terminal if qrcode-terminal is available
      try {
        const qrcode = require("qrcode-terminal");
        qrcode.generate(qr, { small: true });
      } catch {}
    }
    if (connection === "open") {
      logger.info("✅ WhatsApp bot connected!");
      try { fs.writeFileSync("/tmp/whatsapp-connected", "1"); } catch {}
      try { fs.unlinkSync("/tmp/whatsapp-qr.txt"); } catch {}
    }
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

      // Try to save to DB (best effort, don't block)
      try {
        fetch(`${API}/api/whatsapp/message`, {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone, name: sender, message: text.substring(0, 2000), direction: "incoming" }),
        }).catch(() => {});
      } catch {}

      // Handle conversation flow using in-memory state
      await handleConversation(sock, jid, text, phone, sender);
    }
  });

  // === Process admin-sent messages from file queue ===
  setInterval(() => processQueue(sock), 3000);

  return sock;
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
// ============ Conversation Router (in-memory) ============
async function handleConversation(sock: any, jid: string, text: string, phone: string, name: string) {
  const t = text.trim().toLowerCase();
  const num = t === "1" ? 1 : t === "2" ? 2 : t === "3" ? 3 : t === "4" ? 4 : t === "5" ? 5 : 0;
  const step = getStep(phone);

  // Menu triggers — always reset
  if (t === "hi" || t === "hello" || t === "hey" || t === "menu" || t === "start" || t === "help" || t === "back") {
    setStep(phone, "menu");
    await sock.sendMessage(jid, { text: WELCOME });
    return;
  }

  // Human handoff
  if (t.includes("agent") || t.includes("human") || t.includes("support") || num === 5) {
    setStep(phone, "menu");
    await sock.sendMessage(jid, { text: `👤 *Connecting you with our team...*\n\nAn agent will message you shortly.\n📞 Or call: +234 707 422 2284` });
    return;
  }

  // Numeric responses depend on current step
  if (num >= 1 && num <= 4) {
    if (step === "menu") { setStep(phone, getStepForNumber(num)); await sock.sendMessage(jid, { text: getStepMessage(num, name) }); return; }
    if (step === "buy_budget") { setData(phone, "budget", ["","0-5M","5-10M","10-20M","20M+"][num]||String(num)); setStep(phone,"buy_bedrooms"); await sock.sendMessage(jid,{text:`🛏️ *Bedrooms?*\n1️⃣ 2 bed\n2️⃣ 3 bed\n3️⃣ 4+ bed\n4️⃣ Any`}); return; }
    if (step === "buy_bedrooms") { setData(phone,"bedrooms",["","2","3","4","any"][num]||String(num)); await performSearch(sock,jid,phone); return; }
  }

  // Text input routing
  switch (step) {
    case "menu": await sock.sendMessage(jid,{text:WELCOME}); break;
    case "buy_location": setData(phone,"location",text); setStep(phone,"buy_budget"); await sock.sendMessage(jid,{text:`💰 *Budget?*\n1️⃣ Under ₦5M\n2️⃣ ₦5M–₦10M\n3️⃣ ₦10M–₦20M\n4️⃣ ₦20M+\n5️⃣ Any`}); break;
    case "buy_budget": setData(phone,"budget",text); setStep(phone,"buy_bedrooms"); await sock.sendMessage(jid,{text:`🛏️ *Bedrooms?*\n1️⃣ 2 bed\n2️⃣ 3 bed\n3️⃣ 4+ bed\n4️⃣ Any`}); break;
    case "buy_bedrooms": setData(phone,"bedrooms",text); await performSearch(sock,jid,phone); break;
    case "sell_location": setData(phone,"sellLocation",text); setStep(phone,"sell_price"); await sock.sendMessage(jid,{text:`💰 *Asking price?*\nType amount. Example: "15000000" for ₦15M`}); break;
    case "sell_price": setData(phone,"sellPrice",text); setStep(phone,"menu"); await sock.sendMessage(jid,{text:`✅ *Details collected!*\n\nA representative will contact you within 24 hours.\n📞 +234 707 422 2284`}); break;
    default: setStep(phone,"menu"); await sock.sendMessage(jid,{text:WELCOME});
  }
}

function getStepForNumber(num: number): string {
  const steps: Record<number, string> = { 1: "buy_location", 2: "buy_location", 3: "sell_type", 4: "agent_info" };
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

// ============ DB Update Helpers (in-memory) ============
async function performSearch(sock: any, jid: string, phone: string) {
  const data = getData(phone);
  const location = data.location || "Kano";
  const budget = data.budget || "";
  const bedrooms = data.bedrooms || "";

  let query = `search=${encodeURIComponent(location)}&limit=3`;
  if (bedrooms && bedrooms !== "4" && bedrooms !== "4+") query += `&minBeds=2`;
  if (bedrooms === "3") query += "&minBeds=3";
  else if (bedrooms === "4") query += "&minBeds=4";

  const result = await apiGet(`/api/listings?${query}`);
  if (!result || !result.listings || result.listings.length === 0) {
    setStep(phone, "menu");
    await sock.sendMessage(jid, { text: `🔍 *No properties found matching your criteria.*\n\nTry a different area or budget. Reply *menu* to start over.` });
    return;
  }

  let response = `🏠 *Found ${result.total || result.listings.length} properties:*\n\n`;
  for (let i = 0; i < Math.min(3, result.listings.length); i++) {
    response += formatListing(result.listings[i], i) + "\n";
  }
  response += `\n_Reply *menu* to search again._`;
  setStep(phone, "menu");
  await sock.sendMessage(jid, { text: response });
}

// ============ Start ============
startBot().catch(err => { logger.error(err, "Bot crashed"); process.exit(1); });
