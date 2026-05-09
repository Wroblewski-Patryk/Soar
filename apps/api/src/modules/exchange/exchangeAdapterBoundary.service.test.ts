import { describe, expect, it, vi } from 'vitest';

import {
  fetchSupportedExchangeBalanceRaw,
  fetchSupportedExchangeOpenOrdersRaw,
  fetchSupportedExchangePositionsRaw,
  fetchSupportedExchangeTradeHistoryRaw,
  fetchSupportedExchangeWalletCashflowHistoryRaw,
  submitLiveOrderThroughBoundary,
} from './exchangeAdapterBoundary.service';
import {
  ExchangeExecutionCapabilityUnsupportedError,
} from './exchangeExecutionCapabilityContract.service';

const createConnector = () => ({
  fetchPositions: vi.fn(async () => [{ symbol: 'BTC/USDT:USDT', contracts: 1 }]),
  fetchOpenOrders: vi.fn(async () => [{ id: 'ord-1', symbol: 'BTC/USDT:USDT' }]),
  fetchTradesForWindow: vi.fn(async () => [
    {
      exchangeTradeId: 'trade-1',
      exchangeOrderId: 'order-1',
      symbol: 'BTC/USDT:USDT',
      side: 'buy',
      price: 100_000,
      quantity: 0.01,
      notional: 1_000,
      feeCost: 1,
      feeCurrency: 'USDT',
      feeRate: 0.001,
      executedAt: new Date('2026-04-29T10:00:00.000Z'),
      source: 'fetchMyTrades' as const,
      raw: {},
    },
  ]),
  fetchWalletCashflowHistory: vi.fn(async () => [
    {
      exchangeEventId: 'deposit-1',
      direction: 'IN' as const,
      type: 'deposit',
      amount: 10,
      currency: 'USDT',
      feeCost: 0,
      feeCurrency: null,
      occurredAt: new Date('2026-04-29T11:00:00.000Z'),
      status: 'ok',
      source: 'fetchDeposits' as const,
      raw: {},
    },
  ]),
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

    const [positions, orders, trades, walletCashflows] = await Promise.all([
      fetchSupportedExchangePositionsRaw(params, { createAuthenticatedConnector }),
      fetchSupportedExchangeOpenOrdersRaw(params, { createAuthenticatedConnector }),
      fetchSupportedExchangeTradeHistoryRaw({
        ...params,
        symbol: 'BTCUSDT',
        since: Date.parse('2026-04-29T00:00:00.000Z'),
        limit: 200,
      }, { createAuthenticatedConnector }),
      fetchSupportedExchangeWalletCashflowHistoryRaw({
        ...params,
        currency: 'USDT',
        since: Date.parse('2026-04-29T00:00:00.000Z'),
        limit: 200,
      }, { createAuthenticatedConnector }),
    ]);

    expect(createAuthenticatedConnector).toHaveBeenCalledTimes(4);
    expect(positions).toEqual([{ symbol: 'BTC/USDT:USDT', contracts: 1 }]);
    expect(orders).toEqual([{ id: 'ord-1', symbol: 'BTC/USDT:USDT' }]);
    expect(trades).toEqual([
      expect.objectContaining({
        exchangeTradeId: 'trade-1',
        symbol: 'BTC/USDT:USDT',
      }),
    ]);
    expect(walletCashflows).toEqual([
      expect.objectContaining({
        exchangeEventId: 'deposit-1',
        direction: 'IN',
        amount: 10,
        currency: 'USDT',
      }),
    ]);
    expect(connector.fetchTradesForWindow).toHaveBeenCalledWith({
      symbol: 'BTCUSDT',
      since: Date.parse('2026-04-29T00:00:00.000Z'),
      limit: 200,
    });
    expect(connector.fetchWalletCashflowHistory).toHaveBeenCalledWith({
      currency: 'USDT',
      since: Date.parse('2026-04-29T00:00:00.000Z'),
      limit: 200,
    });
    expect(connector.disconnect).toHaveBeenCalledTimes(4);
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

  it('reads Gate.io balance preview through the authenticated read boundary only', async () => {
    const fetchBalanceRaw = vi.fn(async () => ({ total: { USDT: 321 }, free: { USDT: 300 } }));

    const result = await fetchSupportedExchangeBalanceRaw(
      {
        exchange: 'GATEIO',
        marketType: 'FUTURES',
        apiKey: 'enc-gateio-key',
        apiSecret: 'enc-gateio-secret',
      },
      { fetchBalanceRaw }
    );

    expect(result).toEqual({ total: { USDT: 321 }, free: { USDT: 300 } });
    expect(fetchBalanceRaw).toHaveBeenCalledWith({
      exchange: 'GATEIO',
      marketType: 'FUTURES',
      apiKey: 'enc-gateio-key',
      apiSecret: 'enc-gateio-secret',
    });

    await expect(
      fetchSupportedExchangeTradeHistoryRaw(
        {
          exchange: 'GATEIO',
          marketType: 'FUTURES',
          apiKey: 'enc-gateio-key',
          apiSecret: 'enc-gateio-secret',
          symbol: 'BTCUSDT',
        },
        {
          createAuthenticatedConnector: vi.fn(() => createConnector()),
        }
      )
    ).rejects.toMatchObject({
      code: 'EXCHANGE_EXECUTION_CAPABILITY_UNSUPPORTED',
      details: {
        exchange: 'GATEIO',
        operation: 'TRADE_HISTORY_SNAPSHOT',
      },
    });
  });

  it('reads Gate.io positions through the authenticated read boundary', async () => {
    const connector = createConnector();
    const createAuthenticatedConnector = vi.fn(() => connector);

    const positions = await fetchSupportedExchangePositionsRaw(
      {
        exchange: 'GATEIO',
        marketType: 'FUTURES',
        apiKey: 'enc-gateio-key',
        apiSecret: 'enc-gateio-secret',
      },
      { createAuthenticatedConnector }
    );

    expect(positions).toEqual([{ symbol: 'BTC/USDT:USDT', contracts: 1 }]);
    expect(createAuthenticatedConnector).toHaveBeenCalledWith({
      exchange: 'GATEIO',
      marketType: 'FUTURES',
      apiKey: 'enc-gateio-key',
      apiSecret: 'enc-gateio-secret',
    });
    expect(connector.disconnect).toHaveBeenCalledOnce();
  });

  it('reads Gate.io open orders through the authenticated read boundary', async () => {
    const connector = createConnector();
    const createAuthenticatedConnector = vi.fn(() => connector);

    const orders = await fetchSupportedExchangeOpenOrdersRaw(
      {
        exchange: 'GATEIO',
        marketType: 'FUTURES',
        apiKey: 'enc-gateio-key',
        apiSecret: 'enc-gateio-secret',
      },
      { createAuthenticatedConnector }
    );

    expect(orders).toEqual([{ id: 'ord-1', symbol: 'BTC/USDT:USDT' }]);
    expect(createAuthenticatedConnector).toHaveBeenCalledWith({
      exchange: 'GATEIO',
      marketType: 'FUTURES',
      apiKey: 'enc-gateio-key',
      apiSecret: 'enc-gateio-secret',
    });
    expect(connector.disconnect).toHaveBeenCalledOnce();
  });

  it('fails closed for Gate.io live order submit before resolving credentials or connectors', async () => {
    const resolveLiveExecutionApiKey = vi.fn();
    const createAuthenticatedConnector = vi.fn(() => createConnector());
    const createLiveOrderAdapter = vi.fn();
    const enforceLivePretradeGuards = vi.fn(async () => undefined);
    const convergeLiveMarginAndLeverageIfNeeded = vi.fn(async () => undefined);

    await expect(
      submitLiveOrderThroughBoundary(
        {
          userId: 'user-gateio-live-submit',
          bot: {
            exchange: 'GATEIO',
            marketType: 'FUTURES',
            positionMode: 'ONE_WAY',
            apiKeyId: 'gateio-key-1',
            walletId: 'gateio-wallet-1',
          },
          order: {
            symbol: 'BTCUSDT',
            side: 'BUY',
            type: 'LIMIT',
            quantity: 0.01,
            price: 100_000,
          },
          targetLeverage: 2,
        },
        {
          createAuthenticatedConnector,
          fetchBalanceRaw: vi.fn(),
          resolveLiveExecutionApiKey,
          createLiveOrderAdapter,
          enforceLivePretradeGuards,
          convergeLiveMarginAndLeverageIfNeeded,
        }
      )
    ).rejects.toMatchObject({
      code: 'EXCHANGE_EXECUTION_CAPABILITY_UNSUPPORTED',
      details: {
        exchange: 'GATEIO',
        operation: 'LIVE_ORDER_SUBMIT',
      },
    });

    expect(resolveLiveExecutionApiKey).not.toHaveBeenCalled();
    expect(createAuthenticatedConnector).not.toHaveBeenCalled();
    expect(createLiveOrderAdapter).not.toHaveBeenCalled();
    expect(enforceLivePretradeGuards).not.toHaveBeenCalled();
    expect(convergeLiveMarginAndLeverageIfNeeded).not.toHaveBeenCalled();
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
        reduceOnly: undefined,
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

  it('submits Binance SPOT live orders through the exact spot adapter family', async () => {
    const connector = createConnector();
    const createAuthenticatedConnector = vi.fn(() => connector);
    const resolveLiveExecutionApiKey = vi.fn(async () => ({
      id: 'api-key-spot-1',
      exchange: 'BINANCE' as const,
      apiKey: 'enc-key',
      apiSecret: 'enc-secret',
    }));
    const placeLiveOrderWithFees = vi.fn(async () => ({
      exchangeOrderId: 'binance-spot-order-1',
      status: 'closed',
      rawOrderStatus: 'filled',
      fee: 0.25,
      feeSource: 'EXCHANGE_FILL' as const,
      feePending: false,
      feeCurrency: 'USDT',
      effectiveFeeRate: 0.001,
      exchangeTradeId: 'spot-trade-1',
      fills: [],
    }));
    const createLiveOrderAdapter = vi.fn(() => ({
      placeLiveOrderWithFees,
    }));

    const result = await submitLiveOrderThroughBoundary(
      {
        userId: 'user-spot-1',
        bot: {
          exchange: 'BINANCE',
          marketType: 'SPOT',
          positionMode: 'ONE_WAY',
          apiKeyId: 'api-key-spot-1',
          walletId: 'wallet-spot-1',
        },
        order: {
          symbol: 'ETHUSDT',
          side: 'SELL',
          type: 'MARKET',
          quantity: 2,
        },
        targetLeverage: null,
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

    expect(createAuthenticatedConnector).toHaveBeenCalledWith({
      exchange: 'BINANCE',
      apiKey: 'enc-key',
      apiSecret: 'enc-secret',
      marketType: 'SPOT',
    });
    expect(createLiveOrderAdapter).toHaveBeenCalledWith({
      exchange: 'BINANCE',
      marketType: 'SPOT',
      connector,
    });
    expect(placeLiveOrderWithFees).toHaveBeenCalledWith({
      order: {
        symbol: 'ETHUSDT',
        side: 'sell',
        type: 'market',
        amount: 2,
        price: undefined,
        reduceOnly: undefined,
        positionMode: 'ONE_WAY',
      },
    });
    expect(result).toEqual({
      exchangeOrderId: 'binance-spot-order-1',
      status: 'FILLED',
      fee: 0.25,
      feeSource: 'EXCHANGE_FILL',
      feePending: false,
      feeCurrency: 'USDT',
      effectiveFeeRate: 0.001,
      exchangeTradeId: 'spot-trade-1',
      fills: [],
    });
  });

  it('fails closed when resolved api key exchange drifts from selected bot exchange', async () => {
    const createAuthenticatedConnector = vi.fn(() => createConnector());
    const resolveLiveExecutionApiKey = vi.fn(async () => ({
      id: 'api-key-1',
      exchange: 'BYBIT' as const,
      apiKey: 'enc-key',
      apiSecret: 'enc-secret',
    }));

    await expect(
      submitLiveOrderThroughBoundary(
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
          createLiveOrderAdapter: vi.fn(),
          enforceLivePretradeGuards: vi.fn(async () => undefined),
          convergeLiveMarginAndLeverageIfNeeded: vi.fn(async () => undefined),
        }
      )
    ).rejects.toMatchObject({ code: 'LIVE_API_KEY_REQUIRED' });
    expect(createAuthenticatedConnector).not.toHaveBeenCalled();
  });

  it('propagates reduce-only LIVE close intent through the canonical exchange boundary', async () => {
    const connector = createConnector();
    const createAuthenticatedConnector = vi.fn(() => connector);
    const resolveLiveExecutionApiKey = vi.fn(async () => ({
      id: 'api-key-close-1',
      exchange: 'BINANCE' as const,
      apiKey: 'enc-key',
      apiSecret: 'enc-secret',
    }));
    const enforceLivePretradeGuards = vi.fn(async () => undefined);
    const placeLiveOrderWithFees = vi.fn(async () => ({
      exchangeOrderId: 'binance-close-order-1',
      status: 'open',
      rawOrderStatus: 'open',
      fee: null,
      feeSource: 'ESTIMATED' as const,
      feePending: true,
      feeCurrency: null,
      effectiveFeeRate: null,
      exchangeTradeId: null,
      fills: [],
    }));
    const createLiveOrderAdapter = vi.fn(() => ({
      placeLiveOrderWithFees,
    }));

    await submitLiveOrderThroughBoundary(
      {
        userId: 'user-close-1',
        bot: {
          exchange: 'BINANCE',
          marketType: 'FUTURES',
          positionMode: 'ONE_WAY',
          apiKeyId: 'api-key-close-1',
          walletId: 'wallet-close-1',
        },
        order: {
          symbol: 'BTCUSDT',
          side: 'SELL',
          type: 'MARKET',
          quantity: 0.25,
          reduceOnly: true,
        },
        targetLeverage: 8,
      },
      {
        createAuthenticatedConnector,
        fetchBalanceRaw: vi.fn(),
        resolveLiveExecutionApiKey,
        createLiveOrderAdapter,
        enforceLivePretradeGuards,
        convergeLiveMarginAndLeverageIfNeeded: vi.fn(async () => undefined),
      }
    );

    expect(enforceLivePretradeGuards).toHaveBeenCalledWith(
      expect.objectContaining({
        payload: {
          symbol: 'BTCUSDT',
          quantity: 0.25,
          price: undefined,
          reduceOnly: true,
        },
      })
    );
    expect(placeLiveOrderWithFees).toHaveBeenCalledWith({
      order: {
        symbol: 'BTCUSDT',
        side: 'sell',
        type: 'market',
        amount: 0.25,
        price: undefined,
        reduceOnly: true,
        positionMode: 'ONE_WAY',
      },
    });
  });
});
