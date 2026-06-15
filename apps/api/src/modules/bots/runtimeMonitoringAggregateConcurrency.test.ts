import { describe, expect, it } from 'vitest';

import {
  mapWithLimitedConcurrency,
  selectSessionsForRuntimeAggregation,
} from './runtimeMonitoringAggregateRuntime.service';

describe('mapWithLimitedConcurrency', () => {
  it('keeps result order while limiting concurrent aggregate work', async () => {
    let active = 0;
    let maxActive = 0;

    const result = await mapWithLimitedConcurrency([1, 2, 3, 4, 5], 2, async (item) => {
      active += 1;
      maxActive = Math.max(maxActive, active);
      await new Promise((resolve) => setTimeout(resolve, item === 1 ? 10 : 1));
      active -= 1;
      return item * 10;
    });

    expect(result).toEqual([10, 20, 30, 40, 50]);
    expect(maxActive).toBeLessThanOrEqual(2);
  });
});

describe('selectSessionsForAggregation', () => {
  type TestRuntimeSession = {
    id: string;
    status: 'RUNNING' | 'COMPLETED' | 'FAILED' | 'CANCELED';
    lastHeartbeatAt: Date | null;
    finishedAt: Date | null;
    startedAt: Date;
  };

  const session = (input: {
    id: string;
    status: 'RUNNING' | 'COMPLETED' | 'FAILED' | 'CANCELED';
    lastHeartbeatAt?: string;
    finishedAt?: string;
    startedAt?: string;
  }): TestRuntimeSession => ({
      id: input.id,
      status: input.status,
      lastHeartbeatAt: input.lastHeartbeatAt ? new Date(input.lastHeartbeatAt) : null,
      finishedAt: input.finishedAt ? new Date(input.finishedAt) : null,
      startedAt: new Date(input.startedAt ?? '2026-06-14T10:00:00.000Z'),
    });

  it('bounds default aggregate fanout to the freshest running and completed sessions', () => {
    const selected = selectSessionsForRuntimeAggregation(
      [
        session({
          id: 'completed-old',
          status: 'COMPLETED',
          finishedAt: '2026-06-14T08:00:00.000Z',
        }),
        session({
          id: 'running-old',
          status: 'RUNNING',
          lastHeartbeatAt: '2026-06-14T10:01:00.000Z',
        }),
        session({
          id: 'running-newest',
          status: 'RUNNING',
          lastHeartbeatAt: '2026-06-14T10:04:00.000Z',
        }),
        session({
          id: 'completed-newest',
          status: 'COMPLETED',
          finishedAt: '2026-06-14T09:00:00.000Z',
        }),
        session({
          id: 'running-middle',
          status: 'RUNNING',
          lastHeartbeatAt: '2026-06-14T10:02:00.000Z',
        }),
        session({
          id: 'completed-middle',
          status: 'COMPLETED',
          finishedAt: '2026-06-14T08:30:00.000Z',
        }),
      ],
      {
        runningCap: 2,
        completedCap: 2,
      }
    );

    expect(selected.map((item) => item.id)).toEqual([
      'running-newest',
      'running-middle',
      'completed-newest',
      'completed-middle',
    ]);
  });
});
