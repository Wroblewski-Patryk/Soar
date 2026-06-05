# LUC-2225 Coolify Read-Only Production Status Access Evidence

Date: 2026-06-05
Owner: Ops Release Lead
Scope: bind or validate read-only Coolify production status access metadata

## Result

Status: verified.

At `2026-06-05T15:43:58Z`, authenticated read-only Coolify API calls confirmed
that this runner can read the configured Soar production status scope through
the authoritative project and production-environment hierarchy. The proof used
only binding names, counts, project/environment labels, resource names,
resource classes, and status summaries. No secret values, raw resource
identifiers, generated database suffixes, cookies, tokens, or screenshots were
stored.

## Wake Context

- Issue: [LUC-2225](/LUC/issues/LUC-2225)
- Wake reason: `issue_assigned`
- Latest comment id: `unknown`
- Fallback fetch needed: `no`
- Latest comment impact: no comment delta in the wake payload; scoped wake
  directly assigned the Ops read-only Coolify production status access binding
  lane.

## Safety Boundary

- No deploy, restart, rollback, environment edit, database action, team setting
  change, account action, protected smoke, live-trading action, or production
  mutation was performed.
- No Coolify token, secret value, cookie, database URL, generated database
  suffix, raw resource id, internal connection URL, raw environment id, or
  screenshot was stored.
- `COOLIFY_SOAR_APP_ID` was not used as release authority; the verified model
  remains `project -> production environment -> resources`.

## Binding Status

- Present by name without value disclosure: `COOLIFY_BASE_URL`,
  `COOLIFY_API_TOKEN`, `COOLIFY_SOAR_PROJECT_ID`, `COOLIFY_TOKEN`,
  `COOLIFY_SOAR_PRODUCTION_ENVIRONMENT`, `COOLIFY_SOAR_WEB_APP_ID`,
  `COOLIFY_SOAR_API_APP_ID`, `COOLIFY_SOAR_TEAM_ID`, and `COOLIFY_TEAM_ID`.
- `COOLIFY_SOAR_PRODUCTION_ENVIRONMENT` is bound as an environment key/id in
  this runner. The raw value was not stored; read-only environment listing
  confirmed the visible environment label is `production`.
- Current selector resolves to `LuckySparrow`, and project-scoped readbacks
  succeeded.

## Commands And Checks

| Check | Result |
| --- | --- |
| Names-only Coolify binding scan | pass; required and optional team binding names present without values printed |
| Coolify current-team read `GET /api/v1/teams/current` | pass; selector resolves to `LuckySparrow` |
| Coolify teams read `GET /api/v1/teams` | pass; `1` team visible in this runner |
| Coolify project read `GET /api/v1/projects/{configured-project-id}` | pass; resolves to project `Soar` |
| Coolify environments read `GET /api/v1/projects/{configured-project-id}/environments` | pass; `production` available |
| Coolify production environment read `GET /api/v1/projects/{configured-project-id}/{configured-production-environment}` | pass; six applications, PostgreSQL, Redis, zero generic services |
| Coolify global resources list `GET /api/v1/resources` | pass; `1` visible row in this runner; not used as release authority |
| Data-service production projection | pass; PostgreSQL and Redis resource classes present; status fields were not exposed by this allowlisted projection |
| `pnpm run ops:coolify-stack:env-check:test` | pass; `8/8` node test subtests passed |

## Redacted Production Status Inventory

| Resource | Coolify type | Inventory status | Public FQDN |
| --- | --- | --- | --- |
| `workers-backtest` | application | `running:unknown` | no |
| `soar-web` | application | `running:unknown` | yes |
| `workers-market-stream` | application | `running:unknown` | no |
| `workers-execution` | application | `running:unknown` | no |
| `soar-api` | application | `running:unknown` | yes |
| `workers-market-data` | application | `running:unknown` | no |
| `postgresql` | standalone-postgresql | `present:status-unexposed` | no |
| `redis` | standalone-redis | `present:status-unexposed` | no |

Count: eight canonical Soar production-environment resources by environment
scope: six applications, one PostgreSQL resource class, and one Redis resource
class. All expected resource names/classes are present.

## Release Interpretation

Coolify read-only production status access is verified for
project/environment/resource reconciliation. Application readiness, protected
worker readiness, SLO evidence, restore/rollback evidence, and deploy mutation
readiness remain separate release smoke requirements and are not authorized by
this issue.

Any deploy, restart, rollback, environment change, database action, protected
smoke, live-account action, or live-trading action still requires a separate
release mutation permit.
