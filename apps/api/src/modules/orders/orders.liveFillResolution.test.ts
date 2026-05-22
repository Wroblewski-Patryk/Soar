import { describe, expect, it } from 'vitest';
import {
  resolveOpenOrderPersistenceDecision,
  resolvePersistedLiveOrderFill,
} from './orders.service';

describe('resolvePersistedLiveOrderFill', () => {
  it('keeps a LIVE FILLED response partial when exchange fills are below requested quantity', () => {
    expect(
      resolvePersistedLiveOrderFill({
        requestedQuantity: 2,
        liveStatus: 'FILLED',
        exchangeFilledQuantity: 1.25,
      }),
    ).toEqual({
      status: 'PARTIALLY_FILLED',
      filledQuantity: 1.25,
      complete: false,
    });
  });

  it('keeps LIVE FILLED pending when no exchange fill quantity is available', () => {
    expect(
      resolvePersistedLiveOrderFill({
        requestedQuantity: 2,
        liveStatus: 'FILLED',
        exchangeFilledQuantity: null,
      }),
    ).toEqual({
      status: 'OPEN',
      filledQuantity: 0,
      complete: false,
    });
  });

  it('blocks immediate position lifecycle for underfilled LIVE entry fills', () => {
    const liveFillResolution = resolvePersistedLiveOrderFill({
      requestedQuantity: 2,
      liveStatus: 'FILLED',
      exchangeFilledQuantity: 1.25,
    });

    expect(
      resolveOpenOrderPersistenceDecision({
        mode: 'LIVE',
        requestedQuantity: 2,
        status: 'FILLED',
        fillPriceResolved: true,
        liveFillResolution,
      }),
    ).toEqual({
      persistedStatus: 'PARTIALLY_FILLED',
      persistedFilledQuantity: 1.25,
      shouldApplyImmediateFillLifecycle: false,
      lifecycleFillQuantity: 1.25,
    });
  });

  it('blocks compatible LIVE full-fill lifecycle when no exchange fill rows exist', () => {
    const liveFillResolution = resolvePersistedLiveOrderFill({
      requestedQuantity: 2,
      liveStatus: 'FILLED',
      exchangeFilledQuantity: null,
    });

    expect(
      resolveOpenOrderPersistenceDecision({
        mode: 'LIVE',
        requestedQuantity: 2,
        status: 'FILLED',
        fillPriceResolved: true,
        liveFillResolution,
      }),
    ).toEqual({
      persistedStatus: 'OPEN',
      persistedFilledQuantity: 0,
      shouldApplyImmediateFillLifecycle: false,
      lifecycleFillQuantity: 0,
    });
  });

  it('preserves PAPER immediate fill decision semantics', () => {
    expect(
      resolveOpenOrderPersistenceDecision({
        mode: 'PAPER',
        requestedQuantity: 2,
        status: 'FILLED',
        fillPriceResolved: true,
      }),
    ).toEqual({
      persistedStatus: 'FILLED',
      persistedFilledQuantity: 2,
      shouldApplyImmediateFillLifecycle: true,
      lifecycleFillQuantity: 2,
    });
  });
});
