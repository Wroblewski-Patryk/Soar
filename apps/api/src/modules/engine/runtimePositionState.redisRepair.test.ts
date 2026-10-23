import { afterEach, describe, expect, it, vi } from 'vitest';

const fake = vi.hoisted(() => ({ values: new Map<string, string>() }));
vi.mock('redis', () => ({ createClient: () => ({
  isOpen: true, on: () => undefined, connect: async () => undefined,
  get: async (key: string) => fake.values.get(key) ?? null,
  mGet: async (keys: string[]) => keys.map((key) => fake.values.get(key) ?? null),
  set: async (key: string, value: string, options?: { NX?: boolean }) => {
    if (options?.NX && fake.values.has(key)) return null;
    fake.values.set(key, value);
    return 'OK';
  },
  del: async (key: string) => { fake.values.delete(key); },
}) }));

import { RuntimePositionStateStore } from './runtimePositionState.store';

afterEach(() => { vi.unstubAllEnvs(); fake.values.clear(); });

describe('runtime state after another worker repairs Redis', () => {
  it('reads the repaired value ahead of a stale process-local copy', async () => {
    vi.stubEnv('NODE_ENV', 'development');
    const store = new RuntimePositionStateStore();
    await store.setPositionRuntimeState('position-1', {
      quantity: 1, averageEntryPrice: 100, currentAdds: 0, trailingAnchorPrice: 100,
    });
    const key = 'runtime:position-state:position-1';
    fake.values.set(key, JSON.stringify({ quantity: 2, averageEntryPrice: 95,
      currentAdds: 1, executedDcaLevelIndices: [0], trailingAnchorPrice: 100 }));
    expect(await store.getPositionRuntimeState('position-1'))
      .toMatchObject({ quantity: 2, averageEntryPrice: 95, currentAdds: 1 });
    expect((await store.getPositionRuntimeStates(['position-1'])).get('position-1'))
      .toMatchObject({ quantity: 2, averageEntryPrice: 95, currentAdds: 1 });
    fake.values.delete(key);
    expect(await store.getPositionRuntimeState('position-1')).toBeNull();
  });

  it('does not fall back to process memory when the shared protection snapshot is lost', async () => {
    vi.stubEnv('NODE_ENV', 'development');
    const store = new RuntimePositionStateStore();
    await store.setPositionRuntimeState('position-2', {
      quantity: 2, averageEntryPrice: 95, currentAdds: 1,
      trailingAnchorPrice: 120,
      trailingTakeProfitHighPercent: 120 / 95 - 1,
      trailingTakeProfitStepPercent: 0.3 / 95,
    });
    const key = 'runtime:position-state:position-2';
    expect(await store.getTrustedPositionRuntimeState('position-2')).not.toBeNull();
    fake.values.delete(key);
    expect(await store.getTrustedPositionRuntimeState('position-2')).toBeNull();
    fake.values.set(key, JSON.stringify({ quantity: 2, averageEntryPrice: 95,
      currentAdds: 1, trailingAnchorPrice: 120,
      trailingTakeProfitHighPercent: 120 / 95 - 1 }));
    expect(await store.getTrustedPositionRuntimeState('position-2')).toBeNull();
  });

  it('initializes only a new key and preserves protection on a repeated OPEN', async () => {
    vi.stubEnv('NODE_ENV', 'development');
    const store = new RuntimePositionStateStore();
    const base = { quantity: 1, averageEntryPrice: 100,
      currentAdds: 0, trailingAnchorPrice: 100 };
    expect(await store.initializeNewPositionRuntimeState('position-3', base)).toBe(true);
    fake.values.set('runtime:position-state:position-3', JSON.stringify({
      ...base, trailingAnchorPrice: 120,
      trailingTakeProfitHighPercent: 0.2,
      trailingTakeProfitStepPercent: 0.01,
    }));
    expect(await store.initializeNewPositionRuntimeState('position-3', base)).toBe(true);
    expect(await store.getTrustedPositionRuntimeState('position-3')).toMatchObject({
      trailingTakeProfitHighPercent: 0.2, trailingTakeProfitStepPercent: 0.01,
    });
  });
});
