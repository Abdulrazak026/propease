import { Router, Response } from "express";
import prisma from "../lib/prisma";
import { authenticate, AuthRequest } from "../middleware/auth";
import { authorize } from "../middleware/rbac";
import { validate } from "../middleware/validate";
import { createCustomOrderSchema } from "../validators";
import { logger } from "../lib/logger";
import { emailService } from "../services/email";
import { notifyUser } from "../services/notifier";
const router = Router();

router.post("/", validate(createCustomOrderSchema), async (req, res: Response) => {
  try {
    const customOrder = await prisma.customOrder.create({
      data: req.body,
    });

    emailService.customOrderReceived(req.body.clientName, req.body.clientContact || "", req.body.propertyType, req.body.area, req.body.budget).catch(() => {});

    // Find an ambassador for the area and create a task
    const ambassadorLink = await prisma.userCity.findFirst({
      where: { city: { name: req.body.area } },
      include: { user: true },
    });
    const ambassador = ambassadorLink?.user || await prisma.user.findFirst({
      where: { role: "ambassador", city: req.body.area },
    });

    if (ambassador) {
      const task = await prisma.task.create({
        data: {
          title: `Custom order: ${req.body.propertyType} in ${req.body.area}`,
          description: `Client ${req.body.clientName} (${req.body.clientContact}) is looking for a ${req.body.propertyType} in ${req.body.area}. Budget: ₦${req.body.budget.toLocaleString()}. ${req.body.notes || ""}`,
          propertyType: req.body.propertyType,
          area: req.body.area,
          budget: req.body.budget,
          deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
          notes: req.body.notes,
          source: "client_request",
          createdById: ambassador.id,
          assignedToId: ambassador.id,
        },
      });

      await prisma.customOrder.update({
        where: { id: customOrder.id },
        data: { taskId: task.id, status: "routed" },
      });

      res.status(201).json({ customOrder, task });
    } else {
      res.status(201).json({ customOrder, message: "Submitted. An ambassador will be assigned." });
    }
  } catch (error) {
    logger.error({ err: error }, "Create custom order error:");
    res.status(500).json({ error: "Failed to submit custom order" });
  }
});

router.get("/", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    let where = {};
    if (req.user!.role === "ambassador") {
      const userCities = await prisma.userCity.findMany({
        where: { userId: req.user!.id },
        include: { city: true },
      });
      const cityNames = userCities.map((uc) => uc.city.name);
      where = cityNames.length > 0 ? { area: { in: cityNames } } : { area: req.user!.city || "" };
    }
    // head/admin sees all - no filter

    const orders = await prisma.customOrder.findMany({
      where,
      include: { task: true },
      orderBy: { createdAt: "desc" },
    });

    res.json({ orders });
  } catch (error) {
    logger.error({ err: error }, "List custom orders error:");
    res.status(500).json({ error: "Failed to fetch custom orders" });
  }
});

router.patch("/:id/status", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { status } = req.body;
    const validStatuses: readonly string[] = ["pending", "routed", "fulfilled", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }
    const order = await prisma.customOrder.update({
      where: { id: req.params.id as string },
      data: { status },
    });
    res.json({ order });
  } catch (error) {
    logger.error({ err: error }, "Update custom order error:");
    res.status(500).json({ error: "Failed to update order" });
  }
});

router.post("/:id/share", authenticate, authorize("head"), async (req: AuthRequest, res: Response) => {
  try {
    const { staffIds } = req.body;
    if (!staffIds || !Array.isArray(staffIds) || staffIds.length === 0) {
      return res.status(400).json({ error: "staffIds array is required" });
    }

    const order = await prisma.customOrder.findUnique({ where: { id: req.params.id as string } });
    if (!order) {
      return res.status(404).json({ error: "Custom order not found" });
    }
    if (order.status === "cancelled" || order.status === "fulfilled") {
      return res.status(409).json({ error: "Cannot share a cancelled or fulfilled order" });
    }

    const tasks: any[] = [];
    for (const staffId of staffIds) {
      const task = await prisma.task.create({
        data: {
          title: `Custom order: ${order.propertyType} in ${order.area}`,
          description: `Client ${order.clientName} (${order.clientContact}) is looking for a ${order.propertyType} in ${order.area}. Budget: ₦${order.budget.toLocaleString()}. ${order.notes || ""}\n\nShared from custom order by ${req.user!.email}`,
          propertyType: order.propertyType,
          area: order.area,
          budget: order.budget,
          deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
          notes: order.notes,
          source: "client_request",
          createdById: req.user!.id,
          assignedToId: staffId,
        },
      });
      tasks.push(task);

      await notifyUser(staffId, "task_status", "New Task Assigned", `Custom order: ${order.propertyType} in ${order.area} — ${order.clientName}`, `/agent/tasks/${task.id}`);
    }

    await prisma.customOrder.update({
      where: { id: order.id },
      data: { status: "routed" },
    });

    await notifyUser(req.user!.id, "task_status", "Custom Order Shared", `Shared "${order.propertyType} in ${order.area}" to ${staffIds.length} staff member(s)`, `/admin/tasks/${tasks[0]?.id || ""}`);

    res.status(201).json({ tasks, orderId: order.id });
  } catch (error) {
    logger.error({ err: error }, "Share custom order error:");
    res.status(500).json({ error: "Failed to share order" });
  }
});

export default router;


