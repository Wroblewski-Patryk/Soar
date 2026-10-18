import { beforeEach, describe, expect, it, vi } from 'vitest';
import { strategyPresets } from '../presets/strategyPresets';

const post = vi.hoisted(() => vi.fn());
vi.mock('@/lib/api', () => ({ default: { post } }));

import { createStrategy } from './strategies.api';

describe('strategy create payload sizing version', () => {
  beforeEach(() => {
    post.mockReset();
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
});
