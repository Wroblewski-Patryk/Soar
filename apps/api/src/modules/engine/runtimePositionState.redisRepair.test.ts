import { afterEach, describe, expect, it, vi } from 'vitest';

const fake = vi.hoisted(() => ({ values: new Map<string, string>() }));
vi.mock('redis', () => ({ createClient: () => ({
  isOpen: true, on: () => undefined, connect: async () => undefined,
  get: async (key: string) => fake.values.get(key) ?? null,
  mGet: async (keys: string[]) => keys.map((key) => fake.values.get(key) ?? null),
  set: async (key: string, value: string) => { fake.values.set(key, value); },
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
});
