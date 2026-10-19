CREATE TABLE "LiveCreateOrderSubmission" (
  "id" TEXT NOT NULL,
  "exchangeId" TEXT,
  "clientOrderId" TEXT,
  "symbol" TEXT,
  "marketType" TEXT NOT NULL,
  "reduceOnly" BOOLEAN NOT NULL,
  "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "LiveCreateOrderSubmission_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "LiveCreateOrderSubmission_startedAt_idx"
  ON "LiveCreateOrderSubmission"("startedAt");
