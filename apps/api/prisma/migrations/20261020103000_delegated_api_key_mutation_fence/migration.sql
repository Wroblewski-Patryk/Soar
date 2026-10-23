-- Bound credentials must not silently change between intent binding and claim.
-- Legacy reservations remain nullable; a new claim without a bound version
-- fails closed. Existing claimed markers remain valid and fenced by key ID.
BEGIN;

ALTER TABLE "ExternalClientGrantReservation"
  ADD COLUMN "boundApiKeyId" TEXT,
  ADD COLUMN "boundApiKeyCredentialVersion" INTEGER;

ALTER TABLE "ExternalClientGrantReservation"
  ADD CONSTRAINT "ExternalClientGrantReservation_bound_key_pair_check"
  CHECK (("boundApiKeyId" IS NULL AND "boundApiKeyCredentialVersion" IS NULL)
    OR ("boundApiKeyId" IS NOT NULL AND "boundApiKeyCredentialVersion" > 0));

CREATE INDEX "LiveCreateOrderSubmission_dispatchApiKeyId_idx"
  ON "LiveCreateOrderSubmission"("dispatchApiKeyId");

-- The UPDATE/DELETE row lock serializes with the claim's ApiKey FOR SHARE.
-- A VOLATILE trigger query observes the committed marker after any lock wait.
-- The fence also blocks mutation inside the transaction that creates or
-- updates a marker. This prevents a prior marker UPDATE from evading it.
CREATE FUNCTION "ApiKey_reject_claimed_credential_mutation"() RETURNS trigger
LANGUAGE plpgsql VOLATILE AS $$
BEGIN
  IF TG_OP = 'UPDATE' AND
      (NEW."apiKey", NEW."apiSecret", NEW."exchange", NEW."userId")
        IS NOT DISTINCT FROM
      (OLD."apiKey", OLD."apiSecret", OLD."exchange", OLD."userId") THEN
    RETURN NEW;
  END IF;

  IF EXISTS (
    SELECT 1 FROM "LiveCreateOrderSubmission" marker
    WHERE marker."dispatchApiKeyId" = OLD."id"
      AND marker."dispatchClaimedAt" IS NOT NULL
  ) THEN
    RAISE EXCEPTION USING ERRCODE = '23514',
      CONSTRAINT = 'ApiKey_delegated_claim_mutation_fence',
      MESSAGE = 'Selected API key has a delegated submission in flight or unresolved';
  END IF;

  IF TG_OP = 'DELETE' THEN RETURN OLD; END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER "ApiKey_reject_claimed_credential_mutation_trigger"
BEFORE UPDATE OR DELETE ON "ApiKey" FOR EACH ROW
EXECUTE FUNCTION "ApiKey_reject_claimed_credential_mutation"();

COMMIT;
