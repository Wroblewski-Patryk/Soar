# V1 Product Action Audit Matrix

Date: 2026-05-10
Status: `NO-GO`
Scope: user-visible V1 behavior across UI, API, workers, adapters, persistence,
validation, and error handling.

## Why This Exists

Recent evidence proved that production could deploy, public health checks
passed, and protected routes were reachable after login. It did not prove that
every action available in the UI behaves correctly on representative data. The
operator then found basic functional failures in Bots deletion and Dashboard
runtime table semantics. Therefore route reachability and "module present"
evidence is no longer enough for V1 readiness.

## Status Vocabulary

- `PASS`: verified with a focused automated or manual action proof.
- `PASS_LOCAL`: verified with focused local automated proof; production-safe
  clickthrough may still be separate.
- `PARTIAL_LOCAL`: part of the row has focused local proof, but remaining
  action families in that module still need proof.
- `FAIL`: confirmed broken or semantically wrong.
- `UNVERIFIED`: route or code exists, but action-level proof is missing.
- `BLOCKED_AUTH`: needs valid production auth or protected operator auth.
- `BLOCKED_RISK`: would be destructive, live-money, or irreversible without an explicit safe test plan.
- `N/A`: not part of current V1 behavior.

## Current Confirmed Findings

| ID | Area | Status | Finding | Evidence / Fix Target |
| --- | --- | --- | --- | --- |
| PAA-001 | Bots | `PASS_LOCAL` | PAPER bot deletion cleanup is locally regression-locked, including runtime-linked records and broader Bots CRUD/runtime action contracts. | `BotsListTable.test.tsx` (`4/4`), `bots.e2e.test.ts` (`27/27`), `bots.duplicate-guard.e2e.test.ts` (`6/6`), `runtimeSessionPositionCommand.service.test.ts` (`11/11`) |
| PAA-002 | Dashboard runtime positions | `PASS_LOCAL` | Prospective TTP is hidden when live PnL is zero or negative; backend/runtime TTP remains visible as runtime truth and suppresses TSL. Negative PnL, TSL-only, non-actionable row actions, and order cancelability are locally regression-locked at presenter level. | `runtimeDerivations.test.ts`, `runtimeDataTablePresenters.test.tsx` (`24/24`) |
| PAA-003 | V1 evidence model | `FAIL` | Previous summaries overstated readiness by treating deploy/reachability as functional completeness. | This matrix replaces broad readiness claims until action proofs pass |
| PAA-004 | Bots | `PASS_LOCAL` | Bots list delete success/failure, backend CRUD/runtime close/market-group/strategy-link/ownership contracts, and duplicate active guards now have focused local action evidence. | `BotsListTable.test.tsx` (`4/4`), `bots.e2e.test.ts` (`27/27`), `bots.duplicate-guard.e2e.test.ts` (`6/6`), `runtimeSessionPositionCommand.service.test.ts` (`11/11`) |

## Module Action Matrix

| Module | Action Family | Required Proof | Current Status | Notes |
| --- | --- | --- | --- | --- |
| Auth | login, logout, session refresh, expired session redirects | browser + API auth lifecycle | `UNVERIFIED` | Route auth was checked; session edge cases need action proof |
| Profile | basic profile update, password/security update | UI form submit + API validation | `UNVERIFIED` | Must include error and success states |
| Profile API Keys | create/test/delete keys, futures-only handling, unsupported exchange handling | UI action + API probe + audit log | `UNVERIFIED` | Binance/Gate.io probe unit coverage exists; UI action proof still needed |
| Subscriptions/Admin | entitlement gates, admin user view/actions | protected UI + API ownership checks | `BLOCKED_AUTH` | Needs admin auth and non-destructive data set |
| Wallets | create/edit/delete, paper/live wallet modes, balance preview, reset/repair flows | UI action + API + DB/state readback | `UNVERIFIED` | User allowed cleanup earlier, but production destructive actions still need safe fixture data |
| Markets | universe create/edit/delete, symbols import, capability guards | UI action + API + adapter capability | `UNVERIFIED` | Must verify active bot guard behavior |
| Strategies | create/edit/delete/clone, RSI 20/80 preserved, config validation | UI action + API + runtime/backtest compatibility | `UNVERIFIED` | Do not delete the preserved RSI 20/80 strategy |
| Bots | create/edit/delete, activate/deactivate, PAPER/LIVE mode, assistant config, market groups, strategy links | UI action + API + DB/runtime readback | `PASS_LOCAL` | Local safe-fixture action proof covers list delete success/failure, API CRUD/delete/runtime close, ownership, market groups, strategy links, LIVE opt-in guards, duplicate active guards, and runtime monitoring. Production clickthrough remains separate and must be non-destructive. |
| Bot Runtime | runtime graph, sessions, symbol stats, open positions, open orders, trades | UI table proof + API + worker telemetry | `PARTIAL_LOCAL` | Runtime table presenters now cover open-position PnL/TTP/TSL/actionability and open-order cancelability locally. Worker telemetry and representative running/stopped PAPER session proof remain open. |
| Dashboard Home | selected bot, wallet KPIs, positions/orders/trades tables, TTP/TSL/DCA/PnL rendering | UI table assertions + runtime payload fixtures | `PARTIAL_LOCAL` | Runtime table presenter proof now covers negative/zero/positive protection semantics, DCA/fees/history/trade metadata, blocked position actions, and order cancelability. Broader rendered component/browser proof for selected bot, wallet KPIs, loading/empty/error, responsive, and production-safe clickthrough remains open. |
| Manual Orders | place PAPER order, validation, preview/context, cancel/close paths | UI action + API + DB readback | `UNVERIFIED` | LIVE order actions are `BLOCKED_RISK` |
| Positions | list, close, update, takeover, import status, live reconciliation | UI/API action proof + exchange snapshot boundary | `UNVERIFIED` | LIVE exchange mutation requires explicit safe plan |
| Orders | list, cancel, exchange-backed cancel, order fills, fees | UI/API action proof + adapter boundary | `UNVERIFIED` | Exchange-side cancel support exists, but production action proof is risky |
| Backtests | create run, cancel/delete/view details, reports/timeline | UI action + worker/result readback | `UNVERIFIED` | Needs representative RSI strategy and market data |
| Reports | filters, summaries, export/download if present | UI action + API data proof | `UNVERIFIED` | Route evidence is not enough |
| Logs/Audit Trail | filters, pagination, action log visibility | UI action + API ownership proof | `UNVERIFIED` | Must include events produced by this audit |
| Exchange Adapter | Binance/Gate.io capabilities, public data, authenticated reads, submit/cancel | adapter contract tests + fail-closed proofs | `UNVERIFIED` | Many focused tests exist; consolidate by operation |
| Workers | runtime loops, market stream, backtest worker, scheduler lifecycle | process health + action result proof | `UNVERIFIED` | Public `/ready` is insufficient |
| Operations | deploy, rollback, restore, release gate, SLO, alerts | existing ops proofs + protected evidence | `BLOCKED_AUTH` | Still requires rollback proof PASS, liveimport readback, SLO |
| Security/Privacy | ownership isolation, rate limits, secret redaction, fail-closed errors | focused tests + production-safe probes | `UNVERIFIED` | Must include action-level abuse cases |
| UX/A11y/Mobile | loading, empty, error, success, keyboard/touch, responsive states | browser screenshots/clickthrough | `UNVERIFIED` | Needs per-screen evidence, not just route load |

## Execution Plan From Here

1. Run the Dashboard Home rendered component/browser action audit for selected bot, wallet KPIs, loading/empty/error, responsive, and table tab behavior.
2. Add or extend production-safe clickthrough scripts so they perform real non-destructive actions on throwaway fixtures instead of only checking routes.
3. Execute the remaining modules in the matrix one at a time and keep this file as the source of truth for V1 action completeness.

## V1 Readiness Rule

V1 cannot be called "100% ready" until every row above is either `PASS` or has
an explicitly accepted and documented `BLOCKED_*` status with a safe operator
plan. Deploy health, public smoke, and route reachability are necessary but not
sufficient.
