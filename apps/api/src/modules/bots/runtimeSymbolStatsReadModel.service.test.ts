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
    marketSnapshotsBySeries: new Map([
      [
        'BTCUSDT|5m',
        {
          candles: [
            {
              openTime: 1,
              closeTime: 2,
              open: 60_000,
              high: 60_500,
              low: 59_500,
              close: 60_000,
              volume: 10,
            },
            {
              openTime: 3,
              closeTime: 4,
              open: 60_000,
              high: 61_500,
              low: 59_900,
              close: 61_000,
              volume: 10,
            },
            {
              openTime: 5,
              closeTime: 6,
              open: 61_000,
              high: 62_500,
              low: 60_900,
              close: 62_000,
              volume: 10,
            },
            {
              openTime: 7,
              closeTime: 8,
              open: 62_000,
              high: 63_500,
              low: 61_900,
              close: 63_000,
              volume: 10,
            },
          ],
        },
      ],
    ]),
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

  it('computes configured fallback lines from canonical market snapshot data without opaque placeholders', () => {
    const readModel = composeRuntimeSymbolStatsReadModel({
      ...baseParams,
      latestSignalBySymbol: new Map(),
      configuredStrategyBySymbol: new Map([['BTCUSDT', 'strategy-rsi']]),
      strategiesById: new Map([
        [
          'strategy-rsi',
          {
            name: 'RSI 40/60',
            interval: '5m',
            config: {
              open: {
                indicatorsLong: [
                  {
                    name: 'RSI',
                    condition: '>',
                    value: 60,
                    params: { period: 2 },
                  },
                ],
                indicatorsShort: [
                  {
                    name: 'RSI',
                    condition: '<',
                    value: 40,
                    params: { period: 2 },
                  },
                ],
              },
            },
          },
        ],
      ]),
    });

    const lines = readModel.items[0].lastSignalConditionLines ?? [];
    expect(lines).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          scope: 'LONG',
          left: 'RSI(2)',
          operator: '>',
          right: '60',
          matched: true,
        }),
        expect.objectContaining({
          scope: 'SHORT',
          left: 'RSI(2)',
          operator: '<',
          right: '40',
          matched: false,
        }),
      ]),
    );
    expect(lines.every((line) => line.value !== 'n/a')).toBe(true);
  });

  it('uses concrete snapshot analysis when latest decision analysis only has unavailable indicator values', () => {
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
            strategyId: 'strategy-rsi',
            scoreLong: null,
            scoreShort: null,
            analysisByStrategy: {
              'strategy-rsi': {
                indicatorSummary: 'RSI(2)=n/a',
                conditionLines: [
                  {
                    scope: 'LONG',
                    left: 'RSI(2)',
                    value: 'n/a',
                    operator: '>',
                    right: '60',
                    matched: false,
                  },
                ],
              },
            },
          },
        ],
      ]),
      configuredStrategyBySymbol: new Map([['BTCUSDT', 'strategy-rsi']]),
      strategiesById: new Map([
        [
          'strategy-rsi',
          {
            name: 'RSI 40/60',
            interval: '5m',
            config: {
              open: {
                indicatorsLong: [
                  {
                    name: 'RSI',
                    condition: '>',
                    value: 60,
                    params: { period: 2 },
                  },
                ],
                indicatorsShort: [],
              },
            },
          },
        ],
      ]),
    });

    const lines = readModel.items[0].lastSignalConditionLines ?? [];
    expect(lines).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          scope: 'LONG',
          left: 'RSI(2)',
          operator: '>',
          right: '60',
          matched: true,
        }),
      ]),
    );
    expect(lines.every((line) => line.value !== 'n/a')).toBe(true);
    expect(readModel.items[0].lastSignalIndicatorSummary).not.toContain('n/a');
  });
});
