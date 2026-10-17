import { afterEach, describe, expect, it, vi } from 'vitest';
import { sampleProcessMemory, startProcessMemoryTelemetry } from './processMemoryTelemetry';

afterEach(() => {
  vi.useRealTimers();
});

describe('API process memory telemetry', () => {
  it('reports resident and heap memory in MiB', () => {
    expect(
      sampleProcessMemory(
        {
          rss: 6 * 1024 * 1024,
          heapUsed: 2 * 1024 * 1024,
          heapTotal: 3 * 1024 * 1024,
          external: 1024 * 1024,
          arrayBuffers: 512 * 1024,
        },
        91.9
      )
    ).toEqual({
      rssMiB: 6,
      heapUsedMiB: 2,
      heapTotalMiB: 3,
      externalMiB: 1,
      arrayBuffersMiB: 1,
      uptimeSeconds: 91,
    });
  });

  it('samples on startup and periodically until stopped', () => {
    vi.useFakeTimers();
    const logger = { info: vi.fn() };
    const stop = startProcessMemoryTelemetry(logger, 60_000);

    expect(logger.info).toHaveBeenCalledTimes(1);
    expect(logger.info).toHaveBeenCalledWith(
      'memory_snapshot',
      expect.objectContaining({ rssMiB: expect.any(Number), heapUsedMiB: expect.any(Number) })
    );

    vi.advanceTimersByTime(60_000);
    expect(logger.info).toHaveBeenCalledTimes(2);
    stop();
    vi.advanceTimersByTime(60_000);
    expect(logger.info).toHaveBeenCalledTimes(2);
  });
});
