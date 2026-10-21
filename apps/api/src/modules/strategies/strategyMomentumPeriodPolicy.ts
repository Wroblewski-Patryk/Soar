type JsonRecord = Record<string, unknown>;

const asRecord = (value: unknown): JsonRecord | null =>
  value !== null && typeof value === 'object' && !Array.isArray(value)
    ? value as JsonRecord : null;

const isLegacyOne = (value: unknown) =>
  (typeof value === 'number' || typeof value === 'string') && Number(value) === 1;

const isMomentum = (value: unknown) =>
  typeof value === 'string' && value.trim().toUpperCase().includes('MOMENTUM');

const visitRule = (value: unknown, path: string, fields: string[]): unknown => {
  if (Array.isArray(value)) {
    const next = value.map((entry, index) => visitRule(entry, `${path}[${index}]`, fields));
    return next.some((entry, index) => entry !== value[index]) ? next : value;
  }
  const record = asRecord(value);
  if (!record) return value;

  let next: JsonRecord = record;
  const params = asRecord(record.params);
  const periodKey = params?.period != null ? 'period' : 'length';
  if ((isMomentum(record.name) || isMomentum(record.indicator)) && params &&
      isLegacyOne(params[periodKey])) {
    fields.push(`${path}.params.${periodKey}`);
    next = { ...record, params: { ...params, [periodKey]: 2 } };
  }
  for (const [key, child] of Object.entries(next)) {
    if (key === 'params') continue;
    const transformed = visitRule(child, `${path}.${key}`, fields);
    if (transformed !== child) next = { ...next, [key]: transformed };
  }
  return next;
};

/** The only writable surface is a saved strategy's entry rules. */
export const normalizeLegacyMomentumPeriod = (config: unknown): {
  config: unknown; fields: string[];
} => {
  const root = asRecord(config);
  const openKey = root?.open != null ? 'open' : 'openConditions';
  const open = asRecord(root?.[openKey]);
  if (!root || !open) return { config, fields: [] };
  const fields: string[] = [];
  let nextOpen = open;
  for (const side of ['indicatorsLong', 'indicatorsShort'] as const) {
    const rules = open[side];
    if (!Array.isArray(rules)) continue;
    const transformed = visitRule(rules, `${openKey}.${side}`, fields);
    if (transformed !== rules) nextOpen = { ...nextOpen, [side]: transformed };
  }
  return { config: nextOpen === open ? config : { ...root, [openKey]: nextOpen }, fields };
};
