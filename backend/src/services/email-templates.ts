const C = "#0d6e4e", C2 = "#f97316", C3 = "#f8fafc";
const LOGO = "https://mbpproperties.com/icons/icon-192x192.png";
const NAME = "MBPP", URL = "https://mbpproperties.com";

function base(title: string, body: string, action?: [string, string]) {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="only"><style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#f1f5f9;color:#1e293b;line-height:1.6}
.container{max-width:560px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.06)}
.header{background:${C};padding:32px 40px;text-align:center}
.header img{width:48px;height:48px;border-radius:12px;margin-bottom:12px}
.header h1{color:#fff;font-size:18px;font-weight:700;margin:0}
.content{padding:40px}
.content p{font-size:15px;line-height:1.7;margin:0 0 16px;color:#334155}
.content h2{font-size:17px;font-weight:700;margin:0 0 12px;color:#0f172a}
.btn{display:inline-block;background:${C};color:#fff;padding:14px 32px;border-radius:10px;text-decoration:none;font-size:14px;font-weight:600;margin:8px 0}
.btn-outline{display:inline-block;background:#fff;color:${C};padding:14px 32px;border-radius:10px;text-decoration:none;font-size:14px;font-weight:600;border:2px solid ${C};margin:8px 0}
.detail-table{width:100%;background:#${C3.replace("#", "")};border-radius:12px;padding:20px;margin:16px 0}
.detail-table td{padding:6px 12px;font-size:14px}
.detail-table td:first-child{color:#64748b;width:40%}
.detail-table td:last-child{color:#0f172a;font-weight:600}
.price-badge{background:#ecfdf5;border:1px solid #a7f3d0;border-radius:10px;padding:16px;margin:16px 0;text-align:center}
.price-badge .old{text-decoration:line-through;color:#94a3b8;font-size:13px}
.price-badge .new{color:#059669;font-size:20px;font-weight:700;display:block;margin-top:4px}
.footer{background:#${C3.replace("#", "")};padding:24px 40px;text-align:center;border-top:1px solid #e2e8f0}
.footer p{color:#94a3b8;font-size:12px;margin:0}
.footer a{color:${C};text-decoration:none;font-weight:600}
</style></head><body style="padding:32px 16px">
<div class="container">
<div class="header"><img src="${LOGO}" alt="${NAME}"><h1>${NAME}</h1></div>
<div class="content">
<h2>${title}</h2>
${body}
${action ? `<a href="${action[1]}" class="btn">${action[0]}</a>` : ""}
</div>
<div class="footer"><p>${NAME} — Kano, Nigeria</p><p style="margin-top:4px">This email was sent by <a href="${URL}">${URL}</a></p></div>
</div></body></html>`;
}

export const templates = {
  welcome(name: string) {
    return base("Welcome to MBPP!",
      `<p>Hello <strong>${name}</strong>,</p>
       <p>Your account has been created and is pending review by our team. Once approved, you'll gain access to property listings, client management tools, and more.</p>
       <p>Approval typically takes <strong>24–48 hours</strong>. You'll receive another email when your account is active.</p>`,
      ["Visit Platform", `${URL}/login`]
    );
  },

  accountApproved(name: string, role: string) {
    return base("🎉 Your Account is Approved!",
      `<p>Hello <strong>${name}</strong>,</p>
       <p>Great news — your account has been approved as a <strong style="text-transform:capitalize">${role}</strong>! You can now access all the tools and features of MBPP.</p>`,
      ["Go to Dashboard", `${URL}/login`]
    );
  },

  passwordReset(name: string, token: string) {
    return base("Reset Your Password",
      `<p>Hello <strong>${name}</strong>,</p>
       <p>We received a request to reset your password. Click the button below to create a new password. This link expires in <strong>15 minutes</strong>.</p>
       <p style="font-size:13px;color:#94a3b8">If you didn't request this, you can safely ignore this email.</p>`,
      ["Reset Password", `${URL}/reset-password?token=${token}`]
    );
  },

  inquiryNotification(agentName: string, clientName: string, propertyTitle: string, message: string) {
    return base("New Property Inquiry",
      `<p>Hello <strong>${agentName}</strong>,</p>
       <p><strong>${clientName}</strong> is interested in <strong>${propertyTitle}</strong>.</p>
       <div style="background:#f1f5f9;border-left:4px solid ${C};padding:12px 16px;border-radius:0 8px 8px 0;margin:16px 0;color:#475569;font-style:italic">"${message}"</div>`,
      ["View Inquiry", `${URL}/agent/inquiries`]
    );
  },

  inquiryConfirmation(clientName: string, propertyTitle: string) {
    return base("Inquiry Received — Thank You",
      `<p>Hello <strong>${clientName}</strong>,</p>
       <p>Thank you for your interest in <strong>${propertyTitle}</strong>. An agent will review your inquiry and respond shortly.</p>
       <p>In the meantime, explore more properties on our platform.</p>`,
      ["Browse Properties", URL]
    );
  },

  applicationReceived(name: string, propertyTitle: string) {
    return base("Application Submitted",
      `<p>Hello <strong>${name}</strong>,</p>
       <p>Your rental application for <strong>${propertyTitle}</strong> has been submitted and is now under review. We'll notify you when there's an update.</p>`,
      ["Track Application", `${URL}/login`]
    );
  },

  applicationStatus(name: string, propertyTitle: string, status: string) {
    return base(`Application ${status.replace(/_/g, " ")}`,
      `<p>Hello <strong>${name}</strong>,</p>
       <p>Your application for <strong>${propertyTitle}</strong> has been updated:</p>
       <div style="text-align:center;font-size:16px;font-weight:700;padding:14px;border-radius:10px;margin:16px 0;text-transform:capitalize;background:${status==="approved"?"#ecfdf5":status==="rejected"?"#fef2f2":"#fffbeb"};color:${status==="approved"?"#059669":status==="rejected"?"#dc2626":"#d97706"}">${status.replace(/_/g, " ")}</div>`,
      ["View Details", `${URL}/login`]
    );
  },

  agreementReady(name: string, propertyTitle: string) {
    return base("Tenancy Agreement Ready",
      `<p>Hello <strong>${name}</strong>,</p>
       <p>The tenancy agreement for <strong>${propertyTitle}</strong> is ready for your review and e-signature.</p>
       <p>Please sign in to review the terms and complete the process.</p>`,
      ["Review Agreement", `${URL}/login`]
    );
  },

  agreementSigned(name: string, propertyTitle: string) {
    return base("Agreement Signed — Complete!",
      `<p>Hello <strong>${name}</strong>,</p>
       <p>The tenancy agreement for <strong>${propertyTitle}</strong> has been signed by all parties. Congratulations!</p>
       <p>You can download a copy from your dashboard.</p>`,
      ["Download Agreement", `${URL}/login`]
    );
  },

  priceDropAlert(name: string, propertyTitle: string, oldPrice: number, newPrice: number) {
    const pct = Math.round(((oldPrice - newPrice) / oldPrice) * 100);
    return base(`Price Drop — ${propertyTitle}`,
      `<p>Hello <strong>${name}</strong>,</p>
       <p>The price of <strong>${propertyTitle}</strong> has dropped by <strong>${pct}%</strong>!</p>
       <div class="price-badge"><span class="old">₦${oldPrice.toLocaleString()}</span><span class="new">₦${newPrice.toLocaleString()}</span></div>`,
      ["View Property", `${URL}/listings`]
    );
  },

  newMessage(name: string, senderName: string) {
    return base(`New Message from ${senderName}`,
      `<p>Hello <strong>${name}</strong>,</p>
       <p>You have a new message from <strong>${senderName}</strong> on MBPP.</p>`,
      ["View Messages", `${URL}/messages`]
    );
  },

  paymentReceipt(name: string, amount: number, reference: string, purpose: string) {
    return base("Payment Receipt",
      `<p>Hello <strong>${name}</strong>,</p>
       <p>Your payment has been received successfully.</p>
       <table class="detail-table" cellpadding="0" cellspacing="0">
         <tr><td>Amount</td><td>₦${amount.toLocaleString()}</td></tr>
         <tr><td>Purpose</td><td>${purpose}</td></tr>
         <tr><td>Reference</td><td>${reference}</td></tr>
       </table>`,
      ["View Wallet", `${URL}/wallet`]
    );
  },

  agentApplicationSubmitted(name: string) {
    return base("Agent Application Received",
      `<p>Hello <strong>${name}</strong>,</p>
       <p>Thank you for applying to become an agent with MBPP. Our team will review your credentials and get back to you within 48 hours.</p>`,
      ["Visit Platform", URL]
    );
  },

  listingPublished(agentName: string, propertyTitle: string, listingId: string) {
    return base("Your Listing is Live!",
      `<p>Hello <strong>${agentName}</strong>,</p>
       <p>Your listing <strong>${propertyTitle}</strong> has been published and is now visible to thousands of property seekers.</p>`,
      ["View Listing", `${URL}/listings/${listingId}`]
    );
  },

  verificationSubmitted(name: string) {
    return base("Verification Documents Received",
      `<p>Hello <strong>${name}</strong>,</p>
       <p>Your verification documents have been submitted. Our compliance team will review them within 48 hours. Once verified, your listings will display the <strong>Verified Agent</strong> badge.</p>`,
      ["Visit Dashboard", `${URL}/login`]
    );
  },
};
