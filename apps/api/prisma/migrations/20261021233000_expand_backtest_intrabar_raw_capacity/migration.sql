ALTER TABLE "BacktestIntrabarArchiveRaw"
  DROP CONSTRAINT "BacktestIntrabarArchiveRaw_zip_size_check";

ALTER TABLE "BacktestIntrabarArchiveRaw"
  ADD CONSTRAINT "BacktestIntrabarArchiveRaw_zip_size_check"
  CHECK (octet_length("zipBytes") BETWEEN 1 AND 16777216);
