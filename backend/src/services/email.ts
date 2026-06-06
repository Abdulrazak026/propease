import { getResend, FROM_ADDRESS } from "../lib/resend";
import { templates as defaultTemplates } from "./email-templates";

async function getDbTemplate(key: string): Promise<string | null> {
  try {
    const prisma = (await import("../lib/prisma")).default;
    const row = await prisma.siteSettings.findUnique({ where: { key } });
    return row?.value || null;
  } catch {
    return null;
  }
}

async function getTemplate(key: string, ...args: string[]): Promise<string> {
  const dbTpl = await getDbTemplate(key);
  if (dbTpl) {
    let result = dbTpl;
    args.forEach((arg, i) => {
      const placeholders = ["name", "role", "propertyTitle", "status", "senderName", "amount", "reference", "purpose", "listingId", "agentName", "clientName", "clientContact", "message", "oldPrice", "newPrice", "token", "loginUrl", "resetUrl"];
      if (placeholders[i]) result = result.split(`{{${placeholders[i]}}}`).join(arg || "");
    });
    return result;
  }
  return "";
}

async function send(to: string, subject: string, html: string) {
  try {
    const resend = await getResend();
    const { data, error } = await resend.emails.send({ from: FROM_ADDRESS, to, subject, html });
    if (error) console.error("[EMAIL ERROR]", error);
    else console.log("[EMAIL SENT]", subject, "→", to, "id:", data?.id);
    return { data, error };
  } catch (err) {
    console.error("[EMAIL EXCEPTION]", err);
    return { data: null, error: err as Error };
  }
}

export const emailService = {
  async welcome(email: string, name: string) {
    const tpl = await getTemplate("welcome_template", name);
    const html = tpl || defaultTemplates.welcome(name);
    return send(email, "Welcome to MBPP — Account Pending Review", html);
  },
  async accountApproved(email: string, name: string, role: string) {
    const tpl = await getTemplate("approved_template", name, role);
    const html = tpl || defaultTemplates.accountApproved(name, role);
    return send(email, "Your MBPP account has been approved!", html);
  },
  async passwordReset(email: string, name: string, token: string) {
    const tpl = await getTemplate("reset_template", name, token);
    const html = tpl || defaultTemplates.passwordReset(name, token);
    return send(email, "Reset your MBPP password", html);
  },
  async inquiryNotification(agentEmail: string, agentName: string, clientName: string, propertyTitle: string, message: string) {
    const tpl = await getTemplate("inquiry_template", agentName, clientName, propertyTitle, message);
    const html = tpl || defaultTemplates.inquiryNotification(agentName, clientName, propertyTitle, message);
    return send(agentEmail, `New inquiry: ${propertyTitle}`, html);
  },
  async inquiryConfirmation(clientEmail: string, clientName: string, propertyTitle: string) {
    const tpl = await getTemplate("inquiry_template", clientName, clientName, propertyTitle, "");
    const html = tpl || defaultTemplates.inquiryConfirmation(clientName, propertyTitle);
    return send(clientEmail, "Your inquiry has been received", html);
  },
  async applicationReceived(email: string, name: string, propertyTitle: string) {
    const tpl = await getTemplate("application_template", name, propertyTitle);
    const html = tpl || defaultTemplates.applicationReceived(name, propertyTitle);
    return send(email, "Application received — " + propertyTitle, html);
  },
  async applicationStatus(email: string, name: string, propertyTitle: string, status: string) {
    const tpl = await getTemplate("application_template", name, propertyTitle, status);
    const html = tpl || defaultTemplates.applicationStatus(name, propertyTitle, status);
    return send(email, `Application ${status} — ${propertyTitle}`, html);
  },
  async agreementReady(email: string, name: string, propertyTitle: string) {
    const tpl = await getTemplate("agreement_template", name, propertyTitle);
    const html = tpl || defaultTemplates.agreementReady(name, propertyTitle);
    return send(email, "Tenancy agreement ready for signing", html);
  },
  async agreementSigned(email: string, name: string, propertyTitle: string) {
    const tpl = await getTemplate("agreement_template", name, propertyTitle);
    const html = tpl || defaultTemplates.agreementSigned(name, propertyTitle);
    return send(email, "Agreement signed — complete!", html);
  },
  async priceDropAlert(email: string, name: string, propertyTitle: string, oldPrice: number, newPrice: number) {
    const tpl = await getTemplate("price_drop_template", name, propertyTitle, String(oldPrice), String(newPrice));
    const html = tpl || defaultTemplates.priceDropAlert(name, propertyTitle, oldPrice, newPrice);
    return send(email, `Price drop: ${propertyTitle}`, html);
  },
  async newMessage(email: string, name: string, senderName: string) {
    const tpl = await getTemplate("message_template", name, senderName);
    const html = tpl || defaultTemplates.newMessage(name, senderName);
    return send(email, `New message from ${senderName}`, html);
  },
  async paymentReceipt(email: string, name: string, amount: number, reference: string, purpose: string) {
    const tpl = await getTemplate("payment_template", name, String(amount), reference, purpose);
    const html = tpl || defaultTemplates.paymentReceipt(name, amount, reference, purpose);
    return send(email, "Payment receipt — MBPP", html);
  },
  async agentApplicationSubmitted(email: string, name: string) {
    const tpl = await getTemplate("agent_application_template", name);
    const html = tpl || defaultTemplates.agentApplicationSubmitted(name);
    return send(email, "Agent application received", html);
  },
  async listingPublished(email: string, agentName: string, propertyTitle: string, listingId: string) {
    const tpl = await getTemplate("listing_published_template", agentName, propertyTitle, listingId);
    const html = tpl || defaultTemplates.listingPublished(agentName, propertyTitle, listingId);
    return send(email, "Your listing is live!", html);
  },
  async verificationSubmitted(email: string, name: string) {
    const tpl = await getTemplate("verification_template", name);
    const html = tpl || defaultTemplates.verificationSubmitted(name);
    return send(email, "Verification documents received", html);
  },
};
