import { Router, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import prisma from "../lib/prisma";
import { authenticate, AuthRequest } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { registerSchema, loginSchema } from "../validators";
import { v4 as uuidv4 } from "uuid";
import { emailService } from "../services/email";
import { logger } from "../lib/logger";
const router = Router();

interface UserWithPerms {
  id: string; email: string; role: string; city?: string | null;
  canCreateTasks?: boolean; canCloseDeals?: boolean;
  canCreateListings?: boolean; canManageUsers?: boolean;
  canManageContent?: boolean; canViewAnalytics?: boolean;
  canManageAgreements?: boolean;
}

function generateAccessToken(user: UserWithPerms) {
  return jwt.sign(
    {
      id: user.id, email: user.email, role: user.role, city: user.city, jti: uuidv4(),
      canCreateTasks: user.canCreateTasks,
      canCloseDeals: user.canCloseDeals,
      canCreateListings: user.canCreateListings,
      canManageUsers: user.canManageUsers,
      canManageContent: user.canManageContent,
      canViewAnalytics: user.canViewAnalytics,
      canManageAgreements: user.canManageAgreements,
    },
    process.env.JWT_SECRET!,
    { expiresIn: "15m" }
  );
}

function generateRefreshToken() {
  return uuidv4();
}

router.post("/register", validate(registerSchema), async (req, res: Response) => {
  try {
    const { name, email, password, city } = req.body;
    // Force role to "client" — staff roles assigned only by admin
    const role = "client";

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ error: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        city,
        isApproved: true,
      },
      select: { id: true, name: true, email: true, role: true, city: true, isApproved: true },
    });

    // Auto-login after signup
    const accessToken = generateAccessToken(user);
    const refreshTokenValue = generateRefreshToken();
    await prisma.refreshToken.create({
      data: { token: refreshTokenValue, userId: user.id, used: false, revoked: false, expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
    });
    res.cookie("refreshToken", refreshTokenValue, { httpOnly: true, secure: true, sameSite: "none", path: "/", maxAge: 7 * 24 * 60 * 60 * 1000 });
    res.status(201).json({ accessToken, user, message: "Registration successful" });

    const admins = await prisma.user.findMany({
      where: { role: "head" },
      select: { id: true },
    });
    const adminNotifications = admins.map((admin) =>
      prisma.notification.create({
        data: {
          userId: admin.id,
          type: "application_status",
          title: "New User Registration",
          body: `${name} (${email}) registered as ${user.role}.`,
          link: "/admin/users",
        },
      })
    );
    Promise.all(adminNotifications).catch(() => {});
    emailService.welcome(email, name).catch(() => {});
  } catch (error) {
    logger.error({ err: error }, "Register error:");
    res.status(500).json({ error: "Registration failed" });
  }
});

router.post("/login", validate(loginSchema), async (req, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    if (!user.isApproved && user.role !== "head") {
      return res.status(403).json({ error: "Account pending approval" });
    }

    const accessToken = generateAccessToken(user);
    const refreshTokenValue = generateRefreshToken();

    await prisma.refreshToken.create({
      data: {
        token: refreshTokenValue,
        userId: user.id,
        used: false,
        revoked: false,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    res.cookie("refreshToken", refreshTokenValue, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      accessToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        city: user.city,
        walletBalance: user.walletBalance,
        canCreateTasks: user.canCreateTasks,
        canCloseDeals: user.canCloseDeals,
        canCreateListings: user.canCreateListings,
        canManageUsers: user.canManageUsers,
        canManageContent: user.canManageContent,
        canViewAnalytics: user.canViewAnalytics,
        canManageAgreements: user.canManageAgreements,
        isVerified: user.isVerified,
        whatsapp: user.whatsapp,
      },
    });
  } catch (error) {
    logger.error({ err: error }, "Login error:");
    res.status(500).json({ error: "Login failed" });
  }
});

router.post("/refresh", async (req, res: Response) => {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) {
      return res.status(401).json({ error: "Refresh token required" });
    }

    const stored = await prisma.refreshToken.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!stored) {
      return res.status(401).json({ error: "Invalid token" });
    }

    // Token already used (rotated out) — THEFT DETECTED
    // Revoke ALL tokens for this user
    if (stored.used) {
      await prisma.refreshToken.updateMany({
        where: { userId: stored.userId },
        data: { revoked: true },
      });
      logger.warn({ userId: stored.userId }, "Refresh token reuse detected — all tokens revoked");
      return res.status(401).json({ error: "Token reuse detected. Please log in again." });
    }

    if (stored.expiresAt < new Date()) {
      return res.status(401).json({ error: "Refresh token expired" });
    }

    if (stored.revoked) {
      return res.status(401).json({ error: "Token revoked" });
    }

    // Mark old token as used (rotated out)
    await prisma.refreshToken.update({
      where: { id: stored.id },
      data: { used: true },
    });

    // Issue new access token + new refresh token
    const accessToken = generateAccessToken(stored.user);
    const newRefreshTokenValue = generateRefreshToken();

    await prisma.refreshToken.create({
      data: {
        token: newRefreshTokenValue,
        userId: stored.userId,
        used: false,
        revoked: false,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    res.cookie("refreshToken", newRefreshTokenValue, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ accessToken });
  } catch (error) {
    logger.error({ err: error }, "Refresh error:");
    res.status(500).json({ error: "Token refresh failed" });
  }
});

router.post("/logout", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const authHeader = req.headers.authorization!;
    const accessToken = authHeader.split(" ")[1];
    const payload = jwt.decode(accessToken) as any;

    // Blacklist the access token until its natural expiry
    if (payload?.jti && payload?.exp) {
      const ttl = payload.exp - Math.floor(Date.now() / 1000);
      if (ttl > 0) {
        await prisma.blacklistedToken.create({
          data: {
            jti: payload.jti,
            userId: req.user!.id,
            expiresAt: new Date(Date.now() + ttl * 1000),
          },
        });
      }
    }

    const token = req.cookies?.refreshToken;
    if (token) {
      await prisma.refreshToken.updateMany({
        where: { token },
        data: { revoked: true },
      });
    }

    res.clearCookie("refreshToken", { path: "/", secure: true, sameSite: "none" });
    res.json({ message: "Logged out" });
  } catch (error) {
    logger.error({ err: error }, "Logout error:");
    res.status(500).json({ error: "Logout failed" });
  }
});

router.get("/me", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        city: true,
        walletBalance: true,
        canCreateTasks: true,
        canCloseDeals: true,
        canCreateListings: true,
        canManageUsers: true,
        canManageContent: true,
        canViewAnalytics: true,
        canManageAgreements: true,
        ambassadorId: true,
        isVerified: true,
        whatsapp: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ user });
  } catch (error) {
    logger.error({ err: error }, "Me error:");
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

router.post("/forgot-password", async (req, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email is required" });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.json({ message: "If that email exists, a reset link has been sent" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    await prisma.passwordResetToken.create({
      data: { token: resetToken, userId: user.id, expiresAt },
    });

    await emailService.passwordReset(user.email, user.name, resetToken).catch(() => {});

    res.json({ message: "If that email exists, a reset link has been sent" });
  } catch (error) {
    logger.error({ err: error }, "Forgot password error:");
    res.status(500).json({ error: "Failed to process request" });
  }
});

router.post("/reset-password", async (req, res: Response) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) return res.status(400).json({ error: "Token and new password are required" });
    if (password.length < 8) return res.status(400).json({ error: "Password must be at least 8 characters" });

    const resetRecord = await prisma.passwordResetToken.findUnique({ where: { token } });
    if (!resetRecord || resetRecord.expiresAt < new Date()) {
      return res.status(400).json({ error: "Invalid or expired reset token" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    await prisma.user.update({
      where: { id: resetRecord.userId },
      data: { password: hashedPassword },
    });

    await prisma.passwordResetToken.delete({ where: { id: resetRecord.id } });

    res.json({ message: "Password has been reset. You can now sign in." });
  } catch (error) {
    logger.error({ err: error }, "Reset password error:");
    res.status(500).json({ error: "Failed to reset password" });
  }
});

export default router;


