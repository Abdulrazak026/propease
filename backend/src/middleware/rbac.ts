import { Response, NextFunction } from "express";
import { AuthRequest } from "./auth";

const roleAccess: Record<string, string[]> = {
  head: ["head"],
  ambassador: ["head", "ambassador"],
  agent: ["head", "ambassador", "agent"],
};

export function authorize(...allowedRoles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: "Authentication required" });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: "Insufficient permissions" });
    }

    next();
  };
}

export function authorizeSelfOrHigher(...targetRoles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const userAllowed = roleAccess[req.user.role] || [];
    const canAccess = targetRoles.some((r) => userAllowed.includes(r));

    if (!canAccess) {
      return res.status(403).json({ error: "Insufficient permissions" });
    }

    next();
  };
}
