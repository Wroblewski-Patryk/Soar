CREATE TYPE "public"."BacktestContributionKind" AS ENUM ('ENTRY', 'DCA');

CREATE TABLE "public"."BacktestContribution" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "backtestRunId" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "side" "public"."PositionSide" NOT NULL,
    "tradeSequence" INTEGER NOT NULL,
    "addSequence" INTEGER NOT NULL,
    "kind" "public"."BacktestContributionKind" NOT NULL,
    "levelIndex" INTEGER,
    "triggerPercent" DOUBLE PRECISION,
    "multiplier" DOUBLE PRECISION,
    "price" DOUBLE PRECISION NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "contributionUsdt" DOUBLE PRECISION NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "candleIndex" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "BacktestContribution_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "BacktestContribution_backtestRunId_symbol_tradeSequence_addSequence_key"
    ON "public"."BacktestContribution"("backtestRunId", "symbol", "tradeSequence", "addSequence");
CREATE INDEX "BacktestContribution_userId_backtestRunId_timestamp_idx"
    ON "public"."BacktestContribution"("userId", "backtestRunId", "timestamp");

ALTER TABLE "public"."BacktestContribution"
    ADD CONSTRAINT "BacktestContribution_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "public"."BacktestContribution"
    ADD CONSTRAINT "BacktestContribution_backtestRunId_fkey"
    FOREIGN KEY ("backtestRunId") REFERENCES "public"."BacktestRun"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
