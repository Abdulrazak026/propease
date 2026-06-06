import { Router, Response } from "express";
import prisma from "../lib/prisma";
import { authenticate, AuthRequest } from "../middleware/auth";
import { authorize } from "../middleware/rbac";
import { logger } from "../lib/logger";
const router = Router();

router.post("/", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { agentId, listingId, rating, comment } = req.body;

    if (!agentId || !rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: "Agent ID and rating (1-5) are required" });
    }

    if (req.user!.id === agentId) {
      return res.status(400).json({ error: "You cannot review yourself" });
    }

    const existing = await prisma.review.findFirst({
      where: { authorId: req.user!.id, agentId },
    });
    if (existing) {
      return res.status(409).json({ error: "You have already reviewed this agent" });
    }

    const review = await prisma.review.create({
      data: {
        rating,
        comment: comment || undefined,
        authorId: req.user!.id,
        agentId,
        listingId: listingId || undefined,
        status: "pending",
      },
      include: {
        author: { select: { id: true, name: true } },
      },
    });

    res.status(201).json({ review });
  } catch (error) {
    logger.error({ err: error }, "Create review error:");
    res.status(500).json({ error: "Failed to submit review" });
  }
});

router.get("/agent/:agentId", async (req, res: Response) => {
  try {
    const reviews = await prisma.review.findMany({
      where: {
        agentId: req.params.agentId,
        status: "approved",
      },
      include: {
        author: { select: { id: true, name: true } },
        listing: { select: { id: true, title: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    const aggregate = await prisma.review.aggregate({
      where: { agentId: req.params.agentId, status: "approved" },
      _avg: { rating: true },
      _count: { id: true },
    });

    res.json({
      reviews,
      avgRating: aggregate._avg.rating || 0,
      totalReviews: aggregate._count.id,
    });
  } catch (error) {
    logger.error({ err: error }, "Get reviews error:");
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
});

router.get("/", authenticate, authorize("head"), async (req: AuthRequest, res: Response) => {
  try {
    const { status } = req.query;
    const where: any = {};
    if (status) where.status = status;

    const reviews = await prisma.review.findMany({
      where,
      include: {
        author: { select: { id: true, name: true } },
        agent: { select: { id: true, name: true, email: true } },
        listing: { select: { id: true, title: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json({ reviews });
  } catch (error) {
    logger.error({ err: error }, "List reviews error:");
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
});

router.patch("/:id/moderate", authenticate, authorize("head"), async (req: AuthRequest, res: Response) => {
  try {
    const { status } = req.body;
    if (!["approved", "hidden"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const review = await prisma.review.update({
      where: { id: req.params.id as string },
      data: { status },
      include: {
        author: { select: { id: true, name: true } },
        agent: { select: { id: true, name: true } },
      },
    });

    await prisma.auditLog.create({
      data: {
        action: status === "approved" ? "APPROVE_REVIEW" : "HIDE_REVIEW",
        entity: "Review",
        entityId: review.id,
        userId: req.user!.id,
        details: { agentName: review.agent.name, rating: review.rating },
      },
    });

    res.json({ review });
  } catch (error) {
    logger.error({ err: error }, "Moderate review error:");
    res.status(500).json({ error: "Failed to moderate review" });
  }
});

export default router;


