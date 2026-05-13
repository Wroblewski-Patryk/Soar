DROP INDEX IF EXISTS "MarketCandleCache_marketType_symbol_timeframe_openTime_key";
DROP INDEX IF EXISTS "MarketCandleCache_marketType_symbol_timeframe_openTime_idx";
DROP INDEX IF EXISTS "MarketCandleCache_marketType_symbol_timeframe_closeTime_idx";

CREATE UNIQUE INDEX "MarketCandleCache_marketType_source_symbol_timeframe_openTime_key"
ON "MarketCandleCache"("marketType", "source", "symbol", "timeframe", "openTime");

CREATE INDEX "MarketCandleCache_marketType_source_symbol_timeframe_openTime_idx"
ON "MarketCandleCache"("marketType", "source", "symbol", "timeframe", "openTime");

CREATE INDEX "MarketCandleCache_marketType_source_symbol_timeframe_closeTime_idx"
ON "MarketCandleCache"("marketType", "source", "symbol", "timeframe", "closeTime");
