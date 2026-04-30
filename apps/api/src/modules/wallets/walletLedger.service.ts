import { Exchange, Prisma, TradeMarket, WalletAllocationMode } from '@prisma/client';

import { resolveReferenceBalanceFromAllocation } from '../../lib/capitalAllocation';
import { normalizeBaseCurrency } from '../../lib/symbols';
import { prisma } from '../../prisma/client';

type WalletLedgerPrismaClient = Pick<Prisma.TransactionClient, 'walletBalanceSnapshot'>;

export type RecordLiveWalletBalanceSnapshotInput = {
  userId: string;
  walletId: string;
  exchange: Exchange;
  marketType: TradeMarket;
  baseCurrency: string;
  accountBalance: number;
  freeBalance: number | null;
  allocationMode: WalletAllocationMode | null;
  allocationValue: number | null;
  fetchedAt?: Date;
  externalRef?: string | null;
  metadata?: Prisma.InputJsonValue;
};

export const recordLiveWalletBalanceSnapshot = async (
  input: RecordLiveWalletBalanceSnapshotInput,
  client: WalletLedgerPrismaClient = prisma
) => {
  const accountBalance = Math.max(0, input.accountBalance);
  const freeBalance =
    typeof input.freeBalance === 'number' && Number.isFinite(input.freeBalance)
      ? Math.max(0, input.freeBalance)
      : accountBalance;
  const allocatedBalance = resolveReferenceBalanceFromAllocation({
    accountBalance,
    liveAllocationMode: input.allocationMode,
    liveAllocationValue: input.allocationValue,
  });

  return client.walletBalanceSnapshot.create({
    data: {
      userId: input.userId,
      walletId: input.walletId,
      exchange: input.exchange,
      marketType: input.marketType,
      baseCurrency: normalizeBaseCurrency(input.baseCurrency),
      accountBalance,
      freeBalance,
      allocatedBalance,
      allocationMode: input.allocationMode,
      allocationValue: input.allocationValue,
      fetchedAt: input.fetchedAt ?? new Date(),
      externalRef: input.externalRef ?? null,
      metadata: input.metadata ?? Prisma.JsonNull,
    },
  });
};
