ALTER TABLE "LiveCreateOrderSubmission"
  ADD COLUMN "grantId" TEXT,
  ADD COLUMN "reservationId" TEXT,
  ADD COLUMN "intentId" TEXT;

ALTER TABLE "LiveCreateOrderSubmission"
  ADD CONSTRAINT "LiveCreateOrderSubmission_delegated_binding_check"
  CHECK (
    ("grantId" IS NULL AND "reservationId" IS NULL AND "intentId" IS NULL)
    OR ("grantId" IS NOT NULL AND "reservationId" IS NOT NULL AND "intentId" IS NOT NULL)
  );

CREATE UNIQUE INDEX "LiveCreateOrderSubmission_reservationId_key"
  ON "LiveCreateOrderSubmission"("reservationId");
CREATE UNIQUE INDEX "LiveCreateOrderSubmission_intentId_key"
  ON "LiveCreateOrderSubmission"("intentId");
CREATE INDEX "LiveCreateOrderSubmission_grantId_idx"
  ON "LiveCreateOrderSubmission"("grantId");

ALTER TABLE "LiveCreateOrderSubmission"
  ADD CONSTRAINT "LiveCreateOrderSubmission_grantId_fkey"
  FOREIGN KEY ("grantId") REFERENCES "ExternalClientGrant"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "LiveCreateOrderSubmission"
  ADD CONSTRAINT "LiveCreateOrderSubmission_reservationId_fkey"
  FOREIGN KEY ("reservationId") REFERENCES "ExternalClientGrantReservation"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "LiveCreateOrderSubmission"
  ADD CONSTRAINT "LiveCreateOrderSubmission_intentId_fkey"
  FOREIGN KEY ("intentId") REFERENCES "LiveOrderIntent"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;
