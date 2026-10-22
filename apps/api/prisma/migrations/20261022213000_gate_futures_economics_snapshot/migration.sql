ALTER TABLE "Order" ADD COLUMN "gateFuturesEconomics" JSONB;
ALTER TABLE "Position" ADD COLUMN "gateFuturesEconomics" JSONB;
ALTER TABLE "OrderFill" ADD COLUMN "costEvidence" JSONB;
