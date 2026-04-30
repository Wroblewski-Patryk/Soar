import {
  AdditionalState,
  CloseConditions,
  OpenConditions,
  StrategyDto,
  StrategyFormState,
} from "../types/StrategyForm.type";
import {
  ensureDcaLevelClientIds,
  ensureThresholdClientIds,
  stripDcaLevelClientIds,
  stripThresholdClientIds,
} from "./strategyThresholdItems";

type StrategyDtoLike = StrategyDto & {
  config?: {
    open?: OpenConditions;
    close?: CloseConditions;
    additional?: AdditionalState;
  };
};

const normalizeInterval = (value?: string | null) => {
  if (!value) return "5m";
  const raw = value.trim().toLowerCase();
  const aliases: Record<string, string> = {
    "1 min": "1m",
    "3 min": "3m",
    "5 min": "5m",
    "10 min": "10m",
    "15 min": "15m",
    "30 min": "30m",
    "60 min": "1h",
  };
  return aliases[raw] ?? raw;
};

const defaultAdditional: AdditionalState = {
  dcaEnabled: false,
  dcaMode: "basic",
  dcaTimes: 0,
  dcaMultiplier: 1,
  dcaLevels: [],
  maxPositions: 1,
  maxOrders: 1,
  positionLifetime: 1,
  positionUnit: "h",
  orderLifetime: 1,
  orderUnit: "h",
  marginMode: "CROSSED",
};

const sanitizeTrailingTakeProfitThresholds = (thresholds: CloseConditions["ttp"]) =>
  thresholds.filter((threshold) => {
    const triggerPercent = Math.abs(Number(threshold.percent));
    const trailPercent = Math.abs(Number(threshold.arm));
    return (
      Number.isFinite(triggerPercent) &&
      Number.isFinite(trailPercent) &&
      triggerPercent > 0 &&
      trailPercent > 0 &&
      trailPercent <= triggerPercent
    );
  });

const sanitizeTrailingStopThresholds = (thresholds: CloseConditions["tsl"]) =>
  thresholds.filter((threshold) => {
    const startPercent = Number(threshold.percent);
    const stepPercent = Number(threshold.arm);
    return (
      Number.isFinite(startPercent) &&
      Number.isFinite(stepPercent) &&
      startPercent < 0 &&
      stepPercent > 0
    );
  });

const sanitizeCloseConditions = (close?: CloseConditions): CloseConditions => {
  const normalized = close ?? { mode: "basic", tp: 3, sl: 2, ttp: [], tsl: [] };
  if (normalized.mode !== "advanced") {
    return {
      ...normalized,
      ttp: ensureThresholdClientIds(normalized.ttp ?? []),
      tsl: ensureThresholdClientIds(normalized.tsl ?? []),
    };
  }
  return {
    ...normalized,
    ttp: ensureThresholdClientIds(sanitizeTrailingTakeProfitThresholds(normalized.ttp ?? [])),
    tsl: ensureThresholdClientIds(sanitizeTrailingStopThresholds(normalized.tsl ?? [])),
  };
};

const sanitizeCloseConditionsForPayload = (close: CloseConditions): CloseConditions => {
  if (close.mode !== "advanced") {
    return {
      ...close,
      ttp: ensureThresholdClientIds(close.ttp ?? []),
      tsl: ensureThresholdClientIds(close.tsl ?? []),
    };
  }

  return {
    ...close,
    ttp: ensureThresholdClientIds(sanitizeTrailingTakeProfitThresholds(close.ttp ?? [])),
    tsl: ensureThresholdClientIds(sanitizeTrailingStopThresholds(close.tsl ?? [])),
  };
};

// backend DTO -> form state
export const dtoToForm = (s: StrategyDtoLike): StrategyFormState => ({
  name: s.name,
  description: s.description ?? "",
  interval: normalizeInterval(s.interval),
  leverage: s.leverage,
  walletRisk: s.walletRisk ?? 1,
  openConditions: s.config?.open ?? { direction: "both", indicatorsLong: [], indicatorsShort: [] },
  closeConditions: sanitizeCloseConditions(s.config?.close),
  additional: {
    ...defaultAdditional,
    ...(s.config?.additional ?? {}),
    dcaLevels: ensureDcaLevelClientIds(s.config?.additional?.dcaLevels),
  },
});

// form -> PATCH/POST payload
export const formToPayload = (f: StrategyFormState) => {
  const close = sanitizeCloseConditionsForPayload(f.closeConditions);
  const normalizedBasicLevel = {
    percent:
      Number.isFinite(f.additional.dcaLevels[0]?.percent) && Number(f.additional.dcaLevels[0].percent) !== 0
        ? Number(f.additional.dcaLevels[0].percent)
        : -1,
    multiplier:
      Number.isFinite(f.additional.dcaMultiplier) && Number(f.additional.dcaMultiplier) > 0
        ? Number(f.additional.dcaMultiplier)
        : 1,
  };
  const normalizedAdvancedLevels = f.additional.dcaLevels
    .map((level) => ({
      percent: Number(level.percent),
      multiplier: Number(level.multiplier),
    }))
    .filter((level) => Number.isFinite(level.percent) && level.percent !== 0 && Number.isFinite(level.multiplier) && level.multiplier > 0);

  const additional = !f.additional.dcaEnabled
    ? {
        ...f.additional,
        dcaLevels: stripDcaLevelClientIds(ensureDcaLevelClientIds(f.additional.dcaLevels)),
      }
    : f.additional.dcaMode === "basic"
      ? {
          ...f.additional,
          dcaTimes: Math.max(1, Math.floor(Number(f.additional.dcaTimes) || 1)),
          dcaLevels: [normalizedBasicLevel],
        }
      : {
          ...f.additional,
          dcaLevels: normalizedAdvancedLevels,
          dcaTimes: normalizedAdvancedLevels.length,
        };

  return {
    name: f.name,
    description: f.description,
    interval: f.interval,
    leverage: f.leverage,
    walletRisk: f.walletRisk,
    config: {
      open: f.openConditions,
      close: {
        ...close,
        ttp: stripThresholdClientIds(close.ttp),
        tsl: stripThresholdClientIds(close.tsl),
      },
      additional,
    },
  };
};
