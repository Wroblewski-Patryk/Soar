import { Exchange, Prisma, TradeMarket } from '@prisma/client';
import { prisma } from '../../prisma/client';
import { ListPositionsQuery, UpdatePositionManualParamsInput } from './positions.types';
import {
  fetchSupportedExchangeOpenOrdersRaw,
  fetchSupportedExchangePositionsRaw,
  fetchSupportedExchangeTradeHistoryRaw,
  assertExchangeAdapterOperationSupport,
  resolveExchangeAdapterSource,
  supportsExchangeAdapterOperation,
} from '../exchange/exchangeAdapterBoundary.service';
import { ExchangeExecutionCapabilityUnsupportedError } from '../exchange/exchangeExecutionCapabilityContract.service';
import {
  getExternalPositionOwnership,
  resolveExternalPositionOwnershipIndex,
} from '../bots/runtimeExternalPositionOwner.service';
import { resolveSystemRepairCloseAttribution } from './positionCloseAttribution';
import {
  ExchangeOpenOrderSnapshot,
  ExchangePositionSnapshot,
  ExchangeTradeHistorySnapshot,
} from './positions.exchangeSnapshot.types';
import {
  normalizeExchangeOpenOrder,
  normalizeExchangePosition,
  normalizeExchangeTradeHistoryItem,
} from './positions.exchangeSnapshotNormalization';
import { parseImportedExternalPositionId } from './livePositionReconciliation.helpers';

export type ExternalTakeoverStatus =
  | 'OWNED_AND_MANAGED'
  | 'UNOWNED'
  | 'AMBIGUOUS'
  | 'MANUAL_ONLY';

export type ExternalTakeoverStatusItem = {
  positionId: string;
  symbol: string;
  side: 'LONG' | 'SHORT';
  openedAt: string;
  externalId: string | null;
  apiKeyId: string | null;
  managementMode: 'BOT_MANAGED' | 'MANUAL_MANAGED';
  syncState: 'IN_SYNC' | 'DRIFT' | 'ORPHAN_LOCAL' | 'ORPHAN_EXCHANGE';
  continuityState:
    | 'CONFIRMED'
    | 'RECOVERING'
    | 'RECOVERED_UNACTIONABLE'
    | 'EXTERNAL_CLOSE_CONFIRMED'
    | 'REPAIR_ONLY_CLEANUP';
  botId: string | null;
  walletId: string | null;
  takeoverStatus: ExternalTakeoverStatus;
};

export type ExternalTakeoverStatusResponse = {
  total: number;
  summary: Record<ExternalTakeoverStatus, number>;
  items: ExternalTakeoverStatusItem[];
};

export type ExternalTakeoverRebindResponse = {
  scanned: number;
  rebound: number;
  ambiguous: number;
  unowned: number;
  skippedOwned: number;
  scannedByOrigin: {
    EXCHANGE_SYNC: number;
    BOT: number;
  };
  reboundByOrigin: {
    EXCHANGE_SYNC: number;
    BOT: number;
  };
};

export type LegacyOpenPositionRepairResponse = {
  scanned: number;
  reboundToCanonicalBot: number;
  closedDetachedOrphans: number;
  unresolved: number;
};

type ApiKeyRecordForSnapshot = {
  id: string;
  exchange: Exchange;
  apiKey: string;
  apiSecret: string;
};

type CanonicalBotRepairCandidate = {
  id: string;
  walletId: string | null;
  strategyId: string | null;
  mode: 'LIVE' | 'PAPER';
  liveOptIn: boolean;
  symbolGroup: {
    symbols: string[];
  } | null;
  botMarketGroups: Array<{
    symbolGroup: {
      symbols: string[];
    };
    strategyLinks: Array<{
      strategyId: string;
    }>;
  }>;
};

type BotPositionRepairMatch = {
  botId: string;
  walletId: string | null;
  strategyId: string | null;
};

export class ExchangeSnapshotError extends Error {
  constructor(
    public readonly code: 'API_KEY_NOT_FOUND' | 'API_KEY_AMBIGUOUS' | 'EXCHANGE_FETCH_FAILED',
    message: string
  ) {
    super(message);
    this.name = 'ExchangeSnapshotError';
  }
}

export class PositionManualUpdateError extends Error {
  constructor(
    public readonly code:
      | 'POSITION_NOT_OPEN'
      | 'TAKE_PROFIT_INVALID_FOR_SIDE'
      | 'STOP_LOSS_INVALID_FOR_SIDE'
      | 'STOP_RANGE_INVALID',
    message: string
  ) {
    super(message);
    this.name = 'PositionManualUpdateError';
  }
}

const validateDirectionalStops = (params: {
  side: 'LONG' | 'SHORT';
  entryPrice: number;
  takeProfit: number | null;
  stopLoss: number | null;
}) => {
  const { side, entryPrice, takeProfit, stopLoss } = params;

  if (side === 'LONG') {
    if (takeProfit != null && takeProfit <= entryPrice) {
      throw new PositionManualUpdateError(
        'TAKE_PROFIT_INVALID_FOR_SIDE',
        'Take profit must be above entry price for LONG position.'
      );
    }
    if (stopLoss != null && stopLoss >= entryPrice) {
      throw new PositionManualUpdateError(
        'STOP_LOSS_INVALID_FOR_SIDE',
        'Stop loss must be below entry price for LONG position.'
      );
    }
    if (takeProfit != null && stopLoss != null && stopLoss >= takeProfit) {
      throw new PositionManualUpdateError(
        'STOP_RANGE_INVALID',
        'Stop loss must be below take profit for LONG position.'
      );
    }
    return;
  }

  if (takeProfit != null && takeProfit >= entryPrice) {
    throw new PositionManualUpdateError(
      'TAKE_PROFIT_INVALID_FOR_SIDE',
      'Take profit must be below entry price for SHORT position.'
    );
  }
  if (stopLoss != null && stopLoss <= entryPrice) {
    throw new PositionManualUpdateError(
      'STOP_LOSS_INVALID_FOR_SIDE',
      'Stop loss must be above entry price for SHORT position.'
    );
  }
  if (takeProfit != null && stopLoss != null && stopLoss <= takeProfit) {
    throw new PositionManualUpdateError(
      'STOP_RANGE_INVALID',
      'Stop loss must be above take profit for SHORT position.'
    );
  }
};

const buildSnapshotForApiKey = async (
  apiKey: ApiKeyRecordForSnapshot,
  marketType: TradeMarket = 'FUTURES'
): Promise<ExchangePositionSnapshot> => {
  try {
    assertExchangeAdapterOperationSupport(apiKey.exchange, marketType, 'POSITIONS_SNAPSHOT');

    if (process.env.NODE_ENV === 'test') {
      if (process.env.POSITIONS_SNAPSHOT_FORCE_ERROR === '1') {
        throw new Error('exchange_snapshot_forced_error');
      }
      await prisma.apiKey.update({
        where: { id: apiKey.id },
        data: { lastUsed: new Date() },
      });
      return {
        source: apiKey.exchange,
        syncedAt: new Date().toISOString(),
        positions: [
          {
            symbol: 'BTC/USDT:USDT',
            side: 'long',
            contracts: 0.01,
            entryPrice: 50000,
            markPrice: 50100,
            unrealizedPnl: 1,
            leverage: 2,
            marginMode: 'isolated',
            liquidationPrice: 42000,
            timestamp: new Date().toISOString(),
          },
        ],
      };
    }
    const rawPositions = await fetchSupportedExchangePositionsRaw({
      exchange: apiKey.exchange,
      marketType,
      apiKey: apiKey.apiKey,
      apiSecret: apiKey.apiSecret,
    });
    await prisma.apiKey.update({
      where: { id: apiKey.id },
      data: { lastUsed: new Date() },
    });

    return {
      source: resolveExchangeAdapterSource(apiKey.exchange, marketType),
      syncedAt: new Date().toISOString(),
      positions: rawPositions.map(normalizeExchangePosition),
    };
  } catch (error) {
    if (error instanceof ExchangeExecutionCapabilityUnsupportedError) throw error;
    if (error instanceof ExchangeSnapshotError) throw error;
    throw new ExchangeSnapshotError('EXCHANGE_FETCH_FAILED', 'Unable to fetch exchange positions snapshot.');
  }
};

const buildOpenOrdersSnapshotForApiKey = async (
  apiKey: ApiKeyRecordForSnapshot,
  marketType: TradeMarket = 'FUTURES'
): Promise<ExchangeOpenOrderSnapshot> => {
  try {
    assertExchangeAdapterOperationSupport(apiKey.exchange, marketType, 'OPEN_ORDERS_SNAPSHOT');
    if (process.env.NODE_ENV === 'test') {
      await prisma.apiKey.update({
        where: { id: apiKey.id },
        data: { lastUsed: new Date() },
      });
      return {
        source: apiKey.exchange,
        syncedAt: new Date().toISOString(),
        orders: [
          {
            exchangeOrderId: 'test-open-order-1',
            symbol: 'BTC/USDT:USDT',
            side: 'buy',
            type: 'limit',
            status: 'open',
            amount: 0.01,
            filled: 0,
            remaining: 0.01,
            price: 50000,
            timestamp: new Date().toISOString(),
          },
        ],
      };
    }
    const rawOrders = await fetchSupportedExchangeOpenOrdersRaw({
      exchange: apiKey.exchange,
      marketType,
      apiKey: apiKey.apiKey,
      apiSecret: apiKey.apiSecret,
    });
    await prisma.apiKey.update({
      where: { id: apiKey.id },
      data: { lastUsed: new Date() },
    });

    return {
      source: resolveExchangeAdapterSource(apiKey.exchange, marketType),
      syncedAt: new Date().toISOString(),
      orders: rawOrders.map(normalizeExchangeOpenOrder),
    };
  } catch (error) {
    if (error instanceof ExchangeExecutionCapabilityUnsupportedError) throw error;
    throw new ExchangeSnapshotError('EXCHANGE_FETCH_FAILED', 'Unable to fetch exchange open orders snapshot.');
  }
};

export const listPositions = async (userId: string, query: ListPositionsQuery) => {
  const skip = (query.page - 1) * query.limit;
  const where: Prisma.PositionWhereInput = {
    userId,
    ...(query.status ? { status: query.status } : {}),
    ...(query.status === 'OPEN' ? { syncState: 'IN_SYNC' } : {}),
    ...(query.symbol ? { symbol: query.symbol } : {}),
  };

  return prisma.position.findMany({
    where,
    skip,
    take: query.limit,
    orderBy: { openedAt: 'desc' },
  });
};

export const getPosition = async (userId: string, id: string) => {
  return prisma.position.findFirst({
    where: { id, userId },
  });
};

export const updatePositionManagementMode = async (
  userId: string,
  id: string,
  managementMode: 'BOT_MANAGED' | 'MANUAL_MANAGED'
) => {
  const updated = await prisma.position.updateMany({
    where: {
      id,
      userId,
      status: 'OPEN',
      syncState: 'IN_SYNC',
    },
    data: { managementMode },
  });

  if (updated.count === 0) return null;

  return prisma.position.findFirst({
    where: { id, userId },
  });
};

export const updatePositionManualParams = async (
  userId: string,
  id: string,
  input: UpdatePositionManualParamsInput
) => {
  const existing = await prisma.position.findFirst({
    where: { id, userId },
    select: {
      id: true,
      botId: true,
      strategyId: true,
      status: true,
      syncState: true,
      side: true,
      entryPrice: true,
      takeProfit: true,
      stopLoss: true,
    },
  });
  if (!existing) return null;
  if (existing.status !== 'OPEN') {
    throw new PositionManualUpdateError(
      'POSITION_NOT_OPEN',
      'Only OPEN positions can be manually updated.'
    );
  }
  if (existing.syncState !== 'IN_SYNC') {
    throw new PositionManualUpdateError(
      'POSITION_NOT_OPEN',
      'Only OPEN positions can be manually updated.'
    );
  }

  const nextTakeProfit = input.takeProfit === undefined ? existing.takeProfit : input.takeProfit;
  const nextStopLoss = input.stopLoss === undefined ? existing.stopLoss : input.stopLoss;

  validateDirectionalStops({
    side: existing.side,
    entryPrice: existing.entryPrice,
    takeProfit: nextTakeProfit,
    stopLoss: nextStopLoss,
  });

  let updatedPosition: Awaited<ReturnType<typeof getPosition>> = null;
  const hasStopUpdate = input.takeProfit !== undefined || input.stopLoss !== undefined;
  if (hasStopUpdate) {
    const data: Prisma.PositionUpdateManyMutationInput = {};
    if (input.takeProfit !== undefined) data.takeProfit = input.takeProfit;
    if (input.stopLoss !== undefined) data.stopLoss = input.stopLoss;
    const updated = await prisma.position.updateMany({
      where: {
        id: existing.id,
        userId,
        status: 'OPEN',
        syncState: 'IN_SYNC',
      },
      data,
    });
    if (updated.count === 0) {
      throw new PositionManualUpdateError(
        'POSITION_NOT_OPEN',
        'Only OPEN positions can be manually updated.'
      );
    }
    updatedPosition = await getPosition(userId, existing.id);
  } else {
    updatedPosition = await getPosition(userId, existing.id);
  }

  const notes = input.notes ?? null;
  const lockRules = input.lockRules ?? false;
  try {
    await prisma.log.create({
      data: {
        userId,
        botId: existing.botId,
        strategyId: existing.strategyId,
        action: 'position.manual_update',
        level: 'INFO',
        source: 'positions.service',
        message: `Manual position update applied for ${existing.id}`,
        category: 'TRADING_DECISION',
        entityType: 'POSITION',
        entityId: existing.id,
        actor: 'user',
        metadata: {
          fields: {
            takeProfitChanged: input.takeProfit !== undefined,
            stopLossChanged: input.stopLoss !== undefined,
          },
          previous: {
            takeProfit: existing.takeProfit,
            stopLoss: existing.stopLoss,
          },
          next: {
            takeProfit: nextTakeProfit,
            stopLoss: nextStopLoss,
          },
          notes,
          lockRules,
        } as Prisma.InputJsonValue,
      },
    });
  } catch {
    // Audit log write should not block manual TP/SL updates.
  }

  return updatedPosition;
};

export const fetchExchangePositionsSnapshot = async (userId: string): Promise<ExchangePositionSnapshot> => {
  const eligibleApiKeys = await prisma.apiKey.findMany({
    where: {
      userId,
      exchange: {
        in: (['BINANCE', 'BYBIT', 'OKX', 'KRAKEN', 'COINBASE', 'GATEIO'] as const).filter((exchange) =>
          supportsExchangeAdapterOperation(exchange, 'FUTURES', 'POSITIONS_SNAPSHOT')
        ),
      },
    },
    orderBy: { updatedAt: 'desc' },
    select: {
      id: true,
      exchange: true,
      apiKey: true,
      apiSecret: true,
    },
  });

  if (eligibleApiKeys.length === 0) {
    throw new ExchangeSnapshotError('API_KEY_NOT_FOUND', 'No supported exchange API key configured.');
  }
  if (eligibleApiKeys.length > 1) {
    throw new ExchangeSnapshotError(
      'API_KEY_AMBIGUOUS',
      'Multiple supported exchange API keys configured. Specify apiKeyId to fetch a deterministic snapshot.'
    );
  }

  const [apiKey] = eligibleApiKeys;
  return buildSnapshotForApiKey(apiKey);
};

export const fetchExchangePositionsSnapshotByApiKeyId = async (
  userId: string,
  apiKeyId: string,
  input?: { marketType?: TradeMarket | null }
): Promise<ExchangePositionSnapshot> => {
  const apiKey = await prisma.apiKey.findFirst({
    where: {
      id: apiKeyId,
      userId,
    },
    select: {
      id: true,
      exchange: true,
      apiKey: true,
      apiSecret: true,
    },
  });

  if (!apiKey) {
    throw new ExchangeSnapshotError('API_KEY_NOT_FOUND', 'No supported exchange API key configured.');
  }

  return buildSnapshotForApiKey(apiKey, input?.marketType ?? 'FUTURES');
};

export const fetchExchangeOpenOrdersSnapshotByApiKeyId = async (
  userId: string,
  apiKeyId: string,
  input?: { marketType?: TradeMarket | null }
): Promise<ExchangeOpenOrderSnapshot> => {
  const apiKey = await prisma.apiKey.findFirst({
    where: {
      id: apiKeyId,
      userId,
    },
    select: {
      id: true,
      exchange: true,
      apiKey: true,
      apiSecret: true,
    },
  });

  if (!apiKey) {
    throw new ExchangeSnapshotError('API_KEY_NOT_FOUND', 'No supported exchange API key configured.');
  }

  return buildOpenOrdersSnapshotForApiKey(apiKey, input?.marketType ?? 'FUTURES');
};

export const fetchExchangeTradeHistorySnapshotByApiKeyId = async (
  userId: string,
  apiKeyId: string,
  input: {
    symbol: string;
    since?: Date;
    limit?: number;
    marketType?: TradeMarket | null;
  }
): Promise<ExchangeTradeHistorySnapshot> => {
  const apiKey = await prisma.apiKey.findFirst({
    where: {
      id: apiKeyId,
      userId,
    },
    select: {
      id: true,
      exchange: true,
      apiKey: true,
      apiSecret: true,
    },
  });

  if (!apiKey) {
    throw new ExchangeSnapshotError('API_KEY_NOT_FOUND', 'No supported exchange API key configured.');
  }

  try {
    assertExchangeAdapterOperationSupport(apiKey.exchange, input.marketType ?? 'FUTURES', 'TRADE_HISTORY_SNAPSHOT');
    if (process.env.NODE_ENV === 'test') {
      await prisma.apiKey.update({
        where: { id: apiKey.id },
        data: { lastUsed: new Date() },
      });

      return {
        source: apiKey.exchange,
        syncedAt: new Date().toISOString(),
        symbol: input.symbol,
        trades: [],
      };
    }

    const rawTrades = await fetchSupportedExchangeTradeHistoryRaw({
      exchange: apiKey.exchange,
      marketType: input.marketType ?? 'FUTURES',
      apiKey: apiKey.apiKey,
      apiSecret: apiKey.apiSecret,
      symbol: input.symbol,
      since: input.since?.getTime(),
      limit: input.limit,
    });

    await prisma.apiKey.update({
      where: { id: apiKey.id },
      data: { lastUsed: new Date() },
    });

    return {
      source: resolveExchangeAdapterSource(apiKey.exchange, input.marketType ?? 'FUTURES'),
      syncedAt: new Date().toISOString(),
      symbol: input.symbol,
      trades: rawTrades.map(normalizeExchangeTradeHistoryItem),
    };
  } catch (error) {
    if (error instanceof ExchangeExecutionCapabilityUnsupportedError) throw error;
    throw new ExchangeSnapshotError('EXCHANGE_FETCH_FAILED', 'Unable to fetch exchange trade history snapshot.');
  }
};

const normalizeRepairSymbol = (symbol: string) => symbol.trim().toUpperCase();

const getCanonicalRepairGroups = (bot: CanonicalBotRepairCandidate) => bot.botMarketGroups ?? [];

const resolveBotRepairMatch = (
  bot: CanonicalBotRepairCandidate,
  position: {
    symbol: string;
    walletId: string | null;
    strategyId: string | null;
  }
) => {
  if (bot.mode === 'LIVE' && !bot.liveOptIn) return null;

  const canonicalGroups = getCanonicalRepairGroups(bot);
  const hasCanonicalGroups = canonicalGroups.length > 0;
  const botSymbols = (
    hasCanonicalGroups
      ? canonicalGroups.flatMap((group) => group.symbolGroup.symbols)
      : bot.symbolGroup?.symbols ?? []
  ).map(normalizeRepairSymbol);
  if (!botSymbols.includes(normalizeRepairSymbol(position.symbol))) return null;

  const canonicalStrategyIds = hasCanonicalGroups
    ? canonicalGroups.flatMap((group) => group.strategyLinks.map((link) => link.strategyId))
    : bot.strategyId
      ? [bot.strategyId]
      : [];
  const uniqueStrategyIds = [...new Set(canonicalStrategyIds)];

  const walletMatches = Boolean(position.walletId && bot.walletId && position.walletId === bot.walletId);
  const strategyMatches = Boolean(
    position.strategyId &&
      uniqueStrategyIds.includes(position.strategyId) &&
      (!position.walletId || !bot.walletId || position.walletId === bot.walletId)
  );

  if (!walletMatches && !strategyMatches) return null;

  const repairStrategyId =
    position.strategyId && strategyMatches
      ? position.strategyId
      : uniqueStrategyIds.length === 1
        ? uniqueStrategyIds[0]
        : null;

  return {
    botId: bot.id,
    walletId: bot.walletId,
    strategyId: repairStrategyId,
  } satisfies BotPositionRepairMatch;
};

export const repairLegacyOpenPositions = async (
  userId: string,
  now: Date = new Date()
): Promise<LegacyOpenPositionRepairResponse> => {
  const [positions, activeBots] = await Promise.all([
    prisma.position.findMany({
      where: {
        userId,
        status: 'OPEN',
        botId: null,
        syncState: { not: 'ORPHAN_LOCAL' },
        origin: { in: ['BOT', 'USER'] },
      },
      orderBy: [{ openedAt: 'asc' }, { createdAt: 'asc' }, { id: 'asc' }],
      select: {
        id: true,
        symbol: true,
        origin: true,
        walletId: true,
        strategyId: true,
        externalId: true,
      },
    }),
    prisma.bot.findMany({
      where: {
        userId,
        isActive: true,
        walletId: { not: null },
      },
      select: {
        id: true,
        walletId: true,
        strategyId: true,
        mode: true,
        liveOptIn: true,
        symbolGroup: {
          select: {
            symbols: true,
          },
        },
        botMarketGroups: {
          where: {
            isEnabled: true,
            lifecycleStatus: 'ACTIVE',
          },
          orderBy: [{ executionOrder: 'asc' }, { createdAt: 'asc' }],
          select: {
            symbolGroup: {
              select: {
                symbols: true,
              },
            },
            strategyLinks: {
              where: {
                isEnabled: true,
              },
              orderBy: [{ priority: 'asc' }, { createdAt: 'asc' }],
              select: {
                strategyId: true,
              },
            },
          },
        },
      },
    }),
  ]);

  const result: LegacyOpenPositionRepairResponse = {
    scanned: positions.length,
    reboundToCanonicalBot: 0,
    closedDetachedOrphans: 0,
    unresolved: 0,
  };

  for (const position of positions) {
    const candidates = activeBots
      .map((bot) => resolveBotRepairMatch(bot, position))
      .filter((match): match is BotPositionRepairMatch => match != null);

    if (candidates.length === 1) {
      const owner = candidates[0];
      const update = await prisma.position.updateMany({
        where: {
          id: position.id,
          userId, botId: null,
          status: 'OPEN', syncState: { not: 'ORPHAN_LOCAL' },
        },
        data: {
          botId: owner.botId,
          walletId: owner.walletId,
          strategyId: owner.strategyId,
        },
      });

      if (update.count > 0) {
        result.reboundToCanonicalBot += 1;
        continue;
      }
    }

    const detachedOrphan = !position.walletId && !position.strategyId && !position.externalId;
    if (detachedOrphan) {
      const closeAttribution = resolveSystemRepairCloseAttribution();
      const update = await prisma.position.updateMany({
        where: {
          id: position.id,
          userId, botId: null,
          status: 'OPEN',
          syncState: { not: 'ORPHAN_LOCAL' },
        },
        data: {
          status: 'CLOSED',
          closedAt: now,
          syncState: 'ORPHAN_LOCAL',
          continuityState: 'REPAIR_ONLY_CLEANUP',
          unrealizedPnl: 0,
          closeReason: closeAttribution.closeReason,
          closeInitiator: closeAttribution.closeInitiator,
        },
      });

      if (update.count > 0) {
        result.closedDetachedOrphans += 1;
        continue;
      }
    }

    result.unresolved += 1;
  }

  return result;
};

export const rebindExternalTakeoverOwnership = async (
  userId: string
): Promise<ExternalTakeoverRebindResponse> => {
  const [positions, ownershipIndex] = await Promise.all([
    prisma.position.findMany({
      where: {
        userId,
        status: 'OPEN',
        managementMode: 'BOT_MANAGED',
        syncState: { not: 'ORPHAN_LOCAL' },
        origin: { in: ['EXCHANGE_SYNC', 'BOT'] },
      },
      select: {
        id: true,
        externalId: true,
        symbol: true,
        botId: true,
        origin: true,
      },
    }),
    resolveExternalPositionOwnershipIndex(userId, 'LIVE'),
  ]);

  const result: ExternalTakeoverRebindResponse = {
    scanned: positions.length,
    rebound: 0,
    ambiguous: 0,
    unowned: 0,
    skippedOwned: 0,
    scannedByOrigin: {
      EXCHANGE_SYNC: 0,
      BOT: 0,
    },
    reboundByOrigin: {
      EXCHANGE_SYNC: 0,
      BOT: 0,
    },
  };

  for (const position of positions) {
    if (position.origin === 'EXCHANGE_SYNC') {
      result.scannedByOrigin.EXCHANGE_SYNC += 1;
    } else if (position.origin === 'BOT') {
      result.scannedByOrigin.BOT += 1;
    }

    if (position.botId) {
      result.skippedOwned += 1;
      continue;
    }

    let owners: Array<{ botId: string; walletId: string }> = [];
    if (position.origin === 'EXCHANGE_SYNC') {
      const externalPositionId = parseImportedExternalPositionId(position.externalId);
      const ownership = getExternalPositionOwnership(ownershipIndex, {
        apiKeyId: externalPositionId?.apiKeyId ?? null,
        marketType: externalPositionId?.marketType,
        symbol: position.symbol,
      });
      if (ownership.status === 'OWNED') {
        owners = [{ botId: ownership.botId, walletId: ownership.walletId }];
      } else if (ownership.status === 'AMBIGUOUS') {
        result.ambiguous += 1;
        continue;
      } else {
        result.unowned += 1;
        continue;
      }
    } else if (position.origin === 'BOT') {
      // BOT-origin orphan positions require explicit canonical owner proof.
      // Without one, rebind must stay fail-closed instead of guessing from the
      // currently eligible LIVE bot set.
      owners = [];
    }

    if (owners.length === 0) {
      result.unowned += 1;
      continue;
    }
    if (owners.length > 1) {
      result.ambiguous += 1;
      continue;
    }

    const owner = owners[0];
    const update = await prisma.position.updateMany({
      where: {
        id: position.id, userId,
        botId: null,
        status: 'OPEN',
        syncState: { not: 'ORPHAN_LOCAL' },
      },
      data: {
        botId: owner.botId,
        walletId: owner.walletId,
        syncState: 'IN_SYNC',
        continuityState: 'CONFIRMED',
        missingSince: null,
        missingSyncCount: 0,
      },
    });

    if (update.count > 0) {
      result.rebound += 1;
      if (position.origin === 'EXCHANGE_SYNC') {
        result.reboundByOrigin.EXCHANGE_SYNC += 1;
      } else if (position.origin === 'BOT') {
        result.reboundByOrigin.BOT += 1;
      }
    }
  }

  return result;
};

export const listExternalTakeoverStatuses = async (
  userId: string
): Promise<ExternalTakeoverStatusResponse> => {
  const [positions, ownershipIndex] = await Promise.all([
    prisma.position.findMany({
      where: {
        userId,
        status: 'OPEN',
        syncState: { not: 'ORPHAN_LOCAL' },
        origin: 'EXCHANGE_SYNC',
      },
      orderBy: [{ openedAt: 'desc' }, { createdAt: 'desc' }],
      select: {
        id: true,
        symbol: true,
        side: true,
        openedAt: true,
        externalId: true,
        managementMode: true,
        syncState: true,
        continuityState: true,
        botId: true,
        walletId: true,
      },
    }),
    resolveExternalPositionOwnershipIndex(userId, 'LIVE'),
  ]);

  const items: ExternalTakeoverStatusItem[] = positions.map((position) => {
    const externalPositionId = parseImportedExternalPositionId(position.externalId);
    const apiKeyId = externalPositionId?.apiKeyId ?? null;
    const ownership = getExternalPositionOwnership(ownershipIndex, {
      apiKeyId,
      marketType: externalPositionId?.marketType,
      symbol: position.symbol,
    });

    let takeoverStatus: ExternalTakeoverStatus;
    if (position.managementMode === 'MANUAL_MANAGED' || ownership.status === 'MANUAL_ONLY') {
      takeoverStatus = 'MANUAL_ONLY';
    } else if (ownership.status === 'OWNED') {
      takeoverStatus = 'OWNED_AND_MANAGED';
    } else if (ownership.status === 'AMBIGUOUS') {
      takeoverStatus = 'AMBIGUOUS';
    } else {
      takeoverStatus = 'UNOWNED';
    }

    const effectiveBotId =
      takeoverStatus === 'OWNED_AND_MANAGED' && ownership.status === 'OWNED'
        ? ownership.botId
        : null;
    const effectiveWalletId =
      takeoverStatus === 'OWNED_AND_MANAGED' && ownership.status === 'OWNED'
        ? ownership.walletId
        : null;
    const effectiveManagementMode =
      takeoverStatus === 'OWNED_AND_MANAGED' ? position.managementMode : 'MANUAL_MANAGED';

    return {
      positionId: position.id,
      symbol: position.symbol,
      side: position.side,
      openedAt: position.openedAt.toISOString(),
      externalId: position.externalId,
      apiKeyId,
      managementMode: effectiveManagementMode,
      syncState: position.syncState,
      continuityState: position.continuityState,
      botId: effectiveBotId,
      walletId: effectiveWalletId,
      takeoverStatus,
    };
  });

  const summary: Record<ExternalTakeoverStatus, number> = {
    OWNED_AND_MANAGED: 0,
    UNOWNED: 0,
    AMBIGUOUS: 0,
    MANUAL_ONLY: 0,
  };
  for (const item of items) {
    summary[item.takeoverStatus] += 1;
  }

  return {
    total: items.length,
    summary,
    items,
  };
};
