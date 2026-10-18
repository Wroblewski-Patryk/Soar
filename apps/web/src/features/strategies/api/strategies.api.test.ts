import { beforeEach, describe, expect, it, vi } from 'vitest';
import { strategyPresets } from '../presets/strategyPresets';
import type { StrategyDto } from '../types/StrategyForm.type';
import { dtoToForm } from '../utils/StrategyForm.map';

const post = vi.hoisted(() => vi.fn());
const get = vi.hoisted(() => vi.fn());
const put = vi.hoisted(() => vi.fn());
vi.mock('@/lib/api', () => ({ default: { post, get, put } }));

import { createStrategy, getStrategy, updateStrategy } from './strategies.api';

const strategyFromApi = (
  additional: Record<string, unknown>,
  name = 'API DCA strategy',
): StrategyDto => ({
  id: 'strategy-1', name, description: '', interval: '5m', leverage: 5,
  walletRisk: 1, createdAt: '2026-10-18T00:00:00.000Z',
  config: {
    open: { direction: 'both', indicatorsLong: [], indicatorsShort: [] },
    close: { mode: 'basic', tp: 10, sl: 10, ttp: [], tsl: [] },
    additional: { dcaEnabled: true, dcaMode: 'basic', dcaTimes: 2,
      maxPositions: 1, maxOrders: 1, positionLifetime: 1, positionUnit: 'h',
      orderLifetime: 1, orderUnit: 'h', marginMode: 'CROSSED', ...additional },
  },
});

const wireApiReadWrite = (initial: StrategyDto) => {
  let stored = initial;
  get.mockImplementation(async () => ({ data: stored }));
  put.mockImplementation(async (_url, payload) => {
    stored = { ...stored, ...payload };
    return { data: stored };
  });
  post.mockImplementation(async (_url, payload) => {
    stored = { ...stored, ...payload, id: 'strategy-clone' };
    return { data: stored };
  });
};

describe('strategy create payload sizing version', () => {
  beforeEach(() => {
    post.mockReset();
    get.mockReset();
    put.mockReset();
    post.mockResolvedValue({ data: { id: 'created' } });
  });

  it('persists USDT contribution version for a new preset strategy', async () => {
    await createStrategy(strategyPresets[0].form);
    expect(post.mock.calls[0][1].config.additional.dcaSizingBasis).toBe('usdt_contribution_v1');
  });

  it('explicitly keeps quantity semantics when cloning an unversioned strategy', async () => {
    const form = strategyPresets[0].form;
    await createStrategy({ ...form, additional: { ...form.additional, dcaSizingBasis: undefined } });
    expect(post.mock.calls[0][1].config.additional.dcaSizingBasis).toBe('quantity_v1');
  });

  it.each([
    { name: 'Basic USDT 0.5', basis: 'usdt_contribution_v1', multiplier: 0.5 },
    { name: 'Basic legacy 2', basis: undefined, multiplier: 2 },
  ])('keeps $name across API read, untouched edit, clone and readback', async ({ basis, multiplier }) => {
    const additional = {
      ...(basis ? { dcaSizingBasis: basis } : {}),
      dcaLevels: [{ percent: -5, multiplier }],
    };
    wireApiReadWrite(strategyFromApi(additional));

    const original = await getStrategy('strategy-1');
    const form = dtoToForm(original);
    expect(form.additional.dcaMultiplier).toBe(multiplier);
    expect(form.additional.dcaLevels[0].multiplier).toBe(multiplier);
    await updateStrategy(original.id, form);
    const saved = await getStrategy(original.id);
    expect((saved.config?.additional as Record<string, unknown>).dcaLevels).toEqual([
      { percent: -5, multiplier },
    ]);
    expect((saved.config?.additional as Record<string, unknown>).dcaMultiplier).toBe(multiplier);
    expect((saved.config?.additional as Record<string, unknown>).dcaSizingBasis).toBe(basis);

    await createStrategy({ ...dtoToForm(saved), name: 'Clone' });
    const clone = await getStrategy('strategy-clone');
    expect((clone.config?.additional as Record<string, unknown>).dcaLevels).toEqual([
      { percent: -5, multiplier },
    ]);
    expect((clone.config?.additional as Record<string, unknown>).dcaMultiplier).toBe(multiplier);
    expect((clone.config?.additional as Record<string, unknown>).dcaSizingBasis)
      .toBe(basis ?? 'quantity_v1');
  });

  it.each([
    { name: 'USDT', basis: 'usdt_contribution_v1' },
    { name: 'legacy quantity', basis: undefined },
  ])('keeps distinct signed Advanced $name level pairs on untouched edit and clone', async ({ basis }) => {
    const levels = [{ percent: -5, multiplier: 0.5 }, { percent: 8, multiplier: 2 }];
    wireApiReadWrite(strategyFromApi({
      ...(basis ? { dcaSizingBasis: basis } : {}), dcaMode: 'advanced', dcaTimes: 2,
      dcaLevels: levels,
    }));
    const form = dtoToForm(await getStrategy('strategy-1'));
    await updateStrategy('strategy-1', form);
    const saved = (await getStrategy('strategy-1')).config?.additional as Record<string, unknown>;
    expect(saved.dcaLevels).toEqual(levels);
    expect(saved.dcaSizingBasis).toBe(basis);
    await createStrategy({ ...form, name: 'Advanced clone' });
    const clone = (await getStrategy('strategy-clone')).config?.additional as Record<string, unknown>;
    expect(clone.dcaLevels).toEqual(levels);
    expect(clone.dcaSizingBasis).toBe(basis ?? 'quantity_v1');
  });
});
