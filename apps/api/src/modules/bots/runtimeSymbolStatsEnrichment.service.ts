import { resolvePreferredRuntimeOrExchangeSyncedPrice } from './runtimeExchangeSyncedPositionPrice';

export const buildLatestTradeAtBySymbol = (
  rows: Array<{ symbol: string; _max: { executedAt: Date | null } }>
) => new Map(rows.map((row) => [row.symbol, row._max.executedAt ?? null]));

type StrategySymbolsAssignment = {
  strategyId: string;
  symbols: string[];
};

export const buildConfiguredStrategyBySymbol = (params: {
  configuredStrategyAssignments: StrategySymbolsAssignment[];
  symbols: string[];
  strategiesById: Map<string, unknown>;
}) => {
  const configuredStrategyBySymbol = new Map<string, string>();

  const assignStrategy = (assignment: StrategySymbolsAssignment) => {
    const strategyId = assignment.strategyId?.trim();
    if (!strategyId) return;
    const assignedSymbols = assignment.symbols;
    const targetSymbols = assignedSymbols.length > 0 ? assignedSymbols : params.symbols;
    for (const symbol of targetSymbols) {
      if (!configuredStrategyBySymbol.has(symbol)) {
        configuredStrategyBySymbol.set(symbol, strategyId);
      }
    }
  };

  for (const assignment of params.configuredStrategyAssignments) {
    assignStrategy(assignment);
  }

  return configuredStrategyBySymbol;
};

type RuntimeOpenPosition = {
  symbol: string;
  origin: string;
  side: 'LONG' | 'SHORT';
  status: string;
  entryPrice: number;
  quantity: number;
  unrealizedPnl: number | null;
  lastExchangeSyncAt: Date | null;
};

export const buildOpenPositionSymbolMetrics = (params: {
  openPositions: RuntimeOpenPosition[];
  lastPriceBySymbol: Map<string, number | null>;
  lastPriceObservedAtBySymbol?: Map<string, number | null>;
}) => {
  const openPositionCountBySymbol = new Map<string, number>();
  const openPositionQtyBySymbol = new Map<string, number>();
  const unrealizedPnlBySymbol = new Map<string, number>();

  for (const position of params.openPositions) {
    const lastPrice = resolvePreferredRuntimeOrExchangeSyncedPrice({
      origin: position.origin,
      status: position.status,
      side: position.side,
      entryPrice: position.entryPrice,
      quantity: position.quantity,
      unrealizedPnl: position.unrealizedPnl,
      lastExchangeSyncAt: position.lastExchangeSyncAt,
      runtimePriceCandidates: [
        {
          price: params.lastPriceBySymbol.get(position.symbol),
          observedAtMs: params.lastPriceObservedAtBySymbol?.get(position.symbol) ?? null,
        },
      ],
    });
    if (typeof lastPrice === 'number' && Number.isFinite(lastPrice)) {
      const sideMultiplier = position.side === 'LONG' ? 1 : -1;
      const pnl = (lastPrice - position.entryPrice) * position.quantity * sideMultiplier;
      unrealizedPnlBySymbol.set(
        position.symbol,
        (unrealizedPnlBySymbol.get(position.symbol) ?? 0) + pnl
      );
    } else if (typeof position.unrealizedPnl === 'number' && Number.isFinite(position.unrealizedPnl)) {
      unrealizedPnlBySymbol.set(
        position.symbol,
        (unrealizedPnlBySymbol.get(position.symbol) ?? 0) + position.unrealizedPnl
      );
    }
    openPositionCountBySymbol.set(
      position.symbol,
      (openPositionCountBySymbol.get(position.symbol) ?? 0) + 1
    );
    openPositionQtyBySymbol.set(
      position.symbol,
      (openPositionQtyBySymbol.get(position.symbol) ?? 0) + position.quantity
    );
  }

  return {
    openPositionCountBySymbol,
    openPositionQtyBySymbol,
    unrealizedPnlBySymbol,
  };
};
