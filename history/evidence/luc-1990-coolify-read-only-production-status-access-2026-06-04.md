# LUC-1990 Coolify Read-Only Production Status Access Evidence

Date: 2026-06-04
Owner: Ops Release Lead
Scope: bind or validate read-only Coolify production status access metadata

## Result

Status: verified.

At `2026-06-04T14:05:13Z`, authenticated read-only Coolify API calls confirmed
that this runner can read the configured Soar production status scope through
the authoritative project and production-environment hierarchy. The proof used
only binding names, counts, project/environment labels, resource names,
resource classes, and application status summaries. No secret values, raw
resource identifiers, generated database suffixes, cookies, tokens, or
screenshots were stored.

## Wake Context

- Issue: [LUC-1990](/LUC/issues/LUC-1990)
- Wake reason: `issue_assigned`
- Latest comment id: `unknown`
- Fallback fetch needed: `no`
- Latest comment impact: no comment delta; scoped wake directly assigned the
  Ops read-only Coolify production status access binding lane.

## Safety Boundary

- No deploy, restart, rollback, environment edit, database action, team setting
  change, account action, protected smoke, live-trading action, or production
  mutation was performed.
- No Coolify token, Paperclip token, secret value, cookie, database URL,
  generated database suffix, raw resource id, internal connection URL, or
  screenshot was stored.
- `COOLIFY_SOAR_APP_ID` was not used as release authority; the verified model
  remains `project -> production environment -> resources`.

## Binding Status

- Present by name without value disclosure: `COOLIFY_BASE_URL`,
  `COOLIFY_API_TOKEN`, `COOLIFY_SOAR_PROJECT_ID`, `COOLIFY_TOKEN`,
  `COOLIFY_SOAR_PRODUCTION_ENVIRONMENT`, `COOLIFY_SOAR_WEB_APP_ID`, and
  `COOLIFY_SOAR_API_APP_ID`.
- Optional team binding absent in this runner: `COOLIFY_SOAR_TEAM_ID` /
  `COOLIFY_TEAM_ID`.
- Optional team binding absence is not an active blocker because
  project-scoped readbacks succeeded.

## Commands And Checks

| Check | Result |
| --- | --- |
| Paperclip heartbeat context `GET /api/issues/{issueId}/heartbeat-context` | pass; scoped issue context returned `in_progress`, priority `critical`, zero first-class blockers, and no comments |
| Names-only Coolify binding scan | pass; required binding names present without values printed |
| Coolify project read `GET /api/v1/projects/{configured-project-id}` | pass; resolves to project `Soar` |
| Coolify environments read `GET /api/v1/projects/{configured-project-id}/environments` | pass; one visible environment; `production` available |
| Coolify production environment read `GET /api/v1/projects/{configured-project-id}/production` | pass; six applications, PostgreSQL, Redis, zero generic services |
| Coolify global resources list `GET /api/v1/resources` | pass; `17` visible rows; not used as release authority for this checkpoint |
| `pnpm run ops:coolify-stack:env-check:test` | pass; `8/8` node test subtests passed |

## Redacted Production Status Inventory

| Resource | Coolify type | Inventory status | Public FQDN |
| --- | --- | --- | --- |
| `postgresql` | standalone-postgresql | `running:healthy` | no |
| `redis` | standalone-redis | `running:healthy` | no |
| `soar-api` | application | `running:unknown` | yes |
| `soar-web` | application | `running:unknown` | yes |
| `workers-backtest` | application | `running:unknown` | no |
| `workers-execution` | application | `running:unknown` | no |
| `workers-market-data` | application | `running:unknown` | no |
| `workers-market-stream` | application | `running:unknown` | no |

Count: eight canonical Soar production-environment resources by environment
scope: six applications, one PostgreSQL resource class, and one Redis resource
class.

## Release Interpretation

Coolify read-only production status access is verified for
project/environment/resource reconciliation. Application readiness, database
health beyond the inventory signal, and protected worker readiness remain
separate release smoke requirements and are not authorized by this issue.

Any deploy, restart, rollback, environment change, database action, protected
smoke, live-account action, or live-trading action still requires a separate
release mutation permit.
