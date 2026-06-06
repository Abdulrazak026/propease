import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
    city?: string | null;
    jti?: string;
    canCreateTasks?: boolean;
    canCloseDeals?: boolean;
    canCreateListings?: boolean;
    canManageUsers?: boolean;
    canManageContent?: boolean;
    canViewAnalytics?: boolean;
    canManageAgreements?: boolean;
  };
}

// Clean up expired blacklisted tokens every 5 minutes
setInterval(() => {
  prisma.blacklistedToken.deleteMany({
    where: { expiresAt: { lt: new Date() } },
  }).catch(() => {});
}, 5 * 60 * 1000);

export async function authenticate(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Authentication required" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
      email: string;
      role: string;
      city?: string;
      jti?: string;
      canCreateTasks?: boolean;
      canCloseDeals?: boolean;
      canCreateListings?: boolean;
      canManageUsers?: boolean;
      canManageContent?: boolean;
      canViewAnalytics?: boolean;
      canManageAgreements?: boolean;
    };
    req.user = decoded;

    // Check blacklist
    if (decoded.jti) {
      const blacklisted = await prisma.blacklistedToken.findUnique({
        where: { jti: decoded.jti },
      });
      if (blacklisted) {
        return res.status(401).json({ error: "Token invalidated" });
      }
    }

    next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}
