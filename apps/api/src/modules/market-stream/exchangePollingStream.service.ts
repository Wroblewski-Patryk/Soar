import { Exchange } from '@prisma/client';

import { normalizeSymbol } from '../../lib/symbols';
import {
  fetchExchangePublicRecentCandles,
  fetchExchangePublicTickerSnapshot,
} from '../exchange/exchangePublicMarketData.service';
import { MarketStreamEvent, StreamLogger, TradeMarketType } from './binanceStream.types';

type PublicMarketDataReader = {
  fetchTicker: typeof fetchExchangePublicTickerSnapshot;
  fetchCandles: typeof fetchExchangePublicRecentCandles;
};

type ExchangePollingStreamConfig = {
  exchange: Exchange;
  marketType: TradeMarketType;
  symbols: string[];
  candleIntervals: string[];
  pollMs?: number;
  onEvent?: (event: MarketStreamEvent) => void | Promise<void>;
};

const defaultReader: PublicMarketDataReader = {
  fetchTicker: fetchExchangePublicTickerSnapshot,
  fetchCandles: fetchExchangePublicRecentCandles,
};

const defaultLogger: StreamLogger = {
  info: (payload) => {
    if (process.env.NODE_ENV === 'test') return;
    console.log(JSON.stringify({ level: 'info', module: 'market-stream.exchange-polling', ...payload }));
  },
  warn: (payload) => {
    if (process.env.NODE_ENV === 'test') return;
    console.warn(JSON.stringify({ level: 'warn', module: 'market-stream.exchange-polling', ...payload }));
  },
  error: (payload) => {
    if (process.env.NODE_ENV === 'test') return;
    console.error(JSON.stringify({ level: 'error', module: 'market-stream.exchange-polling', ...payload }));
  },
};

export class ExchangePublicPollingMarketStreamWorker {
  private timer: NodeJS.Timeout | null = null;
  private running = false;

  constructor(
    private readonly config: ExchangePollingStreamConfig,
    private readonly reader: PublicMarketDataReader = defaultReader,
    private readonly logger: StreamLogger = defaultLogger
  ) {}

  start() {
    if (this.timer) return;
    this.running = true;
    void this.pollOnce();
    this.timer = setInterval(() => {
      void this.pollOnce();
    }, Math.max(5_000, Math.floor(this.config.pollMs ?? 30_000)));
  }

  stop() {
    this.running = false;
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  async pollOnce() {
    if (!this.running && this.timer) return;

    const symbols = [...new Set(this.config.symbols.map(normalizeSymbol))].filter(Boolean);
    const intervals = [...new Set(this.config.candleIntervals.map((interval) => interval.trim().toLowerCase()))]
      .filter(Boolean);

    for (const symbol of symbols) {
      await this.publishTicker(symbol);
      for (const interval of intervals) {
        await this.publishLatestCandle(symbol, interval);
      }
    }
  }

  private async publishTicker(symbol: string) {
    try {
      const snapshot = await this.reader.fetchTicker({
        exchange: this.config.exchange,
        marketType: this.config.marketType,
        symbol,
      });
      await this.config.onEvent?.({
        type: 'ticker',
        exchange: this.config.exchange,
        marketType: this.config.marketType,
        symbol: normalizeSymbol(symbol),
        eventTime: snapshot.eventTime,
        lastPrice: snapshot.lastPrice,
        markPrice: snapshot.markPrice ?? undefined,
        priceChangePercent24h: snapshot.priceChangePercent24h,
      });
    } catch (error) {
      this.logger.warn({
        event: 'market_stream.poll_ticker_failed',
        exchange: this.config.exchange,
        marketType: this.config.marketType,
        symbol,
        error: error instanceof Error ? error.message : 'unknown_error',
      });
    }
  }

  private async publishLatestCandle(symbol: string, interval: string) {
    try {
      const candles = await this.reader.fetchCandles({
        exchange: this.config.exchange,
        marketType: this.config.marketType,
        symbol,
        interval,
        limit: 2,
      });
      const candle = candles.at(-1);
      if (!candle) return;

      await this.config.onEvent?.({
        type: 'candle',
        exchange: this.config.exchange,
        marketType: this.config.marketType,
        symbol: normalizeSymbol(symbol),
        interval,
        eventTime: Date.now(),
        openTime: candle.openTime,
        closeTime: candle.closeTime,
        open: candle.open,
        high: candle.high,
        low: candle.low,
        close: candle.close,
        volume: candle.volume,
        isFinal: true,
      });
    } catch (error) {
      this.logger.warn({
        event: 'market_stream.poll_candle_failed',
        exchange: this.config.exchange,
        marketType: this.config.marketType,
        symbol,
        interval,
        error: error instanceof Error ? error.message : 'unknown_error',
      });
    }
  }
}
