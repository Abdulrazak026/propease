import { Router, Response } from "express";
import prisma from "../lib/prisma";
import { authenticate, AuthRequest } from "../middleware/auth";
import { authorize } from "../middleware/rbac";
import { emailService } from "../services/email";
import { validate } from "../middleware/validate";
import { createInquirySchema } from "../validators";
import { logger } from "../lib/logger";
const router = Router();

export async function resolveInquiryAgent(listingId: string, fallbackUserId?: string): Promise<string | null> {
  const listing = await prisma.listing.findUnique({
    where: { id: listingId },
    select: { assignedAgentId: true, postedById: true },
  });
  if (!listing) return fallbackUserId || null;

  if (listing.assignedAgentId) return listing.assignedAgentId;

  const candidateId = fallbackUserId || listing.postedById;
  if (candidateId) {
    const user = await prisma.user.findUnique({ where: { id: candidateId }, select: { role: true } });
    if (user && user.role === "agent") return candidateId;
  }

  const firstAgent = await prisma.user.findFirst({
    where: { role: "agent", suspendedAt: null },
    select: { id: true },
    orderBy: { createdAt: "asc" },
  });
  return firstAgent?.id || candidateId || null;
}

router.post("/:listingId", validate(createInquirySchema), async (req, res: Response) => {
  try {
    const listingId = req.params.listingId as string;
    const listing = await prisma.listing.findUnique({ where: { id: listingId } });
    if (!listing) {
      return res.status(404).json({ error: "Listing not found" });
    }

    const agentId = await resolveInquiryAgent(listingId);

    const inquiry = await prisma.inquiry.create({
      data: {
        ...req.body,
        listingId,
        assignedAgentId: agentId,
      },
      include: {
        listing: { select: { id: true, title: true } },
        assignedAgent: { select: { id: true, name: true, email: true } },
      },
    });

    res.status(201).json({ inquiry });

    if (inquiry.assignedAgent) {
      emailService.inquiryNotification(inquiry.assignedAgent.email, inquiry.assignedAgent.name, inquiry.clientName, listing.title, inquiry.message).catch(() => {});
    }
    emailService.inquiryConfirmation(req.body.clientContact || "", req.body.clientName || "", listing.title).catch(() => {});
  } catch (error) {
    logger.error({ err: error }, "Create inquiry error:");
    res.status(500).json({ error: "Failed to submit inquiry" });
  }
});

router.get("/my", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    let where: any = {};
    if (req.user!.role === "agent") {
      where = {
        OR: [
          { assignedAgentId: req.user!.id },
          { listing: { assignedAgentId: req.user!.id } },
        ],
      };
    } else if (req.user!.role === "ambassador") {
      const agents = await prisma.user.findMany({
        where: { ambassadorId: req.user!.id },
        select: { id: true },
      });
      const agentIds = agents.map((a) => a.id);
      where = {
        OR: [
          { assignedAgentId: { in: agentIds } },
          { listing: { assignedAgentId: { in: agentIds } } },
        ],
      };
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
    logger.error({ err: error }, "List inquiries error:");
    res.status(500).json({ error: "Failed to fetch inquiries" });
  }
});

router.patch("/:id/status", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { status } = req.body;
    if (!["new", "read", "responded"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const inquiry = await prisma.inquiry.findUnique({ where: { id: req.params.id as string } });
    if (!inquiry) return res.status(404).json({ error: "Inquiry not found" });

    // Ownership: only the assigned agent or a head can update the inquiry
    const isHead = req.user!.role === "head";
    const isOwner = inquiry.assignedAgentId === req.user!.id;
    if (!isHead && !isOwner) {
      return res.status(403).json({ error: "Not your inquiry" });
    }

    const updated = await prisma.inquiry.update({
      where: { id: req.params.id as string },
      data: { status },
    });

    res.json({ inquiry: updated });
  } catch (error) {
    logger.error({ err: error }, "Update inquiry error:");
    res.status(500).json({ error: "Failed to update inquiry" });
  }
});

router.get("/all", authenticate, authorize("head"), async (_req: AuthRequest, res: Response) => {
  try {
    const inquiries = await prisma.inquiry.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        listing: { select: { id: true, title: true } },
        assignedAgent: { select: { id: true, name: true } },
      },
      take: 100,
    });
    res.json({ inquiries });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch inquiries" });
  }
});

router.get("/:id/conversation", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const inquiry = await prisma.inquiry.findUnique({
      where: { id: req.params.id as string },
      include: {
        listing: { select: { id: true, title: true } },
        assignedAgent: { select: { id: true, name: true } },
      },
    });
    if (!inquiry) return res.status(404).json({ error: "Inquiry not found" });

    const isHead = req.user!.role === "head";
    const isOwner = inquiry.assignedAgentId === req.user!.id;
    if (!isHead && !isOwner) return res.status(403).json({ error: "Not your inquiry" });

    let conversation: any = null;
    if (inquiry.listingId && inquiry.clientContact) {
      conversation = await prisma.conversation.findFirst({
        where: {
          listingId: inquiry.listingId,
          participants: { some: { user: { email: inquiry.clientContact } } },
        },
        include: {
          participants: { include: { user: { select: { id: true, name: true, email: true } } } },
          messages: { orderBy: { createdAt: "asc" }, include: { sender: { select: { id: true, name: true } } } },
        },
      });
    }

    res.json({ inquiry, conversation });
  } catch (error) {
    logger.error({ err: error }, "Get inquiry conversation error:");
    res.status(500).json({ error: "Failed to fetch inquiry details" });
  }
});

router.post("/:id/reply", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: "Message is required" });

    const inquiry = await prisma.inquiry.findUnique({
      where: { id: req.params.id as string },
      include: { listing: { select: { id: true, title: true, postedById: true } }, assignedAgent: { select: { id: true, name: true, email: true } } },
    });
    if (!inquiry) return res.status(404).json({ error: "Inquiry not found" });

    const isHead = req.user!.role === "head";
    const isOwner = inquiry.assignedAgentId === req.user!.id;
    if (!isHead && !isOwner) return res.status(403).json({ error: "Not your inquiry" });

    // Find or create conversation
    let conversation: any = null;
    if (inquiry.listingId) {
      // Try to find existing conversation for this listing + client
      if (inquiry.clientContact) {
        try {
          const clientUser = await prisma.user.findFirst({
            where: { email: inquiry.clientContact },
            select: { id: true },
          });
          if (clientUser) {
            conversation = await prisma.conversation.findFirst({
              where: {
                listingId: inquiry.listingId,
                participants: { some: { userId: clientUser.id } },
              },
            });
          }
        } catch {}
      }
      // If no conversation exists, create one
      if (!conversation) {
        const agentOrAdmin = inquiry.assignedAgentId || inquiry.listing?.postedById;
        const participantCreates = [
          { userId: req.user!.id },
          ...(agentOrAdmin && agentOrAdmin !== req.user!.id ? [{ userId: agentOrAdmin }] : []),
        ];
        // Add client user as participant if they exist
        if (inquiry.clientContact) {
          try {
            const clientUser = await prisma.user.findFirst({
              where: { email: inquiry.clientContact },
              select: { id: true },
            });
            if (clientUser && clientUser.id !== req.user!.id && clientUser.id !== agentOrAdmin) {
              participantCreates.push({ userId: clientUser.id });
            }
          } catch {}
        }
        conversation = await prisma.conversation.create({
          data: {
            listingId: inquiry.listingId,
            subject: inquiry.listing?.title || "Property Inquiry",
            participants: {
              create: participantCreates,
            },
          },
        });
      }
    }

    if (conversation) {
      await prisma.message.create({
        data: { content: message, conversationId: conversation.id, senderId: req.user!.id },
      });
      await prisma.conversation.update({ where: { id: conversation.id }, data: { updatedAt: new Date() } });
    }

    await prisma.inquiry.update({ where: { id: inquiry.id }, data: { status: "responded" } });

    if (inquiry.clientContact) {
      emailService.inquiryConfirmation(inquiry.clientContact, inquiry.clientName, inquiry.listing?.title || "your inquiry").catch(() => {});
    }

    res.json({ success: true, message: "Reply sent" });
  } catch (error) {
    logger.error({ err: error }, "Reply to inquiry error:");
    res.status(500).json({ error: "Failed to send reply" });
  }
});

export default router;


