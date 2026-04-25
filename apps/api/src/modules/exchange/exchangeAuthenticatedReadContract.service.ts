import { Exchange } from '@prisma/client';

import { DomainError } from '../../lib/errors';
import {
  assertExchangeExecutionCapabilitySupport,
  resolveExchangeExecutionSource,
  supportsExchangeExecutionCapability,
} from './exchangeExecutionCapabilityContract.service';

export const EXCHANGE_AUTHENTICATED_READ_UNSUPPORTED_CODE =
  'EXCHANGE_AUTHENTICATED_READ_UNSUPPORTED' as const;

export type AuthenticatedExchangeReadOperation =
  | 'BALANCE_PREVIEW'
  | 'POSITIONS_SNAPSHOT'
  | 'OPEN_ORDERS_SNAPSHOT';

export class ExchangeAuthenticatedReadUnsupportedError extends DomainError<{
  exchange: Exchange;
  operation: AuthenticatedExchangeReadOperation;
}> {
  constructor(
    public readonly exchange: Exchange,
    public readonly operation: AuthenticatedExchangeReadOperation
  ) {
    super(
      EXCHANGE_AUTHENTICATED_READ_UNSUPPORTED_CODE,
      `Exchange ${exchange} does not support authenticated read ${operation}.`,
      {
        status: 501,
        details: {
          exchange,
          operation,
        },
        name: 'ExchangeAuthenticatedReadUnsupportedError',
      }
    );
  }
}

export const supportsAuthenticatedExchangeRead = (
  exchange: Exchange,
  operation: AuthenticatedExchangeReadOperation
) => supportsExchangeExecutionCapability(exchange, operation);

export const assertAuthenticatedExchangeReadSupport = (
  exchange: Exchange,
  operation: AuthenticatedExchangeReadOperation
) => {
  try {
    assertExchangeExecutionCapabilitySupport(exchange, operation);
  } catch {
    throw new ExchangeAuthenticatedReadUnsupportedError(exchange, operation);
  }
};

export const resolveAuthenticatedExchangeReadSource = (exchange: Exchange) =>
  resolveExchangeExecutionSource(exchange);
