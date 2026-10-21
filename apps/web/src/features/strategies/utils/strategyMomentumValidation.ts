import type { OpenConditions } from '../types/StrategyForm.type';

type JsonRecord = Record<string, unknown>;
type SelectedOperand = { kind: 'series'; source: JsonRecord } |
  { kind: 'constant' | 'band' | 'other' };

const asRecord = (value: unknown): JsonRecord | null =>
  value !== null && typeof value === 'object' && !Array.isArray(value)
    ? value as JsonRecord : null;

const isFiniteNumber = (value: unknown) => Number.isFinite(Number(value));

const isBand = (value: unknown) => {
  if (Array.isArray(value))
    return value.length >= 2 && isFiniteNumber(value[0]) && isFiniteNumber(value[1]);
  const record = asRecord(value);
  return !!record && isFiniteNumber(record.low ?? record.min) &&
    isFiniteNumber(record.high ?? record.max);
};

const series = (value: unknown): SelectedOperand | null => {
  const source = asRecord(value);
  const indicator = source?.indicator ?? source?.name;
  return typeof indicator === 'string' && indicator.trim().length > 0
    ? { kind: 'series', source: source! } : null;
};

const explicitOperand = (value: unknown): SelectedOperand | null => {
  const record = asRecord(value);
  const kind = typeof record?.kind === 'string' ? record.kind : record?.type;
  if (kind === 'constant')
    return isFiniteNumber(record?.value) ? { kind: 'constant' } : null;
  if (kind === 'series') return series(value);
  if (kind === 'band') return isBand(value) ? { kind: 'band' } : null;
  return series(value) ?? (isBand(value) ? { kind: 'band' } : null);
};

const rangeCondition = (value: unknown) =>
  value === 'IN_RANGE' || value === 'OUT_OF_RANGE';

const comparatorCondition = (value: unknown) =>
  value === '>' || value === '>=' || value === '<' || value === '<=' ||
  value === '==' || value === '!=' || value === 'CROSS_ABOVE' ||
  value === 'CROSS_BELOW';

/** Mirrors the evaluator's operand precedence for form admission. */
const selectedOperand = (rule: JsonRecord): SelectedOperand | null => {
  const explicit = explicitOperand(rule.operand);
  if (rangeCondition(rule.condition)) {
    if (explicit?.kind === 'band') return explicit;
    return isBand(rule.value) ? { kind: 'band' } : null;
  }
  if (!comparatorCondition(rule.condition)) return null;
  if (explicit) {
    if (explicit.kind === 'band') return null;
    return explicit;
  }
  const fromValue = series(rule.value);
  if (fromValue) return fromValue;
  if (typeof rule.name === 'string' && rule.name.trim().toUpperCase().includes('EMA'))
    return { kind: 'other' };
  return isFiniteNumber(rule.value) ? { kind: 'other' } : null;
};

const invalidPeriod = (node: JsonRecord) => {
  const params = asRecord(node.params);
  const period = params?.period ?? params?.length;
  return period != null && !(typeof period === 'number' &&
    Number.isInteger(period) && period >= 2 && period <= 255);
};

const isMomentum = (value: unknown) =>
  typeof value === 'string' && value.trim().toUpperCase().includes('MOMENTUM');

const invalidRule = (value: unknown) => {
  const rule = asRecord(value);
  if (!rule || typeof rule.name !== 'string' || !rule.name.trim()) return false;
  const operand = selectedOperand(rule);
  if (!operand) return false;
  if (isMomentum(rule.name) && invalidPeriod(rule)) return true;
  return operand.kind === 'series' &&
    isMomentum(operand.source.indicator ?? operand.source.name) &&
    invalidPeriod(operand.source);
};

export const hasInvalidMomentumPeriod = (open: OpenConditions) =>
  [...open.indicatorsLong, ...open.indicatorsShort].some(invalidRule);
