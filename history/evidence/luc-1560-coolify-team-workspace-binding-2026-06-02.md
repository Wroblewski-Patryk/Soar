# LUC-1560 Coolify Team Workspace Binding Evidence

Date: 2026-06-02
Owner: Ops Release Lead
Scope: read-only Coolify team/workspace selector binding confirmation for Soar

## Result

Verified.

The expected Coolify team/workspace selector for Soar production is team id
`0`, name `LuckySparrow`. Under that selector, authenticated read-only
project/environment/resource reads resolved the configured Soar project,
production environment, and eight-resource production inventory.

## Wake Context

- Issue: `LUC-1560`
- Parent: `LUC-1556`
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
- The check stayed inside the approved read-only Ops release/deploy gate lane.

## Commands And Checks

| Check | Result |
| --- | --- |
| Paperclip heartbeat context `GET /api/issues/LUC-1560/heartbeat-context` | pass; no comments and no first-class blockers |
| Names-only Coolify env binding check | pass: required names present without values printed |
| `COOLIFY_SOAR_TEAM_ID` / `COOLIFY_TEAM_ID` presence | absent in this runner |
| Coolify team list `GET /api/v1/teams` | pass; two teams visible |
| Coolify current team `GET /api/v1/teams/current` | pass at `2026-06-02T17:13:03Z`; current selector id `0`, name `LuckySparrow` |
| Coolify project read `GET /api/v1/projects/{configured-project-id}` | pass; resolves to project `Soar` |
| Coolify environments read `GET /api/v1/projects/{configured-project-id}/environments` | pass; `production` environment present |
| Coolify production environment read `GET /api/v1/projects/{configured-project-id}/production` | pass; six applications, one PostgreSQL, one Redis |
| Coolify resources list `GET /api/v1/resources` | pass; `17` visible resource rows |

Fresh redacted readback timestamp: `2026-06-02T17:13:03Z`.

## Confirmed Selector

- Expected Coolify team/workspace selector: team id `0`, name `LuckySparrow`.
- Earlier project memory described this id `0` selector as `Root Team`; current
  Coolify API naming is `LuckySparrow`.
- The selected team exposes the configured Soar project and production
  environment.
- Future explicit selector pinning may bind `COOLIFY_SOAR_TEAM_ID=0` or
  `COOLIFY_TEAM_ID=0` as non-secret config if Security/Ops wants an
  environment-level guard.

## Redacted Inventory Under Confirmed Selector

| Resource | Type |
| --- | --- |
| `soar-api` | application |
| `soar-web` | application |
| `workers-backtest` | application |
| `workers-execution` | application |
| `workers-market-data` | application |
| `workers-market-stream` | application |
| `postgresql` | postgresql |
| `redis` | redis |

Count: eight Soar production resources: six applications, one PostgreSQL
resource, and one Redis resource.

## Notes

- This closes the selector ambiguity for read-only project/environment/resource
  reconciliation.
- Safe next proof: rerun the Coolify resource reconciler and compare discovered
  project/resources against the expected topology.
- `COOLIFY_SOAR_TEAM_ID` / `COOLIFY_TEAM_ID` remain absent in this runner, but
  the exact expected selector is recorded as non-secret config truth.
- This evidence does not claim full application readiness, protected smoke
  readiness, deploy mutation readiness, rollback readiness, or SLO/observability
  readiness.
