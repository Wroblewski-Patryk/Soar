-- Repair for databases that applied the original non-transactional migration 86.
-- Also idempotent after the corrected migration 86. Quiesce writers first if
-- catalog inspection finds the old partial state with no CHECK.
BEGIN;
LOCK TABLE "BacktestIntrabarArchiveRaw" IN ACCESS EXCLUSIVE MODE;

ALTER TABLE "BacktestIntrabarArchiveRaw"
  DROP CONSTRAINT IF EXISTS "BacktestIntrabarArchiveRaw_zip_size_check";
ALTER TABLE "BacktestIntrabarArchiveRaw"
  ADD CONSTRAINT "BacktestIntrabarArchiveRaw_zip_size_check"
  CHECK (octet_length("zipBytes") BETWEEN 1 AND 16777216) NOT VALID;

CREATE OR REPLACE FUNCTION backtest_intrabar_raw_capacity_guard()
RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE
  existing_count bigint;
  existing_bytes bigint;
BEGIN
  -- Serialize all changes to one run/symbol, including two concurrent inserts.
  -- UPDATE changes the parent tuple version so older RR snapshots fail closed.
  UPDATE "BacktestIntrabarArchive"
    SET "createdAt" = "createdAt"
    WHERE "runId" = NEW."runId" AND "symbol" = NEW."symbol";
  IF NOT FOUND THEN
    RAISE EXCEPTION 'intrabar raw parent unavailable' USING ERRCODE = '23503';
  END IF;

  IF TG_OP = 'UPDATE' THEN
    SELECT count(*), coalesce(sum(octet_length("zipBytes")), 0)
      INTO existing_count, existing_bytes
      FROM "BacktestIntrabarArchiveRaw"
      WHERE "runId" = NEW."runId" AND "symbol" = NEW."symbol"
        AND ("runId", "symbol", "day") <>
          (OLD."runId", OLD."symbol", OLD."day");
  ELSE
    SELECT count(*), coalesce(sum(octet_length("zipBytes")), 0)
      INTO existing_count, existing_bytes
      FROM "BacktestIntrabarArchiveRaw"
      WHERE "runId" = NEW."runId" AND "symbol" = NEW."symbol";
  END IF;

  IF existing_count >= 2 OR existing_bytes + octet_length(NEW."zipBytes") > 16777216 THEN
    RAISE EXCEPTION 'intrabar raw archive capacity exceeded' USING ERRCODE = '23514';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS "BacktestIntrabarArchiveRaw_capacity_guard" ON "BacktestIntrabarArchiveRaw";
CREATE TRIGGER "BacktestIntrabarArchiveRaw_capacity_guard"
  BEFORE INSERT OR UPDATE ON "BacktestIntrabarArchiveRaw"
  FOR EACH ROW EXECUTE FUNCTION backtest_intrabar_raw_capacity_guard();
COMMIT;

-- NOT VALID still protects new writes. Historical invalid rows remain
-- available for operator inventory if either check below stops the migration.
ALTER TABLE "BacktestIntrabarArchiveRaw"
  VALIDATE CONSTRAINT "BacktestIntrabarArchiveRaw_zip_size_check";
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM "BacktestIntrabarArchiveRaw"
    GROUP BY "runId", "symbol"
    HAVING count(*) > 2 OR sum(octet_length("zipBytes")) > 16777216
  ) THEN
    RAISE EXCEPTION 'existing intrabar raw archive capacity violation; operator review required'
      USING ERRCODE = '23514';
  END IF;
END;
$$;
