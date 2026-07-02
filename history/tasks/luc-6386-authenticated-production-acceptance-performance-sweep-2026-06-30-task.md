# Task

## Header
- ID: LUC-6386
- Title: Authenticated Production Acceptance And Performance Sweep
- Task Type: release
- Current Stage: verification
- Status: BLOCKED
- Owner: QA/Test
- Depends on: [LUC-6331](/LUC/issues/LUC-6331)
- Priority: P0
- Module Confidence Rows: production auth/session, dashboard shell, worker readiness
- Requirement Rows: production acceptance, protected smoke, read-only dashboard acceptance
- Quality Scenario Rows: production availability, auth fail-closed behavior, runtime freshness
- Risk Rows: production Web availability, protected worker readiness
- Iteration: 2026-06-30 QVE heartbeat
- Operation Mode: TESTER
- Mission ID: LUC-6386-AUTHENTICATED-PRODUCTION-ACCEPTANCE-PERFORMANCE-SWEEP-2026-06-30
- Mission Status: BLOCKED

## Context
Recurring QVE production acceptance issue for Soar. The wake payload scoped this
heartbeat to [LUC-6386](/LUC/issues/LUC-6386) with no pending comments. Recent
DRE state already indicated production Web `503`; this heartbeat rechecked the
current acceptance gate before attempting broader browser proof.

## Goal
Prove whether current production Soar can run authenticated acceptance,
protected smoke, runtime freshness, rollback guard, and representative
performance checks using redacted evidence.

## Scope
- Production public API health.
- Production Web root and build-info availability.
- Protected worker/runtime gates through existing scripts.
- Paperclip issue disposition and durable evidence.

## Implementation Plan
1. Read QVE role and release/evidence contracts.
2. Confirm issue context from inline wake payload.
3. Run the smallest current-state production acceptance checks.
4. Record failure evidence without secret readback.
5. Link the result to the existing restoration incident instead of creating a
   duplicate repair lane.

## Acceptance Criteria
- Current production Web/API/protected readiness state is recorded.
- If acceptance is blocked, the blocker names owner/action and first-class
  blocker issue.
- No production mutation or secret/account value readback occurs.

## Definition of Done
- [x] Production deploy smoke attempted.
- [x] Web build-info direct read attempted.
- [x] Runtime freshness and rollback guard attempted through existing scripts.
- [x] Evidence and artifact recorded.
- [x] Paperclip issue updated to a clear final disposition.

## Forbidden
- New systems without approval.
- Duplicated logic or parallel implementations of the same contract.
- Temporary bypasses, hacks, or workaround-only paths.
- Architecture changes without explicit approval.
- Production mutation, trading/live settings mutation, secret readback, or deploy.

## Validation Evidence
- Retry after `process_lost_retry`: production gates rerun at
  `2026-06-30T06:38:10Z`; result unchanged, so this is not stale process
  output.
- `Invoke-RestMethod https://soar.luckysparrow.ch/api/build-info`: FAIL, `503 no available server`.
- `pnpm run -s ops:deploy:smoke -- --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --no-workers`: FAIL. API `/health` and `/ready` passed; Web `/` and `/api/build-info` returned `503`.
- Direct endpoint timing sample: API `/health -> 200` in `216.2 ms`; API `/ready -> 200` in `32.8 ms`; Web `/ -> 503` in `70.9 ms`; Web `/api/build-info -> 503` in `17.3 ms`.
- `node scripts/checkPostDeployRuntimeFreshness.mjs --base-url https://api.soar.luckysparrow.ch` with `DEPLOY_FRESHNESS_*` auth aliases from `PROD_UI_AUDIT_*`: PASS. Worker/market heartbeat age about `3.8s`; runtime signal lag `0`; running sessions healthy.
- `node scripts/evaluateRollbackGuard.mjs --base-url https://api.soar.luckysparrow.ch` with `ROLLBACK_GUARD_*` auth aliases from `PROD_UI_AUDIT_*`: FAIL. `shouldRollback=true` due to `workers_ready_endpoint_http_503`; freshness PASS with worker/market heartbeat age about `9.7s`; alerts empty.
- Module confidence ledger updated: yes.
- Requirements matrix updated: no; this is a recurring production acceptance evidence packet, not a requirement change.
- Quality scenarios updated: no.
- Risk register updated: yes.
- Reality status: blocked.

## Architecture Evidence
- Architecture source reviewed: issue description, QVE role, release/evidence contracts, existing production proof scripts, active mission state.
- Fits approved architecture: yes.
- Mismatch discovered: no.
- Decision required from user: no.
- Follow-up architecture doc updates: none.

## Deployment / Ops Evidence
- Deploy impact: none.
- Env or secret changes: none.
- Health-check impact: API is up; Web is down; protected worker readiness is `503`.
- Rollback note: no rollback executed; rollback guard reports `shouldRollback=true`.
- Observability or alerting impact: runtime freshness passed and alerts were empty through the rollback guard response.

## Result Report
- Task summary: production acceptance is blocked by Web `503` and protected worker readiness `503`.
- Files changed:
  - `history/evidence/luc-6386-authenticated-production-acceptance-performance-sweep-2026-06-30.md`
  - `history/artifacts/luc-6386-production-acceptance-current-state-2026-06-30.json`
  - `history/tasks/luc-6386-authenticated-production-acceptance-performance-sweep-2026-06-30-task.md`
  - `.agents/state/active-mission.md`
  - `.agents/state/module-confidence-ledger.md`
  - `.agents/state/risk-register.md`
  - `.agents/state/system-health.md`
  - `.agents/state/next-steps.md`
  - `.codex/context/PROJECT_STATE.md`
  - `.codex/context/TASK_BOARD.md`
- What is incomplete: authenticated browser/session clickthrough, UI module clickthrough, and performance sweep cannot run while Web returns `503`.
- Next steps: DRE/Ops restoration owner resolves [LUC-6331](/LUC/issues/LUC-6331); QVE reruns [LUC-6386](/LUC/issues/LUC-6386) after Web recovery and protected worker readiness is green.
