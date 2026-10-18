import { PositionManagementState } from './positionManagement.types';

export const clonePositionManagementState = (state: PositionManagementState): PositionManagementState => ({
  ...state,
  executedDcaLevelIndices: state.executedDcaLevelIndices ? [...state.executedDcaLevelIndices] : undefined,
});

export const positionManagementStatesEqual = (
  left: PositionManagementState,
  right: PositionManagementState,
): boolean =>
  left.quantity === right.quantity &&
  left.averageEntryPrice === right.averageEntryPrice &&
  left.currentAdds === right.currentAdds &&
  JSON.stringify(left.executedDcaLevelIndices ?? []) === JSON.stringify(right.executedDcaLevelIndices ?? []) &&
  left.trailingAnchorPrice === right.trailingAnchorPrice &&
  left.trailingLossLimitPercent === right.trailingLossLimitPercent &&
  left.trailingLossActiveLevelIndex === right.trailingLossActiveLevelIndex &&
  left.trailingTakeProfitHighPercent === right.trailingTakeProfitHighPercent &&
  left.trailingTakeProfitStepPercent === right.trailingTakeProfitStepPercent &&
  left.trailingTakeProfitActiveLevelIndex === right.trailingTakeProfitActiveLevelIndex &&
  left.lastDcaPrice === right.lastDcaPrice;
