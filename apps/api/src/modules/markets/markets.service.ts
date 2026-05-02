import { Exchange as PrismaExchange } from '@prisma/client';
import { prisma } from '../../prisma/client';
import {
  normalizeSymbol,
  normalizeSymbols,
  resolveMarketUniverseSymbols,
} from '../../lib/symbols';
import {
  getSupportedExchangeMarketCatalog,
  type PublicMarketEntry,
} from '../exchange/exchangeMarketCatalog.service';
import { CreateMarketUniverseDto, UpdateMarketUniverseDto } from './markets.types';
import { marketErrors } from './markets.errors';

type MarketType = 'SPOT' | 'FUTURES';
type Exchange = PrismaExchange;

const normalizeAsset = (value: string | undefined) => normalizeSymbol(value);

export const getMarketCatalog = async (
  requestedBaseCurrency?: string,
  marketType: MarketType = 'FUTURES',
  exchange: Exchange = 'BINANCE'
) => {
  return getSupportedExchangeMarketCatalog(requestedBaseCurrency, marketType, exchange);
};

export const listUniverses = async (userId: string) => {
  return prisma.marketUniverse.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
};

export const getUniverse = async (userId: string, id: string) => {
  return prisma.marketUniverse.findFirst({
    where: { id, userId },
  });
};

const resolveMinQuoteVolumeFilter = (filterRules: unknown) => {
  const parsedRules =
    filterRules && typeof filterRules === 'object'
      ? (filterRules as {
          minQuoteVolumeEnabled?: unknown;
          minQuoteVolume24h?: unknown;
          minVolume24h?: unknown;
        })
      : null;
  const enabled = parsedRules?.minQuoteVolumeEnabled === true;
  const minRaw = Number(parsedRules?.minQuoteVolume24h ?? parsedRules?.minVolume24h ?? 0);
  const min = Number.isFinite(minRaw) && minRaw > 0 ? minRaw : 0;
  return { enabled, min };
};

const resolveEffectiveUniverseSymbolsForSync = async (params: {
  exchange: Exchange;
  marketType: 'FUTURES' | 'SPOT';
  baseCurrency: string;
  filterRules: unknown;
  whitelist: string[];
  blacklist: string[];
}) => {
  const volumeFilter = resolveMinQuoteVolumeFilter(params.filterRules);
  const fallbackSymbols = resolveMarketUniverseSymbols({
    filterResultSymbols: [],
    whitelist: params.whitelist,
    blacklist: params.blacklist,
  });
  if (!volumeFilter.enabled) {
    return fallbackSymbols;
  }

  try {
    const catalog = await getMarketCatalog(
      params.baseCurrency,
      params.marketType,
      params.exchange
    );
    const filterResultSymbols = normalizeSymbols(
      catalog.markets
        .filter((market) =>
          (market.quoteVolume24h ?? 0) >= volumeFilter.min
        )
        .map((market) => market.symbol)
    );
    return resolveMarketUniverseSymbols({
      filterResultSymbols,
      whitelist: params.whitelist,
      blacklist: params.blacklist,
    });
  } catch {
    return fallbackSymbols;
  }
};

const assertUniverseNotUsedByActiveBot = async (params: { userId: string; marketUniverseId: string }) => {
  const { userId, marketUniverseId } = params;

  const usedByActivePrimaryBot = await prisma.bot.findFirst({
    where: {
      userId,
      isActive: true,
      symbolGroup: {
        marketUniverseId,
      },
    },
    select: {
      id: true,
      name: true,
    },
  });

  const usedByActiveCanonicalBot = await prisma.botMarketGroup.findFirst({
    where: {
      userId,
      isEnabled: true,
      lifecycleStatus: 'ACTIVE',
      bot: {
        userId,
        isActive: true,
      },
      symbolGroup: {
        marketUniverseId,
      },
    },
    select: {
      id: true,
      bot: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  const blockingBot =
    usedByActivePrimaryBot ??
    usedByActiveCanonicalBot?.bot ??
    null;

  if (blockingBot) {
    throw marketErrors.universeUsedByActiveBot({
      botId: blockingBot.id,
      botName: blockingBot.name,
    });
  }
};

export const createUniverse = async (userId: string, data: CreateMarketUniverseDto) => {
  return prisma.marketUniverse.create({
    data: {
      userId,
      ...data,
    },
  });
};

export const updateUniverse = async (
  userId: string,
  id: string,
  data: UpdateMarketUniverseDto
) => {
  const existing = await getUniverse(userId, id);
  if (!existing) return null;
  await assertUniverseNotUsedByActiveBot({ userId, marketUniverseId: existing.id });
  const shouldSyncSymbols =
    data.whitelist !== undefined ||
    data.blacklist !== undefined ||
    data.filterRules !== undefined ||
    data.exchange !== undefined ||
    data.marketType !== undefined ||
    data.baseCurrency !== undefined;

  const nextUniverseState = {
    exchange: (data.exchange ?? existing.exchange) as Exchange,
    marketType: (data.marketType ?? existing.marketType) as 'FUTURES' | 'SPOT',
    baseCurrency: data.baseCurrency ?? existing.baseCurrency,
    filterRules: data.filterRules ?? existing.filterRules,
    whitelist: data.whitelist ?? existing.whitelist,
    blacklist: data.blacklist ?? existing.blacklist,
  };

  const resolvedSymbols = shouldSyncSymbols
    ? await resolveEffectiveUniverseSymbolsForSync(nextUniverseState)
    : null;

  return prisma.$transaction(async (tx) => {
    const updated = await tx.marketUniverse.update({
      where: { id: existing.id },
      data,
    });

    if (resolvedSymbols) {
      await tx.symbolGroup.updateMany({
        where: {
          userId,
          marketUniverseId: updated.id,
        },
        data: {
          symbols: resolvedSymbols,
        },
      });
    }

    return updated;
  });
};

export const deleteUniverse = async (userId: string, id: string) => {
  const existing = await getUniverse(userId, id);
  if (!existing) return false;
  await assertUniverseNotUsedByActiveBot({ userId, marketUniverseId: existing.id });

  try {
    await prisma.$transaction(async (tx) => {
      const symbolGroups = await tx.symbolGroup.findMany({
        where: {
          userId,
          marketUniverseId: existing.id,
        },
        select: { id: true },
      });

      const symbolGroupIds = symbolGroups.map((group) => group.id);
      if (symbolGroupIds.length > 0) {
        await tx.marketGroupStrategyLink.deleteMany({
          where: {
            userId,
            botMarketGroup: {
              symbolGroupId: { in: symbolGroupIds },
            },
          },
        });

        await tx.botStrategy.deleteMany({
          where: {
            symbolGroupId: { in: symbolGroupIds },
            bot: { userId },
          },
        });

        await tx.botMarketGroup.deleteMany({
          where: {
            userId,
            symbolGroupId: { in: symbolGroupIds },
          },
        });

        await tx.symbolGroup.deleteMany({
          where: {
            userId,
            id: { in: symbolGroupIds },
          },
        });
      }

      await tx.marketUniverse.delete({
        where: { id: existing.id },
      });
    });
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error) {
      const code = (error as { code?: string }).code;
      if (code && ['P2003', 'P2014', 'P2025', 'P2022'].includes(code)) {
        throw marketErrors.universeLinkedRecords();
      }
    }
    throw error;
  }

  return true;
};
