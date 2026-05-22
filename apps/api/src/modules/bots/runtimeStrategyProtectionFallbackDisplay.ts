import { PositionManagementState } from '../engine/positionManagement.types';

export const canUseStrategyProtectionFallbackForDisplay = (input: {
  position: {
    origin: 'BOT' | 'EXCHANGE_SYNC' | 'USER' | 'SYSTEM_REPAIR' | 'BACKTEST';
  };
  strategyAutomationContextResolved: boolean;
  runtimeState: PositionManagementState | null;
}) => {
  if (!input.strategyAutomationContextResolved) return false;
  if (input.position.origin !== 'EXCHANGE_SYNC') return true;
  return input.runtimeState != null;
};
