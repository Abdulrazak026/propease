import { Router, Response } from "express";
import prisma from "../lib/prisma";
import { authenticate, AuthRequest } from "../middleware/auth";
import { authorize } from "../middleware/rbac";
import { validate } from "../middleware/validate";
import { setCommissionRateSchema } from "../validators";

const router = Router();

router.get("/rates", authenticate, authorize("head"), async (req: AuthRequest, res: Response) => {
  try {
    const rates = await prisma.commissionRate.findMany({ orderBy: { dealType: "asc" } });
    res.json({ rates });
  } catch (error) {
    console.error("Get rates error:", error);
    res.status(500).json({ error: "Failed to fetch commission rates" });
  }
});

router.put("/rates/:dealType", authenticate, authorize("head"), validate(setCommissionRateSchema), async (req: AuthRequest, res: Response) => {
  try {
    const dealType = req.params.dealType as string;
    const rate = await prisma.commissionRate.upsert({
      where: { dealType },
      update: {
        totalRate: req.body.totalRate,
        ambassadorRate: req.body.ambassadorRate,
        agentRate: req.body.agentRate,
      },
      create: {
        dealType,
        totalRate: req.body.totalRate,
        ambassadorRate: req.body.ambassadorRate,
        agentRate: req.body.agentRate,
      },
    });

    await prisma.auditLog.create({
      data: {
        action: "UPDATE_COMMISSION_RATE",
        entity: "CommissionRate",
        entityId: rate.id,
        userId: req.user!.id,
        details: { dealType, ...req.body },
      },
    });

    res.json({ rate });
  } catch (error) {
    console.error("Set rate error:", error);
    res.status(500).json({ error: "Failed to set commission rate" });
  }
});

router.get("/", authenticate, authorize("head"), async (req: AuthRequest, res: Response) => {
  try {
    const commissions = await prisma.commission.findMany({
      include: {
        ambassador: { select: { id: true, name: true } },
        agent: { select: { id: true, name: true } },
      },
      orderBy: { paidAt: "desc" },
    });

    res.json({ commissions });
  } catch (error) {
    console.error("List commissions error:", error);
    res.status(500).json({ error: "Failed to fetch commissions" });
  }
});

router.get("/my", authenticate, authorize("ambassador", "agent"), async (req: AuthRequest, res: Response) => {
  try {
    let commissions;
    if (req.user!.role === "ambassador") {
      commissions = await prisma.commission.findMany({
        where: { ambassadorId: req.user!.id },
        include: { agent: { select: { id: true, name: true } } },
        orderBy: { paidAt: "desc" },
      });
    } else {
      commissions = await prisma.commission.findMany({
        where: { agentId: req.user!.id },
        include: { ambassador: { select: { id: true, name: true } } },
        orderBy: { paidAt: "desc" },
      });
    }

    const totalEarned = commissions.reduce((sum, c) => {
      return sum + (req.user!.role === "ambassador" ? c.ambassadorCut : c.agentCut);
    }, 0);

    res.json({ commissions, totalEarned });
  } catch (error) {
    console.error("My commissions error:", error);
    res.status(500).json({ error: "Failed to fetch commissions" });
  }
});

/** Called internally when a deal is closed */
export async function calculateAndDistributeCommission(
  dealId: string,
  dealTitle: string,
  dealType: string,
  totalAmount: number,
  ambassadorId: string,
  agentId: string
) {
  const rate = await prisma.commissionRate.findUnique({ where: { dealType } });
  if (!rate) {
    console.error(`No commission rate found for deal type: ${dealType}`);
    return;
  }

  const ambassadorCut = Math.round(totalAmount * (rate.ambassadorRate / 100));
  const agentCut = Math.round(totalAmount * (rate.agentRate / 100));
  const companyCut = totalAmount - ambassadorCut - agentCut;

  await prisma.$transaction([
    prisma.commission.create({
      data: {
        dealId,
        dealTitle,
        dealType,
        totalAmount,
        ambassadorRate: rate.ambassadorRate,
        ambassadorCut,
        agentRate: rate.agentRate,
        agentCut,
        companyCut,
        ambassadorId,
        agentId,
      },
    }),
    prisma.user.update({
      where: { id: ambassadorId },
      data: { walletBalance: { increment: ambassadorCut } },
    }),
    prisma.user.update({
      where: { id: agentId },
      data: { walletBalance: { increment: agentCut } },
    }),
    prisma.transaction.create({
      data: {
        type: "commission_payout",
        amount: ambassadorCut,
        reference: `COMM-AMB-${dealId}`,
        method: "wallet",
        status: "completed",
        userId: ambassadorId,
      },
    }),
    prisma.transaction.create({
      data: {
        type: "commission_payout",
        amount: agentCut,
        reference: `COMM-AGT-${dealId}`,
        method: "wallet",
        status: "completed",
        userId: agentId,
      },
    }),
  ]);

  return { ambassadorCut, agentCut, companyCut };
}

export default router;
