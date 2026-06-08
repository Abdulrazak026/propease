import { getResend, FROM_ADDRESS } from "../lib/resend";
import { templates as defaultTemplates } from "./email-templates";

const PLACEHOLDER_MAP: Record<string, string> = {
  name: "name", role: "role", propertyTitle: "propertyTitle", property_title: "propertyTitle",
  status: "status", senderName: "senderName", sender_name: "senderName", amount: "amount",
  reference: "reference", purpose: "purpose", listingId: "listingId", listing_id: "listingId",
  agentName: "agentName", agent_name: "agentName", clientName: "clientName", client_name: "clientName",
  clientContact: "clientContact", client_contact: "clientContact", message: "message",
  oldPrice: "oldPrice", old_price: "oldPrice", newPrice: "newPrice", new_price: "newPrice",
  token: "token", loginUrl: "loginUrl", login_url: "loginUrl", resetUrl: "resetUrl", reset_url: "resetUrl",
  reason: "reason", rating: "rating", comment: "comment", budget: "budget",
  propertyType: "propertyType", property_type: "propertyType", area: "area",
  taskTitle: "taskTitle", task_title: "taskTitle", authorName: "authorName", author_name: "authorName",
  dealTitle: "dealTitle", deal_title: "dealTitle", clientEmail: "clientEmail", client_email: "clientEmail",
  reset_token: "token",
};

const PLACEHOLDER_ORDER = [
  "name", "role", "propertyTitle", "status", "senderName", "amount", "reference", "purpose",
  "listingId", "agentName", "clientName", "clientContact", "message", "oldPrice", "newPrice",
  "token", "loginUrl", "resetUrl", "reason", "rating", "comment", "budget", "propertyType",
  "area", "taskTitle", "authorName", "dealTitle", "clientEmail",
];

async function getDbTemplate(key: string): Promise<string | null> {
  try {
    const prisma = (await import("../lib/prisma")).default;
    const row = await prisma.siteSettings.findUnique({ where: { key } });
    return row?.value || null;
  } catch { return null; }
}

function substitutePlaceholders(html: string, args: string[]): string {
  let result = html;
  for (let i = 0; i < args.length; i++) {
    if (i < PLACEHOLDER_ORDER.length) {
      const canonical = PLACEHOLDER_ORDER[i];
      const variants = [canonical];
      for (const [key, val] of Object.entries(PLACEHOLDER_MAP)) {
        if (val === canonical && key !== canonical) variants.push(key);
      }
      for (const v of variants) result = result.split(`{{${v}}}`).join(args[i] || "");
    }
  }
  return result;
}

async function getTemplate(key: string, ...args: string[]): Promise<string | null> {
  const dbTpl = await getDbTemplate(key);
  if (!dbTpl) return null;
  return substitutePlaceholders(dbTpl, args);
}

const UNSUB_URL = "https://mbpproperties.com/unsubscribe";

async function send(to: string, subject: string, html: string) {
  try {
    const resend = await getResend();
    const headers = { "List-Unsubscribe": `<${UNSUB_URL}>`, "List-Unsubscribe-Post": "List-Unsubscribe=One-Click" };
    const { data, error } = await resend.emails.send({ from: FROM_ADDRESS, to, subject, html, headers });
    if (error) console.error("[EMAIL ERROR]", error);
    else console.log("[EMAIL SENT]", subject, "→", to, "id:", data?.id);
    return { data, error };
  } catch (err) { console.error("[EMAIL EXCEPTION]", err); return { data: null, error: err as Error }; }
}

export const emailService = {
  async welcome(email: string, name: string) {
    const tpl = await getTemplate("welcome_template", name);
    const html = tpl || defaultTemplates.welcome(name);
    return send(email, "Welcome to MBPP!", html);
  },
  async accountApproved(email: string, name: string, role: string) {
    const tpl = await getTemplate("approved_template", name, role);
    const html = tpl || defaultTemplates.accountApproved(name, role);
    return send(email, `Your MBPP ${role} account has been approved!`, html);
  },
  async accountSuspended(email: string, name: string, reason?: string) {
    const tpl = await getTemplate("account_suspended_template", name, "", reason || "");
    const html = tpl || defaultTemplates.accountSuspended(name, reason);
    return send(email, "Your MBPP account has been suspended", html);
  },
  async passwordReset(email: string, name: string, token: string) {
    const tpl = await getTemplate("reset_template", name, "", "", "", "", "", "", "", "", "", "", "", "", "", token);
    const html = tpl || defaultTemplates.passwordReset(name, token);
    return send(email, "Reset your MBPP password", html);
  },
  async passwordChanged(email: string, name: string) {
    const tpl = await getTemplate("password_changed_template", name);
    const html = tpl || defaultTemplates.passwordChanged(name);
    return send(email, "Your MBPP password has been changed", html);
  },
  async inquiryNotification(agentEmail: string, agentName: string, clientName: string, propertyTitle: string, message: string) {
    const tpl = await getTemplate("inquiry_template", "", "", propertyTitle, "", "", "", "", "", agentName, clientName, "", message);
    const html = tpl || defaultTemplates.inquiryNotification(agentName, clientName, propertyTitle, message);
    return send(agentEmail, `New inquiry: ${propertyTitle}`, html);
  },
  async inquiryConfirmation(clientEmail: string, clientName: string, propertyTitle: string) {
    const tpl = await getTemplate("inquiry_template", clientName, "", propertyTitle);
    const html = tpl || defaultTemplates.inquiryConfirmation(clientName, propertyTitle);
    return send(clientEmail, "Your inquiry has been received", html);
  },
  async applicationReceived(email: string, name: string, propertyTitle: string) {
    const tpl = await getTemplate("application_template", name, "", propertyTitle);
    const html = tpl || defaultTemplates.applicationReceived(name, propertyTitle);
    return send(email, `Application received — ${propertyTitle}`, html);
  },
  async applicationStatus(email: string, name: string, propertyTitle: string, status: string) {
    const tpl = await getTemplate("application_template", name, "", propertyTitle, status);
    const html = tpl || defaultTemplates.applicationStatus(name, propertyTitle, status);
    return send(email, `Application ${status} — ${propertyTitle}`, html);
  },
  async agreementReady(email: string, name: string, propertyTitle: string) {
    const tpl = await getTemplate("agreement_template", name, "", propertyTitle);
    const html = tpl || defaultTemplates.agreementReady(name, propertyTitle);
    return send(email, "Tenancy agreement ready for signing", html);
  },
  async agreementSigned(email: string, name: string, propertyTitle: string) {
    const tpl = await getTemplate("agreement_signed_template", name, "", propertyTitle);
    const html = tpl || defaultTemplates.agreementSigned(name, propertyTitle);
    return send(email, "Agreement signed — complete!", html);
  },
  async priceDropAlert(email: string, name: string, propertyTitle: string, oldPrice: number, newPrice: number) {
    const tpl = await getTemplate("price_drop_template", name, "", propertyTitle, "", "", "", "", "", "", "", "", "", String(oldPrice), String(newPrice));
    const html = tpl || defaultTemplates.priceDropAlert(name, propertyTitle, oldPrice, newPrice);
    return send(email, `Price drop: ${propertyTitle}`, html);
  },
  async newMessage(email: string, name: string, senderName: string) {
    const tpl = await getTemplate("message_template", name, "", "", "", senderName);
    const html = tpl || defaultTemplates.newMessage(name, senderName);
    return send(email, `New message from ${senderName}`, html);
  },
  async paymentReceipt(email: string, name: string, amount: number, reference: string, purpose: string) {
    const tpl = await getTemplate("payment_template", name, "", "", "", "", String(amount), reference, purpose);
    const html = tpl || defaultTemplates.paymentReceipt(name, amount, reference, purpose);
    return send(email, "Payment receipt — MBPP", html);
  },
  async agentApplicationSubmitted(email: string, name: string) {
    const tpl = await getTemplate("agent_application_template", name);
    const html = tpl || defaultTemplates.agentApplicationSubmitted(name);
    return send(email, "Agent application received", html);
  },
  async listingPublished(email: string, agentName: string, propertyTitle: string, listingId: string) {
    const tpl = await getTemplate("listing_published_template", "", "", propertyTitle, "", "", "", "", listingId, agentName);
    const html = tpl || defaultTemplates.listingPublished(agentName, propertyTitle, listingId);
    return send(email, "Your listing is live!", html);
  },
  async verificationSubmitted(email: string, name: string) {
    const tpl = await getTemplate("verification_template", name);
    const html = tpl || defaultTemplates.verificationSubmitted(name);
    return send(email, "Verification documents received", html);
  },
  async contactFormSubmission(data: { name: string; email: string; phone: string; subject: string; message: string }) {
    const supportEmail = process.env.SUPPORT_EMAIL || "support@mbpproperties.com";
    const html = `<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:600px;margin:0 auto;color:#334155">
      <p style="font-size:14px;margin:0 0 16px">New contact form submission from <strong>${data.name}</strong>.</p>
      <table style="width:100%;border-collapse:collapse;background:#f8fafc;border-radius:8px;overflow:hidden">
        <tr><td style="padding:10px 16px;font-size:13px;font-weight:600;color:#64748b;width:100px;border-bottom:1px solid #e2e8f0">Name</td><td style="padding:10px 16px;font-size:13px;border-bottom:1px solid #e2e8f0">${data.name}</td></tr>
        <tr><td style="padding:10px 16px;font-size:13px;font-weight:600;color:#64748b;border-bottom:1px solid #e2e8f0">Email</td><td style="padding:10px 16px;font-size:13px;border-bottom:1px solid #e2e8f0"><a href="mailto:${data.email}">${data.email}</a></td></tr>
        <tr><td style="padding:10px 16px;font-size:13px;font-weight:600;color:#64748b;border-bottom:1px solid #e2e8f0">Phone</td><td style="padding:10px 16px;font-size:13px;border-bottom:1px solid #e2e8f0">${data.phone || "Not provided"}</td></tr>
        <tr><td style="padding:10px 16px;font-size:13px;font-weight:600;color:#64748b">Subject</td><td style="padding:10px 16px;font-size:13px">${data.subject}</td></tr>
      </table>
      <div style="margin-top:16px;padding:16px;background:#f8fafc;border-radius:8px;border-left:3px solid #0d6e4e">
        <p style="font-size:13px;color:#64748b;margin:0 0 4px;font-weight:600">Message</p>
        <p style="white-space:pre-wrap;margin:0;font-size:14px;line-height:1.6">${data.message}</p>
      </div>
    </div>`;
    return send(supportEmail, `New inquiry from ${data.name}: ${data.subject}`, html);
  },
  async withdrawalRequested(email: string, name: string, amount: number) {
    const tpl = await getTemplate("withdrawal_requested_template", name, String(amount));
    const html = tpl || defaultTemplates.withdrawalRequested(name, amount);
    return send(email, `Withdrawal request submitted — ₦${amount.toLocaleString()}`, html);
  },
  async withdrawalApproved(email: string, name: string, amount: number) {
    const tpl = await getTemplate("withdrawal_approved_template", name, String(amount));
    const html = tpl || defaultTemplates.withdrawalApproved(name, amount);
    return send(email, `Withdrawal approved — ₦${amount.toLocaleString()}`, html);
  },
  async withdrawalRejected(email: string, name: string, amount: number, reason?: string) {
    const tpl = await getTemplate("withdrawal_rejected_template", name, String(amount), reason || "");
    const html = tpl || defaultTemplates.withdrawalRejected(name, amount, reason);
    return send(email, `Withdrawal rejected — ₦${amount.toLocaleString()}`, html);
  },
  async listingSubmittedForReview(email: string, name: string, title: string) {
    const tpl = await getTemplate("listing_submitted_template", name, "", title);
    const html = tpl || defaultTemplates.listingSubmittedForReview(name, title);
    return send(email, `Listing submitted for review: ${title}`, html);
  },
  async listingRejected(email: string, name: string, title: string) {
    const tpl = await getTemplate("listing_rejected_template", name, "", title);
    const html = tpl || defaultTemplates.listingRejected(name, title);
    return send(email, `Listing needs revision: ${title}`, html);
  },
  async commissionEarned(email: string, name: string, amount: number, dealTitle: string) {
    const tpl = await getTemplate("commission_template", name, String(amount), dealTitle);
    const html = tpl || defaultTemplates.commissionEarned(name, amount, dealTitle);
    return send(email, `Commission earned: ₦${amount.toLocaleString()}`, html);
  },
  async walletFunded(email: string, name: string, amount: number, reference: string) {
    const tpl = await getTemplate("wallet_template", name, String(amount), reference);
    const html = tpl || defaultTemplates.walletFunded(name, amount, reference);
    return send(email, `Wallet funded — ₦${amount.toLocaleString()}`, html);
  },
  async taskAssigned(email: string, name: string, taskTitle: string, area: string) {
    const tpl = await getTemplate("task_assigned_template", name, taskTitle, area);
    const html = tpl || defaultTemplates.taskAssigned(name, taskTitle, area);
    return send(email, `New task assigned: ${taskTitle}`, html);
  },
  async taskStatusChanged(email: string, name: string, taskTitle: string, status: string) {
    const tpl = await getTemplate("task_status_template", name, taskTitle, status);
    const html = tpl || defaultTemplates.taskStatusChanged(name, taskTitle, status);
    return send(email, `Task updated: ${taskTitle}`, html);
  },
  async taskCommentAdded(email: string, name: string, taskTitle: string, authorName: string) {
    const tpl = await getTemplate("task_comment_template", name, taskTitle, authorName);
    const html = tpl || defaultTemplates.taskCommentAdded(name, taskTitle, authorName);
    return send(email, `New comment on: ${taskTitle}`, html);
  },
  async reviewSubmitted(agentEmail: string, agentName: string, rating: number, comment: string) {
    const tpl = await getTemplate("review_submitted_template", agentName, String(rating), comment);
    const html = tpl || defaultTemplates.reviewSubmitted(agentName, rating, comment);
    return send(agentEmail, `New review: ${rating}/5 stars`, html);
  },
  async reviewModerated(email: string, name: string, status: string) {
    const tpl = await getTemplate("review_moderated_template", name, status);
    const html = tpl || defaultTemplates.reviewModerated(name, status);
    return send(email, `Review ${status}`, html);
  },
  async agreementCancelled(email: string, name: string, propertyTitle: string) {
    const tpl = await getTemplate("agreement_cancelled_template", name, "", propertyTitle);
    const html = tpl || defaultTemplates.agreementCancelled(name, propertyTitle);
    return send(email, `Agreement cancelled: ${propertyTitle}`, html);
  },
  async customOrderReceived(name: string, email: string, propertyType: string, area: string, budget: number) {
    const supportEmail = process.env.SUPPORT_EMAIL || "support@mbpproperties.com";
    const tpl = await getTemplate("custom_order_template", name, email, propertyType, area, String(budget));
    const html = tpl || defaultTemplates.customOrderReceived(name, email, propertyType, area, budget);
    return send(supportEmail, `New custom order — ${propertyType} in ${area}`, html);
  },
  async sendNewsletter(email: string, subject: string, html: string) {
    return send(email, subject, html);
  },
};
