type DirectBotProjection = {
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
  botMarketGroups?: Array<{
    symbolGroupId: string;
    lifecycleStatus: string;
    executionOrder?: number;
    isEnabled: boolean;
    createdAt?: Date | string;
    symbolGroup: NonNullable<DirectBotProjection['symbolGroup']>;
    strategyLinks: Array<{
      strategyId: string;
      isEnabled: boolean;
      priority?: number;
      createdAt?: Date | string;
      strategy: NonNullable<DirectBotProjection['strategy']>;
    }>;
  }>;
};

const toTimestamp = (value?: Date | string) => {
  if (!value) return Number.MAX_SAFE_INTEGER;
  const timestamp = Date.parse(String(value));
  return Number.isFinite(timestamp) ? timestamp : Number.MAX_SAFE_INTEGER;
};

const resolveCanonicalBotResponseContext = (bot: Partial<DirectBotProjection>) => {
  const groups = [...(bot.botMarketGroups ?? [])].sort((left, right) => {
    const orderDiff =
      (left.executionOrder ?? Number.MAX_SAFE_INTEGER) -
      (right.executionOrder ?? Number.MAX_SAFE_INTEGER);
    if (orderDiff !== 0) return orderDiff;
    return toTimestamp(left.createdAt) - toTimestamp(right.createdAt);
  });
  const primaryGroup =
    groups.find((group) => group.isEnabled && group.lifecycleStatus === 'ACTIVE') ??
    groups[0] ??
    null;
  const strategyLinks = [...(primaryGroup?.strategyLinks ?? [])].sort((left, right) => {
    const priorityDiff =
      (left.priority ?? Number.MAX_SAFE_INTEGER) - (right.priority ?? Number.MAX_SAFE_INTEGER);
    if (priorityDiff !== 0) return priorityDiff;
    return toTimestamp(left.createdAt) - toTimestamp(right.createdAt);
  });
  const primaryStrategy = strategyLinks.find((strategy) => strategy.isEnabled) ?? strategyLinks[0] ?? null;

  return {
    strategyId: primaryStrategy?.strategyId ?? null,
    symbolGroupId: primaryGroup?.symbolGroupId ?? null,
    strategy: primaryStrategy?.strategy ?? null,
    symbolGroup: primaryGroup?.symbolGroup ?? null,
  };
};

export const mapBotResponse = <T extends object>(bot: T & Partial<DirectBotProjection>) => {
  const { botMarketGroups: _botMarketGroups, ...response } = bot;
  const canonicalContext = resolveCanonicalBotResponseContext(bot);

  return {
    ...response,
    strategyId: canonicalContext.strategyId ?? bot.strategyId ?? null,
    symbolGroupId: canonicalContext.symbolGroupId ?? bot.symbolGroupId ?? null,
    strategy: canonicalContext.strategy ?? bot.strategy ?? null,
    symbolGroup: canonicalContext.symbolGroup ?? bot.symbolGroup ?? null,
  };
};

export const resolveLegacyPrimaryBotContext = (bot: {
  botStrategies: Array<{
    strategyId: string;
    symbolGroupId: string;
    isEnabled: boolean;
    createdAt?: Date | string;
  }>;
  botMarketGroups: Array<{
    symbolGroupId: string;
    isEnabled: boolean;
    lifecycleStatus: string;
    executionOrder?: number;
    createdAt?: Date | string;
    strategyLinks?: Array<{
      strategyId: string;
      isEnabled: boolean;
      priority?: number;
      createdAt?: Date | string;
    }>;
  }>;
}) => {
  const activeGroups = [...bot.botMarketGroups]
    .filter((group) => group.isEnabled && group.lifecycleStatus === 'ACTIVE')
    .sort((left, right) => {
      const orderDiff =
        (left.executionOrder ?? Number.MAX_SAFE_INTEGER) -
        (right.executionOrder ?? Number.MAX_SAFE_INTEGER);
      if (orderDiff !== 0) return orderDiff;
      return toTimestamp(left.createdAt) - toTimestamp(right.createdAt);
    });

  const fallbackGroups = activeGroups.length > 0
    ? activeGroups
    : [...bot.botMarketGroups].sort((left, right) => {
        const orderDiff =
          (left.executionOrder ?? Number.MAX_SAFE_INTEGER) -
          (right.executionOrder ?? Number.MAX_SAFE_INTEGER);
        if (orderDiff !== 0) return orderDiff;
        return toTimestamp(left.createdAt) - toTimestamp(right.createdAt);
      });

  const primaryGroup = fallbackGroups[0] ?? null;
  const primaryStrategy =
    [...(primaryGroup?.strategyLinks ?? [])]
      .sort((left, right) => {
        const priorityDiff =
          (left.priority ?? Number.MAX_SAFE_INTEGER) - (right.priority ?? Number.MAX_SAFE_INTEGER);
        if (priorityDiff !== 0) return priorityDiff;
        return toTimestamp(left.createdAt) - toTimestamp(right.createdAt);
      })
      .find((strategy) => strategy.isEnabled) ??
    [...(primaryGroup?.strategyLinks ?? [])]
      .sort((left, right) => {
        const priorityDiff =
          (left.priority ?? Number.MAX_SAFE_INTEGER) - (right.priority ?? Number.MAX_SAFE_INTEGER);
        if (priorityDiff !== 0) return priorityDiff;
        return toTimestamp(left.createdAt) - toTimestamp(right.createdAt);
      })[0] ??
    null;

  const legacyStrategy =
    bot.botStrategies.find((item) => item.isEnabled) ??
    [...bot.botStrategies].sort((left, right) => toTimestamp(left.createdAt) - toTimestamp(right.createdAt))[0] ??
    null;

  return {
    strategyId: primaryStrategy?.strategyId ?? legacyStrategy?.strategyId ?? null,
    symbolGroupId: primaryGroup?.symbolGroupId ?? legacyStrategy?.symbolGroupId ?? null,
  };
};
