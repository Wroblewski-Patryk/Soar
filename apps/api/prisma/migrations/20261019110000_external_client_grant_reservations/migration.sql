-- Additive preflight: an unexpected partial table must be reviewed first.
DO $$ BEGIN
  IF to_regclass('public."ExternalClientGrantReservation"') IS NOT NULL THEN
    RAISE EXCEPTION 'ExternalClientGrantReservation already exists; inspect schema before applying migration';
  END IF;
END $$;

CREATE TYPE "ExternalClientReservationState" AS ENUM
  ('RESERVED', 'SUBMISSION_UNCERTAIN', 'SUBMITTED', 'NOT_SUBMITTED');

CREATE TABLE "ExternalClientGrantReservation" (
  "id" TEXT NOT NULL,
  "grantId" TEXT NOT NULL,
  "clientOrderId" TEXT NOT NULL,
  "commandHash" TEXT NOT NULL,
  "command" JSONB NOT NULL,
  "quoteAmount" DECIMAL(20,8) NOT NULL,
  "state" "ExternalClientReservationState" NOT NULL DEFAULT 'RESERVED',
  "dispatchStartedAt" TIMESTAMP(3),
  "resolvedAt" TIMESTAMP(3),
  "proofType" TEXT,
  "proofRef" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ExternalClientGrantReservation_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "ExternalClientGrantReservation_amount_check" CHECK ("quoteAmount" > 0),
  CONSTRAINT "ExternalClientGrantReservation_hash_check" CHECK ("commandHash" ~ '^[a-f0-9]{64}$'),
  CONSTRAINT "ExternalClientGrantReservation_clientId_check" CHECK ("clientOrderId" ~ '^[A-Za-z0-9_-]{1,36}$'),
  CONSTRAINT "ExternalClientGrantReservation_state_check" CHECK (
    ("state" = 'RESERVED' AND "dispatchStartedAt" IS NULL AND "resolvedAt" IS NULL AND "proofType" IS NULL)
    OR ("state" = 'SUBMISSION_UNCERTAIN' AND "dispatchStartedAt" IS NOT NULL AND "resolvedAt" IS NULL AND "proofType" IS NULL)
    OR ("state" = 'SUBMITTED' AND "dispatchStartedAt" IS NOT NULL AND "resolvedAt" IS NOT NULL AND "proofType" = 'DURABLE_ORDER')
    OR ("state" = 'NOT_SUBMITTED' AND "dispatchStartedAt" IS NULL AND "resolvedAt" IS NOT NULL AND "proofType" = 'LOCAL_PRE_DISPATCH_ABORT')
  )
);

CREATE UNIQUE INDEX "ExternalClientGrantReservation_clientOrderId_key"
  ON "ExternalClientGrantReservation"("clientOrderId");
CREATE INDEX "ExternalClientGrantReservation_grantId_state_idx"
  ON "ExternalClientGrantReservation"("grantId", "state");
CREATE INDEX "ExternalClientGrantReservation_grantId_createdAt_idx"
  ON "ExternalClientGrantReservation"("grantId", "createdAt");
CREATE UNIQUE INDEX "ExternalClientGrantReservation_one_unresolved_per_grant_idx"
  ON "ExternalClientGrantReservation"("grantId")
  WHERE "state" IN ('RESERVED', 'SUBMISSION_UNCERTAIN');
ALTER TABLE "ExternalClientGrantReservation" ADD CONSTRAINT "ExternalClientGrantReservation_grantId_fkey"
  FOREIGN KEY ("grantId") REFERENCES "ExternalClientGrant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
