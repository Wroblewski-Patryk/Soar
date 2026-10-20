import { PrismaClient } from '@prisma/client';
import { createInterface } from 'node:readline';
import { executeBoundExternalClientGrantMock } from '../src/modules/externalClientGrants/externalClientGrantReservation.service';

const databaseName = (() => {
  try { return decodeURIComponent(new URL(process.env.DATABASE_URL ?? '').pathname); }
  catch { return ''; }
})();
if (process.env.NODE_ENV !== 'test' || !databaseName.endsWith('_test')) {
  throw new Error('ApiKey mutation fence worker requires an isolated _test database');
}

const db = new PrismaClient();
const lines = createInterface({ input: process.stdin, crlfDelay: Infinity })[Symbol.asyncIterator]();

void (async () => {
try {
  const first = await lines.next();
  const request = JSON.parse(first.value ?? '{}') as {
    operation: string; keyId?: string; reservationId?: string; secret?: string;
  };
  if (request.operation === 'mock-hold-result' && request.reservationId && request.secret) {
    const result = await executeBoundExternalClientGrantMock({
      reservationId: request.reservationId, secret: request.secret,
      scenario: 'HOLD_AFTER_RESULT_JOURNAL',
    });
    process.stdout.write(`RESULT ${JSON.stringify({ orderId: result.orderId })}\n`);
  } else if (request.operation === 'mock-crash-after-start' && request.reservationId && request.secret) {
    const execution = executeBoundExternalClientGrantMock({
      reservationId: request.reservationId, secret: request.secret, scenario: 'DELAYED_FILL',
    });
    let started = false;
    for (let attempt = 0; attempt < 300 && !started; attempt += 1) {
      started = (await db.log.count({ where: {
        entityType: 'ExternalClientGrantReservation', entityId: request.reservationId,
        action: 'EXTERNAL_CLIENT_GRANT_MOCK_TRANSPORT_STARTED',
      } })) === 1;
      if (!started) await new Promise((resolve) => setTimeout(resolve, 25));
    }
    if (!started) throw new Error('Synthetic transport did not start');
    process.stdout.write('MOCK_ENTERED\n', () => process.exit(76));
    await execution;
  } else if (request.operation === 'hold-rotation' && request.keyId) {
    await db.$transaction(async (tx) => {
      await tx.apiKey.update({ where: { id: request.keyId! },
        data: { apiSecret: 'rotated-in-separate-process' } });
      process.stdout.write('ROTATION_LOCKED\n');
      const release = await lines.next();
      if (release.value !== 'COMMIT') throw new Error('Rotation was not released');
    }, { timeout: 20_000 });
    process.stdout.write('ROTATION_COMMITTED\n');
  } else {
    throw new Error('Unsupported test worker operation');
  }
} catch (error) {
  process.stderr.write(String(error));
  process.exitCode = 1;
} finally {
  await db.$disconnect();
  process.stdin.pause();
}
})().catch((error) => {
  process.stderr.write(String(error));
  process.exitCode = 1;
});
