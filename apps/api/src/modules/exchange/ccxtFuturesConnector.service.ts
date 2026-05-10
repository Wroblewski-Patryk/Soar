import { CcxtCancelOrderInput, CcxtCancelOrderInputSchema, CcxtFetchOrderWithFillsInput, CcxtFetchOrderWithFillsInputSchema, CcxtFetchTradesForOrderInput, CcxtFetchTradesForOrderInputSchema, CcxtFetchWalletCashflowHistoryInput, CcxtFetchWalletCashflowHistoryInputSchema, CcxtFuturesConnectorConfig, CcxtFuturesConnectorConfigSchema, CcxtFuturesOpenOrder, CcxtFuturesOrderFill, CcxtFuturesOrderRequest, CcxtFuturesOrderRequestSchema, CcxtFuturesOrderResult, CcxtPublicCandle, CcxtPublicTickerSnapshot, CcxtWalletCashflowHistoryEntry } from './ccxtFuturesConnector.types';

type CcxtOrderLike = {
  id?: string;
  status?: string;
  symbol?: string;
  side?: string;
  type?: string;
  amount?: number;
  filled?: number;
  price?: number;
  average?: number;
  trades?: unknown[];
  fills?: unknown[];
  info?: Record<string, unknown>;
};

type CcxtTradeFeeLike = {
  cost?: number;
  currency?: string;
  rate?: number;
};

type CcxtTradeLike = {
  id?: string;
  order?: string;
  orderId?: string;
  symbol?: string;
  side?: string;
  price?: number;
  amount?: number;
  cost?: number;
  timestamp?: number;
  datetime?: string;
  fee?: CcxtTradeFeeLike | null;
  fees?: CcxtTradeFeeLike[];
  info?: Record<string, unknown>;
};

type CcxtWalletCashflowLike = {
  id?: string;
  txid?: string;
  referenceId?: string;
  type?: string;
  direction?: string;
  amount?: number;
  currency?: string;
  code?: string;
  timestamp?: number;
  datetime?: string;
  status?: string;
  fee?: CcxtTradeFeeLike | number | null;
  info?: Record<string, unknown>;
};

type CcxtPositionLike = {
  symbol?: string;
  contracts?: number;
  amount?: number;
  positionAmt?: number;
  info?: Record<string, unknown>;
};

export interface CcxtExchangeLikeClient {
  setSandboxMode?: (enabled: boolean) => void;
  loadMarkets: () => Promise<unknown>;
  fetchPositions?: (
    symbols?: string[],
    params?: Record<string, unknown>
  ) => Promise<CcxtPositionLike[]>;
  fetchTicker: (symbol: string) => Promise<{
    symbol?: string;
    timestamp?: number;
    last?: number | string | null;
    mark?: number | string | null;
    percentage?: number | string | null;
    info?: Record<string, unknown>;
  }>;
  fetchOHLCV?: (
    symbol: string,
    timeframe?: string,
    since?: number,
    limit?: number,
    params?: Record<string, unknown>
  ) => Promise<unknown[][]>;
  fetchOrder?: (
    id: string,
    symbol?: string,
    params?: Record<string, unknown>
  ) => Promise<CcxtOrderLike>;
  fetchMyTrades?: (
    symbol?: string,
    since?: number,
    limit?: number,
    params?: Record<string, unknown>
  ) => Promise<CcxtTradeLike[]>;
  fetchOpenOrders?: (
    symbol?: string,
    since?: number,
    limit?: number,
    params?: Record<string, unknown>
  ) => Promise<CcxtOrderLike[]>;
  fetchBalance?: (params?: Record<string, unknown>) => Promise<unknown>;
  fetchLedger?: (
    code?: string,
    since?: number,
    limit?: number,
    params?: Record<string, unknown>
  ) => Promise<CcxtWalletCashflowLike[]>;
  fetchDeposits?: (
    code?: string,
    since?: number,
    limit?: number,
    params?: Record<string, unknown>
  ) => Promise<CcxtWalletCashflowLike[]>;
  fetchWithdrawals?: (
    code?: string,
    since?: number,
    limit?: number,
    params?: Record<string, unknown>
  ) => Promise<CcxtWalletCashflowLike[]>;
  fetchTransactions?: (
    code?: string,
    since?: number,
    limit?: number,
    params?: Record<string, unknown>
  ) => Promise<CcxtWalletCashflowLike[]>;
  setLeverage?: (
    leverage: number,
    symbol?: string,
    params?: Record<string, unknown>
  ) => Promise<unknown>;
  setMarginMode?: (
    marginMode: string,
    symbol?: string,
    params?: Record<string, unknown>
  ) => Promise<unknown>;
  createOrder: (
    symbol: string,
    type: string,
    side: string,
    amount: number,
    price?: number,
    params?: Record<string, unknown>
  ) => Promise<CcxtOrderLike>;
  cancelOrder?: (id: string, symbol?: string, params?: Record<string, unknown>) => Promise<CcxtOrderLike>;
  close?: () => Promise<void>;
}

type CcxtModuleLike = {
  [exchangeId: string]: new (config: Record<string, unknown>) => CcxtExchangeLikeClient;
};

export type CcxtClientFactory = (
  exchangeId: string,
  config: Record<string, unknown>
) => Promise<CcxtExchangeLikeClient>;

const defaultCcxtClientFactory: CcxtClientFactory = async (exchangeId, config) => {
  const ccxtModule = (await import('ccxt')) as unknown as CcxtModuleLike;
  const ExchangeCtor = ccxtModule[exchangeId];
  if (!ExchangeCtor) {
    throw new Error(`Unsupported CCXT exchange: ${exchangeId}`);
  }

  return new ExchangeCtor(config);
};

export class CcxtFuturesConnector {
  private readonly config: CcxtFuturesConnectorConfig;
  private client: CcxtExchangeLikeClient | null = null;

  constructor(
    config: CcxtFuturesConnectorConfig,
    private readonly clientFactory: CcxtClientFactory = defaultCcxtClientFactory
  ) {
    this.config = CcxtFuturesConnectorConfigSchema.parse(config);
  }

  async connect() {
    const client = await this.getOrCreateClient();
    await client.loadMarkets();
  }

  private normalizeSymbolKey(value: string) {
    return value
      .trim()
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '');
  }

  private async resolveExchangeSymbol(symbol: string) {
    const client = await this.getOrCreateClient();
    const marketsRaw = await client.loadMarkets();
    const markets =
      marketsRaw && typeof marketsRaw === 'object'
        ? (marketsRaw as Record<string, Record<string, unknown>>)
        : {};
    const normalizedTarget = this.normalizeSymbolKey(symbol);
    if (!normalizedTarget) return symbol;

    const directMarket = markets[symbol];
    if (directMarket && typeof directMarket.symbol === 'string' && directMarket.symbol.trim().length > 0) {
      return directMarket.symbol;
    }

    for (const [marketKey, market] of Object.entries(markets)) {
      const marketSymbol =
        typeof market?.symbol === 'string' && market.symbol.trim().length > 0
          ? market.symbol
          : marketKey;
      const marketId =
        typeof market?.id === 'string' && market.id.trim().length > 0 ? market.id : marketKey;
      if (
        this.normalizeSymbolKey(marketKey) === normalizedTarget ||
        this.normalizeSymbolKey(marketSymbol) === normalizedTarget ||
        this.normalizeSymbolKey(marketId) === normalizedTarget
      ) {
        return marketSymbol;
      }
    }

    return symbol;
  }

  async fetchMarkPrice(symbol: string) {
    const client = await this.getOrCreateClient();
    const exchangeSymbol = await this.resolveExchangeSymbol(symbol);
    const ticker = await client.fetchTicker(exchangeSymbol);
    const markPrice = ticker.last;

    if (typeof markPrice !== 'number' || Number.isNaN(markPrice)) {
      throw new Error(`Unable to resolve mark price for ${symbol}`);
    }

    return markPrice;
  }

  async fetchTickerSnapshot(symbol: string): Promise<CcxtPublicTickerSnapshot> {
    const client = await this.getOrCreateClient();
    const exchangeSymbol = await this.resolveExchangeSymbol(symbol);
    const ticker = await client.fetchTicker(exchangeSymbol);
    const lastPrice = this.readNumber(ticker.last);
    if (lastPrice == null || lastPrice <= 0) {
      throw new Error(`Unable to resolve ticker last price for ${symbol}`);
    }

    const eventTime = this.readNumber(ticker.timestamp) ?? Date.now();
    return {
      symbol: this.readString(ticker.symbol) ?? exchangeSymbol,
      eventTime: Math.trunc(eventTime),
      lastPrice,
      markPrice: this.readNumber(ticker.mark),
      priceChangePercent24h: this.readNumber(ticker.percentage) ?? 0,
      raw: ticker,
    };
  }

  async fetchRecentCandles(input: {
    symbol: string;
    interval: string;
    limit?: number;
    since?: number;
  }): Promise<CcxtPublicCandle[]> {
    const client = await this.getOrCreateClient();
    if (typeof client.fetchOHLCV !== 'function') {
      throw new Error('fetchOHLCV is not supported by this CCXT connector');
    }

    const exchangeSymbol = await this.resolveExchangeSymbol(input.symbol);
    const limit = Math.min(1000, Math.max(1, Math.floor(input.limit ?? 100)));
    const rows = await client.fetchOHLCV(exchangeSymbol, input.interval, input.since, limit);
    return rows
      .map((row) => this.normalizePublicCandle(row, input.interval))
      .filter((row): row is CcxtPublicCandle => row != null)
      .sort((left, right) => left.openTime - right.openTime);
  }

  async hasOpenPosition(symbol: string): Promise<boolean> {
    const client = await this.getOrCreateClient();
    if (typeof client.fetchPositions !== 'function') return false;

    const normalize = (value: string) =>
      value
        .trim()
        .toUpperCase()
        .replace(/[/:]/g, '');
    const normalizedTarget = normalize(symbol);
    if (!normalizedTarget) return false;

    const extractContracts = (position: CcxtPositionLike) => {
      const info = position.info ?? {};
      const candidates: unknown[] = [
        position.contracts,
        position.amount,
        position.positionAmt,
        info.positionAmt,
        info.contracts,
      ];
      for (const candidate of candidates) {
        if (typeof candidate === 'number' && Number.isFinite(candidate)) return candidate;
        if (typeof candidate === 'string' && candidate.trim().length > 0) {
          const parsed = Number(candidate);
          if (Number.isFinite(parsed)) return parsed;
        }
      }
      return 0;
    };

    const positions =
      (await client.fetchPositions([symbol]).catch(async () => {
        if (typeof client.fetchPositions !== 'function') return [];
        return client.fetchPositions();
      })) ?? [];

    for (const position of positions) {
      const rawSymbol =
        (typeof position.symbol === 'string' && position.symbol.trim().length > 0
          ? position.symbol
          : (position.info?.symbol as string | undefined)) ?? '';
      if (!rawSymbol) continue;
      if (normalize(rawSymbol) !== normalizedTarget) continue;
      if (Math.abs(extractContracts(position)) > 0) return true;
    }
    return false;
  }

  async getSymbolTradingRules(symbol: string): Promise<{
    minAmount: number | null;
    minNotional: number | null;
    amountPrecision: number | null;
  }> {
    const client = await this.getOrCreateClient();
    const exchangeSymbol = await this.resolveExchangeSymbol(symbol);

    const anyClient = client as unknown as {
      market?: (id: string) => Record<string, unknown> | undefined;
      markets?: Record<string, Record<string, unknown>>;
    };

    const market =
      (typeof anyClient.market === 'function' ? anyClient.market(exchangeSymbol) : undefined) ??
      anyClient.markets?.[exchangeSymbol] ??
      null;

    const readNumber = (value: unknown): number | null => {
      if (typeof value === 'number' && Number.isFinite(value)) return value;
      if (typeof value === 'string' && value.trim().length > 0) {
        const parsed = Number(value);
        return Number.isFinite(parsed) ? parsed : null;
      }
      return null;
    };

    const limits = (market?.limits as Record<string, unknown> | undefined) ?? {};
    const amountLimits = (limits.amount as Record<string, unknown> | undefined) ?? {};
    const costLimits = (limits.cost as Record<string, unknown> | undefined) ?? {};
    const precision = (market?.precision as Record<string, unknown> | undefined) ?? {};

    return {
      minAmount: readNumber(amountLimits.min),
      minNotional: readNumber(costLimits.min),
      amountPrecision: readNumber(precision.amount),
    };
  }

  async placeOrder(input: CcxtFuturesOrderRequest): Promise<CcxtFuturesOrderResult> {
    const request = CcxtFuturesOrderRequestSchema.parse(input);
    const client = await this.getOrCreateClient();
    const params: Record<string, unknown> = {};

    if (this.config.marketType === 'future') {
      if (typeof request.reduceOnly === 'boolean') {
        params.reduceOnly = request.reduceOnly;
      }
      if (request.positionMode === 'HEDGE') {
        if (!request.positionSide) {
          throw new Error('positionSide is required in HEDGE mode');
        }
        params.positionSide = request.positionSide;
      }
    } else if (this.config.marketType === 'spot') {
      if (typeof request.reduceOnly === 'boolean') {
        throw new Error('reduceOnly is not supported in SPOT mode');
      }
      if (request.positionMode === 'HEDGE' || request.positionSide) {
        throw new Error('HEDGE position parameters are not supported in SPOT mode');
      }
    }
    if (request.clientOrderId) {
      params.clientOrderId = request.clientOrderId;
    }

    const order = await client.createOrder(
      request.symbol,
      request.type,
      request.side,
      request.amount,
      request.price,
      params
    );

    const fills = this.normalizeOrderFills(order, request.symbol, 'createOrder');

    return {
      id: order.id ?? '',
      status: order.status,
      symbol: order.symbol,
      side: order.side,
      type: order.type,
      amount: order.amount,
      filled: order.filled,
      price: order.price,
      average: order.average,
      fills,
      raw: order,
    };
  }

  async cancelOrder(input: CcxtCancelOrderInput): Promise<CcxtFuturesOrderResult> {
    const request = CcxtCancelOrderInputSchema.parse(input);
    const client = await this.getOrCreateClient();
    if (typeof client.cancelOrder !== 'function') {
      throw new Error('cancelOrder is not supported by this CCXT connector');
    }
    const exchangeSymbol = await this.resolveExchangeSymbol(request.symbol);
    const order = await client.cancelOrder(request.orderId, exchangeSymbol);
    return { id: this.readString(order.id) ?? request.orderId, status: this.readString(order.status) ?? 'canceled',
      symbol: this.readString(order.symbol) ?? exchangeSymbol, side: this.readString(order.side) ?? undefined,
      type: this.readString(order.type) ?? undefined, amount: this.readNumber(order.amount) ?? undefined,
      filled: this.readNumber(order.filled) ?? undefined, price: this.readNumber(order.price) ?? undefined,
      average: this.readNumber(order.average) ?? undefined, raw: order };
  }

  async fetchOrderWithFills(
    input: CcxtFetchOrderWithFillsInput
  ): Promise<{ order: CcxtFuturesOrderResult; fills: CcxtFuturesOrderFill[] }> {
    const request = CcxtFetchOrderWithFillsInputSchema.parse(input);
    const client = await this.getOrCreateClient();
    if (typeof client.fetchOrder !== 'function') {
      throw new Error('fetchOrder is not supported by this CCXT connector');
    }

    const exchangeSymbol = await this.resolveExchangeSymbol(request.symbol);
    const order = await client.fetchOrder(request.orderId, exchangeSymbol);
    const fills = this.normalizeOrderFills(order, request.symbol, 'fetchOrder');

    return {
      order: this.normalizeOrderResult(order, fills),
      fills,
    };
  }

  async fetchTradesForOrder(input: CcxtFetchTradesForOrderInput): Promise<CcxtFuturesOrderFill[]> {
    const request = CcxtFetchTradesForOrderInputSchema.parse(input);
    const client = await this.getOrCreateClient();
    if (typeof client.fetchMyTrades !== 'function') {
      throw new Error('fetchMyTrades is not supported by this CCXT connector');
    }

    const exchangeSymbol = await this.resolveExchangeSymbol(request.symbol);
    const trades = await client.fetchMyTrades(exchangeSymbol, request.since, request.limit, {
      orderId: request.orderId,
    });

    return trades
      .filter((trade) => {
        const orderIdFromTrade =
          trade.order ?? trade.orderId ?? this.readString(trade.info?.orderId);
        return orderIdFromTrade === request.orderId;
      })
      .map((trade) => this.normalizeTradeFill(trade, request.symbol, 'fetchMyTrades'));
  }

  async fetchTradesForWindow(input: {
    symbol: string;
    since?: number;
    limit?: number;
  }): Promise<CcxtFuturesOrderFill[]> {
    const request = CcxtFetchTradesForOrderInputSchema.omit({ orderId: true }).parse(input);
    const client = await this.getOrCreateClient();
    if (typeof client.fetchMyTrades !== 'function') {
      throw new Error('fetchMyTrades is not supported by this CCXT connector');
    }

    const exchangeSymbol = await this.resolveExchangeSymbol(request.symbol);
    const trades = await client.fetchMyTrades(exchangeSymbol, request.since, request.limit);

    return trades.map((trade) => this.normalizeTradeFill(trade, request.symbol, 'fetchMyTrades'));
  }

  async fetchOpenOrders(input?: { symbol?: string }): Promise<CcxtFuturesOpenOrder[]> {
    const client = await this.getOrCreateClient();
    if (typeof client.fetchOpenOrders !== 'function') {
      throw new Error('fetchOpenOrders is not supported by this CCXT connector');
    }

    const exchangeSymbol = input?.symbol ? await this.resolveExchangeSymbol(input.symbol) : undefined;
    const orders = await client.fetchOpenOrders(exchangeSymbol);
    return orders.map((order) => this.normalizeOpenOrder(order, input?.symbol ?? order.symbol ?? ''));
  }

  async fetchPositions(input?: { symbols?: string[] }): Promise<CcxtPositionLike[]> {
    const client = await this.getOrCreateClient();
    if (typeof client.fetchPositions !== 'function') {
      throw new Error('fetchPositions is not supported by this CCXT connector');
    }

    const positions = await client.fetchPositions(input?.symbols);
    return Array.isArray(positions) ? positions : [];
  }

  async fetchBalance(params?: Record<string, unknown>): Promise<unknown> {
    const client = await this.getOrCreateClient();
    if (typeof client.fetchBalance !== 'function') {
      throw new Error('fetchBalance is not supported by this CCXT connector');
    }
    return client.fetchBalance(params);
  }

  async fetchWalletCashflowHistory(
    input: CcxtFetchWalletCashflowHistoryInput = {}
  ): Promise<CcxtWalletCashflowHistoryEntry[]> {
    const request = CcxtFetchWalletCashflowHistoryInputSchema.parse(input);
    const client = await this.getOrCreateClient();
    const supportedReads = [
      ['fetchLedger', client.fetchLedger] as const,
      ['fetchDeposits', client.fetchDeposits] as const,
      ['fetchWithdrawals', client.fetchWithdrawals] as const,
      ['fetchTransactions', client.fetchTransactions] as const,
    ].filter(([, fn]) => typeof fn === 'function');

    if (supportedReads.length === 0) {
      throw new Error('wallet cashflow history is not supported by this CCXT connector');
    }

    const entries = await Promise.all(
      supportedReads.map(async ([source, fn]) => {
        const rows = await fn!.call(client, request.currency, request.since, request.limit);
        return (Array.isArray(rows) ? rows : []).map((row) =>
          this.normalizeWalletCashflowEntry(row, source)
        );
      })
    );

    return entries.flat().sort((left, right) => {
      const leftTime = left.occurredAt?.getTime() ?? 0;
      const rightTime = right.occurredAt?.getTime() ?? 0;
      return leftTime - rightTime;
    });
  }

  async loadMarketsMap(): Promise<Record<string, unknown>> {
    const client = await this.getOrCreateClient();
    const marketMap = await client.loadMarkets();
    if (!marketMap || typeof marketMap !== 'object') return {};
    return marketMap as Record<string, unknown>;
  }

  async convergeFuturesLeverageAndMargin(input: {
    symbol: string;
    leverage?: number | null;
    marginMode?: 'cross' | 'isolated' | null;
  }): Promise<{ leverageApplied: boolean; marginModeApplied: boolean }> {
    if (this.config.marketType !== 'future') {
      return { leverageApplied: false, marginModeApplied: false };
    }

    const client = await this.getOrCreateClient();
    const symbol = input.symbol.trim();
    const targetLeverage = Number.isFinite(input.leverage) ? Math.max(1, Math.floor(input.leverage!)) : null;
    const targetMarginMode = input.marginMode?.trim().toLowerCase() as 'cross' | 'isolated' | undefined;

    let leverageApplied = false;
    let marginModeApplied = false;

    if (targetMarginMode && typeof client.setMarginMode === 'function') {
      try {
        await client.setMarginMode(targetMarginMode, symbol);
        marginModeApplied = true;
      } catch (error) {
        if (!this.isBenignConvergenceError(error)) {
          throw error;
        }
      }
    }

    if (typeof targetLeverage === 'number' && typeof client.setLeverage === 'function') {
      try {
        await client.setLeverage(targetLeverage, symbol);
        leverageApplied = true;
      } catch (error) {
        if (!this.isBenignConvergenceError(error)) {
          throw error;
        }
      }
    }

    return { leverageApplied, marginModeApplied };
  }

  async disconnect() {
    if (!this.client) return;

    if (typeof this.client.close === 'function') {
      await this.client.close();
    }
    this.client = null;
  }

  private async getOrCreateClient() {
    if (this.client) return this.client;

    const client = await this.clientFactory(this.config.exchangeId, {
      apiKey: this.config.apiKey,
      secret: this.config.secret,
      password: this.config.password,
      enableRateLimit: this.config.enableRateLimit,
      options: {
        defaultType: this.config.marketType,
      },
    });

    if (this.config.sandbox && typeof client.setSandboxMode === 'function') {
      client.setSandboxMode(true);
    }

    this.client = client;
    return client;
  }

  private normalizeOrderResult(
    order: CcxtOrderLike,
    fills: CcxtFuturesOrderFill[]
  ): CcxtFuturesOrderResult {
    return {
      id: order.id ?? '',
      status: order.status,
      symbol: order.symbol,
      side: order.side,
      type: order.type,
      amount: order.amount,
      filled: order.filled,
      price: order.price,
      average: order.average,
      fills,
      raw: order,
    };
  }

  private normalizeOrderFills(
    order: CcxtOrderLike,
    fallbackSymbol: string,
    source: CcxtFuturesOrderFill['source']
  ): CcxtFuturesOrderFill[] {
    const directTrades = Array.isArray(order.trades) ? order.trades : [];
    const directFills = Array.isArray(order.fills) ? order.fills : [];
    const binanceInfoFills = Array.isArray(order.info?.fills) ? order.info?.fills : [];
    const merged = [...directTrades, ...directFills, ...binanceInfoFills];

    return merged
      .map((entry) => this.normalizeTradeFill(entry, order.symbol ?? fallbackSymbol, source, order.id))
      .filter((fill) => fill.quantity > 0);
  }

  private normalizeOpenOrder(order: CcxtOrderLike, fallbackSymbol: string): CcxtFuturesOpenOrder {
    const filled = this.readNumber(order.filled) ?? 0;
    const amount = this.readNumber(order.amount) ?? filled;
    const remainingCandidate = this.readNumber(order.info?.remaining) ?? this.readNumber(order.info?.origQty);
    const remaining =
      this.readNumber((order as Record<string, unknown>).remaining) ??
      (typeof remainingCandidate === 'number' && Number.isFinite(remainingCandidate)
        ? Math.max(0, remainingCandidate - filled)
        : null);
    const timestampMs =
      this.readNumber((order as Record<string, unknown>).timestamp) ??
      this.readNumber(order.info?.time) ??
      this.readNumber(order.info?.transactTime);

    return {
      id: order.id ?? '',
      symbol: this.readString(order.symbol) ?? fallbackSymbol,
      side: this.readString(order.side),
      type: this.readString(order.type),
      status: this.readString(order.status),
      amount,
      filled,
      remaining,
      price: this.readNumber(order.price),
      timestamp: typeof timestampMs === 'number' ? new Date(timestampMs) : null,
      raw: order,
    };
  }

  private normalizeTradeFill(
    tradeRaw: unknown,
    fallbackSymbol: string,
    source: CcxtFuturesOrderFill['source'],
    fallbackOrderId?: string
  ): CcxtFuturesOrderFill {
    const trade = (tradeRaw as CcxtTradeLike | undefined) ?? {};
    const topLevel = this.readRecord(tradeRaw) ?? {};
    const info = this.readRecord(trade.info) ?? topLevel;
    const quantity =
      this.readNumber(trade.amount) ??
      this.readNumber(topLevel.qty) ??
      this.readNumber(topLevel.executedQty) ??
      this.readNumber(info.qty) ??
      this.readNumber(info.executedQty) ??
      0;
    const price =
      this.readNumber(trade.price) ?? this.readNumber(topLevel.price) ?? this.readNumber(info.price) ?? 0;
    const notional =
      this.readNumber(trade.cost) ??
      this.readNumber(topLevel.quoteQty) ??
      this.readNumber(info.quoteQty) ??
      (price > 0 && quantity > 0 ? price * quantity : 0);
    const { feeCost, feeCurrency, feeRate } = this.extractFee({
      ...trade,
      info,
    });
    const executedAtMs =
      this.readNumber(trade.timestamp) ??
      this.readNumber(topLevel.time) ??
      this.readNumber(topLevel.timestamp) ??
      this.readNumber(info.time) ??
      this.readNumber(info.timestamp);

    return {
      exchangeTradeId:
        this.readString(trade.id) ??
        this.readString(topLevel.tradeId) ??
        this.readString(topLevel.id) ??
        this.readString(info.tradeId) ??
        this.readString(info.id),
      exchangeOrderId:
        this.readString(trade.order) ??
        this.readString(trade.orderId) ??
        this.readString(topLevel.orderId) ??
        this.readString(info.orderId) ??
        fallbackOrderId ??
        null,
      symbol:
        this.readString(trade.symbol) ??
        this.readString(topLevel.symbol) ??
        this.readString(info.symbol) ??
        fallbackSymbol,
      side:
        this.readString(trade.side) ??
        this.readString(topLevel.side) ??
        this.readString(topLevel.positionSide) ??
        this.readString(info.side) ??
        this.readString(info.positionSide) ??
        null,
      price,
      quantity,
      notional,
      feeCost,
      feeCurrency,
      feeRate,
      executedAt: typeof executedAtMs === 'number' ? new Date(executedAtMs) : null,
      source,
      raw: tradeRaw,
    };
  }

  private normalizeWalletCashflowEntry(
    rawEntry: unknown,
    source: CcxtWalletCashflowHistoryEntry['source']
  ): CcxtWalletCashflowHistoryEntry {
    const entry = (rawEntry as CcxtWalletCashflowLike | undefined) ?? {};
    const topLevel = this.readRecord(rawEntry) ?? {};
    const info = this.readRecord(entry.info) ?? topLevel;
    const type =
      this.readString(entry.type) ??
      this.readString(topLevel.type) ??
      this.readString(info.type) ??
      this.readString(info.incomeType) ??
      this.readString(info.tranType) ??
      this.readString(info.transferType);
    const rawAmount =
      this.readNumber(entry.amount) ??
      this.readNumber(topLevel.amount) ??
      this.readNumber(info.amount) ??
      this.readNumber(info.income) ??
      this.readNumber(info.delta) ??
      this.readNumber(info.qty) ??
      0;
    const fee = this.extractWalletCashflowFee(entry, topLevel, info);
    const direction = this.resolveWalletCashflowDirection({
      amount: rawAmount,
      direction: this.readString(entry.direction) ?? this.readString(topLevel.direction),
      source,
      type,
    });
    const occurredAt =
      this.readDate(entry.timestamp) ??
      this.readDate(topLevel.timestamp) ??
      this.readDate(topLevel.time) ??
      this.readDate(topLevel.datetime) ??
      this.readDate(info.time) ??
      this.readDate(info.insertTime) ??
      this.readDate(info.applyTime) ??
      this.readDate(info.updateTime) ??
      this.readDate(info.createdAt) ??
      this.readDate(entry.datetime);

    return {
      exchangeEventId:
        this.readString(entry.id) ??
        this.readString(entry.txid) ??
        this.readString(entry.referenceId) ??
        this.readString(topLevel.id) ??
        this.readString(topLevel.txid) ??
        this.readString(info.id) ??
        this.readString(info.txId) ??
        this.readString(info.tranId) ??
        this.readString(info.applyId) ??
        this.readString(info.withdrawOrderId),
      direction,
      type,
      amount: Math.abs(rawAmount),
      currency:
        this.readString(entry.currency) ??
        this.readString(entry.code) ??
        this.readString(topLevel.currency) ??
        this.readString(topLevel.code) ??
        this.readString(info.asset) ??
        this.readString(info.coin) ??
        this.readString(info.currency),
      feeCost: fee.cost,
      feeCurrency: fee.currency,
      occurredAt,
      status:
        this.readString(entry.status) ??
        this.readString(topLevel.status) ??
        this.readString(info.status),
      source,
      raw: rawEntry,
    };
  }

  private normalizePublicCandle(row: unknown, interval: string): CcxtPublicCandle | null {
    if (!Array.isArray(row) || row.length < 6) return null;
    const openTime = this.readNumber(row[0]);
    const open = this.readNumber(row[1]);
    const high = this.readNumber(row[2]);
    const low = this.readNumber(row[3]);
    const close = this.readNumber(row[4]);
    const volume = this.readNumber(row[5]);
    const values = [openTime, open, high, low, close, volume] as const;
    if (values.some((value) => value == null)) return null;
    const [safeOpenTime, safeOpen, safeHigh, safeLow, safeClose, safeVolume] = values as [
      number, number, number, number, number, number,
    ];
    if (safeOpenTime < 0 || safeOpen <= 0 || safeHigh <= 0 || safeLow <= 0 || safeClose <= 0 || safeVolume < 0) {
      return null;
    }

    return {
      openTime: Math.trunc(safeOpenTime),
      closeTime: Math.trunc(safeOpenTime + this.resolveIntervalMs(interval) - 1),
      open: safeOpen,
      high: safeHigh,
      low: safeLow,
      close: safeClose,
      volume: safeVolume,
      raw: row,
    };
  }

  private resolveIntervalMs(interval: string) {
    const normalized = interval.trim().toLowerCase();
    const match = /^(\d+)([mhdw])$/.exec(normalized);
    if (!match) return 60_000;
    const amount = Number(match[1]);
    const unit = match[2];
    const multipliers: Record<string, number> = {
      m: 60_000,
      h: 3_600_000,
      d: 86_400_000,
      w: 604_800_000,
    };
    return Math.max(1, amount) * multipliers[unit];
  }

  private extractWalletCashflowFee(
    entry: CcxtWalletCashflowLike,
    topLevel: Record<string, unknown>,
    info: Record<string, unknown>
  ) {
    if (typeof entry.fee === 'number' && Number.isFinite(entry.fee)) {
      return { cost: entry.fee, currency: null };
    }
    const feeRecord = this.readRecord(entry.fee);
    return {
      cost:
        this.readNumber(feeRecord?.cost) ??
        this.readNumber(topLevel.fee) ??
        this.readNumber(info.fee) ??
        this.readNumber(info.transactionFee) ??
        0,
      currency:
        this.readString(feeRecord?.currency) ??
        this.readString(info.feeAsset) ??
        this.readString(info.commissionAsset),
    };
  }

  private resolveWalletCashflowDirection(input: {
    amount: number;
    direction: string | null;
    source: CcxtWalletCashflowHistoryEntry['source'];
    type: string | null;
  }): CcxtWalletCashflowHistoryEntry['direction'] {
    const direction = input.direction?.toLowerCase() ?? '';
    const type = input.type?.toLowerCase() ?? '';
    if (input.source === 'fetchDeposits' || direction === 'in' || direction === 'credit') return 'IN';
    if (input.source === 'fetchWithdrawals' || direction === 'out' || direction === 'debit') return 'OUT';
    if (input.amount > 0) return 'IN';
    if (input.amount < 0) return 'OUT';
    if (/(deposit|transfer_in|income|realized_pnl|funding_fee)/i.test(type)) return 'IN';
    if (/(withdraw|transfer_out|expense|commission|fee)/i.test(type)) return 'OUT';
    return 'NEUTRAL';
  }

  private extractFee(trade: CcxtTradeLike): {
    feeCost: number;
    feeCurrency: string | null;
    feeRate: number | null;
  } {
    const fees = Array.isArray(trade.fees) ? trade.fees : [];
    if (fees.length > 0) {
      const total = fees.reduce((sum, fee) => sum + (this.readNumber(fee.cost) ?? 0), 0);
      const currency = this.readString(fees[0]?.currency) ?? null;
      const rate = this.readNumber(fees[0]?.rate) ?? null;
      return { feeCost: total, feeCurrency: currency, feeRate: rate };
    }

    const feeCost =
      this.readNumber(trade.fee?.cost) ??
      this.readNumber(trade.info?.commission) ??
      this.readNumber(trade.info?.fee) ??
      0;
    const feeCurrency =
      this.readString(trade.fee?.currency) ??
      this.readString(trade.info?.commissionAsset) ??
      this.readString(trade.info?.feeAsset) ??
      null;
    const feeRate = this.readNumber(trade.fee?.rate) ?? null;
    return { feeCost, feeCurrency, feeRate };
  }

  private readNumber(value: unknown): number | null {
    if (typeof value === 'number' && Number.isFinite(value)) return value;
    if (typeof value === 'string' && value.trim().length > 0) {
      const parsed = Number(value);
      return Number.isFinite(parsed) ? parsed : null;
    }
    return null;
  }

  private readDate(value: unknown): Date | null {
    if (typeof value === 'number' && Number.isFinite(value)) return new Date(value);
    if (typeof value === 'string' && value.trim().length > 0) {
      const parsedNumber = Number(value);
      if (Number.isFinite(parsedNumber)) return new Date(parsedNumber);
      const parsedDate = Date.parse(value);
      if (Number.isFinite(parsedDate)) return new Date(parsedDate);
    }
    return null;
  }

  private readString(value: unknown): string | null {
    if (typeof value === 'string' && value.trim().length > 0) return value.trim();
    if (typeof value === 'number' && Number.isFinite(value)) return String(value);
    return null;
  }

  private readRecord(value: unknown): Record<string, unknown> | null {
    if (typeof value !== 'object' || value === null) return null;
    return value as Record<string, unknown>;
  }

  private isBenignConvergenceError(error: unknown): boolean {
    if (!(error instanceof Error)) return false;
    return /(already|no need|not modified|same|unchanged|exists)/i.test(error.message);
  }
}
