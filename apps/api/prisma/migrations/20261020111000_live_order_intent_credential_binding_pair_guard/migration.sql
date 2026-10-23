-- A CHECK accepts UNKNOWN, so the prior expression allowed an ID with a NULL
-- version. Fail clearly on existing partial rows; the replacement CHECK also
-- validates every row during upgrade and rolls back atomically on any race.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM "LiveOrderIntent"
    WHERE ("apiKeyId" IS NULL) <> ("apiKeyCredentialVersion" IS NULL)
  ) THEN
    RAISE EXCEPTION 'LiveOrderIntent has partial credential bindings; reconcile before migration';
  END IF;
END;
$$ LANGUAGE plpgsql;

BEGIN;

ALTER TABLE "LiveOrderIntent"
  DROP CONSTRAINT "LiveOrderIntent_credential_binding_pair_check";

ALTER TABLE "LiveOrderIntent"
  ADD CONSTRAINT "LiveOrderIntent_credential_binding_pair_check"
  CHECK (
    ("apiKeyId" IS NULL AND "apiKeyCredentialVersion" IS NULL)
    OR ("apiKeyId" IS NOT NULL AND "apiKeyCredentialVersion" IS NOT NULL
      AND "apiKeyCredentialVersion" > 0)
  );

COMMIT;
