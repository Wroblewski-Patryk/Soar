import { Exchange, TradeMarket } from '@prisma/client';
import { ExternalPositionOwnershipIndex } from '../bots/runtimeExternalPositionOwner.service';
import { ExchangeTradeHistoryItem } from './positions.exchangeSnapshot.types';

export type ReconciliationStatus = {
  running: boolean;
  iterations: number;
  lastRunAt: string | null;
  lastDurationMs: number | null;
  lastError: string | null;
  openPositionsSeen: number;
  lastDiagnosticSummary: ReconciliationDiagnosticSummary;
  lastPositionDiagnostics: ReconciliationPositionDiagnostic[];
};

export type ReconciliationPositionDiagnosticOutcome =
  | 'CREATED'
  | 'UPDATED'
  | 'SKIPPED_ZERO_SIZE'
  | 'SKIPPED_UNRESOLVED_SIDE'
  | 'SKIPPED_UNRESOLVED_SYMBOL'
  | 'SKIPPED_MISSING_ENTRY_TRUTH';

export type ReconciliationPositionDiagnostic = {
  apiKeyId: string;
  userId: string;
  marketType: TradeMarket;
  symbol: string | null;
  side: 'LONG' | 'SHORT' | null;
  outcome: ReconciliationPositionDiagnosticOutcome;
  ownershipStatus: 'OWNED' | 'AMBIGUOUS' | 'MANUAL_ONLY' | 'UNOWNED' | null;
  managementMode: 'BOT_MANAGED' | 'MANUAL_MANAGED' | null;
  syncState: 'IN_SYNC' | 'DRIFT' | null;
  continuityState:
    | 'CONFIRMED'
    | 'RECOVERING'
    | 'RECOVERED_UNACTIONABLE'
    | 'EXTERNAL_CLOSE_CONFIRMED'
    | 'REPAIR_ONLY_CLEANUP'
    | null;
  botId: string | null;
  walletId: string | null;
  strategyId: string | null;
  botVisible: boolean;
  reason: string | null;
};

export type ReconciliationDiagnosticSummary = Record<ReconciliationPositionDiagnosticOutcome, number>;

export type ReconciliationResult = {
  openPositionsSeen: number;
  positionDiagnostics: ReconciliationPositionDiagnostic[];
  diagnosticSummary: ReconciliationDiagnosticSummary;
};

export type ReconcileFn = () => Promise<ReconciliationResult | { openPositionsSeen: number }>;

export type SyncedApiKey = {
  id: string;
  userId: string;
  exchange?: Exchange;
  marketType?: TradeMarket;
};

export type ExternalSnapshotPosition = {
  symbol: string;
  side: string | null;
  contracts: number;
  entryPrice: number | null;
  markPrice: number | null;
  unrealizedPnl: number | null;
  marginUsed?: number | null;
  leverage: number | null;
  timestamp: string | null;
};
export type ExternalSnapshotOpenOrder = {
  exchangeOrderId: string | null;
  symbol: string;
  side: string | null;
  type: string | null;
  status: string | null;
  amount: number;
  filled: number;
  remaining: number | null;
  price: number | null;
  timestamp: string | null;
};
export type ExternalTradeHistoryItem = ExchangeTradeHistoryItem;

export type LocalManagedLivePosition = {
  id: string;
  symbol: string;
  side: 'LONG' | 'SHORT';
  openedAt: Date;
  botId?: string | null;
  walletId?: string | null;
  strategyId?: string | null;
};

export type OpenSyncedPositionRecord = {
  id: string;
  botId?: string | null;
  walletId?: string | null;
  strategyId?: string | null;
  managementMode: 'BOT_MANAGED' | 'MANUAL_MANAGED';
  continuityState:
    | 'CONFIRMED'
    | 'RECOVERING'
    | 'RECOVERED_UNACTIONABLE'
    | 'EXTERNAL_CLOSE_CONFIRMED'
    | 'REPAIR_ONLY_CLEANUP';
  missingSyncCount: number;
  openedAt: Date;
};

export type StaleSyncedPositionRecord = {
  id: string;
  externalId: string | null;
  missingSyncCount: number;
  symbol?: string;
  side?: 'LONG' | 'SHORT';
  openedAt?: Date;
  botId?: string | null;
  walletId?: string | null;
  strategyId?: string | null;
  managementMode?: 'BOT_MANAGED' | 'MANUAL_MANAGED';
};

export type CanonicalBotContinuityContext = {
  botId: string;
  walletId: string | null;
  strategyId: string | null;
};

export type ReconcileDeps = {
  listSyncedApiKeys: () => Promise<SyncedApiKey[]>;
  resolveOwnershipIndexForUser: (input: {
    userId: string;
    mode: 'LIVE' | 'PAPER';
  }) => Promise<ExternalPositionOwnershipIndex>;
  fetchPositionsForApiKey: (
    apiKey: SyncedApiKey
  ) => Promise<{ positions: ExternalSnapshotPosition[] }>;
  fetchOpenOrdersForApiKey?: (
    apiKey: SyncedApiKey
  ) => Promise<ExternalSnapshotOpenOrder[]>;
  fetchTradeHistoryForApiKeySymbol?: (input: {
    apiKey: SyncedApiKey;
    symbol: string;
    since: Date;
    limit: number;
  }) => Promise<ExternalTradeHistoryItem[]>;
  findOpenSyncedPositionByExternalId: (input: {
    userId: string;
    externalId: string;
  }) => Promise<OpenSyncedPositionRecord | null>;
  resolveCanonicalBotContinuityContext?: (
    botId: string
  ) => Promise<CanonicalBotContinuityContext | null>;
  updateSyncedPosition: (
    positionId: string,
    input: {
      externalId: string;
      symbol: string;
      side: 'LONG' | 'SHORT';
      quantity: number;
      entryPrice: number;
      unrealizedPnl: number | null;
      marginUsed: number | null;
      leverage: number;
      managementMode: 'BOT_MANAGED' | 'MANUAL_MANAGED';
      syncState: 'IN_SYNC' | 'DRIFT';
      botId: string | null;
      walletId: string | null;
      strategyId: string | null;
      continuityState:
        | 'CONFIRMED'
        | 'RECOVERING'
        | 'RECOVERED_UNACTIONABLE'
        | 'EXTERNAL_CLOSE_CONFIRMED'
        | 'REPAIR_ONLY_CLEANUP';
      lastExchangeSeenAt: Date;
      lastExchangeSyncAt: Date;
      missingSince: Date | null;
      missingSyncCount: number;
    }
  ) => Promise<void>;
  createSyncedPosition: (input: {
    userId: string;
    externalId: string;
    symbol: string;
    side: 'LONG' | 'SHORT';
    quantity: number;
    entryPrice: number;
    unrealizedPnl: number | null;
    marginUsed: number | null;
    leverage: number;
    managementMode: 'BOT_MANAGED' | 'MANUAL_MANAGED';
    syncState: 'IN_SYNC' | 'DRIFT';
    botId: string | null;
    walletId: string | null;
    strategyId: string | null;
    continuityState:
      | 'CONFIRMED'
      | 'RECOVERING'
      | 'RECOVERED_UNACTIONABLE'
      | 'EXTERNAL_CLOSE_CONFIRMED'
      | 'REPAIR_ONLY_CLEANUP';
    openedAt: Date;
    lastExchangeSeenAt: Date;
    lastExchangeSyncAt: Date;
    missingSince: Date | null;
    missingSyncCount: number;
  }) => Promise<void>;
  listOpenSyncedPositionsForApiKey: (input: {
    userId: string;
    apiKeyId: string;
    marketType?: TradeMarket | null;
  }) => Promise<StaleSyncedPositionRecord[]>;
  markMissingSyncedPosition: (
    positionId: string,
    input: {
      syncState: 'DRIFT';
      continuityState: 'RECOVERING';
      missingSince: Date;
      missingSyncCount: number;
      lastExchangeSyncAt: Date;
    }
  ) => Promise<void>;
  closeStaleSyncedPosition: (positionId: string, closedAt: Date) => Promise<void>;
  hydrateImportedPositionHistory?: (input: {
    userId: string;
    positionId: string;
    botId: string | null;
    walletId: string | null;
    strategyId: string | null;
    symbol: string;
    positionSide: 'LONG' | 'SHORT';
    positionQuantity: number;
    managementMode: 'BOT_MANAGED' | 'MANUAL_MANAGED';
    trades: ExternalTradeHistoryItem[];
  }) => Promise<{ hydrated: boolean; openedAt: Date | null }>;
  hydrateClosedImportedPositionHistory?: (input: {
    userId: string;
    positionId: string;
    botId: string | null;
    walletId: string | null;
    strategyId: string | null;
    symbol: string;
    positionSide: 'LONG' | 'SHORT';
    managementMode: 'BOT_MANAGED' | 'MANUAL_MANAGED';
    trades: ExternalTradeHistoryItem[];
  }) => Promise<{ hydrated: boolean; openedAt: Date | null; closedAt: Date | null }>;
  deleteRuntimePositionState?: (positionId: string) => Promise<void>;
  upsertSyncedOpenOrder?: (input: {
    userId: string;
    exchangeOrderId: string;
    botId: string;
    walletId: string;
    symbol: string;
    side: 'BUY' | 'SELL';
    type: 'MARKET' | 'LIMIT' | 'STOP' | 'STOP_LIMIT' | 'TAKE_PROFIT' | 'TRAILING';
    status: 'OPEN' | 'PARTIALLY_FILLED';
    quantity: number;
    filledQuantity: number;
    price: number | null;
    submittedAt: Date | null;
  }) => Promise<void>;
  listOpenSyncedOrdersForOwner?: (input: {
    userId: string;
    botId: string;
    walletId: string;
  }) => Promise<Array<{ id: string; exchangeOrderId: string | null }>>;
  markStaleSyncedOrderUnresolved?: (orderId: string) => Promise<void>;
  listOpenLocalManagedPositionsForOwner?: (input: {
    userId: string;
    botId: string;
    walletId: string;
  }) => Promise<LocalManagedLivePosition[]>;
  closeStaleLocalManagedPosition?: (positionId: string, closedAt: Date) => Promise<void>;
  processOwnedSyncedPositionAutomation?: (input: {
    exchange: 'BINANCE';
    marketType: TradeMarket;
    symbol: string;
    markPrice: number;
    eventTime: Date;
  }) => Promise<void>;
  now: () => Date;
};
