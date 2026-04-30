ALTER TABLE "Bot"
ADD COLUMN "manageExternalPositions" BOOLEAN NOT NULL DEFAULT false;

UPDATE "Bot" AS b
SET "manageExternalPositions" = COALESCE(w."manageExternalPositions", false)
FROM "Wallet" AS w
WHERE b."walletId" = w."id"
  AND b."mode" = 'LIVE';
