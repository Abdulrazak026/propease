import { Router, Response } from "express";
import prisma from "../lib/prisma";
import { authenticate, AuthRequest } from "../middleware/auth";
import { logger } from "../lib/logger";
const router = Router();

router.post("/:listingId", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const listingId = req.params.listingId as string;
    const { paymentRef } = req.body;

    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
      select: { id: true, status: true, title: true, depositAmount: true, reservationDays: true, listingType: true, price: true, damageDeposit: true, salePrice: true },
    });

    if (!listing) return res.status(404).json({ error: "Listing not found" });
    if (listing.status !== "available") return res.status(400).json({ error: "Listing is not available" });

    // Calculate deposit: use listing's depositAmount, or fallback to listing-type logic
    const depositAmount = listing.depositAmount
      || (listing.listingType === "rent" ? (listing.damageDeposit || Math.round(listing.price * 0.1)) : Math.round((listing.salePrice || listing.price) * 0.05));

    const days = listing.reservationDays || 2;

    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: { name: true, email: true },
    });

    const reservation = await prisma.reservation.create({
      data: {
        listingId,
        userId: req.user!.id,
        clientName: user?.name || "Unknown",
        holdingDeposit: depositAmount,
        status: paymentRef ? "confirmed" : "pending_payment",
        paymentRef: paymentRef || null,
        expiresAt: new Date(Date.now() + days * 24 * 60 * 60 * 1000),
      },
    });

    await prisma.listing.update({
      where: { id: listingId },
      data: { status: "reserved" },
    });

    // Notify admin
    const admins = await prisma.user.findMany({ where: { role: "head" }, select: { id: true } });
    for (const admin of admins) {
      await prisma.notification.create({
        data: {
          userId: admin.id,
          type: "application_status",
          title: "New Reservation",
          body: `${user?.name || "A user"} reserved "${listing.title}" with ${depositAmount.toLocaleString()} deposit.`,
          link: "/admin/reservations",
        },
      }).catch(() => {});
    }

    res.status(201).json({ reservation, depositAmount, reservationDays: days });
  } catch (error) {
    logger.error({ err: error }, "Create reservation error:");
    res.status(500).json({ error: "Failed to create reservation" });
  }
});

router.get("/my", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const reservations = await prisma.reservation.findMany({
      where: { userId: req.user!.id },
      include: { listing: { select: { id: true, title: true, address: true, price: true, salePrice: true, listingType: true } } },
      orderBy: { createdAt: "desc" },
    });

    res.json({ reservations });
  } catch (error) {
    logger.error({ err: error }, "List reservations error:");
    res.status(500).json({ error: "Failed to fetch reservations" });
  }
});

router.get("/all", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const reservations = await prisma.reservation.findMany({
      include: {
        listing: { select: { id: true, title: true, address: true, price: true } },
        user: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    res.json({ reservations });
  } catch (error) {
    logger.error({ err: error }, "List all reservations error:");
    res.status(500).json({ error: "Failed to fetch reservations" });
  }
});

export default router;
