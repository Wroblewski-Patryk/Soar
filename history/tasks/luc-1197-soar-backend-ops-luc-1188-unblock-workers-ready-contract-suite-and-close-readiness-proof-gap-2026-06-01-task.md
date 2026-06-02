# LUC-1197 [Soar][Backend+Ops][LUC-1188] Unblock workers/ready contract suite and close readiness proof gap

## Header
- ID: LUC-1197
- Title: Unblock workers/ready contract suite and close readiness proof gap
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Backend Builder

## Context
`src/router/workers-health-readiness.test.ts` was blocked by auth bootstrap drift (`/auth/register` 500), so workers readiness contract checks were not reliable.

## Goal
Make the workers readiness contract suite deterministic and prove the protected contract behaviors with executable evidence.

## Scope
- `apps/api/src/router/workers-health-readiness.test.ts`
- `history/evidence/luc-1197-workers-ready-contract-suite-closure-2026-06-01.md`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`

## Implementation Plan
1. Remove test dependency on `/auth/register` and `/auth/login` runtime bootstrap.
2. Create deterministic signed auth token path for ADMIN/USER principals in the test.
3. Re-run full workers readiness suite and record proof.

## Acceptance Criteria
- Full `workers-health-readiness` suite passes.
- Non-admin protected access denial remains verified (`403`).
- Split-mode ready/not-ready branches remain verified.

## Definition of Done
- [x] Contract suite unblocked.
- [x] Executable proof captured with command and PASS result.
- [x] Source-of-truth context updated.

## Result Report
- Replaced route-level auth bootstrap in test with deterministic signed auth-header path and mocked auth lookup.
- Verified full suite PASS (`8/8`).
- Closed readiness proof gap for this test lane.
