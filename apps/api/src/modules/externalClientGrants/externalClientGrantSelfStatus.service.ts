import { prisma } from '../../prisma/client';
import { supportsExchangeExecutionCapability } from '../exchange/exchangeExecutionCapabilityContract.service';
import { SubscriptionEntitlementsSchema } from '../subscriptions/subscriptionEntitlements.service';
import {
  EXTERNAL_CLIENT_GRANT_SECRET_PATTERN, getOwnedGrantBotScope,
  hashExternalClientGrantSecret, isAssignedGrantSymbol,
} from './externalClientGrants.service';

// This endpoint reads entitlement directly. The normal entitlement helper seeds
// the plan catalog, which would make a status GET write to the database.
const hasCurrentLiveEntitlement = async (userId: string) => {
  const active = await prisma.userSubscription.findFirst({
    where: { userId, status: 'ACTIVE' },
    select: { subscriptionPlan: { select: { entitlements: true } } },
    orderBy: { startsAt: 'desc' },
  });
  const parsed = SubscriptionEntitlementsSchema.safeParse(active?.subscriptionPlan.entitlements);
  return parsed.success && parsed.data.features.liveTrading;
};

export const readExternalClientGrantSelfStatus = async (grantId: string, secret: string) => {
  if (!EXTERNAL_CLIENT_GRANT_SECRET_PATTERN.test(secret)) return null;
  const grant = await prisma.externalClientGrant.findUnique({
    where: { secretHash: hashExternalClientGrantSecret(secret) },
    select: {
      id: true, userId: true, botId: true, exchange: true, marketType: true,
      symbol: true, action: true, maxActionQuoteAmount: true,
      maxTotalQuoteAmount: true, usedQuoteAmount: true, maxActions: true,
      usedActions: true, expiresAt: true, revokedAt: true,
    },
  });
  if (!grant || grant.id !== grantId || grant.revokedAt || grant.expiresAt <= new Date()) return null;

  const bot = await getOwnedGrantBotScope(grant.userId, grant.botId);
  if (!bot || bot.mode !== 'LIVE' || !bot.isActive || !bot.liveOptIn ||
      bot.exchange !== grant.exchange || bot.marketType !== grant.marketType ||
      !supportsExchangeExecutionCapability(grant.exchange, grant.marketType, 'LIVE_ORDER_SUBMIT') ||
      !isAssignedGrantSymbol(bot, grant.symbol, grant.exchange, grant.marketType) ||
      !await hasCurrentLiveEntitlement(grant.userId)) return null;

  return {
    id: grant.id,
    status: grant.usedActions >= grant.maxActions ||
      grant.usedQuoteAmount.gte(grant.maxTotalQuoteAmount) ? 'EXHAUSTED' : 'ACTIVE',
    scope: { botId: grant.botId, exchange: grant.exchange, marketType: grant.marketType,
      symbol: grant.symbol, action: grant.action },
    limits: { maxActionQuoteAmount: grant.maxActionQuoteAmount.toString(),
      maxTotalQuoteAmount: grant.maxTotalQuoteAmount.toString(), maxActions: grant.maxActions },
    usage: { usedQuoteAmount: grant.usedQuoteAmount.toString(), usedActions: grant.usedActions },
    expiresAt: grant.expiresAt.toISOString(),
  };
};
