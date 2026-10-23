ALTER TABLE "public"."Position"
ADD COLUMN "lastAccountSeenAt" TIMESTAMP(3),
ADD COLUMN "lastAccountQuantity" DOUBLE PRECISION,
ADD COLUMN "lastAccountEntryPrice" DOUBLE PRECISION;
