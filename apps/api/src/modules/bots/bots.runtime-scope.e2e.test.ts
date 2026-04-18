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

    const graphRes = await agent.get(`/dashboard/bots/${botId}/runtime-graph`);
    expect(graphRes.status).toBe(200);

    const activePrimaryGroup = (graphRes.body.marketGroups as Array<{
      symbolGroupId: string;
      isEnabled: boolean;
      lifecycleStatus: string;
      executionOrder: number;
      strategies: Array<{ strategyId: string; isEnabled: boolean; priority: number }>;
    }>)
      .filter((group) => group.isEnabled && group.lifecycleStatus === 'ACTIVE')
      .sort((left, right) => left.executionOrder - right.executionOrder)[0];
    expect(activePrimaryGroup).toBeTruthy();
    expect(activePrimaryGroup.symbolGroupId).toBe(marketGroupBId);
    expect(
      activePrimaryGroup.strategies.some((strategy) => strategy.isEnabled && strategy.strategyId === strategyBId)
    ).toBe(true);
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

    const statsRes = await owner.get(`/dashboard/bots/${botAId}/runtime-sessions/${sessionA.id}/symbol-stats`);
    expect(statsRes.status).toBe(200);
    const symbols = statsRes.body.items.map((item: { symbol: string }) => item.symbol);

    expect(symbols).toEqual(['BTCUSDT']);
    expect(symbols).not.toContain('ETHUSDT');
    expect(symbols).not.toContain('SOLUSDT');
    expect(symbols).not.toContain('XRPUSDT');
    expect(symbols).not.toContain('BNBUSDT');
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

    const btc = (statsRes.body.items as Array<{ symbol: string; lastSignalStrategyName: string | null }>).find(
      (item) => item.symbol === 'BTCUSDT'
    );
    expect(btc).toBeTruthy();
    expect(btc?.lastSignalStrategyName).toBe(canonicalStrategyName);
    expect(btc?.lastSignalStrategyName).not.toBe(legacyStrategyName);
  });
});
