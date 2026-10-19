import { spawn } from 'node:child_process';
import { Prisma, PrismaClient } from '@prisma/client';
import { afterEach, describe, expect, it } from 'vitest';
import { prisma } from '../../prisma/client';
import { hashPassword } from '../../utils/hash';
import { setLiveExecutionPause } from '../orders/liveExecutionPause.service';
import { ensureSubscriptionCatalog, setActiveSubscriptionForUser } from '../subscriptions/subscriptions.service';
import { createExternalClientGrant, revokeExternalClientGrant } from './externalClientGrants.service';
import { claimBoundExternalClientGrantDispatch } from './externalClientGrantDispatchClaim.service';
import { admitBoundExternalClientGrantSubmission, bindExternalClientGrantReservationIntent,
  withFreshBoundExternalClientGrantSubmitPermit,
  type GrantLimitCommand } from './externalClientGrantReservation.service';

const dedicatedDb = (() => {
  try {
    const name = decodeURIComponent(new URL(process.env.DATABASE_URL ?? '').pathname);
    return name.startsWith('/soar_ext_grant_001t_') && name.endsWith('_test');
  } catch { return false; }
})();
const rules = async () => ({ minQuantity: 0.001, minNotional: 1, quantityStep: 0.001,
  priceStep: 0.01, contractSize: 1, quoteCurrency: 'USDT', settleCurrency: 'USDT',
  isContract: true, isLinear: true, isInverse: false });
let userId: string | null = null;

const fixture = async () => {
  if (!dedicatedDb) throw new Error('001T requires a dedicated _test database');
  const user = await prisma.user.create({ data: { role: 'ADMIN',
    email: `dispatch-claim-${crypto.randomUUID()}@example.com`,
    password: await hashPassword('GrantTest1234') } });
  userId = user.id;
  await ensureSubscriptionCatalog(prisma);
  await setActiveSubscriptionForUser(prisma, { userId: user.id, planCode: 'ADVANCED',
    source: 'ADMIN_OVERRIDE', autoRenew: false });
  const universe = await prisma.marketUniverse.create({ data: { userId: user.id,
    name: '001T universe', exchange: 'BINANCE', marketType: 'FUTURES', baseCurrency: 'USDT' } });
  const group = await prisma.symbolGroup.create({ data: { userId: user.id,
    marketUniverseId: universe.id, name: 'BTC', symbols: ['BTCUSDT'] } });
  const key = await prisma.apiKey.create({ data: { userId: user.id, label: '001T test key',
    exchange: 'BINANCE', apiKey: 'test-only-key', apiSecret: 'test-only-secret' } });
  const bot = await prisma.bot.create({ data: { userId: user.id, name: '001T bot',
    mode: 'LIVE', exchange: 'BINANCE', marketType: 'FUTURES', isActive: true,
    liveOptIn: true, apiKeyId: key.id, symbolGroupId: group.id } });
  const { grant, secret } = await createExternalClientGrant(user.id, { botId: bot.id,
    clientLabel: '001T client', exchange: 'BINANCE', marketType: 'FUTURES',
    symbol: 'BTCUSDT', action: 'PLACE_LIVE_ORDER', maxActionQuoteAmount: '50',
    maxTotalQuoteAmount: '100', maxActions: 2, ttlSeconds: 3600, password: 'GrantTest1234' });
  const command: GrantLimitCommand = { userId: user.id, botId: bot.id, exchange: 'BINANCE',
    marketType: 'FUTURES', symbol: 'BTCUSDT', action: 'PLACE_LIVE_ORDER',
    clientOrderId: `soar_${crypto.randomUUID().replace(/-/g, '').slice(0, 22)}`,
    side: 'BUY', type: 'LIMIT', quantity: '0.5', limitPrice: '100', reduceOnly: false,
    walletId: null, strategyId: null, positionId: null };
  const bound = await bindExternalClientGrantReservationIntent({ grantId: grant.id, secret, command },
    { getSymbolRules: rules });
  return { user, bot, key, grant, secret, bound };
};

const withUnpausedControl = async (run: () => Promise<void>) => {
  const original = await prisma.liveExecutionControl.findUnique({ where: { id: 'global' } });
  try {
    await prisma.liveExecutionControl.upsert({ where: { id: 'global' },
      create: { id: 'global', paused: false, reason: 'test available', version: 1 },
      update: { paused: false, reason: 'test available' } });
    await run();
  } finally {
    if (original) await prisma.liveExecutionControl.update({ where: { id: 'global' }, data: {
      paused: original.paused, reason: original.reason, version: original.version,
      changedAt: original.changedAt, changedByUserId: original.changedByUserId } });
    else await prisma.liveExecutionControl.deleteMany({ where: { id: 'global' } });
  }
};

afterEach(async () => {
  if (!userId) return;
  const id = userId;
  userId = null;
  await prisma.liveCreateOrderSubmission.deleteMany({ where: { grant: { userId: id } } });
  await prisma.liveOrderIntent.deleteMany({ where: { userId: id } });
  await prisma.log.deleteMany({ where: { userId: id } });
  await prisma.externalClientGrant.deleteMany({ where: { userId: id } });
  await prisma.bot.deleteMany({ where: { userId: id } });
  await prisma.symbolGroup.deleteMany({ where: { userId: id } });
  await prisma.marketUniverse.deleteMany({ where: { userId: id } });
  await prisma.apiKey.deleteMany({ where: { userId: id } });
  await prisma.userSubscription.deleteMany({ where: { userId: id } });
  await prisma.user.delete({ where: { id } });
});

describe('001T durable dispatch claim foundation', () => {
  it.skipIf(!dedicatedDb)('rejects every partial hash claim but accepts old and complete markers', async () => {
    await withUnpausedControl(async () => {
      const f = await fixture();
      const input = { reservationId: f.bound.reservation.id, secret: f.secret };
      const admitted = await admitBoundExternalClientGrantSubmission(input, { getSymbolRules: rules });
      const oldMarker = await prisma.liveCreateOrderSubmission.findUniqueOrThrow({
        where: { id: admitted.markerId } });
      expect(oldMarker).toMatchObject({ dispatchClaimedAt: null,
        dispatchCommandHash: null, dispatchIntentHash: null });
      const intent = await prisma.liveOrderIntent.findUniqueOrThrow({ where: { id: f.bound.intentId } });
      const complete = { dispatchClaimedAt: new Date(), dispatchBotId: f.bot.id,
        dispatchCommandHash: f.bound.reservation.commandHash,
        dispatchIntentHash: intent.payloadHash, dispatchApiKeyId: f.key.id,
        dispatchApiKeyUpdatedAt: f.key.updatedAt };
      for (const missing of [
        { dispatchCommandHash: null },
        { dispatchIntentHash: null },
        { dispatchCommandHash: null, dispatchIntentHash: null },
      ]) {
        await expect(prisma.liveCreateOrderSubmission.update({ where: { id: oldMarker.id },
          data: { ...complete, ...missing } }))
          .rejects.toThrow('LiveCreateOrderSubmission_dispatch_claim_complete_check');
        expect(await prisma.liveCreateOrderSubmission.findUniqueOrThrow({ where: { id: oldMarker.id } }))
          .toMatchObject({ dispatchClaimedAt: null, dispatchCommandHash: null, dispatchIntentHash: null });
      }
      expect(await prisma.liveCreateOrderSubmission.update({ where: { id: oldMarker.id },
        data: complete })).toMatchObject(complete);
    });
  });

  it.skipIf(!dedicatedDb)('commits exactly one claim and blocks pause/revoke without enabling submit', async () => {
    await withUnpausedControl(async () => {
      const f = await fixture();
      const input = { reservationId: f.bound.reservation.id, secret: f.secret };
      const claim = () => claimBoundExternalClientGrantDispatch(input, { getSymbolRules: rules });
      const results = await Promise.all([claim(), claim()]);
      expect(results.filter((result) => result.claimed)).toHaveLength(1);
      expect(results.filter((result) => result.reused)).toHaveLength(1);
      expect(results.every((result) => result.lookupOnly)).toBe(true);
      const marker = await prisma.liveCreateOrderSubmission.findUniqueOrThrow({
        where: { reservationId: f.bound.reservation.id } });
      const intent = await prisma.liveOrderIntent.findUniqueOrThrow({ where: { id: f.bound.intentId } });
      expect(marker).toMatchObject({ grantId: f.grant.id, intentId: intent.id,
        clientOrderId: f.bound.reservation.clientOrderId, exchangeId: 'BINANCE',
        symbol: 'BTCUSDT', marketType: 'future', dispatchBotId: f.bot.id,
        dispatchCommandHash: f.bound.reservation.commandHash,
        dispatchIntentHash: intent.payloadHash, dispatchApiKeyId: f.key.id,
        dispatchApiKeyUpdatedAt: f.key.updatedAt });
      expect(marker.dispatchClaimedAt).not.toBeNull();
      expect((await prisma.externalClientGrantReservation.findUniqueOrThrow({
        where: { id: f.bound.reservation.id } })).state).toBe('SUBMISSION_UNCERTAIN');
      expect(await prisma.log.count({ where: { entityId: f.bound.reservation.id,
        action: 'EXTERNAL_CLIENT_GRANT_DISPATCH_CLAIMED' } })).toBe(1);
      expect(await prisma.externalClientGrant.findUniqueOrThrow({ where: { id: f.grant.id } }))
        .toMatchObject({ usedActions: 1, usedQuoteAmount: new Prisma.Decimal(50) });
      let submissions = 0;
      await expect(withFreshBoundExternalClientGrantSubmitPermit(input,
        async () => { submissions += 1; })).rejects.toMatchObject({ code: 'DELEGATED_SUBMIT_PERMIT_DISABLED' });
      expect(submissions).toBe(0);
      const control = await prisma.liveExecutionControl.findUniqueOrThrow({ where: { id: 'global' } });
      await expect(setLiveExecutionPause({ actorUserId: f.user.id, paused: true,
        reason: 'Claim remains unresolved', expectedVersion: control.version }))
        .rejects.toMatchObject({ code: 'LIVE_PAUSE_SUBMISSION_IN_FLIGHT' });
      await expect(revokeExternalClientGrant(f.user.id, f.grant.id))
        .rejects.toMatchObject({ status: 409 });
    });
  });

  it.skipIf(!dedicatedDb)('lets pause and revoke win before claim without changing reservation', async () => {
    await withUnpausedControl(async () => {
      const f = await fixture();
      const input = { reservationId: f.bound.reservation.id, secret: f.secret };
      const control = await prisma.liveExecutionControl.findUniqueOrThrow({ where: { id: 'global' } });
      await setLiveExecutionPause({ actorUserId: f.user.id, paused: true,
        reason: 'Pause before claim', expectedVersion: control.version });
      await expect(claimBoundExternalClientGrantDispatch(input, { getSymbolRules: rules }))
        .rejects.toMatchObject({ code: 'LIVE_PRETRADE_PAUSED' });
      const paused = await prisma.liveExecutionControl.findUniqueOrThrow({ where: { id: 'global' } });
      await setLiveExecutionPause({ actorUserId: f.user.id, paused: false,
        reason: 'Resume before revoke', expectedVersion: paused.version });
      await revokeExternalClientGrant(f.user.id, f.grant.id);
      await expect(claimBoundExternalClientGrantDispatch(input, { getSymbolRules: rules }))
        .rejects.toMatchObject({ code: 'GRANT_SCOPE_UNAVAILABLE' });
      expect((await prisma.externalClientGrantReservation.findUniqueOrThrow({
        where: { id: f.bound.reservation.id } })).state).toBe('RESERVED');
      expect(await prisma.liveCreateOrderSubmission.count({ where: { reservationId: f.bound.reservation.id } })).toBe(0);
      expect(await prisma.externalClientGrant.findUniqueOrThrow({ where: { id: f.grant.id } }))
        .toMatchObject({ usedActions: 1, usedQuoteAmount: new Prisma.Decimal(50) });
    });
  });

  it.skipIf(!dedicatedDb)('keeps one claim after rollback, lost response, and process restart', async () => {
    await withUnpausedControl(async () => {
      const f = await fixture();
      const input = { reservationId: f.bound.reservation.id, secret: f.secret };
      try {
        await prisma.$executeRawUnsafe(`CREATE FUNCTION claim_001t_rollback() RETURNS trigger
          LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION USING ERRCODE = '40001',
          MESSAGE = 'forced claim rollback'; RETURN NEW; END $$`);
        await prisma.$executeRawUnsafe(`CREATE TRIGGER claim_001t_rollback_trigger
          BEFORE INSERT ON "LiveCreateOrderSubmission" FOR EACH ROW
          WHEN (NEW."dispatchClaimedAt" IS NOT NULL) EXECUTE FUNCTION claim_001t_rollback()`);
        await expect(claimBoundExternalClientGrantDispatch(input, { getSymbolRules: rules }))
          .rejects.toMatchObject({ code: 'P2034' });
        expect((await prisma.externalClientGrantReservation.findUniqueOrThrow({
          where: { id: f.bound.reservation.id } })).state).toBe('RESERVED');
        expect(await prisma.liveCreateOrderSubmission.count({ where: { reservationId: f.bound.reservation.id } })).toBe(0);
      } finally {
        await prisma.$executeRawUnsafe('DROP TRIGGER IF EXISTS claim_001t_rollback_trigger ON "LiveCreateOrderSubmission"');
        await prisma.$executeRawUnsafe('DROP FUNCTION IF EXISTS claim_001t_rollback()');
      }
      const lostCommitDb = new Proxy(prisma, { get(target, property, receiver) {
        if (property === '$transaction') return async (...args: Parameters<PrismaClient['$transaction']>) => {
          await Reflect.apply(target.$transaction, target, args);
          throw Object.assign(new Error('simulated lost commit response'), { code: 'P2028' });
        };
        return Reflect.get(target, property, receiver);
      } }) as PrismaClient;
      await expect(claimBoundExternalClientGrantDispatch(input,
        { db: lostCommitDb, getSymbolRules: rules })).rejects.toMatchObject({ code: 'P2028' });
      const worker = spawn(process.execPath, ['--import', 'tsx',
        'src/modules/externalClientGrants/externalClientGrantReservation.processProof.worker.ts'], {
        cwd: process.cwd(), env: process.env, windowsHide: true });
      let output = '';
      let errors = '';
      worker.stdout.on('data', (chunk) => { output += chunk.toString(); });
      worker.stderr.on('data', (chunk) => { errors += chunk.toString(); });
      worker.stdin.end(`${JSON.stringify({ operation: 'claim', ...input })}\n`);
      const exitCode = await new Promise<number | null>((resolve) => worker.on('close', resolve));
      expect({ exitCode, errors }).toEqual({ exitCode: 0, errors: '' });
      expect(output).toContain('"reused":true');
      expect(output).toContain('"claimed":false');
      expect(await prisma.log.count({ where: { entityId: f.bound.reservation.id,
        action: 'EXTERNAL_CLIENT_GRANT_DISPATCH_CLAIMED' } })).toBe(1);
      expect(await prisma.externalClientGrant.findUniqueOrThrow({ where: { id: f.grant.id } }))
        .toMatchObject({ usedActions: 1, usedQuoteAmount: new Prisma.Decimal(50) });
    });
  }, 30_000);
});
