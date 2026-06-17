// ============================================
// MBPP WhatsApp Bot — Configuration
// ============================================

export const CONFIG = {
  apiUrl: process.env.API_URL || "http://localhost:4000",
  botName: "MBPP Bot",
  adminNumber: process.env.ADMIN_NUMBER || "",

  // Rate limiting
  messageDelay: 1500,      // ms between messages
  cooldownPerUser: 3000,   // ms cooldown per user

  // Session
  sessionDir: process.env.SESSION_DIR || "./sessions",

  // Welcome message
  welcomeMessage: `🏠 *MBPP Properties WhatsApp Bot*

Discover verified properties in Kano.

🔍 *Quick Commands:*
• Type your search: "2 bedroom house in Kano"
• *help* — See all commands
• *listings* — Browse latest properties
• *agents* — Meet our team
• *sell* — List your property

How can I help you today?`
};
