import { Router, Response } from "express";
import prisma from "../lib/prisma";
import { authenticate, AuthRequest } from "../middleware/auth";
import { authorize } from "../middleware/rbac";
import { validate } from "../middleware/validate";
import { createTaskSchema } from "../validators";
import { logger } from "../lib/logger";
import { emailService } from "../services/email";
const router = Router();

router.get("/my", authenticate, authorize("agent", "ambassador", "head"), async (req: AuthRequest, res: Response) => {
  try {
    const tasks = await prisma.task.findMany({
      where: {
        OR: [
          { assignedToId: req.user!.id },
          { assignedToId: null, status: "open" },
        ],
      },
      include: {
        createdBy: { select: { id: true, name: true, role: true } },
        assignedTo: { select: { id: true, name: true } },
        comments: {
          include: { author: { select: { id: true, name: true } } },
          orderBy: { createdAt: "asc" },
        },
      },
      orderBy: [{ status: "asc" }, { deadline: "asc" }],
    });

    res.json({ tasks });
  } catch (error) {
    logger.error({ err: error }, "Get my tasks error:");
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

router.get("/city/:city", authenticate, authorize("ambassador"), async (req: AuthRequest, res: Response) => {
  try {
    const city = req.params.city as string;
    if (req.user!.city && req.user!.city.toLowerCase() !== city.toLowerCase()) {
      return res.status(403).json({ error: "You can only view tasks in your assigned city" });
    }
    const tasks = await prisma.task.findMany({
      where: { area: city },
      include: {
        createdBy: { select: { id: true, name: true, role: true } },
        assignedTo: { select: { id: true, name: true } },
        comments: {
          include: { author: { select: { id: true, name: true } } },
          orderBy: { createdAt: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json({ tasks });
  } catch (error) {
    logger.error({ err: error }, "Get city tasks error:");
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

router.get("/all", authenticate, authorize("head"), async (req: AuthRequest, res: Response) => {
  try {
    const tasks = await prisma.task.findMany({
      include: {
        createdBy: { select: { id: true, name: true, role: true } },
        assignedTo: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json({ tasks });
  } catch (error) {
    logger.error({ err: error }, "Get all tasks error:");
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

router.get("/:id", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const taskId = req.params.id as string;
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: {
        createdBy: { select: { id: true, name: true, role: true } },
        assignedTo: { select: { id: true, name: true, role: true } },
        comments: {
          include: { author: { select: { id: true, name: true } } },
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    if (req.user!.role === "agent" && task.assignedToId !== req.user!.id) {
      return res.status(403).json({ error: "This task is not assigned to you" });
    }

    res.json({ task });
  } catch (error) {
    logger.error({ err: error }, "Get task error:");
    res.status(500).json({ error: "Failed to fetch task" });
  }
});

router.post("/", authenticate, authorize("head", "ambassador"), validate(createTaskSchema), async (req: AuthRequest, res: Response) => {
  try {
    if (req.user!.role === "ambassador") {
      const ambassador = await prisma.user.findUnique({ where: { id: req.user!.id } });
      if (!ambassador || !ambassador.canCreateTasks) {
        return res.status(403).json({ error: "You don't have permission to create tasks" });
      }
      req.body.area = ambassador.city || req.body.area;
    }

    const task = await prisma.task.create({
      data: {
        ...req.body,
        deadline: new Date(req.body.deadline),
        createdById: req.user!.id,
      },
      include: {
        createdBy: { select: { id: true, name: true } },
        assignedTo: { select: { id: true, name: true } },
      },
    });

    await prisma.auditLog.create({
      data: {
        action: "CREATE_TASK",
        entity: "Task",
        entityId: task.id,
        userId: req.user!.id,
      },
    });

    if (req.body.assignedToId) {
      const assignee = await prisma.user.findUnique({ where: { id: req.body.assignedToId }, select: { email: true, name: true } });
      emailService.taskAssigned(assignee?.email || "", assignee?.name || "", task.title, task.area).catch(() => {});
    }

    res.status(201).json({ task });
  } catch (error) {
    logger.error({ err: error }, "Create task error:");
    res.status(500).json({ error: "Failed to create task" });
  }
});

router.patch("/:id/status", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { status } = req.body;
    const validStatuses = ["open", "in_progress", "fulfilled", "closed"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const taskId = req.params.id as string;
    const task = await prisma.task.findUnique({ where: { id: taskId } });
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    if (req.user!.role === "agent" && task.assignedToId !== req.user!.id) {
      return res.status(403).json({ error: "Not your task" });
    }
    if (req.user!.role === "ambassador" && req.user!.city && task.area !== req.user!.city) {
      return res.status(403).json({ error: "You can only modify tasks in your assigned city" });
    }

    const updated = await prisma.task.update({
      where: { id: taskId },
      data: { status },
      include: {
        assignedTo: { select: { id: true, name: true } },
      },
    });

    res.json({ task: updated });
    if (task.assignedToId) {
      const assignee = await prisma.user.findUnique({ where: { id: task.assignedToId }, select: { email: true, name: true } });
      emailService.taskStatusChanged(assignee?.email || "", assignee?.name || "", task.title, status).catch(() => {});
    }
  } catch (error) {
    logger.error({ err: error }, "Update task status error:");
    res.status(500).json({ error: "Failed to update task status" });
  }
});

router.post("/:id/claim", authenticate, authorize("agent"), async (req: AuthRequest, res: Response) => {
  try {
    const taskId = req.params.id as string;
    const task = await prisma.task.findUnique({ where: { id: taskId } });
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }
    if (task.assignedToId) {
      return res.status(400).json({ error: "This task is already assigned" });
    }

    const updated = await prisma.task.update({
      where: { id: taskId },
      data: { assignedToId: req.user!.id, status: "in_progress" },
      include: {
        assignedTo: { select: { id: true, name: true } },
        createdBy: { select: { id: true, name: true, email: true } },
      },
    });

    res.json({ task: updated });

    if (updated.createdBy?.email) {
      const agent = await prisma.user.findUnique({ where: { id: req.user!.id }, select: { name: true } });
      emailService.taskStatusChanged(updated.createdBy.email, updated.createdBy.name, task.title, "claimed").catch(() => {});
    }
  } catch (error) {
    logger.error({ err: error }, "Claim task error:");
    res.status(500).json({ error: "Failed to claim task" });
  }
});

router.post("/:id/comments", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { text } = req.body;
    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: "Comment text required" });
    }

    const taskId = req.params.id as string;
    const task = await prisma.task.findUnique({ where: { id: taskId } });
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    const comment = await prisma.taskComment.create({
      data: {
        text,
        taskId,
        authorId: req.user!.id,
      },
      include: {
        author: { select: { id: true, name: true, role: true } },
      },
    });

    res.status(201).json({ comment });
    if (task.assignedToId && task.assignedToId !== req.user!.id) {
      const assignee = await prisma.user.findUnique({ where: { id: task.assignedToId }, select: { email: true, name: true } });
      emailService.taskCommentAdded(assignee?.email || "", assignee?.name || "", task.title, comment.author.name).catch(() => {});
    }
  } catch (error) {
    logger.error({ err: error }, "Create comment error:");
    res.status(500).json({ error: "Failed to create comment" });
  }
});

// Submit a task with photos and description
router.post("/:id/submit", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const taskId = req.params.id as string;
    const { description, photos } = req.body;
    if (!description) return res.status(400).json({ error: "Description is required" });

    const task = await prisma.task.findUnique({ where: { id: taskId } });
    if (!task) return res.status(404).json({ error: "Task not found" });
    if (task.assignedToId !== req.user!.id && req.user!.role !== "head") {
      return res.status(403).json({ error: "Not your task" });
    }

    const submission = await prisma.taskSubmission.create({
      data: {
        description,
        photos: photos || [],
        taskId,
        submittedById: req.user!.id,
      },
      include: { submittedBy: { select: { id: true, name: true } } },
    });

    // Update task status to submitted
    await prisma.task.update({ where: { id: taskId }, data: { status: "submitted" } });

    // Notify admin
    const admins = await prisma.user.findMany({ where: { role: "head" }, select: { id: true } });
    const submitter = await prisma.user.findUnique({ where: { id: req.user!.id }, select: { name: true } });
    for (const admin of admins) {
      await prisma.notification.create({
        data: {
          userId: admin.id,
          type: "task_status",
          title: "Task Submitted for Review",
          body: `${submitter?.name || "Agent"} submitted task "${task.title}" with ${photos?.length || 0} photos.`,
          link: `/admin/tasks/${taskId}`,
        },
      }).catch(() => {});
    }

    res.status(201).json({ submission });
  } catch (error) {
    logger.error({ err: error }, "Submit task error:");
    res.status(500).json({ error: "Failed to submit task" });
  }
});

// Get task submissions
router.get("/:id/submissions", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const submissions = await prisma.taskSubmission.findMany({
      where: { taskId: req.params.id as string },
      include: { submittedBy: { select: { id: true, name: true } } },
      orderBy: { createdAt: "desc" },
    });
    res.json({ submissions });
  } catch (error) {
    logger.error({ err: error }, "Get submissions error:");
    res.status(500).json({ error: "Failed to fetch submissions" });
  }
});

// Approve or reject a task submission
router.patch("/:taskId/submissions/:id", authenticate, authorize("head"), async (req: AuthRequest, res: Response) => {
  try {
    const { status, adminNotes } = req.body;
    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ error: "Status must be approved or rejected" });
    }

    const submission = await prisma.taskSubmission.update({
      where: { id: req.params.id as string },
      data: { status, adminNotes },
      include: { task: true, submittedBy: { select: { id: true, name: true, email: true } } },
    });

    if (status === "approved") {
      await prisma.task.update({ where: { id: submission.taskId }, data: { status: "fulfilled" } });
      emailService.taskStatusChanged(submission.submittedBy.email, submission.submittedBy.name, submission.task.title, "fulfilled").catch(() => {});
    } else {
      await prisma.task.update({ where: { id: submission.taskId }, data: { status: "in_progress" } });
      emailService.taskStatusChanged(submission.submittedBy.email, submission.submittedBy.name, submission.task.title, "rejected").catch(() => {});
    }

    res.json({ submission });
  } catch (error) {
    logger.error({ err: error }, "Review submission error:");
    res.status(500).json({ error: "Failed to review submission" });
  }
});

export default router;


