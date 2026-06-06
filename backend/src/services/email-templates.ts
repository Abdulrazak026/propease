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

  // --- NEW TEMPLATES ---

  withdrawalRequested(name: string, amount: number) {
    return base("Withdrawal Requested",
      `<p>Hello <strong>${name}</strong>,</p>
       <p>Your withdrawal request of <strong>\u20A6${amount.toLocaleString()}</strong> has been submitted and is pending admin approval.</p>
       <p>Withdrawals are typically processed within 1\u20132 business days. You will receive another email once approved.</p>
       <div class="detail-table"><table><tr><td>Amount</td><td>\u20A6${amount.toLocaleString()}</td></tr><tr><td>Status</td><td>Pending Approval</td></tr></table></div>`,
      ["View Wallet", `${URL}/wallet`]
    );
  },
  withdrawalApproved(name: string, amount: number) {
    return base("Withdrawal Approved \u2705",
      `<p>Hello <strong>${name}</strong>,</p>
       <p>Great news! Your withdrawal of <strong>\u20A6${amount.toLocaleString()}</strong> has been approved and will reflect in your bank account within 24 hours.</p>
       <div class="detail-table"><table><tr><td>Amount</td><td>\u20A6${amount.toLocaleString()}</td></tr><tr><td>Status</td><td>Approved</td></tr></table></div>`,
      ["Go to Wallet", `${URL}/wallet`]
    );
  },
  withdrawalRejected(name: string, amount: number, reason?: string) {
    return base("Withdrawal Rejected",
      `<p>Hello <strong>${name}</strong>,</p>
       <p>Your withdrawal request of <strong>\u20A6${amount.toLocaleString()}</strong> was not approved.${reason ? ` Reason: ${reason}` : ""}</p>
       <p>The funds have been returned to your wallet. Please contact support if you have questions.</p>`,
      ["Contact Support", `mailto:support@mbpproperties.com`]
    );
  },
  listingSubmittedForReview(name: string, title: string) {
    return base("Listing Submitted for Review",
      `<p>Hello <strong>${name}</strong>,</p>
       <p>Your listing <strong>"${title}"</strong> has been submitted for admin review. It will be reviewed within 24 hours and published if it meets our quality standards.</p>
       <p>You will receive another email once the listing is approved or if any changes are needed.</p>`,
      ["View My Listings", `${URL}/ambassador`]
    );
  },
  listingRejected(name: string, title: string) {
    return base("Listing Needs Revision",
      `<p>Hello <strong>${name}</strong>,</p>
       <p>Your listing <strong>"${title}"</strong> was returned for revision. Please update the listing details and resubmit.</p>
       <p>Common reasons for rejection include: incomplete description, no photos, incorrect pricing, or duplicate listing.</p>`,
      ["Edit Listing", `${URL}/ambassador`]
    );
  },
  commissionEarned(name: string, amount: number, dealTitle: string) {
    return base("Commission Earned \uD83C\uDF89",
      `<p>Hello <strong>${name}</strong>,</p>
       <p>Commission of <strong>\u20A6${amount.toLocaleString()}</strong> has been credited to your wallet from the deal: <strong>"${dealTitle}"</strong>.</p>
       <div class="detail-table"><table><tr><td>Deal</td><td>${dealTitle}</td></tr><tr><td>Commission</td><td>\u20A6${amount.toLocaleString()}</td></tr></table></div>`,
      ["View Wallet", `${URL}/wallet`]
    );
  },
  walletFunded(name: string, amount: number, reference: string) {
    return base("Wallet Funded \u2705",
      `<p>Hello <strong>${name}</strong>,</p>
       <p>Your wallet has been credited with <strong>\u20A6${amount.toLocaleString()}</strong>. Your updated balance is now available for withdrawals and listing fees.</p>
       <div class="detail-table"><table><tr><td>Amount</td><td>\u20A6${amount.toLocaleString()}</td></tr><tr><td>Reference</td><td>${reference}</td></tr></table></div>`,
      ["Go to Wallet", `${URL}/wallet`]
    );
  },
  taskAssigned(name: string, taskTitle: string, area: string) {
    return base("New Task Assigned",
      `<p>Hello <strong>${name}</strong>,</p>
       <p>A new task has been assigned to you: <strong>"${taskTitle}"</strong> in <strong>${area}</strong>.</p>
       <p>Review the task details on your dashboard and begin working on it as soon as possible.</p>`,
      ["View Task", `${URL}/agent`]
    );
  },
  taskStatusChanged(name: string, taskTitle: string, status: string) {
    return base("Task Updated",
      `<p>Hello <strong>${name}</strong>,</p>
       <p>The status of task <strong>"${taskTitle}"</strong> has been updated to: <strong>${status.replace("_", " ").toUpperCase()}</strong>.</p>`,
      ["View Task", `${URL}/agent`]
    );
  },
  taskCommentAdded(name: string, taskTitle: string, authorName: string) {
    return base("New Comment on Task",
      `<p>Hello <strong>${name}</strong>,</p>
       <p><strong>${authorName}</strong> added a new comment on task: <strong>"${taskTitle}"</strong>.</p>
       <p>Log in to view the comment and respond.</p>`,
      ["View Task", `${URL}/agent`]
    );
  },
  reviewSubmitted(agentName: string, rating: number, comment: string) {
    return base("New Review Received",
      `<p>Hello <strong>${agentName}</strong>,</p>
       <p>You received a new <strong>${rating}/5 star</strong> review${comment ? `: "${comment}"` : ""}.</p>
       <p>Reviews help build trust with potential clients and increase your visibility on the platform.</p>`,
      ["View Profile", `${URL}/agent`]
    );
  },
  reviewModerated(name: string, status: string) {
    return base(`Review ${status.charAt(0).toUpperCase() + status.slice(1)}`,
      `<p>Hello <strong>${name}</strong>,</p>
       <p>Your review has been <strong>${status}</strong> by our moderation team.</p>
       <p>${status === "approved" ? "It is now visible on the agent's profile." : "It did not meet our community guidelines."}</p>`,
      ["Visit Platform", `${URL}`]
    );
  },
  agreementCancelled(name: string, propertyTitle: string) {
    return base("Agreement Cancelled",
      `<p>Hello <strong>${name}</strong>,</p>
       <p>The tenancy agreement for <strong>"${propertyTitle}"</strong> has been cancelled.</p>
       <p>If you have any questions or need to create a new agreement, please contact your agent or reach out to support.</p>`,
      ["Contact Support", `mailto:support@mbpproperties.com`]
    );
  },
  customOrderReceived(name: string, email: string, propertyType: string, area: string, budget: number) {
    return base("New Custom Order",
      `<h2>New Custom Property Request</h2>
       <div class="detail-table"><table>
       <tr><td>Client</td><td>${name} (${email})</td></tr>
       <tr><td>Property Type</td><td>${propertyType}</td></tr>
       <tr><td>Area</td><td>${area}</td></tr>
       <tr><td>Budget</td><td>\u20A6${budget.toLocaleString()}</td></tr>
       </table></div>
       <p>A new custom property request has been submitted. Route to the appropriate ambassador in ${area}.</p>`,
      ["View Dashboard", `${URL}/admin`]
    );
  },
};
