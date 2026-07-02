# Task

## Header
- ID: LUC-5767
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
- Mission ID: LUC-5767-PRODUCTION-PERFORMANCE-SERVER-HEALTH-WATCH-2026-06-28
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

## Context

[LUC-5767](/LUC/issues/LUC-5767) is the recurring Soar production performance and server-health watch. Recent DRE watches showed public/API health, fresh-login worker readiness, healthy runtime freshness, and a repeated `/dashboard/markets/catalog` cold low-second sample that normalizes quickly.

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
- Reality status: verified.

## Architecture Evidence
- Architecture source reviewed: `docs/operations/service-reliability-and-observability.md`, prior DRE watch task/evidence packets.
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

### 2. Select One Priority Mission Objective
- Selected task: [LUC-5767](/LUC/issues/LUC-5767) production performance and server health watch.
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
- Technical debt introduced: no.
- Scalability assessment: recurring manual timing remains adequate for watch; repeated market catalog cold sample may warrant backend profiling if it grows or persists.
- Refinements made: fresh-login path used to separate stale-token residual from actual worker health.

### 7. Update Documentation and Knowledge
- Docs updated: `history/evidence/luc-5767-production-performance-server-health-watch-2026-06-28.md`, this task file, state summaries.
- Context updated: yes.
- Learning journal updated: not applicable; no new recurring pitfall discovered.

## Result Report

- Task summary: read-only Soar production watch completed; app is healthy in this evidence window.
- Files changed: `history/evidence/luc-5767-production-performance-server-health-watch-2026-06-28.md`, `history/tasks/luc-5767-production-performance-server-health-watch-2026-06-28-task.md`, plus local state summary entries.
- How tested: deploy smoke, runtime freshness, rollback guard, timing samples, Coolify GET projection.
- What is incomplete: host-level VPS pressure/log-window proof; stale token cleanup; release-grade build provenance.
- Next steps: continue recurring watch; route only if market catalog cold sample becomes persistent or grows toward human-visible stall territory.
- Decisions made: no duplicate incident/repair issue required from this heartbeat.
