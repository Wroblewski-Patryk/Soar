import { strategyErrors } from './strategies.errors';

const asRecord = (value: unknown): Record<string, unknown> | null =>
  value && typeof value === 'object' ? (value as Record<string, unknown>) : null;

const toFiniteNumber = (value: unknown) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const resolveDcaLevelPercents = (additional: Record<string, unknown>) => {
  if (additional.dcaEnabled !== true) return [];
  const rawLevels = Array.isArray(additional.dcaLevels) ? additional.dcaLevels : [];
  if (additional.dcaMode === 'advanced') {
    return rawLevels
      .map((entry) => toFiniteNumber(asRecord(entry)?.percent))
      .filter((value): value is number => value != null && value !== 0);
  }

  const firstLevelPercent = toFiniteNumber(asRecord(rawLevels[0])?.percent);
  const repeatCount = Math.max(0, Math.floor(toFiniteNumber(additional.dcaTimes) ?? 0));
  if (firstLevelPercent == null || firstLevelPercent === 0 || repeatCount <= 0) return [];
  return Array.from({ length: repeatCount }, () => firstLevelPercent);
};

const validateTrailingTakeProfitLevels = (config: unknown) => {
  const root = asRecord(config);
  const close = asRecord(root?.close);
  const mode = typeof close?.mode === 'string' ? close.mode.trim().toLowerCase() : null;
  if (mode !== 'advanced') return;

  const rawLevels = Array.isArray(close?.ttp) ? close.ttp : [];
  rawLevels.forEach((entry, index) => {
    const level = asRecord(entry);
    if (!level) return;
    const triggerPercent = toFiniteNumber(level.percent);
    const trailPercent = toFiniteNumber(level.arm);
    if (
      triggerPercent != null &&
      trailPercent != null &&
      Math.abs(trailPercent) > Math.abs(triggerPercent)
    ) {
      throw strategyErrors.invalidCloseConfig({
        field: `close.ttp[${index}]`,
        rule: 'trail_cannot_exceed_trigger',
      });
    }
  });
};

const validateTrailingStopLevels = (config: unknown) => {
  const root = asRecord(config);
  const close = asRecord(root?.close);
  const mode = typeof close?.mode === 'string' ? close.mode.trim().toLowerCase() : null;
  if (mode !== 'advanced') return;

  const rawLevels = Array.isArray(close?.tsl) ? close.tsl : [];
  rawLevels.forEach((entry, index) => {
    const level = asRecord(entry);
    if (!level) return;
    const startPercent = toFiniteNumber(level.percent);
    const stepPercent = toFiniteNumber(level.arm);
    if (
      startPercent != null &&
      stepPercent != null &&
      (startPercent >= 0 || stepPercent <= 0)
    ) {
      throw strategyErrors.invalidCloseConfig({
        field: `close.tsl[${index}]`,
        rule: 'tsl_requires_negative_start_and_positive_step',
      });
    }
  });
};

const validateBasicCloseDcaReachability = (config: unknown) => {
  const root = asRecord(config);
  const close = asRecord(root?.close);
  const additional = asRecord(root?.additional);
  const mode = typeof close?.mode === 'string' ? close.mode.trim().toLowerCase() : 'basic';
  if (mode !== 'basic' || !additional) return;

  const takeProfitPercent = toFiniteNumber(close?.tp);
  const stopLossPercent = toFiniteNumber(close?.sl);
  const dcaLevelPercents = resolveDcaLevelPercents(additional);
  dcaLevelPercents.forEach((percent, index) => {
    if (takeProfitPercent != null && takeProfitPercent > 0 && percent > takeProfitPercent) {
      throw strategyErrors.invalidCloseConfig({
        field: `additional.dcaLevels[${index}]`,
        rule: 'positive_dca_above_take_profit_unreachable',
        dcaPercent: percent,
        takeProfitPercent,
      });
    }
    if (stopLossPercent != null && stopLossPercent > 0 && percent < -Math.abs(stopLossPercent)) {
      throw strategyErrors.invalidCloseConfig({
        field: `additional.dcaLevels[${index}]`,
        rule: 'negative_dca_below_stop_loss_unreachable',
        dcaPercent: percent,
        stopLossPercent: -Math.abs(stopLossPercent),
      });
    }
  });
};

export const validateStrategyConfig = (config: unknown) => {
  validateTrailingTakeProfitLevels(config);
  validateTrailingStopLevels(config);
  validateBasicCloseDcaReachability(config);
};
