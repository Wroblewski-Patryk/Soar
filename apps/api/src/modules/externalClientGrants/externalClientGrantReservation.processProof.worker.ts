import { PrismaClient } from '@prisma/client';
import {
  beginExternalClientGrantSubmission, reserveExternalClientGrantOrder,
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
      const result = await reserveExternalClientGrantOrder(request, {
        db,
        getSymbolRules: async () => ({
          minQuantity: 0.001, minNotional: 1, quantityStep: 0.001, priceStep: 0.01, contractSize: 1,
        }),
      });
      process.stdout.write(`RESULT ${JSON.stringify({ reused: result.reused, id: result.reservation.id })}\n`);
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
