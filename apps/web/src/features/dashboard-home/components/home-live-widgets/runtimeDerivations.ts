import { toTimestamp } from '@/lib/time';
import type {
  BotRuntimePositionsResponse,
  BotRuntimeSymbolStatsResponse,
  BotRuntimeTrade,
} from '@/features/bots/types/bot.type';
import {
  buildRuntimeOpenPositionRows,
  sumRuntimeOpenPositionUnrealized,
} from '@/features/bots/utils/runtimeOpenPositionDerivations';
import type { OpenPositionWithLive, RuntimeSnapshot } from './types';

export const resolveUsedMargin = (positions: BotRuntimePositionsResponse | null) =>
  (positions?.openItems ?? []).reduce((sum, position) => {
    const modeledMargin =
      Number.isFinite(position.leverage) && position.leverage > 0
        ? position.entryNotional / position.leverage
        : position.entryNotional;
    return sum + (position.marginUsed ?? modeledMargin);
  }, 0);

export const resolveDynamicTtpDisplay = (position: OpenPositionWithLive) =>
  position.ttpProtectedPercent ?? null;

export const resolveDynamicTslDisplay = (position: OpenPositionWithLive) => {
  if (resolveDynamicTtpDisplay(position) != null) return null;
  return position.tslProtectedPercent ?? null;
};

export const buildLiveOpenPositions = (
  positions: BotRuntimePositionsResponse | null,
  symbolStats: BotRuntimeSymbolStatsResponse | null,
  streamPrices: Map<string, number>
): OpenPositionWithLive[] =>
  buildRuntimeOpenPositionRows({ positions, symbolStats, streamPrices });

export const resolveUnrealized = (snapshot: RuntimeSnapshot | null) => {
  if (!snapshot) return 0;
  const liveOpen = buildLiveOpenPositions(snapshot.positions, snapshot.symbolStats, new Map<string, number>());
  if (liveOpen.length > 0) {
    return sumRuntimeOpenPositionUnrealized(liveOpen);
  }
  if (typeof snapshot.symbolStats?.summary.unrealizedPnl === 'number') {
    return snapshot.symbolStats.summary.unrealizedPnl;
  }
  return snapshot.positions?.summary.unrealizedPnl ?? 0;
};

export const maxDrawdown = (trades: BotRuntimeTrade[]) => {
  if (trades.length === 0) return { abs: 0, pct: null as number | null };
  const sorted = [...trades].sort((left, right) => toTimestamp(left.executedAt) - toTimestamp(right.executedAt));
  let running = 0;
  let peak = 0;
  let drawdown = 0;
  for (const trade of sorted) {
    running += trade.realizedPnl;
    peak = Math.max(peak, running);
    drawdown = Math.min(drawdown, running - peak);
  }
  const abs = Math.abs(drawdown);
  return { abs, pct: peak > 0 ? (abs / peak) * 100 : null };
};
