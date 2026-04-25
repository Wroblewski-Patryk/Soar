import { Exchange } from '@prisma/client';

import { DomainError } from '../../lib/errors';

export const EXCHANGE_EXECUTION_CAPABILITY_UNSUPPORTED_CODE =
  'EXCHANGE_EXECUTION_CAPABILITY_UNSUPPORTED' as const;

export type ExchangeExecutionCapabilityOperation =
  | 'BALANCE_PREVIEW'
  | 'POSITIONS_SNAPSHOT'
  | 'OPEN_ORDERS_SNAPSHOT'
  | 'LIVE_ORDER_SUBMIT'
  | 'LIVE_ORDER_CANCEL';

const EXCHANGE_EXECUTION_CAPABILITY_MATRIX: Record<
  Exchange,
  Record<ExchangeExecutionCapabilityOperation, boolean>
> = {
  BINANCE: {
    BALANCE_PREVIEW: true,
    POSITIONS_SNAPSHOT: true,
    OPEN_ORDERS_SNAPSHOT: true,
    LIVE_ORDER_SUBMIT: true,
    LIVE_ORDER_CANCEL: false,
  },
  BYBIT: {
    BALANCE_PREVIEW: false,
    POSITIONS_SNAPSHOT: false,
    OPEN_ORDERS_SNAPSHOT: false,
    LIVE_ORDER_SUBMIT: false,
    LIVE_ORDER_CANCEL: false,
  },
  OKX: {
    BALANCE_PREVIEW: false,
    POSITIONS_SNAPSHOT: false,
    OPEN_ORDERS_SNAPSHOT: false,
    LIVE_ORDER_SUBMIT: false,
    LIVE_ORDER_CANCEL: false,
  },
  KRAKEN: {
    BALANCE_PREVIEW: false,
    POSITIONS_SNAPSHOT: false,
    OPEN_ORDERS_SNAPSHOT: false,
    LIVE_ORDER_SUBMIT: false,
    LIVE_ORDER_CANCEL: false,
  },
  COINBASE: {
    BALANCE_PREVIEW: false,
    POSITIONS_SNAPSHOT: false,
    OPEN_ORDERS_SNAPSHOT: false,
    LIVE_ORDER_SUBMIT: false,
    LIVE_ORDER_CANCEL: false,
  },
};

export class ExchangeExecutionCapabilityUnsupportedError extends DomainError<{
  exchange: Exchange;
  operation: ExchangeExecutionCapabilityOperation;
}> {
  constructor(
    public readonly exchange: Exchange,
    public readonly operation: ExchangeExecutionCapabilityOperation
  ) {
    super(
      EXCHANGE_EXECUTION_CAPABILITY_UNSUPPORTED_CODE,
      `Exchange ${exchange} does not support ${operation}.`,
      {
        status: 501,
        details: {
          exchange,
          operation,
        },
        name: 'ExchangeExecutionCapabilityUnsupportedError',
      }
    );
  }
}

export const supportsExchangeExecutionCapability = (
  exchange: Exchange,
  operation: ExchangeExecutionCapabilityOperation
) => EXCHANGE_EXECUTION_CAPABILITY_MATRIX[exchange]?.[operation] ?? false;

export const assertExchangeExecutionCapabilitySupport = (
  exchange: Exchange,
  operation: ExchangeExecutionCapabilityOperation
) => {
  if (!supportsExchangeExecutionCapability(exchange, operation)) {
    throw new ExchangeExecutionCapabilityUnsupportedError(exchange, operation);
  }
};

export const resolveExchangeExecutionSource = (exchange: Exchange) => exchange;
