import { Router, Response } from "express";
import prisma from "../lib/prisma";
import { authenticate, AuthRequest } from "../middleware/auth";
import { authorize } from "../middleware/rbac";
import { logger } from "../lib/logger";

const router = Router();

router.get("/", async (req, res: Response) => {
  try {
    const { department, location, type, includeAll } = req.query;
    const where: any = { isPublished: true };
    if (includeAll === "true") delete where.isPublished;
    if (department) where.department = department;
    if (location) where.location = location;
    if (type) where.type = type;

    const jobs = await prisma.job.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });
    res.json({ jobs });
  } catch (error) {
    logger.error({ err: error }, "List jobs error:");
    res.status(500).json({ error: "Failed to fetch jobs" });
  }
});

router.get("/:id", async (req, res: Response) => {
  try {
    const job = await prisma.job.findUnique({ where: { id: req.params.id as string } });
    if (!job) return res.status(404).json({ error: "Not found" });
    res.json({ job });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch job" });
  }
});

router.post("/", authenticate, authorize("head"), async (req: AuthRequest, res: Response) => {
  try {
    const data = req.body;
    if (!data.title || !data.department || !data.location || !data.type || !data.description) {
      return res.status(400).json({ error: "title, department, location, type and description are required" });
    }
    const job = await prisma.job.create({
      data: {
        title: data.title,
        department: data.department,
        location: data.location,
        type: data.type,
        description: data.description,
        isPublished: !!data.isPublished,
        postedById: req.user!.id,
      },
    });
    res.status(201).json({ job });
  } catch (error) {
    logger.error({ err: error }, "Create job error:");
    res.status(500).json({ error: "Failed to create job" });
  }
});

router.patch("/:id", authenticate, authorize("head"), async (req: AuthRequest, res: Response) => {
  try {
    const data = req.body;
    const updated = await prisma.job.update({
      where: { id: req.params.id as string },
      data: {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.department !== undefined && { department: data.department }),
        ...(data.location !== undefined && { location: data.location }),
        ...(data.type !== undefined && { type: data.type }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.isPublished !== undefined && { isPublished: !!data.isPublished }),
      },
    });
    res.json({ job: updated });
  } catch (error) {
    logger.error({ err: error }, "Update job error:");
    res.status(500).json({ error: "Failed to update job" });
  }
});

router.delete("/:id", authenticate, authorize("head"), async (req: AuthRequest, res: Response) => {
  try {
    await prisma.job.delete({ where: { id: req.params.id as string } });
    res.json({ message: "Deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete job" });
  }
});

router.post("/:id/apply", async (req, res: Response) => {
  try {
    const data = req.body;
    if (!data.fullName || !data.email || !data.phone) {
      return res.status(400).json({ error: "fullName, email and phone are required" });
    }
    const job = await prisma.job.findUnique({ where: { id: req.params.id as string } });
    if (!job || !job.isPublished) return res.status(404).json({ error: "Job not found" });
    const application = await prisma.jobApplication.create({
      data: {
        jobId: job.id,
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        coverNote: data.coverNote,
        cvUrl: data.cvUrl,
      },
    });
    res.status(201).json({ application });
  } catch (error) {
    logger.error({ err: error }, "Job apply error:");
    res.status(500).json({ error: "Failed to submit application" });
  }
});

router.get("/:id/applications", authenticate, authorize("head"), async (req, res: Response) => {
  try {
    const apps = await prisma.jobApplication.findMany({
      where: { jobId: req.params.id as string },
      orderBy: { createdAt: "desc" },
    });
    res.json({ applications: apps });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch applications" });
  }
});

export default router;
