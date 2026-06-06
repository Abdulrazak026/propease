import { Router, Response } from "express";
import prisma from "../lib/prisma";
import { authenticate, AuthRequest } from "../middleware/auth";
import { authorize } from "../middleware/rbac";
import { emailService } from "../services/email";

const router = Router();

// Agent/ambassador requests withdrawal
router.post("/withdraw", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { amount, bankName, accountNumber, accountName } = req.body;
    if (!amount || amount < 1000) return res.status(400).json({ error: "Minimum withdrawal is ₦1,000" });
    if (!bankName || !accountNumber || !accountName) return res.status(400).json({ error: "Bank details required" });
    const uid = req.user!.id as string;
    const user = await prisma.user.findUnique({ where: { id: uid } });
    if (!user || user.walletBalance < amount) return res.status(400).json({ error: "Insufficient balance" });

    const withdrawal = await prisma.withdrawal.create({
      data: { amount, bankName, accountNumber, accountName, userId: uid },
    });
    emailService.withdrawalRequested(user.email, user.name, amount).catch(() => {});
    res.status(201).json({ withdrawal, message: "Withdrawal request submitted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to request withdrawal" });
  }
});

// User's own withdrawals (no admin auth needed)
router.get("/my-withdrawals", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const withdrawals = await prisma.withdrawal.findMany({
      where: { userId: req.user!.id as string },
      orderBy: { createdAt: "desc" },
    });
    res.json({ withdrawals });
  } catch { res.status(500).json({ error: "Failed to fetch withdrawals" }); }
});

// User's own transactions
router.get("/transactions", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const txs = await prisma.transaction.findMany({
      where: { userId: req.user!.id as string },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    res.json({ transactions: txs });
  } catch { res.status(500).json({ error: "Failed to fetch transactions" }); }
});

// Admin lists all withdrawals
router.get("/withdrawals", authenticate, authorize("head"), async (_req: AuthRequest, res: Response) => {
  try {
    const withdrawals = await prisma.withdrawal.findMany({
      include: { user: { select: { name: true, email: true } } },
      orderBy: { createdAt: "desc" },
    });
    res.json({ withdrawals });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch withdrawals" });
  }
});

// Admin approves withdrawal — with balance re-check to prevent negative wallets
router.post("/withdrawals/:id/approve", authenticate, authorize("head"), async (req: AuthRequest, res: Response) => {
  try {
    const wid = req.params.id as string;

    const result = await prisma.$transaction(async (tx) => {
      const withdrawal = await tx.withdrawal.findUnique({ where: { id: wid } });
      if (!withdrawal) throw new Error("NOT_FOUND");
      if (withdrawal.status !== "pending") throw new Error("ALREADY_PROCESSED");

      const user = await tx.user.findUnique({ where: { id: withdrawal.userId } });
      if (!user || user.walletBalance < withdrawal.amount) throw new Error("INSUFFICIENT_BALANCE");

      await tx.withdrawal.update({ where: { id: wid }, data: { status: "approved" } });
      await tx.user.update({ where: { id: withdrawal.userId }, data: { walletBalance: { decrement: withdrawal.amount } } });
      await tx.transaction.create({
        data: { type: "withdrawal", amount: withdrawal.amount, reference: `WD-${withdrawal.id.slice(0,8)}`, method: "transfer", status: "completed", userId: withdrawal.userId },
      });
      await tx.auditLog.create({
        data: { action: "APPROVE_WITHDRAWAL", entity: "Withdrawal", entityId: wid, userId: req.user!.id as string, details: { amount: withdrawal.amount } },
      });
      return { withdrawal, user };
    });

    const user = (result as any).user;
    emailService.withdrawalApproved(user.email, user.name, (result as any).withdrawal.amount).catch(() => {});

    res.json({ success: true, message: "Withdrawal approved" });
  } catch (error: any) {
    if (error.message === "NOT_FOUND") return res.status(404).json({ error: "Withdrawal not found" });
    if (error.message === "ALREADY_PROCESSED") return res.status(400).json({ error: "Already processed" });
    if (error.message === "INSUFFICIENT_BALANCE") return res.status(400).json({ error: "Insufficient wallet balance at time of approval" });
    res.status(500).json({ error: "Failed to approve withdrawal" });
  }
});

// Admin rejects withdrawal
router.post("/withdrawals/:id/reject", authenticate, authorize("head"), async (req: AuthRequest, res: Response) => {
  try {
    const wid = req.params.id as string;
    const withdrawal = await prisma.withdrawal.findUnique({ where: { id: wid }, include: { user: { select: { email: true, name: true } } } });
    if (!withdrawal) return res.status(404).json({ error: "Withdrawal not found" });
    await prisma.withdrawal.update({ where: { id: wid }, data: { status: "rejected" } });
    emailService.withdrawalRejected(withdrawal.user.email, withdrawal.user.name, withdrawal.amount, (req.body as any).reason).catch(() => {});
    res.json({ success: true, message: "Withdrawal rejected" });
  } catch (error) {
    res.status(500).json({ error: "Failed to reject withdrawal" });
  }
});

export default router;
