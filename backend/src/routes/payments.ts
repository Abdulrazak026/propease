import { Router, Response } from "express";
import prisma from "../lib/prisma";
import { authenticate, AuthRequest } from "../middleware/auth";
import { authorize } from "../middleware/rbac";
import { validate } from "../middleware/validate";
import { topUpSchema, withdrawSchema } from "../validators";

const router = Router();

router.get("/wallet", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: { id: true, walletBalance: true },
    });

    const transactions = await prisma.transaction.findMany({
      where: { userId: req.user!.id },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    res.json({ walletBalance: user?.walletBalance || 0, transactions });
  } catch (error) {
    console.error("Wallet error:", error);
    res.status(500).json({ error: "Failed to fetch wallet" });
  }
});

router.post("/topup", authenticate, validate(topUpSchema), async (req: AuthRequest, res: Response) => {
  try {
    const { amount } = req.body;

    // In production, integrate with Paystack:
    // 1. Initialize transaction with Paystack
    // 2. Return authorization URL
    // 3. Webhook confirms payment and credits wallet

    const reference = `TOPUP-${Date.now()}-${req.user!.id}`;

    const transaction = await prisma.transaction.create({
      data: {
        type: "top_up",
        amount,
        reference,
        method: "card",
        status: "pending",
        userId: req.user!.id,
      },
    });

    // Demo: auto-complete the top-up
    // In production, this happens in Paystack webhook handler
    await prisma.$transaction([
      prisma.transaction.update({
        where: { id: transaction.id },
        data: { status: "completed" },
      }),
      prisma.user.update({
        where: { id: req.user!.id },
        data: { walletBalance: { increment: amount } },
      }),
    ]);

    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: { walletBalance: true },
    });

    res.json({
      message: "Top-up completed",
      walletBalance: user?.walletBalance,
      reference,
    });
  } catch (error) {
    console.error("Top-up error:", error);
    res.status(500).json({ error: "Failed to process top-up" });
  }
});

router.post("/withdraw", authenticate, authorize("ambassador", "agent"), validate(withdrawSchema), async (req: AuthRequest, res: Response) => {
  try {
    const { amount, bankName, accountNumber, accountName } = req.body;

    const user = await prisma.user.findUnique({ where: { id: req.user!.id } });
    if (!user || user.walletBalance < amount) {
      return res.status(400).json({ error: "Insufficient wallet balance" });
    }

    const withdrawal = await prisma.withdrawal.create({
      data: {
        amount,
        bankName,
        accountNumber,
        accountName,
        userId: req.user!.id,
      },
    });

    await prisma.auditLog.create({
      data: {
        action: "REQUEST_WITHDRAWAL",
        entity: "Withdrawal",
        entityId: withdrawal.id,
        userId: req.user!.id,
        details: { amount, bankName, accountNumber },
      },
    });

    res.status(201).json({ withdrawal, message: "Withdrawal request submitted for approval" });
  } catch (error) {
    console.error("Withdraw error:", error);
    res.status(500).json({ error: "Failed to process withdrawal" });
  }
});

router.get("/withdrawals", authenticate, authorize("head"), async (req: AuthRequest, res: Response) => {
  try {
    const withdrawals = await prisma.withdrawal.findMany({
      include: { user: { select: { id: true, name: true, email: true, walletBalance: true } } },
      orderBy: { createdAt: "desc" },
    });

    res.json({ withdrawals });
  } catch (error) {
    console.error("List withdrawals error:", error);
    res.status(500).json({ error: "Failed to fetch withdrawals" });
  }
});

router.patch("/withdrawals/:id", authenticate, authorize("head"), async (req: AuthRequest, res: Response) => {
  try {
    const withdrawalId = req.params.id as string;
    const { status } = req.body;
    if (!["approved", "paid", "rejected"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const withdrawal = await prisma.withdrawal.findUnique({ where: { id: withdrawalId } });
    if (!withdrawal) {
      return res.status(404).json({ error: "Withdrawal not found" });
    }

    if (status === "approved" || status === "paid") {
      await prisma.$transaction([
        prisma.withdrawal.update({ where: { id: withdrawalId }, data: { status } }),
        prisma.user.update({
          where: { id: withdrawal.userId },
          data: { walletBalance: { decrement: withdrawal.amount } },
        }),
        prisma.transaction.create({
          data: {
            type: "withdrawal",
            amount: withdrawal.amount,
            reference: `WITHDRAW-${withdrawal.id}`,
            method: "transfer",
            status: "completed",
            userId: withdrawal.userId,
          },
        }),
      ]);
    } else {
      await prisma.withdrawal.update({ where: { id: withdrawalId }, data: { status } });
    }

    await prisma.auditLog.create({
      data: {
        action: `WITHDRAWAL_${status.toUpperCase()}`,
        entity: "Withdrawal",
        entityId: withdrawal.id,
        userId: req.user!.id,
      },
    });

    res.json({ message: `Withdrawal ${status}` });
  } catch (error) {
    console.error("Update withdrawal error:", error);
    res.status(500).json({ error: "Failed to update withdrawal" });
  }
});

router.post("/webhook", async (req, res: Response) => {
  // Paystack webhook handler
  // Verify webhook signature
  // Process payment confirmation
  res.json({ message: "Webhook received" });
});

export default router;
