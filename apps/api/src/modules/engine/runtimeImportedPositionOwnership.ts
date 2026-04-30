import { Exchange, TradeMarket } from '@prisma/client';
import { prisma } from '../../prisma/client';
import {
  getExternalPositionOwnership,
  parseApiKeyIdFromExternalPositionId,
  resolveExternalPositionOwnershipIndex,
} from '../bots/runtimeExternalPositionOwner.service';

export type RuntimeImportedPositionBotContext = {
  walletId: string | null;
  liveOptIn: boolean;
  wallet:
    | {
        mode: 'PAPER' | 'LIVE';
        exchange: Exchange;
        marketType: TradeMarket;
        baseCurrency: string;
        paperInitialBalance: number;
      }
    | null;
  symbolGroup:
    | {
        marketUniverse: {
          exchange: Exchange;
          marketType: TradeMarket;
          baseCurrency: string;
        } | null;
      }
    | null;
};

type RuntimeImportedPositionOwnershipRow = {
  id: string;
  userId: string;
  botId: string | null;
  walletId: string | null;
  externalId: string | null;
  origin: string;
  symbol: string;
  bot: RuntimeImportedPositionBotContext | null;
};

export const hydrateImportedRuntimePositionOwnership = async <
  T extends RuntimeImportedPositionOwnershipRow,
>(
  positions: T[]
): Promise<Array<Omit<T, 'externalId'> & { botId: string | null; walletId: string | null; bot: RuntimeImportedPositionBotContext | null }>> => {
  const importedCandidates = positions.filter(
    (position) => position.origin === 'EXCHANGE_SYNC' && !position.botId
  );
  if (importedCandidates.length === 0) {
    return positions.map(({ externalId: _externalId, ...position }) => position);
  }

  const ownershipIndexByUserId = new Map<string, Awaited<ReturnType<typeof resolveExternalPositionOwnershipIndex>>>();
  for (const userId of new Set(importedCandidates.map((position) => position.userId))) {
    ownershipIndexByUserId.set(userId, await resolveExternalPositionOwnershipIndex(userId, 'LIVE'));
  }

  const ownerBotIdByPositionId = new Map<string, string>();
  const ownerWalletIdByPositionId = new Map<string, string>();
  for (const position of importedCandidates) {
    const ownershipIndex = ownershipIndexByUserId.get(position.userId);
    if (!ownershipIndex) continue;
    const ownership = getExternalPositionOwnership(ownershipIndex, {
      apiKeyId: parseApiKeyIdFromExternalPositionId(position.externalId),
      symbol: position.symbol,
    });
    if (ownership.status !== 'OWNED') continue;
    ownerBotIdByPositionId.set(position.id, ownership.botId);
    ownerWalletIdByPositionId.set(position.id, ownership.walletId);
  }

  const ownerBotIds = [...new Set(ownerBotIdByPositionId.values())];
  const ownerBots =
    ownerBotIds.length > 0
      ? await prisma.bot.findMany({
          where: {
            id: { in: ownerBotIds },
            isActive: true,
          },
          select: {
            id: true,
            walletId: true,
            liveOptIn: true,
            wallet: {
              select: {
                mode: true,
                exchange: true,
                marketType: true,
                baseCurrency: true,
                paperInitialBalance: true,
              },
            },
            symbolGroup: {
              select: {
                marketUniverse: {
                  select: {
                    exchange: true,
                    marketType: true,
                    baseCurrency: true,
                  },
                },
              },
            },
          },
        })
      : [];
  const ownerBotById = new Map(ownerBots.map((bot) => [bot.id, bot]));

  return positions.map(({ externalId: _externalId, ...position }) => {
    const effectiveBotId = position.botId ?? ownerBotIdByPositionId.get(position.id) ?? null;
    const effectiveWalletId = position.walletId ?? ownerWalletIdByPositionId.get(position.id) ?? null;
    return {
      ...position,
      botId: effectiveBotId,
      walletId: effectiveWalletId,
      bot: position.bot ?? (effectiveBotId ? ownerBotById.get(effectiveBotId) ?? null : null),
    };
  });
};
