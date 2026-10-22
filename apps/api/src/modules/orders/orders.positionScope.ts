import { Prisma, PrismaClient } from '@prisma/client';
import { orderErrors } from './orders.errors';

export const resolveVerifiedGateLinkedPositionUnit = async (params: {
  db: PrismaClient | Prisma.TransactionClient;
  userId: string;
  positionId: string;
  botId: string | null;
  walletId: string | null;
  mode: 'LIVE' | 'PAPER';
  symbol: string;
  side: 'BUY' | 'SELL';
  quantity: number;
  reduceOnly: boolean;
  allowClosedReplay?: boolean;
}) => {
  const position = await params.db.position.findFirst({
    where: { id: params.positionId, userId: params.userId,
      status: params.allowClosedReplay ? { in: ['OPEN', 'CLOSED'] } : 'OPEN',
      syncState: 'IN_SYNC', continuityState: 'CONFIRMED' },
    select: { botId: true, walletId: true, symbol: true, side: true,
      quantity: true, contractSize: true },
  });
  if (!position) throw orderErrors.gatePositionScopeUnverified();
  const entrySide = position.side === 'LONG' ? 'BUY' : 'SELL';
  const closesPosition = params.reduceOnly || (params.mode === 'PAPER' && params.side !== entrySide);
  const expectedSide = closesPosition ? (entrySide === 'BUY' ? 'SELL' : 'BUY') : entrySide;
  const expectedWalletId = params.mode === 'PAPER' && params.botId ? null : params.walletId;
  if (position.symbol !== params.symbol.toUpperCase() ||
      position.botId !== params.botId ||
      position.walletId !== expectedWalletId ||
      params.side !== expectedSide ||
      !Number.isFinite(position.quantity) || position.quantity <= 0 ||
      (closesPosition && params.quantity > position.quantity + 1e-9)) {
    throw orderErrors.gatePositionScopeUnverified();
  }
  if (position.contractSize !== 1) throw orderErrors.gatePositionUnitUnsafe();
  return position.contractSize;
};

export const assertExistingGateLinkedOrderContractUnit = async (params: {
  db: PrismaClient | Prisma.TransactionClient;
  userId: string;
  botId: string | null;
  positionId: string;
  symbol: string;
  contractSize: number;
}) => {
  const unsafe = await params.db.order.findFirst({
    where: { userId: params.userId, botId: params.botId,
      positionId: params.positionId, symbol: params.symbol.toUpperCase(),
      status: { in: ['PENDING', 'OPEN', 'PARTIALLY_FILLED'] },
      OR: [{ contractSize: null }, { contractSize: { not: params.contractSize } }] },
    select: { id: true },
  });
  if (unsafe) throw orderErrors.openOrderContractUnitMismatch();
};

export const canReplayClosedGatePosition = async (params: {
  db: PrismaClient | Prisma.TransactionClient;
  userId: string;
  clientOrderId: string | null;
  positionId: string;
}) => {
  if (!params.clientOrderId) return false;
  const intent = await params.db.liveOrderIntent.findUnique({
    where: { clientOrderId: params.clientOrderId },
    select: { id: true, userId: true, payload: true },
  });
  const payload = intent?.payload && typeof intent.payload === 'object' && !Array.isArray(intent.payload)
    ? intent.payload as Record<string, unknown> : null;
  if (intent?.userId !== params.userId || payload?.positionId !== params.positionId ||
      payload.reduceOnly !== true || payload.contractSize !== 1) return false;
  const order = await params.db.order.findUnique({ where: { id: intent.id },
    select: { userId: true, positionId: true, status: true, syncState: true,
      contractSize: true } });
  return order?.userId === params.userId && order.positionId === params.positionId &&
    order.status === 'FILLED' && order.syncState === 'IN_SYNC' && order.contractSize === 1;
};

type OpenPositionScopeParams = {
  userId: string;
  symbol: string;
  mode?: 'PAPER' | 'LIVE' | null;
  walletId?: string | null;
  botId?: string | null;
};

export const resolveOpenPositionScopeWhere = (
  params: OpenPositionScopeParams
): Prisma.PositionWhereInput => {
  const baseWhere: Prisma.PositionWhereInput = {
    userId: params.userId,
    symbol: params.symbol.toUpperCase(),
    status: 'OPEN',
    syncState: 'IN_SYNC',
  };

  if (params.mode === 'PAPER' && params.botId) {
    return {
      ...baseWhere,
      walletId: null,
      botId: params.botId,
    };
  }

  if (params.walletId) {
    return {
      ...baseWhere,
      walletId: params.walletId,
    };
  }

  if (params.botId) {
    return {
      ...baseWhere,
      walletId: null,
      botId: params.botId,
    };
  }

  return {
    ...baseWhere,
    walletId: null,
    botId: null,
  };
};
