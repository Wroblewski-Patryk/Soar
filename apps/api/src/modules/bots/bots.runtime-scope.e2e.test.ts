import { beforeEach, describe, expect, it } from 'vitest';
import { prisma } from '../../prisma/client';
import {
  createMarketGroup,
  createPayload,
  createStrategy,
  registerAndLogin,
  resetBotsE2eState,
} from './bots.e2e.shared';

describe('Bots runtime scope remediation contract', () => {
  beforeEach(resetBotsE2eState);

  it('keeps open runtime positions visible when newer history rows share a small limit', async () => {
    const email = 'bot-runtime-positions-open-history-limit@example.com';
    const agent = await registerAndLogin(email);
    const ownerUser = await prisma.user.findUniqueOrThrow({ where: { email } });

    const strategyId = await createStrategy(agent, 'Runtime Positions Limit Strategy');
    const marketGroupId = await createMarketGroup(email, 'FUTURES');
    const botRes = await agent.post('/dashboard/bots').send(createPayload({ strategyId, marketGroupId }));
    expect(botRes.status).toBe(201);
    const botId = botRes.body.id as string;

    const session = await prisma.botRuntimeSession.create({
      data: {
        userId: ownerUser.id,
        botId,
        mode: 'PAPER',
        status: 'RUNNING',
        startedAt: new Date('2026-04-11T00:00:00.000Z'),
      },
    });

    await prisma.position.createMany({
      data: [
        {
          userId: ownerUser.id,
          botId,
          strategyId,
          symbol: 'BTCUSDT',
          side: 'LONG',
          status: 'OPEN',
          entryPrice: 68000,
          quantity: 0.01,
          leverage: 2,
          openedAt: new Date('2026-04-11T00:01:00.000Z'),
          origin: 'BOT',
          managementMode: 'BOT_MANAGED',
          syncState: 'IN_SYNC',
        },
        {
          userId: ownerUser.id,
          botId,
          strategyId,
          symbol: 'ETHUSDT',
          side: 'LONG',
          status: 'CLOSED',
          entryPrice: 3300,
          quantity: 0.1,
          leverage: 2,
          openedAt: new Date('2026-04-11T00:02:00.000Z'),
          closedAt: new Date('2026-04-11T00:03:00.000Z'),
          origin: 'BOT',
          managementMode: 'BOT_MANAGED',
          syncState: 'IN_SYNC',
        },
      ],
    });

    const positionsRes = await agent
      .get(`/dashboard/bots/${botId}/runtime-sessions/${session.id}/positions`)
      .query({ limit: 1 });
    expect(positionsRes.status).toBe(200);
    expect(positionsRes.body.total).toBe(2);
    expect(positionsRes.body.openCount).toBe(1);
    expect(positionsRes.body.closedCount).toBe(1);
    expect(positionsRes.body.openItems).toHaveLength(1);
    expect(positionsRes.body.historyItems).toHaveLength(1);
    expect(positionsRes.body.openItems[0].symbol).toBe('BTCUSDT');
    expect(positionsRes.body.historyItems[0].symbol).toBe('ETHUSDT');
  });

  it('updates canonical runtime graph mapping when strategyId and marketGroupId are changed via PUT', async () => {
    const email = 'bots-canonical-update-drift@example.com';
    const agent = await registerAndLogin(email);
    const strategyAId = await createStrategy(agent, 'Canonical Update Strategy A');
    const strategyBId = await createStrategy(agent, 'Canonical Update Strategy B');
    const marketGroupAId = await createMarketGroup(email, 'FUTURES');
    const marketGroupBId = await createMarketGroup(email, 'FUTURES');

    const createRes = await agent.post('/dashboard/bots').send(
      createPayload({
        strategyId: strategyAId,
        marketGroupId: marketGroupAId,
      })
    );
    expect(createRes.status).toBe(201);
    const botId = createRes.body.id as string;

    const updateRes = await agent.put(`/dashboard/bots/${botId}`).send({
      strategyId: strategyBId,
      marketGroupId: marketGroupBId,
    });
    expect(updateRes.status).toBe(200);
    expect(updateRes.body.strategyId).toBe(strategyBId);
    expect(updateRes.body.symbolGroupId).toBe(marketGroupBId);

    const graphRes = await agent.get(`/dashboard/bots/${botId}/runtime-graph`);
    expect(graphRes.status).toBe(200);
    expect(graphRes.body.bot.strategyId).toBe(strategyBId);
    expect(graphRes.body.bot.symbolGroupId).toBe(marketGroupBId);

    const activePrimaryGroup = (graphRes.body.marketGroups as Array<{
      symbolGroupId: string;
      isEnabled: boolean;
      lifecycleStatus: string;
      executionOrder: number;
      strategies: Array<{
        strategyId: string;
        isEnabled: boolean;
        priority: number;
        strategy: { leverage?: number };
      }>;
    }>)
      .filter((group) => group.isEnabled && group.lifecycleStatus === 'ACTIVE')
      .sort((left, right) => left.executionOrder - right.executionOrder)[0];
    expect(activePrimaryGroup).toBeTruthy();
    expect(activePrimaryGroup.symbolGroupId).toBe(marketGroupBId);
    expect(
      activePrimaryGroup.strategies.some((strategy) => strategy.isEnabled && strategy.strategyId === strategyBId)
    ).toBe(true);
    const activeStrategy = activePrimaryGroup.strategies.find(
      (strategy) => strategy.isEnabled && strategy.strategyId === strategyBId
    );
    expect(activeStrategy?.strategy.leverage).toBe(2);
  });

  it('keeps list/get strategyId aligned with runtime-graph primary strategy when legacy link diverges', async () => {
    const email = 'bots-list-runtime-graph-strategy-parity@example.com';
    const agent = await registerAndLogin(email);
    const ownerUser = await prisma.user.findUniqueOrThrow({ where: { email } });

    const canonicalStrategyId = await createStrategy(agent, 'Canonical Primary Strategy');
    const legacyStrategyId = await createStrategy(agent, 'Legacy Diverged Strategy');
    const marketGroupId = await createMarketGroup(email, 'FUTURES');

    const createRes = await agent.post('/dashboard/bots').send(
      createPayload({
        strategyId: canonicalStrategyId,
        marketGroupId,
      })
    );
    expect(createRes.status).toBe(201);
    const botId = createRes.body.id as string;

    await prisma.bot.update({
      where: { id: botId },
      data: {
        strategyId: legacyStrategyId,
      },
    });

    await prisma.botStrategy.create({
      data: {
        botId,
        strategyId: legacyStrategyId,
        symbolGroupId: marketGroupId,
        isEnabled: true,
      },
    });

    const listRes = await agent.get('/dashboard/bots');
    expect(listRes.status).toBe(200);
    const listed = (listRes.body as Array<{ id: string; strategyId: string | null }>).find(
      (item) => item.id === botId
    );
    expect(listed).toBeTruthy();

    const getRes = await agent.get(`/dashboard/bots/${botId}`);
    expect(getRes.status).toBe(200);

    const graphRes = await agent.get(`/dashboard/bots/${botId}/runtime-graph`);
    expect(graphRes.status).toBe(200);
    const primaryGroup = (graphRes.body.marketGroups as Array<{
      isEnabled: boolean;
      lifecycleStatus: string;
      executionOrder: number;
      strategies: Array<{ strategyId: string; isEnabled: boolean; priority: number }>;
    }>)
      .filter((group) => group.isEnabled && group.lifecycleStatus === 'ACTIVE')
      .sort((left, right) => left.executionOrder - right.executionOrder)[0];
    expect(primaryGroup).toBeTruthy();

    const primaryStrategy = [...(primaryGroup?.strategies ?? [])]
      .sort((left, right) => left.priority - right.priority)[0];
    expect(primaryStrategy).toBeTruthy();
    expect(primaryStrategy?.strategyId).toBe(canonicalStrategyId);

    expect(listed?.strategyId).toBe(primaryStrategy?.strategyId);
    expect(getRes.body.strategyId).toBe(primaryStrategy?.strategyId);
    expect(getRes.body.symbolGroupId).toBe(marketGroupId);
    expect(getRes.body.strategy.name).toBe('Canonical Primary Strategy');
    expect(getRes.body.strategyId).not.toBe(legacyStrategyId);
    expect(listed?.strategyId).not.toBe(legacyStrategyId);

    const persistedLegacy = await prisma.botStrategy.findFirst({
      where: { botId, strategyId: legacyStrategyId, bot: { userId: ownerUser.id } },
      select: { id: true },
    });
    expect(persistedLegacy).toBeTruthy();
  });

  it('exposes deterministic strategy-drift audit for legacy/canonical divergence', async () => {
    const email = 'bots-strategy-drift-audit@example.com';
    const agent = await registerAndLogin(email);

    const canonicalStrategyId = await createStrategy(agent, 'Drift Canonical Strategy');
    const legacyStrategyId = await createStrategy(agent, 'Drift Legacy Strategy');
    const marketGroupId = await createMarketGroup(email, 'FUTURES');

    const createRes = await agent.post('/dashboard/bots').send(
      createPayload({
        strategyId: canonicalStrategyId,
        marketGroupId,
      })
    );
    expect(createRes.status).toBe(201);
    const botId = createRes.body.id as string;

    await prisma.botStrategy.create({
      data: {
        botId,
        strategyId: legacyStrategyId,
        symbolGroupId: marketGroupId,
        isEnabled: true,
      },
    });

    const auditRes = await agent.get('/dashboard/bots/strategy-drift');
    expect(auditRes.status).toBe(200);
    expect(auditRes.body.totalBots).toBe(1);
    expect(auditRes.body.driftedBots).toBe(1);
    expect(Array.isArray(auditRes.body.items)).toBe(true);

    const driftItem = (
      auditRes.body.items as Array<{
        botId: string;
        projectedStrategyId: string | null;
        canonicalPrimaryStrategyId: string | null;
        legacyEnabledStrategyId: string | null;
        hasProjectionDrift: boolean;
        hasLegacyCanonicalDivergence: boolean;
        repairable: boolean;
      }>
    )[0];
    expect(driftItem.botId).toBe(botId);
    expect(driftItem.canonicalPrimaryStrategyId).toBe(canonicalStrategyId);
    expect(driftItem.legacyEnabledStrategyId).toBe(legacyStrategyId);
    expect(driftItem.projectedStrategyId).toBe(canonicalStrategyId);
    expect(driftItem.hasProjectionDrift).toBe(false);
    expect(driftItem.hasLegacyCanonicalDivergence).toBe(true);
    expect(driftItem.repairable).toBe(true);
  });

  it('repairs legacy strategy linkage to canonical primary strategy with idempotent behavior', async () => {
    const email = 'bots-strategy-drift-repair@example.com';
    const agent = await registerAndLogin(email);

    const canonicalStrategyId = await createStrategy(agent, 'Repair Canonical Strategy');
    const legacyStrategyId = await createStrategy(agent, 'Repair Legacy Strategy');
    const marketGroupId = await createMarketGroup(email, 'FUTURES');

    const createRes = await agent.post('/dashboard/bots').send(
      createPayload({
        strategyId: canonicalStrategyId,
        marketGroupId,
      })
    );
    expect(createRes.status).toBe(201);
    const botId = createRes.body.id as string;

    await prisma.botStrategy.create({
      data: {
        botId,
        strategyId: legacyStrategyId,
        symbolGroupId: marketGroupId,
        isEnabled: true,
      },
    });

    const repairRes = await agent.post('/dashboard/bots/strategy-drift/repair').send({ botId });
    expect(repairRes.status).toBe(200);
    expect(repairRes.body.requestedBotId).toBe(botId);
    expect(repairRes.body.scannedDriftedBots).toBe(1);
    expect(repairRes.body.repairedBots).toBe(1);
    expect(repairRes.body.skippedBots).toBe(0);

    const legacyRowsAfterRepair = await prisma.botStrategy.findMany({
      where: { botId },
      select: {
        strategyId: true,
        symbolGroupId: true,
        isEnabled: true,
      },
    });
    expect(legacyRowsAfterRepair).toHaveLength(1);
    expect(legacyRowsAfterRepair[0].strategyId).toBe(canonicalStrategyId);
    expect(legacyRowsAfterRepair[0].symbolGroupId).toBe(marketGroupId);
    expect(legacyRowsAfterRepair[0].isEnabled).toBe(true);

    const secondRepairRes = await agent.post('/dashboard/bots/strategy-drift/repair').send({ botId });
    expect(secondRepairRes.status).toBe(200);
    expect(secondRepairRes.body.scannedDriftedBots).toBe(0);
    expect(secondRepairRes.body.repairedBots).toBe(0);

    const legacyRowsAfterSecondRepair = await prisma.botStrategy.findMany({
      where: { botId },
      select: {
        strategyId: true,
        symbolGroupId: true,
        isEnabled: true,
      },
    });
    expect(legacyRowsAfterSecondRepair).toEqual(legacyRowsAfterRepair);
  });

  it('keeps runtime symbol-stats strictly within selected bot canonical ACTIVE scope', async () => {
    const ownerEmail = 'bot-runtime-selected-scope-only@example.com';
    const owner = await registerAndLogin(ownerEmail);
    const ownerUser = await prisma.user.findUniqueOrThrow({ where: { email: ownerEmail } });

    const strategyAId = await createStrategy(owner, 'Runtime Selected Scope Strategy A');
    const strategyBId = await createStrategy(owner, 'Runtime Selected Scope Strategy B');

    const botAActiveGroupId = await createMarketGroup(ownerEmail, 'FUTURES');
    await prisma.symbolGroup.update({
      where: { id: botAActiveGroupId },
      data: { symbols: ['BTCUSDT'] },
    });
    const botAPausedGroupId = await createMarketGroup(ownerEmail, 'FUTURES');
    await prisma.symbolGroup.update({
      where: { id: botAPausedGroupId },
      data: { symbols: ['ETHUSDT'] },
    });
    const botBGroupId = await createMarketGroup(ownerEmail, 'FUTURES');
    await prisma.symbolGroup.update({
      where: { id: botBGroupId },
      data: { symbols: ['ETHUSDT', 'SOLUSDT', 'XRPUSDT', 'BNBUSDT'] },
    });

    const botARes = await owner.post('/dashboard/bots').send(
      createPayload({
        strategyId: strategyAId,
        marketGroupId: botAActiveGroupId,
      })
    );
    expect(botARes.status).toBe(201);
    const botAId = botARes.body.id as string;

    const botBRes = await owner.post('/dashboard/bots').send(
      createPayload({
        strategyId: strategyBId,
        marketGroupId: botBGroupId,
      })
    );
    expect(botBRes.status).toBe(201);

    await prisma.botMarketGroup.create({
      data: {
        userId: ownerUser.id,
        botId: botAId,
        symbolGroupId: botAPausedGroupId,
        lifecycleStatus: 'PAUSED',
        executionOrder: 2,
        isEnabled: true,
      },
    });

    const sessionA = await prisma.botRuntimeSession.create({
      data: {
        userId: ownerUser.id,
        botId: botAId,
        mode: 'PAPER',
        status: 'RUNNING',
        startedAt: new Date('2026-04-05T10:00:00.000Z'),
      },
    });

    await prisma.botRuntimeSymbolStat.createMany({
      data: [
        {
          userId: ownerUser.id,
          botId: botAId,
          sessionId: sessionA.id,
          symbol: 'BTCUSDT',
          totalSignals: 1,
          longEntries: 1,
          realizedPnl: 5,
          snapshotAt: new Date('2026-04-05T10:03:00.000Z'),
        },
        {
          userId: ownerUser.id,
          botId: botAId,
          sessionId: sessionA.id,
          symbol: 'SOLUSDT',
          totalSignals: 1,
          shortEntries: 1,
          realizedPnl: -3,
          snapshotAt: new Date('2026-04-05T10:04:00.000Z'),
        },
      ],
    });
    await prisma.botRuntimeEvent.create({
      data: {
        userId: ownerUser.id,
        botId: botAId,
        sessionId: sessionA.id,
        eventType: 'SIGNAL_DECISION',
        level: 'INFO',
        symbol: 'XRPUSDT',
        signalDirection: 'LONG',
        eventAt: new Date('2026-04-05T10:05:00.000Z'),
      },
    });
    await prisma.trade.create({
      data: {
        userId: ownerUser.id,
        botId: botAId,
        symbol: 'SOLUSDT',
        side: 'BUY',
        lifecycleAction: 'OPEN',
        price: 150,
        quantity: 1,
        fee: 0.1,
        realizedPnl: 0,
        executedAt: new Date('2026-04-05T10:06:00.000Z'),
      },
    });
    await prisma.position.create({
      data: {
        userId: ownerUser.id,
        botId: botAId,
        symbol: 'SOLUSDT',
        side: 'LONG',
        status: 'OPEN',
        origin: 'BOT',
        managementMode: 'BOT_MANAGED',
        entryPrice: 150,
        quantity: 1,
        leverage: 1,
        openedAt: new Date('2026-04-05T10:06:30.000Z'),
      },
    });

    const statsRes = await owner.get(`/dashboard/bots/${botAId}/runtime-sessions/${sessionA.id}/symbol-stats`);
    expect(statsRes.status).toBe(200);
    const symbols = statsRes.body.items.map((item: { symbol: string }) => item.symbol);

    expect(symbols).toEqual(['BTCUSDT']);
    expect(symbols).not.toContain('ETHUSDT');
    expect(symbols).not.toContain('SOLUSDT');
    expect(symbols).not.toContain('XRPUSDT');
    expect(symbols).not.toContain('BNBUSDT');

    const staleSymbolStatsRes = await owner.get(
      `/dashboard/bots/${botAId}/runtime-sessions/${sessionA.id}/symbol-stats?symbol=SOLUSDT`
    );
    expect(staleSymbolStatsRes.status).toBe(200);
    expect(staleSymbolStatsRes.body.items).toEqual([]);
    expect(staleSymbolStatsRes.body.summary.totalSignals).toBe(0);
    expect(staleSymbolStatsRes.body.summary.realizedPnl).toBe(0);

    const staleSymbolTradesRes = await owner.get(
      `/dashboard/bots/${botAId}/runtime-sessions/${sessionA.id}/trades?symbol=SOLUSDT`
    );
    expect(staleSymbolTradesRes.status).toBe(200);
    expect(staleSymbolTradesRes.body.items).toEqual([]);
    expect(staleSymbolTradesRes.body.total).toBe(0);

    const tradesRes = await owner.get(`/dashboard/bots/${botAId}/runtime-sessions/${sessionA.id}/trades`);
    expect(tradesRes.status).toBe(200);
    expect(
      (tradesRes.body.items as Array<{ symbol: string }>).map((item) => item.symbol)
    ).not.toContain('SOLUSDT');

    const positionsRes = await owner.get(`/dashboard/bots/${botAId}/runtime-sessions/${sessionA.id}/positions`);
    expect(positionsRes.status).toBe(200);
    expect(
      (positionsRes.body.openItems as Array<{ symbol: string }>).map((item) => item.symbol)
    ).not.toContain('SOLUSDT');
  });

  it('excludes paused legacy botStrategy symbol groups from selected-bot symbol-stats scope', async () => {
    const ownerEmail = 'bot-runtime-paused-legacy-strategy-scope@example.com';
    const owner = await registerAndLogin(ownerEmail);
    const ownerUser = await prisma.user.findUniqueOrThrow({ where: { email: ownerEmail } });

    const activeStrategyName = 'Runtime Active Scope Strategy';
    const pausedStrategyName = 'Runtime Paused Legacy Scope Strategy';
    const activeStrategyId = await createStrategy(owner, activeStrategyName);
    const pausedStrategyId = await createStrategy(owner, pausedStrategyName);

    const activeGroupId = await createMarketGroup(ownerEmail, 'FUTURES');
    await prisma.symbolGroup.update({
      where: { id: activeGroupId },
      data: { symbols: ['BTCUSDT'] },
    });
    const pausedGroupId = await createMarketGroup(ownerEmail, 'FUTURES');
    await prisma.symbolGroup.update({
      where: { id: pausedGroupId },
      data: { symbols: ['ETHUSDT'] },
    });

    const botRes = await owner.post('/dashboard/bots').send(
      createPayload({
        strategyId: activeStrategyId,
        marketGroupId: activeGroupId,
      })
    );
    expect(botRes.status).toBe(201);
    const botId = botRes.body.id as string;

    await prisma.botMarketGroup.create({
      data: {
        userId: ownerUser.id,
        botId,
        symbolGroupId: pausedGroupId,
        lifecycleStatus: 'PAUSED',
        executionOrder: 2,
        isEnabled: true,
      },
    });

    await prisma.botStrategy.create({
      data: {
        botId,
        strategyId: pausedStrategyId,
        symbolGroupId: pausedGroupId,
        isEnabled: true,
      },
    });

    const session = await prisma.botRuntimeSession.create({
      data: {
        userId: ownerUser.id,
        botId,
        mode: 'PAPER',
        status: 'RUNNING',
        startedAt: new Date('2026-04-05T12:00:00.000Z'),
      },
    });

    await prisma.botRuntimeSymbolStat.create({
      data: {
        userId: ownerUser.id,
        botId,
        sessionId: session.id,
        symbol: 'BTCUSDT',
        totalSignals: 1,
        longEntries: 1,
        realizedPnl: 6,
        snapshotAt: new Date('2026-04-05T12:03:00.000Z'),
      },
    });

    const statsRes = await owner.get(`/dashboard/bots/${botId}/runtime-sessions/${session.id}/symbol-stats`);
    expect(statsRes.status).toBe(200);
    const symbols = (statsRes.body.items as Array<{ symbol: string }>).map((item) => item.symbol);
    expect(symbols).toEqual(['BTCUSDT']);
    expect(symbols).not.toContain('ETHUSDT');

    const btc = (
      statsRes.body.items as Array<{
        symbol: string;
        lastSignalStrategyName: string | null;
        configuredStrategyName?: string | null;
        lastSignalContextSource?: string | null;
      }>
    ).find(
      (item) => item.symbol === 'BTCUSDT'
    );
    expect(btc).toBeTruthy();
    expect(btc?.lastSignalStrategyName).toBeNull();
    expect(btc?.configuredStrategyName).toBe(activeStrategyName);
    expect(btc?.configuredStrategyName).not.toBe(pausedStrategyName);
    expect(btc?.lastSignalContextSource).toBe('configured_fallback');
  });

  it('keeps strict selected-bot scope and resolves strategy context from canonical links before legacy fallback', async () => {
    const ownerEmail = 'bot-runtime-canonical-strategy-precedence@example.com';
    const owner = await registerAndLogin(ownerEmail);
    const ownerUser = await prisma.user.findUniqueOrThrow({ where: { email: ownerEmail } });

    const canonicalStrategyName = 'Runtime Canonical Scope Strategy';
    const legacyStrategyName = 'Runtime Legacy Scope Strategy';
    const canonicalStrategyId = await createStrategy(owner, canonicalStrategyName);
    const legacyStrategyId = await createStrategy(owner, legacyStrategyName);

    const botAActiveGroupId = await createMarketGroup(ownerEmail, 'FUTURES');
    await prisma.symbolGroup.update({
      where: { id: botAActiveGroupId },
      data: { symbols: ['BTCUSDT'] },
    });
    const botAPausedGroupId = await createMarketGroup(ownerEmail, 'FUTURES');
    await prisma.symbolGroup.update({
      where: { id: botAPausedGroupId },
      data: { symbols: ['ETHUSDT'] },
    });
    const botBGroupId = await createMarketGroup(ownerEmail, 'FUTURES');
    await prisma.symbolGroup.update({
      where: { id: botBGroupId },
      data: { symbols: ['ETHUSDT', 'SOLUSDT', 'XRPUSDT', 'BNBUSDT'] },
    });

    const botARes = await owner.post('/dashboard/bots').send(
      createPayload({
        strategyId: canonicalStrategyId,
        marketGroupId: botAActiveGroupId,
      })
    );
    expect(botARes.status).toBe(201);
    const botAId = botARes.body.id as string;

    const botBRes = await owner.post('/dashboard/bots').send(
      createPayload({
        strategyId: canonicalStrategyId,
        marketGroupId: botBGroupId,
      })
    );
    expect(botBRes.status).toBe(201);

    await prisma.botMarketGroup.create({
      data: {
        userId: ownerUser.id,
        botId: botAId,
        symbolGroupId: botAPausedGroupId,
        lifecycleStatus: 'PAUSED',
        executionOrder: 2,
        isEnabled: true,
      },
    });
    await prisma.botStrategy.create({
      data: {
        botId: botAId,
        strategyId: legacyStrategyId,
        symbolGroupId: botAActiveGroupId,
        isEnabled: true,
      },
    });

    const sessionA = await prisma.botRuntimeSession.create({
      data: {
        userId: ownerUser.id,
        botId: botAId,
        mode: 'PAPER',
        status: 'RUNNING',
        startedAt: new Date('2026-04-05T11:00:00.000Z'),
      },
    });

    await prisma.botRuntimeSymbolStat.createMany({
      data: [
        {
          userId: ownerUser.id,
          botId: botAId,
          sessionId: sessionA.id,
          symbol: 'BTCUSDT',
          totalSignals: 1,
          longEntries: 1,
          realizedPnl: 4,
          snapshotAt: new Date('2026-04-05T11:03:00.000Z'),
        },
        {
          userId: ownerUser.id,
          botId: botAId,
          sessionId: sessionA.id,
          symbol: 'SOLUSDT',
          totalSignals: 1,
          shortEntries: 1,
          realizedPnl: -2,
          snapshotAt: new Date('2026-04-05T11:04:00.000Z'),
        },
      ],
    });
    await prisma.botRuntimeEvent.create({
      data: {
        userId: ownerUser.id,
        botId: botAId,
        sessionId: sessionA.id,
        eventType: 'SIGNAL_DECISION',
        level: 'INFO',
        symbol: 'XRPUSDT',
        signalDirection: 'SHORT',
        eventAt: new Date('2026-04-05T11:05:00.000Z'),
      },
    });

    const statsRes = await owner.get(`/dashboard/bots/${botAId}/runtime-sessions/${sessionA.id}/symbol-stats`);
    expect(statsRes.status).toBe(200);
    const symbols = statsRes.body.items.map((item: { symbol: string }) => item.symbol);
    expect(symbols).toEqual(['BTCUSDT']);
    expect(symbols).not.toContain('ETHUSDT');
    expect(symbols).not.toContain('SOLUSDT');
    expect(symbols).not.toContain('XRPUSDT');
    expect(symbols).not.toContain('BNBUSDT');

    const btc = (
      statsRes.body.items as Array<{
        symbol: string;
        lastSignalStrategyName: string | null;
        configuredStrategyName?: string | null;
        lastSignalContextSource?: string | null;
      }>
    ).find(
      (item) => item.symbol === 'BTCUSDT'
    );
    expect(btc).toBeTruthy();
    expect(btc?.lastSignalStrategyName).toBeNull();
    expect(btc?.configuredStrategyName).toBe(canonicalStrategyName);
    expect(btc?.configuredStrategyName).not.toBe(legacyStrategyName);
    expect(btc?.lastSignalContextSource).toBe('configured_fallback');
  });

  it('marks symbol strategy context source as latest_signal when latest event carries explicit strategyId', async () => {
    const ownerEmail = 'bot-runtime-latest-signal-context-source@example.com';
    const owner = await registerAndLogin(ownerEmail);
    const ownerUser = await prisma.user.findUniqueOrThrow({ where: { email: ownerEmail } });

    const fallbackStrategyId = await createStrategy(owner, 'Runtime Fallback Strategy');
    const latestSignalStrategyId = await createStrategy(owner, 'Runtime Latest Signal Strategy');
    const marketGroupId = await createMarketGroup(ownerEmail, 'FUTURES');
    await prisma.symbolGroup.update({
      where: { id: marketGroupId },
      data: { symbols: ['BTCUSDT'] },
    });

    const botRes = await owner.post('/dashboard/bots').send(
      createPayload({
        strategyId: fallbackStrategyId,
        marketGroupId,
      })
    );
    expect(botRes.status).toBe(201);
    const botId = botRes.body.id as string;

    const session = await prisma.botRuntimeSession.create({
      data: {
        userId: ownerUser.id,
        botId,
        mode: 'PAPER',
        status: 'RUNNING',
        startedAt: new Date('2026-04-06T09:00:00.000Z'),
      },
    });

    await prisma.botRuntimeSymbolStat.create({
      data: {
        userId: ownerUser.id,
        botId,
        sessionId: session.id,
        symbol: 'BTCUSDT',
        totalSignals: 2,
        longEntries: 1,
        shortEntries: 1,
        snapshotAt: new Date('2026-04-06T09:04:00.000Z'),
      },
    });

    await prisma.botRuntimeEvent.create({
      data: {
        userId: ownerUser.id,
        botId,
        sessionId: session.id,
        eventType: 'SIGNAL_DECISION',
        level: 'INFO',
        symbol: 'BTCUSDT',
        signalDirection: 'LONG',
        strategyId: latestSignalStrategyId,
        eventAt: new Date('2026-04-06T09:05:00.000Z'),
      },
    });

    const statsRes = await owner.get(`/dashboard/bots/${botId}/runtime-sessions/${session.id}/symbol-stats`);
    expect(statsRes.status).toBe(200);

    const btc = (
      statsRes.body.items as Array<{
        symbol: string;
        lastSignalStrategyId?: string | null;
        lastSignalStrategyName?: string | null;
        lastSignalContextSource?: string | null;
      }>
    ).find((item) => item.symbol === 'BTCUSDT');
    expect(btc).toBeTruthy();
    expect(btc?.lastSignalStrategyId).toBe(latestSignalStrategyId);
    expect(btc?.lastSignalStrategyName).toBe('Runtime Latest Signal Strategy');
    expect(btc?.lastSignalContextSource).toBe('latest_signal');
  });

  it('ignores stale pre-update signal context after bot strategy changes while stopped', async () => {
    const ownerEmail = 'bot-runtime-stale-signal-after-strategy-change@example.com';
    const owner = await registerAndLogin(ownerEmail);
    const ownerUser = await prisma.user.findUniqueOrThrow({ where: { email: ownerEmail } });

    const newStrategyId = await createStrategy(owner, 'Runtime New Momentum Strategy', {
      open: {
        indicatorsLong: [
          { name: 'MOMENTUM', condition: '>', value: 0, params: { period: 10 } },
        ],
        indicatorsShort: [],
      },
      close: { mode: 'basic', tp: 2, sl: 1 },
    });
    const oldStrategyId = await createStrategy(owner, 'Runtime Old RSI Strategy', {
      open: {
        indicatorsLong: [
          { name: 'RSI', condition: '<', value: 30, params: { period: 14 } },
        ],
        indicatorsShort: [],
      },
      close: { mode: 'basic', tp: 2, sl: 1 },
    });
    const marketGroupId = await createMarketGroup(ownerEmail, 'FUTURES');
    await prisma.symbolGroup.update({
      where: { id: marketGroupId },
      data: { symbols: ['BTCUSDT'] },
    });

    const botRes = await owner.post('/dashboard/bots').send(
      createPayload({
        strategyId: oldStrategyId,
        marketGroupId,
      })
    );
    expect(botRes.status).toBe(201);
    const botId = botRes.body.id as string;

    const oldSession = await prisma.botRuntimeSession.create({
      data: {
        userId: ownerUser.id,
        botId,
        mode: 'PAPER',
        status: 'CANCELED',
        startedAt: new Date('2026-04-06T11:00:00.000Z'),
        finishedAt: new Date('2026-04-06T11:10:00.000Z'),
      },
    });
    await prisma.botRuntimeSymbolStat.create({
      data: {
        userId: ownerUser.id,
        botId,
        sessionId: oldSession.id,
        symbol: 'BTCUSDT',
        totalSignals: 1,
        longEntries: 1,
        snapshotAt: new Date('2026-04-06T11:04:00.000Z'),
      },
    });
    await prisma.botRuntimeEvent.create({
      data: {
        userId: ownerUser.id,
        botId,
        sessionId: oldSession.id,
        eventType: 'SIGNAL_DECISION',
        level: 'INFO',
        symbol: 'BTCUSDT',
        signalDirection: 'LONG',
        strategyId: oldStrategyId,
        payload: {
          analysis: {
            byStrategy: {
              [oldStrategyId]: {
                conditionLines: [
                  {
                    scope: 'LONG',
                    left: 'RSI(14)',
                    value: '25',
                    operator: '<',
                    right: '30',
                  },
                ],
                indicatorSummary: 'RSI(14)=25',
              },
            },
          },
        },
        eventAt: new Date('2026-04-06T11:05:00.000Z'),
      },
    });

    const updateRes = await owner.put(`/dashboard/bots/${botId}`).send({
      strategyId: newStrategyId,
      isActive: true,
    });
    expect(updateRes.status).toBe(200);

    const runningSession = await prisma.botRuntimeSession.create({
      data: {
        userId: ownerUser.id,
        botId,
        mode: 'PAPER',
        status: 'RUNNING',
        startedAt: new Date('2026-04-06T11:20:00.000Z'),
        lastHeartbeatAt: new Date('2026-04-06T11:21:00.000Z'),
      },
    });
    await prisma.botRuntimeSymbolStat.create({
      data: {
        userId: ownerUser.id,
        botId,
        sessionId: runningSession.id,
        symbol: 'BTCUSDT',
        snapshotAt: new Date('2026-04-06T11:21:00.000Z'),
      },
    });

    const aggregateRes = await owner.get(`/dashboard/bots/${botId}/runtime-monitoring/aggregate`);
    expect(aggregateRes.status).toBe(200);
    const btc = (
      aggregateRes.body.symbolStats.items as Array<{
        symbol: string;
        lastSignalDirection?: string | null;
        lastSignalStrategyId?: string | null;
        lastSignalContextSource?: string | null;
        configuredStrategyName?: string | null;
        lastSignalConditionSummary?: string | null;
        lastSignalConditionLines?: Array<{ left: string }> | null;
      }>
    ).find((item) => item.symbol === 'BTCUSDT');

    expect(btc).toBeTruthy();
    expect(btc?.lastSignalDirection).toBeNull();
    expect(btc?.lastSignalStrategyId).toBeNull();
    expect(btc?.lastSignalContextSource).toBe('configured_fallback');
    expect(btc?.configuredStrategyName).toBe('Runtime New Momentum Strategy');
    expect(btc?.lastSignalConditionSummary).toContain('MOMENTUM(10)');
    expect(btc?.lastSignalConditionSummary).not.toContain('RSI(14)');
    expect(btc?.lastSignalConditionLines?.some((line) => line.left.includes('RSI'))).toBe(false);
  });

  it('marks symbol context as latest_decision when runtime evaluated the symbol without accepting a directional signal', async () => {
    const ownerEmail = 'bot-runtime-latest-decision-context-source@example.com';
    const owner = await registerAndLogin(ownerEmail);
    const ownerUser = await prisma.user.findUniqueOrThrow({ where: { email: ownerEmail } });

    const fallbackStrategyId = await createStrategy(owner, 'Runtime Decision Fallback Strategy');
    const marketGroupId = await createMarketGroup(ownerEmail, 'FUTURES');
    await prisma.symbolGroup.update({
      where: { id: marketGroupId },
      data: { symbols: ['BTCUSDT'] },
    });

    const botRes = await owner.post('/dashboard/bots').send(
      createPayload({
        strategyId: fallbackStrategyId,
        marketGroupId,
      })
    );
    expect(botRes.status).toBe(201);
    const botId = botRes.body.id as string;

    const session = await prisma.botRuntimeSession.create({
      data: {
        userId: ownerUser.id,
        botId,
        mode: 'PAPER',
        status: 'RUNNING',
        startedAt: new Date('2026-04-06T10:00:00.000Z'),
      },
    });

    await prisma.botRuntimeEvent.create({
      data: {
        userId: ownerUser.id,
        botId,
        sessionId: session.id,
        eventType: 'SIGNAL_DECISION',
        level: 'DEBUG',
        symbol: 'BTCUSDT',
        message: 'No trade decision after strategy merge',
        payload: {
          merge: {
            reason: 'no_votes',
          },
        },
        eventAt: new Date('2026-04-06T10:05:00.000Z'),
      },
    });

    const statsRes = await owner.get(`/dashboard/bots/${botId}/runtime-sessions/${session.id}/symbol-stats`);
    expect(statsRes.status).toBe(200);

    const btc = (
      statsRes.body.items as Array<{
        symbol: string;
        lastSignalDirection?: string | null;
        lastSignalStrategyName?: string | null;
        configuredStrategyName?: string | null;
        lastSignalReason?: string | null;
        lastSignalContextSource?: string | null;
      }>
    ).find((item) => item.symbol === 'BTCUSDT');
    expect(btc).toBeTruthy();
    expect(btc?.lastSignalDirection).toBeNull();
    expect(btc?.lastSignalStrategyName).toBeNull();
    expect(btc?.configuredStrategyName).toBe('Runtime Decision Fallback Strategy');
    expect(btc?.lastSignalReason).toBe('No votes');
    expect(btc?.lastSignalContextSource).toBe('latest_decision');
  });
});
