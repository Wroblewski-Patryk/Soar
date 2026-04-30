import { describe, expect, it } from 'vitest';
import { normalizeExchangePosition } from './positions.exchangeSnapshotNormalization';

describe('positions exchange snapshot normalization', () => {
  it('prefers isolated wallet as marginUsed truth for isolated futures positions', () => {
    const normalized = normalizeExchangePosition({
      symbol: 'DOGEUSDT',
      side: 'SHORT',
      contracts: 108,
      entryPrice: 0.1044675925926,
      markPrice: 0.10645,
      unrealizedPnl: -0.21409999999920087,
      leverage: 15,
      marginMode: 'isolated',
      info: {
        marginType: 'isolated',
        initialMargin: '0.7692281',
        positionInitialMargin: '0.7692281',
        isolatedMargin: '0.7692281',
        isolatedWallet: '1.36800000',
      },
    });

    expect(normalized.marginUsed).toBe(1.368);
  });

  it('keeps initial margin precedence for non-isolated positions', () => {
    const normalized = normalizeExchangePosition({
      symbol: 'DOGEUSDT',
      side: 'SHORT',
      contracts: 108,
      entryPrice: 0.1044675925926,
      markPrice: 0.10645,
      unrealizedPnl: -0.21409999999920087,
      leverage: 15,
      marginMode: 'cross',
      info: {
        marginType: 'cross',
        initialMargin: '0.7692281',
        positionInitialMargin: '0.7692281',
        isolatedMargin: '0.90000000',
        isolatedWallet: '1.36800000',
      },
    });

    expect(normalized.marginUsed).toBe(0.7692281);
  });
});
