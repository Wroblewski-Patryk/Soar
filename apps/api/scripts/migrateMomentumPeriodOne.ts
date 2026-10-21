import { prisma } from '../src/prisma/client';
import { applyMomentumPeriodMigration,
  inspectMomentumPeriodMigration } from '../src/modules/strategies/strategyMomentumMigration';

const apply = process.argv.includes('--apply');
const expected = process.argv.find((arg) => arg.startsWith('--expected-digest='))
  ?.slice('--expected-digest='.length);

const main = async () => {
  try {
    if (apply && !expected)
      throw new Error('Apply requires --expected-digest=<digest from reviewed dry-run>');
    if (!apply && expected)
      throw new Error('--expected-digest is only valid with --apply');
    const inventory = await inspectMomentumPeriodMigration(prisma);
    process.stdout.write(`${JSON.stringify({ mode: 'dry-run', ...inventory })}\n`);
    if (apply) {
      const result = await applyMomentumPeriodMigration(prisma, expected!);
      process.stdout.write(`${JSON.stringify({ mode: 'apply', ...result })}\n`);
    }
  } catch (error) {
    process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
};

void main();
