import { parseStrategyIndicatorRule } from '../engine/strategySignalEvaluator';

type JsonRecord = Record<string, unknown>;

const asRecord = (value: unknown): JsonRecord | null =>
  value !== null && typeof value === 'object' && !Array.isArray(value)
    ? value as JsonRecord : null;

const isMomentum = (value: unknown) =>
  typeof value === 'string' && value.trim().toUpperCase().includes('MOMENTUM');

const effectivePeriod = (node: JsonRecord) => {
  const params = asRecord(node.params);
  if (!params) return null;
  const key = params.period != null ? 'period' : 'length';
  const value = params[key];
  return value == null ? null : { params, key, value };
};

const isAdmissiblePeriod = (value: unknown) =>
  typeof value === 'number' && Number.isInteger(value) && value >= 2 && value <= 255;

const selectedOperand = (rule: JsonRecord, indicator: string) => {
  const explicit = asRecord(rule.operand);
  const explicitKind = explicit?.kind ?? explicit?.type;
  const explicitIndicator = explicit?.indicator ?? explicit?.name;
  if (explicit && explicitKind !== 'constant' && explicitKind !== 'band' &&
      typeof explicitIndicator === 'string' &&
      explicitIndicator.trim().toUpperCase() === indicator)
    return { source: explicit, path: 'operand' };
  const value = asRecord(rule.value);
  const valueIndicator = value?.indicator ?? value?.name;
  if (value && typeof valueIndicator === 'string' &&
      valueIndicator.trim().toUpperCase() === indicator)
    return { source: value, path: 'value' };
  return null;
};

/** Examines only rules and series operands selected by the evaluator parser. */
export const normalizeLegacyMomentumPeriod = (config: unknown): {
  config: unknown; fields: string[]; invalidFields: string[];
} => {
  const root = asRecord(config);
  const openKey = root?.open != null ? 'open' : 'openConditions';
  const open = asRecord(root?.[openKey]);
  if (!root || !open) return { config, fields: [], invalidFields: [] };
  const fields: string[] = [];
  const invalidFields: string[] = [];
  let nextOpen = open;

  for (const side of ['indicatorsLong', 'indicatorsShort'] as const) {
    const rules = open[side];
    if (!Array.isArray(rules)) continue;
    let nextRules = rules;
    rules.forEach((raw, index) => {
      const rule = asRecord(raw);
      const parsed = parseStrategyIndicatorRule(raw);
      if (!rule || !parsed) return;
      let nextRule = rule;
      const path = `${openKey}.${side}[${index}]`;
      const inspect = (source: JsonRecord, sourcePath: string) => {
        const period = effectivePeriod(source);
        if (!period || isAdmissiblePeriod(period.value)) return source;
        const field = `${sourcePath}.params.${period.key}`;
        invalidFields.push(field);
        if (period.value !== 1) return source;
        fields.push(field);
        return { ...source, params: { ...period.params, [period.key]: 2 } };
      };

      if (isMomentum(parsed.name))
        nextRule = inspect(nextRule, path);
      if (parsed.operand.kind === 'series' && isMomentum(parsed.operand.indicator)) {
        const selected = selectedOperand(rule, parsed.operand.indicator);
        if (selected) {
          const next = inspect(selected.source, `${path}.${selected.path}`);
          if (next !== selected.source) nextRule = { ...nextRule, [selected.path]: next };
        }
      }
      if (nextRule !== rule) {
        if (nextRules === rules) nextRules = [...rules];
        nextRules[index] = nextRule;
      }
    });
    if (nextRules !== rules) nextOpen = { ...nextOpen, [side]: nextRules };
  }
  return { config: nextOpen === open ? config : { ...root, [openKey]: nextOpen },
    fields, invalidFields };
};
