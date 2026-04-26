DROP INDEX IF EXISTS "Position_userId_symbol_open_key";

CREATE UNIQUE INDEX "Position_userId_walletId_symbol_open_key"
ON "public"."Position"("userId", "walletId", "symbol")
WHERE "status" = 'OPEN' AND "walletId" IS NOT NULL;

CREATE UNIQUE INDEX "Position_userId_botId_symbol_open_key"
ON "public"."Position"("userId", "botId", "symbol")
WHERE "status" = 'OPEN' AND "walletId" IS NULL AND "botId" IS NOT NULL;

CREATE UNIQUE INDEX "Position_userId_symbol_unowned_open_key"
ON "public"."Position"("userId", "symbol")
WHERE "status" = 'OPEN' AND "walletId" IS NULL AND "botId" IS NULL;
