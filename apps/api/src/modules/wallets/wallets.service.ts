import { OrderStatus, PositionStatus, Prisma, WalletCashflowDirection, WalletCashflowSource } from '@prisma/client';
import { prisma } from '../../prisma/client';
import {
  assertExchangeCapability,
  getExchangeMarketTypeOptions,
  type ExchangeMarketType,
} from '../exchange/exchangeCapabilities';
import {
  CreateWalletDto,
  ListWalletsQueryDto,
  WalletMetadataQueryDto,
  UpdateWalletDto,
  WalletAnalyticsQueryDto,
  WalletBalancePreviewDto,
} from './wallets.types';
import { walletErrors } from './wallets.errors';
import { isAppErrorLike } from '../../lib/errors';
import { normalizeBaseCurrency } from '../../lib/symbols';
import { resolveReferenceBalanceFromAllocation } from '../../lib/capitalAllocation';
import { resolveExchangeMetadataByMarketType } from '../exchange/exchangeMetadataContract.service';
import {
  fetchSupportedExchangeBalanceRaw,
  resolveExchangeAdapterSource,
} from '../exchange/exchangeAdapterBoundary.service';
import { assertAuthenticatedExchangeReadSupport } from '../exchange/exchangeAuthenticatedReadContract.service';
import { recordLiveWalletBalanceSnapshot } from './walletLedger.service';
import { recordInitialBalanceCashflowForSnapshot } from './walletCashflowClassifier.service';
import { buildImportedExternalPositionMarketPrefix } from '../positions/livePositionReconciliation.helpers';

const normalizeWalletInput = (payload: CreateWalletDto | UpdateWalletDto) => {
  const mode = payload.mode;
  const normalized = {
    ...payload,
    baseCurrency: payload.baseCurrency ? normalizeBaseCurrency(payload.baseCurrency) : undefined,
  };

  if (mode === 'PAPER') {
    return {
      ...normalized,
      liveAllocationMode: null,
      liveAllocationValue: null,
      apiKeyId: null,
    };
  }

  return normalized;
};

const assertWalletModeExchangeCapability = (input: {
  mode: 'PAPER' | 'LIVE';
  exchange: 'BINANCE' | 'BYBIT' | 'OKX' | 'KRAKEN' | 'COINBASE';
}) => {
  if (input.mode === 'LIVE') {
    assertExchangeCapability(input.exchange, 'LIVE_EXECUTION');
    return;
  }
  assertExchangeCapability(input.exchange, 'PAPER_PRICING_FEED');
};

const assertWalletLiveModeConfig = (params: {
  mode: 'PAPER' | 'LIVE';
  liveAllocationMode?: 'PERCENT' | 'FIXED' | null;
  liveAllocationValue?: number | null;
}) => {
  if (params.mode !== 'LIVE') return;

  if (!params.liveAllocationMode) {
    throw walletErrors.modeInvalid({
      reason: 'LIVE_ALLOCATION_MODE_REQUIRED',
    });
  }

  if (
    typeof params.liveAllocationValue !== 'number' ||
    !Number.isFinite(params.liveAllocationValue) ||
    params.liveAllocationValue <= 0
  ) {
    throw walletErrors.modeInvalid({
      reason: 'LIVE_ALLOCATION_VALUE_REQUIRED',
    });
  }

  if (params.liveAllocationMode === 'PERCENT' && params.liveAllocationValue > 100) {
    throw walletErrors.modeInvalid({
      reason: 'LIVE_ALLOCATION_PERCENT_OUT_OF_RANGE',
    });
  }
};

const assertWalletLiveApiKeyCompatibility = async (params: {
  userId: string;
  mode: 'PAPER' | 'LIVE';
  exchange: 'BINANCE' | 'BYBIT' | 'OKX' | 'KRAKEN' | 'COINBASE';
  apiKeyId?: string | null;
}) => {
  if (params.mode !== 'LIVE') return;

  if (!params.apiKeyId) {
    throw walletErrors.liveApiKeyRequired();
  }

  const apiKey = await prisma.apiKey.findFirst({
    where: {
      id: params.apiKeyId,
      userId: params.userId,
    },
    select: {
      id: true,
      exchange: true,
    },
  });

  if (!apiKey) {
    throw walletErrors.liveApiKeyRequired();
  }

  if (apiKey.exchange !== params.exchange) {
    throw walletErrors.liveApiKeyExchangeMismatch();
  }
};

export const getWalletMetadata = async (query: WalletMetadataQueryDto) => {
  return resolveExchangeMetadataByMarketType({
    exchange: query.exchange,
    requestedMarketType: query.marketType,
  });
};

export const listWallets = async (userId: string, query: ListWalletsQueryDto = {}) =>
  prisma.wallet.findMany({
    where: {
      userId,
      ...(query.mode ? { mode: query.mode } : {}),
      ...(query.marketType ? { marketType: query.marketType } : {}),
      ...(query.exchange ? { exchange: query.exchange } : {}),
    },
    orderBy: [{ createdAt: 'desc' }],
  });

export const getWallet = async (userId: string, id: string) =>
  prisma.wallet.findFirst({
    where: {
      userId,
      id,
    },
  });

export const createWallet = async (userId: string, payload: CreateWalletDto) => {
  const normalized = normalizeWalletInput(payload) as CreateWalletDto;

  assertWalletModeExchangeCapability({
    mode: normalized.mode,
    exchange: normalized.exchange,
  });
  assertWalletLiveModeConfig({
    mode: normalized.mode,
    liveAllocationMode: normalized.liveAllocationMode,
    liveAllocationValue: normalized.liveAllocationValue,
  });
  await assertWalletLiveApiKeyCompatibility({
    userId,
    mode: normalized.mode,
    exchange: normalized.exchange,
    apiKeyId: normalized.apiKeyId,
  });

  const baseCurrency = normalizeBaseCurrency(normalized.baseCurrency);
  const liveApiKey =
    normalized.mode === 'LIVE' && normalized.apiKeyId
      ? await prisma.apiKey.findFirst({
          where: {
            id: normalized.apiKeyId,
            userId,
            exchange: normalized.exchange,
          },
          select: {
            apiKey: true,
            apiSecret: true,
          },
        })
      : null;
  const initialSnapshot =
    normalized.mode === 'LIVE' && liveApiKey
      ? await fetchAuthenticatedBalancePreview({
          exchange: normalized.exchange,
          apiKey: liveApiKey.apiKey,
          apiSecret: liveApiKey.apiSecret,
          marketType: normalized.marketType,
          baseCurrency,
        })
      : null;

  if (normalized.mode === 'LIVE' && initialSnapshot?.accountBalance == null) {
    throw walletErrors.previewFetchFailed();
  }

  return prisma.$transaction(async (tx) => {
    const wallet = await tx.wallet.create({
      data: {
        userId,
        name: normalized.name.trim(),
        mode: normalized.mode,
        exchange: normalized.exchange,
        marketType: normalized.marketType,
        baseCurrency,
        paperInitialBalance: normalized.paperInitialBalance,
        liveAllocationMode: normalized.liveAllocationMode ?? null,
        liveAllocationValue: normalized.liveAllocationValue ?? null,
        apiKeyId: normalized.apiKeyId ?? null,
        manageExternalPositions: false,
      },
    });

    if (normalized.mode === 'LIVE' && initialSnapshot?.accountBalance != null) {
      const snapshot = await recordLiveWalletBalanceSnapshot(
        {
          userId,
          walletId: wallet.id,
          exchange: wallet.exchange,
          marketType: wallet.marketType,
          baseCurrency: wallet.baseCurrency,
          accountBalance: initialSnapshot.accountBalance,
          freeBalance: initialSnapshot.freeBalance,
          allocationMode: wallet.liveAllocationMode,
          allocationValue: wallet.liveAllocationValue,
          metadata: {
            reason: 'LIVE_WALLET_CREATE',
          },
        },
        tx
      );
      await recordInitialBalanceCashflowForSnapshot(snapshot, tx);
    }

    return wallet;
  });
};

export const updateWallet = async (userId: string, id: string, payload: UpdateWalletDto) => {
  const existing = await getWallet(userId, id);
  if (!existing) return null;

  const activeBot = await prisma.bot.findFirst({
    where: {
      userId,
      walletId: existing.id,
      isActive: true,
    },
    select: {
      id: true,
      name: true,
    },
  });
  if (activeBot) {
    throw walletErrors.inUseByActiveBotCannotEdit({
      botId: activeBot.id,
      botName: activeBot.name,
    });
  }

  const nextMode = payload.mode ?? existing.mode;
  const nextExchange = payload.exchange ?? existing.exchange;
  const nextData = normalizeWalletInput({
    ...existing,
    ...payload,
    mode: nextMode,
    exchange: nextExchange,
  } as CreateWalletDto);

  assertWalletModeExchangeCapability({
    mode: nextMode,
    exchange: nextExchange,
  });
  assertWalletLiveModeConfig({
    mode: nextMode,
    liveAllocationMode: nextData.liveAllocationMode,
    liveAllocationValue: nextData.liveAllocationValue,
  });
  await assertWalletLiveApiKeyCompatibility({
    userId,
    mode: nextMode,
    exchange: nextExchange,
    apiKeyId: nextData.apiKeyId,
  });

  return prisma.wallet.update({
    where: { id: existing.id },
    data: {
      ...(payload.name !== undefined ? { name: payload.name.trim() } : {}),
      mode: nextMode,
      exchange: nextExchange,
      ...(payload.marketType !== undefined ? { marketType: payload.marketType } : {}),
      ...(nextData.baseCurrency ? { baseCurrency: normalizeBaseCurrency(nextData.baseCurrency) } : {}),
      ...(payload.paperInitialBalance !== undefined ? { paperInitialBalance: payload.paperInitialBalance } : {}),
      liveAllocationMode: nextData.liveAllocationMode ?? null,
      liveAllocationValue: nextData.liveAllocationValue ?? null,
      apiKeyId: nextData.apiKeyId ?? null,
      manageExternalPositions: false,
    },
  });
};

export const deleteWallet = async (userId: string, id: string) => {
  const existing = await getWallet(userId, id);
  if (!existing) return false;

  const linkedBotsCount = await prisma.bot.count({
    where: {
      userId,
      walletId: existing.id,
    },
  });
  if (linkedBotsCount > 0) {
    throw walletErrors.inUseCannotDelete();
  }

  try {
    await prisma.$transaction(async (tx) => {
      await Promise.all([
        tx.position.updateMany({
          where: {
            userId,
            walletId: existing.id,
          },
          data: {
            walletId: null,
          },
        }),
        tx.order.updateMany({
          where: {
            userId,
            walletId: existing.id,
          },
          data: {
            walletId: null,
          },
        }),
        tx.trade.updateMany({
          where: {
            userId,
            walletId: existing.id,
          },
          data: {
            walletId: null,
          },
        }),
      ]);

      await tx.wallet.delete({
        where: { id: existing.id },
      });
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      ['P2003', 'P2014', 'P2025', 'P2022'].includes(error.code)
    ) {
      throw walletErrors.inUseCannotDelete();
    }
    throw error;
  }

  return true;
};

const ACTIVE_OPEN_ORDER_STATUSES: OrderStatus[] = [
  OrderStatus.PENDING,
  OrderStatus.OPEN,
  OrderStatus.PARTIALLY_FILLED,
];

export const resetPaperWallet = async (userId: string, id: string) => {
  const existing = await getWallet(userId, id);
  if (!existing) return null;

  if (existing.mode !== 'PAPER') {
    throw walletErrors.paperResetPaperOnly({
      walletId: existing.id,
      mode: existing.mode,
    });
  }

  const now = new Date();

  return prisma.$transaction(async (tx) => {
    const [openPositionsCount, openOrdersCount] = await Promise.all([
      tx.position.count({
        where: {
          userId,
          walletId: existing.id,
          status: PositionStatus.OPEN,
          syncState: 'IN_SYNC',
        },
      }),
      tx.order.count({
        where: {
          userId,
          walletId: existing.id,
          status: { in: ACTIVE_OPEN_ORDER_STATUSES },
          syncState: 'IN_SYNC',
        },
      }),
    ]);

    if (openPositionsCount > 0) {
      throw walletErrors.paperResetOpenPositions({
        walletId: existing.id,
        openPositionsCount,
      });
    }

    if (openOrdersCount > 0) {
      throw walletErrors.paperResetOpenOrders({
        walletId: existing.id,
        openOrdersCount,
      });
    }

    return tx.wallet.update({
      where: { id: existing.id },
      data: {
        paperResetAt: now,
      },
    });
  });
};

export const getOwnedWalletForBotContext = async (params: {
  userId: string;
  walletId: string;
}) =>
  prisma.wallet.findFirst({
    where: {
      id: params.walletId,
      userId: params.userId,
    },
    select: {
      id: true,
      mode: true,
      exchange: true,
      marketType: true,
      baseCurrency: true,
      paperInitialBalance: true,
      liveAllocationMode: true,
      liveAllocationValue: true,
      apiKeyId: true,
    },
  });

const extractBalanceForCurrency = (payload: unknown, currency: string) => {
  if (!payload || typeof payload !== 'object') return null;
  const normalizedCurrency = normalizeBaseCurrency(currency);
  const parsed = payload as { total?: Record<string, unknown>; free?: Record<string, unknown> };

  const total = Number(parsed.total?.[normalizedCurrency]);
  const free = Number(parsed.free?.[normalizedCurrency]);

  const normalizedTotal = Number.isFinite(total) && total >= 0 ? total : null;
  const normalizedFree = Number.isFinite(free) && free >= 0 ? free : null;

  return {
    accountBalance: normalizedTotal ?? normalizedFree,
    freeBalance: normalizedFree ?? normalizedTotal,
  };
};

const fetchAuthenticatedBalancePreview = async (params: {
  exchange: 'BINANCE' | 'BYBIT' | 'OKX' | 'KRAKEN' | 'COINBASE';
  apiKey: string;
  apiSecret: string;
  marketType: 'FUTURES' | 'SPOT';
  baseCurrency: string;
}) => {
  if (process.env.NODE_ENV === 'test') {
    const account = Number.parseFloat(process.env.WALLET_PREVIEW_TEST_ACCOUNT_BALANCE ?? '1000');
    const free = Number.parseFloat(process.env.WALLET_PREVIEW_TEST_FREE_BALANCE ?? String(account));
    if (!Number.isFinite(account) || account <= 0) return null;
    const normalizedFree = Number.isFinite(free) && free >= 0 ? Math.min(free, account) : account;
    return {
      accountBalance: account,
      freeBalance: normalizedFree,
    };
  }

  const balancePayload = await fetchSupportedExchangeBalanceRaw({
    exchange: params.exchange,
    marketType: params.marketType,
    apiKey: params.apiKey,
    apiSecret: params.apiSecret,
  });
  return extractBalanceForCurrency(balancePayload, params.baseCurrency);
};

export const previewWalletBalance = async (userId: string, payload: WalletBalancePreviewDto) => {
  assertAuthenticatedExchangeReadSupport(payload.exchange, 'BALANCE_PREVIEW');

  const apiKey = await prisma.apiKey.findFirst({
    where: {
      id: payload.apiKeyId,
      userId,
      exchange: payload.exchange,
    },
    select: {
      id: true,
      apiKey: true,
      apiSecret: true,
    },
  });

  if (!apiKey) {
    throw walletErrors.previewApiKeyNotFound();
  }

  try {
    const snapshot = await fetchAuthenticatedBalancePreview({
      exchange: payload.exchange,
      apiKey: apiKey.apiKey,
      apiSecret: apiKey.apiSecret,
      marketType: payload.marketType,
      baseCurrency: normalizeBaseCurrency(payload.baseCurrency),
    });

    if (snapshot?.accountBalance == null) {
      throw walletErrors.previewFetchFailed();
    }

    const referenceBalance = resolveReferenceBalanceFromAllocation({
      accountBalance: snapshot.accountBalance,
      liveAllocationMode: payload.liveAllocationMode ?? null,
      liveAllocationValue: payload.liveAllocationValue ?? null,
    });

    await prisma.apiKey.update({
      where: { id: apiKey.id },
      data: { lastUsed: new Date() },
    });

    return {
      exchange: payload.exchange,
      marketType: payload.marketType,
      baseCurrency: normalizeBaseCurrency(payload.baseCurrency),
      accountBalance: snapshot.accountBalance,
      freeBalance: snapshot.freeBalance,
      referenceBalance,
      allocationApplied:
        payload.liveAllocationMode && typeof payload.liveAllocationValue === 'number'
          ? {
              mode: payload.liveAllocationMode,
              value: payload.liveAllocationValue,
            }
          : null,
      fetchedAt: new Date().toISOString(),
      source: resolveExchangeAdapterSource(payload.exchange),
    };
  } catch (error) {
    if (isAppErrorLike(error) && error.code === 'WALLET_PREVIEW_FETCH_FAILED') {
      throw error;
    }
    throw walletErrors.previewFetchFailed();
  }
};

const signedCashflowAmount = (event: {
  direction: WalletCashflowDirection;
  amount: number;
}) => {
  if (event.direction === WalletCashflowDirection.OUT) return -Math.abs(event.amount);
  if (event.direction === WalletCashflowDirection.IN) return Math.abs(event.amount);
  return event.amount;
};

const contributedCapitalSources = new Set<WalletCashflowSource>([
  WalletCashflowSource.INITIAL_BALANCE,
  WalletCashflowSource.DEPOSIT,
  WalletCashflowSource.WITHDRAWAL,
  WalletCashflowSource.TRANSFER_IN,
  WalletCashflowSource.TRANSFER_OUT,
]);

const botPnlSources = new Set<WalletCashflowSource>([WalletCashflowSource.BOT_REALIZED_PNL]);
const feesFundingSources = new Set<WalletCashflowSource>([
  WalletCashflowSource.FEE,
  WalletCashflowSource.FUNDING,
]);

const parseOptionalDate = (value?: string) => (value ? new Date(value) : undefined);

const buildCashflowWindowWhere = (
  walletId: string,
  query: WalletAnalyticsQueryDto = {}
): Prisma.WalletCashflowEventWhereInput => ({
  walletId,
  ...(query.source ? { source: query.source } : {}),
  ...(query.from || query.to
    ? {
        occurredAt: {
          ...(query.from ? { gte: parseOptionalDate(query.from) } : {}),
          ...(query.to ? { lte: parseOptionalDate(query.to) } : {}),
        },
      }
    : {}),
});

export const buildWalletOpenPnlWhere = (input: {
  userId: string;
  walletId: string;
  mode: 'PAPER' | 'LIVE';
  marketType: ExchangeMarketType;
  apiKeyId?: string | null;
}): Prisma.PositionWhereInput => ({
  userId: input.userId,
  status: PositionStatus.OPEN,
  syncState: 'IN_SYNC',
  unrealizedPnl: { not: null },
  OR: [
    { walletId: input.walletId },
    ...(input.mode === 'PAPER'
      ? [
          {
            bot: {
              walletId: input.walletId,
            },
          },
        ]
      : []),
    ...(input.mode === 'LIVE' && input.apiKeyId
      ? [
          {
            walletId: null,
            origin: 'EXCHANGE_SYNC' as const,
            externalId: {
              startsWith: buildImportedExternalPositionMarketPrefix({
                apiKeyId: input.apiKeyId,
                marketType: input.marketType,
              }),
            },
          },
        ]
      : []),
  ],
});

export const getWalletPerformanceSummary = async (
  userId: string,
  id: string,
  query: WalletAnalyticsQueryDto = {}
) => {
  const wallet = await getWallet(userId, id);
  if (!wallet) return null;

  const [latestSnapshot, cashflowEvents, openPnlAggregate] = await Promise.all([
    prisma.walletBalanceSnapshot.findFirst({
      where: { userId, walletId: id },
      orderBy: { fetchedAt: 'desc' },
    }),
    prisma.walletCashflowEvent.findMany({
      where: {
        userId,
        ...buildCashflowWindowWhere(id, query),
      },
      orderBy: { occurredAt: 'asc' },
    }),
    prisma.position.aggregate({
      where: buildWalletOpenPnlWhere({
        userId,
        walletId: id,
        mode: wallet.mode,
        marketType: wallet.marketType,
        apiKeyId: wallet.apiKeyId,
      }),
      _sum: {
        unrealizedPnl: true,
      },
    }),
  ]);

  const contributedCapital = cashflowEvents
    .filter((event) => contributedCapitalSources.has(event.source))
    .reduce((sum, event) => sum + signedCashflowAmount(event), 0);
  const botRealizedPnl = cashflowEvents
    .filter((event) => botPnlSources.has(event.source))
    .reduce((sum, event) => sum + signedCashflowAmount(event), 0);
  const feesFunding = cashflowEvents
    .filter((event) => feesFundingSources.has(event.source))
    .reduce((sum, event) => sum + signedCashflowAmount(event), 0);
  const unclassifiedAdjustment = cashflowEvents
    .filter((event) => event.source === WalletCashflowSource.UNKNOWN_EXTERNAL_ADJUSTMENT)
    .reduce((sum, event) => sum + signedCashflowAmount(event), 0);
  const botOpenPnl = Number(openPnlAggregate._sum.unrealizedPnl ?? 0);
  const botPnl = botRealizedPnl + botOpenPnl + feesFunding;
  const portfolioEquity = latestSnapshot?.allocatedBalance ?? 0;
  const walletDeltaPercent =
    contributedCapital > 0 ? (botPnl / contributedCapital) * 100 : null;
  const completeness =
    !latestSnapshot
      ? 'UNAVAILABLE'
      : unclassifiedAdjustment !== 0
        ? 'PARTIAL'
        : 'COMPLETE';

  return {
    walletId: wallet.id,
    exchange: wallet.exchange,
    marketType: wallet.marketType,
    baseCurrency: wallet.baseCurrency,
    completeness,
    completenessReasons:
      completeness === 'UNAVAILABLE'
        ? ['NO_BALANCE_SNAPSHOT']
        : completeness === 'PARTIAL'
          ? ['UNCLASSIFIED_ADJUSTMENT_PRESENT']
          : [],
    currentAccountBalance: latestSnapshot?.accountBalance ?? null,
    currentFreeBalance: latestSnapshot?.freeBalance ?? null,
    currentAllocatedBalance: latestSnapshot?.allocatedBalance ?? null,
    contributedCapital,
    botRealizedPnl,
    botOpenPnl,
    feesFunding,
    botPnl,
    unclassifiedAdjustment,
    portfolioEquity,
    walletDeltaPercent,
    latestSnapshotAt: latestSnapshot?.fetchedAt.toISOString() ?? null,
  };
};

export const getWalletCashflowEvents = async (
  userId: string,
  id: string,
  query: WalletAnalyticsQueryDto = {}
) => {
  const wallet = await getWallet(userId, id);
  if (!wallet) return null;

  return prisma.walletCashflowEvent.findMany({
    where: {
      userId,
      ...buildCashflowWindowWhere(id, query),
    },
    orderBy: { occurredAt: 'asc' },
  });
};

export const getWalletEquityTimeline = async (
  userId: string,
  id: string,
  query: WalletAnalyticsQueryDto = {}
) => {
  const wallet = await getWallet(userId, id);
  if (!wallet) return null;

  const [snapshots, latestSnapshot, events, openPnlAggregate] = await Promise.all([
    prisma.walletBalanceSnapshot.findMany({
      where: {
        userId,
        walletId: id,
        ...(query.from || query.to
          ? {
              fetchedAt: {
                ...(query.from ? { gte: parseOptionalDate(query.from) } : {}),
                ...(query.to ? { lte: parseOptionalDate(query.to) } : {}),
              },
            }
          : {}),
      },
      orderBy: { fetchedAt: 'asc' },
    }),
    prisma.walletBalanceSnapshot.findFirst({
      where: {
        userId,
        walletId: id,
      },
      orderBy: { fetchedAt: 'desc' },
      select: { id: true },
    }),
    prisma.walletCashflowEvent.findMany({
      where: {
        userId,
        ...buildCashflowWindowWhere(id, query),
      },
      orderBy: { occurredAt: 'asc' },
    }),
    prisma.position.aggregate({
      where: buildWalletOpenPnlWhere({
        userId,
        walletId: id,
        mode: wallet.mode,
        marketType: wallet.marketType,
        apiKeyId: wallet.apiKeyId,
      }),
      _sum: {
        unrealizedPnl: true,
      },
    }),
  ]);

  const currentOpenPnl = Number(openPnlAggregate._sum.unrealizedPnl ?? 0);
  const points = snapshots.map((snapshot) => {
    const eventsUntilPoint = events.filter((event) => event.occurredAt <= snapshot.fetchedAt);
    const contributedCapital = eventsUntilPoint
      .filter((event) => contributedCapitalSources.has(event.source))
      .reduce((sum, event) => sum + signedCashflowAmount(event), 0);
    const botRealizedPnl = eventsUntilPoint
      .filter((event) => botPnlSources.has(event.source))
      .reduce((sum, event) => sum + signedCashflowAmount(event), 0);
    const feesFunding = eventsUntilPoint
      .filter((event) => feesFundingSources.has(event.source))
      .reduce((sum, event) => sum + signedCashflowAmount(event), 0);
    const unclassifiedAdjustment = eventsUntilPoint
      .filter((event) => event.source === WalletCashflowSource.UNKNOWN_EXTERNAL_ADJUSTMENT)
      .reduce((sum, event) => sum + signedCashflowAmount(event), 0);
    const botOpenPnl = snapshot.id === latestSnapshot?.id ? currentOpenPnl : 0;

    return {
      timestamp: snapshot.fetchedAt.toISOString(),
      portfolioEquity: snapshot.allocatedBalance,
      accountBalance: snapshot.accountBalance,
      freeBalance: snapshot.freeBalance,
      contributedCapital,
      botRealizedPnl,
      botOpenPnl,
      feesFunding,
      botPnl: botRealizedPnl + botOpenPnl + feesFunding,
      unclassifiedAdjustment,
    };
  });

  return {
    walletId: wallet.id,
    baseCurrency: wallet.baseCurrency,
    bucket: query.bucket ?? 'raw',
    completeness: snapshots.length > 0 ? 'COMPLETE' : 'UNAVAILABLE',
    points,
    markers: events.map((event) => ({
      id: event.id,
      timestamp: event.occurredAt.toISOString(),
      source: event.source,
      direction: event.direction,
      amount: event.amount,
      currency: event.currency,
    })),
  };
};
