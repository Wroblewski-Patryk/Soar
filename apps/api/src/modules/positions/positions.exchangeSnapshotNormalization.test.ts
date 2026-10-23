import ccxt from 'ccxt';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { normalizeExchangePosition } from './positions.exchangeSnapshotNormalization';
import { normalizeImportedLeverage } from './livePositionReconciliation.helpers';
import { fetchExchangePositionsSnapshotByApiKeyId } from './positions.service';
import { reconcileExternalPositionsFromExchange } from './livePositionReconciliation.service';

const mocks = vi.hoisted(() => ({
  findApiKey: vi.fn(),
  updateApiKey: vi.fn(),
  fetchPositions: vi.fn(),
}));

vi.mock('../../prisma/client', () => ({
  prisma: { apiKey: { findFirst: mocks.findApiKey, update: mocks.updateApiKey } },
}));
vi.mock('../exchange/exchangeAdapterBoundary.service', async (importOriginal) => ({
  ...await importOriginal<typeof import('../exchange/exchangeAdapterBoundary.service')>(),
  assertExchangeAdapterOperationSupport: vi.fn(),
  fetchSupportedExchangePositionsRaw: mocks.fetchPositions,
  resolveExchangeAdapterSource: () => 'GATEIO',
}));


const normalizeBinanceFuturesPosition = (position: Parameters<typeof normalizeExchangePosition>[0]) =>
  normalizeExchangePosition({ ...position, contractSize: 1 },
    { exchange: 'BINANCE', marketType: 'FUTURES' });

const gateProof = {
  source: 'GATE_API_V4_CONTRACT_CCXT_MARKET', contract: 'BTC_USDT',
  contractType: 'direct', linear: true, inverse: false,
  quote: 'USDT', settle: 'USDT', quantoMultiplier: 0.0001,
  contractSize: 0.0001, marketSymbol: 'BTC/USDT:USDT',
} as const;

describe('positions exchange snapshot normalization', () => {
  it('derives one-way futures side and absolute contracts from signed Binance positionAmt', () => {
    const normalized = normalizeBinanceFuturesPosition({
      symbol: 'DOGEUSDT',
      info: {
        symbol: 'DOGEUSDT',
        positionAmt: '-216',
        positionSide: 'BOTH',
        entryPrice: '0.1056787962963',
        markPrice: '0.1058900062963',
        unRealizedProfit: '-0.04562136',
        leverage: '15',
        marginType: 'isolated',
        isolatedWallet: '1.52177466',
      },
    });

    expect(normalized).toMatchObject({
      symbol: 'DOGEUSDT',
      side: 'SHORT',
      contracts: 216,
      entryPrice: 0.1056787962963,
      markPrice: 0.1058900062963,
      unrealizedPnl: -0.04562136,
      leverage: 15,
      marginMode: 'isolated',
      marginUsed: 1.52177466,
    });
  });

  it('keeps explicit hedge-mode side while normalizing contracts as positive quantity', () => {
    const normalized = normalizeBinanceFuturesPosition({
      symbol: 'ETHUSDT',
      info: {
        symbol: 'ETHUSDT',
        positionAmt: '-0.2',
        positionSide: 'SHORT',
        entryPrice: '3200',
        markPrice: '3190',
        unRealizedProfit: '2',
        leverage: '4',
        marginType: 'cross',
        initialMargin: '159.5',
      },
    });

    expect(normalized).toMatchObject({
      symbol: 'ETHUSDT',
      side: 'SHORT',
      contracts: 0.2,
      entryPrice: 3200,
      markPrice: 3190,
      unrealizedPnl: 2,
      leverage: 4,
      marginMode: 'cross',
      marginUsed: 159.5,
    });
  });

  it('normalizes multi-position futures snapshots without leaking signed quantities', () => {
    const normalized = [
      normalizeBinanceFuturesPosition({
        symbol: 'BTCUSDT',
        info: { positionAmt: '0.01', positionSide: 'BOTH', entryPrice: '68000' },
      }),
      normalizeBinanceFuturesPosition({
        symbol: 'ETHUSDT',
        info: { positionAmt: '-0.2', positionSide: 'SHORT', entryPrice: '3200' },
      }),
      normalizeBinanceFuturesPosition({
        symbol: 'SOLUSDT',
        side: 'long',
        contracts: 2,
        info: { positionAmt: '2', positionSide: 'LONG', entryPrice: '155' },
      }),
    ];

    expect(normalized.map((position) => [position.symbol, position.side, position.contracts])).toEqual([
      ['BTCUSDT', 'LONG', 0.01],
      ['ETHUSDT', 'SHORT', 0.2],
      ['SOLUSDT', 'long', 2],
    ]);
  });

  it('prefers isolated wallet as marginUsed truth for isolated futures positions', () => {
    const normalized = normalizeBinanceFuturesPosition({
      symbol: 'DOGEUSDT',
      side: 'SHORT',
      contracts: 108,
      entryPrice: 0.1044675925926,
      markPrice: 0.10645,
      unrealizedPnl: -0.21409999999920087,
      leverage: 15,
      marginMode: 'isolated',
      info: {
        marginType: 'isolated',
        initialMargin: '0.7692281',
        positionInitialMargin: '0.7692281',
        isolatedMargin: '0.7692281',
        isolatedWallet: '1.36800000',
      },
    });

    expect(normalized.marginUsed).toBe(1.368);
  });

  it('keeps initial margin precedence for non-isolated positions', () => {
    const normalized = normalizeBinanceFuturesPosition({
      symbol: 'DOGEUSDT',
      side: 'SHORT',
      contracts: 108,
      entryPrice: 0.1044675925926,
      markPrice: 0.10645,
      unrealizedPnl: -0.21409999999920087,
      leverage: 15,
      marginMode: 'cross',
      info: {
        marginType: 'cross',
        initialMargin: '0.7692281',
        positionInitialMargin: '0.7692281',
        isolatedMargin: '0.90000000',
        isolatedWallet: '1.36800000',
      },
    });

    expect(normalized.marginUsed).toBe(0.7692281);
  });

  it('uses the highest positive isolated margin signal when isolated fields disagree', () => {
    const normalized = normalizeBinanceFuturesPosition({
      symbol: 'ETHUSDT',
      side: 'LONG',
      contracts: 0.25,
      entryPrice: 3200,
      markPrice: 3210,
      unrealizedPnl: 2.5,
      leverage: 20,
      marginMode: 'isolated',
      info: {
        marginType: 'isolated',
        initialMargin: '2.05',
        positionInitialMargin: '2.05',
        isolatedMargin: '4.10',
        isolatedWallet: '4.00',
      },
    });

    expect(normalized.marginUsed).toBe(4.1);
  });
});

describe('Gate cross margin through installed CCXT parser and snapshot normalizer', () => {
  // Gate API v4 defines leverage=0 as cross; CCXT #29104 documents that
  // initial_margin includes the taker-fee buffer and zero means unavailable.
  const market = {
    id: 'BTC_USDT', symbol: 'BTC/USDT:USDT', base: 'BTC', quote: 'USDT', settle: 'USDT',
    type: 'swap', swap: true, contract: true, linear: true, inverse: false,
    contractSize: 0.0001,
    info: { name: 'BTC_USDT', type: 'direct', quanto_multiplier: '0.0001', taker_fee_rate: '0.00075' },
  };
  const parseAndNormalize = (fields: Record<string, unknown>) => {
    const gate = new ccxt.gate({ enableRateLimit: false });
    gate.setMarkets({ [market.symbol]: market } as Parameters<typeof gate.setMarkets>[0]);
    const parsed = gate.parsePosition({
      contract: 'BTC_USDT', size: 1, value: '10', entry_price: '100000',
      mark_price: '100000', unrealised_pnl: '0', open_time: 1792770000,
      ...fields,
    }, gate.market(market.symbol));
    const normalized = normalizeExchangePosition({ ...parsed, gateFuturesEconomics: gateProof },
      { exchange: 'GATEIO', marketType: 'FUTURES' });
    return { parsed, normalized };
  };

  it('keeps verified contract unit and explicit isolated leverage with fee-inclusive margin', () => {
    const { parsed, normalized } = parseAndNormalize({
      leverage: '10', initial_margin: '1.0075', margin: '1',
    });
    expect(parsed).toMatchObject({ leverage: 10, marginMode: 'isolated', initialMargin: 1.0075 });
    expect(normalized).toMatchObject({
      contracts: 1, contractSize: 0.0001, leverage: 10,
      marginMode: 'isolated', marginUsed: 1.0075,
    });
  });

  it('does not silently persist 1x when cross leverage is 0 and initial_margin is zero', async () => {
    const { parsed, normalized } = parseAndNormalize({
      leverage: '0', cross_leverage_limit: '10', lever: '10', pos_margin_mode: 'cross',
      initial_margin: '0', margin: '1',
    });
    expect(parsed).toMatchObject({ leverage: 0, marginMode: 'cross', contractSize: 0.0001 });
    expect(parsed.initialMargin).toBeUndefined();
    expect(normalized).toMatchObject({ contractSize: 0.0001, marginMode: 'cross' });
    const createSyncedPosition = vi.fn(async () => undefined);
    await reconcileExternalPositionsFromExchange({
      listSyncedApiKeys: async () => [{
        id: 'gate-cross-key', userId: 'gate-cross-user', exchange: 'GATEIO', marketType: 'FUTURES',
      }],
      resolveOwnershipIndexForUser: async () => new Map(),
      fetchPositionsForApiKey: async () => ({ positions: [normalized] }),
      findOpenSyncedPositionByExternalId: async () => null,
      updateSyncedPosition: vi.fn(async () => undefined),
      createSyncedPosition,
      listOpenSyncedPositionsForApiKey: async () => [],
      markMissingSyncedPosition: vi.fn(async () => undefined),
      closeStaleSyncedPosition: vi.fn(async () => undefined),
      now: () => new Date('2026-10-23T12:00:00.000Z'),
    });
    expect(createSyncedPosition).toHaveBeenCalledOnce();
    expect(createSyncedPosition).toHaveBeenCalledWith(expect.objectContaining({
      contractSize: 0.0001, marginUsed: null, leverage: 10,
    }));
  });

  it('does not persist cross leverage inferred from fee-inclusive initial_margin', () => {
    const { parsed, normalized } = parseAndNormalize({
      leverage: '0', cross_leverage_limit: '50', lever: '50', pos_margin_mode: 'cross',
      initial_margin: '0.2075', margin: '0.2',
    });
    expect(parsed).toMatchObject({ leverage: 0, marginMode: 'cross', initialMargin: 0.2075 });
    expect(normalized).toMatchObject({
      contracts: 1, contractSize: 0.0001, marginMode: 'cross',
      marginUsed: 0.2075,
    });
    expect(normalizeImportedLeverage(normalized.leverage)).toBe(50);
  });
});

describe('Gate FUTURES contract unit snapshot', () => {
  const gateContext = { exchange: 'GATEIO', marketType: 'FUTURES' } as const;
  const gatePosition = {
    symbol: 'BTC/USDT:USDT', side: 'long', contracts: 1,
    contractSize: 0.0001, gateFuturesEconomics: gateProof, markPrice: 100000,
    info: { contract: 'BTC_USDT' },
  };

  it('requires the standard CCXT contract size for other FUTURES markets too', () => {
    expect(() => normalizeExchangePosition({
      symbol: 'BTC/USDT:USDT', contracts: 1, markPrice: 100000, leverage: 10,
      info: {},
    }, { exchange: 'BINANCE', marketType: 'FUTURES' }))
      .toThrow('EXCHANGE_FUTURES_CONTRACT_UNIT_UNVERIFIED');
  });

  it('uses the CCXT market contract size for margin fallback, not one BTC per contract', () => {
    const position = normalizeExchangePosition({ ...gatePosition, leverage: 10 }, gateContext);
    expect(position).toMatchObject({ contracts: 1, leverage: 10, marginUsed: 1 });
  });

  it('derives leverage from one USDT of venue margin at ten USDT notional', () => {
    const position = normalizeExchangePosition({
      ...gatePosition, info: { contract: 'BTC_USDT', initialMargin: '1' },
    }, gateContext);
    expect(position).toMatchObject({ contracts: 1, leverage: 10, marginUsed: 1 });
  });

  it('uses standard CCXT initialMargin and ignores inconsistent raw notional', () => {
    const position = normalizeExchangePosition({
      ...gatePosition, initialMargin: 1,
      info: { contract: 'BTC_USDT', notional: '100000' },
    }, gateContext);
    expect(position).toMatchObject({ contracts: 1, leverage: 10, marginUsed: 1 });
  });

  it.each([
    { name: 'missing market unit', change: { contractSize: undefined } },
    { name: 'missing market proof', change: { gateFuturesEconomics: undefined } },
    { name: 'mismatched market proof', change: { gateFuturesEconomics: { ...gateProof, contractSize: 1 } } },
    { name: 'zero market unit', change: { contractSize: 0 } },
    { name: 'negative market unit', change: { contractSize: -1 } },
    { name: 'nonfinite market unit', change: { contractSize: Number.NaN } },
    { name: 'mismatched raw unit', change: { info: { contract: 'BTC_USDT', contractSize: '1' } } },
    { name: 'mismatched raw multiplier', change: { info: { contract: 'BTC_USDT', quanto_multiplier: '1' } } },
    { name: 'mismatched Gate contract', change: { info: { contract: 'ETH_USDT' } } },
    { name: 'missing Gate contract', change: { info: {} } },
  ])('refuses $name before producing a financial snapshot', ({ change }) => {
    expect(() => normalizeExchangePosition({ ...gatePosition, ...change }, gateContext))
      .toThrow('EXCHANGE_FUTURES_CONTRACT_UNIT_UNVERIFIED');
  });
});

describe('FUTURES snapshot boundary before reconcile', () => {
  const gatePosition = {
    symbol: 'BTC/USDT:USDT', side: 'long', contracts: 1,
    contractSize: 0.0001, gateFuturesEconomics: gateProof,
    markPrice: 100000, leverage: 10, info: { contract: 'BTC_USDT' },
  };

  beforeEach(() => {
    vi.stubEnv('NODE_ENV', 'snapshot-unit');
    vi.clearAllMocks();
    mocks.findApiKey.mockResolvedValue({
      id: 'key-1', userId: 'user-1', exchange: 'GATEIO', apiKey: 'fixture', apiSecret: 'fixture',
    });
    mocks.updateApiKey.mockResolvedValue({});
  });

  afterEach(() => vi.unstubAllEnvs());

  it('returns the correctly scaled snapshot to the reconciler', async () => {
    mocks.fetchPositions.mockResolvedValue([gatePosition]);
    const snapshot = await fetchExchangePositionsSnapshotByApiKeyId('user-1', 'key-1');
    expect(snapshot.positions).toMatchObject([{ contracts: 1, leverage: 10, marginUsed: 1 }]);
    expect(mocks.updateApiKey).toHaveBeenCalledOnce();
  });

  it('rejects an entire mixed snapshot before the last-used write or reconcile receives it', async () => {
    mocks.fetchPositions.mockResolvedValue([
      gatePosition, { ...gatePosition, info: { contract: 'ETH_USDT' } },
    ]);
    await expect(fetchExchangePositionsSnapshotByApiKeyId('user-1', 'key-1'))
      .rejects.toMatchObject({ code: 'EXCHANGE_FETCH_FAILED' });
    expect(mocks.updateApiKey).not.toHaveBeenCalled();
  });

  it('keeps reconcile and owned automation idle after an invalid snapshot', async () => {
    mocks.fetchPositions.mockResolvedValue([{ ...gatePosition, contractSize: undefined }]);
    const updatePosition = vi.fn();
    const createPosition = vi.fn();
    const processAutomation = vi.fn();
    const log = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    try {
      const result = await reconcileExternalPositionsFromExchange({
        listSyncedApiKeys: vi.fn().mockResolvedValue([{
          id: 'key-1', userId: 'user-1', exchange: 'GATEIO', marketType: 'FUTURES',
        }]),
        fetchPositionsForApiKey: () => fetchExchangePositionsSnapshotByApiKeyId('user-1', 'key-1'),
        updateSyncedPosition: updatePosition,
        createSyncedPosition: createPosition,
        processOwnedSyncedPositionAutomation: processAutomation,
      } as unknown as Parameters<typeof reconcileExternalPositionsFromExchange>[0]);
      expect(result.openPositionsSeen).toBe(0);
      expect(updatePosition).not.toHaveBeenCalled();
      expect(createPosition).not.toHaveBeenCalled();
      expect(processAutomation).not.toHaveBeenCalled();
      expect(mocks.updateApiKey).not.toHaveBeenCalled();
    } finally {
      log.mockRestore();
    }
  });
});
