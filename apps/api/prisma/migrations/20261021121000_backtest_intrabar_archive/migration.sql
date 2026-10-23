CREATE TABLE "BacktestIntrabarArchive" (
    "runId" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "payloadSha256" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BacktestIntrabarArchive_pkey" PRIMARY KEY ("runId","symbol")
);

ALTER TABLE "BacktestIntrabarArchive" ADD CONSTRAINT "BacktestIntrabarArchive_runId_fkey"
  FOREIGN KEY ("runId") REFERENCES "BacktestRun"("id") ON DELETE CASCADE ON UPDATE CASCADE;
