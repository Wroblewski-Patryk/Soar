# LUC-1556 Coolify Team Workspace Confirmation Evidence

Date: 2026-06-02
Owner: Ops Release Lead
Scope: read-only Coolify team/workspace selector confirmation for Soar

## Wake

- Issue: `LUC-1556` `[Operator][Coolify] Confirm expected Coolify team/workspace`
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
| Paperclip heartbeat context `GET /api/issues/LUC-1556/heartbeat-context` | pass |
| Names-only Coolify env binding check | pass for `COOLIFY_BASE_URL`, `COOLIFY_API_TOKEN`, `COOLIFY_TOKEN`, `COOLIFY_SOAR_PROJECT_ID`, `COOLIFY_SOAR_PRODUCTION_ENVIRONMENT`, `COOLIFY_SOAR_API_APP_ID`, and `COOLIFY_SOAR_WEB_APP_ID`; values not printed |
| `COOLIFY_SOAR_TEAM_ID` / `COOLIFY_TEAM_ID` presence | absent in this runner |
| Coolify team list `GET /api/v1/teams` | pass: two teams visible |
| Coolify current team `GET /api/v1/teams/current` | pass at `2026-06-02T17:11:40Z`: current selector is id `0`, name `LuckySparrow` |
| Coolify project read `GET /api/v1/projects/{configured-project-id}` | pass: resolves to project `Soar` |
| Coolify environments read `GET /api/v1/projects/{configured-project-id}/environments` | pass: `production` present |
| Coolify production environment read `GET /api/v1/projects/{configured-project-id}/{configured-production-environment}` | pass at `2026-06-02T17:11:40Z`: `6` applications, `1` PostgreSQL, `1` Redis |
| Coolify resources list `GET /api/v1/resources` | pass: `17` visible resource rows |

Fresh redacted readback timestamp:
- Team selector and project/environment visibility: `2026-06-02T17:11:40Z`.

## Confirmed Selector

- Expected Coolify team/workspace selector: team id `0`, name `LuckySparrow`.
- The selected team exposes the configured Soar project and production environment.
- Redacted production inventory under that selector remains eight resources: six
  applications (`soar-api`, `soar-web`, `workers-backtest`,
  `workers-execution`, `workers-market-data`, `workers-market-stream`) plus
  PostgreSQL and Redis.

## Notes

- This closes the selector ambiguity for read-only project/environment/resource reconciliation.
- `COOLIFY_SOAR_TEAM_ID` / `COOLIFY_TEAM_ID` remain absent in this runner, but the exact expected selector is recorded as id `0`, name `LuckySparrow`.
- Future automation may bind `COOLIFY_SOAR_TEAM_ID=0` or `COOLIFY_TEAM_ID=0` as a non-secret selector guard if Security/Ops wants an explicit environment-level check.
- This evidence does not claim full application readiness, protected smoke readiness, deploy mutation readiness, rollback readiness, or SLO/observability readiness.

## Continuation Readback

- Paperclip recovery context at `2026-06-02T17:09:02Z` showed one system
  recovery comment and no first-class `blockedBy` issue. The current heartbeat
  therefore treated the issue as actionable process recovery, not as a real
  Coolify blocker.
- Fresh Coolify API readback at `2026-06-02T17:10:03Z` re-confirmed current
  team selector id `0`, name `LuckySparrow`, project `Soar`, and environment
  `production`.
- Global Coolify resources read at `2026-06-02T17:10:03Z` showed the expected
  Soar application rows plus PostgreSQL and Redis rows under the confirmed
  selector. One generated PostgreSQL database row was also visible in the
  global resources endpoint and is treated as inventory noise for this selector
  confirmation, not a separate team/workspace decision.
