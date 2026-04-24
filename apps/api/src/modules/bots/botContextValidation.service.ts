import { Exchange } from '@prisma/client';

import { prisma } from '../../prisma/client';
import { botErrors } from './bots.errors';

export const normalizeWalletContextValue = (value: string | null | undefined) =>
  (value ?? '').trim().toUpperCase();

export const isWalletContextCompatibleWithMarketUniverse = (params: {
  wallet: {
    exchange: Exchange;
    marketType: 'FUTURES' | 'SPOT';
    baseCurrency: string;
  };
  marketUniverse: {
    exchange: Exchange;
    marketType: 'FUTURES' | 'SPOT';
    baseCurrency: string;
  };
}) =>
  params.wallet.exchange === params.marketUniverse.exchange &&
  params.wallet.marketType === params.marketUniverse.marketType &&
  normalizeWalletContextValue(params.wallet.baseCurrency) ===
    normalizeWalletContextValue(params.marketUniverse.baseCurrency);

export const assertWalletContextMatchesExistingBotMarketGroups = async (params: {
  userId: string;
  botId: string;
  wallet: {
    id: string;
    exchange: Exchange;
    marketType: 'FUTURES' | 'SPOT';
    baseCurrency: string;
  };
}) => {
  const bot = await prisma.bot.findFirst({
    where: {
      userId: params.userId,
      id: params.botId,
    },
    select: {
      id: true,
      symbolGroupId: true,
      symbolGroup: {
        select: {
          marketUniverse: {
            select: {
              id: true,
              exchange: true,
              marketType: true,
              baseCurrency: true,
            },
          },
        },
      },
    },
  });

  const universe = bot?.symbolGroup?.marketUniverse;
  if (!universe) {
    return;
  }

  const mismatch = !isWalletContextCompatibleWithMarketUniverse({
    wallet: params.wallet,
    marketUniverse: {
      exchange: universe.exchange,
      marketType: universe.marketType,
      baseCurrency: universe.baseCurrency,
    },
  });

  if (mismatch) {
    throw botErrors.walletMarketContextMismatch({
      walletId: params.wallet.id,
      walletExchange: params.wallet.exchange,
      walletMarketType: params.wallet.marketType,
      walletBaseCurrency: normalizeWalletContextValue(params.wallet.baseCurrency),
      symbolGroupId: bot?.symbolGroupId ?? null,
      marketUniverseId: universe.id,
      marketUniverseExchange: universe.exchange,
      marketUniverseMarketType: universe.marketType,
      marketUniverseBaseCurrency: normalizeWalletContextValue(universe.baseCurrency),
    });
  }
};
