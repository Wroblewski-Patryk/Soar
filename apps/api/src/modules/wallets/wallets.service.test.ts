import { describe, expect, it } from 'vitest';
import { buildWalletOpenPnlWhere } from './wallets.service';

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
