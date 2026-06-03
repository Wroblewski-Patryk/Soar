# LUC-1591 Coolify Read-Only Production Status Access Evidence

Date: 2026-06-02
Owner: Ops Release Lead
Scope: read-only Coolify production status access binding for Soar

## Result

Verified.

The Ops runtime has the required Coolify read-only production status bindings
available by name, and authenticated read-only Coolify API calls resolved the
configured Soar project, production environment, team/workspace selector, and
redacted production resource inventory.

## Wake Context

- Issue: `LUC-1591`
- Wake reason: `issue_assigned`
- Inline wake comments: `0/0`
- Latest comment id: `unknown`
- Fallback fetch needed: `no`
- Checkout: already claimed by harness; no duplicate checkout was called.

## Safety Boundary

- No secret values, token values, cookies, database URLs, exchange credentials,
  screenshots, full resource ids, or internal connection URLs were printed or
  stored.
- No deploy, restart, rollback, environment edit, database action, team setting
  change, account mutation, or live-trading mutation was performed.
- Direct single-resource aliases were not used as release authority. The
  approved path remains project -> production environment -> resources.

## Commands And Checks

| Check | Result |
| --- | --- |
| Paperclip heartbeat context `GET /api/issues/LUC-1591/heartbeat-context` | pass; no comments and no first-class blockers |
| Names-only Coolify env binding check | pass: required names present without values printed |
| Coolify team list `GET /api/v1/teams` | pass; two teams visible |
| Coolify current team `GET /api/v1/teams/current` | pass at `2026-06-02T20:51:41Z`; current selector id `0`, name `LuckySparrow` |
| Coolify project read `GET /api/v1/projects/{configured-project-id}` | pass; resolves to project `Soar` |
| Coolify environments read `GET /api/v1/projects/{configured-project-id}/environments` | pass; `production` environment present |
| Coolify production environment read `GET /api/v1/projects/{configured-project-id}/production` | pass; six applications, one PostgreSQL, one Redis |
| Coolify resources list `GET /api/v1/resources` | pass; `17` visible resource rows |

Fresh redacted readback timestamp: `2026-06-02T20:51:41Z`.

## Binding Status

- Present by name: `COOLIFY_BASE_URL`, `COOLIFY_API_TOKEN`,
  `COOLIFY_TOKEN`, and `COOLIFY_SOAR_PROJECT_ID`.
- Optional team binding absent in this runner: `COOLIFY_SOAR_TEAM_ID` /
  `COOLIFY_TEAM_ID`.
- Team binding absence is not an active blocker for this issue because current
  selector readback succeeded and project-scoped authenticated reads resolved
  the Soar production resource inventory under selector id `0`,
  `LuckySparrow`.

## Redacted Inventory

| Resource | Type | Inventory status | Public FQDN |
| --- | --- | --- | --- |
| `soar-web` | application | `running:unknown` | yes |
| `soar-api` | application | `running:unknown` | yes |
| `workers-backtest` | application | `running:unknown` | no |
| `workers-execution` | application | `running:unknown` | no |
| `workers-market-data` | application | `running:unknown` | no |
| `workers-market-stream` | application | `running:unknown` | no |
| `postgresql` | standalone-postgresql | `running:healthy` | no |
| `redis` | standalone-redis | `running:healthy` | no |

Count: eight Soar production resources: six applications, one PostgreSQL
resource, and one Redis resource.

## Notes

- Coolify read-only production status access is verified for
  project/environment/resource reconciliation.
- Application readiness remains a separate release smoke requirement: API
  `/health`, API `/ready`, Web `/`, Web `/api/build-info`, and protected
  `/workers/ready` with an approved read-only principal.
- This issue does not authorize a production mutation. Any deploy, restart,
  rollback, env change, or database action still requires a separate release
  mutation permit.
