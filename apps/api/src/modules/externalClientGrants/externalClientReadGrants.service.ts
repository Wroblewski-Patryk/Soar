import { createHash, randomBytes } from 'node:crypto';
import { ExternalClientReadAction } from '@prisma/client';
import { prisma } from '../../prisma/client';
import { comparePassword } from '../../utils/hash';
import { assertSubscriptionAllowsLiveTrading } from '../subscriptions/subscriptionEntitlements.service';
import { GrantInputError } from './externalClientGrants.service';

export const EXTERNAL_CLIENT_READ_GRANT_SECRET_PATTERN = /^soar_read_[A-Za-z0-9_-]{43}$/;
const hashSecret = (secret: string) => createHash('sha256').update(secret, 'utf8').digest('hex');

const publicReadGrantSelect = {
  id: true, botId: true, clientLabel: true, action: true,
  expiresAt: true, revokedAt: true, createdAt: true,
} as const;

export type CreateReadGrantInput = {
  botId: string;
  clientLabel: string;
  action: ExternalClientReadAction;
  ttlSeconds: number;
  password: string;
};

export const createExternalClientReadGrant = async (userId: string, input: CreateReadGrantInput) => {
  if (input.action !== ExternalClientReadAction.READ_BOT_STATUS ||
      !Number.isInteger(input.ttlSeconds) || input.ttlSeconds < 60 ||
      input.ttlSeconds > 7 * 24 * 60 * 60) {
    throw new GrantInputError('Invalid read grant request');
  }
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { password: true } });
  if (!user || !(await comparePassword(input.password, user.password))) {
    throw new GrantInputError('Invalid password', 403);
  }
  await assertSubscriptionAllowsLiveTrading(userId);

  // Ownership is the only bot condition: the grant may name a PAPER or LIVE bot.
  const bot = await prisma.bot.findFirst({
    where: { id: input.botId, userId }, select: { id: true },
  });
  if (!bot) throw new GrantInputError('Bot not found', 404);

  const secret = `soar_read_${randomBytes(32).toString('base64url')}`;
  const expiresAt = new Date(Date.now() + input.ttlSeconds * 1000);
  const grant = await prisma.$transaction(async (tx) => {
    const created = await tx.externalClientReadGrant.create({
      data: {
        userId, botId: bot.id, clientLabel: input.clientLabel,
        secretHash: hashSecret(secret), action: ExternalClientReadAction.READ_BOT_STATUS,
        expiresAt,
      },
      select: publicReadGrantSelect,
    });
    await tx.log.create({ data: {
      userId, botId: bot.id, action: 'EXTERNAL_CLIENT_READ_GRANT_CREATED',
      source: 'external_client_grant', actor: 'HUMAN', level: 'INFO',
      message: 'External client read grant created',
      entityType: 'ExternalClientReadGrant', entityId: created.id,
      metadata: { clientLabel: input.clientLabel, action: created.action,
        expiresAt: expiresAt.toISOString() },
    } });
    return created;
  });
  return { grant, secret };
};

export const listExternalClientReadGrants = (userId: string) => prisma.externalClientReadGrant.findMany({
  where: { userId }, select: publicReadGrantSelect, orderBy: { createdAt: 'desc' }, take: 100,
});

export const getExternalClientReadGrant = (userId: string, grantId: string) =>
  prisma.externalClientReadGrant.findFirst({ where: { id: grantId, userId }, select: publicReadGrantSelect });

export const revokeExternalClientReadGrant = async (userId: string, grantId: string) =>
  prisma.$transaction(async (tx) => {
    const existing = await tx.externalClientReadGrant.findFirst({
      where: { id: grantId, userId }, select: { id: true, botId: true, revokedAt: true },
    });
    if (!existing) throw new GrantInputError('Read grant not found', 404);
    if (!existing.revokedAt) {
      const changed = await tx.externalClientReadGrant.updateMany({
        where: { id: grantId, userId, revokedAt: null }, data: { revokedAt: new Date() },
      });
      if (changed.count === 1) {
        await tx.log.create({ data: {
          userId, botId: existing.botId, action: 'EXTERNAL_CLIENT_READ_GRANT_REVOKED',
          source: 'external_client_grant', actor: 'HUMAN', level: 'INFO',
          message: 'External client read grant revoked',
          entityType: 'ExternalClientReadGrant', entityId: grantId,
        } });
      }
    }
    return tx.externalClientReadGrant.findUniqueOrThrow({
      where: { id: grantId }, select: publicReadGrantSelect,
    });
  });
