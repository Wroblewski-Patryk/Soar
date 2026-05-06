import { OrderStatus } from '@prisma/client';

export const isExchangeCloseFillComplete = (input: {
  filledQuantity: number;
  positionQuantity: number;
}) => {
  const filledQuantity = Math.max(0, Number(input.filledQuantity));
  const positionQuantity = Math.max(0, Number(input.positionQuantity));
  if (!Number.isFinite(filledQuantity) || !Number.isFinite(positionQuantity)) return false;
  const tolerance = Math.max(1e-9, positionQuantity * 1e-8);
  return filledQuantity + tolerance >= positionQuantity;
};

const resolvePersistedExchangeOrderStatus = (input: {
  existingStatus: OrderStatus;
  incomingStatus: OrderStatus;
  filledQuantity: number;
  incomingFilledWithoutQuantity: boolean;
  incomingFilledBelowRequestedQuantity: boolean;
}) => {
  if (input.existingStatus === 'FILLED' && input.incomingStatus !== 'FILLED') {
    return input.existingStatus;
  }

  if (input.incomingFilledWithoutQuantity || input.incomingFilledBelowRequestedQuantity) {
    return input.filledQuantity > 0 ? 'PARTIALLY_FILLED' : 'OPEN';
  }

  if (
    input.incomingStatus === 'OPEN' &&
    (input.existingStatus === 'PARTIALLY_FILLED' || input.filledQuantity > 0)
  ) {
    return 'PARTIALLY_FILLED';
  }

  return input.incomingStatus;
};

const normalizeExchangeFillQuantity = (input: {
  quantity: number | null;
  requestedQuantity: number | null;
}) => {
  if (typeof input.quantity !== 'number' || !Number.isFinite(input.quantity)) return null;
  const quantity = Math.max(0, input.quantity);
  return input.requestedQuantity != null && input.requestedQuantity > 0
    ? Math.min(input.requestedQuantity, quantity)
    : quantity;
};

export const resolveExchangeOrderFillProgress = (input: {
  existingStatus: OrderStatus;
  existingFilledQuantity: number;
  incomingStatus: OrderStatus;
  incomingCumulativeFilledQuantity: number | null;
  requestedQuantity?: number | null;
}) => {
  const requestedQuantity =
    typeof input.requestedQuantity === 'number' && Number.isFinite(input.requestedQuantity)
      ? Math.max(0, input.requestedQuantity)
      : null;
  const existingFilledQuantity =
    normalizeExchangeFillQuantity({
      quantity: input.existingFilledQuantity,
      requestedQuantity,
    }) ?? 0;
  const incomingCumulativeFilledQuantity = normalizeExchangeFillQuantity({
    quantity: input.incomingCumulativeFilledQuantity,
    requestedQuantity,
  });
  const filledQuantity =
    incomingCumulativeFilledQuantity == null
      ? existingFilledQuantity
      : Math.max(existingFilledQuantity, incomingCumulativeFilledQuantity);
  const tolerance = Math.max(1e-9, existingFilledQuantity * 1e-8);
  const fillProgressAdvanced =
    incomingCumulativeFilledQuantity != null &&
    incomingCumulativeFilledQuantity > existingFilledQuantity + tolerance;
  const incomingFilledWithoutQuantity =
    input.incomingStatus === 'FILLED' &&
    input.existingStatus !== 'FILLED' &&
    incomingCumulativeFilledQuantity == null;
  const fillQuantityComplete =
    requestedQuantity == null ||
    requestedQuantity <= 0 ||
    filledQuantity + Math.max(1e-9, requestedQuantity * 1e-8) >= requestedQuantity;
  const incomingFilledBelowRequestedQuantity =
    input.incomingStatus === 'FILLED' &&
    input.existingStatus !== 'FILLED' &&
    incomingCumulativeFilledQuantity != null &&
    !fillQuantityComplete;
  const shouldRefreshTerminalFillDetails =
    (input.existingStatus !== 'FILLED' && !incomingFilledWithoutQuantity) ||
    fillProgressAdvanced;
  const persistedStatus = resolvePersistedExchangeOrderStatus({
    existingStatus: input.existingStatus,
    incomingStatus: input.incomingStatus,
    filledQuantity,
    incomingFilledWithoutQuantity,
    incomingFilledBelowRequestedQuantity,
  });

  return {
    filledQuantity,
    persistedStatus,
    shouldApplyFilledLifecycle:
      input.incomingStatus === 'FILLED' &&
      input.existingStatus !== 'FILLED' &&
      incomingCumulativeFilledQuantity != null &&
      filledQuantity > 0 &&
      fillQuantityComplete,
    shouldRefreshTerminalFillDetails,
  };
};

export const resolveExchangeFeeRefreshDecision = (input: {
  shouldRefreshTerminalFillDetails: boolean;
  hasRecordableEventFee: boolean;
  hasExistingRecordableEventFill: boolean;
  existingRecordableEventFillHasFee: boolean;
}) => {
  const shouldBackfillExistingFillFee =
    input.hasRecordableEventFee &&
    input.hasExistingRecordableEventFill &&
    !input.existingRecordableEventFillHasFee;

  return {
    shouldRefreshFeeDetails:
      input.shouldRefreshTerminalFillDetails || shouldBackfillExistingFillFee,
    shouldBackfillExistingFillFee,
  };
};

export const resolveExchangeFeePendingDecision = (input: {
  persistedStatus: OrderStatus;
  hasAcceptedRecordableEventFee: boolean;
  hasSettledExchangeFee: boolean;
  existingFeePending: boolean;
}) => {
  const isFilled = input.persistedStatus === 'FILLED';

  if (isFilled && input.hasAcceptedRecordableEventFee) {
    return {
      feePending: false,
      shouldKeepFeePending: false,
    };
  }

  if (isFilled && input.hasSettledExchangeFee) {
    return {
      feePending: false,
      shouldKeepFeePending: false,
    };
  }

  const shouldKeepFeePending =
    !isFilled || (!input.hasAcceptedRecordableEventFee && !input.hasSettledExchangeFee);

  return {
    feePending: shouldKeepFeePending || input.existingFeePending,
    shouldKeepFeePending,
  };
};
