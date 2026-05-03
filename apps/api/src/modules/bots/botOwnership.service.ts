import { prisma } from '../../prisma/client';
import { botErrors } from './bots.errors';

export const getOwnedBot = async (userId: string, botId: string) =>
  prisma.bot.findFirst({
    where: { id: botId, userId },
    select: {
      id: true,
      mode: true,
      marketType: true,
      exchange: true,
      apiKeyId: true,
      walletId: true,
      wallet: {
        select: {
          exchange: true,
          marketType: true,
          baseCurrency: true,
        },
      },
    },
  });

export const getOwnedBotRuntimeSession = async (
  userId: string,
  botId: string,
  sessionId: string
) =>
  prisma.botRuntimeSession.findFirst({
    where: {
      id: sessionId,
      userId,
      botId,
    },
  });

export const resolveSessionWindowEnd = (session: {
  status: 'RUNNING' | 'COMPLETED' | 'FAILED' | 'CANCELED';
  finishedAt: Date | null;
  lastHeartbeatAt: Date | null;
  startedAt: Date;
}) => {
  if (session.finishedAt) return session.finishedAt;
  if (session.status === 'RUNNING') return new Date();
  return session.lastHeartbeatAt ?? session.startedAt;
};

export const getOwnedSymbolGroup = async (userId: string, symbolGroupId: string) =>
  prisma.symbolGroup.findFirst({
    where: { id: symbolGroupId, userId },
    select: {
      id: true,
      marketUniverse: {
        select: { marketType: true, exchange: true, baseCurrency: true },
      },
    },
  });

const normalizeContextValue = (value: string) => value.trim().toUpperCase();

export const validateSymbolGroupForBot = async (params: {
  userId: string;
  botId: string;
  symbolGroupId: string;
}) => {
  const bot = await getOwnedBot(params.userId, params.botId);
  if (!bot) throw botErrors.botNotFound();

  const symbolGroup = await getOwnedSymbolGroup(params.userId, params.symbolGroupId);
  if (!symbolGroup) throw botErrors.symbolGroupNotFound();

  if (bot.wallet) {
    const walletExchange = bot.wallet.exchange;
    const walletMarketType = bot.wallet.marketType;
    const walletBaseCurrency = normalizeContextValue(bot.wallet.baseCurrency);
    const universeExchange = symbolGroup.marketUniverse.exchange;
    const universeMarketType = symbolGroup.marketUniverse.marketType;
    const universeBaseCurrency = normalizeContextValue(symbolGroup.marketUniverse.baseCurrency);

    if (
      walletExchange !== universeExchange ||
      walletMarketType !== universeMarketType ||
      walletBaseCurrency !== universeBaseCurrency
    ) {
      throw botErrors.walletMarketContextMismatch({
        walletId: bot.walletId,
        walletExchange,
        walletMarketType,
        walletBaseCurrency,
        marketUniverseExchange: universeExchange,
        marketUniverseMarketType: universeMarketType,
        marketUniverseBaseCurrency: universeBaseCurrency,
        symbolGroupId: symbolGroup.id,
      });
    }
    return;
  }

  if (symbolGroup.marketUniverse.marketType !== bot.marketType) {
    throw botErrors.botMarketGroupMarketTypeMismatch();
  }
  if (symbolGroup.marketUniverse.exchange !== bot.exchange) {
    throw botErrors.botMarketGroupExchangeMismatch();
  }
};
