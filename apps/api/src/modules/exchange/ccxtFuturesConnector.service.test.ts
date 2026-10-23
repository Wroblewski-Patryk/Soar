import { describe, expect, it, vi } from 'vitest';

// Connector normalization tests use a fake venue; the shared DB gate has its own tests.
vi.mock('../orders/liveExecutionPause.service', () => ({
  withLiveCreateOrderPermit: async <T,>(_input: unknown, submit: () => Promise<T>) => submit(),
}));
import {
  CcxtClientFactory,
  CcxtExchangeLikeClient,
  CcxtFuturesConnector,
} from './ccxtFuturesConnector.service';
import { resolveRuntimeDcaOrderQuantity } from '../engine/runtimeDcaOrderRules';

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
  it('consults the final LIVE permit before createOrder', async () => {
    const client = createMockClient();
    const permit = vi.fn(async () => { throw new Error('blocked by shared pause'); });
    const connector = new CcxtFuturesConnector(
      { exchangeId: 'gateio', marketType: 'swap' },
      vi.fn().mockResolvedValue(client), permit
    );
    await expect(connector.placeOrder({ symbol: 'BTCUSDT', side: 'sell', type: 'market',
      amount: 0.1, reduceOnly: true })).rejects.toThrow('blocked by shared pause');
    expect(permit).toHaveBeenCalledWith({
      marketType: 'swap', reduceOnly: true, exchangeId: 'gateio',
      clientOrderId: undefined, symbol: 'BTCUSDT',
    }, expect.any(Function));
    expect(client.createOrder).not.toHaveBeenCalled();
  });

  it.each([
    ['spot', 'SPOT'], ['swap', 'FUTURES'],
  ] as const)('passes a bounded Gate %s closed-order page to CCXT', async (marketType, contractType) => {
    const client = createMockClient();
    client.fetchClosedOrders = vi.fn().mockResolvedValue([{ id: '1234', status: 'closed',
      symbol: 'BTC/USDT', info: { text: 't-soar_abc' } }]);
    const connector = new CcxtFuturesConnector({ exchangeId: 'gateio', marketType },
      vi.fn().mockResolvedValue(client));
    const orders = await connector.fetchClosedOrdersPage({ symbol: 'BTCUSDT',
      since: 1_700_000_000_000, until: 1_700_000_060_000, page: 2, limit: 100,
      marketType: contractType });
    expect(orders[0].id).toBe('1234');
    expect(client.fetchClosedOrders).toHaveBeenCalledWith('BTCUSDT',
      undefined, 100,
      contractType === 'SPOT'
        ? { from: 1_700_000_000, until: 1_700_000_060_000, page: 2 }
        : { historical: true, from: 1_700_000_000,
            until: 1_700_000_060_000, offset: 100 });
  });

  it('keeps missing trade fees unknown while preserving explicit zero commission', async () => {
    const client = createMockClient();
    client.createOrder = vi.fn().mockResolvedValue({
      id: 'fee-normalization-order', status: 'closed', filled: 0.75,
      trades: [
        { id: 'missing', order: 'fee-normalization-order', price: 100, amount: 0.25 },
        { id: 'incomplete', order: 'fee-normalization-order', price: 100, amount: 0.25,
          fees: [{ currency: 'USDT' }] },
        { id: 'zero', order: 'fee-normalization-order', price: 100, amount: 0.25,
          info: { commission: '0' } },
      ],
    });
    const connector = new CcxtFuturesConnector(
      { exchangeId: 'binanceusdm', marketType: 'future' },
      vi.fn().mockResolvedValue(client)
    );
    const result = await connector.placeOrder({
      symbol: 'BTCUSDT', side: 'buy', type: 'market', amount: 0.75,
    });
    expect(result.fills?.map((fill) => fill.feeCost)).toEqual([null, null, 0]);
  });

  it.each([
    ['binanceusdm', 'future', 'soar_order_1'],
    ['binance', 'spot', 'soar_order_1'],
    ['gateio', 'swap', 'soar_order_1'],
    ['gateio', 'spot', 'soar_order_1'],
  ] as const)('submits and looks up %s %s using the same venue client ID', async (exchangeId, marketType, submittedId) => {
    const client = createMockClient();
    const exchangeSymbol = marketType === 'spot' ? 'BTC/USDT' : 'BTC/USDT:USDT';
    client.fetchOrder = vi.fn().mockResolvedValue({
      id: 'order-1', status: 'open', symbol: exchangeSymbol, side: 'buy', amount: 1,
      ...(exchangeId === 'gateio'
        ? { info: { text: 't-soar_order_1' } }
        : { clientOrderId: 'soar_order_1' }),
    });
    const connector = new CcxtFuturesConnector(
      { exchangeId, marketType },
      vi.fn().mockResolvedValue(client)
    );
    await connector.placeOrder({
      symbol: exchangeSymbol, side: 'buy', type: 'limit', amount: 1, price: 100,
      clientOrderId: 'soar_order_1',
    });
    expect(client.createOrder).toHaveBeenCalledWith(
      exchangeSymbol, 'limit', 'buy', 1, 100,
      expect.objectContaining({ clientOrderId: submittedId })
    );
    const recovered = await connector.fetchOrderByClientOrderId({
      symbol: exchangeSymbol, clientOrderId: 'soar_order_1',
    });
    expect(recovered.id).toBe('order-1');
    expect(recovered.clientOrderId).toBe('soar_order_1');
    expect(client.fetchOrder).toHaveBeenCalledWith(
      '', exchangeSymbol, { clientOrderId: 'soar_order_1' }
    );
  });

  it('rejects a lookup result carrying a different client ID', async () => {
    const client = createMockClient();
    client.fetchOrder = vi.fn().mockResolvedValue({
      id: 'unexpected-order', clientOrderId: 'different-client-id', status: 'open',
      symbol: 'BTC/USDT', side: 'buy', amount: 1,
    });
    const connector = new CcxtFuturesConnector(
      { exchangeId: 'binance', marketType: 'spot' },
      vi.fn().mockResolvedValue(client)
    );
    await expect(connector.fetchOrderByClientOrderId({
      symbol: 'BTC/USDT', clientOrderId: 'soar_order_1',
    })).rejects.toThrow('different client order identity');
  });

  it('rejects a lookup result without a returned client ID', async () => {
    const client = createMockClient();
    const connector = new CcxtFuturesConnector(
      { exchangeId: 'gateio', marketType: 'swap' },
      vi.fn().mockResolvedValue(client)
    );
    await expect(connector.fetchOrderByClientOrderId({
      symbol: 'BTC/USDT:USDT', clientOrderId: 'soar_order_1',
    })).rejects.toThrow('client order identity');
  });

  it('rejects a lookup result from a different futures settlement', async () => {
    const client = createMockClient();
    client.fetchOrder = vi.fn().mockResolvedValue({
      id: '12345', clientOrderId: 'soar_order_1', status: 'open',
      symbol: 'BTC/USDT:USD', side: 'buy', amount: 1,
    });
    const connector = new CcxtFuturesConnector(
      { exchangeId: 'binanceusdm', marketType: 'future' },
      vi.fn().mockResolvedValue(client)
    );
    await expect(connector.fetchOrderByClientOrderId({
      symbol: 'BTC/USDT:USDT', clientOrderId: 'soar_order_1',
    })).rejects.toThrow('different symbol');
  });

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

  it('prefers Gate.io swap symbols over spot symbols when both normalize to the same key', async () => {
    const client = createMockClient();
    client.loadMarkets = vi.fn().mockResolvedValue({
      'ADA/USDT': {
        symbol: 'ADA/USDT',
        id: 'ADA_USDT',
        type: 'spot',
        spot: true,
        limits: { amount: { min: 0.01 }, cost: { min: 3 } },
        precision: { amount: 0.01 },
      },
      'ADA/USDT:USDT': {
        symbol: 'ADA/USDT:USDT',
        id: 'ADA_USDT',
        type: 'swap',
        swap: true,
        contract: true, linear: true, inverse: false, quote: 'USDT', settle: 'USDT',
        contractSize: 10,
        info: { name: 'ADA_USDT', type: 'direct', quanto_multiplier: '10', order_size_min: '1', enable_decimal: false },
        limits: { amount: { min: 1 }, cost: {} },
        precision: { amount: 1 },
      },
    });
    const connector = new CcxtFuturesConnector(
      { exchangeId: 'gateio', marketType: 'swap' },
      vi.fn().mockResolvedValue(client)
    );

    await connector.placeOrder({
      symbol: 'ADAUSDT',
      type: 'market',
      side: 'sell',
      amount: 1,
    });

    expect(client.createOrder).toHaveBeenCalledWith(
      'ADA/USDT:USDT',
      'market',
      'sell',
      1,
      undefined,
      {}
    );
  });

  it('filters loaded markets to the configured derivative market type', async () => {
    const client = createMockClient();
    client.loadMarkets = vi.fn().mockResolvedValue({
      'ADA/USDT': {
        symbol: 'ADA/USDT',
        id: 'ADA_USDT',
        type: 'spot',
        spot: true,
      },
      'ADA/USDT:USDT': {
        symbol: 'ADA/USDT:USDT',
        id: 'ADA_USDT',
        type: 'swap',
        swap: true,
      },
    });
    const connector = new CcxtFuturesConnector(
      { exchangeId: 'gateio', marketType: 'swap' },
      vi.fn().mockResolvedValue(client)
    );

    await expect(connector.loadMarketsMap()).resolves.toEqual({
      'ADA/USDT:USDT': expect.objectContaining({
        symbol: 'ADA/USDT:USDT',
      }),
    });
  });

  it('reads trading rules from the preferred Gate.io swap market', async () => {
    const ccxt = (await import('ccxt')).default;
    expect(ccxt.TICK_SIZE).toBe(4);
    expect(ccxt.DECIMAL_PLACES).toBe(2);
    const client = createMockClient();
    client.precisionMode = 4;
    const markets = {
      'ADA/USDT': {
        symbol: 'ADA/USDT',
        id: 'ADA_USDT',
        type: 'spot',
        spot: true,
        limits: { amount: { min: 0.01 }, cost: { min: 3 } },
        precision: { amount: 0.01 },
      },
      'ADA/USDT:USDT': {
        symbol: 'ADA/USDT:USDT',
        id: 'ADA_USDT',
        type: 'swap',
        swap: true,
        contract: true, linear: true, inverse: false, quote: 'USDT', settle: 'USDT',
        contractSize: 10,
        info: { name: 'ADA_USDT', type: 'direct', quanto_multiplier: '10', order_size_min: '1', enable_decimal: false },
        limits: { amount: { min: 1 }, cost: {} },
        precision: { amount: 1 },
      },
    };
    client.loadMarkets = vi.fn().mockResolvedValue(markets);
    (client as unknown as { market: (symbol: string) => unknown }).market = vi.fn(
      (symbol: string) => markets[symbol as keyof typeof markets]
    );
    const connector = new CcxtFuturesConnector(
      { exchangeId: 'gateio', marketType: 'swap' },
      vi.fn().mockResolvedValue(client)
    );

    await expect(connector.getSymbolTradingRules('ADAUSDT')).resolves.toEqual({
      minAmount: 1,
      minNotional: null,
      amountPrecision: 1,
      amountPrecisionMode: 'TICK_SIZE',
      contractSize: 10,
      gateFuturesEconomics: expect.objectContaining({ contract: 'ADA_USDT', contractSize: 10 }),
    });
    markets['ADA/USDT:USDT'].settle = 'USD';
    await expect(connector.getSymbolTradingRules('ADAUSDT')).resolves.toMatchObject({ contractSize: null });
    markets['ADA/USDT:USDT'].settle = 'USDT';
    client.precisionMode = 2;
    await expect(connector.getSymbolTradingRules('ADAUSDT')).resolves.toMatchObject({
      amountPrecision: 1, amountPrecisionMode: 'DECIMAL_PLACES',
    });
    client.precisionMode = undefined;
    await expect(connector.getSymbolTradingRules('ADAUSDT')).resolves.toMatchObject({
      amountPrecisionMode: null,
    });
    expect(client.createOrder).not.toHaveBeenCalled();
  });

  it('preserves Gate swap contract counts through CCXT decimal requests and readback', async () => {
    const ccxt = (await import('ccxt')).default;
    const gate = new ccxt.gate({
      apiKey: 'offline-key', secret: 'offline-secret',
      options: { defaultType: 'swap', unifiedAccount: false },
    });
    const btc = gate.parseContractMarket({
      name: 'BTC_USDT', type: 'direct', quanto_multiplier: '0.0001',
      order_size_min: '1', enable_decimal: false, order_price_round: '0.1', status: 'trading',
    }, 'USDT');
    const eth = gate.parseContractMarket({
      name: 'ETH_USDT', type: 'direct', quanto_multiplier: '0.01',
      order_size_min: '0.1', enable_decimal: true, order_price_round: '0.1', status: 'trading',
    }, 'USDT');
    if (!btc || !eth || btc.contractSize == null || eth.contractSize == null) {
      throw new Error('Offline Gate market fixture did not parse');
    }
    gate.setMarkets([btc, eth]);
    await gate.loadMarkets();

    expect(gate.market('BTC/USDT:USDT')).toMatchObject({
      contractSize: 0.0001, precision: { amount: 1 }, limits: { amount: { min: 1 } },
    });
    expect(gate.market('ETH/USDT:USDT')).toMatchObject({
      contractSize: 0.01, precision: { amount: 0.1 }, limits: { amount: { min: 0.1 } },
    });
    expect(gate.createOrderRequest('BTC/USDT:USDT', 'market', 'buy', 2).size).toBe(2);
    expect(gate.createOrderRequest('ETH/USDT:USDT', 'market', 'buy', 1.7).size).toBe('1.7');
    const connector = new CcxtFuturesConnector(
      { exchangeId: 'gateio', marketType: 'swap' },
      vi.fn().mockResolvedValue(gate)
    );
    await expect(connector.getSymbolTradingRules('ETH_USDT')).resolves.toMatchObject({
      contractSize: 0.01, amountPrecision: 0.1,
      amountPrecisionMode: 'TICK_SIZE', minAmount: 0.1, minNotional: null,
    });
    await expect(connector.getSymbolTradingRules('BTC_USDT')).resolves.toMatchObject({
      contractSize: 0.0001, amountPrecision: 1,
      amountPrecisionMode: 'TICK_SIZE', minAmount: 1, minNotional: null,
    });
    const ethRules = await connector.getSymbolTradingRules('ETH_USDT');
    expect(ethRules.gateFuturesEconomics).toMatchObject({
      contract: 'ETH_USDT', contractType: 'direct', quantoMultiplier: 0.01,
      quote: 'USDT', settle: 'USDT', contractSize: 0.01,
    });
    expect(() => resolveRuntimeDcaOrderQuantity({
      quantity: 1.7, markPrice: 2000, marketType: 'FUTURES',
      rules: { ...ethRules, minNotional: 1 },
    })).toThrowError(/Runtime USDT DCA quantity cannot be confirmed/);
    expect(gate.sign('usdt/orders', ['private', 'futures'], 'POST', {
      contract: 'ETH_USDT', size: '1.7', price: '0', tif: 'ioc',
    }).headers?.['X-Gate-Size-Decimal']).toBe('1');
    expect(gate.sign('usdt/orders', ['private', 'futures'], 'POST', {
      contract: 'BTC_USDT', size: 2, price: '0', tif: 'ioc',
    }).headers?.['X-Gate-Size-Decimal']).toBe('1');
    expect(gate.sign('orders', ['private', 'spot'], 'POST', {
      currency_pair: 'ETH_USDT', amount: '1.7', price: '2000', side: 'buy',
    }).headers?.['X-Gate-Size-Decimal']).toBeUndefined();

    const rawOrder = {
      id: 'offline-order', contract: 'ETH_USDT', size: '1.7', left: '0.4',
      price: '2000', fill_price: '2000', finish_as: 'ioc', status: 'finished', tif: 'ioc',
    };
    const rawTrade = {
      id: 'offline-trade', contract: 'ETH_USDT', size: '-0.3', price: '2000',
      order_id: 'offline-order', create_time: '1',
    };
    const integerOrder = {
      id: 'integer-order', contract: 'BTC_USDT', size: '2', left: '0',
      price: '50000', fill_price: '50000', finish_as: 'ioc', status: 'finished', tif: 'ioc',
    };
    const integerTrade = {
      id: 'integer-trade', contract: 'BTC_USDT', size: '-2', price: '50000',
      order_id: 'integer-order', create_time: '1',
    };
    gate.privateFuturesPostSettleOrders = vi.fn()
      .mockResolvedValueOnce(rawOrder).mockResolvedValueOnce(integerOrder);
    gate.privateFuturesGetSettleOrdersOrderId = vi.fn()
      .mockResolvedValueOnce(rawOrder).mockResolvedValueOnce(integerOrder);
    gate.privateFuturesGetSettleMyTradesTimerange = vi.fn()
      .mockResolvedValueOnce([rawTrade]).mockResolvedValueOnce([integerTrade]);
    const created = await gate.createOrder('ETH/USDT:USDT', 'market', 'buy', 1.7);
    expect(gate.privateFuturesPostSettleOrders).toHaveBeenCalledWith(
      expect.objectContaining({ size: '1.7' })
    );
    expect(created).toMatchObject({ amount: 1.7, filled: 1.3, remaining: 0.4 });
    await expect(gate.fetchOrder('offline-order', 'ETH/USDT:USDT')).resolves.toMatchObject({
      amount: 1.7, filled: 1.3, remaining: 0.4,
    });
    await expect(gate.fetchMyTrades('ETH/USDT:USDT')).resolves.toEqual([
      expect.objectContaining({ amount: 0.3, cost: 6 }),
    ]);
    const integerCreated = await gate.createOrder('BTC/USDT:USDT', 'market', 'buy', 2);
    expect(gate.privateFuturesPostSettleOrders).toHaveBeenLastCalledWith(
      expect.objectContaining({ size: 2 })
    );
    expect(integerCreated).toMatchObject({ amount: 2, filled: 2, remaining: 0 });
    await expect(gate.fetchOrder('integer-order', 'BTC/USDT:USDT')).resolves.toMatchObject({
      amount: 2, filled: 2, remaining: 0,
    });
    await expect(gate.fetchMyTrades('BTC/USDT:USDT')).resolves.toEqual([
      expect.objectContaining({ amount: 2, cost: 10 }),
    ]);
    expect(2 * btc.contractSize * 50000).toBeCloseTo(10, 12);
    expect(1.7 * eth.contractSize * 2000).toBeCloseTo(34, 12);
    expect(1.3 * eth.contractSize * 2000).toBeCloseTo(26, 12);
    expect(0.3 * eth.contractSize * 2000).toBeCloseTo(6, 12);
  });

  it('marks Gate CCXT cost and inferred fee currency as unverified even with raw trade_value', async () => {
    const client = createMockClient();
    client.fetchMyTrades = vi.fn().mockResolvedValue([{ id: 't1', order: 'o1',
      symbol: 'BTC/USDT:USDT', amount: 100, price: 100, cost: 100,
      fee: { cost: 0.04, currency: 'USDT' },
      info: { size: '100', price: '100', fee: '0.04', trade_value: '100' },
    }]);
    const connector = new CcxtFuturesConnector(
      { exchangeId: 'gateio', marketType: 'swap' }, vi.fn().mockResolvedValue(client));
    const [fill] = await connector.fetchTradesForOrder({ symbol: 'BTCUSDT', orderId: 'o1' });
    expect(fill).toMatchObject({ notional: 100, notionalSource: 'CCXT_DERIVED_UNVERIFIED',
      notionalCurrency: null, feeCurrency: 'USDT', feeCurrencySource: 'CCXT_SETTLE_INFERRED' });
  });

  it('preserves an explicit Gate quoteQty when the contract unit is unavailable', async () => {
    const client = createMockClient();
    client.fetchMyTrades = vi.fn().mockResolvedValue([{ id: 't1', order: 'o1',
      symbol: 'ETH/USDT:USDT', amount: 1.3, price: 2000,
      info: { quoteQty: '26' },
    }]);
    const connector = new CcxtFuturesConnector(
      { exchangeId: 'gateio', marketType: 'swap' }, vi.fn().mockResolvedValue(client));
    const [fill] = await connector.fetchTradesForOrder({ symbol: 'ETHUSDT', orderId: 'o1' });
    expect(fill).toMatchObject({ notional: 26,
      notionalSource: 'QUOTE_QTY_FIELD_UNVERIFIED' });
  });

  it.each([1.3, 0.3])('uses proven Gate contract units for missing-cost decimal fill %s', async (amount) => {
    const client = createMockClient();
    const market = { id: 'ETH_USDT', symbol: 'ETH/USDT:USDT', swap: true,
      contract: true, linear: true, inverse: false, quote: 'USDT', settle: 'USDT',
      contractSize: 0.01, info: { name: 'ETH_USDT', type: 'direct',
        settle_currency: 'USDT', quanto_multiplier: '0.01' } };
    client.loadMarkets = vi.fn().mockResolvedValue({ 'ETH/USDT:USDT': market });
    (client as CcxtExchangeLikeClient & { market: (symbol: string) => unknown }).market =
      vi.fn().mockReturnValue(market);
    client.fetchMyTrades = vi.fn().mockResolvedValue([{ id: 't1', order: 'o1',
      symbol: 'ETH/USDT:USDT', amount, price: 2000,
      info: { contract: 'ETH_USDT', size: String(amount), price: '2000' },
    }]);
    const connector = new CcxtFuturesConnector(
      { exchangeId: 'gateio', marketType: 'swap' }, vi.fn().mockResolvedValue(client));
    await expect(connector.getSymbolTradingRules('ETHUSDT')).resolves.toMatchObject({
      contractSize: 0.01, gateFuturesEconomics: { contract: 'ETH_USDT', contractSize: 0.01 },
    });
    const [fill] = await connector.fetchTradesForOrder({ symbol: 'ETHUSDT', orderId: 'o1' });
    expect(fill).toMatchObject({ quantity: amount, notional: amount * 2000 * 0.01,
      notionalSource: 'GATE_CONTRACT_UNIT_VERIFIED', notionalCurrency: 'USDT' });
    client.fetchOrder = vi.fn().mockResolvedValue({ id: 'o1', symbol: 'ETH/USDT:USDT',
      amount, filled: amount, trades: [{ id: 't1', order: 'o1',
        symbol: 'ETH/USDT:USDT', amount, price: 2000 }],
    });
    const snapshot = await connector.fetchOrderWithFills({ symbol: 'ETHUSDT', orderId: 'o1' });
    expect(snapshot.fills[0]).toMatchObject({ notional: amount * 2000 * 0.01,
      notionalSource: 'GATE_CONTRACT_UNIT_VERIFIED' });
  });

  it.each([
    null,
    { id: 'ETH_USDT', symbol: 'ETH/USDT:USDT', swap: true, contract: true,
      linear: true, inverse: false, quote: 'USDT', settle: 'USDT',
      contractSize: 0.01, info: { name: 'ETH_USDT', type: 'direct' } },
    { id: 'ETH_USDT', symbol: 'ETH/USDT:USDT', swap: true, contract: true,
      linear: true, inverse: false, quote: 'USDT', settle: 'USDT',
      contractSize: 0.02, info: { name: 'ETH_USDT', type: 'direct', quanto_multiplier: '0.01' } },
    { id: 'ETH_USDT', symbol: 'ETH/USDT:USDT', swap: true, contract: true,
      linear: true, inverse: true, quote: 'USDT', settle: 'USDT',
      contractSize: 0.01, info: { name: 'ETH_USDT', type: 'inverse', quanto_multiplier: '0.01' } },
  ])('refuses missing-cost Gate fill without a verified matching unit (%#)', async (market) => {
    const client = createMockClient();
    client.loadMarkets = vi.fn().mockResolvedValue(market ? { 'ETH/USDT:USDT': market } : {});
    (client as CcxtExchangeLikeClient & { market: (symbol: string) => unknown }).market =
      vi.fn().mockReturnValue(market ?? undefined);
    client.fetchMyTrades = vi.fn().mockResolvedValue([{ id: 't1', order: 'o1',
      symbol: 'ETH/USDT:USDT', amount: 1.3, price: 2000,
    }]);
    const connector = new CcxtFuturesConnector(
      { exchangeId: 'gateio', marketType: 'swap' }, vi.fn().mockResolvedValue(client));
    await expect(connector.fetchTradesForOrder({ symbol: 'ETHUSDT', orderId: 'o1' }))
      .rejects.toThrow('GATE_FUTURES_FILL_CONTRACT_UNIT_UNVERIFIED');
  });

  it('rejects a loaded Gate unit that conflicts with rule-market metadata', async () => {
    const client = createMockClient();
    const market = { id: 'ETH_USDT', symbol: 'ETH/USDT:USDT', swap: true,
      contract: true, linear: true, inverse: false, quote: 'USDT', settle: 'USDT',
      contractSize: 0.01, info: { name: 'ETH_USDT', type: 'direct', quanto_multiplier: '0.01' } };
    client.loadMarkets = vi.fn().mockResolvedValue({ 'ETH/USDT:USDT': market });
    (client as CcxtExchangeLikeClient & { market: (symbol: string) => unknown }).market =
      vi.fn().mockReturnValue({ ...market, contractSize: 0.02 });
    client.fetchMyTrades = vi.fn().mockResolvedValue([{ id: 't1', order: 'o1',
      symbol: 'ETH/USDT:USDT', amount: 1.3, price: 2000,
    }]);
    const connector = new CcxtFuturesConnector(
      { exchangeId: 'gateio', marketType: 'swap' }, vi.fn().mockResolvedValue(client));
    await expect(connector.fetchTradesForOrder({ symbol: 'ETHUSDT', orderId: 'o1' }))
      .rejects.toThrow('GATE_FUTURES_FILL_CONTRACT_UNIT_UNVERIFIED');
  });

  it('refuses a loaded Gate unit when rule-market metadata cannot be read', async () => {
    const client = createMockClient();
    const market = { id: 'ETH_USDT', symbol: 'ETH/USDT:USDT', swap: true,
      contract: true, linear: true, inverse: false, quote: 'USDT', settle: 'USDT',
      contractSize: 0.01, info: { name: 'ETH_USDT', type: 'direct', quanto_multiplier: '0.01' } };
    client.loadMarkets = vi.fn().mockResolvedValue({ 'ETH/USDT:USDT': market });
    client.fetchMyTrades = vi.fn().mockResolvedValue([{ id: 't1', order: 'o1',
      symbol: 'ETH/USDT:USDT', amount: 1.3, price: 2000,
    }]);
    const connector = new CcxtFuturesConnector(
      { exchangeId: 'gateio', marketType: 'swap' }, vi.fn().mockResolvedValue(client));
    await expect(connector.fetchTradesForOrder({ symbol: 'ETHUSDT', orderId: 'o1' }))
      .rejects.toThrow('GATE_FUTURES_FILL_CONTRACT_UNIT_UNVERIFIED');
  });

  it.each([
    ['binance', 'future'], ['gateio', 'spot'],
  ] as const)('retains %s %s missing-cost base-asset fallback', async (exchangeId, marketType) => {
    const client = createMockClient();
    client.fetchMyTrades = vi.fn().mockResolvedValue([{ id: 't1', order: 'o1',
      symbol: 'ETHUSDT', amount: 1.3, price: 2000,
    }]);
    const connector = new CcxtFuturesConnector(
      { exchangeId, marketType }, vi.fn().mockResolvedValue(client));
    const [fill] = await connector.fetchTradesForOrder({ symbol: 'ETHUSDT', orderId: 'o1' });
    expect(fill).toMatchObject({ notional: 2600, notionalSource: 'LOCAL_FALLBACK_UNVERIFIED' });
  });

  it.each([
    ['USDT', 'VENUE_FIELD', 0.04, 'USDT'],
    ['BTC', 'CURRENCY_CONFLICT', null, null],
    [undefined, 'CCXT_SETTLE_INFERRED', 0.04, 'USDT'],
  ] as const)('checks Gate raw fee currency %s before normalizing a fill', async (
    rawCurrency, source, feeCost, feeCurrency,
  ) => {
    const client = createMockClient();
    client.fetchMyTrades = vi.fn().mockResolvedValue([{ id: 't1', order: 'o1',
      symbol: 'BTC/USDT:USDT', amount: 100, price: 100, cost: 100,
      fee: { cost: 0.04, currency: 'USDT' },
      info: { size: '100', price: '100', trade_value: '100', fee_currency: rawCurrency },
    }]);
    const connector = new CcxtFuturesConnector(
      { exchangeId: 'gateio', marketType: 'swap' }, vi.fn().mockResolvedValue(client));
    const [fill] = await connector.fetchTradesForOrder({ symbol: 'BTCUSDT', orderId: 'o1' });
    expect(fill).toMatchObject({ notional: 100, notionalSource: 'CCXT_DERIVED_UNVERIFIED',
      feeCurrencySource: source, feeCost, feeCurrency });
    expect(fill.raw).toMatchObject({ info: { trade_value: '100' } });
  });

  it('rejects missing, zero and invalid raw Gate contract sizes before DCA transport', async () => {
    const ccxt = (await import('ccxt')).default;
    for (const rawMultiplier of [undefined, '0', 'NaN', 'Infinity']) {
      const gate = new ccxt.gate({ options: { defaultType: 'swap', unifiedAccount: false } });
      const market = gate.parseContractMarket({
        name: 'ETH_USDT', type: 'direct', quanto_multiplier: rawMultiplier,
        order_size_min: '0.1', enable_decimal: true,
        order_price_round: '0.1', status: 'trading',
      }, 'USDT');
      gate.setMarkets([market]);
      const createOrder = vi.spyOn(gate, 'createOrder');
      const connector = new CcxtFuturesConnector(
        { exchangeId: 'gateio', marketType: 'swap' },
        vi.fn().mockResolvedValue(gate)
      );
      const rules = await connector.getSymbolTradingRules('ETH_USDT');
      expect(rules.contractSize).toBeNull();
      expect(() => resolveRuntimeDcaOrderQuantity({
        quantity: 1, markPrice: 10, marketType: 'FUTURES',
        rules: { ...rules, minNotional: 1 },
      })).toThrowError(/Runtime USDT DCA quantity cannot be confirmed/);
      expect(createOrder).not.toHaveBeenCalled();
    }
  });

  it('rejects conflicting normalized Gate contract size before DCA transport', async () => {
    const ccxt = (await import('ccxt')).default;
    const gate = new ccxt.gate({ options: { defaultType: 'swap', unifiedAccount: false } });
    const market = gate.parseContractMarket({
      name: 'ETH_USDT', type: 'direct', quanto_multiplier: '0.01',
      order_size_min: '0.1', enable_decimal: true,
      order_price_round: '0.1', status: 'trading',
    }, 'USDT');
    if (!market) throw new Error('Offline Gate market fixture did not parse');
    market.contractSize = 0.02;
    gate.setMarkets([market]);
    const createOrder = vi.spyOn(gate, 'createOrder');
    const connector = new CcxtFuturesConnector(
      { exchangeId: 'gateio', marketType: 'swap' }, vi.fn().mockResolvedValue(gate)
    );
    const rules = await connector.getSymbolTradingRules('ETH_USDT');
    expect(rules.contractSize).toBeNull();
    expect(() => resolveRuntimeDcaOrderQuantity({
      quantity: 1, markPrice: 10, marketType: 'FUTURES',
      rules: { ...rules, minNotional: 1 },
    })).toThrowError(/Runtime USDT DCA quantity cannot be confirmed/);
    expect(createOrder).not.toHaveBeenCalled();
  });

  it('rejects raw Gate inverse type even when CCXT normalizes a USDT market as linear', async () => {
    const ccxt = (await import('ccxt')).default;
    const gate = new ccxt.gate({ options: { defaultType: 'swap', unifiedAccount: false } });
    const market = gate.parseContractMarket({
      name: 'ETH_USDT', type: 'inverse', quanto_multiplier: '0.01',
      order_size_min: '1', enable_decimal: false,
      order_price_round: '0.1', status: 'trading',
    }, 'USDT');
    if (!market) throw new Error('Offline Gate market fixture did not parse');
    gate.setMarkets([market]);
    const createOrder = vi.spyOn(gate, 'createOrder');
    const connector = new CcxtFuturesConnector(
      { exchangeId: 'gateio', marketType: 'swap' }, vi.fn().mockResolvedValue(gate)
    );
    const rules = await connector.getSymbolTradingRules('ETH_USDT');
    expect(rules.contractSize).toBeNull();
    expect(rules.gateFuturesEconomics).toBeNull();
    expect(() => resolveRuntimeDcaOrderQuantity({
      quantity: 1, markPrice: 10, marketType: 'FUTURES',
      rules: { ...rules, minNotional: 1 },
    })).toThrowError(/Runtime USDT DCA quantity cannot be confirmed/);
    expect(createOrder).not.toHaveBeenCalled();
  });

  it('rejects invalid Gate minimum and decimal step metadata before DCA transport', async () => {
    const ccxt = (await import('ccxt')).default;
    const fixtures = [
      { name: 'missing minimum', min: undefined, decimal: true },
      { name: 'zero minimum', min: '0', decimal: true },
      { name: 'invalid minimum', min: 'NaN', decimal: true },
      { name: 'missing decimal flag', min: '0.1', decimal: undefined },
      { name: 'fractional minimum on integer market', min: '0.1', decimal: false },
      { name: 'fractional step on integer market', min: '1', decimal: false, normalizedStep: 0.1 },
      { name: 'normalized minimum differs', min: '0.1', decimal: true, normalizedMin: 0.2 },
      { name: 'normalized step differs', min: '0.1', decimal: true, normalizedStep: 1 },
    ] as const;
    for (const fixture of fixtures) {
      const gate = new ccxt.gate({ options: { defaultType: 'swap', unifiedAccount: false } });
      const market = gate.parseContractMarket({
        name: 'ETH_USDT', type: 'direct', quanto_multiplier: '0.01',
        order_size_min: fixture.min, enable_decimal: fixture.decimal,
        order_price_round: '0.1', status: 'trading',
      }, 'USDT');
      if (!market || !market.limits.amount) {
        throw new Error(`Offline Gate market fixture did not parse: ${fixture.name}`);
      }
      if ('normalizedMin' in fixture) market.limits.amount.min = fixture.normalizedMin;
      if ('normalizedStep' in fixture) market.precision.amount = fixture.normalizedStep;
      gate.setMarkets([market]);
      const createOrder = vi.spyOn(gate, 'createOrder');
      const connector = new CcxtFuturesConnector(
        { exchangeId: 'gateio', marketType: 'swap' }, vi.fn().mockResolvedValue(gate)
      );
      const rules = await connector.getSymbolTradingRules('ETH_USDT');
      expect(rules.amountPrecision, fixture.name).toBeNull();
      expect(() => resolveRuntimeDcaOrderQuantity({
        quantity: 1, markPrice: 10, marketType: 'FUTURES',
        rules: { ...rules, minNotional: 1 },
      }), fixture.name).toThrowError(/Runtime USDT DCA quantity cannot be confirmed/);
      expect(createOrder, fixture.name).not.toHaveBeenCalled();
    }
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
