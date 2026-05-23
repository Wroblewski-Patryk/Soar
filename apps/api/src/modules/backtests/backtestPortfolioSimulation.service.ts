import { PositionSide } from '@prisma/client';
import { decideExecutionAction } from '../engine/sharedExecutionCore';
import { evaluatePositionManagement } from '../engine/positionManagement.service';
import { PositionManagementInput } from '../engine/positionManagement.types';
import {
  evaluateStrategySignalAtIndex,
  parseStrategySignalRules,
  type StrategySignalDerivativesSeries,
} from '../engine/strategySignalEvaluator';
import { mergeRuntimeStrategyVotes, type StrategyVote } from '../engine/runtimeSignalMerge';
import {
  computeRiskBasedOrderQuantity,
  normalizeWalletRiskPercent,
} from '../engine/positionSizing';
import {
  type ReplayEventDraft,
  type ReplayParityDecisionTrace,
  type ReplayEventType,
  buildReplayPositionManagementInput,
  closeReasonToEventType,
  parseStrategyRiskConfig,
  resolveReplayDcaProbePrice,
  shouldBlockCloseByPendingDca,
} from './backtestReplayCore';
import {
  BacktestFillModelConfig,
  createHistoricalBacktestFillModel,
} from './backtestFillModel';
import {
  type BacktestKlineCandle as KlineCandle,
  type BacktestMarketType as MarketType,
  type BacktestSupplementalSeries as SupplementalSeries,
} from './backtestDataGateway';
import { alignTimedNumericPointsToCandles } from '../engine/sharedDerivativesSeries';

type TradeDraft = {
  symbol: string;
  strategyId: string | null;
  side: PositionSide;
  entryPrice: number;
  exitPrice: number;
  quantity: number;
  openedAt: Date;
  closedAt: Date;
  pnl: number;
  fee: number;
  exitReason: 'SIGNAL_EXIT' | 'FINAL_CANDLE' | 'LIQUIDATION';
  liquidated: boolean;
};

type SymbolSimulationResult = {
  trades: TradeDraft[];
  liquidations: number;
  events: ReplayEventDraft[];
  eventCounts: Record<ReplayEventType, number>;
  decisionTrace: ReplayParityDecisionTrace[];
};

type InterleavedPortfolioSimulationResult = {
  perSymbol: Record<string, SymbolSimulationResult>;
  finalBalance: number;
};

export type BacktestStrategyLinkSnapshot = {
  strategyId: string;
  config?: Record<string, unknown> | null;
  walletRiskPercent?: number | null;
  priority?: number | null;
  weight?: number | null;
  marketGroupStrategyLinkId?: string | null;
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const buildDerivativesSeriesForCandles = (
  candles: KlineCandle[],
  supplemental?: SupplementalSeries,
): StrategySignalDerivativesSeries => {
  if (!supplemental) return {};
  return {
    fundingRate: alignTimedNumericPointsToCandles(
      candles,
      supplemental.fundingRates.map((point) => ({
        timestamp: point.timestamp,
        value: point.fundingRate,
      })),
    ),
    openInterest: alignTimedNumericPointsToCandles(
      candles,
      supplemental.openInterest.map((point) => ({
        timestamp: point.timestamp,
        value: point.openInterest,
      })),
    ),
    orderBookImbalance: alignTimedNumericPointsToCandles(
      candles,
      supplemental.orderBook.map((point) => ({
        timestamp: point.timestamp,
        value: point.imbalance,
      })),
    ),
    orderBookSpreadBps: alignTimedNumericPointsToCandles(
      candles,
      supplemental.orderBook.map((point) => ({
        timestamp: point.timestamp,
        value: point.spreadBps,
      })),
    ),
    orderBookDepthRatio: alignTimedNumericPointsToCandles(
      candles,
      supplemental.orderBook.map((point) => ({
        timestamp: point.timestamp,
        value: point.depthRatio,
      })),
    ),
  };
};

export const simulateInterleavedPortfolio = (input: {
  symbols: string[];
  candlesBySymbol: Map<string, KlineCandle[]>;
  supplementalBySymbol?: Map<string, SupplementalSeries>;
  analysisStartIndexBySymbol?: Map<string, number>;
  marketType: MarketType;
  leverage: number;
  marginMode: 'CROSSED' | 'ISOLATED' | 'NONE';
  strategyConfig?: Record<string, unknown> | null;
  primaryStrategyId?: string | null;
  strategyLinks?: BacktestStrategyLinkSnapshot[];
  minDirectionalScore?: number;
  fillModelConfig?: BacktestFillModelConfig;
  walletRiskPercent: number;
  initialBalance: number;
}): InterleavedPortfolioSimulationResult => {
  const effectiveLeverage = input.marketType === 'SPOT' ? 1 : Math.max(1, input.leverage);
  const fallbackStrategyLinks: BacktestStrategyLinkSnapshot[] =
    input.strategyLinks && input.strategyLinks.length > 0
      ? input.strategyLinks
      : input.strategyConfig && typeof input.strategyConfig === 'object'
        ? [{
            strategyId: input.primaryStrategyId ?? 'seed-strategy',
            config: input.strategyConfig,
            walletRiskPercent: input.walletRiskPercent,
          }]
        : [];
  const strategyRuntimeLinks = fallbackStrategyLinks.map((strategy, index) => ({
    strategyId: strategy.strategyId,
    strategyInterval: null,
    strategyConfig: strategy.config ?? null,
    strategyLeverage: effectiveLeverage,
    walletRisk: normalizeWalletRiskPercent(
      strategy.walletRiskPercent ?? input.walletRiskPercent,
      input.walletRiskPercent,
    ),
    priority: strategy.priority ?? 100,
    weight: strategy.weight ?? 1,
    marketGroupStrategyLinkId: strategy.marketGroupStrategyLinkId ?? `seed-link-${index}`,
  }));
  const strategyEvaluators = strategyRuntimeLinks.map((strategy) => ({
    ...strategy,
    rules: parseStrategySignalRules(strategy.strategyConfig),
    riskConfig: parseStrategyRiskConfig(strategy.strategyConfig),
  }));
  const strategyModeEnabled = strategyEvaluators.length > 0;
  const defaultRiskConfig = parseStrategyRiskConfig(input.strategyConfig);
  const fillModel = createHistoricalBacktestFillModel(input.fillModelConfig);

  const perSymbol: Record<string, SymbolSimulationResult> = Object.fromEntries(
    input.symbols.map((symbol) => [
      symbol,
      {
        trades: [],
        liquidations: 0,
        events: [],
        eventCounts: {
          ENTRY: 0,
          EXIT: 0,
          DCA: 0,
          TP: 0,
          TTP: 0,
          SL: 0,
          TSL: 0,
          LIQUIDATION: 0,
        },
        decisionTrace: [],
      } satisfies SymbolSimulationResult,
    ]),
  );

  const indicatorCacheBySymbol = new Map<string, Map<string, Array<number | null>>>();
  const derivativesSeriesBySymbol = new Map<string, StrategySignalDerivativesSeries>();
  for (const symbol of input.symbols) {
    const candles = input.candlesBySymbol.get(symbol) ?? [];
    const supplemental = input.supplementalBySymbol?.get(symbol);
    derivativesSeriesBySymbol.set(symbol, buildDerivativesSeriesForCandles(candles, supplemental));
  }
  const tradeSequenceBySymbol = new Map<string, number>(input.symbols.map((symbol) => [symbol, 0]));
  const resolveStartIndex = (symbol: string) => {
    const candles = input.candlesBySymbol.get(symbol) ?? [];
    if (candles.length <= 1) return 1;
    const configuredStart = input.analysisStartIndexBySymbol?.get(symbol);
    if (typeof configuredStart !== 'number' || !Number.isFinite(configuredStart)) return 1;
    return clamp(Math.floor(configuredStart), 1, candles.length - 1);
  };
  const cursorBySymbol = new Map<string, number>(input.symbols.map((symbol) => [symbol, resolveStartIndex(symbol)]));
  const openPositions = new Map<string, {
    side: 'LONG' | 'SHORT';
    entryPrice: number;
    quantity: number;
    openedAt: Date;
    dcaCount: number;
    lastDcaPrice: number;
    bestPrice: number;
    marginUsed: number;
    executedDcaLevelIndices?: number[];
    trailingLossLimit?: number;
    trailingTakeProfitHigh?: number;
    trailingTakeProfitStep?: number;
    strategyId: string | null;
    riskConfig: ReturnType<typeof parseStrategyRiskConfig>;
  }>();

  let cashBalance = Math.max(0, input.initialBalance);
  const calcReservedMargin = () =>
    [...openPositions.values()].reduce((sum, position) => sum + position.marginUsed, 0);
  const calcReferenceBalance = () => Math.max(0, cashBalance + calcReservedMargin());

  const pickNextSymbol = () => {
    let selected: { symbol: string; openTime: number } | null = null;
    for (const symbol of input.symbols) {
      const candles = input.candlesBySymbol.get(symbol) ?? [];
      const cursor = cursorBySymbol.get(symbol) ?? resolveStartIndex(symbol);
      if (cursor >= candles.length) continue;
      const openTime = candles[cursor].openTime;
      if (!selected || openTime < selected.openTime || (openTime === selected.openTime && symbol.localeCompare(selected.symbol) < 0)) {
        selected = { symbol, openTime };
      }
    }
    return selected?.symbol ?? null;
  };

  const pushEvent = (
    symbol: string,
    type: ReplayEventType,
    side: PositionSide,
    timestamp: Date,
    price: number,
    pnl: number | null,
    candleIndex: number,
    tradeSequence: number,
  ) => {
    const bucket = perSymbol[symbol];
    bucket.events.push({
      symbol,
      type,
      side,
      timestamp,
      price,
      pnl,
      candleIndex,
      tradeSequence,
    });
    bucket.eventCounts[type] += 1;
  };

  while (true) {
    const symbol = pickNextSymbol();
    if (!symbol) break;
    const candles = input.candlesBySymbol.get(symbol) ?? [];
    const index = cursorBySymbol.get(symbol) ?? resolveStartIndex(symbol);
    const current = candles[index];
    const previous = candles[index - 1];
    const bucket = perSymbol[symbol];
    const indicatorCache = indicatorCacheBySymbol.get(symbol) ?? new Map<string, Array<number | null>>();
    indicatorCacheBySymbol.set(symbol, indicatorCache);
    const derivativesSeries = derivativesSeriesBySymbol.get(symbol);
    const mergedDecision = strategyModeEnabled
      ? mergeRuntimeStrategyVotes({
          strategies: strategyRuntimeLinks,
          votes: strategyEvaluators
            .map((strategy): StrategyVote | null => {
              if (!strategy.rules) return null;
              const direction = evaluateStrategySignalAtIndex(strategy.rules, candles, index, indicatorCache, {
                derivatives: derivativesSeries,
              });
              if (!direction) return null;
              return {
                strategyId: strategy.strategyId,
                direction,
                priority: strategy.priority ?? 100,
                weight: strategy.weight ?? 1,
                marketGroupStrategyLinkId: strategy.marketGroupStrategyLinkId,
              };
            })
            .filter((vote): vote is StrategyVote => Boolean(vote)),
          minDirectionalScore: input.minDirectionalScore ?? 1,
        })
      : null;
    const mergedWinner = mergedDecision?.metadata?.winner;
    const selectedStrategyLinkId =
      mergedWinner && typeof mergedWinner === 'object'
        ? (mergedWinner as { marketGroupStrategyLinkId?: unknown }).marketGroupStrategyLinkId
        : null;
    const selectedStrategy = mergedDecision?.strategyId
      ? strategyEvaluators.find(
          (strategy) =>
            strategy.strategyId === mergedDecision.strategyId &&
            (typeof selectedStrategyLinkId !== 'string' ||
              strategy.marketGroupStrategyLinkId === selectedStrategyLinkId),
        ) ?? strategyEvaluators.find((strategy) => strategy.strategyId === mergedDecision.strategyId)
      : undefined;
    const direction = strategyModeEnabled
      ? mergedDecision?.direction
      : (() => {
        const base = previous.close > 0 ? previous.close : 1;
        const changePct = ((current.close - previous.close) / base) * 100;
        if (changePct >= 1) return 'LONG';
        if (changePct <= -1) return 'SHORT';
        if (Math.abs(changePct) <= 0.2) return 'EXIT';
        return null;
      })();
    const open = openPositions.get(symbol);
    const rawDecision = direction
      ? decideExecutionAction(
          direction,
          open
            ? { side: open.side, quantity: open.quantity, managementMode: 'BOT_MANAGED' }
            : null,
        )
      : null;
    const decision:
      | ReturnType<typeof decideExecutionAction>
      | { kind: 'ignore'; reason: 'strategy_exit_trace_only' }
      | null =
      direction === 'EXIT' && rawDecision?.kind === 'close'
        ? { kind: 'ignore', reason: 'strategy_exit_trace_only' }
        : rawDecision;

    if (direction && decision) {
      const traceSide: PositionSide | null =
        decision.kind === 'open'
          ? (decision.positionSide as PositionSide)
          : open
            ? (open.side as PositionSide)
            : direction === 'LONG' || direction === 'SHORT'
              ? (direction as PositionSide)
              : null;
      bucket.decisionTrace.push({
        symbol,
        timestamp: new Date(current.openTime),
        candleIndex: index,
        signal: direction,
        strategyId: mergedDecision?.strategyId ?? null,
        ...(mergedDecision ? { merge: mergedDecision.metadata } : {}),
        side: traceSide,
        trigger: strategyModeEnabled ? 'STRATEGY' : 'THRESHOLD',
        mismatchReason: decision.kind === 'ignore' ? decision.reason : null,
      });
    }

    if (decision?.kind === 'open') {
      const entryPrice = fillModel.entryPrice(current.close, decision.positionSide as PositionSide);
      const entryWalletRisk = selectedStrategy?.walletRisk ?? input.walletRiskPercent;
      const quantity = computeRiskBasedOrderQuantity({
        price: entryPrice,
        walletRiskPercent: entryWalletRisk,
        referenceBalance: calcReferenceBalance(),
        leverage: effectiveLeverage,
        minQuantity: 0.000001,
      });
      const marginRequired = (entryPrice * quantity) / Math.max(1, effectiveLeverage);
      if (marginRequired <= cashBalance && quantity > 0) {
        cashBalance -= marginRequired;
        const sequence = (tradeSequenceBySymbol.get(symbol) ?? 0) + 1;
        tradeSequenceBySymbol.set(symbol, sequence);
        openPositions.set(symbol, {
          side: decision.positionSide,
          entryPrice,
          quantity,
          openedAt: new Date(current.openTime),
          dcaCount: 0,
          lastDcaPrice: entryPrice,
          bestPrice: entryPrice,
          marginUsed: marginRequired,
          executedDcaLevelIndices: undefined,
          strategyId: selectedStrategy?.strategyId ?? null,
          riskConfig: selectedStrategy?.riskConfig ?? defaultRiskConfig,
        });
        pushEvent(symbol, 'ENTRY', decision.positionSide as PositionSide, new Date(current.openTime), entryPrice, null, index, sequence);
      }
      cursorBySymbol.set(symbol, index + 1);
      continue;
    }

    if (!open) {
      cursorBySymbol.set(symbol, index + 1);
      continue;
    }

    const position = open;
    const riskConfig = position.riskConfig;
    if (position.side === 'LONG') position.bestPrice = Math.max(position.bestPrice, current.high);
    else position.bestPrice = Math.min(position.bestPrice, current.low);

    const baseState = {
      averageEntryPrice: position.entryPrice,
      quantity: position.quantity,
      currentAdds: position.dcaCount,
      trailingAnchorPrice: position.bestPrice,
      trailingLossLimitPercent: position.trailingLossLimit,
      trailingTakeProfitHighPercent: position.trailingTakeProfitHigh,
      trailingTakeProfitStepPercent: position.trailingTakeProfitStep,
      lastDcaPrice: position.lastDcaPrice,
      executedDcaLevelIndices: position.executedDcaLevelIndices,
    };

    const dcaProbeInput: PositionManagementInput = {
      ...buildReplayPositionManagementInput({
        side: position.side,
        currentPrice: resolveReplayDcaProbePrice({
          side: position.side,
          candle: current,
          entryPrice: position.entryPrice,
          leverage: effectiveLeverage,
          riskConfig,
          executedDcaLevelIndices: position.executedDcaLevelIndices,
        }),
        entryPrice: position.entryPrice,
        leverage: effectiveLeverage,
        riskConfig,
      }),
      takeProfitPrice: undefined,
      stopLossPrice: undefined,
      trailingTakeProfit: undefined,
      trailingTakeProfitLevels: undefined,
      trailingStop: undefined,
      trailingStopLevels: undefined,
      trailingLoss: undefined,
    };
    const dcaProbeResult = evaluatePositionManagement(dcaProbeInput, baseState);
    const hasPendingDcaLevels = position.dcaCount < riskConfig.maxDcaPerTrade;
    const estimatedNextDcaAddedQty = dcaProbeResult.dcaExecuted
      ? Math.max(0, dcaProbeResult.dcaAddedQuantity)
      : 0;
    const dcaFillPrice = dcaProbeResult.nextState.lastDcaPrice ?? dcaProbeInput.currentPrice ?? current.close;
    const estimatedNextDcaMargin = (dcaFillPrice * estimatedNextDcaAddedQty) / Math.max(1, effectiveLeverage);
    const dcaFundsExhausted =
      hasPendingDcaLevels && estimatedNextDcaAddedQty > 0
        ? estimatedNextDcaMargin > cashBalance
        : false;
    const lockTrailingByPendingDca = hasPendingDcaLevels && !dcaFundsExhausted;

    if (dcaProbeResult.dcaExecuted) {
      const addedQty = Math.max(0, dcaProbeResult.nextState.quantity - position.quantity);
      const addMargin = (dcaFillPrice * addedQty) / Math.max(1, effectiveLeverage);
      if (addMargin > cashBalance) {
        const managementWithoutDca: PositionManagementInput = {
          ...dcaProbeInput,
          dca: undefined,
        };
        const noDcaProbe = evaluatePositionManagement(managementWithoutDca, baseState);
        position.trailingLossLimit = noDcaProbe.nextState.trailingLossLimitPercent;
        position.trailingTakeProfitHigh = noDcaProbe.nextState.trailingTakeProfitHighPercent;
        position.trailingTakeProfitStep = noDcaProbe.nextState.trailingTakeProfitStepPercent;
        position.bestPrice = noDcaProbe.nextState.trailingAnchorPrice ?? position.bestPrice;
      } else {
        cashBalance -= addMargin;
        position.marginUsed += addMargin;
        position.quantity = dcaProbeResult.nextState.quantity;
        position.entryPrice = dcaProbeResult.nextState.averageEntryPrice;
        position.dcaCount = dcaProbeResult.nextState.currentAdds;
        position.executedDcaLevelIndices = dcaProbeResult.nextState.executedDcaLevelIndices;
        position.lastDcaPrice = dcaFillPrice;
        pushEvent(
          symbol,
          'DCA',
          position.side as PositionSide,
          new Date(current.openTime),
          dcaFillPrice,
          null,
          index,
          tradeSequenceBySymbol.get(symbol) ?? 1,
        );
      }
    }

    const managementInput = {
      ...buildReplayPositionManagementInput({
        side: position.side,
        currentPrice: current.close,
        entryPrice: position.entryPrice,
        leverage: effectiveLeverage,
        riskConfig,
      }),
      dca: undefined,
      dcaFundsExhausted,
    } satisfies PositionManagementInput;
    let managementResult = evaluatePositionManagement(managementInput, {
      averageEntryPrice: position.entryPrice,
      quantity: position.quantity,
      currentAdds: position.dcaCount,
      trailingAnchorPrice: position.bestPrice,
      trailingLossLimitPercent: position.trailingLossLimit,
      trailingTakeProfitHighPercent: position.trailingTakeProfitHigh,
      trailingTakeProfitStepPercent: position.trailingTakeProfitStep,
      lastDcaPrice: position.lastDcaPrice,
      executedDcaLevelIndices: position.executedDcaLevelIndices,
    });

    position.trailingLossLimit = managementResult.nextState.trailingLossLimitPercent;
    position.trailingTakeProfitHigh = managementResult.nextState.trailingTakeProfitHighPercent;
    position.trailingTakeProfitStep = managementResult.nextState.trailingTakeProfitStepPercent;
    position.bestPrice = managementResult.nextState.trailingAnchorPrice ?? position.bestPrice;

    if (
      managementResult.shouldClose &&
      shouldBlockCloseByPendingDca({
        lockTrailingByPendingDca,
        closeReason: managementResult.closeReason,
        riskConfig,
        executedDcaLevelIndices: position.executedDcaLevelIndices,
      })
    ) {
      managementResult = {
        ...managementResult,
        shouldClose: false,
        closeReason: undefined,
      };
    }

    const exitMarkPrice = current.close;

    const adverseMove =
      position.side === 'LONG'
        ? (position.entryPrice - current.low) / Math.max(position.entryPrice, 1e-8)
        : (current.high - position.entryPrice) / Math.max(position.entryPrice, 1e-8);

    const isolatedThreshold = 1 / Math.max(1, effectiveLeverage);
    const isIsolatedLiquidated =
      input.marketType === 'FUTURES' &&
      input.marginMode === 'ISOLATED' &&
      adverseMove >= isolatedThreshold;
    if (!isIsolatedLiquidated && !managementResult.shouldClose) {
      cursorBySymbol.set(symbol, index + 1);
      continue;
    }

    const clampedExitMarkPrice = clamp(exitMarkPrice, current.low, current.high);
    const exitPrice = fillModel.exitPrice(clampedExitMarkPrice, position.side as PositionSide);
    const settlement = fillModel.settle({
      side: position.side as PositionSide,
      entryPrice: position.entryPrice,
      exitPrice,
      quantity: position.quantity,
      leverage: effectiveLeverage,
    });
    const rawPnl = settlement.grossPnl - settlement.fees;
    let pnl = isIsolatedLiquidated ? -position.marginUsed : rawPnl;
    if (input.marginMode === 'ISOLATED') {
      pnl = Math.max(-position.marginUsed, pnl);
    }
    let nextCash = cashBalance + position.marginUsed + pnl;
    if (nextCash < 0) {
      pnl = -(cashBalance + position.marginUsed);
      nextCash = 0;
    }
    cashBalance = nextCash;

    const closeType: ReplayEventType = isIsolatedLiquidated
      ? 'LIQUIDATION'
      : managementResult.shouldClose
        ? closeReasonToEventType(managementResult.closeReason)
        : 'EXIT';
    if (isIsolatedLiquidated) {
      bucket.liquidations += 1;
    }
    bucket.trades.push({
      symbol,
      strategyId: position.strategyId,
      side: position.side as PositionSide,
      entryPrice: position.entryPrice,
      exitPrice,
      quantity: position.quantity,
      openedAt: position.openedAt,
      closedAt: new Date(current.closeTime),
      pnl,
      fee: settlement.fees,
      exitReason: isIsolatedLiquidated ? 'LIQUIDATION' : 'SIGNAL_EXIT',
      liquidated: isIsolatedLiquidated,
    });
    pushEvent(
      symbol,
      closeType,
      position.side as PositionSide,
      new Date(current.closeTime),
      exitPrice,
      pnl,
      index,
      tradeSequenceBySymbol.get(symbol) ?? 1,
    );
    openPositions.delete(symbol);
    cursorBySymbol.set(symbol, index + 1);
  }

  for (const [symbol, position] of openPositions.entries()) {
    const candles = input.candlesBySymbol.get(symbol) ?? [];
    if (candles.length === 0) continue;
    const last = candles[candles.length - 1];
    const exitPrice = fillModel.exitPrice(last.close, position.side as PositionSide);
    const settlement = fillModel.settle({
      side: position.side as PositionSide,
      entryPrice: position.entryPrice,
      exitPrice,
      quantity: position.quantity,
      leverage: effectiveLeverage,
    });
    let pnl = settlement.grossPnl - settlement.fees;
    if (input.marginMode === 'ISOLATED') {
      pnl = Math.max(-position.marginUsed, pnl);
    }
    let nextCash = cashBalance + position.marginUsed + pnl;
    if (nextCash < 0) {
      pnl = -(cashBalance + position.marginUsed);
      nextCash = 0;
    }
    cashBalance = nextCash;
    const bucket = perSymbol[symbol];
    bucket.trades.push({
      symbol,
      strategyId: position.strategyId,
      side: position.side as PositionSide,
      entryPrice: position.entryPrice,
      exitPrice,
      quantity: position.quantity,
      openedAt: position.openedAt,
      closedAt: new Date(last.closeTime),
      pnl,
      fee: settlement.fees,
      exitReason: 'FINAL_CANDLE',
      liquidated: false,
    });
    pushEvent(
      symbol,
      'EXIT',
      position.side as PositionSide,
      new Date(last.closeTime),
      exitPrice,
      pnl,
      candles.length - 1,
      tradeSequenceBySymbol.get(symbol) ?? 1,
    );
    bucket.decisionTrace.push({
      symbol,
      timestamp: new Date(last.closeTime),
      candleIndex: candles.length - 1,
      signal: 'EXIT',
      strategyId: position.strategyId,
      side: position.side as PositionSide,
      trigger: 'FINAL_CANDLE',
      mismatchReason: null,
    });
    openPositions.delete(symbol);
  }

  return {
    perSymbol,
    finalBalance: cashBalance + calcReservedMargin(),
  };
};
