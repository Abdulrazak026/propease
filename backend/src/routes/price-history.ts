import { Router, Response } from "express";
import prisma from "../lib/prisma";
import { logger } from "../lib/logger";
const router = Router();

router.get("/listing/:listingId", async (req, res: Response) => {
  try {
    const changes = await prisma.priceChange.findMany({
      where: { listingId: req.params.listingId },
      orderBy: { createdAt: "asc" },
      include: {
        changedBy: { select: { id: true, name: true } },
      },
    });

    const listing = await prisma.listing.findUnique({
      where: { id: req.params.listingId },
      select: { price: true, salePrice: true, annualRent: true, createdAt: true },
    });

    res.json({ changes, currentPrice: listing?.price || listing?.salePrice || listing?.annualRent || 0 });
  } catch (error) {
    logger.error({ err: error }, "Price history error:");
    res.status(500).json({ error: "Failed to fetch price history" });
  }
});

export default router;


