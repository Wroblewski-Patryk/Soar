# LUC-6930 Runtime/AI Worker Contract Proof Slice

## Header
- ID: LUC-6930
- Title: First runtime/AI worker contract proof slice
- Task Type: research
- Current Stage: verification
- Status: PARTIALLY_VERIFIED
- Owner: Backend Builder
- Depends on: LUC-6468
- Priority: P1
- Module Confidence Rows: Runtime automation / workers readiness / assistant runtime foundation
- Requirement Rows: Runtime worker contract proof packet under LUC-6468
- Quality Scenario Rows: Reliability / fail-closed runtime readiness / AI fail-closed behavior
- Risk Rows: Local DB-backed freshness proof blocked by unavailable PostgreSQL
- Iteration: 2026-07-02
- Operation Mode: BUILDER
- Mission ID: LUC-6930-RUNTIME-AI-WORKER-CONTRACT-PROOF-2026-07-02
- Mission Status: PARTIALLY_VERIFIED

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the scoped backend issue.
- [x] The task is aligned with repository source-of-truth documents.
- [x] `.agents/core/project-memory-index.md` was reviewed.
- [x] `.agents/core/mission-control.md` was reviewed for bounded work.
- [x] Missing or template-like state tables were not found in the touched scope.
- [x] Affected module confidence rows were identified.
- [x] Affected requirement, quality scenario, and risk rows were identified.
- [x] The task improves release confidence by proving a parent app-completion backend slice.

## Mission Block
- Mission objective: produce the smallest focused backend proof for the runtime automation / AI worker boundary under LUC-6468.
- Release objective advanced: app-completion proof burn-down for Runtime automation / AI execution API-worker contracts.
- Included slices: worker ownership/topology, worker heartbeat/bootstrap, protected workers health/readiness route, runtime freshness helper, assistant orchestrator safety/protocol/parity tests.
- Explicit exclusions: production mutation, protected smoke, secret/account readback, exchange/payment mutation, order, position, subscription mutation, live-trading action, deploy, push, restart, broad feature implementation.
- Checkpoint cadence: one verification checkpoint with durable state update.
- Stop conditions: DB-backed proof cannot run because local PostgreSQL/Docker is unavailable; production/protected proof is outside this issue.
- Handoff expectation: parent LUC-6468 can continue with additional focused child slices; this child does not identify a backend code repair.

## Context
Parent [LUC-6468](/LUC/issues/LUC-6468) is a runtime automation / AI execution API-worker contract packet. This child covers the first backend proof slice using existing anchors rather than guessing at missing external evidence.

## Goal
Verify the existing backend worker/assistant contract anchors and identify which part remains blocked by missing local infrastructure.

## Scope
- `apps/api/src/workers/workerOwnership.ts`
- `apps/api/src/workers/workerHeartbeat.ts`
- `apps/api/src/workers/workerBootstrap.ts`
- `apps/api/src/observability/runtimeFreshness.ts`
- `apps/api/src/router/workers-health-readiness.test.ts`
- `apps/api/src/router/workers-runtime-freshness.test.ts`
- `apps/api/src/modules/engine/assistantOrchestrator.service.ts`
- `apps/api/src/modules/engine/assistantOrchestrator.service.test.ts`
- `apps/api/src/modules/engine/assistantOrchestrator.protocol.test.ts`
- `apps/api/src/modules/engine/assistantOrchestrator.parity.test.ts`

## Implementation Plan
1. Read Paperclip issue context, backend role contract, project memory index, and runtime/assistant architecture contracts.
2. Inspect the scoped code anchors and focused tests.
3. Run the smallest focused backend test pack.
4. If DB-backed route proof fails because local infra is absent, rerun the DB-free subset and record the blocker.
5. Update project truth and close the issue with evidence.

## Acceptance Criteria
- Exact files/tests inspected are listed.
- Commands run and pass/fail summaries are recorded.
- Verified and blocked contract areas are separated.
- Parent LUC-6468 continuation recommendation is explicit.

## Definition of Done
- [x] Focused worker/assistant tests run.
- [x] Local infra blocker, if any, is concrete and reproducible.
- [x] Source-of-truth files updated.
- [x] No forbidden runtime, production, or secret action occurred.

## Validation Evidence
- Tests:
  - `corepack pnpm --filter api exec vitest run src/workers/workerOwnership.test.ts src/workers/workerHeartbeat.test.ts src/workers/workerBootstrap.test.ts src/observability/runtimeFreshness.test.ts src/router/workers-health-readiness.test.ts src/router/workers-runtime-freshness.test.ts src/modules/engine/assistantOrchestrator.service.test.ts src/modules/engine/assistantOrchestrator.protocol.test.ts src/modules/engine/assistantOrchestrator.parity.test.ts --pool=forks --maxWorkers=1 --minWorkers=1 --test-timeout 30000`
    - Result: `8` files / `31` tests passed; `workers-runtime-freshness.test.ts` failed `7/7` before product assertions because Prisma could not reach PostgreSQL at `localhost:5432`.
  - `corepack pnpm --filter api exec vitest run src/workers/workerOwnership.test.ts src/workers/workerHeartbeat.test.ts src/workers/workerBootstrap.test.ts src/observability/runtimeFreshness.test.ts src/router/workers-health-readiness.test.ts src/modules/engine/assistantOrchestrator.service.test.ts src/modules/engine/assistantOrchestrator.protocol.test.ts src/modules/engine/assistantOrchestrator.parity.test.ts --pool=forks --maxWorkers=1 --minWorkers=1 --test-timeout 30000`
    - Result: PASS, `8` files / `31` tests.
- Manual checks:
  - `docker info --format '{{json .ServerVersion}}'` failed because `//./pipe/dockerDesktopLinuxEngine` was unavailable.
- High-risk checks: no production, secret, account, exchange, payment, subscription, order, position, deploy, restart, rollback, DB/Redis mutation, or live-trading action performed.
- Module confidence ledger updated: yes.
- Requirements matrix updated: no, parent issue state is sufficient for this proof-only slice.
- Quality scenarios updated: no, no quality target changed.
- Risk register updated: no, existing local infra blocker is already recurring and recorded in state.
- Reality status: partially verified.

## Architecture Evidence
- Architecture source reviewed:
  - `docs/architecture/reference/assistant-runtime-contract.md`
  - `docs/architecture/reference/runtime-signal-merge-contract.md`
  - `.agents/core/project-memory-index.md`
- Fits approved architecture: yes.
- Mismatch discovered: no.
- Decision required from user: no.
- Follow-up architecture doc updates: none, no behavior changed.

## Deployment / Ops Evidence
- Deploy impact: none.
- Env or secret changes: none.
- Health-check impact: none.
- Smoke steps updated: no.
- Rollback note: not applicable.
- Observability or alerting impact: none.
- Staged rollout or feature flag: not applicable.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: LUC-6468 lacked a current first worker/assistant proof slice in this workspace.
- Gaps: DB-backed `workers-runtime-freshness.test.ts` cannot run without local PostgreSQL.
- Inconsistencies: none found in scoped code anchors.
- Architecture constraints: assistant hot-path LIVE remains fail-closed unless explicitly enabled; current foundation remains deterministic and advisory.

### 2. Select One Priority Mission Objective
- Selected task: LUC-6930 first runtime/AI worker contract proof slice.
- Priority rationale: it is the only current actionable CBE child under the runtime automation / AI execution packet.
- Why other candidates were deferred: production, protected auth, source/build, browser-review, and ops gates are separate owner lanes.

### 3. Plan Implementation
- Files or surfaces to modify: evidence/state docs only.
- Logic: no runtime logic change.
- Edge cases: distinguish code/test failure from missing local infrastructure.

### 4. Execute Implementation
- Implementation notes: no product code was changed.

### 5. Verify and Test
- Validation performed: focused Vitest pack, DB-free rerun, Docker availability check.
- Result: partially verified; DB-backed runtime freshness route proof blocked by local PostgreSQL/Docker.

### 6. Self-Review
- Simpler option considered: issue comment only. Rejected because project source-of-truth requires durable task/state evidence.
- Technical debt introduced: no.
- Scalability assessment: existing tests remain the right proof surface; no duplicate harness added.
- Refinements made: clean DB-free pass recorded separately after combined pack isolated the DB blocker.

### 7. Update Documentation and Knowledge
- Docs updated: this task record, module confidence ledger, system health, task board, project state, next steps.
- Context updated: yes.
- Learning journal updated: not applicable; the Docker/Postgres blocker is already a known recurring local infra limitation.

## Result Report
- Task summary: Verified the DB-free worker ownership/heartbeat/bootstrap/readiness and assistant orchestration/protocol/parity contracts; isolated DB-backed runtime freshness route proof as blocked by unavailable local PostgreSQL.
- Files changed: documentation/state only.
- How tested: focused API Vitest commands listed above plus `docker info` availability check.
- What is incomplete: `apps/api/src/router/workers-runtime-freshness.test.ts` needs local PostgreSQL at `localhost:5432` or restored Docker Desktop.
- Next steps: Parent [LUC-6468](/LUC/issues/LUC-6468) can continue with more child slices; an infra/QA owner should restore local Docker/Postgres and rerun the blocked DB-backed freshness route command.
- Decisions made: no backend repair child is warranted from this slice.
