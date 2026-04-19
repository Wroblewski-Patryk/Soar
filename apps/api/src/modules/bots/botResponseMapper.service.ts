export const mapBotResponse = <
  T extends {
    botStrategies: Array<{ strategyId: string; isEnabled: boolean; createdAt?: Date | string }>;
    marketGroupStrategyLinks?: Array<{
      strategyId: string;
      isEnabled: boolean;
      priority?: number;
      createdAt?: Date | string;
      botMarketGroup?: {
        isEnabled: boolean;
        lifecycleStatus: string;
        executionOrder: number;
        createdAt?: Date | string;
      } | null;
    }>;
  },
>(
  bot: T
) => {
  const { botStrategies, marketGroupStrategyLinks = [], ...rest } = bot;
  const toTimestamp = (value?: Date | string) => {
    if (!value) return Number.MAX_SAFE_INTEGER;
    const timestamp = Date.parse(String(value));
    return Number.isFinite(timestamp) ? timestamp : Number.MAX_SAFE_INTEGER;
  };

  const sortCanonicalLinks = (
    left: {
      priority?: number;
      createdAt?: Date | string;
      botMarketGroup?: { executionOrder: number; createdAt?: Date | string } | null;
    },
    right: {
      priority?: number;
      createdAt?: Date | string;
      botMarketGroup?: { executionOrder: number; createdAt?: Date | string } | null;
    }
  ) => {
    const groupOrderDiff =
      (left.botMarketGroup?.executionOrder ?? Number.MAX_SAFE_INTEGER) -
      (right.botMarketGroup?.executionOrder ?? Number.MAX_SAFE_INTEGER);
    if (groupOrderDiff !== 0) return groupOrderDiff;

    const groupCreatedAtDiff =
      toTimestamp(left.botMarketGroup?.createdAt) - toTimestamp(right.botMarketGroup?.createdAt);
    if (groupCreatedAtDiff !== 0) return groupCreatedAtDiff;

    const priorityDiff = (left.priority ?? Number.MAX_SAFE_INTEGER) - (right.priority ?? Number.MAX_SAFE_INTEGER);
    if (priorityDiff !== 0) return priorityDiff;

    return toTimestamp(left.createdAt) - toTimestamp(right.createdAt);
  };

  const activeCanonicalLinks = marketGroupStrategyLinks
    .filter(
      (item) =>
        item.botMarketGroup?.isEnabled === true &&
        item.botMarketGroup.lifecycleStatus === 'ACTIVE'
    )
    .sort(sortCanonicalLinks);

  const activeCanonicalStrategy =
    activeCanonicalLinks.find((item) => item.isEnabled) ?? activeCanonicalLinks[0] ?? null;

  const canonicalStrategy =
    activeCanonicalStrategy ??
    [...marketGroupStrategyLinks].sort(sortCanonicalLinks).find((item) => item.isEnabled) ??
    [...marketGroupStrategyLinks].sort(sortCanonicalLinks)[0] ??
    null;

  const legacyStrategy =
    botStrategies.find((item) => item.isEnabled) ??
    [...botStrategies].sort((left, right) => toTimestamp(left.createdAt) - toTimestamp(right.createdAt))[0] ??
    null;

  const resolvedStrategy = canonicalStrategy ?? legacyStrategy;

  return {
    ...rest,
    strategyId: resolvedStrategy?.strategyId ?? null,
  };
};
