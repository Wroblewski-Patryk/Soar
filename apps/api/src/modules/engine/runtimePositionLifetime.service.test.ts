import { randomUUID } from 'node:crypto';
import { describe, expect, it, vi } from 'vitest';
import { prisma } from '../../prisma/client';
import { enforceRuntimePositionLifetimes } from './runtimePositionLifetime.service';

const createActiveBot = (overrides?: {
  userId?: string;
  botId?: string;
  walletId?: string;
  mode?: 'PAPER' | 'LIVE';
  positionLifetime?: number;
  positionUnit?: 'min' | 'h' | 'd' | 'w';
}) => ({
  id: overrides?.botId ?? 'bot-1',
  userId: overrides?.userId ?? 'user-1',
  walletId: overrides?.walletId ?? 'wallet-1',
  mode: overrides?.mode ?? ('PAPER' as const),
  exchange: 'BINANCE' as const,
  paperStartBalance: 1000,
  marketType: 'FUTURES' as const,
  runtimeContext: {
    symbolGroupId: 'group-1',
    strategyId: 'strategy-1',
    maxOpenPositions: 1,
    symbols: ['BTCUSDT'],
    strategy: {
      strategyId: 'strategy-1',
      strategyInterval: '5m',
      strategyLeverage: 5,
      walletRisk: 1,
      strategyConfig: {
        additional: {
          positionLifetime: overrides?.positionLifetime ?? 2,
          positionUnit: overrides?.positionUnit ?? 'h',
        },
      },
    },
  },
});

describe('enforceRuntimePositionLifetimes', () => {
  it('closes stale positions through canonical runtime close orchestration', async () => {
    const now = new Date('2026-04-24T12:00:00.000Z');
    const listStalePositions = vi.fn(async () => [
      {
        id: 'position-1',
        userId: 'user-1',
        botId: 'bot-1',
        walletId: 'wallet-1',
        symbol: 'BTCUSDT',
        quantity: 0.5,
        openedAt: new Date('2026-04-24T09:00:00.000Z'),
      },
    ]);
    const resolveMarkPrice = vi.fn(async () => 64000);
    const orchestrateClose = vi.fn(async () => ({
      status: 'closed' as const,
      orderId: 'order-1',
      positionId: 'position-1',
    }));

    await enforceRuntimePositionLifetimes([createActiveBot()], {
      now: () => now,
      listStalePositions,
      resolveMarkPrice,
      orchestrateClose,
    });

    expect(listStalePositions).toHaveBeenCalledWith({
      userId: 'user-1',
      botId: 'bot-1',
      olderThanMs: 7_200_000,
      now,
    });
    expect(resolveMarkPrice).toHaveBeenCalledWith({
      bot: expect.objectContaining({ id: 'bot-1' }),
      symbol: 'BTCUSDT',
    });
    expect(orchestrateClose).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: 'user-1',
        botId: 'bot-1',
        walletId: 'wallet-1',
        strategyId: 'strategy-1',
        symbol: 'BTCUSDT',
        direction: 'EXIT',
        quantity: 0.5,
        markPrice: 64000,
        mode: 'PAPER',
        reason: 'position_lifetime_expired',
      })
    );
  });

  it('skips bots whose strategy disables position lifetime', async () => {
    const listStalePositions = vi.fn(async () => []);

    await enforceRuntimePositionLifetimes([createActiveBot({ positionLifetime: 0 })], {
      listStalePositions,
    });

    expect(listStalePositions).not.toHaveBeenCalled();
  });

  it('fails closed when mark price is unavailable', async () => {
    const listStalePositions = vi.fn(async () => [
      {
        id: 'position-1',
        userId: 'user-1',
        botId: 'bot-1',
        walletId: 'wallet-1',
        symbol: 'BTCUSDT',
        quantity: 0.5,
        openedAt: new Date('2026-04-24T09:00:00.000Z'),
      },
    ]);
    const resolveMarkPrice = vi.fn(async () => null);
    const orchestrateClose = vi.fn(async () => ({
      status: 'closed' as const,
      orderId: 'order-1',
      positionId: 'position-1',
    }));

    await enforceRuntimePositionLifetimes([createActiveBot()], {
      listStalePositions,
      resolveMarkPrice,
      orchestrateClose,
    });

    expect(orchestrateClose).not.toHaveBeenCalled();
  });

  it('ignores stale local open rows in the default lifetime scan', async () => {
    const now = new Date('2026-04-24T12:00:00.000Z');
    const user = await prisma.user.create({
      data: {
        email: `runtime-position-lifetime-sync-state-${randomUUID()}@example.com`,
        password: 'hashed',
      },
    });
    const bot = await prisma.bot.create({
      data: {
        userId: user.id,
        name: 'Lifetime sync-state bot',
        mode: 'PAPER',
        isActive: true,
      },
    });
    await prisma.position.createMany({
      data: [
        {
          userId: user.id,
          botId: bot.id,
          symbol: 'BTCUSDT',
          side: 'LONG',
          status: 'OPEN',
          syncState: 'ORPHAN_LOCAL',
          continuityState: 'REPAIR_ONLY_CLEANUP',
          entryPrice: 62000,
          quantity: 0.01,
          openedAt: new Date('2026-04-24T09:00:00.000Z'),
        },
        {
          userId: user.id,
          botId: bot.id,
          symbol: 'ETHUSDT',
          side: 'LONG',
          status: 'OPEN',
          syncState: 'IN_SYNC',
          entryPrice: 3000,
          quantity: 0.5,
          openedAt: new Date('2026-04-24T09:00:00.000Z'),
        },
      ],
    });
    const resolveMarkPrice = vi.fn(async () => 3000);
    const orchestrateClose = vi.fn(async () => ({
      status: 'closed' as const,
      orderId: 'order-1',
      positionId: 'position-1',
    }));

    await enforceRuntimePositionLifetimes(
      [createActiveBot({ userId: user.id, botId: bot.id })],
      {
        now: () => now,
        resolveMarkPrice,
        orchestrateClose,
      }
    );

    expect(orchestrateClose).toHaveBeenCalledTimes(1);
    expect(orchestrateClose).toHaveBeenCalledWith(
      expect.objectContaining({
        symbol: 'ETHUSDT',
        quantity: 0.5,
        reason: 'position_lifetime_expired',
      })
    );
    expect(orchestrateClose).not.toHaveBeenCalledWith(
      expect.objectContaining({
        symbol: 'BTCUSDT',
      })
    );
  });
});
