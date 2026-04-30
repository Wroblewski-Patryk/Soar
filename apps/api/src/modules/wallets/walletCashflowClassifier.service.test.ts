import { WalletCashflowSource } from '@prisma/client';
import { describe, expect, it, vi } from 'vitest';

import {
  classifyExchangeWalletCashflowSource,
  recordExchangeWalletCashflowEvent,
  recordInitialBalanceCashflowForSnapshot,
} from './walletCashflowClassifier.service';

describe('walletCashflowClassifier.service', () => {
  it('classifies exchange cashflow history without treating every balance move as bot pnl', () => {
    expect(
      classifyExchangeWalletCashflowSource({
        source: 'fetchDeposits',
        direction: 'IN',
        type: 'deposit',
      })
    ).toBe(WalletCashflowSource.DEPOSIT);
    expect(
      classifyExchangeWalletCashflowSource({
        source: 'fetchWithdrawals',
        direction: 'OUT',
        type: 'withdrawal',
      })
    ).toBe(WalletCashflowSource.WITHDRAWAL);
    expect(
      classifyExchangeWalletCashflowSource({
        source: 'fetchLedger',
        direction: 'NEUTRAL',
        type: 'COMMISSION',
      })
    ).toBe(WalletCashflowSource.FEE);
    expect(
      classifyExchangeWalletCashflowSource({
        source: 'fetchLedger',
        direction: 'NEUTRAL',
        type: null,
      })
    ).toBe(WalletCashflowSource.UNKNOWN_EXTERNAL_ADJUSTMENT);
  });

  it('records initial contributed capital from allocated snapshot balance idempotently', async () => {
    const upsert = vi.fn(async (payload) => payload);

    await recordInitialBalanceCashflowForSnapshot(
      {
        id: 'snapshot-1',
        userId: 'user-1',
        walletId: 'wallet-1',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        baseCurrency: 'USDT',
        accountBalance: 500,
        freeBalance: 450,
        allocatedBalance: 200,
        allocationMode: 'PERCENT',
        allocationValue: 40,
        fetchedAt: new Date('2026-04-30T10:00:00.000Z'),
        source: 'EXCHANGE_BALANCE',
        externalRef: null,
        metadata: null,
        createdAt: new Date('2026-04-30T10:00:00.000Z'),
        updatedAt: new Date('2026-04-30T10:00:00.000Z'),
      },
      { walletCashflowEvent: { upsert } } as unknown as Parameters<
        typeof recordInitialBalanceCashflowForSnapshot
      >[1]
    );

    expect(upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          walletId_exchangeEventId_source: {
            walletId: 'wallet-1',
            exchangeEventId: 'initial:snapshot-1',
            source: 'INITIAL_BALANCE',
          },
        },
        create: expect.objectContaining({
          direction: 'IN',
          source: 'INITIAL_BALANCE',
          amount: 200,
          currency: 'USDT',
        }),
      })
    );
  });

  it('upserts exchange cashflow events by wallet, exchange event id, and classified source', async () => {
    const upsert = vi.fn(async (payload) => payload);

    await recordExchangeWalletCashflowEvent(
      {
        userId: 'user-1',
        walletId: 'wallet-1',
        baseCurrency: 'USDT',
        entry: {
          exchangeEventId: 'deposit-1',
          direction: 'IN',
          type: 'deposit',
          amount: 10,
          currency: 'USDT',
          feeCost: 0,
          feeCurrency: null,
          occurredAt: new Date('2026-04-30T11:00:00.000Z'),
          status: 'ok',
          source: 'fetchDeposits',
          raw: {},
        },
      },
      { walletCashflowEvent: { upsert } } as unknown as Parameters<
        typeof recordExchangeWalletCashflowEvent
      >[1]
    );

    expect(upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          walletId_exchangeEventId_source: {
            walletId: 'wallet-1',
            exchangeEventId: 'deposit-1',
            source: 'DEPOSIT',
          },
        },
        create: expect.objectContaining({
          direction: 'IN',
          source: 'DEPOSIT',
          amount: 10,
          currency: 'USDT',
        }),
      })
    );
  });
});
