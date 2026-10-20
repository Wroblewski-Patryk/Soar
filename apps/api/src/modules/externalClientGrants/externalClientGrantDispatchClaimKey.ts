import { Prisma } from '@prisma/client';
import type { GrantLimitCommand } from './externalClientGrantReservation.service';

// Snapshot only the identity selected by the current adapter. A future venue
// permit must recheck the ID and updatedAt before reading any credentials.
export const resolveDispatchClaimKey = async (tx: Prisma.TransactionClient, command: GrantLimitCommand,
  lockRows = false) => {
  const lock = async (table: 'Bot' | 'Wallet' | 'ApiKey', id: string) => {
    if (!lockRows) return;
    await tx.$queryRaw(Prisma.sql`SELECT "id" FROM ${Prisma.raw(`"${table}"`)}
      WHERE "id" = ${id} FOR SHARE`);
  };
  await lock('Bot', command.botId);
  const bot = await tx.bot.findFirst({ where: { id: command.botId, userId: command.userId },
    select: { exchange: true, marketType: true, mode: true, isActive: true, liveOptIn: true,
      apiKeyId: true, walletId: true } });
  if (!bot || bot.mode !== 'LIVE' || !bot.isActive || !bot.liveOptIn ||
      bot.exchange !== command.exchange || bot.marketType !== command.marketType ||
      bot.walletId !== command.walletId) return null;
  const findKey = async (id: string) => {
    await lock('ApiKey', id);
    return tx.apiKey.findFirst({ where: { id, userId: command.userId },
      select: { id: true, exchange: true, updatedAt: true } });
  };
  if (bot.apiKeyId) {
    const key = await findKey(bot.apiKeyId);
    if (key?.exchange === command.exchange) return key;
  }
  if (bot.walletId) {
    await lock('Wallet', bot.walletId);
    const wallet = await tx.wallet.findFirst({ where: { id: bot.walletId, userId: command.userId },
      select: { exchange: true, marketType: true, mode: true, apiKeyId: true } });
    if (wallet?.exchange === command.exchange && wallet.marketType === command.marketType &&
        wallet.mode === 'LIVE' && wallet.apiKeyId) {
      const key = await findKey(wallet.apiKeyId);
      if (key?.exchange === command.exchange) return key;
    }
  }
  return null;
};
