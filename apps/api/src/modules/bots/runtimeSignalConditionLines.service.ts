export type SignalConditionLine = {
  scope: 'LONG' | 'SHORT';
  left: string;
  value: string;
  operator: string;
  right: string;
};

export const parseSignalConditionLines = (value: unknown): SignalConditionLine[] | null => {
  if (!Array.isArray(value)) return null;
  const lines = value
    .map((item) => {
      if (!item || typeof item !== 'object') return null;
      const row = item as Record<string, unknown>;
      const scope = row.scope === 'LONG' || row.scope === 'SHORT' ? row.scope : null;
      const left = typeof row.left === 'string' ? row.left.trim() : '';
      const lineValue = typeof row.value === 'string' ? row.value.trim() : '';
      const operator = typeof row.operator === 'string' ? row.operator.trim() : '';
      const right = typeof row.right === 'string' ? row.right.trim() : '';
      if (!scope || !left || !operator || !right) return null;
      return {
        scope,
        left,
        value: lineValue.length > 0 ? lineValue : 'n/a',
        operator,
        right,
      } satisfies SignalConditionLine;
    })
    .filter((item): item is SignalConditionLine => Boolean(item));
  return lines.length > 0 ? lines : null;
};
