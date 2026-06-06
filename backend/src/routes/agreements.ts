import { Router, Response } from "express";
import prisma from "../lib/prisma";
import { authenticate, AuthRequest } from "../middleware/auth";
import { authorize } from "../middleware/rbac";
import { calculateAndDistributeCommission } from "./commissions";
import { logger } from "../lib/logger";

const router = Router();

router.post("/", authenticate, authorize("head", "ambassador", "agent"), async (req: AuthRequest, res: Response) => {
  try {
    const {
      listingId, applicationId, tenantName, tenantEmail, tenantPhone,
      landlordName, propertyTitle, propertyAddress, propertyCity,
      annualRent, damageDeposit, serviceCharge,
      startDate, endDate, rentDueDay, noticePeriodDays, renewalType,
    } = req.body;

    if (!tenantName || !tenantEmail || !landlordName || !startDate || !endDate) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const agreement = await prisma.rentAgreement.create({
      data: {
        listingId: listingId || undefined,
        applicationId: applicationId || undefined,
        agentId: req.user!.id,
        tenantName, tenantEmail, tenantPhone,
        landlordName,
        propertyTitle, propertyAddress: propertyAddress || "", propertyCity: propertyCity || "",
        annualRent: parseInt(annualRent) || 0,
        damageDeposit: damageDeposit ? parseInt(damageDeposit) : undefined,
        serviceCharge: serviceCharge ? parseInt(serviceCharge) : undefined,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        rentDueDay: rentDueDay ? parseInt(rentDueDay) : 1,
        noticePeriodDays: noticePeriodDays ? parseInt(noticePeriodDays) : 30,
        renewalType: renewalType || "yearly",
        status: "pending_landlord",
      },
    });

    await prisma.auditLog.create({
      data: {
        action: "CREATE_AGREEMENT",
        entity: "RentAgreement",
        entityId: agreement.id,
        userId: req.user!.id,
        details: { tenant: tenantName, property: propertyTitle },
      },
    });

    res.status(201).json({ agreement });
  } catch (error) {
    console.error("Create agreement error:", error);
    res.status(500).json({ error: "Failed to create agreement" });
  }
});

router.get("/", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { status } = req.query;
    const where: any = {};

    if (status) where.status = status;

    if (req.user!.role === "agent") {
      where.agentId = req.user!.id;
    } else if (req.user!.role === "ambassador") {
      where.OR = [
        { agent: { ambassadorId: req.user!.id } },
        { tenantId: req.user!.id },
      ];
    }

    const agreements = await prisma.rentAgreement.findMany({
      where,
      include: {
        listing: { select: { id: true, title: true } },
        agent: { select: { id: true, name: true } },
        tenant: { select: { id: true, name: true, email: true } },
      },
      orderBy: { updatedAt: "desc" },
    });

    res.json({ agreements });
  } catch (error) {
    console.error("List agreements error:", error);
    res.status(500).json({ error: "Failed to fetch agreements" });
  }
});

router.get("/:id", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const agreement = await prisma.rentAgreement.findUnique({
      where: { id: req.params.id as string },
      include: {
        listing: { select: { id: true, title: true, address: true, city: true } },
        agent: { select: { id: true, name: true, email: true } },
        tenant: { select: { id: true, name: true, email: true } },
        application: true,
      },
    });

    if (!agreement) {
      return res.status(404).json({ error: "Agreement not found" });
    }

    res.json({ agreement });
  } catch (error) {
    console.error("Get agreement error:", error);
    res.status(500).json({ error: "Failed to fetch agreement" });
  }
});

router.post("/:id/sign", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { role } = req.body;
    const agId = req.params.id as string;
    const signature = req.body.signature || "";

    const agreement = await prisma.rentAgreement.findUnique({ where: { id: agId } });
    if (!agreement) {
      return res.status(404).json({ error: "Agreement not found" });
    }

    // Identity verification: signer must match the role they claim
    if (role === "landlord") {
      if (agreement.agentId !== req.user!.id) {
        return res.status(403).json({ error: "You are not authorized to sign as landlord for this agreement" });
      }
      if (agreement.status !== "pending_landlord") {
        return res.status(400).json({ error: "Agreement is not pending landlord signature" });
      }
      const updated = await prisma.rentAgreement.update({
        where: { id: agId },
        data: {
          landlordSignature: signature,
          landlordSignedAt: new Date(),
          status: "pending_tenant",
        },
      });
      return res.json({ agreement: updated });
    }

    if (role === "tenant") {
      if (agreement.tenantId && agreement.tenantId !== req.user!.id) {
        return res.status(403).json({ error: "You are not the tenant on this agreement" });
      }
      if (agreement.status !== "pending_tenant") {
        return res.status(400).json({ error: "Agreement is not pending tenant signature" });
      }
      const updated = await prisma.rentAgreement.update({
        where: { id: agId },
        data: {
          tenantSignature: signature,
          tenantSignedAt: new Date(),
          status: "completed",
        },
      });

      if (agreement.agentId) {
        await prisma.auditLog.create({
          data: {
            action: "COMPLETE_AGREEMENT",
            entity: "RentAgreement",
            entityId: agId,
            userId: agreement.agentId,
            details: { tenant: agreement.tenantName, property: agreement.propertyTitle },
          },
        });

        await prisma.notification.create({
          data: {
            userId: agreement.agentId,
            type: "agreement_signed",
            title: "Agreement Completed",
            body: `Rent agreement for ${agreement.propertyTitle} has been fully signed by both parties.`,
            link: `/agent/agreements/${agId}`,
          },
        });
      }

      if (agreement.tenantId) {
        await prisma.notification.create({
          data: {
            userId: agreement.tenantId,
            type: "agreement_signed",
            title: "Agreement Completed",
            body: `Your rent agreement for ${agreement.propertyTitle} is now complete.`,
            link: `/agreements/${agId}`,
          },
        });
      }

      // Trigger commission distribution on agreement completion
      if (agreement.annualRent && agreement.agentId && agreement.listingId) {
        try {
          const ambassadorId = (await prisma.user.findUnique({ where: { id: agreement.agentId }, select: { ambassadorId: true } }))?.ambassadorId || "";
          await calculateAndDistributeCommission(agId, agreement.propertyTitle, "rent_full", agreement.annualRent, ambassadorId, agreement.agentId);
        } catch (err) {
          logger.error({ err, agreementId: agId, agentId: agreement.agentId, amount: agreement.annualRent }, "Commission distribution failed for agreement");
          // Alert all admin users about the failure
          const admins = await prisma.user.findMany({ where: { role: "head" }, select: { id: true } });
          for (const admin of admins) {
            await prisma.notification.create({
              data: {
                userId: admin.id,
                type: "agreement_signed",
                title: "⚠️ Commission Failed",
                body: `Commission for agreement "${agreement.propertyTitle}" (₦${agreement.annualRent.toLocaleString()}) failed to distribute. Manual review required.`,
                link: `/admin/agreements`,
              },
            }).catch(() => {});
          }
        }
      }

      // Update listing status to rented
      if (agreement.listingId) {
        await prisma.listing.update({
          where: { id: agreement.listingId },
          data: { status: "rented" },
        }).catch(() => {});
      }

      return res.json({ agreement: updated });
    }

    res.status(400).json({ error: "Invalid role. Must be 'landlord' or 'tenant'" });
  } catch (error) {
    console.error("Sign agreement error:", error);
    res.status(500).json({ error: "Failed to sign agreement" });
  }
});

router.patch("/:id/status", authenticate, authorize("head", "ambassador", "agent"), async (req: AuthRequest, res: Response) => {
  try {
    const { status } = req.body;
    const agId = req.params.id as string;

    const updated = await prisma.rentAgreement.update({
      where: { id: agId },
      data: { status },
    });

    res.json({ agreement: updated });
  } catch (error) {
    console.error("Update agreement status error:", error);
    res.status(500).json({ error: "Failed to update agreement" });
  }
});

export default router;
