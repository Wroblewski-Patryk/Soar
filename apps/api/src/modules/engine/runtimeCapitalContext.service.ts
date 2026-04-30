import { BotMode, Exchange, PositionManagementMode, PositionStatus, TradeMarket, WalletAllocationMode } from '@prisma/client';
import { prisma } from '../../prisma/client';
import { normalizeBaseCurrency } from '../../lib/symbols';
import { resolveReferenceBalanceFromAllocation } from '../../lib/capitalAllocation';
import { fetchSupportedExchangeBalanceRaw } from '../exchange/exchangeAdapterBoundary.service';
import { recordLiveWalletBalanceSnapshot } from '../wallets/walletLedger.service';

const liveBalanceCacheTtlMs = Number.parseInt(process.env.RUNTIME_LIVE_BALANCE_CACHE_TTL_MS ?? '30000', 10);
const liveBalanceCache = new Map<string, { value: number; fetchedAt: number }>();

type RuntimeCapitalContextDeps = {
  getWalletContext: (input: {
    userId: string;
    walletId?: string | null;
  }) => Promise<{
    id: string;
    mode: BotMode;
    paperInitialBalance: number;
    paperResetAt: Date | null;
    liveAllocationMode: WalletAllocationMode | null;
    liveAllocationValue: number | null;
    baseCurrency: string;
    exchange: Exchange;
    apiKey: {
      apiKey: string;
      apiSecret: string;
      exchange: Exchange;
    } | null;
  } | null>;
  listOpenBotManagedPositions: (input: {
    userId: string;
    botId?: string | null;
    walletId?: string | null;
    mode?: BotMode | 'PAPER' | 'LIVE';
  }) => Promise<Array<{ entryPrice: number; quantity: number; leverage: number }>>;
  sumClosedBotManagedRealizedPnl: (input: {
    userId: string;
    botId?: string | null;
    walletId?: string | null;
    mode?: BotMode | 'PAPER' | 'LIVE';
    realizedSince?: Date | null;
  }) => Promise<number>;
  getLiveApiKeyContext: (input: {
    userId: string;
    botId?: string | null;
    walletId?: string | null;
    exchange: Exchange;
  }) => Promise<{ apiKey: string; apiSecret: string } | null>;
  fetchLiveBalance: (input: {
    exchange: Exchange;
    apiKey: string;
    apiSecret: string;
    marketType: TradeMarket;
    baseCurrency: string;
  }) => Promise<number | null>;
  recordLiveWalletBalanceSnapshot?: typeof recordLiveWalletBalanceSnapshot;
};

const extractBalanceForCurrency = (payload: unknown, baseCurrency: string) => {
  if (!payload || typeof payload !== 'object') return null;
  const normalizedBaseCurrency = normalizeBaseCurrency(baseCurrency);
  const withTotal = payload as { total?: Record<string, unknown>; free?: Record<string, unknown> };
  const total = Number(withTotal.total?.[normalizedBaseCurrency]);
  if (Number.isFinite(total) && total > 0) return total;
  const free = Number(withTotal.free?.[normalizedBaseCurrency]);
  if (Number.isFinite(free) && free > 0) return free;
  return null;
};

const defaultDeps: RuntimeCapitalContextDeps = {
  getWalletContext: async ({ userId, walletId }) => {
    if (!walletId) return null;
    const wallet = await prisma.wallet.findFirst({
      where: { id: walletId, userId },
      select: {
        id: true,
        mode: true,
        paperInitialBalance: true,
        paperResetAt: true,
        liveAllocationMode: true,
        liveAllocationValue: true,
        baseCurrency: true,
        exchange: true,
        apiKey: {
          select: {
            apiKey: true,
            apiSecret: true,
            exchange: true,
          },
        },
      },
    });
    if (!wallet) return null;
    return wallet;
  },
  listOpenBotManagedPositions: async ({ userId, botId, walletId, mode }) =>
    prisma.position.findMany({
      where: {
        userId,
        status: PositionStatus.OPEN,
        managementMode: PositionManagementMode.BOT_MANAGED,
        ...(walletId
          ? mode === 'PAPER' && botId
            ? { walletId, botId }
            : { walletId }
          : botId
            ? { botId }
            : { botId: null }),
      },
      select: {
        entryPrice: true,
        quantity: true,
        leverage: true,
      },
    }),
  sumClosedBotManagedRealizedPnl: async ({ userId, botId, walletId, mode, realizedSince }) => {
    const aggregate = await prisma.position.aggregate({
      where: {
        userId,
        status: { not: PositionStatus.OPEN },
        managementMode: PositionManagementMode.BOT_MANAGED,
        realizedPnl: { not: null },
        ...(realizedSince
          ? {
              OR: [
                {
                  closedAt: {
                    gte: realizedSince,
                  },
                },
                {
                  closedAt: null,
                  updatedAt: {
                    gte: realizedSince,
                  },
                },
              ],
            }
          : {}),
        ...(walletId
          ? mode === 'PAPER' && botId
            ? { walletId, botId }
            : { walletId }
          : botId
            ? { botId }
            : { botId: null }),
      },
      _sum: {
        realizedPnl: true,
      },
    });
    return Number(aggregate._sum.realizedPnl ?? 0);
  },
  getLiveApiKeyContext: async ({ userId, botId, walletId, exchange }) => {
    if (walletId) {
      const wallet = await prisma.wallet.findFirst({
        where: { id: walletId, userId },
        select: {
          apiKey: {
            select: {
              apiKey: true,
              apiSecret: true,
              exchange: true,
            },
          },
        },
      });
      if (!wallet?.apiKey || wallet.apiKey.exchange !== exchange) return null;
      return {
        apiKey: wallet.apiKey.apiKey,
        apiSecret: wallet.apiKey.apiSecret,
      };
    }

    return null;
  },
  fetchLiveBalance: async ({ exchange, apiKey, apiSecret, marketType, baseCurrency }) => {
    try {
      const balance = await fetchSupportedExchangeBalanceRaw({
        exchange,
        marketType,
        apiKey,
        apiSecret,
      });
      return extractBalanceForCurrency(balance, baseCurrency);
    } catch {
      return null;
    }
  },
  recordLiveWalletBalanceSnapshot,
};

export type RuntimeCapitalSource =
  | 'PAPER_INITIAL_BALANCE'
  | 'PAPER_RESET_CHECKPOINT'
  | 'LIVE_EXCHANGE_BALANCE';

export type RuntimeCapitalSnapshot = {
  referenceBalance: number;
  freeCash: number;
  reservedMargin: number;
  accountBalance: number | null;
  baseCurrency: string | null;
  capitalSource: RuntimeCapitalSource;
  allocationMode: WalletAllocationMode | null;
  allocationValue: number | null;
  paperResetAt: Date | null;
  realizedPnl: number | null;
};

export const resolvePaperRuntimeCapitalSnapshot = async (
  input: { userId: string; botId?: string | null; walletId?: string | null; paperStartBalance: number },
  deps: RuntimeCapitalContextDeps = defaultDeps
) : Promise<RuntimeCapitalSnapshot> => {
  const wallet = await deps.getWalletContext({
    userId: input.userId,
    walletId: input.walletId,
  });

  const startBalance = wallet
    ? Math.max(0, wallet.paperInitialBalance)
    : input.walletId
      ? 0
      : Math.max(0, input.paperStartBalance);
  const realizedSince = wallet?.paperResetAt ?? null;

  const [openPositions, realizedPnl] = await Promise.all([
    deps.listOpenBotManagedPositions({
      userId: input.userId,
      botId: input.botId,
      walletId: input.walletId,
      mode: 'PAPER',
    }),
    deps.sumClosedBotManagedRealizedPnl({
      userId: input.userId,
      botId: input.botId,
      walletId: input.walletId,
      mode: 'PAPER',
      realizedSince,
    }),
  ]);

  const reservedMargin = openPositions.reduce((sum, position) => {
    const leverage = Math.max(1, position.leverage || 1);
    return sum + (position.entryPrice * position.quantity) / leverage;
  }, 0);
  const referenceBalance = Math.max(0, startBalance + realizedPnl);
  const freeCash = Math.max(0, referenceBalance - reservedMargin);

  return {
    referenceBalance,
    freeCash,
    reservedMargin,
    accountBalance: null,
    baseCurrency: wallet?.baseCurrency ?? null,
    capitalSource: wallet?.paperResetAt ? 'PAPER_RESET_CHECKPOINT' : 'PAPER_INITIAL_BALANCE',
    allocationMode: null,
    allocationValue: null,
    paperResetAt: wallet?.paperResetAt ?? null,
    realizedPnl,
  };
};

const resolveLiveRuntimeCapitalSnapshot = async (
  input: {
    userId: string;
    botId?: string | null;
    walletId?: string | null;
    exchange: Exchange;
    marketType: TradeMarket;
    nowMs: number;
  },
  deps: RuntimeCapitalContextDeps = defaultDeps
) : Promise<RuntimeCapitalSnapshot> => {
  const wallet = await deps.getWalletContext({
    userId: input.userId,
    walletId: input.walletId,
  });
  const walletScoped = Boolean(input.walletId);
  const baseCurrency = normalizeBaseCurrency(wallet?.baseCurrency ?? 'USDT');

  const cacheKey = `${input.userId}:${input.walletId ?? input.botId ?? 'none'}:${input.exchange}:${input.marketType}:${baseCurrency}`;
  const cached = liveBalanceCache.get(cacheKey);
  if (cached && input.nowMs - cached.fetchedAt <= liveBalanceCacheTtlMs) {
    const [openPositions] = await Promise.all([
      deps.listOpenBotManagedPositions({
        userId: input.userId,
        botId: input.botId,
        walletId: input.walletId,
        mode: 'LIVE',
      }),
    ]);
    const reservedMargin = openPositions.reduce((sum, position) => {
      const leverage = Math.max(1, position.leverage || 1);
      return sum + (position.entryPrice * position.quantity) / leverage;
    }, 0);
    const freeCash = Math.max(0, cached.value - reservedMargin);
    return {
      referenceBalance: cached.value,
      freeCash,
      reservedMargin,
      accountBalance: cached.value,
      baseCurrency,
      capitalSource: 'LIVE_EXCHANGE_BALANCE',
      allocationMode: wallet?.liveAllocationMode ?? null,
      allocationValue: wallet?.liveAllocationValue ?? null,
      paperResetAt: null,
      realizedPnl: null,
    };
  }

  const apiKey = await deps.getLiveApiKeyContext({
    userId: input.userId,
    botId: input.botId,
    walletId: input.walletId,
    exchange: input.exchange,
  });

  let accountBalance = 0;
  if (apiKey) {
    const fetched = await deps.fetchLiveBalance({
      exchange: input.exchange,
      apiKey: apiKey.apiKey,
      apiSecret: apiKey.apiSecret,
      marketType: input.marketType,
      baseCurrency,
    });
    if (Number.isFinite(fetched) && (fetched as number) > 0) {
      accountBalance = fetched as number;
    }
  }

  const referenceBalance = wallet
    ? resolveReferenceBalanceFromAllocation({
        accountBalance,
        liveAllocationMode: wallet.liveAllocationMode,
        liveAllocationValue: wallet.liveAllocationValue,
      })
    : walletScoped
      ? 0
      : accountBalance;

  if (wallet && accountBalance > 0 && deps.recordLiveWalletBalanceSnapshot) {
    await deps.recordLiveWalletBalanceSnapshot({
      userId: input.userId,
      walletId: wallet.id,
      exchange: input.exchange,
      marketType: input.marketType,
      baseCurrency,
      accountBalance,
      freeBalance: accountBalance,
      allocationMode: wallet.liveAllocationMode,
      allocationValue: wallet.liveAllocationValue,
      fetchedAt: new Date(input.nowMs),
      metadata: {
        reason: 'RUNTIME_LIVE_BALANCE_REFRESH',
        botId: input.botId ?? null,
      },
    });
  }

  liveBalanceCache.set(cacheKey, { value: referenceBalance, fetchedAt: input.nowMs });

  const openPositions = await deps.listOpenBotManagedPositions({
    userId: input.userId,
    botId: input.botId,
    walletId: input.walletId,
    mode: 'LIVE',
  });
  const reservedMargin = openPositions.reduce((sum, position) => {
    const leverage = Math.max(1, position.leverage || 1);
    return sum + (position.entryPrice * position.quantity) / leverage;
  }, 0);
  const freeCash = Math.max(0, referenceBalance - reservedMargin);

  return {
    referenceBalance,
    freeCash,
    reservedMargin,
    accountBalance,
    baseCurrency,
    capitalSource: 'LIVE_EXCHANGE_BALANCE',
    allocationMode: wallet?.liveAllocationMode ?? null,
    allocationValue: wallet?.liveAllocationValue ?? null,
    paperResetAt: null,
    realizedPnl: null,
  };
};

export const resolveRuntimeCapitalSnapshot = async (
  input: {
    userId: string;
    botId?: string | null;
    walletId?: string | null;
    mode: BotMode | 'PAPER' | 'LIVE';
    exchange: Exchange;
    marketType: TradeMarket;
    paperStartBalance: number;
    nowMs: number;
  },
  deps: RuntimeCapitalContextDeps = defaultDeps
) : Promise<RuntimeCapitalSnapshot> => {
  if (input.mode === 'PAPER') {
    return resolvePaperRuntimeCapitalSnapshot(
      {
        userId: input.userId,
        botId: input.botId,
        walletId: input.walletId,
        paperStartBalance: input.paperStartBalance,
      },
      deps
    );
  }

  return resolveLiveRuntimeCapitalSnapshot(
    {
      userId: input.userId,
      botId: input.botId,
      walletId: input.walletId,
      exchange: input.exchange,
      marketType: input.marketType,
      nowMs: input.nowMs,
    },
    deps
  );
};

export const resolveRuntimeReferenceBalance = async (
  input: {
    userId: string;
    botId?: string | null;
    walletId?: string | null;
    mode: BotMode | 'PAPER' | 'LIVE';
    exchange: Exchange;
    marketType: TradeMarket;
    paperStartBalance: number;
    nowMs: number;
  },
  deps: RuntimeCapitalContextDeps = defaultDeps
) => {
  const snapshot = await resolveRuntimeCapitalSnapshot(input, deps);
  return snapshot.referenceBalance;
};

export const resolveRuntimeWalletFundsExhausted = async (
  input: {
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
  },
  deps: RuntimeCapitalContextDeps = defaultDeps
) => {
  const requiredMargin = (input.markPrice * Math.max(0, input.addedQuantity)) / Math.max(1, input.leverage);
  if (!Number.isFinite(requiredMargin) || requiredMargin <= 0) return false;

  if (input.mode === 'PAPER') {
    const snapshot = await resolveRuntimeCapitalSnapshot(input, deps);
    return requiredMargin > snapshot.freeCash;
  }

  const snapshot = await resolveRuntimeCapitalSnapshot(input, deps);

  return requiredMargin > snapshot.freeCash;
};

export const resolveRuntimeDcaFundsExhausted = async (
  input: {
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
  },
  deps: RuntimeCapitalContextDeps = defaultDeps
) =>
  resolveRuntimeWalletFundsExhausted(
    {
      userId: input.userId,
      botId: input.botId,
      walletId: input.walletId,
      mode: input.mode,
      exchange: input.exchange,
      marketType: input.marketType,
      paperStartBalance: input.paperStartBalance,
      markPrice: input.markPrice,
      addedQuantity: input.addedQuantity,
      leverage: input.leverage,
      nowMs: input.nowMs,
    },
    deps
  );
