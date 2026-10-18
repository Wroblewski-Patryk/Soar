import { StreamTickerEvent } from '../market-stream/binanceStream.types';
import { tryRebasePositionManagementProtection } from './positionManagement.service';
import { PositionManagementState } from './positionManagement.types';
import { recordRuntimeProtectionUnconfirmedTelemetry } from './runtimePositionAutomationSkipTelemetry';
import { RuntimeManagedPosition, RuntimePositionAutomationDeps } from './runtimePositionAutomation.types';
import { runtimePositionStateStore } from './runtimePositionState.store';

export const readPositionStateForAutomation = async (input: {
  position: RuntimeManagedPosition;
  mode: 'PAPER' | 'LIVE';
  event: StreamTickerEvent;
  strategyId: string | null;
  memoryState?: PositionManagementState;
  recordRuntimeEvent?: RuntimePositionAutomationDeps['recordRuntimeEvent'];
}): Promise<{ actionable: true; state: PositionManagementState | null } | { actionable: false }> => {
  const { position } = input;
  const requireSharedCache = input.mode === 'LIVE' && position.origin === 'BOT' &&
    position.status === 'OPEN';
  const storedState = requireSharedCache
    ? await runtimePositionStateStore.getTrustedPositionRuntimeState(position.id)
    : await runtimePositionStateStore.getPositionRuntimeState(position.id);
  const state = requireSharedCache ? storedState : input.memoryState ?? storedState;
  if (requireSharedCache && (!state || !tryRebasePositionManagementProtection(state,
    position.entryPrice, position.side, position.leverage || 1))) {
    await recordRuntimeProtectionUnconfirmedTelemetry({
      recordRuntimeEvent: input.recordRuntimeEvent, event: input.event, position,
      strategyId: input.strategyId,
    });
    return { actionable: false };
  }
  return { actionable: true, state };
};
