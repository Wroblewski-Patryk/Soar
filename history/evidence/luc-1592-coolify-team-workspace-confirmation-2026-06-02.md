# LUC-1592 Coolify Team Workspace Confirmation Evidence

Checked at: `2026-06-02T20:51:42Z`

Scope: read-only Coolify team/workspace selector confirmation for Soar.

## Issue

- Issue: `LUC-1592` `[Operator][Coolify] Confirm expected Coolify team/workspace`
- Goal: confirm the expected Coolify team/workspace selector before trusting
  production resource status or any production-impacting Coolify action.

## Evidence

| Check | Result |
| --- | --- |
| Paperclip wake payload | Scoped `issue_assigned`; `fallbackFetchNeeded=false`; no pending comments; checkout already claimed by harness and not repeated. |
| Paperclip heartbeat context | Issue `LUC-1592`; project `Soar`; status `in_progress`; no first-class blocker issue. |
| Latest issue comment | No pending comments in inline wake payload, so no comment changed the read-only selector proof path. |
| Names-only Coolify env binding check | `COOLIFY_BASE_URL`, `COOLIFY_API_TOKEN`, `COOLIFY_TOKEN`, and `COOLIFY_SOAR_PROJECT_ID` are present by name; values were not printed. |
| Explicit team env binding | `COOLIFY_SOAR_TEAM_ID` and `COOLIFY_TEAM_ID` are absent in this runner. |
| `GET /api/v1/teams/current` | Current selector id `0`, name `LuckySparrow`. |
| `GET /api/v1/teams` | Two visible teams. |
| `GET /api/v1/projects/{COOLIFY_SOAR_PROJECT_ID}` | Configured project resolves to `Soar`. |
| `GET /api/v1/projects/{COOLIFY_SOAR_PROJECT_ID}/environments` | `production` environment is present. |
| `GET /api/v1/projects/{COOLIFY_SOAR_PROJECT_ID}/production` | Production environment id `6`; eight resources by established topology: six applications plus PostgreSQL and Redis. |
| Application projection | `soar-api`, `soar-web`, `workers-backtest`, `workers-execution`, `workers-market-data`, `workers-market-stream`. |
| `GET /api/v1/resources` | Seventeen visible global resource rows. |

## Conclusion

The expected Coolify team/workspace selector for Soar production remains id `0`,
name `LuckySparrow`. Earlier project memory that called selector id `0`
`Root Team` is superseded by the current Coolify API name `LuckySparrow`.

`COOLIFY_SOAR_TEAM_ID` and `COOLIFY_TEAM_ID` remain absent in this runner, but
this is not an active blocker while the selector is recorded as non-secret
config truth and current-team plus project-scoped readbacks succeed.

No deploy, restart, rollback, environment edit, database action, team setting
change, account action, secret readback, or live-trading action was performed.
