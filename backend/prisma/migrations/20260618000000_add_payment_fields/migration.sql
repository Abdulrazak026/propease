-- AlterEnum
ALTER TYPE "TransactionType" ADD VALUE IF NOT EXISTS 'reservation_deposit';
ALTER TYPE "TransactionType" ADD VALUE IF NOT EXISTS 'property_down_payment';
ALTER TYPE "TransactionType" ADD VALUE IF NOT EXISTS 'property_full_payment';

-- AlterEnum
ALTER TYPE "ReservationStatus" ADD VALUE IF NOT EXISTS 'pending_payment';
ALTER TYPE "ReservationStatus" ADD VALUE IF NOT EXISTS 'cancelled';

-- AlterTable
ALTER TABLE "Listing" ADD COLUMN IF NOT EXISTS "depositAmount" INTEGER,
ADD COLUMN IF NOT EXISTS "reservationDays" INTEGER NOT NULL DEFAULT 2,
ADD COLUMN IF NOT EXISTS "downPaymentPercent" INTEGER NOT NULL DEFAULT 10;

-- AlterTable
ALTER TABLE "Reservation" ADD COLUMN IF NOT EXISTS "paymentRef" TEXT;

-- AlterTable
ALTER TABLE "SoldProperty" ADD COLUMN IF NOT EXISTS "buyerId" TEXT,
ADD COLUMN IF NOT EXISTS "paymentRef" TEXT,
ADD COLUMN IF NOT EXISTS "commissionPaid" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX IF NOT EXISTS "SoldProperty_buyerId_idx" ON "SoldProperty"("buyerId");
