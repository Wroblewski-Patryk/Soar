export type StrategyLifetimeUnit = 'min' | 'h' | 'd' | 'w';

export type StrategyLifetimeKind = 'order' | 'position';

export type StrategyLifetimePolicy = {
  kind: StrategyLifetimeKind;
  enabled: boolean;
  value: number | null;
  unit: StrategyLifetimeUnit | null;
  durationMs: number | null;
};

const STRATEGY_LIFETIME_UNIT_MS: Record<StrategyLifetimeUnit, number> = {
  min: 60_000,
  h: 3_600_000,
  d: 86_400_000,
  w: 604_800_000,
};

const toNonNegativeInteger = (value: unknown): number | null => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0) return null;
  return Math.trunc(parsed);
};

const normalizeLifetimeUnit = (value: unknown): StrategyLifetimeUnit | null => {
  if (typeof value !== 'string') return null;
  const normalized = value.trim().toLowerCase();
  if (normalized === 'min' || normalized === 'h' || normalized === 'd' || normalized === 'w') {
    return normalized;
  }
  return null;
};

const resolveAdditionalConfig = (
  strategyConfig: Record<string, unknown> | null | undefined
): Record<string, unknown> | null => {
  if (!strategyConfig || typeof strategyConfig !== 'object') return null;
  const additional =
    strategyConfig.additional && typeof strategyConfig.additional === 'object'
      ? (strategyConfig.additional as Record<string, unknown>)
      : null;
  return additional;
};

const buildDisabledPolicy = (kind: StrategyLifetimeKind): StrategyLifetimePolicy => ({
  kind,
  enabled: false,
  value: null,
  unit: null,
  durationMs: null,
});

export const resolveStrategyLifetimePolicy = (input: {
  strategyConfig: Record<string, unknown> | null | undefined;
  kind: StrategyLifetimeKind;
}): StrategyLifetimePolicy => {
  const additional = resolveAdditionalConfig(input.strategyConfig);
  if (!additional) return buildDisabledPolicy(input.kind);

  const rawValue =
    input.kind === 'order' ? additional.orderLifetime : additional.positionLifetime;
  const rawUnit =
    input.kind === 'order' ? additional.orderUnit : additional.positionUnit;

  const value = toNonNegativeInteger(rawValue);
  const unit = normalizeLifetimeUnit(rawUnit);

  if (value == null || value === 0 || unit == null) {
    return buildDisabledPolicy(input.kind);
  }

  return {
    kind: input.kind,
    enabled: true,
    value,
    unit,
    durationMs: value * STRATEGY_LIFETIME_UNIT_MS[unit],
  };
};

export const resolveStrategyLifetimePolicies = (
  strategyConfig: Record<string, unknown> | null | undefined
) => ({
  order: resolveStrategyLifetimePolicy({ strategyConfig, kind: 'order' }),
  position: resolveStrategyLifetimePolicy({ strategyConfig, kind: 'position' }),
});
