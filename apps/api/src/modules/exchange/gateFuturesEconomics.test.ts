import { describe, expect, it } from 'vitest';
import { gateFuturesEconomicsFromMarket, isMatchingGateFuturesEconomics } from './gateFuturesEconomics';

const market = () => ({
  contract: true, linear: true, inverse: false, quote: 'USDT', settle: 'USDT',
  contractSize: 0.01,
  info: { name: 'BTC_USDT', type: 'direct', quanto_multiplier: '0.01' },
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
