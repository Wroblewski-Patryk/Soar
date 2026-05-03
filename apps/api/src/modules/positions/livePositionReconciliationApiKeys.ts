import { Exchange, TradeMarket } from '@prisma/client';
import { SyncedApiKey } from './livePositionReconciliation.types';

type SyncedApiKeyContext = {
  id: string;
  userId: string;
  exchange: Exchange;
  wallets: Array<{ marketType: TradeMarket }>;
  bots: Array<{
    marketType: TradeMarket;
    wallet: { marketType: TradeMarket } | null;
  }>;
};

export const expandSyncedApiKeyMarketTypes = (
  apiKeys: SyncedApiKeyContext[]
): SyncedApiKey[] => {
  return apiKeys.flatMap((apiKey) => {
    const marketTypes = new Set<TradeMarket>();
    for (const wallet of apiKey.wallets) marketTypes.add(wallet.marketType);
    for (const bot of apiKey.bots) marketTypes.add(bot.wallet?.marketType ?? bot.marketType);
    if (marketTypes.size === 0) marketTypes.add('FUTURES');
    return [...marketTypes].map((marketType) => ({
      id: apiKey.id,
      userId: apiKey.userId,
      exchange: apiKey.exchange,
      marketType,
    }));
  });
};
