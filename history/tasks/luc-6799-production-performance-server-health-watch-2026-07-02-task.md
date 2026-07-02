# Task

## Header
- ID: LUC-6799
- Title: Production Performance And Server Health Watch
- Task Type: release
- Current Stage: verification
- Status: BLOCKED
- Owner: Ops/Release
- Depends on: [LUC-6331](/LUC/issues/LUC-6331)
- Priority: P0
- Module Confidence Rows: production web, API health, protected worker readiness, runtime freshness
- Requirement Rows: release smoke, production readiness, rollback guard
- Quality Scenario Rows: reliability, availability, performance
- Risk Rows: production Web unavailable, worker readiness unavailable, rollback action required
- Iteration: 2026-07-02 DRE heartbeat
- Operation Mode: BUILDER
- Mission ID: LUC-6799-PRODUCTION-PERFORMANCE-SERVER-HEALTH-WATCH-2026-07-02
- Mission Status: BLOCKED

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the scoped routine heartbeat.
- [x] The task is aligned with repository source-of-truth documents.
- [x] `.agents/core/project-memory-index.md` was reviewed through current local state context.
- [x] `.agents/core/mission-control.md` state was reviewed through `.agents/state/active-mission.md`.
- [x] Missing or template-like state tables were not encountered for this narrow verification.
- [x] Affected module confidence rows were identified.
- [x] Affected requirement, quality scenario, and risk rows were identified.
- [x] The task improves release confidence with fresh production evidence.

## Mission Block
- Mission objective: rerun read-only Soar production performance and server-health watch for [LUC-6799](/LUC/issues/LUC-6799).
- Release objective advanced: preserve current production readiness truth and route the active blocker to the correct Ops mutation owner.
- Included slices: public deploy smoke, protected worker readiness, runtime freshness, rollback guard, representative timing, sanitized Coolify projection.
- Explicit exclusions: deploy, push, restart, rollback execution, env edit, DB/Redis mutation, secret value readback, account mutation, exchange/payment action, order, position, subscription mutation, live-trading action.
- Checkpoint cadence: single heartbeat packet.
- Stop conditions: healthy watch completed or production regression/blocker confirmed.
- Handoff expectation: if blocked, update [LUC-6799](/LUC/issues/LUC-6799) with [LUC-6331](/LUC/issues/LUC-6331) as unblock path.

## Responsibility Lanes

| Lane | Owner | Source docs/state | Owned files/surfaces | Output | Validation/proof | Status |
| --- | --- | --- | --- | --- | --- | --- |
| Coordinator | DRE active chat | Issue wake payload, DRE role | Paperclip disposition, evidence integration | Final blocked disposition | Issue update | DONE |
| Ops verification | DRE | deploy smoke scripts, Coolify read-only API | Production health/readiness | Evidence packet | smoke/freshness/rollback/Coolify checks | DONE |
| Mutation owner | Ops Release Lead | [LUC-6331](/LUC/issues/LUC-6331) | Coolify restart/redeploy/rollback path | Restore Web/backtest worker | future approved mutation proof | BLOCKED |
| QA/Test | QVE | production acceptance matrix | authenticated acceptance | rerun after restoration | future browser/API proof | BLOCKED |
| Documentation/Memory | DRE | `.agents/state/*`, `.codex/context/*` | evidence/task/state notes | durable source-of-truth update | file links | DONE |

### Lane Checks
- [x] `.agents/state/active-mission.md` was refreshed for this heartbeat.
- [x] Responsibility lanes were explicit and narrow.
- [x] Every important responsibility from source docs has an owner or explicit omission.
- [x] No two write lanes own the same file or shared registry.
- [x] Each lane has expected output and validation/proof.
- [x] Missing or unclear ownership was not discovered.
- [x] Process eval is not required for this narrow recurring watch.

## Context
This is a recurring Soar production-performance and server-health watch. Recent
DRE watches have found a stable blocker: API and runtime freshness are healthy,
while Web and protected worker readiness fail with `503`.

## Goal
Collect fresh read-only production evidence for [LUC-6799](/LUC/issues/LUC-6799)
and route the issue to a clear Paperclip disposition.

## Scope
- Public production API/Web smoke:
  `https://api.soar.luckysparrow.ch`, `https://soar.luckysparrow.ch`
- Protected worker readiness through existing smoke auth bindings.
- Runtime freshness and rollback guard through existing env-only auth bindings.
- Sanitized Coolify production projection through read-only API.
- Source-of-truth updates in history and state files.

## Implementation Plan
1. Read scoped Paperclip heartbeat context.
2. Run public deploy smoke without worker gate.
3. Run protected deploy smoke with worker readiness.
4. Run runtime freshness.
5. Run rollback guard.
6. Capture representative HTTP timings.
7. Capture sanitized Coolify production projection.
8. Write evidence and state updates.
9. Patch [LUC-6799](/LUC/issues/LUC-6799) to blocked with [LUC-6331](/LUC/issues/LUC-6331) as unblock path.

## Acceptance Criteria
- API `/health` and `/ready` status recorded.
- Web `/`, `/auth/login`, and `/api/build-info` status recorded.
- Protected `/workers/ready` status recorded.
- Runtime freshness result recorded.
- Rollback guard decision recorded.
- Coolify application projection recorded without secret values.
- Source control and deployment impact recorded.
- Paperclip issue disposition updated.

## Definition of Done
- [x] Fresh production watch evidence captured.
- [x] No prohibited production mutation occurred.
- [x] Existing blocker owner/action named.
- [x] Relevant source-of-truth files updated.
- [x] Issue receives clear final disposition.

## Validation Evidence
- Tests:
  - `pnpm run -s ops:deploy:smoke -- --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --no-workers` -> FAIL on Web `503`.
  - `pnpm run -s ops:deploy:smoke -- --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch` -> FAIL on Web `503` and workers `503`.
  - `pnpm run -s ops:deploy:runtime-freshness` -> PASS.
  - `pnpm run -s ops:deploy:rollback-guard` -> FAIL with `shouldRollback=true`.
- Manual checks:
  - representative `curl.exe` timing sample.
  - sanitized Coolify read-only projection.
- Screenshots/logs: not applicable; raw logs intentionally not captured.
- High-risk checks: secret values not printed; no deploy/restart/rollback/env/DB mutation.
- Module confidence ledger updated: no, watch-only evidence did not change module classification beyond existing blocker.
- Requirements matrix updated: no, existing release blocker remains.
- Quality scenarios updated: no, system-health state updated instead.
- Risk register updated: no, existing release risk remains routed through [LUC-6331](/LUC/issues/LUC-6331).
- Reality status: blocked.

## Architecture Evidence
- Architecture source reviewed: Soar deploy/runtime architecture and current state.
- Fits approved architecture: yes.
- Mismatch discovered: no.
- Decision required from user: no.
- Approval reference if architecture changed: not applicable.
- Follow-up architecture doc updates: none.

## Deployment / Ops Evidence
- Deploy impact: none.
- Env or secret changes: none.
- Health-check impact: production API healthy; Web and worker readiness unavailable.
- Smoke steps updated: no.
- Rollback note: rollback guard recommends action but no rollback was executed.
- Observability or alerting impact: alerts endpoint returned no critical alerts inside rollback guard.
- Staged rollout or feature flag: not applicable.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: [LUC-6799](/LUC/issues/LUC-6799) critical routine heartbeat; prior [LUC-6776](/LUC/issues/LUC-6776) showed Web/worker 503.
- Gaps: Web and protected worker readiness still unavailable.
- Inconsistencies: none; Coolify projection aligns with smoke failure.
- Architecture constraints: read-only watch; mutation belongs to Ops Release Lead.

### 1a. Bootstrap Missing Project Knowledge
- Bootstrap needed: no.
- Sources scanned: DRE role, Paperclip heartbeat context, local active mission/task board/system health.
- Rows created or corrected: none.
- Assumptions recorded: existing [LUC-6331](/LUC/issues/LUC-6331) remains the unblock path.
- Blocking unknowns: exact Coolify runtime cause requires approved mutation/log owner.
- Why it was safe to continue: read-only checks only.

### 2. Select One Priority Mission Objective
- Selected task: [LUC-6799](/LUC/issues/LUC-6799).
- Priority rationale: scoped wake payload and critical production health routine.
- Why other candidates were deferred: wake contract forbids switching issues.

### 3. Plan Implementation
- Files or surfaces to modify: evidence/task/state docs only.
- Logic: run existing production health scripts and record results.
- Edge cases: prevent secret output and avoid production mutation.

### 4. Execute Implementation
- Implementation notes: no app code changed; reused existing ops scripts.

### 5. Verify and Test
- Validation performed: smoke, freshness, rollback guard, timing, Coolify projection.
- Result: blocked by Web/worker `503`; runtime freshness passes.

### 6. Self-Review
- Simpler option considered: reusing prior [LUC-6776](/LUC/issues/LUC-6776) evidence only.
- Technical debt introduced: no.
- Scalability assessment: routine remains repeatable through existing scripts.
- Refinements made: captured fresh timing and Coolify projection.

### 7. Update Documentation and Knowledge
- Docs updated: evidence/task/state notes.
- Context updated: yes.
- Learning journal updated: not applicable.

## Review Checklist
- [x] Process self-audit completed before implementation.
- [x] Autonomous loop evidence covers all seven steps.
- [x] Exactly one priority task was completed in this iteration.
- [x] Operation mode was selected according to scoped routine heartbeat.
- [x] Current stage is declared and respected.
- [x] Deliverable for the current stage is complete.
- [x] Architecture alignment confirmed.
- [x] Existing systems were reused where applicable.
- [x] No workaround paths were introduced.
- [x] No logic duplication was introduced.
- [x] Definition of Done evidence is attached.
- [x] Relevant validations were run.
- [x] Docs or context were updated.
- [x] Learning journal update not required.
- [x] Required responsibility lanes were integrated or tracked as follow-up.
- [x] Parent validation ran after evidence integration.

## Notes
The watch confirms availability failure, not a slow-dashboard performance
symptom: Web returns fast `503` responses. Production restoration remains with
[LUC-6331](/LUC/issues/LUC-6331).

## Production-Grade Required Contract

- Goal: fresh production health watch and final disposition.
- Scope: production API/Web/worker readiness, runtime freshness, rollback guard, Coolify read-only projection.
- Implementation Plan: see above.
- Acceptance Criteria: see above.
- Definition of Done: see above.
- Result Report: below.

## Integration Evidence

## Reliability / Observability Evidence
- `docs/operations/service-reliability-and-observability.md` reviewed: not applicable for narrow routine.
- Critical user journey: public Web and authenticated dashboard entry.
- SLI: HTTP availability/readiness.
- SLO: public Web/API responsive and worker readiness healthy.
- Error budget posture: exhausted for Web availability.
- Health/readiness check: API pass, Web fail, worker readiness fail.
- Logs, dashboard, or alert route: Coolify read-only projection and rollback guard alerts.
- Smoke command or manual smoke: existing ops smoke scripts and `curl.exe`.
- Rollback or disable path: Ops Release Lead through [LUC-6331](/LUC/issues/LUC-6331).

- `INTEGRATION_CHECKLIST.md` reviewed: not applicable for read-only watch.
- Real API/service path used: yes.
- Endpoint and client contract match: yes.
- DB schema and migrations verified: not applicable.
- Loading state verified: not applicable.
- Error state verified: production Web 503.
- Refresh/restart behavior verified: not applicable; no restart allowed.
- Regression check performed: production smoke rerun.

## Security / Privacy Evidence
- `docs/security/secure-development-lifecycle.md` reviewed: not applicable for read-only watch.
- Data classification: operational health metadata.
- Trust boundaries: production API/Web, Coolify read-only API, Paperclip.
- Permission or ownership checks: DRE read-only scope; mutation remains Ops owner.
- Abuse cases: secret leakage prevented by env-only credential use and sanitized evidence.
- Secret handling: values not printed or stored.
- Security tests or scans: not applicable.
- Fail-closed behavior: worker readiness and rollback guard fail closed.
- Residual risk: production Web remains unavailable.

## Result Report

- Task summary: production remains blocked; API health/ready and runtime freshness pass, Web and protected workers fail with `503`, Coolify shows `soar-web` and `workers-backtest` unhealthy with queued deployments.
- Files changed:
  - `history/evidence/luc-6799-production-performance-server-health-watch-2026-07-02.md`
  - `history/tasks/luc-6799-production-performance-server-health-watch-2026-07-02-task.md`
  - `.agents/state/system-health.md`
  - `.agents/state/active-mission.md`
  - `.codex/context/TASK_BOARD.md`
- How tested: existing ops smoke/freshness/rollback scripts, timing sample, Coolify read-only projection.
- What is incomplete: production restoration.
- Next steps: [LUC-6331](/LUC/issues/LUC-6331) Ops mutation owner restores or rolls back; DRE/QVE rerun production acceptance.
- Decisions made: no new duplicate repair issue; existing [LUC-6331](/LUC/issues/LUC-6331) remains authoritative.
