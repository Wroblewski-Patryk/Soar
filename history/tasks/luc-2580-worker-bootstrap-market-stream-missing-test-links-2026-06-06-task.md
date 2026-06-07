# Task

## Header
- ID: LUC-2580
- Title: Cover architecture missing-test links for worker bootstrap and market-stream lifecycle
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Runtime and Adapter Engineer
- Priority: P1
- Module Confidence Rows: Runtime worker lifecycle / Architecture Evidence Graph
- Requirement Rows: REQ-DOC-031
- Risk Rows: V1 worker lifecycle readiness remains production/protected-gate separate
- Iteration: 2026-06-06 Paperclip heartbeat
- Operation Mode: BUILDER
- Mission ID: LUC-2580-WORKER-BOOTSTRAP-MARKET-STREAM-MISSING-TEST-LINKS-2026-06-06
- Mission Status: VERIFIED

## Process Self-Audit
- [x] All seven autonomous loop steps are represented.
- [x] Exactly one priority task was selected.
- [x] The task is aligned with repository source-of-truth documents.
- [x] Affected module confidence rows were identified.
- [x] The task improves release confidence through local worker lifecycle proof and architecture relation repair.

## Context
[LUC-2580](/LUC/issues/LUC-2580) is a Runtime and Adapter Engineer repair slice from [LUC-2574](/LUC/issues/LUC-2574). The architecture-awareness report generated before this task listed top actionable missing-test links for `apps/api/src/workers/execution.worker.ts`, `apps/api/src/workers/marketStream.worker.ts`, and `apps/api/src/workers/workerBootstrap.ts`.

## Goal
Add focused local proof and scanner-readable architecture relations for worker bootstrap heartbeat/logging, execution runtime signal bootstrap failure telemetry, and market-stream subscription fingerprinting/reload/shutdown/failure logging.

## Scope
- `apps/api/src/workers/execution.worker.ts`
- `apps/api/src/workers/execution.worker.test.ts`
- `apps/api/src/workers/marketStream.worker.ts`
- `apps/api/src/workers/marketStream.worker.test.ts`
- `apps/api/src/workers/workerBootstrap.ts`
- `apps/api/src/workers/workerBootstrap.test.ts`
- `docs/architecture/relations/priority-test-links.csv`
- generated architecture-awareness/graph/status outputs under `docs/graphs/` and `docs/status/`
- Soar state/context ledgers for the completed evidence checkpoint

## Implementation Plan
1. Make worker entrypoint lifecycle seams import-safe for Vitest without changing normal non-test worker startup.
2. Add dependency-injected tests for execution bootstrap, market-stream lifecycle, and worker bootstrap heartbeat/logging.
3. Add direct `priority-test-links.csv` rows for the affected worker functions.
4. Refresh architecture graph/awareness outputs and verify the target rows are absent from top actionable missing-test links.
5. Record local proof, process cleanup evidence, and production proof boundary.

## Acceptance Criteria
- Focused worker tests pass.
- API typecheck passes.
- Architecture graph generation and strict drift pass.
- Architecture-awareness report no longer lists the assigned worker lifecycle rows in top actionable missing-test links.
- No worker/dev/test process is left running.

## Definition of Done
- [x] Focused tests verify the worker lifecycle behavior.
- [x] Architecture relation rows link affected worker functions to focused tests.
- [x] Generated architecture artifacts and Soar state are refreshed.
- [x] No production worker, deploy, env, secret, protected-smoke, exchange, database, or live-trading mutation occurred.

## Validation Evidence
- Tests:
  - `corepack pnpm --filter api exec vitest run src/workers/workerBootstrap.test.ts src/workers/execution.worker.test.ts src/workers/marketStream.worker.test.ts src/workers/workerHeartbeat.test.ts src/workers/marketStreamWorkerConfig.test.ts src/workers/marketStreamSubscriptions.service.test.ts --reporter=verbose` -> PASS (`6` files / `19` tests).
  - `corepack pnpm --filter api run typecheck` -> PASS.
  - `corepack pnpm run quality:guardrails` -> PASS.
- Architecture:
  - `corepack pnpm run architecture:graph:generate` -> PASS (`653` nodes / `842` relations / `27` chains).
  - `corepack pnpm run architecture:graph:drift:strict` -> PASS (`842/842`, `0` missing).
  - `node scripts/build-architecture-awareness-index.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar` from `C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse` -> PASS (`14714` entities / `23385` relations).
  - Refreshed `docs/status/architecture-awareness-report.md` generated `2026-06-06T22:16:06.802Z`; actionable missing-test rows moved to `733`, actionable missing-doc rows stayed `0`, disconnected entities stayed `0`.
  - `rg` readback found no assigned worker lifecycle rows in the top actionable missing-test report; direct `LUC-2580` relation rows exist in `docs/architecture/relations/priority-test-links.csv`.
- Process cleanup:
  - Narrow `Get-CimInstance Win32_Process` query for Soar `vitest`, worker, and dev-server command lines returned no leftover processes after verification.
- Diff hygiene:
  - `git diff --check` completed with Windows line-ending warnings only.

## Architecture Evidence
- Architecture source reviewed: `docs/status/architecture-awareness-report.md`, `docs/architecture/relations/priority-test-links.csv`, worker source/tests, generated architecture graph outputs.
- Fits approved architecture: yes.
- Mismatch discovered: no.
- Decision required from user: no.
- Follow-up architecture doc updates: generated architecture-awareness/status outputs refreshed.

## Deployment / Ops Evidence
- Deploy impact: none.
- Env or secret changes: none.
- Health-check impact: local worker lifecycle proof only; production `/workers/ready` and protected runtime readiness remain separate gates.
- Rollback note: revert the three worker source changes, three focused tests, and `LUC-2580` relation rows if the testable lifecycle seams regress worker startup.
- Observability impact: preserves worker heartbeat and error logging behavior; adds local tests for those contracts.

## Autonomous Loop Evidence
1. Analyze Current State: the assigned rows were top actionable missing-test links for worker lifecycle code.
2. Select One Priority Mission Objective: close [LUC-2580](/LUC/issues/LUC-2580) only.
3. Plan Implementation: use import-safe lifecycle seams and focused tests, then relation rows.
4. Execute Implementation: updated worker entrypoints/tests and relation CSV.
5. Verify and Test: focused worker tests, API typecheck, guardrails, architecture graph/awareness, process cleanup.
6. Self-Review: no workaround path or duplicate worker subsystem introduced; production auto-start remains outside Vitest.
7. Update Documentation and Knowledge: task artifact plus state/context ledgers updated.

## Result Report
- Task summary: implemented and verified local worker lifecycle test coverage and architecture relation repair for [LUC-2580](/LUC/issues/LUC-2580).
- Files changed: worker entrypoints, three new worker tests, architecture relation/generated outputs, and Soar state/task evidence.
- How tested: commands listed above.
- What is incomplete: production worker readiness/protected `/workers/ready` proof remains outside this local repair and stays gated by existing protected production lanes.
- Next steps: no follow-up needed for [LUC-2580](/LUC/issues/LUC-2580); continue separate architecture backlog rows shown in the refreshed report.
- Decisions made: lifecycle seams were dependency-injected for tests; no production worker, deploy, env, secret, or protected smoke action was taken.
