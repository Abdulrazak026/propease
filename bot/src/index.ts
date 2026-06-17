// ============================================
// MBPP WhatsApp AI Agent — Smart Bot
// Interactive buttons, list messages, conversation flows
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

function formatDetail(item: any): string {
  const price = item.price ? formatPrice(item.price, item.listingType === "rent" ? "year" : "") : "Contact";
  const type = item.listingType === "rent" ? "Available for Rent" : "Available for Sale";
  const link = `${CONFIG.publicUrl}/listings/${item.id}`;
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

// ============ Interactive Messages ============
function sendMainMenu(sock: any, jid: string) {
  return sock.sendMessage(jid, {
    text: "🏠 *Welcome to MBPP Properties!*",
    buttons: [
      { buttonId: "buy", buttonText: { displayText: "🏠 Buy Property" }, type: 1 },
      { buttonId: "rent", buttonText: { displayText: "🏡 Rent Property" }, type: 1 },
      { buttonId: "sell", buttonText: { displayText: "💰 Sell Property" }, type: 1 },
    ],
    headerType: 1,
  });
}

function sendMoreMenu(sock: any, jid: string) {
  return sock.sendMessage(jid, {
    text: "More options:",
    buttons: [
      { buttonId: "agent", buttonText: { displayText: "🤝 Become Agent" }, type: 1 },
      { buttonId: "support", buttonText: { displayText: "👤 Talk to Support" }, type: 1 },
      { buttonId: "back_main", buttonText: { displayText: "← Back" }, type: 1 },
    ],
    headerType: 1,
  });
}

function sendBudgetButtons(sock: any, jid: string) {
  return sock.sendMessage(jid, {
    text: "💰 *What's your budget?*",
    buttons: [
      { buttonId: "budget_0_5m", buttonText: { displayText: "₦ Under ₦5M" }, type: 1 },
      { buttonId: "budget_5_10m", buttonText: { displayText: "₦5M – ₦10M" }, type: 1 },
      { buttonId: "budget_any", buttonText: { displayText: "💰 Any Budget" }, type: 1 },
    ],
    headerType: 1,
  });
}

function sendMoreBudget(sock: any, jid: string) {
  return sock.sendMessage(jid, {
    text: "More budget options:",
    buttons: [
      { buttonId: "budget_10_20m", buttonText: { displayText: "₦10M – ₦20M" }, type: 1 },
      { buttonId: "budget_20m_plus", buttonText: { displayText: "₦20M+" }, type: 1 },
      { buttonId: "budget_any", buttonText: { displayText: "💰 Any" }, type: 1 },
    ],
    headerType: 1,
  });
}

function sendBedroomButtons(sock: any, jid: string) {
  return sock.sendMessage(jid, {
    text: "🛏️ *How many bedrooms?*",
    buttons: [
      { buttonId: "beds_2", buttonText: { displayText: "2 Bedrooms" }, type: 1 },
      { buttonId: "beds_3", buttonText: { displayText: "3 Bedrooms" }, type: 1 },
      { buttonId: "beds_any", buttonText: { displayText: "Any" }, type: 1 },
    ],
    headerType: 1,
  });
}

function sendSellTypeButtons(sock: any, jid: string) {
  return sock.sendMessage(jid, {
    text: "💰 *What type of property?*",
    buttons: [
      { buttonId: "sell_house", buttonText: { displayText: "🏠 House" }, type: 1 },
      { buttonId: "sell_flat", buttonText: { displayText: "🏢 Flat" }, type: 1 },
      { buttonId: "sell_land", buttonText: { displayText: "🏗️ Land" }, type: 1 },
    ],
    headerType: 1,
  });
}

function sendSellTypeMore(sock: any, jid: string) {
  return sock.sendMessage(jid, {
    text: "Or other type:",
    buttons: [
      { buttonId: "sell_commercial", buttonText: { displayText: "🏬 Commercial" }, type: 1 },
      { buttonId: "back_main", buttonText: { displayText: "← Back" }, type: 1 },
    ],
    headerType: 1,
  });
}

function sendDetailButtons(sock: any, jid: string) {
  return sock.sendMessage(jid, {
    text: "What would you like to do?",
    buttons: [
      { buttonId: "view", buttonText: { displayText: "📅 Schedule Viewing" }, type: 1 },
      { buttonId: "ask", buttonText: { displayText: "💬 Ask a Question" }, type: 1 },
      { buttonId: "back_menu", buttonText: { displayText: "🔄 Back to Menu" }, type: 1 },
    ],
    headerType: 1,
  });
}

// ============ Send Photo Helper ============
async function sendListingPhoto(sock: any, jid: string, listing: any, caption: string) {
  const photoUrl = listing.photos?.[0]?.url;
  if (photoUrl) {
    const resolved = photoUrl.startsWith("http") ? photoUrl : `${CONFIG.publicUrl}${photoUrl.startsWith("/") ? "" : "/"}${photoUrl}`;
    try {
      await sock.sendMessage(jid, { image: { url: resolved }, caption });
      return true;
    } catch {}
  }
  return false;
}

// ============ Message Router ============
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

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", (update: any) => {
    const { connection, lastDisconnect, qr } = update;
    if (qr) {
      logger.info("📱 QR code generated");
      try { fs.writeFileSync("/tmp/whatsapp-qr.txt", qr); } catch {}
      try { require("qrcode-terminal").generate(qr, { small: true }); } catch {}
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

      const jid = msg.key.remoteJid!;
      const sender = msg.pushName || "Guest";
      const phone = jid.split("@")[0];

      // Extract message text (handles buttons, lists, text, captions)
      let text = "";

      // Check for button response
      const buttonId = (msg.message as any)?.buttonsResponseMessage?.selectedButtonId;
      if (buttonId) {
        text = buttonId;
      }

      // Check for list response
      const listId = (msg.message as any)?.listResponseMessage?.singleSelectReply?.selectedRowId;
      if (listId) {
        text = listId;
      }

      // Regular text
      if (!text) {
        text = (msg.message.conversation || msg.message.extendedTextMessage?.text || msg.message.imageMessage?.caption || "").trim();
      }

      if (!text) continue;

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
      fs.unlinkSync(`${dir}/${file}`);
    } catch (e) { try { fs.unlinkSync(`${dir}/${file}`); } catch {} }
  }
}

// ============ Conversation Router ============
async function handleConversation(sock: any, jid: string, text: string, phone: string, name: string) {
  const t = text.trim().toLowerCase();
  const num = t === "1" ? 1 : t === "2" ? 2 : t === "3" ? 3 : t === "4" ? 4 : t === "5" ? 5 : 0;
  const step = getStep(phone);

  // Cancel
  if (t === "cancel" || t === "back_menu") {
    setStep(phone, "menu");
    await sendMainMenu(sock, jid);
    return;
  }

  // Menu triggers (text)
  if (t === "hi" || t === "hello" || t === "hey" || t === "menu" || t === "start" || t === "help") {
    setStep(phone, "menu");
    await sendMainMenu(sock, jid);
    return;
  }

  // === MAIN MENU ===
  if (step === "menu") {
    if (t === "buy") {
      setStep(phone, "buy_location");
      await sock.sendMessage(jid, { text: "🏠 *Find a Property to Buy*\n\nWhich area are you interested in?\nExamples: \"GRA Kano\", \"Nassarawa\", \"Tarauni\"" });
      return;
    }
    if (t === "rent") {
      setStep(phone, "buy_location");
      await sock.sendMessage(jid, { text: "🏡 *Find a Property to Rent*\n\nWhich area are you interested in?\nExamples: \"GRA Kano\", \"Nassarawa\", \"Tarauni\"" });
      return;
    }
    if (t === "sell") {
      setStep(phone, "sell_type");
      await sendSellTypeButtons(sock, jid);
      return;
    }
    if (t === "agent") {
      setStep(phone, "menu");
      await sock.sendMessage(jid, { text: "🤝 *Become an MBPP Agent*\n\nApply: https://mbpproperties.com/apply-as-agent\n\nReviewed within 48 hours." });
      return;
    }
    if (t === "support" || t === "5") {
      setStep(phone, "menu");
      await sock.sendMessage(jid, { text: "👤 *Connecting you with support...*\n\n📞 +234 707 422 2284\n\nAn agent will message you shortly." });
      return;
    }
    // Fallback — show buttons again
    await sendMainMenu(sock, jid);
    return;
  }

  // === BUY LOCATION ===
  if (step === "buy_location") {
    setData(phone, "location", text);
    setStep(phone, "buy_budget");
    await sendBudgetButtons(sock, jid);
    return;
  }

  // === BUY BUDGET ===
  if (step === "buy_budget") {
    let budget = text;
    if (t === "budget_0_5m") budget = "0-5M";
    else if (t === "budget_5_10m") budget = "5-10M";
    else if (t === "budget_10_20m") budget = "10-20M";
    else if (t === "budget_20m_plus") budget = "20M+";
    else if (t === "budget_any") budget = "any";

    // Numeric fallback for older clients
    if (num === 1) budget = "0-5M";
    else if (num === 2) budget = "5-10M";
    else if (num === 3) budget = "10-20M";
    else if (num === 4) budget = "20M+";
    else if (num === 5) budget = "any";

    setData(phone, "budget", budget);
    setStep(phone, "buy_bedrooms");
    await sendBedroomButtons(sock, jid);
    return;
  }

  // === BUY BEDROOMS ===
  if (step === "buy_bedrooms") {
    let beds = text;
    if (t === "beds_2") beds = "2";
    else if (t === "beds_3") beds = "3";
    else if (t === "beds_any") beds = "any";

    if (num === 1) beds = "2";
    else if (num === 2) beds = "3";
    else if (num === 3) beds = "any";

    setData(phone, "bedrooms", beds);
    await performSearch(sock, jid, phone);
    return;
  }

  // === RESULTS ===
  if (step === "results") {
    const results = getData(phone).results ? JSON.parse(getData(phone).results) : [];

    if (num >= 1 && num <= Math.min(3, results.length)) {
      const listing = results[num - 1];
      setData(phone, "selectedListing", JSON.stringify(listing));
      setStep(phone, "detail");
      await sock.sendMessage(jid, { text: formatDetail(listing) });
      await sendListingPhoto(sock, jid, listing, `📷 ${listing.title}`);
      await sendDetailButtons(sock, jid);
      return;
    }
    if (t === "yes" || t.includes("custom") || t.includes("request")) {
      setStep(phone, "custom_request");
      await sock.sendMessage(jid, { text: "📝 *Custom Search Request*\n\nJust tell us:\n1. Your name\n2. What you're looking for\n3. Your phone number\n\n_Type everything in one message._" });
      return;
    }
    if (num === 0 && t !== "menu") {
      await sock.sendMessage(jid, { text: "Reply 1-3 for details, yes for custom request, or menu to search again." });
      return;
    }
  }

  // === DETAIL ACTIONS ===
  if (step === "detail") {
    if (t === "view" || t.includes("view") || t === "📅") {
      setStep(phone, "viewing_input");
      await sock.sendMessage(jid, { text: "📅 *Schedule a Viewing*\n\nPreferred date/time? (e.g. 'Tomorrow 2pm')\nYour name and phone number?\n\n_Type everything in one message._" });
      return;
    }
    if (t === "ask" || t.includes("ask") || t.includes("inquiry")) {
      setStep(phone, "inquiry_question");
      await sock.sendMessage(jid, { text: "💬 *Ask a Question*\n\nType your question about this property." });
      return;
    }
    if (num >= 1 && num <= 3) {
      const results = getData(phone).results ? JSON.parse(getData(phone).results) : [];
      if (num <= results.length) {
        const listing = results[num - 1];
        setData(phone, "selectedListing", JSON.stringify(listing));
        await sock.sendMessage(jid, { text: formatDetail(listing) });
        await sendListingPhoto(sock, jid, listing, `📷 ${listing.title}`);
        await sendDetailButtons(sock, jid);
        return;
      }
    }
    await sendDetailButtons(sock, jid);
    return;
  }

  // === VIEWING INPUT ===
  if (step === "viewing_input") {
    setStep(phone, "menu");
    try {
      fetch(`${API}/api/whatsapp/message`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, name, message: `[VIEWING REQUEST] ${text}`, direction: "incoming" }),
      }).catch(() => {});
    } catch {}
    await sock.sendMessage(jid, { text: `✅ *Viewing request received!*\n\n📅 ${text}\n\nOur team will confirm within 24 hours.\n📞 +234 707 422 2284\n\nType *menu* to continue.` });
    return;
  }

  // === INQUIRY QUESTION ===
  if (step === "inquiry_question") {
    const listing = getData(phone).selectedListing ? JSON.parse(getData(phone).selectedListing) : null;
    setStep(phone, "menu");
    try {
      fetch(`${API}/api/whatsapp/message`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, name, message: `[INQUIRY${listing ? " - " + listing.title : ""}] ${text}`, direction: "incoming" }),
      }).catch(() => {});
    } catch {}
    await sock.sendMessage(jid, { text: `✅ *Inquiry submitted!*\n\nOur team will respond within 24 hours.\n📞 +234 707 422 2284\n\nType *menu* to continue.` });
    return;
  }

  // === CUSTOM REQUEST ===
  if (step === "custom_request") {
    setStep(phone, "menu");
    try {
      fetch(`${API}/api/whatsapp/message`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, name, message: `[CUSTOM REQUEST] ${text}`, direction: "incoming" }),
      }).catch(() => {});
    } catch {}
    await sock.sendMessage(jid, { text: `✅ *Request submitted!*\n\nOur team will search for matching properties and contact you within 24 hours.\n📞 +234 707 422 2284\n\nType *menu* to continue.` });
    return;
  }

  // === SELL FLOW ===
  if (step === "sell_type") {
    let sellType = text;
    if (t === "sell_house") sellType = "House";
    else if (t === "sell_flat") sellType = "Flat";
    else if (t === "sell_land") sellType = "Land";
    else if (t === "sell_commercial") sellType = "Commercial";

    if (num === 1) sellType = "House";
    else if (num === 2) sellType = "Flat";
    else if (num === 3) sellType = "Land";
    else if (num === 4) sellType = "Commercial";

    setData(phone, "sellType", sellType);
    setStep(phone, "sell_location");
    await sock.sendMessage(jid, { text: "📍 *Where is the property?*\n\nType the area/city name.\nExample: \"GRA Kano\" or \"Nassarawa\"" });
    return;
  }

  if (step === "sell_location") {
    setData(phone, "sellLocation", text);
    setStep(phone, "sell_price");
    await sock.sendMessage(jid, { text: "💰 *Asking price?*\nType amount. Example: \"15000000\" for ₦15M" });
    return;
  }

  if (step === "sell_price") {
    setData(phone, "sellPrice", text);
    setStep(phone, "menu");
    try {
      fetch(`${API}/api/whatsapp/message`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, name, message: `[SELL REQUEST] ${getData(phone).sellType || "Property"} in ${getData(phone).sellLocation || "Kano"} - ₦${text}`, direction: "incoming" }),
      }).catch(() => {});
    } catch {}
    await sock.sendMessage(jid, { text: "✅ *Property details collected!*\n\nA representative will contact you within 24 hours.\n📞 +234 707 422 2284\n\nType *menu* to continue." });
    return;
  }

  // Fallback — show menu
  setStep(phone, "menu");
  await sendMainMenu(sock, jid);
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

  if (budget === "0-5M") query += "&maxPrice=5000000";
  else if (budget === "5-10M") query += "&minPrice=5000000&maxPrice=10000000";
  else if (budget === "10-20M") query += "&minPrice=10000000&maxPrice=20000000";
  else if (budget === "20M+") query += "&minPrice=20000000";

  const result = await apiGet(`/api/listings?${query}`);

  if (!result || !result.listings || result.listings.length === 0) {
    setStep(phone, "custom_request");
    await sock.sendMessage(jid, {
      text: `🔍 *No properties found* in ${location}.\n\n*We can find it for you!*\n\nReply *yes* to submit a custom search request.\n\nOr type *menu* to search again.`,
    });
    return;
  }

  const listings = result.listings.slice(0, 3);
  const count = listings.length;
  setData(phone, "results", JSON.stringify(listings));
  setStep(phone, "results");

  // Send each listing as photo + details
  for (let i = 0; i < count; i++) {
    const listing = listings[i];
    const price = listing.price ? formatPrice(listing.price, listing.listingType === "rent" ? "year" : "") : "Contact";
    const type = listing.listingType === "rent" ? "For Rent" : "For Sale";
    const link = `${CONFIG.publicUrl}/listings/${listing.id}`;
    const caption = `*${listing.title || "Property"}*
📍 ${listing.address || listing.city || "Kano"}
💰 ${price} · ${type}
🛏️ ${listing.bedrooms || "?"} bed | 🚿 ${listing.bathrooms || "?"} bath
🔗 ${link}`;

    const sent = await sendListingPhoto(sock, jid, listing, caption);
    if (!sent) {
      await sock.sendMessage(jid, { text: caption });
    }
  }

  // Send action prompt
  if (count === 1) {
    await sock.sendMessage(jid, { text: "_Reply *1* for full details, *yes* for custom request, or *menu* to search again._" });
  } else {
    await sock.sendMessage(jid, { text: `_Reply *1-${count}* for full details, *yes* for custom request, or *menu* to search again._` });
  }
}

// ============ Start ============
startBot().catch(err => { logger.error(err, "Bot crashed"); process.exit(1); });
