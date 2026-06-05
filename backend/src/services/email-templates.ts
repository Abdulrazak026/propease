const BRAND_COLOR = "#0d6e4e";
const LOGO_URL = "https://mbpproperties.com/icons/icon-192x192.png";
const SITE_NAME = "MBPP";
const SITE_URL = "https://mbpproperties.com";

function baseTemplate(content: string, title: string) {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f4f5f7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:32px auto;background:#fff;border-radius:12px;overflow:hidden">
    <tr><td style="background:${BRAND_COLOR};padding:28px 32px;text-align:center">
      <img src="${LOGO_URL}" alt="${SITE_NAME}" width="44" height="44" style="border-radius:8px;display:block;margin:0 auto 8px" />
      <h1 style="color:#fff;font-size:20px;margin:0">${SITE_NAME}</h1>
    </td></tr>
    <tr><td style="padding:32px">
      <h2 style="color:#111;font-size:18px;margin:0 0 16px">${title}</h2>
      ${content}
    </td></tr>
    <tr><td style="background:#f9fafb;padding:24px 32px;text-align:center;border-top:1px solid #e5e7eb">
      <p style="color:#9ca3af;font-size:12px;margin:0 0 4px">${SITE_NAME} — Kano, Nigeria</p>
      <p style="color:#9ca3af;font-size:12px;margin:0">This is an automated message from <a href="${SITE_URL}" style="color:${BRAND_COLOR}">${SITE_URL}</a></p>
    </td></tr>
  </table>
</body>
</html>`;
}

export const templates = {
  welcome(name: string) {
    return baseTemplate(`
      <p style="color:#374151;font-size:15px;line-height:1.6;margin:0 0 16px">Hello ${name},</p>
      <p style="color:#374151;font-size:15px;line-height:1.6;margin:0 0 16px">Welcome to ${SITE_NAME}! Your account has been created and is pending review by our team.</p>
      <p style="color:#374151;font-size:15px;line-height:1.6;margin:0 0 24px">You'll receive another email once your account is approved. This usually takes 24–48 hours.</p>
      <a href="${SITE_URL}/login" style="display:inline-block;background:${BRAND_COLOR};color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-size:14px;font-weight:600">Visit Your Dashboard</a>
    `, "Welcome to MBPP");
  },

  accountApproved(name: string, role: string) {
    return baseTemplate(`
      <p style="color:#374151;font-size:15px;line-height:1.6;margin:0 0 16px">Hello ${name},</p>
      <p style="color:#374151;font-size:15px;line-height:1.6;margin:0 0 16px">Great news — your ${SITE_NAME} account has been <strong>approved</strong>! You now have access as a <strong>${role}</strong>.</p>
      <p style="color:#374151;font-size:15px;line-height:1.6;margin:0 0 24px">Sign in to start managing properties, connecting with clients, and growing your business.</p>
      <a href="${SITE_URL}/login" style="display:inline-block;background:${BRAND_COLOR};color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-size:14px;font-weight:600">Sign In Now</a>
    `, "Your account has been approved");
  },

  passwordReset(name: string, token: string) {
    return baseTemplate(`
      <p style="color:#374151;font-size:15px;line-height:1.6;margin:0 0 16px">Hello ${name},</p>
      <p style="color:#374151;font-size:15px;line-height:1.6;margin:0 0 16px">We received a request to reset your password. Click the button below to create a new password. This link expires in <strong>15 minutes</strong>.</p>
      <a href="${SITE_URL}/reset-password?token=${token}" style="display:inline-block;background:${BRAND_COLOR};color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-size:14px;font-weight:600">Reset Password</a>
      <p style="color:#9ca3af;font-size:13px;line-height:1.5;margin:24px 0 0">If you didn&apos;t request this, you can safely ignore this email.</p>
    `, "Reset your password");
  },

  inquiryNotification(agentName: string, clientName: string, propertyTitle: string, message: string) {
    return baseTemplate(`
      <p style="color:#374151;font-size:15px;line-height:1.6;margin:0 0 8px">Hello ${agentName},</p>
      <p style="color:#374151;font-size:15px;line-height:1.6;margin:0 0 16px"><strong>${clientName}</strong> has inquired about <strong>${propertyTitle}</strong>.</p>
      <blockquote style="border-left:3px solid ${BRAND_COLOR};margin:0 0 16px;padding:12px 16px;background:#f9fafb;border-radius:0 8px 8px 0;color:#6b7280;font-size:14px">
        "${message}"
      </blockquote>
      <a href="${SITE_URL}/agent/inquiries" style="display:inline-block;background:${BRAND_COLOR};color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-size:14px;font-weight:600">View Inquiry</a>
    `, "New property inquiry");
  },

  inquiryConfirmation(clientName: string, propertyTitle: string) {
    return baseTemplate(`
      <p style="color:#374151;font-size:15px;line-height:1.6;margin:0 0 16px">Hello ${clientName},</p>
      <p style="color:#374151;font-size:15px;line-height:1.6;margin:0 0 16px">Thank you for your interest in <strong>${propertyTitle}</strong>. An agent will review your inquiry and get back to you shortly.</p>
      <p style="color:#374151;font-size:15px;line-height:1.6;margin:0 0 24px">In the meantime, you can browse more properties on our platform.</p>
      <a href="${SITE_URL}" style="display:inline-block;background:${BRAND_COLOR};color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-size:14px;font-weight:600">Browse Properties</a>
    `, "Inquiry received — thank you");
  },

  applicationReceived(name: string, propertyTitle: string) {
    return baseTemplate(`
      <p style="color:#374151;font-size:15px;line-height:1.6;margin:0 0 16px">Hello ${name},</p>
      <p style="color:#374151;font-size:15px;line-height:1.6;margin:0 0 16px">Your rental application for <strong>${propertyTitle}</strong> has been submitted and is now under review.</p>
      <p style="color:#374151;font-size:15px;line-height:1.6;margin:0 0 24px">We&apos;ll notify you as soon as there&apos;s an update on your application status.</p>
      <a href="${SITE_URL}/login" style="display:inline-block;background:${BRAND_COLOR};color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-size:14px;font-weight:600">Track Application</a>
    `, "Application received");
  },

  applicationStatus(name: string, propertyTitle: string, status: string) {
    const statusColor = status === "approved" ? "#059669" : status === "rejected" ? "#dc2626" : "#d97706";
    return baseTemplate(`
      <p style="color:#374151;font-size:15px;line-height:1.6;margin:0 0 16px">Hello ${name},</p>
      <p style="color:#374151;font-size:15px;line-height:1.6;margin:0 0 8px">Your application for <strong>${propertyTitle}</strong> has been updated:</p>
      <p style="background:${statusColor}10;border:1px solid ${statusColor}30;color:${statusColor};padding:12px 16px;border-radius:8px;font-size:15px;font-weight:600;text-transform:capitalize">${status.replace(/_/g, " ")}</p>
      <a href="${SITE_URL}/login" style="display:inline-block;background:${BRAND_COLOR};color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-size:14px;font-weight:600;margin-top:16px">View Details</a>
    `, "Application status update");
  },

  agreementReady(name: string, propertyTitle: string) {
    return baseTemplate(`
      <p style="color:#374151;font-size:15px;line-height:1.6;margin:0 0 16px">Hello ${name},</p>
      <p style="color:#374151;font-size:15px;line-height:1.6;margin:0 0 16px">Your tenancy agreement for <strong>${propertyTitle}</strong> is ready for review and e-signature.</p>
      <p style="color:#374151;font-size:15px;line-height:1.6;margin:0 0 24px">Please sign in to review the terms and complete the signing process.</p>
      <a href="${SITE_URL}/login" style="display:inline-block;background:${BRAND_COLOR};color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-size:14px;font-weight:600">Review Agreement</a>
    `, "Tenancy agreement ready for signing");
  },

  agreementSigned(name: string, propertyTitle: string) {
    return baseTemplate(`
      <p style="color:#374151;font-size:15px;line-height:1.6;margin:0 0 16px">Hello ${name},</p>
      <p style="color:#374151;font-size:15px;line-height:1.6;margin:0 0 16px">The tenancy agreement for <strong>${propertyTitle}</strong> has been signed by all parties. Congratulations!</p>
      <p style="color:#374151;font-size:15px;line-height:1.6;margin:0 0 24px">You can download a copy of the signed agreement from your dashboard.</p>
      <a href="${SITE_URL}/login" style="display:inline-block;background:${BRAND_COLOR};color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-size:14px;font-weight:600">Download Agreement</a>
    `, "Agreement signed — complete!");
  },

  priceDropAlert(name: string, propertyTitle: string, oldPrice: number, newPrice: number) {
    const drop = oldPrice - newPrice;
    const pct = Math.round((drop / oldPrice) * 100);
    return baseTemplate(`
      <p style="color:#374151;font-size:15px;line-height:1.6;margin:0 0 16px">Hello ${name},</p>
      <p style="color:#374151;font-size:15px;line-height:1.6;margin:0 0 16px">The price of <strong>${propertyTitle}</strong> has dropped by <strong>${pct}%</strong>!</p>
      <p style="background:#ecfdf5;border:1px solid #a7f3d0;padding:12px 16px;border-radius:8px;margin:0 0 16px">
        <span style="text-decoration:line-through;color:#9ca3af;font-size:14px">₦${oldPrice.toLocaleString()}</span>
        <span style="color:#059669;font-size:18px;font-weight:700;margin-left:8px">₦${newPrice.toLocaleString()}</span>
      </p>
      <a href="${SITE_URL}/listings" style="display:inline-block;background:${BRAND_COLOR};color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-size:14px;font-weight:600">View Property</a>
    `, "Price drop alert!");
  },

  newMessage(name: string, senderName: string) {
    return baseTemplate(`
      <p style="color:#374151;font-size:15px;line-height:1.6;margin:0 0 16px">Hello ${name},</p>
      <p style="color:#374151;font-size:15px;line-height:1.6;margin:0 0 16px">You have a new message from <strong>${senderName}</strong>.</p>
      <a href="${SITE_URL}/messages" style="display:inline-block;background:${BRAND_COLOR};color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-size:14px;font-weight:600">View Messages</a>
    `, "New message received");
  },

  paymentReceipt(name: string, amount: number, reference: string, purpose: string) {
    return baseTemplate(`
      <p style="color:#374151;font-size:15px;line-height:1.6;margin:0 0 16px">Hello ${name},</p>
      <p style="color:#374151;font-size:15px;line-height:1.6;margin:0 0 8px">Your payment has been received successfully.</p>
      <table cellpadding="0" cellspacing="0" style="width:100%;background:#f9fafb;border-radius:8px;padding:16px;margin:0 0 16px">
        <tr><td style="color:#6b7280;font-size:13px;padding:4px 8px">Amount</td><td style="color:#111;font-size:14px;font-weight:600;padding:4px 8px">₦${amount.toLocaleString()}</td></tr>
        <tr><td style="color:#6b7280;font-size:13px;padding:4px 8px">Purpose</td><td style="color:#111;font-size:14px;padding:4px 8px">${purpose}</td></tr>
        <tr><td style="color:#6b7280;font-size:13px;padding:4px 8px">Reference</td><td style="color:#111;font-size:14px;padding:4px 8px">${reference}</td></tr>
      </table>
      <a href="${SITE_URL}/wallet" style="display:inline-block;background:${BRAND_COLOR};color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-size:14px;font-weight:600">View Wallet</a>
    `, "Payment receipt");
  },

  agentApplicationSubmitted(name: string) {
    return baseTemplate(`
      <p style="color:#374151;font-size:15px;line-height:1.6;margin:0 0 16px">Hello ${name},</p>
      <p style="color:#374151;font-size:15px;line-height:1.6;margin:0 0 16px">Thank you for applying to become an agent with ${SITE_NAME}. Your application has been submitted and is under review.</p>
      <p style="color:#374151;font-size:15px;line-height:1.6;margin:0 0 24px">Our team will review your credentials and get back to you within 48 hours.</p>
      <a href="${SITE_URL}" style="display:inline-block;background:${BRAND_COLOR};color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-size:14px;font-weight:600">Visit Site</a>
    `, "Agent application received");
  },

  listingPublished(agentName: string, propertyTitle: string, listingId: string) {
    return baseTemplate(`
      <p style="color:#374151;font-size:15px;line-height:1.6;margin:0 0 16px">Hello ${agentName},</p>
      <p style="color:#374151;font-size:15px;line-height:1.6;margin:0 0 16px">Your listing <strong>${propertyTitle}</strong> has been published and is now visible to property seekers.</p>
      <a href="${SITE_URL}/listings/${listingId}" style="display:inline-block;background:${BRAND_COLOR};color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-size:14px;font-weight:600">View Listing</a>
    `, "Listing published");
  },

  verificationSubmitted(name: string) {
    return baseTemplate(`
      <p style="color:#374151;font-size:15px;line-height:1.6;margin:0 0 16px">Hello ${name},</p>
      <p style="color:#374151;font-size:15px;line-height:1.6;margin:0 0 16px">Your verification documents have been submitted. Our compliance team will review them within 48 hours.</p>
      <p style="color:#374151;font-size:15px;line-height:1.6;margin:0 0 16px">Once verified, your listings will display a <strong>Verified Agent</strong> badge, increasing trust with potential clients.</p>
    `, "Verification documents received");
  },
};
