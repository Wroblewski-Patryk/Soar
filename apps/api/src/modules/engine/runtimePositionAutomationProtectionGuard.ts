import { StreamTickerEvent } from '../market-stream/binanceStream.types';
import { tryRebasePositionManagementProtection } from './positionManagement.service';
import { PositionManagementState } from './positionManagement.types';
import { recordRuntimeProtectionUnconfirmedTelemetry } from './runtimePositionAutomationSkipTelemetry';
import { RuntimeManagedPosition, RuntimePositionAutomationDeps } from './runtimePositionAutomation.types';
import { runtimePositionStateStore } from './runtimePositionState.store';
import { markRuntimeProtectionArmed, protectionMatchesEvidence,
  readRuntimeProtectionEvidence, RuntimeProtectionEvidence } from './runtimePositionProtectionEvidence.service';

export const readPositionStateForAutomation = async (input: {
  position: RuntimeManagedPosition;
  mode: 'PAPER' | 'LIVE';
  event: StreamTickerEvent;
  strategyId: string | null;
  memoryState?: PositionManagementState;
  recordRuntimeEvent?: RuntimePositionAutomationDeps['recordRuntimeEvent'];
}): Promise<{ actionable: true; state: PositionManagementState | null;
  evidence: RuntimeProtectionEvidence | null } | { actionable: false }> => {
  const { position } = input;
  const requireSharedCache = input.mode === 'LIVE' && position.origin === 'BOT' &&
    position.status === 'OPEN';
  const storedState = requireSharedCache
    ? await runtimePositionStateStore.getTrustedPositionRuntimeState(position.id)
    : await runtimePositionStateStore.getPositionRuntimeState(position.id);
  const state = requireSharedCache ? storedState : input.memoryState ?? storedState;
  const evidence = requireSharedCache
    ? await readRuntimeProtectionEvidence(position.id).catch(() => null) : null;
  if (requireSharedCache && (!state || !tryRebasePositionManagementProtection(state,
    position.entryPrice, position.side, position.leverage || 1) ||
    !protectionMatchesEvidence(state, evidence))) {
    await recordRuntimeProtectionUnconfirmedTelemetry({
      recordRuntimeEvent: input.recordRuntimeEvent, event: input.event, position,
      strategyId: input.strategyId,
    });
    return { actionable: false };
  }
  return { actionable: true, state, evidence };
};

export const confirmProtectionBeforeAutomationActions = async (input: {
  position: RuntimeManagedPosition;
  event: StreamTickerEvent;
  strategyId: string | null;
  recordRuntimeEvent?: RuntimePositionAutomationDeps['recordRuntimeEvent'];
  evidence: RuntimeProtectionEvidence | null;
  nextState: PositionManagementState;
}) => {
  if (!input.evidence) return true;
  try {
    if (await markRuntimeProtectionArmed({ positionId: input.position.id,
      state: input.nextState, evidence: input.evidence })) return true;
  } catch { /* Block actions when durable protection evidence cannot be written. */ }
  await recordRuntimeProtectionUnconfirmedTelemetry({
    recordRuntimeEvent: input.recordRuntimeEvent, event: input.event,
    position: input.position, strategyId: input.strategyId,
  });
  return false;
};
