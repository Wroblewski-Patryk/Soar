import { PositionManagementState } from '../engine/positionManagement.types';
import { computePriceFromPnlFraction, resolvePositionPnlFraction } from '../engine/positionPnlSemantics';

export type TrailingStopDisplayLevel = {
  armPercent: number;
  trailPercent: number;
};

export type TrailingTakeProfitDisplayLevel = {
  armPercent: number;
  trailPercent: number;
};

export const cleanupStaleRuntimePositionSerializationState = (_nowTs: number) => {
  // No-op after removing display-only sticky fallback state.
};

const selectActiveTrailingStopDisplayLevel = (
  favorableMovePercent: number | null,
  levels: TrailingStopDisplayLevel[]
) => {
  if (favorableMovePercent == null || !Number.isFinite(favorableMovePercent)) return null;
  let active: TrailingStopDisplayLevel | null = null;
  for (const level of levels) {
    if (favorableMovePercent >= level.armPercent) active = level;
  }
  return active;
};

const selectActiveTrailingTakeProfitDisplayLevel = (
  favorableMovePercent: number | null,
  levels: TrailingTakeProfitDisplayLevel[]
) => {
  if (favorableMovePercent == null || !Number.isFinite(favorableMovePercent)) return null;
  let active: TrailingTakeProfitDisplayLevel | null = null;
  for (const level of levels) {
    if (favorableMovePercent >= level.armPercent) active = level;
  }
  return active;
};

const computeTrailingStopPriceFromAnchor = (params: {
  side: 'LONG' | 'SHORT';
  anchorPrice: number;
  trailPercent: number;
}) => {
  const { side, anchorPrice, trailPercent } = params;
  if (!Number.isFinite(anchorPrice) || anchorPrice <= 0) return null;
  if (!Number.isFinite(trailPercent) || trailPercent <= 0) return null;
  const raw =
    side === 'LONG'
      ? anchorPrice * (1 - trailPercent)
      : anchorPrice * (1 + trailPercent);
  if (!Number.isFinite(raw) || raw <= 0) return null;
  return raw;
};

const resolveAnchorBasedPnlFraction = (params: {
  side: 'LONG' | 'SHORT';
  entryPrice: number;
  anchorPrice: number | null | undefined;
  quantity: number;
  leverage: number;
  marginUsed?: number | null;
}) => {
  const { side, entryPrice, anchorPrice, quantity, leverage, marginUsed } = params;
  if (typeof anchorPrice !== 'number' || !Number.isFinite(anchorPrice) || anchorPrice <= 0) {
    return null;
  }
  const anchorUnrealizedPnl =
    side === 'LONG'
      ? (anchorPrice - entryPrice) * quantity
      : (entryPrice - anchorPrice) * quantity;
  return resolvePositionPnlFraction({
    side,
    entryPrice,
    currentPrice: anchorPrice,
    quantity,
    leverage,
    marginUsed,
    unrealizedPnl: anchorUnrealizedPnl,
  });
};

const maxFiniteNumber = (left: number | null, right: number | null) => {
  if (left == null) return right;
  if (right == null) return left;
  return Math.max(left, right);
};

export const resolveDcaExecutedLevels = (
  dcaCount: number,
  dcaPlannedLevels: number[]
) => {
  if (dcaCount <= dcaPlannedLevels.length) {
    return dcaPlannedLevels.slice(0, dcaCount);
  }

  if (dcaPlannedLevels.length === 0) return [];
  return [
    ...dcaPlannedLevels,
    ...Array.from(
      { length: dcaCount - dcaPlannedLevels.length },
      () => dcaPlannedLevels[dcaPlannedLevels.length - 1]
    ),
  ];
};

type ResolveRuntimePositionDynamicStopsParams = {
  positionSide: 'LONG' | 'SHORT';
  entryPrice: number;
  quantity: number;
  leverage: number;
  marginUsed?: number | null;
  unrealizedPnl: number | null | undefined;
  marketPrice: number | null | undefined;
  stateEntryPrice: number;
  runtimeState: PositionManagementState | null;
  trailingTakeProfitLevels: TrailingTakeProfitDisplayLevel[];
  trailingStopLevels: TrailingStopDisplayLevel[];
  allowStrategyProtectionFallback: boolean;
  allowTrailingTakeProfitProtection?: boolean;
  allowTrailingStopProtection?: boolean;
};

export const resolveRuntimePositionDynamicStops = (
  params: ResolveRuntimePositionDynamicStopsParams
) => {
  const {
    positionSide,
    entryPrice,
    quantity,
    leverage,
    marginUsed,
    unrealizedPnl,
    marketPrice,
    stateEntryPrice,
    runtimeState,
    trailingTakeProfitLevels,
    trailingStopLevels,
    allowStrategyProtectionFallback,
    allowTrailingTakeProfitProtection = true,
    allowTrailingStopProtection = true,
  } = params;

  const effectiveLeverage =
    Number.isFinite(leverage) && leverage > 0 ? leverage : 1;
  const ttpTriggerPercentFromState =
    allowTrailingTakeProfitProtection &&
    runtimeState &&
    Number.isFinite(runtimeState.trailingTakeProfitHighPercent) &&
    Number.isFinite(runtimeState.trailingTakeProfitStepPercent)
      ? (runtimeState.trailingTakeProfitHighPercent as number) -
        (runtimeState.trailingTakeProfitStepPercent as number)
      : null;
  const hasActiveRuntimeTtpState =
    ttpTriggerPercentFromState != null && ttpTriggerPercentFromState > 0;
  const hasRuntimeTslState =
    runtimeState && Number.isFinite(runtimeState.trailingLossLimitPercent);
  const liveUnrealizedPnlFromPrice =
    typeof marketPrice === 'number' && Number.isFinite(marketPrice)
      ? (marketPrice - entryPrice) * quantity * (positionSide === 'LONG' ? 1 : -1)
      : null;
  const favorableMovePercentFromLivePrice =
    typeof marketPrice === 'number' && Number.isFinite(marketPrice)
      ? resolvePositionPnlFraction({
          side: positionSide,
          entryPrice: stateEntryPrice,
          currentPrice: marketPrice,
          quantity,
          leverage: effectiveLeverage,
          marginUsed,
          unrealizedPnl: liveUnrealizedPnlFromPrice,
        })
      : typeof unrealizedPnl === 'number' && Number.isFinite(unrealizedPnl)
        ? resolvePositionPnlFraction({
            side: positionSide,
            entryPrice: stateEntryPrice,
            currentPrice: stateEntryPrice,
            quantity,
            leverage: effectiveLeverage,
            marginUsed,
            unrealizedPnl,
          })
        : null;
  const favorableMovePercentFromAnchor =
    runtimeState && Number.isFinite(runtimeState.trailingAnchorPrice)
      ? resolveAnchorBasedPnlFraction({
          side: positionSide,
          entryPrice: stateEntryPrice,
          anchorPrice: runtimeState.trailingAnchorPrice,
          quantity,
          leverage: effectiveLeverage,
          marginUsed,
        })
      : favorableMovePercentFromLivePrice;
  const favorableMovePercentForFallback =
    maxFiniteNumber(favorableMovePercentFromAnchor, favorableMovePercentFromLivePrice);
  const ttpTriggerPercent =
    ttpTriggerPercentFromState != null && ttpTriggerPercentFromState > 0
      ? ttpTriggerPercentFromState
      : null;
  const activeTtpLevel =
    allowTrailingTakeProfitProtection &&
    !hasActiveRuntimeTtpState &&
    allowStrategyProtectionFallback
      ? selectActiveTrailingTakeProfitDisplayLevel(
          favorableMovePercentForFallback,
          trailingTakeProfitLevels
        )
      : null;
  const fallbackTtpTriggerPercent =
    activeTtpLevel != null && favorableMovePercentForFallback != null
      ? favorableMovePercentForFallback - activeTtpLevel.trailPercent
      : null;
  const tslTriggerPercent =
    allowTrailingStopProtection &&
    hasRuntimeTslState &&
    Number.isFinite(runtimeState.trailingLossLimitPercent)
      ? (runtimeState.trailingLossLimitPercent as number)
      : null;
  const stickyFallbackTtpLevel =
    allowTrailingTakeProfitProtection &&
    !hasActiveRuntimeTtpState &&
    allowStrategyProtectionFallback &&
    tslTriggerPercent != null
      ? trailingTakeProfitLevels.reduce<TrailingTakeProfitDisplayLevel | null>((active, level) => {
          if (tslTriggerPercent + level.trailPercent < level.armPercent) return active;
          return level;
        }, null)
      : null;
  const stickyFallbackTtpTriggerPercent =
    stickyFallbackTtpLevel != null && tslTriggerPercent != null
      ? tslTriggerPercent + stickyFallbackTtpLevel.trailPercent
      : null;
  const activeTslLevel =
    allowTrailingStopProtection &&
    runtimeState &&
    favorableMovePercentFromLivePrice != null
      ? selectActiveTrailingStopDisplayLevel(
          favorableMovePercentFromLivePrice,
          trailingStopLevels
        )
      : null;
  const dynamicTslStopLoss =
    hasActiveRuntimeTtpState
      ? null
      : tslTriggerPercent != null
        ? computePriceFromPnlFraction({
            side: positionSide,
            entryPrice: stateEntryPrice,
            quantity,
            leverage: effectiveLeverage,
            marginUsed,
            pnlFraction: tslTriggerPercent,
          })
        : activeTslLevel &&
            runtimeState &&
            Number.isFinite(runtimeState.trailingAnchorPrice)
          ? computeTrailingStopPriceFromAnchor({
              side: positionSide,
              anchorPrice: runtimeState.trailingAnchorPrice as number,
              trailPercent: activeTslLevel.trailPercent,
            })
        : null;
  const liveUnrealizedPnl =
    typeof liveUnrealizedPnlFromPrice === 'number' && Number.isFinite(liveUnrealizedPnlFromPrice)
      ? liveUnrealizedPnlFromPrice
      : null;
  const runtimeTtpStopLoss =
    ttpTriggerPercent != null
      ? computePriceFromPnlFraction({
          side: positionSide,
          entryPrice: stateEntryPrice,
          quantity,
          leverage: effectiveLeverage,
          marginUsed,
          pnlFraction: ttpTriggerPercent,
        })
      : null;
  const fallbackTtpStopLoss =
    runtimeTtpStopLoss == null && fallbackTtpTriggerPercent != null
      ? computePriceFromPnlFraction({
          side: positionSide,
          entryPrice: stateEntryPrice,
          quantity,
          leverage: effectiveLeverage,
          marginUsed,
          pnlFraction: fallbackTtpTriggerPercent,
        })
      : runtimeTtpStopLoss == null && stickyFallbackTtpTriggerPercent != null
        ? computePriceFromPnlFraction({
            side: positionSide,
            entryPrice: stateEntryPrice,
            quantity,
            leverage: effectiveLeverage,
            marginUsed,
            pnlFraction: stickyFallbackTtpTriggerPercent,
          })
        : null;
  const dynamicTtpStopLoss = runtimeTtpStopLoss ?? fallbackTtpStopLoss;
  const dynamicTtpStopLossSource =
    runtimeTtpStopLoss != null
      ? 'runtime_state'
      : fallbackTtpStopLoss != null
        ? 'strategy_fallback'
        : null;

  return {
    dynamicTtpStopLoss,
    dynamicTtpStopLossSource,
    dynamicTslStopLoss,
    liveUnrealizedPnl,
  };
};
