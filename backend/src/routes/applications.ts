import { Router, Response } from "express";
import prisma from "../lib/prisma";
import { authenticate, AuthRequest } from "../middleware/auth";
import { authorize } from "../middleware/rbac";

const router = Router();

router.post("/", async (req, res: Response) => {
  try {
    const {
      listingId,
      fullName, email, phone, dateOfBirth,
      employmentStatus, employer, jobTitle, workAddress,
      monthlyIncome,
      idType, idNumber,
      refName, refPhone, refEmail, refRelation,
      nokName, nokPhone, nokEmail, nokRelation,
    } = req.body;

    if (!fullName || !email || !phone) {
      return res.status(400).json({ error: "Full name, email, and phone are required" });
    }

    // Find a default agent for this listing if available
    let assignedAgentId: string | undefined;
    if (listingId) {
      const listing = await prisma.listing.findUnique({
        where: { id: listingId },
        select: { assignedAgentId: true, postedById: true },
      });
      if (listing?.assignedAgentId) {
        assignedAgentId = listing.assignedAgentId;
      }
    }

    const application = await prisma.tenantApplication.create({
      data: {
        listingId: listingId || undefined,
        assignedAgentId,
        status: "submitted",
        fullName, email, phone, dateOfBirth,
        employmentStatus, employer, jobTitle, workAddress,
        monthlyIncome: monthlyIncome ? parseInt(monthlyIncome) : undefined,
        idType, idNumber,
        refName, refPhone, refEmail, refRelation,
        nokName, nokPhone, nokEmail, nokRelation,
      },
    });

    res.status(201).json({ application });
  } catch (error) {
    console.error("Create application error:", error);
    res.status(500).json({ error: "Failed to submit application" });
  }
});

router.get("/", authenticate, authorize("head", "ambassador", "agent"), async (req: AuthRequest, res: Response) => {
  try {
    const { status } = req.query;
    const where: any = {};

    if (status) where.status = status;

    // Agents only see their own applications
    if (req.user!.role === "agent") {
      where.assignedAgentId = req.user!.id;
    }

    const applications = await prisma.tenantApplication.findMany({
      where,
      include: {
        listing: { select: { id: true, title: true } },
        assignedAgent: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json({ applications });
  } catch (error) {
    console.error("List applications error:", error);
    res.status(500).json({ error: "Failed to fetch applications" });
  }
});

router.get("/:id", authenticate, authorize("head", "ambassador", "agent"), async (req: AuthRequest, res: Response) => {
  try {
    const application = await prisma.tenantApplication.findUnique({
      where: { id: req.params.id as string },
      include: {
        listing: { select: { id: true, title: true, address: true, price: true } },
        assignedAgent: { select: { id: true, name: true, email: true } },
      },
    });

    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }

    // Agents can only view their own
    if (req.user!.role === "agent" && application.assignedAgentId !== req.user!.id) {
      return res.status(403).json({ error: "Access denied" });
    }

    res.json({ application });
  } catch (error) {
    console.error("Get application error:", error);
    res.status(500).json({ error: "Failed to fetch application" });
  }
});

router.patch("/:id/status", authenticate, authorize("head", "ambassador", "agent"), async (req: AuthRequest, res: Response) => {
  try {
    const { status, agentNotes } = req.body;
    const appId = req.params.id as string;

    const application = await prisma.tenantApplication.findUnique({ where: { id: appId } });
    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }

    if (req.user!.role === "agent" && application.assignedAgentId !== req.user!.id) {
      return res.status(403).json({ error: "Access denied" });
    }

    const updated = await prisma.tenantApplication.update({
      where: { id: appId },
      data: {
        status,
        ...(agentNotes ? { agentNotes } : {}),
      },
    });

    await prisma.auditLog.create({
      data: {
        action: "UPDATE_APPLICATION_STATUS",
        entity: "TenantApplication",
        entityId: appId,
        userId: req.user!.id,
        details: { status, applicantName: application.fullName },
      },
    });

    res.json({ application: updated });
  } catch (error) {
    console.error("Update application error:", error);
    res.status(500).json({ error: "Failed to update application" });
  }
});

export default router;
