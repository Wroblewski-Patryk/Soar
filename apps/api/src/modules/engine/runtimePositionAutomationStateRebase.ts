import { Position } from '@prisma/client';

import { PositionManagementState } from './positionManagement.types';

type ExchangeSyncedRuntimePosition = Pick<Position, 'origin' | 'quantity' | 'entryPrice'>;

export const hasMaterialCanonicalBasisDrift = (input: {
  position: ExchangeSyncedRuntimePosition;
  state: Pick<PositionManagementState, 'quantity' | 'averageEntryPrice'> | null;
}) => {
  if (input.position.origin !== 'EXCHANGE_SYNC' || !input.state) return false;
  const quantityTolerance = Math.max(1e-9, Math.abs(input.position.quantity) * 1e-6);
  const entryTolerance = Math.max(1e-9, Math.abs(input.position.entryPrice) * 1e-6);
  return (
    Math.abs(input.state.quantity - input.position.quantity) > quantityTolerance ||
    Math.abs(input.state.averageEntryPrice - input.position.entryPrice) > entryTolerance
  );
};
