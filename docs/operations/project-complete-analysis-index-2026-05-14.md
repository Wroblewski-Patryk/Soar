# Project Complete Analysis Index

Generated: 2026-05-14

## Purpose

This file expands the audit-thread baseline beyond the V1 scorecard. It is the
working map for analyzing every meaningful Soar surface before future
implementation threads change behavior.

It does not claim that every possible production action was executed. It
classifies each layer as verified, deferred, or requiring deeper proof.

## Current Evidence Summary

| Layer | Current status | Evidence | Remaining proof |
| --- | --- | --- | --- |
| Root quality gates | `VERIFIED_LOCAL` | `pnpm run quality:guardrails`, `pnpm run typecheck`, `pnpm run lint`, `pnpm run build` all passed on 2026-05-14. | Rerun after every code change. |
| Web unit/component coverage | `VERIFIED_LOCAL` | Full Web Vitest passed: `149` files / `514` tests. | Manual browser state sweep for every route, viewport, and important state. |
| API unit/e2e coverage | `VERIFIED_LOCAL` | Full API Vitest passed with `--sequence.concurrent=false`. | Endpoint-by-endpoint contract ledger for all handlers. |
| Go-live smoke | `VERIFIED_LOCAL` | `pnpm run test:go-live:smoke` passed: API `45/45`, Web `18/18`. | Rerun when DB, runtime, deploy, or contract changes. |
| Static V1 issue scan | `VERIFIED_LOCAL` | `docs/operations/project-full-static-scan-2026-05-14.md`: findings `0`. | Human triage remains needed for broad non-V1 future scope. |
| V1 product action matrix | `VERIFIED_SCOPED` | Generated project index reports V1 matrix `PASS:21`. | Does not include unsafe LIVE mutation or broader Gate.io/second-LIVE production shape. |
| Web route inventory | `INDEXED` | Build produced `30` static/generated pages; source inventory found `38` `page.tsx` route files including redirects/dynamic routes. | Browser proof for all route shells and states. |
| API route inventory | `INDEXED` | `108` route handlers across `22` route files. | Endpoint contract ledger should map each handler to test file and ownership/fail-closed proof. |
| Mobile app | `DEFERRED` | `apps/mobile` is scaffold-only with README and package scripts that explicitly defer dev/build/test. | Mobile implementation requires a separate product/build mission after web+api parity gates. |
| AI assistant runtime | `PARTIALLY_VERIFIED_LOCAL` | Architecture contract exists; backend assistant orchestrator tests cover fail-closed planner failure, timeout, partial failure, trace sanitization, circuit breaker, mandate/forbidden policy. | Full `AI_TESTING_PROTOCOL.md` multi-turn prompt-injection/data-leak/unauthorized-action red-team proof is not yet recorded. |
| LIVE money mutation | `EXPLICITLY_NOT_PROVEN` | Existing proof intentionally avoided unsafe LIVE order/cancel/close and exchange-side mutation. | Requires separate explicit user/operator approval, safe resource setup, and fail-closed evidence plan. |
| Existing production data mutation | `EXPLICITLY_NOT_PROVEN` | Production proofs used disposable fixtures or read-only/protected checks. | Requires separate approval and rollback/recovery plan. |

## Static Source Marker Triage

| Marker family | Result | Interpretation |
| --- | --- | --- |
| `.skip(` | none found in active `apps`, `libs`, `scripts`, `docs` scan | No skipped test marker was found by this scan. |
| `.only(` | none found in active `apps`, `libs`, `scripts`, `docs` scan | No focused-only test marker was found by this scan. |
| `TODO/FIXME/HACK/XXX` | only found in `scripts/runV1StaticIssueScan.mjs` rule definitions | No active implementation TODO/FIXME/HACK marker was found by this scan. |
| `not implemented / unsupported / placeholder` | present | Mostly accepted fail-closed exchange capability contracts, deterministic icon placeholders, ops script errors, historical docs, and mobile scaffold. These are not all defects; classify per surface before fixing. |

## Web Route Analysis Queue

All routes below exist as source route files and should receive manual/browser
state proof over time. The build already passed, so the next gap is rendered
behavior and state coverage, not route compilation.

| Route family | Route count | Current automated confidence | Next proof |
| --- | ---: | --- | --- |
| Public/Auth/Offline | 4 | Auth tests and route build passed. | Browser proof for login/register/session-expired/offline states. |
| Admin | 3 | Admin page tests exist for users/subscriptions; route build passed. | Authenticated admin browser clickthrough and permission fail-closed proof. |
| Dashboard Home | 1 | Heavy component coverage and production UX proof exist. | Fresh local browser proof after any UI/data changes. |
| Bots | 9 | Bots feature tests and runtime proofs exist. | Browser proof for list/create/edit/detail/preview/runtime/assistant redirects and state coverage. |
| Wallets | 6 | Wallet tests exist; redirect routes build. | Browser proof for list/create/edit/detail/preview plus reset/empty/error states. |
| Markets | 3 | Market form/table tests exist. | Browser proof for list/create/edit and catalog/fail-closed states. |
| Strategies | 4 | Strategy form/list tests exist. | Browser proof for list/create/detail/edit and active-bot lock states. |
| Backtests | 3 | Backtest list/create/details tests exist. | Browser proof for create/list/detail/timeline/report states. |
| Exchanges/Profile/Reports/Logs | 4 | Focused feature tests exist. | Browser proof for empty/error/success/filter/security states. |

Note: there are no standalone `/dashboard/orders` or `/dashboard/positions`
page routes. Orders and Positions are owned by Dashboard Home/Bot Runtime
surfaces per `docs/modules/web-dashboard-home.md` and existing V1 evidence.

## API Route Analysis Queue

The current route inventory has `108` route handlers. The next audit should
turn this into an endpoint contract ledger: method/path, auth/role/ownership,
validation, happy path, fail-closed path, test file, and production-safe proof.

| API module | Route handlers | Test files | Current interpretation |
| --- | ---: | ---: | --- |
| admin | 4 | 2 | Covered by admin e2e; needs endpoint ledger. |
| auth | 4 | 5 | Strong local/session proof plus production auth proof. |
| backtests | 7 | 12 | Strong local and production disposable run proof. |
| bots | 31 | 31 | Largest API surface; strong local proof, still best candidate for endpoint ledger first. |
| engine | 0 public routes | 45 | Runtime/internal engine heavily tested. |
| exchange | 0 public routes | 16 | Adapter-boundary tests cover capability/fail-closed behavior. |
| icons | 1 | 1 | Local icon fallback proof passed. |
| isolation | 0 public routes | 1 | Data-isolation proof exists. |
| logs | 1 | 1 | Audit read/filter proof exists. |
| market-data | 0 public routes | 2 | Internal market-data tests exist. |
| markets | 6 | 1 | Covered by e2e; needs endpoint ledger for all handlers. |
| market-stream | 1 | 6 | Stream/fanout route tests exist. |
| orders | 6 | 10 | Strong local and production PAPER proof; LIVE mutation remains out of scope. |
| pagination | 0 public routes | 1 | Utility coverage exists. |
| positions | 9 | 11 | Strong local and production PAPER proof; LIVE mutation remains out of scope. |
| profile | 15 | 6 | Basic/security/subscription/API-key routes covered. |
| reports | 1 | 1 | Report aggregation/readback proof exists. |
| strategies | 8 | 3 | Strategy CRUD/validation proof exists; endpoint ledger still useful. |
| subscriptions | 0 public direct routes | 1 | Entitlement service covered; public/admin access through profile/admin routes. |
| upload | 1 | 1 | Upload route has unsupported mime proof. |
| users | 0 public direct routes | 0 | Internal/user helper module only in current route map. |
| wallets | 11 | 4 | Wallet CRUD/reset/preview tests exist; endpoint ledger still useful. |

## Deferred Or Explicitly Bounded Areas

| Area | Classification | Reason | Required before calling complete |
| --- | --- | --- | --- |
| Mobile client | `DEFERRED` | `apps/mobile` is documented bootstrap only. | Product decision, app blueprint, implementation, tests, build, device/browser proof. |
| Full AI behavior | `NEEDS_DEEP_AUDIT` | Assistant runtime is scaffolded/tested for deterministic safety mechanics, but no complete AI multi-turn red-team report is recorded. | Run `AI_TESTING_PROTOCOL.md` scenarios against the actual assistant surface or explicitly keep AI advisory/scaffolded. |
| LIVE order submit/cancel/close | `NEEDS_EXPLICIT_APPROVAL` | Money-impacting production mutation was intentionally excluded from V1 proof. | Owner approval, safe test account/resource, risk ack, rollback/reconciliation plan, fail-closed proof. |
| Gate.io/second-LIVE production shape | `DEFERRED_RESOURCE_SHAPE` | Production resource shape was unavailable/deferred in existing evidence. | Create approved resource shape and rerun runtime/exchange proof lane. |
| Existing production data mutation | `NEEDS_EXPLICIT_APPROVAL` | Existing data was not mutated; disposable fixtures were used. | Owner approval, backup/restore plan, rollback, audit evidence. |
| Manual browser state coverage for every route | `NEEDS_DEEP_AUDIT` | Automated tests/build pass, but route-by-route UI states were not exercised in this checkpoint. | Browser route-state sweep with desktop/tablet/mobile, auth gates, loading/empty/error/success where relevant. |

## Recommended Audit Order

1. `PROJECT-ROUTE-STATE-AUDIT-2026-05-14`: browser-driven route-state proof for all Web routes, starting with Dashboard Home, Bots, Wallets, Markets, Strategies, Backtests, Profile, Reports, Logs, Admin, Auth.
2. `PROJECT-API-ENDPOINT-LEDGER-2026-05-14`: endpoint-by-endpoint API ledger for all `108` handlers.
3. `PROJECT-AI-ASSISTANT-SAFETY-AUDIT-2026-05-14`: classify assistant as scaffold/advisory or run the full AI red-team protocol.
4. `PROJECT-MOBILE-SCOPE-DECISION-2026-05-14`: decide whether mobile remains deferred or becomes an implementation mission.
5. `PROJECT-LIVE-MUTATION-PROOF-PLAN-2026-05-14`: only if the user explicitly approves live-money proof.

## Current Verdict

The current repository has strong local Web/API evidence and a clean V1 static
scan. The project is not yet literally analyzed in every possible runtime
dimension because mobile, full AI behavior, every-route browser states, every
API handler ledgering, and unsafe/live production mutation proof are separate
audit lanes. Those lanes are now explicitly indexed instead of hidden.
