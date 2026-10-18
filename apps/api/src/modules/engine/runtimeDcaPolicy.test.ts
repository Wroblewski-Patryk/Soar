import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { prisma } from '../../prisma/client';
import { openOrder } from '../orders/orders.service';
import { DcaConfigSchema } from './positionManagement.types';
import { executeRuntimeDca } from './runtimePositionAutomation.service';
import { assertRuntimeDcaOrderAllowed, resolveRuntimeDcaPolicyBlock } from './runtimeDcaPolicy';

vi.mock('../orders/orders.service', async (importOriginal) => ({
  ...await importOriginal<typeof import('../orders/orders.service')>(),
  openOrder: vi.fn(),
}));

beforeEach(() => {
  vi.spyOn(prisma.position, 'findFirst').mockResolvedValue({
    strategyId: 'strategy-1', botId: 'bot-1',
    bot: { strategyId: 'strategy-1', botMarketGroups: [] },
  } as any);
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.mocked(openOrder).mockClear();
});

describe('runtime DCA sizing guard', () => {
  it.each([
    ['PAPER', 2], ['PAPER', 5], ['LIVE', 2], ['LIVE', 5],
  ] as const)('blocks direct %s DCA multiplier %s before createOrder', async (mode, multiplier) => {
    vi.spyOn(prisma.strategy, 'findFirst').mockResolvedValue({
      config: { additional: { dcaEnabled: true, dcaSizingBasis: 'usdt_contribution_v1',
        dcaLevels: [{ percent: -20, multiplier }] } },
    } as any);

    await expect(executeRuntimeDca({
      userId: 'user-1', botId: 'bot-1', strategyId: 'strategy-1',
      positionId: 'position-1', symbol: 'BTCUSDT', positionSide: 'LONG',
      dcaLevelIndex: 0, markPrice: 0.8, mode, addedQuantity: multiplier,
      currentQuantity: 1, currentEntryPrice: 1,
    })).rejects.toMatchObject({ code: 'USDT_DCA_RUNTIME_UNSUPPORTED' });
    expect(openOrder).not.toHaveBeenCalled();
  });

  it('blocks direct DCA when its strategy configuration cannot be read', async () => {
    vi.spyOn(prisma.strategy, 'findFirst').mockResolvedValue(null);
    await expect(executeRuntimeDca({
      userId: 'user-1', botId: 'bot-1', strategyId: 'strategy-1',
      positionId: 'position-1', symbol: 'BTCUSDT', positionSide: 'LONG',
      dcaLevelIndex: 0, markPrice: 0.8, mode: 'PAPER', addedQuantity: 2,
      currentQuantity: 1, currentEntryPrice: 1,
    })).rejects.toMatchObject({ code: 'RUNTIME_DCA_STRATEGY_UNAVAILABLE' });
    expect(openOrder).not.toHaveBeenCalled();
  });

  it('rejects a different owned strategy ID before reading its benign config or creating an order', async () => {
    const readStrategy = vi.spyOn(prisma.strategy, 'findFirst').mockResolvedValue({
      config: { additional: { dcaEnabled: true, dcaMultiplier: 2 } },
    } as any);
    await expect(executeRuntimeDca({
      userId: 'user-1', botId: 'bot-1', strategyId: 'other-owned-strategy',
      positionId: 'position-1', symbol: 'BTCUSDT', positionSide: 'LONG',
      dcaLevelIndex: 0, markPrice: 0.8, mode: 'LIVE', addedQuantity: 2,
      currentQuantity: 1, currentEntryPrice: 1,
    })).rejects.toMatchObject({ code: 'RUNTIME_DCA_OWNERSHIP_MISMATCH' });
    expect(readStrategy).not.toHaveBeenCalled();
    expect(openOrder).not.toHaveBeenCalled();
  });

  it('uses the sole active bot strategy link when position strategy provenance is null', async () => {
    vi.mocked(prisma.position.findFirst).mockResolvedValue({
      strategyId: null, botId: 'bot-1',
      bot: { strategyId: 'other-owned-strategy', botMarketGroups: [{
        strategyLinks: [{ strategyId: 'linked-usdt-strategy' }],
      }] },
    } as any);
    const readStrategy = vi.spyOn(prisma.strategy, 'findFirst').mockResolvedValue({
      config: { additional: { dcaEnabled: true, dcaMultiplier: 2 } },
    } as any);
    await expect(assertRuntimeDcaOrderAllowed({
      userId: 'user-1', botId: 'bot-1', strategyId: 'other-owned-strategy', positionId: 'position-1',
    })).rejects.toMatchObject({ code: 'RUNTIME_DCA_OWNERSHIP_MISMATCH' });
    expect(readStrategy).not.toHaveBeenCalled();
    expect(openOrder).not.toHaveBeenCalled();
  });

  it('accepts a matching legacy bot strategy when the position has no strategy ID or active links', async () => {
    vi.mocked(prisma.position.findFirst).mockResolvedValue({
      strategyId: null, botId: 'bot-1',
      bot: { strategyId: 'legacy-strategy', botMarketGroups: [] },
    } as any);
    const readStrategy = vi.spyOn(prisma.strategy, 'findFirst').mockResolvedValue({
      config: { additional: { dcaEnabled: true, dcaMultiplier: 2 } },
    } as any);
    await expect(assertRuntimeDcaOrderAllowed({
      userId: 'user-1', botId: 'bot-1', strategyId: 'legacy-strategy', positionId: 'position-1',
    })).resolves.toBeUndefined();
    expect(readStrategy).toHaveBeenCalledWith({
      where: { id: 'legacy-strategy', userId: 'user-1' }, select: { config: true },
    });
    expect(openOrder).not.toHaveBeenCalled();
  });

  it.each(['PAPER', 'LIVE'] as const)('blocks direct %s quantity DCA above the old multiplier limit', async (mode) => {
    vi.spyOn(prisma.strategy, 'findFirst').mockResolvedValue({
      config: { additional: { dcaEnabled: true, dcaLevels: [{ percent: -20, multiplier: 5 }] } },
    } as any);
    await expect(executeRuntimeDca({
      userId: 'user-1', botId: 'bot-1', strategyId: 'strategy-1',
      positionId: 'position-1', symbol: 'BTCUSDT', positionSide: 'LONG',
      dcaLevelIndex: 0, markPrice: 0.8, mode, addedQuantity: 5,
      currentQuantity: 1, currentEntryPrice: 1,
    })).rejects.toMatchObject({ code: 'DCA_MULTIPLIER_EXCEEDS_RUNTIME_LIMIT' });
    expect(openOrder).not.toHaveBeenCalled();
  });

  it('keeps the old quantity limit while accepting the explicit USDT schema for backtests', () => {
    const dca = { enabled: true, maxAdds: 1, stepPercent: 0.2,
      addSizeFraction: 5, levelPercents: [-0.2], addSizeFractions: [5] };
    expect(DcaConfigSchema.safeParse(dca).success).toBe(false);
    expect(DcaConfigSchema.safeParse({ ...dca, sizingBasis: 'usdt_contribution_v1' }).success).toBe(true);
    expect(resolveRuntimeDcaPolicyBlock({ additional: { dcaEnabled: true,
      dcaLevels: [{ percent: -20, multiplier: 5 }] } })).toMatchObject({
      code: 'DCA_MULTIPLIER_EXCEEDS_RUNTIME_LIMIT', multiplier: 5,
    });
  });
});
