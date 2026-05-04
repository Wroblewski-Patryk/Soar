import { Prisma } from '@prisma/client';

export const buildBotlessWalletTradeFallbackWhere = (input: {
  mode: 'PAPER' | 'LIVE';
  walletId?: string | null;
  symbols: string[];
  windowStart: Date;
  windowEnd: Date;
}): Prisma.TradeWhereInput[] =>
  input.mode === 'LIVE' && input.walletId
    ? [{
        botId: null,
        walletId: input.walletId,
        managementMode: 'BOT_MANAGED',
        symbol: { in: input.symbols },
        executedAt: { gte: input.windowStart, lte: input.windowEnd },
      }]
    : [];
