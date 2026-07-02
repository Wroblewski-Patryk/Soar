# LUC-5577 Repair QA Smoke Runner Pnpm 11 And Local DB Availability

## Header
- ID: LUC-5577
- Title: Repair QA smoke runner: pnpm 11 build approval and local DB availability
- Task Type: fix
- Current Stage: post-release
- Status: DONE
- Owner: QA/Test
- Priority: P1
- Module Confidence Rows: SOAR-OPERATIONS-001 / safe regression baseline; QA repeatable smoke runner
- Iteration: 2026-06-27 LUC-5577
- Operation Mode: TESTER
- Mission ID: LUC-5577-QA-SMOKE-RUNNER-PNPM11-DB-AVAILABILITY-2026-06-27
- Mission Status: DONE / RUNNER_AND_INFRA_PREREQS_REPAIRED / API_PACK_DB_CLEANUP_RESIDUAL_SPLIT

## Context
[LUC-5542](/LUC/issues/LUC-5542) showed that the package-managed repeatable smoke path was not a reliable regression gate: pnpm 11 reported deprecated package policy handling, and DB-backed API smoke could not run because local Postgres/Redis and Docker Desktop Linux engine were unavailable.

## Goal
Make the repeatable smoke runner use pnpm 11-compatible package policy and the existing local infra wrapper for API DB-backed smoke, then prove whether the remaining failure is a runner defect or a local runtime prerequisite.

## Scope
- `package.json`
- `pnpm-workspace.yaml`
- `scripts/runQaRepeatableSmokeE2e.mjs`
- `scripts/runQaRepeatableSmokeE2e.test.mjs`
- source-of-truth state/context files updated in the same task

## Implementation Plan
1. Move pnpm overrides from deprecated `package.json#pnpm` into `pnpm-workspace.yaml`.
2. Keep approved/ignored build dependency policy in `pnpm-workspace.yaml`.
3. Change repeatable API smoke from raw `test:go-live:api` to `test:go-live:api:with-infra`.
4. Add a contract test that locks the API smoke command to the infra-aware wrapper.
5. Run pnpm config readback, focused contract tests, Web smoke, and API smoke classification.

## Acceptance Criteria
- pnpm 11 config readback shows `overrides`, `onlyBuiltDependencies`, and `ignoredBuiltDependencies` from workspace config without the deprecated `package.json#pnpm` warning.
- Repeatable Web smoke passes through the package-managed runner.
- Repeatable API smoke invokes `pnpm run test:go-live:api:with-infra`.
- If local Docker/DB remains unavailable, the runner fails quickly and writes artifact/evidence naming the infrastructure blocker.
- No validation-owned Node/Vitest process remains running.

## Definition of Done
- [x] Code-level smoke runner repair implemented.
- [x] Focused automated tests pass.
- [x] Package-managed Web smoke passes under pnpm 11.
- [x] API DB-backed smoke attempts local infra via the approved wrapper.
- [x] Local Docker/Postgres/Redis prerequisite restored by [LUC-5586](/LUC/issues/LUC-5586).
- [x] API DB-backed smoke rerun after runner prerequisite repair.
- [x] Remaining full API smoke failure classified outside this issue: Backtests e2e shared-DB cleanup/isolation, routed to Core Backend follow-up [LUC-5606](/LUC/issues/LUC-5606).

## Validation Evidence
- `pnpm config list` PASS: pnpm 11.7.0 reads workspace `overrides`, `onlyBuiltDependencies`, and `ignoredBuiltDependencies` with no deprecated `package.json#pnpm` warning.
- `node --test scripts/runQaRepeatableSmokeE2e.test.mjs scripts/releaseOpsScriptContracts.test.mjs` PASS (`8/8`).
- `pnpm run qa:smoke-e2e:repeatable -- --checks web --artifact-prefix luc-5577-qa-smoke-runner-pnpm11-web --today 2026-06-27` PASS (`3` files / `18` Web tests).
- `pnpm run qa:smoke-e2e:repeatable -- --checks api --artifact-prefix luc-5577-qa-smoke-runner-infra-api --today 2026-06-27` FAIL_FAST with artifact: command is now `pnpm run test:go-live:api:with-infra`; Docker failed connecting to `//./pipe/dockerDesktopLinuxEngine`, so Postgres/Redis could not start.
- `docker version` FAILS for local Linux engine: `open //./pipe/dockerDesktopLinuxEngine: The system cannot find the file specified`.
- `Test-NetConnection 127.0.0.1:5432` and `127.0.0.1:6379` returned `TcpTestSucceeded=False`.
- Process cleanup: validation-owned timed-out Node/Vitest PIDs from the first raw API attempt were stopped; later process scan found no matching `luc-5577`, `goLiveSmoke`, `test:go-live:api`, `vitest`, or `tinypool` child process.
- Follow-up unblock evidence from [LUC-5586](/LUC/issues/LUC-5586): Docker Desktop Linux engine and local Compose Postgres/Redis were restored; repeatable API smoke passed through `test:go-live:api:with-infra` (`45/45`); focused Backtests e2e passed with local infra available (`15/15`).
- Follow-up orchestration evidence from [LUC-5590](/LUC/issues/LUC-5590): focused script contract tests passed (`20/20`), the repeatable Backtests check now uses `test:go-live:backtests:with-infra`, and the real runner proved Backtests can restart infra after API teardown.
- Current residual from [LUC-5590](/LUC/issues/LUC-5590): full `api,backtests` still exits nonzero because the broad API smoke pack embeds `apps/api/src/modules/backtests/backtests.e2e.test.ts`, which fails with shared-DB cleanup/isolation errors (`BotMarketGroup_symbolGroupId_fkey`, `MarketUniverse_userId_fkey`, `Position_userId_fkey`, and missing-user readbacks). This is not the pnpm/runner/local-infra prerequisite defect owned by [LUC-5577](/LUC/issues/LUC-5577), and it is now assigned to Core Backend as [LUC-5606](/LUC/issues/LUC-5606).
- 2026-06-27 closure recheck: `pnpm config list` PASS under pnpm `11.7.0` with workspace `overrides`, `onlyBuiltDependencies`, and `ignoredBuiltDependencies`; `node --test scripts/runQaRepeatableSmokeE2e.test.mjs scripts/goLiveSmoke.test.mjs` PASS (`20/20`).
- Reality status: done for runner and local infra prerequisites; separate API test cleanup residual remains.

## Architecture Evidence
- Architecture source reviewed: `.agents/core/operating-system.md`, package script contracts, existing `goLiveSmoke.mjs`.
- Fits approved architecture: yes.
- Mismatch discovered: no.
- Decision required from user: no.

## Deployment / Ops Evidence
- Deploy impact: none.
- Env or secret changes: none.
- Health-check impact: none.
- Smoke steps updated: repeatable QA API smoke now uses the existing local infra wrapper.
- Rollback note: revert `scripts/runQaRepeatableSmokeE2e.mjs`, `scripts/runQaRepeatableSmokeE2e.test.mjs`, `package.json`, and `pnpm-workspace.yaml`.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: pnpm 11 ignored deprecated `package.json#pnpm` overrides; API smoke runner targeted raw DB-backed tests; local Docker Linux engine and local Postgres/Redis ports were unavailable.
- Gaps: no passing DB-backed API smoke is possible in this runner until local infra exists.
- Inconsistencies: workspace had pnpm 11 build approval lists in `pnpm-workspace.yaml` but overrides in the deprecated package manifest field.
- Architecture constraints: reuse existing `goLiveSmoke.mjs`; no temporary bypasses or mock DB.

### 2. Select One Priority Mission Objective
- Selected task: repair QA repeatable smoke runner preconditions for pnpm 11 and DB-backed API smoke.
- Priority rationale: [LUC-5542](/LUC/issues/LUC-5542) explicitly routed this blocker to [LUC-5577](/LUC/issues/LUC-5577).
- Deferred: full API smoke pass, because the local Docker engine is unavailable.

### 3. Plan Implementation
- Files modified: `package.json`, `pnpm-workspace.yaml`, `scripts/runQaRepeatableSmokeE2e.mjs`, `scripts/runQaRepeatableSmokeE2e.test.mjs`.
- Logic: move pnpm policy to supported workspace config and route API smoke through the infra-aware wrapper.
- Edge cases: Docker unavailable should produce a fast artifacted failure; the runner must not hang or silently skip DB tests.

### 4. Execute Implementation
- Moved overrides to `pnpm-workspace.yaml`.
- Removed deprecated root `pnpm` field from `package.json`.
- Changed API repeatable smoke command to `pnpm run test:go-live:api:with-infra`.
- Added a focused command-contract test.

### 5. Verify and Test
- Validation performed: config readback, contract tests, Web smoke, API smoke classification, Docker/port checks, process cleanup scan.
- Result: code-level repair verified; full API DB smoke blocked by unavailable local Docker/DB runtime.

### 6. Self-Review
- Simpler option considered: only documenting the Docker blocker. Rejected because the raw API command would still bypass the existing infra wrapper.
- Technical debt introduced: no.
- Scalability assessment: the runner now reuses the established local infra smoke contract.

### 7. Update Documentation and Knowledge
- Docs updated: this task record.
- Context updated: project state, task board, active mission, system health, module confidence ledger, next steps, learning journal.
- Learning journal updated: yes.

## Result Report
- Task summary: pnpm 11 workspace policy is now read from `pnpm-workspace.yaml`; repeatable API smoke uses the infra-aware wrapper; Web smoke passes; the local Docker/Postgres/Redis prerequisite was restored by [LUC-5586](/LUC/issues/LUC-5586); and the repeatable Backtests sequencing follow-up was repaired by [LUC-5590](/LUC/issues/LUC-5590).
- Files changed: `package.json`, `pnpm-workspace.yaml`, `scripts/runQaRepeatableSmokeE2e.mjs`, `scripts/runQaRepeatableSmokeE2e.test.mjs`, task/context/state files.
- How tested: listed in Validation Evidence.
- What is incomplete: full API DB-backed smoke remains non-green because of a separate `backtests.e2e.test.ts` shared-DB cleanup/isolation failure inside the broad API pack.
- Next steps: Core Backend repairs the API pack cleanup/isolation residual in [LUC-5606](/LUC/issues/LUC-5606), then TAE reruns `pnpm run qa:smoke-e2e:repeatable -- --checks api,backtests`.
- Decisions made: do not bypass DB-backed tests; use existing infra wrapper and preserve fail-fast evidence.
