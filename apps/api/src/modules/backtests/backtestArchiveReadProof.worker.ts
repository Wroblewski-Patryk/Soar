import { digestVerifiedBinanceFuturesIntrabar } from './backtestBinanceFuturesIntrabarSource';
import { readVerifiedRunArchive } from './backtestBinanceFuturesIntrabarArchive';

const [runId, symbol, startRaw, endRaw] = process.argv.slice(2);
if (process.env.SOAR_ARCHIVE_READ_PROOF !== '1' ||
    new URL(process.env.DATABASE_URL ?? '').pathname.slice(1) !==
      'soar_011a_archive_test' || !runId || !symbol || !startRaw || !endRaw)
  throw new Error('Archive read proof requires its isolated test database');

globalThis.fetch = async () => { throw new Error('NETWORK_FORBIDDEN_AFTER_RESTART'); };
void (async () => {
  const candles = await readVerifiedRunArchive(runId, symbol,
    Number(startRaw), Number(endRaw));
  if (!candles) throw new Error('ARCHIVE_SNAPSHOT_MISSING');
  process.stdout.write(JSON.stringify({
    digest: digestVerifiedBinanceFuturesIntrabar(candles, symbol),
    candles: candles.length,
    firstAggregateId: candles[0].intrabarProvenance.firstAggregateId,
    lastAggregateId: candles[candles.length - 1].intrabarProvenance.lastAggregateId,
  }) + '\n');
})().catch((error) => { process.stderr.write(String(error)); process.exitCode = 1; });
