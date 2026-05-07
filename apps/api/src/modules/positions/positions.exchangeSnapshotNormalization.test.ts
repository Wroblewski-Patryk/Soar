import { describe, expect, it } from 'vitest';
import { normalizeExchangePosition } from './positions.exchangeSnapshotNormalization';

describe('positions exchange snapshot normalization', () => {
  it('derives one-way futures side and absolute contracts from signed Binance positionAmt', () => {
    const normalized = normalizeExchangePosition({
      symbol: 'DOGEUSDT',
      info: {
        symbol: 'DOGEUSDT',
        positionAmt: '-216',
        positionSide: 'BOTH',
        entryPrice: '0.1056787962963',
        markPrice: '0.1058900062963',
        unRealizedProfit: '-0.04562136',
        leverage: '15',
        marginType: 'isolated',
        isolatedWallet: '1.52177466',
      },
    });

    expect(normalized).toMatchObject({
      symbol: 'DOGEUSDT',
      side: 'SHORT',
      contracts: 216,
      entryPrice: 0.1056787962963,
      markPrice: 0.1058900062963,
      unrealizedPnl: -0.04562136,
      leverage: 15,
      marginMode: 'isolated',
      marginUsed: 1.52177466,
    });
  });

  it('keeps explicit hedge-mode side while normalizing contracts as positive quantity', () => {
    const normalized = normalizeExchangePosition({
      symbol: 'ETHUSDT',
      info: {
        symbol: 'ETHUSDT',
        positionAmt: '-0.2',
        positionSide: 'SHORT',
        entryPrice: '3200',
        markPrice: '3190',
        unRealizedProfit: '2',
        leverage: '4',
        marginType: 'cross',
        initialMargin: '159.5',
      },
    });

    expect(normalized).toMatchObject({
      symbol: 'ETHUSDT',
      side: 'SHORT',
      contracts: 0.2,
      entryPrice: 3200,
      markPrice: 3190,
      unrealizedPnl: 2,
      leverage: 4,
      marginMode: 'cross',
      marginUsed: 159.5,
    });
  });

  it('normalizes multi-position futures snapshots without leaking signed quantities', () => {
    const normalized = [
      normalizeExchangePosition({
        symbol: 'BTCUSDT',
        info: { positionAmt: '0.01', positionSide: 'BOTH', entryPrice: '68000' },
      }),
      normalizeExchangePosition({
        symbol: 'ETHUSDT',
        info: { positionAmt: '-0.2', positionSide: 'SHORT', entryPrice: '3200' },
      }),
      normalizeExchangePosition({
        symbol: 'SOLUSDT',
        side: 'long',
        contracts: 2,
        info: { positionAmt: '2', positionSide: 'LONG', entryPrice: '155' },
      }),
    ];

    expect(normalized.map((position) => [position.symbol, position.side, position.contracts])).toEqual([
      ['BTCUSDT', 'LONG', 0.01],
      ['ETHUSDT', 'SHORT', 0.2],
      ['SOLUSDT', 'long', 2],
    ]);
  });

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
