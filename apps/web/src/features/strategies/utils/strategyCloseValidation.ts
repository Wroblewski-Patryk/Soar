import type { CloseConditions } from '../types/StrategyForm.type';

const hasInvalidTtpThreshold = (close: CloseConditions) =>
  close.ttp.some((threshold) => Math.abs(Number(threshold.arm)) > Math.abs(Number(threshold.percent)));

const hasInvalidTslThreshold = (close: CloseConditions) =>
  close.tsl.some((threshold) => Math.abs(Number(threshold.percent)) > Math.abs(Number(threshold.arm)));

export const hasInvalidTrailingCloseThresholds = (close: CloseConditions) => {
  if (close.mode !== 'advanced') return false;
  return hasInvalidTtpThreshold(close) || hasInvalidTslThreshold(close);
};
