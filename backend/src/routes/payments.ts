import { Router, Response } from "express";
import crypto from "crypto";
import prisma from "../lib/prisma";
import { logger } from "../lib/logger";
import { emailService } from "../services/email";
const router = Router();

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY || "";
const PAYSTACK_WEBHOOK_SECRET = process.env.PAYSTACK_WEBHOOK_SECRET || "";
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
        callback_url: `${process.env.FRONTEND_URL || "https://mbpproperties.com"}/deals`,
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
    const rawBody = (req as any).rawBody || JSON.stringify(req.body);
    const secret = PAYSTACK_WEBHOOK_SECRET || PAYSTACK_SECRET_KEY;
    const hash = crypto
      .createHmac("sha512", secret)
      .update(rawBody)
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
      const { metadata, reference, amount } = event.data;
      const purpose = metadata?.purpose;
      const userId = metadata?.userId;
      const amountInNaira = amount / 100;

      // Idempotency: check if this reference was already processed
      const existingTx = await prisma.transaction.findFirst({ where: { reference } });
      if (existingTx) {
        logger.warn({ reference }, "Duplicate webhook event — skipping");
        res.sendStatus(200);
        return;
      }

      if (purpose === "reservation_deposit" && userId && metadata?.listingId) {
        const listingId = metadata.listingId as string;
        const listing = await prisma.listing.findUnique({ where: { id: listingId } });
        if (!listing) { res.sendStatus(200); return; }

        const days = listing.reservationDays || 2;
        const user = await prisma.user.findUnique({ where: { id: userId }, select: { name: true } });

        await prisma.$transaction(async (tx: any) => {
          const reservation = await tx.reservation.create({
            data: {
              listingId,
              userId,
              clientName: user?.name || "Client",
              holdingDeposit: amountInNaira,
              status: "confirmed",
              paymentRef: reference,
              expiresAt: new Date(Date.now() + days * 24 * 60 * 60 * 1000),
            },
          });
          await tx.listing.update({ where: { id: listingId }, data: { status: "reserved" } });
          await tx.transaction.create({
            data: {
              userId,
              type: "reservation_deposit",
              amount: amountInNaira,
              reference,
              method: "card",
              status: "completed",
            },
          });
        });

        const admins = await prisma.user.findMany({ where: { role: "head" }, select: { id: true } });
        for (const admin of admins) {
          await prisma.notification.create({
            data: {
              userId: admin.id,
              type: "application_status",
              title: "New Reservation",
              body: `${user?.name || "A user"} reserved "${listing.title}" with ${amountInNaira.toLocaleString()} deposit.`,
              link: "/admin/reservations",
            },
          }).catch(() => {});
        }

        emailService.paymentReceipt(user?.email || "", user?.name || "", amountInNaira, reference, `Reservation: ${listing.title}`).catch(() => {});
      } else if (purpose === "property_full_payment" && userId && metadata?.listingId) {
        const listingId = metadata.listingId as string;
        const listing = await prisma.listing.findUnique({ where: { id: listingId } });
        if (!listing) { res.sendStatus(200); return; }

        const user = await prisma.user.findUnique({ where: { id: userId }, select: { name: true, email: true } });

        await prisma.$transaction(async (tx: any) => {
          await tx.listing.update({ where: { id: listingId }, data: { status: "sold" } });
          await tx.soldProperty.create({
            data: {
              listingId,
              title: listing.title,
              city: listing.city,
              salePrice: amountInNaira,
              coverPhoto: listing.photos?.[0]?.url || null,
              paymentRef: reference,
              buyerId: userId,
              agentId: listing.assignedAgentId,
              agentName: null,
            },
          });
          await tx.transaction.create({
            data: {
              userId,
              type: "property_full_payment",
              amount: amountInNaira,
              reference,
              method: "card",
              status: "completed",
            },
          });
        });

        emailService.paymentReceipt(user?.email || "", user?.name || "", amountInNaira, reference, `Purchase: ${listing.title}`).catch(() => {});
      } else if (purpose === "property_down_payment" && userId && metadata?.listingId) {
        const listingId = metadata.listingId as string;
        const listing = await prisma.listing.findUnique({ where: { id: listingId } });
        if (!listing) { res.sendStatus(200); return; }

        const user = await prisma.user.findUnique({ where: { id: userId }, select: { name: true, email: true } });

        await prisma.$transaction(async (tx: any) => {
          await tx.listing.update({ where: { id: listingId }, data: { status: "reserved" } });
          await tx.transaction.create({
            data: {
              userId,
              type: "property_down_payment",
              amount: amountInNaira,
              reference,
              method: "card",
              status: "completed",
            },
          });
        });

        emailService.paymentReceipt(user?.email || "", user?.name || "", amountInNaira, reference, `Down Payment: ${listing.title}`).catch(() => {});
      }
    }

    res.sendStatus(200);
  } catch (error) {
    logger.error({ err: error }, "Paystack webhook error:");
    res.sendStatus(200);
  }
});

export default router;
