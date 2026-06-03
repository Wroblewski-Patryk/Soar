# LUC-1538 Coolify Team Workspace Confirmation Evidence

Date: 2026-06-02
Owner: Ops Release Lead
Scope: read-only Coolify team/workspace selector confirmation for Soar

## Wake

- Issue: `LUC-1538` `[Operator][Coolify] Confirm expected Coolify team/workspace`
- Wake reason: `issue_assigned`
- Inline wake payload: `fallbackFetchNeeded=false`, pending comments `0/0`, latest comment id `unknown`
- Checkout was already claimed by the harness and was not repeated.

## Safety Boundary

- No secret values were printed, copied to files, or committed.
- No deploy, restart, rollback, env edit, database action, team setting change, account action, or live trading action was performed.
- Token values, direct resource ids, internal connection URLs, server/proxy settings, and secret-adjacent values are not recorded here.

## Commands And Proof

| Check | Result |
| --- | --- |
| Paperclip heartbeat context `GET /api/issues/LUC-1538/heartbeat-context` | pass |
| Names-only Coolify env binding check | pass for `COOLIFY_BASE_URL`, `COOLIFY_API_TOKEN`, `COOLIFY_TOKEN`, `COOLIFY_SOAR_PROJECT_ID`, and `COOLIFY_SOAR_PRODUCTION_ENVIRONMENT`; values not printed |
| `COOLIFY_SOAR_TEAM_ID` / `COOLIFY_TEAM_ID` presence | absent in this runner |
| Coolify team list `GET /api/v1/teams` | pass: two teams visible |
| Coolify current team `GET /api/v1/teams/current` | pass: current selector is id `0`, name `LuckySparrow` |
| Coolify project read `GET /api/v1/projects/{configured-project-id}` | pass: resolves to project `Soar` |
| Coolify production environment read `GET /api/v1/projects/{configured-project-id}/{configured-production-environment}` | pass: resolves to environment `production` |

Fresh redacted readback timestamp: `2026-06-02T16:07Z`.

## Confirmed Selector

- Expected Coolify team/workspace selector: team id `0`, name `LuckySparrow`.
- Historical UI memory in prior project records described this id `0` selector as `Root Team`; current API readback names the same selector `LuckySparrow`.
- The selected team exposes the configured Soar project and production environment.

## Notes

- This closes the selector ambiguity for read-only project/environment/resource reconciliation.
- `COOLIFY_SOAR_TEAM_ID` / `COOLIFY_TEAM_ID` remain absent in this runner, but the exact expected selector is recorded as id `0`, name `LuckySparrow`.
- Future automation may bind `COOLIFY_SOAR_TEAM_ID=0` or `COOLIFY_TEAM_ID=0` as a non-secret selector guard if Security/Ops wants an explicit environment-level check.
- This evidence does not claim full application readiness, protected smoke readiness, deploy mutation readiness, rollback readiness, or SLO/observability readiness.
