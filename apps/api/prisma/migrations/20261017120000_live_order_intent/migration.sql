CREATE TABLE "LiveOrderIntent" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "clientOrderId" TEXT NOT NULL,
    "payloadHash" TEXT NOT NULL,
    "exchange" "Exchange" NOT NULL,
    "marketType" "TradeMarket" NOT NULL,
    "symbol" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LiveOrderIntent_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "LiveOrderIntent_clientOrderId_key" ON "LiveOrderIntent"("clientOrderId");
CREATE INDEX "LiveOrderIntent_userId_createdAt_idx" ON "LiveOrderIntent"("userId", "createdAt");
ALTER TABLE "LiveOrderIntent" ADD CONSTRAINT "LiveOrderIntent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
