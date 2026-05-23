export const hasRemainingDcaLevelsForDisplaySide = (
  plannedLevels: number[],
  executedCount: number,
  side: 'profit' | 'loss'
) => {
  const normalizedExecutedCount = Number.isFinite(executedCount)
    ? Math.max(0, Math.floor(executedCount))
    : 0;

  return plannedLevels.some((level, index) => {
    if (index < normalizedExecutedCount) return false;
    if (!Number.isFinite(level)) return false;
    return side === 'profit' ? level >= 0 : level < 0;
  });
};

export const resolveRuntimePositionActionableForDisplay = (input: {
  continuityState:
    | 'CONFIRMED'
    | 'RECOVERING'
    | 'RECOVERED_UNACTIONABLE'
    | 'EXTERNAL_CLOSE_CONFIRMED'
    | 'REPAIR_ONLY_CLEANUP';
  botId: string | null;
  strategyId: string | null;
}) =>
  input.continuityState === 'CONFIRMED' &&
  typeof input.botId === 'string' &&
  input.botId.length > 0 &&
  typeof input.strategyId === 'string' &&
  input.strategyId.length > 0;

export const resolveRuntimeStrategyAutomationContext = (strategyId: string | null) =>
  typeof strategyId === 'string' && strategyId.length > 0;
