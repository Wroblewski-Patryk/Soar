# LUC-1700 Coolify Read-Only Production Status Access Evidence

Date: 2026-06-03
Owner: Soar Project Manager / Ops coordination lane
Scope: bind and verify read-only Coolify production status access for Soar

## Result

Status: verified.

At `2026-06-03T06:34:28Z`, authenticated read-only Coolify API calls confirmed
that the current runner can access the configured Soar production status scope.
The binding resolves the current Coolify team/workspace selector, configured
project, production environment, and redacted production resource inventory.

## Wake Context

- Issue: `LUC-1700`
- Wake reason: `issue_assigned`
- Latest comment id: `7c18c09d-3847-43b6-8179-bbe03e0203c2`
- Latest comment summary: `softwarehouse-local-repair-lane-starter:v1`
  selected an autonomous local repair/source-control lane and allowed local
  repository inspection, validation, and a local commit if evidence supported
  closure.
- Fallback fetch needed: `no`
- Checkout: already claimed by the harness; no duplicate checkout was called.

## Safety Boundary

- No secret values, token values, cookies, database URLs, exchange credentials,
  screenshots, full raw resource ids, or internal connection URLs were printed
  or stored.
- No deploy, restart, rollback, environment edit, database action, team setting
  change, account mutation, live-trading mutation, protected smoke, or secret
  readback was performed.
- Legacy direct app id aliases were not used as release authority. The verified
  status path remains `project -> production environment -> resources`.

## Commands And Checks

| Check | Result |
| --- | --- |
| Paperclip heartbeat context `GET /api/issues/LUC-1700/heartbeat-context` | pass; issue `LUC-1700` read back as `in_progress`, priority `critical`, zero first-class blockers |
| Names-only Paperclip and Coolify binding check | pass; required binding names present without values printed |
| Coolify current team `GET /api/v1/teams/current` | pass; selector id `0`, name `LuckySparrow` |
| Coolify team list `GET /api/v1/teams` | pass; two teams visible |
| Coolify project read `GET /api/v1/projects/{configured-project-id}` | pass; resolves to project `Soar` |
| Coolify environments read `GET /api/v1/projects/{configured-project-id}/environments` | pass; single environment `production` present |
| Coolify production environment read `GET /api/v1/projects/{configured-project-id}/production` | pass; six applications, one PostgreSQL resource, one Redis resource, zero generic services |
| Coolify resources list `GET /api/v1/resources` | pass; `17` visible rows; allowlisted Soar projection includes the six applications, PostgreSQL, Redis, and the known redacted PostgreSQL companion row |

## Binding Status

- Present by name: `PAPERCLIP_API_URL`, `PAPERCLIP_API_KEY`,
  `PAPERCLIP_RUN_ID`, `PAPERCLIP_AGENT_ID`, `PAPERCLIP_COMPANY_ID`,
  `COOLIFY_BASE_URL`, `COOLIFY_API_TOKEN`, `COOLIFY_TOKEN`,
  `COOLIFY_SOAR_PROJECT_ID`, `COOLIFY_SOAR_PRODUCTION_ENVIRONMENT`,
  `COOLIFY_SOAR_WEB_APP_ID`, and `COOLIFY_SOAR_API_APP_ID`.
- Optional team binding absent in this runner: `COOLIFY_SOAR_TEAM_ID` /
  `COOLIFY_TEAM_ID`.
- Team binding absence is not an active blocker for this issue because
  `GET /api/v1/teams/current` and project-scoped readbacks succeeded under
  selector id `0`, name `LuckySparrow`.

## Redacted Production Environment Inventory

| Resource | Coolify type | Inventory status | Public FQDN | Restart count |
| --- | --- | --- | --- | --- |
| `workers-backtest` | application | `running:unknown` | no | `0` |
| `soar-web` | application | `running:unknown` | yes | `0` |
| `workers-market-stream` | application | `running:unknown` | no | `0` |
| `workers-execution` | application | `running:unknown` | no | `0` |
| `soar-api` | application | `running:unknown` | yes | `5` |
| `workers-market-data` | application | `running:unknown` | no | `0` |
| `postgresql` | standalone-postgresql | `running:healthy` from global resource readback | no | not stored |
| `redis` | standalone-redis | `running:healthy` from global resource readback | no | not stored |

Count: eight canonical Soar production-environment resources: six
applications, one PostgreSQL resource, and one Redis resource.

## Global Resource Reconciliation

The global resources endpoint returned nine Soar-relevant rows in the safe
allowlisted projection:

- the six production applications listed above;
- `postgresql`;
- `redis`;
- one `postgresql-database-*` PostgreSQL companion row with the generated
  suffix redacted.

Release interpretation: the production environment endpoint remains the
canonical resource-by-resource deploy/smoke target and contains one PostgreSQL
resource. The extra global PostgreSQL row is a Coolify global-list
alias/companion row, not an additional Soar deployable application or a ninth
production-environment smoke target.

## Notes

- Coolify read-only production status access is verified for
  project/environment/resource reconciliation.
- Application readiness remains a separate release smoke requirement: API
  `/health`, API `/ready`, Web `/`, Web `/api/build-info`, and protected
  `/workers/ready` with an approved read-only principal.
- This issue does not authorize a production mutation. Any deploy, restart,
  rollback, env change, database action, or protected smoke still requires the
  appropriate separate permit and evidence path.
