import type { BacktestStrategyLinkSnapshot } from './backtestPortfolioSimulation.service';

const asRecord = (value: unknown): Record<string, unknown> | null =>
  value && typeof value === 'object' ? (value as Record<string, unknown>) : null;

export const resolveStrategyLinksFromSeed = (
  seed: Record<string, unknown>,
): BacktestStrategyLinkSnapshot[] => {
  const contextSnapshot = asRecord(seed.contextSnapshot);
  const marketGroupSnapshot =
    asRecord(contextSnapshot?.marketGroup) ??
    asRecord(contextSnapshot?.botMarketGroup) ??
    asRecord(seed.marketGroup) ??
    asRecord(seed.botMarketGroup);
  const rawLinks = [
    contextSnapshot?.strategyLinks,
    marketGroupSnapshot?.strategyLinks,
    seed.strategyLinks,
  ].find(Array.isArray);
  if (!Array.isArray(rawLinks)) return [];

  return rawLinks.flatMap((rawLink, index): BacktestStrategyLinkSnapshot[] => {
    const link = asRecord(rawLink);
    if (!link || link.isEnabled === false || typeof link.strategyId !== 'string') return [];
    const strategySnapshot = asRecord(link.strategy);
    const config = asRecord(link.config) ?? asRecord(strategySnapshot?.config);
    if (!config) return [];
    const priority = Number(link.priority);
    const weight = Number(link.weight);
    const walletRisk = Number(link.walletRisk ?? strategySnapshot?.walletRisk);
    return [
      {
        strategyId: link.strategyId,
        config,
        walletRiskPercent: Number.isFinite(walletRisk) ? walletRisk : null,
        priority: Number.isFinite(priority) ? priority : 100,
        weight: Number.isFinite(weight) ? weight : 1,
        marketGroupStrategyLinkId:
          typeof link.marketGroupStrategyLinkId === 'string'
            ? link.marketGroupStrategyLinkId
            : typeof link.id === 'string'
              ? link.id
              : `seed-link-${index}`,
      },
    ];
  });
};
