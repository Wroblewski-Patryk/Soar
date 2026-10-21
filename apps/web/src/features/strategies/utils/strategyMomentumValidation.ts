import type { OpenConditions } from '../types/StrategyForm.type';

const hasLegacyOne = (value: unknown): boolean => {
  if (Array.isArray(value)) return value.some(hasLegacyOne);
  if (!value || typeof value !== 'object') return false;
  const record = value as Record<string, unknown>;
  const params = record.params && typeof record.params === 'object' &&
    !Array.isArray(record.params) ? record.params as Record<string, unknown> : null;
  const name = typeof record.name === 'string' ? record.name : record.indicator;
  const period = params?.period ?? params?.length;
  if (typeof name === 'string' && name.trim().toUpperCase().includes('MOMENTUM') &&
      (typeof period === 'number' || typeof period === 'string') && Number(period) === 1)
    return true;
  return Object.entries(record).some(([key, child]) => key !== 'params' && hasLegacyOne(child));
};

export const hasInvalidMomentumPeriod = (open: OpenConditions) =>
  hasLegacyOne(open.indicatorsLong) || hasLegacyOne(open.indicatorsShort);
