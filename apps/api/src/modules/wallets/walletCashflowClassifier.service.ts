import {
  Prisma,
  WalletBalanceSnapshot,
  WalletCashflowDirection,
  WalletCashflowSource,
} from '@prisma/client';

import { ExchangeWalletCashflowHistoryEntry } from '../exchange/exchangeData.types';
import { prisma } from '../../prisma/client';

type WalletCashflowPrismaClient = Pick<Prisma.TransactionClient, 'walletCashflowEvent'>;

const normalizeType = (value: string | null) => value?.trim().toUpperCase() ?? '';

export const classifyExchangeWalletCashflowSource = (
  entry: Pick<ExchangeWalletCashflowHistoryEntry, 'source' | 'direction' | 'type'>
): WalletCashflowSource => {
  const type = normalizeType(entry.type);
  if (entry.source === 'fetchDeposits') return WalletCashflowSource.DEPOSIT;
  if (entry.source === 'fetchWithdrawals') return WalletCashflowSource.WITHDRAWAL;
  if (/TRANSFER.*IN|INTERNAL_TRANSFER_IN|MAIN_UMFUTURE/.test(type)) {
    return WalletCashflowSource.TRANSFER_IN;
  }
  if (/TRANSFER.*OUT|INTERNAL_TRANSFER_OUT|UMFUTURE_MAIN/.test(type)) {
    return WalletCashflowSource.TRANSFER_OUT;
  }
  if (/FUNDING/.test(type)) return WalletCashflowSource.FUNDING;
  if (/COMMISSION|FEE/.test(type)) return WalletCashflowSource.FEE;
  if (/REALIZED|PNL|PROFIT|INCOME/.test(type)) return WalletCashflowSource.BOT_REALIZED_PNL;
  if (entry.direction === 'IN') return WalletCashflowSource.DEPOSIT;
  if (entry.direction === 'OUT') return WalletCashflowSource.WITHDRAWAL;
  return WalletCashflowSource.UNKNOWN_EXTERNAL_ADJUSTMENT;
};

const mapDirection = (direction: ExchangeWalletCashflowHistoryEntry['direction']) => {
  if (direction === 'IN') return WalletCashflowDirection.IN;
  if (direction === 'OUT') return WalletCashflowDirection.OUT;
  return WalletCashflowDirection.NEUTRAL;
};

export const recordInitialBalanceCashflowForSnapshot = async (
  snapshot: WalletBalanceSnapshot,
  client: WalletCashflowPrismaClient = prisma
) => {
  if (snapshot.allocatedBalance <= 0) return null;

  return client.walletCashflowEvent.upsert({
    where: {
      walletId_exchangeEventId_source: {
        walletId: snapshot.walletId,
        exchangeEventId: `initial:${snapshot.id}`,
        source: WalletCashflowSource.INITIAL_BALANCE,
      },
    },
    create: {
      userId: snapshot.userId,
      walletId: snapshot.walletId,
      direction: WalletCashflowDirection.IN,
      source: WalletCashflowSource.INITIAL_BALANCE,
      amount: snapshot.allocatedBalance,
      currency: snapshot.baseCurrency,
      occurredAt: snapshot.fetchedAt,
      exchangeEventId: `initial:${snapshot.id}`,
      balanceSnapshotId: snapshot.id,
      metadata: {
        accountBalance: snapshot.accountBalance,
        freeBalance: snapshot.freeBalance,
        allocationMode: snapshot.allocationMode,
        allocationValue: snapshot.allocationValue,
      },
    },
    update: {
      amount: snapshot.allocatedBalance,
      occurredAt: snapshot.fetchedAt,
      balanceSnapshotId: snapshot.id,
    },
  });
};

export const recordExchangeWalletCashflowEvent = async (
  input: {
    userId: string;
    walletId: string;
    baseCurrency: string;
    entry: ExchangeWalletCashflowHistoryEntry;
    balanceSnapshotId?: string | null;
  },
  client: WalletCashflowPrismaClient = prisma
) => {
  const source = classifyExchangeWalletCashflowSource(input.entry);
  const occurredAt = input.entry.occurredAt ?? new Date();
  const currency = input.entry.currency ?? input.baseCurrency;
  const data = {
    userId: input.userId,
    walletId: input.walletId,
    direction: mapDirection(input.entry.direction),
    source,
    amount: input.entry.amount,
    currency,
    occurredAt,
    exchangeEventId: input.entry.exchangeEventId,
    balanceSnapshotId: input.balanceSnapshotId ?? null,
    metadata: {
      type: input.entry.type,
      status: input.entry.status,
      source: input.entry.source,
      feeCost: input.entry.feeCost,
      feeCurrency: input.entry.feeCurrency,
      raw: input.entry.raw as Prisma.InputJsonValue,
    },
  };

  if (input.entry.exchangeEventId) {
    return client.walletCashflowEvent.upsert({
      where: {
        walletId_exchangeEventId_source: {
          walletId: input.walletId,
          exchangeEventId: input.entry.exchangeEventId,
          source,
        },
      },
      create: data,
      update: {
        direction: data.direction,
        amount: data.amount,
        currency: data.currency,
        occurredAt: data.occurredAt,
        balanceSnapshotId: data.balanceSnapshotId,
        metadata: data.metadata,
      },
    });
  }

  return client.walletCashflowEvent.create({ data });
};
