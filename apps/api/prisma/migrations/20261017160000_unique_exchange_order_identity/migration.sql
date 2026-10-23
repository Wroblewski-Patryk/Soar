-- Inspect existing duplicate (userId, exchangeOrderId) rows before deploying.
-- A duplicate aborts migration and requires a reviewed reconciliation; no row is deleted automatically.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM "Order" WHERE "exchangeOrderId" IS NOT NULL
    GROUP BY "userId", "exchangeOrderId" HAVING COUNT(*) > 1
  ) THEN
    RAISE EXCEPTION 'Order identity preflight failed: duplicate userId/exchangeOrderId pairs require reviewed reconciliation';
  END IF;
END $$;
CREATE UNIQUE INDEX "Order_userId_exchangeOrderId_key" ON "Order"("userId", "exchangeOrderId");
