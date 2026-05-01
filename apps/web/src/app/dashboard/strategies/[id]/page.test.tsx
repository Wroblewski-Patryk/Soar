import { describe, expect, it, vi } from 'vitest';

const redirectMock = vi.hoisted(() => vi.fn());

vi.mock('next/navigation', () => ({
  redirect: redirectMock,
}));

describe('Strategies /:id route', () => {
  it('redirects to the canonical edit route', async () => {
    const { default: StrategiesEditRedirectPage } = await import('./page');

    await StrategiesEditRedirectPage({
      params: Promise.resolve({ id: 'strategy-71' }),
    });

    expect(redirectMock).toHaveBeenCalledWith('/dashboard/strategies/strategy-71/edit');
  });
});
