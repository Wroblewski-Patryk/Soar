import { TradeMarket } from '@prisma/client';
import { prisma } from '../../prisma/client';
import {
  resolveImportedTradeHistoryLimit,
  resolveImportedTradeHistorySince,
} from './importedPositionHistoryHydrator.service';
import { ReconcileDeps, SyncedApiKey } from './livePositionReconciliation.types';
import { buildImportedExternalPositionMarketPrefix, normalizeSymbol } from './livePositionReconciliation.helpers';

export const listClosedImportedPositionsPendingHistoryForApiKey = (input: {
  userId: string;
  apiKeyId: string;
  marketType?: TradeMarket | null;
}) => prisma.position.findMany({
  where: {
    userId: input.userId, origin: 'EXCHANGE_SYNC', status: 'CLOSED',
    trades: { some: { feePending: true } },
    OR: [{ externalId: { startsWith: buildImportedExternalPositionMarketPrefix({
      apiKeyId: input.apiKeyId, marketType: input.marketType ?? 'FUTURES',
    }) } }, {
      externalId: { startsWith: `${input.apiKeyId}:` },
      NOT: [{ externalId: { startsWith: buildImportedExternalPositionMarketPrefix({ apiKeyId: input.apiKeyId, marketType: 'FUTURES' }) } },
        { externalId: { startsWith: buildImportedExternalPositionMarketPrefix({ apiKeyId: input.apiKeyId, marketType: 'SPOT' }) } }],
    }],
  },
  select: {
    id: true, externalId: true, missingSyncCount: true,
    symbol: true, side: true, openedAt: true,
    botId: true, walletId: true, strategyId: true, managementMode: true,
  },
});

export const backfillClosedImportedPositionsPendingHistory = async (input: {
  deps: ReconcileDeps;
  apiKey: SyncedApiKey;
}) => {
  const { deps, apiKey } = input;
  const closedPendingHistory = await deps.listClosedSyncedPositionsPendingHistoryForApiKey?.({
    userId: apiKey.userId, apiKeyId: apiKey.id, marketType: apiKey.marketType,
  }) ?? [];
  for (const closed of closedPendingHistory) {
    if (!closed.symbol || !closed.side || !closed.openedAt || !closed.managementMode) continue;
    await resolveImportedClosedHistoryClosedAt({
      deps, apiKey, userId: apiKey.userId, positionId: closed.id,
      botId: closed.botId ?? null, walletId: closed.walletId ?? null,
      strategyId: closed.strategyId ?? null,
      symbol: normalizeSymbol(closed.symbol),
      positionSide: closed.side, managementMode: closed.managementMode,
      openedAt: closed.openedAt, fallbackClosedAt: deps.now(),
    });
  }
};

export const hydrateReconciledImportedPositionHistory = async (input: {
  deps: ReconcileDeps;
  apiKey: SyncedApiKey;
  userId: string;
  positionId: string;
  botId: string | null;
  walletId: string | null;
  strategyId: string | null;
  symbol: string;
  positionSide: 'LONG' | 'SHORT';
  positionQuantity: number;
  managementMode: 'BOT_MANAGED' | 'MANUAL_MANAGED';
  openedAt: Date;
}) => {
  const { deps } = input;
  if (!deps.fetchTradeHistoryForApiKeySymbol || !deps.hydrateImportedPositionHistory) {
    return;
  }

  const tradeHistory = await deps.fetchTradeHistoryForApiKeySymbol({
    apiKey: input.apiKey,
    symbol: input.symbol,
    since: resolveImportedTradeHistorySince(input.openedAt),
    limit: resolveImportedTradeHistoryLimit(),
  });

  await deps.hydrateImportedPositionHistory({
    userId: input.userId,
    positionId: input.positionId,
    botId: input.botId,
    walletId: input.walletId,
    strategyId: input.strategyId,
    symbol: input.symbol,
    positionSide: input.positionSide,
    positionQuantity: input.positionQuantity,
    managementMode: input.managementMode,
    trades: tradeHistory,
  });
};

export const resolveImportedClosedHistoryClosedAt = async (input: {
  deps: ReconcileDeps;
  apiKey: SyncedApiKey;
  userId: string;
  positionId: string;
  botId: string | null;
  walletId: string | null;
  strategyId: string | null;
  symbol: string;
  positionSide: 'LONG' | 'SHORT';
  managementMode: 'BOT_MANAGED' | 'MANUAL_MANAGED';
  openedAt: Date;
  fallbackClosedAt: Date;
}) => {
  const { deps } = input;
  if (!deps.fetchTradeHistoryForApiKeySymbol || !deps.hydrateClosedImportedPositionHistory) {
    return input.fallbackClosedAt;
  }

  const tradeHistory = await deps.fetchTradeHistoryForApiKeySymbol({
    apiKey: input.apiKey,
    symbol: input.symbol,
    since: resolveImportedTradeHistorySince(input.openedAt),
    limit: resolveImportedTradeHistoryLimit(),
  });
  const closedHistory = await deps.hydrateClosedImportedPositionHistory({
    userId: input.userId,
    positionId: input.positionId,
    botId: input.botId,
    walletId: input.walletId,
    strategyId: input.strategyId,
    symbol: input.symbol,
    positionSide: input.positionSide,
    managementMode: input.managementMode,
    trades: tradeHistory,
  });

  return closedHistory.closedAt ?? input.fallbackClosedAt;
};
