import type { Exchange } from '@prisma/client';
import { digestVerifiedBinanceFuturesIntrabar } from './backtestBinanceFuturesIntrabarSource';
import { fetchKlinesWithVerifiedBinanceFuturesIntrabar,
  type BacktestKlineCandle, type BacktestMarketType } from './backtestDataGateway';

export class BacktestTimelineSourceError extends Error {
  constructor(readonly code: 'RUN_NOT_COMPLETED' | 'SOURCE_DIGEST_MISSING' |
    'SOURCE_UNAVAILABLE' | 'SOURCE_CHANGED') {
    super('Verified intrabar timeline unavailable');
    this.name = 'BacktestTimelineSourceError';
  }
}

export const fetchVerifiedIntrabarTimelineCandles = async (input: {
  exchange: Exchange;
  symbol: string;
  timeframe: string;
  marketType: BacktestMarketType;
  maxCandles: number;
  endTimeMs?: number;
  startTimeMs?: number;
  expectedDigest: unknown;
}): Promise<BacktestKlineCandle[]> => {
  if (typeof input.expectedDigest !== 'string' ||
      !/^[0-9a-f]{64}$/.test(input.expectedDigest))
    throw new BacktestTimelineSourceError('SOURCE_DIGEST_MISSING');

  try {
    const candles = await fetchKlinesWithVerifiedBinanceFuturesIntrabar(
      input.exchange, input.symbol, input.timeframe, input.marketType,
      input.maxCandles, input.endTimeMs, input.startTimeMs,
    );
    const digest = digestVerifiedBinanceFuturesIntrabar(candles, input.symbol);
    if (digest !== input.expectedDigest)
      throw new BacktestTimelineSourceError('SOURCE_CHANGED');
    return candles;
  } catch (error) {
    if (error instanceof BacktestTimelineSourceError) throw error;
    throw new BacktestTimelineSourceError('SOURCE_UNAVAILABLE');
  }
};
