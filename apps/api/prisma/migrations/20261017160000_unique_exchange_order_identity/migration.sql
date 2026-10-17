-- Inspect existing duplicate (userId, exchangeOrderId) rows before deploying.
-- A duplicate aborts migration and requires a reviewed reconciliation; no row is deleted automatically.
CREATE UNIQUE INDEX "Order_userId_exchangeOrderId_key" ON "Order"("userId", "exchangeOrderId");
