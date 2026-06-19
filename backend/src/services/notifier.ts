import { emailService } from "./email";
import prisma from "../lib/prisma";
import { logger } from "../lib/logger";
import type { NotificationType } from "@prisma/client";

export async function notifyUser(
  userId: string,
  type: NotificationType,
  title: string,
  body: string,
  link: string,
) {
  await prisma.notification.create({
    data: { userId, type, title, body, link },
  }).catch((e) => logger.error({ err: e }, "In-app notification failed"));

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { email: true, name: true, whatsapp: true },
  }).catch(() => null);
  if (!user) return;

  if (user.email) {
    try {
      if (type === "task_status") {
        if (body.startsWith("New Task Assigned") || title === "New Task Assigned") {
          await emailService.taskAssigned(user.email, user.name || "", title, "");
        } else if (title === "Task Submitted for Review" || body.includes("submitted")) {
          await emailService.taskStatusChanged(user.email, user.name || "", title, "submitted");
        } else {
          await emailService.taskCommentAdded(user.email, user.name || "", title, "System");
        }
      }
    } catch (e) {
      logger.error({ err: e }, `Email notification failed for ${user.email}`);
    }
  }
}
