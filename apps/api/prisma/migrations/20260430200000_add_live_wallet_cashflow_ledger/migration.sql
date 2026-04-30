-- CreateEnum
CREATE TYPE "WalletBalanceSnapshotSource" AS ENUM ('EXCHANGE_BALANCE', 'MANUAL_REPAIR');

-- CreateEnum
CREATE TYPE "WalletCashflowDirection" AS ENUM ('IN', 'OUT', 'NEUTRAL');

-- CreateEnum
CREATE TYPE "WalletCashflowSource" AS ENUM ('INITIAL_BALANCE', 'DEPOSIT', 'WITHDRAWAL', 'TRANSFER_IN', 'TRANSFER_OUT', 'BOT_REALIZED_PNL', 'BOT_OPEN_PNL_SNAPSHOT', 'FEE', 'FUNDING', 'UNKNOWN_EXTERNAL_ADJUSTMENT');

-- CreateTable
CREATE TABLE "WalletBalanceSnapshot" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "walletId" TEXT NOT NULL,
    "exchange" "Exchange" NOT NULL,
    "marketType" "TradeMarket" NOT NULL,
    "baseCurrency" TEXT NOT NULL,
    "accountBalance" DOUBLE PRECISION NOT NULL,
    "freeBalance" DOUBLE PRECISION NOT NULL,
    "allocatedBalance" DOUBLE PRECISION NOT NULL,
    "allocationMode" "WalletAllocationMode",
    "allocationValue" DOUBLE PRECISION,
    "fetchedAt" TIMESTAMP(3) NOT NULL,
    "source" "WalletBalanceSnapshotSource" NOT NULL DEFAULT 'EXCHANGE_BALANCE',
    "externalRef" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WalletBalanceSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WalletCashflowEvent" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "walletId" TEXT NOT NULL,
    "direction" "WalletCashflowDirection" NOT NULL,
    "source" "WalletCashflowSource" NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL,
    "occurredAt" TIMESTAMP(3) NOT NULL,
    "exchangeEventId" TEXT,
    "balanceSnapshotId" TEXT,
    "orderId" TEXT,
    "tradeId" TEXT,
    "positionId" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WalletCashflowEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "WalletBalanceSnapshot_userId_idx" ON "WalletBalanceSnapshot"("userId");

-- CreateIndex
CREATE INDEX "WalletBalanceSnapshot_walletId_fetchedAt_idx" ON "WalletBalanceSnapshot"("walletId", "fetchedAt");

-- CreateIndex
CREATE INDEX "WalletBalanceSnapshot_userId_walletId_fetchedAt_idx" ON "WalletBalanceSnapshot"("userId", "walletId", "fetchedAt");

-- CreateIndex
CREATE INDEX "WalletBalanceSnapshot_exchange_marketType_baseCurrency_fetchedAt_idx" ON "WalletBalanceSnapshot"("exchange", "marketType", "baseCurrency", "fetchedAt");

-- CreateIndex
CREATE UNIQUE INDEX "WalletCashflowEvent_walletId_exchangeEventId_source_key" ON "WalletCashflowEvent"("walletId", "exchangeEventId", "source");

-- CreateIndex
CREATE INDEX "WalletCashflowEvent_userId_idx" ON "WalletCashflowEvent"("userId");

-- CreateIndex
CREATE INDEX "WalletCashflowEvent_walletId_occurredAt_idx" ON "WalletCashflowEvent"("walletId", "occurredAt");

-- CreateIndex
CREATE INDEX "WalletCashflowEvent_userId_walletId_occurredAt_idx" ON "WalletCashflowEvent"("userId", "walletId", "occurredAt");

-- CreateIndex
CREATE INDEX "WalletCashflowEvent_source_occurredAt_idx" ON "WalletCashflowEvent"("source", "occurredAt");

-- CreateIndex
CREATE INDEX "WalletCashflowEvent_direction_occurredAt_idx" ON "WalletCashflowEvent"("direction", "occurredAt");

-- CreateIndex
CREATE INDEX "WalletCashflowEvent_balanceSnapshotId_idx" ON "WalletCashflowEvent"("balanceSnapshotId");

-- CreateIndex
CREATE INDEX "WalletCashflowEvent_orderId_idx" ON "WalletCashflowEvent"("orderId");

-- CreateIndex
CREATE INDEX "WalletCashflowEvent_tradeId_idx" ON "WalletCashflowEvent"("tradeId");

-- CreateIndex
CREATE INDEX "WalletCashflowEvent_positionId_idx" ON "WalletCashflowEvent"("positionId");

-- AddForeignKey
ALTER TABLE "WalletBalanceSnapshot" ADD CONSTRAINT "WalletBalanceSnapshot_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WalletBalanceSnapshot" ADD CONSTRAINT "WalletBalanceSnapshot_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "Wallet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WalletCashflowEvent" ADD CONSTRAINT "WalletCashflowEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WalletCashflowEvent" ADD CONSTRAINT "WalletCashflowEvent_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "Wallet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WalletCashflowEvent" ADD CONSTRAINT "WalletCashflowEvent_balanceSnapshotId_fkey" FOREIGN KEY ("balanceSnapshotId") REFERENCES "WalletBalanceSnapshot"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WalletCashflowEvent" ADD CONSTRAINT "WalletCashflowEvent_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WalletCashflowEvent" ADD CONSTRAINT "WalletCashflowEvent_tradeId_fkey" FOREIGN KEY ("tradeId") REFERENCES "Trade"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WalletCashflowEvent" ADD CONSTRAINT "WalletCashflowEvent_positionId_fkey" FOREIGN KEY ("positionId") REFERENCES "Position"("id") ON DELETE SET NULL ON UPDATE CASCADE;
