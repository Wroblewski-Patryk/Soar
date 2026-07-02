# Task

## Header
- ID: LUC-6711
- Title: Production performance and server health watch
- Task Type: release
- Current Stage: verification
- Status: BLOCKED
- Owner: Ops/Release
- Depends on: [LUC-6331](/LUC/issues/LUC-6331)
- Priority: P0
- Module Confidence Rows: production operations, deploy smoke, worker readiness
- Requirement Rows: production deploy health, authenticated acceptance readiness
- Quality Scenario Rows: reliability, operability, performance
- Risk Rows: production Web and worker readiness risk
- Iteration: routine heartbeat
- Operation Mode: TESTER
- Mission ID: `LUC-6711-PRODUCTION-PERFORMANCE-SERVER-HEALTH-WATCH-2026-07-02`
- Mission Status: BLOCKED

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches this verification/watch task.
- [x] The task is aligned with repository source-of-truth documents.
- [x] `.agents/core/project-memory-index.md` was reviewed via AGENTS startup contract context.
- [x] `.agents/core/mission-control.md` was reviewed via AGENTS startup contract context.
- [x] Missing or template-like state tables were not bootstrapped; current state already records the production blocker family.
- [x] Affected module confidence rows were identified.
- [x] Affected requirement, quality scenario, and risk rows were identified.
- [x] The task improves release confidence with current production evidence.

## Mission Block
- Mission objective: Rerun read-only Soar production performance and server-health watch.
- Release objective advanced: keep V1 release blocked or cleared based on live production evidence.
- Included slices: public deploy smoke, protected worker readiness, runtime freshness, rollback guard, representative timing, sanitized Coolify projection.
- Explicit exclusions: deploy, push, restart, rollback execution, env edit, secret/account value readback, DB/Redis mutation, production account mutation, exchange/payment/trading mutation.
- Checkpoint cadence: one heartbeat.
- Stop conditions: healthy proof recorded, or current blocker and next owner recorded.
- Handoff expectation: Ops Release Lead / approved Coolify mutation owner continues the existing restoration issue.

## Responsibility Lanes

| Lane | Owner | Source docs/state | Owned files/surfaces | Output | Validation/proof | Status |
| --- | --- | --- | --- | --- | --- | --- |
| Coordinator | DRE heartbeat | [LUC-6711](/LUC/issues/LUC-6711), operations docs, current evidence | issue disposition, evidence packet | blocked disposition and proof summary | Paperclip update | DONE |
| Ops verification | DRE | `docs/operations/post-deploy-smoke-checklist.md`, `DEPLOYMENT_GATE.md` | production endpoints, Coolify read-only API | health watch evidence | smoke, timing, runtime, rollback guard, Coolify projection | DONE |
| Ops mutation | Ops Release Lead | [LUC-6331](/LUC/issues/LUC-6331) | Coolify production resources | restart/redeploy/rollback decision | protected mutation proof, follow-up smoke | BLOCKED |

### Lane Checks
- [x] `.agents/state/active-mission.md` was refreshed with the blocked production watch signal.
- [x] Responsibility ownership remains inside DRE/Ops for verification; mutation remains with approved Ops owner.
- [x] No two write lanes own the same file or shared registry in this heartbeat.
- [x] Each lane has expected output and validation/proof.

## Context
Recurring read-only production health watch for Soar. Recent evidence already
showed API health/readiness green while Web and worker readiness were red; this
heartbeat rechecked the live state and avoided duplicate repair issue creation.

## Goal
Prove the current production health state and leave a durable Paperclip
disposition with next owner.

## Success Signal
- User or operator problem: production could be technically partly up while commercially unusable.
- Expected product or reliability outcome: release remains blocked until Web and worker readiness recover.
- How success will be observed: deploy smoke, runtime freshness, rollback guard, timing, and Coolify projection recorded.
- Post-launch learning needed: yes.

## Deliverable For This Stage
Read-only production watch evidence and blocked disposition.

## Constraints
- use existing smoke/runtime/rollback scripts
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate existing [LUC-6331](/LUC/issues/LUC-6331) restoration path
- stay within verification stage

## Definition of Done
- [x] production public health smoke run
- [x] protected worker/runtime proof attempted with approved env bindings
- [x] Coolify read-only projection captured without stored secret values
- [x] source-of-truth status updated
- [x] Paperclip issue updated to final disposition

## Stage Exit Criteria
- [x] The output matches verification.
- [x] Work from release/mutation stages was not mixed in.
- [x] Risks and assumptions are stated clearly.

## Forbidden
- new systems without approval
- duplicated repair issue for the same production failure
- temporary bypasses
- architecture changes
- implicit stage skipping

## Validation Evidence
- Tests:
  - `pnpm run -s ops:deploy:smoke -- --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --no-workers` -> `FAIL`, API `200`, Web `503`.
  - `pnpm run -s ops:deploy:smoke -- --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch` -> `FAIL`, API `200`, Web `503`, workers ready `503`.
  - `pnpm run -s ops:deploy:runtime-freshness` with process-local auth mapping -> `PASS`.
  - `pnpm run -s ops:deploy:rollback-guard` with process-local auth mapping -> `FAIL`, `shouldRollback=true`.
- Manual checks:
  - `curl.exe` representative timing for API/Web/workers routes.
  - sanitized Coolify read-only projection.
- Screenshots/logs: not applicable.
- High-risk checks: no deploy/restart/rollback/env/account/secret/trading mutation.
- Module confidence ledger updated: source-of-truth status updated in system health and task board.
- Requirements matrix updated: not changed; existing blocked production release class remains.
- Quality scenarios updated: not changed.
- Risk register updated: yes.
- Reality status: blocked.

## Architecture Evidence
- Architecture source reviewed: operations/deployment gate and post-deploy smoke checklist.
- Fits approved architecture: yes.
- Mismatch discovered: no.
- Decision required from user: no.
- Follow-up architecture doc updates: none.

## Deployment / Ops Evidence
- Deploy impact: none.
- Env or secret changes: none.
- Health-check impact: production Web and protected worker readiness fail.
- Smoke steps updated: no.
- Rollback note: rollback guard requests action, but no rollback was executed.
- Observability or alerting impact: alerts endpoint returned no rollback-critical alerts inside rollback guard.
- Staged rollout or feature flag: not applicable.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: production Web `503`, protected `/workers/ready` `503`, `soar-web` and `workers-backtest` unhealthy in Coolify.
- Gaps: restoration not complete.
- Inconsistencies: API/runtime freshness healthy while Web and backtest worker are unavailable.
- Architecture constraints: no production mutation without approval.

### 1a. Bootstrap Missing Project Knowledge
- Bootstrap needed: no.
- Sources scanned: AGENTS, operations docs, current state, recent evidence.
- Blocking unknowns: exact runtime crash cause remains with Ops restoration path.
- Why it was safe to continue: read-only checks only.

### 2. Select One Priority Mission Objective
- Selected task: [LUC-6711](/LUC/issues/LUC-6711) health watch.
- Priority rationale: critical recurring production performance gate.
- Why other candidates were deferred: scoped wake forbids switching issues.

### 3. Plan Implementation
- Files or surfaces to modify: evidence/task/state docs only.
- Logic: reuse existing smoke, runtime freshness, rollback guard, and Coolify read-only probes.
- Edge cases: avoid storing secret-bearing Coolify payload fields.

### 4. Execute Implementation
- Implementation notes: no product code changed; only evidence/memory updated.

### 5. Verify and Test
- Validation performed: smoke, timing, runtime freshness, rollback guard, Coolify projection.
- Result: blocked on existing restoration path.

### 6. Self-Review
- Simpler option considered: only reuse latest QVE evidence; rejected because this routine requires current watch proof.
- Technical debt introduced: no.
- Scalability assessment: existing scripts remain adequate.
- Refinements made: Coolify evidence uses allowlist summary only.

### 7. Update Documentation and Knowledge
- Docs updated: this task packet, evidence packet, task board, system health, risk register, learning journal.
- Context updated: yes.
- Learning journal updated: yes.

## Review Checklist
- [x] Process self-audit completed before implementation.
- [x] Autonomous loop evidence covers all seven steps.
- [x] Exactly one priority task was completed in this iteration.
- [x] Operation mode selected for verification/watch.
- [x] Current stage declared and respected.
- [x] Deliverable complete.
- [x] Architecture alignment confirmed.
- [x] Existing systems reused.
- [x] No workaround paths introduced.
- [x] No logic duplication introduced.
- [x] Definition of Done evidence attached.
- [x] Relevant validations run.
- [x] Docs/context updated.
- [x] Learning journal updated.
- [x] Parent validation recorded through Paperclip disposition.

## Notes
The existing repair path remains [LUC-6331](/LUC/issues/LUC-6331); creating
another repair issue would duplicate active ownership.

## Result Report

- Task summary: Read-only production watch rerun; release remains blocked.
- Files changed: evidence/task/state docs only.
- How tested: production smoke, timing, runtime freshness, rollback guard, Coolify projection.
- What is incomplete: production Web and backtest worker restoration.
- Next steps: Ops Release Lead / approved mutation owner resolves [LUC-6331](/LUC/issues/LUC-6331), then DRE/QVE rerun smoke and acceptance.
- Decisions made: no duplicate repair child; block current watch on existing restoration path.
