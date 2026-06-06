import { Response, NextFunction } from "express";
import { AuthRequest } from "./auth";

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

export function requirePermission(flag: string) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: "Authentication required" });
    }

    if (req.user.role === "head") return next();

    if (!(req.user as any)[flag]) {
      return res.status(403).json({ error: `Missing permission: ${flag}` });
    }

    next();
  };
}
