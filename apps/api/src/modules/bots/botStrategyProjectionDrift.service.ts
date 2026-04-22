import { prisma } from '../../prisma/client';
import { mapBotResponse } from './botResponseMapper.service';
import type { ListBotStrategyDriftQueryDto, RepairBotStrategyDriftDto } from './bots.types';

export type StrategyProjectionDriftItem = {
  botId: string;
  botName: string;
  projectedStrategyId: string | null;
  canonicalPrimaryStrategyId: string | null;
  canonicalPrimaryGroupId: string | null;
  canonicalPrimarySymbolGroupId: string | null;
  legacyEnabledStrategyId: string | null;
  hasProjectionDrift: boolean;
  hasLegacyCanonicalDivergence: boolean;
  repairable: boolean;
};

const toComparableTimestamp = (value: Date | null | undefined) =>
  value?.getTime() ?? Number.MAX_SAFE_INTEGER;

export const buildStrategyProjectionDriftItem = (bot: {
  id: string;
  name: string;
  botStrategies: Array<{
    id: string;
    strategyId: string;
    symbolGroupId: string;
    isEnabled: boolean;
    createdAt: Date;
  }>;
  botMarketGroups: Array<{
    id: string;
    symbolGroupId: string;
    lifecycleStatus: string;
    executionOrder: number;
    isEnabled: boolean;
    createdAt: Date;
    strategyLinks: Array<{
      strategyId: string;
      isEnabled: boolean;
      priority: number;
      createdAt: Date;
    }>;
  }>;
}): StrategyProjectionDriftItem => {
  const sortedGroups = [...bot.botMarketGroups].sort((left, right) => {
    const executionOrderDiff = left.executionOrder - right.executionOrder;
    if (executionOrderDiff !== 0) return executionOrderDiff;
    return toComparableTimestamp(left.createdAt) - toComparableTimestamp(right.createdAt);
  });
  const primaryGroup =
    sortedGroups.find((group) => group.isEnabled && group.lifecycleStatus === 'ACTIVE') ??
    sortedGroups[0] ??
    null;
  const primaryGroupStrategies = [...(primaryGroup?.strategyLinks ?? [])].sort((left, right) => {
    const priorityDiff = left.priority - right.priority;
    if (priorityDiff !== 0) return priorityDiff;
    return toComparableTimestamp(left.createdAt) - toComparableTimestamp(right.createdAt);
  });
  const primaryCanonicalStrategy =
    primaryGroupStrategies.find((strategy) => strategy.isEnabled) ??
    primaryGroupStrategies[0] ??
    null;
  const legacyEnabledStrategy =
    bot.botStrategies.find((item) => item.isEnabled) ??
    [...bot.botStrategies].sort(
      (left, right) => toComparableTimestamp(left.createdAt) - toComparableTimestamp(right.createdAt)
    )[0] ??
    null;
  const projectedStrategyId = mapBotResponse({
    ...bot,
    marketGroupStrategyLinks: sortedGroups.flatMap((group) =>
      group.strategyLinks.map((link) => ({
        strategyId: link.strategyId,
        isEnabled: link.isEnabled,
        priority: link.priority,
        createdAt: link.createdAt,
        botMarketGroup: {
          isEnabled: group.isEnabled,
          lifecycleStatus: group.lifecycleStatus,
          executionOrder: group.executionOrder,
          createdAt: group.createdAt,
        },
      }))
    ),
  }).strategyId;

  const canonicalPrimaryStrategyId = primaryCanonicalStrategy?.strategyId ?? null;
  const legacyEnabledStrategyId = legacyEnabledStrategy?.strategyId ?? null;
  const hasProjectionDrift =
    canonicalPrimaryStrategyId != null && projectedStrategyId !== canonicalPrimaryStrategyId;
  const hasLegacyCanonicalDivergence =
    canonicalPrimaryStrategyId != null &&
    legacyEnabledStrategyId != null &&
    canonicalPrimaryStrategyId !== legacyEnabledStrategyId;

  return {
    botId: bot.id,
    botName: bot.name,
    projectedStrategyId,
    canonicalPrimaryStrategyId,
    canonicalPrimaryGroupId: primaryGroup?.id ?? null,
    canonicalPrimarySymbolGroupId: primaryGroup?.symbolGroupId ?? null,
    legacyEnabledStrategyId,
    hasProjectionDrift,
    hasLegacyCanonicalDivergence,
    repairable: hasLegacyCanonicalDivergence && Boolean(primaryGroup?.symbolGroupId),
  };
};

export const listBotStrategyProjectionDrift = async (
  userId: string,
  query: ListBotStrategyDriftQueryDto = {}
) => {
  const bots = await prisma.bot.findMany({
    where: {
      userId,
      ...(query.botId ? { id: query.botId } : {}),
    },
    select: {
      id: true,
      name: true,
      botStrategies: {
        select: {
          id: true,
          strategyId: true,
          symbolGroupId: true,
          isEnabled: true,
          createdAt: true,
        },
        orderBy: [{ createdAt: 'asc' }, { id: 'asc' }],
      },
      botMarketGroups: {
        select: {
          id: true,
          symbolGroupId: true,
          lifecycleStatus: true,
          executionOrder: true,
          isEnabled: true,
          createdAt: true,
          strategyLinks: {
            select: {
              strategyId: true,
              isEnabled: true,
              priority: true,
              createdAt: true,
            },
            orderBy: [{ priority: 'asc' }, { createdAt: 'asc' }],
          },
        },
        orderBy: [{ executionOrder: 'asc' }, { createdAt: 'asc' }],
      },
    },
    orderBy: [{ createdAt: 'desc' }, { id: 'asc' }],
  });

  const allItems = bots.map(buildStrategyProjectionDriftItem);
  const driftItems = allItems.filter(
    (item) => item.hasProjectionDrift || item.hasLegacyCanonicalDivergence
  );

  return {
    totalBots: allItems.length,
    driftedBots: driftItems.length,
    items: driftItems,
  };
};

export const repairBotStrategyProjectionDrift = async (
  userId: string,
  payload: RepairBotStrategyDriftDto = {}
) => {
  const audit = await listBotStrategyProjectionDrift(userId, { botId: payload.botId });
  const targetItems = audit.items.filter((item) => item.repairable);

  const results: Array<{
    botId: string;
    status: 'repaired' | 'already_aligned' | 'skipped_not_repairable';
    canonicalPrimaryStrategyId: string | null;
    legacyEnabledStrategyId: string | null;
  }> = [];

  for (const item of audit.items) {
    if (!targetItems.some((target) => target.botId === item.botId)) {
      results.push({
        botId: item.botId,
        status: 'skipped_not_repairable',
        canonicalPrimaryStrategyId: item.canonicalPrimaryStrategyId,
        legacyEnabledStrategyId: item.legacyEnabledStrategyId,
      });
      continue;
    }

    const canonicalStrategyId = item.canonicalPrimaryStrategyId;
    const canonicalSymbolGroupId = item.canonicalPrimarySymbolGroupId;
    if (!canonicalStrategyId || !canonicalSymbolGroupId) {
      results.push({
        botId: item.botId,
        status: 'skipped_not_repairable',
        canonicalPrimaryStrategyId: item.canonicalPrimaryStrategyId,
        legacyEnabledStrategyId: item.legacyEnabledStrategyId,
      });
      continue;
    }

    const reconcileResult = await prisma.$transaction(async (tx) => {
      const rows = await tx.botStrategy.findMany({
        where: { botId: item.botId, bot: { userId } },
        select: {
          id: true,
          strategyId: true,
          symbolGroupId: true,
          isEnabled: true,
          createdAt: true,
        },
        orderBy: [{ createdAt: 'asc' }, { id: 'asc' }],
      });
      const canonicalRow = rows.find(
        (row) =>
          row.strategyId === canonicalStrategyId && row.symbolGroupId === canonicalSymbolGroupId
      );
      if (canonicalRow && rows.length === 1 && canonicalRow.isEnabled) {
        return { status: 'already_aligned' as const };
      }

      if (canonicalRow) {
        await tx.botStrategy.update({
          where: { id: canonicalRow.id },
          data: { isEnabled: true },
        });
        await tx.botStrategy.deleteMany({
          where: {
            botId: item.botId,
            id: { not: canonicalRow.id },
          },
        });
        return { status: 'repaired' as const };
      }

      await tx.botStrategy.deleteMany({
        where: { botId: item.botId },
      });
      await tx.botStrategy.create({
        data: {
          botId: item.botId,
          strategyId: canonicalStrategyId,
          symbolGroupId: canonicalSymbolGroupId,
          isEnabled: true,
        },
      });
      return { status: 'repaired' as const };
    });

    results.push({
      botId: item.botId,
      status: reconcileResult.status,
      canonicalPrimaryStrategyId: item.canonicalPrimaryStrategyId,
      legacyEnabledStrategyId: item.legacyEnabledStrategyId,
    });
  }

  return {
    requestedBotId: payload.botId ?? null,
    scannedDriftedBots: audit.items.length,
    repairedBots: results.filter((item) => item.status === 'repaired').length,
    alreadyAlignedBots: results.filter((item) => item.status === 'already_aligned').length,
    skippedBots: results.filter((item) => item.status === 'skipped_not_repairable').length,
    items: results,
  };
};
