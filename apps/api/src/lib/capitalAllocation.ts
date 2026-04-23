import { WalletAllocationMode } from '@prisma/client';

export const resolveReferenceBalanceFromAllocation = (input: {
  accountBalance: number;
  liveAllocationMode: WalletAllocationMode | null;
  liveAllocationValue: number | null;
}) => {
  if (!Number.isFinite(input.accountBalance) || input.accountBalance <= 0) return 0;

  if (input.liveAllocationMode === 'PERCENT' && Number.isFinite(input.liveAllocationValue)) {
    const percent = Math.max(0, Math.min(100, input.liveAllocationValue ?? 0));
    return input.accountBalance * (percent / 100);
  }

  if (input.liveAllocationMode === 'FIXED' && Number.isFinite(input.liveAllocationValue)) {
    const fixed = Math.max(0, input.liveAllocationValue ?? 0);
    return Math.min(input.accountBalance, fixed);
  }

  return input.accountBalance;
};
