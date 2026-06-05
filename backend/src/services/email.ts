import { getResend, FROM_ADDRESS } from "../lib/resend";
import { templates } from "./email-templates";

function shouldSend(): boolean {
  return !!process.env.RESEND_API_KEY;
}

async function send(to: string, subject: string, html: string) {
  if (!shouldSend()) {
    console.log(`[EMAIL SKIPPED] To: ${to}, Subject: ${subject}`);
    return { data: null, error: null };
  }
  try {
    const resend = getResend();
    const { data, error } = await resend.emails.send({
      from: FROM_ADDRESS,
      to,
      subject,
      html,
    });
    if (error) console.error("[EMAIL ERROR]", error);
    return { data, error };
  } catch (err) {
    console.error("[EMAIL EXCEPTION]", err);
    return { data: null, error: err as Error };
  }
}

export const emailService = {
  /** Sent when a new user registers */
  async welcome(email: string, name: string) {
    const html = templates.welcome(name);
    return send(email, "Welcome to MBPP — Account Pending Review", html);
  },

  /** Sent when an admin approves a user account */
  async accountApproved(email: string, name: string, role: string) {
    const html = templates.accountApproved(name, role);
    return send(email, "Your MBPP account has been approved!", html);
  },

  /** Password reset email with token link */
  async passwordReset(email: string, name: string, token: string) {
    const html = templates.passwordReset(name, token);
    return send(email, "Reset your MBPP password", html);
  },

  /** Notify agent about a new property inquiry */
  async inquiryNotification(agentEmail: string, agentName: string, clientName: string, propertyTitle: string, message: string) {
    const html = templates.inquiryNotification(agentName, clientName, propertyTitle, message);
    return send(agentEmail, `New inquiry: ${propertyTitle}`, html);
  },

  /** Confirm to client that their inquiry was received */
  async inquiryConfirmation(clientEmail: string, clientName: string, propertyTitle: string) {
    const html = templates.inquiryConfirmation(clientName, propertyTitle);
    return send(clientEmail, "Your inquiry has been received", html);
  },

  /** Confirm rental application submission */
  async applicationReceived(email: string, name: string, propertyTitle: string) {
    const html = templates.applicationReceived(name, propertyTitle);
    return send(email, "Application received — " + propertyTitle, html);
  },

  /** Notify of application status change */
  async applicationStatus(email: string, name: string, propertyTitle: string, status: string) {
    const html = templates.applicationStatus(name, propertyTitle, status);
    return send(email, `Application ${status} — ${propertyTitle}`, html);
  },

  /** Tenancy agreement ready for signing */
  async agreementReady(email: string, name: string, propertyTitle: string) {
    const html = templates.agreementReady(name, propertyTitle);
    return send(email, "Tenancy agreement ready for signing", html);
  },

  /** Agreement signed by all parties */
  async agreementSigned(email: string, name: string, propertyTitle: string) {
    const html = templates.agreementSigned(name, propertyTitle);
    return send(email, "Agreement signed — complete!", html);
  },

  /** Price drop alert for saved search subscribers */
  async priceDropAlert(email: string, name: string, propertyTitle: string, oldPrice: number, newPrice: number) {
    const html = templates.priceDropAlert(name, propertyTitle, oldPrice, newPrice);
    return send(email, `Price drop: ${propertyTitle}`, html);
  },

  /** New message notification */
  async newMessage(email: string, name: string, senderName: string) {
    const html = templates.newMessage(name, senderName);
    return send(email, `New message from ${senderName}`, html);
  },

  /** Payment receipt */
  async paymentReceipt(email: string, name: string, amount: number, reference: string, purpose: string) {
    const html = templates.paymentReceipt(name, amount, reference, purpose);
    return send(email, "Payment receipt — MBPP", html);
  },

  /** Agent application confirmation */
  async agentApplicationSubmitted(email: string, name: string) {
    const html = templates.agentApplicationSubmitted(name);
    return send(email, "Agent application received", html);
  },

  /** Listing published notification */
  async listingPublished(email: string, agentName: string, propertyTitle: string, listingId: string) {
    const html = templates.listingPublished(agentName, propertyTitle, listingId);
    return send(email, "Your listing is live!", html);
  },

  /** Verification documents submitted */
  async verificationSubmitted(email: string, name: string) {
    const html = templates.verificationSubmitted(name);
    return send(email, "Verification documents received", html);
  },
};
