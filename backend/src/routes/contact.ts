import { Router, Response } from "express";
import { emailService } from "../services/email";
import { authenticate, AuthRequest } from "../middleware/auth";
import { authorize } from "../middleware/rbac";
import { logger } from "../lib/logger";
import prisma from "../lib/prisma";

const router = Router();

router.post("/", async (req, res: Response) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: "Name, email, and message are required" });
    }

    const submission = await prisma.contactSubmission.create({
      data: { name, email, phone: phone || null, subject: subject || "General Inquiry", message },
    });

    await emailService.contactFormSubmission({
      name, email, phone: phone || "", subject: subject || "General Inquiry", message,
    });

    // Notify head admins if this is a follow-up (existing replies on any previous submission from this email)
    const existingReplies = await prisma.contactReply.findFirst({
      where: { contact: { email } },
    });
    if (existingReplies) {
      const admins = await prisma.user.findMany({
        where: { role: "head", suspendedAt: null },
        select: { id: true },
      });
      const link = "/admin/submissions";
      for (const admin of admins) {
        prisma.notification.create({
          data: {
            userId: admin.id,
            type: "message_received",
            title: `New follow-up from ${name}`,
            body: message.slice(0, 120),
            link,
          },
        }).catch(() => {});
      }
    }

    res.json({ success: true, message: "Message sent successfully" });
  } catch (error) {
    logger.error({ err: error }, "Contact form error:");
    res.status(500).json({ error: "Failed to send message" });
  }
});

router.post("/reply", authenticate, authorize("head"), async (req: AuthRequest, res: Response) => {
  try {
    const { contactId, email, name, message } = req.body;
    if (!email || !message) {
      return res.status(400).json({ error: "Email and message are required" });
    }

    await emailService.supportMessage(email, name || "User", message);

    if (contactId) {
      await prisma.contactSubmission.update({
        where: { id: contactId },
        data: { read: true },
      }).catch(() => {});
    }

    // Store reply in DB for conversation history
    const reply = await prisma.contactReply.create({
      data: { contactId, body: message },
    });

    res.json({ success: true, reply: { id: reply.id, body: reply.body, createdAt: reply.createdAt } });
  } catch (error) {
    logger.error({ err: error }, "Contact reply error:");
    res.status(500).json({ error: "Failed to send reply" });
  }
});

export default router;
