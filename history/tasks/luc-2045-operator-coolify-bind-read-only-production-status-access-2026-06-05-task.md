# LUC-2045 Task Contract - Coolify Read-Only Production Status Access

Date: 2026-06-05
Owner: Ops Release Lead
Stage: verification

## Context

[LUC-2045](/LUC/issues/LUC-2045) asked to bind or validate read-only Coolify
production status access for Soar so Paperclip can reconcile production deploy
status after source changes.

## Goal

Verify the Ops runner has read-only Coolify production status access through
bound environment names without exposing secret values or mutating production.

## Scope

- Inspect binding names only for the Coolify API access variables.
- Run authenticated read-only Coolify API reads for project, environments,
  production environment resources, and global resource count.
- Record redacted evidence and update Soar ops state.

## Constraints

- Do not print, persist, screenshot, or commit secret values, raw resource ids,
  database URLs, tokens, cookies, generated database suffixes, or private
  connection strings.
- Do not deploy, restart, rollback, edit environment variables, mutate
  databases, change team settings, run protected smoke, or touch live trading.
- Treat Coolify as `project -> production environment -> resources`; do not use
  a legacy single app id as release authority.

## Definition of Done

- Required Coolify binding names are present without value disclosure.
- Read-only Coolify calls resolve Soar project, production environment, and
  redacted resource inventory.
- Existing Coolify stack env-check tests pass.
- Evidence artifact and source-of-truth state are updated.
- Issue can be marked `done` with no follow-up on this lane.

## Forbidden

- Production-impacting mutation of any kind.
- Secret value disclosure in repo, issue comments, logs, screenshots, or final
  output.
- Commit/push/deploy as part of this proof lane.

## Result Report

Status: verified.

- Runtime binding names present without values: `COOLIFY_BASE_URL`,
  `COOLIFY_API_TOKEN`, `COOLIFY_SOAR_PROJECT_ID`, `COOLIFY_TOKEN`,
  `COOLIFY_SOAR_PRODUCTION_ENVIRONMENT`, `COOLIFY_SOAR_WEB_APP_ID`, and
  `COOLIFY_SOAR_API_APP_ID`.
- Optional team binding names remain absent:
  `COOLIFY_SOAR_TEAM_ID` / `COOLIFY_TEAM_ID`; not a blocker because
  project-scoped readbacks succeeded.
- Coolify readback at `2026-06-04T22:40:46Z` resolved project `Soar`,
  environment `production`, and eight canonical production resources:
  `soar-api`, `soar-web`, `workers-backtest`, `workers-execution`,
  `workers-market-data`, `workers-market-stream`, PostgreSQL, and Redis.
- Application inventory status remains `running:unknown`; PostgreSQL and Redis
  report `running:healthy`.
- `GET /api/v1/resources` returned `17` visible rows and was not used as
  release authority for this checkpoint.
- `pnpm run ops:coolify-stack:env-check:test` passed (`8/8`).
- Wake payload scoped this heartbeat to [LUC-2045](/LUC/issues/LUC-2045),
  status `in_progress`, priority `critical`, with no pending comments and
  `fallbackFetchNeeded=false`.
- No deploy, restart, rollback, env edit, database action, team setting
  change, account action, protected smoke, secret readback, raw resource id
  storage, generated DB suffix storage, or live-trading action occurred.

Evidence:
`history/evidence/luc-2045-coolify-read-only-production-status-access-2026-06-05.md`.

Commit: not committed; this heartbeat made docs/state/evidence updates only and
source-control closure was not requested.
Push status: not needed.
Deploy impact: none.
Residual risk: this proves read-only Coolify status access only; application
readiness, database health beyond inventory status, and protected worker
readiness still require separate release smoke or a release mutation permit
when applicable.
