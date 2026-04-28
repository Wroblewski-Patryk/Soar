import { Prisma } from '@prisma/client';
import { prisma } from '../../prisma/client';

export const getRuntimePositionBotContext = async (userId: string, botId: string) =>
  prisma.bot.findFirst({
    where: { id: botId, userId },
    select: {
      id: true,
      apiKeyId: true,
      walletId: true,
      paperStartBalance: true,
      wallet: {
        select: {
          apiKeyId: true,
          mode: true,
          exchange: true,
          marketType: true,
          baseCurrency: true,
          paperInitialBalance: true,
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
            },
          },
        },
      },
    },
  });

export const listRuntimeManagedPositions = async (params: {
  where: Prisma.PositionWhereInput;
  limit: number;
}) =>
  prisma.position.findMany({
    where: params.where,
    orderBy: [{ openedAt: 'desc' }, { createdAt: 'desc' }],
    take: params.limit,
    select: {
      id: true,
      origin: true,
      managementMode: true,
      syncState: true,
      continuityState: true,
      botId: true,
      symbol: true,
      strategyId: true,
      side: true,
      status: true,
      entryPrice: true,
      quantity: true,
      leverage: true,
      closeReason: true,
      closeInitiator: true,
      stopLoss: true,
      takeProfit: true,
      openedAt: true,
      closedAt: true,
      realizedPnl: true,
      unrealizedPnl: true,
    },
  });

export const listRuntimeOpenOrders = async (params: {
  where: Prisma.OrderWhereInput;
  limit: number;
}) =>
  prisma.order.findMany({
    where: params.where,
    orderBy: [{ createdAt: 'desc' }, { updatedAt: 'desc' }],
    take: params.limit,
    select: {
      id: true,
      origin: true,
      exchangeOrderId: true,
      symbol: true,
      side: true,
      type: true,
      status: true,
      quantity: true,
      filledQuantity: true,
      price: true,
      stopPrice: true,
      submittedAt: true,
      createdAt: true,
      updatedAt: true,
    },
  });

export const listRuntimePositionTradeRows = async (where: Prisma.TradeWhereInput) =>
  prisma.trade.findMany({
    where,
    orderBy: [{ executedAt: 'asc' }, { createdAt: 'asc' }],
    select: {
      positionId: true,
      side: true,
      price: true,
      quantity: true,
      fee: true,
      realizedPnl: true,
      executedAt: true,
    },
  });

export const listRuntimePositionLastPrices = async (where: Prisma.BotRuntimeSymbolStatWhereInput) =>
  prisma.botRuntimeSymbolStat.findMany({
    where,
    select: {
      symbol: true,
      lastPrice: true,
    },
  });

export const listRuntimePositionStrategies = async (where: Prisma.StrategyWhereInput) =>
  prisma.strategy.findMany({
    where,
    select: {
      id: true,
      config: true,
    },
  });
