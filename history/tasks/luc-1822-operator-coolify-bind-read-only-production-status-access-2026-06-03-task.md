# LUC-1822 Operator Coolify Read-Only Production Status Access

## Header

- ID: `LUC-1822`
- Title: `[Operator][Coolify] Bind Coolify read-only production status access`
- Task Type: release
- Current Stage: verification
- Status: DONE
- Owner: Ops/Release
- Depends on: none
- Priority: P0
- Module Confidence Rows: operations / deployment status access
- Requirement Rows: production deploy confidence / Coolify read-only status access
- Quality Scenario Rows: release observability, deploy safety
- Risk Rows: credential exposure, production mutation, stale deployment target
- Iteration: 2026-06-03 heartbeat
- Operation Mode: BUILDER
- Mission ID: `LUC-1822-COOLIFY-READ-ONLY-PRODUCTION-STATUS-ACCESS-2026-06-03`
- Mission Status: VERIFIED

## Context

Paperclip assigned [LUC-1822](/LUC/issues/LUC-1822) to Ops Release Lead to bind
or validate Coolify base URL/API token/project id access for read-only Soar
production deploy status reconciliation.

## Goal

Verify that the runner has least-privilege read-only Coolify production status
access for Soar without exposing secrets or mutating production.

## Scope

- Paperclip issue context for [LUC-1822](/LUC/issues/LUC-1822).
- Runtime binding names only: `COOLIFY_BASE_URL`, `COOLIFY_API_TOKEN`,
  `COOLIFY_SOAR_PROJECT_ID`, optional `COOLIFY_TOKEN`,
  `COOLIFY_SOAR_PRODUCTION_ENVIRONMENT`, `COOLIFY_SOAR_WEB_APP_ID`,
  `COOLIFY_SOAR_API_APP_ID`, `COOLIFY_SOAR_TEAM_ID`, and `COOLIFY_TEAM_ID`.
- Read-only Coolify API routes:
  - `GET /api/v1/teams/current`
  - `GET /api/v1/teams`
  - `GET /api/v1/projects/{configured-project-id}`
  - `GET /api/v1/projects/{configured-project-id}/environments`
  - `GET /api/v1/projects/{configured-project-id}/production`
  - `GET /api/v1/resources`
- Evidence and source-of-truth docs only.

## Implementation Plan

1. Read issue heartbeat context and Ops safety contracts.
2. Confirm required Coolify binding names are present without printing values.
3. Run read-only Coolify API probes for team selector, project, environment,
   and resource inventory.
4. Run the focused Coolify stack env-check regression test.
5. Record redacted evidence and update issue disposition.

## Acceptance Criteria

- Required binding names are present with no value disclosure.
- Read-only Coolify API resolves selector `LuckySparrow`, project `Soar`, and
  production environment `production`.
- Production inventory is recorded as counts/status summaries only.
- No production mutation or secret disclosure occurs.
- Issue closes with evidence and residual release boundaries.

## Definition of Done

- [x] Required Coolify read-only status access names verified.
- [x] Soar production project/environment/resource readback verified.
- [x] Focused regression test passed.
- [x] Evidence file written.
- [x] Issue updated to `done`.

## Forbidden

- Print secret values, cookies, tokens, database URLs, raw resource IDs, or
  generated database suffixes.
- Deploy, restart, rollback, edit environment variables, mutate team settings,
  touch databases, mutate accounts, run protected smoke, or perform live-trading
  actions.
- Treat any single legacy app id as release authority for the whole deployment.

## Validation Evidence

- Tests:
  - `pnpm run ops:coolify-stack:env-check:test` - PASS, `8/8`.
- Manual checks:
  - Names-only binding scan - PASS.
  - `GET /api/v1/teams/current` - PASS, selector name `LuckySparrow`.
  - `GET /api/v1/teams` - PASS, two teams visible.
  - `GET /api/v1/projects/{configured-project-id}` - PASS, project `Soar`.
  - `GET /api/v1/projects/{configured-project-id}/environments` - PASS,
    `production` present.
  - `GET /api/v1/projects/{configured-project-id}/production` - PASS, six
    applications, PostgreSQL, Redis, zero generic services.
  - `GET /api/v1/resources` - PASS, `17` visible rows.
- High-risk checks:
  - Secret handling: values redacted; only names/counts/status summaries
    recorded.
  - Deployment impact: none.
- Reality status: verified.

## Deployment / Ops Evidence

- Deploy impact: none.
- Env or secret changes: none performed; runtime names verified only.
- Health-check impact: none.
- Smoke steps updated: none; protected smoke remains separate.
- Rollback note: any deploy/restart/rollback still requires a separate release
  mutation permit.
- Observability or alerting impact: Coolify read-only project/environment
  reconciliation is available for Ops status checks.
- Staged rollout or feature flag: not applicable.

## Autonomous Loop Evidence

### 1. Analyze Current State

- [LUC-1822](/LUC/issues/LUC-1822) was `in_progress`, critical, and had zero
  first-class blockers.
- Active mission already contained prior Coolify read-only checkpoints
  [LUC-1786](/LUC/issues/LUC-1786) and [LUC-1800](/LUC/issues/LUC-1800).

### 2. Select One Priority Mission Objective

- Selected task: verify [LUC-1822](/LUC/issues/LUC-1822) read-only production
  status access.
- Other work deferred because scoped wake required this issue only.

### 3. Plan Implementation

- Use existing Coolify API and existing env-check regression test.
- Record evidence in existing history/source-of-truth format.

### 4. Execute Implementation

- Performed names-only runtime binding scan and read-only Coolify GET probes.
- Wrote issue-specific evidence and task result report.

### 5. Verify and Test

- `pnpm run ops:coolify-stack:env-check:test` passed.
- Read-only Coolify API proof passed.

### 6. Self-Review

- Architecture alignment: yes; Coolify remains modeled as
  `project -> production environment -> resources`.
- Existing systems reused: yes; existing Coolify contracts and env-check tests.
- Workarounds introduced: no.
- Logic duplication introduced: no runtime logic change.

### 7. Update Documentation and Knowledge

- Docs updated:
  - `history/evidence/luc-1822-coolify-read-only-production-status-access-2026-06-03.md`
  - `history/tasks/luc-1822-operator-coolify-bind-read-only-production-status-access-2026-06-03-task.md`
  - `.agents/state/active-mission.md`
  - `.codex/context/PROJECT_STATE.md`
  - `.codex/context/TASK_BOARD.md`
  - `docs/operations/coolify-vps-deployment-contract.md`
- Learning journal updated: not applicable; no recurring pitfall confirmed.

## Result Report

- Task summary: verified [LUC-1822](/LUC/issues/LUC-1822) Coolify read-only
  production status access for Soar.
- Files changed: evidence, task contract, mission/context/task board, operations
  deployment contract.
- How tested: focused env-check regression and redacted Coolify read-only GET
  probes.
- What is incomplete: application readiness and protected worker readiness are
  separate release smoke requirements.
- Next steps: use this access only for read-only status/log/deploy
  reconciliation; request a separate release mutation permit for any deploy,
  restart, rollback, or env/database action.
- Decisions made: optional team id binding remains absent but is not an active
  blocker while project-scoped reads succeed under selector `LuckySparrow`.
