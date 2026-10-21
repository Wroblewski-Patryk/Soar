import type { OpenConditions } from '../types/StrategyForm.type';

const asRecord = (value: unknown): Record<string, unknown> | null =>
  value !== null && typeof value === 'object' && !Array.isArray(value)
    ? value as Record<string, unknown> : null;

const invalidPeriod = (node: Record<string, unknown>) => {
  const params = asRecord(node.params);
  const period = params?.period ?? params?.length;
  return period != null && !(typeof period === 'number' &&
    Number.isInteger(period) && period >= 2 && period <= 255);
};

const isMomentum = (value: unknown) =>
  typeof value === 'string' && value.trim().toUpperCase().includes('MOMENTUM');

const invalidRule = (value: unknown) => {
  const rule = asRecord(value);
  if (!rule) return false;
  if (isMomentum(rule.name) && invalidPeriod(rule)) return true;
  if (rule.condition === 'IN_RANGE' || rule.condition === 'OUT_OF_RANGE') return false;
  const explicit = asRecord(rule.operand);
  const kind = explicit?.kind ?? explicit?.type;
  const explicitName = explicit?.indicator ?? explicit?.name;
  if (explicit && kind === 'constant') return false;
  if (explicit && kind !== 'band' && typeof explicitName === 'string' &&
      explicitName.trim().length > 0)
    return isMomentum(explicitName) && invalidPeriod(explicit);
  const seriesValue = asRecord(rule.value);
  return !!seriesValue && isMomentum(seriesValue.indicator ?? seriesValue.name) &&
    invalidPeriod(seriesValue);
};

export const hasInvalidMomentumPeriod = (open: OpenConditions) =>
  [...open.indicatorsLong, ...open.indicatorsShort].some(invalidRule);
