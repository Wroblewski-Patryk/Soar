import type { Exchange } from '@prisma/client';

export type ApiKeyProbeMarketType = 'spot' | 'future';

export type ApiKeyProbeInput = {
  exchange: Exchange;
  apiKey: string;
  apiSecret: string;
};

export type ApiKeyProbeCode =
  | 'OK'
  | 'INVALID_KEY'
  | 'INVALID_SECRET'
  | 'IP_RESTRICTED'
  | 'MISSING_SPOT_SCOPE'
  | 'MISSING_FUTURES_SCOPE'
  | 'NETWORK_TIMEOUT'
  | 'UNKNOWN';

export type ApiKeyProbeResult = {
  ok: boolean;
  code: ApiKeyProbeCode;
  message: string;
  permissions: {
    spot: boolean;
    futures: boolean;
  };
};

export interface ApiKeyProbeClientLike {
  fetchBalance: (params?: Record<string, unknown>) => Promise<unknown>;
  close?: () => Promise<void>;
}

export type ApiKeyProbeClientFactory = (
  exchange: Exchange,
  marketType: ApiKeyProbeMarketType,
  input: ApiKeyProbeInput
) => Promise<ApiKeyProbeClientLike>;

const EXCHANGE_DISPLAY_NAMES: Record<Exchange, string> = {
  BINANCE: 'Binance',
  BYBIT: 'Bybit',
  OKX: 'OKX',
  KRAKEN: 'Kraken',
  COINBASE: 'Coinbase',
  GATEIO: 'Gate.io',
};

const resolveCcxtExchangeId = (exchange: Exchange) => exchange.toLowerCase();

export const resolveApiKeyProbeCcxtDefaultType = (
  exchange: Exchange,
  marketType: ApiKeyProbeMarketType
) => {
  if (marketType === 'spot') return 'spot';
  if (exchange === 'GATEIO') return 'swap';
  return 'future';
};

export const createExchangeApiKeyProbeClient: ApiKeyProbeClientFactory = async (
  exchange,
  marketType,
  input
) => {
  const ccxtModule = (await import('ccxt')) as unknown as {
    [exchangeId: string]: new (config: Record<string, unknown>) => ApiKeyProbeClientLike;
  };
  const exchangeId = resolveCcxtExchangeId(exchange);
  const ExchangeCtor = ccxtModule[exchangeId];
  if (!ExchangeCtor) {
    throw new Error(`Unsupported CCXT exchange: ${exchangeId}`);
  }

  return new ExchangeCtor({
    apiKey: input.apiKey,
    secret: input.apiSecret,
    enableRateLimit: true,
    options: {
      defaultType: resolveApiKeyProbeCcxtDefaultType(exchange, marketType),
    },
  });
};

const toErrorMessage = (error: unknown) => {
  if (error instanceof Error) return error.message.toLowerCase();
  return String(error).toLowerCase();
};

const mapProbeError = (error: unknown, scope: ApiKeyProbeMarketType): ApiKeyProbeCode => {
  const message = toErrorMessage(error);

  if (
    message.includes('invalid api-key') ||
    message.includes('api-key format invalid') ||
    message.includes('api key format invalid') ||
    message.includes('invalid key')
  ) {
    return 'INVALID_KEY';
  }

  if (
    message.includes('signature for this request is not valid') ||
    message.includes('invalid signature') ||
    message.includes('signature')
  ) {
    return 'INVALID_SECRET';
  }

  if (
    message.includes('unauthorized ip') ||
    message.includes('ip not in whitelist') ||
    message.includes('invalid ip')
  ) {
    return 'IP_RESTRICTED';
  }

  if (
    message.includes('timed out') ||
    message.includes('timeout') ||
    message.includes('econnreset') ||
    message.includes('econnrefused') ||
    message.includes('enotfound') ||
    message.includes('network error')
  ) {
    return 'NETWORK_TIMEOUT';
  }

  if (
    message.includes('permission') ||
    message.includes('not authorized') ||
    message.includes('insufficient')
  ) {
    return scope === 'future' ? 'MISSING_FUTURES_SCOPE' : 'MISSING_SPOT_SCOPE';
  }

  return 'UNKNOWN';
};

export const formatProbeMessage = (exchange: Exchange, code: ApiKeyProbeCode) => {
  const label = EXCHANGE_DISPLAY_NAMES[exchange] ?? exchange;
  switch (code) {
    case 'OK':
      return `${label} API key permissions validated.`;
    case 'INVALID_KEY':
      return `${label} rejected API key format or value.`;
    case 'INVALID_SECRET':
      return `${label} rejected API secret/signature.`;
    case 'IP_RESTRICTED':
      return `${label} rejected request due to IP restriction.`;
    case 'MISSING_SPOT_SCOPE':
      return `${label} key has no Spot permission.`;
    case 'MISSING_FUTURES_SCOPE':
      return `${label} key has no Futures permission.`;
    case 'NETWORK_TIMEOUT':
      return `${label} connection timed out.`;
    default:
      return `${label} validation failed.`;
  }
};

const probeScope = async (
  marketType: ApiKeyProbeMarketType,
  input: ApiKeyProbeInput,
  clientFactory: ApiKeyProbeClientFactory
) => {
  const client = await clientFactory(input.exchange, marketType, input);
  try {
    await client.fetchBalance();
  } finally {
    if (typeof client.close === 'function') {
      await client.close();
    }
  }
};

export const probeExchangeApiKeyPermissions = async (
  input: ApiKeyProbeInput,
  clientFactory: ApiKeyProbeClientFactory = createExchangeApiKeyProbeClient
): Promise<ApiKeyProbeResult> => {
  const permissions = {
    spot: false,
    futures: false,
  };

  try {
    await probeScope('spot', input, clientFactory);
    permissions.spot = true;
  } catch (error) {
    const code = mapProbeError(error, 'spot');
    return {
      ok: false,
      code,
      message: formatProbeMessage(input.exchange, code),
      permissions,
    };
  }

  try {
    await probeScope('future', input, clientFactory);
    permissions.futures = true;
  } catch (error) {
    const code = mapProbeError(error, 'future');
    return {
      ok: false,
      code,
      message: formatProbeMessage(input.exchange, code),
      permissions,
    };
  }

  return {
    ok: true,
    code: 'OK',
    message: formatProbeMessage(input.exchange, 'OK'),
    permissions,
  };
};
