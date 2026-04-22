import { describe, expect, it } from 'vitest';

import { buildStrategyProjectionDriftItem } from './botStrategyProjectionDrift.service';

describe('botStrategyProjectionDrift.service', () => {
  it('prefers canonical active market-group strategy over legacy botStrategy row', () => {
    const item = buildStrategyProjectionDriftItem({
      id: 'bot-1',
      name: 'Alpha',
      botStrategies: [
        {
          id: 'legacy-1',
          strategyId: 'legacy-strategy',
          symbolGroupId: 'group-legacy',
          isEnabled: true,
          createdAt: new Date('2026-01-01T00:00:00.000Z'),
        },
      ],
      botMarketGroups: [
        {
          id: 'group-1',
          symbolGroupId: 'group-primary',
          lifecycleStatus: 'ACTIVE',
          executionOrder: 10,
          isEnabled: true,
          createdAt: new Date('2026-01-02T00:00:00.000Z'),
          strategyLinks: [
            {
              strategyId: 'canonical-strategy',
              isEnabled: true,
              priority: 1,
              createdAt: new Date('2026-01-02T00:00:00.000Z'),
            },
          ],
        },
      ],
    });

    expect(item.canonicalPrimaryStrategyId).toBe('canonical-strategy');
    expect(item.legacyEnabledStrategyId).toBe('legacy-strategy');
    expect(item.hasLegacyCanonicalDivergence).toBe(true);
    expect(item.repairable).toBe(true);
  });
});
