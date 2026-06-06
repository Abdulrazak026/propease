import { Router, Response } from "express";
import crypto from "crypto";
import prisma from "../lib/prisma";
import { logger } from "../lib/logger";
import { emailService } from "../services/email";
const router = Router();

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY || "";
const PAYSTACK_API = "https://api.paystack.co";

router.post("/initialize", async (req, res: Response) => {
  try {
    const { email, amount, metadata } = req.body;
    const response = await fetch(`${PAYSTACK_API}/transaction/initialize`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        amount: Math.round(amount * 100),
        currency: "NGN",
        metadata,
        callback_url: `${req.headers.origin}/wallet?paystack_callback=1`,
      }),
    });
    const data = await response.json() as { status: boolean; message: string; data: unknown };
    if (!data.status) return res.status(400).json({ error: data.message });
    res.json(data.data);
  } catch (error) {
    logger.error({ err: error }, "Paystack init error:");
    res.status(500).json({ error: "Payment initialization failed" });
  }
});

router.get("/verify/:reference", async (req, res: Response) => {
  try {
    const response = await fetch(`${PAYSTACK_API}/transaction/verify/${req.params.reference}`, {
      headers: { Authorization: `Bearer ${PAYSTACK_SECRET_KEY}` },
    });
    const data = await response.json() as { status: boolean; message: string; data: unknown };
    if (!data.status) return res.status(400).json({ error: data.message });
    res.json(data.data);
  } catch (error) {
    res.status(500).json({ error: "Verification failed" });
  }
});

router.post("/webhook", async (req, res: Response) => {
  try {
    const hash = crypto
      .createHmac("sha512", PAYSTACK_SECRET_KEY)
      .update(JSON.stringify(req.body))
      .digest("hex");

    if (hash !== req.headers["x-paystack-signature"]) {
      return res.status(401).json({ error: "Invalid signature" });
    }

    const event = req.body as any;

    await prisma.paymentEvent.create({
      data: {
        provider: "PAYSTACK",
        eventType: event.event || "unknown",
        reference: event.data?.reference,
        amount: event.data?.amount ? event.data.amount / 100 : null,
        currency: event.data?.currency || "NGN",
        status: event.data?.status,
        payload: event,
        processedAt: new Date(),
      },
    });

    if (event.event === "charge.success") {
      const { metadata, reference, amount, customer } = event.data;
      const userId = metadata?.userId;
      if (userId) {
        await prisma.$transaction(async (tx: any) => {
          await tx.wallet.update({
            where: { userId },
            data: { balance: { increment: amount / 100 } },
          });
          await tx.transaction.create({
            data: {
              userId,
              type: "top_up",
              amount: amount / 100,
              reference: reference,
              method: "wallet",
              status: "completed",
            },
          });
        });
        const user = await prisma.user.findUnique({ where: { id: userId }, select: { email: true, name: true } });
        emailService.walletFunded(user?.email || "", user?.name || "", amount / 100, reference).catch(() => {});
      }
    }

    res.sendStatus(200);
  } catch (error) {
    logger.error({ err: error }, "Paystack webhook error:");
    res.sendStatus(200);
  }
});

export default router;


