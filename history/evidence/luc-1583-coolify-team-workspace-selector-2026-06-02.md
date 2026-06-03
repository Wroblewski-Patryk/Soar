# LUC-1583 Coolify Team/Workspace Selector Evidence

Captured: 2026-06-02T19:09:11Z

## Scope

Read-only verification of the expected Coolify team/workspace selector for the
Soar production project.

## Secret Handling

- Secret values were not printed, stored, screenshotted, or committed.
- Environment bindings were checked by presence/name only.
- Coolify API output was projected to an explicit allowlist before recording.

## Read-Only Checks

| Check | Result |
| --- | --- |
| `COOLIFY_BASE_URL` present by name | pass |
| `COOLIFY_API_TOKEN` present by name | pass |
| `COOLIFY_TOKEN` present by name | pass |
| `COOLIFY_SOAR_PROJECT_ID` present by name | pass |
| `COOLIFY_SOAR_PRODUCTION_ENVIRONMENT` present by name | pass |
| `COOLIFY_TEAM_ID` / `COOLIFY_SOAR_TEAM_ID` present | absent |
| `GET /api/v1/teams` | pass, 2 teams visible |
| `GET /api/v1/teams/current` | pass, id `0`, name `LuckySparrow` |
| configured project read | pass, project `Soar` |
| production environment read | pass, environment `production`, id `6` |
| production resource projection | pass, 6 applications, 1 PostgreSQL, 1 Redis |
| global resource list | pass, 17 visible rows |

## Status Projection

| Resource class | Projection |
| --- | --- |
| Applications | `running:unknown` x 6 |
| PostgreSQL | `running:healthy` x 1 |
| Redis | `running:healthy` x 1 |

## Boundary

No deploy, restart, rollback, environment edit, database action, team setting
change, account action, or live-trading action was performed.

## Result

The expected Coolify selector is verified as team/workspace id `0`, name
`LuckySparrow`. The configured Soar project and production environment resolve
under that selector. Missing `COOLIFY_TEAM_ID` and `COOLIFY_SOAR_TEAM_ID`
bindings are not an active blocker while current-team and project-scoped reads
succeed, but future explicit selector pinning should use id `0`.

Residual risk: application rows still report `running:unknown` at the inventory
layer. Application health remains a separate release-smoke requirement, not a
team/workspace selector blocker.
