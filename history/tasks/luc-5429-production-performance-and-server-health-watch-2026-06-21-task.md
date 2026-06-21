# Task

## Header
- ID: LUC-5429
- Title: Production performance and server health watch
- Task Type: release
- Current Stage: verification
- Status: DONE
- Owner: Ops/Release
- Depends on: none
- Priority: P0
- Module Confidence Rows: Production Runtime Health, Dashboard Runtime,
  Release/Ops Evidence
- Requirement Rows: production performance watch, protected diagnostics,
  rollback readiness
- Quality Scenario Rows: availability, latency, freshness, observability,
  fail-closed protected operations
- Risk Rows: stale protected smoke token, Web low-second latency outliers,
  host-level pressure visibility unavailable
- Iteration: routine heartbeat
- Operation Mode: TESTER
- Mission ID: LUC-5429-PRODUCTION-PERFORMANCE-HEALTH-WATCH-2026-06-21
- Mission Status: VERIFIED

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the issue's verification/watch scope.
- [x] The task is aligned with repository source-of-truth documents.
- [x] `.agents/core/project-memory-index.md` was represented through current
      AGENTS and state context requirements.
- [x] `.agents/core/mission-control.md` was represented through active mission
      state and scoped Paperclip wake.
- [x] Missing or template-like state tables were not bootstrapped because this
      is a routine watch checkpoint.
- [x] Affected module confidence rows were identified.
- [x] Affected requirement, quality scenario, and risk rows were identified.
- [x] The task improves release confidence, not only local code appearance.

## Mission Block
- Mission objective: run a read-only Soar production performance and server
  health watch, then close or route one exact incident if needed.
- Release objective advanced: production operability and sellability evidence.
- Included slices: public smoke, protected diagnostics, rollback guard,
  authenticated dashboard/API timing, Coolify read-only projection, evidence
  and state updates.
- Explicit exclusions: deploy, push, restart, rollback, env edit, DB/Redis
  mutation, raw log capture, secret value readback, production account
  mutation, trading/live-money action.
- Checkpoint cadence: one heartbeat.
- Stop conditions: app outage, protected diagnostic failure after fresh login,
  60-second dashboard stall reproduction, rollback guard alert, Coolify
  unreachable, or successful evidence closure.
- Handoff expectation: close done when healthy; otherwise create exactly one
  narrow incident or mark blocked with named owner/action.

## Responsibility Lanes

| Lane | Owner | Source docs/state | Owned files/surfaces | Output | Validation/proof | Status |
| --- | --- | --- | --- | --- | --- | --- |
| Coordinator | DRE | Paperclip wake, AGENTS, DRE role | Issue disposition and evidence integration | Task/evidence packet | Parent validation gate | DONE |
| Product/Requirements | Coordinator | Issue description | Performance and sellability watch scope | No incident unless symptoms reproduce | Public/auth/dashboard checks | DONE |
| Architecture | Coordinator | Operations docs | No architecture change | Fit check | Existing scripts reused | DONE |
| Implementation | N/A | Existing ops scripts | No code change | Not applicable | Not applicable | DONE |
| QA/Test | DRE | Smoke/clickthrough/timing scripts | Production read-only checks | Current proof | Commands listed below | DONE |
| Security/Ops/UX | DRE | Release/deploy safety | Secret-safe protected diagnostics and Coolify projection | Redacted evidence | No secret value output | DONE |
| Documentation/Memory | Coordinator | State and history files | Evidence, task, state ledgers | Durable packet | File updates | DONE |

### Lane Checks
- [x] `.agents/state/active-mission.md` was refreshed.
- [x] Responsibility lanes were applied serially because this was one DRE
      verification heartbeat.
- [x] Every important responsibility from source docs has an owner or explicit
      omission.
- [x] No two write lanes own the same file or shared registry.
- [x] Each lane has expected output and validation/proof.
- [x] Missing or unclear ownership was not found.
- [x] Process eval not needed; this was a bounded routine watch.

## Context

[LUC-5429](/LUC/issues/LUC-5429) is a recurring production performance and
server-health watch for Soar. Performance is a release/sellability gate. Recent
DRE evidence showed public/protected smoke generally healthy, Coolify read-only
projection available, and residual host-level pressure limited by absent
SSH/VPS status credentials.

## Goal

Produce current read-only evidence for production availability, latency,
protected worker readiness, runtime freshness, rollback posture, dashboard
reachability, and Coolify health without mutating production.

## Success Signal
- User or operator problem: avoid a technically up but commercially unusable
  Soar production environment, especially dashboard stalls.
- Expected product or reliability outcome: app remains reachable, protected
  worker diagnostics pass, dashboard/admin paths are responsive, rollback guard
  does not request rollback.
- How success will be observed: green smoke/clickthrough/API timing and
  redacted Coolify read-only projection.
- Post-launch learning needed: yes, keep watching stale token path and
  low-second Web outliers.

## Deliverable For This Stage

Read-only verification evidence packet and Paperclip issue closure.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay read-only
- do not expose secret values, cookies, raw protected payloads, or account data

## Definition of Done
- [x] public smoke and timing run
- [x] protected worker readiness and rollback guard checked via approved fresh
      login path after stale token failed
- [x] authenticated dashboard route/API timing checked
- [x] Coolify read-only projection recorded without values
- [x] evidence and project state updated
- [x] Paperclip issue updated to final disposition

## Stage Exit Criteria
- [x] The output matches the declared `verification` stage.
- [x] Work from later stages was not mixed in.
- [x] Risks and assumptions for this stage are stated clearly.

## Forbidden
- new systems without approval
- duplicated logic or parallel implementations of the same contract
- temporary bypasses, hacks, or workaround-only paths
- architecture changes without explicit approval
- deploy, push, restart, rollback, env edit, DB/Redis mutation, raw log capture,
  account mutation, secret value readback, trading/live-money action

## Validation Evidence
- Tests:
  - `pnpm run -s ops:coolify-stack:env-check:test` PASS (`11/11`)
- Manual checks:
  - public timing for Web/API production targets
  - authenticated dashboard/admin API timing
  - read-only Coolify projection
- Screenshots/logs: no screenshots; redacted markdown evidence only.
- High-risk checks:
  - stale token path failed closed with `401`
  - fresh login path passed protected `/workers/ready`
  - rollback guard passed with `shouldRollback=false`
- Module confidence ledger updated: yes
- Module confidence rows closed or changed: Production Runtime Health,
  Dashboard Runtime, Release/Ops Evidence
- Requirements matrix updated: not applicable
- Requirement rows closed or changed: none
- Quality scenarios updated: not applicable
- Quality scenario rows closed or changed: none
- Risk register updated: not applicable
- Risk rows closed or changed: none
- Reality status: verified

## Architecture Evidence
- Architecture source reviewed: operations reliability docs and existing ops
  scripts.
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: none

## Deployment / Ops Evidence
- Deploy impact: none
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no
- Rollback note: rollback guard returned `shouldRollback=false` through fresh
  login path; first token path failed closed with `401`.
- Observability or alerting impact: no code change; current alerts empty.
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: recurring health watch; prior evidence noted stale token possibility
  and host-level pressure visibility limits.
- Gaps: no SSH/VPS status credential family beyond `VPS_HOST`.
- Inconsistencies: pre-bound smoke token is stale/unauthorized, fresh login
  path works.
- Architecture constraints: read-only production checks only.

### 1a. Bootstrap Missing Project Knowledge
- Bootstrap needed: no
- Missing or template-like files: none
- Sources scanned: AGENTS, DRE role, active mission/state, ops scripts, recent
  evidence.
- Rows created or corrected: none
- Assumptions recorded: fresh login path is the valid protected diagnostic path
  for this runner.
- Blocking unknowns: host/proxy/container pressure remains unavailable.
- Why it was safe to continue: all actions were read-only and used approved
  environment bindings without value disclosure.

### 2. Select One Priority Mission Objective
- Selected task: current production performance and server-health watch.
- Priority rationale: issue is critical and assigned by wake payload.
- Why other candidates were deferred: scoped wake forbids switching issues.

### 3. Plan Implementation
- Files or surfaces to modify: evidence/task/state docs only.
- Logic: run public, protected, dashboard/API, Coolify, and rollback checks;
  route incident only if confirmed.
- Edge cases: stale token, missing host-level credentials, public latency
  outliers without outage.

### 4. Execute Implementation
- Implementation notes: no product code changed; existing ops scripts reused.

### 5. Verify and Test
- Validation performed:
  - production smoke first stale-token path failed protected `401`
  - production smoke fresh login path passed
  - rollback guard fresh login path passed
  - public timing passed with low-second outliers
  - dashboard/admin API timing passed
  - production UI clickthrough passed
  - Coolify read-only projection passed
  - Coolify env checker tests passed
- Result: verified read-only; no incident created.

### 6. Self-Review
- Simpler option considered: public smoke only.
- Technical debt introduced: no
- Scalability assessment: current checks are adequate for routine heartbeat;
  host-level pressure requires a separate approved credential lane.
- Refinements made: added authenticated API timing after route clickthrough
  passed to better address dashboard stall concern.

### 7. Update Documentation and Knowledge
- Docs updated:
  - `history/evidence/luc-5429-production-performance-server-health-watch-2026-06-21.md`
  - `history/evidence/luc-5429-prod-ui-module-clickthrough-2026-06-21.md`
  - `history/tasks/luc-5429-production-performance-and-server-health-watch-2026-06-21-task.md`
- Context updated:
  - `.agents/state/active-mission.md`
  - `.agents/state/module-confidence-ledger.md`
  - `.codex/context/PROJECT_STATE.md`
  - `.codex/context/TASK_BOARD.md`
- Learning journal updated: not applicable.

## Review Checklist
- [x] Process self-audit completed before implementation.
- [x] Autonomous loop evidence covers all seven steps.
- [x] Exactly one priority task was completed in this iteration.
- [x] Operation mode was selected according to the verification scope.
- [x] Current stage is declared and respected.
- [x] Deliverable for the current stage is complete.
- [x] Architecture alignment confirmed.
- [x] Existing systems were reused where applicable.
- [x] No workaround paths were introduced.
- [x] No logic duplication was introduced.
- [x] Definition of Done evidence is attached.
- [x] Relevant validations were run.
- [x] Docs or context were updated.
- [x] Learning journal was not needed.
- [x] Required responsibility lanes were integrated.
- [x] Parent validation ran after accepted lane integration.

## Notes

The stale `SMOKE_AUTH_TOKEN` path remains a runner credential hygiene residual,
not an application outage, because fresh approved login generated a working
protected session and all protected diagnostics passed. If the stale-token path
recurs in future DRE watches, Security/Ops should rotate or remove that token
binding from the routine runner.

## Production-Grade Required Contract

- Goal: current read-only production health and performance evidence.
- Scope: production Web/API public routes, protected worker diagnostics,
  dashboard/admin read-only routes and APIs, Coolify read-only status,
  rollback guard.
- Implementation Plan: run existing smoke/timing/audit/projection commands,
  record redacted evidence, route incident only if reproduced.
- Acceptance Criteria:
  - public routes return 2xx/3xx expected responses
  - protected worker readiness passes through valid approved auth
  - dashboard/admin route and API probes avoid 60-second stall reproduction
  - rollback guard returns `shouldRollback=false`
  - no secret values or production mutations occur
- Definition of Done: evidence packet, state updates, issue disposition.

## Integration Evidence

## Product / Discovery Evidence
- Problem validated: yes
- User or operator affected: Soar owner/operators and future customers
- Existing workaround or pain: operator concern about dashboard stalls
- Smallest useful slice: current production health watch
- Success metric or signal: current production checks pass and no incident
  signal remains unowned
- Feature flag, staged rollout, or disable path: not applicable
- Post-launch feedback or metric check: continue routine watch

## Reliability / Observability Evidence
- `docs/operations/service-reliability-and-observability.md` reviewed: yes
- Critical user journey: production landing/login/dashboard/admin read paths
  and protected worker readiness
- SLI: availability, latency, freshness, alert state
- SLO: no current 60-second dashboard stall; protected diagnostics healthy
- Error budget posture: healthy, with watchful low-second Web outliers
- Health/readiness check: API `/health`, `/ready`, `/workers/ready`
- Logs, dashboard, or alert route: `/alerts` via rollback guard, Coolify
  read-only projection
- Smoke command or manual smoke: listed above
- Rollback or disable path: rollback guard says no rollback

- `INTEGRATION_CHECKLIST.md` reviewed: not applicable
- Real API/service path used: yes
- Endpoint and client contract match: yes
- DB schema and migrations verified: not applicable
- Loading state verified: not applicable
- Error state verified: fail-closed `401` stale token path observed
- Refresh/restart behavior verified: no restart performed
- Regression check performed: routine smoke and clickthrough

## Security / Privacy Evidence
- `docs/security/secure-development-lifecycle.md` reviewed: not applicable
- Data classification: production operational metadata and route/status timing
- Trust boundaries: Paperclip runner env to production API/Coolify
- Permission or ownership checks: protected diagnostics required valid auth
- Abuse cases: stale token fails closed
- Secret handling: names-only binding check; no token/cookie/password/raw
  payload values stored
- Security tests or scans: not applicable
- Fail-closed behavior: protected stale token returned `401`; rollback guard
  first run failed closed
- Residual risk: host-level pressure/log-window unavailable without approved
  read-only `SSH*` or dedicated `VPS_*` credentials

- `AI_TESTING_PROTOCOL.md` reviewed: not applicable
- Result: not applicable

## Result Report

- Task summary: completed read-only production performance and server-health
  watch. App, dashboard/API, workers, runtime freshness, alerts, rollback guard,
  and Coolify projection are healthy in this window.
- Files changed:
  - `history/evidence/luc-5429-production-performance-server-health-watch-2026-06-21.md`
  - `history/evidence/luc-5429-prod-ui-module-clickthrough-2026-06-21.md`
  - `history/artifacts/luc-5429-prod-ui-module-clickthrough-2026-06-21.json`
  - `history/tasks/luc-5429-production-performance-and-server-health-watch-2026-06-21-task.md`
  - `.agents/state/active-mission.md`
  - `.agents/state/module-confidence-ledger.md`
  - `.codex/context/PROJECT_STATE.md`
  - `.codex/context/TASK_BOARD.md`
- How tested: commands listed in validation evidence.
- What is incomplete: host/proxy/container pressure and sanitized log-window
  capture remain unavailable from this runner.
- Next steps: continue routine watch; rotate/remove stale `SMOKE_AUTH_TOKEN`
  binding if it keeps taking precedence over the working login path.
- Decisions made: no incident child created because no outage, no 60-second
  stall reproduction, and rollback guard passed.
