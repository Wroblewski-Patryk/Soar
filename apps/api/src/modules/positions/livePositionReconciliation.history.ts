import {
  resolveImportedTradeHistoryLimit,
  resolveImportedTradeHistorySince,
} from './importedPositionHistoryHydrator.service';
import { ReconcileDeps, SyncedApiKey } from './livePositionReconciliation.types';

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
