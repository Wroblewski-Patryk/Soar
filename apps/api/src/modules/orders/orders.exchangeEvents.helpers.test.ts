import { describe, expect, it } from 'vitest';
import {
  isExchangeCloseFillComplete,
  resolveExchangeFeeRefreshDecision,
  resolveExchangeFeePendingDecision,
  resolveExchangeOrderFillProgress,
} from './orders.exchangeEvents.helpers';

describe('orders.exchangeEvents close-fill helpers', () => {
  it('treats an underfilled close as incomplete even when the exchange status is FILLED', () => {
    expect(
      isExchangeCloseFillComplete({
        filledQuantity: 0.1,
        positionQuantity: 0.2,
      }),
    ).toBe(false);
  });

  it('allows tiny rounding tolerance around full close quantity', () => {
    expect(
      isExchangeCloseFillComplete({
        filledQuantity: 0.199999999999,
        positionQuantity: 0.2,
      }),
    ).toBe(true);
  });
});

describe('resolveExchangeOrderFillProgress', () => {
  it('allows first-time FILLED exchange event lifecycle for an open order', () => {
    expect(
      resolveExchangeOrderFillProgress({
        existingStatus: 'OPEN',
        existingFilledQuantity: 0,
        incomingStatus: 'FILLED',
        incomingCumulativeFilledQuantity: 0.5,
      }),
    ).toEqual({
      filledQuantity: 0.5,
      persistedStatus: 'FILLED',
      shouldApplyFilledLifecycle: true,
      shouldRefreshTerminalFillDetails: true,
    });
  });

  it('keeps duplicate FILLED exchange event from reapplying lifecycle', () => {
    expect(
      resolveExchangeOrderFillProgress({
        existingStatus: 'FILLED',
        existingFilledQuantity: 0.5,
        incomingStatus: 'FILLED',
        incomingCumulativeFilledQuantity: 0.5,
      }),
    ).toEqual({
      filledQuantity: 0.5,
      persistedStatus: 'FILLED',
      shouldApplyFilledLifecycle: false,
      shouldRefreshTerminalFillDetails: false,
    });
  });

  it('does not reduce local fill progress for stale lower cumulative quantity', () => {
    expect(
      resolveExchangeOrderFillProgress({
        existingStatus: 'FILLED',
        existingFilledQuantity: 0.5,
        incomingStatus: 'PARTIALLY_FILLED',
        incomingCumulativeFilledQuantity: 0.25,
      }),
    ).toEqual({
      filledQuantity: 0.5,
      persistedStatus: 'FILLED',
      shouldApplyFilledLifecycle: false,
      shouldRefreshTerminalFillDetails: false,
    });
  });

  it('allows terminal fill details to refresh when cumulative progress advances', () => {
    expect(
      resolveExchangeOrderFillProgress({
        existingStatus: 'FILLED',
        existingFilledQuantity: 0.5,
        incomingStatus: 'FILLED',
        incomingCumulativeFilledQuantity: 0.75,
      }),
    ).toEqual({
      filledQuantity: 0.75,
      persistedStatus: 'FILLED',
      shouldApplyFilledLifecycle: false,
      shouldRefreshTerminalFillDetails: true,
    });
  });

  it('does not regress PARTIALLY_FILLED status to OPEN on stale exchange open event', () => {
    expect(
      resolveExchangeOrderFillProgress({
        existingStatus: 'PARTIALLY_FILLED',
        existingFilledQuantity: 0.25,
        incomingStatus: 'OPEN',
        incomingCumulativeFilledQuantity: null,
      }),
    ).toEqual({
      filledQuantity: 0.25,
      persistedStatus: 'PARTIALLY_FILLED',
      shouldApplyFilledLifecycle: false,
      shouldRefreshTerminalFillDetails: true,
    });
  });

  it('keeps positive fill progress visible as partial when a stale OPEN event arrives', () => {
    expect(
      resolveExchangeOrderFillProgress({
        existingStatus: 'OPEN',
        existingFilledQuantity: 0.25,
        incomingStatus: 'OPEN',
        incomingCumulativeFilledQuantity: null,
      }),
    ).toEqual({
      filledQuantity: 0.25,
      persistedStatus: 'PARTIALLY_FILLED',
      shouldApplyFilledLifecycle: false,
      shouldRefreshTerminalFillDetails: true,
    });
  });

  it('fails closed when FILLED arrives for an open order without cumulative quantity', () => {
    expect(
      resolveExchangeOrderFillProgress({
        existingStatus: 'OPEN',
        existingFilledQuantity: 0,
        incomingStatus: 'FILLED',
        incomingCumulativeFilledQuantity: null,
      }),
    ).toEqual({
      filledQuantity: 0,
      persistedStatus: 'OPEN',
      shouldApplyFilledLifecycle: false,
      shouldRefreshTerminalFillDetails: false,
    });
  });

  it('keeps partial truth when FILLED arrives without cumulative quantity after partial progress', () => {
    expect(
      resolveExchangeOrderFillProgress({
        existingStatus: 'PARTIALLY_FILLED',
        existingFilledQuantity: 0.25,
        incomingStatus: 'FILLED',
        incomingCumulativeFilledQuantity: null,
      }),
    ).toEqual({
      filledQuantity: 0.25,
      persistedStatus: 'PARTIALLY_FILLED',
      shouldApplyFilledLifecycle: false,
      shouldRefreshTerminalFillDetails: false,
    });
  });

  it('keeps known underfilled FILLED exchange event partial until requested quantity is complete', () => {
    expect(
      resolveExchangeOrderFillProgress({
        existingStatus: 'OPEN',
        existingFilledQuantity: 0,
        incomingStatus: 'FILLED',
        incomingCumulativeFilledQuantity: 1.25,
        requestedQuantity: 2,
      }),
    ).toEqual({
      filledQuantity: 1.25,
      persistedStatus: 'PARTIALLY_FILLED',
      shouldApplyFilledLifecycle: false,
      shouldRefreshTerminalFillDetails: true,
    });
  });

  it('caps over-reported exchange cumulative quantity to requested order quantity', () => {
    expect(
      resolveExchangeOrderFillProgress({
        existingStatus: 'OPEN',
        existingFilledQuantity: 0,
        incomingStatus: 'FILLED',
        incomingCumulativeFilledQuantity: 2.5,
        requestedQuantity: 2,
      }),
    ).toEqual({
      filledQuantity: 2,
      persistedStatus: 'FILLED',
      shouldApplyFilledLifecycle: true,
      shouldRefreshTerminalFillDetails: true,
    });
  });

  it('caps previously over-reported local fill progress to requested order quantity', () => {
    expect(
      resolveExchangeOrderFillProgress({
        existingStatus: 'FILLED',
        existingFilledQuantity: 2.5,
        incomingStatus: 'FILLED',
        incomingCumulativeFilledQuantity: 2.5,
        requestedQuantity: 2,
      }),
    ).toEqual({
      filledQuantity: 2,
      persistedStatus: 'FILLED',
      shouldApplyFilledLifecycle: false,
      shouldRefreshTerminalFillDetails: false,
    });
  });

  it('preserves terminal cancellation status after partial progress', () => {
    expect(
      resolveExchangeOrderFillProgress({
        existingStatus: 'PARTIALLY_FILLED',
        existingFilledQuantity: 0.25,
        incomingStatus: 'CANCELED',
        incomingCumulativeFilledQuantity: null,
      }),
    ).toEqual({
      filledQuantity: 0.25,
      persistedStatus: 'CANCELED',
      shouldApplyFilledLifecycle: false,
      shouldRefreshTerminalFillDetails: true,
    });
  });
});

describe('resolveExchangeFeeRefreshDecision', () => {
  it('refreshes fee details when terminal fill details are allowed to refresh', () => {
    expect(
      resolveExchangeFeeRefreshDecision({
        shouldRefreshTerminalFillDetails: true,
        hasRecordableEventFee: true,
        hasExistingRecordableEventFill: false,
        existingRecordableEventFillHasFee: false,
      }),
    ).toEqual({
      shouldRefreshFeeDetails: true,
      shouldBackfillExistingFillFee: false,
    });
  });

  it('allows fee-only backfill for a known fill that still has no fee', () => {
    expect(
      resolveExchangeFeeRefreshDecision({
        shouldRefreshTerminalFillDetails: false,
        hasRecordableEventFee: true,
        hasExistingRecordableEventFill: true,
        existingRecordableEventFillHasFee: false,
      }),
    ).toEqual({
      shouldRefreshFeeDetails: true,
      shouldBackfillExistingFillFee: true,
    });
  });

  it('blocks fee-only refresh for stale unknown fills', () => {
    expect(
      resolveExchangeFeeRefreshDecision({
        shouldRefreshTerminalFillDetails: false,
        hasRecordableEventFee: true,
        hasExistingRecordableEventFill: false,
        existingRecordableEventFillHasFee: false,
      }),
    ).toEqual({
      shouldRefreshFeeDetails: false,
      shouldBackfillExistingFillFee: false,
    });
  });

  it('does not backfill fee when the known fill already has fee truth', () => {
    expect(
      resolveExchangeFeeRefreshDecision({
        shouldRefreshTerminalFillDetails: false,
        hasRecordableEventFee: true,
        hasExistingRecordableEventFill: true,
        existingRecordableEventFillHasFee: true,
      }),
    ).toEqual({
      shouldRefreshFeeDetails: false,
      shouldBackfillExistingFillFee: false,
    });
  });
});

describe('resolveExchangeFeePendingDecision', () => {
  it('clears pending when a filled order accepts exact exchange fee truth', () => {
    expect(
      resolveExchangeFeePendingDecision({
        persistedStatus: 'FILLED',
        hasAcceptedRecordableEventFee: true,
        hasSettledExchangeFee: false,
        existingFeePending: true,
      }),
    ).toEqual({
      feePending: false,
      shouldKeepFeePending: false,
    });
  });

  it('keeps pending when event fee was rejected and no settled exchange fee exists', () => {
    expect(
      resolveExchangeFeePendingDecision({
        persistedStatus: 'FILLED',
        hasAcceptedRecordableEventFee: false,
        hasSettledExchangeFee: false,
        existingFeePending: false,
      }),
    ).toEqual({
      feePending: true,
      shouldKeepFeePending: true,
    });
  });

  it('preserves existing pending while unresolved even before terminal status', () => {
    expect(
      resolveExchangeFeePendingDecision({
        persistedStatus: 'PARTIALLY_FILLED',
        hasAcceptedRecordableEventFee: false,
        hasSettledExchangeFee: false,
        existingFeePending: true,
      }),
    ).toEqual({
      feePending: true,
      shouldKeepFeePending: true,
    });
  });

  it('keeps pending while an accepted exchange fee belongs to a non-terminal partial fill', () => {
    expect(
      resolveExchangeFeePendingDecision({
        persistedStatus: 'PARTIALLY_FILLED',
        hasAcceptedRecordableEventFee: true,
        hasSettledExchangeFee: false,
        existingFeePending: false,
      }),
    ).toEqual({
      feePending: true,
      shouldKeepFeePending: true,
    });
  });

  it('does not re-open pending when exact exchange fee is already settled', () => {
    expect(
      resolveExchangeFeePendingDecision({
        persistedStatus: 'FILLED',
        hasAcceptedRecordableEventFee: false,
        hasSettledExchangeFee: true,
        existingFeePending: false,
      }),
    ).toEqual({
      feePending: false,
      shouldKeepFeePending: false,
    });
  });

  it('recovers false pending when exact exchange fee is already settled', () => {
    expect(
      resolveExchangeFeePendingDecision({
        persistedStatus: 'FILLED',
        hasAcceptedRecordableEventFee: false,
        hasSettledExchangeFee: true,
        existingFeePending: true,
      }),
    ).toEqual({
      feePending: false,
      shouldKeepFeePending: false,
    });
  });
});
