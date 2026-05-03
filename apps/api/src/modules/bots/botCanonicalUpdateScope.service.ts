const toTimestamp = (value?: Date | string) => {
  if (!value) return Number.MAX_SAFE_INTEGER;
  const timestamp = Date.parse(String(value));
  return Number.isFinite(timestamp) ? timestamp : Number.MAX_SAFE_INTEGER;
};

export const resolveExistingCanonicalUpdateScope = (bot: {
  strategyId?: string | null;
  symbolGroupId?: string | null;
  botMarketGroups?: Array<{
    symbolGroupId: string;
    lifecycleStatus: string;
    executionOrder?: number;
    isEnabled: boolean;
    createdAt?: Date | string;
    strategyLinks?: Array<{
      strategyId: string;
      isEnabled: boolean;
      priority?: number;
      createdAt?: Date | string;
    }>;
  }>;
}) => {
  const canonicalGroups = [...(bot.botMarketGroups ?? [])].sort((left, right) => {
    const orderDiff =
      (left.executionOrder ?? Number.MAX_SAFE_INTEGER) -
      (right.executionOrder ?? Number.MAX_SAFE_INTEGER);
    if (orderDiff !== 0) return orderDiff;
    return toTimestamp(left.createdAt) - toTimestamp(right.createdAt);
  });
  const primaryGroup =
    canonicalGroups.find((group) => group.isEnabled && group.lifecycleStatus === 'ACTIVE') ??
    canonicalGroups[0] ??
    null;
  const sortedLinks = [...(primaryGroup?.strategyLinks ?? [])].sort((left, right) => {
    const priorityDiff =
      (left.priority ?? Number.MAX_SAFE_INTEGER) - (right.priority ?? Number.MAX_SAFE_INTEGER);
    if (priorityDiff !== 0) return priorityDiff;
    return toTimestamp(left.createdAt) - toTimestamp(right.createdAt);
  });
  const enabledStrategyIds = sortedLinks.filter((link) => link.isEnabled).map((link) => link.strategyId);
  const primaryStrategyId = enabledStrategyIds[0] ?? null;
  const hasCanonicalScope = primaryGroup != null;

  return {
    hasCanonicalScope,
    symbolGroupId: primaryGroup?.symbolGroupId ?? bot.symbolGroupId ?? null,
    primaryStrategyId: hasCanonicalScope ? primaryStrategyId : bot.strategyId ?? null,
    enabledStrategyIds:
      hasCanonicalScope
        ? enabledStrategyIds
        : bot.strategyId
          ? [bot.strategyId]
          : [],
  };
};
