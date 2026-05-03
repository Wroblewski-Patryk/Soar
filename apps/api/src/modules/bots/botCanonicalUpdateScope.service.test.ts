import { describe, expect, it } from 'vitest';
import { resolveExistingCanonicalUpdateScope } from './botCanonicalUpdateScope.service';

describe('resolveExistingCanonicalUpdateScope', () => {
  it('does not fall back to legacy or disabled strategies when canonical scope exists', () => {
    const scope = resolveExistingCanonicalUpdateScope({
      strategyId: 'legacy-strategy',
      symbolGroupId: 'legacy-group',
      botMarketGroups: [
        {
          symbolGroupId: 'canonical-group',
          lifecycleStatus: 'ACTIVE',
          executionOrder: 1,
          isEnabled: true,
          createdAt: new Date('2026-05-03T10:00:00.000Z'),
          strategyLinks: [
            {
              strategyId: 'disabled-canonical-strategy',
              isEnabled: false,
              priority: 1,
              createdAt: new Date('2026-05-03T10:01:00.000Z'),
            },
          ],
        },
      ],
    });

    expect(scope).toEqual({
      hasCanonicalScope: true,
      symbolGroupId: 'canonical-group',
      primaryStrategyId: null,
      enabledStrategyIds: [],
    });
  });

  it('keeps legacy strategy fallback for bots without canonical scope', () => {
    const scope = resolveExistingCanonicalUpdateScope({
      strategyId: 'legacy-strategy',
      symbolGroupId: 'legacy-group',
      botMarketGroups: [],
    });

    expect(scope).toEqual({
      hasCanonicalScope: false,
      symbolGroupId: 'legacy-group',
      primaryStrategyId: 'legacy-strategy',
      enabledStrategyIds: ['legacy-strategy'],
    });
  });
});
