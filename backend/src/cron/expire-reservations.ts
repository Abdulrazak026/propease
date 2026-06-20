import prisma from "../lib/prisma";
import { logger } from "../lib/logger";

let intervalHandle: ReturnType<typeof setInterval> | null = null;

export function startExpiryCron() {
  if (intervalHandle) return;
  logger.info("Starting reservation expiry cron (runs every 15 minutes)");
  intervalHandle = setInterval(checkAndExpire, 15 * 60 * 1000);
  checkAndExpire();
}

export function stopExpiryCron() {
  if (intervalHandle) {
    clearInterval(intervalHandle);
    intervalHandle = null;
  }
}

async function checkAndExpire() {
  try {
    const now = new Date();
    const expired = await prisma.reservation.findMany({
      where: {
        status: { in: ["pending", "pending_payment"] },
        expiresAt: { lte: now },
      },
      include: { listing: { select: { id: true, title: true } }, user: { select: { id: true, email: true, name: true } } },
    });

    if (expired.length === 0) return;

    logger.info(`Expiring ${expired.length} reservations`);

    for (const reservation of expired) {
      await prisma.$transaction(async (tx) => {
        await tx.reservation.update({
          where: { id: reservation.id },
          data: { status: "expired" },
        });

        await tx.listing.update({
          where: { id: reservation.listingId },
          data: { status: "available" },
        });

        await tx.reservationLog.create({
          data: {
            action: "expired",
            oldStatus: reservation.status,
            newStatus: "expired",
            reservationId: reservation.id,
            userId: reservation.userId,
          },
        });
      });

      logger.info({ reservationId: reservation.id, listing: reservation.listing.title }, "Reservation expired");
    }
  } catch (error) {
    logger.error({ err: error }, "Expiry cron error");
  }
}
