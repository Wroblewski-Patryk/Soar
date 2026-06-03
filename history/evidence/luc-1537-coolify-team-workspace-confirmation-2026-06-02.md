# LUC-1537 Coolify Team/Workspace Confirmation Evidence

Date: 2026-06-02
Owner: Ops Release Lead
Scope: read-only Coolify selector confirmation for Soar production deploy confidence.

## Result

Verified.

The expected Coolify team/workspace selector for Soar is:

- Team/workspace id: `0`
- Team/workspace name: `LuckySparrow`

Under this selector, the configured Soar project and production environment are
visible and resolve to the expected eight-resource production inventory.

## Wake Context

- Issue: `LUC-1537`
- Wake reason: `issue_assigned`
- Inline wake comments: `0/0`
- Latest comment id: `unknown`
- Fallback fetch needed: `no`
- Checkout: already claimed by harness; no duplicate checkout was called.
- Prior run failure: local adapter symlink error before domain work; Coolify
  verification was rerun from the issue context.

## Commands And Checks

- `GET /api/issues/LUC-1537/heartbeat-context` -> pass; issue context loaded.
- Names-only environment binding check -> pass without printing values:
  `COOLIFY_BASE_URL`, `COOLIFY_API_TOKEN`, `COOLIFY_TOKEN`,
  `COOLIFY_SOAR_PROJECT_ID`, `COOLIFY_SOAR_PRODUCTION_ENVIRONMENT`,
  `COOLIFY_SOAR_API_APP_ID`, and `COOLIFY_SOAR_WEB_APP_ID` are present.
- Names-only environment binding check -> absent:
  `COOLIFY_SOAR_TEAM_ID` and `COOLIFY_TEAM_ID`.
- `GET /api/v1/teams` -> pass; two teams visible to the configured token.
- `GET /api/v1/teams/current` -> pass at `2026-06-02T16:05:55Z`; current
  selector id `0`, name `LuckySparrow`.
- `GET /api/v1/projects/{configured-project-id}` -> pass; project name `Soar`.
- `GET /api/v1/projects/{configured-project-id}/environments` -> pass;
  environment `production` is visible after normalizing the Coolify response as
  a scalar environment object.
- `GET /api/v1/projects/{configured-project-id}/{configured-production-environment}`
  -> pass; environment `production` returns six applications, one PostgreSQL
  resource, and one Redis resource.

## Redacted Production Inventory Readback

Applications:

- `soar-api`
- `soar-web`
- `workers-backtest`
- `workers-execution`
- `workers-market-data`
- `workers-market-stream`

Data services:

- PostgreSQL: `1`
- Redis: `1`

## Safety Boundary

No secret values, tokens, cookies, resource ids, database URLs, exchange
credentials, screenshots, or account data were printed or stored.

No deploy, restart, rollback, environment edit, database action, team setting
change, account mutation, or live-trading mutation was performed.

## Disposition

Evidence complete; Paperclip parent status update delegated.

The expected team/workspace selector is freshly confirmed for `LUC-1537`.
`COOLIFY_SOAR_TEAM_ID` / `COOLIFY_TEAM_ID` remain absent in this runner, but the
exact non-secret selector truth is recorded and project-scoped reads succeed
under that selector.

`PATCH /api/issues/LUC-1537` and `POST /api/issues/LUC-1537/comments` were both
rejected by the Paperclip checkout guard because the issue is currently checked
out by recovery owner `2c4c03b3-3a08-4092-88e4-25197ba75113` while this run is
actor `01dd0c79-172b-4848-80eb-40692f07ccbb`. Follow-up `LUC-1542` was created
and assigned to that checkout owner to apply the parent `done` disposition or
release/reassign the checkout.
