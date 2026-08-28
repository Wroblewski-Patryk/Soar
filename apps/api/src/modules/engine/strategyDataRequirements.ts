import { getStrategyIndicatorRegistryEntry } from './strategyIndicatorRegistry';
import { parseStrategySignalRules } from './strategySignalEvaluator';

export type StrategyDerivativeRequirements = {
  fundingRate: boolean;
  openInterest: boolean;
  orderBook: boolean;
};

const indicatorNamesFromConfig = (config: unknown): string[] => {
  const parsed = parseStrategySignalRules(
    config && typeof config === 'object' ? config as Record<string, unknown> : null,
  );
  const parsedNames = parsed ? [...parsed.longRules, ...parsed.shortRules].flatMap((rule) => {
    const names = [rule.name.trim().toUpperCase()];
    if (rule.operand.kind === 'series') {
      names.push(rule.operand.indicator.trim().toUpperCase());
    }
    return names;
  }) : [];

  const legacyNames: string[] = [];
  const visit = (value: unknown) => {
    if (Array.isArray(value)) {
      value.forEach(visit);
      return;
    }
    if (!value || typeof value !== 'object') return;

    const record = value as Record<string, unknown>;
    if (typeof record.name === 'string' && getStrategyIndicatorRegistryEntry(record.name)) {
      legacyNames.push(record.name.trim().toUpperCase());
    }
    if (typeof record.indicator === 'string' && getStrategyIndicatorRegistryEntry(record.indicator)) {
      legacyNames.push(record.indicator.trim().toUpperCase());
    }
    Object.values(record).forEach(visit);
  };
  visit(config);

  return [...new Set([...parsedNames, ...legacyNames])];
};

export const resolveStrategyDerivativeRequirements = (
  configs: unknown[],
): StrategyDerivativeRequirements => {
  const requirements: StrategyDerivativeRequirements = {
    fundingRate: false,
    openInterest: false,
    orderBook: false,
  };

  for (const name of configs.flatMap(indicatorNamesFromConfig)) {
    const registryEntry = getStrategyIndicatorRegistryEntry(name);
    if (registryEntry?.dataRequirement !== 'DERIVATIVES') continue;

    if (name.startsWith('FUNDING_RATE')) requirements.fundingRate = true;
    if (name.startsWith('OPEN_INTEREST')) requirements.openInterest = true;
    if (name.startsWith('ORDER_BOOK')) requirements.orderBook = true;
  }

  return requirements;
};

export const requiresAnyDerivativeInput = (requirements: StrategyDerivativeRequirements) =>
  requirements.fundingRate || requirements.openInterest || requirements.orderBook;
