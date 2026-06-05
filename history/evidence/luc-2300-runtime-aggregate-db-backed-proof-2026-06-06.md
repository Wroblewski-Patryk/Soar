# LUC-2300 Runtime Aggregate DB-Backed Proof

Date: 2026-06-06

## Scope
Resume proof after the local Postgres blocker for [LUC-2300](/LUC/issues/LUC-2300)
was resolved.

## Commands
- PASS:
  `pnpm --filter api exec vitest run src/modules/bots/bots.monitoring-aggregate.e2e.test.ts --run --sequence.concurrent=false --testTimeout=60000 --testNamePattern "keeps aggregate trade totals truthful"`
  - Result: `1` passed / `18` skipped.
- PASS:
  `pnpm --filter api exec vitest run src/modules/bots/bots.monitoring-aggregate.e2e.test.ts --run --sequence.concurrent=false --testTimeout=60000 --testNamePattern "bounds aggregate hidden trade materialization"`
  - Result: `1` passed / `18` skipped.

## Result
The focused DB-backed aggregate tests now verify:
- small visible response still reports truthful trade totals;
- high-cardinality hidden trade history (`260` rows) is not fully materialized
  by `trade.findMany` for the aggregate response;
- `perSessionLimit=5` returns five visible trade rows while preserving
  `trades.total=260`.

## Safety
No production deploy, restart, migration, account mutation, secret readback,
exchange action, or live-trading action was performed.
