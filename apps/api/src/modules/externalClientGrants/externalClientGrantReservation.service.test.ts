import { spawn } from 'node:child_process';
import { Exchange, Prisma, PrismaClient, TradeMarket } from '@prisma/client';
import { afterEach, describe, expect, it } from 'vitest';
import { prisma } from '../../prisma/client';
import { hashPassword } from '../../utils/hash';
import { __resetExchangeSymbolRulesCacheForTests, getExchangeSymbolRules } from '../exchange/exchangeSymbolRules.service';
import { persistOrReuseLiveOrderIntent } from '../orders/orders.liveIntent.service';
import { LIVE_EXECUTION_PAUSE_LOCK_KEY, setLiveExecutionPause } from '../orders/liveExecutionPause.service';
import { ensureSubscriptionCatalog, setActiveSubscriptionForUser } from '../subscriptions/subscriptions.service';
import { createExternalClientGrant, revokeExternalClientGrant } from './externalClientGrants.service';
import {
  admitBoundExternalClientGrantSubmission, beginBoundExternalClientGrantSubmission,
  beginExternalClientGrantSubmission,
  bindExternalClientGrantReservationIntent, reconcileSubmittedExternalClientGrantReservation,
  refundUnsentExternalClientGrantReservation, reserveExternalClientGrantOrder,
  withFreshBoundExternalClientGrantSubmitPermit,
  type GrantLimitCommand,
} from './externalClientGrantReservation.service';

const users: string[] = [];
const rules = async () => ({ minQuantity: 0.001, minNotional: 1, quantityStep: 0.001, priceStep: 0.01,
  contractSize: 1, quoteCurrency: 'USDT', settleCurrency: 'USDT', isContract: true, isLinear: true, isInverse: false });
const assertTestDb = () => {
  if (!decodeURIComponent(new URL(process.env.DATABASE_URL ?? '').pathname).endsWith('_test')) {
    throw new Error('Reservation tests require an isolated _test database');
  }
};

afterEach(async () => {
  for (const userId of users.splice(0)) {
    await prisma.liveCreateOrderSubmission.deleteMany({ where: { grant: { userId } } });
    await prisma.order.deleteMany({ where: { userId } });
    await prisma.liveOrderIntent.deleteMany({ where: { userId } });
    await prisma.log.deleteMany({ where: { userId } });
    await prisma.externalClientGrant.deleteMany({ where: { userId } });
    await prisma.botMarketGroup.deleteMany({ where: { userId } });
    await prisma.bot.deleteMany({ where: { userId } });
    await prisma.symbolGroup.deleteMany({ where: { userId } });
    await prisma.marketUniverse.deleteMany({ where: { userId } });
    await prisma.userSubscription.deleteMany({ where: { userId } });
    await prisma.user.delete({ where: { id: userId } });
  }
});

const fixture = async (
  limits = { maxActionQuoteAmount: '50', maxTotalQuoteAmount: '100', maxActions: 2 },
  exchange: Exchange = 'BINANCE', marketType: TradeMarket = 'FUTURES',
) => {
  assertTestDb();
  const user = await prisma.user.create({ data: {
    email: `reservation-${crypto.randomUUID()}@example.com`, password: await hashPassword('GrantTest1234'),
  } });
  users.push(user.id);
  await ensureSubscriptionCatalog(prisma);
  await setActiveSubscriptionForUser(prisma, {
    userId: user.id, planCode: 'ADVANCED', source: 'ADMIN_OVERRIDE', autoRenew: false,
  });
  const universe = await prisma.marketUniverse.create({ data: {
    userId: user.id, name: 'Reservation universe', exchange, marketType, baseCurrency: 'USDT',
  } });
  const group = await prisma.symbolGroup.create({ data: {
    userId: user.id, marketUniverseId: universe.id, name: 'BTC', symbols: ['BTCUSDT'],
  } });
  const bot = await prisma.bot.create({ data: {
    userId: user.id, name: 'Reservation bot', mode: 'LIVE', exchange, marketType,
    isActive: true, liveOptIn: true, symbolGroupId: group.id,
  } });
  const { grant, secret } = await createExternalClientGrant(user.id, {
    botId: bot.id, clientLabel: 'Test external client', exchange, marketType,
    symbol: 'BTCUSDT', action: 'PLACE_LIVE_ORDER', ...limits, ttlSeconds: 3600, password: 'GrantTest1234',
  });
  const command: GrantLimitCommand = {
    userId: user.id, botId: bot.id, exchange, marketType,
    symbol: 'BTCUSDT', action: 'PLACE_LIVE_ORDER', clientOrderId: `soar_${crypto.randomUUID().replace(/-/g, '').slice(0, 22)}`,
    side: 'BUY', type: 'LIMIT', quantity: '0.5', limitPrice: '100', reduceOnly: false,
    walletId: null, strategyId: null, positionId: null,
  };
  return { user, bot, group, grant, secret, command };
};

const reserve = (f: Awaited<ReturnType<typeof fixture>>, command = f.command, db?: PrismaClient) =>
  reserveExternalClientGrantOrder({ grantId: f.grant.id, secret: f.secret, command }, { db, getSymbolRules: rules });
const bind = (f: Awaited<ReturnType<typeof fixture>>, command = f.command, db?: PrismaClient) =>
  bindExternalClientGrantReservationIntent({ grantId: f.grant.id, secret: f.secret, command },
    { db, getSymbolRules: rules });
const admit = (f: Awaited<ReturnType<typeof fixture>>, reservationId: string, db?: PrismaClient) =>
  admitBoundExternalClientGrantSubmission({ reservationId, secret: f.secret }, { db, getSymbolRules: rules });
const counters = async (id: string) => prisma.externalClientGrant.findUniqueOrThrow({
  where: { id }, select: { usedActions: true, usedQuoteAmount: true },
});
const createMatchingIntent = async (f: Awaited<ReturnType<typeof fixture>>, command = f.command) =>
  prisma.liveOrderIntent.create({ data: {
    userId: f.user.id, clientOrderId: command.clientOrderId, payloadHash: 'test-hash',
    payload: { ...command, quantity: Number(command.quantity), price: Number(command.limitPrice) }, exchange: 'BINANCE',
    marketType: 'FUTURES', symbol: 'BTCUSDT',
  } });

const settleWithin = async <T>(task: Promise<T>, milliseconds: number): Promise<T> => {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([task, new Promise<never>((_, reject) => {
      timer = setTimeout(() => reject(new Error('Database operation did not settle')), milliseconds);
    })]);
  } finally { if (timer) clearTimeout(timer); }
};

const startAdmissionWorker = (operation: 'admit' | 'crash-after-admission',
  reservationId: string, secret: string) => {
  const worker = spawn(process.execPath, ['--import', 'tsx',
    'src/modules/externalClientGrants/externalClientGrantReservation.processProof.worker.ts'], {
    cwd: process.cwd(), env: process.env, windowsHide: true,
  });
  let output = '';
  let errors = '';
  let started!: () => void;
  const ready = new Promise<void>((resolve) => { started = resolve; });
  worker.stdout.on('data', (chunk) => {
    output += chunk.toString();
    if (output.includes('STARTED\n')) started();
  });
  worker.stderr.on('data', (chunk) => { errors += chunk.toString(); });
  const completion = new Promise<number | null>((resolve) => worker.on('close', resolve));
  worker.stdin.end(`${JSON.stringify({ operation, reservationId, secret })}\n`);
  return { ready, completion, output: () => output, errors: () => errors };
};

describe('external client grant atomic reservation', () => {
  it('commits a bound marker and uncertain reservation across process exit; retry is lookup-only', async () => {
    const f = await fixture();
    const originalControl = await prisma.liveExecutionControl.findUnique({ where: { id: 'global' } });
    const restarted = new PrismaClient();
    try {
      await prisma.liveExecutionControl.upsert({ where: { id: 'global' },
        create: { id: 'global', paused: false, reason: 'test available', version: 1 },
        update: { paused: false, reason: 'test available' } });
      await prisma.user.update({ where: { id: f.user.id }, data: { role: 'ADMIN' } });
      const control = await prisma.liveExecutionControl.findUniqueOrThrow({ where: { id: 'global' } });
      const bound = await bind(f);
      const worker = startAdmissionWorker('crash-after-admission', bound.reservation.id, f.secret);
      expect(await settleWithin(worker.completion, 15_000)).toBe(75);
      expect(worker.errors()).toBe('');
      const line = worker.output().split('\n').find((entry) => entry.startsWith('ADMITTED '));
      expect(line).toBeTruthy();
      const first = JSON.parse(line!.slice(9)) as { markerId: string; reused: boolean; lookupOnly: boolean };
      expect(first).toMatchObject({ reused: false, lookupOnly: true });
      const marker = await restarted.liveCreateOrderSubmission.findUniqueOrThrow({ where: { id: first.markerId } });
      expect(marker).toMatchObject({ grantId: f.grant.id, reservationId: bound.reservation.id,
        intentId: bound.intentId, clientOrderId: bound.reservation.clientOrderId });
      expect((await restarted.externalClientGrantReservation.findUniqueOrThrow({
        where: { id: bound.reservation.id },
      })).state).toBe('SUBMISSION_UNCERTAIN');
      expect(await admit(f, bound.reservation.id, restarted)).toMatchObject({
        markerId: first.markerId, reused: true, lookupOnly: true,
      });
      await restarted.externalClientGrant.update({ where: { id: f.grant.id },
        data: { expiresAt: new Date(0) } });
      expect(await admit(f, bound.reservation.id, restarted)).toMatchObject({
        markerId: first.markerId, reused: true, lookupOnly: true,
      });
      await expect(admitBoundExternalClientGrantSubmission({
        reservationId: bound.reservation.id, secret: `${f.secret}wrong`,
      }, { db: restarted, getSymbolRules: rules })).rejects.toMatchObject({ code: 'GRANT_SCOPE_UNAVAILABLE' });
      expect(await restarted.liveCreateOrderSubmission.count({ where: { grantId: f.grant.id } })).toBe(1);
      expect(await restarted.log.count({ where: { userId: f.user.id,
        action: 'EXTERNAL_CLIENT_GRANT_ADMITTED' } })).toBe(1);
      expect(await counters(f.grant.id)).toMatchObject({ usedActions: 1,
        usedQuoteAmount: new Prisma.Decimal(50) });
      await expect(setLiveExecutionPause({ actorUserId: f.user.id, paused: true,
        reason: 'Unresolved delegated marker', expectedVersion: control.version }, restarted))
        .rejects.toMatchObject({ code: 'LIVE_PAUSE_SUBMISSION_IN_FLIGHT' });
      await expect(revokeExternalClientGrant(f.user.id, f.grant.id, restarted))
        .rejects.toMatchObject({ status: 409 });
      expect((await restarted.externalClientGrant.findUniqueOrThrow({ where: { id: f.grant.id } })).revokedAt)
        .toBeNull();
      expect(await restarted.order.count({ where: { userId: f.user.id } })).toBe(0);
    } finally {
      await restarted.$disconnect();
      if (originalControl) await prisma.liveExecutionControl.update({ where: { id: 'global' }, data: {
        paused: originalControl.paused, reason: originalControl.reason, version: originalControl.version,
        changedAt: originalControl.changedAt, changedByUserId: originalControl.changedByUserId,
      } });
      else await prisma.liveExecutionControl.deleteMany({ where: { id: 'global' } });
    }
  }, 25_000);

  it('serializes cross-process admission with human pause and revoke', async () => {
    const f = await fixture();
    const originalControl = await prisma.liveExecutionControl.findUnique({ where: { id: 'global' } });
    const otherDb = new PrismaClient();
    try {
      await prisma.liveExecutionControl.upsert({ where: { id: 'global' },
        create: { id: 'global', paused: false, reason: 'test available', version: 1 },
        update: { paused: false, reason: 'test available' } });
      await prisma.user.update({ where: { id: f.user.id }, data: { role: 'ADMIN' } });
      const control = await prisma.liveExecutionControl.findUniqueOrThrow({ where: { id: 'global' } });
      const bound = await bind(f);
      const worker = startAdmissionWorker('admit', bound.reservation.id, f.secret);
      await settleWithin(worker.ready, 5_000);
      const [pause, revoke, exitCode] = await settleWithin(Promise.all([
        setLiveExecutionPause({ actorUserId: f.user.id, paused: true,
          reason: 'Concurrent admission pause', expectedVersion: control.version }, otherDb)
          .then(() => 'committed' as const, (error: { code?: string }) => error.code ?? 'failed'),
        revokeExternalClientGrant(f.user.id, f.grant.id)
          .then(() => 'committed' as const, (error: { status?: number }) => error.status ?? 0),
        worker.completion,
      ]), 20_000);
      expect({ exitCode, errors: worker.errors() }).toEqual({ exitCode: 0, errors: '' });
      const line = worker.output().split('\n').find((entry) => entry.startsWith('RESULT '));
      expect(line).toBeTruthy();
      const result = JSON.parse(line!.slice(7)) as { markerId?: string; error?: string };
      const marker = await prisma.liveCreateOrderSubmission.findUnique({
        where: { reservationId: bound.reservation.id },
      });
      const reservation = await prisma.externalClientGrantReservation.findUniqueOrThrow({
        where: { id: bound.reservation.id },
      });
      if (result.markerId) {
        expect(marker?.id).toBe(result.markerId);
        expect(reservation.state).toBe('SUBMISSION_UNCERTAIN');
        expect(pause).toBe('LIVE_PAUSE_SUBMISSION_IN_FLIGHT');
        expect(revoke).toBe(409);
        expect((await prisma.liveExecutionControl.findUniqueOrThrow({ where: { id: 'global' } })).paused)
          .toBe(false);
        expect((await prisma.externalClientGrant.findUniqueOrThrow({ where: { id: f.grant.id } })).revokedAt)
          .toBeNull();
      } else {
        expect(result.error).toMatch(/GRANT_SCOPE_UNAVAILABLE|LIVE_PRETRADE_PAUSED/);
        expect(marker).toBeNull();
        expect(reservation.state).toBe('RESERVED');
        expect(pause === 'committed' || revoke === 'committed').toBe(true);
      }
      expect(await prisma.order.count({ where: { userId: f.user.id } })).toBe(0);
    } finally {
      await otherDb.$disconnect();
      if (originalControl) await prisma.liveExecutionControl.update({ where: { id: 'global' }, data: {
        paused: originalControl.paused, reason: originalControl.reason, version: originalControl.version,
        changedAt: originalControl.changedAt, changedByUserId: originalControl.changedByUserId,
      } });
      else await prisma.liveExecutionControl.deleteMany({ where: { id: 'global' } });
    }
  }, 30_000);

  it('does not charge a second command while a reconciled reservation still has a marker', async () => {
    const f = await fixture();
    const originalControl = await prisma.liveExecutionControl.findUnique({ where: { id: 'global' } });
    try {
      await prisma.liveExecutionControl.upsert({ where: { id: 'global' },
        create: { id: 'global', paused: false, reason: 'test available', version: 1 },
        update: { paused: false, reason: 'test available' } });
      const bound = await bind(f);
      const admitted = await admit(f, bound.reservation.id);
      expect(admitted.reused).toBe(false);
      await prisma.order.create({ data: {
        id: bound.intentId, userId: f.user.id, botId: f.bot.id,
        symbol: f.command.symbol, side: f.command.side, type: f.command.type,
        quantity: Number(f.command.quantity), price: Number(f.command.limitPrice),
        exchangeOrderId: 'mock-reconciliation-identity',
      } });
      expect((await reconcileSubmittedExternalClientGrantReservation(bound.reservation.id)).state)
        .toBe('SUBMITTED');
      const next = { ...f.command,
        clientOrderId: `soar_${crypto.randomUUID().replace(/-/g, '').slice(0, 22)}` };
      await expect(bind(f, next)).rejects.toMatchObject({ code: 'GRANT_PREVIOUS_OPERATION_UNRESOLVED' });
      expect(await counters(f.grant.id)).toMatchObject({ usedActions: 1,
        usedQuoteAmount: new Prisma.Decimal(50) });
      expect(await prisma.externalClientGrantReservation.count({ where: { grantId: f.grant.id } })).toBe(1);
      expect(await prisma.liveCreateOrderSubmission.count({ where: { grantId: f.grant.id } })).toBe(1);
    } finally {
      if (originalControl) await prisma.liveExecutionControl.update({ where: { id: 'global' }, data: {
        paused: originalControl.paused, reason: originalControl.reason, version: originalControl.version,
        changedAt: originalControl.changedAt, changedByUserId: originalControl.changedByUserId,
      } });
      else await prisma.liveExecutionControl.deleteMany({ where: { id: 'global' } });
    }
  });

  it('records the canonical Gate.io Futures identity in the delegated marker', async () => {
    const f = await fixture(undefined, 'GATEIO');
    const originalControl = await prisma.liveExecutionControl.findUnique({ where: { id: 'global' } });
    try {
      await prisma.liveExecutionControl.upsert({ where: { id: 'global' },
        create: { id: 'global', paused: false, reason: 'test available', version: 1 },
        update: { paused: false, reason: 'test available' } });
      const bound = await bind(f, { ...f.command, clientOrderId: 'gate-admission-test' });
      const admitted = await admit(f, bound.reservation.id);
      expect(await prisma.liveCreateOrderSubmission.findUniqueOrThrow({ where: { id: admitted.markerId } }))
        .toMatchObject({ exchangeId: 'GATEIO', marketType: 'swap',
          clientOrderId: bound.reservation.clientOrderId, grantId: f.grant.id,
          reservationId: bound.reservation.id, intentId: bound.intentId });
      expect(await prisma.order.count({ where: { userId: f.user.id } })).toBe(0);
    } finally {
      if (originalControl) await prisma.liveExecutionControl.update({ where: { id: 'global' }, data: {
        paused: originalControl.paused, reason: originalControl.reason, version: originalControl.version,
        changedAt: originalControl.changedAt, changedByUserId: originalControl.changedByUserId,
      } });
      else await prisma.liveExecutionControl.deleteMany({ where: { id: 'global' } });
    }
  });

  it('rechecks market proof and current scope before admission without charging twice', async () => {
    const f = await fixture();
    const originalControl = await prisma.liveExecutionControl.findUnique({ where: { id: 'global' } });
    try {
      await prisma.liveExecutionControl.upsert({ where: { id: 'global' },
        create: { id: 'global', paused: false, reason: 'test available', version: 1 },
        update: { paused: false, reason: 'test available' } });
      const bound = await bind(f);
      await expect(admitBoundExternalClientGrantSubmission({
        reservationId: bound.reservation.id, secret: f.secret,
      }, { getSymbolRules: async () => ({ ...await rules(), contractSize: 2 }) }))
        .rejects.toMatchObject({ code: 'MARKET_EVIDENCE_CHANGED' });
      await prisma.liveExecutionControl.update({ where: { id: 'global' }, data: { paused: true } });
      await expect(admit(f, bound.reservation.id)).rejects.toMatchObject({ code: 'LIVE_PRETRADE_PAUSED' });
      await prisma.liveExecutionControl.update({ where: { id: 'global' }, data: { paused: false } });
      const assignment = await prisma.botMarketGroup.create({ data: {
        userId: f.user.id, botId: f.bot.id, symbolGroupId: f.group.id,
        lifecycleStatus: 'PAUSED', isEnabled: true,
      } });
      await expect(admit(f, bound.reservation.id)).rejects.toMatchObject({ code: 'GRANT_BOT_SCOPE_UNAVAILABLE' });
      await prisma.botMarketGroup.delete({ where: { id: assignment.id } });
      await prisma.externalClientGrant.update({ where: { id: f.grant.id }, data: { revokedAt: new Date() } });
      await expect(admit(f, bound.reservation.id)).rejects.toMatchObject({ code: 'GRANT_SCOPE_UNAVAILABLE' });
      await prisma.externalClientGrant.update({ where: { id: f.grant.id }, data: {
        revokedAt: null, expiresAt: new Date(0),
      } });
      await expect(admit(f, bound.reservation.id)).rejects.toMatchObject({ code: 'GRANT_SCOPE_UNAVAILABLE' });
      await prisma.externalClientGrant.update({ where: { id: f.grant.id }, data: {
        expiresAt: new Date(Date.now() + 60_000),
      } });
      await prisma.userSubscription.updateMany({ where: { userId: f.user.id, status: 'ACTIVE' },
        data: { status: 'CANCELED' } });
      await expect(admit(f, bound.reservation.id))
        .rejects.toMatchObject({ name: 'SubscriptionAssignmentRequiredError' });
      expect((await prisma.externalClientGrantReservation.findUniqueOrThrow({
        where: { id: bound.reservation.id },
      })).state).toBe('RESERVED');
      expect(await prisma.liveCreateOrderSubmission.count({ where: { grantId: f.grant.id } })).toBe(0);
      expect(await counters(f.grant.id)).toMatchObject({ usedActions: 1,
        usedQuoteAmount: new Prisma.Decimal(50) });
    } finally {
      if (originalControl) await prisma.liveExecutionControl.update({ where: { id: 'global' }, data: {
        paused: originalControl.paused, reason: originalControl.reason, version: originalControl.version,
        changedAt: originalControl.changedAt, changedByUserId: originalControl.changedByUserId,
      } });
      else await prisma.liveExecutionControl.deleteMany({ where: { id: 'global' } });
    }
  });

  it('disables delegated submit when Prisma timeout can release locks before a callback settles', async () => {
    const f = await fixture();
    const holderDb = new PrismaClient();
    const revokeDb = new PrismaClient();
    const pauseDb = new PrismaClient();
    const originalControl = await prisma.liveExecutionControl.findUnique({ where: { id: 'global' } });
    let release!: () => void;
    let entered!: () => void;
    const held = new Promise<void>((resolve) => { release = resolve; });
    const callbackEntered = new Promise<void>((resolve) => { entered = resolve; });
    let unsafeOutcome: Promise<{ status: 'fulfilled' } | { status: 'rejected'; error: unknown }> | undefined;
    let mutations: Promise<unknown>[] = [];
    try {
      await prisma.liveExecutionControl.upsert({ where: { id: 'global' },
        create: { id: 'global', paused: false, reason: 'test available', version: 1 },
        update: { paused: false, reason: 'test available' } });
      await prisma.user.update({ where: { id: f.user.id }, data: { role: 'ADMIN' } });
      const control = await prisma.liveExecutionControl.findUniqueOrThrow({ where: { id: 'global' } });
      const bound = await bind(f);
      let callbackActive = false;
      // Reproduce the unsafe pattern without any adapter or network call.
      unsafeOutcome = holderDb.$transaction(async (tx) => {
        await tx.$queryRaw(Prisma.sql`SELECT "id" FROM "ExternalClientGrant"
          WHERE "id" = ${f.grant.id} FOR UPDATE`);
        await tx.$queryRaw`SELECT 1 AS locked FROM
          (SELECT pg_advisory_xact_lock_shared(${LIVE_EXECUTION_PAUSE_LOCK_KEY})) AS acquired`;
        callbackActive = true;
        entered();
        await held;
        callbackActive = false;
      }, { maxWait: 10_000, timeout: 400 }).then(
        () => ({ status: 'fulfilled' as const }),
        (error: unknown) => ({ status: 'rejected' as const, error }),
      );
      await settleWithin(callbackEntered, 5_000);
      let revoked = false;
      let paused = false;
      const revoke = revokeDb.externalClientGrant.update({ where: { id: f.grant.id },
        data: { revokedAt: new Date() } }).then(() => { revoked = true; });
      const pause = setLiveExecutionPause({ actorUserId: f.user.id, paused: true,
        reason: 'Concurrency permit test', expectedVersion: control.version }, pauseDb)
        .then(() => { paused = true; });
      mutations = [revoke, pause];
      await settleWithin(Promise.all(mutations), 5_000);
      // Both authority changes committed while the old callback still ran.
      expect({ revoked, paused }).toEqual({ revoked: true, paused: true });
      expect(callbackActive).toBe(true);
      let submits = 0;
      await expect(withFreshBoundExternalClientGrantSubmitPermit({
        reservationId: bound.reservation.id, secret: f.secret,
      }, async () => { submits += 1; })).rejects.toMatchObject({ code: 'DELEGATED_SUBMIT_PERMIT_DISABLED' });
      expect(submits).toBe(0);
      expect((await prisma.externalClientGrantReservation.findUniqueOrThrow({
        where: { id: bound.reservation.id },
      })).state).toBe('RESERVED');
      expect(await prisma.order.count({ where: { userId: f.user.id } })).toBe(0);
      release();
      const outcome = await unsafeOutcome;
      expect(outcome.status).toBe('rejected');
      if (outcome.status === 'rejected') expect(outcome.error).toMatchObject({ code: 'P2028' });
    } finally {
      release();
      await Promise.allSettled(mutations);
      if (unsafeOutcome) await unsafeOutcome;
      await Promise.all([holderDb.$disconnect(), revokeDb.$disconnect(), pauseDb.$disconnect()]);
      if (originalControl) await prisma.liveExecutionControl.update({ where: { id: 'global' }, data: {
        paused: originalControl.paused, reason: originalControl.reason, version: originalControl.version,
        changedAt: originalControl.changedAt, changedByUserId: originalControl.changedByUserId,
      } });
      else await prisma.liveExecutionControl.deleteMany({ where: { id: 'global' } });
    }
  }, 20_000);

  it('rejects the callback before consuming dispatch state or creating an Order', async () => {
    const f = await fixture();
    const bound = await bind(f);
    let submits = 0;
    await expect(withFreshBoundExternalClientGrantSubmitPermit({
      reservationId: bound.reservation.id, secret: f.secret,
    }, async () => { submits += 1; throw new Error('UNKNOWN'); }))
      .rejects.toMatchObject({ code: 'DELEGATED_SUBMIT_PERMIT_DISABLED' });
    expect(submits).toBe(0);
    expect((await prisma.externalClientGrantReservation.findUniqueOrThrow({
      where: { id: bound.reservation.id },
    })).state).toBe('RESERVED');
    expect(await prisma.log.count({ where: { userId: f.user.id,
      action: 'EXTERNAL_CLIENT_GRANT_SUBMISSION_STARTED' } })).toBe(0);
    expect(await counters(f.grant.id)).toMatchObject({ usedActions: 1, usedQuoteAmount: new Prisma.Decimal(50) });
    expect(await prisma.order.count({ where: { userId: f.user.id } })).toBe(0);
  });

  it('does not enter the mock callback after another process crashes at the durable begin', async () => {
    const f = await fixture();
    const originalControl = await prisma.liveExecutionControl.findUnique({ where: { id: 'global' } });
    try {
      await prisma.liveExecutionControl.upsert({ where: { id: 'global' },
        create: { id: 'global', paused: false, reason: 'test available', version: 1 },
        update: { paused: false, reason: 'test available' } });
      const bound = await bind(f);
      const worker = spawn(process.execPath, ['--import', 'tsx',
        'src/modules/externalClientGrants/externalClientGrantReservation.processProof.worker.ts'], {
        cwd: process.cwd(), env: process.env, windowsHide: true,
      });
      let output = '';
      let errors = '';
      worker.stdout.on('data', (chunk) => { output += chunk.toString(); });
      worker.stderr.on('data', (chunk) => { errors += chunk.toString(); });
      worker.stdin.end(`${JSON.stringify({ operation: 'crash-after-begin',
        reservationId: bound.reservation.id, secret: f.secret })}\n`);
      const exitCode = await new Promise<number | null>((resolve) => worker.on('close', resolve));
      expect({ exitCode, errors }).toEqual({ exitCode: 73, errors: '' });
      expect(output).toContain('BEGUN');
      let submits = 0;
      await expect(withFreshBoundExternalClientGrantSubmitPermit({
        reservationId: bound.reservation.id, secret: f.secret,
      }, async () => { submits += 1; })).rejects.toMatchObject({ code: 'DELEGATED_SUBMIT_PERMIT_DISABLED' });
      expect(submits).toBe(0);
      expect((await prisma.externalClientGrantReservation.findUniqueOrThrow({
        where: { id: bound.reservation.id },
      })).state).toBe('SUBMISSION_UNCERTAIN');
      expect(await counters(f.grant.id)).toMatchObject({ usedActions: 1, usedQuoteAmount: new Prisma.Decimal(50) });
    } finally {
      if (originalControl) await prisma.liveExecutionControl.update({ where: { id: 'global' }, data: {
        paused: originalControl.paused, reason: originalControl.reason, version: originalControl.version,
        changedAt: originalControl.changedAt, changedByUserId: originalControl.changedByUserId,
      } });
      else await prisma.liveExecutionControl.deleteMany({ where: { id: 'global' } });
    }
  }, 30_000);

  it('binds final client ID, allowance, intent, and audit in one commit without submit', async () => {
    const f = await fixture(undefined, 'GATEIO');
    const command = { ...f.command, clientOrderId: 'gate-client-1' };
    const first = await bind(f, command);
    expect(first).toMatchObject({ reused: false, reservation: { state: 'RESERVED' } });
    expect(first.intentId).toBeTruthy();
    expect(first.reservation.clientOrderId).toMatch(/^soar_[A-Za-z0-9_-]{22}$/);
    expect((await prisma.liveOrderIntent.findUniqueOrThrow({ where: { id: first.intentId } })).clientOrderId)
      .toBe(first.reservation.clientOrderId);
    expect(await prisma.order.count({ where: { userId: f.user.id } })).toBe(0);
    const retry = await bind(f, command);
    expect(retry).toMatchObject({ reused: true, intentId: first.intentId,
      reservation: { id: first.reservation.id } });
    await expect(bind(f, { ...command, limitPrice: '101' }))
      .rejects.toMatchObject({ code: 'CLIENT_ORDER_COMMAND_CONFLICT' });
    expect(await counters(f.grant.id)).toMatchObject({ usedActions: 1, usedQuoteAmount: new Prisma.Decimal(50) });
    expect(await prisma.liveOrderIntent.count({ where: { userId: f.user.id } })).toBe(1);
    expect(await prisma.log.count({ where: { userId: f.user.id, action: 'EXTERNAL_CLIENT_GRANT_RESERVED' } })).toBe(1);
  });

  it('recovers a committed binding after its process exits before begin', async () => {
    const f = await fixture();
    const worker = spawn(process.execPath, ['--import', 'tsx',
      'src/modules/externalClientGrants/externalClientGrantReservation.processProof.worker.ts'], {
      cwd: process.cwd(), env: process.env, windowsHide: true,
    });
    let output = '';
    let errors = '';
    worker.stdout.on('data', (chunk) => { output += chunk.toString(); });
    worker.stderr.on('data', (chunk) => { errors += chunk.toString(); });
    worker.stdin.end(`${JSON.stringify({ operation: 'crash-after-bind',
      grantId: f.grant.id, secret: f.secret, command: f.command })}\n`);
    const exitCode = await new Promise<number | null>((resolve) => worker.on('close', resolve));
    expect({ exitCode, errors }).toEqual({ exitCode: 74, errors: '' });
    const boundLine = output.split('\n').find((line) => line.startsWith('BOUND '));
    expect(boundLine).toBeTruthy();
    const bound = JSON.parse(boundLine!.slice(6)) as { reservationId: string; intentId: string };
    const restarted = new PrismaClient();
    try {
      const retry = await bind(f, f.command, restarted);
      expect(retry).toMatchObject({ reused: true, intentId: bound.intentId,
        reservation: { id: bound.reservationId, state: 'RESERVED' } });
    } finally { await restarted.$disconnect(); }
    expect(await prisma.externalClientGrantReservation.count({ where: { grantId: f.grant.id } })).toBe(1);
    expect(await prisma.liveOrderIntent.count({ where: { userId: f.user.id } })).toBe(1);
    expect(await counters(f.grant.id)).toMatchObject({ usedActions: 1, usedQuoteAmount: new Prisma.Decimal(50) });
  });

  it('rolls back allowance and audit when a human client ID already owns the intent', async () => {
    const f = await fixture();
    await prisma.liveOrderIntent.create({ data: {
      userId: f.user.id, clientOrderId: f.command.clientOrderId, payloadHash: 'human-intent',
      exchange: f.command.exchange, marketType: f.command.marketType, symbol: f.command.symbol,
    } });
    await expect(bind(f)).rejects.toMatchObject({ code: 'CLIENT_ORDER_ID_ALREADY_USED' });
    expect(await prisma.externalClientGrantReservation.count({ where: { grantId: f.grant.id } })).toBe(0);
    expect(await counters(f.grant.id)).toMatchObject({ usedActions: 0, usedQuoteAmount: new Prisma.Decimal(0) });
    expect(await prisma.log.count({ where: { userId: f.user.id, action: 'EXTERNAL_CLIENT_GRANT_RESERVED' } })).toBe(0);
  });

  it('denies a human intent that wins the ID race while a bound worker waits', async () => {
    const f = await fixture();
    let release!: () => void;
    let acquired!: () => void;
    const held = new Promise<void>((resolve) => { release = resolve; });
    const locked = new Promise<void>((resolve) => { acquired = resolve; });
    const holder = prisma.$transaction(async (tx) => {
      await tx.$queryRaw(Prisma.sql`SELECT "id" FROM "ExternalClientGrant" WHERE "id" = ${f.grant.id} FOR UPDATE`);
      acquired();
      await held;
    }, { timeout: 30_000 });
    await locked;
    const worker = spawn(process.execPath, ['--import', 'tsx',
      'src/modules/externalClientGrants/externalClientGrantReservation.processProof.worker.ts'], {
      cwd: process.cwd(), env: process.env, windowsHide: true,
    });
    let output = '';
    let errors = '';
    let started!: () => void;
    const workerStarted = new Promise<void>((resolve) => { started = resolve; });
    worker.stdout.on('data', (chunk) => {
      output += chunk.toString();
      if (output.includes('STARTED\n')) started();
    });
    worker.stderr.on('data', (chunk) => { errors += chunk.toString(); });
    const completion = new Promise<number | null>((resolve) => worker.on('close', resolve));
    worker.stdin.end(`${JSON.stringify({ operation: 'bind', grantId: f.grant.id,
      secret: f.secret, command: f.command })}\n`);
    try {
      await workerStarted;
      await prisma.liveOrderIntent.create({ data: {
        userId: f.user.id, clientOrderId: f.command.clientOrderId,
        payloadHash: 'human-race-winner', exchange: f.command.exchange,
        marketType: f.command.marketType, symbol: f.command.symbol,
      } });
    } finally { release(); }
    await holder;
    const exitCode = await completion;
    expect({ exitCode, errors }).toEqual({ exitCode: 0, errors: '' });
    expect(output).toContain('"error":"CLIENT_ORDER_ID_ALREADY_USED"');
    expect(await prisma.externalClientGrantReservation.count({ where: { grantId: f.grant.id } })).toBe(0);
    expect(await counters(f.grant.id)).toMatchObject({ usedActions: 0, usedQuoteAmount: new Prisma.Decimal(0) });
    expect(await prisma.log.count({ where: { userId: f.user.id, action: 'EXTERNAL_CLIENT_GRANT_RESERVED' } })).toBe(0);
  }, 30_000);

  it('denies a paused or revoked bound dispatch and preserves the charged uncertain state', async () => {
    const f = await fixture();
    const originalControl = await prisma.liveExecutionControl.findUnique({ where: { id: 'global' } });
    try {
      await prisma.liveExecutionControl.upsert({ where: { id: 'global' },
        create: { id: 'global', paused: false, reason: 'test available', version: 1 },
        update: { paused: false, reason: 'test available' } });
      const bound = await bind(f);
      const begin = () => beginBoundExternalClientGrantSubmission({
        reservationId: bound.reservation.id, secret: f.secret,
      });
      await prisma.liveExecutionControl.delete({ where: { id: 'global' } });
      await expect(begin()).rejects.toMatchObject({ code: 'LIVE_PAUSE_UNAVAILABLE' });
      await prisma.liveExecutionControl.create({
        data: { id: 'global', paused: false, reason: 'test available', version: 1 },
      });
      await prisma.liveExecutionControl.update({ where: { id: 'global' }, data: { paused: true } });
      await expect(begin()).rejects.toMatchObject({ code: 'LIVE_PRETRADE_PAUSED' });
      expect((await prisma.externalClientGrantReservation.findUniqueOrThrow({
        where: { id: bound.reservation.id },
      })).state).toBe('RESERVED');
      await prisma.liveExecutionControl.update({ where: { id: 'global' }, data: { paused: false } });
      await prisma.externalClientGrant.update({ where: { id: f.grant.id }, data: { revokedAt: new Date() } });
      await expect(begin()).rejects.toMatchObject({ code: 'GRANT_SCOPE_UNAVAILABLE' });
      await prisma.externalClientGrant.update({ where: { id: f.grant.id },
        data: { revokedAt: null, expiresAt: new Date(0) } });
      await expect(begin()).rejects.toMatchObject({ code: 'GRANT_SCOPE_UNAVAILABLE' });
      await prisma.externalClientGrant.update({ where: { id: f.grant.id },
        data: { expiresAt: new Date(Date.now() + 60_000) } });
      await prisma.userSubscription.updateMany({ where: { userId: f.user.id, status: 'ACTIVE' },
        data: { status: 'CANCELED' } });
      await expect(begin()).rejects.toMatchObject({ name: 'SubscriptionAssignmentRequiredError' });
      await setActiveSubscriptionForUser(prisma, {
        userId: f.user.id, planCode: 'ADVANCED', source: 'ADMIN_OVERRIDE', autoRenew: false,
      });
      const assignment = await prisma.botMarketGroup.create({ data: {
        userId: f.user.id, botId: f.bot.id, symbolGroupId: f.group.id,
        lifecycleStatus: 'PAUSED', isEnabled: true,
      } });
      await expect(begin()).rejects.toMatchObject({ code: 'GRANT_BOT_SCOPE_UNAVAILABLE' });
      await prisma.botMarketGroup.update({ where: { id: assignment.id }, data: { lifecycleStatus: 'ACTIVE' } });
      expect((await begin()).state).toBe('SUBMISSION_UNCERTAIN');
      await expect(begin()).rejects.toMatchObject({ code: 'RESERVATION_NOT_DISPATCHABLE' });
      await expect(refundUnsentExternalClientGrantReservation(bound.reservation.id))
        .rejects.toMatchObject({ code: 'NO_AUTHORITATIVE_NO_SUBMIT_PROOF' });
      await expect(reconcileSubmittedExternalClientGrantReservation(bound.reservation.id))
        .rejects.toMatchObject({ code: 'SUBMISSION_EVIDENCE_UNAVAILABLE' });
      await prisma.order.create({ data: {
        id: bound.intentId, userId: f.user.id, botId: f.bot.id,
        symbol: f.command.symbol, side: f.command.side, type: f.command.type,
        quantity: Number(f.command.quantity), price: Number(f.command.limitPrice),
        exchangeOrderId: 'mock-venue-identity',
      } });
      expect((await reconcileSubmittedExternalClientGrantReservation(bound.reservation.id)).state)
        .toBe('SUBMITTED');
      expect(await counters(f.grant.id)).toMatchObject({ usedActions: 1, usedQuoteAmount: new Prisma.Decimal(50) });
    } finally {
      if (originalControl) await prisma.liveExecutionControl.update({ where: { id: 'global' }, data: {
        paused: originalControl.paused, reason: originalControl.reason, version: originalControl.version,
        changedAt: originalControl.changedAt, changedByUserId: originalControl.changedByUserId,
      } });
      else await prisma.liveExecutionControl.deleteMany({ where: { id: 'global' } });
    }
  });

  it('accepts the separated durable intent after reservation without any venue submit', async () => {
    const f = await fixture();
    const reserved = await reserve(f);
    const payload = {
      botId: f.bot.id, walletId: f.command.walletId ?? undefined,
      strategyId: f.command.strategyId ?? undefined, positionId: f.command.positionId,
      symbol: f.command.symbol, side: f.command.side, type: f.command.type,
      quantity: Number(f.command.quantity), price: Number(f.command.limitPrice),
      reduceOnly: f.command.reduceOnly, mode: 'LIVE' as const, riskAck: true,
      clientOrderId: f.command.clientOrderId,
    };
    const prepared = await persistOrReuseLiveOrderIntent({ userId: f.user.id, bot: f.bot, payload });
    expect(prepared).toMatchObject({ created: true, clientOrderId: reserved.reservation.clientOrderId });
    await expect(bind(f)).rejects.toMatchObject({ code: 'RESERVATION_INTENT_UNAVAILABLE' });
    await expect(beginBoundExternalClientGrantSubmission({
      reservationId: reserved.reservation.id, secret: f.secret,
    })).rejects.toMatchObject({ code: 'RESERVATION_INTENT_UNAVAILABLE' });
    expect(await prisma.order.count({ where: { userId: f.user.id } })).toBe(0);
    expect((await beginExternalClientGrantSubmission({
      reservationId: reserved.reservation.id, secret: f.secret,
    })).state).toBe('SUBMISSION_UNCERTAIN');
    expect((await persistOrReuseLiveOrderIntent({ userId: f.user.id, bot: f.bot,
      payload: { ...payload } })).created).toBe(false);
    expect((await reserve(f)).reservation.id).toBe(reserved.reservation.id);
    expect(await counters(f.grant.id)).toMatchObject({ usedActions: 1, usedQuoteAmount: new Prisma.Decimal(50) });
  });

  it('persists one allowance, reuses an exact retry, and conflicts on a changed command', async () => {
    const f = await fixture();
    const first = await reserve(f);
    expect(first.reused).toBe(false);
    expect(first.reservation.state).toBe('RESERVED');
    expect(first.reservation.quoteAmount.toString()).toBe('50');
    const retried = await reserve(f);
    expect(retried).toMatchObject({ reused: true, reservation: { id: first.reservation.id } });
    expect(await counters(f.grant.id)).toMatchObject({ usedActions: 1, usedQuoteAmount: new Prisma.Decimal(50) });
    await expect(reserve(f, { ...f.command, limitPrice: '101' })).rejects.toMatchObject({
      code: 'CLIENT_ORDER_COMMAND_CONFLICT',
    });
    await expect(reserve(f, { ...f.command, clientOrderId: 'another_id' })).rejects.toMatchObject({
      code: 'GRANT_PREVIOUS_OPERATION_UNRESOLVED',
    });
    expect(await prisma.externalClientGrantReservation.count({ where: { grantId: f.grant.id } })).toBe(1);
  });

  it('refunds only a proven pre-dispatch abort and keeps the client ID terminal', async () => {
    const f = await fixture();
    const first = await reserve(f);
    await expect(beginExternalClientGrantSubmission({ reservationId: first.reservation.id, secret: f.secret }))
      .rejects.toMatchObject({ code: 'SUBMISSION_INTENT_UNAVAILABLE' });
    const restarted = new PrismaClient();
    let refunded: Awaited<ReturnType<typeof refundUnsentExternalClientGrantReservation>>;
    try {
      refunded = await refundUnsentExternalClientGrantReservation(first.reservation.id, restarted);
    } finally { await restarted.$disconnect(); }
    expect(refunded).toMatchObject({ state: 'NOT_SUBMITTED', proofType: 'LOCAL_PRE_DISPATCH_ABORT' });
    expect(await counters(f.grant.id)).toMatchObject({ usedActions: 0, usedQuoteAmount: new Prisma.Decimal(0) });
    expect((await refundUnsentExternalClientGrantReservation(first.reservation.id)).id).toBe(first.reservation.id);
    expect((await reserve(f)).reservation.state).toBe('NOT_SUBMITTED');
    await expect(beginExternalClientGrantSubmission({ reservationId: first.reservation.id, secret: f.secret }))
      .rejects.toMatchObject({ code: 'RESERVATION_NOT_DISPATCHABLE' });
    const next = await reserve(f, { ...f.command, clientOrderId: 'next_safe_id' });
    expect(next.reused).toBe(false);
    expect(await counters(f.grant.id)).toMatchObject({ usedActions: 1, usedQuoteAmount: new Prisma.Decimal(50) });
  });

  it('makes started submission uncertain across restart and reconciles only durable matching evidence', async () => {
    const f = await fixture();
    const first = await reserve(f);
    const intent = await createMatchingIntent(f);
    await expect(refundUnsentExternalClientGrantReservation(first.reservation.id))
      .rejects.toMatchObject({ code: 'NO_AUTHORITATIVE_NO_SUBMIT_PROOF' });
    const worker = spawn(process.execPath, ['--import', 'tsx',
      'src/modules/externalClientGrants/externalClientGrantReservation.processProof.worker.ts'], {
      cwd: process.cwd(), env: process.env, windowsHide: true,
    });
    let workerOutput = '';
    let workerError = '';
    worker.stdout.on('data', (chunk) => { workerOutput += chunk.toString(); });
    worker.stderr.on('data', (chunk) => { workerError += chunk.toString(); });
    worker.stdin.end(`${JSON.stringify({ operation: 'crash-after-begin',
      reservationId: first.reservation.id, secret: f.secret })}\n`);
    const exitCode = await new Promise<number | null>((resolve) => worker.on('close', resolve));
    expect({ exitCode, workerOutput, workerError }).toMatchObject({
      exitCode: 73, workerOutput: expect.stringContaining('BEGUN\n'), workerError: '',
    });
    expect((await prisma.externalClientGrantReservation.findUniqueOrThrow({
      where: { id: first.reservation.id },
    })).state).toBe('SUBMISSION_UNCERTAIN');
    const restarted = new PrismaClient();
    try {
      expect((await reserve(f, f.command, restarted)).reservation.id).toBe(first.reservation.id);
      await expect(beginExternalClientGrantSubmission({ reservationId: first.reservation.id, secret: f.secret }, restarted))
        .rejects.toMatchObject({ code: 'RESERVATION_NOT_DISPATCHABLE' });
      await expect(refundUnsentExternalClientGrantReservation(first.reservation.id, restarted))
        .rejects.toMatchObject({ code: 'NO_AUTHORITATIVE_NO_SUBMIT_PROOF' });
      await expect(reserve(f, { ...f.command, clientOrderId: 'another_unresolved_id' }, restarted))
        .rejects.toMatchObject({ code: 'GRANT_PREVIOUS_OPERATION_UNRESOLVED' });
      await expect(reconcileSubmittedExternalClientGrantReservation(first.reservation.id, restarted))
        .rejects.toMatchObject({ code: 'SUBMISSION_EVIDENCE_UNAVAILABLE' });
      await expect(reconcileSubmittedExternalClientGrantReservation(first.reservation.id, restarted))
        .rejects.toMatchObject({ code: 'SUBMISSION_EVIDENCE_UNAVAILABLE' });
      await prisma.order.create({ data: {
        id: intent.id, userId: f.user.id, botId: f.bot.id, symbol: 'BTCUSDT', side: 'BUY',
        type: 'LIMIT', quantity: 0.5, price: 100, exchangeOrderId: 'venue-order-test',
      } });
      const reconciled = await reconcileSubmittedExternalClientGrantReservation(first.reservation.id, restarted);
      expect(reconciled).toMatchObject({ state: 'SUBMITTED', proofType: 'DURABLE_ORDER', proofRef: intent.id });
      expect(await counters(f.grant.id)).toMatchObject({ usedActions: 1, usedQuoteAmount: new Prisma.Decimal(50) });
      const nextCommand = { ...f.command, clientOrderId: 'next_after_recovery' };
      const next = await reserve(f, nextCommand, restarted);
      expect(next.reused).toBe(false);
      const nextIntent = await createMatchingIntent(f, nextCommand);
      await beginExternalClientGrantSubmission({ reservationId: next.reservation.id, secret: f.secret }, restarted);
      await prisma.order.create({ data: {
        id: nextIntent.id, userId: f.user.id, botId: f.bot.id, symbol: 'BTCUSDT', side: 'BUY',
        type: 'LIMIT', quantity: 0.5, price: 100, exchangeOrderId: 'venue-order-test-2',
      } });
      await reconcileSubmittedExternalClientGrantReservation(next.reservation.id, restarted);
      await expect(reserve(f, { ...f.command, clientOrderId: 'over_count_and_total' }, restarted))
        .rejects.toMatchObject({ code: 'GRANT_LIMIT_EXCEEDED' });
      expect(await counters(f.grant.id)).toMatchObject({ usedActions: 2, usedQuoteAmount: new Prisma.Decimal(100) });
    } finally { await restarted.$disconnect(); }
  });

  it('rechecks revoke, expiry, plan, and active group immediately before dispatch', async () => {
    const f = await fixture();
    const first = await reserve(f);
    await createMatchingIntent(f);
    const begin = () => beginExternalClientGrantSubmission({ reservationId: first.reservation.id, secret: f.secret });
    await prisma.externalClientGrant.update({ where: { id: f.grant.id }, data: { revokedAt: new Date() } });
    await expect(begin()).rejects.toMatchObject({ code: 'GRANT_SCOPE_UNAVAILABLE' });
    await prisma.externalClientGrant.update({ where: { id: f.grant.id }, data: { revokedAt: null, expiresAt: new Date(0) } });
    await expect(begin()).rejects.toMatchObject({ code: 'GRANT_SCOPE_UNAVAILABLE' });
    await prisma.externalClientGrant.update({ where: { id: f.grant.id }, data: { expiresAt: new Date(Date.now() + 60_000) } });
    await prisma.userSubscription.updateMany({ where: { userId: f.user.id, status: 'ACTIVE' }, data: { status: 'CANCELED' } });
    await expect(begin()).rejects.toMatchObject({ name: 'SubscriptionAssignmentRequiredError' });
    await setActiveSubscriptionForUser(prisma, {
      userId: f.user.id, planCode: 'ADVANCED', source: 'ADMIN_OVERRIDE', autoRenew: false,
    });
    const assignment = await prisma.botMarketGroup.create({ data: {
      userId: f.user.id, botId: f.bot.id, symbolGroupId: f.group.id, lifecycleStatus: 'PAUSED', isEnabled: true,
    } });
    await expect(begin()).rejects.toMatchObject({ code: 'GRANT_BOT_SCOPE_UNAVAILABLE' });
    await prisma.botMarketGroup.update({ where: { id: assignment.id }, data: { lifecycleStatus: 'ACTIVE' } });
    expect((await begin()).state).toBe('SUBMISSION_UNCERTAIN');
  });

  it('keeps an already uncertain command unresolved after revocation', async () => {
    const f = await fixture();
    const first = await reserve(f);
    await createMatchingIntent(f);
    await beginExternalClientGrantSubmission({ reservationId: first.reservation.id, secret: f.secret });
    await prisma.externalClientGrant.update({ where: { id: f.grant.id }, data: { revokedAt: new Date() } });
    await expect(reserve(f)).rejects.toMatchObject({ code: 'GRANT_SCOPE_UNAVAILABLE' });
    await expect(refundUnsentExternalClientGrantReservation(first.reservation.id))
      .rejects.toMatchObject({ code: 'NO_AUTHORITATIVE_NO_SUBMIT_PROOF' });
    expect(await prisma.externalClientGrantReservation.findUnique({ where: { id: first.reservation.id } }))
      .toMatchObject({ state: 'SUBMISSION_UNCERTAIN' });
    expect(await counters(f.grant.id)).toMatchObject({ usedActions: 1, usedQuoteAmount: new Prisma.Decimal(50) });
  });

  it('rejects untrusted nominal, imprecise quantity, excessive amount, and absent market evidence', async () => {
    const f = await fixture();
    await expect(reserveExternalClientGrantOrder({ grantId: f.grant.id, secret: 'not-a-grant', command: f.command }, {
      getSymbolRules: rules,
    })).rejects.toMatchObject({ code: 'GRANT_SCOPE_UNAVAILABLE' });
    await expect(reserve(f, { ...f.command, riskAck: true } as unknown as GrantLimitCommand))
      .rejects.toMatchObject({ code: 'INVALID_COMMAND' });
    await expect(reserve(f, { ...f.command, quantity: '0.5001' }))
      .rejects.toMatchObject({ code: 'INVALID_QUANTITY_STEP' });
    await expect(reserve(f, { ...f.command, limitPrice: '100.005' }))
      .rejects.toMatchObject({ code: 'INVALID_PRICE_STEP' });
    await expect(reserve(f, { ...f.command, limitPrice: '100.000000001' }))
      .rejects.toMatchObject({ code: 'INVALID_COMMAND_PRECISION' });
    await expect(reserve(f, { ...f.command, quantity: '1' }))
      .rejects.toMatchObject({ code: 'GRANT_LIMIT_EXCEEDED' });
    await expect(reserveExternalClientGrantOrder({ grantId: f.grant.id, secret: f.secret, command: f.command }, {
      getSymbolRules: async () => null,
    })).rejects.toMatchObject({ code: 'UNVERIFIED_MARKET_CURRENCY' });
    await expect(reserveExternalClientGrantOrder({ grantId: f.grant.id, secret: f.secret, command: f.command }, {
      getSymbolRules: async () => ({ ...await rules(), quantityStep: null }),
    })).rejects.toMatchObject({ code: 'UNVERIFIED_MARKET_PRECISION' });
    await expect(reserveExternalClientGrantOrder({ grantId: f.grant.id, secret: f.secret, command: f.command }, {
      getSymbolRules: async () => ({ ...await rules(), contractSize: null }),
    })).rejects.toMatchObject({ code: 'UNVERIFIED_CONTRACT_SIZE' });
    await createMatchingIntent(f);
    await expect(reserve(f)).rejects.toMatchObject({ code: 'CLIENT_ORDER_ID_ALREADY_USED' });
    expect(await prisma.externalClientGrantReservation.count({ where: { grantId: f.grant.id } })).toBe(0);
  });

  it('takes Gate Futures currency and contract proof from raw venue metadata before any allowance write', async () => {
    const f = await fixture(undefined, 'GATEIO');
    const rawMarket = (overrides: Record<string, unknown> = {}) => ({
      id: 'BTC_USDT', symbol: 'BTC/USDT:USDT', active: true,
      quote: 'USDT', settle: 'USDT', contract: true, linear: true, inverse: false,
      contractSize: 1,
      info: { filters: [
        { filterType: 'LOT_SIZE', minQty: '0.001', stepSize: '0.001' },
        { filterType: 'PRICE_FILTER', tickSize: '0.01' },
      ] },
      ...overrides,
    });
    const attempt = (market: ReturnType<typeof rawMarket>, clientOrderId: string) => {
      __resetExchangeSymbolRulesCacheForTests();
      return reserveExternalClientGrantOrder({ grantId: f.grant.id, secret: f.secret,
        command: { ...f.command, clientOrderId } }, {
        getSymbolRules: (input) => getExchangeSymbolRules(input, {
          nowMs: () => 1_000,
          loadMarketMap: async () => ({ BTC_USDT: market }),
        }),
      });
    };
    for (const [name, overrides] of [
      ['missing-quote', { quote: undefined }],
      ['wrong-quote', { quote: 'USD' }],
      ['missing-settle', { settle: undefined }],
      ['wrong-settle', { settle: 'USD' }],
      ['not-contract', { contract: false }],
      ['inverse', { linear: false, inverse: true }],
    ] as const) {
      await expect(attempt(rawMarket(overrides), name)).rejects.toMatchObject({
        code: 'UNVERIFIED_MARKET_CURRENCY',
      });
      expect(await prisma.externalClientGrantReservation.count({ where: { grantId: f.grant.id } })).toBe(0);
      expect(await counters(f.grant.id)).toMatchObject({ usedActions: 0, usedQuoteAmount: new Prisma.Decimal(0) });
      expect(await prisma.log.count({ where: { userId: f.user.id, action: 'EXTERNAL_CLIENT_GRANT_RESERVED' } })).toBe(0);
    }
    __resetExchangeSymbolRulesCacheForTests();
    await expect(reserveExternalClientGrantOrder({ grantId: f.grant.id, secret: f.secret,
      command: { ...f.command, clientOrderId: 'ambiguous_gate_market' } }, {
      getSymbolRules: (input) => getExchangeSymbolRules(input, {
        nowMs: () => 1_000,
        loadMarketMap: async () => ({
          first: rawMarket(),
          second: rawMarket({ id: 'BTCUSDT', quote: 'USD', settle: 'USD' }),
        }),
      }),
    })).rejects.toMatchObject({ code: 'UNVERIFIED_MARKET_CURRENCY' });
    expect(await prisma.externalClientGrantReservation.count({ where: { grantId: f.grant.id } })).toBe(0);
    expect(await counters(f.grant.id)).toMatchObject({ usedActions: 0, usedQuoteAmount: new Prisma.Decimal(0) });
    expect(await prisma.log.count({ where: { userId: f.user.id, action: 'EXTERNAL_CLIENT_GRANT_RESERVED' } })).toBe(0);
    const valid = await attempt(rawMarket(), 'valid_gate_contract');
    expect(valid.reservation.quoteAmount.toString()).toBe('50');
    expect(await counters(f.grant.id)).toMatchObject({ usedActions: 1, usedQuoteAmount: new Prisma.Decimal(50) });
    const audit = await prisma.log.findFirstOrThrow({
      where: { userId: f.user.id, action: 'EXTERNAL_CLIENT_GRANT_RESERVED' },
    });
    expect(audit.metadata).toMatchObject({ currencyProof: { quote: 'USDT', settle: 'USDT', contract: true } });
  });

  it('takes Spot quote currency from raw venue metadata without symbol inference', async () => {
    const f = await fixture(undefined, 'BINANCE', 'SPOT');
    const attempt = (quote: string | undefined, clientOrderId: string) => {
      __resetExchangeSymbolRulesCacheForTests();
      return reserveExternalClientGrantOrder({ grantId: f.grant.id, secret: f.secret,
        command: { ...f.command, clientOrderId } }, {
        getSymbolRules: (input) => getExchangeSymbolRules(input, {
          nowMs: () => 1_000,
          loadMarketMap: async () => ({ BTCUSDT: {
            id: 'BTCUSDT', symbol: 'BTC/USDT', active: true, quote, contract: false,
            info: { filters: [
              { filterType: 'LOT_SIZE', minQty: '0.001', stepSize: '0.001' },
              { filterType: 'PRICE_FILTER', tickSize: '0.01' },
            ] },
          } }),
        }),
      });
    };
    for (const [quote, clientOrderId] of [[undefined, 'spot_missing_quote'], ['USD', 'spot_wrong_quote']] as const) {
      await expect(attempt(quote, clientOrderId)).rejects.toMatchObject({ code: 'UNVERIFIED_MARKET_CURRENCY' });
    }
    expect(await prisma.externalClientGrantReservation.count({ where: { grantId: f.grant.id } })).toBe(0);
    expect(await counters(f.grant.id)).toMatchObject({ usedActions: 0, usedQuoteAmount: new Prisma.Decimal(0) });
    expect(await prisma.log.count({ where: { userId: f.user.id, action: 'EXTERNAL_CLIENT_GRANT_RESERVED' } })).toBe(0);
    expect((await attempt('USDT', 'spot_valid_quote')).reservation.quoteAmount.toString()).toBe('50');
  });

  it('uses trusted Futures contract size and rounds the reserved quote upward', async () => {
    const f = await fixture();
    const result = await reserveExternalClientGrantOrder({ grantId: f.grant.id, secret: f.secret,
      command: { ...f.command, quantity: '0.05' }, quoteAmount: '0.01' } as {
        grantId: string; secret: string; command: unknown;
      }, {
      getSymbolRules: async () => ({ ...await rules(), contractSize: 10 }),
    });
    expect(result.reservation.quoteAmount.toString()).toBe('50');
    expect(await counters(f.grant.id)).toMatchObject({ usedActions: 1, usedQuoteAmount: new Prisma.Decimal(50) });
    await refundUnsentExternalClientGrantReservation(result.reservation.id);
    const tiny = await reserveExternalClientGrantOrder({ grantId: f.grant.id, secret: f.secret,
      command: { ...f.command, clientOrderId: 'round_up_tiny', quantity: '0.001', limitPrice: '0.00000001' } }, {
      getSymbolRules: async () => ({ ...await rules(), minNotional: null, priceStep: 0.00000001 }),
    });
    expect(tiny.reservation.quoteAmount.toFixed(8)).toBe('0.00000001');
  });

  it('rolls back both the reservation and counters when a late audit write fails', async () => {
    const f = await fixture();
    const faultDb = {
      externalClientGrant: prisma.externalClientGrant,
      externalClientGrantReservation: prisma.externalClientGrantReservation,
      $transaction: (callback: (tx: Prisma.TransactionClient) => Promise<unknown>, options: unknown) =>
        prisma.$transaction((realTx) => callback(new Proxy(realTx, {
          get(target, property) {
            if (property === 'log') return { create: async () => { throw new Error('test audit write failure'); } };
            const value = Reflect.get(target, property);
            return typeof value === 'function' ? value.bind(target) : value;
          },
        }) as Prisma.TransactionClient), options as { maxWait: number; timeout: number }),
    } as unknown as PrismaClient;
    await expect(reserve(f, f.command, faultDb)).rejects.toThrow('test audit write failure');
    await expect(bind(f, f.command, faultDb)).rejects.toThrow('test audit write failure');
    expect(await prisma.externalClientGrantReservation.count({ where: { grantId: f.grant.id } })).toBe(0);
    expect(await prisma.liveOrderIntent.count({ where: { userId: f.user.id } })).toBe(0);
    expect(await counters(f.grant.id)).toMatchObject({ usedActions: 0, usedQuoteAmount: new Prisma.Decimal(0) });
  });

  it('serializes bound intents across two OS processes on the grant row', async () => {
    const f = await fixture();
    let release!: () => void;
    let locked!: () => void;
    const held = new Promise<void>((resolve) => { release = resolve; });
    const acquired = new Promise<void>((resolve) => { locked = resolve; });
    const holder = prisma.$transaction(async (tx) => {
      await tx.$queryRaw(Prisma.sql`SELECT "id" FROM "ExternalClientGrant" WHERE "id" = ${f.grant.id} FOR UPDATE`);
      locked();
      await held;
    }, { timeout: 30_000 });
    await acquired;

    const runChild = (command: GrantLimitCommand) => {
      const child = spawn(process.execPath, ['--import', 'tsx',
        'src/modules/externalClientGrants/externalClientGrantReservation.processProof.worker.ts'], {
        cwd: process.cwd(), env: process.env, windowsHide: true,
      });
      let output = '';
      let errors = '';
      let started!: () => void;
      const startedPromise = new Promise<void>((resolve) => { started = resolve; });
      child.stdout.on('data', (chunk) => {
        output += chunk.toString();
        if (output.includes('STARTED\n')) started();
      });
      child.stderr.on('data', (chunk) => { errors += chunk.toString(); });
      child.stdin.end(`${JSON.stringify({ operation: 'bind', grantId: f.grant.id,
        secret: f.secret, command })}\n`);
      const completed = new Promise<{ reused?: boolean; id?: string; intentId?: string; error?: string }>((resolve, reject) => {
        child.on('close', (code) => {
          if (code !== 0) return reject(new Error(`child exit ${code}: ${errors}`));
          const result = output.split('\n').find((line) => line.startsWith('RESULT '));
          if (!result) return reject(new Error(`child result missing: ${output} ${errors}`));
          resolve(JSON.parse(result.slice(7)));
        });
      });
      return { started: startedPromise, completed };
    };
    const first = runChild(f.command);
    const second = runChild({ ...f.command, clientOrderId: 'second_process_id' });
    try {
      await Promise.all([first.started, second.started]);
    } finally { release(); }
    await holder;
    const results = await Promise.all([first.completed, second.completed]);
    expect(results.filter((item) => item.id)).toHaveLength(1);
    expect(results.filter((item) => item.intentId)).toHaveLength(1);
    expect(results.filter((item) => item.error)).toEqual([{ error: 'GRANT_PREVIOUS_OPERATION_UNRESOLVED' }]);
    expect(await prisma.liveOrderIntent.count({ where: { userId: f.user.id } })).toBe(1);
    expect(await counters(f.grant.id)).toMatchObject({ usedActions: 1, usedQuoteAmount: new Prisma.Decimal(50) });
  }, 30_000);
});
