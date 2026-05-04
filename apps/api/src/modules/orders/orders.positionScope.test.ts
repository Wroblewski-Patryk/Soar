import { describe, expect, it } from 'vitest';
import { resolveCreatedPositionWalletId } from './orders.lifecycle.service';
import { resolveOpenPositionScopeWhere } from './orders.positionScope';

describe('resolveOpenPositionScopeWhere', () => {
  it('prefers bot scope for PAPER positions even when wallet id is present', () => {
    expect(
      resolveOpenPositionScopeWhere({
        userId: 'user-1',
        symbol: 'dogeusdt',
        mode: 'PAPER',
        botId: 'bot-paper',
        walletId: 'wallet-shared',
      })
    ).toEqual({
      userId: 'user-1',
      symbol: 'DOGEUSDT',
      status: 'OPEN',
      syncState: 'IN_SYNC',
      botId: 'bot-paper',
      walletId: null,
    });
  });

  it('keeps wallet scope for LIVE positions when wallet id is present', () => {
    expect(
      resolveOpenPositionScopeWhere({
        userId: 'user-1',
        symbol: 'dogeusdt',
        mode: 'LIVE',
        botId: 'bot-live',
        walletId: 'wallet-live',
      })
    ).toEqual({
      userId: 'user-1',
      symbol: 'DOGEUSDT',
      status: 'OPEN',
      syncState: 'IN_SYNC',
      walletId: 'wallet-live',
    });
  });
});

describe('resolveCreatedPositionWalletId', () => {
  it('stores PAPER bot positions in the bot-scoped DB uniqueness lane', () => {
    expect(
      resolveCreatedPositionWalletId({
        mode: 'PAPER',
        botId: 'bot-paper',
        walletId: 'wallet-paper',
      })
    ).toBeNull();
  });

  it('preserves wallet id for LIVE positions', () => {
    expect(
      resolveCreatedPositionWalletId({
        mode: 'LIVE',
        botId: 'bot-live',
        walletId: 'wallet-live',
      })
    ).toBe('wallet-live');
  });
});
