# LUC-6180 Authenticated Production Acceptance And Performance Sweep

## Status

- Result: `PASS / VERIFIED_PRODUCTION / AUTHENTICATED_ACCEPTANCE_PASS / PERFORMANCE_PASS / RUNTIME_HEALTHY`
- Environment: production
- Evidence date: 2026-06-29
- Issue: LUC-6180
- Production Web SHA: `c357d957741f56835f27a1fc3a948dad43a91036`
- Production Web ref: `main`
- Scope: read-only QVE production acceptance. No deploy, push, restart, rollback execution, env edit, secret/account readback, DB/Redis mutation, production account mutation, subscription/payment mutation, exchange mutation, order, position, or live-trading action.

## Verification

| Gate | Result | Evidence |
| --- | --- | --- |
| Build-info readback | PASS | Web `/api/build-info` returned SHA `c357d957741f56835f27a1fc3a948dad43a91036`. |
| Deploy smoke | PASS | `pnpm run ops:deploy:smoke` passed API `/health`, API `/ready`, Web `/`, Web `/api/build-info`, and protected API `/workers/ready`. |
| Auth session browser proof | PASS | `history/evidence/luc-6180-prod-auth-session-browser-proof-2026-06-29.md`; raw JSON `history/artifacts/luc-6180-prod-auth-session-browser-proof-2026-06-29.json`. |
| UI module clickthrough | PASS | `history/evidence/luc-6180-prod-ui-module-clickthrough-2026-06-29.md`; raw JSON `history/artifacts/luc-6180-prod-ui-module-clickthrough-2026-06-29.json`. |
| Runtime freshness | PASS | Worker heartbeat age `9368 ms`, market data age `9368 ms`, runtime signal lag `0`, and `5` runtime sessions healthy. |
| Rollback guard | PASS | `shouldRollback=false`, workers ready/topology healthy, runtime freshness PASS, alerts empty. |
| Performance timing sample | PASS | `history/artifacts/luc-6180-production-performance-timing-2026-06-29.json`. |

## Auth Session Proof Details

The rerun verified the previously blocked logout/session-invalidation behavior:

- unauthenticated `/dashboard` redirects to `/auth/login`;
- authenticated `/dashboard` renders;
- invalid token redirects to `/auth/login?session=expired`;
- `POST /auth/logout` returns `200`;
- `/auth/me` after logout fails closed with the same cookie token (`401`);
- `/auth/me` after logout fails closed with the same bearer token (`401`);
- `/dashboard` after logout redirects to `/auth/login`.

Secrets, tokens, cookies, passwords, private headers, and response bodies were not written to artifacts.

## UI Clickthrough Details

Production route/module audit passed:

- public routes: `PASS:4`;
- dashboard routes: `PASS:18`;
- admin routes: `PASS:3`;
- legacy redirects: `PASS:3`.

Covered modules: auth, dashboard home, profile/exchanges, wallets, markets, strategies, backtests, bots, runtime, reports, logs, admin users, and admin subscriptions.

## Performance Sample

Five runs per endpoint all returned expected statuses:

| Endpoint | Statuses | Min ms | Max ms | Avg ms |
| --- | --- | ---: | ---: | ---: |
| API `/health` | `200:5` | 16.6 | 61.9 | 26.4 |
| API `/ready` | `200:5` | 22.6 | 25.1 | 24.0 |
| Web `/` | `200:5` | 24.7 | 98.4 | 40.4 |
| Web `/api/build-info` | `200:5` | 25.7 | 30.2 | 27.4 |
| API `/dashboard/markets/catalog` | `200:5` | 32.0 | 1787.1 | 388.2 |
| API `/admin/subscriptions/plans` | `200:5` | 30.1 | 51.2 | 35.2 |
| API `/workers/ready` | `200:5` | 20.1 | 32.4 | 29.0 |

`/dashboard/markets/catalog` had one cold sample at `1787.1 ms`; all samples still returned `200`, so this remains a watch item rather than a release blocker.

## Cleanup

- Temporary auth proof browser debugging port `127.0.0.1:9337` was checked after cleanup and was closed.
- The Edge process object for the proof profile reported `HasExited=true`.
- Temporary profile directory `.tmp/prod-auth-cdp-1782716926162` could not be removed immediately after process exit, likely due Windows file-handle release lag. No live debugging service remained.

## Residual Risk

- Host-level VPS pressure/log-window proof remains a separate Ops gate.
- Release-grade source-control/build provenance remains a separate release/source gate.
- Market catalog cold-start latency remains a recurring performance watch item.
