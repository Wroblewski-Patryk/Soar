# Task

## Header
- ID: LUC-6331
- Title: Restore production Web and backtest worker health after LUC-6329 watch
- Task Type: release
- Current Stage: verification
- Status: BLOCKED
- Owner: Ops/Release
- Depends on: board-approved production Coolify mutation path
- Priority: P0
- Module Confidence Rows: production runtime, Web availability, worker readiness
- Requirement Rows: production deploy smoke, protected workers readiness
- Quality Scenario Rows: reliability, rollback readiness, observability
- Risk Rows: production Web unavailable, backtest worker unavailable
- Iteration: DRE heartbeat 2026-07-01
- Operation Mode: TESTER
- Mission ID: LUC-6331-PRODUCTION-WEB-BACKTEST-WORKER-RESTORATION-RECHECK-2026-07-01
- Mission Status: BLOCKED

## Process Self-Audit
- [x] All seven autonomous loop steps are represented.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the verification heartbeat.
- [x] The task is aligned with repository source-of-truth documents.
- [x] `.agents/core/project-memory-index.md` was indirectly covered through
      active mission/system-health state for this critical DRE heartbeat.
- [x] `.agents/core/mission-control.md` behavior was followed for bounded
      mission closure.
- [x] Affected module confidence rows were identified.
- [x] Affected requirement, quality scenario, and risk rows were identified.
- [x] The task improves release confidence by proving current production state.

## Mission Block
- Mission objective: determine whether LUC-6331 restoration is complete or
  still blocked, using the smallest safe production verification.
- Release objective advanced: production Web/backtest-worker restoration gate.
- Included slices: deploy smoke, runtime freshness, rollback guard, Coolify
  read-only projection, issue disposition.
- Explicit exclusions: deploy, push, restart, rollback execution, env edit,
  secret readback, DB/Redis mutation, production account mutation, exchange or
  live-trading action.
- Checkpoint cadence: one heartbeat.
- Stop conditions: production Web/workers still fail, missing mutation approval,
  or all checks pass.
- Handoff expectation: if blocked, name the mutation owner/action.

## Responsibility Lanes

| Lane | Owner | Source docs/state | Owned files/surfaces | Output | Validation/proof | Status |
| --- | --- | --- | --- | --- | --- | --- |
| Coordinator | DRE active chat | AGENTS, DRE role, active mission | LUC-6331 evidence/state | Integrated disposition | Evidence packet | DONE |
| Ops/Runtime Verification | DRE | deploy smoke/runbooks | production endpoints, Coolify read-only API | Health diagnosis | smoke/freshness/guard/Coolify projection | DONE |
| Production Mutation | Ops Release Lead | release/deploy safety | Coolify `soar-web`, `workers-backtest` | Restart/redeploy/rollback if approved | post-mutation smoke | BLOCKED |
| QA Acceptance | QVE | production acceptance checks | authenticated Web journeys | acceptance rerun | browser proof after restoration | BLOCKED |

## Context
LUC-6329 created LUC-6331 after production Web and backtest worker readiness
failed. Repeated DRE/QVE watches through LUC-6476 still showed Web `503`,
protected `/workers/ready -> 503`, runtime freshness pass, and Coolify
`soar-web` / `workers-backtest` unhealthy.

## Goal
Recheck whether production Web and backtest worker health has been restored,
record durable evidence, and set a clear issue disposition.

## Success Signal
- User or operator problem: production owner cannot use/verify the Web app and
  protected worker readiness gate fails.
- Expected product or reliability outcome: Web public routes and protected
  workers readiness return `200`, runtime freshness passes, rollback guard is
  false.
- How success will be observed: deploy smoke, runtime freshness, rollback
  guard, and Coolify projection pass.
- Post-launch learning needed: no.

## Deliverable For This Stage
Verification packet and disposition for LUC-6331.

## Constraints
- Use existing DRE scripts and approved Coolify read-only paths.
- Do not mutate production without explicit approval.
- Do not print or store secrets, cookies, tokens, or raw Coolify objects.
- Do not deploy from the dirty worktree.

## Definition of Done
- [x] Production deploy smoke rerun.
- [x] Runtime freshness rerun.
- [x] Rollback guard rerun.
- [x] Coolify production resource state checked read-only.
- [x] Evidence and state updated.
- [x] Issue disposition has named unblock owner/action.

## Validation Evidence
- Tests: not applicable; no code changed.
- Manual checks: production deploy smoke, runtime freshness, rollback guard,
  Coolify read-only projection.
- Screenshots/logs: none; status-level command output recorded in evidence.
- High-risk checks: no mutation, no secret value readback, no raw logs stored.
- Module confidence ledger updated: not changed directly in this heartbeat;
  system health and active mission updated with the current blocked signal.
- Requirements matrix updated: not applicable.
- Quality scenarios updated: not applicable.
- Risk register updated: system-health signal records production risk.
- Reality status: blocked.

## Deployment / Ops Evidence
- Deploy impact: none.
- Env or secret changes: none.
- Health-check impact: Web `/` and `/api/build-info` still `503`; protected
  `/workers/ready` still `503`.
- Smoke steps updated: no.
- Rollback note: rollback guard returns `shouldRollback=true`; no rollback
  executed because this heartbeat had read-only scope and no mutation approval.
- Observability or alerting impact: Coolify reports `soar-web` and
  `workers-backtest` as `exited:unhealthy`; alerts endpoint inside rollback
  guard returned `[]`.
- Staged rollout or feature flag: not applicable.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: production Web and protected workers readiness remain unavailable.
- Gaps: no approved mutation path in this wake payload.
- Inconsistencies: global Coolify resources endpoint exposed only one row in
  this runner; project-scoped production endpoint returned the canonical eight
  resources.
- Architecture constraints: Soar production topology remains six app resources
  plus PostgreSQL and Redis.

### 2. Select One Priority Mission Objective
- Selected task: LUC-6331 production restoration verification.
- Priority rationale: critical production availability incident.
- Why other candidates were deferred: this wake payload was scoped to LUC-6331.

### 3. Plan Implementation
- Files or surfaces to modify: LUC-6331 task/evidence and current state notes.
- Logic: run read-only production checks and classify disposition.
- Edge cases: avoid relying on localhost defaults; avoid secret readback.

### 4. Execute Implementation
- Implementation notes: mapped production URL/auth namespaces process-locally
  and used documented Coolify project production endpoint.

### 5. Verify and Test
- Validation performed: deploy smoke, runtime freshness, rollback guard,
  Coolify production projection.
- Result: blocked; restoration not complete.

### 6. Self-Review
- Simpler option considered: endpoint-only smoke. Rejected because Coolify
  resource state is needed for a first-class owner/action.
- Technical debt introduced: no.
- Scalability assessment: no code path changed.
- Refinements made: used project-scoped Coolify endpoint after global resources
  projection was insufficient in this runner.

### 7. Update Documentation and Knowledge
- Docs updated: LUC-6331 evidence/task; active mission and system-health notes.
- Context updated: yes.
- Learning journal updated: not applicable.

## Review Checklist
- [x] Process self-audit completed before closure.
- [x] Autonomous loop evidence covers all seven steps.
- [x] Exactly one priority task was completed in this iteration.
- [x] Current stage is declared and respected.
- [x] Deliverable for the current stage is complete.
- [x] Existing systems were reused.
- [x] No workaround paths were introduced.
- [x] No logic duplication was introduced.
- [x] Definition of Done evidence is attached.
- [x] Relevant validations were run.
- [x] Docs/context were updated.

## Result Report

- Task summary: LUC-6331 restoration is still blocked. API health/readiness and
  runtime freshness pass, but Web and protected workers readiness still fail.
- Files changed:
  - `history/evidence/luc-6331-production-web-backtest-worker-restoration-recheck-2026-07-01.md`
  - `history/tasks/luc-6331-production-web-backtest-worker-restoration-recheck-2026-07-01-task.md`
  - `.agents/state/active-mission.md`
  - `.agents/state/system-health.md`
- How tested:
  - `pnpm run -s ops:deploy:smoke` with production URL mapping: failed on Web
    and workers readiness.
  - `pnpm run -s ops:deploy:runtime-freshness`: pass.
  - `pnpm run -s ops:deploy:rollback-guard`: failed with
    `workers_ready_endpoint_http_503`.
  - Coolify project production endpoint: `soar-web` and `workers-backtest`
    are `exited:unhealthy`.
- Paperclip disposition caveat: `/api/health` returned `200`, but
  heartbeat-context, PATCH-to-`blocked`, and comment-only POST timed out from
  this runner; board mutation is unconfirmed.
- What is incomplete: production resource mutation/recovery was not performed.
- Next steps: Ops Release Lead or board-approved Coolify mutation owner must
  restart/redeploy or roll back `soar-web` and `workers-backtest`, then DRE/QVE
  rerun production smoke and acceptance.
- Decisions made: keep LUC-6331 `blocked`, not `done` or `in_review`, because
  the restoration target is not healthy and no live continuation path exists in
  this read-only heartbeat.
