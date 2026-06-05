import { Router, Response } from "express";
import prisma from "../lib/prisma";
import { authenticate, AuthRequest } from "../middleware/auth";
import { authorize } from "../middleware/rbac";
import { validate } from "../middleware/validate";
import { createListingSchema } from "../validators";

const router = Router();

router.get("/", async (req, res: Response) => {
  try {
    const { city, listingType, propertyType, status, minPrice, maxPrice, search } = req.query;

    const where: any = {};

    if (city) where.city = city;
    if (listingType) where.listingType = listingType;
    if (propertyType) where.propertyType = propertyType;
    if (status) where.status = status;
    else where.status = "available";
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

    const listings = await prisma.listing.findMany({
      where,
      include: {
        photos: { orderBy: { order: "asc" } },
        postedBy: { select: { id: true, name: true, role: true, isVerified: true } },
        assignedAgent: { select: { id: true, name: true, isVerified: true, whatsapp: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json({ listings });
  } catch (error) {
    console.error("List listings error:", error);
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
    console.error("Get listing error:", error);
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

    res.status(201).json({ listing });
  } catch (error) {
    console.error("Create listing error:", error);
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

    const updated = await prisma.listing.update({
      where: { id: listingId },
      data: req.body,
      include: { photos: true, postedBy: { select: { id: true, name: true } } },
    });

    res.json({ listing: updated });
  } catch (error) {
    console.error("Update listing error:", error);
    res.status(500).json({ error: "Failed to update listing" });
  }
});

router.delete("/:id", authenticate, authorize("head"), async (req: AuthRequest, res: Response) => {
  try {
    await prisma.listing.delete({ where: { id: req.params.id as string } });
    res.json({ message: "Listing deleted" });
  } catch (error) {
    console.error("Delete listing error:", error);
    res.status(500).json({ error: "Failed to delete listing" });
  }
});

export default router;
