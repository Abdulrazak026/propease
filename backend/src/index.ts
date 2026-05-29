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
import paymentRoutes from "./routes/payments";
import inquiryRoutes from "./routes/inquiries";
import reservationRoutes from "./routes/reservations";
import customOrderRoutes from "./routes/custom-orders";
import headRoutes from "./routes/head";
import ambassadorRoutes from "./routes/ambassadors";
import agentRoutes from "./routes/agents";

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
app.use("/api/payments", paymentRoutes);
app.use("/api/inquiries", inquiryRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/custom-orders", customOrderRoutes);
app.use("/api/head", headRoutes);
app.use("/api/ambassador", ambassadorRoutes);
app.use("/api/agent", agentRoutes);

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
