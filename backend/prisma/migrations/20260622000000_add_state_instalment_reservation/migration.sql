-- Add state field to Listing
ALTER TABLE "Listing" ADD COLUMN IF NOT EXISTS "state" TEXT NOT NULL DEFAULT 'Kano';

-- Add instalment fields to Listing
ALTER TABLE "Listing" ADD COLUMN IF NOT EXISTS "instalmentAvailable" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Listing" ADD COLUMN IF NOT EXISTS "instalmentMonths" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "Listing" ADD COLUMN IF NOT EXISTS "instalmentCommission" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- Add reservation count to Listing
ALTER TABLE "Listing" ADD COLUMN IF NOT EXISTS "reservationCount" INTEGER NOT NULL DEFAULT 0;

-- Index on state for filtering
CREATE INDEX IF NOT EXISTS "Listing_state_idx" ON "Listing"("state");

-- Make holdingDeposit default to 0 for free reservations
ALTER TABLE "Reservation" ALTER COLUMN "holdingDeposit" SET DEFAULT 0;
