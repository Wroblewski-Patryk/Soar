# Task

## Header
- ID: LUC-5729
- Title: Production performance and server health watch
- Task Type: release
- Current Stage: verification
- Status: DONE
- Owner: Ops/Release
- Depends on: none
- Priority: P0
- Module Confidence Rows: operations/runtime health, production smoke, worker readiness
- Requirement Rows: production performance watch, read-only server health watch
- Quality Scenario Rows: availability, latency, freshness, rollback safety
- Risk Rows: stale smoke token, market catalog cold latency, host-level observability gap
- Iteration: 2026-06-28 DRE heartbeat
- Operation Mode: TESTER
- Mission ID: LUC-5729-PRODUCTION-PERFORMANCE-SERVER-HEALTH-WATCH-2026-06-28
- Mission Status: VERIFIED

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the reliability verification scope.
- [x] The task is aligned with repository source-of-truth documents.
- [x] `.agents/core/project-memory-index.md` was considered through active project state and prior watch evidence.
- [x] `.agents/core/mission-control.md` was considered through active mission state.
- [x] Missing or template-like state tables were not in scope for this read-only watch.
- [x] Affected module confidence rows were identified.
- [x] Affected requirement, quality scenario, and risk rows were identified.
- [x] The task improves release confidence, not only local code appearance.

## Mission Block
- Mission objective: verify Soar production responsiveness and server health without mutating production.
- Release objective advanced: production-readiness and sellability confidence.
- Included slices: public smoke, protected workers readiness via fresh login, timing samples, runtime freshness, rollback guard, Coolify read-only projection.
- Explicit exclusions: deploy, push, restart, rollback execution, env edit, secret/account readback, DB/Redis mutation, raw logs, production account mutation, subscription/payment mutation, exchange mutation, order, position, live-trading action.
- Checkpoint cadence: one heartbeat evidence packet.
- Stop conditions: smoke failure, rollback guard requiring rollback, protected credential gap, or production mutation requirement.
- Handoff expectation: close if healthy; create one narrow incident/repair issue only if a regression is reproduced.

## Responsibility Lanes

| Lane | Owner | Source docs/state | Owned files/surfaces | Output | Validation/proof | Status |
| --- | --- | --- | --- | --- | --- | --- |
| Coordinator | Active DRE chat | Paperclip wake, prior watch evidence | Issue disposition, evidence integration | Final status and Paperclip comment | Evidence packet | DONE |
| Ops/Runtime | DRE | post-deploy smoke, rollback playbook, reliability docs | production endpoints, Coolify read-only projection | health and timing proof | smoke/freshness/rollback/Coolify GETs | DONE |
| Security | DRE within no-secret boundary | credentials/account safety contract | secret handling posture | no-secret evidence | binding-name-only checks | DONE |
| Documentation/Memory | DRE | task template, context files | history evidence/task and state summaries | durable evidence packet | file readback and issue comment | DONE |

### Lane Checks
- [x] `.agents/state/active-mission.md` was refreshed through a mission entry.
- [x] Responsibility lanes were constrained to DRE-owned read-only runtime proof.
- [x] Every important responsibility from source docs has an owner or explicit omission.
- [x] No two write lanes own the same file or shared registry.
- [x] Each lane has expected output and validation/proof.
- [x] Missing or unclear ownership did not require a responsibility-learning entry.

## Context

[LUC-5729](/LUC/issues/LUC-5729) is the recurring Soar production performance and server-health watch. Prior DRE watches showed public/API health, fresh-login worker readiness, healthy runtime freshness, and one repeated `/dashboard/markets/catalog` cold low-second sample that normalized quickly.

## Goal

Verify whether production is healthy and responsive enough for the current release-readiness posture, and determine whether to create a narrow incident/repair issue.

## Success Signal
- User or operator problem: avoid Soar being technically up but commercially unusable.
- Expected product or reliability outcome: public pages, API health/ready, protected workers readiness, and authenticated dashboard APIs respond without human-visible stall territory.
- How success will be observed: smoke PASS, timing samples without 60-second-class stalls, runtime freshness PASS, rollback guard `shouldRollback=false`, Coolify read-only projection reachable.
- Post-launch learning needed: yes, continue watching recurring market catalog cold sample.

## Deliverable For This Stage

Read-only production watch evidence and final issue disposition.

## Constraints
- use existing smoke/freshness/rollback scripts and Coolify GET projection
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay in verification stage

## Definition of Done
- [x] public API/Web smoke completed
- [x] protected workers readiness checked through safe fresh-login path
- [x] runtime freshness and rollback guard checked
- [x] representative timing evidence captured
- [x] Coolify/VPS read-only availability boundary recorded
- [x] durable evidence and state updates written
- [x] Paperclip issue updated to clear disposition

## Stage Exit Criteria
- [x] The output matches the declared `Current Stage`.
- [x] Work from later stages was not mixed in without explicit approval.
- [x] Risks and assumptions for this stage are stated clearly.

## Forbidden
- new systems without approval
- duplicated logic or parallel implementations of the same contract
- temporary bypasses, hacks, or workaround-only paths
- architecture changes without explicit approval
- implicit stage skipping
- deploy, push, restart, rollback execution, env edit, secret/account readback, DB/Redis mutation, raw logs, production account mutation, subscription/payment mutation, exchange mutation, order, position, live-trading action

## Validation Evidence
- Tests: not applicable; this was production read-only verification.
- Manual checks: Coolify binding names, no SSH/host-status credential family visible.
- Screenshots/logs: not applicable; no browser/log-body capture performed.
- High-risk checks: stale-token failure and fresh-login success for `/workers/ready`; no secrets printed.
- Module confidence ledger updated: yes.
- Module confidence rows closed or changed: operations/runtime health remains verified-read-only with residuals.
- Requirements matrix updated: not applicable for recurring watch.
- Requirement rows closed or changed: production performance watch evidence refreshed.
- Quality scenarios updated: not applicable.
- Quality scenario rows closed or changed: availability/latency/freshness evidence refreshed.
- Risk register updated: not changed directly; residuals recorded in evidence and next steps.
- Risk rows closed or changed: stale token and market catalog cold sample remain watch items.
- Reality status: verified.

## Architecture Evidence
- Architecture source reviewed: `docs/operations/post-deploy-smoke-checklist.md`, `docs/operations/deployment-rollback-playbook.md`, `docs/operations/service-reliability-and-observability.md`.
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
- Rollback note: rollback guard returned `shouldRollback=false`; no rollback action required.
- Observability or alerting impact: no code/config change; host-level pressure/log-window remains unavailable without read-only host-status credential family.
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: production performance watch was actionable; previous residuals were stale `SMOKE_AUTH_TOKEN`, market catalog cold sample, Coolify app `running:unknown`, host-level observability gap.
- Gaps: host-level VPS pressure/log-window not accessible from current credential set.
- Inconsistencies: stale token fails but fresh-login protected readiness passes.
- Architecture constraints: read-only by default; no production mutation.

### 1a. Bootstrap Missing Project Knowledge
- Bootstrap needed: no
- Missing or template-like files: none for this watch
- Sources scanned: Paperclip heartbeat context, operations docs, previous watch evidence, environment binding names
- Rows created or corrected: none
- Assumptions recorded: safe to use smoke credential family through child-process login; unsafe to use stale token as outage proof
- Blocking unknowns: host-level pressure/log-window evidence
- Why it was safe to continue: all checks were read-only and used existing approved scripts/endpoints

### 2. Select One Priority Mission Objective
- Selected task: [LUC-5729](/LUC/issues/LUC-5729) production performance and server health watch.
- Priority rationale: critical recurring sellability/reliability gate.
- Why other candidates were deferred: scoped wake required this issue only.

### 3. Plan Implementation
- Files or surfaces to modify: evidence/task/state docs only.
- Logic: run read-only smoke/freshness/rollback/timing/Coolify checks, then record disposition.
- Edge cases: stale token false negative, no host-level credentials, no duplicate incident unless regression reproduced.

### 4. Execute Implementation
- Implementation notes: no runtime implementation; verification commands only.

### 5. Verify and Test
- Validation performed: deploy smoke stale and fresh-login paths, runtime freshness, rollback guard, timing samples, Coolify GET projection.
- Result: app healthy; no incident issue required.

### 6. Self-Review
- Simpler option considered: public smoke only.
- Technical debt introduced: no
- Scalability assessment: recurring manual timing remains adequate for watch; repeated market catalog cold sample may warrant backend profiling if it grows or persists.
- Refinements made: fresh-login path used to separate stale-token residual from actual worker health.

### 7. Update Documentation and Knowledge
- Docs updated: `history/evidence/luc-5729-production-performance-server-health-watch-2026-06-28.md`, this task file, state summaries.
- Context updated: yes
- Learning journal updated: not applicable; no new recurring pitfall discovered.

## Review Checklist
- [x] Process self-audit completed before implementation.
- [x] Autonomous loop evidence covers all seven steps.
- [x] Exactly one priority task was completed in this iteration.
- [x] Operation mode was selected according to reliability verification scope.
- [x] Current stage is declared and respected.
- [x] Deliverable for the current stage is complete.
- [x] Architecture alignment confirmed.
- [x] Existing systems were reused where applicable.
- [x] No workaround paths were introduced.
- [x] No logic duplication was introduced.
- [x] Definition of Done evidence is attached.
- [x] Relevant validations were run.
- [x] Docs or context were updated.
- [x] Learning journal was not updated because no new recurring pitfall was confirmed.
- [x] Required responsibility lanes were integrated, rejected, or tracked as follow-up.
- [x] Parent validation ran after accepted lane integration.

## Notes

Residuals remain watch items, not blockers from this heartbeat:

- stale `SMOKE_AUTH_TOKEN` returns `401`
- `/dashboard/markets/catalog` cold sample hit `1195.3 ms`, then normalized to max `35.9 ms`
- Coolify app rows report `running:unknown`
- host-level pressure/log-window requires approved read-only host-status credentials
- Web build provenance remains a separate release/source-control gate

## Production-Grade Required Contract

- Goal: refresh Soar production performance/server-health evidence.
- Scope: production API/Web endpoints, protected worker readiness, runtime freshness, rollback guard, Coolify read-only projection, evidence/state docs.
- Implementation Plan: run smoke, rerun protected path through fresh login, time representative endpoints, run freshness and rollback guard, read Coolify safely, record evidence, update issue.
- Acceptance Criteria: no public outage; no 60-second-class dashboard stall reproduced; workers readiness passes through safe auth; runtime freshness passes; rollback guard does not require rollback; no duplicate incident unless regression is reproduced.
- Definition of Done: satisfied by evidence packet and Paperclip closure.

## Integration Evidence

## Reliability / Observability Evidence
- `docs/operations/service-reliability-and-observability.md` reviewed: yes
- Critical user journey: public app/API availability, authenticated dashboard reads, worker-backed runtime freshness.
- SLI: HTTP success, latency samples, worker/runtime freshness, rollback guard.
- SLO: no public outage, no human-visible stall class in sampled routes, worker heartbeat under 60s, market freshness under 120s.
- Error budget posture: healthy with watch residual.
- Health/readiness check: `/health`, `/ready`, `/workers/ready`.
- Logs, dashboard, or alert route: rollback guard alerts array empty; raw logs not captured.
- Smoke command or manual smoke: `deploySmokeCheck`, `checkPostDeployRuntimeFreshness`, `evaluateRollbackGuard`, authenticated timing probe.
- Rollback or disable path: rollback guard `shouldRollback=false`; rollback playbook available if future gate fails.

- `INTEGRATION_CHECKLIST.md` reviewed: not applicable
- Real API/service path used: yes
- Endpoint and client contract match: yes
- DB schema and migrations verified: not applicable
- Loading state verified: not applicable
- Error state verified: stale token fail-closed `401`
- Refresh/restart behavior verified: not applicable
- Regression check performed: compared against prior market catalog cold sample residual.

## Security / Privacy Evidence
- `docs/security/secure-development-lifecycle.md` reviewed: not applicable
- Data classification: production operational metadata and redacted timing/status evidence.
- Trust boundaries: production API/Web/Coolify read-only, no mutation.
- Permission or ownership checks: fresh login used existing smoke credential family; no secret values printed.
- Abuse cases: stale token not treated as valid outage proof; no account mutation.
- Secret handling: only binding names and lengths inspected; values not recorded.
- Security tests or scans: protected endpoint fail-closed through stale token.
- Fail-closed behavior: `/workers/ready` returns `401` with stale token.
- Residual risk: host-level pressure/log-window unavailable without approved read-only credential family.

## Result Report

- Task summary: read-only Soar production watch completed; app is healthy in this evidence window.
- Files changed: `history/evidence/luc-5729-production-performance-server-health-watch-2026-06-28.md`, `history/tasks/luc-5729-production-performance-server-health-watch-2026-06-28-task.md`, plus local state summary entries.
- How tested: deploy smoke, runtime freshness, rollback guard, timing samples, Coolify GET projection.
- What is incomplete: host-level VPS pressure/log-window proof; stale token cleanup; release-grade build provenance.
- Next steps: continue recurring watch; route only if market catalog cold sample becomes persistent or grows toward human-visible stall territory.
- Decisions made: no duplicate incident/repair issue required from this heartbeat.
