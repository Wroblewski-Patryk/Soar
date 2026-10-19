-- Repair the original claim CHECK without changing its applied migration.
-- Hold writers while inspecting existing rows and replacing the constraint.
BEGIN;
LOCK TABLE "LiveCreateOrderSubmission" IN ACCESS EXCLUSIVE MODE;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM "LiveCreateOrderSubmission"
    WHERE (
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
    ) IS NOT TRUE
  ) THEN
    RAISE EXCEPTION USING ERRCODE = '23514',
      MESSAGE = 'Delegated dispatch claim requires manual review before constraint repair';
  END IF;
END $$;

ALTER TABLE "LiveCreateOrderSubmission"
  DROP CONSTRAINT "LiveCreateOrderSubmission_dispatch_claim_complete_check";
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
COMMIT;
