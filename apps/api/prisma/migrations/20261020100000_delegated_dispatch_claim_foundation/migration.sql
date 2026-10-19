-- A claim is a durable one-shot record, not permission to call the venue.
-- Existing admission and mock markers have all claim fields NULL.
ALTER TABLE "LiveCreateOrderSubmission"
  ADD COLUMN "dispatchClaimedAt" TIMESTAMP(3),
  ADD COLUMN "dispatchBotId" TEXT,
  ADD COLUMN "dispatchCommandHash" TEXT,
  ADD COLUMN "dispatchIntentHash" TEXT,
  ADD COLUMN "dispatchApiKeyId" TEXT,
  ADD COLUMN "dispatchApiKeyUpdatedAt" TIMESTAMP(3);

ALTER TABLE "LiveCreateOrderSubmission"
  ADD CONSTRAINT "LiveCreateOrderSubmission_dispatch_claim_complete_check"
  CHECK (
    ("dispatchClaimedAt" IS NULL AND "dispatchBotId" IS NULL
      AND "dispatchCommandHash" IS NULL AND "dispatchIntentHash" IS NULL
      AND "dispatchApiKeyId" IS NULL AND "dispatchApiKeyUpdatedAt" IS NULL)
    OR
    ("grantId" IS NOT NULL AND "reservationId" IS NOT NULL AND "intentId" IS NOT NULL
      AND "exchangeId" IS NOT NULL AND "clientOrderId" IS NOT NULL AND "symbol" IS NOT NULL
      AND "dispatchClaimedAt" IS NOT NULL AND "dispatchBotId" IS NOT NULL
      AND "dispatchCommandHash" IS NOT NULL
      AND "dispatchCommandHash" ~ '^[a-f0-9]{64}$'
      AND "dispatchIntentHash" IS NOT NULL
      AND "dispatchIntentHash" ~ '^[a-f0-9]{64}$'
      AND "dispatchApiKeyId" IS NOT NULL AND "dispatchApiKeyUpdatedAt" IS NOT NULL)
  );
