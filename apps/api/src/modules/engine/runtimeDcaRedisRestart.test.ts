import { afterEach, describe, expect, it, vi } from 'vitest';
import { evaluatePositionManagement } from './positionManagement.service';
import { RuntimePositionStateStore } from './runtimePositionState.store';

const fakeRedis = vi.hoisted(() => new Map<string, string>());
vi.mock('redis', () => ({
  createClient: () => ({
    on: () => undefined,
    connect: async () => undefined,
    get: async (key: string) => fakeRedis.get(key) ?? null,
    set: async (key: string, value: string) => { fakeRedis.set(key, value); },
    del: async (key: string) => { fakeRedis.delete(key); },
    mGet: async (keys: string[]) => keys.map((key) => fakeRedis.get(key) ?? null),
  }),
}));

afterEach(() => {
  vi.unstubAllEnvs();
  fakeRedis.clear();
});

describe('runtime USDT DCA Redis restart', () => {
  it('recovers contribution and executed level, then sizes only the second basic add', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    const quantity = 1 + 2 / 0.695;
    const averageEntryPrice = 3 / quantity;
    const firstProcess = new RuntimePositionStateStore();
    expect(await firstProcess.setPositionRuntimeState('redis-usdt-dca', {
      quantity, averageEntryPrice, currentAdds: 1,
      executedDcaLevelIndices: [0], lastDcaPrice: 0.695,
    })).toBe(true);

    const restartedProcess = new RuntimePositionStateStore();
    const recovered = await restartedProcess.getPositionRuntimeState('redis-usdt-dca');
    expect(recovered).toMatchObject({ quantity, averageEntryPrice,
      currentAdds: 1, executedDcaLevelIndices: [0] });

    const nextPrice = averageEntryPrice * 0.695;
    const result = evaluatePositionManagement({
      side: 'LONG', currentPrice: nextPrice, leverage: 1,
      dca: { enabled: true, maxAdds: 2, stepPercent: 0.305,
        levelPercents: [-0.305, -0.305], addSizeFraction: 2,
        addSizeFractions: [2, 2], sizingBasis: 'usdt_contribution_v1' },
    }, recovered!);
    expect(result.dcaExecuted).toBe(true);
    expect(result.dcaLevelIndex).toBe(1);
    expect(result.dcaAddedQuantity * nextPrice).toBeCloseTo(6, 8);
    expect(result.nextState.quantity * result.nextState.averageEntryPrice)
      .toBeCloseTo(9, 8);
  });
});
