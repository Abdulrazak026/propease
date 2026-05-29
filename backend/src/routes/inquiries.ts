import { Router, Response } from "express";
import prisma from "../lib/prisma";
import { authenticate, AuthRequest } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { createInquirySchema } from "../validators";

const router = Router();

router.post("/:listingId", validate(createInquirySchema), async (req, res: Response) => {
  try {
    const listingId = req.params.listingId as string;
    const listing = await prisma.listing.findUnique({ where: { id: listingId } });
    if (!listing) {
      return res.status(404).json({ error: "Listing not found" });
    }

    const inquiry = await prisma.inquiry.create({
      data: {
        ...req.body,
        listingId,
        assignedAgentId: listing.assignedAgentId,
      },
      include: {
        listing: { select: { id: true, title: true } },
        assignedAgent: { select: { id: true, name: true } },
      },
    });

    res.status(201).json({ inquiry });
  } catch (error) {
    console.error("Create inquiry error:", error);
    res.status(500).json({ error: "Failed to submit inquiry" });
  }
});

router.get("/my", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    let where = {};
    if (req.user!.role === "agent") {
      where = { assignedAgentId: req.user!.id };
    } else if (req.user!.role === "ambassador") {
      const agents = await prisma.user.findMany({
        where: { ambassadorId: req.user!.id },
        select: { id: true },
      });
      const agentIds = agents.map((a) => a.id);
      where = { assignedAgentId: { in: agentIds } };
    } else if (req.user!.role === "head") {
      // head sees all
    }

    const inquiries = await prisma.inquiry.findMany({
      where,
      include: {
        listing: { select: { id: true, title: true } },
        assignedAgent: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json({ inquiries });
  } catch (error) {
    console.error("List inquiries error:", error);
    res.status(500).json({ error: "Failed to fetch inquiries" });
  }
});

router.patch("/:id/status", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { status } = req.body;
    if (!["new", "read", "responded"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const inquiry = await prisma.inquiry.update({
      where: { id: req.params.id as string },
      data: { status },
    });

    res.json({ inquiry });
  } catch (error) {
    console.error("Update inquiry error:", error);
    res.status(500).json({ error: "Failed to update inquiry" });
  }
});

export default router;
