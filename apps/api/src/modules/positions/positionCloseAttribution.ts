import {
  PositionCloseInitiator,
  PositionCloseReason,
} from '@prisma/client';

export type PositionCloseAttribution = {
  closeReason: PositionCloseReason;
  closeInitiator: PositionCloseInitiator;
};

const normalizeReason = (value: string | null | undefined) => value?.trim().toLowerCase() ?? null;

export const resolveUserAppManualCloseAttribution = (): PositionCloseAttribution => ({
  closeReason: 'MANUAL',
  closeInitiator: 'USER_APP',
});

export const resolveExternalSyncMissingCloseAttribution =
  (): PositionCloseAttribution => ({
    closeReason: 'EXTERNAL_SYNC_MISSING',
    closeInitiator: 'USER_EXCHANGE',
  });

export const resolveSystemRepairCloseAttribution = (): PositionCloseAttribution => ({
  closeReason: 'SYSTEM_REPAIR',
  closeInitiator: 'SYSTEM_REPAIR',
});

export const resolveExchangeLiquidationCloseAttribution =
  (): PositionCloseAttribution => ({
    closeReason: 'LIQUIDATION',
    closeInitiator: 'EXCHANGE',
  });

export const resolveRuntimeCloseAttribution = (
  reason: string | null | undefined
): PositionCloseAttribution => {
  const normalized = normalizeReason(reason);
  switch (normalized) {
    case 'manual_dashboard_close_position':
      return resolveUserAppManualCloseAttribution();
    case 'take_profit':
    case 'take_profit_signal':
      return {
        closeReason: 'TP',
        closeInitiator: 'BOT_APP',
      };
    case 'trailing_take_profit':
      return {
        closeReason: 'TTP',
        closeInitiator: 'BOT_APP',
      };
    case 'stop_loss':
      return {
        closeReason: 'SL',
        closeInitiator: 'BOT_APP',
      };
    case 'trailing_stop':
      return {
        closeReason: 'TSL',
        closeInitiator: 'BOT_APP',
      };
    case 'account_floor_protection':
      return {
        closeReason: 'ACCOUNT_FLOOR',
        closeInitiator: 'BOT_APP',
      };
    case 'position_lifetime_expired':
      return {
        closeReason: 'POSITION_LIFETIME',
        closeInitiator: 'BOT_APP',
      };
    case 'signal_exit':
      return {
        closeReason: 'SIGNAL_EXIT',
        closeInitiator: 'BOT_APP',
      };
    case 'liquidation':
      return resolveExchangeLiquidationCloseAttribution();
    default:
      return {
        closeReason: 'SIGNAL_EXIT',
        closeInitiator: 'BOT_APP',
      };
  }
};

export const resolveExchangeConfirmedCloseAttribution = (input: {
  orderCloseReason: PositionCloseReason | null | undefined;
  orderCloseInitiator: PositionCloseInitiator | null | undefined;
  executionType: string | null | undefined;
}): PositionCloseAttribution => {
  if (input.orderCloseReason && input.orderCloseInitiator) {
    return {
      closeReason: input.orderCloseReason,
      closeInitiator: input.orderCloseInitiator,
    };
  }

  const normalizedExecutionType = normalizeReason(input.executionType);
  if (normalizedExecutionType?.includes('liquidation')) {
    return resolveExchangeLiquidationCloseAttribution();
  }

  return {
    closeReason: input.orderCloseReason ?? 'MANUAL',
    closeInitiator: input.orderCloseInitiator ?? 'BOT_APP',
  };
};

export const toRuntimeTradeActionReason = (
  value: PositionCloseReason | null | undefined
):
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
  | 'UNKNOWN' => {
  switch (value) {
    case 'TP':
      return 'TAKE_PROFIT';
    case 'SL':
      return 'STOP_LOSS';
    case 'TTP':
      return 'TRAILING_TAKE_PROFIT';
    case 'TSL':
      return 'TRAILING_STOP';
    case 'MANUAL':
      return 'MANUAL';
    case 'LIQUIDATION':
      return 'LIQUIDATION';
    case 'POSITION_LIFETIME':
      return 'POSITION_LIFETIME';
    case 'EXTERNAL_SYNC_MISSING':
      return 'EXTERNAL_CLOSE';
    case 'SYSTEM_REPAIR':
      return 'SYSTEM_REPAIR';
    case 'ACCOUNT_FLOOR':
    case 'SIGNAL_EXIT':
      return 'SIGNAL_EXIT';
    default:
      return 'UNKNOWN';
  }
};
