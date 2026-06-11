# Task - LUC-2977 Gate.io DB-Backed Position Ingestion Verification

## Header
- ID: LUC-2977
- Title: [Soar][Gate.io][QA] Run DB-backed position ingestion verification for LUC-1166
- Task Type: verification
- Current Stage: verification
- Status: DONE / VERIFIED_LOCAL
- Owner: QA/Test
- Depends on: local PostgreSQL test database availability, resolved by [LUC-2979](/LUC/issues/LUC-2979) / [LUC-2980](/LUC/issues/LUC-2980)
- Priority: P1
- Module Confidence Rows: Gate.io LIVE position sync ingestion / Workers readiness auth gate
- Requirement Rows: REQ-FUNC-017, Gate.io position ingestion readiness for LUC-1166
- Quality Scenario Rows: local DB-backed persistence proof
- Risk Rows: local dependency restored; residual local collation warning
- Iteration: 2026-06-08
- Operation Mode: TESTER
- Mission ID: LUC-2977-GATEIO-DB-BACKED-POSITION-INGESTION-VERIFICATION-2026-06-08
- Mission Status: DONE

## Context
[LUC-1166](/LUC/issues/LUC-1166) previously verified the DB-independent Gate.io adapter fix path for position ingestion, but left DB-backed persistence/auth coverage open. [LUC-2977](/LUC/issues/LUC-2977) is the QA child created to run the smallest local DB-backed verification.

## Goal
Run focused local verification for Gate.io position ingestion readiness after the adapter fix, covering success, empty account, auth failure/non-admin, rate-limit/error response, persistence sync, and locally proveable API/UI display paths without real trading mutation.

## Scope
- `apps/api/src/modules/positions/livePositionReconciliation.service.test.ts`
- `apps/api/src/router/workers-health-readiness.test.ts`
- Prior evidence: `history/evidence/luc-1166-gateio-position-ingestion-readiness-after-adapter-fix-2026-05-31.md`

## Implementation Plan
1. Read [LUC-2977](/LUC/issues/LUC-2977) heartbeat context and [LUC-1166](/LUC/issues/LUC-1166) evidence.
2. Check local PostgreSQL availability on `localhost:5432`.
3. Check whether Docker can start the repository infra dependency.
4. Run the focused API verification command once and record exact pass/fail.
5. Record verified disposition when DB-backed persistence executes successfully.

## Acceptance Criteria
- No production smoke, deploy, push, restart, secret use, real exchange account use, order mutation, position mutation, or live-trading mutation occurs.
- Workers readiness auth/non-admin checks are covered.
- DB-backed position ingestion persistence either passes or is blocked with exact dependency evidence and owner/action.
- Durable issue and project evidence record commands, affected files, residual risk, and commit/no-commit decision.

## Definition of Done
- [x] Issue context and prior [LUC-1166](/LUC/issues/LUC-1166) evidence reviewed.
- [x] Focused verification command executed.
- [x] Prior blocker recorded with exact command/error.
- [x] Blocker resolution verified with local DB reachability and focused DB-backed proof.
- [x] Source-control decision recorded.
- [x] Paperclip issue disposition updated.

## Forbidden
- Production smoke.
- Live account mutation.
- Order or position mutation.
- Secret disclosure.
- Push, deploy, or restart.
- Reverting unrelated dirty worktree changes.

## Validation Evidence
- Wake delta: `issue_blockers_resolved`; [LUC-2979](/LUC/issues/LUC-2979) / [LUC-2980](/LUC/issues/LUC-2980) restored the local Docker/PostgreSQL test dependency.
- `docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"`
  - PASS: `soar-postgres-1` is running on `127.0.0.1:5432->5432/tcp`; `soar-redis-1` is running on `127.0.0.1:6379->6379/tcp`.
- `Test-NetConnection -ComputerName localhost -Port 5432`
  - Timed out on the initial generic `localhost` probe after an IPv6 warning.
- `Test-NetConnection -ComputerName 127.0.0.1 -Port 5432`
  - PASS: `TcpTestSucceeded: True`.
- `docker exec soar-postgres-1 pg_isready -U postgres -d cryptosparrow`
  - PASS: accepting connections.
  - Note: PostgreSQL reported a local `cryptosparrow` collation version mismatch warning on the reused local volume. It did not block this focused proof.
- `pnpm --filter api exec vitest run src/modules/positions/livePositionReconciliation.service.test.ts src/router/workers-health-readiness.test.ts --reporter=verbose`
  - PASS: `2` test files passed, `42` tests passed.
  - `livePositionReconciliation.service.test.ts` passed all `34/34`, including DB-backed Gate.io synced LIVE key scope, DB-backed open synced position lookup, stale synced position market scope, exchange-synced open-order collision handling, stale synced order status transition, and canonical bot continuity context.
  - `workers-health-readiness.test.ts` passed all `8/8`, including unauthenticated `401`, authenticated non-admin `403`, inline readiness, split readiness, missing queue fail-closed, and stale heartbeat fail-closed.
  - This covers success, empty/no-position cleanup paths, auth failure/non-admin, upstream error continuity/rate-limit class handling through mocked exchange errors, persistence sync, and the local API readiness path. UI display path was not separately browser-proved in this QA slice.
- Module confidence ledger updated: yes
- Requirements matrix updated: yes
- Risk register updated: yes
- Reality status: verified local

## Architecture Evidence
- Architecture source reviewed: prior [LUC-1166](/LUC/issues/LUC-1166) evidence, position reconciliation service tests, workers readiness tests.
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Follow-up architecture doc updates: not applicable; no architecture change.

## Deployment / Ops Evidence
- Deploy impact: none
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no
- Rollback note: no runtime/code change; rollback not applicable.
- Observability or alerting impact: none

## Security / Privacy Evidence
- Data classification: local test data only; no production account, secret, API key, exchange credential, order, or position mutation used.
- Trust boundaries: local workstation to local PostgreSQL expected on `localhost:5432`.
- Permission or ownership checks: workers readiness non-admin `403` passed.
- Secret handling: no secret values read or written.
- Fail-closed behavior: workers readiness unauthenticated/non-admin/stale queue paths passed.
- Residual risk: UI display path was not separately browser-proved in this QA slice; local PostgreSQL volume emits a collation version mismatch warning that may need DB maintenance later.

## Result Report
- Task summary: Focused QA verification for [LUC-2977](/LUC/issues/LUC-2977) is complete after [LUC-2979](/LUC/issues/LUC-2979) / [LUC-2980](/LUC/issues/LUC-2980) restored the local PostgreSQL dependency. The DB-backed Gate.io position ingestion and workers readiness suites pass locally.
- Files changed: this task evidence file plus project state/ledger updates only.
- How tested: focused API Vitest command, Docker container readback, loopback PostgreSQL connectivity check, `pg_isready`.
- What is incomplete: no separate browser UI display-path proof was run in this QA slice.
- Next steps: parent [LUC-1166](/LUC/issues/LUC-1166) can consume this DB-backed local proof. Future DB maintenance may refresh the local `cryptosparrow` collation version if it becomes noisy or blocking.
- Decisions made: no commit, push, deploy, restart, production smoke, protected proof, or trading mutation.
