import { Exchange } from '@prisma/client';

import { CcxtFuturesConnector } from './ccxtFuturesConnector.service';
import { decrypt } from '../../utils/crypto';

const resolveConnectorMarketType = (marketType: 'FUTURES' | 'SPOT') =>
  marketType === 'SPOT' ? 'spot' : 'future';

export const createPublicExchangeConnector = (params: {
  exchange: Exchange;
  marketType: 'FUTURES' | 'SPOT';
}) =>
  new CcxtFuturesConnector({
    exchangeId: params.exchange.toLowerCase(),
    marketType: resolveConnectorMarketType(params.marketType),
  });

export const createAuthenticatedExchangeConnector = (params: {
  exchange: Exchange;
  marketType: 'FUTURES' | 'SPOT';
  apiKey: string;
  apiSecret: string;
}) =>
  new CcxtFuturesConnector({
    exchangeId: params.exchange.toLowerCase(),
    apiKey: decrypt(params.apiKey),
    secret: decrypt(params.apiSecret),
    marketType: params.marketType,
  });
