import type { DcaLevel, Threshold } from "../types/StrategyForm.type";

let thresholdClientIdCounter = 0;

const createClientId = (prefix: string) => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  thresholdClientIdCounter += 1;
  return `${prefix}-${thresholdClientIdCounter}`;
};

export const createThreshold = (threshold?: Partial<Threshold>): Threshold => ({
  percent: 0,
  arm: 0,
  ...threshold,
  clientId: threshold?.clientId ?? createClientId("threshold"),
});

export const createDcaLevel = (level?: Partial<DcaLevel>): DcaLevel => ({
  percent: -1,
  multiplier: 2,
  ...level,
  clientId: level?.clientId ?? createClientId("dca"),
});

export const ensureThresholdClientIds = (thresholds: Threshold[] | undefined): Threshold[] =>
  (thresholds ?? []).map((threshold) => createThreshold(threshold));

export const ensureDcaLevelClientIds = (levels: DcaLevel[] | undefined): DcaLevel[] =>
  (levels ?? []).map((level) => createDcaLevel(level));

export const stripThresholdClientIds = (thresholds: Threshold[]): Array<Omit<Threshold, "clientId">> =>
  thresholds.map((threshold) => ({
    percent: threshold.percent,
    arm: threshold.arm,
  }));

export const stripDcaLevelClientIds = (levels: DcaLevel[]): Array<Omit<DcaLevel, "clientId">> =>
  levels.map((level) => ({
    percent: level.percent,
    multiplier: level.multiplier,
  }));
