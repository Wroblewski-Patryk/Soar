import { PositionManagementState } from '../engine/positionManagement.types';

export type TrailingStopDisplayLevel = {
  armPercent: number;
  trailPercent: number;
};

export type TrailingTakeProfitDisplayLevel = {
  armPercent: number;
  trailPercent: number;
};

const computePriceFromLeveragedMovePercent = (
  side: 'LONG' | 'SHORT',
  entryPrice: number,
  movePercent: number,
  leverage: number
) => {
  if (!Number.isFinite(entryPrice) || entryPrice <= 0) return null;
  if (!Number.isFinite(movePercent)) return null;
  const effectiveLeverage = Number.isFinite(leverage) && leverage > 0 ? leverage : 1;
  const delta = movePercent / effectiveLeverage;
  const raw =
    side === 'LONG' ? entryPrice * (1 + delta) : entryPrice * (1 - delta);
  if (!Number.isFinite(raw) || raw <= 0) return null;
  return raw;
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
  unrealizedPnl: number | null | undefined;
  marketPrice: number | null | undefined;
  stateEntryPrice: number;
  runtimeState: PositionManagementState | null;
  trailingTakeProfitLevels: TrailingTakeProfitDisplayLevel[];
  trailingStopLevels: TrailingStopDisplayLevel[];
  allowStrategyProtectionFallback: boolean;
};

export const resolveRuntimePositionDynamicStops = (
  params: ResolveRuntimePositionDynamicStopsParams
) => {
  const {
    positionSide,
    entryPrice,
    quantity,
    leverage,
    unrealizedPnl,
    marketPrice,
    stateEntryPrice,
    runtimeState,
    trailingTakeProfitLevels,
    trailingStopLevels,
    allowStrategyProtectionFallback,
  } = params;

  const effectiveLeverage =
    Number.isFinite(leverage) && leverage > 0 ? leverage : 1;
  const ttpTriggerPercentFromState =
    runtimeState &&
    Number.isFinite(runtimeState.trailingTakeProfitHighPercent) &&
    Number.isFinite(runtimeState.trailingTakeProfitStepPercent)
      ? (runtimeState.trailingTakeProfitHighPercent as number) -
        (runtimeState.trailingTakeProfitStepPercent as number)
      : null;
  const hasRuntimeTtpState = ttpTriggerPercentFromState != null;
  const hasRuntimeTslState =
    runtimeState && Number.isFinite(runtimeState.trailingLossLimitPercent);
  const liveUnrealizedPnlFromPrice =
    typeof marketPrice === 'number' && Number.isFinite(marketPrice)
      ? (marketPrice - entryPrice) * quantity * (positionSide === 'LONG' ? 1 : -1)
      : null;
  const marginUsed = entryPrice > 0 ? (entryPrice * quantity) / effectiveLeverage : null;
  const favorableMovePercentFromLivePrice =
    typeof marketPrice === 'number' && Number.isFinite(marketPrice) && stateEntryPrice > 0
      ? positionSide === 'LONG'
        ? ((marketPrice - stateEntryPrice) / stateEntryPrice) * effectiveLeverage
        : ((stateEntryPrice - marketPrice) / stateEntryPrice) * effectiveLeverage
      : typeof liveUnrealizedPnlFromPrice === 'number' &&
          Number.isFinite(liveUnrealizedPnlFromPrice) &&
          marginUsed != null &&
          Number.isFinite(marginUsed) &&
          marginUsed > 0
        ? liveUnrealizedPnlFromPrice / marginUsed
        : typeof unrealizedPnl === 'number' &&
            Number.isFinite(unrealizedPnl) &&
            marginUsed != null &&
            Number.isFinite(marginUsed) &&
            marginUsed > 0
          ? unrealizedPnl / marginUsed
          : null;
  const ttpTriggerPercent =
    ttpTriggerPercentFromState != null && ttpTriggerPercentFromState > 0
      ? ttpTriggerPercentFromState
      : null;
  const activeTtpLevel =
    !hasRuntimeTtpState && allowStrategyProtectionFallback
      ? selectActiveTrailingTakeProfitDisplayLevel(
          favorableMovePercentFromLivePrice,
          trailingTakeProfitLevels
        )
      : null;
  const fallbackTtpTriggerPercent =
    activeTtpLevel != null && favorableMovePercentFromLivePrice != null
      ? favorableMovePercentFromLivePrice - activeTtpLevel.trailPercent
      : null;
  const tslTriggerPercent = hasRuntimeTslState
    ? (runtimeState.trailingLossLimitPercent as number)
    : null;
  const stickyFallbackTtpLevel =
    !hasRuntimeTtpState &&
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
    runtimeState && favorableMovePercentFromLivePrice != null
      ? selectActiveTrailingStopDisplayLevel(
          favorableMovePercentFromLivePrice,
          trailingStopLevels
        )
      : null;
  const dynamicTtpStopLoss =
    (
      ttpTriggerPercent != null ||
      fallbackTtpTriggerPercent != null ||
      stickyFallbackTtpTriggerPercent != null
    )
      ? computePriceFromLeveragedMovePercent(
          positionSide,
          stateEntryPrice,
          ttpTriggerPercent ??
            fallbackTtpTriggerPercent ??
            stickyFallbackTtpTriggerPercent ??
            0,
          leverage
        )
      : null;
  const dynamicTslStopLoss =
    hasRuntimeTtpState
      ? null
      : tslTriggerPercent != null
        ? computePriceFromLeveragedMovePercent(
            positionSide,
            stateEntryPrice,
            tslTriggerPercent,
            effectiveLeverage
          )
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

  return {
    dynamicTtpStopLoss,
    dynamicTslStopLoss,
    liveUnrealizedPnl,
  };
};
