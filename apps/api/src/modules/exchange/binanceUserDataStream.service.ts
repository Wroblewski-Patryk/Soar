import {
  BinanceFuturesAccountUpdateSchema,
  BinanceFuturesOrderTradeUpdateSchema,
  BinanceListenKeyResponseSchema,
  BinanceSpotExecutionReportSchema,
  BinanceSpotOutboundAccountPositionSchema,
  BinanceUserDataStreamMarketType,
  BinanceUserDataStreamMarketTypeSchema,
  NormalizedBinanceUserDataStreamEvent,
} from './binanceUserDataStream.types';

type BinanceUserDataStreamHttpResponse = {
  ok: boolean;
  status: number;
  text: () => Promise<string>;
};

type BinanceUserDataStreamHttpClient = (input: {
  url: string;
  method: 'POST' | 'PUT' | 'DELETE';
  headers: Record<string, string>;
  body?: string;
}) => Promise<BinanceUserDataStreamHttpResponse>;

type WebSocketLike = {
  on: (
    event: 'open' | 'message' | 'close' | 'error' | 'pong',
    listener: (...args: unknown[]) => void
  ) => void;
  send?: (payload: string) => void;
  ping?: () => void;
  close: () => void;
};

type WebSocketFactory = (url: string) => WebSocketLike;

type BinanceUserDataStreamConfig = {
  spotRestBaseUrl?: string;
  futuresRestBaseUrl?: string;
  spotWebSocketBaseUrl?: string;
  futuresWebSocketBaseUrl?: string;
  spotWebSocketApiUrl?: string;
};

export type BinanceUserDataStreamSession = {
  marketType: BinanceUserDataStreamMarketType;
  listenKey: string | null;
  ping: () => void;
  close: () => void;
};

const defaultHttpClient: BinanceUserDataStreamHttpClient = async (input) =>
  fetch(input.url, {
    method: input.method,
    headers: input.headers,
    body: input.body,
    signal: AbortSignal.timeout(10_000),
  }) as Promise<BinanceUserDataStreamHttpResponse>;

const defaultWebSocketFactory: WebSocketFactory = (url) => {
  const WebSocketCtor = require('ws') as new (address: string) => WebSocketLike;
  return new WebSocketCtor(url);
};

const defaultConfig: Required<BinanceUserDataStreamConfig> = {
  spotRestBaseUrl: 'https://api.binance.com',
  futuresRestBaseUrl: 'https://fapi.binance.com',
  spotWebSocketBaseUrl: 'wss://stream.binance.com:9443/ws',
  futuresWebSocketBaseUrl: 'wss://fstream.binance.com/private/ws',
  spotWebSocketApiUrl: 'wss://ws-api.binance.com:443/ws-api/v3',
};

const resolveListenKeyPath = (marketType: BinanceUserDataStreamMarketType) =>
  marketType === 'SPOT' ? '/api/v3/userDataStream' : '/fapi/v1/listenKey';

const resolveRestBaseUrl = (
  marketType: BinanceUserDataStreamMarketType,
  config: Required<BinanceUserDataStreamConfig>
) => (marketType === 'SPOT' ? config.spotRestBaseUrl : config.futuresRestBaseUrl);

const resolveWebSocketBaseUrl = (
  marketType: BinanceUserDataStreamMarketType,
  config: Required<BinanceUserDataStreamConfig>
) => (marketType === 'SPOT' ? config.spotWebSocketBaseUrl : config.futuresWebSocketBaseUrl);

const parseJsonSafe = (payload: string) => {
  try {
    return JSON.parse(payload) as unknown;
  } catch {
    return null;
  }
};

export const normalizeBinanceUserDataStreamEvent = (
  marketType: BinanceUserDataStreamMarketType,
  raw: unknown
): NormalizedBinanceUserDataStreamEvent => {
  if (marketType === 'FUTURES') {
    const orderUpdate = BinanceFuturesOrderTradeUpdateSchema.safeParse(raw);
    if (orderUpdate.success) {
      const parsed = orderUpdate.data;
      return {
        eventType: 'ORDER_TRADE_UPDATE',
        marketType,
        eventTime: parsed.E,
        transactionTime: parsed.T ?? null,
        symbol: parsed.o.s,
        side: parsed.o.S,
        orderType: parsed.o.o,
        orderStatus: parsed.o.X,
        executionType: parsed.o.x,
        exchangeOrderId: parsed.o.i,
        clientOrderId: parsed.o.c ?? null,
        averagePrice: parsed.o.ap ?? null,
        cumulativeFilledQuantity: parsed.o.z ?? null,
        lastFilledQuantity: parsed.o.l ?? null,
        lastFilledPrice: parsed.o.L ?? null,
        fee: parsed.o.n ?? null,
        feeCurrency: parsed.o.N ?? null,
        exchangeTradeId: parsed.o.t ?? null,
        raw,
      };
    }

    const accountUpdate = BinanceFuturesAccountUpdateSchema.safeParse(raw);
    if (accountUpdate.success) {
      const parsed = accountUpdate.data;
      return {
        eventType: 'ACCOUNT_UPDATE',
        marketType,
        eventTime: parsed.E,
        transactionTime: parsed.T ?? null,
        balances: parsed.a.B.map((item) => ({
          asset: item.a,
          walletBalance: item.wb ?? null,
          crossWalletBalance: item.cw ?? null,
          free: null,
          locked: null,
        })),
        positions: parsed.a.P.map((item) => ({
          symbol: item.s,
          amount: item.pa ?? null,
          entryPrice: item.ep ?? null,
          unrealizedPnl: item.up ?? null,
          positionSide: item.ps ?? null,
        })),
        raw,
      };
    }
  }

  if (marketType === 'SPOT') {
    const executionReport = BinanceSpotExecutionReportSchema.safeParse(raw);
    if (executionReport.success) {
      const parsed = executionReport.data;
      return {
        eventType: 'ORDER_TRADE_UPDATE',
        marketType,
        eventTime: parsed.E,
        transactionTime: parsed.T ?? null,
        symbol: parsed.s,
        side: parsed.S,
        orderType: parsed.o,
        orderStatus: parsed.X,
        executionType: parsed.x,
        exchangeOrderId: parsed.i,
        clientOrderId: parsed.c ?? null,
        averagePrice: parsed.Z != null && parsed.z && parsed.z > 0 ? parsed.Z / parsed.z : null,
        cumulativeFilledQuantity: parsed.z ?? null,
        lastFilledQuantity: parsed.l ?? null,
        lastFilledPrice: parsed.L ?? null,
        fee: parsed.n ?? null,
        feeCurrency: parsed.N ?? null,
        exchangeTradeId: parsed.t ?? null,
        raw,
      };
    }

    const accountPosition = BinanceSpotOutboundAccountPositionSchema.safeParse(raw);
    if (accountPosition.success) {
      const parsed = accountPosition.data;
      return {
        eventType: 'ACCOUNT_UPDATE',
        marketType,
        eventTime: parsed.E,
        transactionTime: null,
        balances: parsed.B.map((item) => ({
          asset: item.a,
          walletBalance: null,
          crossWalletBalance: null,
          free: item.f ?? null,
          locked: item.l ?? null,
        })),
        positions: [],
        raw,
      };
    }
  }

  const rawEventType =
    raw && typeof raw === 'object' && 'e' in raw && typeof (raw as { e?: unknown }).e === 'string'
      ? (raw as { e: string }).e
      : null;

  return {
    eventType: 'UNSUPPORTED',
    marketType,
    rawEventType,
    raw,
  };
};

export class BinanceUserDataStreamService {
  private readonly config: Required<BinanceUserDataStreamConfig>;

  constructor(
    private readonly httpClient: BinanceUserDataStreamHttpClient = defaultHttpClient,
    private readonly webSocketFactory: WebSocketFactory = defaultWebSocketFactory,
    config?: BinanceUserDataStreamConfig
  ) {
    this.config = {
      ...defaultConfig,
      ...config,
    };
  }

  async createListenKey(input: {
    marketType: BinanceUserDataStreamMarketType;
    apiKey: string;
  }): Promise<string> {
    const marketType = BinanceUserDataStreamMarketTypeSchema.parse(input.marketType);
    const response = await this.httpClient({
      url: `${resolveRestBaseUrl(marketType, this.config)}${resolveListenKeyPath(marketType)}`,
      method: 'POST',
      headers: {
        'X-MBX-APIKEY': input.apiKey,
      },
    });

    const text = await response.text();
    if (!response.ok) {
      throw new Error(`Binance listenKey create failed (${response.status})`);
    }

    return BinanceListenKeyResponseSchema.parse(parseJsonSafe(text)).listenKey;
  }

  async keepAliveListenKey(input: {
    marketType: BinanceUserDataStreamMarketType;
    apiKey: string;
    listenKey: string;
  }) {
    const marketType = BinanceUserDataStreamMarketTypeSchema.parse(input.marketType);
    const response = await this.httpClient({
      url: `${resolveRestBaseUrl(marketType, this.config)}${resolveListenKeyPath(marketType)}`,
      method: 'PUT',
      headers: {
        'X-MBX-APIKEY': input.apiKey,
        ...(marketType === 'SPOT' ? { 'Content-Type': 'application/x-www-form-urlencoded' } : {}),
      },
      body: marketType === 'SPOT' ? `listenKey=${encodeURIComponent(input.listenKey)}` : undefined,
    });

    if (!response.ok) {
      throw new Error(`Binance listenKey keepalive failed (${response.status})`);
    }
    const raw = parseJsonSafe(await response.text());
    return raw && typeof raw === 'object' && 'listenKey' in raw &&
      typeof raw.listenKey === 'string' ? raw.listenKey : input.listenKey;
  }

  async closeListenKey(input: {
    marketType: BinanceUserDataStreamMarketType;
    apiKey: string;
    listenKey: string;
  }) {
    const marketType = BinanceUserDataStreamMarketTypeSchema.parse(input.marketType);
    const response = await this.httpClient({
      url: `${resolveRestBaseUrl(marketType, this.config)}${resolveListenKeyPath(marketType)}`,
      method: 'DELETE',
      headers: {
        'X-MBX-APIKEY': input.apiKey,
        ...(marketType === 'SPOT' ? { 'Content-Type': 'application/x-www-form-urlencoded' } : {}),
      },
      body: marketType === 'SPOT' ? `listenKey=${encodeURIComponent(input.listenKey)}` : undefined,
    });

    if (!response.ok) {
      throw new Error(`Binance listenKey close failed (${response.status})`);
    }
  }

  connect(input: {
    marketType: BinanceUserDataStreamMarketType;
    listenKey: string;
    onEvent: (event: NormalizedBinanceUserDataStreamEvent) => void;
    onOpen?: () => void;
    onClose?: () => void;
    onError?: (error: unknown) => void;
    onPong?: () => void;
  }): BinanceUserDataStreamSession {
    const marketType = BinanceUserDataStreamMarketTypeSchema.parse(input.marketType);
    const socket = this.webSocketFactory(
      `${resolveWebSocketBaseUrl(marketType, this.config)}/${input.listenKey}`
    );

    socket.on('open', () => input.onOpen?.());
    socket.on('close', () => input.onClose?.());
    socket.on('error', (error) => input.onError?.(error));
    socket.on('pong', () => input.onPong?.());
    socket.on('message', (payload) => {
      const text =
        typeof payload === 'string'
          ? payload
          : Buffer.isBuffer(payload)
            ? payload.toString('utf8')
            : String(payload);
      const raw = parseJsonSafe(text);
      if (raw == null) {
        input.onError?.(new Error('Invalid Binance user-data-stream payload'));
        return;
      }
      input.onEvent(normalizeBinanceUserDataStreamEvent(marketType, raw));
    });

    return {
      marketType,
      listenKey: input.listenKey,
      ping: () => socket.ping?.(),
      close: () => socket.close(),
    };
  }

  connectSignedSpot(input: {
    apiKey: string;
    apiSecret: string;
    onEvent: (event: NormalizedBinanceUserDataStreamEvent) => void;
    onOpen?: () => void;
    onClose?: () => void;
    onError?: (error: unknown) => void;
    onPong?: () => void;
  }): BinanceUserDataStreamSession {
    const socket = this.webSocketFactory(this.config.spotWebSocketApiUrl);
    const requestId = randomUUID();
    let subscriptionId: number | null = null;
    socket.on('open', () => {
      try {
        if (!socket.send) throw new Error('SPOT_WEBSOCKET_SEND_UNAVAILABLE');
        const params = { apiKey: input.apiKey, timestamp: Date.now() };
        const payload = Object.entries(params).sort(([left], [right]) => left.localeCompare(right))
          .map(([key, value]) => `${key}=${value}`).join('&');
        const signature = createHmac('sha256', input.apiSecret).update(payload).digest('hex');
        socket.send(JSON.stringify({ id: requestId,
          method: 'userDataStream.subscribe.signature', params: { ...params, signature } }));
      } catch {
        input.onError?.(new Error('SPOT_SUBSCRIBE_SEND_FAILED'));
        socket.close();
      }
    });
    socket.on('close', () => input.onClose?.());
    socket.on('error', () => input.onError?.(new Error('SPOT_SOCKET_ERROR')));
    socket.on('pong', () => input.onPong?.());
    socket.on('message', (payload) => {
      const text = typeof payload === 'string' ? payload :
        Buffer.isBuffer(payload) ? payload.toString('utf8') : String(payload);
      const raw = parseJsonSafe(text);
      if (!raw || typeof raw !== 'object') {
        input.onError?.(new Error('SPOT_INVALID_PAYLOAD'));
        return;
      }
      const message = raw as Record<string, unknown>;
      if (message.id === requestId) {
        const result = message.result as Record<string, unknown> | null;
        if (message.status !== 200 || typeof result?.subscriptionId !== 'number') {
          input.onError?.(new Error('SPOT_SUBSCRIBE_REJECTED'));
          socket.close();
          return;
        }
        subscriptionId = result.subscriptionId;
        input.onOpen?.();
        return;
      }
      if (subscriptionId == null || message.subscriptionId !== subscriptionId ||
          !message.event || typeof message.event !== 'object') return;
      input.onEvent(normalizeBinanceUserDataStreamEvent('SPOT', message.event));
    });
    return { marketType: 'SPOT', listenKey: null,
      ping: () => socket.ping?.(), close: () => socket.close() };
  }
}
import { createHmac, randomUUID } from 'node:crypto';
