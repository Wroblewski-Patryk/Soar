export const mapBotResponse = <
  T extends {
    strategyId?: string | null;
    symbolGroupId?: string | null;
    strategy?: {
      id: string;
      name: string;
      interval: string;
      leverage: number;
      walletRisk: number;
    } | null;
    symbolGroup?: {
      id: string;
      name: string;
      symbols: string[];
      marketUniverseId: string;
      marketUniverse?: {
        id: string;
        name: string;
        exchange: string;
        marketType: string;
        baseCurrency: string;
      } | null;
    } | null;
    botStrategies: Array<{
      strategyId: string;
      symbolGroupId?: string;
      isEnabled: boolean;
      createdAt?: Date | string;
    }>;
    botMarketGroups?: Array<{
      symbolGroupId: string;
      isEnabled: boolean;
      lifecycleStatus: string;
      executionOrder?: number;
      createdAt?: Date | string;
    }>;
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
  const {
    botStrategies,
    botMarketGroups = [],
    marketGroupStrategyLinks = [],
    strategyId: directStrategyId,
    symbolGroupId: directSymbolGroupId,
    strategy,
    symbolGroup,
    ...rest
  } = bot;
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

  const activeCanonicalGroups = botMarketGroups
    .filter((group) => group.isEnabled && group.lifecycleStatus === 'ACTIVE')
    .sort((left, right) => {
      const orderDiff =
        (left.executionOrder ?? Number.MAX_SAFE_INTEGER) -
        (right.executionOrder ?? Number.MAX_SAFE_INTEGER);
      if (orderDiff !== 0) return orderDiff;
      return toTimestamp(left.createdAt) - toTimestamp(right.createdAt);
    });
  const canonicalGroup =
    activeCanonicalGroups[0] ??
    [...botMarketGroups].sort((left, right) => {
      const orderDiff =
        (left.executionOrder ?? Number.MAX_SAFE_INTEGER) -
        (right.executionOrder ?? Number.MAX_SAFE_INTEGER);
      if (orderDiff !== 0) return orderDiff;
      return toTimestamp(left.createdAt) - toTimestamp(right.createdAt);
    })[0] ??
    null;

  const legacySymbolGroup =
    botStrategies.find((item) => item.isEnabled) ??
    [...botStrategies].sort((left, right) => toTimestamp(left.createdAt) - toTimestamp(right.createdAt))[0] ??
    null;

  const resolvedStrategyId = directStrategyId ?? canonicalStrategy?.strategyId ?? legacyStrategy?.strategyId ?? null;
  const resolvedSymbolGroupId =
    directSymbolGroupId ?? canonicalGroup?.symbolGroupId ?? legacySymbolGroup?.symbolGroupId ?? null;

  return {
    ...rest,
    strategyId: resolvedStrategyId,
    symbolGroupId: resolvedSymbolGroupId,
    strategy: strategy ?? null,
    symbolGroup: symbolGroup ?? null,
  };
};
