import { Router, Response } from "express";
import prisma from "../lib/prisma";
import { authenticate, AuthRequest } from "../middleware/auth";
import { authorize } from "../middleware/rbac";

const router = Router();

router.get("/", authenticate, authorize("head"), async (_req: AuthRequest, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, city: true, walletBalance: true, isApproved: true, isVerified: true, canCreateTasks: true, canCloseDeals: true, ambassadorId: true, whatsapp: true, createdAt: true },
      orderBy: { createdAt: "desc" },
    });
    res.json({ users });
  } catch { res.status(500).json({ error: "Failed to fetch users" }); }
});

router.patch("/:id", authenticate, authorize("head"), async (req: AuthRequest, res: Response) => {
  try {
    const { isApproved, isVerified, canCreateTasks, canCloseDeals, role, ambassadorId } = req.body;
    const id = String(req.params.id);
    const user = await prisma.user.update({
      where: { id },
      data: { isApproved, isVerified, canCreateTasks, canCloseDeals, role, ambassadorId },
      select: { id: true, name: true, email: true, role: true, isApproved: true, canCreateTasks: true, canCloseDeals: true },
    });
    res.json({ user });
  } catch { res.status(500).json({ error: "Failed to update user" }); }
});

router.post("/", authenticate, authorize("head"), async (req: AuthRequest, res: Response) => {
  try {
    const bcrypt = (await import("bcryptjs")).default;
    const { name, email, password, role, city } = req.body;
    const hashed = await bcrypt.hash(password || "password123", 12);
    const user = await prisma.user.create({
      data: { name, email, password: hashed, role, city, isApproved: role === "head" },
      select: { id: true, name: true, email: true, role: true },
    });
    res.status(201).json({ user });
  } catch { res.status(500).json({ error: "Failed to create user" }); }
});

router.delete("/:id", authenticate, authorize("head"), async (req: AuthRequest, res: Response) => {
  try {
    await prisma.user.delete({ where: { id: String(req.params.id) } });
    res.json({ success: true });
  } catch { res.status(500).json({ error: "Failed to delete user" }); }
});

export default router;
