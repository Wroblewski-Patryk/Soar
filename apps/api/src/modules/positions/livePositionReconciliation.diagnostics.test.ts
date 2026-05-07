import { describe, expect, it, vi } from 'vitest';

import { reconcileExternalPositionsFromExchange } from './livePositionReconciliation.service';

describe('live position reconciliation diagnostics', () => {
  it('returns per-symbol diagnostics for owned, manual, ambiguous, unowned, and missing-entry imports', async () => {
    const createSyncedPosition = vi.fn(async () => undefined);

    const result = await reconcileExternalPositionsFromExchange({
      listSyncedApiKeys: vi.fn(async () => [{ id: 'key-diagnostics-1', userId: 'user-diagnostics-1' }]),
      resolveOwnershipIndexForUser: vi.fn(async () =>
        new Map([
          ['key-diagnostics-1:BTCUSDT', { status: 'OWNED' as const, botId: 'bot-owned', walletId: 'wallet-owned' }],
          ['key-diagnostics-1:ETHUSDT', { status: 'MANUAL_ONLY' as const, botId: null, walletId: null }],
          ['key-diagnostics-1:DOGEUSDT', { status: 'AMBIGUOUS' as const, botId: null, walletId: null }],
          ['key-diagnostics-1:SOLUSDT', { status: 'OWNED' as const, botId: 'bot-owned', walletId: 'wallet-owned' }],
        ])
      ),
      fetchPositionsForApiKey: vi.fn(async () => ({
        positions: [
          { symbol: 'BTCUSDT', side: 'long', contracts: 1, entryPrice: 100, markPrice: 101, unrealizedPnl: 1, leverage: 2, timestamp: null },
          { symbol: 'ETHUSDT', side: 'long', contracts: 2, entryPrice: 200, markPrice: 201, unrealizedPnl: 2, leverage: 2, timestamp: null },
          { symbol: 'DOGEUSDT', side: 'long', contracts: 3, entryPrice: 0.1, markPrice: 0.11, unrealizedPnl: 3, leverage: 2, timestamp: null },
          { symbol: 'BNBUSDT', side: 'long', contracts: 4, entryPrice: 500, markPrice: 501, unrealizedPnl: 4, leverage: 2, timestamp: null },
          { symbol: 'SOLUSDT', side: 'long', contracts: 5, entryPrice: null, markPrice: 151, unrealizedPnl: 5, leverage: 2, timestamp: null },
        ],
      })),
      findOpenSyncedPositionByExternalId: vi.fn(async () => null),
      resolveCanonicalBotContinuityContext: vi.fn(async (botId: string) => ({
        botId,
        walletId: 'wallet-owned',
        strategyId: 'strategy-owned',
      })),
      updateSyncedPosition: vi.fn(async () => undefined),
      createSyncedPosition,
      listOpenSyncedPositionsForApiKey: vi.fn(async () => []),
      markMissingSyncedPosition: vi.fn(async () => undefined),
      closeStaleSyncedPosition: vi.fn(async () => undefined),
      now: () => new Date('2026-05-07T12:00:00.000Z'),
    });

    expect(result.openPositionsSeen).toBe(5);
    expect(result.diagnosticSummary).toMatchObject({
      CREATED: 4,
      SKIPPED_MISSING_ENTRY_TRUTH: 1,
    });
    expect(createSyncedPosition).toHaveBeenCalledTimes(4);

    const bySymbol = new Map(result.positionDiagnostics.map((diagnostic) => [diagnostic.symbol, diagnostic]));
    expect(bySymbol.get('BTCUSDT')).toMatchObject({
      outcome: 'CREATED',
      ownershipStatus: 'OWNED',
      managementMode: 'BOT_MANAGED',
      syncState: 'IN_SYNC',
      botVisible: true,
      reason: 'owned_by_canonical_bot_scope',
    });
    expect(bySymbol.get('ETHUSDT')).toMatchObject({
      outcome: 'CREATED',
      ownershipStatus: 'MANUAL_ONLY',
      managementMode: 'MANUAL_MANAGED',
      syncState: 'IN_SYNC',
      botVisible: false,
      reason: 'manual_only_scope',
    });
    expect(bySymbol.get('DOGEUSDT')).toMatchObject({
      outcome: 'CREATED',
      ownershipStatus: 'AMBIGUOUS',
      managementMode: 'MANUAL_MANAGED',
      syncState: 'DRIFT',
      botVisible: false,
      reason: 'unresolved_owner',
    });
    expect(bySymbol.get('BNBUSDT')).toMatchObject({
      outcome: 'CREATED',
      ownershipStatus: 'UNOWNED',
      managementMode: 'MANUAL_MANAGED',
      syncState: 'DRIFT',
      botVisible: false,
      reason: 'unresolved_owner',
    });
    expect(bySymbol.get('SOLUSDT')).toMatchObject({
      outcome: 'SKIPPED_MISSING_ENTRY_TRUTH',
      ownershipStatus: 'OWNED',
      managementMode: null,
      botVisible: false,
      reason: 'missing_entry_truth',
    });
  });
});
