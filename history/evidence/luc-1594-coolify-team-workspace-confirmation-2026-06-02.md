# LUC-1594 Coolify Team Workspace Confirmation Evidence

Checked at: `2026-06-02T20:55:41Z`

Scope: read-only Coolify team/workspace selector confirmation for Soar.

## Issue

- Issue: `LUC-1594` `[Operator][Coolify] Confirm expected Coolify team/workspace`
- Goal: confirm the expected Coolify team/workspace selector before trusting
  production resource status.

## Evidence

| Check | Result |
| --- | --- |
| Paperclip heartbeat context | Issue `LUC-1594`; project `Soar`; goal `Soar production deploy confidence`; issue had no first-class blocker issue. |
| Latest issue comment | No pending comments in the wake payload and no issue comments in heartbeat context. |
| Names-only Coolify env binding check | `COOLIFY_BASE_URL`, `COOLIFY_API_TOKEN`, `COOLIFY_TOKEN`, `COOLIFY_SOAR_PROJECT_ID`, `COOLIFY_SOAR_PRODUCTION_ENVIRONMENT`, `COOLIFY_SOAR_API_APP_ID`, and `COOLIFY_SOAR_WEB_APP_ID` are present by name; token values were not printed or stored. |
| Explicit team env binding | `COOLIFY_SOAR_TEAM_ID` and `COOLIFY_TEAM_ID` are absent in this runner. |
| `GET /api/v1/teams/current` | Current selector id `0`, name `LuckySparrow`. |
| `GET /api/v1/projects/{COOLIFY_SOAR_PROJECT_ID}` | Configured project resolves to `Soar`; project id `5`; project UUID matches `COOLIFY_SOAR_PROJECT_ID`. |
| `GET /api/v1/projects/{COOLIFY_SOAR_PROJECT_ID}/production` | Production environment id `6`. |
| `GET /api/v1/resources` | Nine Soar-relevant resource rows in this readback: `soar-api`, `soar-web`, `workers-backtest`, `workers-execution`, `workers-market-data`, `workers-market-stream`, `postgresql`, `postgresql-database-w5gql24ddjrgjaid7110rcqo`, and `redis`. |

## Conclusion

The expected Coolify team/workspace selector for Soar production is id `0`,
name `LuckySparrow`. The explicit `COOLIFY_SOAR_TEAM_ID` / `COOLIFY_TEAM_ID`
binding remains absent, but this is not an active blocker while the selector is
recorded as non-secret config truth and the current-team plus project-scoped
readbacks succeed.

This readback shows nine Soar-relevant global resource rows because Coolify
currently exposes both the PostgreSQL service row and a PostgreSQL database row.
That does not change the selector conclusion.

No deploy, restart, rollback, environment edit, database action, team setting
change, account action, or live-trading action was performed.
