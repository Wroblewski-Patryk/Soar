# LUC-1585 Coolify Team Workspace Confirmation Evidence

Checked at: `2026-06-02T19:12:54Z`

Scope: read-only Coolify team/workspace selector confirmation for Soar.

## Issue

- Issue: `LUC-1585` `[Operator][Coolify] Confirm expected Coolify team/workspace`
- Goal: confirm the expected Coolify team/workspace selector before trusting
  production resource status.

## Evidence

| Check | Result |
| --- | --- |
| Paperclip heartbeat context | Issue `LUC-1585`; project `Soar`; goal `Soar production deploy confidence`; issue had no first-class blocker issue. |
| Latest issue comment | Live-run janitor noted a duplicate-owner run cancellation; this heartbeat used the scoped wake and performed a fresh read-only selector proof. |
| Names-only Coolify env binding check | `COOLIFY_BASE_URL`, `COOLIFY_API_TOKEN`, `COOLIFY_TOKEN`, and `COOLIFY_SOAR_PROJECT_ID` are present by name; values were not printed. |
| Explicit team env binding | `COOLIFY_SOAR_TEAM_ID` and `COOLIFY_TEAM_ID` are absent in this runner. |
| `GET /api/v1/teams/current` | Current selector id `0`, name `LuckySparrow`. |
| `GET /api/v1/teams` | Two visible teams. |
| `GET /api/v1/projects/{COOLIFY_SOAR_PROJECT_ID}` | Configured project resolves to `Soar`. |
| `GET /api/v1/projects/{COOLIFY_SOAR_PROJECT_ID}/environments` | `production` environment is present. |
| `GET /api/v1/projects/{COOLIFY_SOAR_PROJECT_ID}/production` | Production environment id `6`; eight resources: six applications, one PostgreSQL, one Redis. |
| `GET /api/v1/resources` | Seventeen visible global resource rows. |

## Conclusion

The expected Coolify team/workspace selector for Soar production is id `0`,
name `LuckySparrow`. The explicit `COOLIFY_SOAR_TEAM_ID` / `COOLIFY_TEAM_ID`
binding remains absent, but this is not an active blocker while the selector is
recorded as non-secret config truth and the current-team plus project-scoped
readbacks succeed.

No deploy, restart, rollback, environment edit, database action, team setting
change, account action, or live-trading action was performed.
