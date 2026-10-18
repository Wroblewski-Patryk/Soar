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

describe('USDT contribution DCA in historical replay', () => {
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
});
