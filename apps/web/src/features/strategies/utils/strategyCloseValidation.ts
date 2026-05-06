import type { AdditionalState, CloseConditions } from '../types/StrategyForm.type';

const hasInvalidTtpThreshold = (close: CloseConditions) =>
  close.ttp.some((threshold) => Math.abs(Number(threshold.arm)) > Math.abs(Number(threshold.percent)));

const hasInvalidTslThreshold = (close: CloseConditions) =>
  close.tsl.some((threshold) => {
    const startPercent = Number(threshold.percent);
    const stepPercent = Number(threshold.arm);
    return !Number.isFinite(startPercent) || !Number.isFinite(stepPercent) || startPercent >= 0 || stepPercent <= 0;
  });

export const hasInvalidTrailingCloseThresholds = (close: CloseConditions) => {
  if (close.mode !== 'advanced') return false;
  return hasInvalidTtpThreshold(close) || hasInvalidTslThreshold(close);
};

const resolveDcaLevelPercents = (additional: AdditionalState) => {
  if (!additional.dcaEnabled) return [];
  if (additional.dcaMode === 'advanced') {
    return additional.dcaLevels
      .map((level) => Number(level.percent))
      .filter((value) => Number.isFinite(value) && value !== 0);
  }

  const primaryLevelPercent = Number(additional.dcaLevels[0]?.percent);
  const repeatCount = Math.max(0, Math.floor(Number(additional.dcaTimes) || 0));
  if (!Number.isFinite(primaryLevelPercent) || primaryLevelPercent === 0 || repeatCount <= 0) {
    return [];
  }
  return Array.from({ length: repeatCount }, () => primaryLevelPercent);
};

export const hasUnreachableBasicDcaLevels = (
  close: CloseConditions,
  additional: AdditionalState
) => {
  if (close.mode !== 'basic') return false;
  const takeProfitPercent = Number(close.tp);
  const stopLossPercent = Number(close.sl);
  return resolveDcaLevelPercents(additional).some((percent) => {
    if (Number.isFinite(takeProfitPercent) && takeProfitPercent > 0 && percent > takeProfitPercent) {
      return true;
    }
    return Number.isFinite(stopLossPercent) && stopLossPercent > 0 && percent < -Math.abs(stopLossPercent);
  });
};
