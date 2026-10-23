import { prisma } from '../../prisma/client';
import { runtimePositionStateStore } from './runtimePositionState.store';

// Only callers holding proof of a newly created OPEN Position may use this.
// A replay of an old OPEN must never recreate protection after Redis loss.
export const initializeNewLiveBotPositionState = async (input: {
  userId: string; positionId: string;
}) => {
  const position = await prisma.position.findFirst({
    where: { id: input.positionId, userId: input.userId, origin: 'BOT',
      managementMode: 'BOT_MANAGED', status: 'OPEN', syncState: 'IN_SYNC',
      bot: { is: { mode: 'LIVE' } } },
    select: { id: true, quantity: true, entryPrice: true,
      runtimeTtpEverArmed: true, runtimeTslEverArmed: true },
  });
  if (!position || position.runtimeTtpEverArmed !== false ||
      position.runtimeTslEverArmed !== false ||
      !Number.isFinite(position.quantity) || position.quantity <= 0 ||
      !Number.isFinite(position.entryPrice) || position.entryPrice <= 0) return false;
  return runtimePositionStateStore.initializeNewPositionRuntimeState(position.id, {
    quantity: position.quantity, averageEntryPrice: position.entryPrice,
    currentAdds: 0, trailingAnchorPrice: position.entryPrice,
  });
};
