import { Exchange } from '@prisma/client';

import { DomainError } from '../../lib/errors';
import { ExchangeMarketType, getExchangeMarketTypeOptions } from './exchangeCapabilities';

export type { ExchangeMarketType };

export const EXCHANGE_EXECUTION_CAPABILITY_UNSUPPORTED_CODE =
  'EXCHANGE_EXECUTION_CAPABILITY_UNSUPPORTED' as const;

export type ExchangeExecutionCapabilityOperation =
  | 'BALANCE_PREVIEW'
  | 'POSITIONS_SNAPSHOT'
  | 'OPEN_ORDERS_SNAPSHOT'
  | 'TRADE_HISTORY_SNAPSHOT'
  | 'WALLET_CASHFLOW_HISTORY'
  | 'LIVE_ORDER_SUBMIT'
  | 'LIVE_ORDER_CANCEL';

const EXCHANGE_EXECUTION_CAPABILITY_MATRIX: Record<
  Exchange,
  Record<ExchangeMarketType, Record<ExchangeExecutionCapabilityOperation, boolean>>
> = {
  BINANCE: {
    FUTURES: {
      BALANCE_PREVIEW: true,
      POSITIONS_SNAPSHOT: true,
      OPEN_ORDERS_SNAPSHOT: true,
      TRADE_HISTORY_SNAPSHOT: true,
      WALLET_CASHFLOW_HISTORY: true,
      LIVE_ORDER_SUBMIT: true,
      LIVE_ORDER_CANCEL: true,
    },
    SPOT: {
      BALANCE_PREVIEW: true,
      POSITIONS_SNAPSHOT: true,
      OPEN_ORDERS_SNAPSHOT: true,
      TRADE_HISTORY_SNAPSHOT: true,
      WALLET_CASHFLOW_HISTORY: true,
      LIVE_ORDER_SUBMIT: true,
      LIVE_ORDER_CANCEL: true,
    },
  },
  BYBIT: {
    FUTURES: {
      BALANCE_PREVIEW: false,
      POSITIONS_SNAPSHOT: false,
      OPEN_ORDERS_SNAPSHOT: false,
      TRADE_HISTORY_SNAPSHOT: false,
      WALLET_CASHFLOW_HISTORY: false,
      LIVE_ORDER_SUBMIT: false,
      LIVE_ORDER_CANCEL: false,
    },
    SPOT: {
      BALANCE_PREVIEW: false,
      POSITIONS_SNAPSHOT: false,
      OPEN_ORDERS_SNAPSHOT: false,
      TRADE_HISTORY_SNAPSHOT: false,
      WALLET_CASHFLOW_HISTORY: false,
      LIVE_ORDER_SUBMIT: false,
      LIVE_ORDER_CANCEL: false,
    },
  },
  OKX: {
    FUTURES: {
      BALANCE_PREVIEW: false,
      POSITIONS_SNAPSHOT: false,
      OPEN_ORDERS_SNAPSHOT: false,
      TRADE_HISTORY_SNAPSHOT: false,
      WALLET_CASHFLOW_HISTORY: false,
      LIVE_ORDER_SUBMIT: false,
      LIVE_ORDER_CANCEL: false,
    },
    SPOT: {
      BALANCE_PREVIEW: false,
      POSITIONS_SNAPSHOT: false,
      OPEN_ORDERS_SNAPSHOT: false,
      TRADE_HISTORY_SNAPSHOT: false,
      WALLET_CASHFLOW_HISTORY: false,
      LIVE_ORDER_SUBMIT: false,
      LIVE_ORDER_CANCEL: false,
    },
  },
  KRAKEN: {
    FUTURES: {
      BALANCE_PREVIEW: false,
      POSITIONS_SNAPSHOT: false,
      OPEN_ORDERS_SNAPSHOT: false,
      TRADE_HISTORY_SNAPSHOT: false,
      WALLET_CASHFLOW_HISTORY: false,
      LIVE_ORDER_SUBMIT: false,
      LIVE_ORDER_CANCEL: false,
    },
    SPOT: {
      BALANCE_PREVIEW: false,
      POSITIONS_SNAPSHOT: false,
      OPEN_ORDERS_SNAPSHOT: false,
      TRADE_HISTORY_SNAPSHOT: false,
      WALLET_CASHFLOW_HISTORY: false,
      LIVE_ORDER_SUBMIT: false,
      LIVE_ORDER_CANCEL: false,
    },
  },
  COINBASE: {
    FUTURES: {
      BALANCE_PREVIEW: false,
      POSITIONS_SNAPSHOT: false,
      OPEN_ORDERS_SNAPSHOT: false,
      TRADE_HISTORY_SNAPSHOT: false,
      WALLET_CASHFLOW_HISTORY: false,
      LIVE_ORDER_SUBMIT: false,
      LIVE_ORDER_CANCEL: false,
    },
    SPOT: {
      BALANCE_PREVIEW: false,
      POSITIONS_SNAPSHOT: false,
      OPEN_ORDERS_SNAPSHOT: false,
      TRADE_HISTORY_SNAPSHOT: false,
      WALLET_CASHFLOW_HISTORY: false,
      LIVE_ORDER_SUBMIT: false,
      LIVE_ORDER_CANCEL: false,
    },
  },
  GATEIO: {
    FUTURES: {
      BALANCE_PREVIEW: true,
      POSITIONS_SNAPSHOT: true,
      OPEN_ORDERS_SNAPSHOT: true,
      TRADE_HISTORY_SNAPSHOT: true,
      WALLET_CASHFLOW_HISTORY: true,
      LIVE_ORDER_SUBMIT: true,
      LIVE_ORDER_CANCEL: true,
    },
    SPOT: {
      BALANCE_PREVIEW: true,
      POSITIONS_SNAPSHOT: true,
      OPEN_ORDERS_SNAPSHOT: true,
      TRADE_HISTORY_SNAPSHOT: true,
      WALLET_CASHFLOW_HISTORY: true,
      LIVE_ORDER_SUBMIT: true,
      LIVE_ORDER_CANCEL: true,
    },
  },
};

export class ExchangeExecutionCapabilityUnsupportedError extends DomainError<{
  exchange: Exchange;
  marketType: ExchangeMarketType;
  operation: ExchangeExecutionCapabilityOperation;
}> {
  constructor(
    public readonly exchange: Exchange,
    public readonly marketType: ExchangeMarketType,
    public readonly operation: ExchangeExecutionCapabilityOperation
  ) {
    super(
      EXCHANGE_EXECUTION_CAPABILITY_UNSUPPORTED_CODE,
      `Exchange ${exchange}/${marketType} does not support ${operation}.`,
      {
        status: 501,
        details: {
          exchange,
          marketType,
          operation,
        },
        name: 'ExchangeExecutionCapabilityUnsupportedError',
      }
    );
  }
}

export const supportsExchangeExecutionCapability = (
  exchange: Exchange,
  marketType: ExchangeMarketType,
  operation: ExchangeExecutionCapabilityOperation
) =>
  getExchangeMarketTypeOptions(exchange).includes(marketType) &&
  (EXCHANGE_EXECUTION_CAPABILITY_MATRIX[exchange]?.[marketType]?.[operation] ?? false);

export const assertExchangeExecutionCapabilitySupport = (
  exchange: Exchange,
  marketType: ExchangeMarketType,
  operation: ExchangeExecutionCapabilityOperation
) => {
  if (!supportsExchangeExecutionCapability(exchange, marketType, operation)) {
    throw new ExchangeExecutionCapabilityUnsupportedError(exchange, marketType, operation);
  }
};

export const resolveExchangeExecutionSource = (
  exchange: Exchange,
  _marketType?: ExchangeMarketType
) => exchange;
