import { PrismaClient } from '@prisma/client';
import {
  beginExternalClientGrantSubmission, bindExternalClientGrantReservationIntent,
  reserveExternalClientGrantOrder,
} from './externalClientGrantReservation.service';

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
          db, getSymbolRules: async () => ({
            minQuantity: 0.001, minNotional: 1, quantityStep: 0.001, priceStep: 0.01, contractSize: 1,
            quoteCurrency: 'USDT', settleCurrency: 'USDT', isContract: true, isLinear: true, isInverse: false,
          }),
        });
        process.stdout.write(`BOUND ${JSON.stringify({ reservationId: bound.reservation.id,
          intentId: bound.intentId })}\n`, () => process.exit(74));
        await new Promise<never>(() => {});
      }
      const reserve = request.operation === 'bind'
        ? bindExternalClientGrantReservationIntent : reserveExternalClientGrantOrder;
      const result = await reserve(request, {
        db,
        getSymbolRules: async () => ({
          minQuantity: 0.001, minNotional: 1, quantityStep: 0.001, priceStep: 0.01, contractSize: 1,
          quoteCurrency: 'USDT', settleCurrency: 'USDT', isContract: true, isLinear: true, isInverse: false,
        }),
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
