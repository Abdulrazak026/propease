// ============================================
// WhatsApp Bot Logic — Conversation Flows
// Handles all interactive conversations
// ============================================

import { sendText, sendButtons, sendList, sendImage } from "./whatsapp-cloud";
import { logger } from "../lib/logger";
import * as fs from "fs";

const API = process.env.API_URL || "http://localhost:4000";
const PUBLIC_URL = process.env.PUBLIC_URL || "https://mbpproperties.com";

// ============ Session Store ============
const sessions = new Map<string, { step: string; data: Record<string, string>; updatedAt: number }>();

export function getStep(phone: string): string {
  const s = sessions.get(phone);
  if (!s) return "menu";
  if (Date.now() - s.updatedAt > 30 * 60 * 1000) { sessions.delete(phone); return "menu"; }
  return s.step;
}

export function setStep(phone: string, step: string) {
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
  const link = `${PUBLIC_URL}/listings/${item.id}`;
  return `🏠 *${item.title || "Property"}*

💰 *Price:* ${price}
📍 *Location:* ${item.city || "Kano"}${item.address ? ", " + item.address : ""}
🏷️ *Type:* ${type}
🛏️ *Bedrooms:* ${item.bedrooms || "N/A"} | 🚿 *Bathrooms:* ${item.bathrooms || "N/A"}
${item.size ? `📐 *Size:* ${item.size}\n` : ""}
${item.features && item.features.length > 0 ? `⚡ *Features:* ${Array.isArray(item.features) ? item.features.join(", ") : item.features}\n` : ""}
🔗 *View online:* ${link}
👤 *Agent:* ${item.postedBy?.name || "MBPP Team"}`;
}

// ============ Send Message + Save to DB ============
async function saveBotMessage(phone: string, text: string) {
  try {
    await fetch(`${API}/api/whatsapp/message`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, name: "MBPP Bot", message: text, direction: "outgoing", fromBot: true }),
    }).catch(() => {});
  } catch {}
}

// Wrapper for sendText that also saves to DB
async function sendTextAndSave(to: string, text: string) {
  await sendText(to, text);
  await saveBotMessage(to, text.substring(0, 2000));
}

// Wrapper for sendButtons that also saves to DB
async function sendButtonsAndSave(to: string, text: string, buttons: any[]) {
  await sendButtons(to, text, buttons);
  const buttonText = buttons.map(b => b.title).join(" | ");
  await saveBotMessage(to, `[Buttons] ${text}\n${buttonText}`);
}

// ============ Main Menu (with buttons) ============

async function sendMainMenu(to: string) {
  await sendButtonsAndSave(to,
    "🏠 Welcome to MBPP Properties!\n\nWhat are you looking for?",
    [
      { id: "buy", title: "🏠 Buy Property" },
      { id: "rent", title: "🏡 Rent Property" },
      { id: "sell", title: "💰 Sell Property" },
    ]
  );
}

async function sendMoreOptions(to: string) {
  await sendButtons(to,
    "More options:",
    [
      { id: "agent", title: "🤝 Become Agent" },
      { id: "support", title: "👤 Talk to Support" },
      { id: "back_main", title: "← Back" },
    ]
  );
}

// ============ Budget Selector (with buttons) ============

async function sendBudgetSelector(to: string) {
  await sendButtonsAndSave(to,
    "💰 What's your budget?",
    [
      { id: "budget_0_5m", title: "Under ₦5M" },
      { id: "budget_5_10m", title: "₦5M – ₦10M" },
      { id: "budget_any", title: "Any Budget" },
    ]
  );
}

// ============ Bedroom Selector (with buttons) ============

async function sendBedroomSelector(to: string) {
  await sendButtonsAndSave(to,
    "🛏️ How many bedrooms?",
    [
      { id: "beds_2", title: "2 Bedrooms" },
      { id: "beds_3", title: "3 Bedrooms" },
      { id: "beds_any", title: "Any" },
    ]
  );
}

// ============ Sell Type Selector (with buttons) ============

async function sendSellTypeSelector(to: string) {
  await sendButtonsAndSave(to,
    "💰 What type of property?",
    [
      { id: "sell_house", title: "🏠 House" },
      { id: "sell_flat", title: "🏢 Flat" },
      { id: "sell_land", title: "🏗️ Land" },
    ]
  );
}

// ============ Detail Actions (with buttons) ============

async function sendDetailActions(to: string) {
  await sendButtonsAndSave(to,
    "What would you like to do?",
    [
      { id: "view", title: "📅 Schedule Viewing" },
      { id: "ask", title: "💬 Ask a Question" },
      { id: "back_menu", title: "🔄 Back to Menu" },
    ]
  );
}

// ============ Send Photo Helper ============

async function sendListingPhoto(to: string, listing: any, caption: string) {
  const photoUrl = listing.photos?.[0]?.url;
  if (!photoUrl) return false;

  let resolved = photoUrl;
  if (!photoUrl.startsWith("http")) {
    resolved = `${PUBLIC_URL}${photoUrl.startsWith("/") ? "" : "/"}${photoUrl}`;
  }

  try {
    await sendImage(to, resolved, caption);
    return true;
  } catch {
    return false;
  }
}

// ============ Conversation Handler ============

export async function handleWhatsAppMessage(
  phone: string,
  name: string,
  text: string
): Promise<void> {
  const to = phone;
  const t = text.trim().toLowerCase();
  const num = t === "1" ? 1 : t === "2" ? 2 : t === "3" ? 3 : t === "4" ? 4 : t === "5" ? 5 : 0;
  const step = getStep(phone);

  // Cancel / Menu triggers
  if (t === "cancel" || t === "back" || t === "menu" || t === "back_main" || t === "back_menu") {
    setStep(phone, "menu");
    await sendMainMenu(to);
    return;
  }

  if (t === "hi" || t === "hello" || t === "hey" || t === "start" || t === "help") {
    setStep(phone, "menu");
    await sendMainMenu(to);
    return;
  }

  // === MAIN MENU ===
  if (step === "menu") {
    if (num === 1 || t === "buy") {
      setStep(phone, "buy_location");
      await sendTextAndSave(to, "🏠 *Find a Property to Buy*\n\nWhich area are you interested in?\nExamples: \"GRA Kano\", \"Nassarawa\", \"Tarauni\"\n\n_Type the area name._");
      return;
    }
    if (num === 2 || t === "rent") {
      setStep(phone, "buy_location");
      await sendTextAndSave(to, "🏡 *Find a Property to Rent*\n\nWhich area are you interested in?\nExamples: \"GRA Kano\", \"Nassarawa\", \"Tarauni\"\n\n_Type the area name._");
      return;
    }
    if (num === 3 || t === "sell") {
      setStep(phone, "sell_type");
      await sendSellTypeSelector(to);
      return;
    }
    if (num === 4 || t === "agent") {
      setStep(phone, "menu");
      await sendTextAndSave(to, "🤝 *Become an MBPP Agent*\n\nApply here: https://mbpproperties.com/apply-as-agent\n\nReviewed within 48 hours.");
      return;
    }
    if (num === 5 || t === "support") {
      setStep(phone, "menu");
      await sendText(to, "👤 *Connecting you with support...*\n\n📞 +234 707 422 2284\n\nAn agent will message you shortly.");
      return;
    }
    await sendMainMenu(to);
    return;
  }

  // === BUY LOCATION ===
  if (step === "buy_location") {
    setData(phone, "location", text);
    setStep(phone, "buy_budget");
    await sendBudgetSelector(to);
    return;
  }

  // === BUY BUDGET ===
  if (step === "buy_budget") {
    let budget = "any";
    if (t === "budget_0_5m" || num === 1) budget = "0-5M";
    else if (t === "budget_5_10m" || num === 2) budget = "5-10M";
    else if (t === "budget_10_20m" || num === 3) budget = "10-20M";
    else if (t === "budget_20m_plus" || num === 4) budget = "20M+";
    else if (t === "budget_any" || num === 5) budget = "any";
    else budget = t;

    setData(phone, "budget", budget);
    setStep(phone, "buy_bedrooms");
    await sendBedroomSelector(to);
    return;
  }

  // === BUY BEDROOMS ===
  if (step === "buy_bedrooms") {
    let beds = "any";
    if (t === "beds_2" || num === 1) beds = "2";
    else if (t === "beds_3" || num === 2) beds = "3";
    else if (t === "beds_any" || num === 4) beds = "any";
    else beds = t;

    setData(phone, "bedrooms", beds);
    await performSearch(to, phone);
    return;
  }

  // === RESULTS ===
  if (step === "results") {
    const results = getData(phone).results ? JSON.parse(getData(phone).results) : [];

    if (num >= 1 && num <= Math.min(3, results.length)) {
      const listing = results[num - 1];
      setData(phone, "selectedListing", JSON.stringify(listing));
      setStep(phone, "detail");
      await sendText(to, formatDetail(listing));
      await sendListingPhoto(to, listing, `📷 ${listing.title}`);
      await sendDetailActions(to);
      return;
    }
    if (t === "yes" || t.includes("custom") || t.includes("request")) {
      setStep(phone, "custom_request");
      await sendText(to, "📝 *Custom Search Request*\n\nTell us:\n1. Your name\n2. What you're looking for\n3. Your phone number\n\n_Type everything in one message._");
      return;
    }
    if (num === 0 && t !== "menu") {
      await sendText(to, "Reply 1-3 for details, yes for custom request, or menu to search again.");
      return;
    }
  }

  // === DETAIL ACTIONS ===
  if (step === "detail") {
    if (num === 1 || t === "view" || t.includes("view") || t.includes("📅")) {
      setStep(phone, "viewing_input");
      await sendText(to, "📅 *Schedule a Viewing*\n\nPreferred date/time? (e.g. 'Tomorrow 2pm')\nYour name and phone number?\n\n_Type everything in one message._");
      return;
    }
    if (num === 2 || t === "ask" || t.includes("ask") || t.includes("inquiry")) {
      setStep(phone, "inquiry_question");
      await sendText(to, "💬 *Ask a Question*\n\nType your question about this property.");
      return;
    }
    if (num === 3 || t === "back" || t === "back_menu") {
      setStep(phone, "menu");
      await sendMainMenu(to);
      return;
    }
    await sendDetailActions(to);
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
    await sendText(to, `✅ *Viewing request received!*\n\n📅 ${text}\n\nOur team will confirm within 24 hours.\n📞 +234 707 422 2284\n\nType *menu* to continue.`);
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
    await sendText(to, `✅ *Inquiry submitted!*\n\nOur team will respond within 24 hours.\n📞 +234 707 422 2284\n\nType *menu* to continue.`);
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
    await sendText(to, `✅ *Request submitted!*\n\nOur team will search for matching properties and contact you within 24 hours.\n📞 +234 707 422 2284\n\nType *menu* to continue.`);
    return;
  }

  // === SELL FLOW ===
  if (step === "sell_type") {
    let sellType = "House";
    if (t === "sell_house" || num === 1) sellType = "House";
    else if (t === "sell_flat" || num === 2) sellType = "Flat";
    else if (t === "sell_land" || num === 3) sellType = "Land";
    else if (t === "sell_commercial" || num === 4) sellType = "Commercial";
    else sellType = t;

    setData(phone, "sellType", sellType);
    setStep(phone, "sell_location");
    await sendText(to, "📍 *Where is the property?*\n\nType the area/city name.\nExample: \"GRA Kano\" or \"Nassarawa\"");
    return;
  }

  if (step === "sell_location") {
    setData(phone, "sellLocation", text);
    setStep(phone, "sell_price");
    await sendText(to, "💰 *Asking price?*\nType amount. Example: \"15000000\" for ₦15M");
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
    await sendText(to, "✅ *Property details collected!*\n\nA representative will contact you within 24 hours.\n📞 +234 707 422 2284\n\nType *menu* to continue.");
    return;
  }

  // Fallback
  setStep(phone, "menu");
  await sendMainMenu(to);
}

// ============ Property Search ============

async function performSearch(to: string, phone: string) {
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
    await sendText(to, `🔍 *No properties found* in ${location}.\n\n*We can find it for you!*\n\nReply *yes* to submit a custom search request.\nOr type *menu* to search again.`);
    return;
  }

  const listings = result.listings.slice(0, 3);
  const count = listings.length;
  setData(phone, "results", JSON.stringify(listings));
  setStep(phone, "results");

  for (let i = 0; i < count; i++) {
    const listing = listings[i];
    const price = listing.price ? formatPrice(listing.price, listing.listingType === "rent" ? "year" : "") : "Contact";
    const type = listing.listingType === "rent" ? "For Rent" : "For Sale";
    const link = `${PUBLIC_URL}/listings/${listing.id}`;
    const caption = `*${listing.title || "Property"}*
📍 ${listing.address || listing.city || "Kano"}
💰 ${price} · ${type}
🛏️ ${listing.bedrooms || "?"} bed | 🚿 ${listing.bathrooms || "?"} bath
🔗 ${link}`;

    const sent = await sendListingPhoto(to, listing, caption);
    if (!sent) {
      await sendText(to, caption);
    }
  }

  if (count === 1) {
    await sendText(to, "_Reply *1* for full details, *yes* for custom request, or *menu* to search again._");
  } else {
    await sendText(to, `_Reply *1-${count}* for full details, *yes* for custom request, or *menu* to search again._`);
  }
}
