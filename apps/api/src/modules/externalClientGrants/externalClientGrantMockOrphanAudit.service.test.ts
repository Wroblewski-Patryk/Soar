import { spawn } from 'node:child_process';
import { Prisma } from '@prisma/client';
import { afterEach, describe, expect, it } from 'vitest';
import { prisma } from '../../prisma/client';
import { hashPassword } from '../../utils/hash';
import { setLiveExecutionPause } from '../orders/liveExecutionPause.service';
import { ensureSubscriptionCatalog, setActiveSubscriptionForUser } from '../subscriptions/subscriptions.service';
import { createExternalClientGrant, revokeExternalClientGrant } from './externalClientGrants.service';
import { bindExternalClientGrantReservationIntent, finalizeBoundExternalClientGrantMockOrphan,
  type GrantLimitCommand } from './externalClientGrantReservation.service';

let testUserId: string | null = null;
const rules = async () => ({ minQuantity: 0.001, minNotional: 1, quantityStep: 0.001,
  priceStep: 0.01, contractSize: 1, quoteCurrency: 'USDT', settleCurrency: 'USDT',
  isContract: true, isLinear: true, isInverse: false });

const fixture = async () => {
  if (!decodeURIComponent(new URL(process.env.DATABASE_URL ?? '').pathname).endsWith('_test')) {
    throw new Error('Mock orphan audit tests require an isolated _test database');
  }
  const user = await prisma.user.create({ data: {
    email: `mock-orphan-audit-${crypto.randomUUID()}@example.com`,
    password: await hashPassword('GrantTest1234'), role: 'ADMIN',
  } });
  testUserId = user.id;
  await ensureSubscriptionCatalog(prisma);
  await setActiveSubscriptionForUser(prisma, {
    userId: user.id, planCode: 'ADVANCED', source: 'ADMIN_OVERRIDE', autoRenew: false,
  });
  const universe = await prisma.marketUniverse.create({ data: {
    userId: user.id, name: 'Mock orphan audit universe', exchange: 'BINANCE',
    marketType: 'FUTURES', baseCurrency: 'USDT', whitelist: ['BTCUSDT'],
  } });
  const group = await prisma.symbolGroup.create({ data: {
    userId: user.id, marketUniverseId: universe.id, name: 'BTC', symbols: ['BTCUSDT'],
  } });
  const strategy = await prisma.strategy.create({ data: {
    userId: user.id, name: 'Mock orphan audit strategy', interval: '5m', leverage: 5,
    walletRisk: 1, config: { additional: { orderType: 'LIMIT', marginMode: 'ISOLATED' } },
  } });
  const wallet = await prisma.wallet.create({ data: {
    userId: user.id, name: 'Mock orphan audit wallet', mode: 'LIVE',
    exchange: 'BINANCE', marketType: 'FUTURES', baseCurrency: 'USDT',
  } });
  const bot = await prisma.bot.create({ data: {
    userId: user.id, name: 'Mock orphan audit bot', mode: 'LIVE',
    exchange: 'BINANCE', marketType: 'FUTURES', isActive: true, liveOptIn: true,
    consentTextVersion: 'mvp-v1', symbolGroupId: group.id,
    strategyId: strategy.id, walletId: wallet.id,
  } });
  const { grant, secret } = await createExternalClientGrant(user.id, {
    botId: bot.id, clientLabel: 'Mock orphan audit', exchange: 'BINANCE',
    marketType: 'FUTURES', symbol: 'BTCUSDT', action: 'PLACE_LIVE_ORDER',
    maxActionQuoteAmount: '50', maxTotalQuoteAmount: '100', maxActions: 2,
    ttlSeconds: 3600, password: 'GrantTest1234',
  });
  const command: GrantLimitCommand = {
    userId: user.id, botId: bot.id, exchange: 'BINANCE', marketType: 'FUTURES',
    symbol: 'BTCUSDT', action: 'PLACE_LIVE_ORDER',
    clientOrderId: `soar_${crypto.randomUUID().replace(/-/g, '').slice(0, 22)}`,
    side: 'BUY', type: 'LIMIT', quantity: '0.5', limitPrice: '100', reduceOnly: false,
    walletId: wallet.id, strategyId: strategy.id, positionId: null,
  };
  const bound = await bindExternalClientGrantReservationIntent({
    grantId: grant.id, secret, command,
  }, { getSymbolRules: rules });
  return { user, bot, grant, secret, bound };
};

const crashAfterReconcile = async (reservationId: string, secret: string) => {
  const worker = spawn(process.execPath, ['--import', 'tsx',
    'src/modules/externalClientGrants/externalClientGrantReservation.processProof.worker.ts'], {
    cwd: process.cwd(), env: process.env, windowsHide: true,
  });
  let output = '';
  let errors = '';
  worker.stdout.on('data', (chunk) => { output += chunk.toString(); });
  worker.stderr.on('data', (chunk) => { errors += chunk.toString(); });
  worker.stdin.end(`${JSON.stringify({ operation: 'mock-crash-after-reconcile', reservationId, secret })}\n`);
  const exitCode = await new Promise<number | null>((resolve) => worker.on('close', resolve));
  expect(exitCode).toBe(77);
  expect(errors).toBe('');
  expect(output).toContain('RECONCILED_WITH_MARKER');
};

const auditData = (userId: string, botId: string, reservationId: string) => ({
  userId, botId, source: 'external_client_grant', actor: 'SYSTEM', level: 'INFO' as const,
  action: 'EXTERNAL_CLIENT_GRANT_MOCK_ORPHAN_FINALIZED',
  message: 'Injected finalization audit evidence',
  entityType: 'ExternalClientGrantReservation', entityId: reservationId,
});

afterEach(async () => {
  if (!testUserId) return;
  const userId = testUserId;
  testUserId = null;
  await prisma.liveCreateOrderSubmission.deleteMany({ where: { grant: { userId } } });
  await prisma.orderFill.deleteMany({ where: { userId } });
  await prisma.order.deleteMany({ where: { userId } });
  await prisma.position.deleteMany({ where: { userId } });
  await prisma.liveOrderIntent.deleteMany({ where: { userId } });
  await prisma.log.deleteMany({ where: { userId } });
  await prisma.externalClientGrant.deleteMany({ where: { userId } });
  await prisma.bot.deleteMany({ where: { userId } });
  await prisma.symbolGroup.deleteMany({ where: { userId } });
  await prisma.marketUniverse.deleteMany({ where: { userId } });
  await prisma.strategy.deleteMany({ where: { userId } });
  await prisma.wallet.deleteMany({ where: { userId } });
  await prisma.userSubscription.deleteMany({ where: { userId } });
  await prisma.user.delete({ where: { id: userId } });
});

describe('fixed mock orphan finalization audit cardinality', () => {
  it('retains the marker on malformed and duplicated finalization audits', async () => {
    const originalControl = await prisma.liveExecutionControl.findUnique({ where: { id: 'global' } });
    try {
      await prisma.liveExecutionControl.upsert({ where: { id: 'global' },
        create: { id: 'global', paused: false, reason: 'test available', version: 1 },
        update: { paused: false, reason: 'test available' } });
      const f = await fixture();
      const reservationId = f.bound.reservation.id;
      const control = await prisma.liveExecutionControl.findUniqueOrThrow({ where: { id: 'global' } });
      await crashAfterReconcile(reservationId, f.secret);
      const marker = await prisma.liveCreateOrderSubmission.findUniqueOrThrow({ where: { reservationId } });
      await prisma.log.create({ data: { ...auditData(f.user.id, f.bot.id, reservationId),
        metadata: { invalid: true } } });
      await expect(finalizeBoundExternalClientGrantMockOrphan({ reservationId, secret: f.secret }))
        .rejects.toMatchObject({ code: 'DELEGATED_MOCK_ORPHAN_UNKNOWN' });
      await prisma.log.create({ data: { ...auditData(f.user.id, f.bot.id, reservationId),
        metadata: { grantId: f.grant.id, markerId: marker.id,
          intentId: f.bound.intentId, orderId: f.bound.intentId,
          clientOrderId: f.bound.reservation.clientOrderId } } });
      await expect(finalizeBoundExternalClientGrantMockOrphan({ reservationId, secret: f.secret }))
        .rejects.toMatchObject({ code: 'DELEGATED_MOCK_ORPHAN_UNKNOWN' });
      expect(await prisma.liveCreateOrderSubmission.count({ where: { grantId: f.grant.id } })).toBe(1);
      expect(await prisma.log.count({ where: { entityId: reservationId,
        action: 'EXTERNAL_CLIENT_GRANT_MOCK_TRANSPORT_STARTED' } })).toBe(1);
      expect(await prisma.order.count({ where: { userId: f.user.id } })).toBe(1);
      expect(await prisma.externalClientGrant.findUniqueOrThrow({ where: { id: f.grant.id } }))
        .toMatchObject({ usedActions: 1, usedQuoteAmount: new Prisma.Decimal(50) });
      await expect(setLiveExecutionPause({ actorUserId: f.user.id, paused: true,
        reason: 'Pause with duplicate finalization audit', expectedVersion: control.version }))
        .rejects.toMatchObject({ code: 'LIVE_PAUSE_SUBMISSION_IN_FLIGHT' });
      await expect(revokeExternalClientGrant(f.user.id, f.grant.id))
        .rejects.toMatchObject({ status: 409 });
    } finally {
      if (originalControl) await prisma.liveExecutionControl.update({ where: { id: 'global' }, data: {
        paused: originalControl.paused, reason: originalControl.reason, version: originalControl.version,
        changedAt: originalControl.changedAt, changedByUserId: originalControl.changedByUserId,
      } });
      else await prisma.liveExecutionControl.deleteMany({ where: { id: 'global' } });
    }
  }, 30_000);

  it('requires exactly one valid audit on retry after marker removal', async () => {
    const originalControl = await prisma.liveExecutionControl.findUnique({ where: { id: 'global' } });
    try {
      await prisma.liveExecutionControl.upsert({ where: { id: 'global' },
        create: { id: 'global', paused: false, reason: 'test available', version: 1 },
        update: { paused: false, reason: 'test available' } });
      const f = await fixture();
      const reservationId = f.bound.reservation.id;
      await crashAfterReconcile(reservationId, f.secret);
      const first = await finalizeBoundExternalClientGrantMockOrphan({ reservationId, secret: f.secret });
      expect(first).toMatchObject({ finalized: true, reused: false });
      expect(await finalizeBoundExternalClientGrantMockOrphan({ reservationId, secret: f.secret }))
        .toMatchObject({ finalized: true, reused: true });
      const finalizedLog = await prisma.log.findFirstOrThrow({ where: {
        entityId: reservationId, action: 'EXTERNAL_CLIENT_GRANT_MOCK_ORPHAN_FINALIZED',
      } });
      const duplicate = await prisma.log.create({ data: {
        ...auditData(f.user.id, f.bot.id, reservationId),
        metadata: { grantId: f.grant.id, markerId: first.markerId,
          intentId: f.bound.intentId, orderId: f.bound.intentId,
          clientOrderId: f.bound.reservation.clientOrderId },
      } });
      await expect(finalizeBoundExternalClientGrantMockOrphan({ reservationId, secret: f.secret }))
        .rejects.toMatchObject({ code: 'DELEGATED_MOCK_ORPHAN_UNKNOWN' });
      await prisma.log.delete({ where: { id: duplicate.id } });
      await prisma.log.update({ where: { id: finalizedLog.id }, data: { metadata: { invalid: true } } });
      await expect(finalizeBoundExternalClientGrantMockOrphan({ reservationId, secret: f.secret }))
        .rejects.toMatchObject({ code: 'DELEGATED_MOCK_ORPHAN_UNKNOWN' });
      expect(await prisma.liveCreateOrderSubmission.count({ where: { grantId: f.grant.id } })).toBe(0);
      expect(await prisma.log.count({ where: { entityId: reservationId,
        action: 'EXTERNAL_CLIENT_GRANT_MOCK_TRANSPORT_STARTED' } })).toBe(1);
      expect(await prisma.externalClientGrant.findUniqueOrThrow({ where: { id: f.grant.id } }))
        .toMatchObject({ usedActions: 1, usedQuoteAmount: new Prisma.Decimal(50) });
    } finally {
      if (originalControl) await prisma.liveExecutionControl.update({ where: { id: 'global' }, data: {
        paused: originalControl.paused, reason: originalControl.reason, version: originalControl.version,
        changedAt: originalControl.changedAt, changedByUserId: originalControl.changedByUserId,
      } });
      else await prisma.liveExecutionControl.deleteMany({ where: { id: 'global' } });
    }
  }, 30_000);
});
