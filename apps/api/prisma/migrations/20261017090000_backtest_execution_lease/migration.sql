ALTER TABLE "BacktestRun"
  ADD COLUMN "executionToken" TEXT,
  ADD COLUMN "executionLeaseExpiresAt" TIMESTAMP(3);

CREATE INDEX "BacktestRun_status_executionLeaseExpiresAt_idx"
  ON "BacktestRun"("status", "executionLeaseExpiresAt");
