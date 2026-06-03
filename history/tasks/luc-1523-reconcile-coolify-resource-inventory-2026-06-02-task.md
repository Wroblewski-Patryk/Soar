# Task

## Header
- ID: LUC-1523
- Title: Reconcile Coolify resource inventory
- Task Type: release
- Current Stage: verification
- Status: DONE
- Owner: Ops/Release
- Depends on: none
- Priority: P0
- Module Confidence Rows: operations / production runtime inventory
- Requirement Rows: production deployment inventory truth
- Quality Scenario Rows: deployment readiness, observability
- Risk Rows: Coolify project/resource binding drift
- Iteration: 2026-06-02 Ops heartbeat
- Operation Mode: BUILDER
- Mission ID: SOAR-FULL-READINESS-COORDINATION-2026-05-23
- Mission Status: CHECKPOINTED

## Context
Soar production deployment is modeled as `Coolify project -> production environment -> resources`. The issue asks Ops to refresh the read-only production resource inventory and keep source truth aligned without production mutation.

## Goal
Verify the current Soar Coolify production resource inventory through authenticated read-only API calls and update evidence/source truth without exposing secrets or mutating runtime state.

## Scope
- `history/evidence/luc-1523-coolify-resource-inventory-reconciliation-2026-06-02.md`
- `docs/operations/coolify-vps-deployment-contract.md`
- `docs/operations/service-topology.md`
- `docs/operations/runtime-config-ledger.csv`
- `.agents/state/system-health.md`
- `.agents/state/active-mission.md`
- `.codex/context/PROJECT_STATE.md`
- `.codex/context/TASK_BOARD.md`

## Implementation Plan
1. Consume inline wake payload and avoid duplicate checkout because the harness already claimed it.
2. Verify required Coolify binding names without printing values.
3. Run read-only Coolify API calls for configured project, environments, production environment, and resources.
4. Write redacted evidence and refresh operations source truth.
5. Update issue disposition to `done`.

## Acceptance Criteria
- Required binding names are checked without printing values.
- Configured project resolves to `Soar`.
- Production environment is visible and inventory contains six applications plus PostgreSQL and Redis.
- No deploy, restart, rollback, env, database, team, account, or live trading mutation occurs.
- Evidence path is recorded.

## Definition of Done
- [x] Fresh read-only Coolify API proof captured.
- [x] Operations source truth updated.
- [x] Safety boundary recorded.
- [x] Issue final disposition is ready as `done`.

## Forbidden
- Print secret values, tokens, resource ids, internal URLs, cookies, or credentials.
- Use legacy single app id as the whole deployment.
- Deploy, restart, rollback, edit env, mutate database, change team settings, or touch live trading state.
- Introduce workaround paths or new deployment mechanisms.

## Validation Evidence
- Tests: not applicable; read-only operational inventory task.
- Manual checks: names-only env presence; Paperclip heartbeat context; Coolify project/environment/resource API reads.
- Repository guardrails: `pnpm run quality:guardrails` failed on pre-existing repository guardrails outside this issue scope: architecture graph drift `812/816` covered with `4` missing, plus file-size budget failures in `apps/api/src/modules/bots/bots.e2e.test.ts` and `apps/api/src/modules/positions/livePositionReconciliation.service.test.ts`.
- Screenshots/logs: command output summarized in evidence without secret values.
- High-risk checks: mutation boundary preserved.
- Module confidence ledger updated: not applicable for code confidence; operations docs/state updated.
- Requirements matrix updated: not applicable; deployment inventory source truth updated.
- Quality scenarios updated: not applicable; operations source truth updated.
- Risk register updated: not applicable; risk remains monitored as Coolify binding/resource alias drift.
- Reality status: verified.

## Deployment / Ops Evidence
- Deploy impact: none.
- Env or secret changes: none.
- Health-check impact: none.
- Smoke steps updated: no.
- Rollback note: not applicable because no production mutation occurred.
- Observability or alerting impact: none.
- Staged rollout or feature flag: not applicable.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Existing operations docs already model Soar as a Coolify project/environment/resource hierarchy.
- Prior inventory checkpoints showed eight resources with application inventory status `running:unknown` and data services `running:healthy`.
- Paperclip heartbeat context showed `in_progress`; no new inline comments or first-class blocker were present.

### 2. Select One Priority Mission Objective
- Selected task: LUC-1523 scoped inventory reconciliation.
- Other candidates deferred because wake payload is issue-scoped.

### 3. Plan Implementation
- Use the established read-only API proof path and update only evidence/source-truth surfaces.

### 4. Execute Implementation
- Verified binding-name presence and ran read-only Coolify API calls at `2026-06-02T15:04:07Z`.
- Added redacted evidence packet and updated operational docs/state.

### 5. Verify and Test
- `GET /api/issues/LUC-1523/heartbeat-context` -> pass.
- `GET /api/v1/projects/{configured-project-id}` -> `200`, project `Soar`.
- `GET /api/v1/projects/{configured-project-id}/environments` -> `200`, production present.
- `GET /api/v1/projects/{configured-project-id}/production` -> `200`, `6` applications, `1` PostgreSQL, `1` Redis.
- `GET /api/v1/resources` -> `200`, `17` visible rows.
- `pnpm run quality:guardrails` -> failed on pre-existing repository guardrails outside this issue scope: architecture graph drift `812/816` covered with `4` missing, and file-size budget failures in `apps/api/src/modules/bots/bots.e2e.test.ts` plus `apps/api/src/modules/positions/livePositionReconciliation.service.test.ts`.

### 6. Self-Review
- Existing project/list inventory path was reused.
- No new deployment mechanism, workaround, or duplicated release path was introduced.

### 7. Update Documentation and Knowledge
- Docs updated: operations contract, service topology, runtime config ledger.
- Context updated: active mission, system health, project state, task board.
- Learning journal updated: not applicable; no new recurring pitfall confirmed.

## Result Report
- Task summary: Read-only Coolify inventory still resolves to Soar production with eight resources: `soar-api`, `soar-web`, four workers, PostgreSQL, and Redis.
- Fresh readback timestamp: `2026-06-02T15:04:07Z`.
- Files changed: evidence packet, task packet, operations docs, project state/context.
- How tested: redacted Coolify API reads listed above.
- What is incomplete: application readiness and protected worker readiness remain separate release smoke gates.
- Residual risk: repository guardrails currently fail outside this issue scope and need their own owner before a release commit/push.
- Next steps: verify post-push auto-redeploy resource-by-resource in the separate deploy/smoke lane.
