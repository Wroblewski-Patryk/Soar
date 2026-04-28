CREATE TYPE "public"."PositionContinuityState" AS ENUM (
  'CONFIRMED',
  'RECOVERING',
  'RECOVERED_UNACTIONABLE',
  'EXTERNAL_CLOSE_CONFIRMED',
  'REPAIR_ONLY_CLEANUP'
);

ALTER TABLE "public"."Position"
ADD COLUMN "continuityState" "public"."PositionContinuityState" NOT NULL DEFAULT 'CONFIRMED',
ADD COLUMN "lastExchangeSeenAt" TIMESTAMP(3),
ADD COLUMN "lastExchangeSyncAt" TIMESTAMP(3),
ADD COLUMN "missingSince" TIMESTAMP(3),
ADD COLUMN "missingSyncCount" INTEGER NOT NULL DEFAULT 0;
