-- Some deployed databases still contain the legacy execution-environment
-- column even though it is no longer part of the Prisma model. Keep inserts
-- from the current application compatible without dropping historical data.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'ApiKey'
      AND column_name = 'environment'
  ) THEN
    EXECUTE 'ALTER TABLE "ApiKey" ALTER COLUMN "environment" SET DEFAULT ''PRODUCTION''::"ExchangeExecutionEnvironment"';
  END IF;
END $$;
