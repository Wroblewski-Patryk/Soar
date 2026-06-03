# LUC-1800 Coolify Read-Only Production Status Access Evidence

Date: 2026-06-03
Owner: Soar Project Manager / Ops closure lane
Scope: validate read-only Coolify production status access metadata

## Result

Status: verified.

At `2026-06-03T15:59:27Z`, authenticated read-only Coolify API calls confirmed
that this runner can read the configured Soar production status scope. The proof
used only names, counts, project/environment labels, and resource status
summaries. No secret values or raw resource identifiers were printed or stored.

## Wake Context

- Issue: [LUC-1800](/LUC/issues/LUC-1800)
- Wake reason: `issue_assigned`
- Latest comment id: `d842b9d7-0366-4c35-98ca-c4831225aae5`
- Fallback fetch needed: `no`
- Latest comment impact: selected an autonomous local repair/source-control
  lane while protected delivery stayed fail-closed; action stayed scoped to
  local repository evidence, read-only status verification, validation, and
  source-control closure.

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
  `COOLIFY_API_TOKEN`, `COOLIFY_TOKEN`, `COOLIFY_SOAR_PROJECT_ID`,
  `COOLIFY_SOAR_PRODUCTION_ENVIRONMENT`, `COOLIFY_SOAR_WEB_APP_ID`, and
  `COOLIFY_SOAR_API_APP_ID`.
- Optional team binding absent in this runner: `COOLIFY_SOAR_TEAM_ID` /
  `COOLIFY_TEAM_ID`.
- Optional team binding absence is not an active blocker because current-team
  and project-scoped readbacks succeeded under selector name `LuckySparrow`.

## Commands And Checks

| Check | Result |
| --- | --- |
| Names-only Coolify binding scan | pass; required binding names present without values printed |
| Coolify current team `GET /api/v1/teams/current` | pass; selector name `LuckySparrow` |
| Coolify team list `GET /api/v1/teams` | pass; two teams visible |
| Coolify project read `GET /api/v1/projects/{configured-project-id}` | pass; resolves to project `Soar` |
| Coolify environments read `GET /api/v1/projects/{configured-project-id}/environments` | pass; production environment available |
| Coolify production environment read `GET /api/v1/projects/{configured-project-id}/production` | pass; environment `production`, six applications, zero generic services |
| Coolify resources list `GET /api/v1/resources` | pass; `17` visible rows |
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
scope: six applications, one PostgreSQL resource, and one Redis resource.

## Release Interpretation

Coolify read-only production status access is verified for
project/environment/resource reconciliation. Application readiness and protected
worker readiness remain separate release smoke requirements and are not
authorized by this issue.

Any deploy, restart, rollback, environment change, database action, protected
smoke, live-account action, or live-trading action still requires a separate
release mutation permit.
