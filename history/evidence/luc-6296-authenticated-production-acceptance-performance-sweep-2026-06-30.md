# LUC-6296 Authenticated Production Acceptance And Performance Sweep

## Status

- Result: `PASS / VERIFIED_PRODUCTION / AUTHENTICATED_ACCEPTANCE_PASS / PERFORMANCE_PASS / RUNTIME_HEALTHY`
- Environment: production
- Evidence date: 2026-06-30
- Issue: [LUC-6296](/LUC/issues/LUC-6296)
- Production Web SHA: `c357d957741f56835f27a1fc3a948dad43a91036`
- Production Web ref: `main`
- Metadata source: `env-runtime`
- Scope: read-only QVE production acceptance. No deploy, push, restart,
  rollback execution, env edit, secret/account readback, DB/Redis mutation,
  production account mutation, subscription/payment mutation, exchange
  mutation, order, position, or live-trading action.

## Verification

| Gate | Result | Evidence |
| --- | --- | --- |
| Build-info readback | PASS | Web `/api/build-info` returned `gitSha=c357d957741f56835f27a1fc3a948dad43a91036`, `gitRef=main`, `metadataSource=env-runtime`. |
| Deploy smoke, authenticated audit-login binding | PASS | API `/health`, API `/ready`, Web `/`, Web `/api/build-info`, and protected API `/workers/ready` all passed. |
| Auth session browser proof | PASS | `history/evidence/luc-6296-prod-auth-session-browser-proof-2026-06-30.md`; raw JSON `history/artifacts/luc-6296-prod-auth-session-browser-proof-2026-06-30.json`. |
| UI module clickthrough | PASS | `history/evidence/luc-6296-prod-ui-module-clickthrough-2026-06-30.md`; raw JSON `history/artifacts/luc-6296-prod-ui-module-clickthrough-2026-06-30.json`. |
| Runtime freshness | PASS | Worker heartbeat age `10595 ms`, market data age `10595 ms`, runtime signal lag `0`, and `5` runtime sessions healthy. |
| Rollback guard | PASS | `shouldRollback=false`, workers ready/topology healthy, runtime freshness PASS, alerts empty. |
| Performance timing sample | PASS | `history/artifacts/luc-6296-production-performance-timing-2026-06-30.json`. |
| Browser process cleanup | PASS | Narrow process check found no leftover `msedge`, Chrome, `chrome-headless-shell`, Chromium, or Playwright validation process. |

## Auth Session Proof Details

The production auth-session proof verified:

- unauthenticated `/dashboard` redirects to `/auth/login`;
- authenticated `/dashboard` renders;
- invalid token redirects to `/auth/login?session=expired`;
- `POST /auth/logout` returns `200`;
- `/auth/me` after logout fails closed with the same cookie token (`401`);
- `/auth/me` after logout fails closed with the same bearer token (`401`);
- `/dashboard` after logout redirects to `/auth/login`.

Secrets, tokens, cookies, passwords, private headers, and response bodies were
not written to artifacts.

## UI Clickthrough Details

Production route/module audit passed:

- public routes: `PASS:4`;
- dashboard routes: `PASS:18`;
- admin routes: `PASS:3`;
- legacy redirects: `PASS:3`.

Covered modules: auth, dashboard home, profile/exchanges, wallets, markets,
strategies, backtests, bots, runtime, reports, logs, admin users, and admin
subscriptions.

## Performance Sample

Five runs per endpoint all returned expected statuses:

| Endpoint | Statuses | Min ms | Max ms | Avg ms |
| --- | --- | ---: | ---: | ---: |
| API `/health` | `200:5` | 16.8 | 65.4 | 29.2 |
| API `/ready` | `200:5` | 19.0 | 25.7 | 21.2 |
| Web `/` | `200:5` | 15.4 | 88.1 | 38.6 |
| Web `/api/build-info` | `200:5` | 25.7 | 105.7 | 48.1 |
| API `/dashboard/markets/catalog` | `200:5` | 29.3 | 1779.3 | 387.2 |
| API `/admin/subscriptions/plans` | `200:5` | 25.2 | 44.6 | 33.5 |
| API `/workers/ready` | `200:5` | 24.5 | 28.1 | 27.0 |

`/dashboard/markets/catalog` had one cold sample at `1779.3 ms`. A focused
follow-up sample immediately normalized (`200:5`, max `86.1 ms`, avg `45.8 ms`),
so this remains a recurring watch item rather than a release blocker.

## Residual Risk

- Host-level VPS pressure/log-window proof remains a separate Ops gate.
- Release-grade source-control/build provenance remains a separate
  release/source gate because production build-info uses `metadataSource=env-runtime`.
- Market catalog cold-start latency remains a recurring performance watch item.
- The runner had `PROD_UI_AUDIT_*` auth bindings present by name/length only;
  default `SMOKE_AUTH_*`, `DEPLOY_FRESHNESS_*`, and `ROLLBACK_GUARD_*`
  bindings were absent, so authenticated checks reused the approved audit-login
  binding through environment-only secret paths.
