import { beforeEach, describe, expect, it } from 'vitest';
import { prisma } from '../../prisma/client';
import {
  createMarketGroup,
  createPayload,
  createStrategy,
  createWalletForContext,
  registerAndLogin,
  resetBotsE2eState,
} from './bots.e2e.shared';

const createLiveApiKeyForUser = async (email: string) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: { email },
    select: { id: true },
  });
  const apiKey = await prisma.apiKey.create({
    data: {
      userId: user.id,
      label: `Portfolio History LIVE ${Date.now()}`,
      exchange: 'BINANCE',
      apiKey: 'test-live-key',
      apiSecret: 'test-live-secret',
      syncExternalPositions: true,
      manageExternalPositions: false,
    },
    select: { id: true },
  });
  return apiKey.id;
};

describe('Bots portfolio history endpoint', () => {
  beforeEach(resetBotsE2eState);

  it('returns PAPER history with an explicit reset marker and stepwise realized points', async () => {
    const ownerEmail = 'bots-portfolio-history-paper@example.com';
    const owner = await registerAndLogin(ownerEmail);
    const ownerUser = await prisma.user.findUniqueOrThrow({
      where: { email: ownerEmail },
      select: { id: true },
    });

    const strategyId = await createStrategy(owner, 'Portfolio History Paper Strategy');
    const marketGroupId = await createMarketGroup(ownerEmail, 'FUTURES');
    await prisma.symbolGroup.update({
      where: { id: marketGroupId },
      data: { symbols: ['BTCUSDT', 'ETHUSDT', 'DOGEUSDT'] },
    });
    const walletId = await createWalletForContext(ownerEmail, {
      mode: 'PAPER',
      exchange: 'BINANCE',
      marketType: 'FUTURES',
      baseCurrency: 'USDT',
    });
    const resetAt = new Date('2026-05-01T10:00:00.000Z');
    await prisma.wallet.update({
      where: { id: walletId },
      data: {
        paperInitialBalance: 1_000,
        paperResetAt: resetAt,
      },
    });

    const createRes = await owner.post('/dashboard/bots').send(
      createPayload({
        strategyId,
        marketGroupId,
        walletId,
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
        startedAt: new Date('2026-05-01T09:30:00.000Z'),
        lastHeartbeatAt: new Date('2026-05-01T12:00:00.000Z'),
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
        snapshotAt: new Date('2026-05-01T12:00:00.000Z'),
      },
    });

    await prisma.position.createMany({
      data: [
        {
          userId: ownerUser.id,
          botId,
          walletId,
          strategyId,
          symbol: 'BTCUSDT',
          side: 'LONG',
          status: 'CLOSED',
          entryPrice: 60_000,
          quantity: 0.01,
          leverage: 1,
          realizedPnl: 40,
          openedAt: new Date('2026-05-01T10:10:00.000Z'),
          closedAt: new Date('2026-05-01T10:20:00.000Z'),
          managementMode: 'BOT_MANAGED',
        },
        {
          userId: ownerUser.id,
          botId,
          walletId,
          strategyId,
          symbol: 'ETHUSDT',
          side: 'LONG',
          status: 'OPEN',
          entryPrice: 3_000,
          quantity: 0.2,
          leverage: 1,
          unrealizedPnl: 15,
          openedAt: new Date('2026-05-01T10:40:00.000Z'),
          managementMode: 'BOT_MANAGED',
        },
        {
          userId: ownerUser.id,
          botId,
          walletId,
          strategyId,
          symbol: 'DOGEUSDT',
          side: 'LONG',
          status: 'CLOSED',
          syncState: 'ORPHAN_LOCAL',
          continuityState: 'REPAIR_ONLY_CLEANUP',
          entryPrice: 0.1,
          quantity: 100,
          leverage: 1,
          realizedPnl: 999,
          openedAt: new Date('2026-05-01T10:25:00.000Z'),
          closedAt: new Date('2026-05-01T10:30:00.000Z'),
          managementMode: 'BOT_MANAGED',
        },
      ],
    });

    const historyRes = await owner.get(`/dashboard/bots/${botId}/portfolio-history`);
    expect(historyRes.status).toBe(200);
    expect(historyRes.body.mode).toBe('PAPER');
    expect(historyRes.body.completeness).toBe('PARTIAL');
    expect(historyRes.body.completenessReasons).toContain('OPEN_PNL_LATEST_ONLY');
    expect(historyRes.body.summary).toEqual(
      expect.objectContaining({
        startBalance: 1000,
        currentBalance: 1040,
        realizedPnl: 40,
        unrealizedPnl: 15,
        totalPnl: 55,
        capitalSource: 'PAPER_RESET_CHECKPOINT',
        paperResetAt: resetAt.toISOString(),
      })
    );
    expect(historyRes.body.markers).toEqual([
      expect.objectContaining({
        type: 'PAPER_RESET',
        timestamp: resetAt.toISOString(),
      }),
    ]);
    expect(historyRes.body.points[0]).toEqual(
      expect.objectContaining({
        type: 'START',
        balance: 1000,
      })
    );
    expect(historyRes.body.points).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: 'CLOSE',
          symbol: 'BTCUSDT',
          balance: 1040,
        }),
        expect.objectContaining({
          type: 'CURRENT',
          balance: 1040,
          realizedPnl: 40,
        }),
      ])
    );
    expect(
      (historyRes.body.points as Array<{ type: string; symbol: string | null }>).filter(
        (point) => point.type === 'CLOSE'
      )
    ).toEqual([
      expect.objectContaining({
        symbol: 'BTCUSDT',
        realizedPnl: 40,
      }),
    ]);
  });

  it('keeps PAPER close points complete when monitoring rows are capped', async () => {
    const ownerEmail = 'bots-portfolio-history-paper-full-close@example.com';
    const owner = await registerAndLogin(ownerEmail);
    const ownerUser = await prisma.user.findUniqueOrThrow({
      where: { email: ownerEmail },
      select: { id: true },
    });

    const strategyId = await createStrategy(owner, 'Portfolio History Full Close Strategy');
    const marketGroupId = await createMarketGroup(ownerEmail, 'FUTURES');
    const walletId = await createWalletForContext(ownerEmail, {
      mode: 'PAPER',
      exchange: 'BINANCE',
      marketType: 'FUTURES',
      baseCurrency: 'USDT',
    });
    await prisma.wallet.update({
      where: { id: walletId },
      data: {
        paperInitialBalance: 1_000,
        paperResetAt: new Date('2026-05-01T09:00:00.000Z'),
      },
    });

    const createRes = await owner.post('/dashboard/bots').send(
      createPayload({
        strategyId,
        marketGroupId,
        walletId,
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
        startedAt: new Date('2026-05-01T09:00:00.000Z'),
        lastHeartbeatAt: new Date('2026-05-01T20:00:00.000Z'),
      },
    });

    await prisma.botRuntimeSymbolStat.create({
      data: {
        userId: ownerUser.id,
        botId,
        sessionId: session.id,
        symbol: 'BTCUSDT',
        totalSignals: 501,
        longEntries: 501,
        closedTrades: 501,
        snapshotAt: new Date('2026-05-01T20:00:00.000Z'),
      },
    });

    await prisma.position.createMany({
      data: Array.from({ length: 501 }, (_, index) => ({
        userId: ownerUser.id,
        botId,
        walletId,
        strategyId,
        symbol: index % 2 === 0 ? 'BTCUSDT' : 'ETHUSDT',
        side: 'LONG' as const,
        status: 'CLOSED' as const,
        entryPrice: 60_000,
        quantity: 0.01,
        leverage: 1,
        realizedPnl: 1,
        openedAt: new Date(Date.UTC(2026, 4, 1, 9, index)),
        closedAt: new Date(Date.UTC(2026, 4, 1, 9, index, 30)),
        managementMode: 'BOT_MANAGED' as const,
      })),
    });

    const historyRes = await owner.get(`/dashboard/bots/${botId}/portfolio-history`);
    expect(historyRes.status).toBe(200);
    expect(historyRes.body.summary.closedPositionCount).toBe(501);
    expect(historyRes.body.summary.realizedPnl).toBe(501);
    expect(
      (historyRes.body.points as Array<{ type: string }>).filter((point) => point.type === 'CLOSE')
    ).toHaveLength(501);
    expect(historyRes.body.points.at(-1)).toEqual(
      expect.objectContaining({
        type: 'CURRENT',
        realizedPnl: 501,
      })
    );
  });

  it('returns LIVE history with wallet capital markers and ownership isolation', async () => {
    const ownerEmail = 'bots-portfolio-history-live@example.com';
    const owner = await registerAndLogin(ownerEmail);
    const other = await registerAndLogin('bots-portfolio-history-live-other@example.com');
    const ownerUser = await prisma.user.findUniqueOrThrow({
      where: { email: ownerEmail },
      select: { id: true },
    });

    const strategyId = await createStrategy(owner, 'Portfolio History Live Strategy');
    const marketGroupId = await createMarketGroup(ownerEmail, 'FUTURES');
    const liveApiKeyId = await createLiveApiKeyForUser(ownerEmail);
    const walletId = await createWalletForContext(ownerEmail, {
      mode: 'LIVE',
      exchange: 'BINANCE',
      marketType: 'FUTURES',
      baseCurrency: 'USDT',
      apiKeyId: liveApiKeyId,
    });

    const createRes = await owner.post('/dashboard/bots').send({
      ...createPayload({
        strategyId,
        marketGroupId,
        walletId,
      }),
      liveOptIn: true,
      consentTextVersion: 'v1-live-risk',
    });
    expect(createRes.status).toBe(201);
    const botId = createRes.body.id as string;

    const session = await prisma.botRuntimeSession.create({
      data: {
        userId: ownerUser.id,
        botId,
        mode: 'LIVE',
        status: 'RUNNING',
        startedAt: new Date('2026-05-01T08:00:00.000Z'),
        lastHeartbeatAt: new Date('2026-05-01T09:00:00.000Z'),
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
        snapshotAt: new Date('2026-05-01T09:00:00.000Z'),
      },
    });

    await prisma.walletBalanceSnapshot.create({
      data: {
        userId: ownerUser.id,
        walletId,
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        baseCurrency: 'USDT',
        accountBalance: 130,
        freeBalance: 130,
        allocatedBalance: 130,
        allocationMode: 'PERCENT',
        allocationValue: 100,
        fetchedAt: new Date('2026-05-01T09:00:00.000Z'),
      },
    });

    await prisma.position.create({
      data: {
        userId: ownerUser.id,
        botId,
        walletId,
        strategyId,
        symbol: 'BTCUSDT',
        side: 'LONG',
        status: 'CLOSED',
        entryPrice: 60_000,
        quantity: 0.01,
        leverage: 1,
        realizedPnl: 30,
        openedAt: new Date('2026-05-01T08:10:00.000Z'),
        closedAt: new Date('2026-05-01T08:40:00.000Z'),
        managementMode: 'BOT_MANAGED',
      },
    });

    await prisma.walletCashflowEvent.createMany({
      data: [
        {
          userId: ownerUser.id,
          walletId,
          direction: 'IN',
          source: 'DEPOSIT',
          amount: 50,
          currency: 'USDT',
          occurredAt: new Date('2026-05-01T08:20:00.000Z'),
        },
        {
          userId: ownerUser.id,
          walletId,
          direction: 'OUT',
          source: 'TRANSFER_OUT',
          amount: 10,
          currency: 'USDT',
          occurredAt: new Date('2026-05-01T08:50:00.000Z'),
        },
      ],
    });

    const historyRes = await owner.get(`/dashboard/bots/${botId}/portfolio-history`);
    expect(historyRes.status).toBe(200);
    expect(historyRes.body.mode).toBe('LIVE');
    expect(historyRes.body.completeness).toBe('COMPLETE');
    expect(historyRes.body.summary).toEqual(
      expect.objectContaining({
        startBalance: 100,
        currentBalance: 130,
        realizedPnl: 30,
        unrealizedPnl: 0,
        totalPnl: 30,
        capitalSource: 'LIVE_EXCHANGE_BALANCE',
      })
    );
    expect(historyRes.body.markers).toEqual([
      expect.objectContaining({
        type: 'DEPOSIT',
        amount: 50,
        currency: 'USDT',
      }),
      expect.objectContaining({
        type: 'TRANSFER_OUT',
        amount: 10,
        currency: 'USDT',
      }),
    ]);

    const otherRes = await other.get(`/dashboard/bots/${botId}/portfolio-history`);
    expect(otherRes.status).toBe(404);
  });
});
