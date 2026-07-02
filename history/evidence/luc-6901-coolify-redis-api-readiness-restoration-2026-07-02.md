# LUC-6901 Coolify/Redis/API Readiness Restoration

Date: 2026-07-02

## Scope

Coordinator/Ops bridge heartbeat for [LUC-6901](/LUC/issues/LUC-6901), the
recovery child of [LUC-6898](/LUC/issues/LUC-6898).

No deploy, push, restart, rollback execution, env edit, database/Redis
mutation, production account mutation, exchange/payment mutation, order,
position, subscription mutation, live-trading action, secret value readback, or
raw Coolify/log payload storage was performed.

## Wake Context

- Wake reason: issue assigned.
- Pending comments: none.
- Checkout: already claimed by harness; no duplicate checkout was attempted.
- Latest comment: none, so no comment changed scope.

## Verification

Public production smoke was rerun after [LUC-6898](/LUC/issues/LUC-6898)
reported API `/ready` as `503`.

Command:

```powershell
corepack pnpm run -s ops:deploy:smoke -- --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --no-workers
```

Result: `PASS`

- `PASS API /health -> 200`
- `PASS API /ready -> 200`
- `PASS WEB / -> 200`
- `PASS WEB /api/build-info -> 200`

Focused manual probes:

| Route | Result |
| --- | --- |
| API `/health` | `200` |
| API `/ready` | `200`, body class `{"status":"ready","service":"api"}` |
| Web `/` | `200` |
| Web `/api/build-info` | `200`, SHA `c357d957741f56835f27a1fc3a948dad43a91036`, ref `main`, metadata source `env-runtime` |
| API `/workers/ready` unauthenticated | `401`, expected fail-closed missing-token response |

## Coolify / Redis Readback

This COO runner did not have Coolify binding names available:

- `COOLIFY_BASE_URL`
- `COOLIFY_API_TOKEN`
- `COOLIFY_TOKEN`
- `COOLIFY_SOAR_PROJECT_ID`
- `COOLIFY_SOAR_PRODUCTION_ENVIRONMENT`
- `COOLIFY_SOAR_API_APP_ID`
- `COOLIFY_SOAR_REDIS_RESOURCE_ID`

Therefore this heartbeat did not perform resource-level Coolify API, Redis, or
`soar-api` log inspection. The public API readiness result is the current
evidence that the user-visible readiness failure from
[LUC-6898](/LUC/issues/LUC-6898) is no longer reproducing.

## Status

`DONE / PUBLIC_API_READY_RESTORED / PUBLIC_DEPLOY_SMOKE_PASS /
WEB_PUBLIC_PASS / COOLIFY_RESOURCE_READBACK_NOT_AVAILABLE_IN_COO_RUNNER /
NO_PRODUCTION_MUTATION`.

## Residual Risk

- Resource-level Coolify/Redis health was not proven in this runner because the
  required Coolify env bindings were absent.
- Protected `/ready/details`, protected runtime freshness, rollback guard, and
  authenticated acceptance remain outside this COO recovery heartbeat and should
  be rerun by DRE/QVE through the parent recovery flow if required.
- No source, deploy, or runtime mutation was performed from this issue.

