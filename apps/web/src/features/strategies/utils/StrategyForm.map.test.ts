import { describe, expect, it } from 'vitest';
import { dtoToForm, formToPayload } from './StrategyForm.map';
import { StrategyFormState } from '../types/StrategyForm.type';

const baseForm = (): StrategyFormState => ({
  name: 'Test strategy',
  description: '',
  interval: '5m',
  leverage: 5,
  walletRisk: 1,
  openConditions: {
    direction: 'both',
    indicatorsLong: [],
    indicatorsShort: [],
  },
  closeConditions: {
    mode: 'basic',
    tp: 2,
    sl: 1,
    ttp: [],
    tsl: [],
  },
  additional: {
    dcaEnabled: true,
    dcaMode: 'basic',
    dcaTimes: 2,
    dcaMultiplier: 2,
    dcaLevels: [{ percent: -20, multiplier: 2 }],
    maxPositions: 1,
    maxOrders: 1,
    positionLifetime: 1,
    positionUnit: 'h',
    orderLifetime: 1,
    orderUnit: 'h',
    marginMode: 'CROSSED',
  },
});

describe('formToPayload', () => {
  it('keeps signed basic DCA trigger percent', () => {
    const payload = formToPayload(baseForm());
    const additional = payload.config.additional as {
      dcaLevels: Array<{ percent: number; multiplier: number }>;
      dcaTimes: number;
    };
    expect(additional.dcaLevels[0].percent).toBe(-20);
    expect(additional.dcaTimes).toBe(2);
  });

  it('uses all advanced DCA levels and aligns dcaTimes with ladder length', () => {
    const form = baseForm();
    form.additional.dcaMode = 'advanced';
    form.additional.dcaTimes = 1;
    form.additional.dcaLevels = [
      { percent: -10, multiplier: 1, clientId: 'dca-1' },
      { percent: 10, multiplier: 1.5, clientId: 'dca-2' },
    ];

    const payload = formToPayload(form);
    const additional = payload.config.additional as {
      dcaLevels: Array<{ percent: number; multiplier: number }>;
      dcaTimes: number;
    };
    expect(additional.dcaLevels).toHaveLength(2);
    expect(additional.dcaTimes).toBe(2);
  });

  it('preserves zero lifetime values as explicit no-limit semantics', () => {
    const form = baseForm();
    form.additional.positionLifetime = 0;
    form.additional.orderLifetime = 0;

    const payload = formToPayload(form);
    const additional = payload.config.additional as {
      positionLifetime: number;
      orderLifetime: number;
    };

    expect(additional.positionLifetime).toBe(0);
    expect(additional.orderLifetime).toBe(0);
  });

  it('strips only truly invalid advanced trailing thresholds from submit payload', () => {
    const form = baseForm();
    form.closeConditions = {
      mode: 'advanced',
      tp: 3,
      sl: 2,
      ttp: [
        { percent: 20, arm: 10 },
        { percent: 10, arm: 20 },
      ],
      tsl: [
        { percent: -20, arm: 10 },
        { percent: 20, arm: 10 },
        { percent: -5, arm: 10 },
      ],
    };

    const payload = formToPayload(form);
    const close = payload.config.close as {
      ttp: Array<{ percent: number; arm: number }>;
      tsl: Array<{ percent: number; arm: number }>;
    };

    expect(close.ttp).toEqual([{ percent: 20, arm: 10 }]);
    expect(close.tsl).toEqual([
      { percent: -20, arm: 10 },
      { percent: -5, arm: 10 },
    ]);
  });

  it('sanitizes only truly invalid advanced trailing thresholds on dto load', () => {
    const form = dtoToForm({
      id: 'strategy-1',
      name: 'Legacy close drift',
      description: '',
      interval: '5m',
      leverage: 10,
      createdAt: new Date().toISOString(),
      walletRisk: 1,
      config: {
        open: { direction: 'both', indicatorsLong: [], indicatorsShort: [] },
        close: {
          mode: 'advanced',
          tp: 3,
          sl: 2,
          ttp: [
            { percent: 20, arm: 10 },
            { percent: 10, arm: 20 },
          ],
          tsl: [
            { percent: -20, arm: 10 },
            { percent: 20, arm: 10 },
            { percent: -5, arm: 10 },
          ],
        },
        additional: baseForm().additional,
      },
    });

    expect(form.closeConditions.ttp).toEqual([
      expect.objectContaining({ percent: 20, arm: 10 }),
    ]);
    expect(form.closeConditions.tsl).toEqual([
      expect.objectContaining({ percent: -20, arm: 10 }),
      expect.objectContaining({ percent: -5, arm: 10 }),
    ]);
  });

  it('strips local client ids from close and advanced DCA payloads', () => {
    const form = baseForm();
    form.closeConditions.mode = 'advanced';
    form.closeConditions.ttp = [{ percent: 20, arm: 10, clientId: 'ttp-1' }];
    form.closeConditions.tsl = [{ percent: -5, arm: 10, clientId: 'tsl-1' }];
    form.additional.dcaMode = 'advanced';
    form.additional.dcaLevels = [
      { percent: -10, multiplier: 5, clientId: 'dca-1' },
      { percent: -20, multiplier: 10, clientId: 'dca-2' },
    ];

    const payload = formToPayload(form);
    const close = payload.config.close as {
      ttp: Array<Record<string, number>>;
      tsl: Array<Record<string, number>>;
    };
    const additional = payload.config.additional as {
      dcaLevels: Array<Record<string, number>>;
    };

    expect(close.ttp).toEqual([{ percent: 20, arm: 10 }]);
    expect(close.tsl).toEqual([{ percent: -5, arm: 10 }]);
    expect(additional.dcaLevels).toEqual([
      { percent: -10, multiplier: 5 },
      { percent: -20, multiplier: 10 },
    ]);
  });
});
