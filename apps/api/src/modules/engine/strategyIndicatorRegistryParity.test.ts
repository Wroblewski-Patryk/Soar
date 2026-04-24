import { describe, expect, it } from 'vitest';
import { getStrategyIndicatorRegistry } from './strategyIndicatorRegistry';
import { buildStrategySignalAnalysis } from './strategySignalAnalysis';
import { evaluateStrategySignalAtIndex, parseStrategySignalRules } from './strategySignalEvaluator';

const sampleCandles = Array.from({ length: 80 }, (_, index) => {
  const base = 100 + index * 0.35 + Math.sin(index / 4) * 6 + Math.cos(index / 7) * 2;
  return {
    open: base - 0.8,
    high: base + 1.4,
    low: base - 1.3,
    close: base,
    volume: 1_000 + index * 10,
  };
});

const sampleDerivatives = {
  fundingRate: Array.from({ length: sampleCandles.length }, (_, index) => 0.0001 + index * 0.00001),
  openInterest: Array.from({ length: sampleCandles.length }, (_, index) => 10_000 + index * 20),
  orderBookImbalance: Array.from({ length: sampleCandles.length }, (_, index) => 0.1 + index * 0.001),
  orderBookSpreadBps: Array.from({ length: sampleCandles.length }, (_, index) => 4 + index * 0.01),
  orderBookDepthRatio: Array.from({ length: sampleCandles.length }, (_, index) => 1.1 + index * 0.005),
};

const defaultTargetByIndicator = (key: string) => {
  if (key.startsWith('FUNDING_RATE')) return 0;
  if (key.startsWith('OPEN_INTEREST')) return 0;
  if (key.startsWith('ORDER_BOOK')) return 0;
  if (key === 'BULLISH_ENGULFING' || key === 'BEARISH_ENGULFING') return 0;
  if (key === 'HAMMER' || key === 'SHOOTING_STAR' || key === 'DOJI') return 0;
  if (key === 'MORNING_STAR' || key === 'EVENING_STAR' || key === 'INSIDE_BAR' || key === 'OUTSIDE_BAR') {
    return 0;
  }
  return 50;
};

describe('strategyIndicatorRegistry parity', () => {
  it('keeps every builder-exposed indicator executable through the shared evaluator and analysis surface', () => {
    for (const indicator of getStrategyIndicatorRegistry()) {
      const strategyConfig = {
        open: {
          direction: 'long',
          indicatorsLong: [
            {
              name: indicator.key,
              condition: indicator.operators[0],
              value:
                indicator.operators[0] === 'IN_RANGE' || indicator.operators[0] === 'OUT_OF_RANGE'
                  ? [defaultTargetByIndicator(indicator.key) - 1, defaultTargetByIndicator(indicator.key) + 1]
                  : defaultTargetByIndicator(indicator.key),
              params: Object.fromEntries(
                indicator.params.map((param) => [param.name, param.default]),
              ),
            },
          ],
          indicatorsShort: [],
        },
      };
      const rules = parseStrategySignalRules(strategyConfig);

      expect(rules).not.toBeNull();

      const direction = evaluateStrategySignalAtIndex(
        rules!,
        sampleCandles,
        sampleCandles.length - 1,
        new Map(),
        { derivatives: sampleDerivatives },
      );
      const analysis = buildStrategySignalAnalysis({
        strategyConfig,
        candles: sampleCandles,
        decisionIndex: sampleCandles.length - 1,
        derivatives: sampleDerivatives,
      });

      expect(['LONG', 'SHORT', 'EXIT', null]).toContain(direction);
      expect(analysis.conditionLines.length).toBeGreaterThan(0);
      const unresolvedLine = analysis.conditionLines.find((line) => line.value === 'n/a');
      expect(unresolvedLine, `${indicator.key} produced unresolved analysis`).toBeUndefined();
      expect(analysis.indicatorSummary).not.toBeNull();
    }
  });
});
