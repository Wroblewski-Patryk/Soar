import { createHash } from 'node:crypto';
import { Exchange, ExternalClientGrant, LiveOrderIntent, Prisma, PrismaClient, TradeMarket } from '@prisma/client';
import { z } from 'zod';
import { prisma } from '../../prisma/client';
import { isAppErrorLike } from '../../lib/errors';
import { getExchangeSymbolRules } from '../exchange/exchangeSymbolRules.service';
import { supportsExchangeExecutionCapability } from '../exchange/exchangeExecutionCapabilityContract.service';
import { assertSubscriptionAllowsLiveTrading } from '../subscriptions/subscriptionEntitlements.service';
import { fingerprintLiveOrderIntentPayload, persistOrReuseLiveOrderIntent, resolveLiveClientOrderId,
  type LiveExecutionResult, type LiveOrderPayload } from '../orders/orders.liveIntent.service';
import { materializeAdmittedMockLiveOrder, prepareOpenOrderRiskContext } from '../orders/orders.service';
import { assertLiveCreateOrderPermittedInTransaction, LIVE_EXECUTION_PAUSE_LOCK_KEY } from '../orders/liveExecutionPause.service';
import { getOwnedGrantBotScope, isAssignedGrantSymbol } from './externalClientGrants.service';
import { delegatedMockScenarios, runDelegatedMockTransport } from './externalClientGrantMockTransport';

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
type Deps = { db?: DbClient; getSymbolRules?: SymbolRulesReader; bindIntent?: true };

const representableNumber = (value: string) => {
  const numeric = Number(value);
  if (!Number.isFinite(numeric) || !new Prisma.Decimal(numeric.toString()).eq(value)) {
    return deny('INTENT_AMOUNT_NOT_REPRESENTABLE');
  }
  return numeric;
};

const bindNewIntent = async (tx: Tx, command: GrantLimitCommand) => {
  const bot = await tx.bot.findFirst({ where: { id: command.botId, userId: command.userId },
    select: { id: true, exchange: true, marketType: true, positionMode: true,
      apiKeyId: true, walletId: true } });
  if (!bot || bot.exchange !== command.exchange || bot.marketType !== command.marketType) {
    return deny('GRANT_BOT_SCOPE_UNAVAILABLE');
  }
  const payload = {
    botId: command.botId, walletId: command.walletId ?? undefined,
    strategyId: command.strategyId ?? undefined, positionId: command.positionId,
    symbol: command.symbol, side: command.side, type: command.type,
    quantity: representableNumber(command.quantity), price: representableNumber(command.limitPrice),
    reduceOnly: command.reduceOnly, mode: 'LIVE' as const, riskAck: true,
    clientOrderId: command.clientOrderId,
  };
  let prepared;
  try {
    prepared = await persistOrReuseLiveOrderIntent({ userId: command.userId, bot, payload, tx });
  } catch (error) {
    if (isAppErrorLike(error) && error.code === 'LIVE_INTENT_CONFLICT') {
      return deny('CLIENT_ORDER_ID_ALREADY_USED');
    }
    throw error;
  }
  if (!prepared.created || prepared.existingOrder || prepared.clientOrderId !== command.clientOrderId ||
      !intentMatchesCommand(prepared.payload, command)) return deny('CLIENT_ORDER_ID_ALREADY_USED');
  return prepared.intentId;
};

const hasAtomicIntentBinding = async (db: DbClient | Tx, reservationId: string, intentId: string) => {
  const audit = await db.log.findFirst({ where: {
    entityType: 'ExternalClientGrantReservation', entityId: reservationId,
    action: 'EXTERNAL_CLIENT_GRANT_RESERVED',
  }, select: { metadata: true } });
  const metadata = audit?.metadata;
  return metadata && typeof metadata === 'object' && !Array.isArray(metadata) &&
    (metadata as Record<string, unknown>).boundIntentId === intentId;
};

// No submit capability is exposed. The final venue ID is used for both rows.
export const bindExternalClientGrantReservationIntent = async (
  input: { grantId: string; secret: string; command: unknown }, deps: Omit<Deps, 'bindIntent'> = {},
) => {
  const parsed = canonicalize(input.command);
  const command = { ...parsed,
    clientOrderId: resolveLiveClientOrderId(parsed.clientOrderId, parsed.exchange) };
  const bound = await reserveExternalClientGrantOrder({ ...input, command }, { ...deps, bindIntent: true });
  if (!bound.intentId) return deny('RESERVATION_INTENT_UNAVAILABLE');
  return { ...bound, intentId: bound.intentId };
};

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
      if (deps.bindIntent) {
        if (existing.state === 'NOT_SUBMITTED') return deny('RESERVATION_NOT_DISPATCHABLE');
        const intent = await tx.liveOrderIntent.findUnique({ where: { clientOrderId: command.clientOrderId } });
        if (!intent || !intentMatchesCommandAndScope(intent, command) ||
            !await hasAtomicIntentBinding(tx, existing.id, intent.id)) {
          return deny('RESERVATION_INTENT_UNAVAILABLE');
        }
        return { reused: true, reservation: existing, intentId: intent.id };
      }
      return { reused: true, reservation: existing };
    }
    if (await tx.liveCreateOrderSubmission.findUnique({ where: { grantId: grant.id }, select: { id: true } })) {
      return deny('GRANT_PREVIOUS_OPERATION_UNRESOLVED');
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
    const intentId = deps.bindIntent ? await bindNewIntent(tx, command) : undefined;
    await tx.externalClientGrant.update({
      where: { id: grant.id },
      data: { usedActions: { increment: 1 }, usedQuoteAmount: { increment: quoteAmount } },
    });
    await tx.log.create({ data: {
      userId: grant.userId, botId: grant.botId, source: 'external_client_grant',
      actor: 'EXTERNAL_CLIENT', action: 'EXTERNAL_CLIENT_GRANT_RESERVED', level: 'INFO',
      message: 'External client allowance reserved', entityType: 'ExternalClientGrantReservation',
      entityId: reservation.id, metadata: { grantId: grant.id, clientOrderId: command.clientOrderId,
        commandHash, quoteAmount: quoteAmount.toFixed(8), currencyProof: marketProof.currencyProof,
        ...(intentId ? { boundIntentId: intentId } : {}) },
    } });
    return { reused: false, reservation, intentId };
  }, transactionOptions);
};

// Commit this state before any future network submit. A crash after commit is
// deliberately uncertain and retry must use venue lookup, never another submit.
export const beginExternalClientGrantSubmission = async (
  input: { reservationId: string; secret: string; requireLivePauseCheck?: boolean;
    requireBoundIntent?: boolean }, db: DbClient = prisma,
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
  if (input.requireBoundIntent && !await hasAtomicIntentBinding(tx, current.id, intent.id)) {
    return deny('RESERVATION_INTENT_UNAVAILABLE');
  }
  if (input.requireLivePauseCheck) {
    // Same advisory key as the existing pause writer and createOrder permit.
    // This is a transactional point-in-time gate; the later executor must
    // still hold the shared permit through the actual venue submit.
    await tx.$queryRaw`SELECT 1 AS locked FROM (SELECT pg_advisory_xact_lock_shared(${LIVE_EXECUTION_PAUSE_LOCK_KEY})) AS acquired`;
    const control = await tx.liveExecutionControl.findUnique({ where: { id: 'global' } });
    if (!control) return deny('LIVE_PAUSE_UNAVAILABLE');
    if (control.paused) return deny('LIVE_PRETRADE_PAUSED');
  }
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

// Legacy point-in-time gate only. It writes no durable pause marker and must
// never authorize an adapter call; new preparation uses atomic admission below.
export const beginBoundExternalClientGrantSubmission = (
  input: { reservationId: string; secret: string }, db: DbClient = prisma,
) => beginExternalClientGrantSubmission({ ...input, requireLivePauseCheck: true,
  requireBoundIntent: true }, db);

// Admission is a durable record, not a callback permit. No adapter consumes
// this return value. The marker and uncertain reservation commit together;
// a crash or retry leaves them lookup-only until explicit venue reconciliation.
export const admitBoundExternalClientGrantSubmission = async (
  input: { reservationId: string; secret: string },
  deps: { db?: DbClient; getSymbolRules?: SymbolRulesReader;
    expectedIntentPayloadHash?: string } = {},
) => {
  const db = deps.db ?? prisma;
  if (!secretPattern.test(input.secret)) return deny('GRANT_SCOPE_UNAVAILABLE');
  const preflight = await db.externalClientGrantReservation.findUnique({
    where: { id: input.reservationId }, select: { grantId: true, command: true, state: true },
  });
  if (!preflight) return deny('RESERVATION_UNAVAILABLE');
  const preflightGrant = await db.externalClientGrant.findUnique({
    where: { id: preflight.grantId }, select: { secretHash: true },
  });
  if (!preflightGrant || preflightGrant.secretHash !== secretHash(input.secret)) {
    return deny('GRANT_SCOPE_UNAVAILABLE');
  }
  const marketProof = preflight.state === 'RESERVED'
    ? await resolveQuoteAmount(canonicalize(preflight.command), deps.getSymbolRules ?? getExchangeSymbolRules)
    : null;
  return db.$transaction(async (tx) => {
    const found = await tx.externalClientGrantReservation.findUnique({ where: { id: input.reservationId } });
    if (!found) return deny('RESERVATION_UNAVAILABLE');
    const grant = await lockGrant(tx, found.grantId);
    const current = await tx.externalClientGrantReservation.findUnique({ where: { id: found.id } });
    if (!current) return deny('RESERVATION_UNAVAILABLE');
    const command = canonicalize(current.command);
    if (!secretPattern.test(input.secret) || grant.secretHash !== secretHash(input.secret)) {
      return deny('GRANT_SCOPE_UNAVAILABLE');
    }
    if (current.clientOrderId !== command.clientOrderId || current.commandHash !== fingerprint(command)) {
      return deny('RESERVATION_COMMAND_UNAVAILABLE');
    }
    const intent = await tx.liveOrderIntent.findUnique({ where: { clientOrderId: current.clientOrderId } });
    if (!intent || !intentMatchesCommandAndScope(intent, command) ||
        !await hasAtomicIntentBinding(tx, current.id, intent.id)) {
      return deny('RESERVATION_INTENT_UNAVAILABLE');
    }
    const intentPayload = intent.payload;
    if (!intentPayload || typeof intentPayload !== 'object' || Array.isArray(intentPayload) ||
        (intentPayload as Record<string, unknown>).mode !== 'LIVE' ||
        (intentPayload as Record<string, unknown>).riskAck !== true ||
        (intentPayload as Record<string, unknown>).clientOrderId !== command.clientOrderId ||
        (deps.expectedIntentPayloadHash && intent.payloadHash !== deps.expectedIntentPayloadHash)) {
      return deny('RESERVATION_INTENT_UNAVAILABLE');
    }
    if (current.state === 'SUBMISSION_UNCERTAIN') {
      const marker = await tx.liveCreateOrderSubmission.findUnique({ where: { reservationId: current.id } });
      if (!marker || marker.grantId !== grant.id || marker.intentId !== intent.id ||
          marker.clientOrderId !== command.clientOrderId) return deny('RESERVATION_NOT_DISPATCHABLE');
      return { markerId: marker.id, reservationId: current.id, intentId: intent.id,
        reused: true, lookupOnly: true } as const;
    }
    if (current.state !== 'RESERVED' || current.dispatchStartedAt) return deny('RESERVATION_NOT_DISPATCHABLE');
    if (await tx.liveCreateOrderSubmission.findUnique({ where: { grantId: grant.id }, select: { id: true } })) {
      return deny('GRANT_PREVIOUS_OPERATION_UNRESOLVED');
    }
    if (await tx.order.findUnique({ where: { id: intent.id }, select: { id: true } })) {
      return deny('RESERVATION_NOT_DISPATCHABLE');
    }
    await assertCurrentScope(tx, grant, input.secret, command);
    if (!marketProof || !marketProof.amount.eq(current.quoteAmount)) return deny('MARKET_EVIDENCE_CHANGED');
    // Grant row first, then the same shared key used by the global pause writer.
    // Delegated admission is blocked while paused even for reduce-only exits.
    const marketType = command.marketType === 'SPOT' ? 'spot'
      : command.exchange === 'BINANCE' ? 'future' : 'swap';
    await assertLiveCreateOrderPermittedInTransaction({ marketType, reduceOnly: false }, tx);
    await assertCurrentScope(tx, grant, input.secret, command);
    const marker = await tx.liveCreateOrderSubmission.create({ data: {
      grantId: grant.id, reservationId: current.id, intentId: intent.id,
      exchangeId: command.exchange, clientOrderId: command.clientOrderId,
      symbol: command.symbol, marketType, reduceOnly: command.reduceOnly,
    } });
    await tx.externalClientGrantReservation.update({ where: { id: current.id }, data: {
      state: 'SUBMISSION_UNCERTAIN', dispatchStartedAt: new Date(),
    } });
    await tx.log.create({ data: {
      userId: grant.userId, botId: grant.botId, source: 'external_client_grant',
      actor: 'SYSTEM', action: 'EXTERNAL_CLIENT_GRANT_ADMITTED', level: 'WARN',
      message: 'Delegated admission recorded; submit remains disabled and recovery is lookup only',
      entityType: 'ExternalClientGrantReservation', entityId: current.id,
      metadata: { grantId: grant.id, intentId: intent.id, markerId: marker.id,
        clientOrderId: command.clientOrderId },
    } });
    return { markerId: marker.id, reservationId: current.id, intentId: intent.id,
      reused: false, lookupOnly: true } as const;
  }, transactionOptions);
};

// The adapter seam shares the domain preflight and the durable admission, but
// returns no submit capability. In particular, an existing intent/marker is
// lookup-only after a crash or UNKNOWN outcome.
export const prepareBoundExternalClientGrantAdapterSeam = async (
  input: { reservationId: string; secret: string },
  deps: { db?: DbClient; getSymbolRules?: SymbolRulesReader } = {},
) => {
  const db = deps.db ?? prisma;
  if (!secretPattern.test(input.secret)) return deny('GRANT_SCOPE_UNAVAILABLE');
  const reservation = await db.externalClientGrantReservation.findUnique({
    where: { id: input.reservationId },
  });
  if (!reservation) return deny('RESERVATION_UNAVAILABLE');
  const grant = await db.externalClientGrant.findUnique({
    where: { id: reservation.grantId }, select: { secretHash: true },
  });
  if (!grant || grant.secretHash !== secretHash(input.secret)) return deny('GRANT_SCOPE_UNAVAILABLE');
  const command = canonicalize(reservation.command);
  if (reservation.clientOrderId !== command.clientOrderId ||
      reservation.commandHash !== fingerprint(command)) return deny('RESERVATION_COMMAND_UNAVAILABLE');
  const intent = await db.liveOrderIntent.findUnique({ where: { clientOrderId: command.clientOrderId } });
  if (!intent || !intentMatchesCommandAndScope(intent, command) ||
      !await hasAtomicIntentBinding(db, reservation.id, intent.id)) return deny('RESERVATION_INTENT_UNAVAILABLE');
  if (reservation.state === 'SUBMISSION_UNCERTAIN') {
    const recovered = await admitBoundExternalClientGrantSubmission(input, deps);
    return { ...recovered, clientOrderId: command.clientOrderId,
      domainRiskChecked: false, dispatchEnabled: false } as const;
  }
  if (reservation.state !== 'RESERVED' || reservation.dispatchStartedAt) {
    return deny('RESERVATION_NOT_DISPATCHABLE');
  }
  const rawPayload = intent.payload;
  if (!rawPayload || typeof rawPayload !== 'object' || Array.isArray(rawPayload) ||
      (rawPayload as Record<string, unknown>).mode !== 'LIVE' ||
      (rawPayload as Record<string, unknown>).riskAck !== true ||
      (rawPayload as Record<string, unknown>).clientOrderId !== command.clientOrderId) {
    return deny('RESERVATION_INTENT_UNAVAILABLE');
  }
  const payload: LiveOrderPayload = {
    botId: command.botId, walletId: command.walletId ?? undefined,
    strategyId: command.strategyId ?? undefined, positionId: command.positionId,
    symbol: command.symbol, side: command.side, type: command.type,
    quantity: representableNumber(command.quantity), price: representableNumber(command.limitPrice),
    reduceOnly: command.reduceOnly, mode: 'LIVE', riskAck: true,
    clientOrderId: command.clientOrderId,
  };
  const prepared = await prepareOpenOrderRiskContext(command.userId, payload);
  const canonical = prepared.canonicalPayload;
  const bot = prepared.liveBot;
  if (!bot || bot.exchange !== command.exchange || bot.marketType !== command.marketType ||
      canonical.mode !== 'LIVE' || canonical.botId !== command.botId ||
      (canonical.walletId ?? null) !== command.walletId ||
      (canonical.strategyId ?? null) !== command.strategyId ||
      (canonical.positionId ?? null) !== command.positionId ||
      canonical.clientOrderId !== command.clientOrderId ||
      canonical.symbol !== command.symbol || canonical.side !== command.side ||
      canonical.type !== command.type || (canonical.reduceOnly ?? false) !== command.reduceOnly ||
      !new Prisma.Decimal(canonical.quantity.toString()).eq(command.quantity) ||
      canonical.price == null || !new Prisma.Decimal(canonical.price.toString()).eq(command.limitPrice) ||
      intent.payloadHash !== fingerprintLiveOrderIntentPayload(command.userId, bot, canonical)) {
    return deny('DELEGATED_DOMAIN_COMMAND_MISMATCH');
  }
  const admitted = await admitBoundExternalClientGrantSubmission(input,
    { ...deps, expectedIntentPayloadHash: intent.payloadHash });
  return { ...admitted, clientOrderId: command.clientOrderId,
    domainRiskChecked: true, dispatchEnabled: false } as const;
};

const mockRequestSchema = z.strictObject({
  reservationId: z.uuid(), secret: z.string(),
  scenario: z.enum(delegatedMockScenarios).default('CERTAIN_FILL'),
});
const fixedMockSymbolRules: SymbolRulesReader = async (scope) => {
  if ((scope.exchange !== 'BINANCE' && scope.exchange !== 'GATEIO') ||
      scope.marketType !== 'FUTURES' || scope.symbol !== 'BTCUSDT') {
    return deny('DELEGATED_MOCK_MARKET_UNSUPPORTED');
  }
  return { minQuantity: 0.001, minNotional: 1, quantityStep: 0.001,
    priceStep: 0.01, contractSize: 1, quoteCurrency: 'USDT',
    settleCurrency: 'USDT', isContract: true, isLinear: true, isInverse: false };
};

// Test-database-only proof of the delegated lifecycle. It accepts plain data
// only and calls a fixed local transport; no caller-supplied function can run.
export async function executeBoundExternalClientGrantMock(
  input: z.input<typeof mockRequestSchema>,
) {
  if (arguments.length !== 1 || !input || typeof input !== 'object' || Array.isArray(input) ||
      Object.getPrototypeOf(input) !== Object.prototype) return deny('DELEGATED_MOCK_INVALID_INPUT');
  const fields = Object.getOwnPropertyDescriptors(input);
  if (Reflect.ownKeys(fields).some((key) => typeof key !== 'string' ||
      !['reservationId', 'secret', 'scenario'].includes(key) ||
      !('value' in fields[key]) || typeof fields[key].value === 'function')) {
    return deny('DELEGATED_MOCK_INVALID_INPUT');
  }
  const request = mockRequestSchema.safeParse(input);
  if (!request.success) return deny('DELEGATED_MOCK_INVALID_INPUT');
  let databaseName = '';
  try { databaseName = decodeURIComponent(new URL(process.env.DATABASE_URL ?? '').pathname); } catch { /* fail closed */ }
  if (process.env.NODE_ENV !== 'test' || !databaseName.endsWith('_test')) {
    return deny('DELEGATED_MOCK_TEST_DATABASE_REQUIRED');
  }
  const admitted = await prepareBoundExternalClientGrantAdapterSeam(request.data,
    { getSymbolRules: fixedMockSymbolRules });
  if (admitted.reused) return { ...admitted, orderId: null } as const;

  const reservation = await prisma.externalClientGrantReservation.findUniqueOrThrow({
    where: { id: admitted.reservationId },
  });
  const command = canonicalize(reservation.command);
  const intent = await prisma.liveOrderIntent.findUniqueOrThrow({ where: { id: admitted.intentId } });
  if (reservation.state !== 'SUBMISSION_UNCERTAIN' ||
      reservation.clientOrderId !== command.clientOrderId ||
      intent.clientOrderId !== command.clientOrderId ||
      !intentMatchesCommandAndScope(intent, command)) return deny('RESERVATION_INTENT_UNAVAILABLE');
  const payload = intent.payload as LiveOrderPayload;
  const prepared = await prepareOpenOrderRiskContext(command.userId, payload);
  if (!prepared.liveBot ||
      fingerprintLiveOrderIntentPayload(command.userId, prepared.liveBot, prepared.canonicalPayload) !==
        intent.payloadHash) return deny('DELEGATED_DOMAIN_COMMAND_MISMATCH');
  if ((command.exchange !== 'BINANCE' && command.exchange !== 'GATEIO') ||
      command.marketType !== 'FUTURES' || command.symbol !== 'BTCUSDT') {
    return deny('DELEGATED_MOCK_MARKET_UNSUPPORTED');
  }

  await prisma.log.create({ data: {
    userId: command.userId, botId: command.botId, source: 'external_client_grant',
    actor: 'SYSTEM', action: 'EXTERNAL_CLIENT_GRANT_MOCK_TRANSPORT_STARTED', level: 'INFO',
    message: 'Fixed delegated mock transport entered',
    entityType: 'ExternalClientGrantReservation', entityId: reservation.id,
    metadata: { scenario: request.data.scenario, clientOrderId: command.clientOrderId },
  } });
  let result: LiveExecutionResult;
  try {
    result = await runDelegatedMockTransport({ exchange: command.exchange,
      symbol: command.symbol, side: command.side,
      quantity: command.quantity, limitPrice: command.limitPrice,
      clientOrderId: command.clientOrderId, scenario: request.data.scenario });
  } catch {
    return deny('DELEGATED_MOCK_OUTCOME_UNKNOWN');
  }
  const fills = result.fills ?? [];
  const fillQuantity = fills.reduce((total, fill) => total.add(fill.quantity), new Prisma.Decimal(0));
  if (result.status !== 'FILLED' || !result.exchangeOrderId?.startsWith('mock-') ||
      !Number.isFinite(result.exchangeFilledQuantity) ||
      !new Prisma.Decimal(result.exchangeFilledQuantity!).eq(command.quantity) ||
      !Number.isFinite(result.exchangeAverageFillPrice) ||
      result.exchangeAverageFillPrice! <= 0 || fills.length === 0 ||
      !fillQuantity.eq(command.quantity) || fills.some((fill) =>
        fill.symbol !== command.symbol || fill.side !== command.side ||
        (fill.exchangeOrderId != null && fill.exchangeOrderId !== result.exchangeOrderId) ||
        !Number.isFinite(fill.quantity) || fill.quantity <= 0 ||
        !Number.isFinite(fill.price) || fill.price <= 0 ||
        !Number.isFinite(fill.notional) || fill.notional <= 0)) {
    return deny('DELEGATED_MOCK_OUTCOME_UNKNOWN');
  }
  const order = await materializeAdmittedMockLiveOrder({ userId: command.userId,
    bot: prepared.liveBot, payload: prepared.canonicalPayload,
    intentId: intent.id, liveResult: result });
  if (order.id !== intent.id || order.status !== 'FILLED' || !order.positionId ||
      !new Prisma.Decimal(order.filledQuantity.toString()).eq(command.quantity)) {
    return deny('DELEGATED_MOCK_OUTCOME_UNKNOWN');
  }
  const reconciled = await reconcileSubmittedExternalClientGrantReservation(reservation.id);
  if (reconciled.state !== 'SUBMITTED' || reconciled.proofRef !== order.id) {
    return deny('DELEGATED_MOCK_OUTCOME_UNKNOWN');
  }
  if (request.data.scenario === 'HOLD_AFTER_RECONCILE') {
    await new Promise<void>((resolve) => setTimeout(resolve, 10_000));
  }
  const cleared = await prisma.liveCreateOrderSubmission.deleteMany({ where: {
    id: admitted.markerId, grantId: reservation.grantId,
    reservationId: reservation.id, intentId: intent.id,
  } });
  if (cleared.count !== 1) return deny('DELEGATED_MOCK_MARKER_CLEAR_UNCONFIRMED');
  return { reservationId: reservation.id, intentId: intent.id,
    clientOrderId: command.clientOrderId, orderId: order.id,
    submitted: true, dispatchEnabled: false } as const;
}

const mockFinalizeSchema = z.strictObject({ reservationId: z.uuid(), secret: z.string() });
const mockAuditMetadata = (value: unknown): Record<string, unknown> | null =>
  value && typeof value === 'object' && !Array.isArray(value)
    ? value as Record<string, unknown> : null;
const exactMockNumber = (value: number | null, expected: Prisma.Decimal.Value) =>
  value != null && Number.isFinite(value) && new Prisma.Decimal(value.toString()).eq(expected);

// Only a fully durable fixed-mock result can retire an orphaned blocker.
// The grant row and shared pause key serialize this readback and marker delete
// with human revoke and pause. No transport or adapter is called on recovery.
export async function finalizeBoundExternalClientGrantMockOrphan(
  input: z.input<typeof mockFinalizeSchema>,
) {
  if (arguments.length !== 1 || !input || typeof input !== 'object' || Array.isArray(input) ||
      Object.getPrototypeOf(input) !== Object.prototype) return deny('DELEGATED_MOCK_INVALID_INPUT');
  const fields = Object.getOwnPropertyDescriptors(input);
  if (Reflect.ownKeys(fields).some((key) => typeof key !== 'string' ||
      !['reservationId', 'secret'].includes(key) ||
      !('value' in fields[key]) || typeof fields[key].value === 'function')) {
    return deny('DELEGATED_MOCK_INVALID_INPUT');
  }
  const request = mockFinalizeSchema.safeParse(input);
  if (!request.success) return deny('DELEGATED_MOCK_INVALID_INPUT');
  let databaseName = '';
  try { databaseName = decodeURIComponent(new URL(process.env.DATABASE_URL ?? '').pathname); } catch { /* fail closed */ }
  if (process.env.NODE_ENV !== 'test' || !databaseName.endsWith('_test')) {
    return deny('DELEGATED_MOCK_TEST_DATABASE_REQUIRED');
  }
  if (!secretPattern.test(request.data.secret)) return deny('GRANT_SCOPE_UNAVAILABLE');
  return prisma.$transaction(async (tx) => {
    const found = await tx.externalClientGrantReservation.findUnique({
      where: { id: request.data.reservationId }, select: { grantId: true },
    });
    if (!found) return deny('DELEGATED_MOCK_ORPHAN_UNKNOWN');
    const grant = await lockGrant(tx, found.grantId);
    await tx.$queryRaw`SELECT 1 AS locked FROM (SELECT pg_advisory_xact_lock_shared(${LIVE_EXECUTION_PAUSE_LOCK_KEY})) AS acquired`;
    if (grant.secretHash !== secretHash(request.data.secret)) return deny('GRANT_SCOPE_UNAVAILABLE');
    const reservation = await tx.externalClientGrantReservation.findUniqueOrThrow({
      where: { id: request.data.reservationId },
    });
    const command = canonicalize(reservation.command);
    if (reservation.grantId !== grant.id || reservation.commandHash !== fingerprint(command) ||
        reservation.clientOrderId !== command.clientOrderId ||
        reservation.state !== 'SUBMITTED' || !reservation.dispatchStartedAt ||
        !reservation.resolvedAt || reservation.proofType !== 'DURABLE_ORDER' ||
        grant.userId !== command.userId || grant.botId !== command.botId ||
        grant.exchange !== command.exchange || grant.marketType !== command.marketType ||
        grant.symbol !== command.symbol || grant.action !== command.action ||
        grant.usedActions < 1 || grant.usedQuoteAmount.lt(reservation.quoteAmount) ||
        (command.exchange !== 'BINANCE' && command.exchange !== 'GATEIO') ||
        command.marketType !== 'FUTURES' || command.symbol !== 'BTCUSDT' ||
        !reservation.quoteAmount.eq(new Prisma.Decimal(command.quantity).mul(command.limitPrice))) {
      return deny('DELEGATED_MOCK_ORPHAN_UNKNOWN');
    }
    const intent = await tx.liveOrderIntent.findUnique({ where: { clientOrderId: command.clientOrderId } });
    const payload = intent?.payload;
    if (!intent || !intentMatchesCommandAndScope(intent, command) ||
        !await hasAtomicIntentBinding(tx, reservation.id, intent.id) ||
        !payload || typeof payload !== 'object' || Array.isArray(payload) ||
        Object.keys(payload).some((key) => !['botId', 'walletId', 'strategyId', 'positionId',
          'symbol', 'side', 'type', 'quantity', 'price', 'reduceOnly', 'mode', 'riskAck',
          'clientOrderId'].includes(key)) ||
        (payload as Record<string, unknown>).mode !== 'LIVE' ||
        (payload as Record<string, unknown>).riskAck !== true ||
        (payload as Record<string, unknown>).clientOrderId !== command.clientOrderId ||
        intent.payloadHash !== fingerprintLiveOrderIntentPayload(command.userId, {
          id: command.botId, exchange: command.exchange, marketType: command.marketType,
          positionMode: 'ONE_WAY', apiKeyId: null, walletId: command.walletId,
        }, payload as LiveOrderPayload)) return deny('DELEGATED_MOCK_ORPHAN_UNKNOWN');
    const marker = await tx.liveCreateOrderSubmission.findUnique({ where: { reservationId: reservation.id } });
    const order = await tx.order.findUnique({ where: { id: intent.id } });
    const expectedExchangeId = `mock-${command.exchange.toLowerCase()}-${command.clientOrderId}`;
    if (!order || reservation.proofRef !== order.id || order.userId !== command.userId ||
        order.botId !== command.botId || order.walletId !== command.walletId ||
        order.strategyId !== command.strategyId || !order.positionId ||
        (command.positionId != null && order.positionId !== command.positionId) ||
        order.origin !== 'USER' || order.status !== 'FILLED' || !order.filledAt ||
        order.symbol !== command.symbol || order.side !== command.side || order.type !== command.type ||
        order.exchangeOrderId !== expectedExchangeId ||
        !exactMockNumber(order.quantity, command.quantity) ||
        !exactMockNumber(order.filledQuantity, command.quantity) ||
        !exactMockNumber(order.price, command.limitPrice) ||
        !exactMockNumber(order.averageFillPrice, command.limitPrice)) {
      return deny('DELEGATED_MOCK_ORPHAN_UNKNOWN');
    }
    const fills = await tx.orderFill.findMany({ where: { orderId: order.id } });
    const fill = fills[0];
    const position = await tx.position.findUnique({ where: { id: order.positionId } });
    if (marker && (fills.length !== 1 || !fill || fill.userId !== command.userId ||
        fill.botId !== command.botId || fill.strategyId !== command.strategyId ||
        fill.positionId !== order.positionId || fill.symbol !== command.symbol ||
        fill.side !== command.side ||
        fill.exchangeTradeId !== `mock-fill-${command.clientOrderId}` ||
        !exactMockNumber(fill.quantity, command.quantity) ||
        !exactMockNumber(fill.price, command.limitPrice) ||
        !exactMockNumber(fill.notional, reservation.quoteAmount) ||
        fill.feeCost !== 0.05 || fill.feeRate !== 0.001 || fill.feeCurrency !== 'USDT' ||
        fill.executedAt.getTime() !== 0 || mockAuditMetadata(fill.raw)?.mock !== true ||
        !position || position.userId !== command.userId || position.botId !== command.botId ||
        position.walletId !== command.walletId || position.strategyId !== command.strategyId ||
        position.symbol !== command.symbol || position.side !== (command.side === 'BUY' ? 'LONG' : 'SHORT') ||
        position.status !== 'OPEN' || !Number.isFinite(position.quantity) ||
        new Prisma.Decimal(position.quantity.toString()).lt(command.quantity))) {
      return deny('DELEGATED_MOCK_ORPHAN_UNKNOWN');
    }
    const audits = await tx.log.findMany({ where: {
      entityType: 'ExternalClientGrantReservation', entityId: reservation.id,
      action: { in: ['EXTERNAL_CLIENT_GRANT_ADMITTED',
        'EXTERNAL_CLIENT_GRANT_MOCK_TRANSPORT_STARTED',
        'EXTERNAL_CLIENT_GRANT_SUBMITTED_RECONCILED',
        'EXTERNAL_CLIENT_GRANT_MOCK_ORPHAN_FINALIZED'] },
    }, select: { action: true, metadata: true } });
    const one = (action: string) => {
      const matching = audits.filter((audit) => audit.action === action);
      return matching.length === 1 ? mockAuditMetadata(matching[0].metadata) : null;
    };
    const admitted = one('EXTERNAL_CLIENT_GRANT_ADMITTED');
    const started = one('EXTERNAL_CLIENT_GRANT_MOCK_TRANSPORT_STARTED');
    const reconciled = one('EXTERNAL_CLIENT_GRANT_SUBMITTED_RECONCILED');
    const finalizedRows = audits.filter((audit) =>
      audit.action === 'EXTERNAL_CLIENT_GRANT_MOCK_ORPHAN_FINALIZED');
    if (finalizedRows.length !== (marker ? 0 : 1)) {
      return deny('DELEGATED_MOCK_ORPHAN_UNKNOWN');
    }
    const finalized = finalizedRows.length === 1 ? mockAuditMetadata(finalizedRows[0].metadata) : null;
    const markerId = admitted?.markerId;
    if (typeof markerId !== 'string' || admitted?.intentId !== intent.id ||
        admitted?.grantId !== grant.id || admitted?.clientOrderId !== command.clientOrderId ||
        !['CERTAIN_FILL', 'DELAYED_FILL', 'HOLD_AFTER_RECONCILE'].includes(String(started?.scenario)) ||
        started?.clientOrderId !== command.clientOrderId ||
        reconciled?.grantId !== grant.id || reconciled?.orderId !== order.id ||
        reconciled?.clientOrderId !== command.clientOrderId) {
      return deny('DELEGATED_MOCK_ORPHAN_UNKNOWN');
    }
    if (!marker) {
      if (finalized?.grantId !== grant.id || finalized?.intentId !== intent.id ||
          finalized?.markerId !== markerId || finalized?.orderId !== order.id ||
          finalized?.clientOrderId !== command.clientOrderId) {
        return deny('DELEGATED_MOCK_ORPHAN_UNKNOWN');
      }
      return { reservationId: reservation.id, intentId: intent.id, orderId: order.id,
        markerId, reused: true, finalized: true } as const;
    }
    const expectedMarketType = command.exchange === 'BINANCE' ? 'future' : 'swap';
    if (grant.revokedAt || finalized || marker.id !== markerId || marker.grantId !== grant.id ||
        marker.reservationId !== reservation.id || marker.intentId !== intent.id ||
        marker.clientOrderId !== command.clientOrderId || marker.exchangeId !== command.exchange ||
        marker.symbol !== command.symbol || marker.marketType !== expectedMarketType ||
        marker.reduceOnly !== command.reduceOnly) return deny('DELEGATED_MOCK_ORPHAN_UNKNOWN');
    await tx.liveCreateOrderSubmission.delete({ where: { id: marker.id } });
    await tx.log.create({ data: {
      userId: command.userId, botId: command.botId, source: 'external_client_grant',
      actor: 'SYSTEM', action: 'EXTERNAL_CLIENT_GRANT_MOCK_ORPHAN_FINALIZED', level: 'INFO',
      message: 'Fixed mock orphan marker finalized from durable Order and reservation',
      entityType: 'ExternalClientGrantReservation', entityId: reservation.id,
      metadata: { grantId: grant.id, markerId: marker.id, intentId: intent.id,
        orderId: order.id, clientOrderId: command.clientOrderId },
    } });
    return { reservationId: reservation.id, intentId: intent.id, orderId: order.id,
      markerId: marker.id, reused: false, finalized: true } as const;
  }, { ...transactionOptions, isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
}

// Fail closed: an interactive Prisma transaction can time out and release its
// locks while an awaited callback is still running. Until a venue call has a
// proven deadline and confirmed termination, this seam cannot authorize it.
// Reject before beginBound so a denied attempt does not consume dispatch state.
export const withFreshBoundExternalClientGrantSubmitPermit = async (
  _input: { reservationId: string; secret: string },
  _submit: (bound: { command: GrantLimitCommand; intentId: string }) => Promise<unknown>,
  _db: DbClient = prisma,
): Promise<never> => deny('DELEGATED_SUBMIT_PERMIT_DISABLED');

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
