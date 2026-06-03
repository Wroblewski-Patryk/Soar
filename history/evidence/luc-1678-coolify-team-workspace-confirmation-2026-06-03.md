# LUC-1678 Coolify Team/Workspace Confirmation Evidence

Checked at: `2026-06-03T05:38:12Z`

## Summary

- Status: verified.
- Current Coolify selector from `/api/v1/teams/current`: id `0`, name `LuckySparrow`.
- Visible teams from `/api/v1/teams`: `2`.
- Configured project lookup: resolves to project `Soar`.
- Production environment lookup: resolves to environment `production`, id `6`.
- Production environment rows returned: `6` applications, `1` PostgreSQL, `1` Redis, `0` generic services.

## Binding Check

- Present by name without value disclosure:
  `COOLIFY_BASE_URL`, `COOLIFY_API_TOKEN`, `COOLIFY_TOKEN`,
  `COOLIFY_SOAR_PROJECT_ID`, `COOLIFY_SOAR_PRODUCTION_ENVIRONMENT`,
  `COOLIFY_SOAR_API_APP_ID`, and `COOLIFY_SOAR_WEB_APP_ID`.
- Absent by name: `COOLIFY_SOAR_TEAM_ID`, `COOLIFY_TEAM_ID`.
- The absent explicit team-id bindings are not an active blocker while
  `GET /api/v1/teams/current` and project-scoped readbacks resolve the expected
  selector.

## Read-Only Checks

- `GET /api/issues/LUC-1678/heartbeat-context` -> pass; issue read back as
  `blocked`, priority `high`, zero first-class blockers.
- `GET /api/v1/teams/current` -> pass; id `0`, name `LuckySparrow`.
- `GET /api/v1/teams` -> pass; two visible teams.
- `GET /api/v1/projects/{configured-project-id}` -> pass; project `Soar`.
- `GET /api/v1/projects/{configured-project-id}/production` -> pass;
  environment `production`, id `6`, six application rows, one PostgreSQL row,
  one Redis row, and zero generic service rows.

## Production Safety

No deploy, restart, rollback, environment edit, database action, team setting
change, account action, live-trading action, or secret readback was performed.

## Residual Risk

This evidence confirms the team/workspace selector and project/environment
scope only. It does not claim application readiness, protected smoke coverage,
SLO status, or deploy mutation readiness.
