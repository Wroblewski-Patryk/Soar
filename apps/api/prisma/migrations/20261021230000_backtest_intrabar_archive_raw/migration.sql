CREATE TABLE "BacktestIntrabarArchiveRaw" (
    "runId" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "day" TEXT NOT NULL,
    "zipBytes" BYTEA NOT NULL,
    "checksumBytes" BYTEA NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BacktestIntrabarArchiveRaw_pkey" PRIMARY KEY ("runId","symbol","day"),
    CONSTRAINT "BacktestIntrabarArchiveRaw_zip_size_check"
      CHECK (octet_length("zipBytes") BETWEEN 1 AND 8388608),
    CONSTRAINT "BacktestIntrabarArchiveRaw_checksum_size_check"
      CHECK (octet_length("checksumBytes") BETWEEN 1 AND 256),
    CONSTRAINT "BacktestIntrabarArchiveRaw_day_format_check"
      CHECK ("day" ~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}$')
);

ALTER TABLE "BacktestIntrabarArchiveRaw"
  ADD CONSTRAINT "BacktestIntrabarArchiveRaw_archive_fkey"
  FOREIGN KEY ("runId", "symbol")
  REFERENCES "BacktestIntrabarArchive"("runId", "symbol")
  ON DELETE CASCADE ON UPDATE CASCADE;
