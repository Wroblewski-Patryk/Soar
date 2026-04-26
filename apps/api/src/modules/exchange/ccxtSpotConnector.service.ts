import {
  CcxtClientFactory,
  CcxtFuturesConnector,
} from './ccxtFuturesConnector.service';
import { CcxtFuturesConnectorConfig } from './ccxtFuturesConnector.types';

export class CcxtSpotConnector extends CcxtFuturesConnector {
  constructor(
    config: CcxtFuturesConnectorConfig,
    clientFactory?: CcxtClientFactory
  ) {
    super(
      {
        ...config,
        marketType: 'spot',
      },
      clientFactory
    );
  }
}
