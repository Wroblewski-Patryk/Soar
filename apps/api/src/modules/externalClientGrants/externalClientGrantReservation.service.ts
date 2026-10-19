import { createHash } from 'node:crypto';
import { Exchange, ExternalClientGrant, LiveOrderIntent, Prisma, PrismaClient, TradeMarket } from '@prisma/client';
import { z } from 'zod';
import { prisma } from '../../prisma/client';
import { getExchangeSymbolRules } from '../exchange/exchangeSymbolRules.service';
import { supportsExchangeExecutionCapability } from '../exchange/exchangeExecutionCapabilityContract.service';
import { assertSubscriptionAllowsLiveTrading } from '../subscriptions/subscriptionEntitlements.service';
import { getOwnedGrantBotScope, isAssignedGrantSymbol } from './externalClientGrants.service';

type DbClient = PrismaClient;
type Tx = Prisma.TransactionClient;
type SymbolRulesReader = typeof getExchangeSymbolRules;

export class GrantReservationError extends Error {
  constructor(readonly code: string) { super(code); }
}
const deny = (code: string): never => { throw new GrantReservationError(code); };

// Only a canonical LIMIT command is accepted. riskAck and caller-supplied notional
// are intentionally absent. Future adapters must pass the final venue client ID.
const commandSchema = z.strictObject({
  userId: z.string().min(1),
  botId: z.uuid(),
  exchange: z.enum(Exchange),
  marketType: z.enum(TradeMarket),
  symbol: z.string().regex(/^[A-Z0-9]{5,30}$/),
  action: z.literal('PLACE_LIVE_ORDER'),
  clientOrderId: z.string().regex(/^[A-Za-z0-9_-]{1,36}$/),
  side: z.enum(['BUY', 'SELL']),
  type: z.literal('LIMIT'),
  quantity: z.string(),
  limitPrice: z.string(),
  reduceOnly: z.boolean(),
  walletId: z.uuid().nullable(),
  strategyId: z.uuid().nullable(),
  positionId: z.uuid().nullable(),
});
export type GrantLimitCommand = z.infer<typeof commandSchema>;

const decimalPattern = /^(?:0|[1-9]\d{0,11})(?:\.\d{1,8})?$/;
const positiveDecimal = (value: string) => {
  if (!decimalPattern.test(value)) return deny('INVALID_COMMAND_PRECISION');
  const parsed = new Prisma.Decimal(value);
  if (parsed.lte(0)) return deny('INVALID_COMMAND_AMOUNT');
  return parsed;
};

const canonicalize = (value: unknown) => {
  const parsed = commandSchema.safeParse(value);
  if (!parsed.success) return deny('INVALID_COMMAND');
  positiveDecimal(parsed.data.quantity);
  positiveDecimal(parsed.data.limitPrice);
  return parsed.data;
};

const fingerprint = (command: GrantLimitCommand) =>
  createHash('sha256').update(JSON.stringify(command), 'utf8').digest('hex');
const secretHash = (secret: string) => createHash('sha256').update(secret, 'utf8').digest('hex');
const secretPattern = /^soar_ext_[A-Za-z0-9_-]{43}$/;
// Existing grant limit columns are denominated in USDT and have no currency field.
const grantNominalCurrency = 'USDT';

const resolveQuoteAmount = async (command: GrantLimitCommand, reader: SymbolRulesReader) => {
  const rules = await reader({ exchange: command.exchange, marketType: command.marketType,
    symbol: command.symbol, requireCurrentMetadata: true });
  // Symbol spelling and the locally configured market universe are scope
  // checks, not evidence of the venue's quote or settlement currency.
  if (!rules || rules.quoteCurrency !== grantNominalCurrency ||
      (command.marketType === 'FUTURES' &&
        (rules.settleCurrency !== grantNominalCurrency || rules.isContract !== true ||
          rules.isLinear !== true || rules.isInverse === true)) ||
      (command.marketType === 'SPOT' &&
        (rules.isContract === true || rules.isLinear === true || rules.isInverse === true ||
          (rules.settleCurrency != null && rules.settleCurrency !== grantNominalCurrency)))) {
    return deny('UNVERIFIED_MARKET_CURRENCY');
  }
  if (typeof rules.quantityStep !== 'number' || !Number.isFinite(rules.quantityStep) ||
      rules.quantityStep <= 0 || typeof rules.priceStep !== 'number' ||
      !Number.isFinite(rules.priceStep) || rules.priceStep <= 0) return deny('UNVERIFIED_MARKET_PRECISION');
  const multiplier = command.marketType === 'SPOT' ? 1 : rules.contractSize;
  if (typeof multiplier !== 'number' || !Number.isFinite(multiplier) || multiplier <= 0) {
    return deny('UNVERIFIED_CONTRACT_SIZE');
  }
  const quantity = positiveDecimal(command.quantity);
  const step = new Prisma.Decimal(rules.quantityStep.toString());
  const priceStep = new Prisma.Decimal(rules.priceStep.toString());
  if (!quantity.mod(step).eq(0)) return deny('INVALID_QUANTITY_STEP');
  if (!positiveDecimal(command.limitPrice).mod(priceStep).eq(0)) return deny('INVALID_PRICE_STEP');
  if (typeof rules.minQuantity === 'number' && Number.isFinite(rules.minQuantity) &&
      quantity.lt(rules.minQuantity.toString())) return deny('BELOW_MIN_QUANTITY');
  const exact = quantity.mul(positiveDecimal(command.limitPrice)).mul(multiplier.toString());
  if (typeof rules.minNotional === 'number' && Number.isFinite(rules.minNotional) &&
      exact.lt(rules.minNotional.toString())) return deny('BELOW_MIN_NOTIONAL');
  const roundedUp = exact.toDecimalPlaces(8, Prisma.Decimal.ROUND_CEIL);
  if (roundedUp.lte(0) || roundedUp.gte('1000000000000')) return deny('INVALID_QUOTE_NOTIONAL');
  return { amount: roundedUp, currencyProof: {
    quote: rules.quoteCurrency,
    settle: command.marketType === 'FUTURES' ? rules.settleCurrency : null,
    contract: command.marketType === 'FUTURES',
  } };
};

const lockGrant = async (tx: Tx, grantId: string) => {
  const rows = await tx.$queryRaw<Array<{ id: string }>>(Prisma.sql`
    SELECT "id" FROM "ExternalClientGrant" WHERE "id" = ${grantId} FOR UPDATE
  `);
  if (rows.length !== 1) return deny('GRANT_UNAVAILABLE');
  const grant = await tx.externalClientGrant.findUnique({ where: { id: grantId } });
  if (!grant) return deny('GRANT_UNAVAILABLE');
  return grant;
};

const assertCurrentScope = async (
  tx: Tx, grant: ExternalClientGrant, secret: string, command: GrantLimitCommand,
) => {
  if (!secretPattern.test(secret) || grant.secretHash !== secretHash(secret) ||
      grant.revokedAt || grant.expiresAt <= new Date() ||
      grant.userId !== command.userId || grant.botId !== command.botId ||
      grant.exchange !== command.exchange || grant.marketType !== command.marketType ||
      grant.symbol !== command.symbol || grant.action !== command.action ||
      !supportsExchangeExecutionCapability(command.exchange, command.marketType, 'LIVE_ORDER_SUBMIT')) {
    return deny('GRANT_SCOPE_UNAVAILABLE');
  }
  const bot = await getOwnedGrantBotScope(grant.userId, grant.botId, tx);
  if (!bot || bot.mode !== 'LIVE' || !bot.isActive || !bot.liveOptIn ||
      bot.exchange !== grant.exchange || bot.marketType !== grant.marketType ||
      !isAssignedGrantSymbol(bot, grant.symbol, grant.exchange, grant.marketType, grantNominalCurrency)) {
    return deny('GRANT_BOT_SCOPE_UNAVAILABLE');
  }
  await assertSubscriptionAllowsLiveTrading(grant.userId, tx);
};

const transactionOptions = { maxWait: 10_000, timeout: 20_000 };
type Deps = { db?: DbClient; getSymbolRules?: SymbolRulesReader };

export const reserveExternalClientGrantOrder = async (
  input: { grantId: string; secret: string; command: unknown }, deps: Deps = {},
) => {
  const db = deps.db ?? prisma;
  const command = canonicalize(input.command);
  const commandHash = fingerprint(command);
  if (!secretPattern.test(input.secret)) return deny('GRANT_SCOPE_UNAVAILABLE');
  const preflightGrant = await db.externalClientGrant.findUnique({
    where: { id: input.grantId }, select: { secretHash: true },
  });
  if (!preflightGrant || preflightGrant.secretHash !== secretHash(input.secret)) {
    return deny('GRANT_SCOPE_UNAVAILABLE');
  }
  // A known retry needs no fresh market metadata. The locked transaction still
  // rechecks the command, scope, entitlement, expiry, and revocation.
  const preexisting = await db.externalClientGrantReservation.findUnique({
    where: { clientOrderId: command.clientOrderId }, select: { id: true },
  });
  const marketProof = preexisting ? null : await resolveQuoteAmount(command, deps.getSymbolRules ?? getExchangeSymbolRules);
  return db.$transaction(async (tx) => {
    const grant = await lockGrant(tx, input.grantId);
    await assertCurrentScope(tx, grant, input.secret, command);
    const existing = await tx.externalClientGrantReservation.findUnique({
      where: { clientOrderId: command.clientOrderId },
    });
    if (existing) {
      if (existing.grantId !== grant.id || existing.commandHash !== commandHash) {
        return deny('CLIENT_ORDER_COMMAND_CONFLICT');
      }
      return { reused: true, reservation: existing };
    }
    const priorIntent = await tx.liveOrderIntent.findUnique({
      where: { clientOrderId: command.clientOrderId }, select: { id: true },
    });
    if (priorIntent) return deny('CLIENT_ORDER_ID_ALREADY_USED');
    if (!marketProof) return deny('MARKET_EVIDENCE_UNAVAILABLE');
    const quoteAmount = marketProof.amount;
    const unresolved = await tx.externalClientGrantReservation.findFirst({
      where: { grantId: grant.id, state: { in: ['RESERVED', 'SUBMISSION_UNCERTAIN'] } },
      select: { id: true },
    });
    if (unresolved) return deny('GRANT_PREVIOUS_OPERATION_UNRESOLVED');
    if (quoteAmount.gt(grant.maxActionQuoteAmount) || grant.usedActions >= grant.maxActions ||
        grant.usedQuoteAmount.plus(quoteAmount).gt(grant.maxTotalQuoteAmount)) {
      return deny('GRANT_LIMIT_EXCEEDED');
    }
    const reservation = await tx.externalClientGrantReservation.create({
      data: { grantId: grant.id, clientOrderId: command.clientOrderId, commandHash,
        command: command as Prisma.InputJsonValue, quoteAmount },
    });
    await tx.externalClientGrant.update({
      where: { id: grant.id },
      data: { usedActions: { increment: 1 }, usedQuoteAmount: { increment: quoteAmount } },
    });
    await tx.log.create({ data: {
      userId: grant.userId, botId: grant.botId, source: 'external_client_grant',
      actor: 'EXTERNAL_CLIENT', action: 'EXTERNAL_CLIENT_GRANT_RESERVED', level: 'INFO',
      message: 'External client allowance reserved', entityType: 'ExternalClientGrantReservation',
      entityId: reservation.id, metadata: { grantId: grant.id, clientOrderId: command.clientOrderId,
        commandHash, quoteAmount: quoteAmount.toFixed(8), currencyProof: marketProof.currencyProof },
    } });
    return { reused: false, reservation };
  }, transactionOptions);
};

// Commit this state before any future network submit. A crash after commit is
// deliberately uncertain and retry must use venue lookup, never another submit.
export const beginExternalClientGrantSubmission = async (
  input: { reservationId: string; secret: string }, db: DbClient = prisma,
) => db.$transaction(async (tx) => {
  const found = await tx.externalClientGrantReservation.findUnique({ where: { id: input.reservationId } });
  if (!found) return deny('RESERVATION_UNAVAILABLE');
  const grant = await lockGrant(tx, found.grantId);
  const current = await tx.externalClientGrantReservation.findUnique({ where: { id: found.id } });
  if (!current || current.state !== 'RESERVED') return deny('RESERVATION_NOT_DISPATCHABLE');
  const command = canonicalize(current.command);
  await assertCurrentScope(tx, grant, input.secret, command);
  const intent = await tx.liveOrderIntent.findUnique({ where: { clientOrderId: current.clientOrderId } });
  if (!intent || !intentMatchesCommandAndScope(intent, command)) return deny('SUBMISSION_INTENT_UNAVAILABLE');
  const updated = await tx.externalClientGrantReservation.update({
    where: { id: current.id }, data: { state: 'SUBMISSION_UNCERTAIN', dispatchStartedAt: new Date() },
  });
  await tx.log.create({ data: {
    userId: grant.userId, botId: grant.botId, source: 'external_client_grant',
    actor: 'SYSTEM', action: 'EXTERNAL_CLIENT_GRANT_SUBMISSION_STARTED', level: 'WARN',
    message: 'Submission may have started; retry is lookup only',
    entityType: 'ExternalClientGrantReservation', entityId: current.id,
    metadata: { grantId: grant.id, clientOrderId: current.clientOrderId },
  } });
  return updated;
}, transactionOptions);

// The only automated refund proof is a locally held pre-dispatch reservation
// with no durable LiveOrderIntent. UNKNOWN/timeouts never qualify.
export const refundUnsentExternalClientGrantReservation = async (
  reservationId: string, db: DbClient = prisma,
) => db.$transaction(async (tx) => {
  const found = await tx.externalClientGrantReservation.findUnique({ where: { id: reservationId } });
  if (!found) return deny('RESERVATION_UNAVAILABLE');
  const grant = await lockGrant(tx, found.grantId);
  const current = await tx.externalClientGrantReservation.findUnique({ where: { id: reservationId } });
  if (!current) return deny('RESERVATION_UNAVAILABLE');
  if (current.state === 'NOT_SUBMITTED') return current;
  if (current.state !== 'RESERVED' || current.dispatchStartedAt) return deny('NO_AUTHORITATIVE_NO_SUBMIT_PROOF');
  const intent = await tx.liveOrderIntent.findUnique({ where: { clientOrderId: current.clientOrderId }, select: { id: true } });
  if (intent) return deny('NO_AUTHORITATIVE_NO_SUBMIT_PROOF');
  const updated = await tx.externalClientGrantReservation.update({ where: { id: current.id }, data: {
    state: 'NOT_SUBMITTED', resolvedAt: new Date(), proofType: 'LOCAL_PRE_DISPATCH_ABORT',
    proofRef: `reservation:${current.id}:no-intent`,
  } });
  await tx.externalClientGrant.update({ where: { id: grant.id }, data: {
    usedActions: { decrement: 1 }, usedQuoteAmount: { decrement: current.quoteAmount },
  } });
  await tx.log.create({ data: {
    userId: grant.userId, botId: grant.botId, source: 'external_client_grant',
    actor: 'SYSTEM', action: 'EXTERNAL_CLIENT_GRANT_REFUNDED', level: 'INFO',
    message: 'Pre-dispatch reservation refunded', entityType: 'ExternalClientGrantReservation',
    entityId: current.id, metadata: { grantId: grant.id, clientOrderId: current.clientOrderId,
      proofType: 'LOCAL_PRE_DISPATCH_ABORT' },
  } });
  return updated;
}, transactionOptions);

// Recovery is lookup-only. A durable intent plus local Order carrying an
// exchange identity is accepted as submission evidence; allowance stays spent.
const intentMatchesCommand = (payload: unknown, command: GrantLimitCommand) => {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) return false;
  const raw = payload as Record<string, unknown>;
  const quantity = typeof raw.quantity === 'number' || typeof raw.quantity === 'string'
    ? String(raw.quantity) : '';
  const price = typeof raw.price === 'number' || typeof raw.price === 'string'
    ? String(raw.price) : '';
  try {
    return raw.botId === command.botId && (raw.walletId ?? null) === command.walletId &&
      (raw.strategyId ?? null) === command.strategyId &&
      (raw.positionId ?? null) === command.positionId && raw.symbol === command.symbol &&
      raw.side === command.side && raw.type === command.type &&
      (raw.reduceOnly ?? false) === command.reduceOnly &&
      new Prisma.Decimal(quantity).eq(command.quantity) &&
      new Prisma.Decimal(price).eq(command.limitPrice);
  } catch { return false; }
};

const intentMatchesCommandAndScope = (intent: LiveOrderIntent, command: GrantLimitCommand) =>
  intent.userId === command.userId && intent.exchange === command.exchange &&
  intent.marketType === command.marketType && intent.symbol === command.symbol &&
  intent.clientOrderId === command.clientOrderId && intentMatchesCommand(intent.payload, command);

export const reconcileSubmittedExternalClientGrantReservation = async (
  reservationId: string, db: DbClient = prisma,
) => db.$transaction(async (tx) => {
  const found = await tx.externalClientGrantReservation.findUnique({ where: { id: reservationId } });
  if (!found) return deny('RESERVATION_UNAVAILABLE');
  await lockGrant(tx, found.grantId);
  const current = await tx.externalClientGrantReservation.findUnique({ where: { id: reservationId } });
  if (!current) return deny('RESERVATION_UNAVAILABLE');
  if (current.state === 'SUBMITTED') return current;
  if (current.state !== 'SUBMISSION_UNCERTAIN') return deny('RESERVATION_NOT_UNCERTAIN');
  const command = canonicalize(current.command);
  const intent = await tx.liveOrderIntent.findUnique({ where: { clientOrderId: current.clientOrderId } });
  if (!intent || !intentMatchesCommandAndScope(intent, command)) {
    return deny('SUBMISSION_EVIDENCE_UNAVAILABLE');
  }
  const order = await tx.order.findUnique({ where: { id: intent.id } });
  if (!order || order.userId !== command.userId || order.botId !== command.botId ||
      order.symbol !== command.symbol || order.side !== command.side || order.type !== command.type ||
      !order.exchangeOrderId || order.price == null ||
      !new Prisma.Decimal(order.quantity.toString()).eq(command.quantity) ||
      !new Prisma.Decimal(order.price.toString()).eq(command.limitPrice)) {
    return deny('SUBMISSION_EVIDENCE_UNAVAILABLE');
  }
  const updated = await tx.externalClientGrantReservation.update({ where: { id: current.id }, data: {
    state: 'SUBMITTED', resolvedAt: new Date(), proofType: 'DURABLE_ORDER', proofRef: order.id,
  } });
  const grant = await tx.externalClientGrant.findUniqueOrThrow({ where: { id: current.grantId } });
  await tx.log.create({ data: {
    userId: grant.userId, botId: grant.botId, source: 'external_client_grant',
    actor: 'SYSTEM', action: 'EXTERNAL_CLIENT_GRANT_SUBMITTED_RECONCILED', level: 'INFO',
    message: 'Submission reconciled from durable order identity',
    entityType: 'ExternalClientGrantReservation', entityId: current.id,
    metadata: { grantId: grant.id, clientOrderId: current.clientOrderId, orderId: order.id },
  } });
  return updated;
}, transactionOptions);
