-- CreateEnum
CREATE TYPE "CancellationPolicy" AS ENUM ('flexible', 'moderate', 'firm', 'strict');

-- CreateEnum
CREATE TYPE "ReservationAction" AS ENUM ('created', 'confirmed', 'rejected', 'cancelled', 'rescheduled', 'expired', 'refunded', 'payment_completed');

-- AlterEnum
ALTER TYPE "TransactionType" ADD VALUE IF NOT EXISTS 'refund';

-- AlterEnum
ALTER TYPE "ReservationStatus" ADD VALUE IF NOT EXISTS 'refunded';

-- AlterTable
ALTER TABLE "Listing" ADD COLUMN "cancellationPolicy" "CancellationPolicy" NOT NULL DEFAULT 'flexible';

-- AlterTable
ALTER TABLE "Reservation" ADD COLUMN "cancelledAt" TIMESTAMP(3),
ADD COLUMN "cancelledByUserId" TEXT,
ADD COLUMN "cancellationReason" TEXT,
ADD COLUMN "refundedAt" TIMESTAMP(3),
ADD COLUMN "refundRef" TEXT,
ADD COLUMN "refundAmount" INTEGER;

-- CreateTable
CREATE TABLE "ReservationLog" (
    "id" TEXT NOT NULL,
    "action" "ReservationAction" NOT NULL,
    "oldStatus" "ReservationStatus",
    "newStatus" "ReservationStatus" NOT NULL,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reservationId" TEXT NOT NULL,
    "userId" TEXT,

    CONSTRAINT "ReservationLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ReservationLog_reservationId_idx" ON "ReservationLog"("reservationId");

-- AddForeignKey
ALTER TABLE "ReservationLog" ADD CONSTRAINT "ReservationLog_reservationId_fkey" FOREIGN KEY ("reservationId") REFERENCES "Reservation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReservationLog" ADD CONSTRAINT "ReservationLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
