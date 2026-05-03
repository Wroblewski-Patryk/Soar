import { Prisma } from '@prisma/client';
import { prisma } from '../../prisma/client';
import { orchestrateRuntimeSignal } from '../engine/executionOrchestrator.service';
import { resolveRuntimeLifecycleMarkPrice } from '../engine/runtimeLifecycleMarkPrice.service';
import { CloseBotRuntimePositionDto } from './bots.types';
import { getOwnedBotRuntimeSession } from './botOwnership.service';
import { botErrors } from './bots.errors';
import { fetchFallbackTickerPrices } from './runtimeMarketDataFallback.service';
import { createPublicExchangeConnector } from '../exchange/exchangeConnectorFactory.service';
import {
  getExternalPositionOwnership,
  parseApiKeyIdFromExternalPositionId,
  resolveExternalPositionOwnershipIndex,
} from './runtimeExternalPositionOwner.service';

const resolveSingleCanonicalStrategyId = (bot: {
  botMarketGroups?: Array<{
    strategyLinks: Array<{ strategyId: string }>;
  }>;
}) => {
  const strategyIds = [
    ...new Set(
      (bot.botMarketGroups ?? []).flatMap((group) =>
        group.strategyLinks.map((link) => link.strategyId)
      )
    ),
  ];
  return strategyIds.length === 1 ? strategyIds[0] : null;
};

export const closeBotRuntimeSessionPosition = async (
  userId: string,
  botId: string,
  sessionId: string,
  positionId: string,
  payload: CloseBotRuntimePositionDto
): Promise<Awaited<ReturnType<typeof orchestrateRuntimeSignal>> | null> => {
  const resolveClosedResult = async () => {
    const closedPosition = await prisma.position.findFirst({
      where: {
        id: positionId,
        userId,
        botId,
        status: 'CLOSED',
        managementMode: 'BOT_MANAGED',
      },
      select: {
        id: true,
        symbol: true,
        side: true,
      },
    });
    if (!closedPosition) return null;
    const latestCloseTrade = await prisma.trade.findFirst({
      where: {
        userId,
        botId,
        positionId: closedPosition.id,
        lifecycleAction: 'CLOSE',
      },
      orderBy: {
        executedAt: 'desc',
      },
      select: {
        orderId: true,
      },
    });
    const latestOrderIdFromTrade =
      typeof latestCloseTrade?.orderId === 'string' && latestCloseTrade.orderId.length > 0
        ? latestCloseTrade.orderId
        : null;
    const latestOrder = latestOrderIdFromTrade
      ? null
      : await prisma.order.findFirst({
          where: {
            userId,
            botId,
            symbol: closedPosition.symbol,
            side: closedPosition.side === 'LONG' ? 'SELL' : 'BUY',
          },
          orderBy: {
            createdAt: 'desc',
          },
          select: {
            id: true,
          },
        });
    const orderId = latestOrderIdFromTrade ?? latestOrder?.id ?? null;
    if (!orderId) return null;
    return {
      status: 'closed' as const,
      orderId,
      positionId: closedPosition.id,
    };
  };

  const session = await getOwnedBotRuntimeSession(userId, botId, sessionId);
  if (!session) return null;
  if (!payload.riskAck) {
    throw botErrors.positionCloseRiskAckRequired();
  }

  const botContext = await prisma.bot.findFirst({
    where: { id: botId, userId },
    select: {
      mode: true,
      exchange: true,
      marketType: true,
      walletId: true,
      wallet: {
        select: {
          apiKeyId: true,
        },
      },
      botMarketGroups: {
        where: {
          isEnabled: true,
          lifecycleStatus: 'ACTIVE',
        },
        select: {
          strategyLinks: {
            where: {
              isEnabled: true,
            },
            select: {
              strategyId: true,
            },
          },
        },
      },
    },
  });
  if (!botContext) return null;

  const position = await prisma.position.findFirst({
    where: {
      id: positionId,
      userId,
      status: 'OPEN',
      managementMode: 'BOT_MANAGED',
    },
    select: {
      id: true,
      botId: true,
      walletId: true,
      strategyId: true,
      symbol: true,
      quantity: true,
      entryPrice: true,
      origin: true,
      externalId: true,
      continuityState: true,
    },
  });
  if (!position) {
    const alreadyClosed = await resolveClosedResult();
    if (alreadyClosed) return alreadyClosed;
    return { status: 'ignored', reason: 'no_open_position' };
  }

  if (botContext.walletId && position.walletId && position.walletId !== botContext.walletId) {
    return { status: 'ignored', reason: 'no_open_position' };
  }

  const directlyOwnedByBot = position.botId === botId;
  let externallyOwnedByBot = false;
  if (!directlyOwnedByBot && !position.botId && position.origin === 'EXCHANGE_SYNC') {
    const ownershipIndex = await resolveExternalPositionOwnershipIndex(userId, botContext.mode);
    const ownership = getExternalPositionOwnership(ownershipIndex, {
      apiKeyId:
        parseApiKeyIdFromExternalPositionId(position.externalId) ??
        botContext.wallet?.apiKeyId ??
        null,
      symbol: position.symbol,
    });
    externallyOwnedByBot =
      ownership.status === 'OWNED' &&
      ownership.botId === botId &&
      (!botContext.walletId || ownership.walletId === botContext.walletId);
  }
  if (!directlyOwnedByBot && !externallyOwnedByBot) {
    return { status: 'ignored', reason: 'no_open_position' };
  }
  if (position.continuityState !== 'CONFIRMED') {
    return { status: 'ignored', reason: 'no_open_position' };
  }

  const shouldClaimOwnership = !position.botId && externallyOwnedByBot;
  const shouldBackfillWallet = !position.walletId && Boolean(botContext.walletId);
  const effectiveStrategyId =
    position.strategyId ?? resolveSingleCanonicalStrategyId(botContext);
  const shouldBackfillStrategy = !position.strategyId && Boolean(effectiveStrategyId);
  if (shouldClaimOwnership || shouldBackfillWallet || shouldBackfillStrategy) {
    const update: Prisma.PositionUpdateManyMutationInput = {
      syncState: 'IN_SYNC',
      ...(shouldClaimOwnership ? { botId } : {}),
      ...(shouldBackfillWallet && botContext.walletId ? { walletId: botContext.walletId } : {}),
      ...(shouldBackfillStrategy && effectiveStrategyId ? { strategyId: effectiveStrategyId } : {}),
    };
    const claimed = await prisma.position.updateMany({
      where: {
        id: position.id,
        userId,
        status: 'OPEN',
        managementMode: 'BOT_MANAGED',
      },
      data: update,
    });
    if (claimed.count === 0) {
      return { status: 'ignored', reason: 'no_open_position' };
    }
  }

  const botExchange = botContext.exchange ?? 'BINANCE';
  const botMarketType = botContext.marketType ?? 'FUTURES';
  let closeReferencePrice =
    resolveRuntimeLifecycleMarkPrice({
      exchange: botExchange,
      marketType: botMarketType,
      symbol: position.symbol,
    }) ?? null;
  if (!(typeof closeReferencePrice === 'number' && Number.isFinite(closeReferencePrice) && closeReferencePrice > 0)) {
    const fallbackPrices = await fetchFallbackTickerPrices({
      marketType: botMarketType === 'SPOT' ? 'SPOT' : 'FUTURES',
      symbols: [position.symbol],
    });
    const fallbackPrice = fallbackPrices.get(position.symbol);
    if (typeof fallbackPrice === 'number' && Number.isFinite(fallbackPrice) && fallbackPrice > 0) {
      closeReferencePrice = fallbackPrice;
    }
  }
  if (!(typeof closeReferencePrice === 'number' && Number.isFinite(closeReferencePrice) && closeReferencePrice > 0)) {
    const connector = createPublicExchangeConnector({
      exchange: botExchange,
      marketType: botMarketType,
    });
    try {
      const connectorPrice = await connector.fetchMarkPrice(position.symbol);
      if (typeof connectorPrice === 'number' && Number.isFinite(connectorPrice) && connectorPrice > 0) {
        closeReferencePrice = connectorPrice;
      }
    } catch {
      // Keep fail-closed behavior; later fallback logic decides whether we may continue.
    } finally {
      await connector.disconnect().catch(() => undefined);
    }
  }
  closeReferencePrice =
    closeReferencePrice ??
    (botContext.mode === 'LIVE' && Number.isFinite(position.entryPrice) && position.entryPrice > 0
      ? position.entryPrice
      : null);
  if (!closeReferencePrice) {
    throw botErrors.positionClosePriceUnavailable();
  }

  const closeResult = await orchestrateRuntimeSignal({
    userId,
    botId,
    walletId: botContext.walletId ?? undefined,
    runtimeSessionId: session.id,
    strategyId: effectiveStrategyId ?? undefined,
    symbol: position.symbol,
    direction: 'EXIT',
    quantity: Math.max(0, position.quantity),
    markPrice: closeReferencePrice,
    mode: botContext.mode,
    reason: 'manual_dashboard_close_position',
  });
  if (closeResult.status === 'closed') {
    return closeResult;
  }
  if (
    closeResult.status === 'ignored' &&
    (closeResult.reason === 'no_open_position' || closeResult.reason === 'dedupe_reused')
  ) {
    const alreadyClosed = await resolveClosedResult();
    if (alreadyClosed) return alreadyClosed;
  }
  return closeResult;
};
