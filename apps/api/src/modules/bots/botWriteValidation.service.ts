import { prisma } from '../../prisma/client';
import { resolveMarketUniverseContractSymbolsFromCatalog } from '../markets/marketCatalogSymbolResolver.service';
import { botErrors } from './bots.errors';

type OwnedStrategy = {
  id: string;
  config: unknown;
};

type OwnedSymbolGroupWithMarketUniverse = {
  id: string;
  marketUniverse: {
    marketType: 'FUTURES' | 'SPOT';
    exchange: import('@prisma/client').Exchange;
    baseCurrency: string;
  };
};

const getOwnedSymbolGroup = async (userId: string, symbolGroupId: string) =>
  prisma.symbolGroup.findFirst({
    where: { id: symbolGroupId, userId },
    select: {
      id: true,
      marketUniverse: {
        select: { marketType: true, exchange: true, baseCurrency: true },
      },
    },
  });

const getOwnedMarketUniverse = async (userId: string, marketUniverseId: string) =>
  prisma.marketUniverse.findFirst({
    where: { id: marketUniverseId, userId },
    select: {
      id: true,
      name: true,
      exchange: true,
      marketType: true,
      baseCurrency: true,
      filterRules: true,
      whitelist: true,
      blacklist: true,
    },
  });

export const getOwnedStrategy = async (
  userId: string,
  strategyId: string
): Promise<OwnedStrategy | null> =>
  prisma.strategy.findFirst({
    where: { id: strategyId, userId },
    select: {
      id: true,
      config: true,
    },
  });

export const deriveMaxOpenPositionsFromStrategy = (config: unknown) => {
  if (!config || typeof config !== 'object') return 1;

  const cfg = config as Record<string, unknown>;
  const candidates = [
    cfg.maxOpenPositions,
    (cfg.risk as Record<string, unknown> | undefined)?.maxOpenPositions,
    (cfg.open as Record<string, unknown> | undefined)?.maxOpenPositions,
    (cfg.position as Record<string, unknown> | undefined)?.maxOpenPositions,
  ];

  for (const candidate of candidates) {
    if (typeof candidate === 'number' && Number.isInteger(candidate) && candidate > 0) {
      return candidate;
    }
  }

  return 1;
};

export const resolveCreateMarketGroupToSymbolGroup = async (
  userId: string,
  marketGroupId: string
): Promise<OwnedSymbolGroupWithMarketUniverse | null> => {
  const directSymbolGroup = await getOwnedSymbolGroup(userId, marketGroupId);
  if (directSymbolGroup) return directSymbolGroup;

  const marketUniverse = await getOwnedMarketUniverse(userId, marketGroupId);
  if (!marketUniverse) return null;

  const existingSymbolGroup = await prisma.symbolGroup.findFirst({
    where: {
      userId,
      marketUniverseId: marketUniverse.id,
    },
    select: {
      id: true,
      marketUniverse: {
        select: { marketType: true, exchange: true, baseCurrency: true },
      },
    },
    orderBy: { createdAt: 'asc' },
  });
  if (existingSymbolGroup) return existingSymbolGroup;

  const resolvedSymbols = await resolveMarketUniverseContractSymbolsFromCatalog(
    {
      exchange: marketUniverse.exchange,
      marketType: marketUniverse.marketType,
      baseCurrency: marketUniverse.baseCurrency,
      filterRules: marketUniverse.filterRules,
      whitelist: marketUniverse.whitelist,
      blacklist: marketUniverse.blacklist,
    },
    new Map<string, string[]>()
  );

  return prisma.symbolGroup.create({
    data: {
      userId,
      marketUniverseId: marketUniverse.id,
      name: `${marketUniverse.name} Group`,
      symbols: resolvedSymbols,
    },
    select: {
      id: true,
      marketUniverse: {
        select: { marketType: true, exchange: true, baseCurrency: true },
      },
    },
  });
};

export const findDuplicateActiveBotByStrategyAndSymbolGroup = async (params: {
  userId: string;
  strategyId: string;
  symbolGroupId: string;
  walletId: string;
  excludeBotId?: string;
}) =>
  prisma.bot.findFirst({
    where: {
      userId: params.userId,
      isActive: true,
      walletId: params.walletId,
      strategyId: params.strategyId,
      symbolGroupId: params.symbolGroupId,
      ...(params.excludeBotId ? { id: { not: params.excludeBotId } } : {}),
    },
    select: {
      id: true,
      name: true,
    },
  });

export const assertNoDuplicateActiveBotByStrategyAndSymbolGroup = async (params: {
  userId: string;
  strategyId: string;
  symbolGroupId: string;
  walletId: string;
  excludeBotId?: string;
}) => {
  const duplicate = await findDuplicateActiveBotByStrategyAndSymbolGroup(params);
  if (duplicate) {
    throw botErrors.activeBotStrategyMarketGroupDuplicate();
  }
};
