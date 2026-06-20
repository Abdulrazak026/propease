-- AlterTable
ALTER TABLE "Reservation" ADD COLUMN "meetingDate" TIMESTAMP(3),
ADD COLUMN "meetingTime" TEXT,
ADD COLUMN "confirmedById" TEXT;
