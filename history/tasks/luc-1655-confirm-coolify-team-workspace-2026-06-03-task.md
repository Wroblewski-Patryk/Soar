# Task

## Header
- ID: LUC-1655
- Title: Confirm expected Coolify team/workspace
- Task Type: release
- Current Stage: verification
- Status: DONE
- Owner: Ops/Release
- Depends on: none
- Priority: P1
- Module Confidence Rows: operations / production deploy confidence
- Requirement Rows: not applicable
- Quality Scenario Rows: release/deploy gate
- Risk Rows: wrong Coolify team/workspace selector
- Iteration: 2026-06-03 Ops heartbeat
- Operation Mode: BUILDER
- Mission ID: LUC-1655-COOLIFY-TEAM-WORKSPACE-CONFIRMATION-2026-06-03
- Mission Status: VERIFIED

## Context
Soar production deploy confidence requires the active Coolify selector to be
known before resource status can be trusted. Wrong team/workspace context could
make Paperclip inspect or mutate the wrong project.

## Goal
Confirm the expected Coolify team/workspace selector for Soar production through
read-only API evidence and record the result without exposing secrets.

## Constraints
- Use only read-only Coolify API calls.
- Do not print or persist secret values.
- Do not mutate Coolify teams, settings, resources, deployments, env vars, or
  database state.
- Treat Coolify as `project -> production environment -> resources`, not as a
  legacy single app id.

## Scope
- Paperclip issue context: `LUC-1655`
- Coolify read-only endpoints:
  - `/api/v1/teams/current`
  - `/api/v1/teams`
  - `/api/v1/projects/{configured-project-id}`
  - `/api/v1/projects/{configured-project-id}/production`
- Documentation/evidence:
  - `history/evidence/luc-1655-coolify-team-workspace-confirmation-2026-06-03.md`
  - `.codex/context/PROJECT_STATE.md`
  - `.codex/context/TASK_BOARD.md`

## Implementation Plan
1. Read Paperclip heartbeat context for `LUC-1655`.
2. Confirm required Coolify binding names are present without printing values.
3. Perform authenticated read-only Coolify API calls.
4. Record the selector and project/environment proof in source-of-truth docs.
5. Close the issue with evidence and no deploy impact.

## Acceptance Criteria
- Current Coolify selector id and name are known.
- Configured Soar project resolves under that selector.
- Production environment resolves under that selector.
- Secret values are not printed or stored.
- No production mutation is performed.

## Definition of Done
- [x] Selector verified by read-only Coolify API.
- [x] Project/environment readback verified.
- [x] Evidence file written.
- [x] Project context updated.
- [x] Paperclip issue disposition updated to `done`.

## Validation Evidence
- Tests: not applicable; read-only Ops verification.
- Manual/API checks:
  - `GET /api/issues/LUC-1655/heartbeat-context` -> pass; issue read back as
    `in_progress` with zero first-class blockers.
  - Names-only env presence check -> pass.
  - `GET /api/v1/teams/current` -> pass at `2026-06-03T04:03:57Z`, selector
    id `0`, name `LuckySparrow`.
  - `GET /api/v1/teams` -> pass, two visible teams.
  - `GET /api/v1/projects/{configured-project-id}` -> pass, project `Soar`.
  - `GET /api/v1/projects/{configured-project-id}/production` -> pass,
    environment `production` id `6`, six applications, PostgreSQL, Redis.
- Reality status: verified.

## Deployment / Ops Evidence
- Deploy impact: none.
- Env or secret changes: none.
- Health-check impact: none.
- Smoke steps updated: no; this is selector confirmation only.
- Rollback note: not applicable because no mutation occurred.
- Observability or alerting impact: none.
- Staged rollout or feature flag: not applicable.

## Forbidden
- Printing secret values.
- Mutating Coolify team/workspace, project, resources, env vars, database, or
  deployment queue.
- Treating a legacy single app id as the whole deployment.

## Result Report
- Task summary: confirmed expected Coolify selector `0` / `LuckySparrow` for
  Soar production and recorded it as non-secret config truth.
- Files changed: evidence, task packet, project context.
- How tested: read-only Coolify API calls and names-only env presence check.
- What is incomplete: explicit `COOLIFY_SOAR_TEAM_ID` or `COOLIFY_TEAM_ID`
  binding is still absent, but not a blocker while current-team and
  project-scoped reads succeed.
- Next steps: separate resource-reconciliation issue can rerun inventory under
  this selector.
