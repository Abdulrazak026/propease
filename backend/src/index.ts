import dotenv from "dotenv";
dotenv.config();

if (!process.env.JWT_SECRET) {
  console.error("FATAL: JWT_SECRET is not set. Server cannot start.");
  process.exit(1);
}

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
import withdrawalRoutes from "./routes/withdrawals";
import blogRoutes from "./routes/blog";
import faqRoutes from "./routes/faqs";
import uploadRoutes from "./routes/upload";
import contactRoutes from "./routes/contact";
import agentSettingsRoutes from "./routes/agent-settings";
import careerRoutes from "./routes/careers";
import soldPropertiesRoutes from "./routes/sold-properties";
import newsletterRoutes from "./routes/newsletter";
import adminSubmissionsRoutes from "./routes/admin-submissions";
import prisma from "./lib/prisma";
import { logger } from "./lib/logger";

const app = express();
const PORT = process.env.PORT || 4000;

// Trust proxy for Railway/Cloudflare
app.set("trust proxy", 1);

// Security
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors({
  origin: process.env.FRONTEND_URL || [
    "https://mbpproperties.com",
    "https://propease.white-king-bd7d.workers.dev",
  ],
  credentials: true,
}));
app.use(cookieParser());

// Serve uploaded files
app.use("/uploads", express.static("uploads"));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  validate: { xForwardedForHeader: false },
});
app.use("/api/", limiter);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  validate: { xForwardedForHeader: false },
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

// Health check with DB connectivity
app.get("/api/health", async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: "ok", db: "connected", timestamp: new Date().toISOString() });
  } catch {
    res.status(503).json({ status: "error", db: "disconnected" });
  }
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
app.use("/api/wallet", withdrawalRoutes);
app.use("/api/blog", blogRoutes);
app.use("/api/faqs", faqRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/agent/settings", agentSettingsRoutes);
app.use("/api/careers", careerRoutes);
app.use("/api/sold-properties", soldPropertiesRoutes);
app.use("/api/newsletter", newsletterRoutes);
app.use("/api/admin/submissions", adminSubmissionsRoutes);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ error: "Not found" });
});

// Global error handler
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  logger.error(err, "Unhandled error");
  res.status(500).json({ error: "Internal server error" });
});

const server = app.listen(PORT, () => {
  logger.info({ port: PORT }, "API server started");
});

async function shutdown(signal: string) {
  logger.warn({ signal }, "Shutting down...");
  server.close(async () => {
    await prisma.$disconnect();
    logger.info("Server stopped. DB disconnected.");
    process.exit(0);
  });
  setTimeout(() => { logger.error("Forced shutdown after 10s"); process.exit(1); }, 10000);
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

export default app;
