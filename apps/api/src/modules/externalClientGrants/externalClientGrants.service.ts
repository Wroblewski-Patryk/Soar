import { createHash, randomBytes } from 'node:crypto';
import { Exchange, ExternalClientAction, Prisma, PrismaClient, TradeMarket } from '@prisma/client';
import { prisma } from '../../prisma/client';
import { comparePassword } from '../../utils/hash';
import { supportsExchangeExecutionCapability } from '../exchange/exchangeExecutionCapabilityContract.service';
import { assertSubscriptionAllowsLiveTrading } from '../subscriptions/subscriptionEntitlements.service';

export const EXTERNAL_CLIENT_GRANT_SECRET_PATTERN = /^soar_ext_[A-Za-z0-9_-]{43}$/;
export const hashExternalClientGrantSecret = (secret: string) =>
  createHash('sha256').update(secret, 'utf8').digest('hex');

export class GrantInputError extends Error {
  constructor(message: string, readonly status: number = 400) {
    super(message);
  }
}

const publicGrantSelect = {
  id: true,
  botId: true,
  clientLabel: true,
  exchange: true,
  marketType: true,
  symbol: true,
  action: true,
  maxActionQuoteAmount: true,
  maxTotalQuoteAmount: true,
  usedQuoteAmount: true,
  maxActions: true,
  usedActions: true,
  expiresAt: true,
  revokedAt: true,
  createdAt: true,
} as const;

export const isAssignedGrantSymbol = (bot: {
  symbolGroup: { symbols: string[]; marketUniverse: { exchange: Exchange; marketType: TradeMarket; baseCurrency: string } } | null;
  botMarketGroups: Array<{
    isEnabled: boolean;
    lifecycleStatus: string;
    symbolGroup: { symbols: string[]; marketUniverse: { exchange: Exchange; marketType: TradeMarket; baseCurrency: string } };
  }>;
}, symbol: string, exchange: Exchange, marketType: TradeMarket, quoteCurrency?: string) => {
  const groups = bot.botMarketGroups.length > 0
    ? bot.botMarketGroups
        .filter((group) => group.isEnabled && group.lifecycleStatus === 'ACTIVE')
        .map((group) => group.symbolGroup)
    : bot.symbolGroup ? [bot.symbolGroup] : [];
  return groups.some((group) => group.marketUniverse.exchange === exchange &&
    group.marketUniverse.marketType === marketType && group.symbols.includes(symbol) &&
    (!quoteCurrency || group.marketUniverse.baseCurrency.trim().toUpperCase() === quoteCurrency));
};

type DbClient = PrismaClient | Prisma.TransactionClient;

export const getOwnedGrantBotScope = (userId: string, botId: string, db: DbClient = prisma) => db.bot.findFirst({
  where: { id: botId, userId },
  select: {
    id: true, userId: true, exchange: true, marketType: true, mode: true,
    isActive: true, liveOptIn: true,
    symbolGroup: { select: { symbols: true, marketUniverse: { select: { exchange: true, marketType: true, baseCurrency: true } } } },
    botMarketGroups: {
      select: {
        isEnabled: true, lifecycleStatus: true,
        symbolGroup: { select: { symbols: true, marketUniverse: { select: { exchange: true, marketType: true, baseCurrency: true } } } },
      },
    },
  },
});

const parseAmount = (value: string) => {
  if (!/^(?:0|[1-9]\d{0,11})(?:\.\d{1,8})?$/.test(value)) {
    throw new GrantInputError('Invalid quote amount');
  }
  const amount = new Prisma.Decimal(value);
  if (amount.lte(0)) throw new GrantInputError('Quote amount must be positive');
  return amount;
};

export type CreateGrantInput = {
  botId: string;
  clientLabel: string;
  exchange: Exchange;
  marketType: TradeMarket;
  symbol: string;
  action: ExternalClientAction;
  maxActionQuoteAmount: string;
  maxTotalQuoteAmount: string;
  maxActions: number;
  ttlSeconds: number;
  password: string;
};

export const createExternalClientGrant = async (userId: string, input: CreateGrantInput) => {
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { password: true } });
  if (!user || !(await comparePassword(input.password, user.password))) {
    throw new GrantInputError('Invalid password', 403);
  }
  await assertSubscriptionAllowsLiveTrading(userId);

  const bot = await getOwnedGrantBotScope(userId, input.botId);
  if (!bot) throw new GrantInputError('Bot not found', 404);
  if (bot.mode !== 'LIVE' || bot.exchange !== input.exchange || bot.marketType !== input.marketType ||
      !supportsExchangeExecutionCapability(input.exchange, input.marketType, 'LIVE_ORDER_SUBMIT') ||
      !isAssignedGrantSymbol(bot, input.symbol, input.exchange, input.marketType)) {
    throw new GrantInputError('Bot scope does not match grant');
  }

  const maxActionQuoteAmount = parseAmount(input.maxActionQuoteAmount);
  const maxTotalQuoteAmount = parseAmount(input.maxTotalQuoteAmount);
  if (maxTotalQuoteAmount.lt(maxActionQuoteAmount)) {
    throw new GrantInputError('Total limit must cover one action');
  }

  const secret = `soar_ext_${randomBytes(32).toString('base64url')}`;
  const secretHash = hashExternalClientGrantSecret(secret);
  const expiresAt = new Date(Date.now() + input.ttlSeconds * 1000);
  const grant = await prisma.$transaction(async (tx) => {
    const created = await tx.externalClientGrant.create({
      data: {
        userId, botId: bot.id, clientLabel: input.clientLabel, secretHash, exchange: input.exchange,
        marketType: input.marketType, symbol: input.symbol, action: input.action,
        maxActionQuoteAmount, maxTotalQuoteAmount, maxActions: input.maxActions, expiresAt,
      },
      select: publicGrantSelect,
    });
    await tx.log.create({
      data: {
        userId, botId: bot.id, action: 'EXTERNAL_CLIENT_GRANT_CREATED',
        source: 'external_client_grant', actor: 'HUMAN', level: 'INFO',
        message: 'External client grant created', entityType: 'ExternalClientGrant', entityId: created.id,
        metadata: { clientLabel: input.clientLabel, exchange: input.exchange, marketType: input.marketType, symbol: input.symbol,
          action: input.action, expiresAt: expiresAt.toISOString() },
      },
    });
    return created;
  });
  return { grant, secret };
};

export const listExternalClientGrants = (userId: string) => prisma.externalClientGrant.findMany({
  where: { userId }, select: publicGrantSelect, orderBy: { createdAt: 'desc' }, take: 100,
});

export const getExternalClientGrant = (userId: string, grantId: string) =>
  prisma.externalClientGrant.findFirst({ where: { id: grantId, userId }, select: publicGrantSelect });

export const revokeExternalClientGrant = async (userId: string, grantId: string, db: PrismaClient = prisma) =>
  db.$transaction(async (tx) => {
    // Admission takes the same grant row first, then the shared pause key.
    const locked = await tx.$queryRaw<Array<{ id: string }>>(Prisma.sql`
      SELECT "id" FROM "ExternalClientGrant"
      WHERE "id" = ${grantId} AND "userId" = ${userId} FOR UPDATE
    `);
    if (locked.length !== 1) throw new GrantInputError('Grant not found', 404);
    const existing = await tx.externalClientGrant.findFirst({
      where: { id: grantId, userId }, select: { id: true, botId: true, revokedAt: true },
    });
    if (!existing) throw new GrantInputError('Grant not found', 404);
    if (existing.revokedAt) return tx.externalClientGrant.findUniqueOrThrow({
      where: { id: grantId }, select: publicGrantSelect,
    });
    if (await tx.liveCreateOrderSubmission.findFirst({ where: { grantId }, select: { id: true } })) {
      throw new GrantInputError('Grant submission in flight or unresolved', 409);
    }
    const changed = await tx.externalClientGrant.updateMany({
      where: { id: grantId, userId, revokedAt: null }, data: { revokedAt: new Date() },
    });
    if (changed.count === 0) return tx.externalClientGrant.findUniqueOrThrow({
      where: { id: grantId }, select: publicGrantSelect,
    });
    await tx.log.create({
      data: {
        userId, botId: existing.botId, action: 'EXTERNAL_CLIENT_GRANT_REVOKED',
        source: 'external_client_grant', actor: 'HUMAN', level: 'INFO',
        message: 'External client grant revoked', entityType: 'ExternalClientGrant', entityId: grantId,
      },
    });
    return tx.externalClientGrant.findUniqueOrThrow({ where: { id: grantId }, select: publicGrantSelect });
  });

// Internal read-only scope inspection. No API route or execution path consumes this yet.
// Future execution must reserve count and total atomically in the same transaction as intent creation.
export const inspectExternalClientGrant = async (input: {
  secret: string;
  userId: string;
  botId: string;
  exchange: Exchange;
  marketType: TradeMarket;
  symbol: string;
  action: ExternalClientAction;
  quoteAmount: string;
}) => {
  if (!EXTERNAL_CLIENT_GRANT_SECRET_PATTERN.test(input.secret)) return null;
  try {
    const amount = parseAmount(input.quoteAmount);
    const grant = await prisma.externalClientGrant.findUnique({
      where: { secretHash: hashExternalClientGrantSecret(input.secret) },
    });
    if (!grant || grant.userId !== input.userId || grant.botId !== input.botId ||
        grant.exchange !== input.exchange || grant.marketType !== input.marketType ||
        grant.symbol !== input.symbol || grant.action !== input.action ||
        grant.revokedAt || grant.expiresAt <= new Date() ||
        grant.usedActions >= grant.maxActions ||
        amount.gt(grant.maxActionQuoteAmount) ||
        grant.usedQuoteAmount.plus(amount).gt(grant.maxTotalQuoteAmount)) return null;

    const bot = await getOwnedGrantBotScope(grant.userId, grant.botId);
    if (!bot || bot.mode !== 'LIVE' || !bot.isActive || !bot.liveOptIn ||
        bot.exchange !== grant.exchange || bot.marketType !== grant.marketType ||
        !supportsExchangeExecutionCapability(grant.exchange, grant.marketType, 'LIVE_ORDER_SUBMIT') ||
        !isAssignedGrantSymbol(bot, grant.symbol, grant.exchange, grant.marketType)) return null;
    await assertSubscriptionAllowsLiveTrading(grant.userId);
    return { grantId: grant.id, userId: grant.userId, botId: grant.botId };
  } catch {
    return null;
  }
};
