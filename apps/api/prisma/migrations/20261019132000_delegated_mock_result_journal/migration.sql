-- Only a delegated marker may hold a complete fixed-mock outcome snapshot.
-- A missing or partial snapshot remains UNKNOWN after restart.
ALTER TABLE "LiveCreateOrderSubmission"
  ADD COLUMN "mockResult" JSONB,
  ADD COLUMN "mockResultHash" TEXT,
  ADD COLUMN "mockResultRecordedAt" TIMESTAMP(3);

ALTER TABLE "LiveCreateOrderSubmission"
  ADD CONSTRAINT "LiveCreateOrderSubmission_mock_result_complete_check"
  CHECK (
    ("mockResult" IS NULL AND "mockResultHash" IS NULL AND "mockResultRecordedAt" IS NULL)
    OR
    ("grantId" IS NOT NULL AND "reservationId" IS NOT NULL AND "intentId" IS NOT NULL
      AND "clientOrderId" IS NOT NULL AND "mockResult" IS NOT NULL
      AND "mockResultHash" IS NOT NULL AND "mockResultHash" ~ '^[a-f0-9]{64}$'
      AND "mockResultRecordedAt" IS NOT NULL)
  );
