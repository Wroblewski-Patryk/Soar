# Task

## Header
- ID: LUC-5526
- Title: Production Performance And Server Health Watch
- Task Type: release
- Current Stage: verification
- Status: DONE
- Owner: Ops/Release
- Depends on: none
- Priority: P0
- Module Confidence Rows: SOAR-OPERATIONS-001
- Requirement Rows: not applicable for this routine watch
- Quality Scenario Rows: production availability, latency, worker readiness, rollback guard
- Risk Rows: production latency, stale protected smoke token, host-level pressure visibility
- Iteration: 2026-06-27 DRE heartbeat
- Operation Mode: TESTER
- Mission ID: LUC-5526-PRODUCTION-PERFORMANCE-SERVER-HEALTH-WATCH-2026-06-27
- Mission Status: PARTIALLY_VERIFIED

## Context
[LUC-5526](/LUC/issues/LUC-5526) is the recurring DRE watch for Soar production performance and server health. The scoped wake had no pending comments and did not require a thread refetch.

## Goal
Refresh production health evidence without mutating production and decide whether the routine watch closes cleanly or needs a narrow incident/repair lane.

## Scope
- Production API `/health`, `/ready`, protected `/workers/ready`, and rollback guard.
- Production Web `/`, `/api/build-info`, authenticated dashboard/admin route clickthrough.
- Representative dashboard/admin read-only API timings.
- Coolify read-only project/environment/resource/deployment projection.
- Evidence/state updates only.

## Implementation Plan
1. Use the scoped Paperclip wake for [LUC-5526](/LUC/issues/LUC-5526).
2. Verify existing same-day read-only production smoke and timing evidence.
3. Verify authenticated UI module clickthrough evidence.
4. Verify rollback guard and Coolify read-only projection evidence.
5. Update source-of-truth state and close the issue if no incident threshold is met.

## Acceptance Criteria
- Public API/Web smoke has current production results.
- Protected workers readiness is classified through available safe credential paths.
- Authenticated dashboard/admin reachability and representative API timing are captured.
- Coolify read-only projection is captured without value disclosure.
- Any regression either creates one narrow follow-up issue or is explicitly classified as watch residual.
- No production mutation occurs.

## Definition of Done
- [x] Read-only production evidence exists under `history/evidence/`.
- [x] Authenticated clickthrough artifact exists under `history/artifacts/`.
- [x] State and module confidence ledgers reference the result.
- [x] Paperclip issue receives a final disposition.

## Forbidden
- deploy, push, restart, rollback execution, environment edit
- secret/account readback or credential value disclosure
- database/Redis mutation
- raw log capture
- production account, subscription/payment, exchange, order, position, or live-trading mutation
- workaround paths or duplicate incident creation without current reproduction

## Validation Evidence
- Tests:
  - `node --test scripts/checkCoolifyStackEnv.test.mjs`: PASS (`11/11`).
- Manual checks:
  - `node scripts/deploySmokeCheck.mjs --api-base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch`: public PASS; stale-token `/workers/ready` timed out.
  - Same deploy smoke with token suppressed for fresh login: protected `/workers/ready` PASS; Web `/api/build-info` timed out in that run and then passed follow-up timing.
  - Public timing samples: Web `/api/build-info`, API `/health`, API `/ready`, and Web `/` all returned `200:10`.
  - `node scripts/evaluateRollbackGuard.mjs --base-url https://api.soar.luckysparrow.ch`: PASS, `shouldRollback=false`.
  - `node scripts/runProdUiModuleClickthroughAudit.mjs ...`: PASS.
  - Authenticated dashboard/admin API timing: PASS for all representative endpoints.
  - Read-only Coolify `GET` projection: PASS.
- High-risk checks:
  - No secret values, cookies, credentials, raw resource ids, token values, log bodies, DB values, or protected payloads stored.
  - No mutation commands executed.
- Module confidence ledger updated: yes.
- Reality status: partially verified.

## Architecture Evidence
- Architecture source reviewed: operations smoke checklist and service reliability document.
- Fits approved architecture: yes.
- Mismatch discovered: no.
- Decision required from user: no.
- Follow-up architecture doc updates: none.

## Deployment / Ops Evidence
- Deploy impact: none.
- Env or secret changes: none.
- Health-check impact: read-only evidence only.
- Smoke steps updated: no.
- Rollback note: rollback guard returned `shouldRollback=false`.
- Observability or alerting impact: no code/config change; routine evidence records latency and Coolify projection.
- Staged rollout or feature flag: not applicable.

## Reliability / Observability Evidence
- `docs/operations/service-reliability-and-observability.md` reviewed: yes.
- Critical user journey: production availability and authenticated dashboard reachability.
- SLI: public health/readiness availability, route reachability, representative API latency, worker readiness, rollback guard status.
- SLO: no HTTP outage; no reproduced 60-second dashboard stall; API health/readiness under human-visible stall territory.
- Error budget posture: healthy with watch residuals.
- Health/readiness check: API `/health` and `/ready` passed; protected `/workers/ready` passed through fresh login.
- Logs, dashboard, or alert route: rollback guard reported no alerts; raw logs not captured.
- Smoke command or manual smoke: see validation evidence.
- Rollback or disable path: rollback guard `shouldRollback=false`; deployment rollback playbook unchanged.

## Security / Privacy Evidence
- Data classification: production operational metadata and redaction-safe route/timing evidence.
- Trust boundaries: production API/Web and Coolify API read-only status.
- Permission or ownership checks: protected worker readiness and rollback guard used approved smoke credential family through scripts.
- Abuse cases: avoid secret value disclosure and avoid mutating production.
- Secret handling: names only; no values stored.
- Fail-closed behavior:
  - stale token timeout was classified as residual and not treated as protected pass;
  - release provenance remains non-release-grade while `metadataSource=env-runtime`.
- Residual risk:
  - stale `SMOKE_AUTH_TOKEN` path,
  - low-second cold samples on Web/build-info and markets catalog,
  - host/proxy/container pressure unavailable without approved read-only credentials,
  - release provenance remains separate.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Existing same-day evidence showed the app was reachable, protected worker readiness passed through fresh login, rollback guard passed, and Coolify projection passed. Residuals were latency/tooling watch items rather than incidents.

### 1a. Bootstrap Missing Project Knowledge
- Bootstrap needed: no.
- Sources scanned: operations smoke checklist, service reliability document, current state ledgers, and same-day evidence artifacts.
- Why it was safe to continue: the issue is a read-only routine and current evidence already captured the required surfaces.

### 2. Select One Priority Mission Objective
- Selected task: close the [LUC-5526](/LUC/issues/LUC-5526) DRE routine health watch.
- Priority rationale: critical recurring production sellability/performance gate.

### 3. Plan Implementation
- Files or surfaces to modify: this task contract and state/context ledgers.
- Logic: evidence/state sync only.

### 4. Execute Implementation
- Implementation notes: added the durable task contract and synchronized state.

### 5. Verify and Test
- Validation performed: evidence artifacts inspected; `git diff --check` run after state edits.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: close only in Paperclip without repo state. Rejected because Soar source-of-truth rules require task and ledger evidence.
- Technical debt introduced: no.

### 7. Update Documentation and Knowledge
- Docs updated: task/evidence/state files only.
- Context updated: project state, task board, next steps, active mission, module confidence ledger.
- Learning journal updated: not applicable.

## Result Report
- Task summary:
  - Completed a read-only production performance/server-health watch. App was reachable, authenticated clickthrough passed, representative dashboard/admin API reads passed, workers readiness passed through fresh login, rollback guard passed, and Coolify read-only projection passed.
- Files changed:
  - `history/tasks/luc-5526-production-performance-server-health-watch-2026-06-27-task.md`
  - `.agents/state/module-confidence-ledger.md`
  - `.agents/state/active-mission.md`
  - `.agents/state/next-steps.md`
  - `.codex/context/PROJECT_STATE.md`
  - `.codex/context/TASK_BOARD.md`
- How tested:
  - Existing same-day production evidence inspected; `git diff --check` after state edits.
- What is incomplete:
  - Host-level VPS pressure/log capture remains unavailable from this runner.
  - Release-grade build provenance remains outside this routine watch.
- Next steps:
  - Continue routine watch on future recurrence.
  - Create a narrow DRE/Ops incident only if latency tails recur persistently, `/ready`/dashboard/workers fail, rollback guard triggers, or operator-reported 60-second dashboard stalls reproduce.
- Decisions made:
  - No duplicate incident created because no current outage, rollback trigger, persistent protected failure through fresh login, or reproduced 60-second dashboard stall exists.
