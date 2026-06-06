import { Router, Response } from "express";
import prisma from "../lib/prisma";
import { authenticate, AuthRequest } from "../middleware/auth";
import { FEES } from "../config/fees";
import { authorize } from "../middleware/rbac";
import { validate } from "../middleware/validate";
import { createListingSchema } from "../validators";
import { logger } from "../lib/logger";
import { invalidate } from "../lib/cache";
import { emailService } from "../services/email";
const router = Router();

router.get("/", async (req, res: Response) => {
  try {
    const { city, listingType, propertyType, status, minPrice, maxPrice, search, limit, offset } = req.query;

    const where: any = {};

    if (city) where.city = city;
    if (listingType) where.listingType = listingType;
    if (propertyType) where.propertyType = propertyType;
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { title: { contains: search as string, mode: "insensitive" } },
        { address: { contains: search as string, mode: "insensitive" } },
      ];
    }
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseInt(minPrice as string);
      if (maxPrice) where.price.lte = parseInt(maxPrice as string);
    }

    const take = Math.min(parseInt(limit as string) || 20, 100);
    const skip = parseInt(offset as string) || 0;

    const [listings, total] = await Promise.all([
      prisma.listing.findMany({
        where,
        take,
        skip,
        include: {
          photos: { orderBy: { order: "asc" } },
          postedBy: { select: { id: true, name: true, role: true, isVerified: true } },
          assignedAgent: { select: { id: true, name: true, isVerified: true, whatsapp: true } },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.listing.count({ where }),
    ]);

    res.json({ listings, total, limit: take, offset: skip });
  } catch (error) {
    logger.error({ err: error }, "List listings error:");
    res.status(500).json({ error: "Failed to fetch listings" });
  }
});

router.get("/:id", async (req, res: Response) => {
  try {
    const listingId = req.params.id as string;
    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
      include: {
        photos: { orderBy: { order: "asc" } },
        postedBy: { select: { id: true, name: true, role: true, isVerified: true } },
        assignedAgent: { select: { id: true, name: true, email: true, isVerified: true, whatsapp: true } },
      },
    });

    if (!listing) {
      return res.status(404).json({ error: "Listing not found" });
    }

    res.json({ listing });
  } catch (error) {
    logger.error({ err: error }, "Get listing error:");
    res.status(500).json({ error: "Failed to fetch listing" });
  }
});

router.post("/", authenticate, authorize("head", "ambassador"), validate(createListingSchema), async (req: AuthRequest, res: Response) => {
  try {
    const data = req.body;

    if (req.user!.role === "ambassador") {
      const userCities = await prisma.userCity.findMany({
        where: { userId: req.user!.id },
        include: { city: true },
      });
      const cityNames = userCities.map((uc) => uc.city.name);
      if (!cityNames.includes(data.city)) {
        return res.status(403).json({ error: "You can only post listings in your assigned cities" });
      }
    }

    const { assignedAgentId, ...listingData } = data;

    const listing = await prisma.listing.create({
      data: {
        ...listingData,
        postedById: req.user!.id,
        assignedAgentId: assignedAgentId || undefined,
        price: data.listingType === "rent" ? data.annualRent || 0 : data.salePrice || 0,
        features: [],
      },
      include: { photos: true },
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        action: "CREATE_LISTING",
        entity: "Listing",
        entityId: listing.id,
        userId: req.user!.id,
      },
    });

    invalidate("listings:*");
    invalidate("dashboard:stats");
    res.status(201).json({ listing });
  } catch (error) {
    logger.error({ err: error }, "Create listing error:");
    res.status(500).json({ error: "Failed to create listing" });
  }
});

router.put("/:id", authenticate, authorize("head", "ambassador"), async (req: AuthRequest, res: Response) => {
  try {
    const listingId = req.params.id as string;
    const listing = await prisma.listing.findUnique({ where: { id: listingId } });
    if (!listing) {
      return res.status(404).json({ error: "Listing not found" });
    }

    if (req.user!.role === "ambassador" && listing.postedById !== req.user!.id) {
      return res.status(403).json({ error: "You can only edit your own listings" });
    }

    const { photos: newPhotos, ...listingData } = req.body;

    const updated = await prisma.listing.update({
      where: { id: listingId },
      data: listingData,
      include: { photos: true, postedBy: { select: { id: true, name: true } } },
    });

    // Replace photos if provided
    if (Array.isArray(newPhotos) && newPhotos.length > 0) {
      await prisma.listingPhoto.deleteMany({ where: { listingId } });
      await prisma.listingPhoto.createMany({
        data: newPhotos.map((p: { url: string }) => ({ url: p.url, listingId })),
      });
    }

    const fresh = await prisma.listing.findUnique({
      where: { id: listingId },
      include: { photos: true, postedBy: { select: { id: true, name: true } } },
    });

    invalidate("listings:*");
    invalidate("dashboard:stats");
    res.json({ listing: fresh });
  } catch (error) {
    logger.error({ err: error }, "Update listing error:");
    res.status(500).json({ error: "Failed to update listing" });
  }
});

router.post("/:id/submit", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const listing = await prisma.listing.findUnique({ where: { id: req.params.id as string } });
    if (!listing || listing.postedById !== req.user!.id) return res.status(403).json({ error: "Not your listing" });
    if (listing.status !== "draft") return res.status(400).json({ error: "Only draft listings can be submitted" });
    const updated = await prisma.listing.update({ where: { id: req.params.id as string }, data: { status: "review" } });
    invalidate("listings:*");
    invalidate("dashboard:stats");
    res.json({ listing: updated });
    const owner = await prisma.user.findUnique({ where: { id: listing.postedById }, select: { email: true, name: true } });
    emailService.listingSubmittedForReview(owner?.email || "", owner?.name || "", updated.title).catch(() => {});
  } catch (error) {
    res.status(500).json({ error: "Failed to submit for review" });
  }
});

router.post("/:id/approve", authenticate, authorize("head"), async (req: AuthRequest, res: Response) => {
  try {
    const listing = await prisma.listing.findUnique({
      where: { id: req.params.id as string },
      include: { postedBy: { select: { id: true, walletBalance: true } } },
    });
    if (!listing || listing.status !== "review") return res.status(400).json({ error: "Listing not in review" });

    const fee = FEES.LISTING_PUBLICATION_NGN;
    if (listing.postedBy.walletBalance < fee) {
      return res.status(402).json({
        error: "Owner has insufficient wallet balance to publish",
        required: fee,
        current: listing.postedBy.walletBalance,
      });
    }

    await prisma.$transaction(async (tx: any) => {
      await tx.user.update({
        where: { id: listing.postedById },
        data: { walletBalance: { decrement: fee } },
      });
      await tx.transaction.create({
        data: {
          userId: listing.postedById,
          type: "listing_fee",
          amount: -fee,
          reference: listing.id,
          method: "wallet",
          status: "completed",
        },
      });
      await tx.listing.update({
        where: { id: listing.id },
        data: { status: "approved" },
      });
    });
    invalidate("listings:*");
    invalidate("dashboard:stats");
    res.json({ listing: { ...listing, status: "approved" }, message: "Listing approved and published" });
  } catch (error) {
    logger.error({ err: error }, "Failed to approve listing");
    res.status(500).json({ error: "Failed to approve listing" });
  }
});

router.post("/:id/reject", authenticate, authorize("head"), async (req: AuthRequest, res: Response) => {
  try {
    const listing = await prisma.listing.findUnique({ where: { id: req.params.id as string } });
    if (!listing) return res.status(404).json({ error: "Listing not found" });
    const updated = await prisma.listing.update({ where: { id: req.params.id as string }, data: { status: "draft" } });
    invalidate("listings:*");
    invalidate("dashboard:stats");
    res.json({ listing: updated });
    const owner = await prisma.user.findUnique({ where: { id: listing.postedById }, select: { email: true, name: true } });
    emailService.listingRejected(owner?.email || "", owner?.name || "", updated.title).catch(() => {});
  } catch (error) {
    res.status(500).json({ error: "Failed to reject listing" });
  }
});

router.patch("/:id/status", authenticate, authorize("head"), async (req: AuthRequest, res: Response) => {
  try {
    const { status } = req.body;
    const validStatuses = ["draft", "review", "approved", "available", "reserved", "sold", "rented"];
    if (!validStatuses.includes(status)) return res.status(400).json({ error: "Invalid status" });
    const updated = await prisma.listing.update({
      where: { id: req.params.id as string },
      data: { status },
    });
    invalidate("listings:*");
    invalidate("dashboard:stats");
    res.json({ listing: updated });
  } catch (error) {
    logger.error({ err: error }, "Update listing status error:");
    res.status(500).json({ error: "Failed to update status" });
  }
});

router.delete("/:id", authenticate, authorize("head"), async (req: AuthRequest, res: Response) => {
  try {
    await prisma.listing.delete({ where: { id: req.params.id as string } });
    res.json({ message: "Listing deleted" });
  } catch (error) {
    logger.error({ err: error }, "Delete listing error:");
    res.status(500).json({ error: "Failed to delete listing" });
  }
});

export default router;


