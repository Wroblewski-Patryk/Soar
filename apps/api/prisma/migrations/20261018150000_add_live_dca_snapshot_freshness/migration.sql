ALTER TABLE "public"."Position"
  ADD COLUMN "lastAccountTransactionAt" TIMESTAMP(3),
  ADD COLUMN "lastDcaFillVenueAt" TIMESTAMP(3),
  ADD COLUMN "lastDcaFillTimeUncertain" BOOLEAN NOT NULL DEFAULT false;
