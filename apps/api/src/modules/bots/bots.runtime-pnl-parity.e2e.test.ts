import { beforeEach, describe, expect, it } from 'vitest';
import { prisma } from '../../prisma/client';
import {
  createStrategy,
  registerAndLogin,
  resetBotsE2eState,
} from './bots.e2e.shared';

describe('Bots runtime pnl parity contract', () => {
  beforeEach(resetBotsE2eState);

  it('returns canonical marginUsed and unrealizedPnlPercent for live runtime positions', async () => {
    const ownerEmail = 'bot-runtime-pnl-parity@example.com';
    const owner = await registerAndLogin(ownerEmail);
    const ownerUser = await prisma.user.findUniqueOrThrow({
      where: { email: ownerEmail },
      select: { id: true },
    });

    const strategyId = await createStrategy(owner, 'Runtime PnL Parity');
    const universe = await prisma.marketUniverse.create({
      data: {
        userId: ownerUser.id,
        name: `Live Runtime PnL Universe ${Date.now()}`,
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        baseCurrency: 'USDT',
        whitelist: [],
        blacklist: [],
      },
    });
    const wallet = await prisma.wallet.create({
      data: {
        userId: ownerUser.id,
        name: 'Live Runtime PnL Wallet',
        mode: 'LIVE',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        baseCurrency: 'USDT',
      },
    });
    const group = await prisma.symbolGroup.create({
      data: {
        userId: ownerUser.id,
        marketUniverseId: universe.id,
        name: 'Live Runtime PnL Group',
        symbols: ['ETHUSDT'],
      },
    });
    const bot = await prisma.bot.create({
      data: {
        userId: ownerUser.id,
        name: 'Live pnl parity bot',
        mode: 'LIVE',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        positionMode: 'ONE_WAY',
        isActive: true,
        liveOptIn: true,
        consentTextVersion: 'mvp-v1',
        walletId: wallet.id,
        symbolGroupId: group.id,
        strategyId,
      },
      select: { id: true },
    });

    const session = await prisma.botRuntimeSession.create({
      data: {
        userId: ownerUser.id,
        botId: bot.id,
        mode: 'LIVE',
        status: 'RUNNING',
        startedAt: new Date('2026-04-29T10:00:00.000Z'),
        lastHeartbeatAt: new Date('2026-04-29T10:05:00.000Z'),
      },
      select: { id: true },
    });

    const position = await prisma.position.create({
      data: {
        userId: ownerUser.id,
        botId: bot.id,
        walletId: wallet.id,
        strategyId,
        symbol: 'ETHUSDT',
        side: 'SHORT',
        status: 'OPEN',
        origin: 'EXCHANGE_SYNC',
        managementMode: 'BOT_MANAGED',
        syncState: 'IN_SYNC',
        continuityState: 'CONFIRMED',
        entryPrice: 100,
        quantity: 1,
        leverage: 10,
        marginUsed: 25,
        openedAt: new Date('2026-04-29T10:01:00.000Z'),
      },
    });
    await prisma.trade.create({
      data: {
        userId: ownerUser.id,
        botId: bot.id,
        walletId: wallet.id,
        positionId: position.id,
        strategyId,
        symbol: 'ETHUSDT',
        side: 'SELL',
        lifecycleAction: 'OPEN',
        price: 100,
        quantity: 1,
        fee: 0,
        realizedPnl: 0,
        executedAt: new Date('2026-04-29T10:01:10.000Z'),
        origin: 'EXCHANGE_SYNC',
        managementMode: 'BOT_MANAGED',
      },
    });

    await prisma.botRuntimeSymbolStat.create({
      data: {
        userId: ownerUser.id,
        botId: bot.id,
        sessionId: session.id,
        symbol: 'ETHUSDT',
        lastPrice: 105,
        snapshotAt: new Date('2026-04-29T10:04:00.000Z'),
      },
    });

    const positionsRes = await owner.get(
      `/dashboard/bots/${bot.id}/runtime-sessions/${session.id}/positions`
    );

    expect(positionsRes.status).toBe(200);
    expect(positionsRes.body.openItems).toHaveLength(1);
    expect(positionsRes.body.openItems[0]).toEqual(
      expect.objectContaining({
        symbol: 'ETHUSDT',
        marginUsed: 25,
        unrealizedPnl: -5,
        unrealizedPnlPercent: -20,
      })
    );
  });
});
