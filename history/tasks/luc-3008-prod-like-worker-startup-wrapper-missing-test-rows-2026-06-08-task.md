# LUC-3008 Prod-Like And Worker Startup Wrapper Missing-Test Rows

## Header
- ID: LUC-3008
- Title: [Soar][DRE][LUC-3005] Classify prod-like and worker startup wrapper missing-test rows
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Ops/Release
- Depends on: LUC-3005
- Priority: P1
- Module Confidence Rows: release audit tooling / prod-like and worker startup wrappers
- Requirement Rows: not applicable
- Quality Scenario Rows: runtime startup wrapper fail-closed behavior
- Risk Rows: protected deploy/runtime mutation avoided
- Iteration: 2026-06-08
- Operation Mode: BUILDER
- Mission ID: LUC-3008-PROD-LIKE-WORKER-STARTUP-WRAPPER-MISSING-TEST-ROWS-2026-06-08
- Mission Status: VERIFIED

## Context
`docs/architecture/codebase-map.md` treats `scripts/*` as Ops, release, and runtime evidence tooling. Architecture awareness listed `scripts/start-local-prod-like.mjs` and `scripts/start-workers-prod.mjs` process-wrapper anchors as actionable missing-test rows.

## Goal
Prove deterministic helper behavior for prod-like and worker startup wrappers without starting real long-running services, mutating production, deploying, restarting, or using protected credentials.

## Scope
- `scripts/start-local-prod-like.mjs`
- `scripts/start-workers-prod.mjs`
- `scripts/startLocalProdLike.test.mjs`
- `scripts/startWorkersProd.test.mjs`
- `docs/architecture/relations/priority-test-links.csv`
- Soar state and evidence files for this issue

## Implementation Plan
1. Refactor both wrapper scripts behind import-safe direct CLI entrypoints while preserving direct CLI behavior.
2. Add injected seams for file existence checks, child-process spawn, process exit, output streams, and signal registration.
3. Add focused `node:test` coverage for fail-closed validation, log prefixing, command/process orchestration, unexpected child exits, `stopAll`, and graceful shutdown.
4. Add scanner-readable direct relation rows for the repaired anchors.
5. Run focused tests, graph generation, guardrails, and process cleanup checks.

## Acceptance Criteria
- The wrappers remain callable via the existing package scripts.
- Local tests cover deterministic wrapper behavior without launching API/Web/workers.
- Direct architecture relation readback finds the LUC-3008 rows.
- Repository guardrails pass.
- No production service, deploy, restart, database, secret, exchange, order, position, or live-trading mutation occurs.

## Definition of Done
- `DEFINITION_OF_DONE.md` satisfied for this local proof slice with evidence below.
- Focused verification passed.
- Source-of-truth task and state files updated.
- Residual risk explicitly stated.

## Validation Evidence
- `node --check scripts/start-local-prod-like.mjs` PASS.
- `node --check scripts/start-workers-prod.mjs` PASS.
- `node --check scripts/startLocalProdLike.test.mjs` PASS.
- `node --check scripts/startWorkersProd.test.mjs` PASS.
- `node --test scripts/startLocalProdLike.test.mjs scripts/startWorkersProd.test.mjs scripts/releaseOpsScriptContracts.test.mjs` PASS (`17/17`).
- Direct LUC-3008 relation readback PASS (`10` rows).
- `pnpm run architecture:graph:generate` PASS (`653` nodes / `842` relations / `27` chains).
- `pnpm run quality:guardrails` PASS.
- `Get-Process chrome-headless-shell -ErrorAction SilentlyContinue` found no leftover validation browser process.
- `Test-Path scripts/build-architecture-awareness-index.mjs` returned `False`; full architecture-awareness refresh could not run in this checkout.

## Architecture Evidence
- Architecture source reviewed: `docs/architecture/codebase-map.md`, `docs/status/architecture-awareness-report.md`, `docs/architecture/relations/priority-test-links.csv`.
- Fits approved architecture: yes.
- Mismatch discovered: no.
- Decision required from user: no.
- Follow-up architecture doc updates: direct test-link rows added for the repaired wrapper anchors.

## Deployment / Ops Evidence
- Deploy impact: none.
- Env or secret changes: none.
- Health-check impact: none.
- Smoke steps updated: none.
- Rollback note: code-only local wrapper refactor; revert the two wrapper files and tests if needed.
- Observability or alerting impact: none.
- Staged rollout or feature flag: not applicable.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issue [LUC-3008](/LUC/issues/LUC-3008) targeted prod-like and worker startup wrapper missing-test rows.
- Existing `releaseOpsScriptContracts.test.mjs` only verified string-level command contracts; it did not prove wrapper helper behavior.
- Both wrappers executed at module load, preventing safe unit import.

### 2. Select One Priority Mission Objective
- Selected task: local DRE wrapper proof for `start-local-prod-like` and `start-workers-prod`.
- Deferred: full prod-like startup, real worker startup, Docker/prod smoke, and protected release gates.

### 3. Plan Implementation
- Preserve direct CLI behavior through guarded `pathToFileURL(process.argv[1])` entrypoints.
- Expose deterministic helper functions and process seams for local testing.

### 4. Execute Implementation
- Added import-safe exports and injected seams.
- Added local tests using fake child process event emitters.
- Added direct architecture relation rows.

### 5. Verify and Test
- Focused tests, graph generation, guardrails, and relation readback passed.

### 6. Self-Review
- No workaround path introduced.
- Existing package script contracts remain covered by `releaseOpsScriptContracts.test.mjs`.
- No real process was started by the focused proof.

### 7. Update Documentation and Knowledge
- Updated task evidence, project state, task board, system health, and module confidence ledger.
- Learning journal update: not applicable; no new recurring pitfall beyond the already-known missing architecture-awareness refresh script in this checkout.

## Review Checklist
- [x] Process self-audit completed before implementation.
- [x] Autonomous loop evidence covers all seven steps.
- [x] Exactly one priority task was completed in this iteration.
- [x] Current stage is declared and respected.
- [x] Architecture alignment confirmed.
- [x] Existing package script contracts were reused.
- [x] No workaround paths were introduced.
- [x] No logic duplication was introduced.
- [x] Definition of Done evidence is attached.
- [x] Relevant validations were run.
- [x] Docs/context were updated.

## Result Report
- Task summary: made prod-like and worker startup wrappers import-safe, added deterministic local tests, and linked ten direct LUC-3008 architecture test relations.
- Files changed: `scripts/start-local-prod-like.mjs`, `scripts/start-workers-prod.mjs`, `scripts/startLocalProdLike.test.mjs`, `scripts/startWorkersProd.test.mjs`, `docs/architecture/relations/priority-test-links.csv`, plus this evidence and state updates.
- How tested: syntax checks, focused Node test pack (`17/17`), direct relation readback (`10`), architecture graph generation, guardrails, and no leftover browser process check.
- What is incomplete: full architecture-awareness refresh could not run because `scripts/build-architecture-awareness-index.mjs` is absent in this checkout.
- Next steps: continue the broader architecture-awareness missing-test backlog outside this issue; do not infer production readiness from local wrapper helper proof.
- Decisions made: classify these rows as locally provable helper behavior, not protected/prod-like runtime smoke evidence.
