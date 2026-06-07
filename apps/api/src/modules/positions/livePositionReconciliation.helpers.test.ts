import { describe, expect, it, vi } from 'vitest';

import {
  buildPositionIdentity,
  extractSymbolFromExternalId,
  isImportedExternalPositionKeyInMarketScope,
  normalizeImportedLeverage,
  normalizeSymbol,
  resolveCanonicalEntryPrice,
  resolveRecoveredContinuityState,
  resolveRecoveredManagementMode,
  shouldTreatAsLifecycleReplacement,
} from './livePositionReconciliation.helpers';
import {
  hydrateReconciledImportedPositionHistory,
  resolveImportedClosedHistoryClosedAt,
} from './livePositionReconciliation.history';
import {
  resolveExchangeConfirmedCloseAttribution,
  resolveRuntimeCloseAttribution,
} from './positionCloseAttribution';

const apiKey = {
  id: 'api-key-1',
  userId: 'user-1',
  marketType: 'FUTURES' as const,
};

describe('live position reconciliation helpers', () => {
  it('normalizes symbols and builds stable position identities', () => {
    expect(normalizeSymbol(' eth/usdt:usdt ')).toBe('ETHUSDT');
    expect(normalizeSymbol('eth/usdt')).toBe('ETHUSDT');
    expect(normalizeSymbol('eth:usdt')).toBe('ETHUSDT');
    expect(normalizeSymbol('   ')).toBe('');
    expect(buildPositionIdentity(' eth/usdt:usdt ', 'LONG')).toBe('ETHUSDT:LONG');
  });

  it('parses imported external ids and gates stale keys to the api-key market scope', () => {
    expect(extractSymbolFromExternalId('api-key-1:FUTURES:btc/usdt:LONG')).toBe('BTCUSDT');
    expect(extractSymbolFromExternalId('api-key-1:eth/usdt:SHORT')).toBe('ETHUSDT');
    expect(extractSymbolFromExternalId('bad-id')).toBeNull();

    expect(
      isImportedExternalPositionKeyInMarketScope({
        externalId: 'api-key-1:FUTURES:BTCUSDT:LONG',
        apiKeyId: 'api-key-1',
        marketType: 'FUTURES',
      })
    ).toBe(true);
    expect(
      isImportedExternalPositionKeyInMarketScope({
        externalId: 'api-key-1:BTCUSDT:LONG',
        apiKeyId: 'api-key-1',
        marketType: 'FUTURES',
      })
    ).toBe(true);
    expect(
      isImportedExternalPositionKeyInMarketScope({
        externalId: 'api-key-1:SPOT:BTCUSDT:LONG',
        apiKeyId: 'api-key-1',
        marketType: 'FUTURES',
      })
    ).toBe(false);
  });

  it('normalizes leverage and recovered ownership semantics fail-closed for bot-owned rows', () => {
    expect(normalizeImportedLeverage(2.4)).toBe(2);
    expect(normalizeImportedLeverage(0)).toBe(1);
    expect(normalizeImportedLeverage(Number.NaN)).toBe(1);
    expect(normalizeImportedLeverage(null)).toBe(1);

    expect(resolveRecoveredContinuityState({ ownershipStatus: 'OWNED', existingBotId: null })).toBe(
      'CONFIRMED'
    );
    expect(
      resolveRecoveredContinuityState({ ownershipStatus: 'UNOWNED', existingBotId: 'bot-1' })
    ).toBe('RECOVERED_UNACTIONABLE');
    expect(
      resolveRecoveredManagementMode({ ownershipStatus: 'AMBIGUOUS', existingBotId: 'bot-1' })
    ).toBe('BOT_MANAGED');
    expect(
      resolveRecoveredManagementMode({ ownershipStatus: 'UNOWNED', existingBotId: null })
    ).toBe('MANUAL_MANAGED');
  });

  it('detects lifecycle replacement only after the reopen discontinuity grace window', () => {
    const candidateOpenedAt = new Date('2026-06-06T12:00:00.000Z');
    expect(
      shouldTreatAsLifecycleReplacement({
        candidateOpenedAt,
        snapshotOpenedAt: new Date('2026-06-06T12:00:59.000Z'),
      })
    ).toBe(false);
    expect(
      shouldTreatAsLifecycleReplacement({
        candidateOpenedAt,
        snapshotOpenedAt: new Date('2026-06-06T12:01:01.000Z'),
      })
    ).toBe(true);
    expect(shouldTreatAsLifecycleReplacement({ candidateOpenedAt, snapshotOpenedAt: null })).toBe(
      false
    );
  });

  it('uses finite positive exchange entry price as canonical entry truth', () => {
    expect(resolveCanonicalEntryPrice({ entryPrice: 120.5, markPrice: 121 })).toBe(120.5);
    expect(resolveCanonicalEntryPrice({ entryPrice: 0, markPrice: 121 })).toBeNull();
    expect(resolveCanonicalEntryPrice({ entryPrice: Number.NaN, markPrice: 121 })).toBeNull();
    expect(resolveCanonicalEntryPrice({ entryPrice: null, markPrice: 121 })).toBeNull();
  });
});

describe('live position reconciliation history helpers', () => {
  it('hydrates imported position history when both fetch and hydrate dependencies exist', async () => {
    const trade = { id: 'trade-1', symbol: 'BTCUSDT' };
    const fetchTradeHistoryForApiKeySymbol = vi.fn(async () => [trade]);
    const hydrateImportedPositionHistory = vi.fn(async () => undefined);

    await hydrateReconciledImportedPositionHistory({
      deps: {
        fetchTradeHistoryForApiKeySymbol,
        hydrateImportedPositionHistory,
      } as any,
      apiKey,
      userId: 'user-1',
      positionId: 'position-1',
      botId: 'bot-1',
      walletId: 'wallet-1',
      strategyId: 'strategy-1',
      symbol: 'BTCUSDT',
      positionSide: 'LONG',
      positionQuantity: 1,
      managementMode: 'BOT_MANAGED',
      openedAt: new Date('2026-06-06T12:00:00.000Z'),
    });

    expect(fetchTradeHistoryForApiKeySymbol).toHaveBeenCalledWith(
      expect.objectContaining({
        apiKey,
        symbol: 'BTCUSDT',
        since: expect.any(Date),
        limit: expect.any(Number),
      })
    );
    expect(hydrateImportedPositionHistory).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: 'user-1',
        positionId: 'position-1',
        trades: [trade],
      })
    );
  });

  it('returns closed-history close time when available and fallback when dependencies or close time are absent', async () => {
    const closedAt = new Date('2026-06-06T12:30:00.000Z');
    const fallbackClosedAt = new Date('2026-06-06T13:00:00.000Z');
    const fetchTradeHistoryForApiKeySymbol = vi.fn(async () => [{ id: 'trade-1' }]);
    const hydrateClosedImportedPositionHistory = vi.fn(async (): Promise<{ closedAt: Date | null }> => ({
      closedAt,
    }));
    const baseInput = {
      apiKey,
      userId: 'user-1',
      positionId: 'position-1',
      botId: null,
      walletId: null,
      strategyId: null,
      symbol: 'BTCUSDT',
      positionSide: 'LONG' as const,
      managementMode: 'MANUAL_MANAGED' as const,
      openedAt: new Date('2026-06-06T12:00:00.000Z'),
      fallbackClosedAt,
    };

    await expect(
      resolveImportedClosedHistoryClosedAt({
        ...baseInput,
        deps: {
          fetchTradeHistoryForApiKeySymbol,
          hydrateClosedImportedPositionHistory,
        } as any,
      })
    ).resolves.toBe(closedAt);

    hydrateClosedImportedPositionHistory.mockResolvedValueOnce({ closedAt: null });
    await expect(
      resolveImportedClosedHistoryClosedAt({
        ...baseInput,
        deps: {
          fetchTradeHistoryForApiKeySymbol,
          hydrateClosedImportedPositionHistory,
        } as any,
      })
    ).resolves.toBe(fallbackClosedAt);

    await expect(
      resolveImportedClosedHistoryClosedAt({
        ...baseInput,
        deps: {} as any,
      })
    ).resolves.toBe(fallbackClosedAt);
  });
});

describe('position close attribution helpers', () => {
  it('normalizes runtime close reasons before resolving close attribution', () => {
    expect(resolveRuntimeCloseAttribution('  TAKE_PROFIT_SIGNAL  ')).toEqual({
      closeReason: 'TP',
      closeInitiator: 'BOT_APP',
    });
    expect(resolveRuntimeCloseAttribution('liquidation')).toEqual({
      closeReason: 'LIQUIDATION',
      closeInitiator: 'EXCHANGE',
    });
    expect(resolveRuntimeCloseAttribution(null)).toEqual({
      closeReason: 'SIGNAL_EXIT',
      closeInitiator: 'BOT_APP',
    });
  });

  it('preserves explicit order close attribution and detects liquidation execution types', () => {
    expect(
      resolveExchangeConfirmedCloseAttribution({
        orderCloseReason: 'SL',
        orderCloseInitiator: 'BOT_APP',
        executionType: 'manual',
      })
    ).toEqual({
      closeReason: 'SL',
      closeInitiator: 'BOT_APP',
    });
    expect(
      resolveExchangeConfirmedCloseAttribution({
        orderCloseReason: null,
        orderCloseInitiator: null,
        executionType: 'FORCED_LIQUIDATION',
      })
    ).toEqual({
      closeReason: 'LIQUIDATION',
      closeInitiator: 'EXCHANGE',
    });
  });
});
