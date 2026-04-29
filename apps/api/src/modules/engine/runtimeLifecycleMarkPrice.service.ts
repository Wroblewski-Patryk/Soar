import { Exchange } from '@prisma/client';
import { getRecentRuntimeCloses } from './runtimeSignalMarketDataGateway';
import { getRuntimeTicker } from './runtimeTickerStore';

type RuntimeLifecycleMarkPriceInput = {
  exchange: Exchange;
  marketType: 'FUTURES' | 'SPOT';
  symbol: string;
  interval?: string | null;
};

type RuntimeLifecycleMarkPriceDeps = {
  getTicker?: typeof getRuntimeTicker;
  getRecentCloses?: typeof getRecentRuntimeCloses;
};

export const resolveRuntimeLifecycleMarkPrice = (
  input: RuntimeLifecycleMarkPriceInput,
  deps: RuntimeLifecycleMarkPriceDeps = {},
) => {
  const getTicker = deps.getTicker ?? getRuntimeTicker;
  const getRecentCloses = deps.getRecentCloses ?? getRecentRuntimeCloses;

  const latestTicker = getTicker(input.symbol, {
    exchange: input.exchange,
    marketType: input.marketType,
  });
  if (
    input.marketType === 'FUTURES' &&
    latestTicker &&
    Number.isFinite(latestTicker.markPrice) &&
    (latestTicker.markPrice as number) > 0
  ) {
    return latestTicker.markPrice as number;
  }
  if (latestTicker && Number.isFinite(latestTicker.lastPrice) && latestTicker.lastPrice > 0) {
    return latestTicker.lastPrice;
  }

  const recentCloses = getRecentCloses({
    marketType: input.marketType,
    symbol: input.symbol,
    interval: input.interval,
    limit: 1,
  });
  const fallbackClose = recentCloses.at(-1) ?? null;
  return typeof fallbackClose === 'number' && Number.isFinite(fallbackClose) && fallbackClose > 0
    ? fallbackClose
    : null;
};
