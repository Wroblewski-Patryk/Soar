import { ExternalClientReadAction } from '@prisma/client';
import { prisma } from '../../prisma/client';
import { SubscriptionEntitlementsSchema } from '../subscriptions/subscriptionEntitlements.service';
import {
  EXTERNAL_CLIENT_READ_GRANT_SECRET_PATTERN,
  hashExternalClientReadGrantSecret,
} from './externalClientReadGrants.service';

// Read only. The response describes persisted bot configuration, not worker liveness.
export const readExternalClientBotStatus = async (botId: string, secret: string) => {
  if (!EXTERNAL_CLIENT_READ_GRANT_SECRET_PATTERN.test(secret)) return null;
  const now = new Date();
  const grant = await prisma.externalClientReadGrant.findUnique({
    where: { secretHash: hashExternalClientReadGrantSecret(secret) },
    select: { userId: true, botId: true, action: true, expiresAt: true, revokedAt: true },
  });
  if (!grant || grant.botId !== botId || grant.action !== ExternalClientReadAction.READ_BOT_STATUS ||
      grant.revokedAt || grant.expiresAt <= now) return null;

  const bot = await prisma.bot.findFirst({
    where: { id: botId, userId: grant.userId },
    select: { id: true, mode: true, isActive: true },
  });
  if (!bot) return null;

  const active = await prisma.userSubscription.findFirst({
    where: {
      userId: grant.userId, status: 'ACTIVE', startsAt: { lte: now },
      OR: [{ endsAt: null }, { endsAt: { gt: now } }],
    },
    select: { subscriptionPlan: { select: { entitlements: true } } },
    orderBy: { startsAt: 'desc' },
  });
  const entitlements = SubscriptionEntitlementsSchema.safeParse(active?.subscriptionPlan.entitlements);
  if (!entitlements.success || !entitlements.data.features.liveTrading) return null;

  return bot;
};
