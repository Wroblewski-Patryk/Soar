import { describe, expect, it } from 'vitest';
import {
  assertDeployedWorkerOwnership,
  resolveWorkerEnvironment,
  resolveWorkerMode,
  resolveWorkerTopologySnapshot,
} from './workerOwnership';

describe('workerOwnership', () => {
  it('resolves split worker mode explicitly and defaults everything else to inline', () => {
    expect(resolveWorkerMode('split')).toBe('split');
    expect(resolveWorkerMode('inline')).toBe('inline');
    expect(resolveWorkerMode('unexpected')).toBe('inline');
    expect(resolveWorkerMode(undefined)).toBe('inline');
  });

  it('classifies production as deployed and test separately from local development', () => {
    expect(resolveWorkerEnvironment('production')).toBe('deployed');
    expect(resolveWorkerEnvironment('test')).toBe('test');
    expect(resolveWorkerEnvironment('development')).toBe('local');
  });

  it('keeps inline mode explicit but healthy only for local and test environments', () => {
    const snapshot = resolveWorkerTopologySnapshot({
      env: {
        WORKER_MODE: 'inline',
      },
      nodeEnv: 'test',
    });

    expect(snapshot.mode).toBe('inline');
    expect(snapshot.environment).toBe('test');
    expect(snapshot.topologyStatus).toBe('local_inline');
    expect(snapshot.degradedReasons).toEqual([]);
    expect(snapshot.requiredQueues).toEqual([]);
    expect(snapshot.requiredWorkerFamilies).toEqual([]);
  });

  it('marks deployed inline mode as degraded instead of healthy equivalent', () => {
    const snapshot = resolveWorkerTopologySnapshot({
      env: {
        WORKER_MODE: 'inline',
      },
      nodeEnv: 'production',
    });

    expect(snapshot.environment).toBe('deployed');
    expect(snapshot.topologyStatus).toBe('degraded');
    expect(snapshot.degradedReasons).toEqual(['DEPLOYED_INLINE_MODE']);
    expect(snapshot.requiredQueues).toEqual([]);
    expect(snapshot.requiredWorkerFamilies).toEqual([]);
  });

  it('models the full split topology and queue requirements for deployed workers', () => {
    const snapshot = resolveWorkerTopologySnapshot({
      env: {
        WORKER_MODE: 'split',
        WORKER_MARKET_DATA_OWNERSHIP: 'worker',
        WORKER_BACKTEST_OWNERSHIP: 'worker',
        WORKER_MARKET_DATA_QUEUE: 'market-data',
        WORKER_BACKTEST_QUEUE: 'backtest',
        WORKER_EXECUTION_QUEUE: 'execution',
      },
      nodeEnv: 'production',
    });

    expect(snapshot.topologyStatus).toBe('healthy');
    expect(snapshot.degradedReasons).toEqual([]);
    expect(snapshot.ownership).toEqual({
      backtest: 'worker',
      execution: 'worker',
      marketData: 'worker',
      marketStream: 'worker',
    });
    expect(snapshot.requiredQueues).toEqual([
      'WORKER_BACKTEST_QUEUE',
      'WORKER_EXECUTION_QUEUE',
      'WORKER_MARKET_DATA_QUEUE',
    ]);
    expect(snapshot.missingQueues).toEqual([]);
    expect(snapshot.requiredWorkerFamilies).toEqual([
      'backtest',
      'execution',
      'market-data',
      'market-stream',
    ]);
  });

  it('surfaces deployed split topology drift when optional families stay inline', () => {
    const snapshot = resolveWorkerTopologySnapshot({
      env: {
        WORKER_MODE: 'split',
        WORKER_MARKET_DATA_OWNERSHIP: 'inline',
        WORKER_BACKTEST_OWNERSHIP: 'inline',
        WORKER_EXECUTION_QUEUE: 'execution',
      },
      nodeEnv: 'production',
    });

    expect(snapshot.topologyStatus).toBe('degraded');
    expect(snapshot.degradedReasons).toEqual([
      'DEPLOYED_CANONICAL_FAMILY_INLINE_MARKET_DATA',
      'DEPLOYED_CANONICAL_FAMILY_INLINE_BACKTEST',
    ]);
    expect(snapshot.requiredQueues).toEqual(['WORKER_EXECUTION_QUEUE']);
    expect(snapshot.requiredWorkerFamilies).toEqual(['execution', 'market-stream']);
  });

  it('rejects production worker processes that only emit heartbeats without owning work', () => {
    for (const family of ['backtest', 'execution', 'marketData', 'marketStream'] as const) {
      expect(() => assertDeployedWorkerOwnership(family, {
        env: { NODE_ENV: 'production' },
      })).toThrow(/cannot start without split ownership/);
    }
  });

  it('requires matching queues for deployed workers and accepts the split contract', () => {
    const env = {
      NODE_ENV: 'production',
      WORKER_MODE: 'split',
      WORKER_BACKTEST_OWNERSHIP: 'worker',
      WORKER_MARKET_DATA_OWNERSHIP: 'worker',
      WORKER_BACKTEST_QUEUE: 'backtest',
      WORKER_EXECUTION_QUEUE: 'execution',
      WORKER_MARKET_DATA_QUEUE: 'market-data',
    };
    for (const family of ['backtest', 'execution', 'marketData', 'marketStream'] as const) {
      expect(() => assertDeployedWorkerOwnership(family, { env })).not.toThrow();
    }
    expect(() => assertDeployedWorkerOwnership('backtest', {
      env: { ...env, WORKER_BACKTEST_QUEUE: '' },
    })).toThrow(/WORKER_BACKTEST_QUEUE/);
    expect(() => assertDeployedWorkerOwnership('backtest', {
      env: { NODE_ENV: 'test' },
    })).not.toThrow();
  });
});
