import { Exchange } from '@prisma/client';
import { StreamTickerEvent } from '../market-stream/binanceStream.types';
import { normalizeSymbol } from '../../lib/symbols';

type TickerContext = {
  exchange: Exchange;
  marketType: StreamTickerEvent['marketType'];
};

const tickerStoreByContext = new Map<string, StreamTickerEvent>();
const latestTickerBySymbol = new Map<string, StreamTickerEvent>();

const toTickerKey = (params: {
  symbol: string;
  exchange: string;
  marketType: StreamTickerEvent['marketType'];
}) => `${params.exchange}|${params.marketType}|${normalizeSymbol(params.symbol)}`;

export const upsertRuntimeTicker = (event: StreamTickerEvent) => {
  const normalizedSymbol = normalizeSymbol(event.symbol);
  const existingByContext = tickerStoreByContext.get(
    toTickerKey({
      symbol: normalizedSymbol,
      exchange: event.exchange,
      marketType: event.marketType,
    })
  );
  const normalizedEvent: StreamTickerEvent = {
    ...(existingByContext ?? {}),
    ...event,
    symbol: normalizedSymbol,
    markPrice:
      typeof event.markPrice === 'number' && Number.isFinite(event.markPrice) && event.markPrice > 0
        ? event.markPrice
        : existingByContext?.markPrice,
  };

  tickerStoreByContext.set(
    toTickerKey({
      symbol: normalizedSymbol,
      exchange: normalizedEvent.exchange,
      marketType: normalizedEvent.marketType,
    }),
    normalizedEvent
  );

  const existing = latestTickerBySymbol.get(normalizedSymbol);
  if (!existing || normalizedEvent.eventTime >= existing.eventTime) {
    latestTickerBySymbol.set(normalizedSymbol, normalizedEvent);
  }
};

export const getRuntimeTicker = (symbol: string, context?: TickerContext) => {
  const normalizedSymbol = normalizeSymbol(symbol);
  if (context) {
    return (
      tickerStoreByContext.get(
        toTickerKey({
          symbol: normalizedSymbol,
          exchange: context.exchange,
          marketType: context.marketType,
        })
      ) ?? null
    );
  }

  return latestTickerBySymbol.get(normalizedSymbol) ?? null;
};

export const clearRuntimeTickerStore = () => {
  tickerStoreByContext.clear();
  latestTickerBySymbol.clear();
};
