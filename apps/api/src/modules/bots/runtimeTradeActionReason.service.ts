import type { PositionCloseReason } from '@prisma/client';
import { asRecord } from './runtimeSignalStatsFormatting.service';
import { toRuntimeTradeActionReason } from '../positions/positionCloseAttribution';

export type RuntimeTradeActionReason =
  | 'SIGNAL_ENTRY'
  | 'DCA_LEVEL'
  | 'TAKE_PROFIT'
  | 'STOP_LOSS'
  | 'TRAILING_TAKE_PROFIT'
  | 'TRAILING_STOP'
  | 'SIGNAL_EXIT'
  | 'MANUAL'
  | 'LIQUIDATION'
  | 'POSITION_LIFETIME'
  | 'EXTERNAL_CLOSE'
  | 'SYSTEM_REPAIR'
  | 'UNKNOWN';

export const normalizeCloseReason = (value: unknown): RuntimeTradeActionReason | null => {
  if (
    value === 'TP' ||
    value === 'TTP' ||
    value === 'SL' ||
    value === 'TSL' ||
    value === 'LIQUIDATION' ||
    value === 'ACCOUNT_FLOOR' ||
    value === 'MANUAL' ||
    value === 'SIGNAL_EXIT' ||
    value === 'POSITION_LIFETIME' ||
    value === 'EXTERNAL_SYNC_MISSING' ||
    value === 'SYSTEM_REPAIR'
  ) {
    return toRuntimeTradeActionReason(value as PositionCloseReason);
  }
  if (typeof value !== 'string') return null;
  const normalized = value.trim().toLowerCase();
  if (!normalized) return null;
  if (normalized === 'take_profit') return 'TAKE_PROFIT';
  if (normalized === 'stop_loss') return 'STOP_LOSS';
  if (normalized === 'trailing_take_profit') return 'TRAILING_TAKE_PROFIT';
  if (normalized === 'trailing_stop') return 'TRAILING_STOP';
  if (normalized === 'signal_exit') return 'SIGNAL_EXIT';
  if (normalized === 'manual') return 'MANUAL';
  if (normalized === 'liquidation') return 'LIQUIDATION';
  if (normalized === 'position_lifetime') return 'POSITION_LIFETIME';
  if (normalized === 'external_close') return 'EXTERNAL_CLOSE';
  if (normalized === 'system_repair') return 'SYSTEM_REPAIR';
  return null;
};

type CloseEventRow = {
  eventAt: Date;
  payload: unknown;
};

export const buildCloseReasonLookup = (rows: CloseEventRow[]) => {
  const closeReasonByOrderId = new Map<string, { reason: RuntimeTradeActionReason; eventAt: number }>();
  const closeReasonByPositionId = new Map<string, { reason: RuntimeTradeActionReason; eventAt: number }>();

  for (const row of rows) {
    const payload = asRecord(row.payload);
    const reason = normalizeCloseReason(payload?.reason);
    if (!reason) continue;

    const eventAtTs = row.eventAt.getTime();
    const orderId = typeof payload?.orderId === 'string' ? payload.orderId : null;
    const positionId = typeof payload?.positionId === 'string' ? payload.positionId : null;

    if (orderId) {
      const current = closeReasonByOrderId.get(orderId);
      if (!current || eventAtTs >= current.eventAt) {
        closeReasonByOrderId.set(orderId, { reason, eventAt: eventAtTs });
      }
    }
    if (positionId) {
      const current = closeReasonByPositionId.get(positionId);
      if (!current || eventAtTs >= current.eventAt) {
        closeReasonByPositionId.set(positionId, { reason, eventAt: eventAtTs });
      }
    }
  }

  return {
    closeReasonByOrderId,
    closeReasonByPositionId,
  };
};
