import { prisma } from '../../prisma/client';
import { hydrateImportedRuntimePositionOwnership } from './runtimeImportedPositionOwnership';
import { RuntimePositionAutomationDeps } from './runtimePositionAutomation.types';

export const listRuntimeAutomationOpenPositionsBySymbol: RuntimePositionAutomationDeps['listOpenPositionsBySymbol'] =
  async (symbol) => {
    const positions = await prisma.position.findMany({
      where: {
        status: 'OPEN',
        symbol,
        managementMode: 'BOT_MANAGED',
        OR: [
          { botId: null },
          {
            bot: {
              isActive: true,
            },
          },
        ],
      },
      select: {
        id: true,
        userId: true,
        botId: true,
        walletId: true,
        strategyId: true,
        externalId: true,
        symbol: true,
        side: true,
        entryPrice: true,
        quantity: true,
        leverage: true,
        marginUsed: true,
        stopLoss: true,
        takeProfit: true,
        managementMode: true,
        origin: true,
        continuityState: true,
        status: true,
        unrealizedPnl: true,
        lastExchangeSyncAt: true,
        bot: {
          select: {
            walletId: true,
            liveOptIn: true,
            wallet: {
              select: {
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
                    filterRules: true,
                    whitelist: true,
                    blacklist: true,
                  },
                },
              },
            },
            botMarketGroups: {
              where: { isEnabled: true, lifecycleStatus: 'ACTIVE' },
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
                  where: { isEnabled: true },
                  select: { strategyId: true },
                },
              },
            },
          },
        },
      },
    });
    return hydrateImportedRuntimePositionOwnership(positions);
  };
