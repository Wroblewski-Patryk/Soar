# LUC-6248 Authenticated Production Acceptance And Performance Sweep

## Status

- Result: `PASS / VERIFIED_PRODUCTION / AUTHENTICATED_ACCEPTANCE_PASS / PERFORMANCE_PASS / RUNTIME_HEALTHY`
- Environment: production
- Evidence date: 2026-06-29
- Issue: LUC-6248
- Production Web SHA: `c357d957741f56835f27a1fc3a948dad43a91036`
- Production Web ref: `main`
- Scope: read-only QVE production acceptance. No deploy, push, restart,
  rollback execution, env edit, secret/account readback, DB/Redis mutation,
  production account mutation, subscription/payment mutation, exchange
  mutation, order, position, or live-trading action.

## Verification

| Gate | Result | Evidence |
| --- | --- | --- |
| Build-info readback | PASS | Web `/api/build-info` returned SHA `c357d957741f56835f27a1fc3a948dad43a91036`, build id `Q8qE8D5gjr56ByYySof9J`, ref `main`, metadata source `env-runtime`. |
| Deploy smoke, unauthenticated/default binding | PARTIAL / FAIL-CLOSED | Public API/Web rows passed; protected API `/workers/ready` returned `401` because this QVE runner had no current `SMOKE_AUTH_*` binding. |
| Deploy smoke, authenticated audit-login binding | PASS | API `/health`, API `/ready`, Web `/`, Web `/api/build-info`, and protected API `/workers/ready` all passed. |
| Auth session browser proof | PASS | `history/evidence/luc-6248-prod-auth-session-browser-proof-2026-06-29.md`; raw JSON `history/artifacts/luc-6248-prod-auth-session-browser-proof-2026-06-29.json`. |
| UI module clickthrough | PASS | `history/evidence/luc-6248-prod-ui-module-clickthrough-2026-06-29.md`; raw JSON `history/artifacts/luc-6248-prod-ui-module-clickthrough-2026-06-29.json`. |
| Runtime freshness, unauthenticated/default binding | FAIL-CLOSED | `/workers/runtime-freshness` returned `401` when no auth binding was supplied. |
| Runtime freshness, authenticated audit-login binding | PASS | Worker heartbeat age `8372 ms`, market data age `8372 ms`, runtime signal lag `0`, and `5` runtime sessions healthy. |
| Rollback guard, unauthenticated/default binding | FAIL-CLOSED | Guard returned `shouldRollback=true` only because protected endpoints returned `401`. |
| Rollback guard, authenticated audit-login binding | PASS | `shouldRollback=false`, workers ready/topology healthy, runtime freshness PASS, alerts empty. |
| Performance timing sample | PASS | `history/artifacts/luc-6248-production-performance-timing-2026-06-29.json`. |

## Auth Session Proof Details

The production auth-session proof verified the previously repaired
logout/session-invalidation behavior:

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
| API `/health` | `200:5` | 16.5 | 76.4 | 31.2 |
| API `/ready` | `200:5` | 26.4 | 151.1 | 81.3 |
| Web `/` | `200:5` | 30.5 | 190.2 | 63.2 |
| Web `/api/build-info` | `200:5` | 23.9 | 26.7 | 25.4 |
| API `/dashboard/markets/catalog` | `200:5` | 33.2 | 1506.7 | 331.2 |
| API `/admin/subscriptions/plans` | `200:5` | 30.4 | 58.4 | 38.2 |
| API `/workers/ready` | `200:5` | 21.2 | 35.6 | 27.5 |

`/dashboard/markets/catalog` had one cold sample at `1506.7 ms`; all samples
returned `200`, so this remains a watch item rather than a release blocker.

## Cleanup

- The auth proof parent shell timed out after writing a `PASS` artifact.
- Temporary Edge validation processes created by the proof were terminated by
  specific PID after the artifact was inspected.
- A final narrow process check showed no remaining `msedge`, Chrome,
  `chrome-headless-shell`, Chromium, product server, Docker, database,
  Playwright, or dev-server process started by this task.

## Paperclip Control-Plane Update

- Attempted to PATCH [LUC-6248](/LUC/issues/LUC-6248) to `done` with the
  closure summary.
- Result: unconfirmed. The PATCH timed out, and follow-up short probes to
  `/api/health`, `/health`, and
  `/api/issues/LUC-6248/heartbeat-context` all aborted after the local timeout.
- Local disposition: product verification is `DONE`; Paperclip board status
  still needs the same closure summary applied when the control-plane API is
  reachable.

## Residual Risk

- Host-level VPS pressure/log-window proof remains a separate Ops gate.
- Release-grade source-control/build provenance remains a separate release/source
  gate because production build-info uses `metadataSource=env-runtime`.
- Market catalog cold-start latency remains a recurring performance watch item.
- Runner default `SMOKE_AUTH_*`, `DEPLOY_FRESHNESS_*`, and
  `ROLLBACK_GUARD_*` bindings were not present for this QVE heartbeat; the
  accepted proof used the existing audit-login binding through environment-only
  secret paths.
