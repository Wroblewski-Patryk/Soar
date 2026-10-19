import { PrismaClient } from '@prisma/client';
import {
  admitBoundExternalClientGrantSubmission, beginExternalClientGrantSubmission,
  bindExternalClientGrantReservationIntent,
  executeBoundExternalClientGrantMock,
  reserveExternalClientGrantOrder,
} from './externalClientGrantReservation.service';

const rules = async () => ({
  minQuantity: 0.001, minNotional: 1, quantityStep: 0.001, priceStep: 0.01, contractSize: 1,
  quoteCurrency: 'USDT', settleCurrency: 'USDT', isContract: true, isLinear: true, isInverse: false,
});

const db = new PrismaClient();
let input = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', (chunk: string) => {
  input += chunk;
  if (!input.includes('\n')) return;
  process.stdin.pause();
  void (async () => {
    try {
      const request = JSON.parse(input.slice(0, input.indexOf('\n')));
      process.stdout.write('STARTED\n');
      if (request.operation === 'mock-crash-after-reconcile') {
        const execution = executeBoundExternalClientGrantMock({
          reservationId: request.reservationId, secret: request.secret,
          scenario: 'HOLD_AFTER_RECONCILE',
        });
        let durable = false;
        for (let attempt = 0; attempt < 150; attempt += 1) {
          const reservation = await db.externalClientGrantReservation.findUnique({
            where: { id: request.reservationId },
          });
          const marker = await db.liveCreateOrderSubmission.findUnique({
            where: { reservationId: request.reservationId }, select: { id: true },
          });
          if (reservation?.state === 'SUBMITTED' && reservation.proofType === 'DURABLE_ORDER' &&
              reservation.proofRef && marker) { durable = true; break; }
          await new Promise<void>((resolve) => setTimeout(resolve, 50));
        }
        if (!durable) throw new Error('Mock Order and reservation did not reconcile before marker clear');
        process.stdout.write('RECONCILED_WITH_MARKER\n', () => process.exit(77));
        await execution;
        return;
      }
      if (request.operation === 'mock-crash-after-submit-enter') {
        const execution = executeBoundExternalClientGrantMock({
          reservationId: request.reservationId, secret: request.secret,
          scenario: 'DELAYED_FILL',
        });
        let started = false;
        for (let attempt = 0; attempt < 100; attempt += 1) {
          const audit = await db.log.findFirst({ where: {
            entityType: 'ExternalClientGrantReservation', entityId: request.reservationId,
            action: 'EXTERNAL_CLIENT_GRANT_MOCK_TRANSPORT_STARTED',
          }, select: { id: true } });
          if (audit) { started = true; break; }
          await new Promise<void>((resolve) => setTimeout(resolve, 50));
        }
        if (!started) throw new Error('Mock transport did not start');
        process.stdout.write('MOCK_ENTERED\n', () => process.exit(76));
        await execution;
        return;
      }
      if (request.operation === 'admit' || request.operation === 'crash-after-admission') {
        const admitted = await admitBoundExternalClientGrantSubmission(request, { db, getSymbolRules: rules });
        if (request.operation === 'crash-after-admission') {
          process.stdout.write(`ADMITTED ${JSON.stringify(admitted)}\n`, () => process.exit(75));
          await new Promise<never>(() => {});
        }
        process.stdout.write(`RESULT ${JSON.stringify(admitted)}\n`);
        return;
      }
      if (request.operation === 'crash-after-begin') {
        await beginExternalClientGrantSubmission({
          reservationId: request.reservationId, secret: request.secret,
        }, db);
        // Deliberately exit without disconnecting or running recovery. The
        // parent proves the committed uncertain state survives this process.
        process.stdout.write('BEGUN\n', () => process.exit(73));
        await new Promise<never>(() => {});
      }
      if (request.operation === 'crash-after-bind') {
        const bound = await bindExternalClientGrantReservationIntent(request, {
          db, getSymbolRules: rules,
        });
        process.stdout.write(`BOUND ${JSON.stringify({ reservationId: bound.reservation.id,
          intentId: bound.intentId })}\n`, () => process.exit(74));
        await new Promise<never>(() => {});
      }
      const reserve = request.operation === 'bind'
        ? bindExternalClientGrantReservationIntent : reserveExternalClientGrantOrder;
      const result = await reserve(request, {
        db, getSymbolRules: rules,
      });
      process.stdout.write(`RESULT ${JSON.stringify({ reused: result.reused, id: result.reservation.id,
        intentId: result.intentId })}\n`);
    } catch (error) {
      process.stdout.write(`RESULT ${JSON.stringify({ error: (error as { code?: string }).code ?? 'UNAVAILABLE' })}\n`);
    } finally {
      await db.$disconnect();
    }
  })().catch((error) => {
    process.stderr.write(String(error));
    process.exitCode = 1;
  });
});
