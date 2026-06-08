import { Router, Response } from "express";
import prisma from "../lib/prisma";
import { authenticate } from "../middleware/auth";
import { authorize } from "../middleware/rbac";
import { invalidate } from "../lib/cache";
import { templates } from "../services/email-templates";

const router = Router();

router.get("/", authenticate, authorize("head"), async (_req, res: Response) => {
  try {
    const settings = await prisma.siteSettings.findMany();
    const map: Record<string, string> = {};
    for (const s of settings) {
      map[s.key] = s.value;
    }
    res.json({ settings: map });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch settings" });
  }
});

router.get("/email-preview/:key", authenticate, authorize("head"), async (req, res: Response) => {
  try {
    const settingKey = req.params.key;

    const keyMap: Record<string, string> = {
      welcome_template: "welcome",
      agent_application_template: "agentApplicationSubmitted",
      approved_template: "accountApproved",
      account_suspended_template: "accountSuspended",
      reset_template: "passwordReset",
      password_changed_template: "passwordChanged",
      inquiry_template: "inquiryNotification",
      application_received_template: "applicationReceived",
      application_template: "applicationStatus",
      agreement_template: "agreementReady",
      agreement_signed_template: "agreementSigned",
      agreement_cancelled_template: "agreementCancelled",
      listing_submitted_template: "listingSubmittedForReview",
      listing_published_template: "listingPublished",
      listing_rejected_template: "listingRejected",
      verification_template: "verificationSubmitted",
      task_assigned_template: "taskAssigned",
      task_status_template: "taskStatusChanged",
      task_comment_template: "taskCommentAdded",
      commission_template: "commissionEarned",
      wallet_template: "walletFunded",
      payment_template: "paymentReceipt",
      withdrawal_requested_template: "withdrawalRequested",
      withdrawal_approved_template: "withdrawalApproved",
      withdrawal_rejected_template: "withdrawalRejected",
      price_drop_template: "priceDropAlert",
      message_template: "newMessage",
      review_submitted_template: "reviewSubmitted",
      review_moderated_template: "reviewModerated",
      newsletter_template: "newsletter",
    };

    const tplKey = keyMap[settingKey] || settingKey;

    const sampleData: Record<string, string> = {
      name: "John Doe", role: "agent", propertyTitle: "3-Bedroom Flat in Kano Municipal",
      status: "approved", senderName: "Jane Smith", amount: "150,000", reference: "MBPP-2026-001",
      purpose: "Wallet Funding", listingId: "abc123", agentName: "John Doe",
      clientName: "Amina Ibrahim", clientContact: "+2348012345678",
      message: "I'm interested in this property. Is it still available?",
      oldPrice: "2,000,000", newPrice: "1,800,000", token: "sample-token-123",
      taskTitle: "Find 3-bed flat in Nassarawa", area: "Kano Municipal",
      authorName: "Admin User", dealTitle: "Duplex Rental Deal",
      propertyType: "House", email: "user@example.com", budget: "1,500,000",
    };

    const tplFn = (templates as any)[tplKey];
    let html = "";
    if (typeof tplFn === "function") {
      const argMap: Record<string, string[]> = {
        welcome: ["name"], agentApplicationSubmitted: ["name"],
        accountApproved: ["name", "role"], accountSuspended: ["name"],
        passwordReset: ["name", "token"], passwordChanged: ["name"],
        inquiryNotification: ["agentName", "clientName", "propertyTitle", "message"],
        inquiryConfirmation: ["clientName", "propertyTitle"],
        applicationReceived: ["name", "propertyTitle"],
        applicationStatus: ["name", "propertyTitle", "status"],
        agreementReady: ["name", "propertyTitle"], agreementSigned: ["name", "propertyTitle"],
        priceDropAlert: ["name", "propertyTitle", "oldPrice", "newPrice"],
        newMessage: ["name", "senderName"],
        paymentReceipt: ["name", "amount", "reference", "purpose"],
        listingPublished: ["agentName", "propertyTitle", "listingId"],
        verificationSubmitted: ["name"],
        withdrawalRequested: ["name", "amount"], withdrawalApproved: ["name", "amount"],
        withdrawalRejected: ["name", "amount"], listingSubmittedForReview: ["name", "propertyTitle"],
        listingRejected: ["name", "propertyTitle"],
        commissionEarned: ["name", "amount", "dealTitle"],
        walletFunded: ["name", "amount", "reference"],
        taskAssigned: ["name", "taskTitle", "area"],
        taskStatusChanged: ["name", "taskTitle", "status"],
        taskCommentAdded: ["name", "taskTitle", "authorName"],
        reviewSubmitted: ["agentName", "amount", "dealTitle"],
        reviewModerated: ["name", "status"],
        agreementCancelled: ["name", "propertyTitle"],
        customOrderReceived: ["name", "email", "propertyType", "area", "budget"],
        newsletter: ["body"],
      };
      const args = (argMap[tplKey] || ["name"]).map(k => sampleData[k] || k);
      html = tplFn(...args);
    } else {
      html = `<p style="color:#999;font-size:14px;">Template "${settingKey}" not found in email-templates.ts</p>`;
    }

    res.json({ html });
  } catch (error) {
    res.status(500).json({ error: "Failed to generate preview" });
  }
});

router.put("/", authenticate, authorize("head"), async (req, res: Response) => {
  try {
    const { settings } = req.body as { settings: Record<string, string> };
    for (const [key, value] of Object.entries(settings)) {
      await prisma.siteSettings.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      });
    }
    invalidate("settings:public");
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to save settings" });
  }
});

export default router;
