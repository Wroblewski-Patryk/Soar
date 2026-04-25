# V1TAKE Exchange Takeover and Manual-Order Closure Plan (2026-04-25)

## Status

Queued

## Why This Wave Exists

Fresh investigation against the user-reported symptoms confirmed that the next
post-V1 hardening work is not a generic exchange expansion task and not only a
UI issue.

The repository still has one residual cohesion gap across:

- external-position takeover authority,
- exchange-synced ownership proof,
- runtime visibility of imported LIVE positions,
- dashboard manual `PAPER` and `LIVE` open truth.

This wave exists to close that gap under the already approved architecture
instead of layering another compatibility path.

## Confirmed Findings

### 1. Takeover authority is split between API-key sync flags and wallet management flags

The current codebase still mixes:

- `apiKey.syncExternalPositions`
- `apiKey.manageExternalPositions`
- `wallet.manageExternalPositions`

That split is visible across reconciliation, takeover-status reads, and UI
write forms. The user symptom "exchange position is active but does not appear
in the bot" is compatible with this drift because one path can classify a row
as eligible for sync while another path classifies the same runtime ownership
as unmanaged or unresolved.

User decision recorded on 2026-04-25:
- `manageExternalPositions` must become wallet-only truth,
- `apiKey.syncExternalPositions` may remain as the import/snapshot toggle,
- API-key-level `manageExternalPositions` must become compatibility-only and
  must not decide takeover ownership.

### 2. Exchange-position import remains intentionally narrow and fail-closed

The frozen capability matrix still makes authenticated position/open-order
snapshot support effectively `BINANCE + FUTURES` only. That is architecture-
aligned, but it means takeover/debug work must explicitly prove whether the
reported position lives inside that exact supported scope before any broader
claim is made.

### 3. Bot runtime visibility depends on deterministic ownership proof

Runtime bot views surface imported external positions only when they end up
classified as owned and `BOT_MANAGED`. Ambiguous, unowned, or manual-managed
exchange rows can still exist in positions/takeover APIs while remaining absent
from the bot runtime view. That is a fail-closed behavior, but today it is not
yet covered by one explicit regression pack for the exact user-reported path.

### 4. Manual `PAPER` and `LIVE` open paths still depend on canonical fill/context truth

The current manual-order implementation already handles several singular-bot
context rules, but the remaining user-visible uncertainty is now narrower:

- `PAPER MARKET` open must always resolve one canonical fill price or fail
  explicitly,
- `LIVE` open must stay honest from dashboard submit through submitted/open
  order/imported position state,
- dashboard action semantics must not imply stronger guarantees than the
  backend can prove.

## Verified Local Evidence

The local environment is no longer blocked by a missing Docker engine:

- `docker info` now reports a healthy Docker Desktop server,
- `docker context ls` confirms `desktop-linux`,
- `docker compose up -d postgres redis` failed only because port `5432` was
  already allocated by another local Postgres container,
- DB-backed verification now passes for
  `src/modules/positions/positions.takeover-status.e2e.test.ts`,
- targeted manual-order service verification passes for
  `src/modules/orders/orders.service.test.ts -t "keeps LIVE MARKET order submitted when exchange placement returns OPEN without fill truth"`.

This means the next execution wave can use DB-backed API tests as a first-class
validation gate instead of treating them as purely infra-blocked.

## Execution Plan

### Wave: `V1TAKE-A`

1. `V1TAKE-01 audit(api+runtime): publish confirmed ownership/manual-order investigation packet with DB-backed validation`
   - Freeze the exact confirmed symptom map from the fresh audit.
   - Record supported-scope assumptions (`BINANCE + FUTURES`) so later fixes do
     not accidentally broaden exchange claims.

2. `V1TAKE-02 test(api-red): lock takeover authority drift between API key, wallet, and bot visibility`
   - Add failing DB-backed coverage for the current contract split between
     `apiKey.syncExternalPositions`, `apiKey.manageExternalPositions`, and
     `wallet.manageExternalPositions`.
   - Prove which combination should produce takeover visibility and which
     should fail closed.

3. `V1TAKE-03 fix(api-positions): unify external-position management contract and takeover status ownership`
   - Remove the remaining split authority where architecture allows.
   - Make `wallet.manageExternalPositions` the only management source of truth.
   - Downgrade API-key-level `manageExternalPositions` to compatibility-only
     metadata that no longer decides takeover ownership.
   - Keep one canonical ownership/management source for reconciliation,
     takeover-status, and manual takeover actions.

4. `V1TAKE-04 test(api-runtime-red): lock deterministic runtime visibility for owned exchange-synced LIVE positions`
   - Add focused coverage for the exact path "active exchange position exists,
     ownership is deterministic, bot runtime must show it".
   - Keep ambiguous or manual-only rows fail-closed and explicit.

5. `V1TAKE-05 fix(api-runtime): align runtime position adoption with canonical owned external-position truth`
   - Reuse the canonical ownership rule already approved by architecture.
   - Ensure imported positions that are truly owned surface consistently across
     runtime and positions APIs.

6. `V1TAKE-06 test(api+web-red): lock manual PAPER/LIVE open truth from dashboard submission to order/position state`
   - Add focused API + web regressions for:
     - `PAPER MARKET` immediate open with canonical fill truth,
     - explicit failure when canonical fill truth is unavailable,
     - `LIVE` submitted/open/imported-position state progression from the
       dashboard UI.

7. `V1TAKE-07 fix(api+web-orders): harden manual-order fill/context truth and fail-closed UI semantics`
   - Align backend fill/context handling and dashboard state presentation to
     the red coverage from `V1TAKE-06`.
   - Keep unsupported or degraded states explicit instead of optimistic.

8. `V1TAKE-08 qa(closure): rerun focused DB-backed API + web closure pack and sync canonical docs/context`
   - Run the final focused closure pack for takeover/runtime/manual-order
     truth.
   - Sync queue/context docs with evidence.

## Priority Order

1. `V1TAKE-01`
2. `V1TAKE-02`
3. `V1TAKE-03`
4. `V1TAKE-04`
5. `V1TAKE-05`
6. `V1TAKE-06`
7. `V1TAKE-07`
8. `V1TAKE-08`

## Progress Update

- 2026-04-25: `V1TAKE-04` and `V1TAKE-05` are now closed under the same
  wallet-first ownership contract chosen by the user. Runtime takeover
  visibility now reuses wallet-managed truth: `bots.runtime-takeover.e2e.test.ts`
  first proved false ambiguity when a competing LIVE bot shared symbol scope
  but its wallet disabled external-position management, and
  `runtimeExternalPositionOwner.service.ts` now excludes such manual-only
  wallets from LIVE ownership candidates. Next active slice is `V1TAKE-06`.

## Non-Goals

- no new exchange integration beyond the already frozen capability matrix,
- no relaxation of fail-closed ownership behavior for ambiguous LIVE rows,
- no speculative dashboard redesign outside truthful action/state reporting,
- no architecture rewrite or second takeover subsystem.

## Validation Target

At minimum for closure:

- `pnpm --filter api exec vitest run src/modules/positions/positions.takeover-status.e2e.test.ts`
- focused DB-backed API coverage for takeover ownership and runtime visibility
- focused `orders.service` / `orders-positions.e2e` coverage for manual open
  lifecycle truth
- focused dashboard-home manual-order suites
- touched-scope typechecks
- `pnpm run quality:guardrails`
