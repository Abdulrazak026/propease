import { Router, Response } from "express";
import prisma from "../lib/prisma";
import { authenticate, AuthRequest } from "../middleware/auth";
import { logger } from "../lib/logger";
const router = Router();

router.post("/:listingId", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const listingId = req.params.listingId as string;
    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
      select: { id: true, status: true, title: true },
    });

    if (!listing) return res.status(404).json({ error: "Listing not found" });
    if (listing.status !== "available") return res.status(400).json({ error: "Listing is not available" });

    const depositAmount = Math.round(50000);

    const reservation = await prisma.reservation.create({
      data: {
        listingId,
        userId: req.user!.id,
        clientName: req.user!.id,
        holdingDeposit: depositAmount,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    });

    await prisma.listing.update({
      where: { id: listingId },
      data: { status: "reserved" },
    });

    res.status(201).json({ reservation });
  } catch (error) {
    logger.error({ err: error }, "Create reservation error:");
    res.status(500).json({ error: "Failed to create reservation" });
  }
});

router.get("/my", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const reservations = await prisma.reservation.findMany({
      where: { userId: req.user!.id },
      include: { listing: { select: { id: true, title: true, address: true, price: true } } },
      orderBy: { createdAt: "desc" },
    });

    res.json({ reservations });
  } catch (error) {
    logger.error({ err: error }, "List reservations error:");
    res.status(500).json({ error: "Failed to fetch reservations" });
  }
});

export default router;


