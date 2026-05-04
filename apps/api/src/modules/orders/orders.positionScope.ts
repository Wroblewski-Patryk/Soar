import { Prisma } from '@prisma/client';

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
