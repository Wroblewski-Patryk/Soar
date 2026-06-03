# LUC-1626 Coolify Team / Workspace Readback

Date: 2026-06-03T01:10:42Z

Scope: read-only Coolify selector verification for Soar production deployment
confidence.

## Result

Implemented and verified: the current Coolify team/workspace selector is:

- Team/workspace id: `0`
- Team/workspace name: `LuckySparrow`
- Visible teams returned by Coolify API: `2`

Under this selector, project-scoped reads resolved:

- Project id: `5`
- Project name: `Soar`
- Environment name: `production`
- Environment id: `6`
- Production environment inventory: `6` applications, `1` PostgreSQL resource,
  `1` Redis resource

Fresh read-only readback at `2026-06-03T01:10:42Z` matched the same selector,
project, environment, and resource counts.

## Binding State

Bindings present by name without values printed:

- `COOLIFY_BASE_URL`
- `COOLIFY_API_TOKEN`
- `COOLIFY_TOKEN`
- `COOLIFY_SOAR_PROJECT_ID`
- `COOLIFY_SOAR_PRODUCTION_ENVIRONMENT`

Bindings absent in this runner:

- `COOLIFY_SOAR_TEAM_ID`
- `COOLIFY_TEAM_ID`

The absent explicit team-id bindings are not an active blocker for read-only
status reconciliation while `/api/v1/teams/current` and project-scoped reads
continue to resolve the expected selector and Soar production environment.

## Safety Boundary

No deploy, restart, rollback, environment edit, database action, team setting
change, account action, secret readback, or live-trading action was performed.
No secret values were printed or stored.
