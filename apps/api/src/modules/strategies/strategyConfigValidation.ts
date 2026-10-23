import { strategyErrors } from './strategies.errors';
import { normalizeLegacyMomentumPeriod } from './strategyMomentumPeriodPolicy';

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

const validateDcaConfig = (config: unknown) => {
  const root = asRecord(config);
  const close = asRecord(root?.close);
  const additional = asRecord(root?.additional);
  if (!additional) return;
  const basis = additional.dcaSizingBasis;
  if (basis != null && basis !== 'quantity_v1' && basis !== 'usdt_contribution_v1') {
    throw strategyErrors.invalidCloseConfig({ field: 'additional.dcaSizingBasis', rule: 'invalid_dca_sizing_basis' });
  }
  if (additional.dcaEnabled === true && additional.dcaMode !== 'advanced' &&
    additional.dcaMultiplier != null && Array.isArray(additional.dcaLevels)) {
    const firstLevel = asRecord(additional.dcaLevels[0]);
    const levelMultiplier = firstLevel?.multiplier == null ? null : toFiniteNumber(firstLevel.multiplier);
    const topLevelMultiplier = toFiniteNumber(additional.dcaMultiplier);
    if (levelMultiplier != null && (topLevelMultiplier == null || topLevelMultiplier !== levelMultiplier)) {
      throw strategyErrors.invalidCloseConfig({
        field: 'additional.dcaMultiplier', rule: 'conflicting_basic_dca_multiplier',
        levelMultiplier,
      });
    }
  }
  const closeMode = typeof close?.mode === 'string' ? close.mode.trim().toLowerCase() : 'basic';
  if (additional.dcaEnabled === true && basis !== 'usdt_contribution_v1' && closeMode === 'basic') {
    const rawLevels = Array.isArray(additional.dcaLevels) ? additional.dcaLevels : [];
    const levels = additional.dcaMode === 'basic'
      ? (Number(additional.dcaTimes) > 0 ? rawLevels.slice(0, 1) : [])
      : rawLevels;
    const tp = toFiniteNumber(close?.tp);
    const sl = toFiniteNumber(close?.sl);
    levels.forEach((entry, index) => {
      const percent = toFiniteNumber(asRecord(entry)?.percent);
      if (percent == null || percent === 0) return;
      if (tp != null && tp > 0 && percent > tp) {
        throw strategyErrors.invalidCloseConfig({ field: `additional.dcaLevels[${index}]`,
          rule: 'positive_dca_above_take_profit_unreachable', dcaPercent: percent, takeProfitPercent: tp });
      }
      if (sl != null && sl > 0 && percent < -Math.abs(sl)) {
        throw strategyErrors.invalidCloseConfig({ field: `additional.dcaLevels[${index}]`,
          rule: 'negative_dca_below_stop_loss_unreachable', dcaPercent: percent, stopLossPercent: -Math.abs(sl) });
      }
    });
  }
  if (additional.dcaEnabled !== true || basis !== 'usdt_contribution_v1') return;

  const levels = Array.isArray(additional.dcaLevels) ? additional.dcaLevels : [];
  const mode = additional.dcaMode;
  const count = additional.dcaTimes;
  if ((mode !== 'basic' && mode !== 'advanced') || levels.length === 0 ||
    (mode === 'basic' && (!Number.isInteger(count) || Number(count) < 1 || Number(count) > 10)) ||
    (mode === 'advanced' && count !== levels.length)) {
    throw strategyErrors.invalidCloseConfig({ field: 'additional.dcaLevels', rule: 'invalid_dca_ladder' });
  }
  const activeLevels = mode === 'basic' ? levels.slice(0, 1) : levels;
  activeLevels.forEach((entry, index) => {
    const level = asRecord(entry);
    const percent = toFiniteNumber(level?.percent);
    const multiplier = toFiniteNumber(level?.multiplier);
    if (percent == null || percent === 0 || multiplier == null || multiplier <= 0 || multiplier > 10) {
      throw strategyErrors.invalidCloseConfig({
        field: `additional.dcaLevels[${index}]`,
        rule: 'invalid_dca_level',
      });
    }
  });
};

export const validateMomentumPeriod = (config: unknown) => {
  const invalidMomentumFields = normalizeLegacyMomentumPeriod(config).invalidFields;
  if (invalidMomentumFields.length > 0) {
    throw strategyErrors.invalidMomentumPeriod({
      fields: invalidMomentumFields,
      rule: 'momentum_period_integer_2_255',
      min: 2,
      max: 255,
    });
  }
};

export const validateStrategyConfig = (config: unknown) => {
  validateMomentumPeriod(config);
  validateTrailingTakeProfitLevels(config);
  validateTrailingStopLevels(config);
  validateDcaConfig(config);
};
