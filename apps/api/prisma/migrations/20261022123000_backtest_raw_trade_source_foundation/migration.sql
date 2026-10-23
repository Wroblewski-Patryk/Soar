-- Additive 011A foundation. No backtest writer or reader is switched here.
-- Historical intrabar v1-v3 tables and migrations 86/87 remain untouched.
BEGIN;

CREATE TABLE "BacktestRawTradeSourceBlob" (
  "zipSha256" TEXT NOT NULL,
  "sourceType" TEXT NOT NULL,
  "symbol" TEXT NOT NULL,
  "day" TEXT NOT NULL,
  "sourceUrl" TEXT NOT NULL,
  "zipBytes" BYTEA NOT NULL,
  "checksumBytes" BYTEA NOT NULL,
  "csvBytes" INTEGER NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "BacktestRawTradeSourceBlob_pkey" PRIMARY KEY ("zipSha256"),
  CONSTRAINT "BacktestRawTradeSourceBlob_source_check"
    CHECK ("sourceType" = 'BINANCE_USDM_TRADES_DAILY'),
  CONSTRAINT "BacktestRawTradeSourceBlob_symbol_check"
    CHECK ("symbol" ~ '^[A-Z0-9]{4,24}$'),
  CONSTRAINT "BacktestRawTradeSourceBlob_day_check"
    CHECK ("day" ~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}$'),
  CONSTRAINT "BacktestRawTradeSourceBlob_sha_check"
    CHECK ("zipSha256" ~ '^[0-9a-f]{64}$'),
  CONSTRAINT "BacktestRawTradeSourceBlob_bytes_check"
    CHECK (octet_length("zipBytes") > 0 AND
      octet_length("checksumBytes") BETWEEN 1 AND 256 AND "csvBytes" > 0)
);

CREATE UNIQUE INDEX "BacktestRawTradeSourceBlob_zipSha256_symbol_day_key"
  ON "BacktestRawTradeSourceBlob"("zipSha256", "symbol", "day");

CREATE TABLE "BacktestRawTradeSourceRef" (
  "runId" TEXT NOT NULL,
  "symbol" TEXT NOT NULL,
  "day" TEXT NOT NULL,
  "zipSha256" TEXT NOT NULL,
  "windowStartMs" BIGINT NOT NULL,
  "windowEndMs" BIGINT NOT NULL,
  "candles" JSONB NOT NULL,
  "candlesSha256" TEXT NOT NULL,
  "tapeSha256" TEXT NOT NULL,
  "selectedTradeCount" INTEGER NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "BacktestRawTradeSourceRef_pkey" PRIMARY KEY ("runId", "symbol", "day"),
  CONSTRAINT "BacktestRawTradeSourceRef_window_check"
    CHECK ("windowStartMs" < "windowEndMs" AND "selectedTradeCount" > 0),
  CONSTRAINT "BacktestRawTradeSourceRef_hash_check"
    CHECK ("candlesSha256" ~ '^[0-9a-f]{64}$' AND "tapeSha256" ~ '^[0-9a-f]{64}$')
);

ALTER TABLE "BacktestRawTradeSourceRef"
  ADD CONSTRAINT "BacktestRawTradeSourceRef_runId_fkey"
  FOREIGN KEY ("runId") REFERENCES "BacktestRun"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "BacktestRawTradeSourceRef"
  ADD CONSTRAINT "BacktestRawTradeSourceRef_zipSha256_symbol_day_fkey"
  FOREIGN KEY ("zipSha256", "symbol", "day")
  REFERENCES "BacktestRawTradeSourceBlob"("zipSha256", "symbol", "day")
  ON DELETE RESTRICT ON UPDATE RESTRICT;

CREATE FUNCTION backtest_raw_trade_source_reject_update()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  RAISE EXCEPTION 'raw trade source is immutable' USING ERRCODE = '23514';
END;
$$;

CREATE TRIGGER "BacktestRawTradeSourceBlob_immutable"
  BEFORE UPDATE ON "BacktestRawTradeSourceBlob"
  FOR EACH ROW EXECUTE FUNCTION backtest_raw_trade_source_reject_update();

CREATE TRIGGER "BacktestRawTradeSourceRef_immutable"
  BEFORE UPDATE ON "BacktestRawTradeSourceRef"
  FOR EACH ROW EXECUTE FUNCTION backtest_raw_trade_source_reject_update();

COMMIT;
