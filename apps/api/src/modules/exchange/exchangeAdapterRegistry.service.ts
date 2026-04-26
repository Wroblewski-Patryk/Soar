import { Exchange } from '@prisma/client';

import { DomainError } from '../../lib/errors';
import { decrypt } from '../../utils/crypto';
import { CcxtFuturesConnector } from './ccxtFuturesConnector.service';
import { CcxtSpotConnector } from './ccxtSpotConnector.service';
import {
  createBinanceFuturesLiveOrderAdapter,
  createBinanceSpotLiveOrderAdapter,
  LiveOrderAdapter,
} from './liveOrderAdapter.service';
import { getExchangeMarketTypeOptions } from './exchangeCapabilities';

type TradeMarket = 'FUTURES' | 'SPOT';

export type ExchangeContext = {
  exchange: Exchange;
  marketType: TradeMarket;
};

export type ExchangePublicConnectorFactory = () => CcxtFuturesConnector;
export type ExchangeAuthenticatedConnectorFactory = (credentials: {
  apiKey: string;
  apiSecret: string;
}) => CcxtFuturesConnector;

export type ExchangeMarketDataAdapterEntry = {
  createPublicConnector: ExchangePublicConnectorFactory;
};

export type ExchangeMetadataAdapterEntry = {
  createPublicConnector: ExchangePublicConnectorFactory;
};

export type ExchangeAccountAdapterEntry = {
  createAuthenticatedConnector: ExchangeAuthenticatedConnectorFactory;
};

export type ExchangeExecutionAdapterEntry = {
  createAuthenticatedConnector: ExchangeAuthenticatedConnectorFactory;
  createLiveOrderAdapter: (connector: CcxtFuturesConnector) => LiveOrderAdapter;
};

export type ExchangeAdapterFamilyRegistryEntry = {
  marketData: ExchangeMarketDataAdapterEntry;
  metadata: ExchangeMetadataAdapterEntry;
  account: ExchangeAccountAdapterEntry;
  execution: ExchangeExecutionAdapterEntry;
};

export const EXCHANGE_CONTEXT_UNSUPPORTED_CODE = 'EXCHANGE_CONTEXT_UNSUPPORTED' as const;

export class ExchangeContextUnsupportedError extends DomainError<{
  exchange: Exchange;
  marketType: TradeMarket;
}> {
  constructor(
    public readonly exchange: Exchange,
    public readonly marketType: TradeMarket
  ) {
    super(
      EXCHANGE_CONTEXT_UNSUPPORTED_CODE,
      `Exchange context ${exchange}/${marketType} is not supported.`,
      {
        status: 501,
        details: {
          exchange,
          marketType,
        },
        name: 'ExchangeContextUnsupportedError',
      }
    );
  }
}

const resolveConnectorMarketType = (marketType: TradeMarket) =>
  marketType === 'SPOT' ? 'spot' : 'future';

const assertExchangeContextSupported = (context: ExchangeContext) => {
  if (!getExchangeMarketTypeOptions(context.exchange).includes(context.marketType)) {
    throw new ExchangeContextUnsupportedError(context.exchange, context.marketType);
  }
};

export const resolveExchangeAdapterRegistryEntry = (
  context: ExchangeContext
): ExchangeAdapterFamilyRegistryEntry => {
  assertExchangeContextSupported(context);

  const createPublicConnector =
    context.marketType === 'SPOT'
      ? () =>
          new CcxtSpotConnector({
            exchangeId: context.exchange.toLowerCase(),
            marketType: 'spot',
          })
      : () =>
          new CcxtFuturesConnector({
            exchangeId: context.exchange.toLowerCase(),
            marketType: resolveConnectorMarketType(context.marketType),
          });

  const createAuthenticatedConnector =
    context.marketType === 'SPOT'
      ? (credentials: { apiKey: string; apiSecret: string }) =>
          new CcxtSpotConnector({
            exchangeId: context.exchange.toLowerCase(),
            apiKey: decrypt(credentials.apiKey),
            secret: decrypt(credentials.apiSecret),
            marketType: 'spot',
          })
      : (credentials: { apiKey: string; apiSecret: string }) =>
          new CcxtFuturesConnector({
            exchangeId: context.exchange.toLowerCase(),
            apiKey: decrypt(credentials.apiKey),
            secret: decrypt(credentials.apiSecret),
            marketType: context.marketType,
          });

  const createLiveOrderAdapter =
    context.marketType === 'SPOT'
      ? createBinanceSpotLiveOrderAdapter
      : createBinanceFuturesLiveOrderAdapter;

  return {
    marketData: {
      createPublicConnector,
    },
    metadata: {
      createPublicConnector,
    },
    account: {
      createAuthenticatedConnector,
    },
    execution: {
      createAuthenticatedConnector,
      createLiveOrderAdapter,
    },
  };
};
