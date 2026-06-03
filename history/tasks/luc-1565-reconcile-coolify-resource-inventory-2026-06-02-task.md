# LUC-1565 Reconcile Coolify Resource Inventory - 2026-06-02

## Header

- ID: LUC-1565
- Title: Reconcile Coolify resource inventory
- Task Type: operations
- Current Stage: verification
- Status: DONE
- Owner: Ops Release Lead
- Priority: critical
- Module Confidence Rows: SOAR-OPERATIONS
- Operation Mode: BUILDER

## Context

Soar production deploy verification must treat Coolify as
`project -> production environment -> resources`, not as one legacy
application id. The issue asked for a read-only resource inventory suitable for
resource-by-resource release verification.

## Goal

Use read-only Coolify access to reconcile the Soar production resource list and
record redacted evidence without exposing secrets or mutating production.

## Constraints

- No deploy, restart, rollback, env edit, database mutation, team setting
  change, account action, or live trading action.
- Do not print or store secret values.
- Use project/environment inventory rather than legacy single-resource aliases.

## Definition Of Done

- [x] Coolify bindings checked by name only.
- [x] Current Coolify team/workspace selector verified.
- [x] Configured project resolves to `Soar`.
- [x] Production environment inventory returns six applications plus
  PostgreSQL and Redis.
- [x] Redacted evidence stored in history and operations source truth updated.
- [x] Paperclip issue disposition updated with verification summary.

## Forbidden

- Recording Coolify tokens, environment values, database URLs, cookies, account
  data, or resource ids in repo files or issue comments.
- Treating inventory status as endpoint/worker readiness proof.
- Using production mutation endpoints.

## Verification Evidence

- `GET /api/v1/teams/current` -> pass; current selector id `0`, name
  `LuckySparrow`.
- `GET /api/v1/projects/{configured-project-id}` -> pass; project `Soar`.
- `GET /api/v1/projects/{configured-project-id}/environments` -> pass; one
  environment returned.
- `GET /api/v1/projects/{configured-project-id}/production` -> pass; six
  applications, one PostgreSQL, one Redis.
- `GET /api/v1/resources` -> pass; `17` visible rows.

## Result Report

Read-only Coolify inventory remains stable for Soar production: `soar-api`,
`soar-web`, `workers-backtest`, `workers-execution`, `workers-market-data`,
`workers-market-stream`, `postgresql`, and `redis`. Application inventory rows
report `running:unknown`; PostgreSQL and Redis report `running:healthy`.
Release gates must still run API/Web/protected worker readiness checks after
any deploy.

Evidence file:
`history/evidence/luc-1565-coolify-resource-inventory-reconciliation-2026-06-02.md`.
