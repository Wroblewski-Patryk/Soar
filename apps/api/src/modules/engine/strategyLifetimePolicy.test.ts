import { describe, expect, it } from 'vitest';
import {
  resolveStrategyLifetimePolicies,
  resolveStrategyLifetimePolicy,
} from './strategyLifetimePolicy';

describe('resolveStrategyLifetimePolicy', () => {
  it('resolves order and position lifetime policies from strategy additional config', () => {
    const policies = resolveStrategyLifetimePolicies({
      additional: {
        orderLifetime: 15,
        orderUnit: 'min',
        positionLifetime: 2,
        positionUnit: 'h',
      },
    });

    expect(policies.order).toEqual({
      kind: 'order',
      enabled: true,
      value: 15,
      unit: 'min',
      durationMs: 900_000,
    });
    expect(policies.position).toEqual({
      kind: 'position',
      enabled: true,
      value: 2,
      unit: 'h',
      durationMs: 7_200_000,
    });
  });

  it('disables the policy when lifetime is explicitly zero', () => {
    const policy = resolveStrategyLifetimePolicy({
      strategyConfig: {
        additional: {
          orderLifetime: 0,
          orderUnit: 'd',
        },
      },
      kind: 'order',
    });

    expect(policy).toEqual({
      kind: 'order',
      enabled: false,
      value: null,
      unit: null,
      durationMs: null,
    });
  });

  it('fails closed when unit is missing or unsupported', () => {
    const missingUnit = resolveStrategyLifetimePolicy({
      strategyConfig: {
        additional: {
          positionLifetime: 3,
        },
      },
      kind: 'position',
    });
    const invalidUnit = resolveStrategyLifetimePolicy({
      strategyConfig: {
        additional: {
          positionLifetime: 3,
          positionUnit: 'month',
        },
      },
      kind: 'position',
    });

    expect(missingUnit.enabled).toBe(false);
    expect(invalidUnit.enabled).toBe(false);
  });

  it('fails closed when lifetime is negative, missing, or not finite', () => {
    const negative = resolveStrategyLifetimePolicy({
      strategyConfig: {
        additional: {
          orderLifetime: -1,
          orderUnit: 'h',
        },
      },
      kind: 'order',
    });
    const missing = resolveStrategyLifetimePolicy({
      strategyConfig: {
        additional: {
          orderUnit: 'h',
        },
      },
      kind: 'order',
    });
    const invalid = resolveStrategyLifetimePolicy({
      strategyConfig: {
        additional: {
          orderLifetime: Number.NaN,
          orderUnit: 'h',
        },
      },
      kind: 'order',
    });

    expect(negative.enabled).toBe(false);
    expect(missing.enabled).toBe(false);
    expect(invalid.enabled).toBe(false);
  });

  it('truncates positive integer-like values before converting to milliseconds', () => {
    const policy = resolveStrategyLifetimePolicy({
      strategyConfig: {
        additional: {
          positionLifetime: 1.9,
          positionUnit: 'w',
        },
      },
      kind: 'position',
    });

    expect(policy).toEqual({
      kind: 'position',
      enabled: true,
      value: 1,
      unit: 'w',
      durationMs: 604_800_000,
    });
  });
});
