import { Router, Response } from "express";
import prisma from "../lib/prisma";
import { authenticate, AuthRequest } from "../middleware/auth";
import { logger } from "../lib/logger";
import { emailService } from "../services/email";
import { processRefund, calculateRefundAmount } from "../services/refund";
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

router.post("/:id/cancel", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    const reservation: any = await prisma.reservation.findUnique({
      where: { id },
      include: {
        listing: { select: { id: true, title: true, cancellationPolicy: true, status: true } },
        user: { select: { id: true, email: true, name: true } },
      },
    });

    if (!reservation) return res.status(404).json({ error: "Reservation not found" });
    if (reservation.userId !== req.user!.id) return res.status(403).json({ error: "Unauthorized" });
    if (reservation.status === "cancelled" || reservation.status === "expired") {
      return res.status(400).json({ error: "Reservation is already cancelled or expired" });
    }

    const now = new Date();
    const hoursSinceBooking = (now.getTime() - new Date(reservation.createdAt).getTime()) / (1000 * 60 * 60);
    const hoursUntilMeeting = reservation.meetingDate
      ? (new Date(reservation.meetingDate).getTime() - now.getTime()) / (1000 * 60 * 60)
      : null;

    const policy = reservation.listing?.cancellationPolicy || "flexible";
    const { refundAmount, fee } = calculateRefundAmount(
      reservation.holdingDeposit,
      policy,
      hoursSinceBooking,
      hoursUntilMeeting,
    );

    const listingTitle = reservation.listing?.title || "Property";

    await prisma.$transaction(async (tx) => {
      await tx.reservation.update({
        where: { id },
        data: {
          status: "cancelled",
          cancelledAt: now,
          cancelledByUserId: req.user!.id,
          cancellationReason: "Cancelled by client",
          refundAmount: refundAmount || null,
        },
      });

      await tx.listing.update({
        where: { id: reservation.listingId },
        data: { status: "available" },
      });

      await tx.reservationLog.create({
        data: {
          action: "cancelled",
          oldStatus: reservation.status,
          newStatus: "cancelled",
          reason: "Client requested cancellation",
          reservationId: id,
          userId: req.user!.id,
        },
      });
    });

    if (refundAmount > 0 && reservation.paymentRef) {
      const refundResult = await processRefund(id, refundAmount * 100, reservation.paymentRef, "Client requested cancellation");
      if (!refundResult.success) {
        logger.warn({ reservationId: id, error: refundResult.error }, "Refund failed during cancellation — manual refund needed");
      }
    }

    const userEmail = reservation.user?.email;
    if (userEmail) {
      emailService.reservationCancelled(
        userEmail,
        reservation.user?.name || "Customer",
        listingTitle,
        refundAmount,
        reservation.holdingDeposit,
      ).catch(() => {});
    }

    res.json({ success: true, refundAmount, fee, message: `Reservation cancelled. Refund: ₦${refundAmount.toLocaleString()}` });
  } catch (error) {
    logger.error({ err: error }, "Cancel reservation error:");
    res.status(500).json({ error: "Failed to cancel reservation" });
  }
});

router.post("/:id/admin-cancel", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    if (req.user!.role !== "head" && req.user!.role !== "admin") {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const id = req.params.id as string;
    const { reason, processRefund: shouldRefund } = req.body;

    const reservation: any = await prisma.reservation.findUnique({
      where: { id },
      include: {
        listing: { select: { id: true, title: true, status: true } },
        user: { select: { id: true, email: true, name: true } },
      },
    });

    if (!reservation) return res.status(404).json({ error: "Reservation not found" });
    if (reservation.status === "cancelled" || reservation.status === "expired") {
      return res.status(400).json({ error: "Reservation is already cancelled or expired" });
    }

    const now = new Date();
    const refundAmount = shouldRefund ? reservation.holdingDeposit : 0;

    await prisma.$transaction(async (tx) => {
      await tx.reservation.update({
        where: { id },
        data: {
          status: "cancelled",
          cancelledAt: now,
          cancelledByUserId: req.user!.id,
          cancellationReason: reason || "Cancelled by admin",
          refundAmount: refundAmount || null,
        },
      });

      await tx.listing.update({
        where: { id: reservation.listingId },
        data: { status: "available" },
      });

      await tx.reservationLog.create({
        data: {
          action: "cancelled",
          oldStatus: reservation.status,
          newStatus: "cancelled",
          reason: reason || "Admin cancelled reservation",
          reservationId: id,
          userId: req.user!.id,
        },
      });
    });

    if (refundAmount > 0 && reservation.paymentRef) {
      const refundResult = await processRefund(id, refundAmount * 100, reservation.paymentRef, reason || "Admin-initiated cancellation");
      if (!refundResult.success) {
        logger.warn({ reservationId: id, error: refundResult.error }, "Admin refund failed — manual refund needed");
      }
    }

    const listingTitle = reservation.listing?.title || "Property";
    const userEmail = reservation.user?.email;
    if (userEmail) {
      emailService.adminReservationCancelled(
        userEmail,
        reservation.user?.name || "Customer",
        listingTitle,
        reason || "",
        refundAmount,
      ).catch(() => {});
    }

    res.json({ success: true, refundAmount, message: `Reservation cancelled by admin. Refund: ₦${refundAmount.toLocaleString()}` });
  } catch (error) {
    logger.error({ err: error }, "Admin cancel reservation error:");
    res.status(500).json({ error: "Failed to cancel reservation" });
  }
});

router.post("/:id/reschedule", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    const { meetingDate, meetingTime } = req.body as { meetingDate?: string; meetingTime?: string };

    if (!meetingDate || !meetingTime) {
      return res.status(400).json({ error: "Meeting date and time are required" });
    }

    const reservation: any = await prisma.reservation.findUnique({
      where: { id },
      include: {
        listing: { select: { id: true, title: true } },
        user: { select: { id: true, email: true, name: true } },
      },
    });

    if (!reservation) return res.status(404).json({ error: "Reservation not found" });
    if (reservation.status !== "confirmed") return res.status(400).json({ error: "Only confirmed reservations can be rescheduled" });

    const isOwner = reservation.userId === req.user!.id;
    const isAdmin = req.user!.role === "head" || req.user!.role === "admin";
    if (!isOwner && !isAdmin) return res.status(403).json({ error: "Unauthorized" });

    const oldDate = reservation.meetingDate
      ? new Date(reservation.meetingDate).toLocaleDateString("en-NG", { weekday: "long", year: "numeric", month: "long", day: "numeric" })
      : "";
    const oldTime = reservation.meetingTime || "";

    const newDateStr = new Date(meetingDate).toLocaleDateString("en-NG", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

    const updated = await prisma.reservation.update({
      where: { id },
      data: {
        meetingDate: new Date(meetingDate),
        meetingTime,
      },
    });

    await prisma.reservationLog.create({
      data: {
        action: "rescheduled",
        oldStatus: "confirmed",
        newStatus: "confirmed",
        reason: `Rescheduled from ${oldDate} ${oldTime} to ${newDateStr} ${meetingTime}`,
        reservationId: id,
        userId: req.user!.id,
      },
    });

    const listingTitle = reservation.listing?.title || "Property";
    const userEmail = reservation.user?.email;
    if (userEmail) {
      emailService.reservationRescheduled(
        userEmail,
        reservation.user?.name || "Customer",
        listingTitle,
        oldDate,
        oldTime,
        newDateStr,
        meetingTime,
      ).catch(() => {});
    }

    res.json({ success: true, reservation: updated });
  } catch (error) {
    logger.error({ err: error }, "Reschedule reservation error:");
    res.status(500).json({ error: "Failed to reschedule reservation" });
  }
});

router.get("/:id/logs", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;

    if (req.user!.role !== "head" && req.user!.role !== "admin") {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const logs = await prisma.reservationLog.findMany({
      where: { reservationId: id },
      include: { user: { select: { id: true, name: true, email: true } } },
      orderBy: { createdAt: "desc" },
    });

    res.json({ logs });
  } catch (error) {
    logger.error({ err: error }, "Get reservation logs error:");
    res.status(500).json({ error: "Failed to fetch reservation logs" });
  }
});

export default router;
