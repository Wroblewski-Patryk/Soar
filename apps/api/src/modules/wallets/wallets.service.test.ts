import { afterEach, describe, expect, it, vi } from 'vitest';
import { fetchSupportedExchangeBalanceRaw } from '../exchange/exchangeAdapterBoundary.service';
import {
  buildPaperResetOpenPositionsWhere,
  buildWalletClosedPaperPositionPnlWhere,
  buildWalletOpenPnlWhere,
  fetchAuthenticatedBalancePreview,
} from './wallets.service';

vi.mock('../exchange/exchangeAdapterBoundary.service', () => ({
  fetchSupportedExchangeBalanceRaw: vi.fn(),
  resolveExchangeAdapterSource: vi.fn(() => 'mocked-exchange-adapter'),
}));

const originalNodeEnv = process.env.NODE_ENV;
const originalVitestEnv = process.env.VITEST;

afterEach(() => {
  process.env.NODE_ENV = originalNodeEnv;
  process.env.VITEST = originalVitestEnv;
  delete process.env.WALLET_PREVIEW_TEST_ACCOUNT_BALANCE;
  delete process.env.WALLET_PREVIEW_TEST_FREE_BALANCE;
  vi.clearAllMocks();
});

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

describe('fetchAuthenticatedBalancePreview', () => {
  it('returns the capped wallet preview balances from the test runtime env', async () => {
    process.env.NODE_ENV = 'test';
    process.env.VITEST = 'true';
    process.env.WALLET_PREVIEW_TEST_ACCOUNT_BALANCE = '125.5';
    process.env.WALLET_PREVIEW_TEST_FREE_BALANCE = '999.9';

    await expect(
      fetchAuthenticatedBalancePreview({
        exchange: 'BINANCE',
        apiKey: 'key',
        apiSecret: 'secret',
        marketType: 'SPOT',
        baseCurrency: 'usdt',
      })
    ).resolves.toEqual({
      accountBalance: 125.5,
      freeBalance: 125.5,
    });

    expect(fetchSupportedExchangeBalanceRaw).not.toHaveBeenCalled();
  });

  it('normalizes the requested currency and extracts balances from the exchange payload', async () => {
    process.env.NODE_ENV = 'production';
    process.env.VITEST = 'false';
    vi.mocked(fetchSupportedExchangeBalanceRaw).mockResolvedValue({
      total: { USDT: '210.25' },
      free: { USDT: '84.5' },
    });

    await expect(
      fetchAuthenticatedBalancePreview({
        exchange: 'BINANCE',
        apiKey: 'key',
        apiSecret: 'secret',
        marketType: 'FUTURES',
        baseCurrency: 'usdt',
      })
    ).resolves.toEqual({
      accountBalance: 210.25,
      freeBalance: 84.5,
    });

    expect(fetchSupportedExchangeBalanceRaw).toHaveBeenCalledWith({
      exchange: 'BINANCE',
      marketType: 'FUTURES',
      apiKey: 'key',
      apiSecret: 'secret',
    });
  });
});
