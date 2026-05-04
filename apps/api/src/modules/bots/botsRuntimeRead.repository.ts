import { Prisma } from '@prisma/client';
import { prisma } from '../../prisma/client';
import { buildRuntimeSessionOpenPositionWindow } from './runtimeSessionPositionWindow';
import {
  buildImportedExternalPositionMarketPrefix,
  buildLegacyImportedExternalPositionSymbolPrefix,
} from '../positions/livePositionReconciliation.helpers';

export const getRuntimeSymbolStatsBaseData = async (params: {
  userId: string;
  botId: string;
  sessionId: string;
  normalizedSymbol?: string;
  limit: number;
}) => {
  const where = {
    userId: params.userId,
    botId: params.botId,
    sessionId: params.sessionId,
    ...(params.normalizedSymbol ? { symbol: params.normalizedSymbol } : {}),
  };

  const [items, summary, botContext] =
    await Promise.all([
      prisma.botRuntimeSymbolStat.findMany({
        where,
        orderBy: [{ realizedPnl: 'desc' }, { updatedAt: 'desc' }],
        take: params.limit,
      }),
      prisma.botRuntimeSymbolStat.aggregate({
        where,
        _sum: {
          totalSignals: true,
          longEntries: true,
          shortEntries: true,
          exits: true,
          dcaCount: true,
          closedTrades: true,
          winningTrades: true,
          losingTrades: true,
          realizedPnl: true,
          grossProfit: true,
          grossLoss: true,
          feesPaid: true,
        },
      }),
      prisma.bot.findFirst({
        where: {
          id: params.botId,
          userId: params.userId,
        },
        select: {
          strategyId: true,
          symbolGroupId: true,
          mode: true,
          walletId: true,
          apiKeyId: true,
          marketType: true,
          wallet: {
            select: {
              apiKeyId: true,
              marketType: true,
            },
          },
          strategy: {
            select: {
              id: true,
              name: true,
              interval: true,
              config: true,
              updatedAt: true,
            },
          },
          botMarketGroups: {
            where: {
              isEnabled: true,
              lifecycleStatus: 'ACTIVE',
            },
            orderBy: [{ executionOrder: 'asc' }, { createdAt: 'asc' }, { id: 'asc' }],
            select: {
              symbolGroup: {
                select: {
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
                  strategyId: true,
                  strategy: {
                    select: {
                      id: true,
                      name: true,
                      interval: true,
                      config: true,
                      updatedAt: true,
                    },
                  },
                },
              },
            },
          },
          symbolGroup: {
            select: {
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
        },
      }),
    ]);

  return {
    items,
    summary,
    botContext,
  };
};

export const listRuntimeFallbackSymbolsFromEvents = async (params: {
  userId: string;
  botId: string;
  sessionId: string;
  limit: number;
}) =>
  prisma.botRuntimeEvent.findMany({
    where: {
      userId: params.userId,
      botId: params.botId,
      sessionId: params.sessionId,
      symbol: { not: null },
    },
    select: { symbol: true },
    orderBy: [{ eventAt: 'desc' }, { createdAt: 'desc' }],
    take: params.limit,
  });

export const listRuntimeSymbolStatsRowsForSymbols = async (params: {
  userId: string;
  botId: string;
  sessionId: string;
  symbols: string[];
}) =>
  prisma.botRuntimeSymbolStat.findMany({
    where: {
      userId: params.userId,
      botId: params.botId,
      sessionId: params.sessionId,
      symbol: { in: params.symbols },
    },
    orderBy: [{ symbol: 'asc' }],
  });

export const buildRuntimeSymbolLiveOpenPositionScopes = (params: {
  botId: string;
  walletId?: string | null;
  apiKeyId?: string | null;
  marketType: 'FUTURES' | 'SPOT';
  ownedExternalSymbols: string[];
}): Prisma.PositionWhereInput[] => {
  const directScope = { botId: params.botId };
  if (!params.walletId || !params.apiKeyId || params.ownedExternalSymbols.length === 0) {
    return [directScope];
  }

  const walletId = params.walletId;
  const apiKeyId = params.apiKeyId;
  return [
    directScope,
    {
      botId: null,
      origin: 'EXCHANGE_SYNC',
      symbol: { in: params.ownedExternalSymbols },
      AND: [
        {
          OR: [
            {
              externalId: {
                startsWith: buildImportedExternalPositionMarketPrefix({
                  apiKeyId,
                  marketType: params.marketType,
                }),
              },
            },
            ...params.ownedExternalSymbols.map((symbol) => ({
              externalId: {
                startsWith: buildLegacyImportedExternalPositionSymbolPrefix({
                  apiKeyId,
                  symbol,
                }),
              },
            })),
          ],
        },
        {
          OR: [{ walletId }, { walletId: null }],
        },
      ],
    },
  ];
};

export const getRuntimeSymbolLiveRows = async (params: {
  userId: string;
  botId: string;
  sessionId: string;
  symbols: string[];
  windowStart: Date;
  windowEnd: Date;
  openPositionScopes?: Prisma.PositionWhereInput[];
}) =>
  Promise.all([
    prisma.position.findMany({
      where: {
        userId: params.userId,
        status: 'OPEN',
        syncState: 'IN_SYNC',
        managementMode: 'BOT_MANAGED',
        symbol: { in: params.symbols },
        openedAt: buildRuntimeSessionOpenPositionWindow({
          windowEnd: params.windowEnd,
        }),
        AND: [
          {
            OR:
              params.openPositionScopes && params.openPositionScopes.length > 0
                ? params.openPositionScopes
                : [{ botId: params.botId }],
          },
        ],
      },
      select: {
        symbol: true,
        origin: true,
        side: true,
        status: true,
        entryPrice: true,
        quantity: true,
        unrealizedPnl: true,
        lastExchangeSyncAt: true,
      },
    }),
    prisma.trade.groupBy({
      by: ['symbol'],
      where: {
        userId: params.userId,
        botId: params.botId,
        symbol: { in: params.symbols },
        executedAt: {
          gte: params.windowStart,
          lte: params.windowEnd,
        },
      },
      _max: {
        executedAt: true,
      },
    }),
    prisma.botRuntimeEvent.findMany({
      where: {
        sessionId: params.sessionId,
        eventType: { in: ['SIGNAL_DECISION', 'PRETRADE_BLOCKED'] },
        symbol: { in: params.symbols },
      },
      orderBy: [{ eventAt: 'desc' }, { createdAt: 'desc' }],
      select: {
        eventType: true,
        symbol: true,
        signalDirection: true,
        eventAt: true,
        message: true,
        strategyId: true,
        payload: true,
      },
    }),
  ]);

export const listStrategiesByIds = async (params: {
  userId: string;
  strategyIds: string[];
}) =>
  prisma.strategy.findMany({
    where: {
      userId: params.userId,
      id: { in: params.strategyIds },
    },
    select: {
      id: true,
      name: true,
      interval: true,
      config: true,
      updatedAt: true,
    },
  });

export const listMarketCandles = async (params: {
  marketType: 'FUTURES' | 'SPOT';
  symbol: string;
  interval: string;
  limit: number;
}) =>
  prisma.marketCandleCache.findMany({
    where: {
      marketType: params.marketType,
      symbol: params.symbol,
      timeframe: params.interval,
    },
    orderBy: [{ openTime: 'desc' }],
    take: params.limit,
    select: {
      openTime: true,
      closeTime: true,
      open: true,
      high: true,
      low: true,
      close: true,
      volume: true,
    },
  });
