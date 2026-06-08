import { Router, Response } from "express";
import { emailService } from "../services/email";
import { logger } from "../lib/logger";
import prisma from "../lib/prisma";

const router = Router();

router.post("/", async (req, res: Response) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: "Name, email, and message are required" });
    }

    await prisma.contactSubmission.create({
      data: { name, email, phone: phone || null, subject: subject || "General Inquiry", message },
    });

    await emailService.contactFormSubmission({
      name, email, phone: phone || "", subject: subject || "General Inquiry", message,
    });

    res.json({ success: true, message: "Message sent successfully" });
  } catch (error) {
    logger.error({ err: error }, "Contact form error:");
    res.status(500).json({ error: "Failed to send message" });
  }
});

export default router;
