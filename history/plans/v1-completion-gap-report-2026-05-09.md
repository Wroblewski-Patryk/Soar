# V1 Completion Gap Report

Date: 2026-05-09

## Short Answer

Soar is not blocked by one broad missing application. Most core V1 pieces are
implemented and locally covered. The project is blocked by a smaller number of
high-impact gaps:

1. protected production evidence is still missing for live runtime readback,
   rollback, current-date restore evidence, RC approval, and authenticated UI
   clickthrough
2. Gate.io is only a public market-data foundation today, not a complete paper
   or live exchange
3. production UI is proven only for public/no-auth routes, not authenticated
   dashboard/admin journeys
4. final V1 release preflight is correctly `BLOCKED`
5. a few product-scope items in `docs/product/product.md` remain broader than
   the current launch-closure evidence, especially rich manual trade ticket UX
   and full second-exchange paper/live production proof

In plain language: the system is close as a Binance-first plus Gate.io-capable
V1 foundation with
strong local and public-production evidence, but it is not yet safe to call
"100% ready to run bots in production" until the protected evidence pack and
authenticated UI audit are completed. Gate.io paper/live implementation has
advanced, but it still needs protected production proof before it can be called
operationally ready.

## Evidence Reviewed

- `docs/product/product.md`
- `docs/modules/system-modules.md`
- `docs/architecture/README.md`
- `docs/architecture/reference/exchange-access-ownership-matrix.md`
- `history/evidence/second-exchange-live-readiness-plan-2026-05-08.md`
- `history/audits/prod-ui-module-clickthrough-audit-plan-2026-05-08.md`
- `history/releases/v1-final-preflight-e8cd748e-2026-05-09.md`
- `history/evidence/v1-protected-access-readiness-2026-05-09.md`
- `history/plans/v1-final-blocker-execution-pack-2026-05-07.md`
- `.agents/state/next-steps.md`
- `.agents/state/system-health.md`
- `.agents/state/known-issues.md`
- `.codex/context/TASK_BOARD.md`

## Current Production Posture

| Area | Status | Evidence | Meaning |
| --- | --- | --- | --- |
| Latest public deploy | PASS | `e8cd748e80b8693087e01beb21b0085ace747c49` build-info and smoke | Production public surface is reachable. |
| API `/health` and `/ready` | PASS | deploy smoke for `e8cd748e` | Public API is healthy/readiness-reachable. |
| Web `/` | PASS | deploy smoke for `e8cd748e` | Public Web shell is reachable. |
| No-secret final preflight | BLOCKED | `history/releases/v1-final-preflight-e8cd748e-2026-05-09.md` | Public checks pass, protected/formal evidence is missing. |
| Authenticated dashboard/admin UI | BLOCKED | `history/audits/prod-ui-module-clickthrough-audit-plan-2026-05-08.md` | Needs production user/admin access and representative data. |
| Live runtime production readback | BLOCKED | `LIVEIMPORT-03` is missing | Needs approved read-only production app auth. |
| Rollback proof | BLOCKED | rollback guard auth missing / proof stale | Needs protected rollback auth and fresh PASS artifact. |
| Restore drill for current evidence date | BLOCKED | 2026-05-09 preflight sees stale 2026-05-08 evidence | Needs current-date production DB/Coolify context or accepted fresh evidence. |
| RC approval | BLOCKED | RC artifacts fresh but failed | Needs real approver identities and final approval. |

## Capability Matrix

| Capability / Module | Implemented? | Locally tested? | Production public evidence? | Protected production evidence? | Gap to 100% |
| --- | --- | --- | --- | --- | --- |
| Authentication/public access | yes | yes | yes | partial | Authenticated production session audit still needed. |
| Dashboard runtime read model | yes | yes | public deploy only | missing | Needs authenticated clickthrough and protected runtime readback. |
| Binance PAPER runtime | yes | yes | deploy contains code | missing final protected proof | Needs production evidence that runtime rows and dashboard state behave correctly under real operator context. |
| Binance LIVE runtime | yes with safety gates | yes | deploy contains code | missing | Needs `LIVEIMPORT-03`, rollback proof, RC approval, and operator acceptance before live-money confidence. |
| Backtests | yes | yes | route reachable only when authenticated audit runs | missing UI clickthrough | Needs authenticated production run/list/detail verification with test data. |
| Wallets | yes | yes | public route gate only | missing UI clickthrough | Needs authenticated create/edit/preview audit with safe test data. |
| Markets | yes | yes | public route gate only | missing UI clickthrough | Needs authenticated catalog/universe flow audit. |
| Strategies | yes | yes | public route gate only | missing UI clickthrough | Needs authenticated create/edit/list audit. |
| Bots UI | yes | yes | public route gate only | missing UI clickthrough | Needs create/edit/activate/runtime/assistant audit. |
| Reports/logs | yes | yes | public route gate only | missing UI clickthrough | Needs authenticated data and filter/pagination checks. |
| Admin | scaffolding/current route scope exists | some local coverage implied by docs | public route gate only | missing admin clickthrough | Needs admin account and safe representative data. |
| Gate.io public catalog/data | yes | yes | deployed foundation exists | public-only | Public market-data foundation is available. |
| Gate.io paper bot support | yes after `EXCHANGE2-23` | focused API/Web tests pass | not yet deployed | n/a | Deploy and click through Gate.io PAPER wallet/bot setup for production evidence. |
| Gate.io authenticated reads | yes for current readback scope | API-key probe, balance preview, positions snapshot, open-orders snapshot, trade-history snapshot, and wallet cashflow history yes | n/a | n/a | Production protected readback and authenticated UI evidence are still needed before claiming end-to-end operational readiness. |
| Gate.io live order submit | implemented | mocked boundary tests pass | deployed for `04a4204c` | protected evidence missing | Needs production protected readback and explicit operator approval before live-money confidence. |
| Exchange-side cancel | implemented for Binance/Gate.io through canonical boundary | focused mocked boundary/orders tests pass | deploy pending for this slice | protected evidence missing | Needs production protected readback and explicit operator approval before live-money confidence. |

## What Is Not Missing

- A module map exists for API and Web surfaces.
- The architecture has clear ownership boundaries for runtime, exchange access,
  execution lifecycle, dashboard routes, and safety gates.
- Binance-first runtime, orders, positions, bots, backtests, market stream, and
  dashboard read-model work has substantial local and deployment evidence.
- Public production health/build-info/smoke checks are working.
- Unsupported exchange operations fail closed instead of silently falling back.
- Gate.io is registered through approved exchange boundaries for public
  metadata/market-data foundation.

## Real Gaps Remaining

### P0 - Required Before Saying V1 Is Production-Ready

1. **Run authenticated `LIVEIMPORT-03` production readback**
   - Required input:
     `LIVEIMPORT_READBACK_AUTH_TOKEN` or
     `LIVEIMPORT_READBACK_AUTH_EMAIL` + `LIVEIMPORT_READBACK_AUTH_PASSWORD`.
   - Required evidence:
     protected runtime positions payload with ownership, strategy provenance,
     TTP/DCA context, actionable state, and import completeness.

2. **Run production rollback proof**
   - Required input:
     `ROLLBACK_GUARD_AUTH_TOKEN` or
     `ROLLBACK_GUARD_AUTH_EMAIL` + `ROLLBACK_GUARD_AUTH_PASSWORD`.
   - Required evidence:
     fresh rollback proof artifact with PASS posture.

3. **Refresh production restore evidence for the active evidence date**
   - Current preflight for 2026-05-09 classifies restore evidence as stale
     because it finds 2026-05-08 evidence.
   - Required input:
     production DB/Coolify context, or an accepted operator path that can run
     the restore drill against the production container.

4. **Complete real RC Gate 4 approval**
   - Required input:
     Engineering, Product, Operations, and RC owner identities/contact.
   - Required evidence:
     RC external gates all PASS, sign-off APPROVED, checklist G4 PASS.

5. **Execute authenticated/admin production UI clickthrough**
   - Required input:
     production dashboard user, production admin user, representative safe test
     data, and explicit approval before live-money/destructive actions.
   - Required evidence:
     route/action matrix with PASS/FAIL/BLOCKED, screenshots or notes,
     console/network findings, and architecture-alignment findings.

### P1 - Required For Gate.io Beyond Public PAPER Runtime

1. **Production-prove Gate.io authenticated reads**
   - `API_KEY_PROBE` is now implemented for credential validation only
   - `BALANCE_PREVIEW` is now implemented for wallet balance preview only
   - `POSITIONS_SNAPSHOT` is now implemented for exchange positions snapshot only
   - `OPEN_ORDERS_SNAPSHOT` is now implemented for exchange open-orders snapshot only
   - `TRADE_HISTORY_SNAPSHOT` is now implemented for executed-trade snapshots only
   - `WALLET_CASHFLOW_HISTORY` is now implemented for ledger/performance
     analytics reads
   - remaining gap: protected production readback and authenticated UI evidence

2. **Production-prove Gate.io live submit**
   - Exact submit support through `liveOrderAdapter.service.ts` is implemented.
   - Quantity/precision/min-notional/leverage/margin/fee handling is covered by
     canonical boundary and pretrade guard tests.
   - Protected production evidence and explicit operator approval are still
     required before live-money confidence.

3. **Production-prove exchange-side cancel**
   - `LIVE_ORDER_CANCEL` is now implemented for Binance and Gate.io through
     the canonical boundary.
   - The remaining gap is protected production evidence and explicit operator
     approval before live-money confidence.

### P2 - Product/UX Confidence Gaps

1. **Rich manual trade ticket UX**
   - Product docs still call richer manual ticket workflows a current
     limitation/API-first area.
   - If "100%" means user-friendly manual trading from UI, this remains work.

2. **Full production data journey polish**
   - Backtests, reports, logs, wallets, strategies, markets, bots, and admin
     need authenticated production clickthrough with real/representative data.

3. **Historical source-of-truth cleanup**
   - There is a lot of historical evidence and repeated deploy-status churn.
   - This is not a runtime blocker, but it makes status hard to read and should
     be condensed after the release answer is accepted.

## Simple Readiness Buckets

| Bucket | Items |
| --- | --- |
| Can be trusted now | Public production health/readiness, public Web reachability, build-info, no-auth redirects, local fail-closed exchange gates. |
| Implemented but needs production proof | Binance PAPER/LIVE runtime, dashboard runtime data, `LIVEIMPORT-03`, rollback, restore, authenticated UI flows. |
| Not implemented as usable capability | Rich manual trade ticket UX. |
| Needs operator/user input | Production app auth, admin auth, rollback auth, DB/Coolify restore context, RC approver identities, explicit live-money approval. |

## Recommended Completion Plan

1. **Stop adding general docs evidence unless it closes a real blocker.**
   The public deploy/evidence loop is healthy enough.
2. **Collect protected operator inputs.**
   Without these, the remaining V1 release blockers cannot be honestly closed.
3. **Run the final blocker pack in order.**
   Use `history/plans/v1-final-blocker-execution-pack-2026-05-07.md`.
4. **Run authenticated production UI clickthrough.**
   Use `history/audits/prod-ui-module-clickthrough-audit-plan-2026-05-08.md`.
5. **Decide Gate.io V1 target.**
   Choose one:
   - public market data only for V1
   - paper bot support next
   - authenticated reads next
   - live submit next
6. **Only after that, enable capability flags.**
   Gate.io should remain fail-closed until exact operation support and evidence
   exist.

## Best Direct Answer To The User

The app is not "far from existing"; most of it exists. What is missing is
mostly proof and protected access for Binance-first live readiness, plus real
implementation for Gate.io paper/live. If the goal is:

- **Run Binance paper bots:** likely close, but still needs authenticated
  production UI/runtime proof.
- **Run Binance live bots safely:** not ready until `LIVEIMPORT-03`, rollback,
  restore/current-date, RC approval, and authenticated UI audit are complete.
- **Run Gate.io paper bots:** implementation is now enabled through
  `EXCHANGE2-23`; it still needs deployment freshness and authenticated
  production UI clickthrough before calling it fully production-proven.
- **Run Gate.io live bots:** not ready; authenticated reads/live submit/cancel
  are not implemented.

## Next Evidence To Collect

1. `LIVEIMPORT-03` protected runtime readback.
2. rollback proof PASS.
3. current-date restore drill PASS.
4. RC Gate 4 approval PASS.
5. authenticated/admin production UI clickthrough.
6. Gate.io operation decision and first exact implementation slice.
