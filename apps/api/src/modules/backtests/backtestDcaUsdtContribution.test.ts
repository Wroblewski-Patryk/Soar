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

describe('USDT contribution DCA in historical replay', () => {
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
