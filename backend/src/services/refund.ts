import prisma from "../lib/prisma";
import { logger } from "../lib/logger";

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY || "";

interface RefundResult {
  success: boolean;
  refundRef?: string;
  error?: string;
}

export async function processRefund(
  reservationId: string,
  amountKobo: number,
  transactionReference: string,
  reason?: string,
): Promise<RefundResult> {
  try {
    const response = await fetch("https://api.paystack.co/refund", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        transaction: transactionReference,
        amount: amountKobo,
        reason: reason || "Reservation cancellation",
      }),
    });

    const data = await response.json() as { status: boolean; message: string; data?: { id: number; transaction: { reference: string } } };

    if (!data.status) {
      logger.error({ err: data.message }, "Paystack refund failed");
      return { success: false, error: data.message };
    }

    const refundRef = `ref_${data.data?.id || transactionReference}`;

    await prisma.transaction.create({
      data: {
        type: "refund",
        amount: Math.round(amountKobo / 100),
        reference: refundRef,
        method: "card",
        status: "completed",
        userId: (await prisma.reservation.findUnique({ where: { id: reservationId }, select: { userId: true } }))?.userId || "",
      },
    });

    await prisma.reservation.update({
      where: { id: reservationId },
      data: {
        refundRef,
        refundAmount: Math.round(amountKobo / 100),
        refundedAt: new Date(),
      },
    });

    logger.info({ reservationId, refundRef, amount: amountKobo }, "Refund processed successfully");
    return { success: true, refundRef };
  } catch (error) {
    logger.error({ err: error }, "Refund processing error");
    return { success: false, error: "Refund processing failed" };
  }
}

export function calculateRefundAmount(
  holdingDeposit: number,
  policy: string,
  hoursSinceBooking: number,
  hoursUntilMeeting: number | null,
): { refundAmount: number; fee: number } {
  const GRACE_PERIOD_HOURS = 24;

  if (hoursSinceBooking <= GRACE_PERIOD_HOURS) {
    return { refundAmount: holdingDeposit, fee: 0 };
  }

  switch (policy) {
    case "flexible":
      if (hoursUntilMeeting !== null && hoursUntilMeeting >= 24) {
        return { refundAmount: holdingDeposit, fee: 0 };
      }
      return { refundAmount: Math.round(holdingDeposit * 0.5), fee: Math.round(holdingDeposit * 0.5) };

    case "moderate":
      if (hoursUntilMeeting !== null && hoursUntilMeeting >= 48) {
        return { refundAmount: holdingDeposit, fee: 0 };
      }
      return { refundAmount: Math.round(holdingDeposit * 0.5), fee: Math.round(holdingDeposit * 0.5) };

    case "firm":
      if (hoursUntilMeeting !== null && hoursUntilMeeting >= 48) {
        return { refundAmount: Math.round(holdingDeposit * 0.5), fee: Math.round(holdingDeposit * 0.5) };
      }
      return { refundAmount: 0, fee: holdingDeposit };

    case "strict":
      return { refundAmount: 0, fee: holdingDeposit };

    default:
      return { refundAmount: holdingDeposit, fee: 0 };
  }
}
