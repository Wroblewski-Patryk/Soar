import { prisma } from '../../prisma/client';
import { PositionManagementState } from './positionManagement.types';
import { runtimePositionStateStore } from './runtimePositionState.store';

export type RuntimeProtectionEvidence = {
  ttpEverArmed: boolean | null;
  tslEverArmed: boolean | null;
};

const armed = (state: PositionManagementState) => ({
  ttp: state.trailingTakeProfitHighPercent != null &&
    state.trailingTakeProfitStepPercent != null,
  tsl: state.trailingLossLimitPercent != null,
});

export const protectionMatchesEvidence = (
  state: PositionManagementState, evidence: RuntimeProtectionEvidence | null,
) => {
  if (!evidence || evidence.ttpEverArmed == null || evidence.tslEverArmed == null) return false;
  const active = armed(state);
  if (active.ttp && active.tsl) return false;
  // TTP supersedes TSL. Both monotonic flags mean TTP was armed after TSL.
  if (evidence.ttpEverArmed) return active.ttp;
  if (evidence.tslEverArmed) return active.tsl;
  return !active.ttp && !active.tsl;
};

export const readRuntimeProtectionEvidence = async (
  positionId: string,
): Promise<RuntimeProtectionEvidence | null> => {
  if (process.env.NODE_ENV === 'test') return runtimePositionStateStore.getTestProtectionEvidence(positionId);
  const position = await prisma.position.findFirst({
    where: { id: positionId, status: 'OPEN', origin: 'BOT', managementMode: 'BOT_MANAGED',
      bot: { is: { mode: 'LIVE' } } },
    select: { runtimeTtpEverArmed: true, runtimeTslEverArmed: true },
  });
  return position ? { ttpEverArmed: position.runtimeTtpEverArmed,
    tslEverArmed: position.runtimeTslEverArmed } : null;
};

// Commit the monotonic evidence before publishing a newly armed tracker to Redis
// or submitting an action based on that evaluation.
export const markRuntimeProtectionArmed = async (input: {
  positionId: string; state: PositionManagementState;
  evidence: RuntimeProtectionEvidence;
}) => {
  const active = armed(input.state);
  if (active.ttp && active.tsl) return false;
  if (input.evidence.ttpEverArmed && !active.ttp) return false;
  if (input.evidence.tslEverArmed && !active.tsl && !active.ttp) return false;
  if (process.env.NODE_ENV === 'test') {
    const current = runtimePositionStateStore.getTestProtectionEvidence(input.positionId);
    if (!current || current.ttpEverArmed !== input.evidence.ttpEverArmed ||
        current.tslEverArmed !== input.evidence.tslEverArmed) return false;
    runtimePositionStateStore.markTestProtectionEvidence(input.positionId, active);
    return true;
  }
  if (input.evidence.ttpEverArmed == null || input.evidence.tslEverArmed == null) return false;
  const data = {
    ...(active.ttp && !input.evidence.ttpEverArmed ? { runtimeTtpEverArmed: true } : {}),
    ...(active.tsl && !input.evidence.tslEverArmed ? { runtimeTslEverArmed: true } : {}),
  };
  const where = { id: input.positionId, status: 'OPEN' as const,
    origin: 'BOT' as const, managementMode: 'BOT_MANAGED' as const,
    runtimeTtpEverArmed: input.evidence.ttpEverArmed,
    runtimeTslEverArmed: input.evidence.tslEverArmed,
    bot: { is: { mode: 'LIVE' as const } } };
  if (Object.keys(data).length === 0) {
    return await prisma.position.findFirst({ where, select: { id: true } }) != null;
  }
  const updated = await prisma.position.updateMany({
    where,
    data,
  });
  return updated.count === 1;
};
