# LUC-3436 Coolify Team Workspace Confirmation Evidence

Date: 2026-06-13
Owner: Deployment and Reliability Engineer
Scope: read-only Coolify team/workspace selector confirmation for Soar

## Wake

- Issue: `LUC-3436` `[Operator][Coolify] Confirm expected Coolify team/workspace`
- Wake reason: `issue_assigned`
- Inline wake payload: `fallbackFetchNeeded=false`, pending comments `0/0`, latest comment id `unknown`
- Checkout was already claimed by the harness and was not repeated.

## Safety Boundary

- No secret values were printed, copied to files, or committed.
- No deploy, restart, rollback, env edit, database action, Redis action, team setting change, account action, protected smoke, raw log capture, screenshot, or live-trading action was performed.
- Token values, direct Coolify base URL, configured project ids, raw resource ids, cookies, credentials, internal URLs, and raw Coolify objects were not stored.

## Commands And Proof

Fresh redacted readback timestamp: `2026-06-13T19:34:58Z`.

| Check | Result |
| --- | --- |
| Paperclip heartbeat context `GET /api/issues/LUC-3436/heartbeat-context` | pass |
| Names-only Coolify binding check | pass for `COOLIFY_BASE_URL`, `COOLIFY_API_TOKEN`, `COOLIFY_TOKEN`, `COOLIFY_SOAR_PROJECT_ID`, `COOLIFY_SOAR_PRODUCTION_ENVIRONMENT`, `COOLIFY_SOAR_TEAM_ID`, and `COOLIFY_TEAM_ID`; values not printed |
| Coolify current team `GET /api/v1/teams/current` | pass: current selector is team id `0`, name `LuckySparrow` |
| Coolify team list `GET /api/v1/teams` | pass: `1` visible team row in this runner |
| `COOLIFY_SOAR_TEAM_ID` matches current selector | pass |
| `COOLIFY_TEAM_ID` matches current selector | pass |
| Coolify project read `GET /api/v1/projects/{configured-project-id}` | pass: resolves to project `Soar` |
| Coolify production environment read `GET /api/v1/projects/{configured-project-id}/{configured-production-environment}` | pass: resolves to environment `production`, six applications, one PostgreSQL, one Redis, zero generic services |

## Confirmed Selector

- Expected Coolify team/workspace selector: team id `0`, name `LuckySparrow`.
- Both explicit runtime selector bindings are present by name and match the current Coolify selector.
- The selected workspace exposes the configured Soar project and production environment.

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
- Application readiness, protected worker readiness, deploy success, rollback readiness, and production release readiness remain separate gates.
