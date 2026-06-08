import { Router, Response } from "express";
import prisma from "../lib/prisma";
import { authenticate, AuthRequest } from "../middleware/auth";
import { authorize, requirePermission } from "../middleware/rbac";
import { logger } from "../lib/logger";
import { emailService } from "../services/email";
const router = Router();

router.get("/", authenticate, authorize("head"), requirePermission("canManageUsers"), async (_req: AuthRequest, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, city: true, walletBalance: true, isApproved: true, isVerified: true, canCreateTasks: true, canCloseDeals: true, canCreateListings: true, canManageUsers: true, canManageContent: true, canViewAnalytics: true, canManageAgreements: true, ambassadorId: true, whatsapp: true, createdAt: true },
      orderBy: { createdAt: "desc" },
    });
    res.json({ users });
  } catch (error) { logger.error({ err: error }, "Failed to fetch users"); res.status(500).json({ error: "Failed to fetch users" }); }
});

router.patch("/:id", authenticate, authorize("head"), requirePermission("canManageUsers"), async (req: AuthRequest, res: Response) => {
  try {
    const { isApproved, isVerified, suspendedAt, canCreateTasks, canCloseDeals, canCreateListings, canManageUsers, canManageContent, canViewAnalytics, canManageAgreements, role, ambassadorId } = req.body;
    const id = String(req.params.id);
    
    const existingUser = await prisma.user.findUnique({ where: { id }, select: { isApproved: true, suspendedAt: true } });
    
    const user = await prisma.user.update({
      where: { id },
      data: { isApproved, isVerified, suspendedAt: suspendedAt !== undefined ? (suspendedAt ? new Date(suspendedAt) : null) : undefined, canCreateTasks, canCloseDeals, canCreateListings, canManageUsers, canManageContent, canViewAnalytics, canManageAgreements, role, ambassadorId },
      select: { id: true, name: true, email: true, role: true, isApproved: true, canCreateTasks: true, canCloseDeals: true, canCreateListings: true, canManageUsers: true, canManageContent: true, canViewAnalytics: true, canManageAgreements: true },
    });
    
    if (isApproved === true && existingUser && !existingUser.isApproved) {
      emailService.accountApproved(user.email, user.name, user.role).catch(() => {});
    }
    if (suspendedAt && !existingUser?.suspendedAt) {
      emailService.accountSuspended(user.email, user.name).catch(() => {});
    }
    
    res.json({ user });
  } catch (error) { logger.error({ err: error }, "Failed to update user"); res.status(500).json({ error: "Failed to update user" }); }
});

router.post("/", authenticate, authorize("head"), requirePermission("canManageUsers"), async (req: AuthRequest, res: Response) => {
  try {
    const bcrypt = (await import("bcryptjs")).default;
    const { name, email, password, role, city } = req.body;
    const hashed = await bcrypt.hash(password || "password123", 12);
    const user = await prisma.user.create({
      data: { name, email, password: hashed, role, city, isApproved: role === "head" },
      select: { id: true, name: true, email: true, role: true },
    });
    res.status(201).json({ user });
  } catch (error) { logger.error({ err: error }, "Failed to create user"); res.status(500).json({ error: "Failed to create user" }); }
});

router.delete("/:id", authenticate, authorize("head"), requirePermission("canManageUsers"), async (req: AuthRequest, res: Response) => {
  try {
    const uid = String(req.params.id);
    // Clean up ALL related records to avoid FK constraints
    await prisma.$transaction([
      prisma.message.deleteMany({ where: { senderId: uid } }),
      prisma.auditLog.deleteMany({ where: { userId: uid } }),
      prisma.notification.deleteMany({ where: { userId: uid } }),
      prisma.savedSearch.deleteMany({ where: { userId: uid } }),
      prisma.reservation.deleteMany({ where: { userId: uid } }),
      prisma.withdrawal.deleteMany({ where: { userId: uid } }),
      prisma.transaction.deleteMany({ where: { userId: uid } }),
      prisma.inquiry.deleteMany({ where: { assignedAgentId: uid } }),
      prisma.tenantApplication.deleteMany({ where: { assignedAgentId: uid } }),
      prisma.taskComment.deleteMany({ where: { authorId: uid } }),
      prisma.task.deleteMany({ where: { OR: [{ createdById: uid }, { assignedToId: uid }] } }),
      prisma.priceChange.deleteMany({ where: { changedById: uid } }),
      prisma.review.deleteMany({ where: { OR: [{ authorId: uid }, { agentId: uid }] } }),
      prisma.commission.deleteMany({ where: { OR: [{ ambassadorId: uid }, { agentId: uid }] } }),
      prisma.rentAgreement.deleteMany({ where: { OR: [{ tenantId: uid }, { agentId: uid }] } }),
      prisma.customOrder.deleteMany({ where: { task: { assignedToId: uid } } }),
      prisma.listing.updateMany({ where: { postedById: uid }, data: { postedById: req.user!.id as string } }),
      prisma.listing.updateMany({ where: { assignedAgentId: uid }, data: { assignedAgentId: null } }),
      prisma.conversationParticipant.deleteMany({ where: { userId: uid } }),
      prisma.refreshToken.deleteMany({ where: { userId: uid } }),
      prisma.passwordResetToken.deleteMany({ where: { userId: uid } }),
      prisma.userCity.deleteMany({ where: { userId: uid } }),
      prisma.user.updateMany({ where: { ambassadorId: uid }, data: { ambassadorId: null } }),
    ]);
    await prisma.user.delete({ where: { id: uid } });
    res.json({ success: true });
  } catch (err) { 
    logger.error({ err: err }, "Delete user error:");
    res.status(500).json({ error: "Failed to delete user" }); 
  }
});

router.post("/:id/message", authenticate, authorize("head"), async (req: AuthRequest, res: Response) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: "Message is required" });

    const user = await prisma.user.findUnique({
      where: { id: req.params.id as string },
      select: { id: true, name: true, email: true },
    });
    if (!user) return res.status(404).json({ error: "User not found" });

    await emailService.supportMessage(user.email, user.name, message);

    await prisma.notification.create({
      data: {
        userId: user.id,
        type: "message_received",
        title: "Message from Support",
        body: message.slice(0, 200),
        link: "/messages",
      },
    });

    res.json({ success: true, message: "Message sent" });
  } catch (error) {
    logger.error({ err: error }, "Send support message error:");
    res.status(500).json({ error: "Failed to send message" });
  }
});

export default router;



