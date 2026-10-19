import { OrderStatus } from '@prisma/client';
import type { LiveOrderPayload } from './orders.liveIntent.service';

export const resolvePersistedLiveOrderFill = (input: {
  requestedQuantity: number;
  liveStatus: 'OPEN' | 'FILLED';
  exchangeFilledQuantity: number | null;
}) => {
  const requestedQuantity = Math.max(0, Number(input.requestedQuantity));
  const exchangeFilledQuantity =
    typeof input.exchangeFilledQuantity === 'number' && Number.isFinite(input.exchangeFilledQuantity)
      ? Math.max(0, input.exchangeFilledQuantity)
      : null;
  if (input.liveStatus !== 'FILLED') {
    return {
      status: 'OPEN' as OrderStatus,
      filledQuantity: exchangeFilledQuantity ?? 0,
      complete: false,
    };
  }
  if (exchangeFilledQuantity == null) {
    return {
      status: 'OPEN' as OrderStatus,
      filledQuantity: 0,
      complete: false,
    };
  }

  const cappedFilledQuantity = Math.min(requestedQuantity, exchangeFilledQuantity);
  const tolerance = Math.max(1e-9, requestedQuantity * 1e-8);
  const complete = cappedFilledQuantity + tolerance >= requestedQuantity;
  return {
    status: complete ? ('FILLED' as OrderStatus) : ('PARTIALLY_FILLED' as OrderStatus),
    filledQuantity: cappedFilledQuantity,
    complete,
  };
};

export const resolveOpenOrderPersistenceDecision = (input: {
  mode: LiveOrderPayload['mode'];
  requestedQuantity: number;
  status: 'OPEN' | 'FILLED';
  fillPriceResolved: boolean;
  liveFillResolution?: ReturnType<typeof resolvePersistedLiveOrderFill> | null;
}) => {
  const shouldApplyImmediateFillLifecycle =
    input.mode === 'PAPER'
      ? input.status === 'FILLED' && input.fillPriceResolved
      : input.liveFillResolution?.complete === true && input.fillPriceResolved;
  const persistedStatus: OrderStatus =
    input.mode === 'LIVE'
      ? (input.liveFillResolution?.status ?? 'OPEN')
      : shouldApplyImmediateFillLifecycle
        ? 'FILLED'
        : 'OPEN';

  return {
    persistedStatus,
    persistedFilledQuantity:
      input.mode === 'LIVE'
        ? (input.liveFillResolution?.filledQuantity ?? 0)
        : persistedStatus === 'FILLED'
          ? input.requestedQuantity
          : 0,
    shouldApplyImmediateFillLifecycle,
    lifecycleFillQuantity:
      input.mode === 'LIVE'
        ? (input.liveFillResolution?.filledQuantity ?? input.requestedQuantity)
        : input.requestedQuantity,
  };
};
