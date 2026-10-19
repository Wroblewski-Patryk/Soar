-- Add a read-only grant without changing order grants or their allowance checks.
DO $$ BEGIN
  IF to_regclass('public."ExternalClientReadGrant"') IS NOT NULL THEN
    RAISE EXCEPTION 'ExternalClientReadGrant already exists; inspect schema before applying migration';
  END IF;
END $$;

CREATE TYPE "ExternalClientReadAction" AS ENUM ('READ_BOT_STATUS');

CREATE TABLE "ExternalClientReadGrant" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "botId" TEXT NOT NULL,
  "clientLabel" TEXT NOT NULL,
  "secretHash" TEXT NOT NULL,
  "action" "ExternalClientReadAction" NOT NULL,
  "expiresAt" TIMESTAMP(3) NOT NULL,
  "revokedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ExternalClientReadGrant_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "ExternalClientReadGrant_clientLabel_check"
    CHECK (length(trim("clientLabel")) BETWEEN 1 AND 100),
  CONSTRAINT "ExternalClientReadGrant_secretHash_check"
    CHECK ("secretHash" ~ '^[a-f0-9]{64}$')
);

CREATE UNIQUE INDEX "ExternalClientReadGrant_secretHash_key" ON "ExternalClientReadGrant"("secretHash");
CREATE INDEX "ExternalClientReadGrant_userId_createdAt_idx" ON "ExternalClientReadGrant"("userId", "createdAt");
CREATE INDEX "ExternalClientReadGrant_botId_idx" ON "ExternalClientReadGrant"("botId");
CREATE INDEX "ExternalClientReadGrant_expiresAt_idx" ON "ExternalClientReadGrant"("expiresAt");
ALTER TABLE "ExternalClientReadGrant" ADD CONSTRAINT "ExternalClientReadGrant_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ExternalClientReadGrant" ADD CONSTRAINT "ExternalClientReadGrant_botId_fkey"
  FOREIGN KEY ("botId") REFERENCES "Bot"("id") ON DELETE CASCADE ON UPDATE CASCADE;
