import { Router, Response } from "express";
import prisma from "../lib/prisma";
import { authenticate, AuthRequest } from "../middleware/auth";
import { logger } from "../lib/logger";
import { emailService } from "../services/email";
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
    if (req.user!.role !== "head" && req.user!.role !== "admin") {
      return res.status(403).json({ error: "Unauthorized" });
    }
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

router.patch("/:id/confirm", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    if (req.user!.role !== "head" && req.user!.role !== "admin") {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const { meetingDate, meetingTime } = req.body;
    if (!meetingDate || !meetingTime) {
      return res.status(400).json({ error: "Meeting date and time are required" });
    }

    const id = req.params.id as string;

    const reservation: any = await prisma.reservation.findUnique({
      where: { id },
      include: {
        listing: { select: { id: true, title: true } },
        user: { select: { id: true, name: true, email: true } },
      },
    });

    if (!reservation) return res.status(404).json({ error: "Reservation not found" });

    const userEmail = reservation.user?.email as string | undefined;
    const userName = reservation.user?.name || "Customer";
    const listingTitle = reservation.listing?.title || "Property";

    const updated = await prisma.reservation.update({
      where: { id },
      data: {
        status: "confirmed",
        meetingDate: new Date(meetingDate),
        meetingTime,
        confirmedById: req.user!.id,
      },
    });

    if (userEmail) {
      const meetingDateStr = new Date(meetingDate).toLocaleDateString("en-NG", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
      emailService.reservationConfirmed(
        userEmail,
        userName,
        listingTitle,
        meetingDateStr,
        meetingTime,
      ).catch(() => {});
    }

    res.json({ reservation: updated });
  } catch (error) {
    logger.error({ err: error }, "Confirm reservation error:");
    res.status(500).json({ error: "Failed to confirm reservation" });
  }
});

router.patch("/:id/reject", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    if (req.user!.role !== "head" && req.user!.role !== "admin") {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const { reason } = req.body;
    const id = req.params.id as string;

    const reservation: any = await prisma.reservation.findUnique({
      where: { id },
      include: {
        listing: { select: { id: true, title: true } },
        user: { select: { id: true, name: true, email: true } },
      },
    });

    if (!reservation) return res.status(404).json({ error: "Reservation not found" });

    const userEmail = reservation.user?.email as string | undefined;
    const userName = reservation.user?.name || "Customer";
    const listingTitle = reservation.listing?.title || "Property";

    const updated = await prisma.reservation.update({
      where: { id },
      data: { status: "cancelled" },
    });

    await prisma.listing.update({
      where: { id: reservation.listingId },
      data: { status: "available" },
    }).catch(() => {});

    if (userEmail) {
      emailService.reservationRejected(
        userEmail,
        userName,
        listingTitle,
        reason || "",
      ).catch(() => {});
    }

    res.json({ reservation: updated });
  } catch (error) {
    logger.error({ err: error }, "Reject reservation error:");
    res.status(500).json({ error: "Failed to reject reservation" });
  }
});

export default router;
