# Task

## Header

- ID: LUC-5250
- Title: Production performance and server health watch
- Task Type: release
- Current Stage: verification
- Status: DONE_WITH_DELEGATED_FOLLOW_UP
- Owner: Ops/Release
- Depends on: [LUC-4811](/LUC/issues/LUC-4811), [LUC-5075](/LUC/issues/LUC-5075)
- Priority: P0
- Module Confidence Rows: production operations, auth/session, API health/readiness
- Requirement Rows: production performance watch, server health readback
- Quality Scenario Rows: service reliability, public route latency, auth fail-closed behavior
- Risk Rows: Coolify/VPS binding gap, API readiness latency tail
- Iteration: 2026-06-20 DRE heartbeat
- Operation Mode: TESTER
- Mission ID: LUC-5250-PRODUCTION-PERFORMANCE-HEALTH-WATCH-2026-06-20
- Mission Status: PARTIALLY_VERIFIED

## Context

This is a recurring DRE watch for Soar production performance. The issue is
read-only by default and must not mutate production. Previous same-day watches
left full Coolify/VPS server-health readback blocked by the protected binding
path under [LUC-4811](/LUC/issues/LUC-4811).

## Goal

Capture current production performance and server-health evidence, route one
exact follow-up if a fresh bottleneck signal appears, and close the heartbeat
with a durable Paperclip disposition.

## Scope

- Production API `/health` and `/ready`.
- Production Web `/`, `/auth/login`, and `/api/build-info`.
- Protected auth/session browser proof using approved audit env names.
- Coolify stack env checker and checker tests.
- Local evidence/state files touched by this checkpoint.

## Implementation Plan

1. Read issue context and DRE/shared contracts.
2. Run public production smoke with workers skipped.
3. Run public timing with PowerShell and confirm with `curl.exe`.
4. Read production build-info.
5. Run Coolify env checker tests and current binding preflight.
6. Run protected auth/session proof only with approved audit bindings.
7. Clean validation-owned browser/profile resources.
8. Create one narrow follow-up for recurring API latency.
9. Update evidence/state and Paperclip final disposition.

## Acceptance Criteria

- Public production smoke result is recorded.
- Public timing is recorded and classified.
- Protected auth/session proof is recorded or explicitly blocked.
- Coolify/VPS readback binding state is recorded without exposing secrets.
- Any regression signal is routed through exactly one narrow follow-up.
- No production mutation occurs.

## Constraints

- Use existing scripts and approved mechanisms.
- Do not introduce workaround paths or duplicate broad incidents.
- Stay read-only for production.

## Definition of Done

- [x] Evidence file records commands, results, and residual risk.
- [x] Task file records scope, validation, and result report.
- [x] Paperclip follow-up exists for the API latency signal.
- [x] Cleanup evidence is recorded.
- [x] Final Paperclip issue disposition is updated.

## Forbidden

- Deploy, push, restart, rollback, env edit, database/Redis mutation.
- Secret, cookie, token, password, or raw sensitive log readback.
- Production account mutation, exchange action, payment/subscription mutation, live-trading action.
- Duplicate broad Coolify/VPS binding issues.

## Validation Evidence

- Tests:
  - `pnpm run -s ops:coolify-stack:env-check:test` -> PASS, `11/11`.
- Manual checks:
  - `pnpm run -s ops:deploy:smoke -- --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --no-workers` -> PASS.
  - `curl.exe` timing five-sample pass -> Web healthy; API low-second tails.
  - `pnpm run -s ops:coolify-stack:env-check` -> FAIL_CLOSED, required present `0/16`.
- Screenshots/logs:
  - No screenshots captured.
  - Redacted auth artifacts only.
- High-risk checks:
  - Protected auth/session proof artifact -> PASS.
  - Secret values were not printed or stored.
- Reality status: partially verified.

## Architecture Evidence

- Architecture source reviewed: operations reliability and deployment gate docs.
- Fits approved architecture: yes.
- Mismatch discovered: no.
- Decision required from user: no.
- Approval reference if architecture changed: not applicable.
- Follow-up architecture doc updates: none.

## Deployment / Ops Evidence

- Deploy impact: none.
- Env or secret changes: none.
- Health-check impact: API health/readiness low-second latency follow-up created.
- Smoke steps updated: no.
- Rollback note: no mutation, rollback not applicable.
- Observability or alerting impact: [LUC-5252](/LUC/issues/LUC-5252) should correlate API latency with runtime signals when bindings allow.
- Staged rollout or feature flag: not applicable.

## Autonomous Loop Evidence

### 1. Analyze Current State

- Issues: [LUC-5250](/LUC/issues/LUC-5250), [LUC-4811](/LUC/issues/LUC-4811), [LUC-5075](/LUC/issues/LUC-5075), [LUC-5213](/LUC/issues/LUC-5213).
- Gaps: full Coolify/VPS/DB/worker health readback unavailable in this runner.
- Inconsistencies: PowerShell timing showed broad tails but `curl.exe` did not reproduce Web latency.
- Architecture constraints: read-only DRE watch; no protected mutation.

### 2. Select One Priority Mission Objective

- Selected task: read-only production performance and health watch.
- Priority rationale: critical recurring reliability gate.
- Why other candidates were deferred: scoped wake required handling [LUC-5250](/LUC/issues/LUC-5250) only.

### 3. Plan Implementation

- Files or surfaces to modify: evidence/task/state docs only.
- Logic: no application logic changes.
- Edge cases: browser proof timeout after artifact generation; validation-owned cleanup.

### 4. Execute Implementation

- Implementation notes: no runtime implementation; created [LUC-5252](/LUC/issues/LUC-5252) for current API latency tail.

### 5. Verify and Test

- Validation performed: public smoke, timing, auth proof, Coolify checker tests/preflight, cleanup checks.
- Result: partially verified; Web/auth healthy; API latency warning; full server-health readback blocked.

### 6. Self-Review

- Simpler option considered: close as app healthy after public smoke only.
- Technical debt introduced: no.
- Scalability assessment: follow-up isolates API latency without reopening broad binding work.
- Refinements made: confirmed timing with `curl.exe` before routing follow-up.

### 7. Update Documentation and Knowledge

- Docs updated: evidence/task/state/context files.
- Context updated: yes.
- Learning journal updated: no; browser cleanup friction was resolved and not a new recurring pitfall in this run.

## Reliability / Observability Evidence

- `docs/operations/service-reliability-and-observability.md` reviewed: yes.
- Critical user journey: public Web login/home and API health/readiness.
- SLI: HTTP success and response latency.
- SLO: public pages responsive; API health/readiness fast enough to avoid user-visible stalls.
- Error budget posture: burning for API health/readiness latency tail; Web/auth healthy.
- Health/readiness check: public smoke PASS; API timing warning.
- Logs, dashboard, or alert route: blocked by approved binding gap.
- Smoke command or manual smoke: recorded above.
- Rollback or disable path: no mutation, rollback not applicable.

## Security / Privacy Evidence

- Data classification: protected production auth context, redacted.
- Trust boundaries: production Web/API; protected auth/session proof.
- Permission or ownership checks: auth/session fail-closed checks passed.
- Abuse cases: invalid-token and logout checks passed.
- Secret handling: values were not printed or stored; only binding names and pass/fail summaries recorded.
- Security tests or scans: protected auth/session proof artifact PASS.
- Fail-closed behavior: unauthenticated, invalid-token, and logout checks passed.
- Residual risk: full runtime readback still blocked by approved binding gap.

## Result Report

- Task summary: Production public smoke passed; Web timing and protected auth proof passed; API `/health` and `/ready` show intermittent low-second latency tails; full Coolify/VPS/DB/worker readback remains blocked by approved binding path.
- Files changed: this task packet, evidence packet, auth proof artifacts, state/context updates.
- How tested: public smoke, public timing, protected auth proof, Coolify env checker tests/preflight, cleanup checks.
- What is incomplete: runtime/server-health correlation beyond public probes.
- Next steps: [LUC-5252](/LUC/issues/LUC-5252) repeats/correlates API latency; [LUC-5075](/LUC/issues/LUC-5075) keeps the [LUC-4811](/LUC/issues/LUC-4811) binding path first-class.
- Decisions made: no duplicate broad binding issue; one narrow API latency follow-up.
