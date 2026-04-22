import { describe, expect, it, vi } from 'vitest';
import { executeWithRetry, runAsyncWithState, runAsyncWithViewState } from './async';

describe('async helpers', () => {
  it('retries operation until success when retry predicate allows it', async () => {
    const operation = vi
      .fn<() => Promise<string>>()
      .mockRejectedValueOnce(new Error('temporary'))
      .mockResolvedValueOnce('ok');

    const result = await executeWithRetry(operation, {
      maxAttempts: 2,
      shouldRetry: () => true,
    });

    expect(result).toBe('ok');
    expect(operation).toHaveBeenCalledTimes(2);
  });

  it('propagates error when retry predicate blocks retries', async () => {
    const error = new Error('fatal');
    const operation = vi.fn<() => Promise<string>>().mockRejectedValue(error);

    await expect(
      executeWithRetry(operation, {
        maxAttempts: 3,
        shouldRetry: () => false,
      })
    ).rejects.toThrow('fatal');
    expect(operation).toHaveBeenCalledTimes(1);
  });

  it('sets pending state around async execution', async () => {
    const pendingStates: boolean[] = [];
    const setPending = (next: boolean) => pendingStates.push(next);

    const value = await runAsyncWithState(setPending, async () => 'done');

    expect(value).toBe('done');
    expect(pendingStates).toEqual([true, false]);
  });

  it('clears and resolves error state around async view execution', async () => {
    const pendingStates: boolean[] = [];
    const errorStates: Array<string | null> = [];

    await expect(
      runAsyncWithViewState({
        setPending: (next) => pendingStates.push(next),
        setError: (next) => errorStates.push(next),
        resolveError: () => 'load failed',
        operation: async () => {
          throw new Error('boom');
        },
      })
    ).rejects.toThrow('boom');

    expect(pendingStates).toEqual([true, false]);
    expect(errorStates).toEqual([null, 'load failed']);
  });

  it('supports view execution without error mapping', async () => {
    const pendingStates: boolean[] = [];

    const result = await runAsyncWithViewState({
      setPending: (next) => pendingStates.push(next),
      operation: async () => 'ok',
    });

    expect(result).toBe('ok');
    expect(pendingStates).toEqual([true, false]);
  });
});
