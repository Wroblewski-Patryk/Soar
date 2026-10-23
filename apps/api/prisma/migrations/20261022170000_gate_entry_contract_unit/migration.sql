ALTER TABLE "Order" ADD COLUMN "contractSize" DOUBLE PRECISION;
ALTER TABLE "Position" ADD COLUMN "contractSize" DOUBLE PRECISION;

ALTER TABLE "Order"
  ADD CONSTRAINT "Order_contractSize_positive_finite"
  CHECK ("contractSize" IS NULL OR ("contractSize" > 0 AND "contractSize" < 'Infinity'::float8));

ALTER TABLE "Position"
  ADD CONSTRAINT "Position_contractSize_positive_finite"
  CHECK ("contractSize" IS NULL OR ("contractSize" > 0 AND "contractSize" < 'Infinity'::float8));
