import { Exchange } from '@prisma/client';

import { prisma } from '../../prisma/client';
import { resolveEffectiveSymbolGroupSymbolsWithCatalog } from '../bots/runtimeSymbolCatalogResolver.service';
import { computeMinExecutableQuantity, normalizeAmountFixed, type SymbolTradingRules } from './orders.quantityRules';
import type { ManualOrderContextQuery, OpenOrderDto } from './orders.types';
import { resolveSymbolTradingRulesMetadata } from '../exchange/exchangeMetadataContract.service';

type ManualOrderContextConnector = {
  getSymbolTradingRules?: (symbol: string) => Promise<SymbolTradingRules>;
  fetchMarkPrice: (symbol: string) => Promise<number>;
  disconnect: () => Promise<void>;
};

export type ManualOrderContextDeps = {
  createPublicConnector: (params: {
    exchange: Exchange;
    marketType: 'FUTURES' | 'SPOT';
  }) => ManualOrderContextConnector;
};

type ResolvedManualOrderStrategyContext = {
  leverage: number | null;
  config: Record<string, unknown> | null;
};

const asRecord = (value: unknown): Record<string, unknown> | null =>
  value && typeof value === 'object' ? (value as Record<string, unknown>) : null;

const resolveOrderTypeFromStrategyConfig = (
  config: Record<string, unknown> | null
): OpenOrderDto['type'] | null => {
  const additional = asRecord(config?.additional);
  const raw = additional?.orderType;
  if (typeof raw !== 'string') return null;

  const normalized = raw.trim().toUpperCase();
  if (
    normalized === 'MARKET' ||
    normalized === 'LIMIT' ||
    normalized === 'STOP' ||
    normalized === 'STOP_LIMIT' ||
    normalized === 'TAKE_PROFIT' ||
    normalized === 'TRAILING'
  ) {
    return normalized as OpenOrderDto['type'];
  }

  return null;
};

const resolveMarginModeFromStrategyConfig = (
  config: Record<string, unknown> | null,
  marketType: 'FUTURES' | 'SPOT'
) => {
  if (marketType === 'SPOT') return 'NONE' as const;

  const additional = asRecord(config?.additional);
  const raw = typeof additional?.marginMode === 'string' ? additional.marginMode.trim().toUpperCase() : '';
  if (raw === 'ISOLATED') return 'ISOLATED' as const;
  return 'CROSSED' as const;
};

const resolveManualOrderStrategyContext = async (params: {
  userId: string;
  botId: string;
  symbol: string;
}): Promise<ResolvedManualOrderStrategyContext | null> => {
  const normalizedSymbol = params.symbol.toUpperCase();
  const catalogSymbolsCache = new Map<string, string[]>();
  const botDirectContext = await prisma.bot.findFirst({
    where: {
      id: params.botId,
      userId: params.userId,
    },
    select: {
      strategyId: true,
      symbolGroupId: true,
      strategy: {
        select: {
          leverage: true,
          config: true,
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

  if (
    botDirectContext?.strategyId &&
    botDirectContext.symbolGroupId &&
    botDirectContext.strategy &&
    botDirectContext.symbolGroup
  ) {
    const directSymbols = await resolveEffectiveSymbolGroupSymbolsWithCatalog(
      botDirectContext.symbolGroup,
      catalogSymbolsCache
    );
    if (directSymbols.includes(normalizedSymbol)) {
      return {
        leverage: botDirectContext.strategy.leverage,
        config: (botDirectContext.strategy.config as Record<string, unknown> | null | undefined) ?? null,
      };
    }
    return null;
  }

  const groupLinks = await prisma.botMarketGroup.findMany({
    where: {
      userId: params.userId,
      botId: params.botId,
      isEnabled: true,
      lifecycleStatus: 'ACTIVE',
    },
    orderBy: [{ executionOrder: 'asc' }, { createdAt: 'asc' }],
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
        orderBy: [{ priority: 'asc' }, { createdAt: 'asc' }],
        select: {
          strategy: {
            select: {
              leverage: true,
              config: true,
            },
          },
        },
      },
    },
  });

  for (const group of groupLinks) {
    const symbols = await resolveEffectiveSymbolGroupSymbolsWithCatalog(
      group.symbolGroup,
      catalogSymbolsCache
    );
    if (!symbols.includes(normalizedSymbol)) continue;
    const selected = group.strategyLinks[0]?.strategy;
    if (selected) {
      return {
        leverage: selected.leverage,
        config: (selected.config as Record<string, unknown> | null | undefined) ?? null,
      };
    }
  }

  const legacyLinks = await prisma.botStrategy.findMany({
    where: {
      botId: params.botId,
      isEnabled: true,
      bot: { userId: params.userId },
    },
    orderBy: [{ createdAt: 'asc' }],
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
      strategy: {
        select: {
          leverage: true,
          config: true,
        },
      },
    },
  });

  for (const link of legacyLinks) {
    const symbols = await resolveEffectiveSymbolGroupSymbolsWithCatalog(
      link.symbolGroup,
      catalogSymbolsCache
    );
    if (!symbols.includes(normalizedSymbol)) continue;
    return {
      leverage: link.strategy.leverage,
      config: (link.strategy.config as Record<string, unknown> | null | undefined) ?? null,
    };
  }

  return null;
};

export const getManualOrderContext = async (
  userId: string,
  query: ManualOrderContextQuery,
  deps: ManualOrderContextDeps
) => {
  const bot = await prisma.bot.findFirst({
    where: { id: query.botId, userId },
    select: {
      id: true,
      mode: true,
      exchange: true,
      marketType: true,
      maxOpenPositions: true,
    },
  });

  if (!bot) return null;

  const normalizedSymbol = query.symbol.toUpperCase();
  const strategyContext = await resolveManualOrderStrategyContext({
    userId,
    botId: bot.id,
    symbol: normalizedSymbol,
  });
  const resolvedLeverage =
    bot.marketType === 'SPOT' ? 1 : Math.max(1, Math.floor(strategyContext?.leverage ?? 1));
  const resolvedOrderType = resolveOrderTypeFromStrategyConfig(strategyContext?.config ?? null) ?? 'MARKET';
  const resolvedMarginMode = resolveMarginModeFromStrategyConfig(strategyContext?.config ?? null, bot.marketType);

  let rules: SymbolTradingRules = {
    minAmount: null,
    minNotional: null,
    amountPrecision: null,
  };
  let markPrice: number | null = null;

  const connector = deps.createPublicConnector({
    exchange: bot.exchange,
    marketType: bot.marketType,
  });
  const resolveRulesPromise =
    typeof connector.getSymbolTradingRules === 'function'
      ? connector.getSymbolTradingRules(normalizedSymbol)
      : resolveSymbolTradingRulesMetadata({
          exchange: bot.exchange,
          marketType: bot.marketType,
          symbol: normalizedSymbol,
        });
  try {
    const [rulesResult, markPriceResult] = await Promise.allSettled([
      resolveRulesPromise,
      connector.fetchMarkPrice(normalizedSymbol),
    ]);

    if (rulesResult.status === 'fulfilled') {
      rules = rulesResult.value;
    }
    if (markPriceResult.status === 'fulfilled' && Number.isFinite(markPriceResult.value)) {
      markPrice = markPriceResult.value;
    }
  } finally {
    await connector.disconnect().catch(() => undefined);
  }

  const minExecutableQty = computeMinExecutableQuantity({
    minAmount: rules.minAmount,
    minNotional: rules.minNotional,
    markPrice,
    amountPrecision: rules.amountPrecision,
  });

  const requestedQuantity =
    typeof query.quantity === 'number' && Number.isFinite(query.quantity) && query.quantity > 0
      ? query.quantity
      : null;
  const estimatedNotional =
    requestedQuantity != null && markPrice != null
      ? normalizeAmountFixed(requestedQuantity * markPrice, rules.amountPrecision)
      : null;
  const estimatedMargin =
    estimatedNotional != null ? estimatedNotional / Math.max(1, resolvedLeverage) : null;

  return {
    botId: bot.id,
    symbol: normalizedSymbol,
    mode: bot.mode,
    orderType: resolvedOrderType,
    marginMode: resolvedMarginMode,
    leverage: resolvedLeverage,
    priceReference: {
      markPrice,
      source: markPrice != null ? 'exchange_mark' : 'unavailable',
    },
    quantityConstraints: {
      minAmount: rules.minAmount,
      amountPrecision: rules.amountPrecision,
      minNotional: rules.minNotional,
      minExecutableQty,
    },
    sideAwarePreview: {
      side: query.side,
      requestedQuantity,
      estimatedNotional,
      estimatedMargin,
      maxOpenPositions: bot.maxOpenPositions,
    },
  };
};
