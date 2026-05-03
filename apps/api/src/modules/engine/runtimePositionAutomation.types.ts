import { BotMode, Exchange, Position, PositionSide, Prisma, TradeMarket } from '@prisma/client';

export type RuntimeManagedPosition = Pick<
  Position,
  | 'id'
  | 'userId'
  | 'botId'
  | 'walletId'
  | 'strategyId'
  | 'symbol'
  | 'side'
  | 'entryPrice'
  | 'quantity'
  | 'leverage'
  | 'stopLoss'
  | 'takeProfit'
  | 'managementMode'
  | 'origin'
  | 'continuityState'
  | 'status'
  | 'unrealizedPnl'
  | 'lastExchangeSyncAt'
> & {
  marginUsed?: number | null;
  bot:
    | {
        walletId: string | null;
        liveOptIn: boolean;
        wallet:
          | {
              mode: BotMode;
              exchange: Exchange;
              marketType: TradeMarket;
              baseCurrency: string;
              paperInitialBalance: number;
            }
          | null;
        symbolGroup:
          | {
              symbols?: string[] | null;
              marketUniverse: {
                exchange: Exchange;
                marketType: TradeMarket;
                baseCurrency: string;
                filterRules?: Prisma.JsonValue | null;
                whitelist?: string[] | null;
                blacklist?: string[] | null;
              } | null;
            }
          | null;
        botMarketGroups?: Array<{
          symbolGroup?: {
            symbols?: string[] | null;
            marketUniverse: {
              exchange: Exchange;
              marketType: TradeMarket;
              baseCurrency: string;
              filterRules?: Prisma.JsonValue | null;
              whitelist?: string[] | null;
              blacklist?: string[] | null;
            } | null;
          } | null;
          strategyLinks: Array<{
            strategyId: string;
          }>;
        }>;
      }
    | null;
};

export type RuntimePositionAutomationDeps = {
  listOpenPositionsBySymbol: (
    symbol: string
  ) => Promise<RuntimeManagedPosition[]>;
  getStrategyConfigById: (strategyId: string) => Promise<Record<string, unknown> | null>;
  getCanonicalPositionState: (positionId: string) => Promise<{
    quantity: number;
    averageEntryPrice: number;
  } | null>;
  getDurableDcaProgress: (input: {
    userId: string;
    positionId: string;
    botId?: string | null;
    walletId?: string | null;
    strategyId?: string | null;
    symbol: string;
    positionSide: PositionSide;
  }) => Promise<{
    currentAdds: number;
    lastDcaPrice?: number;
  } | null>;
  executeDca: (input: {
    userId: string;
    botId?: string | null;
    walletId?: string | null;
    strategyId?: string | null;
    positionId: string;
    symbol: string;
    positionSide: PositionSide;
    dcaLevelIndex: number;
    markPrice: number;
    mode: 'PAPER' | 'LIVE';
    addedQuantity: number;
    currentQuantity: number;
    currentEntryPrice: number;
  }) => Promise<{
    feePaid: number;
    executed: boolean;
    nextQuantity?: number;
    nextEntryPrice?: number;
  }>;
  closeByExitSignal: (input: {
    userId: string;
    botId?: string;
    walletId?: string | null;
    strategyId?: string | null;
    symbol: string;
    markPrice: number;
    mode: 'PAPER' | 'LIVE';
    quantity: number;
    reason?: 'take_profit' | 'trailing_take_profit' | 'stop_loss' | 'trailing_stop';
  }) => Promise<{ status: 'submitted' | 'closed' }>;
  resolveDcaFundsExhausted: (input: {
    userId: string;
    botId?: string | null;
    walletId?: string | null;
    mode: 'PAPER' | 'LIVE';
    exchange: Exchange;
    marketType: TradeMarket;
    paperStartBalance: number;
    markPrice: number;
    addedQuantity: number;
    leverage: number;
    nowMs: number;
  }) => Promise<boolean>;
  recordRuntimeEvent?: (params: {
    userId: string;
    botId: string;
    mode: 'PAPER' | 'LIVE';
    eventType:
      | 'SESSION_STARTED'
      | 'SESSION_STOPPED'
      | 'HEARTBEAT'
      | 'SIGNAL_DECISION'
      | 'PRETRADE_BLOCKED'
      | 'ORDER_SUBMITTED'
      | 'ORDER_FILLED'
      | 'POSITION_OPENED'
      | 'POSITION_CLOSED'
      | 'DCA_EXECUTED'
      | 'ERROR';
    level?: 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';
    symbol?: string;
    strategyId?: string;
    signalDirection?: 'LONG' | 'SHORT' | 'EXIT';
    message?: string;
    payload?: Record<string, unknown>;
    eventAt?: Date;
  }) => Promise<void>;
  upsertRuntimeSymbolStat?: (params: {
    userId: string;
    botId: string;
    mode?: 'PAPER' | 'LIVE';
    symbol: string;
    increments?: {
      totalSignals?: number;
      longEntries?: number;
      shortEntries?: number;
      exits?: number;
      dcaCount?: number;
      closedTrades?: number;
      winningTrades?: number;
      losingTrades?: number;
      realizedPnl?: number;
      grossProfit?: number;
      grossLoss?: number;
      feesPaid?: number;
    };
    lastSignalAt?: Date;
    lastPrice?: number;
    lastTradeAt?: Date;
    openPositionCount?: number;
    openPositionQty?: number;
  }) => Promise<void>;
  resolveLifecyclePrice?: (input: {
    exchange: Exchange;
    symbol: string;
    marketType: TradeMarket;
    fallbackPrice: number;
  }) => Promise<number | null> | number | null;
  nowMs: () => number;
};
