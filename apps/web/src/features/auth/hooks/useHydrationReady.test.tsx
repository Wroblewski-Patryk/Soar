import { renderHook, waitFor } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { useHydrationReady } from './useHydrationReady';

function HydrationProbe() {
  return <span>{useHydrationReady() ? 'ready' : 'pending'}</span>;
}

describe('useHydrationReady', () => {
  it('stays fail-closed during server rendering', () => {
    const html = renderToString(<HydrationProbe />);

    expect(html).toContain('pending');
    expect(html).not.toContain('ready');
  });

  it('switches to ready after client hydration effects run', async () => {
    const { result } = renderHook(() => useHydrationReady());

    await waitFor(() => {
      expect(result.current).toBe(true);
    });
  });
});
