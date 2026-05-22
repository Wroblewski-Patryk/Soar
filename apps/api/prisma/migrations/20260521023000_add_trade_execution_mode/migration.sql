ALTER TABLE "Trade" ADD COLUMN "executionMode" "BotMode";

CREATE INDEX "Trade_userId_executionMode_executedAt_idx"
ON "Trade"("userId", "executionMode", "executedAt");
