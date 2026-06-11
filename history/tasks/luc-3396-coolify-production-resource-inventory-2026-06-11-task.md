# Task

## Header
- ID: LUC-3396
- Title: Coolify Production Resource Inventory
- Task Type: release
- Current Stage: verification
- Status: DONE
- Owner: Ops/Release
- Depends on: [LUC-3390](/LUC/issues/LUC-3390)
- Priority: P0
- Module Confidence Rows: operations/deploy confidence
- Requirement Rows: REQ-FUNC-021
- Quality Scenario Rows: QA-021, QA-039
- Risk Rows: production deploy confidence, Coolify resource ambiguity
- Iteration: 2026-06-11 DRE heartbeat
- Operation Mode: BUILDER
- Mission ID: LUC-3396
- Mission Status: VERIFIED

## Context

[LUC-3396](/LUC/issues/LUC-3396) was assigned after
[LUC-3390](/LUC/issues/LUC-3390) bound read-only Coolify production status
access. The task is a narrow DRE release/deploy gate checkpoint.

## Goal

Use read-only Coolify access to inventory the Soar production project,
environment, applications, Postgres, and Redis, then record redacted deploy and
health evidence.

## Scope

- Coolify API read-only endpoints for team selector, project, environments,
  production resources, global resources, deployments, app logs, and app
  deployment history.
- Repository evidence/state files only:
  - `history/evidence/luc-3396-coolify-production-resource-inventory-2026-06-11.md`
  - `history/tasks/luc-3396-coolify-production-resource-inventory-2026-06-11-task.md`
  - `.agents/state/system-health.md`
  - `.codex/context/PROJECT_STATE.md`
  - `.codex/context/TASK_BOARD.md`

## Implementation Plan

1. Read scoped Paperclip issue context.
2. Confirm Coolify binding names are present without printing values.
3. Query only Coolify `GET` endpoints.
4. Store redacted resource names, types, statuses, counts, and aggregate log
   metadata.
5. Update Soar state and close the Paperclip issue with evidence.

## Acceptance Criteria

- Coolify team/workspace, project, environment, and production resource list are
  identified without exposing secrets.
- Per-resource status/deploy metadata is recorded.
- The issue states that no mutation occurred.
- Residual risks and remaining gates are explicit.

## Definition of Done

- [x] Read-only Coolify API calls succeeded.
- [x] Redacted evidence file written.
- [x] Source-of-truth state updated.
- [x] Paperclip issue disposition can be set to `done`.

## Forbidden

- Deploy, restart, rebuild, rollback, env mutation, database mutation, Redis
  mutation, secret mutation, account mutation, protected smoke, or raw log dump.
- Printing or storing token values, cookies, credentials, raw resource ids, or
  internal URLs.

## Validation Evidence

- Tests: not run; this was read-only runtime inventory, not code change.
- Manual checks: authenticated Coolify API `GET` readback at
  `2026-06-11T02:50:14Z` and per-app log/deployment metadata readback at
  `2026-06-11T02:50:40Z`.
- Screenshots/logs: no screenshots; log bodies intentionally not stored.
- High-risk checks: mutation boundary preserved; only `GET` calls used.
- Reality status: verified.

## Deployment / Ops Evidence

- Deploy impact: none.
- Env or secret changes: none.
- Health-check impact: none.
- Smoke steps updated: no.
- Rollback note: no rollback required because no production state changed.
- Observability or alerting impact: none.
- Staged rollout or feature flag: not applicable.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issue context has no pending comments and no blockers.
- Parent [LUC-3390](/LUC/issues/LUC-3390) is done.
- Existing state treats Coolify as `project -> production environment -> resources`.

### 2. Select One Priority Mission Objective
- Selected [LUC-3396](/LUC/issues/LUC-3396) because it was the scoped wake issue.

### 3. Plan Implementation
- Use only read-only Coolify API calls and redacted state updates.

### 4. Execute Implementation
- Confirmed runtime binding names.
- Queried Coolify project, production environment, resources, deployments, app
  log endpoints, and app deployment history endpoints.

### 5. Verify and Test
- Verified all Coolify readback calls succeeded.
- Verified no mutation endpoints were used.

### 6. Self-Review
- Existing resource hierarchy was reused.
- No workaround path, duplicate deploy model, or production mutation was
  introduced.

### 7. Update Documentation and Knowledge
- Updated evidence, task, system health, project state, and task board.
- Learning journal update: not applicable; no recurring pitfall discovered.

## Result Report

- Task summary: Soar production Coolify inventory verified through read-only API
  access.
- Files changed: this task/evidence file plus narrow state entries.
- How tested: authenticated read-only Coolify API checks; no code test required.
- What is incomplete: app readiness, protected smoke, worker readiness, rollback,
  restore, SLO, and release approval remain separate gates.
- Next steps: PM/Delivery/QA/Ops should use this inventory as the current
  resource list for subsequent release confidence gates.
- Decisions made: raw resource ids and log bodies were treated as
  secret-adjacent and not stored.
