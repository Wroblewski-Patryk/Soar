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

export const hasUnreachableLegacyDcaLevels = (close: CloseConditions, additional: AdditionalState) => {
  if (close.mode !== 'basic' || !additional.dcaEnabled ||
    additional.dcaSizingBasis === 'usdt_contribution_v1') return false;
  const levels = additional.dcaMode === 'basic'
    ? (additional.dcaTimes > 0 ? additional.dcaLevels.slice(0, 1) : [])
    : additional.dcaLevels;
  return levels.some((level) => {
    const percent = Number(level?.percent);
    return (Number(close.tp) > 0 && percent > Number(close.tp)) ||
      (Number(close.sl) > 0 && percent < -Math.abs(Number(close.sl)));
  });
};
