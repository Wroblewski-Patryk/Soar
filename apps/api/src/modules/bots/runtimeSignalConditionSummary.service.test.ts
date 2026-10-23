import { describe, expect, it } from 'vitest';
import { buildSignalConditionSummary } from './runtimeSignalConditionSummary.service';

const open = {
  direction: 'both',
  indicatorsLong: [{ name: 'MOMENTUM', condition: '>', value: 0, params: { period: 1 } }],
  indicatorsShort: [{ name: 'MOMENTUM', condition: '<', value: 0, params: { period: 1 } }],
};

describe('buildSignalConditionSummary', () => {
  it.each([
    ['open.noMatchAction', { open: { ...open, noMatchAction: 'EXIT' } }],
    ['open.exitOnNoSignal', { open: { ...open, exitOnNoSignal: true } }],
    ['openConditions.noMatchAction', { openConditions: { ...open, noMatchAction: 'EXIT' } }],
    ['openConditions.exitOnNoSignal', { openConditions: { ...open, exitOnNoSignal: true } }],
  ] as const)('does not attribute a historical EXIT to saved %s', (_name, config) => {
    expect(buildSignalConditionSummary(config, 'EXIT')).toBeNull();
  });

  it('does not infer the cause of a separate explicit EXIT from entry rules', () => {
    expect(buildSignalConditionSummary({ open }, 'EXIT')).toBeNull();
  });

  it('keeps LONG and SHORT entry conditions and neutral condition inventory', () => {
    const config = { open: { ...open, noMatchAction: 'EXIT' } };
    expect(buildSignalConditionSummary(config, 'LONG')).toBe('MOMENTUM(1) > 0');
    expect(buildSignalConditionSummary(config, 'SHORT')).toBe('MOMENTUM(1) < 0');
    expect(buildSignalConditionSummary(config, null)).toBe(
      'LONG: MOMENTUM(1) > 0 | SHORT: MOMENTUM(1) < 0',
    );
  });
});
