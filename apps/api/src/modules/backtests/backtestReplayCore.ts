import { PositionSide } from '@prisma/client';
import { decideExecutionAction } from '../engine/sharedExecutionCore';
import { evaluatePositionManagement, rebasePositionManagementProtection } from '../engine/positionManagement.service';
import { DcaSizingBasis, PositionManagementInput, PositionManagementState } from '../engine/positionManagement.types';
import {
  buildStrategySignalPriceSeries,
  evaluateStrategySignalAtIndex,
  parseStrategySignalRules,
  type StrategySignalDerivativesSeries,
} from '../engine/strategySignalEvaluator';
import { computeRiskBasedOrderQuantity, normalizeWalletRiskPercent } from '../engine/positionSizing';
import { BacktestFillModelConfig, createHistoricalBacktestFillModel } from './backtestFillModel';
import { entryContribution, dcaContribution, type ReplayContributionDraft } from './backtestContributionDraft';
import { replayProtectionAfterConfirmedDca, resolveReplayDcaProbePrice,
  shouldBlockCloseByPendingDca, verifyReplayIntrabarTicks } from './backtestIntrabarReplay';
export { replayProtectionAfterConfirmedDca, resolveReplayDcaProbePrice,
  shouldBlockCloseByPendingDca, verifyReplayIntrabarTicks } from './backtestIntrabarReplay';

export type ReplayMarketType = 'SPOT' | 'FUTURES';
export type ReplayMarginMode = 'CROSSED' | 'ISOLATED' | 'NONE';

export type ReplayCandle = {
  openTime: number;
  closeTime: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  intrabarTicks?: Array<{ eventTime: number; price: number }>;
};

export type ReplayTradeDraft = {
  symbol: string;
  side: PositionSide;
  entryPrice: number;
  exitPrice: number;
  quantity: number;
  openedAt: Date;
  closedAt: Date;
  pnl: number;
  fee: number;
  exitReason: 'SIGNAL_EXIT' | 'FINAL_CANDLE' | 'LIQUIDATION' | 'TP' | 'SL' | 'TTP' | 'TSL';
  liquidated: boolean;
};

export type ReplayEventType =
  | 'ENTRY'
  | 'EXIT'
  | 'DCA'
  | 'TP'
  | 'TTP'
  | 'SL'
  | 'TSL'
  | 'LIQUIDATION';

export type ReplayEventDraft = {
  symbol: string;
  type: ReplayEventType;
  side: PositionSide;
  timestamp: Date;
  price: number;
  pnl: number | null;
  tradeSequence: number;
  candleIndex: number;
  contribution?: ReplayContributionDraft;
};

export type ReplayDcaFundsExhaustedSample = {
  timestamp: Date;
  candleIndex: number;
  side: PositionSide;
  levelIndex: number;
  price: number;
};

export type ReplayParityDecisionTrace = {
  symbol: string;
  timestamp: Date;
  candleIndex: number;
  signal: 'LONG' | 'SHORT' | 'EXIT';
  strategyId?: string | null;
  merge?: Record<string, unknown>;
  side: PositionSide | null;
  trigger: 'STRATEGY' | 'THRESHOLD' | 'FINAL_CANDLE';
  mismatchReason:
    | 'no_open_position'
    | 'no_flip_with_open_position'
    | 'already_open_same_side'
    | 'manual_managed_symbol'
    | 'strategy_exit_trace_only'
    | null;
};

export type ReplaySymbolSimulationResult = {
  trades: ReplayTradeDraft[];
  liquidations: number;
  events: ReplayEventDraft[];
  eventCounts: Record<ReplayEventType, number>;
  decisionTrace: ReplayParityDecisionTrace[];
  dcaFundsExhaustedCount: number;
  dcaFundsExhaustedSamples: ReplayDcaFundsExhaustedSample[];
};

type ReplayRuntimeConfig = {
  longThresholdPct: number;
  shortThresholdPct: number;
  exitBandPct: number;
};

export type StrategyRiskConfig = {
  takeProfitPct: number;
  trailingTakeProfitLevels: Array<{ arm: number; percent: number }>;
  stopLossPct: number;
  trailingStopLevels: Array<{ arm: number; percent: number }>;
  trailingLoss: { start: number; step: number } | null;
  trailingLossLevels: Array<{ start: number; step: number }>;
  maxDcaPerTrade: number;
  dcaLevels: number[];
  dcaMultipliers: number[];
  dcaSizingBasis: DcaSizingBasis;
};

type TtpLevel = {
  arm: number;
  percent: number;
};

const computeRiskPriceFromPercent = (
  side: 'LONG' | 'SHORT',
  entryPrice: number,
  percent: number,
  kind: 'tp' | 'sl',
  leverage = 1
) => {
  if (!Number.isFinite(entryPrice) || entryPrice <= 0 || !Number.isFinite(percent) || percent <= 0) return undefined;
  const adjusted = percent / Math.max(1, leverage);
  if (kind === 'tp') {
    return side === 'LONG' ? entryPrice * (1 + adjusted) : entryPrice * (1 - adjusted);
  }
  return side === 'LONG' ? entryPrice * (1 - adjusted) : entryPrice * (1 + adjusted);
};

export const closeReasonToEventType = (reason?: 'take_profit' | 'trailing_take_profit' | 'stop_loss' | 'trailing_stop'): ReplayEventType => {
  switch (reason) {
    case 'take_profit':
      return 'TP';
    case 'trailing_take_profit':
      return 'TTP';
    case 'stop_loss':
      return 'SL';
    case 'trailing_stop':
      return 'TSL';
    default:
      return 'EXIT';
  }
};

export const computeTrailingTakeProfitTriggerPrice = (input: {
  side: PositionSide;
  entryPrice: number;
  anchorPrice: number;
  leverage: number;
  levels: TtpLevel[];
}): number | null => {
  const effectiveLeverage = Math.max(1, input.leverage);
  const peakFavorableMove =
    input.side === 'LONG'
      ? ((input.anchorPrice - input.entryPrice) / Math.max(input.entryPrice, 1e-8)) * effectiveLeverage
      : ((input.entryPrice - input.anchorPrice) / Math.max(input.entryPrice, 1e-8)) * effectiveLeverage;
  if (!Number.isFinite(peakFavorableMove) || peakFavorableMove <= 0) return null;

  const sorted = [...input.levels]
    .filter((level) => Number.isFinite(level.arm) && Number.isFinite(level.percent) && level.arm > 0 && level.percent > 0)
    .sort((left, right) => left.arm - right.arm);
  let active: TtpLevel | null = null;
  for (const level of sorted) {
    if (peakFavorableMove >= level.arm) active = level;
  }
  if (!active) return null;

  const floorMove = Math.max(0, peakFavorableMove - active.percent);
  if (floorMove <= 0) return null;
  const trigger =
    input.side === 'LONG'
      ? input.entryPrice * (1 + floorMove / effectiveLeverage)
      : input.entryPrice * (1 - floorMove / effectiveLeverage);
  return Number.isFinite(trigger) ? trigger : null;
};

export const buildReplayPositionManagementInput = (args: {
  side: 'LONG' | 'SHORT';
  currentPrice: number;
  entryPrice: number;
  leverage: number;
  riskConfig: StrategyRiskConfig;
}): PositionManagementInput => {
  const { side, currentPrice, entryPrice, leverage, riskConfig } = args;

  return {
    side,
    currentPrice,
    leverage,
    dcaSizingBasis: riskConfig.dcaSizingBasis,
    takeProfitPrice: Number.isFinite(riskConfig.takeProfitPct)
      ? computeRiskPriceFromPercent(side, entryPrice, riskConfig.takeProfitPct, 'tp', leverage)
      : undefined,
    stopLossPrice: Number.isFinite(riskConfig.stopLossPct)
      ? computeRiskPriceFromPercent(side, entryPrice, riskConfig.stopLossPct, 'sl', leverage)
      : undefined,
    trailingTakeProfitLevels:
      riskConfig.trailingTakeProfitLevels.length > 0
        ? riskConfig.trailingTakeProfitLevels.map((level) => ({
            armPercent: level.arm,
            trailPercent: level.percent,
          }))
        : undefined,
    trailingStopLevels:
      riskConfig.trailingStopLevels.length > 0
        ? riskConfig.trailingStopLevels.map((level) => ({
            armPercent: level.arm,
            type: 'percent' as const,
            value: level.percent,
          }))
        : undefined,
    trailingLoss: riskConfig.trailingLoss
      ? {
          enabled: true,
          startPercent: riskConfig.trailingLoss.start,
          stepPercent: riskConfig.trailingLoss.step,
        }
      : undefined,
    trailingLossLevels:
      (riskConfig.dcaSizingBasis === 'usdt_contribution_v1' ||
        riskConfig.trailingLossLevels.length > 1) && riskConfig.trailingLossLevels.length > 0
        ? riskConfig.trailingLossLevels.map((level) => ({
            startPercent: level.start, stepPercent: level.step,
          }))
        : undefined,
    dca:
      riskConfig.maxDcaPerTrade > 0
        ? {
            enabled: true,
            maxAdds: riskConfig.maxDcaPerTrade,
            stepPercent: Math.max(0.0001, Math.abs(riskConfig.dcaLevels[0] ?? 0.01)),
            addSizeFraction: Math.max(0.01, riskConfig.dcaMultipliers[0] ?? 1),
            levelPercents: riskConfig.dcaLevels,
            addSizeFractions: riskConfig.dcaMultipliers,
            sizingBasis: riskConfig.dcaSizingBasis,
          }
        : undefined,
  };
};

const defaultConfig: ReplayRuntimeConfig = {
  longThresholdPct: 1,
  shortThresholdPct: -1,
  exitBandPct: 0.2,
};
const defaultRiskConfig: StrategyRiskConfig = {
  takeProfitPct: 0.012,
  trailingTakeProfitLevels: [],
  stopLossPct: 0.01,
  trailingStopLevels: [{ arm: 0.006, percent: 0.0075 }],
  trailingLoss: null,
  trailingLossLevels: [],
  maxDcaPerTrade: 1,
  dcaLevels: [-0.008],
  dcaMultipliers: [1],
  dcaSizingBasis: 'quantity_v1',
};

const parseDcaSizingBasis = (value: unknown): DcaSizingBasis => {
  if (value == null || value === 'quantity_v1') return 'quantity_v1';
  if (value === 'usdt_contribution_v1') return value;
  throw new Error('Unsupported DCA sizing basis in backtest strategy snapshot');
};

const toSignalDirection = (
  current: ReplayCandle,
  previous: ReplayCandle,
  config: ReplayRuntimeConfig
): 'LONG' | 'SHORT' | 'EXIT' | null => {
  const base = previous.close > 0 ? previous.close : 1;
  const changePct = ((current.close - previous.close) / base) * 100;
  if (changePct >= config.longThresholdPct) return 'LONG';
  if (changePct <= config.shortThresholdPct) return 'SHORT';
  if (Math.abs(changePct) <= config.exitBandPct) return 'EXIT';
  return null;
};

const asPercent = (value: unknown, fallback: number) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.abs(parsed) / 100;
};

const asSignedPercent = (value: unknown, fallback: number) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return parsed / 100;
};

export const parseStrategyRiskConfig = (strategyConfig?: Record<string, unknown> | null): StrategyRiskConfig => {
  if (!strategyConfig || typeof strategyConfig !== 'object') return defaultRiskConfig;

  const close = (strategyConfig.close as {
    mode?: unknown;
    tp?: unknown;
    ttp?: Array<{ percent?: unknown; arm?: unknown }>;
    sl?: unknown;
    tsl?: Array<{ percent?: unknown; arm?: unknown }>;
  } | undefined) ?? { };
  const additional = (strategyConfig.additional as {
    dcaEnabled?: unknown;
    dcaMode?: unknown;
    dcaTimes?: unknown;
    dcaLevels?: Array<{ percent?: unknown; multiplier?: unknown }>;
    dcaSizingBasis?: unknown;
  } | undefined) ?? { };

  const closeMode = close.mode === 'advanced' ? 'advanced' : 'basic';
  const takeProfitPct = asPercent(close.tp, defaultRiskConfig.takeProfitPct * 100);
  const stopLossPct = asPercent(close.sl, defaultRiskConfig.stopLossPct * 100);
  const trailingTakeProfitLevels = (Array.isArray(close.ttp) ? close.ttp : [])
    .map((level) => ({
      // UI contract: `percent` = activation threshold (start), `arm` = trailing step.
      arm: asPercent(level?.percent, Number.NaN),
      percent: asPercent(level?.arm, Number.NaN),
    }))
    .filter((level) => Number.isFinite(level.arm) && Number.isFinite(level.percent) && level.arm > 0 && level.percent > 0)
    .sort((left, right) => left.arm - right.arm);
  const parsedTrailingStopLevels = (Array.isArray(close.tsl) ? close.tsl : [])
    .map((level) => ({
      arm: Math.abs(asSignedPercent((level as { percent?: unknown })?.percent, Number.NaN)),
      percent: asPercent((level as { arm?: unknown })?.arm, Number.NaN),
    }))
    .filter((level) => Number.isFinite(level.arm) && level.arm > 0 && Number.isFinite(level.percent) && level.percent > 0)
    .map(({ arm, percent }) => ({ arm, percent }))
    .sort((left, right) => left.arm - right.arm);
  const trailingLossRawPercent = Number((Array.isArray(close.tsl) ? close.tsl : [])[0]?.percent);
  const trailingLossRawStep = Number((Array.isArray(close.tsl) ? close.tsl : [])[0]?.arm);
  const trailingLoss =
    Number.isFinite(trailingLossRawPercent) &&
    Number.isFinite(trailingLossRawStep) &&
    trailingLossRawPercent < 0 &&
    trailingLossRawStep > 0
      ? { start: trailingLossRawPercent / 100, step: Math.abs(trailingLossRawStep) / 100 }
      : null;
  const trailingLossLevels = (Array.isArray(close.tsl) ? close.tsl : [])
    .map((level) => ({
      start: asSignedPercent(level?.percent, Number.NaN),
      step: asPercent(level?.arm, Number.NaN),
    }))
    .filter((level) => Number.isFinite(level.start) && level.start < 0 &&
      Number.isFinite(level.step) && level.step > 0)
    .sort((left, right) => left.start - right.start);
  const dcaMode = additional.dcaMode === 'advanced' ? 'advanced' : 'basic';
  const dcaSizingBasis = parseDcaSizingBasis(additional.dcaSizingBasis);
  const maxDcaRaw = Number(additional.dcaTimes);
  const dcaEnabled = Boolean(additional.dcaEnabled ?? true);
  const configuredMaxDcaPerTrade = dcaEnabled
    ? Number.isFinite(maxDcaRaw)
      ? Math.max(0, Math.floor(maxDcaRaw))
      : defaultRiskConfig.maxDcaPerTrade
    : 0;
  const rawDcaLevels = Array.isArray(additional.dcaLevels) ? additional.dcaLevels : [];
  const quotePairs = dcaSizingBasis === 'usdt_contribution_v1' && dcaEnabled
    ? rawDcaLevels.map((level, index) => {
        const percent = asSignedPercent(level?.percent, Number.NaN);
        const multiplier = Number(level?.multiplier);
        if (!Number.isFinite(percent) || percent === 0 || !Number.isFinite(multiplier) || multiplier <= 0 || multiplier > 10) {
          throw new Error(`Invalid USDT DCA level at index ${index}`);
        }
        return { percent, multiplier };
      })
    : null;
  if (dcaSizingBasis === 'usdt_contribution_v1' && dcaEnabled &&
      (dcaMode === 'advanced' || configuredMaxDcaPerTrade > 0) && quotePairs?.length === 0) {
    throw new Error('USDT DCA requires an explicit level');
  }
  const configuredLevels = quotePairs
    ? quotePairs.map((level) => level.percent)
    : rawDcaLevels
        .map((level) => asSignedPercent(level?.percent, Number.NaN))
        .filter((value) => Number.isFinite(value) && value !== 0);
  const configuredMultipliers = quotePairs
    ? quotePairs.map((level) => level.multiplier)
    : rawDcaLevels
        .map((level) => Number(level?.multiplier))
        .filter((value) => Number.isFinite(value) && value > 0);
  const dcaLevels =
    !dcaEnabled
      ? []
      : dcaMode === 'advanced'
        ? configuredLevels.length > 0
          ? configuredLevels
          : Array.from(
              { length: Math.max(1, configuredMaxDcaPerTrade || defaultRiskConfig.maxDcaPerTrade) },
              () => defaultRiskConfig.dcaLevels[0],
            )
        : configuredMaxDcaPerTrade > 0
          ? Array.from(
              { length: Math.max(1, configuredMaxDcaPerTrade) },
              () => configuredLevels[0] ?? defaultRiskConfig.dcaLevels[0],
            )
          : [];
  const dcaMultipliers =
    dcaLevels.length === 0
      ? []
      : dcaMode === 'advanced'
        ? configuredMultipliers.length > 0
          ? configuredMultipliers.slice(0, dcaLevels.length)
          : Array.from({ length: dcaLevels.length }, () => defaultRiskConfig.dcaMultipliers[0])
        : Array.from(
            { length: dcaLevels.length },
            () => configuredMultipliers[0] ?? defaultRiskConfig.dcaMultipliers[0],
          );

  return {
    takeProfitPct: closeMode === 'basic' ? Math.max(0.0001, takeProfitPct) : Number.POSITIVE_INFINITY,
    trailingTakeProfitLevels: closeMode === 'advanced' ? trailingTakeProfitLevels : [],
    stopLossPct: closeMode === 'basic' ? Math.max(0.0001, stopLossPct) : Number.POSITIVE_INFINITY,
    trailingStopLevels: closeMode === 'advanced' && !trailingLoss ? parsedTrailingStopLevels : [],
    trailingLoss: closeMode === 'advanced' ? trailingLoss : null,
    trailingLossLevels: closeMode === 'advanced' ? trailingLossLevels : [],
    maxDcaPerTrade: dcaLevels.length,
    dcaLevels,
    dcaMultipliers,
    dcaSizingBasis,
  };
};


export const simulateTradesForSymbolReplay = (input: {
  symbol: string;
  candles: ReplayCandle[];
  marketType: ReplayMarketType;
  leverage: number;
  marginMode: ReplayMarginMode;
  config?: Partial<ReplayRuntimeConfig>;
  strategyConfig?: Record<string, unknown> | null;
  fillModelConfig?: BacktestFillModelConfig;
  derivativesSeries?: StrategySignalDerivativesSeries;
  positionSizing?: {
    mode: 'fixed' | 'wallet_risk';
    fixedQuantity?: number;
    walletRiskPercent?: number;
    referenceBalance?: number;
  };
}): ReplaySymbolSimulationResult => {
  const { symbol, candles, marketType, marginMode } = input;
  const initialEventCounts: Record<ReplayEventType, number> = {
    ENTRY: 0,
    EXIT: 0,
    DCA: 0,
    TP: 0,
    TTP: 0,
    SL: 0,
    TSL: 0,
    LIQUIDATION: 0,
  };
  if (candles.length < 3) {
    return { trades: [], liquidations: 0, events: [], eventCounts: initialEventCounts,
      decisionTrace: [], dcaFundsExhaustedCount: 0, dcaFundsExhaustedSamples: [] };
  }

  const config: ReplayRuntimeConfig = {
    longThresholdPct: input.config?.longThresholdPct ?? defaultConfig.longThresholdPct,
    shortThresholdPct: input.config?.shortThresholdPct ?? defaultConfig.shortThresholdPct,
    exitBandPct: input.config?.exitBandPct ?? defaultConfig.exitBandPct,
  };
  const strategyRules = parseStrategySignalRules(input.strategyConfig);
  const strategyModeEnabled = Boolean(input.strategyConfig && typeof input.strategyConfig === 'object');
  const riskConfig = parseStrategyRiskConfig(input.strategyConfig);
  const indicatorSeriesCache = new Map<string, Array<number | null>>();
  const strategyPriceSeries = strategyModeEnabled ? buildStrategySignalPriceSeries(candles) : undefined;
  const fillModel = createHistoricalBacktestFillModel(input.fillModelConfig);
  const positionSizingMode = input.positionSizing?.mode ?? 'fixed';
  const fixedQuantity = Math.max(0.000001, Number(input.positionSizing?.fixedQuantity ?? 1));
  const sizingWalletRisk = normalizeWalletRiskPercent(input.positionSizing?.walletRiskPercent ?? 1, 1);
  const sizingReferenceBalance = Math.max(0, Number(input.positionSizing?.referenceBalance ?? 0));
  const trackedBalanceEnabled = Number.isFinite(sizingReferenceBalance) && sizingReferenceBalance > 0;

  const effectiveLeverage = marketType === 'SPOT' ? 1 : Math.max(1, input.leverage);
  const trades: ReplayTradeDraft[] = [];
  const events: ReplayEventDraft[] = [];
  const eventCounts: Record<ReplayEventType, number> = { ...initialEventCounts };
  const decisionTrace: ReplayParityDecisionTrace[] = [];
  const dcaFundsExhaustedSamples: ReplayDcaFundsExhaustedSample[] = [];
  let dcaFundsExhaustedCount = 0;
  let accountBalance = trackedBalanceEnabled ? sizingReferenceBalance : Number.POSITIVE_INFINITY;
  let liquidations = 0;
  let tradeSequence = 0;
  let openPosition:
      | {
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
        trailingLossActiveLevelIndex?: number;
        trailingTakeProfitHigh?: number;
        trailingTakeProfitStep?: number;
        trailingTakeProfitActiveLevelIndex?: number;
      }
    | null = null;

  const pushEvent = (
    type: ReplayEventType,
    side: PositionSide,
    timestamp: Date,
    price: number,
    pnl: number | null,
    candleIndex: number,
    sequence: number,
    contribution?: ReplayContributionDraft,
  ) => {
    events.push({
      symbol,
      type,
      side,
      timestamp,
      price,
      pnl,
      candleIndex,
      tradeSequence: sequence,
      contribution,
    });
    eventCounts[type] += 1;
  };

  const settleToAccount = (proposedPnl: number, returnedMargin = 0) => {
    if (!Number.isFinite(accountBalance)) return proposedPnl;
    const availableForSettlement = accountBalance + Math.max(0, returnedMargin);
    const bounded = Math.max(-availableForSettlement, proposedPnl);
    accountBalance = Math.max(0, accountBalance + Math.max(0, returnedMargin) + bounded);
    return bounded;
  };

  for (let index = 1; index < candles.length; index += 1) {
    const previous = candles[index - 1];
    const current = candles[index];
    const direction = strategyModeEnabled
      ? strategyRules
        ? evaluateStrategySignalAtIndex(strategyRules, candles, index, indicatorSeriesCache, {
            derivatives: input.derivativesSeries,
            priceSeries: strategyPriceSeries,
          })
        : null
      : toSignalDirection(current, previous, config);
    const rawDecision: ReturnType<typeof decideExecutionAction> | null = direction
      ? decideExecutionAction(
          direction,
          openPosition
            ? {
                side: openPosition.side,
                quantity: openPosition.quantity,
                managementMode: 'BOT_MANAGED',
              }
            : null
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
          : openPosition
            ? (openPosition.side as PositionSide)
            : direction === 'LONG' || direction === 'SHORT'
              ? (direction as PositionSide)
              : null;
      decisionTrace.push({
        symbol,
        timestamp: new Date(current.openTime),
        candleIndex: index,
        signal: direction,
        side: traceSide,
        trigger: strategyModeEnabled ? 'STRATEGY' : 'THRESHOLD',
        mismatchReason: decision.kind === 'ignore' ? decision.reason : null,
      });
    }

    if (decision?.kind === 'open') {
      if (accountBalance <= 0) {
        continue;
      }
      const effectiveEntryPrice = fillModel.entryPrice(current.close, decision.positionSide as PositionSide);
      const initialQuantity =
        positionSizingMode === 'wallet_risk'
          ? computeRiskBasedOrderQuantity({
              price: effectiveEntryPrice,
              walletRiskPercent: sizingWalletRisk,
              referenceBalance: Number.isFinite(accountBalance) ? accountBalance : sizingReferenceBalance,
              leverage: effectiveLeverage,
              minQuantity: fixedQuantity,
            })
          : fixedQuantity;
      const initialMargin = (effectiveEntryPrice * initialQuantity) / Math.max(1, effectiveLeverage);
      if (Number.isFinite(accountBalance) && initialMargin > accountBalance) {
        continue;
      }
      if (Number.isFinite(accountBalance)) {
        accountBalance = Math.max(0, accountBalance - initialMargin);
      }
      tradeSequence += 1;
      openPosition = {
        side: decision.positionSide,
        entryPrice: effectiveEntryPrice,
        quantity: initialQuantity,
        openedAt: new Date(current.openTime),
        dcaCount: 0,
        lastDcaPrice: effectiveEntryPrice,
        bestPrice: effectiveEntryPrice,
        marginUsed: initialMargin,
        executedDcaLevelIndices: undefined,
      };
      pushEvent('ENTRY', decision.positionSide as PositionSide, new Date(current.openTime),
        effectiveEntryPrice, null, index, tradeSequence,
        entryContribution(effectiveEntryPrice, initialQuantity));
      continue;
    }

    if (!openPosition) {
      continue;
    }
    const replayPosition = openPosition;

    const priorBestPrice = openPosition.bestPrice;
    if (openPosition.side === 'LONG') {
      openPosition.bestPrice = Math.max(openPosition.bestPrice, current.high);
    } else {
      openPosition.bestPrice = Math.min(openPosition.bestPrice, current.low);
    }

    const baseState = {
      averageEntryPrice: openPosition.entryPrice,
      quantity: openPosition.quantity,
      currentAdds: openPosition.dcaCount,
      trailingAnchorPrice: openPosition.bestPrice,
      trailingLossLimitPercent: openPosition.trailingLossLimit,
      trailingLossActiveLevelIndex: openPosition.trailingLossActiveLevelIndex,
      trailingTakeProfitHighPercent: openPosition.trailingTakeProfitHigh,
      trailingTakeProfitStepPercent: openPosition.trailingTakeProfitStep,
      trailingTakeProfitActiveLevelIndex: openPosition.trailingTakeProfitActiveLevelIndex,
      lastDcaPrice: openPosition.lastDcaPrice,
      executedDcaLevelIndices: openPosition.executedDcaLevelIndices,
    } satisfies PositionManagementState;

    const orderedTicks = verifyReplayIntrabarTicks(current);
    const dcaProbeInput: PositionManagementInput = {
      ...buildReplayPositionManagementInput({
        side: openPosition.side,
        currentPrice: resolveReplayDcaProbePrice({
          side: openPosition.side,
          candle: current,
          entryPrice: openPosition.entryPrice,
          leverage: effectiveLeverage,
          riskConfig,
          executedDcaLevelIndices: openPosition.executedDcaLevelIndices,
          orderedTicks,
        }),
        entryPrice: openPosition.entryPrice,
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
      trailingLossLevels: undefined,
    };
    const dcaProbeResult = evaluatePositionManagement(dcaProbeInput, baseState);
    const hasPendingDcaLevels = openPosition.dcaCount < riskConfig.maxDcaPerTrade;
    const addedQty = dcaProbeResult.dcaExecuted
      ? Math.max(0, dcaProbeResult.nextState.quantity - openPosition.quantity)
      : 0;
    const dcaFillPrice = dcaProbeResult.nextState.lastDcaPrice ?? dcaProbeInput.currentPrice ?? current.close;
    const addMargin = (dcaFillPrice * addedQty) / Math.max(1, effectiveLeverage);
    const dcaFundsExhausted =
      trackedBalanceEnabled && hasPendingDcaLevels && addedQty > 0
        ? addMargin > accountBalance
        : false;
    if (dcaFundsExhausted && dcaProbeResult.dcaLevelIndex != null) {
      dcaFundsExhaustedCount += 1;
      if (dcaFundsExhaustedSamples.length < 25) dcaFundsExhaustedSamples.push({
        timestamp: new Date(current.openTime), candleIndex: index,
        side: openPosition.side as PositionSide,
        levelIndex: dcaProbeResult.dcaLevelIndex, price: dcaFillPrice,
      });
    }
    const lockTrailingByPendingDca = hasPendingDcaLevels &&
      (!dcaFundsExhausted || riskConfig.dcaSizingBasis === 'usdt_contribution_v1');
    const dcaFilledThisCandle = dcaProbeResult.dcaExecuted && !dcaFundsExhausted;
    if (orderedTicks && dcaFilledThisCandle) {
      const fillIndex = orderedTicks.findIndex((tick) => Math.abs(tick.price - dcaFillPrice) <= 1e-9);
      if (fillIndex < 0) throw new Error('BACKTEST_DCA_FILL_TICK_MISSING');
      openPosition.bestPrice = orderedTicks.slice(0, fillIndex + 1).reduce((best, tick) =>
        replayPosition.side === 'LONG' ? Math.max(best, tick.price) : Math.min(best, tick.price),
      priorBestPrice);
    }
    if (dcaProbeResult.dcaExecuted) {
      if (!trackedBalanceEnabled || addMargin <= accountBalance) {
        if (Number.isFinite(accountBalance)) {
          accountBalance = Math.max(0, accountBalance - addMargin);
        }
        openPosition.quantity = dcaProbeResult.nextState.quantity;
        openPosition.entryPrice = dcaProbeResult.nextState.averageEntryPrice;
        if (riskConfig.dcaSizingBasis === 'usdt_contribution_v1') {
          const rebased = rebasePositionManagementProtection({ ...baseState,
            trailingAnchorPrice: openPosition.bestPrice },
            openPosition.entryPrice, openPosition.side, effectiveLeverage);
          openPosition.trailingLossLimit = rebased.trailingLossLimitPercent;
          openPosition.trailingTakeProfitHigh = rebased.trailingTakeProfitHighPercent;
          openPosition.trailingTakeProfitStep = rebased.trailingTakeProfitStepPercent;
        }
        openPosition.dcaCount = dcaProbeResult.nextState.currentAdds;
        openPosition.marginUsed += addMargin;
        openPosition.executedDcaLevelIndices = dcaProbeResult.nextState.executedDcaLevelIndices;
        openPosition.lastDcaPrice = dcaFillPrice;
        pushEvent(
          'DCA',
          openPosition.side as PositionSide,
          new Date(orderedTicks?.find((tick) => Math.abs(tick.price - dcaFillPrice) <= 1e-9)
            ?.eventTime ?? current.openTime),
          dcaFillPrice,
          null,
          index,
          tradeSequence,
          dcaContribution({ addSequence: openPosition.dcaCount,
            levelIndex: dcaProbeResult.dcaLevelIndex, levels: riskConfig.dcaLevels,
            multipliers: riskConfig.dcaMultipliers, price: dcaFillPrice, quantity: addedQty }),
        );
      }
    }

    const managementInput: PositionManagementInput = {
      ...buildReplayPositionManagementInput({
        side: openPosition.side,
        currentPrice: current.close,
        entryPrice: openPosition.entryPrice,
        leverage: effectiveLeverage,
        riskConfig,
      }),
      dca: undefined,
      dcaFundsExhausted,
    };
    const managementState: PositionManagementState = {
      averageEntryPrice: openPosition.entryPrice,
      quantity: openPosition.quantity,
      currentAdds: openPosition.dcaCount,
      // Preserve trailing state across candles. DCA probe intentionally disables
      // trailing inputs and must not clear active TTP/TSL tracking.
      trailingAnchorPrice: openPosition.bestPrice,
      trailingLossLimitPercent: openPosition.trailingLossLimit,
      trailingLossActiveLevelIndex: openPosition.trailingLossActiveLevelIndex,
      trailingTakeProfitHighPercent: openPosition.trailingTakeProfitHigh,
      trailingTakeProfitStepPercent: openPosition.trailingTakeProfitStep,
      trailingTakeProfitActiveLevelIndex: openPosition.trailingTakeProfitActiveLevelIndex,
      lastDcaPrice: openPosition.lastDcaPrice,
      executedDcaLevelIndices: openPosition.executedDcaLevelIndices,
    };
    const orderedProtection = orderedTicks && dcaFilledThisCandle
      ? replayProtectionAfterConfirmedDca({ ticks: orderedTicks, fillPrice: dcaFillPrice,
          state: managementState, riskConfig, dcaFundsExhausted,
          lockTrailingByPendingDca,
          buildManagementInput: (price) => buildReplayPositionManagementInput({
            side: replayPosition.side, currentPrice: price, entryPrice: replayPosition.entryPrice,
            leverage: effectiveLeverage, riskConfig,
          }) })
      : null;
    let managementResult = orderedProtection?.result ??
      evaluatePositionManagement(managementInput, managementState);
    openPosition.trailingLossLimit = managementResult.nextState.trailingLossLimitPercent;
    openPosition.trailingLossActiveLevelIndex = managementResult.nextState.trailingLossActiveLevelIndex;
    openPosition.trailingTakeProfitHigh = managementResult.nextState.trailingTakeProfitHighPercent;
    openPosition.trailingTakeProfitStep = managementResult.nextState.trailingTakeProfitStepPercent;
    openPosition.trailingTakeProfitActiveLevelIndex = managementResult.nextState.trailingTakeProfitActiveLevelIndex;
    openPosition.bestPrice = managementResult.nextState.trailingAnchorPrice ?? openPosition.bestPrice;

    if (
      managementResult.shouldClose &&
      !orderedProtection && shouldBlockCloseByPendingDca({
        lockTrailingByPendingDca,
        closeReason: managementResult.closeReason,
        riskConfig,
        executedDcaLevelIndices: openPosition.executedDcaLevelIndices,
        dcaFundsExhausted,
        dcaSizingBasis: riskConfig.dcaSizingBasis,
        reachedDcaLevelIndex: dcaProbeResult.dcaExecuted ? dcaProbeResult.dcaLevelIndex : undefined,
        filledDcaLevelIndex: dcaProbeResult.dcaExecuted && !dcaFundsExhausted
          ? dcaProbeResult.dcaLevelIndex : undefined,
      })
    ) {
      managementResult = {
        ...managementResult,
        shouldClose: false,
        closeReason: undefined,
      };
    }

    const exitMarkPrice = orderedProtection?.closeTick?.price ?? current.close;
    const exitTime = orderedProtection?.closeTick?.eventTime ?? current.closeTime;

    const clampedExitMarkPrice = Math.min(current.high, Math.max(current.low, exitMarkPrice));
    const effectiveExitPrice = fillModel.exitPrice(clampedExitMarkPrice, openPosition.side as PositionSide);
    const settlement = fillModel.settle({
      side: openPosition.side as PositionSide,
      entryPrice: openPosition.entryPrice,
      exitPrice: effectiveExitPrice,
      quantity: openPosition.quantity,
      leverage: effectiveLeverage,
    });
    const fee = settlement.fees;
    const rawPnl = settlement.grossPnl;

    const adverseMoveRatio =
      openPosition.side === 'LONG'
        ? (openPosition.entryPrice - current.low) / Math.max(openPosition.entryPrice, 1e-8)
        : (current.high - openPosition.entryPrice) / Math.max(openPosition.entryPrice, 1e-8);
    const isolatedLiquidationThreshold = 1 / Math.max(1, effectiveLeverage);
    const isIsolatedLiquidated =
      marketType === 'FUTURES' &&
      marginMode === 'ISOLATED' &&
      adverseMoveRatio >= isolatedLiquidationThreshold;

    if (
      !isIsolatedLiquidated &&
      !managementResult.shouldClose
    ) {
      continue;
    }

    if (isIsolatedLiquidated) {
      liquidations += 1;
    }

    const pnlBeforeAccountBounds = isIsolatedLiquidated
      ? -openPosition.marginUsed
      : rawPnl - fee;
    const pnl = settleToAccount(pnlBeforeAccountBounds, openPosition.marginUsed);

    const closeType: ReplayEventType = isIsolatedLiquidated
      ? 'LIQUIDATION'
      : managementResult.shouldClose
        ? closeReasonToEventType(managementResult.closeReason)
        : 'EXIT';

    trades.push({
      symbol,
      side: openPosition.side as PositionSide,
      entryPrice: openPosition.entryPrice,
      exitPrice: effectiveExitPrice,
      quantity: openPosition.quantity,
      openedAt: openPosition.openedAt,
      closedAt: new Date(exitTime),
      pnl,
      fee,
      exitReason: closeType === 'TP' || closeType === 'SL' ||
        closeType === 'TTP' || closeType === 'TSL'
        ? closeType
        : isIsolatedLiquidated ? 'LIQUIDATION' : 'SIGNAL_EXIT',
      liquidated: isIsolatedLiquidated,
    });
    pushEvent(
      closeType,
      openPosition.side as PositionSide,
      new Date(exitTime),
      effectiveExitPrice,
      pnl,
      index,
      tradeSequence
    );
    openPosition = null;
  }

  if (openPosition) {
    const last = candles[candles.length - 1];
    const effectiveExitPrice = fillModel.exitPrice(last.close, openPosition.side as PositionSide);
    const settlement = fillModel.settle({
      side: openPosition.side as PositionSide,
      entryPrice: openPosition.entryPrice,
      exitPrice: effectiveExitPrice,
      quantity: openPosition.quantity,
      leverage: effectiveLeverage,
    });
    const fee = settlement.fees;
    const rawPnl = settlement.grossPnl;
    const finalPnl = settleToAccount(rawPnl - fee, openPosition.marginUsed);
    trades.push({
      symbol,
      side: openPosition.side as PositionSide,
      entryPrice: openPosition.entryPrice,
      exitPrice: effectiveExitPrice,
      quantity: openPosition.quantity,
      openedAt: openPosition.openedAt,
      closedAt: new Date(last.closeTime),
      pnl: finalPnl,
      fee,
      exitReason: 'FINAL_CANDLE',
      liquidated: false,
    });
    pushEvent(
      'EXIT',
      openPosition.side as PositionSide,
      new Date(last.closeTime),
      effectiveExitPrice,
      finalPnl,
      candles.length - 1,
      tradeSequence
    );
    decisionTrace.push({
      symbol,
      timestamp: new Date(last.closeTime),
      candleIndex: candles.length - 1,
      signal: 'EXIT',
      side: openPosition.side as PositionSide,
      trigger: 'FINAL_CANDLE',
      mismatchReason: null,
    });
  }

  return { trades, liquidations, events, eventCounts, decisionTrace,
    dcaFundsExhaustedCount, dcaFundsExhaustedSamples };
};
