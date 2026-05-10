import type { Exchange } from '@prisma/client';
import {
  createExchangeApiKeyProbeClient,
  resolveApiKeyProbeFetchBalanceParams,
  resolveApiKeyProbeCcxtDefaultType,
  type ExchangeApiKeyProbeClientFactory,
  type ExchangeApiKeyProbeClientInput,
  type ExchangeApiKeyProbeClientLike,
  type ExchangeApiKeyProbeMarketType,
} from '../../exchange/exchangeApiKeyProbeClient.service';

export {
  createExchangeApiKeyProbeClient,
  resolveApiKeyProbeFetchBalanceParams,
  resolveApiKeyProbeCcxtDefaultType,
} from '../../exchange/exchangeApiKeyProbeClient.service';

export type ApiKeyProbeMarketType = ExchangeApiKeyProbeMarketType;
export type ApiKeyProbeInput = ExchangeApiKeyProbeClientInput;

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

export type ApiKeyProbeClientLike = ExchangeApiKeyProbeClientLike;
export type ApiKeyProbeClientFactory = ExchangeApiKeyProbeClientFactory;

const EXCHANGE_DISPLAY_NAMES: Record<Exchange, string> = {
  BINANCE: 'Binance',
  BYBIT: 'Bybit',
  OKX: 'OKX',
  KRAKEN: 'Kraken',
  COINBASE: 'Coinbase',
  GATEIO: 'Gate.io',
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

const PROBE_CODE_PRIORITY: Record<ApiKeyProbeCode, number> = {
  OK: 0,
  INVALID_KEY: 1,
  INVALID_SECRET: 2,
  IP_RESTRICTED: 3,
  NETWORK_TIMEOUT: 4,
  MISSING_SPOT_SCOPE: 5,
  MISSING_FUTURES_SCOPE: 5,
  UNKNOWN: 6,
};

const selectProbeFailureCode = (codes: ApiKeyProbeCode[]): ApiKeyProbeCode => {
  return codes
    .filter((code) => code !== 'OK')
    .sort((left, right) => PROBE_CODE_PRIORITY[left] - PROBE_CODE_PRIORITY[right])[0] ?? 'UNKNOWN';
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

const formatProbeSuccessMessage = (
  exchange: Exchange,
  permissions: ApiKeyProbeResult['permissions']
) => {
  const label = EXCHANGE_DISPLAY_NAMES[exchange] ?? exchange;
  const scopes = [
    permissions.spot ? 'Spot' : null,
    permissions.futures ? 'Futures' : null,
  ].filter(Boolean);

  if (scopes.length === 0 || scopes.length === 2) {
    return formatProbeMessage(exchange, 'OK');
  }

  return `${label} API key permissions validated for ${scopes[0]}.`;
};

const probeScope = async (
  marketType: ApiKeyProbeMarketType,
  input: ApiKeyProbeInput,
  clientFactory: ApiKeyProbeClientFactory
) => {
  const client = await clientFactory(input.exchange, marketType, input);
  try {
    await client.fetchBalance(resolveApiKeyProbeFetchBalanceParams(input.exchange, marketType));
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
  const failureCodes: ApiKeyProbeCode[] = [];

  try {
    await probeScope('spot', input, clientFactory);
    permissions.spot = true;
  } catch (error) {
    const code = mapProbeError(error, 'spot');
    failureCodes.push(code);
  }

  try {
    await probeScope('future', input, clientFactory);
    permissions.futures = true;
  } catch (error) {
    const code = mapProbeError(error, 'future');
    failureCodes.push(code);
  }

  if (permissions.spot || permissions.futures) {
    return {
      ok: true,
      code: 'OK',
      message: formatProbeSuccessMessage(input.exchange, permissions),
      permissions,
    };
  }

  if (failureCodes.length > 0) {
    const code = selectProbeFailureCode(failureCodes);
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
    message: formatProbeSuccessMessage(input.exchange, permissions),
    permissions,
  };
};
