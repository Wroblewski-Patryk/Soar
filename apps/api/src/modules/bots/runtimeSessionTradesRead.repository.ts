import { Prisma } from '@prisma/client';
import { prisma } from '../../prisma/client';

export const getRuntimeTradeBotContext = async (userId: string, botId: string) =>
  prisma.bot.findFirst({
    where: { id: botId, userId },
    select: {
      apiKeyId: true,
      strategyId: true,
      mode: true,
      walletId: true,
      wallet: {
        select: {
          apiKeyId: true,
          marketType: true,
        },
      },
      botMarketGroups: {
        where: {
          isEnabled: true,
          lifecycleStatus: 'ACTIVE',
        },
        orderBy: [{ executionOrder: 'asc' }, { createdAt: 'asc' }, { id: 'asc' }],
        select: {
          strategyLinks: {
            where: { isEnabled: true },
            orderBy: [{ priority: 'asc' }, { createdAt: 'asc' }, { id: 'asc' }],
            select: {
              strategyId: true,
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
  });

export const listRuntimeTradeCarryOverPositionIds = async (where: Prisma.PositionWhereInput) =>
  (
    await prisma.position.findMany({
      where,
      select: {
        id: true,
      },
    })
  ).map((position) => position.id);

export const listRuntimeTradeRows = async (where: Prisma.TradeWhereInput) =>
  prisma.trade.findMany({
    where,
    select: {
      id: true,
      symbol: true,
      side: true,
      lifecycleAction: true,
      price: true,
      quantity: true,
      fee: true,
      feeSource: true,
      feePending: true,
      feeCurrency: true,
      realizedPnl: true,
      exchangeTradeId: true,
      closeReason: true,
      closeInitiator: true,
      executedAt: true,
      createdAt: true,
      orderId: true,
      positionId: true,
      strategyId: true,
      origin: true,
      managementMode: true,
    },
  });

export const listRuntimeTradeCloseEventRows = async (
  where: Prisma.BotRuntimeEventWhereInput
) =>
  prisma.botRuntimeEvent.findMany({
    where,
    select: {
      eventAt: true,
      payload: true,
    },
    orderBy: [{ eventAt: 'desc' }],
  });

export const listRuntimeTradePositionMetaRows = async (
  where: Prisma.PositionWhereInput
) =>
  prisma.position.findMany({
    where,
    select: {
      id: true,
      side: true,
      leverage: true,
      entryPrice: true,
    },
  });

export const listRuntimeTradeAnchorPositionRows = async (
  where: Prisma.PositionWhereInput
) =>
  prisma.position.findMany({
    where,
    select: {
      id: true,
      status: true,
      symbol: true,
      side: true,
      quantity: true,
      leverage: true,
      marginUsed: true,
      entryPrice: true,
      openedAt: true,
      strategyId: true,
      origin: true,
      managementMode: true,
    },
  });

export const listRuntimeTradePositionTradeRows = async (
  where: Prisma.TradeWhereInput
) =>
  prisma.trade.findMany({
    where,
    orderBy: [{ executedAt: 'asc' }, { createdAt: 'asc' }],
    select: {
      id: true,
      positionId: true,
      side: true,
    },
  });
