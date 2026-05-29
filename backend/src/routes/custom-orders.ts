import { Router, Response } from "express";
import prisma from "../lib/prisma";
import { authenticate, AuthRequest } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { createCustomOrderSchema } from "../validators";

const router = Router();

router.post("/", validate(createCustomOrderSchema), async (req, res: Response) => {
  try {
    const customOrder = await prisma.customOrder.create({
      data: req.body,
    });

    // Find an ambassador for the area and create a task
    const ambassador = await prisma.user.findFirst({
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
    console.error("Create custom order error:", error);
    res.status(500).json({ error: "Failed to submit custom order" });
  }
});

router.get("/", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    let where = {};
    if (req.user!.role === "ambassador") {
      where = { area: req.user!.city || "" };
    }

    const orders = await prisma.customOrder.findMany({
      where,
      include: { task: true },
      orderBy: { createdAt: "desc" },
    });

    res.json({ orders });
  } catch (error) {
    console.error("List custom orders error:", error);
    res.status(500).json({ error: "Failed to fetch custom orders" });
  }
});

export default router;
