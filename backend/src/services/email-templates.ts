const C = "#0d6e4e", C2 = "#f97316", C3 = "#f8fafc";
const LOGO = "https://mbpproperties.com/icons/icon-192x192.png";
const NAME = "MBPP", URL = "https://mbpproperties.com";

function base(title: string, body: string, action?: [string, string], preheader?: string) {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="only">
${preheader ? `<span style="display:none!important;visibility:hidden;mso-hide:all;font-size:1px;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden">${preheader}</span>` : ""}
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#f1f5f9;color:#1e293b;line-height:1.6;-webkit-font-smoothing:antialiased}
.container{max-width:560px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.06)}
.hero{background:linear-gradient(135deg,${C} 0%,#0a5a3e 100%);padding:40px 40px 32px;text-align:center;position:relative}
.hero::after{content:'';position:absolute;bottom:0;left:0;right:0;height:4px;background:linear-gradient(90deg,${C2},#fbbf24,${C2})}
.hero img{width:56px;height:56px;border-radius:14px;margin-bottom:16px;box-shadow:0 4px 12px rgba(0,0,0,0.2)}
.hero h1{color:#fff;font-size:20px;font-weight:700;margin:0 0 6px;letter-spacing:-0.3px}
.hero p{color:rgba(255,255,255,0.8);font-size:13px;margin:0}
.content{padding:36px 40px}
.content p{font-size:15px;line-height:1.7;margin:0 0 14px;color:#334155}
.content h2{font-size:17px;font-weight:700;margin:0 0 12px;color:#0f172a}
.btn{display:inline-block;background:${C};color:#fff !important;padding:14px 32px;border-radius:10px;text-decoration:none;font-size:14px;font-weight:600;margin:8px 0;letter-spacing:0.2px}
.btn:hover{opacity:0.92}
.btn-orange{display:inline-block;background:${C2};color:#fff !important;padding:14px 32px;border-radius:10px;text-decoration:none;font-size:14px;font-weight:600;margin:8px 0}
.btn-outline{display:inline-block;background:#fff;color:${C};padding:14px 32px;border-radius:10px;text-decoration:none;font-size:14px;font-weight:600;border:2px solid ${C};margin:8px 0}
.detail-box{width:100%;background:${C3};border-radius:12px;padding:20px;margin:20px 0;border:1px solid #e2e8f0}
.detail-box td{padding:7px 12px;font-size:14px}
.detail-box td:first-child{color:#64748b;width:40%;font-weight:500}
.detail-box td:last-child{color:#0f172a;font-weight:600}
.highlight-box{background:linear-gradient(135deg,#ecfdf5 0%,#f0fdf4 100%);border:1px solid #a7f3d0;border-radius:12px;padding:18px 20px;margin:20px 0}
.highlight-box p{color:#065f46;font-size:14px;margin:0}
.warning-box{background:#fffbeb;border:1px solid #fde68a;border-radius:12px;padding:18px 20px;margin:20px 0}
.warning-box p{color:#92400e;font-size:14px;margin:0}
.error-box{background:#fef2f2;border:1px solid #fecaca;border-radius:12px;padding:18px 20px;margin:20px 0}
.error-box p{color:#991b1b;font-size:14px;margin:0}
.features{margin:20px 0}
.feature-row{display:flex;align-items:flex-start;gap:12px;padding:10px 0;border-bottom:1px solid #f1f5f9}
.feature-row:last-child{border-bottom:none}
.feature-icon{width:36px;height:36px;border-radius:10px;background:#ecfdf5;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:18px}
.feature-text{flex:1}
.feature-text strong{display:block;font-size:14px;color:#0f172a;margin-bottom:2px}
.feature-text span{font-size:13px;color:#64748b}
.step{display:flex;align-items:flex-start;gap:12px;padding:12px 0}
.step-num{width:28px;height:28px;border-radius:50%;background:${C};color:#fff;font-size:13px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.step-text{flex:1;padding-top:3px}
.step-text strong{display:block;font-size:14px;color:#0f172a}
.step-text span{font-size:13px;color:#64748b}
.price-box{background:#ecfdf5;border:1px solid #a7f3d0;border-radius:12px;padding:20px;margin:20px 0;text-align:center}
.price-old{text-decoration:line-through;color:#94a3b8;font-size:14px}
.price-new{color:#059669;font-size:24px;font-weight:700;display:block;margin-top:4px}
.price-label{color:#64748b;font-size:12px;margin-top:4px;display:block}
.status-badge{display:inline-block;font-size:14px;font-weight:700;padding:10px 24px;border-radius:10px;margin:16px 0;text-transform:capitalize}
.footer{background:${C3};padding:28px 40px;text-align:center;border-top:1px solid #e2e8f0}
.footer p{color:#94a3b8;font-size:12px;margin:0;line-height:1.6}
.footer a{color:${C};text-decoration:none;font-weight:600}
.social-links{margin:16px 0 12px}
.social-links a{display:inline-block;margin:0 6px;color:#94a3b8;font-size:12px;text-decoration:none}
.social-links a:hover{color:${C}}
.divider{height:1px;background:#e2e8f0;margin:20px 0}
</style></head><body style="padding:32px 16px">
<div class="container">
<div class="hero">
<img src="${LOGO}" alt="${NAME}">
<h1>${NAME}</h1>
<p>Mutual Benefit Premier Properties</p>
</div>
<div class="content">
<h2>${title}</h2>
${body}
${action ? `<div style="margin:24px 0 8px"><a href="${action[1]}" class="btn">${action[0]}</a></div>` : ""}
</div>
<div class="footer">
<div class="social-links">
<a href="https://facebook.com/mbpproperties">Facebook</a> &middot;
<a href="https://twitter.com/mbpproperties">Twitter</a> &middot;
<a href="https://instagram.com/mbpproperties">Instagram</a> &middot;
<a href="https://wa.me/2348000000000">WhatsApp</a>
</div>
<p>${NAME} &mdash; Kano, Nigeria</p>
<p style="margin-top:4px"><a href="${URL}">${URL}</a></p>
<p style="margin-top:12px;font-size:11px;color:#b0b8c4">You received this email because you have an account on MBPP.<br>If you didn't expect this email, please <a href="mailto:support@mbpproperties.com" style="color:#94a3b8">contact support</a>.</p>
</div>
</div></body></html>`;
}

export const templates = {
  welcome(name: string) {
    return base(
      "Welcome to MBPP! 🎉",
      `<p>Hello <strong>${name}</strong>,</p>
       <p>Welcome aboard! Your account has been created and you're all set to start exploring the best properties in Kano.</p>
       
       <div class="features">
         <div class="feature-row">
           <div class="feature-icon">🏠</div>
           <div class="feature-text">
             <strong>Browse Properties</strong>
             <span>Discover verified houses, flats, land, and commercial properties for rent and sale.</span>
           </div>
         </div>
         <div class="feature-row">
           <div class="feature-icon">💬</div>
           <div class="feature-text">
             <strong>Contact Agents Directly</strong>
             <span>Reach out to verified agents and get personalized property recommendations.</span>
           </div>
         </div>
         <div class="feature-row">
           <div class="feature-icon">⭐</div>
           <div class="feature-text">
             <strong>Save Favorites</strong>
             <span>Bookmark properties you love and get notified when prices change.</span>
           </div>
         </div>
       </div>
       
       <p>Ready to find your next property? Sign in and start exploring.</p>`,
      ["Sign In to Dashboard", `${URL}/login`],
      `Welcome to MBPP, ${name}! Your account is ready. Start browsing verified properties in Kano.`
    );
  },

  agentApplicationSubmitted(name: string) {
    return base(
      "Application Received! 📋",
      `<p>Hello <strong>${name}</strong>,</p>
       <p>Thank you for applying to become an agent with MBPP! We're excited about the possibility of having you on our platform.</p>
       
       <div class="highlight-box">
         <p><strong>✅ Application received</strong> — Our team is reviewing your credentials and will get back to you shortly.</p>
       </div>
       
       <p><strong>What happens next:</strong></p>
       
       <div class="step"><div class="step-num">1</div><div class="step-text"><strong>Review</strong><span>Our team reviews your application and credentials (usually within 48 hours)</span></div></div>
       <div class="step"><div class="step-num">2</div><div class="step-text"><strong>Approval</strong><span>You'll receive an email confirmation once your account is approved</span></div></div>
       <div class="step"><div class="step-num">3</div><div class="step-text"><strong>Get Started</strong><span>Access your agent dashboard, post listings, and start connecting with clients</span></div></div>
       
       <p>While you wait, feel free to browse properties on our platform.</p>`,
      ["Browse Properties", URL],
      `${name}, your agent application has been received. We'll review it within 48 hours.`
    );
  },

  accountApproved(name: string, role: string) {
    return base(
      "Your Account is Approved! 🎉",
      `<p>Hello <strong>${name}</strong>,</p>
       <p>Great news! Your account has been approved as a <strong style="text-transform:capitalize">${role}</strong>. You now have full access to MBPP.</p>
       
       <div class="highlight-box">
         <p><strong>🎊 Congratulations!</strong> You can now access all the tools and features available to ${role}s on MBPP.</p>
       </div>
       
       ${role === "agent" ? `<p><strong>As an agent, you can now:</strong></p>
       <div class="features">
         <div class="feature-row">
           <div class="feature-icon">📝</div>
           <div class="feature-text">
             <strong>Post Listings</strong>
             <span>Create property listings and reach thousands of potential clients</span>
           </div>
         </div>
         <div class="feature-row">
           <div class="feature-icon">📊</div>
           <div class="feature-text">
             <strong>Track Performance</strong>
             <span>Monitor inquiries, applications, and commissions from your dashboard</span>
           </div>
         </div>
         <div class="feature-row">
           <div class="feature-icon">💰</div>
           <div class="feature-text">
             <strong>Earn Commissions</strong>
             <span>Get paid for every successful deal through your wallet</span>
           </div>
         </div>
       </div>` : `<p>Sign in to your dashboard to get started.</p>`}`,
      ["Go to Dashboard", `${URL}/login`],
      `Great news, ${name}! Your ${role} account has been approved. Sign in to get started.`
    );
  },

  accountSuspended(name: string, reason?: string) {
    return base(
      "Account Suspended",
      `<p>Hello <strong>${name}</strong>,</p>
       <p>We're writing to inform you that your MBPP account has been suspended.</p>
       
       <div class="error-box">
         <p><strong>⚠️ Account Suspended</strong> — Your account access has been temporarily restricted.</p>
       </div>
       
       ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ""}
       <p>If you believe this is a mistake or would like to appeal, please contact our support team. We'll review your case and get back to you as soon as possible.</p>
       
       <div class="divider"></div>
       <p style="font-size:13px;color:#64748b">Need help? Reach out to us at <a href="mailto:support@mbpproperties.com" style="color:${C}">support@mbpproperties.com</a></p>`,
      ["Contact Support", `mailto:support@mbpproperties.com`],
      `${name}, your MBPP account has been suspended. Contact support for assistance.`
    );
  },

  passwordReset(name: string, token: string) {
    return base(
      "Reset Your Password 🔐",
      `<p>Hello <strong>${name}</strong>,</p>
       <p>We received a request to reset the password for your MBPP account. Click the button below to create a new password.</p>
       
       <div class="warning-box">
         <p><strong>⏰ This link expires in 15 minutes</strong> for your security. If it expires, you can request a new one.</p>
       </div>
       
       <div class="divider"></div>
       <p style="font-size:13px;color:#94a3b8">If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged. If you're concerned about your account security, please contact our support team.</p>`,
      ["Reset My Password", `${URL}/reset-password?token=${token}`],
      `${name}, you requested a password reset. Click the link inside to create a new password.`
    );
  },

  passwordChanged(name: string) {
    return base(
      "Password Changed Successfully ✅",
      `<p>Hello <strong>${name}</strong>,</p>
       <p>Your MBPP password has been changed successfully. You can now sign in with your new password.</p>
       
       <div class="highlight-box">
         <p><strong>✅ Password updated</strong> — Your account is secured with your new password.</p>
       </div>
       
       <div class="divider"></div>
       <p style="font-size:13px;color:#94a3b8">If you didn't make this change, please contact our support team immediately at <a href="mailto:support@mbpproperties.com" style="color:${C}">support@mbpproperties.com</a></p>`,
      ["Sign In", `${URL}/login`],
      `${name}, your MBPP password has been changed successfully.`
    );
  },

  inquiryNotification(agentName: string, clientName: string, propertyTitle: string, message: string) {
    return base(
      "New Property Inquiry 📩",
      `<p>Hello <strong>${agentName}</strong>,</p>
       <p><strong>${clientName}</strong> is interested in one of your properties and has sent you an inquiry.</p>
       
       <div class="detail-box"><table cellpadding="0" cellspacing="0">
         <tr><td>Property</td><td>${propertyTitle}</td></tr>
         <tr><td>From</td><td>${clientName}</td></tr>
       </table></div>
       
       <div style="background:#f1f5f9;border-left:4px solid ${C};padding:14px 18px;border-radius:0 10px 10px 0;margin:16px 0;color:#475569;font-style:italic;font-size:14px;line-height:1.6">"${message}"</div>
       
       <p>Respond promptly to increase your chances of closing the deal.</p>`,
      ["View Inquiry", `${URL}/agent/inquiries`],
      `New inquiry from ${clientName} about ${propertyTitle}. Respond now!`
    );
  },

  inquiryConfirmation(clientName: string, propertyTitle: string) {
    return base(
      "Inquiry Received — Thank You! 🙏",
      `<p>Hello <strong>${clientName}</strong>,</p>
       <p>Thank you for your interest in <strong>${propertyTitle}</strong>! We've received your inquiry and forwarded it to the assigned agent.</p>
       
       <div class="highlight-box">
         <p><strong>✅ Inquiry submitted</strong> — An agent will review your inquiry and respond shortly, usually within a few hours.</p>
       </div>
       
       <p>In the meantime, explore more properties on our platform. We have a wide selection of verified listings across Kano.</p>`,
      ["Browse More Properties", URL],
      `Thanks for your inquiry about ${propertyTitle}! An agent will respond shortly.`
    );
  },

  applicationReceived(name: string, propertyTitle: string) {
    return base(
      "Application Submitted 📝",
      `<p>Hello <strong>${name}</strong>,</p>
       <p>Your rental application for <strong>${propertyTitle}</strong> has been submitted successfully and is now under review.</p>
       
       <div class="highlight-box">
         <p><strong>✅ Application received</strong> — We'll review your application and notify you of the decision.</p>
       </div>
       
       <p><strong>What to expect:</strong></p>
       <div class="step"><div class="step-num">1</div><div class="step-text"><strong>Document Review</strong><span>We'll verify the information and documents you provided</span></div></div>
       <div class="step"><div class="step-num">2</div><div class="step-text"><strong>Decision</strong><span>You'll receive an email with the outcome of your application</span></div></div>
       <div class="step"><div class="step-num">3</div><div class="step-text"><strong>Next Steps</strong><span>If approved, you'll receive instructions for signing the agreement</span></div></div>`,
      ["Track Application", `${URL}/login`],
      `Your rental application for ${propertyTitle} has been submitted. We'll notify you of the decision.`
    );
  },

  applicationStatus(name: string, propertyTitle: string, status: string) {
    const statusColor = status === "approved" ? "#059669" : status === "rejected" ? "#dc2626" : "#d97706";
    const statusBg = status === "approved" ? "#ecfdf5" : status === "rejected" ? "#fef2f2" : "#fffbeb";
    const statusEmoji = status === "approved" ? "🎉" : status === "rejected" ? "😔" : "⏳";
    return base(
      `Application ${status.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())} ${statusEmoji}`,
      `<p>Hello <strong>${name}</strong>,</p>
       <p>Your rental application for <strong>${propertyTitle}</strong> has been updated.</p>
       
       <div style="text-align:center;margin:20px 0">
         <span class="status-badge" style="background:${statusBg};color:${statusColor}">${status.replace(/_/g, " ")}</span>
       </div>
       
       ${status === "approved" ? `<div class="highlight-box"><p><strong>🎊 Congratulations!</strong> Your application has been approved. You'll receive instructions for the next steps shortly.</p></div>` :
         status === "rejected" ? `<p>Unfortunately, your application was not approved at this time. You may apply for other properties on our platform.</p>` :
         `<p>Your application is currently under review. We'll notify you as soon as there's an update.</p>`}`,
      ["View Details", `${URL}/login`],
      `${name}, your application for ${propertyTitle} has been ${status.replace(/_/g, " ")}.`
    );
  },

  agreementReady(name: string, propertyTitle: string) {
    return base(
      "Agreement Ready for Signing 📄",
      `<p>Hello <strong>${name}</strong>,</p>
       <p>The tenancy agreement for <strong>${propertyTitle}</strong> is ready for your review and e-signature.</p>
       
       <div class="highlight-box">
         <p><strong>📄 Agreement ready</strong> — Please review the terms carefully before signing.</p>
       </div>
       
       <p><strong>Before you sign:</strong></p>
       <div class="features">
         <div class="feature-row">
           <div class="feature-icon">📖</div>
           <div class="feature-text">
             <strong>Read All Terms</strong>
             <span>Review the full agreement including rent, deposit, and maintenance terms</span>
           </div>
         </div>
         <div class="feature-row">
           <div class="feature-icon">✅</div>
           <div class="feature-text">
             <strong>Verify Details</strong>
             <span>Ensure all property details, dates, and amounts are correct</span>
           </div>
         </div>
       </div>
       
       <p>Sign in to review and sign the agreement.</p>`,
      ["Review & Sign Agreement", `${URL}/login`],
      `${name}, your tenancy agreement for ${propertyTitle} is ready for signing.`
    );
  },

  agreementSigned(name: string, propertyTitle: string) {
    return base(
      "Agreement Signed — Complete! 🎉",
      `<p>Hello <strong>${name}</strong>,</p>
       <p>Great news! The tenancy agreement for <strong>${propertyTitle}</strong> has been signed by all parties.</p>
       
       <div class="highlight-box">
         <p><strong>🎉 Congratulations!</strong> Your tenancy agreement is now fully executed. Welcome to your new home!</p>
       </div>
       
       <p>You can download a copy of the signed agreement from your dashboard at any time. We recommend keeping a copy for your records.</p>
       
       <div class="divider"></div>
       <p style="font-size:13px;color:#64748b">If you have any questions about your agreement or need assistance, don't hesitate to reach out to your agent or contact our support team.</p>`,
      ["Download Agreement", `${URL}/login`],
      `Your tenancy agreement for ${propertyTitle} has been signed by all parties. Congratulations!`
    );
  },

  priceDropAlert(name: string, propertyTitle: string, oldPrice: number, newPrice: number) {
    const pct = Math.round(((oldPrice - newPrice) / oldPrice) * 100);
    return base(
      `Price Drop — ${propertyTitle} 📉`,
      `<p>Hello <strong>${name}</strong>,</p>
       <p>Great news! A property you're interested in has dropped in price.</p>
       
       <div class="price-box">
         <span class="price-old">₦${oldPrice.toLocaleString()}</span>
         <span class="price-new">₦${newPrice.toLocaleString()}</span>
         <span class="price-label">${pct}% off — Save ₦${(oldPrice - newPrice).toLocaleString()}</span>
       </div>
       
       <p><strong>${propertyTitle}</strong></p>
       <p>This is a limited-time price change. Act fast to secure this property at the new rate.</p>`,
      ["View Property", `${URL}/listings`],
      `Price drop alert! ${propertyTitle} is now ₦${newPrice.toLocaleString()} (${pct}% off).`
    );
  },

  newMessage(name: string, senderName: string) {
    return base(
      `New Message from ${senderName} 💬`,
      `<p>Hello <strong>${name}</strong>,</p>
       <p>You have a new message from <strong>${senderName}</strong> on MBPP.</p>
       
       <div class="highlight-box">
         <p><strong>💬 New message waiting</strong> — Sign in to read and respond to ${senderName}.</p>
       </div>
       
       <p>Timely responses help build trust and improve your experience on the platform.</p>`,
      ["View Messages", `${URL}/messages`],
      `${senderName} sent you a message on MBPP. Sign in to read it.`
    );
  },

  paymentReceipt(name: string, amount: number, reference: string, purpose: string) {
    return base(
      "Payment Receipt ✅",
      `<p>Hello <strong>${name}</strong>,</p>
       <p>Your payment has been received successfully. Here are the details:</p>
       
       <div class="detail-box"><table cellpadding="0" cellspacing="0">
         <tr><td>Amount</td><td style="color:#059669;font-size:16px">₦${amount.toLocaleString()}</td></tr>
         <tr><td>Purpose</td><td>${purpose}</td></tr>
         <tr><td>Reference</td><td style="font-family:monospace;font-size:13px">${reference}</td></tr>
         <tr><td>Date</td><td>${new Date().toLocaleDateString("en-NG", { year: "numeric", month: "long", day: "numeric" })}</td></tr>
       </table></div>
       
       <p style="font-size:13px;color:#64748b">Keep this receipt for your records. If you have any questions about this transaction, please contact support.</p>`,
      ["View Wallet", `${URL}/wallet`],
      `Payment of ₦${amount.toLocaleString()} received. Ref: ${reference}`
    );
  },

  listingPublished(agentName: string, propertyTitle: string, listingId: string) {
    return base(
      "Your Listing is Live! 🚀",
      `<p>Hello <strong>${agentName}</strong>,</p>
       <p>Your listing <strong>${propertyTitle}</strong> has been approved and is now live on MBPP!</p>
       
       <div class="highlight-box">
         <p><strong>🚀 Now live</strong> — Your property is visible to thousands of potential buyers and renters across Kano.</p>
       </div>
       
       <p><strong>Tips to get more inquiries:</strong></p>
       <div class="features">
         <div class="feature-row">
           <div class="feature-icon">📸</div>
           <div class="feature-text">
             <strong>Add Quality Photos</strong>
             <span>Listings with 5+ photos get 3x more inquiries</span>
           </div>
         </div>
         <div class="feature-row">
           <div class="feature-icon">💰</div>
           <div class="feature-text">
             <strong>Price Competitively</strong>
             <span>Check similar properties in your area for reference</span>
           </div>
         </div>
       </div>`,
      ["View Listing", `${URL}/listings/${listingId}`],
      `Your listing "${propertyTitle}" is now live on MBPP!`
    );
  },

  listingSubmittedForReview(name: string, title: string) {
    return base(
      "Listing Submitted for Review 📋",
      `<p>Hello <strong>${name}</strong>,</p>
       <p>Your listing <strong>"${title}"</strong> has been submitted for admin review.</p>
       
       <div class="highlight-box">
         <p><strong>📋 Under review</strong> — Our team will review your listing within 24 hours and publish it if it meets our quality standards.</p>
       </div>
       
       <p><strong>What we check:</strong></p>
       <div class="features">
         <div class="feature-row">
           <div class="feature-icon">✅</div>
           <div class="feature-text">
             <strong>Accurate Details</strong>
             <span>Property type, location, and pricing information</span>
           </div>
         </div>
         <div class="feature-row">
           <div class="feature-icon">📸</div>
           <div class="feature-text">
             <strong>Photo Quality</strong>
             <span>Clear, well-lit photos of the property</span>
           </div>
         </div>
       </div>
       
       <p>You'll receive another email once the listing is approved or if any changes are needed.</p>`,
      ["View My Listings", `${URL}/ambassador`],
      `Your listing "${title}" has been submitted for review. We'll notify you within 24 hours.`
    );
  },

  listingRejected(name: string, title: string) {
    return base(
      "Listing Needs Revision ✏️",
      `<p>Hello <strong>${name}</strong>,</p>
       <p>Your listing <strong>"${title}"</strong> was returned for revision. Please update the listing details and resubmit.</p>
       
       <div class="warning-box">
         <p><strong>✏️ Revision needed</strong> — Your listing didn't meet our quality standards. Please review the feedback below and resubmit.</p>
       </div>
       
       <p><strong>Common reasons for rejection:</strong></p>
       <div class="features">
         <div class="feature-row">
           <div class="feature-icon">📝</div>
           <div class="feature-text">
             <strong>Incomplete Description</strong>
             <span>Add detailed information about the property features and amenities</span>
           </div>
         </div>
         <div class="feature-row">
           <div class="feature-icon">📸</div>
           <div class="feature-text">
             <strong>No Photos</strong>
             <span>Upload at least 3 clear photos of the property</span>
           </div>
         </div>
         <div class="feature-row">
           <div class="feature-icon">💰</div>
           <div class="feature-text">
             <strong>Incorrect Pricing</strong>
             <span>Ensure the price matches current market rates in the area</span>
           </div>
         </div>
       </div>
       
       <p>Once updated, resubmit the listing for review.</p>`,
      ["Edit Listing", `${URL}/ambassador`],
      `Your listing "${title}" needs revision. Please update and resubmit.`
    );
  },

  verificationSubmitted(name: string) {
    return base(
      "Verification Documents Received 📄",
      `<p>Hello <strong>${name}</strong>,</p>
       <p>Your verification documents have been submitted successfully. Our compliance team will review them.</p>
       
       <div class="highlight-box">
         <p><strong>📄 Documents received</strong> — We'll review your documents within 48 hours. Once verified, your listings will display the <strong>Verified Agent</strong> badge.</p>
       </div>
       
       <p><strong>Benefits of verification:</strong></p>
       <div class="features">
         <div class="feature-row">
           <div class="feature-icon">✅</div>
           <div class="feature-text">
             <strong>Verified Badge</strong>
             <span>Stand out with a trust badge on your profile and listings</span>
           </div>
         </div>
         <div class="feature-row">
           <div class="feature-icon">📈</div>
           <div class="feature-text">
             <strong>Higher Visibility</strong>
             <span>Verified agents appear higher in search results</span>
           </div>
         </div>
         <div class="feature-row">
           <div class="feature-icon">🤝</div>
           <div class="feature-text">
             <strong>Build Trust</strong>
             <span>Clients are more likely to contact verified agents</span>
           </div>
         </div>
       </div>`,
      ["Visit Dashboard", `${URL}/login`],
      `${name}, your verification documents have been received. We'll review them within 48 hours.`
    );
  },

  withdrawalRequested(name: string, amount: number) {
    return base(
      "Withdrawal Requested 💸",
      `<p>Hello <strong>${name}</strong>,</p>
       <p>Your withdrawal request has been submitted and is pending admin approval.</p>
       
       <div class="detail-box"><table cellpadding="0" cellspacing="0">
         <tr><td>Amount</td><td style="font-size:16px">₦${amount.toLocaleString()}</td></tr>
         <tr><td>Status</td><td style="color:#d97706">⏳ Pending Approval</td></tr>
       </table></div>
       
       <div class="highlight-box">
         <p><strong>💸 Processing time</strong> — Withdrawals are typically processed within 1–2 business days. You'll receive another email once approved.</p>
       </div>`,
      ["View Wallet", `${URL}/wallet`],
      `Withdrawal request of ₦${amount.toLocaleString()} submitted. Pending admin approval.`
    );
  },

  withdrawalApproved(name: string, amount: number) {
    return base(
      "Withdrawal Approved! ✅",
      `<p>Hello <strong>${name}</strong>,</p>
       <p>Great news! Your withdrawal has been approved and is on its way to your bank account.</p>
       
       <div class="detail-box"><table cellpadding="0" cellspacing="0">
         <tr><td>Amount</td><td style="color:#059669;font-size:16px">₦${amount.toLocaleString()}</td></tr>
         <tr><td>Status</td><td style="color:#059669">✅ Approved</td></tr>
       </table></div>
       
       <div class="highlight-box">
         <p><strong>💰 On its way</strong> — The funds will reflect in your bank account within 24 hours.</p>
       </div>`,
      ["View Wallet", `${URL}/wallet`],
      `Your withdrawal of ₦${amount.toLocaleString()} has been approved! Funds arriving within 24 hours.`
    );
  },

  withdrawalRejected(name: string, amount: number, reason?: string) {
    return base(
      "Withdrawal Not Approved",
      `<p>Hello <strong>${name}</strong>,</p>
       <p>Unfortunately, your withdrawal request was not approved at this time.</p>
       
       <div class="detail-box"><table cellpadding="0" cellspacing="0">
         <tr><td>Amount</td><td>₦${amount.toLocaleString()}</td></tr>
         <tr><td>Status</td><td style="color:#dc2626">Not Approved</td></tr>
         ${reason ? `<tr><td>Reason</td><td>${reason}</td></tr>` : ""}
       </table></div>
       
       <div class="highlight-box">
         <p><strong>💰 Funds returned</strong> — The amount has been returned to your wallet and is available for future withdrawals.</p>
       </div>
       
       <p>If you have questions or need assistance, please contact our support team.</p>`,
      ["View Wallet", `${URL}/wallet`],
      `Your withdrawal of ₦${amount.toLocaleString()} was not approved. Funds returned to wallet.`
    );
  },

  commissionEarned(name: string, amount: number, dealTitle: string) {
    return base(
      "Commission Earned! 🎉",
      `<p>Hello <strong>${name}</strong>,</p>
       <p>Congratulations! A commission has been credited to your wallet from a successful deal.</p>
       
       <div class="detail-box"><table cellpadding="0" cellspacing="0">
         <tr><td>Deal</td><td>${dealTitle}</td></tr>
         <tr><td>Commission</td><td style="color:#059669;font-size:16px;font-weight:700">₦${amount.toLocaleString()}</td></tr>
       </table></div>
       
       <div class="highlight-box">
         <p><strong>🎉 Keep it up!</strong> Your commission has been credited to your wallet. You can withdraw it or let it accumulate.</p>
       </div>`,
      ["View Wallet", `${URL}/wallet`],
      `You earned ₦${amount.toLocaleString()} commission from "${dealTitle}"!`
    );
  },

  walletFunded(name: string, amount: number, reference: string) {
    return base(
      "Wallet Funded ✅",
      `<p>Hello <strong>${name}</strong>,</p>
       <p>Your wallet has been credited successfully. Here are the details:</p>
       
       <div class="detail-box"><table cellpadding="0" cellspacing="0">
         <tr><td>Amount</td><td style="color:#059669;font-size:16px">₦${amount.toLocaleString()}</td></tr>
         <tr><td>Reference</td><td style="font-family:monospace;font-size:13px">${reference}</td></tr>
         <tr><td>Date</td><td>${new Date().toLocaleDateString("en-NG", { year: "numeric", month: "long", day: "numeric" })}</td></tr>
       </table></div>
       
       <p>Your updated balance is available for withdrawals and listing fees.</p>`,
      ["View Wallet", `${URL}/wallet`],
      `Your wallet has been credited with ₦${amount.toLocaleString()}. Ref: ${reference}`
    );
  },

  taskAssigned(name: string, taskTitle: string, area: string) {
    return base(
      "New Task Assigned 📋",
      `<p>Hello <strong>${name}</strong>,</p>
       <p>A new task has been assigned to you by your ambassador. Please review the details below and get started.</p>
       
       <div class="detail-box"><table cellpadding="0" cellspacing="0">
         <tr><td>Task</td><td>${taskTitle}</td></tr>
         <tr><td>Area</td><td>${area}</td></tr>
       </table></div>
       
       <div class="warning-box">
         <p><strong>⏰ Action required</strong> — Review the task details on your dashboard and begin working on it as soon as possible.</p>
       </div>`,
      ["View Task", `${URL}/agent`],
      `New task assigned: "${taskTitle}" in ${area}. Review it now.`
    );
  },

  taskStatusChanged(name: string, taskTitle: string, status: string) {
    const statusEmoji = status === "fulfilled" ? "✅" : status === "in_progress" ? "🔄" : status === "closed" ? "🔒" : "📋";
    return base(
      `Task Updated ${statusEmoji}`,
      `<p>Hello <strong>${name}</strong>,</p>
       <p>The status of your task has been updated.</p>
       
       <div class="detail-box"><table cellpadding="0" cellspacing="0">
         <tr><td>Task</td><td>${taskTitle}</td></tr>
         <tr><td>New Status</td><td style="text-transform:capitalize;font-weight:700">${status.replace("_", " ")}</td></tr>
       </table></div>`,
      ["View Task", `${URL}/agent`],
      `Task "${taskTitle}" status updated to ${status.replace("_", " ")}.`
    );
  },

  taskCommentAdded(name: string, taskTitle: string, authorName: string) {
    return base(
      "New Comment on Task 💬",
      `<p>Hello <strong>${name}</strong>,</p>
       <p><strong>${authorName}</strong> added a new comment on a task you're working on.</p>
       
       <div class="detail-box"><table cellpadding="0" cellspacing="0">
         <tr><td>Task</td><td>${taskTitle}</td></tr>
         <tr><td>Comment by</td><td>${authorName}</td></tr>
       </table></div>
       
       <p>Sign in to view the comment and respond.</p>`,
      ["View Task", `${URL}/agent`],
      `${authorName} commented on task "${taskTitle}". Sign in to view.`
    );
  },

  reviewSubmitted(agentName: string, rating: number, comment: string) {
    return base(
      `New Review: ${rating}/5 Stars ⭐`,
      `<p>Hello <strong>${agentName}</strong>,</p>
       <p>Great news! You received a new review from a client.</p>
       
       <div class="detail-box"><table cellpadding="0" cellspacing="0">
         <tr><td>Rating</td><td>${"⭐".repeat(rating)} (${rating}/5)</td></tr>
         ${comment ? `<tr><td>Comment</td><td style="font-style:italic">"${comment}"</td></tr>` : ""}
       </table></div>
       
       <div class="highlight-box">
         <p><strong>📈 Build your reputation</strong> — Reviews help build trust with potential clients and increase your visibility on the platform.</p>
       </div>`,
      ["View Profile", `${URL}/agent`],
      `You received a ${rating}/5 star review! ${comment ? `"${comment}"` : ""}`
    );
  },

  reviewModerated(name: string, status: string) {
    return base(
      `Review ${status.charAt(0).toUpperCase() + status.slice(1)} ${status === "approved" ? "✅" : "❌"}`,
      `<p>Hello <strong>${name}</strong>,</p>
       <p>Your review has been <strong>${status}</strong> by our moderation team.</p>
       
       ${status === "approved" 
         ? `<div class="highlight-box"><p><strong>✅ Published</strong> — Your review is now visible on the agent's profile and helps other clients make informed decisions.</p></div>`
         : `<div class="warning-box"><p><strong>❌ Not published</strong> — Your review did not meet our community guidelines. Please ensure reviews are honest, constructive, and based on genuine experiences.</p></div>`}`,
      ["Visit Platform", `${URL}`],
      `Your review has been ${status} by our moderation team.`
    );
  },

  agreementCancelled(name: string, propertyTitle: string) {
    return base(
      "Agreement Cancelled",
      `<p>Hello <strong>${name}</strong>,</p>
       <p>The tenancy agreement for <strong>"${propertyTitle}"</strong> has been cancelled.</p>
       
       <div class="warning-box">
         <p><strong>📄 Agreement cancelled</strong> — If you have any questions about this cancellation or need to create a new agreement, please contact your agent or our support team.</p>
       </div>
       
       <p style="font-size:13px;color:#64748b">If you believe this was done in error, please contact us immediately.</p>`,
      ["Contact Support", `mailto:support@mbpproperties.com`],
      `The tenancy agreement for "${propertyTitle}" has been cancelled.`
    );
  },

  customOrderReceived(name: string, email: string, propertyType: string, area: string, budget: number) {
    return base(
      "New Custom Property Request 📋",
      `<h2 style="margin-bottom:16px">New Custom Property Request</h2>
       <div class="detail-box"><table cellpadding="0" cellspacing="0">
         <tr><td>Client</td><td>${name} (${email})</td></tr>
         <tr><td>Property Type</td><td>${propertyType}</td></tr>
         <tr><td>Area</td><td>${area}</td></tr>
         <tr><td>Budget</td><td>₦${budget.toLocaleString()}</td></tr>
       </table></div>
       
       <p>A new custom property request has been submitted. Route to the appropriate ambassador in ${area}.</p>`,
      ["View Dashboard", `${URL}/admin`],
      `New custom order: ${propertyType} in ${area}, budget ₦${budget.toLocaleString()}`
    );
  },
};
