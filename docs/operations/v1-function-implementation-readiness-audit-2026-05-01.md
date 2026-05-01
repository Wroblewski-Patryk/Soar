# V1 Function Implementation Readiness Audit

Date: 2026-05-01
Status: FUNCTION LEDGER READINESS CLASSIFICATION

## Purpose

This audit classifies the 79-row V1 function coverage ledger by implementation
readiness. The goal is to distinguish missing implementation work from missing
production evidence, so the remaining V1 plan can focus on the smallest useful
features, fixes, and verification tasks.

Source ledger:
`docs/operations/v1-function-coverage-matrix-2026-05-01.csv`.

## Classification Rules

- `READY`: local implementation is covered and production is `PASS`, or
  production evidence is explicitly `NOT_APPLICABLE`.
- `IMPLEMENTED_NEEDS_EVIDENCE`: implementation exists locally, but production
  proof is `PARTIAL`, `NEEDS_PROD_SAMPLE`, or `NEEDS_PROD_UI_CHECK`.
- `IMPLEMENTED_NOT_VERIFIED`: implementation exists locally, but the function
  has no current explicit V1 production verification and may need a launch-scope
  decision.
- `V1_BLOCKER`: release cannot be called V1-ready until the blocker is resolved
  or formally waived.
- `REQUIRES_IMPLEMENTATION_REVIEW`: the ledger found no local implementation
  proof. Current count is zero.

## Summary

| Classification | Count | Meaning |
| --- | ---: | --- |
| `READY` | 22 | Implemented and sufficiently proven for current V1 confidence. |
| `IMPLEMENTED_NEEDS_EVIDENCE` | 43 | Implemented locally, but needs production sample, production UI proof, or stronger current evidence. |
| `IMPLEMENTED_NOT_VERIFIED` | 11 | Implemented locally, but not yet in current production/V1 evidence scope. |
| `V1_BLOCKER` | 3 | Blocks V1 GO unless fixed or explicitly waived. |
| `REQUIRES_IMPLEMENTATION_REVIEW` | 0 | No listed function currently appears completely missing from code. |

The important conclusion is that the current ledger does not show a broad
missing-feature problem. The remaining V1 work is mostly production confidence,
operator-matrix execution, release-gate cleanup, and a few launch-scope
decisions for lower-priority modules.

## V1 Blockers

| ID | Module | Production status | Required action |
| --- | --- | --- | --- |
| `OPS-RESTORE-001` | `ops` | `FAIL` | Run the production restore drill in the real VPS/Coolify DB context or provide the missing production DB container settings to the gate. |
| `OPS-STAGE-001` | `ops` | `BLOCKED` | Restore/redeploy stage or record an explicit release-owner waiver for stage rehearsal. |
| `OPS-GO-NOGO-001` | `ops` | `BLOCKED` | Resolve stale activation evidence, restore drill failure, sign-off gaps, and manual matrix gaps, then rerun the release gate. |

## P0 Implemented But Not V1-Proven

These functions look implemented from local evidence, but they still need
production proof before they should be treated as V1-complete.

| ID | Module | Production status | Required V1 proof |
| --- | --- | --- | --- |
| `AUTH-FLOW-003` | `auth` | `PARTIAL` | Production browser protected-route/session redirect proof. |
| `BOT-LIVE-CLOSE-001` | `bots` | `PARTIAL` | Fresh post-fix automated close sample with `strategyId`, close reason, and initiator. |
| `BOT-LIVE-CLOSE-002` | `bots` | `NEEDS_PROD_SAMPLE` | Live DCA-first close boundary sample proving affordable DCA is not bypassed by `SL/TSL`. |
| `BOT-LIVE-CLOSE-003` | `bots` | `NEEDS_PROD_SAMPLE` | Production `SIGNAL_DECISION` or `PRETRADE_BLOCKED` evidence for exhausted/unaffordable DCA close. |
| `BOTS-CRUD-001` | `bots` | `PARTIAL` | Non-destructive production bot list/detail/edit smoke; create/delete only on safe paper bot. |
| `BOTS-MARKETGROUP-001` | `bots` | `PARTIAL` | Read-only runtime graph proof for market groups and strategy links. |
| `BOTS-RUNTIME-STATS-001` | `bots` | `PARTIAL` | Production symbol-stats read for the active live bot. |
| `ENGINE-LIFETIME-001` | `engine` | `NEEDS_PROD_SAMPLE` | Manual matrix scenarios for lifetime disabled/enabled behavior. |
| `ENGINE-ORDER-TYPES-001` | `engine` | `PARTIAL` | Paper/live-safe order-type matrix or explicit unsupported-type block. |
| `ENGINE-PRETRADE-001` | `engine` | `PARTIAL` | Production pre-trade block event or safe paper proof. |
| `EXCHANGES-UI-001` | `exchanges` | `NEEDS_PROD_UI_CHECK` | Production exchange connections page read-only browser smoke. |
| `ISOLATION-OWNERSHIP-001` | `isolation` | `PARTIAL` | Non-destructive cross-user read-denial smoke with test accounts. |
| `MARKETDATA-FUT-001` | `market-data` | `PARTIAL` | Production evidence showing futures price source fields for live runtime. |
| `MARKETS-CATALOG-001` | `markets` | `PARTIAL` | Production catalog endpoint sample for Binance Futures. |
| `MARKETS-CRUD-001` | `markets` | `NEEDS_PROD_UI_CHECK` | Production market universe list/edit smoke on non-critical universe. |
| `MANUAL-LIVE-ORDER-001` | `orders` | `PARTIAL` | Final manual LIVE open matrix on current deployed SHA. |
| `MANUAL-LIVE-ORDER-002` | `orders` | `PARTIAL` | Same-direction manual fill verification or explicit live-risk waiver. |
| `ORDERS-CANCEL-CLOSE-001` | `orders` | `NEEDS_PROD_SAMPLE` | Safe cancel/close sample on non-filled pending order or stage once restored. |
| `ORDERS-LIST-001` | `orders` | `PARTIAL` | Production orders read for active live bot or wallet without mutation. |
| `ORDERS-MANUAL-CONTEXT-001` | `orders` | `PARTIAL` | Production manual-context payload for selected bot and symbol. |
| `POSITIONS-LIST-001` | `positions` | `PARTIAL` | Production `/dashboard/positions` read-only smoke. |
| `POSITIONS-SNAPSHOT-001` | `positions` | `PARTIAL` | Production authenticated exchange snapshot check for futures wallet. |
| `POSITIONS-TAKEOVER-001` | `positions` | `PARTIAL` | Production takeover-status read-only proof plus manual matrix scenario. |
| `PROFILE-APIKEY-001` | `profile` | `PARTIAL` | API-key list/test proof without exposing or destructively rotating the live key. |
| `PROFILE-APIKEY-002` | `profile` | `PARTIAL` | Redacted production API-key connection-test proof. |
| `STRAT-ADV-TSL-001` | `strategies` | `PARTIAL` | Next production TSL arm/close event and dashboard display proof. |
| `STRAT-BASIC-SL-001` | `strategies` | `NEEDS_PROD_SAMPLE` | Basic SL close sample in production, paper, or explicitly accepted manual evidence. |
| `STRAT-BASIC-TP-001` | `strategies` | `NEEDS_PROD_SAMPLE` | Basic TP close sample in production, paper, or explicitly accepted manual evidence. |
| `STRAT-CRUD-001` | `strategies` | `NEEDS_PROD_UI_CHECK` | Production strategy create/edit/delete on test strategy or stage. |

## Ready Rows

These rows are implemented and currently acceptable for V1 confidence.

| ID | Module | Priority | Production status |
| --- | --- | --- | --- |
| `AUTH-FLOW-002` | `auth` | `P0` | `PASS` |
| `AUTH-OPS-001` | `auth` | `P0` | `PASS` |
| `BOT-LIVE-CTX-001` | `bots` | `P0` | `PASS` |
| `BOT-LIVE-POS-DCA-001` | `bots` | `P0` | `PASS` |
| `BOT-LIVE-POS-DCA-002` | `bots` | `P0` | `PASS` |
| `BOT-LIVE-POS-DCA-003` | `bots` | `P0` | `PASS` |
| `BOTS-RUNTIME-READ-001` | `bots` | `P0` | `PASS` |
| `BOTS-RUNTIME-TRADES-001` | `bots` | `P0` | `PASS` |
| `EXCHANGE-BINANCE-FUT-001` | `exchange` | `P0` | `PASS` |
| `MARKETSTREAM-001` | `market-stream` | `P0` | `PASS` |
| `OPS-DEPLOY-001` | `ops` | `P0` | `PASS` |
| `STRAT-ADV-TTP-001` | `strategies` | `P0` | `PASS` |
| `STRAT-EDIT-LOCK-001` | `strategies` | `P0` | `PASS` |
| `BACKTEST-PARITY-001` | `backtests` | `P1` | `NOT_APPLICABLE` |
| `BOT-PAPER-CAP-001` | `bots` | `P1` | `NOT_APPLICABLE` |
| `DASH-WALLET-KPI-001` | `dashboard-home` | `P1` | `PASS` |
| `HISTORY-ACTOR-001` | `dashboard-home` | `P1` | `PASS` |
| `HISTORY-REASON-001` | `dashboard-home` | `P1` | `PASS` |
| `ENGINE-PAPER-LIVE-PARITY-001` | `engine` | `P1` | `NOT_APPLICABLE` |
| `ORDERS-PAPER-MARKET-001` | `orders` | `P1` | `NOT_APPLICABLE` |
| `DASH-POS-ACTIONS-001` | `dashboard-home` | `P2` | `PASS` |
| `PAGINATION-QUERY-001` | `pagination` | `P2` | `NOT_APPLICABLE` |

## Implemented But Lower-Priority Or Scope-Decision Rows

These rows do not look like immediate P0 V1 blockers unless the release scope
requires them. They should be either verified in a smaller smoke pass or
explicitly deferred.

| ID | Module | Priority | Production status | Recommendation |
| --- | --- | --- | --- | --- |
| `AUTH-FLOW-001` | `auth` | `P1` | `NEEDS_PROD_UI_CHECK` | Verify on stage once restored or use throwaway production account. |
| `AUTH-FLOW-004` | `auth` | `P1` | `NEEDS_PROD_UI_CHECK` | Add browser logout smoke. |
| `BACKTEST-CRUD-001` | `backtests` | `P1` | `NEEDS_PROD_UI_CHECK` | Verify with a small safe run. |
| `BACKTEST-REPORT-001` | `backtests` | `P1` | `NEEDS_PROD_UI_CHECK` | Verify known run details render. |
| `LOGS-AUDIT-001` | `logs` | `P1` | `NEEDS_PROD_UI_CHECK` | Verify read-only audit trail. |
| `MARKETSTREAM-SSE-001` | `market-stream` | `P1` | `PARTIAL` | Add small production SSE smoke if live UI stream confidence matters for V1. |
| `POSITIONS-REPAIR-001` | `positions` | `P1` | `NOT_VERIFIED` | `WAIVED_FOR_V1`: incident-only repair command; keep fixture/stage-only unless an active incident requires it. |
| `PROFILE-BASIC-001` | `profile` | `P1` | `NEEDS_PROD_UI_CHECK` | Verify non-destructive read/update smoke. |
| `PROFILE-SECURITY-001` | `profile` | `P1` | `NEEDS_PROD_UI_CHECK` | Verify only on test account or stage. |
| `REPORTS-CROSSMODE-001` | `reports` | `P1` | `NOT_VERIFIED` | `WAIVED_FOR_V1`: useful analytics surface, but not part of the current runtime-replacement gate. |
| `STRAT-ADV-TTP-002` | `strategies` | `P1` | `NEEDS_PROD_SAMPLE` | Keep as opportunistic production evidence unless TTP incident repeats. |
| `STRAT-IND-001` | `strategies` | `P1` | `PARTIAL` | Capture production indicator metadata endpoint sample. |
| `STRAT-IO-001` | `strategies` | `P1` | `NOT_VERIFIED` | `POST_V1`: strategy JSON portability remains planned after MVP/V1. |
| `SUBS-ENTITLEMENTS-001` | `subscriptions` | `P1` | `PASS` | `IN_V1` local implementation evidence is closed by `V1SUBS-01`: LIVE create and `PAPER -> LIVE` switch fail closed when `features.liveTrading=false`. |
| `WALLET-LIVE-LEDGER-001` | `wallets` | `P1` | `NEEDS_PROD_SAMPLE` | Capture wallet preview after next live ledger refresh. |
| `WALLET-LIVE-LEDGER-002` | `wallets` | `P1` | `NEEDS_PROD_SAMPLE` | Run controlled cashflow-history ingestion proof. |
| `WALLET-PREVIEW-001` | `wallets` | `P1` | `NEEDS_PROD_UI_CHECK` | Browser-check wallet preview on production. |
| `ADMIN-SUBS-001` | `admin` | `P2` | `NOT_VERIFIED` | `POST_V1`: admin billing surface is planning-only for current V1 closure. |
| `ADMIN-USERS-001` | `admin` | `P2` | `NOT_VERIFIED` | `POST_V1`: admin user operations are not part of the current V1 replacement gate. |
| `BOTS-ASSISTANT-001` | `bots` | `P2` | `NOT_VERIFIED` | `POST_V1`: assistant config is implemented, but assistant launch scope is deferred until a dedicated AI evidence pass. |
| `BOTS-ASSISTANT-002` | `bots` | `P2` | `NOT_VERIFIED` | `POST_V1`: assistant dry-run remains outside current V1 launch closure. |
| `ICONS-LOOKUP-001` | `icons` | `P2` | `NEEDS_PROD_UI_CHECK` | Include in visual smoke only. |
| `PROFILE-SUBS-001` | `profile` | `P2` | `NOT_VERIFIED` | `POST_V1`: profile subscription/checkout UX stays with the deferred billing surface. |
| `REPORTS-PNL-001` | `reports` | `P2` | `NOT_VERIFIED` | `WAIVED_FOR_V1`: superseded low-priority reporting confidence row, not a launch blocker. |
| `UPLOAD-AVATAR-001` | `upload` | `P2` | `NOT_VERIFIED` | `WAIVED_FOR_V1`: convenience profile-media feature, not part of the current runtime-replacement gate. |

## Recommended V1 Execution Plan

### `V1GATE-A`: unblock release gates

Goal: remove non-product blockers so V1 can be honestly classified.

Tasks:

1. Run or repair the production restore drill in the real production DB
   container context.
2. Restore stage or record an explicit stage waiver.
3. Rebuild activation audit/activation plan/sign-off artifacts after current
   evidence is fresh.
4. Rerun the release gate.

### `V1MONEY-A`: prove live-money automation

Goal: close the highest-risk live-money evidence gaps before adding more
features.

Rows:
`BOT-LIVE-CLOSE-001`, `BOT-LIVE-CLOSE-002`, `BOT-LIVE-CLOSE-003`,
`STRAT-BASIC-TP-001`, `STRAT-BASIC-SL-001`, `STRAT-ADV-TSL-001`,
`ENGINE-LIFETIME-001`, `ENGINE-PRETRADE-001`, `ENGINE-ORDER-TYPES-001`,
`MARKETDATA-FUT-001`.

Plan:

1. Build a deterministic manual/paper/live-safe scenario matrix for close,
   DCA-first, lifetime, order type, pre-trade, and futures price source truth.
2. Execute safe local/paper scenarios first.
3. Capture production read-only evidence where possible.
4. Only execute live-money mutations with explicit operator intent and tiny
   size.
5. If any row fails, convert that row into a narrow fix task instead of
   widening scope.

### `V1MANUAL-A`: finish operator matrix

Goal: prove the operator can safely inspect and control the current live setup.

Rows:
`MANUAL-LIVE-ORDER-001`, `MANUAL-LIVE-ORDER-002`,
`ORDERS-LIST-001`, `ORDERS-MANUAL-CONTEXT-001`,
`ORDERS-CANCEL-CLOSE-001`, `POSITIONS-LIST-001`,
`POSITIONS-SNAPSHOT-001`, `POSITIONS-TAKEOVER-001`,
`PROFILE-APIKEY-001`, `PROFILE-APIKEY-002`, `EXCHANGES-UI-001`,
`MARKETS-CATALOG-001`, `MARKETS-CRUD-001`, `STRAT-CRUD-001`,
`BOTS-CRUD-001`, `BOTS-MARKETGROUP-001`, `BOTS-RUNTIME-STATS-001`,
`ISOLATION-OWNERSHIP-001`, `AUTH-FLOW-003`.

Plan:

1. Prefer read-only proof first.
2. Use non-critical/test entities for edits.
3. Avoid destructive API-key rotation/delete on real keys unless explicitly
   planned.
4. Record every proof back into the coverage matrix.

### `V1UX-A`: verify P1 operational surfaces

Goal: stop surprise UI gaps after the money path is green.

Rows:
wallet preview/ledger rows, profile, logs, backtests, strategy indicators,
auth registration/logout, market-stream SSE.

Plan:

1. Browser smoke each route on production or restored stage.
2. Capture screenshots/payload notes only where they add confidence.
3. Convert any failing row into a small fix task.

### `V1SCOPE-A`: decide defer/launch scope

Goal: avoid blocking V1 on features that are implemented but not launch-critical.

Rows:
admin, assistant, subscriptions/billing, upload avatar, reports, repair command,
strategy import/export.

Plan:

1. Mark each as `IN_V1`, `POST_V1`, or `WAIVED_FOR_V1`.
2. If `IN_V1`, add a focused verification task.
3. If `POST_V1`, update the matrix and product/planning docs so it stops
   creating false V1 pressure.

2026-05-01 decision pass (`V1SCOPE-01`):

- `IN_V1`:
  - `SUBS-ENTITLEMENTS-001` - closed locally by `V1SUBS-01`; production smoke remains part of the broader release-gate evidence wave.
- `POST_V1`:
  - `ADMIN-USERS-001`
  - `ADMIN-SUBS-001`
  - `PROFILE-SUBS-001`
  - `STRAT-IO-001`
  - `BOTS-ASSISTANT-001`
  - `BOTS-ASSISTANT-002`
- `WAIVED_FOR_V1`:
  - `REPORTS-CROSSMODE-001`
  - `REPORTS-PNL-001`
  - `UPLOAD-AVATAR-001`
  - `POSITIONS-REPAIR-001`

Effect:

- current V1 scope pressure now excludes admin, billing, assistant, and
  strategy portability surfaces;
- current V1 release is not blocked on convenience profile media, reports, or
  incident-only repair tooling;
- the only remaining lower-priority scope-decision row still inside V1 is one
  focused entitlement verification pass.

## Result

Current best V1 interpretation:

- The ledger does not expose a broad missing implementation area.
- The main V1 work is evidence closure and operational gate repair.
- The most important code-fix path is reactive: if a production/paper proof row
  fails, create a narrow fix task for that exact row.
- New feature work should wait until `V1GATE-A`, `V1MONEY-A`, and
  `V1MANUAL-A` are green, except for tiny fixes discovered by those passes.
