# LUC-1507 Coolify Team Workspace Confirmation Evidence

Date: 2026-06-02
Owner: Ops Release Lead
Scope: read-only Coolify team/workspace selector confirmation for Soar

## Wake

- Issue: `LUC-1507` `[Operator][Coolify] Confirm expected Coolify team/workspace`
- Wake reason: `issue_assigned`
- Inline wake payload: `fallbackFetchNeeded=false`, pending comments `0/0`, latest comment id `unknown`
- Checkout was already claimed by the harness and was not repeated.

## Safety Boundary

- No secret values were printed, copied to files, or committed.
- No deploy, restart, rollback, env edit, database action, team setting change, account action, or live trading action was performed.
- Resource ids, direct URLs, internal connection URLs, labels, server/proxy settings, and token values are treated as secret-adjacent and are not recorded here.

## Commands And Proof

| Check | Result |
| --- | --- |
| Paperclip heartbeat context `GET /api/issues/LUC-1507/heartbeat-context` | pass |
| Names-only Coolify env binding check | pass for `COOLIFY_BASE_URL`, `COOLIFY_API_TOKEN`, `COOLIFY_TOKEN`, `COOLIFY_SOAR_PROJECT_ID`, `COOLIFY_SOAR_PRODUCTION_ENVIRONMENT`, `COOLIFY_SOAR_API_APP_ID`, and `COOLIFY_SOAR_WEB_APP_ID`; values not printed |
| `COOLIFY_SOAR_TEAM_ID` / `COOLIFY_TEAM_ID` presence | absent in this runner |
| Coolify team list `GET /api/v1/teams` | pass: visible teams include id `0` named `LuckySparrow` and id `2` named `empty - change it` |
| Coolify current team `GET /api/v1/teams/current` | pass: current selector is id `0`, name `LuckySparrow` |
| Coolify project read `GET /api/v1/projects/{configured-project-id}` | pass: resolves to project `Soar` |
| Coolify production environment read `GET /api/v1/projects/{configured-project-id}/{configured-production-environment}` | pass: six applications, one PostgreSQL, one Redis |

Fresh redacted readback timestamp: `2026-06-02T14:03:35Z`.

## Confirmed Selector

- Expected Coolify team/workspace selector: team id `0`, name `LuckySparrow`.
- Historical UI wording in prior project memory described this as `Root Team`; current API readback names the same id `0` selector as `LuckySparrow`.
- The selected team exposes the configured Soar project and production environment.

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

Count: eight Soar production resources: six applications, one PostgreSQL resource, and one Redis resource.

## Notes

- This closes the selector ambiguity for read-only project/environment/resource reconciliation.
- `COOLIFY_SOAR_TEAM_ID` / `COOLIFY_TEAM_ID` remain absent in this runner, but the exact expected selector is now recorded as id `0`, name `LuckySparrow`.
- Future automation may bind `COOLIFY_SOAR_TEAM_ID=0` or `COOLIFY_TEAM_ID=0` as a non-secret config value if Security/Ops wants an explicit selector guard.
- Application readiness remains a separate release smoke requirement.
