import { beforeEach, describe, expect, it } from 'vitest';
import { prisma } from '../../prisma/client';
import { DYNAMIC_STOP_STRATEGY_CONFIG } from './bots.e2e.fixtures';
import { runtimePositionStateStore } from '../engine/runtimePositionState.store';
import {
  createMarketGroup,
  createPayload,
  createStrategy,
  registerAndLogin,
  resetBotsE2eState,
} from './bots.e2e.shared';

describe('Bots dynamic stop operator truth contract', () => {
  beforeEach(resetBotsE2eState);

  it('keeps dynamic-stop columns visible when row truth survives a bot strategy-topology downgrade', async () => {
    const ownerEmail = 'bot-runtime-dynamic-stop-operator-truth@example.com';
    const owner = await registerAndLogin(ownerEmail);
    const ownerUser = await prisma.user.findUniqueOrThrow({ where: { email: ownerEmail } });

    const downgradedStrategyId = await createStrategy(owner, 'Runtime Basic Close Strategy');
    const dynamicStopStrategyId = await createStrategy(
      owner,
      'Runtime Dynamic Stop Legacy Position Strategy',
      DYNAMIC_STOP_STRATEGY_CONFIG
    );

    const marketGroupId = await createMarketGroup(ownerEmail, 'FUTURES');
    const createRes = await owner
      .post('/dashboard/bots')
      .send(createPayload({ strategyId: downgradedStrategyId, marketGroupId }));
    expect(createRes.status).toBe(201);
    const botId = createRes.body.id as string;

    const session = await prisma.botRuntimeSession.create({
      data: {
        userId: ownerUser.id,
        botId,
        mode: 'PAPER',
        status: 'RUNNING',
        startedAt: new Date('2026-04-02T12:00:00.000Z'),
        lastHeartbeatAt: new Date('2026-04-02T12:05:00.000Z'),
      },
    });

    const position = await prisma.position.create({
      data: {
        userId: ownerUser.id,
        botId,
        strategyId: dynamicStopStrategyId,
        symbol: 'DOGEUSDT',
        side: 'LONG',
        status: 'OPEN',
        managementMode: 'BOT_MANAGED',
        entryPrice: 100,
        quantity: 1,
        leverage: 2,
        openedAt: new Date('2026-04-02T12:01:00.000Z'),
      },
    });

    await prisma.trade.create({
      data: {
        userId: ownerUser.id,
        botId,
        positionId: position.id,
        strategyId: dynamicStopStrategyId,
        symbol: 'DOGEUSDT',
        side: 'BUY',
        lifecycleAction: 'OPEN',
        price: 100,
        quantity: 1,
        fee: 0,
        realizedPnl: 0,
        executedAt: new Date('2026-04-02T12:01:05.000Z'),
      },
    });

    await prisma.botRuntimeSymbolStat.create({
      data: {
        userId: ownerUser.id,
        botId,
        sessionId: session.id,
        symbol: 'DOGEUSDT',
        lastPrice: 102,
        snapshotAt: new Date('2026-04-02T12:04:30.000Z'),
      },
    });

    const positionsRes = await owner.get(
      `/dashboard/bots/${botId}/runtime-sessions/${session.id}/positions`
    );
    expect(positionsRes.status).toBe(200);
    expect(positionsRes.body.showDynamicStopColumns).toBe(true);

    const doge = (
      positionsRes.body.openItems as Array<{
        symbol: string;
        dynamicTtpStopLoss: number | null;
        dynamicTslStopLoss: number | null;
      }>
    ).find((item) => item.symbol === 'DOGEUSDT');

    expect(doge).toBeDefined();
    if (!doge) throw new Error('Expected DOGEUSDT operator-truth item');
    expect(doge.dynamicTtpStopLoss).toBeCloseTo(101.5, 6);
    expect(doge.dynamicTslStopLoss).toBeNull();
  });

  it('keeps imported LIVE TTP visible from canonical position truth when stale runtime state drifts below the arm threshold', async () => {
    const ownerEmail = 'bot-runtime-dynamic-stop-display-rebase@example.com';
    const owner = await registerAndLogin(ownerEmail);
    const ownerUser = await prisma.user.findUniqueOrThrow({ where: { email: ownerEmail } });

    const dynamicStopStrategyId = await createStrategy(
      owner,
      'Runtime Dynamic Stop Imported Rebase Strategy',
      DYNAMIC_STOP_STRATEGY_CONFIG
    );

    const marketGroupId = await createMarketGroup(ownerEmail, 'FUTURES');
    const createRes = await owner
      .post('/dashboard/bots')
      .send(createPayload({ strategyId: dynamicStopStrategyId, marketGroupId }));
    expect(createRes.status).toBe(201);
    const botId = createRes.body.id as string;

    const session = await prisma.botRuntimeSession.create({
      data: {
        userId: ownerUser.id,
        botId,
        mode: 'LIVE',
        status: 'RUNNING',
        startedAt: new Date('2026-04-30T16:00:00.000Z'),
        lastHeartbeatAt: new Date('2026-04-30T16:01:00.000Z'),
      },
    });

    const position = await prisma.position.create({
      data: {
        userId: ownerUser.id,
        botId,
        strategyId: dynamicStopStrategyId,
        walletId: createRes.body.walletId as string,
        symbol: 'XRPUSDT',
        side: 'LONG',
        status: 'OPEN',
        origin: 'EXCHANGE_SYNC',
        managementMode: 'BOT_MANAGED',
        syncState: 'IN_SYNC',
        continuityState: 'CONFIRMED',
        entryPrice: 100,
        quantity: 1,
        leverage: 2,
        openedAt: new Date('2026-04-30T16:00:05.000Z'),
      },
    });

    await prisma.trade.create({
      data: {
        userId: ownerUser.id,
        botId,
        walletId: createRes.body.walletId as string,
        positionId: position.id,
        strategyId: dynamicStopStrategyId,
        symbol: 'XRPUSDT',
        side: 'BUY',
        lifecycleAction: 'OPEN',
        price: 100,
        quantity: 1,
        fee: 0,
        realizedPnl: 0,
        executedAt: new Date('2026-04-30T16:00:06.000Z'),
      },
    });

    await prisma.botRuntimeSymbolStat.create({
      data: {
        userId: ownerUser.id,
        botId,
        sessionId: session.id,
        symbol: 'XRPUSDT',
        lastPrice: 103,
        snapshotAt: new Date('2026-04-30T16:01:00.000Z'),
      },
    });

    await runtimePositionStateStore.setPositionRuntimeState(position.id, {
      quantity: 1,
      averageEntryPrice: 101,
      currentAdds: 0,
      trailingAnchorPrice: 101,
      trailingTakeProfitHighPercent: 0.01,
      trailingTakeProfitStepPercent: 0.02,
    });

    const positionsRes = await owner.get(
      `/dashboard/bots/${botId}/runtime-sessions/${session.id}/positions`
    );
    expect(positionsRes.status).toBe(200);

    const xrp = (
      positionsRes.body.openItems as Array<{
        symbol: string;
        dynamicTtpStopLoss: number | null;
      }>
    ).find((item) => item.symbol === 'XRPUSDT');

    expect(xrp).toBeDefined();
    if (!xrp) throw new Error('Expected XRPUSDT operator-truth item');
    expect(xrp.dynamicTtpStopLoss).toBeCloseTo(102.5, 6);

    await runtimePositionStateStore.deletePositionRuntimeState(position.id);
  });
});
