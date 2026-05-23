# AWESOME-AUDIT Remediation Plan - 2026-05-02

## Header
- ID: AWESOME-FIX-01
- Title: test(api-positions): isolate imported position history hydrator fixtures
- Task Type: test-hardening
- Current Stage: verification
- Status: DONE
- Owner: Backend Builder + QA/Test
- Depends on: AWESOME-AUDIT-01
- Priority: P2
- Iteration: post-V1 confidence sweep
- Operation Mode: BUILDER

## Context
`AWESOME-AUDIT-01` found no product/runtime blocker, but it did find a QA
reliability gap in `importedPositionHistoryHydrator.service.test.ts`.

The file fails when run alone on the current local DB because its `beforeEach`
cleanup deletes `User` while dependent rows from other test slices can still
exist. Observed constraints included `Order_userId_fkey` and
`BacktestRun_userId_fkey`.

## Goal
Make imported position history hydrator tests isolated and deterministic so
the full API validation signal is not polluted by fixture cleanup failures.

## Scope
- `apps/api/src/modules/positions/importedPositionHistoryHydrator.service.test.ts`
- Shared test cleanup helper only if an existing approved helper already
  covers this pattern.
- No product runtime behavior changes unless the test exposes a real product
  bug after cleanup is fixed.

## Implementation Plan
1. Inspect the test data created by the hydrator tests and the dependency graph
   that blocks `prisma.user.deleteMany()`.
2. Prefer narrow, deterministic cleanup in the affected file: delete dependent
   `Order`, `BacktestRun`, `Log`, and related rows before deleting `User`, or
   scope cleanup to test-owned identities if safer.
3. Reuse existing cleanup helpers if the repo already has a suitable one.
4. Run the affected test file alone.
5. Run the adjacent imported-position, orders/positions, bots runtime, and
   backtest smoke files sequentially.
6. Run API typecheck and the relevant repository guardrails.
7. Update the audit report and task board with evidence.

## Acceptance Criteria
- `pnpm --filter api exec vitest run src/modules/positions/importedPositionHistoryHydrator.service.test.ts` PASS.
- Adjacent focused API slices still PASS.
- No production code behavior changes unless justified by a newly proven bug.
- No broad destructive DB reset helper is introduced.

## Definition Of Done
- The affected test is green when run alone on a non-empty local test database.
- The cleanup order or fixture ownership is clear and documented by code shape,
  not by broad comments.
- Validation evidence is recorded in context docs.

## Forbidden
- Do not mask the failure by skipping tests.
- Do not introduce a global workaround or broad truncation helper unless it is
  already an approved repository pattern.
- Do not change runtime hydrator behavior without fresh failing product
  evidence.
- Do not parallelize DB-backed e2e suites for closure evidence.

## Result Report
- Implemented a narrow cleanup-order fix in
  `apps/api/src/modules/positions/importedPositionHistoryHydrator.service.test.ts`.
- No product runtime code was changed.
- Validation PASS:
  `pnpm --filter api exec vitest run src/modules/positions/importedPositionHistoryHydrator.service.test.ts`
  (`6` tests).
- Adjacent focused API validation PASS: imported position hydrator, exchange
  snapshot, orphan repair, orders/positions, runtime imported DCA visibility,
  runtime history parity, and backtests (`58` tests across `7` files).
- `pnpm --filter api run typecheck` PASS.
- `pnpm --filter api run test -- --run` PASS.
- `pnpm run quality:guardrails` PASS.
