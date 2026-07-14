import { describe, expect, it } from 'vitest';

import {
  resolveRuntimeTakeoverStatus,
  selectRuntimeOpenOrders,
} from './runtimeSessionOpenOrdersReadModel.service';

type RuntimeOpenOrder = Parameters<typeof selectRuntimeOpenOrders>[0][number];

const makeOrder = (overrides: Partial<RuntimeOpenOrder> = {}): RuntimeOpenOrder =>
  ({
    id: 'order-1',
    origin: 'BOT',
    exchangeOrderId: null,
    symbol: 'BTCUSDT',
    side: 'BUY',
    type: 'LIMIT',
    status: 'OPEN',
    quantity: '1',
    filledQuantity: '0',
    price: '50000',
    stopPrice: null,
    submittedAt: new Date('2026-07-14T08:00:00.000Z'),
    createdAt: new Date('2026-07-14T08:00:00.000Z'),
    updatedAt: new Date('2026-07-14T08:00:00.000Z'),
    ...overrides,
  }) as RuntimeOpenOrder;

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

describe('selectRuntimeOpenOrders', () => {
  it('dedupes exchange identities, prefers exchange-synced rows, and sorts newest-first', () => {
    const exchangeSyncNewest = makeOrder({
      id: 'exchange-sync-newest',
      origin: 'EXCHANGE_SYNC',
      exchangeOrderId: ' shared-order ',
      createdAt: new Date('2026-07-14T10:00:00.000Z'),
      updatedAt: new Date('2026-07-14T10:30:00.000Z'),
    });
    const botDuplicate = makeOrder({
      id: 'bot-duplicate',
      origin: 'BOT',
      exchangeOrderId: 'shared-order',
      createdAt: new Date('2026-07-14T09:00:00.000Z'),
      updatedAt: new Date('2026-07-14T11:00:00.000Z'),
    });
    const localNewest = makeOrder({
      id: 'local-newest',
      exchangeOrderId: '   ',
      createdAt: new Date('2026-07-14T12:00:00.000Z'),
      updatedAt: new Date('2026-07-14T12:05:00.000Z'),
    });
    const localOlder = makeOrder({
      id: 'local-older',
      exchangeOrderId: null,
      createdAt: new Date('2026-07-14T08:30:00.000Z'),
      updatedAt: new Date('2026-07-14T08:45:00.000Z'),
    });

    const result = selectRuntimeOpenOrders(
      [botDuplicate, localOlder, exchangeSyncNewest, localNewest],
      10
    );

    expect(result.count).toBe(3);
    expect(result.items.map((order) => order.id)).toEqual([
      'local-newest',
      'exchange-sync-newest',
      'local-older',
    ]);
    expect(result.items[1]?.origin).toBe('EXCHANGE_SYNC');
  });

  it('keeps the most recently updated row when duplicates share the same origin and respects the limit', () => {
    const staleExchange = makeOrder({
      id: 'exchange-stale',
      origin: 'EXCHANGE_SYNC',
      exchangeOrderId: 'shared-order',
      createdAt: new Date('2026-07-14T09:00:00.000Z'),
      updatedAt: new Date('2026-07-14T09:05:00.000Z'),
    });
    const freshExchange = makeOrder({
      id: 'exchange-fresh',
      origin: 'EXCHANGE_SYNC',
      exchangeOrderId: 'shared-order',
      createdAt: new Date('2026-07-14T09:00:00.000Z'),
      updatedAt: new Date('2026-07-14T09:10:00.000Z'),
    });
    const newestDistinct = makeOrder({
      id: 'newest-distinct',
      exchangeOrderId: 'distinct-order',
      createdAt: new Date('2026-07-14T11:00:00.000Z'),
      updatedAt: new Date('2026-07-14T11:05:00.000Z'),
    });

    const result = selectRuntimeOpenOrders([staleExchange, freshExchange, newestDistinct], 1);

    expect(result.count).toBe(2);
    expect(result.items).toHaveLength(1);
    expect(result.items[0]?.id).toBe('newest-distinct');
    expect(selectRuntimeOpenOrders([staleExchange, freshExchange], 10).items[0]?.id).toBe(
      'exchange-fresh'
    );
  });
});
