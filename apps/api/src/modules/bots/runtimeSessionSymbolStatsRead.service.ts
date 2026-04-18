import { runtimeSignalLoop } from '../engine/runtimeSignalLoop.service';
import { getRuntimeTicker } from '../engine/runtimeTickerStore';
import { normalizeSymbol } from '../../lib/symbols';
import { ListBotRuntimeSymbolStatsQueryDto } from './bots.types';
import {
  parseSignalConditionLines,
  SignalConditionLine,
} from './runtimeSignalConditionLines.service';
import { normalizeSymbols } from './runtimeSymbolUniverse.service';
import { resolveEffectiveSymbolGroupSymbolsWithCatalog } from './runtimeSymbolCatalogResolver.service';
import { asRecord, humanizeMergeReason, toFiniteNumber } from './runtimeSignalStatsFormatting.service';
import { fetchFallbackKlineCloses } from './runtimeMarketDataFallback.service';
import { getOwnedBotRuntimeSession, resolveSessionWindowEnd } from './botOwnership.service';
import {
  buildConfiguredStrategyBySymbol,
  buildLatestTradeAtBySymbol,
  buildOpenPositionSymbolMetrics,
} from './runtimeSymbolStatsEnrichment.service';
import { composeRuntimeSymbolStatsReadModel } from './runtimeSymbolStatsReadModel.service';
import {
  getRuntimeSymbolLiveRows,
  getRuntimeSymbolStatsBaseData,
  listMarketCandleCloses,
  listStrategiesByIds,
} from './botsRuntimeRead.repository';

export const listBotRuntimeSessionSymbolStats = async (
  userId: string,
  botId: string,
  sessionId: string,
  query: ListBotRuntimeSymbolStatsQueryDto
) => {
  const session = await getOwnedBotRuntimeSession(userId, botId, sessionId);
  if (!session) return null;

  const normalizedSymbol = normalizeSymbol(query.symbol) || undefined;
  const windowEnd = resolveSessionWindowEnd(session);

  const {
    items,
    summary,
    configuredMarketGroups,
    configuredBotStrategies,
    configuredMarketGroupStrategyLinks,
    botContext,
  } = await getRuntimeSymbolStatsBaseData({
    userId,
    botId,
    sessionId,
    normalizedSymbol,
    limit: query.limit,
  });
  const botExchange = botContext?.exchange ?? 'BINANCE';
  const botMarketType = botContext?.marketType ?? 'FUTURES';

  const catalogSymbolsCache = new Map<string, string[]>();
  const [configuredMarketGroupSymbols, configuredBotStrategySymbols] = await Promise.all([
    Promise.all(
      configuredMarketGroups.map((group) =>
        resolveEffectiveSymbolGroupSymbolsWithCatalog(group.symbolGroup, catalogSymbolsCache)
      )
    ),
    Promise.all(
      configuredBotStrategies.map((strategy) =>
        resolveEffectiveSymbolGroupSymbolsWithCatalog(strategy.symbolGroup, catalogSymbolsCache)
      )
    ),
  ]);
  const configuredSymbols = normalizeSymbols(
    [...configuredMarketGroupSymbols.flat(), ...configuredBotStrategySymbols.flat()]
  ).slice(0, query.limit);
  const symbols = normalizedSymbol ? [normalizedSymbol] : configuredSymbols;
  const [openPositions, latestTradeBySymbolRows, latestSignalEvents] = symbols.length
    ? await getRuntimeSymbolLiveRows({
        userId,
        botId,
        sessionId,
        symbols,
        windowStart: session.startedAt,
        windowEnd,
      })
    : [[], [], []];

  const lastPriceBySymbol = new Map(items.map((item) => [item.symbol, item.lastPrice]));
  for (const symbol of symbols) {
    const ticker = getRuntimeTicker(symbol, {
      exchange: botExchange,
      marketType: botMarketType,
    });
    if (ticker && Number.isFinite(ticker.lastPrice)) {
      lastPriceBySymbol.set(symbol, ticker.lastPrice);
    }
  }
  const latestTradeAtBySymbol = buildLatestTradeAtBySymbol(latestTradeBySymbolRows);
  const latestSignalBySymbol = new Map<
    string,
    {
      signalDirection: 'LONG' | 'SHORT' | 'EXIT' | null;
      eventAt: Date | null;
      message: string | null;
      mergeReason: string | null;
      strategyId: string | null;
      scoreLong: number | null;
      scoreShort: number | null;
      analysisByStrategy: Record<
        string,
        { conditionLines: SignalConditionLine[] | null; indicatorSummary: string | null }
      >;
    }
  >();
  const strategiesById = new Map<
    string,
    { name: string; interval: string; config: Record<string, unknown> | null }
  >();
  for (const configuredBotStrategy of configuredBotStrategies) {
    const strategy = configuredBotStrategy.strategy;
    if (!strategy) continue;
    strategiesById.set(strategy.id, {
      name: strategy.name,
      interval: strategy.interval,
      config: asRecord(strategy.config) ?? null,
    });
  }
  for (const configuredLink of configuredMarketGroupStrategyLinks) {
    const strategy = configuredLink.strategy;
    if (!strategy) continue;
    strategiesById.set(strategy.id, {
      name: strategy.name,
      interval: strategy.interval,
      config: asRecord(strategy.config) ?? null,
    });
  }
  const latestSignalStrategyIds = new Set<string>();
  for (const event of latestSignalEvents) {
    if (!event.symbol || latestSignalBySymbol.has(event.symbol)) continue;
    const payload = asRecord(event.payload);
    const merge = asRecord(payload?.merge);
    const scores = asRecord(merge?.scores);
    const winner = asRecord(merge?.winner);
    const analysis = asRecord(payload?.analysis);
    const byStrategy = asRecord(analysis?.byStrategy);
    const parsedAnalysisByStrategy: Record<
      string,
      { conditionLines: SignalConditionLine[] | null; indicatorSummary: string | null }
    > = {};
    if (byStrategy) {
      for (const [strategyKey, rawStats] of Object.entries(byStrategy)) {
        if (typeof strategyKey !== 'string' || strategyKey.trim().length === 0) continue;
        const strategyStats = asRecord(rawStats);
        if (!strategyStats) continue;
        parsedAnalysisByStrategy[strategyKey.trim()] = {
          conditionLines: parseSignalConditionLines(strategyStats.conditionLines),
          indicatorSummary:
            typeof strategyStats.indicatorSummary === 'string' && strategyStats.indicatorSummary.trim().length > 0
              ? strategyStats.indicatorSummary.trim()
              : null,
        };
      }
    }
    const mergeReasonRaw =
      typeof merge?.reason === 'string' && merge.reason.trim().length > 0
        ? merge.reason.trim()
        : null;
    const winnerStrategyId =
      typeof winner?.strategyId === 'string' && winner.strategyId.trim().length > 0
        ? winner.strategyId.trim()
        : null;
    const strategyId =
      (typeof event.strategyId === 'string' && event.strategyId.trim().length > 0
        ? event.strategyId.trim()
        : null) ??
      winnerStrategyId;
    if (strategyId) latestSignalStrategyIds.add(strategyId);
    latestSignalBySymbol.set(event.symbol, {
      signalDirection:
        event.signalDirection === 'LONG' ||
        event.signalDirection === 'SHORT' ||
        event.signalDirection === 'EXIT'
          ? event.signalDirection
          : null,
      eventAt: event.eventAt ?? null,
      message: event.message ?? null,
      mergeReason: humanizeMergeReason(mergeReasonRaw),
      strategyId,
      scoreLong: toFiniteNumber(scores?.longScore),
      scoreShort: toFiniteNumber(scores?.shortScore),
      analysisByStrategy: parsedAnalysisByStrategy,
    });
  }
  const missingStrategyIds = [...latestSignalStrategyIds].filter((strategyId) => !strategiesById.has(strategyId));
  if (missingStrategyIds.length > 0) {
    const signalStrategies = await listStrategiesByIds({
      userId,
      strategyIds: missingStrategyIds,
    });
    for (const strategy of signalStrategies) {
      strategiesById.set(strategy.id, {
        name: strategy.name,
        interval: strategy.interval,
        config: asRecord(strategy.config) ?? null,
      });
    }
  }

  const configuredBotStrategySymbolsResolved = await Promise.all(
    configuredBotStrategies.map(async (configuredBotStrategy) => ({
      strategyId: configuredBotStrategy.strategyId?.trim() ?? '',
      symbols: await resolveEffectiveSymbolGroupSymbolsWithCatalog(
        configuredBotStrategy.symbolGroup,
        catalogSymbolsCache
      ),
    }))
  );
  const configuredLinkSymbolsResolved = await Promise.all(
    configuredMarketGroupStrategyLinks.map(async (configuredLink) => ({
      strategyId: configuredLink.strategyId?.trim() ?? '',
      symbols: await resolveEffectiveSymbolGroupSymbolsWithCatalog(
        configuredLink.botMarketGroup.symbolGroup,
        catalogSymbolsCache
      ),
    }))
  );
  const configuredStrategyBySymbol = buildConfiguredStrategyBySymbol({
    configuredBotStrategies: configuredBotStrategySymbolsResolved,
    configuredMarketGroupStrategyLinks: configuredLinkSymbolsResolved,
    symbols,
    strategiesById,
  });

  const strategySeriesKeys = new Map<string, { symbol: string; interval: string }>();
  for (const symbol of symbols) {
    const latestSignal = latestSignalBySymbol.get(symbol);
    const strategyId = latestSignal?.strategyId ?? configuredStrategyBySymbol.get(symbol) ?? null;
    if (!strategyId) continue;
    const strategy = strategiesById.get(strategyId);
    if (!strategy?.interval) continue;
    const interval = strategy.interval.trim().toLowerCase();
    if (!interval) continue;
    const key = `${symbol}|${interval}`;
    strategySeriesKeys.set(key, { symbol, interval });
  }

  const candleClosesBySeries = new Map<string, number[]>();
  if (strategySeriesKeys.size > 0) {
    const entries = [...strategySeriesKeys.values()];
    const seriesRows = await Promise.all(
      entries.map(async ({ symbol, interval }) => {
        const inMemoryCloses = runtimeSignalLoop.getRecentCloses({
          marketType: botMarketType,
          symbol,
          interval,
          limit: 300,
        });
        if (inMemoryCloses.length > 0) {
          return {
            key: `${symbol}|${interval}`,
            closes: inMemoryCloses,
          };
        }

        const candles = await listMarketCandleCloses({
          marketType: botMarketType,
          symbol,
          interval,
          limit: 300,
        });
        return {
          key: `${symbol}|${interval}`,
          closes:
            candles
              .map((item) => item.close)
              .filter((value): value is number => Number.isFinite(value))
              .reverse(),
        };
      })
    );
    for (const row of seriesRows) {
      if (row.closes.length > 0) {
        candleClosesBySeries.set(row.key, row.closes);
        continue;
      }
      const [symbol, interval] = row.key.split('|');
      const fallbackCloses = await fetchFallbackKlineCloses({
        marketType: botMarketType,
        symbol,
        interval,
        limit: 300,
      });
      candleClosesBySeries.set(row.key, fallbackCloses);
    }
  }
  const { openPositionCountBySymbol, openPositionQtyBySymbol, unrealizedPnlBySymbol } =
    buildOpenPositionSymbolMetrics({
      openPositions,
      lastPriceBySymbol,
    });
  const statBySymbol = new Map(items.map((item) => [item.symbol, item]));
  const readModel = composeRuntimeSymbolStatsReadModel({
    userId,
    botId,
    sessionId,
    sessionStartedAt: session.startedAt,
    sessionCreatedAt: session.createdAt,
    sessionUpdatedAt: session.updatedAt,
    symbols,
    statBySymbol,
    aggregateSummary: {
      totalSignals: summary._sum.totalSignals,
      longEntries: summary._sum.longEntries,
      shortEntries: summary._sum.shortEntries,
      exits: summary._sum.exits,
      dcaCount: summary._sum.dcaCount,
      closedTrades: summary._sum.closedTrades,
      winningTrades: summary._sum.winningTrades,
      losingTrades: summary._sum.losingTrades,
      realizedPnl: summary._sum.realizedPnl,
      grossProfit: summary._sum.grossProfit,
      grossLoss: summary._sum.grossLoss,
      feesPaid: summary._sum.feesPaid,
    },
    openPositionCountBySymbol,
    openPositionQtyBySymbol,
    unrealizedPnlBySymbol,
    lastPriceBySymbol,
    latestTradeAtBySymbol,
    latestSignalBySymbol,
    configuredStrategyBySymbol,
    strategiesById,
    candleClosesBySeries,
  });

  return {
    sessionId,
    items: readModel.items,
    summary: readModel.summary,
  };
};
