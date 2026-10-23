import { describe, expect, it } from 'vitest';
import { computeTradeFee, resolveEstimatedFeeContractSize } from './executionOrchestrator.helpers';

const gateEconomics = (contractSize: number) => ({
  source: 'GATE_API_V4_CONTRACT_CCXT_MARKET', contract: 'BTC_USDT',
  contractType: 'direct', linear: true, inverse: false, quote: 'USDT', settle: 'USDT',
  quantoMultiplier: contractSize, contractSize,
});

describe('estimated runtime fee contract unit', () => {
  const gateFutures = { exchange: 'GATEIO', marketType: 'FUTURES' } as const;
  const order = { symbol: 'BTCUSDT', contractSize: 0.01, gateFuturesEconomics: gateEconomics(0.01) };
  const position = { ...order };

  it('estimates OPEN and CLOSE fees from verified contract notional', () => {
    const entryUnit = resolveEstimatedFeeContractSize({ market: gateFutures, order });
    const exitUnit = resolveEstimatedFeeContractSize({ market: gateFutures, order, position });
    expect(computeTradeFee(100, 100, 0.0004, entryUnit)).toBeCloseTo(0.04, 10);
    expect(computeTradeFee(120, 176, 0.0004, exitUnit)).toBeCloseTo(0.08448, 10);
  });

  it('fails closed on missing or conflicting Gate unit evidence', () => {
    expect(() => resolveEstimatedFeeContractSize({ market: gateFutures,
      order: { ...order, contractSize: null, gateFuturesEconomics: null } })).toThrow();
    expect(() => resolveEstimatedFeeContractSize({ market: gateFutures,
      order: { ...order, gateFuturesEconomics: gateEconomics(1) } })).toThrow();
    expect(() => resolveEstimatedFeeContractSize({ market: gateFutures, order,
      position: { ...position, contractSize: null, gateFuturesEconomics: null } })).toThrow();
    expect(() => resolveEstimatedFeeContractSize({ market: gateFutures, order,
      position: { ...position, contractSize: 1, gateFuturesEconomics: gateEconomics(1) } })).toThrow();
  });

  it('preserves SPOT, Binance, and verified Gate unit one', () => {
    const legacy = { symbol: 'BTCUSDT', contractSize: null, gateFuturesEconomics: null };
    expect(resolveEstimatedFeeContractSize({ market: { exchange: 'GATEIO', marketType: 'SPOT' }, order: legacy })).toBe(1);
    expect(resolveEstimatedFeeContractSize({ market: { exchange: 'BINANCE', marketType: 'FUTURES' }, order: legacy })).toBe(1);
    expect(resolveEstimatedFeeContractSize({ market: gateFutures,
      order: { ...legacy, contractSize: 1 } })).toBe(1);
  });
});
