# Task

## Header
- ID: LUC-6412
- Title: Coolify Production Deploy Health Sweep
- Task Type: release
- Current Stage: verification
- Status: BLOCKED
- Owner: Ops/Release
- Depends on: [LUC-6331](/LUC/issues/LUC-6331)
- Priority: P0
- Module Confidence Rows: deployment/runtime health
- Requirement Rows: production deploy smoke, worker readiness, rollback guard
- Quality Scenario Rows: reliability, observability, deployability
- Risk Rows: production Web unavailable, worker readiness unavailable
- Iteration: 2026-07-01 DRE heartbeat
- Operation Mode: BUILDER
- Mission ID: LUC-6412-COOLIFY-PRODUCTION-DEPLOY-HEALTH-SWEEP-2026-07-01
- Mission Status: BLOCKED

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the issue lane.
- [x] The task is aligned with repository source-of-truth documents.
- [x] Deployment and rollback docs were reviewed.
- [x] Affected module confidence rows were identified.
- [x] Affected requirement, quality scenario, and risk rows were identified.
- [x] The task improves release confidence by replacing stale health claims
      with current read-only production evidence.

## Context
LUC-6412 is a DRE-scoped Coolify production deploy health sweep. Adjacent
production issues already showed API healthy, Web unavailable, workers
readiness unavailable, runtime freshness passing, and rollback guard requiring
action. This heartbeat reran the read-only checks for the current issue.

## Goal
Verify the current Soar production deploy health posture without mutating
production and record whether the issue can close or must block on an Ops
mutation owner.

## Scope
- Production API: `https://api.soar.luckysparrow.ch`
- Production Web: `https://soar.luckysparrow.ch`
- Coolify production project read-only projection
- Repository evidence/state files:
  - `history/evidence/luc-6412-coolify-production-deploy-health-sweep-2026-07-01.md`
  - `history/tasks/luc-6412-coolify-production-deploy-health-sweep-2026-07-01-task.md`
  - `.codex/context/TASK_BOARD.md`
  - `.codex/context/PROJECT_STATE.md`
  - `.agents/state/system-health.md`

## Implementation Plan
1. Review Soar deployment gate, post-deploy smoke, and rollback docs.
2. Run public deploy smoke.
3. Run protected deploy smoke.
4. Run runtime freshness with approved env-only smoke-login mapping.
5. Run rollback guard with approved env-only smoke-login mapping.
6. Read Coolify production projection without storing secret values or raw
   objects.
7. Persist evidence and update project state.
8. Update Paperclip issue disposition.

## Acceptance Criteria
- Current API, Web, worker readiness, runtime freshness, rollback guard, and
  Coolify resource state are recorded.
- No production mutation occurs.
- Any blocker names the next owner and exact action.
- Paperclip issue is updated to a clear final disposition.

## Definition of Done
- [x] Read-only production smoke evidence recorded.
- [x] Runtime freshness and rollback guard evidence recorded.
- [x] Coolify resource projection recorded without secrets.
- [x] Source-control closure recorded.
- [x] Residual risk and next owner recorded.

## Forbidden
- Deploy, push, restart, rollback, env edit, credential readback, DB/Redis
  mutation, production account mutation, exchange/payment action, order,
  position, subscription mutation, live-trading action, raw secret/log storage,
  or workaround path.

## Validation Evidence
- Tests:
  - `pnpm run -s ops:deploy:smoke -- --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --no-workers` -> `FAIL` on Web `503`.
  - `pnpm run -s ops:deploy:smoke -- --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch` -> `FAIL` on Web `503` and `/workers/ready 503`.
  - `pnpm run -s ops:deploy:runtime-freshness -- --base-url https://api.soar.luckysparrow.ch --auth-email $env:SMOKE_AUTH_EMAIL` -> `PASS`.
  - `pnpm run -s ops:deploy:rollback-guard -- --base-url https://api.soar.luckysparrow.ch --auth-email $env:SMOKE_AUTH_EMAIL` -> `FAIL`, `shouldRollback=true`, `workers_ready_endpoint_http_503`.
- Manual checks:
  - Coolify read-only projection endpoints returned `200`; `soar-web` and
    `workers-backtest` are `exited:unhealthy`.
- High-risk checks:
  - Secret values were not printed or stored.
  - No production mutation occurred.
- Reality status: blocked

## Deployment / Ops Evidence
- Deploy impact: none
- Env or secret changes: none
- Health-check impact: production Web and worker readiness fail.
- Smoke steps updated: no
- Rollback note: rollback guard requires action; no rollback executed.
- Observability or alerting impact: alerts returned `[]` inside rollback guard.
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- API is reachable, Web and workers readiness are not.
- Current checkout is dirty and divergent, so no push/deploy path is allowed.

### 2. Select One Priority Mission Objective
- Selected LUC-6412 production deploy health sweep because this heartbeat is
  scoped to that critical issue.

### 3. Plan Implementation
- Use existing smoke/freshness/rollback scripts and read-only Coolify API
  projection.

### 4. Execute Implementation
- Ran the bounded read-only checks and persisted evidence.

### 5. Verify and Test
- Verification completed; production health sweep is blocked by Web/worker
  availability.

### 6. Self-Review
- Existing scripts were reused. No workaround, duplicate logic, or runtime
  mutation was introduced.

### 7. Update Documentation and Knowledge
- Evidence, task packet, project state, task board, and system health were
  updated.

## Source-Control Closure
- Application/repo path affected: `C:/Personal/Projekty/Aplikacje/Soar`
- Files changed by this heartbeat:
  - `history/evidence/luc-6412-coolify-production-deploy-health-sweep-2026-07-01.md`
  - `history/tasks/luc-6412-coolify-production-deploy-health-sweep-2026-07-01-task.md`
  - `.codex/context/TASK_BOARD.md`
  - `.codex/context/PROJECT_STATE.md`
  - `.agents/state/system-health.md`
- Commit SHA: not committed; repository was dirty and divergent before this
  heartbeat (`ahead 21`, `behind 3`) with unrelated work.
- Push status: not needed / blocked by dirty divergent worktree for any release
  operation.
- Deploy impact: none; no deploy or restart performed.
- Coolify/resource evidence: `soar-web` and `workers-backtest` are
  `exited:unhealthy`.
- Residual risk: production Web and protected worker readiness remain
  unavailable.
- Next owner: Ops Release Lead / board-approved Coolify mutation owner for
  restart/redeploy or rollback of `soar-web` and `workers-backtest`.

## Result Report
- Task summary: Current production deploy health sweep is blocked by Web
  `503`, workers readiness `503`, and unhealthy Coolify resources.
- Files changed: evidence/task/state docs only.
- How tested: read-only smoke, runtime freshness, rollback guard, Coolify
  projection.
- What is incomplete: restoration itself; DRE lacks mutation approval in this
  heartbeat.
- Next steps: Ops mutation owner resolves [LUC-6331](/LUC/issues/LUC-6331),
  then DRE/QVE rerun production smoke and acceptance.
