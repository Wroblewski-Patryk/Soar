import { strategyErrors } from './strategies.errors';

const asRecord = (value: unknown): Record<string, unknown> | null =>
  value && typeof value === 'object' ? (value as Record<string, unknown>) : null;

const toFiniteNumber = (value: unknown) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
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
    const trailPercent = toFiniteNumber(level.percent);
    const armPercent = toFiniteNumber(level.arm);
    if (
      trailPercent != null &&
      armPercent != null &&
      Math.abs(trailPercent) > Math.abs(armPercent)
    ) {
      throw strategyErrors.invalidCloseConfig({
        field: `close.tsl[${index}]`,
        rule: 'trail_cannot_exceed_arm',
      });
    }
  });
};

export const validateStrategyConfig = (config: unknown) => {
  validateTrailingTakeProfitLevels(config);
  validateTrailingStopLevels(config);
};
