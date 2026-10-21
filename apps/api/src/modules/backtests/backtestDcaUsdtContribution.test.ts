import { describe, expect, it } from 'vitest';
import { parseStrategyRiskConfig, simulateTradesForSymbolReplay } from './backtestReplayCore';
import { simulateInterleavedPortfolio } from './backtestPortfolioSimulation.service';

const candles = [0.99, 1, 1, 0.6949, 0.5375, 0.5375].map((price, index) => ({
  openTime: 1_710_000_000_000 + index * 60_000,
  closeTime: 1_710_000_030_000 + index * 60_000,
  open: price,
  high: price,
  low: price,
  close: price,
  volume: 1_000,
}));

const strategyConfig = {
  openConditions: {
    direction: 'long',
    indicatorsLong: [{ name: 'MOMENTUM', condition: '>', value: -999, params: { period: 1 } }],
    indicatorsShort: [],
  },
  close: { tp: 99, sl: 99 },
  additional: {
    dcaEnabled: true,
    dcaMode: 'basic',
    dcaTimes: 2,
    dcaSizingBasis: 'usdt_contribution_v1',
    dcaLevels: [{ percent: -30.5, multiplier: 2 }],
  },
};

const advancedCandles = [0.99, 1, 1, 0.8, 0.6221, 0.6221].map((price, index) => ({
  ...candles[index], open: price, high: price, low: price, close: price,
}));
const advancedStrategyConfig = {
  ...strategyConfig,
  additional: {
    ...strategyConfig.additional,
    dcaMode: 'advanced',
    dcaLevels: [
      { percent: -20, multiplier: 1 },
      { percent: -30, multiplier: 0.5 },
    ],
  },
};

const replayBothWithLimitedFunds = (prices: number[], config: Record<string, unknown>) => {
  const limitedCandles = prices.map((price, index) => ({
    ...candles[0], openTime: candles[0].openTime + index * 60_000,
    closeTime: candles[0].closeTime + index * 60_000,
    open: price, high: price, low: price, close: price,
  }));
  const single = simulateTradesForSymbolReplay({
    symbol: 'BTCUSDT', candles: limitedCandles, marketType: 'FUTURES', leverage: 1,
    marginMode: 'CROSSED', strategyConfig: config,
    positionSizing: { mode: 'fixed', fixedQuantity: 1, referenceBalance: 1.1 },
    fillModelConfig: { feeRate: 0, slippageRate: 0 },
  });
  const portfolio = simulateInterleavedPortfolio({
    symbols: ['BTCUSDT'], candlesBySymbol: new Map([['BTCUSDT', limitedCandles]]),
    marketType: 'FUTURES', leverage: 1, marginMode: 'CROSSED',
    strategyConfig: config, walletRiskPercent: 90, initialBalance: 10,
    fillModelConfig: { feeRate: 0, slippageRate: 0 },
  }).perSymbol.BTCUSDT;
  return [single, portfolio];
};

const replayBothTrailingPaths = (prices: number[], config: Record<string, unknown>) => {
  const replayCandles = prices.map((price, index) => ({
    ...candles[0], openTime: candles[0].openTime + index * 60_000,
    closeTime: candles[0].closeTime + index * 60_000,
    open: price, high: price, low: price, close: price,
  }));
  return [
    simulateTradesForSymbolReplay({ symbol: 'BTCUSDT', candles: replayCandles,
      marketType: 'FUTURES', leverage: 1, marginMode: 'CROSSED', strategyConfig: config,
      positionSizing: { mode: 'fixed', fixedQuantity: 1 },
      fillModelConfig: { feeRate: 0, slippageRate: 0 } }),
    simulateInterleavedPortfolio({ symbols: ['BTCUSDT'],
      candlesBySymbol: new Map([['BTCUSDT', replayCandles]]),
      marketType: 'FUTURES', leverage: 1, marginMode: 'CROSSED',
      strategyConfig: config, walletRiskPercent: 10, initialBalance: 10,
      fillModelConfig: { feeRate: 0, slippageRate: 0 } }).perSymbol.BTCUSDT,
  ];
};

const trailingDirectionConfig = (side: 'LONG' | 'SHORT') => ({
  ...strategyConfig,
  openConditions: side === 'LONG' ? strategyConfig.openConditions : {
    direction: 'short', indicatorsLong: [],
    indicatorsShort: [{ name: 'MOMENTUM', condition: '<', value: 999,
      params: { period: 1 } }],
  },
});

describe('USDT contribution DCA in historical replay', () => {
  it('holds legacy no-match EXIT through DCA until basic SL in both replay paths', () => {
    const config = {
      ...strategyConfig,
      openConditions: {
        direction: 'long',
        noMatchAction: 'EXIT',
        indicatorsLong: [{ name: 'MOMENTUM', condition: '>', value: 0, params: { period: 1 } }],
        indicatorsShort: [],
      },
      close: { mode: 'basic', tp: 99, sl: 7 },
      additional: {
        ...strategyConfig.additional,
        dcaTimes: 1,
        dcaLevels: [{ percent: -2, multiplier: 1 }],
      },
    };

    for (const result of replayBothTrailingPaths([100, 101, 101, 98, 97, 90], config)) {
      expect(result.eventCounts.ENTRY).toBe(1);
      expect(result.eventCounts.DCA).toBe(1);
      expect(result.eventCounts.SL).toBe(1);
      expect(result.events.filter((event) => event.type === 'DCA').map((event) => event.price))
        .toEqual([98]);
      expect(result.events.find((event) => event.type === 'SL')?.price).toBe(90);
      expect(result.decisionTrace.some((entry) => entry.signal === 'EXIT')).toBe(false);
    }
  });

  it.each([
    ['LONG', [99, 100, 100, 126, 151, 149, 125], [99, 100, 100, 49, 57, 76, 63]],
    ['SHORT', [101, 100, 100, 74, 49, 51, 75], [101, 100, 100, 151, 143, 124, 137]],
  ] as const)('%s uses both configured TTP and TSL levels in single and portfolio replay',
    (side, ttpPrices, tslPrices) => {
      const base = trailingDirectionConfig(side);
      const additional = { ...base.additional, dcaEnabled: false, dcaTimes: 0 };
      const ttp = { ...base, additional, close: { mode: 'advanced', tp: 99, sl: 99,
        ttp: [{ percent: 25, arm: 12 }, { percent: 50, arm: 25 }] } };
      for (const result of replayBothTrailingPaths([...ttpPrices], ttp)) {
        expect(result.eventCounts.TTP).toBe(1);
        expect(result.events.find((event) => event.type === 'TTP')?.price)
          .toBe(ttpPrices.at(-1));
      }
      const tsl = { ...base, additional, close: { mode: 'advanced', tp: 99, sl: 99,
        tsl: [{ percent: -50, arm: 25 }, { percent: -25, arm: 12 }] } };
      for (const result of replayBothTrailingPaths([...tslPrices], tsl)) {
        expect(result.eventCounts.TSL).toBe(1);
        expect(result.events.find((event) => event.type === 'TSL')?.price)
          .toBe(tslPrices.at(-1));
      }
    });

  it.each([
    ['LONG', [99, 100, 100, 130, 140, 140, 127], 140, 127],
    ['SHORT', [101, 100, 100, 70, 60, 60, 68], 60, 68],
  ] as const)('%s rebases armed TTP after confirmed DCA in both replay paths',
    (side, prices, dcaPrice, closePrice) => {
      const base = trailingDirectionConfig(side);
      const config = { ...base, close: { mode: 'advanced', tp: 99, sl: 99,
        ttp: [{ percent: 20, arm: 10 }] },
      additional: { ...base.additional, dcaMode: 'advanced', dcaTimes: 1,
        dcaLevels: [{ percent: 40, multiplier: 1 }] } };
      for (const result of replayBothTrailingPaths([...prices], config)) {
        expect(result.eventCounts.DCA).toBe(1);
        expect(result.events.find((event) => event.type === 'DCA')?.price).toBe(dcaPrice);
        expect(result.eventCounts.TTP).toBe(1);
        expect(result.events.find((event) => event.type === 'TTP')?.price).toBe(closePrice);
      }
    });

  it.each([
    ['LONG', [99, 100, 100, 49, 57, 140, 140, 130, 125], 140, 125],
    ['SHORT', [101, 100, 100, 151, 143, 60, 60, 65, 70], 60, 70],
  ] as const)('%s rebases armed TSL after DCA in both replay paths',
    (side, prices, dcaPrice, closePrice) => {
      const base = trailingDirectionConfig(side);
      const config = { ...base, close: { mode: 'advanced', tp: 99, sl: 99,
        tsl: [{ percent: -50, arm: 25 }, { percent: -25, arm: 12 }] },
      additional: { ...base.additional, dcaMode: 'advanced', dcaTimes: 1,
        dcaLevels: [{ percent: 40, multiplier: 1 }] } };
      for (const result of replayBothTrailingPaths([...prices], config)) {
        expect(result.eventCounts.DCA).toBe(1);
        expect(result.events.find((event) => event.type === 'DCA')?.price).toBe(dcaPrice);
        expect(result.eventCounts.TSL).toBe(1);
        expect(result.events.find((event) => event.type === 'TSL')?.price).toBe(closePrice);
      }
    });

  it('keeps a filled negative advanced DCA ahead of armed TSL on the same candle', () => {
    const config = { ...strategyConfig,
      openConditions: { ...strategyConfig.openConditions, noMatchAction: 'EXIT',
        indicatorsLong: [{ name: 'MOMENTUM', condition: '>', value: 0,
          params: { period: 1 } }] },
      close: { mode: 'advanced', tp: 99, sl: 99,
        tsl: [{ percent: -50, arm: 25 }, { percent: -25, arm: 12 }] },
      additional: { ...strategyConfig.additional, dcaMode: 'advanced', dcaTimes: 1,
        dcaLevels: [{ percent: -70, multiplier: 1 }] },
    };
    const tape = [99, 100, 100, 49, 57, 25, 25, 20];
    const withoutDca = { ...config, additional: { ...config.additional,
      dcaEnabled: false, dcaTimes: 0 } };
    for (const result of replayBothTrailingPaths(tape, withoutDca)) {
      expect(result.events.filter((event) => event.type === 'TSL')
        .map((event) => event.candleIndex)).toEqual([5]);
    }
    for (const result of replayBothTrailingPaths(tape, config)) {
      expect(result.eventCounts).toMatchObject({ ENTRY: 1, DCA: 1, TSL: 1,
        EXIT: 0, TP: 0, TTP: 0, SL: 0 });
      expect(result.events.filter((event) => event.type === 'DCA')
        .map((event) => [event.candleIndex, event.price])).toEqual([[5, 25]]);
      expect(result.events.filter((event) => event.type === 'TSL')
        .map((event) => [event.candleIndex, event.price])).toEqual([[6, 25]]);
      expect(result.trades).toHaveLength(1);
      expect(result.trades[0].exitReason).toBe('TSL');
    }
  });

  it('keeps reached positive USDT DCA pending without funds instead of taking TP or TTP', () => {
    const additional = { ...strategyConfig.additional, dcaTimes: 1,
      dcaLevels: [{ percent: 20, multiplier: 1 }] };
    const tpConfig = { ...strategyConfig, close: { mode: 'basic', tp: 10, sl: 90 }, additional };
    for (const result of replayBothWithLimitedFunds([0.99, 1, 1, 1.25, 1.25], tpConfig)) {
      expect(result.eventCounts.ENTRY).toBeGreaterThanOrEqual(1);
      expect(result.eventCounts.DCA).toBe(0);
      expect(result.eventCounts.TP).toBe(0);
      expect(result.dcaFundsExhaustedCount).toBeGreaterThan(0);
      expect(result.dcaFundsExhaustedSamples[0]).toMatchObject({
        levelIndex: 0, price: 1.25,
      });
    }

    const ttpConfig = { ...strategyConfig,
      close: { mode: 'advanced', tp: 99, sl: 90, ttp: [{ percent: 10, arm: 5 }] },
      additional };
    for (const result of replayBothWithLimitedFunds([0.99, 1, 1, 1.3, 1.23, 1.23], ttpConfig)) {
      expect(result.eventCounts.ENTRY).toBeGreaterThanOrEqual(1);
      expect(result.eventCounts.DCA).toBe(0);
      expect(result.eventCounts.TTP).toBe(0);
      expect(result.dcaFundsExhaustedCount).toBeGreaterThan(0);
    }
  });

  it('releases only crossed SL for an unfunded negative USDT add, including mixed levels', () => {
    const negative = { ...strategyConfig, close: { mode: 'basic', tp: 10, sl: 25 },
      additional: { ...strategyConfig.additional, dcaTimes: 1,
        dcaLevels: [{ percent: -20, multiplier: 1 }] } };
    for (const result of replayBothWithLimitedFunds([0.99, 1, 1, 0.7, 0.7], negative)) {
      expect(result.eventCounts.DCA).toBe(0);
      expect(result.eventCounts.SL).toBe(1);
      expect(result.dcaFundsExhaustedSamples[0]).toMatchObject({ levelIndex: 0, price: 0.7 });
    }

    const mixed = { ...strategyConfig, close: { mode: 'basic', tp: 10, sl: 25 },
      additional: { ...strategyConfig.additional, dcaMode: 'advanced', dcaTimes: 2,
        dcaLevels: [{ percent: 20, multiplier: 1 }, { percent: -20, multiplier: 1 }] } };
    for (const result of replayBothWithLimitedFunds([0.99, 1, 1, 1.25, 0.7, 0.7], mixed)) {
      expect(result.eventCounts.DCA).toBe(0);
      expect(result.eventCounts.TP).toBe(0);
      expect(result.eventCounts.SL).toBe(1);
      expect(result.dcaFundsExhaustedSamples.map((sample) => sample.levelIndex))
        .toEqual([0, 1]);
    }
  });

  it('preserves quantity_v1 funds-exhausted exit behavior', () => {
    const config = { ...strategyConfig, close: { mode: 'basic', tp: 10, sl: 90 },
      additional: { ...strategyConfig.additional, dcaSizingBasis: 'quantity_v1',
        dcaTimes: 1, dcaLevels: [{ percent: 20, multiplier: 1 }] } };
    for (const result of replayBothWithLimitedFunds([0.99, 1, 1, 1.25, 1.25], config)) {
      expect(result.eventCounts.DCA).toBe(0);
      expect(result.eventCounts.TP).toBe(1);
    }
  });

  it('keeps basic two-add SL behind confirmed fills and the new average in both replay paths', () => {
    const prices = [0.99, 1, 1, 0.7, 0.5764, 0.5764, 0.5424];
    const exitCandles = prices.map((price, index) => ({
      ...candles[0], openTime: candles[0].openTime + index * 60_000,
      closeTime: candles[0].closeTime + index * 60_000,
      open: price, high: price, low: price, close: price,
    }));
    const config = { ...strategyConfig, close: { mode: 'basic', tp: 99, sl: 20 },
      additional: { ...strategyConfig.additional, dcaTimes: 2,
        dcaLevels: [{ percent: -30, multiplier: 1 }] } };
    const single = simulateTradesForSymbolReplay({
      symbol: 'BTCUSDT', candles: exitCandles, marketType: 'FUTURES', leverage: 1,
      marginMode: 'CROSSED', strategyConfig: config,
      positionSizing: { mode: 'fixed', fixedQuantity: 1 },
      fillModelConfig: { feeRate: 0, slippageRate: 0 },
    });
    const portfolio = simulateInterleavedPortfolio({
      symbols: ['BTCUSDT'], candlesBySymbol: new Map([['BTCUSDT', exitCandles]]),
      marketType: 'FUTURES', leverage: 1, marginMode: 'CROSSED',
      strategyConfig: config, walletRiskPercent: 10, initialBalance: 10,
      fillModelConfig: { feeRate: 0, slippageRate: 0 },
    }).perSymbol.BTCUSDT;

    for (const result of [single, portfolio]) {
      expect(result.eventCounts.DCA).toBe(2);
      expect(result.eventCounts.SL).toBe(1);
      expect(result.events.filter((event) => event.type === 'DCA').map((event) => event.price))
        .toEqual([0.7, 0.5764]);
      expect(result.events.find((event) => event.type === 'SL')?.price).toBe(0.5424);
      expect(result.trades[0].entryPrice).toBeCloseTo(0.678, 2);
      expect(result.trades[0].exitReason).toBe('SL');
    }
  });

  it('persists basic TP as TP in both replay paths', () => {
    const config = { ...strategyConfig,
      close: { mode: 'basic', tp: 20, sl: 99 },
      additional: { ...strategyConfig.additional, dcaEnabled: false, dcaTimes: 0 },
    };
    for (const result of replayBothTrailingPaths([0.99, 1, 1, 1.3, 0.99], config)) {
      expect(result.eventCounts.TP).toBe(1);
      expect(result.trades.filter((trade) => trade.exitReason === 'TP')).toHaveLength(1);
    }
  });

  it('replays two adds in the single-symbol path and resumes from the same saved snapshot', () => {
    const run = (config: Record<string, unknown>) => simulateTradesForSymbolReplay({
      symbol: 'BTCUSDT', candles, marketType: 'FUTURES', leverage: 1, marginMode: 'CROSSED',
      strategyConfig: config, positionSizing: { mode: 'fixed', fixedQuantity: 1 },
      fillModelConfig: { feeRate: 0, slippageRate: 0 },
    });
    const first = run(strategyConfig);
    const restarted = run(JSON.parse(JSON.stringify(strategyConfig)));

    expect(first.eventCounts.DCA).toBe(2);
    expect(first.events.filter((event) => event.type === 'DCA').map((event) => event.price))
      .toEqual([0.6949, 0.5375]);
    expect(first.trades[0].entryPrice * first.trades[0].quantity).toBeCloseTo(9, 3);
    const fills = first.events.filter((event) => event.contribution);
    expect(fills.map((event) => [event.type, event.contribution?.addSequence,
      event.contribution?.levelIndex, event.contribution?.triggerPercent,
      event.contribution?.multiplier, event.price]))
      .toEqual([
        ['ENTRY', 0, null, null, null, 1],
        ['DCA', 1, 0, -30.5, 2, 0.6949],
        ['DCA', 2, 1, -30.5, 2, 0.5375],
      ]);
    fills.forEach((event, index) => expect(event.contribution?.contributionUsdt)
      .toBeCloseTo([1, 2, 6][index], 6));
    expect(restarted.trades).toEqual(first.trades);
    expect(restarted.events).toEqual(first.events);
  });

  it('uses the same USDT sizing and reserved quote margin in interleaved portfolio replay', () => {
    const result = simulateInterleavedPortfolio({
      symbols: ['BTCUSDT'], candlesBySymbol: new Map([['BTCUSDT', candles]]),
      marketType: 'FUTURES', leverage: 1, marginMode: 'CROSSED',
      strategyConfig, walletRiskPercent: 10, initialBalance: 10,
      fillModelConfig: { feeRate: 0, slippageRate: 0 },
    });
    const symbol = result.perSymbol.BTCUSDT;

    expect(symbol.eventCounts.DCA).toBe(2);
    expect(symbol.trades[0].entryPrice * symbol.trades[0].quantity).toBeCloseTo(9, 3);
    const fills = symbol.events.filter((event) => event.contribution);
    expect(fills.map((event) => event.contribution?.addSequence)).toEqual([0, 1, 2]);
    fills.forEach((event, index) => expect(event.contribution?.contributionUsdt)
      .toBeCloseTo([1, 2, 6][index], 6));
  });

  it('keeps advanced level pairs and executes 1 then 0.5 times current USDT contribution in both paths', () => {
    const single = simulateTradesForSymbolReplay({
      symbol: 'BTCUSDT', candles: advancedCandles, marketType: 'FUTURES',
      leverage: 1, marginMode: 'CROSSED', strategyConfig: advancedStrategyConfig,
      positionSizing: { mode: 'fixed', fixedQuantity: 1 },
      fillModelConfig: { feeRate: 0, slippageRate: 0 },
    });
    const portfolio = simulateInterleavedPortfolio({
      symbols: ['BTCUSDT'], candlesBySymbol: new Map([['BTCUSDT', advancedCandles]]),
      marketType: 'FUTURES', leverage: 1, marginMode: 'CROSSED',
      strategyConfig: advancedStrategyConfig, walletRiskPercent: 10, initialBalance: 10,
      fillModelConfig: { feeRate: 0, slippageRate: 0 },
    }).perSymbol.BTCUSDT;

    for (const result of [single, portfolio]) {
      expect(result.eventCounts.DCA).toBe(2);
      expect(result.trades[0].entryPrice * result.trades[0].quantity).toBeCloseTo(3, 3);
      const adds = result.events.filter((event) => event.type === 'DCA');
      expect(adds.map((event) => [event.contribution?.levelIndex,
        event.contribution?.triggerPercent, event.contribution?.multiplier]))
        .toEqual([[0, -20, 1], [1, -30, 0.5]]);
      adds.forEach((event) => expect(event.contribution?.contributionUsdt).toBeCloseTo(1, 6));
    }
  });

  it('keeps old snapshots on quantity sizing and rejects unknown or incomplete USDT versions', () => {
    expect(parseStrategyRiskConfig({ additional: { dcaTimes: 1 } }).dcaSizingBasis)
      .toBe('quantity_v1');
    expect(() => parseStrategyRiskConfig({ additional: { dcaSizingBasis: 'future_version' } }))
      .toThrow('Unsupported DCA sizing basis');
    expect(() => parseStrategyRiskConfig({ additional: {
      dcaSizingBasis: 'usdt_contribution_v1', dcaTimes: 1,
      dcaLevels: [{ percent: -20 }],
    } })).toThrow('Invalid USDT DCA level');
  });

  it('keeps DCA USDT contribution on confirmed fill notional when replay charges a nonzero fee', () => {
    const run = (feeRate: number) => simulateTradesForSymbolReplay({
      symbol: 'BTCUSDT', candles, marketType: 'FUTURES', leverage: 1,
      marginMode: 'CROSSED', strategyConfig,
      positionSizing: { mode: 'fixed', fixedQuantity: 1 },
      fillModelConfig: { feeRate, slippageRate: 0 },
    });
    const free = run(0);
    const charged = run(0.01);

    expect(charged.eventCounts.DCA).toBe(2);
    expect(charged.trades[0].entryPrice).toBe(free.trades[0].entryPrice);
    expect(charged.trades[0].quantity).toBe(free.trades[0].quantity);
    expect(charged.trades[0].entryPrice * charged.trades[0].quantity).toBeCloseTo(9, 3);
    expect(charged.trades[0].fee).toBeGreaterThan(free.trades[0].fee);
  });

  it('replays confirmed positive DCA before a later crossed TTP tick in both engines', () => {
    const config = {
      open: { direction: 'long', noMatchAction: 'EXIT',
        indicatorsLong: [{ name: 'MOMENTUM', condition: '>', value: 0.5,
          params: { period: 1 } }], indicatorsShort: [] },
      close: { mode: 'advanced', ttp: [{ percent: 20, arm: 10 }], tsl: [] },
      additional: { dcaEnabled: true, dcaMode: 'advanced', dcaTimes: 1,
        dcaSizingBasis: 'usdt_contribution_v1',
        dcaLevels: [{ percent: 25, multiplier: 1 }] },
    };
    const closePrices = [0.2, 1, 1, 0.99, 1.24, 1.13, 1.13];
    const orderedCandles = closePrices.map((price, index) => {
      const openTime = 1_710_000_000_000 + index * 60_000;
      const closeTime = openTime + 59_999;
      return { openTime, closeTime, open: index === 5 ? 1.25 : price,
        high: index === 5 ? 1.25 : price, low: price, close: price,
        volume: 1_000, intrabarTicks: index === 5 ? [
          { eventTime: openTime + 20_000, price: 1.25 },
          { eventTime: closeTime, price: 1.13 },
        ] : undefined };
    });
    const run = (withTicks: boolean) => {
      const tape = orderedCandles.map((candle) => ({ ...candle,
        intrabarTicks: withTicks ? candle.intrabarTicks : undefined }));
      return [
        simulateTradesForSymbolReplay({ symbol: 'BTCUSDT', candles: tape,
          marketType: 'FUTURES', leverage: 1, marginMode: 'ISOLATED',
          strategyConfig: config, positionSizing: { mode: 'fixed', fixedQuantity: 100,
            referenceBalance: 1_000 }, fillModelConfig: { feeRate: 0.0004, slippageRate: 0 } }),
        simulateInterleavedPortfolio({ symbols: ['BTCUSDT'],
          candlesBySymbol: new Map([['BTCUSDT', tape]]), marketType: 'FUTURES',
          leverage: 1, marginMode: 'ISOLATED', strategyConfig: config,
          walletRiskPercent: 10, initialBalance: 1_000,
          fillModelConfig: { feeRate: 0.0004, slippageRate: 0 } }).perSymbol.BTCUSDT,
      ];
    };
    for (const result of run(true)) {
      expect(result.events.filter((event) => event.type === 'DCA').map((event) =>
        [event.candleIndex, event.price])).toEqual([[5, 1.25]]);
      expect(result.trades).toHaveLength(1);
      expect(result.trades[0].exitReason).toBe('TTP');
      expect(result.trades[0].closedAt.getTime()).toBe(orderedCandles[5].closeTime);
      expect(result.trades[0].exitPrice).toBe(1.13);
    }
    for (const result of run(false)) {
      expect(result.eventCounts.DCA).toBe(1);
      expect(result.trades[0].closedAt.getTime()).toBe(orderedCandles[6].closeTime);
    }
  });
});
