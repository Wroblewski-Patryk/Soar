ALTER TABLE "Wallet"
ADD COLUMN "manageExternalPositions" BOOLEAN NOT NULL DEFAULT false;

UPDATE "Wallet" w
SET "manageExternalPositions" = true
FROM "ApiKey" a
WHERE w."mode" = 'LIVE'
  AND w."apiKeyId" IS NOT NULL
  AND w."apiKeyId" = a."id"
  AND a."manageExternalPositions" = true;
