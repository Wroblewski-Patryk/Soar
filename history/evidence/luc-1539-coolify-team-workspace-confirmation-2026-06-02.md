# LUC-1539 Coolify Team Workspace Confirmation Evidence

Date: 2026-06-02
Owner: CTO Architect / Ops release gate recovery
Scope: read-only Coolify team/workspace selector confirmation for Soar.

## Wake

- Issue: `LUC-1539` `[Ops][Coolify] Bind or record expected Soar Coolify team/workspace selector`
- Wake reason: `source_scoped_recovery_action`
- Inline wake payload: `fallbackFetchNeeded=false`, pending comments `0/0`, latest comment id `unknown`
- Checkout: `POST /api/issues/{LUC-1539}/checkout` passed for this run.
- Active recovery action: `stranded_assigned_issue`.

## Safety Boundary

- No secret values were printed, copied to files, or committed.
- No deploy, restart, rollback, env edit, database action, team setting change, account action, or live trading action was performed.
- Project ids, token values, direct URLs, resource ids, internal connection URLs, server/proxy settings, and secret-adjacent values are not recorded here.

## Commands And Proof

| Check | Result |
| --- | --- |
| Paperclip checkout `POST /api/issues/{LUC-1539}/checkout` | pass |
| Paperclip heartbeat context `GET /api/issues/{LUC-1539}/heartbeat-context` | pass |
| Names-only Coolify env binding check | pass for `COOLIFY_BASE_URL`, `COOLIFY_API_TOKEN`, `COOLIFY_TOKEN`, `COOLIFY_SOAR_PROJECT_ID`, and `COOLIFY_SOAR_PRODUCTION_ENVIRONMENT`; values not printed |
| `COOLIFY_SOAR_TEAM_ID` / `COOLIFY_TEAM_ID` presence | absent in this runner |
| Coolify team list `GET /api/v1/teams` | pass: two teams visible |
| Coolify current team `GET /api/v1/teams/current` | pass at `2026-06-02T16:08:15Z`: current selector is id `0`, name `LuckySparrow` |
| Coolify project read `GET /api/v1/projects/{configured-project-id}` | pass: resolves to project `Soar` |
| Coolify environment list `GET /api/v1/projects/{configured-project-id}/environments` | pass: `production` present |
| Coolify production environment read `GET /api/v1/projects/{configured-project-id}/{configured-production-environment}` | pass: six applications, one PostgreSQL, one Redis |
| Coolify resources list `GET /api/v1/resources` | pass: redacted list count `17` |

Fresh redacted readback timestamp: `2026-06-02T16:08:15Z`.

## Confirmed Selector

- Expected Coolify team/workspace selector: team id `0`, name `LuckySparrow`.
- Historical UI memory in prior project records described this id `0` selector as `Root Team`; current API readback names the same selector `LuckySparrow`.
- The selected team exposes the configured Soar project and production environment.

## Redacted Inventory Under Confirmed Selector

| Resource | Type |
| --- | --- |
| Soar API application | application |
| Soar web application | application |
| Backtest worker application | application |
| Execution worker application | application |
| Market data worker application | application |
| Market stream worker application | application |
| PostgreSQL | postgresql |
| Redis | redis |

Count: eight Soar production resources: six applications, one PostgreSQL resource, and one Redis resource.

## Notes

- This closes the selector ambiguity for read-only project/environment/resource reconciliation on `LUC-1539`.
- `COOLIFY_SOAR_TEAM_ID` / `COOLIFY_TEAM_ID` remain absent in this runner, but the exact expected selector is recorded as id `0`, name `LuckySparrow`.
- Future automation may bind `COOLIFY_SOAR_TEAM_ID=0` or `COOLIFY_TEAM_ID=0` as a non-secret selector guard if Security/Ops wants an explicit environment-level check.
- This evidence does not claim full application readiness, protected smoke readiness, deploy mutation readiness, rollback readiness, SLO/observability readiness, or production release readiness.
