# LUC-1189 [Soar][V1 Conformance][Test Automation Worker] Turn acceptance matrix rows into executable regression checks

## Header
- ID: LUC-1189
- Title: Turn acceptance matrix rows into executable regression checks
- Task Type: test
- Current Stage: verification
- Status: DONE
- Owner: QA/Test
- Priority: P1
- Mission ID: SOAR-FULL-READINESS-COORDINATION-2026-05-23
- Mission Status: VERIFIED

## Goal
Convert acceptance-matrix rows used in backend conformance verification into one executable, repeatable regression command that is DB-independent.

## Scope
- `apps/api/package.json`
- Existing API unit/middleware regression suites used by the matrix rows

## Architecture Links

- Primary feature/module: V1 conformance acceptance-matrix executable regression pack.
- Architecture nodes:
  - `docs/architecture/nodes/SOAR-TEST-POSITIONS-RECONCILIATION.md`
  - `docs/architecture/nodes/SOAR-TEST-API-MIDDLEWARE-SAFETY.md`
  - `docs/architecture/nodes/SOAR-TEST-BOT-RUNTIME-API.md`
  - `docs/architecture/nodes/SOAR-DOC-TESTING.md`
- Function chains:
  - `docs/architecture/chains/CHAIN-POSITIONS-CORE.md`
  - `docs/architecture/chains/CHAIN-API-PLATFORM-SAFETY.md`
  - `docs/architecture/chains/CHAIN-BOT-RUNTIME-CORE.md`
- Affected files:
  - `apps/api/package.json`
  - `apps/api/src/modules/positions/livePositionReconciliation.service.test.ts`
  - `apps/api/src/modules/auth/requireRole.test.ts`
  - `apps/api/src/middleware/requireOpsNetwork.test.ts`
  - `apps/api/src/modules/bots/runtimeSessionPositionsRead.service.test.ts`
- Tests/proof:
  - `history/evidence/luc-1189-acceptance-matrix-executable-regression-pack-2026-06-01.md`
  - `pnpm --filter api run test:conformance:acceptance-matrix`
- Docs updated:
  - `docs/engineering/testing.md`
  - `docs/status/task-entity-link-backfill-classification-2026-06-08.md`

## Implementation Plan
1. Create one API script that executes focused tests mapped to acceptance-matrix classes.
2. Keep the script DB-independent to avoid `localhost:5432` blocker.
3. Run the script and capture pass/fail proof.

## Acceptance Criteria
- A single command exists to run acceptance-matrix conformance checks.
- Command covers ingestion, upstream-error continuity, auth failure gates, and display semantics.
- Command is runnable in current local environment without starting Postgres.

## Definition of Done
- [x] Script added.
- [x] Script executed.
- [x] Evidence recorded with exact command and results.

## Result Report
- Task summary: Added and validated `test:conformance:acceptance-matrix` in API package scripts.
- Files changed: `apps/api/package.json`
- How tested:
  - `pnpm --filter api run test:conformance:acceptance-matrix` -> PASS
  - Segment results:
    - `livePositionReconciliation.service.test.ts` targeted matrix rows: `5 passed`
    - `requireRole.test.ts` + `requireOpsNetwork.test.ts`: `8 passed`
    - `runtimeSessionPositionsRead.service.test.ts` targeted display rows: `2 passed`
- What is incomplete: DB-backed persistence-class checks remain outside this DB-independent pack.
- Next steps: Run DB-backed companion suite when local/test Postgres is available.

## Continuation (finish_successful_run_handoff)
- Validation rerun:
  - `pnpm --filter api run test:conformance:acceptance-matrix` -> PASS
- Outcome unchanged; pack remains executable and stable in local DB-independent mode.
- Final disposition for this continuation: `done`.
