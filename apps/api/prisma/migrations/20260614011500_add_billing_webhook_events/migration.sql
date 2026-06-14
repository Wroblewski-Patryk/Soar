-- CreateEnum
CREATE TYPE "BillingWebhookEventStatus" AS ENUM ('PROCESSING', 'PROCESSED', 'FAILED', 'IGNORED');

-- CreateTable
CREATE TABLE "BillingWebhookEvent" (
    "id" TEXT NOT NULL,
    "provider" "PaymentProvider" NOT NULL,
    "eventId" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "status" "BillingWebhookEventStatus" NOT NULL DEFAULT 'PROCESSING',
    "userId" TEXT,
    "subscriptionPlanId" TEXT,
    "paymentIntentId" TEXT,
    "providerReference" TEXT,
    "errorCode" TEXT,
    "metadata" JSONB,
    "receivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processedAt" TIMESTAMP(3),
    "lastAttemptAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BillingWebhookEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BillingWebhookEvent_provider_eventId_key" ON "BillingWebhookEvent"("provider", "eventId");

-- CreateIndex
CREATE INDEX "BillingWebhookEvent_provider_eventType_receivedAt_idx" ON "BillingWebhookEvent"("provider", "eventType", "receivedAt");

-- CreateIndex
CREATE INDEX "BillingWebhookEvent_userId_receivedAt_idx" ON "BillingWebhookEvent"("userId", "receivedAt");

-- CreateIndex
CREATE INDEX "BillingWebhookEvent_paymentIntentId_idx" ON "BillingWebhookEvent"("paymentIntentId");

-- CreateIndex
CREATE INDEX "BillingWebhookEvent_status_receivedAt_idx" ON "BillingWebhookEvent"("status", "receivedAt");
