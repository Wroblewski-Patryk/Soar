import { prisma } from '../../prisma/client';
import { Exchange, SignalDirection } from '@prisma/client';
import { CandlePatternParams } from './sharedCandlePatternSeries';
import { computeRiskBasedOrderQuantity, normalizeWalletRiskPercent } from './positionSizing';
import { supportsExchangeCapability } from '../exchange/exchangeCapabilities';
import {
  countOpenPositionsForBotAndSymbolsRaw,
  createRuntimeSignalRecord,
  listActiveRuntimeBotsRaw,
  listRuntimeManagedExternalPositionsRaw,
} from './runtimeSignalLoop.repository';
import { normalizeSymbols } from '../../lib/symbols';
import { resolveEffectiveSymbolGroupSymbolsWithCatalog } from '../bots/runtimeSymbolCatalogResolver.service';
import {
  getExternalPositionOwnership,
  listOwnedExternalSymbolsForBot,
  resolveExternalPositionOwnershipIndex,
} from '../bots/runtimeExternalPositionOwner.service';
import {
  buildImportedExternalPositionMarketPrefix,
  buildLegacyImportedExternalPositionSymbolPrefix,
  parseImportedExternalPositionId,
} from '../positions/livePositionReconciliation.helpers';
import {
  resolveCanonicalRuntimeVenueContext,
  resolveInheritedRuntimeExecutionContext,
} from './runtimeBotExecutionContext';

export type ActiveBotStrategy = {
  strategyId: string;
  strategyInterval: string | null;
  strategyConfig: Record<string, unknown> | null;
  strategyLeverage: number;
  walletRisk: number;
  priority?: number;
  weight?: number;
  marketGroupStrategyLinkId?: string;
};

export type ActiveBotRuntimeContext = {
  symbolGroupId: string;
  strategyId: string;
  maxOpenPositions: number;
  symbols: string[];
  strategy: ActiveBotStrategy;
  strategies?: ActiveBotStrategy[];
};

export type ActiveBot = {
  id: string;
  userId: string;
  walletId: string | null;
  mode: 'PAPER' | 'LIVE';
  exchange: Exchange;
  paperStartBalance: number;
  marketType: 'FUTURES' | 'SPOT';
  runtimeContext: ActiveBotRuntimeContext | null;
};

type InheritedExecutionContext = Pick<ActiveBot, 'mode' | 'exchange' | 'marketType' | 'paperStartBalance'>;

const resolveInheritedExecutionContext = (
  bot: Awaited<ReturnType<typeof listActiveRuntimeBotsRaw>>[number]
): InheritedExecutionContext | null => {
  const resolved = resolveInheritedRuntimeExecutionContext({
    walletId: bot.walletId,
    wallet: bot.wallet,
    venueContext: resolveCanonicalRuntimeVenueContext(bot),
  });
  if (!resolved) return null;
  return resolved;
};

const toPositiveInteger = (value: unknown): number | null => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) return null;
  return Math.trunc(parsed);
};

const extractStrategyMaxOpenPositions = (
  strategyConfig: Record<string, unknown> | null | undefined
) => {
  if (!strategyConfig || typeof strategyConfig !== 'object') return null;
  const additional =
    strategyConfig.additional && typeof strategyConfig.additional === 'object'
      ? (strategyConfig.additional as Record<string, unknown>)
      : null;
  if (!additional) return null;
  return toPositiveInteger(additional.maxPositions ?? additional.maxOpenPositions);
};

export const deriveRuntimeGroupMaxOpenPositions = (input: {
  configuredGroupMaxOpenPositions: number;
  strategies: Array<{ strategyConfig: Record<string, unknown> | null }>;
}) => {
  const strategyCaps = input.strategies
    .map((strategy) => extractStrategyMaxOpenPositions(strategy.strategyConfig))
    .filter((value): value is number => Number.isFinite(value as number) && (value as number) > 0);

  if (strategyCaps.length > 0) {
    return Math.max(1, Math.min(...strategyCaps));
  }

  return toPositiveInteger(input.configuredGroupMaxOpenPositions) ?? 1;
};

export const supportsRuntimeSignalLoopExchange = (bot: Pick<ActiveBot, 'exchange' | 'mode'>) =>
  supportsExchangeCapability(
    bot.exchange,
    bot.mode === 'LIVE' ? 'LIVE_EXECUTION' : 'PAPER_PRICING_FEED'
  );

export const listActiveRuntimeBots = async (): Promise<ActiveBot[]> => {
  const bots = await listActiveRuntimeBotsRaw();
  const inheritedBots = bots
    .map((bot) => {
      const executionContext = resolveInheritedExecutionContext(bot);
      if (!executionContext) return null;
      return {
        raw: bot,
        executionContext,
      };
    })
    .filter(
      (
        bot
      ): bot is {
        raw: Awaited<ReturnType<typeof listActiveRuntimeBotsRaw>>[number];
        executionContext: InheritedExecutionContext;
      } => bot !== null
    );
  const activeBots = inheritedBots.filter(
    ({ raw, executionContext }) =>
      (executionContext.mode !== 'LIVE' || raw.liveOptIn) &&
      supportsRuntimeSignalLoopExchange(executionContext)
  );
  const catalogSymbolsCache = new Map<string, string[]>();

  return Promise.all(
    activeBots.map(async ({ raw: bot, executionContext }) => {
      const canonicalGroup = (bot.botMarketGroups ?? [])[0] ?? null;
      const canonicalStrategies = (canonicalGroup?.strategyLinks ?? []).map((link) => ({
        strategyId: link.strategyId,
        strategyInterval: link.strategy.interval,
        strategyConfig: (link.strategy.config as Record<string, unknown> | undefined) ?? null,
        strategyLeverage: link.strategy.leverage,
        walletRisk: normalizeWalletRiskPercent(link.strategy.walletRisk, 1),
        priority: link.priority,
        weight: link.weight,
        marketGroupStrategyLinkId: link.id,
      } satisfies ActiveBotStrategy));
      const directRuntimeStrategy =
        !canonicalGroup && bot.strategy && bot.strategyId
          ? ({
              strategyId: bot.strategyId,
              strategyInterval: bot.strategy.interval,
              strategyConfig: (bot.strategy.config as Record<string, unknown> | undefined) ?? null,
              strategyLeverage: bot.strategy.leverage,
              walletRisk: normalizeWalletRiskPercent(bot.strategy.walletRisk, 1),
              priority: 100,
              weight: 1,
            } satisfies ActiveBotStrategy)
          : null;
      const runtimeStrategies =
        canonicalStrategies.length > 0
          ? canonicalStrategies
          : directRuntimeStrategy
            ? [directRuntimeStrategy]
            : [];
      const runtimeSymbolGroup = canonicalGroup?.symbolGroup ?? bot.symbolGroup ?? null;
      const runtimeSymbolGroupId = canonicalGroup?.symbolGroupId ?? bot.symbolGroupId ?? null;
      const runtimeSymbols = runtimeSymbolGroup
        ? await resolveEffectiveSymbolGroupSymbolsWithCatalog(runtimeSymbolGroup, catalogSymbolsCache)
        : [];
      const primaryRuntimeStrategy = runtimeStrategies[0] ?? null;
      const runtimeContext =
        primaryRuntimeStrategy && runtimeSymbolGroupId
          ? ({
              symbolGroupId: runtimeSymbolGroupId,
              strategyId: primaryRuntimeStrategy.strategyId,
              maxOpenPositions: deriveRuntimeGroupMaxOpenPositions({
                configuredGroupMaxOpenPositions: canonicalGroup?.maxOpenPositions ?? bot.maxOpenPositions,
                strategies: runtimeStrategies.map((strategy) => ({
                  strategyConfig: strategy.strategyConfig,
                })),
              }),
              symbols: runtimeSymbols,
              strategy: primaryRuntimeStrategy,
              strategies: runtimeStrategies,
            } satisfies ActiveBotRuntimeContext)
          : null;

      return {
        id: bot.id,
        userId: bot.userId,
        walletId: bot.walletId ?? null,
        mode: executionContext.mode,
        exchange: executionContext.exchange,
        paperStartBalance: executionContext.paperStartBalance,
        marketType: executionContext.marketType,
        runtimeContext,
      };
    })
  );
};

export const listRuntimeManagedExternalPositions = async () => {
  const positions = await listRuntimeManagedExternalPositionsRaw();
  const ownershipIndexByUserId = new Map<
    string,
    Awaited<ReturnType<typeof resolveExternalPositionOwnershipIndex>>
  >();

  return Promise.all(
    positions.map(async (position) => {
      if (position.botId) {
        return {
          userId: position.userId,
          botId: position.botId,
          walletId: position.walletId,
          symbol: position.symbol,
        };
      }

      const externalPositionId = parseImportedExternalPositionId(position.externalId);
      const apiKeyId = externalPositionId?.apiKeyId ?? null;
      let ownershipIndex = ownershipIndexByUserId.get(position.userId);
      if (!ownershipIndex) {
        ownershipIndex = await resolveExternalPositionOwnershipIndex(position.userId, 'LIVE');
        ownershipIndexByUserId.set(position.userId, ownershipIndex);
      }
      const ownership = getExternalPositionOwnership(ownershipIndex, {
        apiKeyId,
        marketType: externalPositionId?.marketType ?? position.wallet?.marketType ?? 'FUTURES',
        symbol: position.symbol,
      });

      return {
        userId: position.userId,
        botId: ownership.status === 'OWNED' ? ownership.botId : null,
        walletId: ownership.status === 'OWNED' ? ownership.walletId : position.walletId,
        symbol: position.symbol,
      };
    })
  );
};

export const countOpenPositionsForBotAndSymbols = async ({
  userId,
  botId,
  symbols,
}: {
  userId: string;
  botId: string;
  symbols: string[];
}) => {
  const normalizedSymbols = normalizeSymbols(symbols);
  const directCount = await countOpenPositionsForBotAndSymbolsRaw({
    userId,
    botId,
    normalizedSymbols,
  });

  const botScope = await prisma.bot.findUnique({
    where: { id: botId },
    select: {
      mode: true,
      walletId: true,
      apiKeyId: true,
      wallet: {
        select: {
          apiKeyId: true,
          marketType: true,
        },
      },
    },
  });
  const effectiveApiKeyId = botScope?.wallet?.apiKeyId ?? botScope?.apiKeyId ?? null;
  if (
    !botScope ||
    botScope.mode !== 'LIVE' ||
    !botScope.walletId ||
    !effectiveApiKeyId
  ) {
    return directCount;
  }

  const ownershipIndex = await resolveExternalPositionOwnershipIndex(userId, 'LIVE');
  const ownedExternalSymbols = listOwnedExternalSymbolsForBot(ownershipIndex, {
    apiKeyId: effectiveApiKeyId,
    marketType: botScope.wallet?.marketType ?? 'FUTURES',
    botId,
    walletId: botScope.walletId,
  });
  const scopedOwnedExternalSymbols =
    normalizedSymbols.length > 0
      ? ownedExternalSymbols.filter((symbol) => normalizedSymbols.includes(symbol))
      : ownedExternalSymbols;
  if (scopedOwnedExternalSymbols.length === 0) {
    return directCount;
  }

  const externalCount = await prisma.position.count({
    where: {
      userId,
      botId: null,
      status: 'OPEN',
      origin: 'EXCHANGE_SYNC',
      managementMode: 'BOT_MANAGED',
      symbol: {
        in: scopedOwnedExternalSymbols,
      },
      AND: [
        {
          OR: [
            { externalId: { startsWith: buildImportedExternalPositionMarketPrefix({ apiKeyId: effectiveApiKeyId, marketType: botScope.wallet?.marketType ?? 'FUTURES' }) } },
            ...scopedOwnedExternalSymbols.map((symbol) => ({
              externalId: { startsWith: buildLegacyImportedExternalPositionSymbolPrefix({ apiKeyId: effectiveApiKeyId, symbol }) },
            })),
          ],
        },
        { OR: [{ walletId: botScope.walletId }, { walletId: null }] },
      ],
    },
  });

  return directCount + externalCount;
};

export const createRuntimeSignal = async (params: {
  userId: string;
  botId?: string;
  strategyId?: string;
  symbol: string;
  timeframe: string;
  direction: SignalDirection;
  confidence: number;
  payload: Record<string, unknown>;
}) => {
  await createRuntimeSignalRecord(params);
};

export const resolveRuntimeOrderQuantity = (input: {
  strategy: ActiveBotStrategy | undefined;
  price: number;
  marketType: 'FUTURES' | 'SPOT';
  referenceBalance: number;
  runtimeSignalQuantity: number;
}) => {
  const strategy = input.strategy;
  if (!strategy) return input.runtimeSignalQuantity;
  return computeRiskBasedOrderQuantity({
    price: input.price,
    walletRiskPercent: strategy.walletRisk,
    referenceBalance: input.referenceBalance,
    leverage: input.marketType === 'SPOT' ? 1 : Math.max(1, strategy.strategyLeverage),
    minQuantity: input.runtimeSignalQuantity,
  });
};

export const normalizeInterval = (value?: string | null) => {
  if (!value) return '1m';
  const normalized = value.trim().toLowerCase();
  const aliases: Record<string, string> = {
    '1 min': '1m',
    '3 min': '3m',
    '5 min': '5m',
    '10 min': '10m',
    '15 min': '15m',
    '30 min': '30m',
    '60 min': '1h',
  };
  return aliases[normalized] ?? normalized;
};

export const formatIndicatorValue = (value: number | null | undefined) => {
  if (value == null || !Number.isFinite(value)) return 'X';
  return Number(value.toFixed(4)).toString();
};

export const formatRuleTarget = (value: number) => Number(value.toFixed(6)).toString();

export const resolvePatternParams = (params: Record<string, unknown>): CandlePatternParams => {
  const asFinite = (value: unknown) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  };

  const dojiBodyToRangeMax = asFinite(params.dojiBodyToRangeMax ?? params.bodyToRangeMax);
  const hammerBodyToRangeMax = asFinite(params.hammerBodyToRangeMax);
  const hammerLowerShadowToBodyMin = asFinite(params.hammerLowerShadowToBodyMin);
  const hammerUpperShadowToBodyMax = asFinite(params.hammerUpperShadowToBodyMax);
  const shootingStarBodyToRangeMax = asFinite(params.shootingStarBodyToRangeMax);
  const shootingStarUpperShadowToBodyMin = asFinite(params.shootingStarUpperShadowToBodyMin);
  const shootingStarLowerShadowToBodyMax = asFinite(params.shootingStarLowerShadowToBodyMax);

  return {
    ...(dojiBodyToRangeMax !== null ? { dojiBodyToRangeMax } : {}),
    ...(hammerBodyToRangeMax !== null ? { hammerBodyToRangeMax } : {}),
    ...(hammerLowerShadowToBodyMin !== null ? { hammerLowerShadowToBodyMin } : {}),
    ...(hammerUpperShadowToBodyMax !== null ? { hammerUpperShadowToBodyMax } : {}),
    ...(shootingStarBodyToRangeMax !== null ? { shootingStarBodyToRangeMax } : {}),
    ...(shootingStarUpperShadowToBodyMin !== null ? { shootingStarUpperShadowToBodyMin } : {}),
    ...(shootingStarLowerShadowToBodyMax !== null ? { shootingStarLowerShadowToBodyMax } : {}),
  };
};
