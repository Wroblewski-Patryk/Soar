import { Position } from '@prisma/client';

import { PositionManagementState } from './positionManagement.types';

type CanonicalRuntimePosition = Pick<Position, 'origin' | 'quantity' | 'entryPrice'>;

export const hasMaterialCanonicalBasisDrift = (input: {
  position: CanonicalRuntimePosition;
  state: Pick<PositionManagementState, 'quantity' | 'averageEntryPrice'> | null;
}) => {
  if (!input.state || (input.position.origin !== 'EXCHANGE_SYNC' &&
      input.position.origin !== 'BOT')) return false;
  const quantityTolerance = input.position.origin === 'BOT'
    ? 16 * Number.EPSILON * Math.max(Math.abs(input.position.quantity), Math.abs(input.state.quantity))
    : Math.max(1e-9, Math.abs(input.position.quantity) * 1e-6);
  const entryTolerance = input.position.origin === 'BOT'
    ? 16 * Number.EPSILON * Math.max(Math.abs(input.position.entryPrice), Math.abs(input.state.averageEntryPrice))
    : Math.max(1e-9, Math.abs(input.position.entryPrice) * 1e-6);
  return (
    Math.abs(input.state.quantity - input.position.quantity) > quantityTolerance ||
    Math.abs(input.state.averageEntryPrice - input.position.entryPrice) > entryTolerance
  );
};
