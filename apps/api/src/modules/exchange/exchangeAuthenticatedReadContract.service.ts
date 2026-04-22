import { Exchange } from '@prisma/client';

import { DomainError } from '../../lib/errors';

export const EXCHANGE_AUTHENTICATED_READ_UNSUPPORTED_CODE =
  'EXCHANGE_AUTHENTICATED_READ_UNSUPPORTED' as const;

export type AuthenticatedExchangeReadOperation =
  | 'BALANCE_PREVIEW'
  | 'POSITIONS_SNAPSHOT'
  | 'OPEN_ORDERS_SNAPSHOT';

const AUTHENTICATED_EXCHANGE_READ_SUPPORT_MATRIX: Record<
  Exchange,
  Record<AuthenticatedExchangeReadOperation, boolean>
> = {
  BINANCE: {
    BALANCE_PREVIEW: true,
    POSITIONS_SNAPSHOT: true,
    OPEN_ORDERS_SNAPSHOT: true,
  },
  BYBIT: {
    BALANCE_PREVIEW: false,
    POSITIONS_SNAPSHOT: false,
    OPEN_ORDERS_SNAPSHOT: false,
  },
  OKX: {
    BALANCE_PREVIEW: false,
    POSITIONS_SNAPSHOT: false,
    OPEN_ORDERS_SNAPSHOT: false,
  },
  KRAKEN: {
    BALANCE_PREVIEW: false,
    POSITIONS_SNAPSHOT: false,
    OPEN_ORDERS_SNAPSHOT: false,
  },
  COINBASE: {
    BALANCE_PREVIEW: false,
    POSITIONS_SNAPSHOT: false,
    OPEN_ORDERS_SNAPSHOT: false,
  },
};

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
) => AUTHENTICATED_EXCHANGE_READ_SUPPORT_MATRIX[exchange]?.[operation] ?? false;

export const assertAuthenticatedExchangeReadSupport = (
  exchange: Exchange,
  operation: AuthenticatedExchangeReadOperation
) => {
  if (!supportsAuthenticatedExchangeRead(exchange, operation)) {
    throw new ExchangeAuthenticatedReadUnsupportedError(exchange, operation);
  }
};

export const resolveAuthenticatedExchangeReadSource = (exchange: Exchange) => exchange;
