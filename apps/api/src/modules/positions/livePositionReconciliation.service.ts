import { prisma } from '../../prisma/client';
import {
  fetchExchangeOpenOrdersSnapshotByApiKeyId,
  fetchExchangePositionsSnapshotByApiKeyId,
  fetchExchangeTradeHistorySnapshotByApiKeyId,
} from './positions.service';
import { getExternalPositionOwnership } from '../bots/runtimeExternalPositionOwner.service';
import {
  resolveExternalSyncMissingCloseAttribution,
} from './positionCloseAttribution';
import { runtimePositionStateStore } from '../engine/runtimePositionState.store';
import {
  buildPositionIdentity,
  extractSymbolFromExternalId,
  normalizeImportedLeverage,
  normalizeSymbol,
  resolveCanonicalEntryPrice,
  resolveRecoveredContinuityState,
  resolveRecoveredManagementMode,
  shouldTreatAsLifecycleReplacement,
  toOpenOrderStatus,
  toOrderSide,
  toOrderType,
  toPositionSide,
} from './livePositionReconciliation.helpers';
import {
  backfillClosedImportedPositionHistory,
  hydrateImportedPositionHistory,
} from './importedPositionHistoryHydrator.service';
import {
  hydrateReconciledImportedPositionHistory,
  resolveImportedClosedHistoryClosedAt,
} from './livePositionReconciliation.history';
import {
  CanonicalBotContinuityContext,
  LocalManagedLivePosition,
  ReconcileDeps,
  ReconcileFn,
  ReconciliationStatus,
} from './livePositionReconciliation.types';
import { runtimePositionAutomationService } from '../engine/runtimePositionAutomation.service';
import { resolveExistingCanonicalUpdateScope } from '../bots/botCanonicalUpdateScope.service';

const STALE_LOCAL_MANAGED_LIVE_POSITION_GRACE_MS = 10 * 60 * 1000;
const STALE_LOCAL_MANAGED_LIVE_POSITION_FALLBACK_GRACE_MS = 60 * 60 * 1000;
const EXTERNAL_POSITION_MISSING_CONFIRMATION_THRESHOLD = 2;
const buildOwnerIdentity = (botId: string, walletId: string) => `${botId}:${walletId}`;

export const resolveCanonicalBotContinuityContext = async (
  botId: string
): Promise<CanonicalBotContinuityContext | null> => {
  const bot = await prisma.bot.findUnique({
    where: { id: botId },
    select: {
      id: true,
      walletId: true,
      strategyId: true,
      symbolGroupId: true,
      botMarketGroups: {
        select: {
          symbolGroupId: true,
          lifecycleStatus: true,
          executionOrder: true,
          isEnabled: true,
          createdAt: true,
          strategyLinks: {
            select: {
              strategyId: true,
              isEnabled: true,
              priority: true,
              createdAt: true,
            },
            orderBy: [{ priority: 'asc' }, { createdAt: 'asc' }],
          },
        },
        orderBy: [{ executionOrder: 'asc' }, { createdAt: 'asc' }],
      },
    },
  });
  if (!bot) return null;

  const canonicalScope = resolveExistingCanonicalUpdateScope(bot);
  return {
    botId: bot.id,
    walletId: bot.walletId,
    strategyId: canonicalScope.primaryStrategyId,
  };
};

const defaultDeps: ReconcileDeps = {
  listSyncedApiKeys: async () => {
    return prisma.apiKey.findMany({
      where: {
        exchange: 'BINANCE',
        syncExternalPositions: true,
      },
      select: {
        id: true,
        userId: true,
        exchange: true,
      },
      orderBy: [{ userId: 'asc' }, { updatedAt: 'desc' }],
    });
  },
  resolveOwnershipIndexForUser: async ({ userId }) => {
    const { resolveExternalPositionOwnershipIndex } = await import(
      '../bots/runtimeExternalPositionOwner.service'
    );
    return resolveExternalPositionOwnershipIndex(userId, 'LIVE');
  },
  fetchPositionsForApiKey: async (apiKey) =>
    fetchExchangePositionsSnapshotByApiKeyId(apiKey.userId, apiKey.id),
  fetchOpenOrdersForApiKey: async (apiKey) => {
    const snapshot = await fetchExchangeOpenOrdersSnapshotByApiKeyId(apiKey.userId, apiKey.id);
    return snapshot.orders;
  },
  fetchTradeHistoryForApiKeySymbol: async ({ apiKey, symbol, since, limit }) => {
    const snapshot = await fetchExchangeTradeHistorySnapshotByApiKeyId(apiKey.userId, apiKey.id, {
      symbol,
      since,
      limit,
    });
    return snapshot.trades;
  },
  findOpenSyncedPositionByExternalId: async ({ userId, externalId }) =>
    prisma.position.findFirst({
      where: { userId, externalId, status: 'OPEN' },
      orderBy: { openedAt: 'desc' },
      select: {
        id: true,
        botId: true,
        walletId: true,
        strategyId: true,
        managementMode: true,
        continuityState: true,
        missingSyncCount: true,
        openedAt: true,
      },
    }),
  resolveCanonicalBotContinuityContext,
  updateSyncedPosition: async (positionId, input) => {
    await prisma.position.update({
      where: { id: positionId },
      data: {
        externalId: input.externalId,
        symbol: input.symbol,
        side: input.side,
        quantity: input.quantity,
        entryPrice: input.entryPrice,
        unrealizedPnl: input.unrealizedPnl,
        marginUsed: input.marginUsed,
        leverage: input.leverage,
        managementMode: input.managementMode,
        origin: 'EXCHANGE_SYNC',
        syncState: input.syncState,
        botId: input.botId,
        walletId: input.walletId,
        strategyId: input.strategyId,
        continuityState: input.continuityState,
        lastExchangeSeenAt: input.lastExchangeSeenAt,
        lastExchangeSyncAt: input.lastExchangeSyncAt,
        missingSince: input.missingSince,
        missingSyncCount: input.missingSyncCount,
      },
    });
  },
  createSyncedPosition: async (input) => {
    await prisma.position.create({
      data: {
        userId: input.userId,
        botId: input.botId,
        walletId: input.walletId,
        strategyId: input.strategyId,
        externalId: input.externalId,
        origin: 'EXCHANGE_SYNC',
        managementMode: input.managementMode,
        syncState: input.syncState,
        continuityState: input.continuityState,
        symbol: input.symbol,
        side: input.side,
        status: 'OPEN',
        entryPrice: input.entryPrice,
        quantity: input.quantity,
        leverage: input.leverage,
        unrealizedPnl: input.unrealizedPnl,
        marginUsed: input.marginUsed,
        openedAt: input.openedAt,
        lastExchangeSeenAt: input.lastExchangeSeenAt,
        lastExchangeSyncAt: input.lastExchangeSyncAt,
        missingSince: input.missingSince,
        missingSyncCount: input.missingSyncCount,
      },
    });
  },
  listOpenSyncedPositionsForApiKey: async ({ userId, apiKeyId }) =>
    prisma.position.findMany({
      where: {
        userId,
        origin: 'EXCHANGE_SYNC',
        status: 'OPEN',
        externalId: { startsWith: `${apiKeyId}:` },
      },
      select: {
        id: true,
        externalId: true,
        missingSyncCount: true,
        symbol: true,
        side: true,
        openedAt: true,
        botId: true,
        walletId: true,
        strategyId: true,
        managementMode: true,
      },
    }),
  markMissingSyncedPosition: async (positionId, input) => {
    await prisma.position.update({
      where: { id: positionId },
      data: {
        syncState: input.syncState,
        continuityState: input.continuityState,
        lastExchangeSyncAt: input.lastExchangeSyncAt,
        missingSince: input.missingSince,
        missingSyncCount: input.missingSyncCount,
      },
    });
  },
  closeStaleSyncedPosition: async (positionId, closedAt) => {
    const closeAttribution = resolveExternalSyncMissingCloseAttribution();
    await prisma.position.update({
      where: { id: positionId },
      data: {
        status: 'CLOSED',
        closedAt,
        syncState: 'ORPHAN_LOCAL',
        continuityState: 'EXTERNAL_CLOSE_CONFIRMED',
        unrealizedPnl: 0,
        closeReason: closeAttribution.closeReason,
        closeInitiator: closeAttribution.closeInitiator,
      },
    });
  },
  deleteRuntimePositionState: async (positionId) => {
    await runtimePositionStateStore.deletePositionRuntimeState(positionId);
  },
  hydrateImportedPositionHistory,
  hydrateClosedImportedPositionHistory: backfillClosedImportedPositionHistory,
  upsertSyncedOpenOrder: async (input) => {
    const existing = await prisma.order.findFirst({
      where: {
        userId: input.userId,
        exchangeOrderId: input.exchangeOrderId,
      },
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      select: {
        id: true,
        origin: true,
      },
    });

    if (existing && existing.origin !== 'EXCHANGE_SYNC') {
      return;
    }

    const data = {
      botId: input.botId,
      walletId: input.walletId,
      strategyId: null,
      positionId: null,
      origin: 'EXCHANGE_SYNC' as const,
      managementMode: 'BOT_MANAGED' as const,
      syncState: 'IN_SYNC' as const,
      symbol: input.symbol,
      side: input.side,
      type: input.type,
      status: input.status,
      quantity: input.quantity,
      filledQuantity: input.filledQuantity,
      price: input.price,
      exchangeOrderId: input.exchangeOrderId,
      submittedAt: input.submittedAt,
      canceledAt: null,
    };

    if (existing) {
      await prisma.order.update({
        where: { id: existing.id },
        data,
      });
      return;
    }

    await prisma.order.create({
      data: {
        userId: input.userId,
        ...data,
      },
    });
  },
  listOpenSyncedOrdersForOwner: async ({ userId, botId, walletId }) =>
    prisma.order.findMany({
      where: {
        userId,
        botId,
        walletId,
        origin: 'EXCHANGE_SYNC',
        managementMode: 'BOT_MANAGED',
        status: { in: ['OPEN', 'PARTIALLY_FILLED', 'PENDING'] },
      },
      select: {
        id: true,
        exchangeOrderId: true,
      },
    }),
  markStaleSyncedOrderUnresolved: async (orderId) => {
    await prisma.order.update({
      where: { id: orderId },
      data: {
        syncState: 'ORPHAN_LOCAL',
        canceledAt: null,
      },
    });
  },
  listOpenLocalManagedPositionsForOwner: async ({ userId, botId, walletId }) =>
    prisma.position.findMany({
      where: {
        userId,
        status: 'OPEN',
        managementMode: 'BOT_MANAGED',
        origin: { in: ['BOT', 'USER'] },
        OR: [
          {
            botId,
            walletId,
          },
          {
            botId: null,
            walletId,
          },
        ],
      },
      select: {
        id: true,
        botId: true,
        walletId: true,
        strategyId: true,
        symbol: true,
        side: true,
        openedAt: true,
      },
    }),
  closeStaleLocalManagedPosition: async (positionId, closedAt) => {
    const closeAttribution = resolveExternalSyncMissingCloseAttribution();
    await prisma.position.update({
      where: { id: positionId },
      data: {
        status: 'CLOSED',
        closedAt,
        syncState: 'ORPHAN_LOCAL',
        continuityState: 'REPAIR_ONLY_CLEANUP',
        unrealizedPnl: 0,
        closeReason: closeAttribution.closeReason,
        closeInitiator: closeAttribution.closeInitiator,
      },
    });
  },
  processOwnedSyncedPositionAutomation: async (input) => {
    await runtimePositionAutomationService.handleTickerEvent({
      type: 'ticker',
      exchange: input.exchange,
      marketType: input.marketType,
      symbol: input.symbol,
      eventTime: input.eventTime.getTime(),
      lastPrice: input.markPrice,
      markPrice: input.markPrice,
      priceChangePercent24h: 0,
    });
  },
  now: () => new Date(),
};

const shouldTriggerOwnedSyncedPositionAutomation = (input: {
  managementMode: 'BOT_MANAGED' | 'MANUAL_MANAGED';
  continuityState:
    | 'CONFIRMED'
    | 'RECOVERING'
    | 'RECOVERED_UNACTIONABLE'
    | 'EXTERNAL_CLOSE_CONFIRMED'
    | 'REPAIR_ONLY_CLEANUP';
  markPrice: number | null;
}) =>
  input.managementMode === 'BOT_MANAGED' &&
  input.continuityState === 'CONFIRMED' &&
  typeof input.markPrice === 'number' &&
  Number.isFinite(input.markPrice) &&
  input.markPrice > 0;

export const reconcileExternalPositionsFromExchange = async (
  deps: ReconcileDeps = defaultDeps
): Promise<{ openPositionsSeen: number }> => {
  const apiKeys = await deps.listSyncedApiKeys();
  let openPositionsSeen = 0;

  for (const apiKey of apiKeys) {
    try {
      const snapshot = await deps.fetchPositionsForApiKey(apiKey);
      const seenExternalIds = new Set<string>();
      const seenExternalSymbols = new Set<string>();
      const openedAtFallback = deps.now();
      const syncedAt = deps.now();
      const ownershipIndex = await deps.resolveOwnershipIndexForUser({
        userId: apiKey.userId,
        mode: 'LIVE',
      });
      const canonicalBotContextCache = new Map<string, CanonicalBotContinuityContext | null>();
      const resolveCanonicalBotContext = async (botId: string) => {
        if (!deps.resolveCanonicalBotContinuityContext) {
          return null;
        }
        if (canonicalBotContextCache.has(botId)) {
          return canonicalBotContextCache.get(botId) ?? null;
        }
        const context = await deps.resolveCanonicalBotContinuityContext(botId);
        canonicalBotContextCache.set(botId, context ?? null);
        return context ?? null;
      };
      const ownedOwnersByKey = new Map<string, { botId: string; walletId: string }>();
      for (const [ownershipKey, ownership] of ownershipIndex.entries()) {
        if (!ownershipKey.startsWith(`${apiKey.id}:`)) continue;
        if (ownership.status !== 'OWNED') continue;
        ownedOwnersByKey.set(buildOwnerIdentity(ownership.botId, ownership.walletId), {
          botId: ownership.botId,
          walletId: ownership.walletId,
        });
      }
      const seenExternalPositionKeysByOwner = new Map<string, Set<string>>();
      const seenExternalSymbolsByOwner = new Map<string, Set<string>>();
      const localManagedPositionsByOwner = new Map<string, LocalManagedLivePosition[]>();

      const loadLocalManagedPositionsForOwner = async (input: {
        userId: string;
        botId: string;
        walletId: string;
      }) => {
        if (!deps.listOpenLocalManagedPositionsForOwner) return [] as LocalManagedLivePosition[];
        const ownerKey = buildOwnerIdentity(input.botId, input.walletId);
        const cached = localManagedPositionsByOwner.get(ownerKey);
        if (cached) return cached;
        const positions = await deps.listOpenLocalManagedPositionsForOwner(input);
        localManagedPositionsByOwner.set(ownerKey, positions);
        return positions;
      };

      const evictLocalManagedPositionFromCache = (input: {
        botId: string;
        walletId: string;
        positionId: string;
      }) => {
        const ownerKey = buildOwnerIdentity(input.botId, input.walletId);
        const cached = localManagedPositionsByOwner.get(ownerKey);
        if (!cached) return;
        localManagedPositionsByOwner.set(
          ownerKey,
          cached.filter((position) => position.id !== input.positionId)
        );
      };

      const closePositionLifecycle = async (positionId: string, closedAt: Date, closePosition: (
        positionId: string,
        closedAt: Date
      ) => Promise<void>) => {
        await closePosition(positionId, closedAt);
        if (deps.deleteRuntimePositionState) {
          await deps.deleteRuntimePositionState(positionId);
        }
      };

      for (const position of snapshot.positions) {
        const size = Math.abs(position.contracts ?? 0);
        if (size <= 0) continue;
        const side = toPositionSide(position.side, position.contracts);
        if (!side) continue;

        const normalizedSymbol = normalizeSymbol(position.symbol);
        if (!normalizedSymbol) continue;

        openPositionsSeen += 1;
        const externalId = `${apiKey.id}:${normalizedSymbol}:${side}`;
        seenExternalIds.add(externalId);
        seenExternalSymbols.add(normalizedSymbol);
        const canonicalEntryPrice = resolveCanonicalEntryPrice(position);
        if (canonicalEntryPrice == null) {
          console.warn(
            `[LivePositionReconciliation] apiKey=${apiKey.id} user=${apiKey.userId} symbol=${normalizedSymbol} missing_entry_truth`
          );
          continue;
        }

        const existing = await deps.findOpenSyncedPositionByExternalId({
          userId: apiKey.userId,
          externalId,
        });
        const ownership = getExternalPositionOwnership(ownershipIndex, {
          apiKeyId: apiKey.id,
          symbol: normalizedSymbol,
        });
        const managedByBot = ownership.status === 'OWNED';
        const managementMode = resolveRecoveredManagementMode({
          ownershipStatus: ownership.status,
          existingBotId: existing?.botId,
        });
        const continuityState = resolveRecoveredContinuityState({
          ownershipStatus: ownership.status,
          existingBotId: existing?.botId,
        });
        const syncState = ownership.status === 'OWNED' || ownership.status === 'MANUAL_ONLY'
          ? 'IN_SYNC'
          : 'DRIFT';
        const canonicalOwnerContext =
          ownership.status === 'OWNED'
            ? await resolveCanonicalBotContext(ownership.botId)
            : existing?.botId
              ? await resolveCanonicalBotContext(existing.botId)
              : null;
        const restoredBotId = ownership.status === 'OWNED' ? ownership.botId : existing?.botId ?? null;
        const restoredWalletId =
          ownership.status === 'OWNED'
            ? (canonicalOwnerContext?.walletId ?? ownership.walletId)
            : existing?.walletId ?? canonicalOwnerContext?.walletId ?? null;
        const restoredStrategyId =
          ownership.status === 'OWNED'
            ? (canonicalOwnerContext?.strategyId ?? existing?.strategyId ?? null)
            : existing?.strategyId ?? canonicalOwnerContext?.strategyId ?? null;

        if (ownership.status !== 'OWNED' && ownership.status !== 'MANUAL_ONLY') {
          console.warn(
            `[LivePositionReconciliation] apiKey=${apiKey.id} user=${apiKey.userId} symbol=${normalizedSymbol} unresolved_takeover_owner=${ownership.status}`
          );
        }

        if (managedByBot) {
          const ownerKey = buildOwnerIdentity(ownership.botId, ownership.walletId);
          const seenKeys = seenExternalPositionKeysByOwner.get(ownerKey) ?? new Set<string>();
          seenKeys.add(buildPositionIdentity(normalizedSymbol, side));
          seenExternalPositionKeysByOwner.set(ownerKey, seenKeys);
          const seenSymbols = seenExternalSymbolsByOwner.get(ownerKey) ?? new Set<string>();
          seenSymbols.add(normalizedSymbol);
          seenExternalSymbolsByOwner.set(ownerKey, seenSymbols);
        }

        const snapshotOpenedAt = position.timestamp ? new Date(position.timestamp) : null;

        const existingLifecycleReplaced =
          existing &&
          shouldTreatAsLifecycleReplacement({
            candidateOpenedAt: existing.openedAt,
            snapshotOpenedAt,
          });
        if (existingLifecycleReplaced) {
          await closePositionLifecycle(existing.id, deps.now(), deps.closeStaleSyncedPosition);
        }

        const localManagedPosition =
          !existingLifecycleReplaced &&
          !existing &&
          ownership.status === 'OWNED' &&
          restoredBotId &&
          restoredWalletId
            ? (
                await loadLocalManagedPositionsForOwner({
                  userId: apiKey.userId,
                  botId: restoredBotId,
                  walletId: restoredWalletId,
                })
              ).find(
                (localPosition) =>
                  normalizeSymbol(localPosition.symbol) === normalizedSymbol &&
                  localPosition.side === side
              ) ?? null
            : null;

        const localLifecycleReplaced =
          localManagedPosition != null &&
          shouldTreatAsLifecycleReplacement({
            candidateOpenedAt: localManagedPosition.openedAt,
            snapshotOpenedAt,
          });
        if (localLifecycleReplaced && restoredBotId && restoredWalletId) {
          await closePositionLifecycle(localManagedPosition.id, deps.now(), deps.closeStaleLocalManagedPosition!);
          evictLocalManagedPositionFromCache({
            botId: restoredBotId,
            walletId: restoredWalletId,
            positionId: localManagedPosition.id,
          });
        }

        const reusablePosition =
          existingLifecycleReplaced || localLifecycleReplaced ? null : existing ?? localManagedPosition;

        if (reusablePosition) {
          await deps.updateSyncedPosition(reusablePosition.id, {
            externalId,
            symbol: normalizedSymbol,
            side,
            quantity: size,
            entryPrice: canonicalEntryPrice,
            unrealizedPnl: position.unrealizedPnl ?? null,
            marginUsed: position.marginUsed ?? null,
            leverage: normalizeImportedLeverage(position.leverage),
            managementMode,
            syncState,
            botId:
              ownership.status === 'OWNED'
                ? restoredBotId
                : managementMode === 'BOT_MANAGED'
                  ? restoredBotId
                  : null,
            walletId:
              ownership.status === 'OWNED'
                ? restoredWalletId
                : managementMode === 'BOT_MANAGED'
                  ? restoredWalletId
                  : null,
            strategyId:
              ownership.status === 'OWNED'
                ? restoredStrategyId
                : managementMode === 'BOT_MANAGED'
                  ? restoredStrategyId
                  : null,
            continuityState,
            lastExchangeSeenAt: syncedAt,
            lastExchangeSyncAt: syncedAt,
            missingSince: null,
            missingSyncCount: 0,
          });
          await hydrateReconciledImportedPositionHistory({
            deps,
            apiKey,
            userId: apiKey.userId,
            positionId: reusablePosition.id,
            botId: managementMode === 'BOT_MANAGED' ? restoredBotId : null,
            walletId: managementMode === 'BOT_MANAGED' ? restoredWalletId : null,
            strategyId: managementMode === 'BOT_MANAGED' ? restoredStrategyId : null,
            symbol: normalizedSymbol,
            positionSide: side,
            positionQuantity: size,
            managementMode,
            openedAt: reusablePosition.openedAt ?? openedAtFallback,
          });
          if (
            deps.processOwnedSyncedPositionAutomation &&
            shouldTriggerOwnedSyncedPositionAutomation({
              managementMode,
              continuityState,
              markPrice: position.markPrice ?? null,
            })
          ) {
            await deps.processOwnedSyncedPositionAutomation({
              exchange: 'BINANCE',
              marketType: 'FUTURES',
              symbol: normalizedSymbol,
              markPrice: position.markPrice as number,
              eventTime: syncedAt,
            });
          }
        } else {
          const openedAt = position.timestamp ? new Date(position.timestamp) : openedAtFallback;
          await deps.createSyncedPosition({
            userId: apiKey.userId,
            externalId,
            symbol: normalizedSymbol,
            side,
            quantity: size,
            entryPrice: canonicalEntryPrice,
            unrealizedPnl: position.unrealizedPnl ?? null,
            marginUsed: position.marginUsed ?? null,
            leverage: normalizeImportedLeverage(position.leverage),
            managementMode,
            syncState,
            botId: managementMode === 'BOT_MANAGED' ? restoredBotId : null,
            walletId: managementMode === 'BOT_MANAGED' ? restoredWalletId : null,
            strategyId: managementMode === 'BOT_MANAGED' ? restoredStrategyId : null,
            continuityState,
            openedAt,
            lastExchangeSeenAt: syncedAt,
            lastExchangeSyncAt: syncedAt,
            missingSince: null,
            missingSyncCount: 0,
          });

          const createdPosition = await deps.findOpenSyncedPositionByExternalId({
            userId: apiKey.userId,
            externalId,
          });
          if (createdPosition) {
            await hydrateReconciledImportedPositionHistory({
              deps,
              apiKey,
              userId: apiKey.userId,
              positionId: createdPosition.id,
              botId: managementMode === 'BOT_MANAGED' ? restoredBotId : null,
              walletId: managementMode === 'BOT_MANAGED' ? restoredWalletId : null,
              strategyId: managementMode === 'BOT_MANAGED' ? restoredStrategyId : null,
              symbol: normalizedSymbol,
              positionSide: side,
              positionQuantity: size,
              managementMode,
              openedAt,
            });
          }
          if (
            deps.processOwnedSyncedPositionAutomation &&
            shouldTriggerOwnedSyncedPositionAutomation({
              managementMode,
              continuityState,
              markPrice: position.markPrice ?? null,
            })
          ) {
            await deps.processOwnedSyncedPositionAutomation({
              exchange: 'BINANCE',
              marketType: 'FUTURES',
              symbol: normalizedSymbol,
              markPrice: position.markPrice as number,
              eventTime: syncedAt,
            });
          }
        }
      }

      const currentOpen = await deps.listOpenSyncedPositionsForApiKey({
        userId: apiKey.userId,
        apiKeyId: apiKey.id,
      });

      for (const stale of currentOpen) {
        if (stale.externalId && seenExternalIds.has(stale.externalId)) continue;
        if (seenExternalSymbols.has(extractSymbolFromExternalId(stale.externalId) ?? '')) {
          const lifecycleClosedAt =
            stale.symbol && stale.side && stale.openedAt && stale.managementMode
              ? await resolveImportedClosedHistoryClosedAt({
                  deps,
                  apiKey,
                  userId: apiKey.userId,
                  positionId: stale.id,
                  botId: stale.botId ?? null,
                  walletId: stale.walletId ?? null,
                  strategyId: stale.strategyId ?? null,
                  symbol: normalizeSymbol(stale.symbol),
                  positionSide: stale.side,
                  managementMode: stale.managementMode,
                  openedAt: stale.openedAt,
                  fallbackClosedAt: deps.now(),
                })
              : deps.now();
          await closePositionLifecycle(stale.id, lifecycleClosedAt, deps.closeStaleSyncedPosition);
          continue;
        }
        const nextMissingSyncCount = stale.missingSyncCount + 1;
        if (nextMissingSyncCount < EXTERNAL_POSITION_MISSING_CONFIRMATION_THRESHOLD) {
          await deps.markMissingSyncedPosition(stale.id, {
            syncState: 'DRIFT',
            continuityState: 'RECOVERING',
            missingSince: syncedAt,
            missingSyncCount: nextMissingSyncCount,
            lastExchangeSyncAt: syncedAt,
          });
          continue;
        }
        const lifecycleClosedAt =
          stale.symbol && stale.side && stale.openedAt && stale.managementMode
            ? await resolveImportedClosedHistoryClosedAt({
                deps,
                apiKey,
                userId: apiKey.userId,
                positionId: stale.id,
                botId: stale.botId ?? null,
                walletId: stale.walletId ?? null,
                strategyId: stale.strategyId ?? null,
                symbol: normalizeSymbol(stale.symbol),
                positionSide: stale.side,
                managementMode: stale.managementMode,
                openedAt: stale.openedAt,
                fallbackClosedAt: deps.now(),
              })
            : deps.now();
        await closePositionLifecycle(stale.id, lifecycleClosedAt, deps.closeStaleSyncedPosition);
      }

      const openOrderPositionKeysByOwner = new Map<string, Set<string>>();
      let openOrderSnapshotAvailable = false;

      if (
        deps.fetchOpenOrdersForApiKey &&
        deps.upsertSyncedOpenOrder &&
        deps.listOpenSyncedOrdersForOwner &&
        deps.markStaleSyncedOrderUnresolved
      ) {
        try {
          const openOrders = await deps.fetchOpenOrdersForApiKey(apiKey);
          const seenOpenExchangeOrderIdsByOwner = new Map<string, Set<string>>();
          openOrderSnapshotAvailable = true;

          for (const order of openOrders) {
            const exchangeOrderId = order.exchangeOrderId?.trim();
            if (!exchangeOrderId) continue;
            const side = toOrderSide(order.side);
            const status = toOpenOrderStatus(order.status);
            if (!side || !status) continue;

            const normalizedSymbol = normalizeSymbol(order.symbol);
            if (!normalizedSymbol) continue;

            const ownership = getExternalPositionOwnership(ownershipIndex, {
              apiKeyId: apiKey.id,
              symbol: normalizedSymbol,
            });
            if (ownership.status !== 'OWNED') continue;
            const ownerKey = buildOwnerIdentity(ownership.botId, ownership.walletId);
            const ownerOrderIds = seenOpenExchangeOrderIdsByOwner.get(ownerKey) ?? new Set<string>();
            ownerOrderIds.add(exchangeOrderId);
            seenOpenExchangeOrderIdsByOwner.set(ownerKey, ownerOrderIds);
            ownedOwnersByKey.set(ownerKey, {
              botId: ownership.botId,
              walletId: ownership.walletId,
            });

            const ownerOpenPositionKeys =
              openOrderPositionKeysByOwner.get(ownerKey) ?? new Set<string>();
            ownerOpenPositionKeys.add(buildPositionIdentity(normalizedSymbol, 'LONG'));
            ownerOpenPositionKeys.add(buildPositionIdentity(normalizedSymbol, 'SHORT'));
            openOrderPositionKeysByOwner.set(ownerKey, ownerOpenPositionKeys);

            const quantity = Number.isFinite(order.amount) ? Math.max(0, order.amount) : 0;
            if (quantity <= 0) continue;
            const filledQuantity = Number.isFinite(order.filled)
              ? Math.max(0, Math.min(quantity, order.filled))
              : 0;
            const submittedAt =
              typeof order.timestamp === 'string' && order.timestamp.length > 0
                ? new Date(order.timestamp)
                : null;

            await deps.upsertSyncedOpenOrder({
              userId: apiKey.userId,
              exchangeOrderId,
              botId: ownership.botId,
              walletId: ownership.walletId,
              symbol: normalizedSymbol,
              side,
              type: toOrderType(order.type),
              status,
              quantity,
              filledQuantity,
              price:
                typeof order.price === 'number' && Number.isFinite(order.price) ? order.price : null,
              submittedAt,
            });
          }

          for (const owner of ownedOwnersByKey.values()) {
            const ownerKey = buildOwnerIdentity(owner.botId, owner.walletId);
            const openSyncedOrders = await deps.listOpenSyncedOrdersForOwner({
              userId: apiKey.userId,
              botId: owner.botId,
              walletId: owner.walletId,
            });
            const seenOpenExchangeOrderIds = seenOpenExchangeOrderIdsByOwner.get(ownerKey) ?? new Set<string>();
            for (const openSyncedOrder of openSyncedOrders) {
              const exchangeOrderId = openSyncedOrder.exchangeOrderId?.trim();
              if (!exchangeOrderId || seenOpenExchangeOrderIds.has(exchangeOrderId)) continue;
              await deps.markStaleSyncedOrderUnresolved(openSyncedOrder.id);
            }
          }
        } catch (error) {
          const message = error instanceof Error ? error.message : 'unknown_error';
          console.warn(
            `[LivePositionReconciliation] apiKey=${apiKey.id} user=${apiKey.userId} open_orders_snapshot_failed=${message}`
          );
        }
      }

      if (deps.listOpenLocalManagedPositionsForOwner && deps.closeStaleLocalManagedPosition) {
        const staleGraceMs = openOrderSnapshotAvailable
          ? STALE_LOCAL_MANAGED_LIVE_POSITION_GRACE_MS
          : STALE_LOCAL_MANAGED_LIVE_POSITION_FALLBACK_GRACE_MS;
        const staleCutoffMs = deps.now().getTime() - staleGraceMs;

        for (const owner of ownedOwnersByKey.values()) {
          const ownerKey = buildOwnerIdentity(owner.botId, owner.walletId);
          const localManagedPositions = await deps.listOpenLocalManagedPositionsForOwner({
            userId: apiKey.userId,
            botId: owner.botId,
            walletId: owner.walletId,
          });
          const seenExternalPositionKeys = seenExternalPositionKeysByOwner.get(ownerKey) ?? new Set<string>();
          const seenExternalSymbolsForOwner = seenExternalSymbolsByOwner.get(ownerKey) ?? new Set<string>();
          const openOrderPositionKeys = openOrderPositionKeysByOwner.get(ownerKey) ?? new Set<string>();

          for (const localPosition of localManagedPositions) {
            const localIdentity = buildPositionIdentity(localPosition.symbol, localPosition.side);
            if (seenExternalPositionKeys.has(localIdentity)) continue;
            if (seenExternalSymbolsForOwner.has(normalizeSymbol(localPosition.symbol))) {
              await closePositionLifecycle(
                localPosition.id,
                deps.now(),
                deps.closeStaleLocalManagedPosition
              );
              evictLocalManagedPositionFromCache({
                botId: owner.botId,
                walletId: owner.walletId,
                positionId: localPosition.id,
              });
              continue;
            }
            if (openOrderSnapshotAvailable && openOrderPositionKeys.has(localIdentity)) continue;
            if (localPosition.openedAt.getTime() > staleCutoffMs) continue;
            await closePositionLifecycle(
              localPosition.id,
              deps.now(),
              deps.closeStaleLocalManagedPosition
            );
            evictLocalManagedPositionFromCache({
              botId: owner.botId,
              walletId: owner.walletId,
              positionId: localPosition.id,
            });
          }
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'unknown_error';
      console.error(
        `[LivePositionReconciliation] apiKey=${apiKey.id} user=${apiKey.userId} failed: ${errorMessage}`
      );
    }
  }

  return { openPositionsSeen };
};

const defaultReconcile: ReconcileFn = async () => reconcileExternalPositionsFromExchange();

export class LivePositionReconciliationLoop {
  private timer: NodeJS.Timeout | null = null;
  private status: ReconciliationStatus = {
    running: false,
    iterations: 0,
    lastRunAt: null,
    lastDurationMs: null,
    lastError: null,
    openPositionsSeen: 0,
  };

  constructor(
    private readonly reconcileFn: ReconcileFn = defaultReconcile,
    private readonly intervalMs: number = 15_000
  ) {}

  start() {
    if (this.timer) return;
    this.status.running = true;
    this.timer = setInterval(() => {
      void this.runOnce();
    }, this.intervalMs);
    void this.runOnce();
  }

  stop() {
    if (!this.timer) return;
    clearInterval(this.timer);
    this.timer = null;
    this.status.running = false;
  }

  getStatus() {
    return { ...this.status };
  }

  async runOnce() {
    const startedAt = Date.now();
    try {
      const result = await this.reconcileFn();
      this.status.iterations += 1;
      this.status.lastRunAt = new Date().toISOString();
      this.status.lastDurationMs = Date.now() - startedAt;
      this.status.lastError = null;
      this.status.openPositionsSeen = result.openPositionsSeen;
      process.env.POSITIONS_RECON_LAST_RUN_AT = this.status.lastRunAt;
    } catch (error) {
      this.status.lastRunAt = new Date().toISOString();
      this.status.lastDurationMs = Date.now() - startedAt;
      this.status.lastError = error instanceof Error ? error.message : 'unknown_error';
    }
  }
}

export const livePositionReconciliationLoop = new LivePositionReconciliationLoop();
