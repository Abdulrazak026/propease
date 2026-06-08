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

async function getTemplate(key: string, ...args: string[]): Promise<string | null> {
  const dbTpl = await getDbTemplate(key);
  if (!dbTpl) return null;
  let result = dbTpl;
  args.forEach((arg, i) => {
    const placeholders = ["name", "role", "propertyTitle", "status", "senderName", "amount", "reference", "purpose", "listingId", "agentName", "clientName", "clientContact", "message", "oldPrice", "newPrice", "token", "loginUrl", "resetUrl"];
    if (placeholders[i]) result = result.split(`{{${placeholders[i]}}}`).join(arg || "");
  });
  return result;
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
    return send(email, tpl ? "Welcome to MBPP" : "Welcome to MBPP", html);
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
    return send(email, tpl ? "Agent Application Received" : "Agent application received", html);
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
  async contactFormSubmission(data: { name: string; email: string; phone: string; subject: string; message: string }) {
    const supportEmail = process.env.SUPPORT_EMAIL || "support@mbpproperties.com";
    const { templates } = await import("./email-templates");
    const html = (templates as any).customOrderReceived
      ? `<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:600px;margin:0 auto;color:#334155">
        <p style="font-size:14px;margin:0 0 16px">You have a new contact form submission from <strong>${data.name}</strong>.</p>
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
        <p style="font-size:12px;color:#94a3b8;margin-top:16px">This message was sent via the MBPP contact form.</p>
      </div>`
      : `<div style="font-family:sans-serif;max-width:600px;margin:0 auto"><h2>New Contact Form Submission</h2><p><strong>${data.name}</strong> (${data.email}) sent a message:</p><p>${data.message}</p></div>`;
    return send(supportEmail, `New inquiry from ${data.name}: ${data.subject}`, html);
  },

  // --- NEW TRIGGERS ---

  async withdrawalRequested(email: string, name: string, amount: number) {
    const html = defaultTemplates.withdrawalRequested(name, amount);
    return send(email, `Withdrawal request submitted \u2014 \u20A6${amount.toLocaleString()}`, html);
  },
  async withdrawalApproved(email: string, name: string, amount: number) {
    const html = defaultTemplates.withdrawalApproved(name, amount);
    return send(email, `Withdrawal approved \u2014 \u20A6${amount.toLocaleString()}`, html);
  },
  async withdrawalRejected(email: string, name: string, amount: number, reason?: string) {
    const html = defaultTemplates.withdrawalRejected(name, amount, reason);
    return send(email, `Withdrawal rejected \u2014 \u20A6${amount.toLocaleString()}`, html);
  },
  async listingSubmittedForReview(email: string, name: string, title: string) {
    const html = defaultTemplates.listingSubmittedForReview(name, title);
    return send(email, `Listing submitted for review: ${title}`, html);
  },
  async listingRejected(email: string, name: string, title: string) {
    const html = defaultTemplates.listingRejected(name, title);
    return send(email, `Listing needs revision: ${title}`, html);
  },
  async commissionEarned(email: string, name: string, amount: number, dealTitle: string) {
    const html = defaultTemplates.commissionEarned(name, amount, dealTitle);
    return send(email, `Commission earned: \u20A6${amount.toLocaleString()} from ${dealTitle}`, html);
  },
  async walletFunded(email: string, name: string, amount: number, reference: string) {
    const html = defaultTemplates.walletFunded(name, amount, reference);
    return send(email, `Wallet funded \u2014 \u20A6${amount.toLocaleString()}`, html);
  },
  async taskAssigned(email: string, name: string, taskTitle: string, area: string) {
    const html = defaultTemplates.taskAssigned(name, taskTitle, area);
    return send(email, `New task assigned: ${taskTitle}`, html);
  },
  async taskStatusChanged(email: string, name: string, taskTitle: string, status: string) {
    const html = defaultTemplates.taskStatusChanged(name, taskTitle, status);
    return send(email, `Task updated: ${taskTitle}`, html);
  },
  async taskCommentAdded(email: string, name: string, taskTitle: string, authorName: string) {
    const html = defaultTemplates.taskCommentAdded(name, taskTitle, authorName);
    return send(email, `New comment on: ${taskTitle}`, html);
  },
  async reviewSubmitted(agentEmail: string, agentName: string, rating: number, comment: string) {
    const html = defaultTemplates.reviewSubmitted(agentName, rating, comment);
    return send(agentEmail, `New review: ${rating}/5 stars`, html);
  },
  async reviewModerated(email: string, name: string, status: string) {
    const html = defaultTemplates.reviewModerated(name, status);
    return send(email, `Review ${status}`, html);
  },
  async agreementCancelled(email: string, name: string, propertyTitle: string) {
    const html = defaultTemplates.agreementCancelled(name, propertyTitle);
    return send(email, `Agreement cancelled: ${propertyTitle}`, html);
  },
  async customOrderReceived(name: string, email: string, propertyType: string, area: string, budget: number) {
    const supportEmail = process.env.SUPPORT_EMAIL || "support@mbpproperties.com";
    const html = defaultTemplates.customOrderReceived(name, email, propertyType, area, budget);
    return send(supportEmail, `New custom order \u2014 ${propertyType} in ${area}`, html);
  },
};
