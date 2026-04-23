import { describe, expect, it } from 'vitest';
import { composeRuntimeSymbolStatsReadModel } from './runtimeSymbolStatsReadModel.service';

describe('runtimeSymbolStatsReadModel.service', () => {
  const baseParams = {
    userId: 'user-1',
    botId: 'bot-1',
    sessionId: 'session-1',
    sessionStartedAt: new Date('2026-04-23T10:00:00.000Z'),
    sessionCreatedAt: new Date('2026-04-23T10:00:00.000Z'),
    sessionUpdatedAt: new Date('2026-04-23T10:05:00.000Z'),
    symbols: ['BTCUSDT'],
    statBySymbol: new Map(),
    aggregateSummary: {
      totalSignals: 0,
      longEntries: 0,
      shortEntries: 0,
      exits: 0,
      dcaCount: 0,
      closedTrades: 0,
      winningTrades: 0,
      losingTrades: 0,
      realizedPnl: 0,
      grossProfit: 0,
      grossLoss: 0,
      feesPaid: 0,
    },
    openPositionCountBySymbol: new Map(),
    openPositionQtyBySymbol: new Map(),
    unrealizedPnlBySymbol: new Map(),
    lastPriceBySymbol: new Map([['BTCUSDT', 63_000]]),
    latestTradeAtBySymbol: new Map(),
    candleClosesBySeries: new Map([['BTCUSDT|5m', [60_000, 61_000, 62_000, 63_000]]]),
  };

  it('keeps configured fallback strategy separate from accepted runtime signal truth', () => {
    const readModel = composeRuntimeSymbolStatsReadModel({
      ...baseParams,
      latestSignalBySymbol: new Map(),
      configuredStrategyBySymbol: new Map([['BTCUSDT', 'strategy-fallback']]),
      strategiesById: new Map([
        [
          'strategy-fallback',
          {
            name: 'Fallback Strategy',
            interval: '5m',
            config: {
              open: {
                indicatorsLong: [],
                indicatorsShort: [],
              },
            },
          },
        ],
      ]),
    });

    expect(readModel.items).toHaveLength(1);
    expect(readModel.items[0]).toEqual(
      expect.objectContaining({
        symbol: 'BTCUSDT',
        lastSignalContextSource: 'configured_fallback',
        runtimeMarketState: 'CONFIGURED_ONLY',
        lastSignalStrategyId: null,
        lastSignalStrategyName: null,
        configuredStrategyId: 'strategy-fallback',
        configuredStrategyName: 'Fallback Strategy',
      })
    );
  });

  it('marks decision-only runtime events as latest_decision without pretending an accepted signal exists', () => {
    const readModel = composeRuntimeSymbolStatsReadModel({
      ...baseParams,
      latestSignalBySymbol: new Map([
        [
          'BTCUSDT',
          {
            signalDirection: null,
            eventAt: new Date('2026-04-23T10:04:00.000Z'),
            message: 'No trade decision after strategy merge',
            mergeReason: 'No votes',
            strategyId: null,
            scoreLong: null,
            scoreShort: null,
            analysisByStrategy: {},
          },
        ],
      ]),
      configuredStrategyBySymbol: new Map([['BTCUSDT', 'strategy-fallback']]),
      strategiesById: new Map([
        [
          'strategy-fallback',
          {
            name: 'Fallback Strategy',
            interval: '5m',
            config: {
              open: {
                indicatorsLong: [],
                indicatorsShort: [],
              },
            },
          },
        ],
      ]),
    });

    expect(readModel.items).toHaveLength(1);
    expect(readModel.items[0]).toEqual(
      expect.objectContaining({
        symbol: 'BTCUSDT',
        lastSignalDirection: null,
        lastSignalContextSource: 'latest_decision',
        runtimeMarketState: 'EVALUATED_NO_TRADE',
        lastSignalMessage: 'No trade decision after strategy merge',
        lastSignalReason: 'No votes',
        lastSignalStrategyId: null,
        lastSignalStrategyName: null,
        configuredStrategyId: 'strategy-fallback',
        configuredStrategyName: 'Fallback Strategy',
      })
    );
  });
});
