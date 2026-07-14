import { describe, expect, it } from 'vitest';

import { resolveAggregateSessionWindowEnd } from './runtimeMonitoringAggregateFallbacks.service';

type AggregateSession = Parameters<typeof resolveAggregateSessionWindowEnd>[0];

const session = (input: {
  finishedAt?: string | null;
  lastHeartbeatAt?: string | null;
  startedAt?: string;
}): AggregateSession =>
  ({
    finishedAt: input.finishedAt ? new Date(input.finishedAt) : null,
    lastHeartbeatAt: input.lastHeartbeatAt ? new Date(input.lastHeartbeatAt) : null,
    startedAt: new Date(input.startedAt ?? '2026-07-14T10:00:00.000Z'),
  }) as AggregateSession;

describe('resolveAggregateSessionWindowEnd', () => {
  it('prefers finishedAt when the aggregate session is already closed', () => {
    const finishedAt = new Date('2026-07-14T10:30:00.000Z');

    expect(
      resolveAggregateSessionWindowEnd(
        session({
          finishedAt: finishedAt.toISOString(),
          lastHeartbeatAt: '2026-07-14T10:25:00.000Z',
          startedAt: '2026-07-14T09:00:00.000Z',
        })
      )
    ).toEqual(finishedAt);
  });

  it('falls back to lastHeartbeatAt when finishedAt is missing', () => {
    expect(
      resolveAggregateSessionWindowEnd(
        session({
          finishedAt: null,
          lastHeartbeatAt: '2026-07-14T10:20:00.000Z',
          startedAt: '2026-07-14T09:00:00.000Z',
        })
      )
    ).toEqual(new Date('2026-07-14T10:20:00.000Z'));
  });

  it('falls back to startedAt when both finishedAt and lastHeartbeatAt are missing', () => {
    expect(
      resolveAggregateSessionWindowEnd(
        session({
          finishedAt: null,
          lastHeartbeatAt: null,
          startedAt: '2026-07-14T09:00:00.000Z',
        })
      )
    ).toEqual(new Date('2026-07-14T09:00:00.000Z'));
  });
});
