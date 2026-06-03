# LUC-1658 Coolify Team/Workspace Confirmation Evidence

Date: 2026-06-03
Owner: Ops Release Lead
Scope: confirm expected Coolify team/workspace selector for Soar production

## Result

Status: verified.

At `2026-06-03T04:08:34Z`, authenticated read-only Coolify API calls confirmed
the expected Soar Coolify selector:

- Current selector id: `0`
- Current selector name: `LuckySparrow`
- Visible teams from `/api/v1/teams`: `2`
- Configured project readback: `Soar`
- Configured production environment: `production`
- Production environment id: `6`
- Production environment resource shape: six applications, one PostgreSQL
  resource, one Redis resource, zero generic services

`COOLIFY_SOAR_TEAM_ID` and `COOLIFY_TEAM_ID` are not present in this runner.
This is not an active blocker for this checkpoint because
`GET /api/v1/teams/current` and project-scoped readbacks resolve the expected
Soar project and production environment under selector `0` / `LuckySparrow`.

## Commands / Checks

- `GET /api/issues/LUC-1658/heartbeat-context` -> pass; issue read back as
  `LUC-1658`, status `in_progress`, priority `high`, zero first-class blockers.
- Names-only env presence check -> pass without printing values:
  `COOLIFY_BASE_URL`, `COOLIFY_API_TOKEN`, `COOLIFY_TOKEN`,
  `COOLIFY_SOAR_PROJECT_ID`, and `COOLIFY_SOAR_PRODUCTION_ENVIRONMENT` present;
  `COOLIFY_SOAR_TEAM_ID` and `COOLIFY_TEAM_ID` absent.
- `GET /api/v1/teams/current` -> pass; id `0`, name `LuckySparrow`.
- `GET /api/v1/teams` -> pass, two visible teams.
- `GET /api/v1/projects/{configured-project-id}` -> pass, project `Soar`.
- `GET /api/v1/projects/{configured-project-id}/production` -> pass;
  environment `production` id `6`, six applications, one PostgreSQL resource,
  one Redis resource, zero generic services.
- Production application names observed in the environment readback:
  `workers-backtest`, `soar-web`, `workers-market-stream`,
  `workers-execution`, `workers-market-data`, and `soar-api`.

## Safety Boundary

No deploy, restart, rollback, environment edit, database action, team setting
change, account action, live-trading action, or secret readback was performed.
No token, credential, resource UUID, cookie, internal URL, or account secret
value was printed or stored.

## Result

The expected Coolify team/workspace selector is confirmed for this checkpoint.
Safe next Ops action, when assigned separately, is to run the Coolify resource
reconciler against selector `0` / `LuckySparrow` and compare discovered
resources against the current Soar topology.
