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

  it('uses market-group strategy link id as the EXIT tie-break after priority', () => {
    const votes: StrategyVote[] = [
      {
        strategyId: 'strategy-a',
        direction: 'EXIT',
        priority: 10,
        weight: 1,
        marketGroupStrategyLinkId: 'link-b',
      },
      {
        strategyId: 'strategy-b',
        direction: 'EXIT',
        priority: 10,
        weight: 1,
        marketGroupStrategyLinkId: 'link-a',
      },
    ];

    const decision = mergeRuntimeStrategyVotes({
      strategies: votes.map((vote) => strategy(vote.strategyId)),
      votes,
      minDirectionalScore: 1,
    });

    expect(decision.direction).toBe('EXIT');
    expect(decision.strategyId).toBe('strategy-b');
    expect(decision.metadata).toMatchObject({
      reason: 'exit_priority',
      winner: {
        strategyId: 'strategy-b',
        marketGroupStrategyLinkId: 'link-a',
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

  it('uses market-group strategy link id as the final deterministic tie-break', () => {
    const votes: StrategyVote[] = [
      {
        strategyId: 'strategy-same',
        direction: 'LONG',
        priority: 100,
        weight: 1,
        marketGroupStrategyLinkId: 'link-b',
      },
      {
        strategyId: 'strategy-same',
        direction: 'LONG',
        priority: 100,
        weight: 1,
        marketGroupStrategyLinkId: 'link-a',
      },
    ];

    const decision = mergeRuntimeStrategyVotes({
      strategies: votes.map((vote) => strategy(vote.strategyId)),
      votes,
      minDirectionalScore: 1,
    });

    expect(decision.direction).toBe('LONG');
    expect(decision.strategyId).toBe('strategy-same');
    expect(decision.metadata).toMatchObject({
      winner: {
        strategyId: 'strategy-same',
        marketGroupStrategyLinkId: 'link-a',
      },
    });
  });
});
