# Task

## Header
- ID: LUC-6424
- Title: Authenticated production acceptance and performance sweep
- Task Type: release
- Current Stage: verification
- Status: BLOCKED
- Owner: QA/Test
- Depends on: [LUC-6331](/LUC/issues/LUC-6331)
- Priority: P0
- Module Confidence Rows: production auth/session, dashboard shell, admin shell, Web build metadata, worker readiness, production timing
- Requirement Rows: production authenticated acceptance, protected worker readiness, rollback guard
- Quality Scenario Rows: production availability, performance, release rollback readiness
- Risk Rows: production Web unavailable, protected worker readiness unavailable
- Iteration: 2026-06-30 heartbeat
- Operation Mode: TESTER
- Mission ID: LUC-6424-AUTHENTICATED-PRODUCTION-ACCEPTANCE-PERFORMANCE-SWEEP-2026-06-30
- Mission Status: BLOCKED

## Process Self-Audit
- [x] All seven autonomous loop steps are represented.
- [x] Exactly one priority task is selected.
- [x] The task is aligned with repository source-of-truth documents.
- [x] `.agents/core/project-memory-index.md` and current state were reviewed through the active mission/state context.
- [x] Affected module confidence rows were identified.
- [x] The task improves release confidence by proving the current production acceptance blocker.

## Context
Recurring QVE production acceptance must verify Soar as a paid production
product: public Web, authenticated routes, protected worker readiness, runtime
freshness, rollback posture, and performance timing. Recent same-day sweeps
already showed Web `503` and protected `/workers/ready` `503`.

## Goal
Run the smallest read-only production acceptance sweep that proves whether
authenticated acceptance can be accepted now.

## Scope
- Production API health and readiness.
- Production Web root and build-info.
- Protected `/workers/ready`.
- Runtime freshness.
- Rollback guard.
- Production UI route clickthrough artifact.

## Implementation Plan
1. Confirm approved production audit auth bindings exist by name/length only.
2. Run deploy smoke with env-only auth mapping.
3. Run runtime freshness.
4. Run rollback guard.
5. Run UI clickthrough audit to persist a machine-readable Web fail-state.
6. Update local evidence/state and Paperclip disposition.

## Acceptance Criteria
- Public API health/readiness result recorded.
- Web root/build-info result recorded.
- Protected worker readiness result recorded.
- Runtime freshness and rollback guard results recorded.
- Auth/secret values are not printed or stored.
- Issue disposition names the unblock owner/action.

## Definition of Done
- [x] Evidence file written.
- [x] UI artifact written.
- [x] Source-of-truth state updated.
- [x] Paperclip issue updated to blocked with owner/action.

## Forbidden
- No deploy, push, restart, rollback execution, env edit, secret/account value
  readback, DB/Redis mutation, exchange/payment mutation, order, position,
  subscription/payment mutation, or live-trading action.
- No workaround acceptance of Web `503`.

## Validation Evidence
- Tests:
  - `pnpm run ops:deploy:smoke -- --api-base-url ... --web-base-url ...` -> FAIL, API health/ready PASS, Web `/` and build-info `503`, `/workers/ready` `503`.
  - `pnpm run ops:deploy:runtime-freshness -- --base-url ...` -> PASS.
  - `pnpm run ops:deploy:rollback-guard -- --base-url ...` -> FAIL, `shouldRollback=true`, `workers_ready_endpoint_http_503`.
  - `pnpm run ops:ui:prod-clickthrough -- ...` -> FAIL and wrote artifact.
- Manual checks: env binding names/lengths only; no values printed.
- Screenshots/logs: not applicable; Web unavailable.
- High-risk checks: secret redaction and production non-mutation boundary preserved.
- Module confidence ledger updated: yes.
- Reality status: blocked.

## Architecture Evidence
- Architecture source reviewed: production acceptance follows existing ops scripts and release gates.
- Fits approved architecture: yes.
- Mismatch discovered: no.
- Decision required from user: no.

## Deployment / Ops Evidence
- Deploy impact: none.
- Env or secret changes: none.
- Health-check impact: current production Web and protected worker readiness fail.
- Smoke steps updated: no.
- Rollback note: guard reports `shouldRollback=true`; rollback was not executed.
- Observability or alerting impact: alerts endpoint returned empty inside rollback guard.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Recent LUC-6386/LUC-6413/LUC-6416 entries showed Web `503`.
- Current LUC-6424 heartbeat context requires authenticated production acceptance.

### 2. Select One Priority Mission Objective
- Selected task: LUC-6424 production acceptance sweep.
- Priority rationale: critical recurring release gate.

### 3. Plan Implementation
- Reuse existing ops scripts with env-only auth bindings and no secret output.

### 4. Execute Implementation
- Ran deploy smoke, runtime freshness, rollback guard, and UI clickthrough audit.

### 5. Verify and Test
- Result: blocked by Web `503` and protected `/workers/ready` `503`; runtime freshness PASS.

### 6. Self-Review
- Existing scripts were reused; no workaround or duplicate checker was introduced.
- Technical debt introduced: no.

### 7. Update Documentation and Knowledge
- Docs updated: evidence, task packet, state/context files.
- Learning journal updated: not applicable; this is a known production availability blocker.

## Result Report
- Task summary: production acceptance is blocked; Web frontend and protected worker readiness are unavailable.
- Files changed:
  - `history/evidence/luc-6424-authenticated-production-acceptance-performance-sweep-2026-06-30.md`
  - `history/evidence/luc-6424-prod-ui-module-clickthrough-2026-06-30.md`
  - `history/artifacts/luc-6424-prod-ui-module-clickthrough-2026-06-30.json`
  - `history/tasks/luc-6424-authenticated-production-acceptance-performance-sweep-2026-06-30-task.md`
  - state/context ledgers updated.
- How tested: production read-only smoke/freshness/rollback/clickthrough commands above.
- What is incomplete: authenticated browser acceptance and Web performance cannot run until production Web and `/workers/ready` recover.
- Next steps: DRE/Ops resolves [LUC-6331](/LUC/issues/LUC-6331), then QVE reruns this acceptance.
- Decisions made: mark LUC-6424 blocked; do not create duplicate Backend/Auth repair.
