// ============================================
// MBPP WhatsApp AI Agent — Smart Bot
// Conversation flows: Buy, Rent, Sell, Agent, Support
// ============================================

import { makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion, makeCacheableSignalKeyStore } from "@whiskeysockets/baileys";
import { Boom } from "@hapi/boom";
import NodeCache from "node-cache";
import pino from "pino";
import * as fs from "fs";
import { CONFIG } from "./config";

const logger = pino({ level: "info" });
const msgCache = new NodeCache({ stdTTL: 60 });
const API = CONFIG.apiUrl;

// ============ In-Memory Session Store ============
const sessions = new Map<string, { step: string; data: Record<string, string>; updatedAt: number }>();

function getStep(phone: string): string {
  const s = sessions.get(phone);
  if (!s) return "menu";
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
  const price = item.price ? formatPrice(item.price, item.listingType === "rent" ? "year" : "") : "Contact";
  const link = `https://mbpproperties.com/listings/${item.id}`;
  return `*${idx + 1}️⃣ ${item.title || "Property"}*
📍 ${item.address || item.city || "Kano"}
💰 ${price}
🛏️ ${item.bedrooms || "?"} bed | 🚿 ${item.bathrooms || "?"} bath
🔗 ${link}`;
}

function formatDetail(item: any): string {
  const price = item.price ? formatPrice(item.price, item.listingType === "rent" ? "year" : "") : "Contact";
  const type = item.listingType === "rent" ? "Available for Rent" : "Available for Sale";
  const link = `https://mbpproperties.com/listings/${item.id}`;
  return `🏠 *${item.title || "Property"}*

💰 *Price:* ${price}
📍 *Location:* ${item.city || "Kano"}${item.address ? ", " + item.address : ""}
🏷️ *Type:* ${type}
🛏️ *Bedrooms:* ${item.bedrooms || "N/A"} | 🚿 *Bathrooms:* ${item.bathrooms || "N/A"}
${item.sqft ? `📐 *Area:* ${item.sqft} sqft\n` : ""}
${item.features && item.features.length > 0 ? `⚡ *Features:* ${Array.isArray(item.features) ? item.features.join(", ") : item.features}\n` : ""}
${item.description ? `📝 ${item.description.substring(0, 200)}${item.description.length > 200 ? "..." : ""}\n` : ""}
🔗 *View online:* ${link}
👤 *Agent:* ${item.postedBy?.name || "MBPP Team"}`;
}

const WELCOME = `🏠 *MBPP Properties*

Welcome! What are you looking for?

*1️⃣* Buy a property
*2️⃣* Rent a property  
*3️⃣* Sell your property
*4️⃣* Become an agent
*5️⃣* Talk to support

_Just reply with a number._`;

// ============ Send Photo Helper ============
async function sendListingPhoto(sock: any, jid: string, listing: any) {
  if (!listing.photos || listing.photos.length === 0) return;
  const photoUrl = listing.photos[0]?.url;
  if (!photoUrl) return;

  try {
    const urls: string[] = [];
    if (photoUrl.startsWith("http")) {
      urls.push(photoUrl);
    } else {
      const clean = photoUrl.replace(/^\/+/, "");
      urls.push(`https://mbpproperties.com/uploads/${clean}`);
      urls.push(`https://mbpproperties.com/api/upload/file/${clean}`);
      urls.push(`https://propease-production.up.railway.app/api/upload/file/${clean}`);
    }

    let resolved = urls[0];
    for (const url of urls) {
      try {
        const r = await fetch(url, { method: "HEAD" });
        if (r.ok) { resolved = url; break; }
      } catch {}
    }

    await sock.sendMessage(jid, {
      image: { url: resolved },
      caption: `📷 ${listing.title}\n🔗 https://mbpproperties.com/listings/${listing.id}`
    });
  } catch (e) {
    logger.warn("Photo send failed: " + (e as Error)?.message);
  }
}

const CUSTOM_REQUEST_PROMPT = `📝 *Custom Search Request*

We'll find it for you! Just tell us:

1. Your name
2. What you're looking for (type, location, budget)
3. Your phone number

_Type everything in one message and our team will follow up within 24 hours._`;

const CUSTOM_REQUEST_CONFIRM = `✅ *Request submitted!*

Our team will personally search for matching properties and contact you within 24 hours.

📞 For urgent requests: +234 707 422 2284

Reply *menu* to start a new search.`;

const VIEWING_PROMPT = `📅 *Schedule a Viewing*

Please provide:
1. Preferred date and time
2. Your name and phone number

_Example: "Tomorrow 2pm, Ahmad, 08034567890"_`;

const INQUIRY_PROMPT = `💬 *Send an Inquiry*

What would you like to know about this property?

_Type your question and our team will respond within 24 hours._`;

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
      logger.info("📱 QR code generated");
      try { fs.writeFileSync("/tmp/whatsapp-qr.txt", qr); } catch {}
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
    if (connection === "close") {
      try { fs.unlinkSync("/tmp/whatsapp-connected"); } catch {}
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

      // Save to DB (best effort)
      try {
        fetch(`${API}/api/whatsapp/message`, {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone, name: sender, message: text.substring(0, 2000), direction: "incoming" }),
        }).catch(() => {});
      } catch {}

      await handleConversation(sock, jid, text, phone, sender);
    }
  });

  // === Process admin-sent messages ===
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
      await fetch(`${API}/api/whatsapp/message`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: data.phone, message: data.message, direction: "outgoing", fromBot: true, senderName: "Admin" }),
      }).catch(() => {});
      fs.unlinkSync(`${dir}/${file}`);
    } catch (e) { try { fs.unlinkSync(`${dir}/${file}`); } catch {} }
  }
}

// ============ Conversation Router ============
async function handleConversation(sock: any, jid: string, text: string, phone: string, name: string) {
  const t = text.trim().toLowerCase();
  const num = t === "1" ? 1 : t === "2" ? 2 : t === "3" ? 3 : t === "4" ? 4 : t === "5" ? 5 : 0;
  const step = getStep(phone);

  // Cancel support
  if (t === "cancel") {
    setStep(phone, "menu");
    await sock.sendMessage(jid, { text: `✅ Cancelled. Reply *menu* to start over.` });
    return;
  }

  // Menu triggers — always reset
  if (t === "hi" || t === "hello" || t === "hey" || t === "menu" || t === "start" || t === "help" || t === "back") {
    setStep(phone, "menu");
    await sock.sendMessage(jid, { text: WELCOME });
    return;
  }

  // Human handoff — only from menu or awaiting_human step
  if (step === "menu" && (t.includes("agent") || t.includes("human") || t.includes("support") || num === 5)) {
    setStep(phone, "menu");
    await sock.sendMessage(jid, { text: `👤 *Connecting you with our team...*\n\nAn agent will message you shortly.\n📞 Or call: +234 707 422 2284` });
    try { fs.writeFileSync(`/tmp/whatsapp-queue/handoff_${Date.now()}.json`, JSON.stringify({ phone, name, intent: "handoff" })); } catch {}
    return;
  }

  // Results step — user replies with number or "yes"
  if (step === "results") {
    const results = getData(phone).results ? JSON.parse(getData(phone).results) : [];
    if (num >= 1 && num <= Math.min(3, results.length)) {
      const listing = results[num - 1];
      setData(phone, "selectedListing", JSON.stringify(listing));
      setStep(phone, "detail");
      await sock.sendMessage(jid, { text: formatDetail(listing) });
      // Send photo + link
      await sendListingPhoto(sock, jid, listing);
      await sock.sendMessage(jid, { text: `📅 *view* — Schedule a viewing\n💬 *ask* — Ask a question\n🔄 *menu* — Search again` });
      return;
    }
    if (t === "yes" || t.includes("custom") || t.includes("request")) {
      setStep(phone, "custom_request");
      await sock.sendMessage(jid, { text: CUSTOM_REQUEST_PROMPT });
      return;
    }
    if (num === 0 && t !== "menu") {
      await sock.sendMessage(jid, { text: `Reply *1-3* for details, *yes* for custom request, or *menu* to search again.` });
      return;
    }
  }

  // Detail step — viewing, inquiry, or back
  if (step === "detail") {
    if (t.includes("view") || t === "📅" || t === "view") {
      setStep(phone, "viewing_input");
      await sock.sendMessage(jid, { text: VIEWING_PROMPT });
      return;
    }
    if (t.includes("ask") || t === "💬" || t === "ask" || t.includes("inquiry")) {
      setStep(phone, "inquiry_question");
      await sock.sendMessage(jid, { text: INQUIRY_PROMPT });
      return;
    }
    if (t === "menu" || t === "back") {
      setStep(phone, "menu");
      await sock.sendMessage(jid, { text: WELCOME });
      return;
    }
    // If user sends a number again, might be trying to go back to results
    if (num >= 1 && num <= 3) {
      const results = getData(phone).results ? JSON.parse(getData(phone).results) : [];
      if (num <= results.length) {
        const listing = results[num - 1];
        setData(phone, "selectedListing", JSON.stringify(listing));
        await sock.sendMessage(jid, { text: formatDetail(listing) });
        await sendListingPhoto(sock, jid, listing);
        return;
      }
    }
    await sock.sendMessage(jid, { text: `📅 *view* — Schedule viewing\n💬 *ask* — Ask a question\n🔄 *menu* — Search again` });
    return;
  }

  // Viewing input
  if (step === "viewing_input") {
    setData(phone, "viewingDetails", text);
    setStep(phone, "menu");
    // Save as inquiry
    try {
      fetch(`${API}/api/whatsapp/message`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, name, message: `[VIEWING REQUEST] ${text}`, direction: "incoming", fromBot: false }),
      }).catch(() => {});
    } catch {}
    await sock.sendMessage(jid, { text: `✅ *Viewing request received!*\n\n📅 Details: ${text}\n\nOur team will confirm the appointment within 24 hours.\n📞 For urgent requests: +234 707 422 2284\n\nReply *menu* to continue.` });
    return;
  }

  // Inquiry question
  if (step === "inquiry_question") {
    const listing = getData(phone).selectedListing ? JSON.parse(getData(phone).selectedListing) : null;
    setStep(phone, "menu");
    try {
      fetch(`${API}/api/whatsapp/message`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, name, message: `[INQUIRY${listing ? " - " + listing.title : ""}] ${text}`, direction: "incoming", fromBot: false }),
      }).catch(() => {});
    } catch {}
    await sock.sendMessage(jid, { text: `✅ *Inquiry submitted!*\n\nOur team will respond within 24 hours.\n📞 For urgent questions: +234 707 422 2284\n\nReply *menu* to continue.` });
    return;
  }

  // Custom request
  if (step === "custom_request") {
    setStep(phone, "menu");
    try {
      fetch(`${API}/api/whatsapp/message`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, name, message: `[CUSTOM REQUEST] ${text}`, direction: "incoming", fromBot: false }),
      }).catch(() => {});
    } catch {}
    await sock.sendMessage(jid, { text: CUSTOM_REQUEST_CONFIRM });
    return;
  }

  // Main menu — numeric responses
  if (num >= 1 && num <= 5) {
    if (step === "menu") {
      setStep(phone, getStepForNumber(num));
      await sock.sendMessage(jid, { text: getStepMessage(num, name) });
      return;
    }
    // Buy flow steps
    if (step === "buy_budget") {
      setData(phone, "budget", ["", "0-5M", "5-10M", "10-20M", "20M+"][num] || String(num));
      setStep(phone, "buy_bedrooms");
      await sock.sendMessage(jid, { text: `🛏️ *Bedrooms?*\n1️⃣ 2 bed\n2️⃣ 3 bed\n3️⃣ 4+ bed\n4️⃣ Any` });
      return;
    }
    if (step === "buy_bedrooms") {
      setData(phone, "bedrooms", ["", "2", "3", "4", "any"][num] || String(num));
      await performSearch(sock, jid, phone);
      return;
    }
    if (step === "sell_type") {
      setData(phone, "sellType", ["", "House", "Flat", "Land", "Commercial"][num] || "House");
      setStep(phone, "sell_location");
      await sock.sendMessage(jid, { text: `📍 *Where is the property?*\n\nType the area/city name.\nExample: "GRA Kano" or "Nassarawa"` });
      return;
    }
  }

  // Text input routing
  switch (step) {
    case "menu":
      await sock.sendMessage(jid, { text: WELCOME });
      break;
    case "buy_location":
      setData(phone, "location", text);
      setStep(phone, "buy_budget");
      await sock.sendMessage(jid, { text: `💰 *Budget?*\n1️⃣ Under ₦5M\n2️⃣ ₦5M–₦10M\n3️⃣ ₦10M–₦20M\n4️⃣ ₦20M+\n5️⃣ Any` });
      break;
    case "buy_budget":
      setData(phone, "budget", text);
      setStep(phone, "buy_bedrooms");
      await sock.sendMessage(jid, { text: `🛏️ *Bedrooms?*\n1️⃣ 2 bed\n2️⃣ 3 bed\n3️⃣ 4+ bed\n4️⃣ Any` });
      break;
    case "buy_bedrooms":
      setData(phone, "bedrooms", text);
      await performSearch(sock, jid, phone);
      break;
    case "sell_location":
      setData(phone, "sellLocation", text);
      setStep(phone, "sell_price");
      await sock.sendMessage(jid, { text: `💰 *Asking price?*\nType amount. Example: "15000000" for ₦15M` });
      break;
    case "sell_price":
      setData(phone, "sellPrice", text);
      setStep(phone, "menu");
      try {
        fetch(`${API}/api/whatsapp/message`, {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone, name, message: `[SELL REQUEST] ${getData(phone).sellType || "Property"} in ${getData(phone).sellLocation || "Kano"} - ₦${text}`, direction: "incoming", fromBot: false }),
        }).catch(() => {});
      } catch {}
      await sock.sendMessage(jid, { text: `✅ *Property details collected!*\n\nA representative will contact you within 24 hours to verify and list your property.\n📞 +234 707 422 2284\n\nReply *menu* to continue.` });
      break;
    case "agent_info":
      setStep(phone, "menu");
      await sock.sendMessage(jid, { text: `🤝 *Become an MBPP Agent*\n\nApply here: https://mbpproperties.com/apply-as-agent\n\nOur team reviews applications within 48 hours.\n\nReply *menu* to continue.` });
      break;
    default:
      setStep(phone, "menu");
      await sock.sendMessage(jid, { text: WELCOME });
  }
}

function getStepForNumber(num: number): string {
  const steps: Record<number, string> = { 1: "buy_location", 2: "buy_location", 3: "sell_type", 4: "agent_info", 5: "menu" };
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

// ============ Property Search ============
async function performSearch(sock: any, jid: string, phone: string) {
  const data = getData(phone);
  const location = data.location || "Kano";
  const bedrooms = data.bedrooms || "";
  const budget = data.budget || "";

  let query = `search=${encodeURIComponent(location)}&limit=3`;
  if (bedrooms === "2") query += "&minBeds=2&maxBeds=2";
  else if (bedrooms === "3") query += "&minBeds=3";
  else if (bedrooms === "4") query += "&minBeds=4";

  // Apply budget filter
  if (budget === "0-5M") query += "&maxPrice=5000000";
  else if (budget === "5-10M") query += "&minPrice=5000000&maxPrice=10000000";
  else if (budget === "10-20M") query += "&minPrice=10000000&maxPrice=20000000";
  else if (budget === "20M+") query += "&minPrice=20000000";

  const result = await apiGet(`/api/listings?${query}`);

  if (!result || !result.listings || result.listings.length === 0) {
    setStep(phone, "custom_request");
    await sock.sendMessage(jid, { text: `🔍 *No properties found* in ${location}.\n\n*We can find it for you!*\n\nReply *yes* to submit a custom search request.\nOur team will personally look for matching properties.\n\nOr reply *menu* to search again.` });
    return;
  }

  const listings = result.listings.slice(0, 3);
  const count = listings.length;
  setData(phone, "results", JSON.stringify(listings));
  setStep(phone, "results");

  let response = `🏠 *Found ${result.total || count} properties:*\n\n`;
  for (let i = 0; i < count; i++) {
    response += formatListing(listings[i], i) + "\n\n";
  }
  if (count === 1) {
    response += `_Reply *1* for details, *yes* for a custom request, or *menu* to search again._`;
  } else {
    response += `_Reply *1-${count}* for details, *yes* for a custom request, or *menu* to search again._`;
  }
  await sock.sendMessage(jid, { text: response });

  // Send first photo of each listing
  for (let i = 0; i < count; i++) {
    await sendListingPhoto(sock, jid, listings[i]);
  }
}

// ============ Start ============
startBot().catch(err => { logger.error(err, "Bot crashed"); process.exit(1); });
