import { Router, Response } from "express";
import prisma from "../lib/prisma";
import { authenticate, AuthRequest } from "../middleware/auth";
import { authorize } from "../middleware/rbac";

const router = Router();

router.patch("/users/:id/verify", authenticate, authorize("head"), async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.params.id as string;
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        isVerified: true,
        verifiedAt: new Date(),
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        city: true,
        isVerified: true,
        verifiedAt: true,
      },
    });

    await prisma.auditLog.create({
      data: {
        action: "VERIFY_USER",
        entity: "User",
        entityId: userId,
        userId: req.user!.id,
        details: { verifiedUser: user.name, role: user.role },
      },
    });

    res.json({ user: updated });
  } catch (error) {
    console.error("Verify user error:", error);
    res.status(500).json({ error: "Failed to verify user" });
  }
});

router.patch("/users/:id/unverify", authenticate, authorize("head"), async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.params.id as string;
    const updated = await prisma.user.update({
      where: { id: userId },
      data: { isVerified: false, verifiedAt: null },
      select: { id: true, name: true, isVerified: true },
    });

    await prisma.auditLog.create({
      data: {
        action: "UNVERIFY_USER",
        entity: "User",
        entityId: userId,
        userId: req.user!.id,
        details: { unverifiedUser: updated.name },
      },
    });

    res.json({ user: updated });
  } catch (error) {
    console.error("Unverify user error:", error);
    res.status(500).json({ error: "Failed to unverify user" });
  }
});

router.get("/users", authenticate, authorize("head"), async (_req: AuthRequest, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        city: true,
        isApproved: true,
        isVerified: true,
        verifiedAt: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });
    res.json({ users });
  } catch (error) {
    console.error("List users error:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

export default router;
