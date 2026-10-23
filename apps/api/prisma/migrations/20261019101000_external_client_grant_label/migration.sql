-- Additive preflight: this column must not already exist on a partially changed table.
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'ExternalClientGrant' AND column_name = 'clientLabel'
  ) THEN
    RAISE EXCEPTION 'ExternalClientGrant.clientLabel already exists; inspect schema before applying migration';
  END IF;
END $$;

ALTER TABLE "ExternalClientGrant" ADD COLUMN "clientLabel" TEXT NOT NULL;
ALTER TABLE "ExternalClientGrant" ADD CONSTRAINT "ExternalClientGrant_clientLabel_check"
  CHECK (length(trim("clientLabel")) BETWEEN 1 AND 100);
