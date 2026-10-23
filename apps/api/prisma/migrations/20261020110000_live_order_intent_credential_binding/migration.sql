BEGIN;

ALTER TABLE "LiveOrderIntent"
  ADD COLUMN "apiKeyId" TEXT,
  ADD COLUMN "apiKeyCredentialVersion" INTEGER;

ALTER TABLE "LiveOrderIntent"
  ADD CONSTRAINT "LiveOrderIntent_credential_binding_pair_check"
  CHECK (
    ("apiKeyId" IS NULL AND "apiKeyCredentialVersion" IS NULL)
    OR ("apiKeyId" IS NOT NULL AND "apiKeyCredentialVersion" > 0)
  );

CREATE OR REPLACE FUNCTION prevent_live_order_intent_credential_binding_update()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW."apiKeyId" IS DISTINCT FROM OLD."apiKeyId"
     OR NEW."apiKeyCredentialVersion" IS DISTINCT FROM OLD."apiKeyCredentialVersion" THEN
    RAISE EXCEPTION 'LiveOrderIntent credential binding is immutable';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER "LiveOrderIntent_credential_binding_immutable"
BEFORE UPDATE ON "LiveOrderIntent"
FOR EACH ROW EXECUTE FUNCTION prevent_live_order_intent_credential_binding_update();

COMMIT;
