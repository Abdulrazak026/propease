import { Router, Response } from "express";
import prisma from "../lib/prisma";
import { authenticate, AuthRequest } from "../middleware/auth";

const router = Router();

router.get("/", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id as string;
    if (!userId) return res.status(401).json({ error: "User ID required" });
    const searches = await prisma.savedSearch.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
    res.json(searches);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch saved searches" });
  }
});

router.post("/", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id as string;
    if (!userId) return res.status(401).json({ error: "User ID required" });
    const { name, searchParams, notifyEmail, notifySms, notifyPush } = req.body;
    const search = await prisma.savedSearch.create({
      data: { userId, name, searchParams, notifyEmail, notifySms, notifyPush },
    });
    res.status(201).json(search);
  } catch (error) {
    res.status(500).json({ error: "Failed to save search" });
  }
});

router.delete("/:id", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const searchId = req.params.id as string;
    const uid = req.user!.id as string;
    await prisma.savedSearch.deleteMany({
      where: { id: searchId, userId: uid },
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete saved search" });
  }
});

export default router;
