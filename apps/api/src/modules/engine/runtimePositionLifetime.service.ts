import { prisma } from '../../prisma/client';
import { ActiveBot } from './runtimeSignalLoopDefaults';
import { resolveStrategyLifetimePolicy } from './strategyLifetimePolicy';
import { orchestrateRuntimeSignal } from './executionOrchestrator.service';

export type RuntimeStalePositionCandidate = {
  id: string;
  userId: string;
  botId: string | null;
  walletId: string | null;
  symbol: string;
  quantity: number;
  openedAt: Date;
};

type RuntimePositionLifetimeDeps = {
  now?: () => Date;
  listStalePositions?: (params: {
    userId: string;
    botId: string;
    olderThanMs: number;
    now: Date;
  }) => Promise<RuntimeStalePositionCandidate[]>;
  resolveMarkPrice?: (params: {
    bot: ActiveBot;
    symbol: string;
  }) => Promise<number | null>;
  orchestrateClose?: typeof orchestrateRuntimeSignal;
};

const defaultDeps: Required<RuntimePositionLifetimeDeps> = {
  now: () => new Date(),
  listStalePositions: async ({ userId, botId, olderThanMs, now }) => {
    const cutoff = new Date(now.getTime() - olderThanMs);
    return prisma.position.findMany({
      where: {
        userId,
        botId,
        status: 'OPEN',
        syncState: 'IN_SYNC',
        openedAt: { lte: cutoff },
      },
      select: {
        id: true,
        userId: true,
        botId: true,
        walletId: true,
        symbol: true,
        quantity: true,
        openedAt: true,
      },
      orderBy: { openedAt: 'asc' },
    });
  },
  resolveMarkPrice: async () => null,
  orchestrateClose: (input) => orchestrateRuntimeSignal(input),
};

export const enforceRuntimePositionLifetimes = async (
  activeBots: ActiveBot[],
  deps: RuntimePositionLifetimeDeps = defaultDeps
) => {
  const resolvedDeps = {
    ...defaultDeps,
    ...deps,
  };
  const now = resolvedDeps.now();

  for (const bot of activeBots) {
    const policy = resolveStrategyLifetimePolicy({
      strategyConfig: bot.runtimeContext?.strategy.strategyConfig,
      kind: 'position',
    });
    if (!policy.enabled || !policy.durationMs) continue;

    const stalePositions = await resolvedDeps.listStalePositions({
      userId: bot.userId,
      botId: bot.id,
      olderThanMs: policy.durationMs,
      now,
    });

    for (const position of stalePositions) {
      const markPrice = await resolvedDeps.resolveMarkPrice({
        bot,
        symbol: position.symbol,
      });
      if (!(typeof markPrice === 'number' && Number.isFinite(markPrice) && markPrice > 0)) {
        continue;
      }

      await resolvedDeps.orchestrateClose({
        userId: position.userId,
        botId: bot.id,
        walletId: position.walletId ?? bot.walletId ?? undefined,
        strategyId: bot.runtimeContext?.strategy.strategyId,
        symbol: position.symbol,
        direction: 'EXIT',
        quantity: position.quantity,
        markPrice,
        mode: bot.mode,
        reason: 'position_lifetime_expired',
      });
    }
  }
};
