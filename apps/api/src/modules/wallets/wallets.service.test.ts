import { describe, expect, it } from 'vitest';
import {
  buildPaperResetOpenPositionsWhere,
  buildWalletClosedPaperPositionPnlWhere,
  buildWalletOpenPnlWhere,
} from './wallets.service';

describe('buildWalletOpenPnlWhere', () => {
  it('includes PAPER bot-owned positions through the bot wallet relation', () => {
    expect(
      buildWalletOpenPnlWhere({
        userId: 'user-1',
        walletId: 'wallet-paper',
        mode: 'PAPER',
        marketType: 'FUTURES',
      })
    ).toEqual({
      userId: 'user-1',
      status: 'OPEN',
      syncState: 'IN_SYNC',
      unrealizedPnl: { not: null },
      OR: [
        { walletId: 'wallet-paper' },
        {
          bot: {
            walletId: 'wallet-paper',
          },
        },
      ],
    });
  });

  it('keeps LIVE imported open-PnL wallet scope by market-aware external id', () => {
    expect(
      buildWalletOpenPnlWhere({
        userId: 'user-1',
        walletId: 'wallet-live',
        mode: 'LIVE',
        marketType: 'FUTURES',
        apiKeyId: 'api-key-1',
      })
    ).toEqual({
      userId: 'user-1',
      status: 'OPEN',
      syncState: 'IN_SYNC',
      unrealizedPnl: { not: null },
      OR: [
        { walletId: 'wallet-live' },
        {
          walletId: null,
          origin: 'EXCHANGE_SYNC',
          externalId: {
            startsWith: 'api-key-1:FUTURES:',
          },
        },
      ],
    });
  });
});

describe('buildWalletClosedPaperPositionPnlWhere', () => {
  it('includes direct and bot-owned PAPER closed position realized PnL', () => {
    expect(
      buildWalletClosedPaperPositionPnlWhere({
        userId: 'user-1',
        walletId: 'wallet-paper',
      })
    ).toEqual({
      userId: 'user-1',
      status: { not: 'OPEN' },
      syncState: 'IN_SYNC',
      realizedPnl: { not: null },
      closedAt: { not: null },
      OR: [
        { walletId: 'wallet-paper' },
        {
          bot: {
            walletId: 'wallet-paper',
          },
        },
      ],
    });
  });

  it('filters PAPER closed position realized PnL by close window', () => {
    expect(
      buildWalletClosedPaperPositionPnlWhere({
        userId: 'user-1',
        walletId: 'wallet-paper',
        query: {
          from: '2026-05-01T00:00:00.000Z',
          to: '2026-05-04T00:00:00.000Z',
        },
      })
    ).toEqual({
      userId: 'user-1',
      status: { not: 'OPEN' },
      syncState: 'IN_SYNC',
      realizedPnl: { not: null },
      closedAt: {
        not: null,
        gte: new Date('2026-05-01T00:00:00.000Z'),
        lte: new Date('2026-05-04T00:00:00.000Z'),
      },
      OR: [
        { walletId: 'wallet-paper' },
        {
          bot: {
            walletId: 'wallet-paper',
          },
        },
      ],
    });
  });
});

describe('buildPaperResetOpenPositionsWhere', () => {
  it('blocks reset on direct wallet and PAPER bot-owned open positions', () => {
    expect(
      buildPaperResetOpenPositionsWhere({
        userId: 'user-1',
        walletId: 'wallet-paper',
      })
    ).toEqual({
      userId: 'user-1',
      status: 'OPEN',
      syncState: 'IN_SYNC',
      OR: [
        { walletId: 'wallet-paper' },
        {
          bot: {
            walletId: 'wallet-paper',
          },
        },
      ],
    });
  });
});
