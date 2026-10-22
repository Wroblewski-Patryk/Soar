import { describe, expect, it } from 'vitest';
import { gateFuturesEconomicsFromMarket, isMatchingGateFuturesEconomics,
  resolveCcxtFillCostEvidence } from './gateFuturesEconomics';

const market = () => ({
  contract: true, linear: true, inverse: false, quote: 'USDT', settle: 'USDT',
  contractSize: 0.01,
  info: { name: 'BTC_USDT', type: 'direct', quanto_multiplier: '0.01' },
});

describe('Gate fill cost and fee provenance', () => {
  const input = { ccxtCost: undefined, quoteQty: undefined, price: 100, quantity: 100,
    gateDerivative: true, rawFeeCurrency: undefined, feeCost: 0.04, feeCurrency: 'USDT' };

  it('keeps a missing nonunit cost unknown instead of calling price times contracts CCXT cost', () => {
    expect(resolveCcxtFillCostEvidence(input)).toMatchObject({
      notional: 0, notionalSource: 'UNKNOWN', notionalCurrency: null,
      feeCurrencySource: 'CCXT_SETTLE_INFERRED',
    });
    expect(100 * 100 * 0.01).toBe(100);
  });

  it('distinguishes raw quote quantity from CCXT cost', () => {
    expect(resolveCcxtFillCostEvidence({ ...input, quoteQty: '100' })).toMatchObject({
      notional: 100, notionalSource: 'QUOTE_QTY_FIELD_UNVERIFIED',
    });
  });

  it.each([
    ['USDT', 'VENUE_FIELD'],
    ['BTC', 'CURRENCY_CONFLICT'],
    [undefined, 'CCXT_SETTLE_INFERRED'],
  ] as const)('checks raw fee currency %s against normalized currency', (rawFeeCurrency, source) => {
    expect(resolveCcxtFillCostEvidence({ ...input, rawFeeCurrency }).feeCurrencySource).toBe(source);
  });
});

describe('Gate FUTURES economics evidence', () => {
  it('accepts only matching raw direct and normalized linear USDT metadata', () => {
    const snapshot = gateFuturesEconomicsFromMarket(market());
    expect(snapshot).toMatchObject({ contract: 'BTC_USDT', contractType: 'direct',
      quote: 'USDT', settle: 'USDT', quantoMultiplier: 0.01, contractSize: 0.01 });
    expect(isMatchingGateFuturesEconomics(snapshot, 0.01, 'BTCUSDT')).toBe(true);
    expect(isMatchingGateFuturesEconomics(snapshot, 0.02, 'BTCUSDT')).toBe(false);
    expect(isMatchingGateFuturesEconomics(snapshot, 0.01, 'ETHUSDT')).toBe(false);
  });

  it.each([
    { info: { name: 'BTC_USDT', type: 'inverse', quanto_multiplier: '0.01' } },
    { info: { name: 'BTC_USDT', quanto_multiplier: '0.01' } },
    { info: { name: 'BTC_USDT', type: 'direct', quanto_multiplier: '0' } },
    { info: { name: 'BTC_USDT', type: 'direct', quanto_multiplier: '0.02' } },
    { info: { name: 'BTC_USDT', type: 'direct', quanto_multiplier: '0.01',
      settle_currency: 'BTC' } },
    { linear: false, inverse: true },
    { quote: 'USD' },
    { settle: 'BTC' },
  ])('rejects missing, inverse or mismatched metadata %#', (change) => {
    expect(gateFuturesEconomicsFromMarket({ ...market(), ...change })).toBeNull();
  });
});
