# LUC-5604 API Backtests Shared-DB Cleanup Repair

## Header

- ID: [LUC-5604](/LUC/issues/LUC-5604)
- Title: Repair API smoke backtests e2e shared-DB cleanup residual
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Core Backend Engineer
- Priority: P1
- Module Confidence Rows: API smoke / Backtests e2e / test harness DB cleanup
- Mission ID: LUC-5604-API-BACKTESTS-SHARED-DB-CLEANUP-REPAIR-2026-06-27
- Mission Status: VERIFIED

## Context

[LUC-5590](/LUC/issues/LUC-5590) repaired repeatable runner teardown sequencing,
but the API smoke pack still failed inside
`apps/api/src/modules/backtests/backtests.e2e.test.ts` with shared-DB cleanup
residuals: missing user after register, `BotMarketGroup_symbolGroupId_fkey`,
`MarketUniverse_userId_fkey`, and `Position_userId_fkey`.

## Goal

Repair the backtests API e2e cleanup/isolation path so
`pnpm run test:go-live:api:with-infra` and the combined repeatable
`api,backtests` command pass locally without skipping DB-backed assertions.

## Scope

- `apps/api/src/modules/backtests/backtests.e2e.test.ts`
- Local generated evidence:
  `history/evidence/luc-5604-api-backtests-shared-db-cleanup-repair-2026-06-27.md`
- State/context updates for release confidence.

## Implementation Plan

1. Diagnose Prisma FK order and async backtest queue cleanup residuals.
2. Replace the narrow `BacktestRun` retry with a full dependency-ordered reset
   helper.
3. Add missing user-owned and position/order-linked model cleanup.
4. Validate focused backtests, API smoke with infra, and combined repeatable
   `api,backtests`.
5. Record evidence and residual risk.

## Acceptance Criteria

- Focused diagnosis classifies the failure as cleanup order plus async inline
  backtest completion residue.
- Repair uses existing Prisma/Vitest test infrastructure.
- No mock DB, product bypass, or skipped DB-backed assertion is introduced.
- `pnpm run test:go-live:api:with-infra` passes locally.
- `pnpm run qa:smoke-e2e:repeatable -- --checks api,backtests` passes locally.

## Definition of Done

- [x] Cleanup repair implemented in the focused e2e test harness.
- [x] Focused backtests e2e passes.
- [x] API go-live smoke with infra passes.
- [x] Combined repeatable `api,backtests` passes and writes artifact/evidence.
- [x] Project evidence/state updated.

## Validation Evidence

- `pnpm --filter api exec vitest run src/modules/backtests/backtests.e2e.test.ts --run`
  - PASS: 1 file / 15 tests.
- `pnpm run test:go-live:api:with-infra`
  - PASS: 4 files / 45 tests.
- `pnpm run qa:smoke-e2e:repeatable -- --checks api,backtests`
  - PASS: API smoke pack and focused backtests e2e.
- Evidence file:
  `history/evidence/luc-5604-api-backtests-shared-db-cleanup-repair-2026-06-27.md`.
- Repeatable artifact:
  `history/artifacts/qa-repeatable-smoke-e2e-2026-06-27.json`.

## Architecture Evidence

- Architecture source reviewed: `docs/engineering/testing.md`,
  `apps/api/prisma/schema.prisma`, `apps/api/src/modules/backtests/*`.
- Fits approved architecture: yes.
- Mismatch discovered: no.
- Decision required from user: no.
- Follow-up architecture doc updates: not required; this is test-harness
  cleanup only.

## Deployment / Ops Evidence

- Deploy impact: none.
- Env or secret changes: none.
- Health-check impact: none.
- Rollback note: revert the single test-harness change if needed.
- Observability or alerting impact: none.

## Autonomous Loop Evidence

1. Analyze current state: [LUC-5590](/LUC/issues/LUC-5590) left API pack
   shared-DB cleanup failures in backtests e2e.
2. Select one priority mission objective: repair the API smoke backtests cleanup
   residual.
3. Plan implementation: dependency-ordered reset helper plus retry around the
   whole destructive reset.
4. Execute implementation: updated `backtests.e2e.test.ts`.
5. Verify and test: focused, API wrapper, and combined repeatable checks passed.
6. Self-review: no product logic changed; no workaround/skips introduced.
7. Update documentation and knowledge: task/evidence/state updated.

## Result Report

- Task summary: repaired backtests e2e shared-DB cleanup by deleting all current
  dependent rows in FK-safe order and retrying the full reset for async worker
  completion races.
- Files changed:
  - `apps/api/src/modules/backtests/backtests.e2e.test.ts`
  - `history/evidence/luc-5604-api-backtests-shared-db-cleanup-repair-2026-06-27.md`
  - this task file
- How tested:
  - focused backtests e2e PASS
  - API smoke with infra PASS
  - combined repeatable `api,backtests` PASS
- What is incomplete: no code incomplete for this issue.
- Source-control: not committed; repository was already mixed dirty and
  `main...origin/main` was `ahead 14, behind 1`.
- Push/deploy: not needed; no release operation authorized.
