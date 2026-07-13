import { describe, expect, it } from 'vitest';

import { resolveRuntimeTakeoverStatus } from './runtimeSessionOpenOrdersReadModel.service';

describe('resolveRuntimeTakeoverStatus', () => {
  it.each([
    {
      name: 'returns null for non exchange-synced rows',
      input: {
        origin: 'BOT',
        managementMode: 'BOT_MANAGED' as const,
        syncState: 'IN_SYNC',
        botId: 'bot-1',
      },
      expected: null,
    },
    {
      name: 'returns MANUAL_ONLY for exchange-synced manual rows',
      input: {
        origin: 'EXCHANGE_SYNC',
        managementMode: 'MANUAL_MANAGED' as const,
        syncState: 'IN_SYNC',
        botId: null,
      },
      expected: 'MANUAL_ONLY',
    },
    {
      name: 'returns OWNED_AND_MANAGED for exchange-synced owned bot-managed rows',
      input: {
        origin: 'EXCHANGE_SYNC',
        managementMode: 'BOT_MANAGED' as const,
        syncState: 'IN_SYNC',
        botId: 'bot-1',
      },
      expected: 'OWNED_AND_MANAGED',
    },
    {
      name: 'returns AMBIGUOUS for drifted exchange-synced bot-managed rows without a bot owner',
      input: {
        origin: 'EXCHANGE_SYNC',
        managementMode: 'BOT_MANAGED' as const,
        syncState: 'DRIFT',
        botId: null,
      },
      expected: 'AMBIGUOUS',
    },
    {
      name: 'returns UNOWNED for in-sync exchange-synced bot-managed rows without a bot owner',
      input: {
        origin: 'EXCHANGE_SYNC',
        managementMode: 'BOT_MANAGED' as const,
        syncState: 'IN_SYNC',
        botId: null,
      },
      expected: 'UNOWNED',
    },
  ])('$name', ({ input, expected }) => {
    expect(resolveRuntimeTakeoverStatus(input)).toBe(expected);
  });
});
