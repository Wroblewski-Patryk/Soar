# Task Contract - LUC-1594 Confirm Coolify Team Workspace

## Context

- Issue: `LUC-1594` `[Operator][Coolify] Confirm expected Coolify team/workspace`
- Project: Soar
- Goal: Soar production deploy confidence
- Stage: verification
- Owner lane: Ops Release Lead
- Affected layer: Coolify/VPS production target configuration
- Risk rows: wrong Coolify team/workspace could inspect or mutate the wrong project

`LUC-1594` asks Ops to confirm the expected Coolify team/workspace selector so
future Soar production resource checks do not accidentally trust the wrong
Coolify workspace context.

## Goal

Confirm and record the expected Coolify team/workspace selector for Soar without
exposing secret values or mutating Coolify.

## Constraints

- Read-only Coolify API calls only.
- Do not print, persist, or comment secret values.
- Do not deploy, restart, rollback, edit env, mutate database state, change team
  settings, touch accounts, or mutate live-trading state.
- Keep the source-of-truth update narrow.

## Definition of Done

- [x] Expected team/workspace selector is named by id and name.
- [x] Current Coolify selector is verified by read-only API.
- [x] Soar project and production environment visibility are verified under that
  selector.
- [x] Evidence is stored without secret values.
- [x] Ops source-of-truth files are updated.
- [x] Issue can be marked `done`.

## Forbidden

- Production mutation.
- Secret value disclosure.
- Raw Coolify environment payload storage.
- Assuming a single legacy application id represents the whole Soar deployment.

## Implementation Plan

1. Read Paperclip heartbeat context for `LUC-1594`.
2. Check Coolify binding names only.
3. Run read-only Coolify API probes for current team, configured Soar project,
   production environment, and redacted production inventory.
4. Update evidence and operations source truth.
5. Close the Paperclip issue with proof and residual risk.

## Acceptance Criteria

- `GET /api/v1/teams/current` returns id `0`, name `LuckySparrow`.
- `GET /api/v1/projects/{configured-project-id}` resolves to `Soar`.
- `GET /api/v1/projects/{configured-project-id}/production` returns the
  production environment under the same selector.
- Redacted production resource inventory is captured without storing secret
  values.
- No production mutation occurs.

## Result Report

- Task summary: confirmed expected Coolify team/workspace selector id `0`, name
  `LuckySparrow`, and verified Soar production visibility under that selector.
- Verification:
  - `GET /api/issues/LUC-1594/heartbeat-context` -> pass.
  - names-only Coolify env binding check -> pass without storing token values.
  - `GET /api/v1/teams/current` -> pass at `2026-06-02T20:55:41Z`.
  - `GET /api/v1/projects/{configured-project-id}` -> pass, project `Soar`.
  - `GET /api/v1/projects/{configured-project-id}/production` -> pass,
    environment id `6`.
  - `GET /api/v1/resources` -> pass, nine Soar-relevant resource rows in this
    readback: six applications, Redis, `postgresql`, and
    `postgresql-database-w5gql24ddjrgjaid7110rcqo`.
- Env or secret changes: none; `COOLIFY_SOAR_TEAM_ID` / `COOLIFY_TEAM_ID`
  remain absent, and the non-secret selector is recorded as id `0`, name
  `LuckySparrow`.
- Deployment impact: none; no deploy, restart, rollback, env edit, database
  action, team setting change, account action, or live-trading action.
- Evidence: `history/evidence/luc-1594-coolify-team-workspace-confirmation-2026-06-02.md`.
- Residual risk: explicit team-id env binding remains absent; future automation
  may bind `COOLIFY_SOAR_TEAM_ID=0` or `COOLIFY_TEAM_ID=0` as an additional
  non-secret guard.
