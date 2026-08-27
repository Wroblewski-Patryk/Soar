import { WalletCashflowSource } from '@prisma/client';
import { prisma } from '../../prisma/client';
import { getOwnedBotWithStrategyProjection } from './bots.repository';
import { getBotRuntimeMonitoringAggregate } from './runtimeMonitoringAggregateRead.service';
import { resolveEffectiveSymbolGroupSymbolsWithCatalog } from './runtimeSymbolCatalogResolver.service';
import { normalizeSymbols } from './runtimeSymbolUniverse.service';

const liveMarkerSources = new Set<WalletCashflowSource>([
  WalletCashflowSource.DEPOSIT,
  WalletCashflowSource.WITHDRAWAL,
  WalletCashflowSource.TRANSFER_IN,
  WalletCashflowSource.TRANSFER_OUT,
]);

const toIsoString = (value: Date | string | null | undefined) => {
  if (!value) return null;
  if (value instanceof Date) return value.toISOString();
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString();
};

const toDate = (value: Date | string | null | undefined) => {
  if (!value) return null;
  if (value instanceof Date) return value;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

export const getBotPortfolioHistory = async (userId: string, botId: string) => {
  const bot = await getOwnedBotWithStrategyProjection({ userId, botId });
  if (!bot) return null;

  const aggregate = await getBotRuntimeMonitoringAggregate(userId, botId, {
    sessionsLimit: 50,
    perSessionLimit: 500,
  });
  const latestWalletSnapshot =
    bot.walletId == null
      ? null
      : await prisma.walletBalanceSnapshot.findFirst({
          where: {
            userId,
            walletId: bot.walletId,
          },
          orderBy: { fetchedAt: 'desc' },
        });

  const startedAt = toDate(aggregate?.sessionDetail.startedAt) ?? bot.createdAt;
  const finishedAt = toDate(aggregate?.positions.window.finishedAt) ?? new Date();
  const aggregateReferenceBalance =
    typeof aggregate?.positions.summary.referenceBalance === 'number' &&
    Number.isFinite(aggregate.positions.summary.referenceBalance)
      ? aggregate.positions.summary.referenceBalance
      : null;
  const referenceBalance =
    aggregateReferenceBalance != null && (aggregateReferenceBalance > 0 || bot.mode === 'PAPER')
      ? aggregateReferenceBalance
      : bot.mode === 'LIVE' && latestWalletSnapshot
        ? latestWalletSnapshot.allocatedBalance
        : aggregateReferenceBalance;
  const realizedPnl =
    typeof aggregate?.positions.summary.realizedPnl === 'number' &&
    Number.isFinite(aggregate.positions.summary.realizedPnl)
      ? aggregate.positions.summary.realizedPnl
      : 0;
  const unrealizedPnl =
    typeof aggregate?.positions.summary.unrealizedPnl === 'number' &&
    Number.isFinite(aggregate.positions.summary.unrealizedPnl)
      ? aggregate.positions.summary.unrealizedPnl
      : 0;
  const startBalance = referenceBalance != null ? Math.max(0, referenceBalance - realizedPnl) : null;
  const configuredSymbolGroup =
    bot.botMarketGroups.find((link) => link.isEnabled && link.lifecycleStatus === 'ACTIVE')?.symbolGroup ??
    bot.symbolGroup ??
    null;
  const scopedSymbols = normalizeSymbols(
    configuredSymbolGroup
      ? await resolveEffectiveSymbolGroupSymbolsWithCatalog(configuredSymbolGroup, new Map<string, string[]>())
      : []
  );
  const historyItems = await prisma.position.findMany({
    where: {
      userId,
      managementMode: 'BOT_MANAGED',
      status: 'CLOSED',
      syncState: 'IN_SYNC',
      closedAt: {
        gte: startedAt,
        lte: finishedAt,
      },
      ...(scopedSymbols.length > 0 ? { symbol: { in: scopedSymbols } } : {}),
      OR: [
        { botId: bot.id },
        ...(bot.mode === 'LIVE' && bot.walletId
          ? [
              {
                botId: null,
                walletId: bot.walletId,
              },
            ]
          : []),
      ],
    },
    orderBy: [{ closedAt: 'asc' }, { id: 'asc' }],
    select: {
      id: true,
      symbol: true,
      realizedPnl: true,
      closedAt: true,
      closeReason: true,
    },
  });
  const sortedHistoryItems = [...historyItems].sort((left, right) => {
    const leftTs = toDate(left.closedAt)?.getTime() ?? 0;
    const rightTs = toDate(right.closedAt)?.getTime() ?? 0;
    if (leftTs !== rightTs) return leftTs - rightTs;
    return left.id.localeCompare(right.id);
  });
  const pendingFeeTrade = await prisma.trade.findFirst({
    where: {
      userId,
      feePending: true,
      executedAt: {
        gte: startedAt,
        lte: finishedAt,
      },
      ...(scopedSymbols.length > 0 ? { symbol: { in: scopedSymbols } } : {}),
      OR: [
        { botId: bot.id },
        ...(bot.mode === 'LIVE' && bot.walletId
          ? [
              {
                botId: null,
                walletId: bot.walletId,
              },
            ]
          : []),
      ],
    },
    select: { id: true },
  });

  let cumulativeRealizedPnl = 0;
  const points =
    startBalance == null
      ? []
      : [
          {
            timestamp: startedAt.toISOString(),
            balance: startBalance,
            realizedPnl: 0,
            type: 'START' as const,
            label: 'Lifecycle start',
            symbol: null,
          },
          ...sortedHistoryItems.map((item) => {
            cumulativeRealizedPnl += item.realizedPnl ?? 0;
            return {
              timestamp: toIsoString(item.closedAt) ?? finishedAt.toISOString(),
              balance: Math.max(0, startBalance + cumulativeRealizedPnl),
              realizedPnl: cumulativeRealizedPnl,
              type: 'CLOSE' as const,
              label: item.closeReason ?? 'CLOSE',
              symbol: item.symbol,
            };
          }),
          {
            timestamp: finishedAt.toISOString(),
            balance: referenceBalance,
            realizedPnl,
            type: 'CURRENT' as const,
            label: 'Current',
            symbol: null,
          },
        ];

  const markers =
    bot.mode === 'LIVE' && bot.walletId
      ? (
          await prisma.walletCashflowEvent.findMany({
            where: {
              userId,
              walletId: bot.walletId,
              source: { in: [...liveMarkerSources] },
              occurredAt: {
                gte: startedAt,
                lte: finishedAt,
              },
            },
            orderBy: [{ occurredAt: 'asc' }, { id: 'asc' }],
          })
        ).map((event) => ({
          id: event.id,
          timestamp: event.occurredAt.toISOString(),
          type: event.source,
          label: event.source,
          amount: event.amount,
          currency: event.currency,
          direction: event.direction,
        }))
      : bot.wallet?.paperResetAt && bot.wallet.paperResetAt >= startedAt && bot.wallet.paperResetAt <= finishedAt
        ? [
            {
              id: `paper-reset:${bot.walletId ?? bot.id}`,
              timestamp: bot.wallet.paperResetAt.toISOString(),
              type: 'PAPER_RESET',
              label: 'PAPER_RESET',
              amount: null,
              currency: bot.wallet.baseCurrency,
              direction: null,
            },
          ]
        : [];

  const completenessReasons: string[] = [];
  let completeness: 'COMPLETE' | 'PARTIAL' | 'UNAVAILABLE' = 'COMPLETE';
  if (referenceBalance == null) {
    completeness = 'UNAVAILABLE';
    completenessReasons.push('NO_RUNTIME_CAPITAL_SNAPSHOT');
  } else {
    if ((aggregate?.positions.openCount ?? 0) > 0 || Math.abs(unrealizedPnl) > 0) {
      completeness = 'PARTIAL';
      completenessReasons.push('OPEN_PNL_LATEST_ONLY');
    }
    if (pendingFeeTrade) {
      completeness = 'PARTIAL';
      completenessReasons.push('FEE_RECONCILIATION_PENDING');
    }
  }

  return {
    botId: bot.id,
    walletId: bot.walletId,
    mode: bot.mode,
    baseCurrency: bot.wallet?.baseCurrency ?? null,
    completeness,
    completenessReasons,
    window: {
      startedAt: startedAt.toISOString(),
      finishedAt: finishedAt.toISOString(),
    },
    summary: {
      startBalance,
      currentBalance: referenceBalance,
      realizedPnl,
      unrealizedPnl,
      totalPnl: realizedPnl + unrealizedPnl,
      capitalSource:
        aggregate?.positions.summary.capitalSource ??
        (bot.mode === 'LIVE' && latestWalletSnapshot ? 'LIVE_EXCHANGE_BALANCE' : null),
      paperResetAt: toIsoString(bot.wallet?.paperResetAt),
      openPositionCount: aggregate?.positions.openCount ?? 0,
      closedPositionCount: aggregate?.positions.closedCount ?? 0,
    },
    points,
    markers,
  };
};
