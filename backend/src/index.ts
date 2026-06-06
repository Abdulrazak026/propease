import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";

import authRoutes from "./routes/auth";
import listingRoutes from "./routes/listings";
import taskRoutes from "./routes/tasks";
import commissionRoutes from "./routes/commissions";
import inquiryRoutes from "./routes/inquiries";
import reservationRoutes from "./routes/reservations";
import customOrderRoutes from "./routes/custom-orders";
import headRoutes from "./routes/head";
import ambassadorRoutes from "./routes/ambassadors";
import agentRoutes from "./routes/agents";
import verificationRoutes from "./routes/verification";
import applicationRoutes from "./routes/applications";
import agreementRoutes from "./routes/agreements";
import reviewRoutes from "./routes/reviews";
import priceHistoryRoutes from "./routes/price-history";
import savedSearchesRoutes from "./routes/saved-searches";
import notificationsRoutes from "./routes/notifications";
import messagesRoutes from "./routes/messages";
import paymentsRoutes from "./routes/payments";
import settingsRoutes from "./routes/settings";
import publicSettingsRoutes from "./routes/public-settings";
import adminUsersRoutes from "./routes/admin-users";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import prisma from "./lib/prisma";
import { emailService } from "./services/email";

const app = express();
const PORT = process.env.PORT || 4000;

// Security
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
}));
app.use(cookieParser());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api/", limiter);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api/auth/login", authLimiter);
app.use("/api/auth/register", authLimiter);
app.use("/api/auth/forgot-password", authLimiter);
app.use("/api/auth/reset-password", authLimiter);

// Body parsing
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Logging
app.use(morgan("dev"));

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/listings", listingRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/commissions", commissionRoutes);
app.use("/api/inquiries", inquiryRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/custom-orders", customOrderRoutes);
app.use("/api/head", headRoutes);
app.use("/api/ambassador", ambassadorRoutes);
app.use("/api/agent", agentRoutes);
app.use("/api/verification", verificationRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/agreements", agreementRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/price-history", priceHistoryRoutes);
app.use("/api/saved-searches", savedSearchesRoutes);
app.use("/api/notifications", notificationsRoutes);
app.use("/api/messages", messagesRoutes);
app.use("/api/payments", paymentsRoutes);
app.use("/api/admin/settings", settingsRoutes);
app.use("/api/settings", publicSettingsRoutes);
app.use("/api/admin/users", adminUsersRoutes);

// Auth helpers (mounted directly to bypass cache)
app.post("/api/auth/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email is required" });
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.json({ message: "If that email exists, a reset link has been sent" });
    const resetToken = crypto.randomBytes(32).toString("hex");
    await prisma.passwordResetToken.create({
      data: { token: resetToken, userId: user.id, expiresAt: new Date(Date.now() + 15 * 60 * 1000) },
    });
    emailService.passwordReset(user.email, user.name, resetToken).catch(() => {});
    res.json({ message: "If that email exists, a reset link has been sent" });
  } catch (error) {
    res.status(500).json({ error: "Failed to process request" });
  }
});

app.post("/api/auth/reset-password", async (req, res) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) return res.status(400).json({ error: "Token and new password are required" });
    if (password.length < 8) return res.status(400).json({ error: "Password must be at least 8 characters" });
    const record = await prisma.passwordResetToken.findUnique({ where: { token } });
    if (!record || record.expiresAt < new Date()) return res.status(400).json({ error: "Invalid or expired reset token" });
    await prisma.user.update({ where: { id: record.userId }, data: { password: await bcrypt.hash(password, 12) } });
    await prisma.passwordResetToken.delete({ where: { id: record.id } });
    res.json({ message: "Password has been reset. You can now sign in." });
  } catch (error) {
    res.status(500).json({ error: "Failed to reset password" });
  }
});

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ error: "Not found" });
});

// Global error handler
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`PropEase API running on port ${PORT}`);
});

export default app;
