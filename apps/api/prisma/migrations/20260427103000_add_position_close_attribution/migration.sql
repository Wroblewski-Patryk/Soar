CREATE TYPE "public"."PositionCloseReason" AS ENUM (
  'TP',
  'TTP',
  'SL',
  'TSL',
  'LIQUIDATION',
  'ACCOUNT_FLOOR',
  'MANUAL',
  'SIGNAL_EXIT',
  'POSITION_LIFETIME',
  'EXTERNAL_SYNC_MISSING',
  'SYSTEM_REPAIR'
);

CREATE TYPE "public"."PositionCloseInitiator" AS ENUM (
  'BOT_APP',
  'USER_APP',
  'USER_EXCHANGE',
  'EXCHANGE',
  'SYSTEM_REPAIR'
);

ALTER TABLE "public"."Position"
ADD COLUMN "closeReason" "public"."PositionCloseReason",
ADD COLUMN "closeInitiator" "public"."PositionCloseInitiator";

ALTER TABLE "public"."Order"
ADD COLUMN "closeReason" "public"."PositionCloseReason",
ADD COLUMN "closeInitiator" "public"."PositionCloseInitiator";

ALTER TABLE "public"."Trade"
ADD COLUMN "closeReason" "public"."PositionCloseReason",
ADD COLUMN "closeInitiator" "public"."PositionCloseInitiator";
