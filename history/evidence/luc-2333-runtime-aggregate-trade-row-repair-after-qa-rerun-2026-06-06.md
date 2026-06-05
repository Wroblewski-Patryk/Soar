# LUC-2333 Runtime Aggregate Trade Row Repair Evidence

Date: 2026-06-06

## Scope

- Backend API Bot Runtime aggregate repair after the DB-backed QA rerun for
  [LUC-2317](/LUC/issues/LUC-2317) still returned HTTP `200` with empty
  persisted trade rows/totals.
- Touched runtime aggregate read behavior only:
  `apps/api/src/modules/bots/runtimeMonitoringAggregateRead.service.ts`.
- Preserved the existing focused e2e spy repair in
  `apps/api/src/modules/bots/bots.monitoring-aggregate.e2e.test.ts`.

## Change

- Added per-subquery empty fallback payloads for aggregate symbol stats,
  positions, and trades.
- Changed aggregate fanout handling so a timeout/error in one nested reader no
  longer drops the entire session row and no longer erases already-resolved
  trade totals/items from sibling readers.
- Kept the bounded trade materialization contract from [LUC-2300](/LUC/issues/LUC-2300):
  visible trade rows remain DB paged, trade totals/fees use DB count/aggregate,
  and `trade.findMany` remains bounded below hidden row cardinality.

## Verification

Command:

```powershell
pnpm --filter api exec vitest run src/modules/bots/bots.monitoring-aggregate.e2e.test.ts -t "bounds aggregate hidden trade materialization while preserving trade totals|keeps aggregate trade totals truthful when visible trade rows are limited" --reporter=verbose --testTimeout=30000
```

Result:

- PASS: `2` tests passed, `17` skipped.
- Neighboring trade-total proof returned visible rows with truthful totals.
- Bounded materialization proof returned `trades.total === 260` and
  `trades.items.length === 5`.
- Spy assertion kept `trade.findMany` bounded: all observed trade `findMany`
  calls had a numeric `take`, at least one `take === 5`, and no call reached
  hidden row cardinality `260`.

Command:

```powershell
pnpm --filter api exec tsc --noEmit --pretty false
```

Result:

- PASS.

## Boundaries

- No production deploy, restart, rollback, migration, database schema change,
  account mutation, secret readback, exchange mutation, protected smoke, or
  live-trading action.
- Local DB/Redis containers from the QA infrastructure lane were reused; no
  new long-running services were started by this repair.
- `chrome-headless-shell` cleanup check returned no matching processes.

## Residual Risk

- Production promotion, protected authenticated runtime smoke, and SLO proof
  remain QA/Ops release gates after source-control closure and deployment
  authorization.
