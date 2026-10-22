import type { GateFuturesEconomicsSnapshot } from '../modules/exchange/gateFuturesEconomics';
import { createInternalGateNonunitMockPermit } from '../modules/orders/orders.internalGateNonunitMock';
import { persistOrReuseLiveOrderIntent, type LiveOrderPayload } from '../modules/orders/orders.liveIntent.service';
import { assertPreparedGateEntryContractUnit, enforceLivePretradeGuards,
  type SymbolTradingRules } from '../modules/orders/orders.quantityRules';
import { prepareOpenOrderRiskContext } from '../modules/orders/orders.service';

// Test-only admission stops at a durable intent. It has no submit, Order,
// fill, Position, fee or PnL operation. Full nonunit settlement needs its own gate.
export const admitInternalGateNonunitMockEntry = async (input: {
  userId: string;
  payload: LiveOrderPayload;
  economics: GateFuturesEconomicsSnapshot | null;
  apiKeyId: string;
  connector: {
    hasOpenPosition: (symbol: string) => Promise<boolean>;
    getSymbolTradingRules: (symbol: string) => Promise<SymbolTradingRules>;
    fetchMarkPrice: (symbol: string) => Promise<number>;
  };
}) => {
  const { payload, economics } = input;
  if (payload.mode !== 'LIVE' || !payload.botId || payload.positionId ||
      payload.reduceOnly === true || !economics ||
      typeof payload.price !== 'number' || !payload.clientOrderId) {
    throw new Error('INTERNAL_GATE_NONUNIT_MOCK_ENTRY_ONLY');
  }
  const permit = createInternalGateNonunitMockPermit({
    userId: input.userId, botId: payload.botId, symbol: payload.symbol,
    side: payload.side, clientOrderId: payload.clientOrderId,
    quantity: payload.quantity, price: payload.price,
    contractSize: economics.contractSize,
  });
  const prepared = await prepareOpenOrderRiskContext(input.userId, payload,
    async () => economics, permit);
  assertPreparedGateEntryContractUnit(prepared.canonicalPayload, prepared.liveBot,
    { permit, userId: input.userId });
  if (!prepared.liveBot || prepared.liveBot.exchange !== 'GATEIO' ||
      prepared.liveBot.marketType !== 'FUTURES') {
    throw new Error('INTERNAL_GATE_NONUNIT_MOCK_GATE_FUTURES_ONLY');
  }
  await enforceLivePretradeGuards({
    connector: input.connector, apiKeyId: input.apiKeyId,
    exchange: 'GATEIO', marketType: 'FUTURES',
    payload: {
      symbol: prepared.canonicalPayload.symbol,
      quantity: prepared.canonicalPayload.quantity,
      price: prepared.canonicalPayload.price,
      expectedContractSize: prepared.canonicalPayload.contractSize,
    },
    internalMock: { permit, userId: input.userId, botId: payload.botId,
      side: payload.side, clientOrderId: payload.clientOrderId },
  });
  return persistOrReuseLiveOrderIntent({
    userId: input.userId, bot: prepared.liveBot,
    payload: prepared.canonicalPayload, internalMockPermit: permit,
  });
};
