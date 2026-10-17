-- Existing duplicate fills require reviewed reconciliation before this invariant can be installed.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM "OrderFill"
    GROUP BY "orderId", "exchangeTradeId"
    HAVING COUNT(*) > 1
  ) THEN
    RAISE EXCEPTION 'OrderFill identity preflight failed: duplicate orderId/exchangeTradeId pairs require reviewed reconciliation';
  END IF;
END $$;

CREATE UNIQUE INDEX "OrderFill_orderId_exchangeTradeId_key"
ON "OrderFill"("orderId", "exchangeTradeId");
