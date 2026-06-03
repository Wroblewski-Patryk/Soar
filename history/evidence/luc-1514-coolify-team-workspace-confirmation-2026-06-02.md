# LUC-1514 Coolify Team/Workspace Confirmation Evidence

Date: 2026-06-02
Owner: Ops Release Lead
Scope: read-only Coolify selector confirmation for Soar production deploy confidence.

## Result

Verified.

The expected Coolify team/workspace selector for Soar is:

- Team/workspace id: `0`
- Team/workspace name: `LuckySparrow`

Earlier project memory described id `0` as `Root Team`; the current Coolify API
name is `LuckySparrow`. Under this selector, the configured Soar project and
production environment are visible and resolve to the expected eight-resource
production inventory.

## Wake Context

- Issue: `LUC-1514`
- Wake reason: `issue_assigned`
- Inline wake comments: `0/0`
- Latest comment id: `unknown`
- Fallback fetch needed: `no`
- Checkout: already claimed by harness; no duplicate checkout was called.

## Commands And Checks

- `GET /api/issues/LUC-1514/heartbeat-context` -> pass; issue had no
  first-class blockers and no comments.
- Names-only environment binding check -> pass without printing values:
  `COOLIFY_BASE_URL`, `COOLIFY_API_TOKEN`, `COOLIFY_TOKEN`,
  `COOLIFY_SOAR_PROJECT_ID`, and `COOLIFY_SOAR_PRODUCTION_ENVIRONMENT`
  are present.
- Names-only environment binding check -> absent:
  `COOLIFY_SOAR_TEAM_ID`, `COOLIFY_TEAM_ID`, and `COOLIFY_SOAR_ENVIRONMENT`.
- `GET /api/v1/teams` -> pass; two teams visible to the configured token.
- `GET /api/v1/teams/current` -> pass; current selector id `0`, name
  `LuckySparrow`.
- `GET /api/v1/projects/{configured-project-id}` -> pass; project name `Soar`.
- `GET /api/v1/projects/{configured-project-id}/{configured-production-environment}`
  -> pass; environment `production` returns six applications, one PostgreSQL
  resource, and one Redis resource.
- `pnpm run quality:guardrails` -> failed on repository-wide pre-existing
  checks unrelated to this selector proof: architecture graph drift
  `812/816 covered, 4 missing`, and file-size budget failures in
  `apps/api/src/modules/bots/bots.e2e.test.ts` and
  `apps/api/src/modules/positions/livePositionReconciliation.service.test.ts`.

## Redacted Production Inventory Readback

Applications:

- `soar-web`
- `workers-backtest`
- `workers-market-stream`
- `workers-execution`
- `soar-api`
- `workers-market-data`

Data services:

- PostgreSQL: `1`
- Redis: `1`

## Safety Boundary

No secret values, tokens, cookies, resource ids, database URLs, exchange
credentials, screenshots, or account data were printed or stored.

No deploy, restart, rollback, environment edit, database action, team setting
change, account mutation, or live-trading mutation was performed.

## Disposition

`done`: the expected team/workspace selector is now freshly confirmed for
`LUC-1514`, and source-of-truth references were refreshed. Repository-wide
guardrails remain blocked by unrelated existing drift/file-size findings.
