# Task

## Header
- ID: LUC-6109
- Title: Authenticated Production Acceptance And Performance Sweep
- Task Type: release
- Current Stage: verification
- Status: BLOCKED
- Owner: QA/Test
- Depends on: backend/auth repair child for reproduced logout failure
- Priority: P0
- Module Confidence Rows: Auth, Operations/Runtime, Dashboard/Admin route reachability
- Requirement Rows: production authenticated acceptance, auth logout fail-closed session invalidation
- Quality Scenario Rows: production reliability, auth security, performance smoke
- Risk Rows: production auth-session regression
- Iteration: 2026-06-29
- Operation Mode: TESTER
- Mission ID: `LUC-6109-AUTHENTICATED-PRODUCTION-ACCEPTANCE-PERFORMANCE-SWEEP-2026-06-29`
- Mission Status: BLOCKED

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches this QA verification heartbeat.
- [x] The task is aligned with repository source-of-truth documents.
- [x] Affected module confidence rows were identified.
- [x] Affected requirement, quality scenario, and risk rows were identified.
- [x] The task improves release confidence, not only local code appearance.

## Mission Block
- Mission objective: verify production Soar with authenticated acceptance, route coverage, runtime health, rollback guard, and timing samples.
- Release objective advanced: production readiness gate for authenticated acceptance.
- Included slices: deploy smoke, auth-session browser proof, module clickthrough, runtime freshness, rollback guard, timing sample.
- Explicit exclusions: deploy, push, restart, rollback execution, env edit, raw secret readback, DB/Redis mutation, account mutation, exchange/payment/trading actions.
- Stop conditions: reproduced production auth logout/session invalidation failure.
- Handoff expectation: Backend/Auth repairs logout `502` and stale token validity after logout, then QVE reruns the same production proof.

## Context

[LUC-6109](/LUC/issues/LUC-6109) is the recurring authenticated production
acceptance and performance sweep for Soar. It follows previous accepted sweeps
such as [LUC-6034](/LUC/issues/LUC-6034), but must close only on fresh
production evidence.

## Goal

Confirm whether current production is healthy enough for authenticated
acceptance. If not, leave a precise blocker and evidence-backed repair handoff.

## Scope

- Production Web `https://soar.luckysparrow.ch`
- Production API `https://api.soar.luckysparrow.ch`
- Existing scripts:
  - `scripts/deploySmokeCheck.mjs`
  - `scripts/runProdAuthSessionBrowserProof.mjs`
  - `scripts/runProdUiModuleClickthroughAudit.mjs`
  - `scripts/checkPostDeployRuntimeFreshness.mjs`
  - `scripts/evaluateRollbackGuard.mjs`
- Evidence files under `history/evidence/` and `history/artifacts/`

## Implementation Plan

1. Read wake payload, role contract, active mission, and task board.
2. Read current production build-info SHA.
3. Run protected deploy smoke using injected production audit login bindings.
4. Run auth-session browser proof and retry on failure.
5. Run route/module clickthrough.
6. Run runtime freshness and rollback guard.
7. Capture representative timing sample.
8. Package evidence and set Paperclip disposition with a first-class blocker.

## Acceptance Criteria

- Deploy smoke passes for public and protected rows.
- Auth-session browser proof passes logout/session invalidation.
- Module clickthrough passes public, dashboard, admin, and legacy route rows.
- Runtime freshness is PASS.
- Rollback guard reports `shouldRollback=false`.
- Timing sample returns expected statuses for public and authenticated endpoints.

## Definition of Done

- [x] Production checks executed without secret value output.
- [x] Evidence packet created.
- [x] Failure reproduced before declaring blocked.
- [x] Narrow repair owner/path created.
- [x] No production mutation outside auth proof logout-session check.

## Forbidden

- Deploy, push, restart, rollback execution, or env mutation.
- Secret/account value readback or artifact capture.
- Exchange/payment/trading/order/position mutation.
- Broad duplicate QA backlog creation.

## Validation Evidence

- Tests:
  - `pnpm run ops:deploy:smoke -- --api-base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --expected-sha 3bd65e21d09f294a18d3317d2f59f7a0d4e577b4` PASS.
  - `node scripts/runProdAuthSessionBrowserProof.mjs ...` FAIL.
  - `node scripts/runProdAuthSessionBrowserProof.mjs ... retry` FAIL.
  - `node scripts/runProdUiModuleClickthroughAudit.mjs ...` PASS.
  - `node scripts/checkPostDeployRuntimeFreshness.mjs --base-url https://api.soar.luckysparrow.ch` PASS.
  - `node scripts/evaluateRollbackGuard.mjs --base-url https://api.soar.luckysparrow.ch` PASS, `shouldRollback=false`.
- Manual checks: production build-info readback SHA `3bd65e21d09f294a18d3317d2f59f7a0d4e577b4`.
- Screenshots/logs: no screenshots; redacted markdown/JSON artifacts only.
- High-risk checks: auth logout/session invalidation failed twice.
- Module confidence ledger updated: yes.
- Requirements matrix updated: not applicable in this heartbeat; failure recorded in task/state.
- Quality scenarios updated: not applicable in this heartbeat; failure recorded in task/state.
- Risk register updated: yes.
- Reality status: blocked.

## Deployment / Ops Evidence

- Deploy impact: none.
- Env or secret changes: none.
- Health-check impact: public/protected smoke passed.
- Smoke steps updated: no.
- Rollback note: rollback guard returned `shouldRollback=false`.
- Observability or alerting impact: alerts `[]` in rollback guard.
- Staged rollout or feature flag: not applicable.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: production auth logout/session invalidation failure.
- Gaps: `POST /auth/logout` returns `502`; same token still passes `/auth/me`.
- Inconsistencies: route/module and runtime checks are healthy, so failure is specific to auth logout/session invalidation.
- Architecture constraints: reuse existing smoke/auth proof scripts.

### 2. Select One Priority Mission Objective
- Selected task: [LUC-6109](/LUC/issues/LUC-6109).
- Priority rationale: critical recurring production acceptance gate.
- Why other candidates were deferred: this heartbeat was scoped by Paperclip wake payload.

### 3. Plan Implementation
- Files or surfaces to modify: evidence/state only.
- Logic: run existing read-only production proof matrix.
- Edge cases: retry auth proof before classifying failure.

### 4. Execute Implementation
- Implementation notes: no product code changed.

### 5. Verify and Test
- Validation performed: deploy smoke, auth proof with retry, route/module audit, runtime freshness, rollback guard, timing sample.
- Result: blocked by reproduced auth logout/session invalidation failure.

### 6. Self-Review
- Simpler option considered: stop after first auth proof failure.
- Technical debt introduced: no.
- Scalability assessment: evidence points to narrow backend/auth repair instead of broad QA backlog.
- Refinements made: retry captured before blocker classification.

### 7. Update Documentation and Knowledge
- Docs updated: task and evidence packet.
- Context updated: active mission, task board, project state, next steps, system health, module confidence, risk register.
- Learning journal updated: not applicable.

## Review Checklist
- [x] Process self-audit completed before final disposition.
- [x] Autonomous loop evidence covers all seven steps.
- [x] Exactly one priority task was completed in this iteration.
- [x] Current stage is declared and respected.
- [x] Existing systems were reused.
- [x] No workaround paths were introduced.
- [x] No logic duplication was introduced.
- [x] Definition of Done evidence is attached.
- [x] Relevant validations were run.
- [x] Required responsibility lane handoff is tracked as a child issue.

## Result Report

- Task summary: production acceptance is blocked by reproducible auth logout/session invalidation failure; runtime, rollback, routes, and timing are otherwise healthy.
- Files changed: evidence/task/state files only.
- How tested: existing production smoke/auth/UI/runtime/rollback scripts plus timing sample.
- What is incomplete: backend/auth repair and QA rerun.
- Next steps: CBE fixes logout `502` and token invalidation, then QVE reruns auth proof and acceptance sweep.
- Decisions made: do not close [LUC-6109](/LUC/issues/LUC-6109) as accepted; block it on a narrow backend/auth repair child.
