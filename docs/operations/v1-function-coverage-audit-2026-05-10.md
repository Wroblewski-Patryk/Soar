# V1 Function Coverage Audit

## Executive Answer
- Status: **not 100% release-ready / NO-GO**
- Evidence date: 2026-05-10
- Scope: function and module coverage across architecture, UI, API, tests, and
  production evidence.

Soar V1 is broadly implemented across the documented architecture. The current
remaining gap is not a large known rewrite. It is protected production proof and
formal release approval:

1. `LIVEIMPORT-03` protected production runtime readback is still missing.
2. Rollback proof is fresh but failed until protected rollback auth is supplied.
3. Authenticated dashboard/admin UI clickthrough is still missing.
4. RC Gate 2/Gate 4 approval/sign-off/checklist are still failed/open.
5. The final release gate still needs a non-dry-run execution after the above
   evidence exists.

Until those are closed, a live bot should not be treated as "100% proven" for
live-money operation, even though the live order code paths are implemented
through the exchange adapter boundary.

## Evidence Inputs
- Architecture source:
  - `docs/architecture/README.md`
  - `docs/architecture/01_overview-and-principles.md`
  - `docs/architecture/architecture-source-of-truth.md`
  - `docs/architecture/reference/dashboard-route-map.md`
  - `docs/modules/system-modules.md`
- Current final preflight:
  - `docs/operations/v1-final-preflight-82205329-2026-05-10.md`
- Current no-auth production UI clickthrough:
  - `docs/operations/prod-ui-module-clickthrough-88313309-2026-05-10.md`
- Prior confidence audit:
  - `docs/operations/v1-coverage-confidence-audit-2026-05-10.md`

## Repository Coverage Inventory
| Surface | Count | Meaning |
| --- | ---: | --- |
| Web `page.tsx` routes | 38 | Public, dashboard, admin, redirect/legacy route surfaces exist in the app tree. |
| API module directories | 22 | Current backend module map is implemented as module directories. |
| Web feature directories | 16 | Current frontend feature map is represented in `apps/web/src/features`. |
| API test files | 180 | Broad API, e2e, runtime, exchange, auth, and ops test coverage exists. |
| Web test files | 145 | Broad Web component, route, i18n, layout, and feature test coverage exists. |

These counts prove breadth, not final live readiness. Final V1 still depends on
protected production evidence.

## Function Coverage Matrix
| Function / Module Area | Implementation Status | Current Evidence Status | Remaining Gap |
| --- | --- | --- | --- |
| Public app and auth pages | Implemented | Public production routes PASS | None for public reachability. |
| Auth/session guardrails | Implemented | Dashboard/admin no-auth routes fail closed to `/auth/login` | Authenticated production journey still needs UI clickthrough. |
| Dashboard home/runtime summary | Implemented locally | Production route is `BLOCKED_AUTH` without app auth | Authenticated dashboard data proof. |
| Exchanges/API keys | Implemented via profile/exchange boundary | Production route is `BLOCKED_AUTH` | Authenticated UI proof and real key/operator readback. |
| Wallets/capital context | Implemented for V1 workflows | Production route is `BLOCKED_AUTH` | Authenticated UI proof; richer LIVE wallet ledger remains documented target extension, not current V1 release proof. |
| Markets | Implemented | Production route is `BLOCKED_AUTH` | Authenticated UI proof. |
| Strategies | Implemented | Production route is `BLOCKED_AUTH` | Authenticated UI proof. |
| Backtests | Implemented with parity coverage | Production route is `BLOCKED_AUTH` | Authenticated UI proof; no current broad backtest implementation gap found. |
| Bots/runtime | Implemented with broad local runtime coverage | Production route is `BLOCKED_AUTH` | `LIVEIMPORT-03`, protected runtime readback, authenticated UI proof. |
| Paper mode | Implemented through shared runtime/exchange capabilities | Public deploy evidence exists | Protected dashboard/runtime readback still needed for final V1 confidence. |
| Live mode | Implemented through exchange adapter boundary | Not accepted as production-proven | Protected runtime readback, rollback proof PASS, RC approval. |
| Gate.io second exchange | Implemented through exact adapter operations for public data, paper pricing, API-key probe, authenticated snapshots, cashflow, live submit, and live cancel | Public deploy evidence exists for implementation line | Real protected account proof and UI readback. |
| Orders and positions | Implemented through API modules and runtime/exchange boundaries | Local and public evidence exists | Protected live import/readback proof. |
| Reports | Implemented | Production route is `BLOCKED_AUTH` | Authenticated UI proof. |
| Logs/audit trail | Implemented | Production route is `BLOCKED_AUTH` | Authenticated UI proof. |
| Admin users/subscriptions | Implemented and protected by admin role | Production routes are `BLOCKED_AUTH` without admin auth | Authenticated admin proof. |
| Workers/ops endpoints | Implemented and protected | No-auth checks return protected `401` where expected | Authenticated ops proof for Gate 2/SLO and rollback lanes. |
| Production DB restore | Implemented as ops evidence lane | Fresh PASS restore drill exists | No current blocker in latest preflight. |
| Rollback proof | Tooling exists and fails closed | Fresh FAIL evidence exists | Protected rollback auth and PASS artifact. |
| RC/release gate | Tooling exists and blocks unsafe release | Fresh failed/open RC evidence exists | Real Gate 2/Gate 4 approval, sign-off, checklist, final non-dry-run gate. |

## Current Final Blockers
From the current final preflight:

- `env:liveimport auth`
- `env:rollback guard auth`
- `evidence:rcExternalGateStatus:failed`
- `evidence:rcSignoffRecord:failed`
- `evidence:rcChecklist:failed`
- `evidence:liveImportReadback:missing`
- `evidence:rollbackProof:failed`

This is an important distinction: public production availability is passing,
but protected runtime/release evidence is not complete.

## Can Live Bots Be Enabled Now?
Not as a fully accepted V1 release.

The code path is intended to go through the existing exchange adapter boundary,
not a side-channel integration. Gate.io and Binance live submit/cancel support
are represented in the implementation line. However, V1 live operation still
needs protected evidence proving that the production app, runtime readback,
rollback guard, authenticated UI, and RC approval all work together.

## What Is Missing In Plain Language
What does **not** appear to be missing as a broad code implementation:

- No broad missing dashboard module was found in the route/module inventory.
- No obvious current Gate.io adapter operation gap was found for the V1 scope
  after the latest submit/cancel work.
- No architecture mismatch requiring a new system was found in this audit.

What is still missing before V1 can be called done:

- Real Soar production auth for `LIVEIMPORT-03`.
- Real rollback guard auth and a rollback proof artifact that reports PASS.
- Real dashboard/admin credentials and representative production data for the
  UI clickthrough.
- Authenticated 30-minute production SLO/Gate 2 evidence.
- Named Engineering, Product, Operations, and RC owner approval/sign-off.
- Final V1 preflight and final V1 release gate passing without dry-run.

## Recommended Next Execution Order
1. Provide `LIVEIMPORT_READBACK_AUTH_TOKEN` or
   `LIVEIMPORT_READBACK_AUTH_EMAIL` plus `LIVEIMPORT_READBACK_AUTH_PASSWORD`.
2. Run `ops:liveimport:readback` using the build-info-derived `$expectedSha`.
3. Provide `ROLLBACK_GUARD_AUTH_TOKEN` or
   `ROLLBACK_GUARD_AUTH_EMAIL` plus `ROLLBACK_GUARD_AUTH_PASSWORD`.
4. Run rollback proof until it reports PASS.
5. Provide `PROD_UI_AUDIT_*` dashboard/admin credentials and representative
   route IDs, then rerun `ops:ui:prod-clickthrough`.
6. Run authenticated Gate 2 SLO evidence for the required window.
7. Refresh RC gates, sign-off, and checklist with real named approvers until
   all required gates are PASS/APPROVED.
8. Run final V1 preflight and the final V1 release gate without `--dry-run`.

## Operator Summary
The project looks close because the remaining list is narrow. It is still not
safe to call "100%" because the remaining items are exactly the high-risk proof
lanes: live runtime readback, rollback, authenticated UI, SLO, and release
approval. The next useful work is evidence collection with protected operator
inputs, not another broad implementation pass.
