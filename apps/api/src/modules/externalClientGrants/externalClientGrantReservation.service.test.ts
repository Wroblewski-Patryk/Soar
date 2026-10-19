import { spawn } from 'node:child_process';
import { Prisma, PrismaClient } from '@prisma/client';
import { afterEach, describe, expect, it } from 'vitest';
import { prisma } from '../../prisma/client';
import { hashPassword } from '../../utils/hash';
import { ensureSubscriptionCatalog, setActiveSubscriptionForUser } from '../subscriptions/subscriptions.service';
import { createExternalClientGrant } from './externalClientGrants.service';
import {
  beginExternalClientGrantSubmission, reconcileSubmittedExternalClientGrantReservation,
  refundUnsentExternalClientGrantReservation, reserveExternalClientGrantOrder,
  type GrantLimitCommand,
} from './externalClientGrantReservation.service';

const users: string[] = [];
const rules = async () => ({ minQuantity: 0.001, minNotional: 1, quantityStep: 0.001, priceStep: 0.01, contractSize: 1 });
const assertTestDb = () => {
  if (!decodeURIComponent(new URL(process.env.DATABASE_URL ?? '').pathname).endsWith('_test')) {
    throw new Error('Reservation tests require an isolated _test database');
  }
};

afterEach(async () => {
  for (const userId of users.splice(0)) {
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

const fixture = async (limits = { maxActionQuoteAmount: '50', maxTotalQuoteAmount: '100', maxActions: 2 }) => {
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
    userId: user.id, name: 'Reservation universe', exchange: 'BINANCE', marketType: 'FUTURES', baseCurrency: 'USDT',
  } });
  const group = await prisma.symbolGroup.create({ data: {
    userId: user.id, marketUniverseId: universe.id, name: 'BTC', symbols: ['BTCUSDT'],
  } });
  const bot = await prisma.bot.create({ data: {
    userId: user.id, name: 'Reservation bot', mode: 'LIVE', exchange: 'BINANCE', marketType: 'FUTURES',
    isActive: true, liveOptIn: true, symbolGroupId: group.id,
  } });
  const { grant, secret } = await createExternalClientGrant(user.id, {
    botId: bot.id, clientLabel: 'Test external client', exchange: 'BINANCE', marketType: 'FUTURES',
    symbol: 'BTCUSDT', action: 'PLACE_LIVE_ORDER', ...limits, ttlSeconds: 3600, password: 'GrantTest1234',
  });
  const command: GrantLimitCommand = {
    userId: user.id, botId: bot.id, exchange: 'BINANCE', marketType: 'FUTURES',
    symbol: 'BTCUSDT', action: 'PLACE_LIVE_ORDER', clientOrderId: `soar_${crypto.randomUUID().replace(/-/g, '').slice(0, 22)}`,
    side: 'BUY', type: 'LIMIT', quantity: '0.5', limitPrice: '100', reduceOnly: false,
    walletId: null, strategyId: null, positionId: null,
  };
  return { user, bot, group, grant, secret, command };
};

const reserve = (f: Awaited<ReturnType<typeof fixture>>, command = f.command, db?: PrismaClient) =>
  reserveExternalClientGrantOrder({ grantId: f.grant.id, secret: f.secret, command }, { db, getSymbolRules: rules });
const counters = async (id: string) => prisma.externalClientGrant.findUniqueOrThrow({
  where: { id }, select: { usedActions: true, usedQuoteAmount: true },
});
const createMatchingIntent = async (f: Awaited<ReturnType<typeof fixture>>, command = f.command) =>
  prisma.liveOrderIntent.create({ data: {
    userId: f.user.id, clientOrderId: command.clientOrderId, payloadHash: 'test-hash',
    payload: { ...command, quantity: Number(command.quantity), price: Number(command.limitPrice) }, exchange: 'BINANCE',
    marketType: 'FUTURES', symbol: 'BTCUSDT',
  } });

describe('external client grant atomic reservation', () => {
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
    })).rejects.toMatchObject({ code: 'UNVERIFIED_MARKET_PRECISION' });
    await expect(reserveExternalClientGrantOrder({ grantId: f.grant.id, secret: f.secret, command: f.command }, {
      getSymbolRules: async () => ({ minQuantity: 0.001, minNotional: 1, quantityStep: 0.001, priceStep: 0.01, contractSize: null }),
    })).rejects.toMatchObject({ code: 'UNVERIFIED_CONTRACT_SIZE' });
    await createMatchingIntent(f);
    await expect(reserve(f)).rejects.toMatchObject({ code: 'CLIENT_ORDER_ID_ALREADY_USED' });
    expect(await prisma.externalClientGrantReservation.count({ where: { grantId: f.grant.id } })).toBe(0);
  });

  it('uses trusted Futures contract size and rounds the reserved quote upward', async () => {
    const f = await fixture();
    const result = await reserveExternalClientGrantOrder({ grantId: f.grant.id, secret: f.secret,
      command: { ...f.command, quantity: '0.05' }, quoteAmount: '0.01' } as {
        grantId: string; secret: string; command: unknown;
      }, {
      getSymbolRules: async () => ({ minQuantity: 0.001, minNotional: 1, quantityStep: 0.001, priceStep: 0.01, contractSize: 10 }),
    });
    expect(result.reservation.quoteAmount.toString()).toBe('50');
    expect(await counters(f.grant.id)).toMatchObject({ usedActions: 1, usedQuoteAmount: new Prisma.Decimal(50) });
    await refundUnsentExternalClientGrantReservation(result.reservation.id);
    const tiny = await reserveExternalClientGrantOrder({ grantId: f.grant.id, secret: f.secret,
      command: { ...f.command, clientOrderId: 'round_up_tiny', quantity: '0.001', limitPrice: '0.00000001' } }, {
      getSymbolRules: async () => ({ minQuantity: 0.001, minNotional: null, quantityStep: 0.001, priceStep: 0.00000001, contractSize: 1 }),
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
    expect(await prisma.externalClientGrantReservation.count({ where: { grantId: f.grant.id } })).toBe(0);
    expect(await counters(f.grant.id)).toMatchObject({ usedActions: 0, usedQuoteAmount: new Prisma.Decimal(0) });
  });

  it('serializes distinct IDs across two OS processes on the grant row', async () => {
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
      child.stdin.end(`${JSON.stringify({ grantId: f.grant.id, secret: f.secret, command })}\n`);
      const completed = new Promise<{ reused?: boolean; id?: string; error?: string }>((resolve, reject) => {
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
    expect(results.filter((item) => item.error)).toEqual([{ error: 'GRANT_PREVIOUS_OPERATION_UNRESOLVED' }]);
    expect(await counters(f.grant.id)).toMatchObject({ usedActions: 1, usedQuoteAmount: new Prisma.Decimal(50) });
  }, 30_000);
});
