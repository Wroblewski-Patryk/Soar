import { sign } from 'node:crypto';

import { gateFuturesEconomicsFromMarket } from '../modules/exchange/gateFuturesEconomics';
import { persistOrReuseLiveOrderIntent, type LiveOrderPayload } from '../modules/orders/orders.liveIntent.service';
import { assertPreparedGateEntryContractUnit, enforceLivePretradeGuards,
  type SymbolTradingRules } from '../modules/orders/orders.quantityRules';
import { prepareOpenOrderRiskContext } from '../modules/orders/orders.service';

// This private key is a test fixture, never included in the API build. The
// production order path has only the corresponding signature verifier.
const privateKey = `-----BEGIN PRIVATE KEY-----
MC4CAQAwBQYDK2VwBCIEID0hQG9KtbZb0hwmMLXs3BcCQV2CrUyxP73sxhjYoxtB
-----END PRIVATE KEY-----`;

type Scope = {
  userId: string; botId: string; symbol: string; side: string;
  clientOrderId: string; quantity: number; price: number; contractSize: number;
};

const positiveFinite = (value: unknown): number | null => {
  const parsed = typeof value === 'number' ? value :
    typeof value === 'string' && value.trim() ? Number(value) : NaN;
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
};

const localTestDatabase = () => {
  try {
    const database = new URL(process.env.DATABASE_URL ?? '');
    const loopbackTest = database.hostname === '127.0.0.1' &&
      database.port !== '' && database.port !== '5432' &&
      decodeURIComponent(database.pathname).endsWith('_test');
    const dockerCiTest = database.hostname === 'postgres' && database.port === '5432' &&
      database.username === 'ci' && database.password !== '' &&
      database.pathname === '/soar_local_test' && database.search === '?schema=public' &&
      process.env.TEST_DATABASE_URL === database.toString();
    return process.env.NODE_ENV === 'test' &&
      ['postgres:', 'postgresql:'].includes(database.protocol) &&
      (loopbackTest || dockerCiTest)
      ? database.toString() : null;
  } catch {
    return null;
  }
};

const issuePermit = (scope: Scope, pretradeValidated: boolean): object => {
  const databaseUrl = localTestDatabase();
  if (!databaseUrl || !scope.userId || !scope.botId ||
      !/^[A-Z0-9]+USDT$/.test(scope.symbol) ||
      !['BUY', 'SELL'].includes(scope.side) || !scope.clientOrderId ||
      !Number.isFinite(scope.quantity) || scope.quantity <= 0 ||
      !Number.isFinite(scope.price) || scope.price <= 0 ||
      !Number.isFinite(scope.contractSize) || scope.contractSize <= 0 ||
      scope.contractSize === 1) {
    throw new Error('INTERNAL_GATE_NONUNIT_MOCK_UNAVAILABLE');
  }
  const signedBytes = Buffer.from(JSON.stringify({
    purpose: 'GATE_NONUNIT_TEST_ENTRY_V1', databaseUrl, processId: process.pid,
    ...scope, pretradeValidated,
  }), 'utf8');
  return Object.freeze({ payload: signedBytes.toString('base64url'),
    signature: sign(null, signedBytes, privateKey).toString('base64url') });
};

const verifiedRawEconomics = (input: {
  symbol: string;
  rawGateContract: Record<string, unknown>;
  ccxtMarket: Record<string, unknown>;
}) => {
  const { rawGateContract: raw, ccxtMarket: market } = input;
  const rawName = raw.name;
  const multiplier = positiveFinite(raw.quanto_multiplier);
  const marketInfo = market.info && typeof market.info === 'object' &&
    !Array.isArray(market.info) ? market.info as Record<string, unknown> : null;
  const economics = gateFuturesEconomicsFromMarket(market);
  if (raw.type !== 'direct' || raw.settle_currency !== 'USDT' ||
      typeof rawName !== 'string' || !/^[A-Z0-9]+_USDT$/.test(rawName) ||
      rawName.replace('_', '') !== input.symbol.toUpperCase() ||
      multiplier == null || multiplier === 1 ||
      market.id !== rawName ||
      market.symbol !== `${rawName.slice(0, -5)}/USDT:USDT` ||
      !marketInfo || marketInfo.type !== raw.type ||
      marketInfo.name !== rawName ||
      marketInfo.settle_currency !== raw.settle_currency ||
      positiveFinite(marketInfo.quanto_multiplier) !== multiplier ||
      !economics || economics.contract !== rawName ||
      economics.quantoMultiplier !== multiplier ||
      economics.contractSize !== multiplier) {
    throw new Error('INTERNAL_GATE_NONUNIT_MOCK_RAW_ECONOMICS_UNVERIFIED');
  }
  return economics;
};

// Test-only admission stops at one durable intent. It never submits an Order,
// fill, Position, fee or PnL operation. No assembled economics snapshot is an input.
export const admitInternalGateNonunitMockEntry = async (input: {
  userId: string;
  payload: LiveOrderPayload;
  rawGateContract: Record<string, unknown>;
  ccxtMarket: Record<string, unknown>;
  apiKeyId: string;
  connector: {
    hasOpenPosition: (symbol: string) => Promise<boolean>;
    getSymbolTradingRules: (symbol: string) => Promise<SymbolTradingRules>;
    fetchMarkPrice: (symbol: string) => Promise<number>;
  };
}) => {
  const { payload } = input;
  if ('economics' in input || payload.mode !== 'LIVE' || !payload.botId ||
      payload.positionId || payload.reduceOnly === true ||
      typeof payload.price !== 'number' || !payload.clientOrderId) {
    throw new Error('INTERNAL_GATE_NONUNIT_MOCK_ENTRY_ONLY');
  }
  const economics = verifiedRawEconomics({ symbol: payload.symbol,
    rawGateContract: input.rawGateContract, ccxtMarket: input.ccxtMarket });
  const scope = {
    userId: input.userId, botId: payload.botId, symbol: payload.symbol.toUpperCase(),
    side: payload.side, clientOrderId: payload.clientOrderId,
    quantity: payload.quantity, price: payload.price,
    contractSize: economics.contractSize,
  };
  const permit = issuePermit(scope, false);
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
    payload: prepared.canonicalPayload,
    internalMockPermit: issuePermit(scope, true),
  });
};
