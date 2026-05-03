import { describe, expect, it } from 'vitest';

import { mergeRuntimeStrategyVotes, type StrategyVote } from './runtimeSignalMerge';
import type { ActiveBotStrategy } from './runtimeSignalLoopDefaults';

const strategy = (strategyId: string): ActiveBotStrategy => ({
  strategyId,
  strategyInterval: '5m',
  strategyConfig: null,
  strategyLeverage: 1,
  walletRisk: 1,
  priority: 100,
  weight: 1,
});

describe('mergeRuntimeStrategyVotes', () => {
  it('uses lower numeric priority as the winner for EXIT provenance', () => {
    const votes: StrategyVote[] = [
      { strategyId: 'strategy-low-urgency', direction: 'EXIT', priority: 100, weight: 10 },
      { strategyId: 'strategy-high-urgency', direction: 'EXIT', priority: 1, weight: 1 },
    ];

    const decision = mergeRuntimeStrategyVotes({
      strategies: votes.map((vote) => strategy(vote.strategyId)),
      votes,
      minDirectionalScore: 1,
    });

    expect(decision.direction).toBe('EXIT');
    expect(decision.strategyId).toBe('strategy-high-urgency');
    expect(decision.metadata).toMatchObject({
      reason: 'exit_priority',
      winner: {
        strategyId: 'strategy-high-urgency',
        priority: 1,
      },
    });
  });

  it('uses lower numeric priority before weight when selecting directional provenance', () => {
    const votes: StrategyVote[] = [
      { strategyId: 'strategy-heavy-normal', direction: 'LONG', priority: 100, weight: 10 },
      { strategyId: 'strategy-urgent-light', direction: 'LONG', priority: 1, weight: 1 },
    ];

    const decision = mergeRuntimeStrategyVotes({
      strategies: votes.map((vote) => strategy(vote.strategyId)),
      votes,
      minDirectionalScore: 1,
    });

    expect(decision.direction).toBe('LONG');
    expect(decision.strategyId).toBe('strategy-urgent-light');
    expect(decision.metadata).toMatchObject({
      reason: 'weighted_winner',
      winner: {
        strategyId: 'strategy-urgent-light',
        priority: 1,
        weight: 1,
      },
    });
  });
});
