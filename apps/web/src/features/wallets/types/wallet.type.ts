import type { ExchangeOption } from '@/features/exchanges/exchangeCapabilities';

export type WalletMode = 'PAPER' | 'LIVE';
export type WalletAllocationMode = 'PERCENT' | 'FIXED';

export type Wallet = {
  id: string;
  name: string;
  mode: WalletMode;
  exchange: ExchangeOption;
  marketType: 'FUTURES' | 'SPOT';
  baseCurrency: string;
  paperInitialBalance: number;
  paperResetAt?: string | null;
  liveAllocationMode?: WalletAllocationMode | null;
  liveAllocationValue?: number | null;
  apiKeyId?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type CreateWalletInput = {
  name: string;
  mode: WalletMode;
  exchange: ExchangeOption;
  marketType: 'FUTURES' | 'SPOT';
  baseCurrency: string;
  paperInitialBalance: number;
  liveAllocationMode?: WalletAllocationMode | null;
  liveAllocationValue?: number | null;
  apiKeyId?: string | null;
};

export type UpdateWalletInput = Partial<CreateWalletInput>;

export type WalletBalancePreviewInput = {
  exchange: ExchangeOption;
  marketType: 'FUTURES' | 'SPOT';
  baseCurrency: string;
  apiKeyId: string;
  liveAllocationMode?: WalletAllocationMode | null;
  liveAllocationValue?: number | null;
};

export type WalletBalancePreview = {
  exchange: ExchangeOption;
  marketType: 'FUTURES' | 'SPOT';
  baseCurrency: string;
  accountBalance: number;
  freeBalance: number | null;
  referenceBalance: number;
  allocationApplied: {
    mode: WalletAllocationMode;
    value: number;
  } | null;
  fetchedAt: string;
  source: 'BINANCE';
};

export type WalletLedgerCompleteness = 'COMPLETE' | 'PARTIAL' | 'UNAVAILABLE';
export type WalletCashflowDirection = 'IN' | 'OUT' | 'NEUTRAL';
export type WalletCashflowSource =
  | 'INITIAL_BALANCE'
  | 'DEPOSIT'
  | 'WITHDRAWAL'
  | 'TRANSFER_IN'
  | 'TRANSFER_OUT'
  | 'BOT_REALIZED_PNL'
  | 'BOT_OPEN_PNL_SNAPSHOT'
  | 'FEE'
  | 'FUNDING'
  | 'UNKNOWN_EXTERNAL_ADJUSTMENT';

export type WalletPerformanceSummary = {
  walletId: string;
  exchange: ExchangeOption;
  marketType: 'FUTURES' | 'SPOT';
  baseCurrency: string;
  completeness: WalletLedgerCompleteness;
  completenessReasons: string[];
  currentAccountBalance: number | null;
  currentFreeBalance: number | null;
  currentAllocatedBalance: number | null;
  contributedCapital: number;
  botRealizedPnl: number;
  botOpenPnl: number;
  feesFunding: number;
  botPnl: number;
  unclassifiedAdjustment: number;
  portfolioEquity: number;
  walletDeltaPercent: number | null;
  latestSnapshotAt: string | null;
};

export type WalletEquityTimelinePoint = {
  timestamp: string;
  portfolioEquity: number;
  accountBalance: number;
  freeBalance: number;
  contributedCapital: number;
  botRealizedPnl: number;
  botOpenPnl: number;
  feesFunding: number;
  botPnl: number;
  unclassifiedAdjustment: number;
};

export type WalletEquityTimelineMarker = {
  id: string;
  timestamp: string;
  source: WalletCashflowSource;
  direction: WalletCashflowDirection;
  amount: number;
  currency: string;
};

export type WalletEquityTimeline = {
  walletId: string;
  baseCurrency: string;
  bucket: 'raw' | 'hour' | 'day';
  completeness: WalletLedgerCompleteness;
  points: WalletEquityTimelinePoint[];
  markers: WalletEquityTimelineMarker[];
};

export type WalletCashflowEvent = {
  id: string;
  walletId: string;
  direction: WalletCashflowDirection;
  source: WalletCashflowSource;
  amount: number;
  currency: string;
  occurredAt: string;
  exchangeEventId?: string | null;
  balanceSnapshotId?: string | null;
  orderId?: string | null;
  tradeId?: string | null;
  positionId?: string | null;
};

export type WalletMetadataMarketType = 'FUTURES' | 'SPOT';

export type WalletMetadataMarketTypeEntry = {
  marketType: WalletMetadataMarketType;
  baseCurrency: string;
  baseCurrencies: string[];
  source: 'MARKET_CATALOG' | 'EXCHANGE_CAPABILITIES';
};

export type WalletMetadata = {
  exchange: ExchangeOption;
  marketTypes: WalletMetadataMarketType[];
  marketType: WalletMetadataMarketType;
  baseCurrency: string;
  baseCurrencies: string[];
  source: 'MARKET_CATALOG' | 'EXCHANGE_CAPABILITIES';
  byMarketType: Record<WalletMetadataMarketType, WalletMetadataMarketTypeEntry>;
};
