import ccxt from 'ccxt';
import { execFile } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { promisify } from 'node:util';
import { afterAll, afterEach, describe, expect, it, vi } from 'vitest';

import { prisma } from '../../prisma/client';
import { CcxtFuturesConnector, type CcxtExchangeLikeClient } from '../exchange/ccxtFuturesConnector.service';
import { fetchExchangePositionsSnapshotByApiKeyId } from './positions.service';
import {
  livePositionReconciliationDefaultDeps,
  reconcileExternalPositionsFromExchange,
} from './livePositionReconciliation.service';

const harness = vi.hoisted(() => ({
  connector: null as CcxtFuturesConnector | null,
}));
const execFileAsync = promisify(execFile);

const rereadPositionInSeparateProcess = async (id: string) => {
  const script = `const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    prisma.position.findUniqueOrThrow({ where: { id: process.argv[1] },
      select: { quantity: true, contractSize: true, gateFuturesEconomics: true } })
      .then((position) => process.stdout.write(JSON.stringify(position)))
      .finally(() => prisma.$disconnect());`;
  const { stdout } = await execFileAsync(process.execPath, ['-e', script, id], {
    cwd: process.cwd(),
    env: process.env,
  });
  return JSON.parse(stdout) as {
    quantity: number;
    contractSize: number | null;
    gateFuturesEconomics: Record<string, unknown> | null;
  };
};

// Keep the real account boundary, connector, CCXT fetchPositions/parser, snapshot and
// reconciliation. Replace only connector construction so no credentials or HTTP escape.
vi.mock('../exchange/exchangeAdapterRegistry.service', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../exchange/exchangeAdapterRegistry.service')>();
  return {
    ...actual,
    resolveExchangeAdapterRegistryEntry: (
      context: Parameters<typeof actual.resolveExchangeAdapterRegistryEntry>[0],
    ) => {
      const entry = actual.resolveExchangeAdapterRegistryEntry(context);
      return context.exchange === 'GATEIO' && context.marketType === 'FUTURES'
        ? { ...entry, account: { createAuthenticatedConnector: () => harness.connector } }
        : entry;
    },
  };
});

type GateRawPosition = Record<string, unknown>;

const market = (base: 'BTC' | 'ETH', contractSize: number) => ({
  id: `${base}_USDT`, symbol: `${base}/USDT:USDT`, base,
  quote: 'USDT', settle: 'USDT', type: 'swap', swap: true,
  contract: true, linear: true, inverse: false, contractSize,
  info: { name: `${base}_USDT`, type: 'direct', quanto_multiplier: String(contractSize) },
});

const rawPosition = (base: 'BTC' | 'ETH', extra: GateRawPosition = {}): GateRawPosition => ({
  contract: `${base}_USDT`, size: 1, value: '10', leverage: '10',
  entry_price: '100000', mark_price: '100000', unrealised_pnl: '0',
  initial_margin: '1', margin: '1', open_time: 1792770000,
  ...extra,
});

const installOfflineGate = (rows: GateRawPosition[]) => {
  const gate = new ccxt.gate({ enableRateLimit: false });
  const btc = market('BTC', 0.0001);
  const eth = market('ETH', 0.01);
  gate.setMarkets({ [btc.symbol]: btc, [eth.symbol]: eth } as Parameters<typeof gate.setMarkets>[0]);
  const endpoint = vi.fn(async () => rows);
  const http = vi.fn(async () => { throw new Error('Unexpected Gate network request'); });
  Object.assign(gate, { privateFuturesGetSettlePositions: endpoint, fetch: http });
  harness.connector = new CcxtFuturesConnector(
    { exchangeId: 'gateio', marketType: 'swap' },
    async () => gate as unknown as CcxtExchangeLikeClient,
  );
  return { endpoint, http };
};

const createFixture = async (name: string) => {
  const user = await prisma.user.create({
    data: { email: `gate-snapshot-unit-${name}-${randomUUID()}@example.test`, password: 'fixture-only' },
  });
  const apiKey = await prisma.apiKey.create({
    data: { userId: user.id, label: 'Offline Gate fixture', exchange: 'GATEIO',
      apiKey: 'offline-fixture', apiSecret: 'offline-fixture' },
  });
  return { user, apiKey };
};

const reconcileFixture = (userId: string, apiKeyId: string, automation: ReturnType<typeof vi.fn>) =>
  reconcileExternalPositionsFromExchange({
    ...livePositionReconciliationDefaultDeps,
    listSyncedApiKeys: async () => [{ id: apiKeyId, userId, exchange: 'GATEIO', marketType: 'FUTURES' }],
    resolveOwnershipIndexForUser: async () => new Map(),
    fetchOpenOrdersForApiKey: undefined,
    fetchTradeHistoryForApiKeySymbol: undefined,
    processOwnedSyncedPositionAutomation: automation,
  });

describe('Gate direct USDT snapshot unit through durable reconciliation', () => {
  afterEach(() => {
    harness.connector = null;
    vi.unstubAllEnvs();
  });
  afterAll(async () => prisma.$disconnect());

  it('persists one verified contract as 10 USDT notional and 1 USDT margin', async () => {
    vi.stubEnv('NODE_ENV', 'snapshot-unit');
    const { user, apiKey } = await createFixture('positive');
    const { endpoint, http } = installOfflineGate([rawPosition('BTC')]);
    const snapshot = await fetchExchangePositionsSnapshotByApiKeyId(user.id, apiKey.id);
    expect(snapshot.positions).toMatchObject([{
      symbol: 'BTC/USDT:USDT', contracts: 1, markPrice: 100000,
      leverage: 10, marginUsed: 1, unrealizedPnl: 0, contractSize: 0.0001,
      gateFuturesEconomics: { contract: 'BTC_USDT', quantoMultiplier: 0.0001 },
    }]);

    const automation = vi.fn();
    const result = await reconcileFixture(user.id, apiKey.id, automation);
    expect(result.openPositionsSeen).toBe(1);
    const persisted = await prisma.position.findMany({ where: { userId: user.id } });
    expect(persisted).toHaveLength(1);
    expect(persisted[0]).toMatchObject({
      origin: 'EXCHANGE_SYNC', status: 'OPEN', quantity: 1,
      entryPrice: 100000, leverage: 10, marginUsed: 1,
      unrealizedPnl: 0, contractSize: 0.0001,
      gateFuturesEconomics: expect.objectContaining({
        contract: 'BTC_USDT', quantoMultiplier: 0.0001,
      }),
    });
    expect(persisted[0].quantity * persisted[0].contractSize! * snapshot.positions[0].markPrice!).toBe(10);
    expect(automation).not.toHaveBeenCalled();
    expect(endpoint).toHaveBeenCalledTimes(2);
    expect(http).not.toHaveBeenCalled();

    const updated = installOfflineGate([rawPosition('BTC', {
      size: 2, value: '20', initial_margin: '2', margin: '2',
    })]);
    await reconcileFixture(user.id, apiKey.id, automation);
    expect(await prisma.position.count({ where: { userId: user.id } })).toBe(1);
    const reread = await rereadPositionInSeparateProcess(persisted[0].id);
    expect(reread).toMatchObject({
      quantity: 2, contractSize: 0.0001,
      gateFuturesEconomics: { contract: 'BTC_USDT', quantoMultiplier: 0.0001 },
    });
    expect(reread.quantity * reread.contractSize! * 100000).toBe(20);
    expect(updated.endpoint).toHaveBeenCalledTimes(1);
    expect(updated.http).not.toHaveBeenCalled();
    expect(automation).not.toHaveBeenCalled();
  });

  it('rejects the entire mixed batch before lastUsed, Position, or automation', async () => {
    vi.stubEnv('NODE_ENV', 'snapshot-unit');
    const { user, apiKey } = await createFixture('mixed');
    const { endpoint, http } = installOfflineGate([
      rawPosition('BTC'), rawPosition('ETH', {
        value: '1000', initial_margin: '100', margin: '100', quanto_multiplier: '1',
      }),
    ]);
    await expect(fetchExchangePositionsSnapshotByApiKeyId(user.id, apiKey.id))
      .rejects.toMatchObject({ code: 'EXCHANGE_FETCH_FAILED' });
    const automation = vi.fn();
    const errorLog = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    try {
      const result = await reconcileFixture(user.id, apiKey.id, automation);
      expect(result.openPositionsSeen).toBe(0);
    } finally {
      errorLog.mockRestore();
    }
    expect(await prisma.position.count({ where: { userId: user.id } })).toBe(0);
    expect((await prisma.apiKey.findUniqueOrThrow({ where: { id: apiKey.id } })).lastUsed).toBeNull();
    expect(automation).not.toHaveBeenCalled();
    expect(endpoint).toHaveBeenCalledTimes(2);
    expect(http).not.toHaveBeenCalled();
  });
});
