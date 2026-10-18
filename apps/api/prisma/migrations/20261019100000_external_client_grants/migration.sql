-- Additive preflight: refuse to reuse a partially provisioned grant table.
DO $$ BEGIN
  IF to_regclass('public."ExternalClientGrant"') IS NOT NULL THEN
    RAISE EXCEPTION 'ExternalClientGrant already exists; inspect schema before applying migration';
  END IF;
END $$;

CREATE TYPE "ExternalClientAction" AS ENUM ('PLACE_LIVE_ORDER');

CREATE TABLE "ExternalClientGrant" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "botId" TEXT NOT NULL,
  "secretHash" TEXT NOT NULL,
  "exchange" "Exchange" NOT NULL,
  "marketType" "TradeMarket" NOT NULL,
  "symbol" TEXT NOT NULL,
  "action" "ExternalClientAction" NOT NULL,
  "maxActionQuoteAmount" DECIMAL(20,8) NOT NULL,
  "maxTotalQuoteAmount" DECIMAL(20,8) NOT NULL,
  "usedQuoteAmount" DECIMAL(20,8) NOT NULL DEFAULT 0,
  "maxActions" INTEGER NOT NULL,
  "usedActions" INTEGER NOT NULL DEFAULT 0,
  "expiresAt" TIMESTAMP(3) NOT NULL,
  "revokedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ExternalClientGrant_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "ExternalClientGrant_amounts_check" CHECK (
    "maxActionQuoteAmount" > 0 AND "maxTotalQuoteAmount" >= "maxActionQuoteAmount"
    AND "usedQuoteAmount" >= 0 AND "usedQuoteAmount" <= "maxTotalQuoteAmount"
  ),
  CONSTRAINT "ExternalClientGrant_counts_check" CHECK (
    "maxActions" > 0 AND "usedActions" >= 0 AND "usedActions" <= "maxActions"
  ),
  CONSTRAINT "ExternalClientGrant_symbol_check" CHECK (
    "symbol" ~ '^[A-Z0-9]{5,30}$'
  )
);

CREATE UNIQUE INDEX "ExternalClientGrant_secretHash_key" ON "ExternalClientGrant"("secretHash");
CREATE INDEX "ExternalClientGrant_userId_createdAt_idx" ON "ExternalClientGrant"("userId", "createdAt");
CREATE INDEX "ExternalClientGrant_botId_idx" ON "ExternalClientGrant"("botId");
CREATE INDEX "ExternalClientGrant_expiresAt_idx" ON "ExternalClientGrant"("expiresAt");
ALTER TABLE "ExternalClientGrant" ADD CONSTRAINT "ExternalClientGrant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ExternalClientGrant" ADD CONSTRAINT "ExternalClientGrant_botId_fkey" FOREIGN KEY ("botId") REFERENCES "Bot"("id") ON DELETE CASCADE ON UPDATE CASCADE;
