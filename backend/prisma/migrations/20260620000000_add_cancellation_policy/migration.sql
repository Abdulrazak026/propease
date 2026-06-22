-- CreateEnum (safe)
DO $$ BEGIN
  CREATE TYPE "CancellationPolicy" AS ENUM ('flexible', 'moderate', 'firm', 'strict');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- CreateEnum (safe)
DO $$ BEGIN
  CREATE TYPE "ReservationAction" AS ENUM ('created', 'confirmed', 'rejected', 'cancelled', 'rescheduled', 'expired', 'refunded', 'payment_completed');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- AlterEnum
ALTER TYPE "TransactionType" ADD VALUE IF NOT EXISTS 'refund';

-- AlterEnum
ALTER TYPE "ReservationStatus" ADD VALUE IF NOT EXISTS 'refunded';

-- AlterTable
ALTER TABLE "Listing" ADD COLUMN IF NOT EXISTS "cancellationPolicy" "CancellationPolicy" NOT NULL DEFAULT 'flexible';

-- AlterTable
ALTER TABLE "Reservation" ADD COLUMN IF NOT EXISTS "cancelledAt" TIMESTAMP(3),
ADD COLUMN IF NOT EXISTS "cancelledByUserId" TEXT,
ADD COLUMN IF NOT EXISTS "cancellationReason" TEXT,
ADD COLUMN IF NOT EXISTS "refundedAt" TIMESTAMP(3),
ADD COLUMN IF NOT EXISTS "refundRef" TEXT,
ADD COLUMN IF NOT EXISTS "refundAmount" INTEGER;

-- CreateTable
CREATE TABLE IF NOT EXISTS "ReservationLog" (
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
CREATE INDEX IF NOT EXISTS "ReservationLog_reservationId_idx" ON "ReservationLog"("reservationId");

-- AddForeignKey (safe)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ReservationLog_reservationId_fkey') THEN
    ALTER TABLE "ReservationLog" ADD CONSTRAINT "ReservationLog_reservationId_fkey" FOREIGN KEY ("reservationId") REFERENCES "Reservation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

-- AddForeignKey (safe)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ReservationLog_userId_fkey') THEN
    ALTER TABLE "ReservationLog" ADD CONSTRAINT "ReservationLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;
