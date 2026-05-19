import { Exchange } from '@prisma/client';

import { DomainError } from '../../lib/errors';
import {
  ExchangeMarketType,
  assertExchangeExecutionCapabilitySupport,
  resolveExchangeExecutionSource,
  supportsExchangeExecutionCapability,
} from './exchangeExecutionCapabilityContract.service';

export const EXCHANGE_AUTHENTICATED_READ_UNSUPPORTED_CODE =
  'EXCHANGE_AUTHENTICATED_READ_UNSUPPORTED' as const;

export type AuthenticatedExchangeReadOperation =
  | 'BALANCE_PREVIEW'
  | 'POSITIONS_SNAPSHOT'
  | 'OPEN_ORDERS_SNAPSHOT'
  | 'TRADE_HISTORY_SNAPSHOT'
  | 'WALLET_CASHFLOW_HISTORY';

export class ExchangeAuthenticatedReadUnsupportedError extends DomainError<{
  exchange: Exchange;
  marketType: ExchangeMarketType;
  operation: AuthenticatedExchangeReadOperation;
}> {
  constructor(
    public readonly exchange: Exchange,
    public readonly marketType: ExchangeMarketType,
    public readonly operation: AuthenticatedExchangeReadOperation
  ) {
    super(
      EXCHANGE_AUTHENTICATED_READ_UNSUPPORTED_CODE,
      `Exchange ${exchange}/${marketType} does not support authenticated read ${operation}.`,
      {
        status: 501,
        details: {
          exchange,
          marketType,
          operation,
        },
        name: 'ExchangeAuthenticatedReadUnsupportedError',
      }
    );
  }
}

export const supportsAuthenticatedExchangeRead = (
  exchange: Exchange,
  marketType: ExchangeMarketType,
  operation: AuthenticatedExchangeReadOperation
) => supportsExchangeExecutionCapability(exchange, marketType, operation);

export const assertAuthenticatedExchangeReadSupport = (
  exchange: Exchange,
  marketType: ExchangeMarketType,
  operation: AuthenticatedExchangeReadOperation
) => {
  try {
    assertExchangeExecutionCapabilitySupport(exchange, marketType, operation);
  } catch {
    throw new ExchangeAuthenticatedReadUnsupportedError(exchange, marketType, operation);
  }
};

export const resolveAuthenticatedExchangeReadSource = (
  exchange: Exchange,
  marketType?: ExchangeMarketType
) => resolveExchangeExecutionSource(exchange, marketType);
