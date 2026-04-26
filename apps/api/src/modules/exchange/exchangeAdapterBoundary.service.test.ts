import { describe, expect, it, vi } from 'vitest';

import {
  fetchSupportedExchangeOpenOrdersRaw,
  fetchSupportedExchangePositionsRaw,
  submitLiveOrderThroughBoundary,
} from './exchangeAdapterBoundary.service';
import {
  ExchangeExecutionCapabilityUnsupportedError,
} from './exchangeExecutionCapabilityContract.service';

const createConnector = () => ({
  fetchPositions: vi.fn(async () => [{ symbol: 'BTC/USDT:USDT', contracts: 1 }]),
  fetchOpenOrders: vi.fn(async () => [{ id: 'ord-1', symbol: 'BTC/USDT:USDT' }]),
  disconnect: vi.fn(async () => undefined),
  hasOpenPosition: vi.fn(async () => false),
  getSymbolTradingRules: vi.fn(async () => ({
    minAmount: null,
    minNotional: null,
    amountPrecision: null,
  })),
  fetchMarkPrice: vi.fn(async () => 100_000),
  convergeFuturesLeverageAndMargin: vi.fn(async () => undefined),
});

describe('exchangeAdapterBoundary.service', () => {
  it('reads Binance positions and open orders through one feature-facing boundary', async () => {
    const connector = createConnector();
    const createAuthenticatedConnector = vi.fn(() => connector);
    const params = {
      exchange: 'BINANCE' as const,
      marketType: 'FUTURES' as const,
      apiKey: 'enc-key',
      apiSecret: 'enc-secret',
    };

    const [positions, orders] = await Promise.all([
      fetchSupportedExchangePositionsRaw(params, { createAuthenticatedConnector }),
      fetchSupportedExchangeOpenOrdersRaw(params, { createAuthenticatedConnector }),
    ]);

    expect(createAuthenticatedConnector).toHaveBeenCalledTimes(2);
    expect(positions).toEqual([{ symbol: 'BTC/USDT:USDT', contracts: 1 }]);
    expect(orders).toEqual([{ id: 'ord-1', symbol: 'BTC/USDT:USDT' }]);
    expect(connector.disconnect).toHaveBeenCalledTimes(2);
  });

  it('fails closed for unsupported read exchanges at the boundary', async () => {
    await expect(
      fetchSupportedExchangePositionsRaw(
        {
          exchange: 'BYBIT',
          marketType: 'FUTURES',
          apiKey: 'enc-key',
          apiSecret: 'enc-secret',
        },
        {
          createAuthenticatedConnector: vi.fn(() => createConnector()),
        }
      )
    ).rejects.toThrowError(ExchangeExecutionCapabilityUnsupportedError);
  });

  it('submits live orders through the boundary and normalizes adapter output', async () => {
    const connector = createConnector();
    const createAuthenticatedConnector = vi.fn(() => connector);
    const resolveLiveExecutionApiKey = vi.fn(async () => ({
      id: 'api-key-1',
      exchange: 'BINANCE' as const,
      apiKey: 'enc-key',
      apiSecret: 'enc-secret',
    }));
    const createLiveOrderAdapter = vi.fn(() => ({
      placeLiveOrderWithFees,
    }));
    const placeLiveOrderWithFees = vi.fn(async () => ({
      exchangeOrderId: 'binance-order-1',
      status: 'open',
      rawOrderStatus: 'open',
      fee: 1.25,
      feeSource: 'EXCHANGE_FILL' as const,
      feePending: false,
      feeCurrency: 'USDT',
      effectiveFeeRate: 0.001,
      exchangeTradeId: 'trade-1',
      fills: [],
    }));

    const result = await submitLiveOrderThroughBoundary(
      {
        userId: 'user-1',
        bot: {
          exchange: 'BINANCE',
          marketType: 'FUTURES',
          positionMode: 'ONE_WAY',
          apiKeyId: 'api-key-1',
          walletId: 'wallet-1',
        },
        order: {
          symbol: 'BTCUSDT',
          side: 'BUY',
          type: 'LIMIT',
          quantity: 0.1,
          price: 100_000,
        },
        targetLeverage: 5,
      },
      {
        createAuthenticatedConnector,
        fetchBalanceRaw: vi.fn(),
        resolveLiveExecutionApiKey,
        createLiveOrderAdapter,
        enforceLivePretradeGuards: vi.fn(async () => undefined),
        convergeLiveMarginAndLeverageIfNeeded: vi.fn(async () => undefined),
      }
    );

    expect(resolveLiveExecutionApiKey).toHaveBeenCalledOnce();
    expect(createAuthenticatedConnector).toHaveBeenCalledOnce();
    expect(createLiveOrderAdapter).toHaveBeenCalledWith({
      exchange: 'BINANCE',
      marketType: 'FUTURES',
      connector,
    });
    expect(placeLiveOrderWithFees).toHaveBeenCalledWith({
      order: {
        symbol: 'BTCUSDT',
        side: 'buy',
        type: 'limit',
        amount: 0.1,
        price: 100_000,
        positionMode: 'ONE_WAY',
      },
    });
    expect(connector.disconnect).toHaveBeenCalledOnce();
    expect(result).toEqual({
      exchangeOrderId: 'binance-order-1',
      status: 'OPEN',
      fee: 1.25,
      feeSource: 'EXCHANGE_FILL',
      feePending: false,
      feeCurrency: 'USDT',
      effectiveFeeRate: 0.001,
      exchangeTradeId: 'trade-1',
      fills: [],
    });
  });

  it('fails closed when resolved api key exchange drifts from selected bot exchange', async () => {
    const createAuthenticatedConnector = vi.fn(() => createConnector());
    const resolveLiveExecutionApiKey = vi.fn(async () => ({
      id: 'api-key-1',
      exchange: 'BINANCE' as const,
      apiKey: 'enc-key',
      apiSecret: 'enc-secret',
    }));

    await expect(
      submitLiveOrderThroughBoundary(
        {
          userId: 'user-1',
          bot: {
            exchange: 'BYBIT',
            marketType: 'FUTURES',
            positionMode: 'ONE_WAY',
            apiKeyId: 'api-key-1',
            walletId: 'wallet-1',
          },
          order: {
            symbol: 'BTCUSDT',
            side: 'BUY',
            type: 'LIMIT',
            quantity: 0.1,
            price: 100_000,
          },
          targetLeverage: 5,
        },
        {
          createAuthenticatedConnector,
          fetchBalanceRaw: vi.fn(),
          resolveLiveExecutionApiKey,
          createLiveOrderAdapter: vi.fn(),
          enforceLivePretradeGuards: vi.fn(async () => undefined),
          convergeLiveMarginAndLeverageIfNeeded: vi.fn(async () => undefined),
        }
      )
    ).rejects.toMatchObject({ code: 'LIVE_API_KEY_REQUIRED' });
    expect(createAuthenticatedConnector).not.toHaveBeenCalled();
  });
});
