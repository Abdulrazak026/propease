import { Router, Response } from "express";
import prisma from "../lib/prisma";
import { authenticate, AuthRequest } from "../middleware/auth";
import { authorize } from "../middleware/rbac";

const router = Router();

// Public: list published posts
router.get("/", async (_req, res: Response) => {
  try {
    const posts = await prisma.blogPost.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
      include: { author: { select: { name: true } } },
    });
    res.json({ posts });
  } catch { res.status(500).json({ error: "Failed to fetch posts" }); }
});

// Admin: list all posts
router.get("/all", authenticate, authorize("head"), async (_req: AuthRequest, res: Response) => {
  try {
    const posts = await prisma.blogPost.findMany({
      orderBy: { createdAt: "desc" },
      include: { author: { select: { name: true } } },
    });
    res.json({ posts });
  } catch { res.status(500).json({ error: "Failed to fetch posts" }); }
});

// Admin: create post
router.post("/", authenticate, authorize("head"), async (req: AuthRequest, res: Response) => {
  try {
    const { title, content, excerpt, coverImage, published } = req.body;
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const post = await prisma.blogPost.create({
      data: {
        title, slug, content, excerpt, coverImage,
        published: published || false,
        publishedAt: published ? new Date() : null,
        authorId: req.user!.id as string,
      },
    });
    res.status(201).json({ post });
  } catch { res.status(500).json({ error: "Failed to create post" }); }
});

// Admin: update post
router.patch("/:id", authenticate, authorize("head"), async (req: AuthRequest, res: Response) => {
  try {
    const { title, content, excerpt, coverImage, published } = req.body;
    const data: any = { content, excerpt, coverImage };
    if (title) {
      data.title = title;
      data.slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    }
    if (typeof published === "boolean") {
      data.published = published;
      data.publishedAt = published ? new Date() : null;
    }
    const post = await prisma.blogPost.update({
      where: { id: req.params.id as string },
      data,
    });
    res.json({ post });
  } catch { res.status(500).json({ error: "Failed to update post" }); }
});

// Admin: delete post
router.delete("/:id", authenticate, authorize("head"), async (req: AuthRequest, res: Response) => {
  try {
    await prisma.blogPost.delete({ where: { id: req.params.id as string } });
    res.json({ success: true });
  } catch { res.status(500).json({ error: "Failed to delete post" }); }
});

export default router;
