import { Prisma, SignalDirection } from '@prisma/client';
import { prisma } from '../../prisma/client';

export const listActiveRuntimeBotsRaw = () =>
  prisma.bot.findMany({
    where: {
      isActive: true,
    },
    select: {
      id: true,
      userId: true,
      walletId: true,
      mode: true,
      liveOptIn: true,
      exchange: true,
      paperStartBalance: true,
      marketType: true,
      maxOpenPositions: true,
      strategyId: true,
      symbolGroupId: true,
      strategy: {
        select: {
          id: true,
          interval: true,
          config: true,
          leverage: true,
          walletRisk: true,
        },
      },
      symbolGroup: {
        select: {
          id: true,
          symbols: true,
          marketUniverse: {
            select: {
              exchange: true,
              marketType: true,
              baseCurrency: true,
              filterRules: true,
              whitelist: true,
              blacklist: true,
            },
          },
        },
      },
      botMarketGroups: {
        where: {
          isEnabled: true,
          lifecycleStatus: 'ACTIVE',
        },
        orderBy: [{ executionOrder: 'asc' }, { createdAt: 'asc' }, { id: 'asc' }],
        select: {
          id: true,
          symbolGroupId: true,
          maxOpenPositions: true,
          symbolGroup: {
            select: {
              id: true,
              symbols: true,
              marketUniverse: {
                select: {
                  exchange: true,
                  marketType: true,
                  baseCurrency: true,
                  filterRules: true,
                  whitelist: true,
                  blacklist: true,
                },
              },
            },
          },
          strategyLinks: {
            where: {
              isEnabled: true,
            },
            orderBy: [{ priority: 'asc' }, { createdAt: 'asc' }, { id: 'asc' }],
            select: {
              id: true,
              strategyId: true,
              priority: true,
              weight: true,
              strategy: {
                select: {
                  id: true,
                  interval: true,
                  config: true,
                  leverage: true,
                  walletRisk: true,
                },
              },
            },
          },
        },
      },
      wallet: {
        select: {
          id: true,
          mode: true,
          exchange: true,
          marketType: true,
          baseCurrency: true,
          paperInitialBalance: true,
        },
      },
    },
  });

const formatTopologyVersionPart = (name: string, count: number, updatedAt: Date | null) =>
  `${name}:${count}:${updatedAt ? updatedAt.toISOString() : 'none'}`;

export const readRuntimeTopologyVersionRaw = async () => {
  const [bots, groups, links, strategies, symbolGroups, universes] = await prisma.$transaction([
    prisma.bot.aggregate({
      _count: { _all: true },
      _max: { updatedAt: true },
    }),
    prisma.botMarketGroup.aggregate({
      _count: { _all: true },
      _max: { updatedAt: true },
    }),
    prisma.marketGroupStrategyLink.aggregate({
      _count: { _all: true },
      _max: { updatedAt: true },
    }),
    prisma.strategy.aggregate({
      _count: { _all: true },
      _max: { updatedAt: true },
    }),
    prisma.symbolGroup.aggregate({
      _count: { _all: true },
      _max: { updatedAt: true },
    }),
    prisma.marketUniverse.aggregate({
      _count: { _all: true },
      _max: { updatedAt: true },
    }),
  ]);

  return [
    formatTopologyVersionPart('bot', bots._count._all, bots._max.updatedAt),
    formatTopologyVersionPart('group', groups._count._all, groups._max.updatedAt),
    formatTopologyVersionPart('link', links._count._all, links._max.updatedAt),
    formatTopologyVersionPart('strategy', strategies._count._all, strategies._max.updatedAt),
    formatTopologyVersionPart('symbol_group', symbolGroups._count._all, symbolGroups._max.updatedAt),
    formatTopologyVersionPart('market_universe', universes._count._all, universes._max.updatedAt),
  ].join('|');
};

export const listRuntimeManagedExternalPositionsRaw = () =>
  prisma.position.findMany({
    where: {
      status: 'OPEN',
      origin: 'EXCHANGE_SYNC',
      managementMode: 'BOT_MANAGED',
    },
    select: {
      userId: true,
      symbol: true,
    },
    distinct: ['userId', 'symbol'],
  });

export const countOpenPositionsForBotAndSymbolsRaw = (params: {
  userId: string;
  botId: string;
  normalizedSymbols: string[];
}) =>
  prisma.position.count({
    where: {
      userId: params.userId,
      botId: params.botId,
      status: 'OPEN',
      ...(params.normalizedSymbols.length > 0 ? { symbol: { in: params.normalizedSymbols } } : {}),
    },
  });

export const createRuntimeSignalRecord = async (params: {
  userId: string;
  botId?: string;
  strategyId?: string;
  symbol: string;
  timeframe: string;
  direction: SignalDirection;
  confidence: number;
  payload: Record<string, unknown>;
}) => {
  await prisma.signal.create({
    data: {
      userId: params.userId,
      botId: params.botId,
      strategyId: params.strategyId,
      symbol: params.symbol,
      timeframe: params.timeframe,
      direction: params.direction,
      confidence: params.confidence,
      payload: params.payload as Prisma.InputJsonValue,
    },
  });
};
