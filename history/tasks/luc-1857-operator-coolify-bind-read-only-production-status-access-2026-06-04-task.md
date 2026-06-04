# LUC-1857 Operator Coolify Bind Read-Only Production Status Access

- ID: `LUC-1857`
- Date: 2026-06-04
- Stage: verification
- Owner: Ops Release Lead
- Issue: [LUC-1857](/LUC/issues/LUC-1857)

## Context

Paperclip assigned an Ops heartbeat to bind or validate Coolify read-only
production status access for Soar. The issue requested `COOLIFY_BASE_URL`,
`COOLIFY_API_TOKEN`, `COOLIFY_SOAR_PROJECT_ID`, and preferably team selector
metadata through approved secret/env bindings.

## Goal

Verify that the current runner can read Soar Coolify production status using
least-privilege read-only API calls and record redacted evidence for deployment
status reconciliation.

## Scope

- Validate binding names without printing values.
- Read Coolify current team, project, environments, production environment, and
  resources list.
- Record only safe resource names, types, counts, statuses, and public-FQDN
  booleans.
- Update source-of-truth operations docs and project context.

## Constraints

- Do not deploy, restart, rollback, mutate env, mutate database, change team
  settings, run protected smoke, or perform account/live-trading actions.
- Do not store secret values, raw resource ids, generated database suffixes,
  cookies, tokens, screenshots, or protected payloads.
- Do not use legacy `COOLIFY_SOAR_APP_ID` as deployment authority.

## Definition Of Done

- Coolify read-only status access succeeds for configured Soar project scope.
- Canonical production inventory is recorded without sensitive values.
- Relevant source-of-truth docs/context are updated.
- Minimal validation command passes.
- Paperclip issue is closed with clear deployment impact and residual risk.

## Forbidden

- Production-impacting operations.
- Secret value readback or persistence.
- Raw resource id or generated database suffix persistence.
- Treating a single app id as the whole Soar deployment.

## Result Report

Status: done.

At `2026-06-03T23:10:12Z`, read-only Coolify API calls verified current selector
`LuckySparrow`, project `Soar`, production environment `production`, six
applications, PostgreSQL, Redis, zero generic services, and `17` global
resource rows. Canonical production inventory remains eight resources:
`soar-api`, `soar-web`, `workers-backtest`, `workers-execution`,
`workers-market-data`, `workers-market-stream`, `postgresql`, and `redis`.

Application rows report `running:unknown`; PostgreSQL and Redis report
`running:healthy`. Team id binding remains absent but is not an active blocker
while current-team and project-scoped reads succeed.

Validation:

- `pnpm run ops:coolify-stack:env-check:test` - PASS (`8/8`).

Deployment impact: none. No deploy, restart, rollback, env edit, database
action, team setting change, account action, protected smoke, secret value
readback, raw resource id storage, generated DB suffix storage, or live-trading
action occurred.

Evidence:

- `history/evidence/luc-1857-coolify-read-only-production-status-access-2026-06-04.md`
