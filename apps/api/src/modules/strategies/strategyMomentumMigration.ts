import { createHash } from 'node:crypto';
import type { Prisma, PrismaClient } from '@prisma/client';
import { normalizeLegacyMomentumPeriod } from './strategyMomentumPeriodPolicy';

type StrategyReader = Pick<PrismaClient, 'strategy' | 'botStrategy' |
  'marketGroupStrategyLink' | 'backtestRun'>;
type StrategyRow = { id: string; updatedAt: Date; config: Prisma.JsonValue };

const readRows = (client: StrategyReader) => client.strategy.findMany({
  select: { id: true, updatedAt: true, config: true },
  orderBy: { id: 'asc' },
});

const digestRows = (rows: StrategyRow[]) => createHash('sha256').update(JSON.stringify(
  rows.map((row) => ({ id: row.id, updatedAt: row.updatedAt.toISOString(),
    config: row.config })),
)).digest('hex');

const candidatesFromRows = (rows: StrategyRow[]) => rows.flatMap((row) => {
  const normalized = normalizeLegacyMomentumPeriod(row.config);
  return normalized.fields.length > 0 ? [{ ...row, ...normalized }] : [];
});

const unsafeFromRows = (rows: StrategyRow[]) => rows.flatMap((row) => {
  const result = normalizeLegacyMomentumPeriod(row.config);
  const migratable = new Set(result.fields);
  const fields = result.invalidFields.filter((field) => !migratable.has(field));
  return fields.length > 0 ? [{ id: row.id, fields }] : [];
});

const collectMomentumPeriodInventory = async (client: StrategyReader) => {
  const rows = await readRows(client);
  const candidates = candidatesFromRows(rows);
  const unsafe = unsafeFromRows(rows);
  const ids = candidates.map((row) => row.id);
  const [activeLegacyLinks, activeCanonicalLinks, historicalRuns] = ids.length > 0
    ? await Promise.all([
      client.botStrategy.count({ where: { strategyId: { in: ids }, isEnabled: true,
        bot: { isActive: true } } }),
      client.marketGroupStrategyLink.count({ where: { strategyId: { in: ids },
        isEnabled: true, bot: { isActive: true },
        botMarketGroup: { isEnabled: true, lifecycleStatus: 'ACTIVE' } } }),
      client.backtestRun.count({ where: { strategyId: { in: ids } } }),
    ]) : [0, 0, 0];
  return {
    strategyCount: rows.length,
    digest: digestRows(rows),
    candidateActiveLegacyLinks: activeLegacyLinks,
    candidateActiveCanonicalLinks: activeCanonicalLinks,
    candidateLinkedHistoricalRuns: historicalRuns,
    candidates: candidates.map(({ id, fields }) => ({ id, fields })),
    unsafe,
  };
};

export const inspectMomentumPeriodMigration = (client: PrismaClient) =>
  client.$transaction((tx) => collectMomentumPeriodInventory(tx), {
    isolationLevel: 'RepeatableRead',
  });

export const applyMomentumPeriodMigration = async (
  client: PrismaClient, expectedDigest: string,
) => {
  if (!/^[a-f0-9]{64}$/.test(expectedDigest))
    throw new Error('Expected the exact 64-character dry-run digest');
  return client.$transaction(async (tx) => {
    // Lock the definition table for the short comparison/write transaction.
    // Concurrent create/update/import cannot enter between the read and apply.
    await tx.$executeRaw`LOCK TABLE "Strategy" IN SHARE ROW EXCLUSIVE MODE`;
    const rows = await readRows(tx);
    const actualDigest = digestRows(rows);
    if (actualDigest !== expectedDigest)
      throw new Error('Strategy inventory changed since dry-run; rerun inventory');
    if (unsafeFromRows(rows).length > 0)
      throw new Error('Strategy inventory contains invalid MOMENTUM periods requiring separate review');
    const candidates = candidatesFromRows(rows);
    for (const candidate of candidates) {
      const updated = await tx.strategy.updateMany({
        where: { id: candidate.id, updatedAt: candidate.updatedAt },
        data: { config: candidate.config as Prisma.InputJsonValue },
      });
      if (updated.count !== 1)
        throw new Error(`Strategy changed during migration: ${candidate.id}`);
    }
    return { migrated: candidates.length,
      changedFields: candidates.reduce((total, row) => total + row.fields.length, 0),
      ids: candidates.map((row) => row.id) };
  }, { isolationLevel: 'Serializable', timeout: 30_000 });
};
