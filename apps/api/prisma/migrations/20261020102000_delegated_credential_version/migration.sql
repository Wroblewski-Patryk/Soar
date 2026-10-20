-- Keep credential identity independent of read telemetry and neutral metadata.
-- Existing claimed markers retain their updatedAt check: their credential
-- generation at claim time cannot be reconstructed safely during upgrade.
BEGIN;

ALTER TABLE "ApiKey"
  ADD COLUMN "credentialVersion" INTEGER NOT NULL DEFAULT 1;

ALTER TABLE "ApiKey"
  ADD CONSTRAINT "ApiKey_credential_version_positive_check"
  CHECK ("credentialVersion" > 0);

CREATE FUNCTION "ApiKey_bump_credential_version"() RETURNS trigger
LANGUAGE plpgsql AS $$
BEGIN
  IF (NEW."apiKey", NEW."apiSecret", NEW."exchange")
      IS DISTINCT FROM (OLD."apiKey", OLD."apiSecret", OLD."exchange") THEN
    NEW."credentialVersion" := OLD."credentialVersion" + 1;
  ELSE
    NEW."credentialVersion" := OLD."credentialVersion";
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER "ApiKey_bump_credential_version_trigger"
BEFORE UPDATE ON "ApiKey" FOR EACH ROW
EXECUTE FUNCTION "ApiKey_bump_credential_version"();

ALTER TABLE "LiveCreateOrderSubmission"
  ADD COLUMN "dispatchApiKeyCredentialVersion" INTEGER;

ALTER TABLE "LiveCreateOrderSubmission"
  DROP CONSTRAINT "LiveCreateOrderSubmission_dispatch_claim_complete_check";

ALTER TABLE "LiveCreateOrderSubmission"
  ADD CONSTRAINT "LiveCreateOrderSubmission_dispatch_claim_complete_check"
  CHECK (
    ("dispatchClaimedAt" IS NULL AND "dispatchBotId" IS NULL
      AND "dispatchCommandHash" IS NULL AND "dispatchIntentHash" IS NULL
      AND "dispatchApiKeyId" IS NULL AND "dispatchApiKeyUpdatedAt" IS NULL
      AND "dispatchApiKeyCredentialVersion" IS NULL)
    OR
    ("grantId" IS NOT NULL AND "reservationId" IS NOT NULL AND "intentId" IS NOT NULL
      AND "exchangeId" IS NOT NULL AND "clientOrderId" IS NOT NULL AND "symbol" IS NOT NULL
      AND "dispatchClaimedAt" IS NOT NULL AND "dispatchBotId" IS NOT NULL
      AND "dispatchCommandHash" IS NOT NULL
      AND "dispatchCommandHash" ~ '^[a-f0-9]{64}$'
      AND "dispatchIntentHash" IS NOT NULL
      AND "dispatchIntentHash" ~ '^[a-f0-9]{64}$'
      AND "dispatchApiKeyId" IS NOT NULL AND "dispatchApiKeyUpdatedAt" IS NOT NULL
      AND ("dispatchApiKeyCredentialVersion" IS NULL
        OR "dispatchApiKeyCredentialVersion" > 0))
  );

COMMIT;
