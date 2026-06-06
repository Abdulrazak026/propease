import { Router, Response } from "express";
import prisma from "../lib/prisma";
import { authenticate, AuthRequest } from "../middleware/auth";
import { authorize } from "../middleware/rbac";

const router = Router();

// Public: list FAQs
router.get("/", async (_req, res: Response) => {
  try {
    const faqs = await prisma.faq.findMany({ orderBy: { order: "asc" } });
    res.json({ faqs });
  } catch { res.status(500).json({ error: "Failed to fetch FAQs" }); }
});

// Admin: create FAQ
router.post("/", authenticate, authorize("head"), async (req: AuthRequest, res: Response) => {
  try {
    const { question, answer, order } = req.body;
    const faq = await prisma.faq.create({ data: { question, answer, order: order || 0 } });
    res.status(201).json({ faq });
  } catch { res.status(500).json({ error: "Failed to create FAQ" }); }
});

// Admin: update FAQ
router.patch("/:id", authenticate, authorize("head"), async (req: AuthRequest, res: Response) => {
  try {
    const { question, answer, order } = req.body;
    const faq = await prisma.faq.update({
      where: { id: req.params.id as string },
      data: { question, answer, order },
    });
    res.json({ faq });
  } catch { res.status(500).json({ error: "Failed to update FAQ" }); }
});

// Admin: delete FAQ
router.delete("/:id", authenticate, authorize("head"), async (req: AuthRequest, res: Response) => {
  try {
    await prisma.faq.delete({ where: { id: req.params.id as string } });
    res.json({ success: true });
  } catch { res.status(500).json({ error: "Failed to delete FAQ" }); }
});

export default router;
