-- AlterEnum
ALTER TYPE "TransactionType" ADD VALUE IF NOT EXISTS 'reservation_deposit';
ALTER TYPE "TransactionType" ADD VALUE IF NOT EXISTS 'property_down_payment';
ALTER TYPE "TransactionType" ADD VALUE IF NOT EXISTS 'property_full_payment';

-- AlterEnum
ALTER TYPE "ReservationStatus" ADD VALUE IF NOT EXISTS 'pending_payment';
ALTER TYPE "ReservationStatus" ADD VALUE IF NOT EXISTS 'cancelled';

-- AlterTable
ALTER TABLE "Listing" ADD COLUMN "depositAmount" INTEGER,
ADD COLUMN "reservationDays" INTEGER NOT NULL DEFAULT 2,
ADD COLUMN "downPaymentPercent" INTEGER NOT NULL DEFAULT 10;

-- AlterTable
ALTER TABLE "Reservation" ADD COLUMN "paymentRef" TEXT;

-- AlterTable
ALTER TABLE "SoldProperty" ADD COLUMN "buyerId" TEXT,
ADD COLUMN "paymentRef" TEXT,
ADD COLUMN "commissionPaid" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "SoldProperty_buyerId_idx" ON "SoldProperty"("buyerId");
