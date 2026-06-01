# LUC-1300 Owner-Batch Source-Control Closure SHA Evidence (2026-06-01)

## Scope
- Parent dependency: `LUC-1223`
- Child objective: execute owner-batch source-control closure for `BATCH-A` and `BATCH-B` with concrete SHA evidence.
- Branch: `main`

## Batch A (Backend/Test Automation)
- Commit: `44a9ceba612e8d49eb86a9001e63b1f0be6243ea`
- Subject: `LUC-1300 batch A backend runtime tests and contracts`
- Files (`9`):
  - `apps/api/package.json`
  - `apps/api/src/modules/bots/bots.e2e.test.ts`
  - `apps/api/src/modules/bots/bots.runtime-close-authority.route-pack.e2e.test.ts`
  - `apps/api/src/modules/bots/bots.runtime-close-dca-authority.e2e.test.ts`
  - `apps/api/src/modules/positions/livePositionReconciliation.service.test.ts`
  - `apps/api/src/modules/positions/livePositionReconciliation.service.ts`
  - `apps/api/src/modules/positions/livePositionReconciliation.types.ts`
  - `apps/api/src/modules/positions/positions.orphan-repair.contract.e2e.test.ts`
  - `apps/api/src/router/workers-health-readiness.test.ts`

### Batch A Scoped Validation
- Command:
  - `pnpm --filter api exec vitest run src/modules/bots/bots.e2e.test.ts src/modules/positions/livePositionReconciliation.service.test.ts src/router/workers-health-readiness.test.ts src/modules/bots/bots.runtime-close-authority.route-pack.e2e.test.ts src/modules/bots/bots.runtime-close-dca-authority.e2e.test.ts src/modules/positions/positions.orphan-repair.contract.e2e.test.ts`
- Result: `FAILED` (environment blocker for DB-backed suites).
- Observed blocker signal:
  - Prisma initialization errors against `localhost:5432` (`Can't reach database server at localhost:5432`) in DB-coupled suites.
- Non-DB suite signal:
  - `src/router/workers-health-readiness.test.ts`: `PASS` (`8` tests).

## Batch B (Frontend)
- Commit: `630be2f56b7d8a1cffbf6101d3aae1862a8386bf`
- Subject: `LUC-1300 batch B frontend runtime signals i18n`
- Files (`8`):
  - `apps/web/src/features/dashboard-home/components/HomeLiveWidgets.tsx`
  - `apps/web/src/features/dashboard-home/components/home-live-widgets/RuntimeSignalsSection.test.tsx`
  - `apps/web/src/features/dashboard-home/components/home-live-widgets/RuntimeSignalsSection.tsx`
  - `apps/web/src/features/dashboard-home/components/home-live-widgets/runtimeSignalConditionState.test.ts`
  - `apps/web/src/i18n/namespaces/dashboard-home.de-CH.ts`
  - `apps/web/src/i18n/namespaces/dashboard-home.en.ts`
  - `apps/web/src/i18n/namespaces/dashboard-home.pl.ts`
  - `apps/web/src/i18n/namespaces/dashboard-home.pt.ts`

### Batch B Scoped Validation
- Command:
  - `pnpm --filter web exec vitest run src/features/dashboard-home/components/home-live-widgets/RuntimeSignalsSection.test.tsx src/features/dashboard-home/components/home-live-widgets/runtimeSignalConditionState.test.ts`
- Result: `PASS`
  - Test files: `2 passed`
  - Tests: `10 passed`

## Closure Result for LUC-1300
- `BATCH-A` commit SHA attached: yes.
- `BATCH-B` commit SHA attached: yes.
- Owner-batch split evidence attached: yes.
- Push/deploy performed: no.
- Residual risk:
  - Backend DB-coupled test suites could not be fully validated in this shell because local PostgreSQL on `localhost:5432` is not reachable.

## Next Dependency Handoff
1. Use these SHAs to unblock parent `LUC-1223` owner-batch dependency gate.
2. Continue with `BATCH-C/BATCH-D/BATCH-E` closure path in the parent issue.
