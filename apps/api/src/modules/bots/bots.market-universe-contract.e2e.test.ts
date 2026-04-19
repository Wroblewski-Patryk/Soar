import { beforeEach, describe, expect, it } from 'vitest';
import { prisma } from '../../prisma/client';
import {
  createPayload,
  createStrategy,
  createWalletForContext,
  registerAndLogin,
  resetBotsE2eState,
  walletIdByMarketGroupId,
} from './bots.e2e.shared';

describe('Bots market-universe symbol contract', () => {
  beforeEach(resetBotsE2eState);

  it('derives runtime symbol list from market universe when symbol-group snapshot is stale', async () => {
    const ownerEmail = 'bot-runtime-market-universe-symbols@example.com';
    const owner = await registerAndLogin(ownerEmail);
    const ownerUser = await prisma.user.findUniqueOrThrow({ where: { email: ownerEmail } });

    const strategyId = await createStrategy(owner, 'Runtime Market Universe Symbols Strategy');

    const marketUniverse = await prisma.marketUniverse.create({
      data: {
        userId: ownerUser.id,
        name: `Universe stale-sync ${Date.now()}`,
        marketType: 'FUTURES',
        baseCurrency: 'USDT',
        whitelist: ['BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'XRPUSDT'],
        blacklist: ['SOLUSDT'],
      },
    });
    const walletId = await createWalletForContext(ownerEmail, {
      mode: 'PAPER',
      exchange: 'BINANCE',
      marketType: 'FUTURES',
      baseCurrency: 'USDT',
    });
    walletIdByMarketGroupId.set(marketUniverse.id, walletId);

    // Simulate stale snapshot in symbolGroup (older list) while market universe already has a newer list.
    await prisma.symbolGroup.create({
      data: {
        userId: ownerUser.id,
        marketUniverseId: marketUniverse.id,
        name: `Stale group ${Date.now()}`,
        symbols: ['BTCUSDT', 'ETHUSDT'],
      },
    });

    const createRes = await owner.post('/dashboard/bots').send(
      createPayload({
        strategyId,
        marketGroupId: marketUniverse.id,
      })
    );
    expect(createRes.status).toBe(201);
    const botId = createRes.body.id as string;

    const session = await prisma.botRuntimeSession.create({
      data: {
        userId: ownerUser.id,
        botId,
        mode: 'PAPER',
        status: 'RUNNING',
        startedAt: new Date('2026-04-04T20:00:00.000Z'),
      },
    });

    const statsRes = await owner.get(`/dashboard/bots/${botId}/runtime-sessions/${session.id}/symbol-stats`);
    expect(statsRes.status).toBe(200);
    const symbols = statsRes.body.items.map((item: { symbol: string }) => item.symbol);

    expect(symbols).toEqual(expect.arrayContaining(['BTCUSDT', 'ETHUSDT', 'XRPUSDT']));
    expect(symbols).not.toContain('SOLUSDT');
    expect(symbols).toHaveLength(3);
  });

  it('keeps runtime symbol set empty when filter is disabled and universe/snapshot are empty', async () => {
    const ownerEmail = 'bot-runtime-market-universe-catalog-fallback@example.com';
    const owner = await registerAndLogin(ownerEmail);
    const ownerUser = await prisma.user.findUniqueOrThrow({ where: { email: ownerEmail } });

    const strategyId = await createStrategy(owner, 'Runtime Market Universe Catalog Fallback Strategy');

    const marketUniverse = await prisma.marketUniverse.create({
      data: {
        userId: ownerUser.id,
        name: `Universe catalog-fallback ${Date.now()}`,
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        baseCurrency: 'USDT',
        whitelist: [],
        blacklist: ['SOLUSDT'],
      },
    });
    const walletId = await createWalletForContext(ownerEmail, {
      mode: 'PAPER',
      exchange: 'BINANCE',
      marketType: 'FUTURES',
      baseCurrency: 'USDT',
    });
    walletIdByMarketGroupId.set(marketUniverse.id, walletId);

    await prisma.symbolGroup.create({
      data: {
        userId: ownerUser.id,
        marketUniverseId: marketUniverse.id,
        name: `Catalog fallback group ${Date.now()}`,
        symbols: [],
      },
    });

    const createRes = await owner.post('/dashboard/bots').send(
      createPayload({
        strategyId,
        marketGroupId: marketUniverse.id,
      })
    );
    expect(createRes.status).toBe(201);
    const botId = createRes.body.id as string;

    const session = await prisma.botRuntimeSession.create({
      data: {
        userId: ownerUser.id,
        botId,
        mode: 'PAPER',
        status: 'RUNNING',
        startedAt: new Date('2026-04-04T20:05:00.000Z'),
      },
    });

    const statsRes = await owner.get(`/dashboard/bots/${botId}/runtime-sessions/${session.id}/symbol-stats`);
    expect(statsRes.status).toBe(200);
    const symbols = statsRes.body.items.map((item: { symbol: string }) => item.symbol);

    expect(symbols).toEqual([]);
  });

  it('resolves runtime symbols from (volume-filtered catalog U whitelist) - blacklist when snapshot is empty', async () => {
    const ownerEmail = 'bot-runtime-market-universe-filtered-catalog-union@example.com';
    const owner = await registerAndLogin(ownerEmail);
    const ownerUser = await prisma.user.findUniqueOrThrow({ where: { email: ownerEmail } });

    const strategyId = await createStrategy(owner, 'Runtime Market Universe Filtered Catalog Union Strategy');

    const marketUniverse = await prisma.marketUniverse.create({
      data: {
        userId: ownerUser.id,
        name: `Universe filtered-catalog-union ${Date.now()}`,
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        baseCurrency: 'USDT',
        filterRules: {
          minQuoteVolumeEnabled: true,
          minQuoteVolume24h: 2_000_000_000,
        },
        whitelist: ['XRPUSDT'],
        blacklist: ['ETHUSDT'],
      },
    });
    const walletId = await createWalletForContext(ownerEmail, {
      mode: 'PAPER',
      exchange: 'BINANCE',
      marketType: 'FUTURES',
      baseCurrency: 'USDT',
    });
    walletIdByMarketGroupId.set(marketUniverse.id, walletId);

    await prisma.symbolGroup.create({
      data: {
        userId: ownerUser.id,
        marketUniverseId: marketUniverse.id,
        name: `Filtered catalog union group ${Date.now()}`,
        symbols: [],
      },
    });

    const createRes = await owner.post('/dashboard/bots').send(
      createPayload({
        strategyId,
        marketGroupId: marketUniverse.id,
      })
    );
    expect(createRes.status).toBe(201);
    const botId = createRes.body.id as string;

    const session = await prisma.botRuntimeSession.create({
      data: {
        userId: ownerUser.id,
        botId,
        mode: 'PAPER',
        status: 'RUNNING',
        startedAt: new Date('2026-04-04T20:07:00.000Z'),
      },
    });

    const statsRes = await owner.get(`/dashboard/bots/${botId}/runtime-sessions/${session.id}/symbol-stats`);
    expect(statsRes.status).toBe(200);
    const symbols = statsRes.body.items.map((item: { symbol: string }) => item.symbol);

    expect(symbols).toEqual(['BTCUSDT', 'XRPUSDT']);
    expect(symbols).not.toContain('ETHUSDT');
    expect(symbols).not.toContain('SOLUSDT');
  });

  it('keeps runtime, backtest seed, and manual-order context parity for one market-universe input', async () => {
    const ownerEmail = 'bot-runtime-backtest-manual-context-parity@example.com';
    const owner = await registerAndLogin(ownerEmail);
    const ownerUser = await prisma.user.findUniqueOrThrow({ where: { email: ownerEmail } });

    const strategyId = await createStrategy(owner, 'Runtime Backtest Manual Context Parity Strategy');

    const marketUniverse = await prisma.marketUniverse.create({
      data: {
        userId: ownerUser.id,
        name: `Universe parity-e2e ${Date.now()}`,
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        baseCurrency: 'USDT',
        filterRules: {
          minQuoteVolumeEnabled: true,
          minQuoteVolume24h: 2_000_000_000,
        },
        whitelist: ['XRPUSDT'],
        blacklist: ['ETHUSDT'],
      },
    });
    const walletId = await createWalletForContext(ownerEmail, {
      mode: 'PAPER',
      exchange: 'BINANCE',
      marketType: 'FUTURES',
      baseCurrency: 'USDT',
    });
    walletIdByMarketGroupId.set(marketUniverse.id, walletId);

    await prisma.symbolGroup.create({
      data: {
        userId: ownerUser.id,
        marketUniverseId: marketUniverse.id,
        name: `Parity empty snapshot group ${Date.now()}`,
        symbols: [],
      },
    });

    const createRes = await owner.post('/dashboard/bots').send(
      createPayload({
        strategyId,
        marketGroupId: marketUniverse.id,
      })
    );
    expect(createRes.status).toBe(201);
    const botId = createRes.body.id as string;

    const runRes = await owner.post('/dashboard/backtests/runs').send({
      name: 'Parity universe run',
      timeframe: '5m',
      strategyId,
      marketUniverseId: marketUniverse.id,
      seedConfig: {
        initialBalance: 1_000,
      },
    });
    expect(runRes.status).toBe(201);
    const runId = runRes.body.id as string;

    const session = await prisma.botRuntimeSession.create({
      data: {
        userId: ownerUser.id,
        botId,
        mode: 'PAPER',
        status: 'RUNNING',
        startedAt: new Date('2026-04-04T20:10:00.000Z'),
      },
    });

    const statsRes = await owner.get(`/dashboard/bots/${botId}/runtime-sessions/${session.id}/symbol-stats`);
    expect(statsRes.status).toBe(200);
    const runtimeSymbols = statsRes.body.items.map((item: { symbol: string }) => item.symbol).sort();

    const runDetailRes = await owner.get(`/dashboard/backtests/runs/${runId}`);
    expect(runDetailRes.status).toBe(200);
    const runSymbols = (
      ((runDetailRes.body.seedConfig as { symbols?: unknown }).symbols as string[] | undefined) ?? []
    )
      .map((symbol) => symbol.toUpperCase())
      .sort();

    expect(runtimeSymbols).toEqual(runSymbols);
    expect(runSymbols).toEqual(['BTCUSDT', 'XRPUSDT']);

    for (const symbol of runSymbols) {
      const manualContextRes = await owner.get('/dashboard/orders/manual-context').query({
        botId,
        symbol,
        side: 'BUY',
      });
      expect(manualContextRes.status).toBe(200);
      expect(manualContextRes.body.symbol).toBe(symbol);
      expect(manualContextRes.body.leverage).toBe(2);
    }
  });
});

