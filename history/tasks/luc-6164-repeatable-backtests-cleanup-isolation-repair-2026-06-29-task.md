# LUC-6164 Repeatable Backtests Cleanup-Isolation Repair

## Header

- ID: [LUC-6164](/LUC/issues/LUC-6164)
- Title: Resume repeatable Backtests cleanup-isolation repair
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Core Backend Engineer
- Depends on: [LUC-5606](/LUC/issues/LUC-5606)
- Priority: P1
- Module Confidence Rows: API smoke / Backtests e2e / shared DB cleanup
- Requirement Rows: not updated; this is test-harness reliability proof.
- Quality Scenario Rows: local DB-backed regression repeatability.
- Risk Rows: shared local DB cleanup/isolation flake.
- Iteration: 2026-06-29 LUC-6164
- Operation Mode: BUILDER
- Mission ID: LUC-6164-REPEATABLE-BACKTESTS-CLEANUP-ISOLATION-REPAIR-2026-06-29
- Mission Status: VERIFIED

## Context

[LUC-6164](/LUC/issues/LUC-6164) resumed the earlier [LUC-5606](/LUC/issues/LUC-5606)
Backtests cleanup-isolation lane after queue/auth blockers were cleared. The
prior cleanup repair existed, but current proof still had to be rerun and two
Backtests e2e flakes were reproduced locally.

## Goal

Make the current Backtests e2e file and repeatable `api,backtests` proof pass
locally through the project infra-aware wrappers without skipping DB-backed
assertions or changing product behavior.

## Scope

- `apps/api/src/modules/backtests/backtests.e2e.test.ts`
- `history/artifacts/luc-6164-qa-repeatable-smoke-e2e-2026-06-29.json`
- `history/evidence/luc-6164-qa-repeatable-smoke-e2e-2026-06-29.md`
- `history/evidence/luc-6164-repeatable-backtests-cleanup-isolation-repair-2026-06-29.md`
- source-of-truth state notes.

## Implementation Plan

1. Reproduce the focused Backtests e2e failure through the infra-aware wrapper.
2. Keep existing product/service logic unchanged.
3. Repair only the e2e harness race/timing defects.
4. Rerun focused Backtests with infra.
5. Rerun broad API smoke with infra.
6. Rerun combined repeatable `api,backtests` and record artifacts.
7. Update evidence, state, and issue disposition.

## Acceptance Criteria

- Focused Backtests e2e passes through `pnpm run test:go-live:backtests:with-infra`.
- Broad API smoke pack passes through `pnpm run test:go-live:api:with-infra`.
- Repeatable smoke `pnpm run qa:smoke-e2e:repeatable -- --checks api,backtests`
  passes and writes issue-specific evidence.
- No DB-backed assertion is skipped.
- No product/API behavior is changed.

## Definition of Done

- [x] Cleanup-isolation race fixed in the e2e harness.
- [x] Long-running critical Backtests e2e cases have explicit timeout budget.
- [x] Focused Backtests wrapper passes.
- [x] Broad API smoke wrapper passes.
- [x] Combined repeatable `api,backtests` passes.
- [x] Evidence and state updated.

## Forbidden

- Product runtime changes.
- Mock-only behavior, skipped DB-backed assertions, or temporary bypasses.
- Deploy, push, production smoke, protected account proof, secret readback,
  production DB/Redis mutation, exchange/payment action, order, position, or
  live-trading action.

## Validation Evidence

| Command | Result |
| --- | --- |
| `pnpm --filter api exec vitest run src/modules/backtests/backtests.e2e.test.ts --run --reporter=verbose` | FAIL as expected without local DB: Postgres unavailable on `localhost:5432` |
| `pnpm run test:go-live:backtests:with-infra` | initial FAIL: 14/15 passed, 3-symbol parity test timed out at 15s |
| `pnpm run test:go-live:backtests:with-infra` | second FAIL: 13/15 passed; async report race overwrote manual report with `totalTrades=0`, and 3-symbol parity needed more than 20s |
| `pnpm run test:go-live:backtests:with-infra` | PASS: 1 file / 15 tests |
| `pnpm run test:go-live:api:with-infra` | PASS: 4 files / 45 tests |
| `pnpm run qa:smoke-e2e:repeatable -- --checks api,backtests --artifact-prefix luc-6164-qa-repeatable-smoke-e2e` | PASS: API smoke pack and focused Backtests e2e |

## Architecture Evidence

- Architecture source reviewed: Backtests e2e/service surfaces, prior
  [LUC-5604](/LUC/issues/LUC-5604) evidence, Soar active mission/state.
- Fits approved architecture: yes.
- Mismatch discovered: no.
- Decision required from user: no.
- Follow-up architecture doc updates: not required; this is test-harness proof.

## Deployment / Ops Evidence

- Deploy impact: none.
- Env or secret changes: none.
- Health-check impact: none.
- Smoke steps updated: no script contract changes.
- Rollback note: revert the scoped e2e harness changes if needed.
- Observability or alerting impact: none.

## Autonomous Loop Evidence

1. Analyze current state: required Backtests/API repeatable proof had not been
   rerun after the queue resumed; infra-aware wrapper reproduced e2e timing and
   async report race flakes.
2. Select one priority mission objective: close [LUC-6164](/LUC/issues/LUC-6164)
   Backtests cleanup-isolation repair.
3. Plan implementation: modify only `apps/api/src/modules/backtests/backtests.e2e.test.ts`.
4. Execute implementation: wait for async report readiness before manual report
   fixture mutation and raise the critical timeout budget.
5. Verify and test: focused Backtests, broad API, and repeatable API/Backtests
   wrappers passed.
6. Self-review: no product logic changed; no bypasses or skipped assertions
   introduced.
7. Update documentation and knowledge: task/evidence/state files updated.

## Result Report

- Task summary: repaired the Backtests e2e cleanup-isolation proof by removing
  an async report overwrite race and giving long critical scenarios sufficient
  timeout budget, then verified the focused, broad API, and repeatable paths.
- Files changed:
  - `apps/api/src/modules/backtests/backtests.e2e.test.ts`
  - `history/artifacts/luc-6164-qa-repeatable-smoke-e2e-2026-06-29.json`
  - `history/evidence/luc-6164-qa-repeatable-smoke-e2e-2026-06-29.md`
  - `history/evidence/luc-6164-repeatable-backtests-cleanup-isolation-repair-2026-06-29.md`
  - this task file
  - source-of-truth state notes
- How tested:
  - focused Backtests with infra PASS (`15/15`);
  - broad API smoke with infra PASS (`45/45`);
  - repeatable `api,backtests` PASS (`2/2` selected checks).
- What is incomplete: no remaining LUC-6164 work.
- Next steps: source-control/release owner can batch or commit the scoped
  backend test-harness repair from the dirty/divergent workspace under the
  existing source-control gate.
- Decisions made: no product behavior change; no deploy/push.
