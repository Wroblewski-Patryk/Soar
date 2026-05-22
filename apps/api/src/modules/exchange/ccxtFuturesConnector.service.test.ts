import { describe, expect, it, vi } from 'vitest';
import {
  CcxtClientFactory,
  CcxtExchangeLikeClient,
  CcxtFuturesConnector,
} from './ccxtFuturesConnector.service';

const createMockClient = (): CcxtExchangeLikeClient => ({
  setSandboxMode: vi.fn(),
  loadMarkets: vi.fn().mockResolvedValue(undefined),
  fetchTicker: vi.fn().mockResolvedValue({
    symbol: 'BTC/USDT:USDT',
    timestamp: 1_714_000_000_000,
    last: 100,
    mark: 99.5,
    percentage: 1.25,
  }),
  fetchOHLCV: vi.fn().mockResolvedValue([
    [1_714_000_000_000, '100', '102', '99', '101', '12.5'],
    [1_714_000_060_000, 101, 103, 100, 102, 14],
  ]),
  fetchOrder: vi.fn().mockResolvedValue({
    id: 'order-1',
    status: 'closed',
    symbol: 'BTC/USDT:USDT',
    side: 'buy',
    type: 'market',
    amount: 1,
    filled: 1,
    price: 100,
    average: 100,
    trades: [],
  }),
  fetchMyTrades: vi.fn().mockResolvedValue([]),
  fetchOpenOrders: vi.fn().mockResolvedValue([]),
  fetchDeposits: vi.fn().mockResolvedValue([]),
  fetchWithdrawals: vi.fn().mockResolvedValue([]),
  setLeverage: vi.fn().mockResolvedValue(undefined),
  setMarginMode: vi.fn().mockResolvedValue(undefined),
  createOrder: vi.fn().mockResolvedValue({
    id: 'order-1',
    status: 'open',
    symbol: 'BTC/USDT:USDT',
    side: 'buy',
    type: 'limit',
      amount: 1,
      filled: 0,
      price: 100,
      average: undefined,
      trades: [
        {
          id: 'trade-inline-1',
          order: 'order-1',
          symbol: 'BTC/USDT:USDT',
          side: 'buy',
          price: 100,
          amount: 1,
          cost: 100,
          timestamp: 1_712_000_000_000,
          fee: { cost: 0.04, currency: 'USDT', rate: 0.0004 },
        },
      ],
    }),
  cancelOrder: vi.fn().mockResolvedValue({
    id: 'order-1',
    status: 'canceled',
    symbol: 'BTC/USDT:USDT',
    side: 'buy',
    type: 'limit',
    amount: 1,
    filled: 0,
    price: 100,
  }),
  close: vi.fn().mockResolvedValue(undefined),
});

describe('CcxtFuturesConnector scaffold', () => {
  it('connects and loads markets in sandbox mode', async () => {
    const client = createMockClient();
    const factory: CcxtClientFactory = vi.fn().mockResolvedValue(client);
    const connector = new CcxtFuturesConnector(
      {
        exchangeId: 'binanceusdm',
        sandbox: true,
      },
      factory
    );

    await connector.connect();

    expect(factory).toHaveBeenCalledTimes(1);
    expect(factory).toHaveBeenCalledWith(
      'binanceusdm',
      expect.objectContaining({
        options: expect.objectContaining({
          defaultType: 'future',
        }),
      })
    );
    expect(client.setSandboxMode).toHaveBeenCalledWith(true);
    expect(client.loadMarkets).toHaveBeenCalledTimes(1);
  });

  it('fetches mark price from ticker last value', async () => {
    const client = createMockClient();
    const connector = new CcxtFuturesConnector(
      { exchangeId: 'binanceusdm' },
      vi.fn().mockResolvedValue(client)
    );

    const markPrice = await connector.fetchMarkPrice('BTC/USDT:USDT');

    expect(markPrice).toBe(100);
    expect(client.fetchTicker).toHaveBeenCalledWith('BTC/USDT:USDT');
  });

  it('fetches and normalizes public ticker snapshots', async () => {
    const client = createMockClient();
    const connector = new CcxtFuturesConnector(
      { exchangeId: 'gateio', marketType: 'swap' },
      vi.fn().mockResolvedValue(client)
    );

    const snapshot = await connector.fetchTickerSnapshot('BTCUSDT');

    expect(snapshot).toEqual(
      expect.objectContaining({
        symbol: 'BTC/USDT:USDT',
        eventTime: 1_714_000_000_000,
        lastPrice: 100,
        markPrice: 99.5,
        priceChangePercent24h: 1.25,
      })
    );
  });

  it('fetches and normalizes recent public candles while dropping malformed rows', async () => {
    const client = createMockClient();
    client.fetchOHLCV = vi.fn().mockResolvedValue([
      [1_714_000_000_000, '100', '102', '99', '101', '12.5'],
      [1_714_000_060_000, 101, 103, 100, 102, 14],
      [1_714_000_120_000, 0, 103, 100, 102, 14],
      ['bad', 101, 103, 100, 102, 14],
    ]);
    const connector = new CcxtFuturesConnector(
      { exchangeId: 'gateio', marketType: 'swap' },
      vi.fn().mockResolvedValue(client)
    );

    const candles = await connector.fetchRecentCandles({
      symbol: 'BTCUSDT',
      interval: '1m',
      limit: 10,
    });

    expect(client.fetchOHLCV).toHaveBeenCalledWith('BTCUSDT', '1m', undefined, 10);
    expect(candles).toEqual([
      expect.objectContaining({
        openTime: 1_714_000_000_000,
        closeTime: 1_714_000_059_999,
        open: 100,
        high: 102,
        low: 99,
        close: 101,
        volume: 12.5,
      }),
      expect.objectContaining({
        openTime: 1_714_000_060_000,
        closeTime: 1_714_000_119_999,
        close: 102,
      }),
    ]);
  });

  it('maps futures order payload to createOrder and returns normalized response', async () => {
    const client = createMockClient();
    const connector = new CcxtFuturesConnector(
      { exchangeId: 'binanceusdm' },
      vi.fn().mockResolvedValue(client)
    );

    const order = await connector.placeOrder({
      symbol: 'BTC/USDT:USDT',
      type: 'limit',
      side: 'buy',
      amount: 0.5,
      price: 101,
      reduceOnly: true,
      clientOrderId: 'cs-1',
    });

    expect(client.createOrder).toHaveBeenCalledWith(
      'BTC/USDT:USDT',
      'limit',
      'buy',
      0.5,
      101,
      { reduceOnly: true, clientOrderId: 'cs-1' }
    );
    expect(order.id).toBe('order-1');
    expect(order.status).toBe('open');
    expect(order.fills).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          exchangeTradeId: 'trade-inline-1',
          exchangeOrderId: 'order-1',
          symbol: 'BTC/USDT:USDT',
          quantity: 1,
          notional: 100,
          feeCost: 0.04,
          feeCurrency: 'USDT',
          source: 'createOrder',
        }),
      ])
    );
  });

  it('maps cancel payload to cancelOrder and returns normalized response', async () => {
    const client = createMockClient();
    const connector = new CcxtFuturesConnector(
      { exchangeId: 'gateio', marketType: 'swap' },
      vi.fn().mockResolvedValue(client)
    );

    const order = await connector.cancelOrder({
      symbol: 'BTCUSDT',
      orderId: 'order-1',
    });

    expect(client.cancelOrder).toHaveBeenCalledWith('order-1', 'BTCUSDT');
    expect(order).toEqual(
      expect.objectContaining({
        id: 'order-1',
        status: 'canceled',
        symbol: 'BTC/USDT:USDT',
      })
    );
  });

  it('passes positionSide in futures hedge mode orders', async () => {
    const client = createMockClient();
    const connector = new CcxtFuturesConnector(
      { exchangeId: 'binanceusdm', marketType: 'future' },
      vi.fn().mockResolvedValue(client)
    );

    await connector.placeOrder({
      symbol: 'BTC/USDT:USDT',
      type: 'market',
      side: 'sell',
      amount: 0.3,
      positionMode: 'HEDGE',
      positionSide: 'SHORT',
      reduceOnly: true,
    });

    expect(client.createOrder).toHaveBeenCalledWith(
      'BTC/USDT:USDT',
      'market',
      'sell',
      0.3,
      undefined,
      { reduceOnly: true, positionSide: 'SHORT' }
    );
  });

  it('preserves reduceOnly and hedge parameters for swap-mode derivatives', async () => {
    const client = createMockClient();
    const connector = new CcxtFuturesConnector(
      { exchangeId: 'gateio', marketType: 'swap' },
      vi.fn().mockResolvedValue(client)
    );

    await connector.placeOrder({
      symbol: 'BTC/USDT:USDT',
      type: 'market',
      side: 'sell',
      amount: 0.3,
      positionMode: 'HEDGE',
      positionSide: 'SHORT',
      reduceOnly: true,
    });

    expect(client.createOrder).toHaveBeenCalledWith(
      'BTC/USDT:USDT',
      'market',
      'sell',
      0.3,
      undefined,
      { reduceOnly: true, positionSide: 'SHORT' }
    );
  });

  it('throws when hedge mode order is missing positionSide in futures mode', async () => {
    const client = createMockClient();
    const connector = new CcxtFuturesConnector(
      { exchangeId: 'binanceusdm', marketType: 'future' },
      vi.fn().mockResolvedValue(client)
    );

    await expect(
      connector.placeOrder({
        symbol: 'BTC/USDT:USDT',
        type: 'market',
        side: 'buy',
        amount: 0.1,
        positionMode: 'HEDGE',
      })
    ).rejects.toThrow('positionSide is required in HEDGE mode');
  });

  it('configures spot mode and places vanilla spot orders', async () => {
    const client = createMockClient();
    const factory: CcxtClientFactory = vi.fn().mockResolvedValue(client);
    const connector = new CcxtFuturesConnector(
      {
        exchangeId: 'binance',
        marketType: 'spot',
      },
      factory
    );

    await connector.connect();
    await connector.placeOrder({
      symbol: 'BTC/USDT',
      type: 'market',
      side: 'buy',
      amount: 0.2,
    });

    expect(factory).toHaveBeenCalledWith(
      'binance',
      expect.objectContaining({
        options: expect.objectContaining({
          defaultType: 'spot',
        }),
      })
    );
    expect(client.createOrder).toHaveBeenCalledWith(
      'BTC/USDT',
      'market',
      'buy',
      0.2,
      undefined,
      {}
    );
  });

  it('rejects futures-only params in spot mode', async () => {
    const client = createMockClient();
    const connector = new CcxtFuturesConnector(
      { exchangeId: 'binance', marketType: 'spot' },
      vi.fn().mockResolvedValue(client)
    );

    await expect(
      connector.placeOrder({
        symbol: 'BTC/USDT',
        type: 'market',
        side: 'buy',
        amount: 0.2,
        reduceOnly: true,
      })
    ).rejects.toThrow('reduceOnly is not supported in SPOT mode');

    await expect(
      connector.placeOrder({
        symbol: 'BTC/USDT',
        type: 'market',
        side: 'buy',
        amount: 0.2,
        positionMode: 'HEDGE',
        positionSide: 'LONG',
      })
    ).rejects.toThrow('HEDGE position parameters are not supported in SPOT mode');
  });

  it('normalizes uppercase marketType aliases from bot config', async () => {
    const client = createMockClient();
    const factory: CcxtClientFactory = vi.fn().mockResolvedValue(client);
    const connector = new CcxtFuturesConnector(
      {
        exchangeId: 'binance',
        marketType: 'SPOT',
      },
      factory
    );

    await connector.connect();
    await connector.placeOrder({
      symbol: 'BTC/USDT',
      type: 'market',
      side: 'buy',
      amount: 0.1,
    });

    expect(factory).toHaveBeenCalledWith(
      'binance',
      expect.objectContaining({
        options: expect.objectContaining({
          defaultType: 'spot',
        }),
      })
    );
    expect(client.createOrder).toHaveBeenCalledWith(
      'BTC/USDT',
      'market',
      'buy',
      0.1,
      undefined,
      {}
    );
  });

  it('configures swap mode for exchanges that model perpetual futures as swaps', async () => {
    const client = createMockClient();
    const factory: CcxtClientFactory = vi.fn().mockResolvedValue(client);
    const connector = new CcxtFuturesConnector(
      {
        exchangeId: 'gateio',
        marketType: 'swap',
      },
      factory
    );

    await connector.connect();

    expect(factory).toHaveBeenCalledWith(
      'gateio',
      expect.objectContaining({
        options: expect.objectContaining({
          defaultType: 'swap',
        }),
      })
    );
  });

  it('fetches order snapshot with normalized fills from fetchOrder', async () => {
    const client = createMockClient();
    client.fetchOrder = vi.fn().mockResolvedValue({
      id: 'order-42',
      status: 'closed',
      symbol: 'BTC/USDT:USDT',
      side: 'sell',
      type: 'market',
      amount: 0.5,
      filled: 0.5,
      average: 105,
      fills: [
        {
          tradeId: 'trade-42',
          orderId: 'order-42',
          symbol: 'BTC/USDT:USDT',
          side: 'sell',
          price: '105',
          qty: '0.5',
          commission: '0.03',
          commissionAsset: 'USDT',
          time: 1_713_000_000_000,
        },
      ],
    });
    const connector = new CcxtFuturesConnector(
      { exchangeId: 'binanceusdm' },
      vi.fn().mockResolvedValue(client)
    );

    const payload = await connector.fetchOrderWithFills({
      symbol: 'BTC/USDT:USDT',
      orderId: 'order-42',
    });

    expect(client.fetchOrder).toHaveBeenCalledWith('order-42', 'BTC/USDT:USDT');
    expect(payload.order.id).toBe('order-42');
    expect(payload.fills).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          exchangeTradeId: 'trade-42',
          exchangeOrderId: 'order-42',
          quantity: 0.5,
          price: 105,
          feeCost: 0.03,
          feeCurrency: 'USDT',
          source: 'fetchOrder',
        }),
      ])
    );
  });

  it('fetches and filters normalized trades for an executed order', async () => {
    const client = createMockClient();
    client.fetchMyTrades = vi.fn().mockResolvedValue([
      {
        id: 'trade-1',
        order: 'order-abc',
        symbol: 'ETH/USDT:USDT',
        side: 'buy',
        price: 2000,
        amount: 2,
        cost: 4000,
        timestamp: 1_714_000_000_000,
        fee: { cost: 1.2, currency: 'USDT', rate: 0.0003 },
      },
      {
        id: 'trade-2',
        order: 'order-other',
        symbol: 'ETH/USDT:USDT',
        side: 'buy',
        price: 1990,
        amount: 1,
        cost: 1990,
        timestamp: 1_714_000_010_000,
        fee: { cost: 0.6, currency: 'USDT', rate: 0.0003 },
      },
    ]);
    const connector = new CcxtFuturesConnector(
      { exchangeId: 'binanceusdm' },
      vi.fn().mockResolvedValue(client)
    );

    const fills = await connector.fetchTradesForOrder({
      symbol: 'ETH/USDT:USDT',
      orderId: 'order-abc',
      since: 1_714_000_000_000,
      limit: 50,
    });

    expect(client.fetchMyTrades).toHaveBeenCalledWith(
      'ETH/USDT:USDT',
      1_714_000_000_000,
      50,
      { orderId: 'order-abc' }
    );
    expect(fills).toHaveLength(1);
    expect(fills[0]).toEqual(
      expect.objectContaining({
        exchangeTradeId: 'trade-1',
        exchangeOrderId: 'order-abc',
        symbol: 'ETH/USDT:USDT',
        quantity: 2,
        notional: 4000,
        feeCost: 1.2,
        feeCurrency: 'USDT',
        source: 'fetchMyTrades',
      })
    );
  });

  it('resolves app-normalized futures symbols to exchange market symbols for trade history reads', async () => {
    const client = createMockClient();
    client.loadMarkets = vi.fn().mockResolvedValue({
      'XRP/USDT:USDT': {
        id: 'XRPUSDT',
        symbol: 'XRP/USDT:USDT',
      },
    });
    client.fetchMyTrades = vi.fn().mockResolvedValue([
      {
        id: 'trade-xrp-1',
        order: 'order-xrp-1',
        symbol: 'XRP/USDT:USDT',
        side: 'sell',
        price: 1.4,
        amount: 6.2,
        cost: 8.68,
        timestamp: 1_714_000_020_000,
        fee: { cost: 0.002, currency: 'USDT', rate: 0.00023 },
      },
    ]);
    const connector = new CcxtFuturesConnector(
      { exchangeId: 'binanceusdm' },
      vi.fn().mockResolvedValue(client)
    );

    const trades = await connector.fetchTradesForWindow({
      symbol: 'XRPUSDT',
      since: 1_714_000_000_000,
      limit: 100,
    });

    expect(client.fetchMyTrades).toHaveBeenCalledWith(
      'XRP/USDT:USDT',
      1_714_000_000_000,
      100
    );
    expect(trades).toEqual([
      expect.objectContaining({
        exchangeTradeId: 'trade-xrp-1',
        symbol: 'XRP/USDT:USDT',
        source: 'fetchMyTrades',
      }),
    ]);
  });

  it('normalizes wallet cashflow history from supported exchange account history reads', async () => {
    const client = createMockClient();
    client.fetchDeposits = vi.fn().mockResolvedValue([
      {
        id: 'deposit-1',
        amount: '10',
        currency: 'USDT',
        timestamp: 1_714_200_000_000,
        status: 'ok',
      },
    ]);
    client.fetchWithdrawals = vi.fn().mockResolvedValue([
      {
        id: 'withdrawal-1',
        amount: '2',
        currency: 'USDT',
        timestamp: 1_714_200_100_000,
        fee: { cost: 0.1, currency: 'USDT' },
        status: 'ok',
      },
    ]);
    const connector = new CcxtFuturesConnector(
      { exchangeId: 'binanceusdm' },
      vi.fn().mockResolvedValue(client)
    );

    const cashflows = await connector.fetchWalletCashflowHistory({
      currency: 'USDT',
      since: 1_714_200_000_000,
      limit: 100,
    });

    expect(client.fetchDeposits).toHaveBeenCalledWith('USDT', 1_714_200_000_000, 100);
    expect(client.fetchWithdrawals).toHaveBeenCalledWith('USDT', 1_714_200_000_000, 100);
    expect(cashflows).toEqual([
      expect.objectContaining({
        exchangeEventId: 'deposit-1',
        direction: 'IN',
        amount: 10,
        currency: 'USDT',
        source: 'fetchDeposits',
      }),
      expect.objectContaining({
        exchangeEventId: 'withdrawal-1',
        direction: 'OUT',
        amount: 2,
        feeCost: 0.1,
        feeCurrency: 'USDT',
        source: 'fetchWithdrawals',
      }),
    ]);
  });

  it('throws clear error when exchange client does not support order/trade fetch methods', async () => {
    const client = createMockClient();
    delete client.fetchOrder;
    delete client.fetchMyTrades;
    const connector = new CcxtFuturesConnector(
      { exchangeId: 'binanceusdm' },
      vi.fn().mockResolvedValue(client)
    );

    await expect(
      connector.fetchOrderWithFills({
        symbol: 'BTC/USDT:USDT',
        orderId: 'order-1',
      })
    ).rejects.toThrow('fetchOrder is not supported by this CCXT connector');

    await expect(
      connector.fetchTradesForOrder({
        symbol: 'BTC/USDT:USDT',
        orderId: 'order-1',
      })
    ).rejects.toThrow('fetchMyTrades is not supported by this CCXT connector');
  });

  it('fetches and normalizes open orders from exchange connector', async () => {
    const client = createMockClient();
    client.fetchOpenOrders = vi.fn().mockResolvedValue([
      {
        id: 'open-1',
        symbol: 'BTC/USDT:USDT',
        side: 'buy',
        type: 'limit',
        status: 'open',
        amount: 0.2,
        filled: 0.05,
        price: 60000,
        timestamp: 1_714_100_000_000,
      },
    ]);
    const connector = new CcxtFuturesConnector(
      { exchangeId: 'binanceusdm' },
      vi.fn().mockResolvedValue(client)
    );

    const openOrders = await connector.fetchOpenOrders({
      symbol: 'BTC/USDT:USDT',
    });

    expect(client.fetchOpenOrders).toHaveBeenCalledWith('BTC/USDT:USDT');
    expect(openOrders).toHaveLength(1);
    expect(openOrders[0]).toEqual(
      expect.objectContaining({
        id: 'open-1',
        symbol: 'BTC/USDT:USDT',
        side: 'buy',
        type: 'limit',
        status: 'open',
        amount: 0.2,
        filled: 0.05,
      })
    );
  });

  it('converges futures margin mode and leverage when setter methods are available', async () => {
    const client = createMockClient();
    const connector = new CcxtFuturesConnector(
      { exchangeId: 'binanceusdm', marketType: 'future' },
      vi.fn().mockResolvedValue(client)
    );

    const result = await connector.convergeFuturesLeverageAndMargin({
      symbol: 'BTC/USDT:USDT',
      leverage: 7,
      marginMode: 'isolated',
    });

    expect(client.setMarginMode).toHaveBeenCalledWith('isolated', 'BTC/USDT:USDT');
    expect(client.setLeverage).toHaveBeenCalledWith(7, 'BTC/USDT:USDT');
    expect(result).toEqual({
      leverageApplied: true,
      marginModeApplied: true,
    });
  });

  it('converges swap-mode derivative margin mode and leverage when setter methods are available', async () => {
    const client = createMockClient();
    const connector = new CcxtFuturesConnector(
      { exchangeId: 'gateio', marketType: 'swap' },
      vi.fn().mockResolvedValue(client)
    );

    const result = await connector.convergeFuturesLeverageAndMargin({
      symbol: 'BTC/USDT:USDT',
      leverage: 3,
      marginMode: 'cross',
    });

    expect(client.setMarginMode).toHaveBeenCalledWith('cross', 'BTC/USDT:USDT');
    expect(client.setLeverage).toHaveBeenCalledWith(3, 'BTC/USDT:USDT');
    expect(result).toEqual({
      leverageApplied: true,
      marginModeApplied: true,
    });
  });
});
