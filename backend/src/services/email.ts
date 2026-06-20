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
    return send(email, "Welcome to MBPP!", defaultTemplates.welcome(name));
  },
  async accountApproved(email: string, name: string, role: string) {
    return send(email, `Your MBPP ${role} account has been approved!`, defaultTemplates.accountApproved(name, role));
  },
  async accountSuspended(email: string, name: string, reason?: string) {
    return send(email, "Your MBPP account has been suspended", defaultTemplates.accountSuspended(name, reason));
  },
  async passwordReset(email: string, name: string, token: string) {
    return send(email, "Reset your MBPP password", defaultTemplates.passwordReset(name, token));
  },
  async passwordChanged(email: string, name: string) {
    return send(email, "Your MBPP password has been changed", defaultTemplates.passwordChanged(name));
  },
  async inquiryNotification(agentEmail: string, agentName: string, clientName: string, propertyTitle: string, message: string) {
    return send(agentEmail, `New inquiry: ${propertyTitle}`, defaultTemplates.inquiryNotification(agentName, clientName, propertyTitle, message));
  },
  async inquiryConfirmation(clientEmail: string, clientName: string, propertyTitle: string) {
    return send(clientEmail, "Your inquiry has been received", defaultTemplates.inquiryConfirmation(clientName, propertyTitle));
  },
  async applicationReceived(email: string, name: string, propertyTitle: string) {
    return send(email, `Application received — ${propertyTitle}`, defaultTemplates.applicationReceived(name, propertyTitle));
  },
  async applicationStatus(email: string, name: string, propertyTitle: string, status: string) {
    return send(email, `Application ${status} — ${propertyTitle}`, defaultTemplates.applicationStatus(name, propertyTitle, status));
  },
  async agreementReady(email: string, name: string, propertyTitle: string) {
    return send(email, "Tenancy agreement ready for signing", defaultTemplates.agreementReady(name, propertyTitle));
  },
  async agreementSigned(email: string, name: string, propertyTitle: string) {
    return send(email, "Agreement signed — complete!", defaultTemplates.agreementSigned(name, propertyTitle));
  },
  async priceDropAlert(email: string, name: string, propertyTitle: string, oldPrice: number, newPrice: number) {
    return send(email, `Price drop: ${propertyTitle}`, defaultTemplates.priceDropAlert(name, propertyTitle, oldPrice, newPrice));
  },
  async newMessage(email: string, name: string, senderName: string) {
    return send(email, `New message from ${senderName}`, defaultTemplates.newMessage(name, senderName));
  },
  async paymentReceipt(email: string, name: string, amount: number, reference: string, purpose: string) {
    return send(email, "Payment receipt — MBPP", defaultTemplates.paymentReceipt(name, amount, reference, purpose));
  },
  async agentApplicationSubmitted(email: string, name: string) {
    return send(email, "Agent application received", defaultTemplates.agentApplicationSubmitted(name));
  },
  async listingPublished(email: string, agentName: string, propertyTitle: string, listingId: string) {
    return send(email, "Your listing is live!", defaultTemplates.listingPublished(agentName, propertyTitle, listingId));
  },
  async verificationSubmitted(email: string, name: string) {
    return send(email, "Verification documents received", defaultTemplates.verificationSubmitted(name));
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
    return send(email, `Withdrawal request submitted — ₦${amount.toLocaleString()}`, defaultTemplates.withdrawalRequested(name, amount));
  },
  async withdrawalApproved(email: string, name: string, amount: number) {
    return send(email, `Withdrawal approved — ₦${amount.toLocaleString()}`, defaultTemplates.withdrawalApproved(name, amount));
  },
  async withdrawalRejected(email: string, name: string, amount: number, reason?: string) {
    return send(email, `Withdrawal rejected — ₦${amount.toLocaleString()}`, defaultTemplates.withdrawalRejected(name, amount, reason));
  },
  async listingSubmittedForReview(email: string, name: string, title: string) {
    return send(email, `Listing submitted for review: ${title}`, defaultTemplates.listingSubmittedForReview(name, title));
  },
  async listingRejected(email: string, name: string, title: string) {
    return send(email, `Listing needs revision: ${title}`, defaultTemplates.listingRejected(name, title));
  },
  async commissionEarned(email: string, name: string, amount: number, dealTitle: string) {
    return send(email, `Commission earned: ₦${amount.toLocaleString()}`, defaultTemplates.commissionEarned(name, amount, dealTitle));
  },
  async walletFunded(email: string, name: string, amount: number, reference: string) {
    return send(email, `Wallet funded — ₦${amount.toLocaleString()}`, defaultTemplates.walletFunded(name, amount, reference));
  },
  async taskAssigned(email: string, name: string, taskTitle: string, area: string) {
    return send(email, `New task assigned: ${taskTitle}`, defaultTemplates.taskAssigned(name, taskTitle, area));
  },
  async taskStatusChanged(email: string, name: string, taskTitle: string, status: string) {
    return send(email, `Task updated: ${taskTitle}`, defaultTemplates.taskStatusChanged(name, taskTitle, status));
  },
  async taskCommentAdded(email: string, name: string, taskTitle: string, authorName: string) {
    return send(email, `New comment on: ${taskTitle}`, defaultTemplates.taskCommentAdded(name, taskTitle, authorName));
  },
  async reviewSubmitted(agentEmail: string, agentName: string, rating: number, comment: string) {
    return send(agentEmail, `New review: ${rating}/5 stars`, defaultTemplates.reviewSubmitted(agentName, rating, comment));
  },
  async reviewModerated(email: string, name: string, status: string) {
    return send(email, `Review ${status}`, defaultTemplates.reviewModerated(name, status));
  },
  async agreementCancelled(email: string, name: string, propertyTitle: string) {
    return send(email, `Agreement cancelled: ${propertyTitle}`, defaultTemplates.agreementCancelled(name, propertyTitle));
  },
  async customOrderReceived(name: string, email: string, propertyType: string, area: string, budget: number) {
    const supportEmail = process.env.SUPPORT_EMAIL || "support@mbpproperties.com";
    return send(supportEmail, `New custom order — ${propertyType} in ${area}`, defaultTemplates.customOrderReceived(name, email, propertyType, area, budget));
  },
  async sendNewsletter(email: string, subject: string, html: string) {
    return send(email, subject, html);
  },
  async supportMessage(email: string, name: string, message: string) {
    return send(email, "Message from MBPP Support", defaultTemplates.supportMessage(name, message));
  },
  async reservationConfirmed(email: string, name: string, propertyTitle: string, meetingDate: string, meetingTime: string) {
    return send(email, `Reservation Confirmed — ${propertyTitle}`, defaultTemplates.reservationConfirmed(name, propertyTitle, meetingDate, meetingTime));
  },
  async reservationRejected(email: string, name: string, propertyTitle: string, reason: string) {
    return send(email, `Reservation Update — ${propertyTitle}`, defaultTemplates.reservationRejected(name, propertyTitle, reason));
  },
  async reservationCancelled(email: string, name: string, propertyTitle: string, refundAmount: number, depositAmount: number) {
    return send(email, `Reservation Cancelled — ${propertyTitle}`, defaultTemplates.reservationCancelled(name, propertyTitle, refundAmount, depositAmount));
  },
  async reservationRescheduled(email: string, name: string, propertyTitle: string, oldDate: string, oldTime: string, newDate: string, newTime: string) {
    return send(email, `Reservation Rescheduled — ${propertyTitle}`, defaultTemplates.reservationRescheduled(name, propertyTitle, oldDate, oldTime, newDate, newTime));
  },
  async adminReservationCancelled(email: string, name: string, propertyTitle: string, reason: string, refundAmount: number) {
    return send(email, `Reservation Cancelled by Admin — ${propertyTitle}`, defaultTemplates.adminReservationCancelled(name, propertyTitle, reason, refundAmount));
  },
};
