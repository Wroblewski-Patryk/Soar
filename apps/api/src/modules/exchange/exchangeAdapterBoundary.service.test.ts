import { describe, expect, it, vi } from 'vitest';

import {
  cancelLiveOrderThroughBoundary,
  fetchSupportedExchangeBalanceRaw,
  fetchSupportedExchangeOpenOrdersRaw,
  fetchSupportedExchangePositionsRaw,
  fetchSupportedExchangeTradeHistoryRaw,
  fetchSupportedExchangeWalletCashflowHistoryRaw,
  lookupLiveOrderThroughBoundary,
  submitLiveOrderThroughBoundary,
} from './exchangeAdapterBoundary.service';
import {
  ExchangeExecutionCapabilityUnsupportedError,
} from './exchangeExecutionCapabilityContract.service';
import { enforceLivePretradeGuards } from '../orders/orders.quantityRules';

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
  cancelOrder: vi.fn(async () => ({
    id: 'canceled-order-1',
    status: 'canceled',
  })),
});

describe('exchangeAdapterBoundary.service', () => {
  it.each([
    ['BINANCE', 'SPOT', 'BTC/USDT'],
    ['BINANCE', 'FUTURES', 'BTC/USDT:USDT'],
    ['GATEIO', 'SPOT', 'BTC/USDT'],
    ['GATEIO', 'FUTURES', 'BTC/USDT:USDT'],
  ] as const)('confirms only a complete %s %s LIVE lookup identity and explicit status',
    async (exchange, marketType, venueSymbol) => {
      type LookupSnapshot = {
        id: string;
        clientOrderId?: string;
        symbol?: string;
        side?: string;
        amount?: number;
        status?: string;
        filled?: number;
      };
      const valid: LookupSnapshot = {
        id: '12345', clientOrderId: 'soar_lookup_1', symbol: venueSymbol,
        side: 'buy', amount: 0.1, status: 'open', filled: 0,
      };
      const fetchOrderByClientOrderId = vi.fn(async (): Promise<LookupSnapshot> => valid);
      const placeOrder = vi.fn();
      const connector = {
        ...createConnector(), fetchOrderByClientOrderId, placeOrder,
        fetchOrderWithFills: vi.fn(async () => ({ order: valid, fills: [] })),
        fetchTradesForOrder: vi.fn(async () => []),
      };
      const params = {
        userId: 'user-lookup',
        bot: {
          exchange, marketType, positionMode: 'ONE_WAY' as const,
          apiKeyId: 'api-key-lookup', walletId: 'wallet-lookup',
        },
        order: {
          symbol: 'BTCUSDT', side: 'BUY' as const, type: 'LIMIT' as const,
          quantity: 0.1, price: 100_000, clientOrderId: 'soar_lookup_1',
        },
        targetLeverage: marketType === 'FUTURES' ? 2 : null,
      };
      const deps = {
        createAuthenticatedConnector: vi.fn(() => connector),
        resolveLiveExecutionApiKey: vi.fn(async () => ({
          id: 'api-key-lookup', exchange, apiKey: 'enc-key', apiSecret: 'enc-secret',
        })),
      };

      await expect(lookupLiveOrderThroughBoundary(params, deps)).resolves.toMatchObject({
        exchangeOrderId: '12345', status: 'OPEN', exchangeFilledQuantity: 0,
      });
      expect(fetchOrderByClientOrderId).toHaveBeenCalledWith({
        symbol: 'BTCUSDT', clientOrderId: 'soar_lookup_1',
      });

      const invalid: Array<[string, LookupSnapshot]> = [
        ['missing status', { ...valid, status: undefined }],
        ['terminal status', { ...valid, status: 'canceled' }],
        ['missing client ID', { ...valid, clientOrderId: undefined }],
        ['mismatched client ID', { ...valid, clientOrderId: 'other' }],
        ['missing symbol', { ...valid, symbol: undefined }],
        ['mismatched symbol', { ...valid, symbol: 'ETH/USDT' }],
        ['missing side', { ...valid, side: undefined }],
        ['mismatched side', { ...valid, side: 'sell' }],
        ['missing amount', { ...valid, amount: undefined }],
        ['mismatched amount', { ...valid, amount: 0.2 }],
        ['missing venue order ID', { ...valid, id: '' }],
      ];
      for (const [caseName, snapshot] of invalid) {
        fetchOrderByClientOrderId.mockResolvedValueOnce(snapshot);
        await expect(lookupLiveOrderThroughBoundary(params, deps), caseName)
          .rejects.toMatchObject({ code: 'LIVE_EXECUTION_FAILED' });
      }
      expect(placeOrder).not.toHaveBeenCalled();
      expect(connector.disconnect).toHaveBeenCalledTimes(invalid.length + 1);
    });

  it.each([
    ['rotated generation', 'key-1', 2],
    ['reassigned key', 'key-2', 1],
  ] as const)('refuses a bound retry lookup after %s', async (_case, keyId, version) => {
    const createAuthenticatedConnector = vi.fn();
    await expect(lookupLiveOrderThroughBoundary({
      userId: 'user-1', credentialBinding: {
        apiKeyId: 'key-1', apiKeyCredentialVersion: 1,
      },
      bot: { exchange: 'BINANCE', marketType: 'FUTURES',
        positionMode: 'ONE_WAY', apiKeyId: keyId, walletId: null },
      order: { symbol: 'BTCUSDT', side: 'BUY', type: 'LIMIT', quantity: 0.1,
        clientOrderId: 'soar_bound_retry' },
      targetLeverage: null,
    }, {
      createAuthenticatedConnector,
      resolveLiveExecutionApiKey: vi.fn(async () => ({ id: keyId,
        exchange: 'BINANCE' as const, apiKey: 'key', apiSecret: 'secret',
        credentialVersion: version })),
    })).rejects.toMatchObject({ code: 'LIVE_EXECUTION_FAILED' });
    expect(createAuthenticatedConnector).not.toHaveBeenCalled();
  });

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
    expect(createAuthenticatedConnector).toHaveBeenCalledWith(
      expect.objectContaining({
        exchange: 'GATEIO',
        marketType: 'FUTURES',
        apiKey: 'enc-gateio-key',
        apiSecret: 'enc-gateio-secret',
      })
    );
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
    expect(createAuthenticatedConnector).toHaveBeenCalledWith(
      expect.objectContaining({
        exchange: 'GATEIO',
        marketType: 'FUTURES',
        apiKey: 'enc-gateio-key',
        apiSecret: 'enc-gateio-secret',
      })
    );
    expect(connector.disconnect).toHaveBeenCalledOnce();
  });

  it('reads Gate.io trade history through the authenticated read boundary', async () => {
    const connector = createConnector();
    const createAuthenticatedConnector = vi.fn(() => connector);

    const trades = await fetchSupportedExchangeTradeHistoryRaw(
      {
        exchange: 'GATEIO',
        marketType: 'FUTURES',
        apiKey: 'enc-gateio-key',
        apiSecret: 'enc-gateio-secret',
        symbol: 'BTCUSDT',
        since: Date.parse('2026-04-29T00:00:00.000Z'),
        limit: 50,
      },
      { createAuthenticatedConnector }
    );

    expect(trades).toEqual([
      expect.objectContaining({
        exchangeTradeId: 'trade-1',
        symbol: 'BTC/USDT:USDT',
      }),
    ]);
    expect(createAuthenticatedConnector).toHaveBeenCalledWith(
      expect.objectContaining({
        exchange: 'GATEIO',
        marketType: 'FUTURES',
        apiKey: 'enc-gateio-key',
        apiSecret: 'enc-gateio-secret',
      })
    );
    expect(connector.fetchTradesForWindow).toHaveBeenCalledWith({
      symbol: 'BTCUSDT',
      since: Date.parse('2026-04-29T00:00:00.000Z'),
      limit: 50,
    });
    expect(connector.disconnect).toHaveBeenCalledOnce();
  });

  it('reads Gate.io wallet cashflow history through the authenticated read boundary', async () => {
    const connector = createConnector();
    const createAuthenticatedConnector = vi.fn(() => connector);

    const cashflows = await fetchSupportedExchangeWalletCashflowHistoryRaw(
      {
        exchange: 'GATEIO',
        marketType: 'FUTURES',
        apiKey: 'enc-gateio-key',
        apiSecret: 'enc-gateio-secret',
        currency: 'USDT',
        since: Date.parse('2026-04-29T00:00:00.000Z'),
        limit: 20,
      },
      { createAuthenticatedConnector }
    );

    expect(cashflows).toEqual([
      expect.objectContaining({
        exchangeEventId: 'deposit-1',
        direction: 'IN',
        amount: 10,
        currency: 'USDT',
      }),
    ]);
    expect(createAuthenticatedConnector).toHaveBeenCalledWith(
      expect.objectContaining({
        exchange: 'GATEIO',
        marketType: 'FUTURES',
        apiKey: 'enc-gateio-key',
        apiSecret: 'enc-gateio-secret',
      })
    );
    expect(connector.fetchWalletCashflowHistory).toHaveBeenCalledWith({
      currency: 'USDT',
      since: Date.parse('2026-04-29T00:00:00.000Z'),
      limit: 20,
    });
    expect(connector.disconnect).toHaveBeenCalledOnce();
  });

  it('submits Gate.io live orders through the canonical exchange boundary', async () => {
    const connector = createConnector();
    const createAuthenticatedConnector = vi.fn(() => connector);
    const resolveLiveExecutionApiKey = vi.fn(async () => ({
      id: 'gateio-key-1',
      exchange: 'GATEIO' as const,
      apiKey: 'enc-gateio-key',
      apiSecret: 'enc-gateio-secret',
    }));
    const placeLiveOrderWithFees = vi.fn(async () => ({
      exchangeOrderId: 'gateio-order-1',
      status: 'open',
      rawOrderStatus: 'open',
      fee: 0.75,
      feeSource: 'EXCHANGE_FILL' as const,
      feePending: false,
      feeCurrency: 'USDT',
      effectiveFeeRate: 0.00075,
      exchangeTradeId: 'gateio-trade-1',
      fills: [],
    }));
    const createLiveOrderAdapter = vi.fn(() => ({
      placeLiveOrderWithFees,
    }));
    const enforceLivePretradeGuards = vi.fn(async () => undefined);
    const convergeLiveMarginAndLeverageIfNeeded = vi.fn(async () => undefined);

    const result = await submitLiveOrderThroughBoundary(
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
    );

    expect(resolveLiveExecutionApiKey).toHaveBeenCalledOnce();
    expect(createAuthenticatedConnector).toHaveBeenCalledWith({
      exchange: 'GATEIO',
      apiKey: 'enc-gateio-key',
      apiSecret: 'enc-gateio-secret',
      marketType: 'FUTURES',
    });
    expect(createLiveOrderAdapter).toHaveBeenCalledWith({
      exchange: 'GATEIO',
      marketType: 'FUTURES',
      connector,
    });
    expect(enforceLivePretradeGuards).toHaveBeenCalledWith(
      expect.objectContaining({
        exchange: 'GATEIO',
        marketType: 'FUTURES',
        payload: {
          symbol: 'BTCUSDT',
          quantity: 0.01,
          price: 100_000,
          reduceOnly: undefined,
        },
      })
    );
    expect(convergeLiveMarginAndLeverageIfNeeded).toHaveBeenCalledWith({
      connector,
      apiKeyId: 'gateio-key-1',
      symbol: 'BTCUSDT',
      targetLeverage: 2,
    });
    expect(placeLiveOrderWithFees).toHaveBeenCalledWith({
      order: {
        symbol: 'BTCUSDT',
        side: 'buy',
        type: 'limit',
        amount: 0.01,
        price: 100_000,
        reduceOnly: undefined,
        positionMode: 'ONE_WAY',
      },
    });
    expect(connector.disconnect).toHaveBeenCalledOnce();
    expect(result).toEqual({
      exchangeOrderId: 'gateio-order-1',
      status: 'OPEN',
      fee: 0.75,
      feeSource: 'EXCHANGE_FILL',
      feePending: false,
      feeCurrency: 'USDT',
      effectiveFeeRate: 0.00075,
      exchangeTradeId: 'gateio-trade-1',
      fills: [],
    });
  });

  it.each([false, true])('rejects Gate tick-size amount before submit (reduceOnly=%s)',
    async (reduceOnly) => {
      const connector = { ...createConnector(),
        getSymbolTradingRules: vi.fn(async () => ({
          minAmount: 1, minNotional: 5, amountPrecision: 1,
          amountPrecisionMode: 'TICK_SIZE' as const, contractSize: 1,
        })),
        fetchMarkPrice: vi.fn(async () => 3.305),
      };
      const placeLiveOrderWithFees = vi.fn();
      const convergeLiveMarginAndLeverageIfNeeded = vi.fn(async () => undefined);
      await expect(submitLiveOrderThroughBoundary({
        userId: 'user-gate-tick-002',
        bot: { exchange: 'GATEIO', marketType: 'FUTURES', positionMode: 'ONE_WAY',
          apiKeyId: 'key-gate-tick-002', walletId: 'wallet-gate-tick-002' },
        order: { symbol: `NGTICK${reduceOnly ? 'CLOSE' : 'OPEN'}USDT`, side: 'BUY',
          type: 'LIMIT', quantity: 60.5, price: 3.305, reduceOnly },
        targetLeverage: 100,
      }, {
        createAuthenticatedConnector: vi.fn(() => connector),
        fetchBalanceRaw: vi.fn(),
        resolveLiveExecutionApiKey: vi.fn(async () => ({ id: 'key-gate-tick-002',
          exchange: 'GATEIO' as const, apiKey: 'local-fake', apiSecret: 'local-fake' })),
        createLiveOrderAdapter: vi.fn(() => ({ placeLiveOrderWithFees })),
        enforceLivePretradeGuards,
        convergeLiveMarginAndLeverageIfNeeded,
      })).rejects.toMatchObject({ code: 'LIVE_PRETRADE_AMOUNT_PRECISION' });
      expect(connector.getSymbolTradingRules).toHaveBeenCalledOnce();
      expect(convergeLiveMarginAndLeverageIfNeeded).not.toHaveBeenCalled();
      expect(placeLiveOrderWithFees).not.toHaveBeenCalled();
      expect(connector.disconnect).toHaveBeenCalledOnce();
      expect(connector.hasOpenPosition).toHaveBeenCalledTimes(reduceOnly ? 0 : 1);
    });

  it('blocks the manual-context Gate tick fixture before venue submit', async () => {
    const connector = { ...createConnector(),
      getSymbolTradingRules: vi.fn(async () => ({
        minAmount: 1, minNotional: 5.1, amountPrecision: 1,
        amountPrecisionMode: 'TICK_SIZE' as const, contractSize: 10,
      })),
      fetchMarkPrice: vi.fn(async () => 0.25),
    };
    const placeLiveOrderWithFees = vi.fn();
    const convergeLiveMarginAndLeverageIfNeeded = vi.fn(async () => undefined);
    await expect(submitLiveOrderThroughBoundary({
      userId: 'user-gate-context-parity-003',
      bot: { exchange: 'GATEIO', marketType: 'FUTURES', positionMode: 'ONE_WAY',
        apiKeyId: 'key-gate-context-parity-003', walletId: 'wallet-gate-context-parity-003' },
      order: { symbol: 'ADATICKPARITYUSDT', side: 'BUY', type: 'LIMIT',
        quantity: 60.5, price: 0.25, reduceOnly: false },
      targetLeverage: 5,
    }, {
      createAuthenticatedConnector: vi.fn(() => connector),
      fetchBalanceRaw: vi.fn(),
      resolveLiveExecutionApiKey: vi.fn(async () => ({ id: 'key-gate-context-parity-003',
        exchange: 'GATEIO' as const, apiKey: 'local-fake', apiSecret: 'local-fake' })),
      createLiveOrderAdapter: vi.fn(() => ({ placeLiveOrderWithFees })),
      enforceLivePretradeGuards,
      convergeLiveMarginAndLeverageIfNeeded,
    })).rejects.toMatchObject({ code: 'LIVE_PRETRADE_AMOUNT_PRECISION' });
    expect(convergeLiveMarginAndLeverageIfNeeded).not.toHaveBeenCalled();
    expect(placeLiveOrderWithFees).not.toHaveBeenCalled();
    expect(connector.disconnect).toHaveBeenCalledOnce();
  });

  it.each([false, true])('rejects unknown Gate Futures contract size before submit (reduceOnly=%s)',
    async (reduceOnly) => {
      const connector = { ...createConnector(),
        getSymbolTradingRules: vi.fn(async () => ({
          minAmount: 2, minNotional: 5, amountPrecision: 1,
          amountPrecisionMode: 'TICK_SIZE' as const, contractSize: null,
        })),
        fetchMarkPrice: vi.fn(async () => 3.305),
      };
      const placeLiveOrderWithFees = vi.fn();
      const convergeLiveMarginAndLeverageIfNeeded = vi.fn(async () => undefined);
      await expect(submitLiveOrderThroughBoundary({
        userId: 'user-unknown-contract-003a',
        bot: { exchange: 'GATEIO', marketType: 'FUTURES', positionMode: 'ONE_WAY',
          apiKeyId: 'key-unknown-contract-003a', walletId: 'wallet-unknown-contract-003a' },
        order: { symbol: `NGCONTRACT${reduceOnly ? 'CLOSE' : 'OPEN'}USDT`, side: 'BUY',
          type: 'LIMIT', quantity: 60, price: 3.305, reduceOnly },
        targetLeverage: 100,
      }, {
        createAuthenticatedConnector: vi.fn(() => connector),
        fetchBalanceRaw: vi.fn(),
        resolveLiveExecutionApiKey: vi.fn(async () => ({ id: 'key-unknown-contract-003a',
          exchange: 'GATEIO' as const, apiKey: 'local-fake', apiSecret: 'local-fake' })),
        createLiveOrderAdapter: vi.fn(() => ({ placeLiveOrderWithFees })),
        enforceLivePretradeGuards,
        convergeLiveMarginAndLeverageIfNeeded,
      })).rejects.toMatchObject({ code: 'LIVE_PRETRADE_CONTRACT_SIZE_UNAVAILABLE' });
      expect(connector.getSymbolTradingRules).toHaveBeenCalledOnce();
      expect(convergeLiveMarginAndLeverageIfNeeded).not.toHaveBeenCalled();
      expect(placeLiveOrderWithFees).not.toHaveBeenCalled();
      expect(connector.disconnect).toHaveBeenCalledOnce();
    });

  it('cancels Gate.io live orders through the canonical exchange boundary', async () => {
    const connector = createConnector();
    const createAuthenticatedConnector = vi.fn(() => connector);
    const resolveLiveExecutionApiKey = vi.fn(async () => ({
      id: 'gateio-key-1',
      exchange: 'GATEIO' as const,
      apiKey: 'enc-gateio-key',
      apiSecret: 'enc-gateio-secret',
    }));

    const result = await cancelLiveOrderThroughBoundary(
      {
        userId: 'user-gateio-live-cancel',
        bot: {
          exchange: 'GATEIO',
          marketType: 'FUTURES',
          apiKeyId: 'gateio-key-1',
          walletId: 'gateio-wallet-1',
        },
        order: {
          symbol: 'BTCUSDT',
          exchangeOrderId: 'gateio-open-order-1',
        },
      },
      {
        createAuthenticatedConnector,
        resolveLiveExecutionApiKey,
      }
    );

    expect(resolveLiveExecutionApiKey).toHaveBeenCalledWith({
      userId: 'user-gateio-live-cancel',
      bot: {
        exchange: 'GATEIO',
        marketType: 'FUTURES',
        apiKeyId: 'gateio-key-1',
        walletId: 'gateio-wallet-1',
      },
    });
    expect(createAuthenticatedConnector).toHaveBeenCalledWith({
      exchange: 'GATEIO',
      apiKey: 'enc-gateio-key',
      apiSecret: 'enc-gateio-secret',
      marketType: 'FUTURES',
    });
    expect(connector.cancelOrder).toHaveBeenCalledWith({
      symbol: 'BTCUSDT',
      orderId: 'gateio-open-order-1',
    });
    expect(connector.disconnect).toHaveBeenCalledOnce();
    expect(result).toEqual({
      exchangeOrderId: 'canceled-order-1',
      status: 'canceled',
    });
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
          clientOrderId: 'soar_runtime_1',
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
        clientOrderId: 'soar_runtime_1',
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

  it('does not submit when credentials rotate during pretrade checks', async () => {
    const connector = createConnector();
    const placeLiveOrderWithFees = vi.fn();
    const resolveLiveExecutionApiKey = vi.fn()
      .mockResolvedValueOnce({ id: 'key-1', exchange: 'BINANCE',
        apiKey: 'key', apiSecret: 'secret', credentialVersion: 1 })
      .mockResolvedValueOnce({ id: 'key-1', exchange: 'BINANCE',
        apiKey: 'key', apiSecret: 'rotated', credentialVersion: 2 });
    await expect(submitLiveOrderThroughBoundary({
      userId: 'user-1', credentialBinding: {
        apiKeyId: 'key-1', apiKeyCredentialVersion: 1,
      },
      bot: { exchange: 'BINANCE', marketType: 'FUTURES',
        positionMode: 'ONE_WAY', apiKeyId: 'key-1', walletId: null },
      order: { symbol: 'BTCUSDT', side: 'BUY', type: 'LIMIT',
        quantity: 0.1, price: 100_000, clientOrderId: 'soar_rotation_test' },
      targetLeverage: null,
    }, {
      createAuthenticatedConnector: vi.fn(() => connector),
      fetchBalanceRaw: vi.fn(), resolveLiveExecutionApiKey,
      createLiveOrderAdapter: vi.fn(() => ({ placeLiveOrderWithFees })),
      enforceLivePretradeGuards: vi.fn(async () => undefined),
      convergeLiveMarginAndLeverageIfNeeded: vi.fn(async () => undefined),
    })).rejects.toMatchObject({ code: 'LIVE_EXECUTION_FAILED' });
    expect(resolveLiveExecutionApiKey).toHaveBeenCalledTimes(2);
    expect(placeLiveOrderWithFees).not.toHaveBeenCalled();
    expect(connector.disconnect).toHaveBeenCalledOnce();
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
