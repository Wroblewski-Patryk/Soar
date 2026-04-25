# V1TAKE-01 Investigation Audit

Status: Active  
Updated: 2026-04-25

## Purpose

Freeze the confirmed findings from the fresh user-driven investigation into:

- exchange takeover visibility,
- exchange-synced ownership proof,
- runtime visibility for imported LIVE positions,
- dashboard manual `PAPER` and `LIVE` open truth.

This packet is the handoff for `V1TAKE-02`, so the next red-test slice can
target one concrete ownership drift instead of reopening the whole analysis.

## Classification Legend

- `CONFIRMED_CONTRACT_SPLIT`: different code paths already use different
  ownership/management truth for the same feature
- `INTENTIONAL_FAIL_CLOSED_SCOPE`: behavior is intentionally narrow and should
  stay explicit
- `CONFIRMED_OPERATOR_GAP`: technically consistent behavior still leaves the
  operator without one explicit truth path
- `WATCH_ITEM`: plausible follow-up risk, but not yet the first fix target

## Confirmed Scope Baseline

1. Authenticated exchange position/open-order snapshot support remains
   effectively `BINANCE + FUTURES` only.
   - evidence:
     `apps/api/src/modules/exchange/exchangeExecutionCapabilityContract.service.ts`
     (`BINANCE=true`, others `false` for `POSITIONS_SNAPSHOT`,
     `OPEN_ORDERS_SNAPSHOT`, `LIVE_ORDER_SUBMIT`)
   - classification: `INTENTIONAL_FAIL_CLOSED_SCOPE`

2. The next wave must not broaden support claims beyond that exact scope.
   - implication: if a reported production position lives on another exchange
     or outside futures scope, that is outside the current takeover contract
     and must not be "fixed" implicitly in this wave.

## Inventory

### CONFIRMED_CONTRACT_SPLIT

1. `apps/api/src/modules/positions/livePositionReconciliation.service.ts`
   - `listSyncedApiKeys()` selects API keys by `exchange: 'BINANCE'` and
     `syncExternalPositions: true`
   - ownership resolution also consumes `apiKey.manageExternalPositions`
   - why this matters: the ingestion loop starts from API-key toggles

2. `apps/api/src/modules/positions/positions.service.ts`
   - `rebindExternalTakeoverOwnership()` and
     `listExternalTakeoverStatuses()` derive eligible takeover bots from wallet
     filters that require `wallet.manageExternalPositions: true`
   - why this matters: takeover status and ownership rebind are using wallet
     toggles as the decisive management truth

3. `apps/web/src/features/profile/components/ApiKeyForm.tsx`
   - the API-key settings surface exposes separate `syncExternalPositions` and
     `manageExternalPositions` toggles
   - why this matters: operators can configure sync and manage semantics at the
     API-key layer directly

4. `apps/web/src/features/wallets/components/WalletCreateEditForm.tsx`
   - the wallet form separately exposes `manageExternalPositions`
   - why this matters: the same takeover behavior is configurable from a second
     UI path with a different persistence owner

### INTENTIONAL_FAIL_CLOSED_SCOPE

1. `apps/api/src/modules/exchange/exchangeExecutionCapabilityContract.service.ts`
   - only `BINANCE` currently supports:
     - `BALANCE_PREVIEW`
     - `POSITIONS_SNAPSHOT`
     - `OPEN_ORDERS_SNAPSHOT`
     - `LIVE_ORDER_SUBMIT`
   - `LIVE_ORDER_CANCEL` remains unsupported everywhere

2. `apps/api/src/modules/positions/positions.service.ts`
   - snapshot readers call the exchange boundary with `marketType: 'FUTURES'`
   - takeaway: position/open-order snapshot support is not just Binance-first,
     but Binance Futures-first in the current implementation

3. `apps/api/src/modules/positions/livePositionReconciliation.service.ts`
   - eligible LIVE bot ownership also hard-filters to `exchange: 'BINANCE'`,
     `marketType: 'FUTURES'`, `mode: 'LIVE'`, `liveOptIn: true`
   - takeaway: imported takeover remains intentionally narrow and should stay
     explicit until architecture says otherwise

### CONFIRMED_OPERATOR_GAP

1. `apps/api/src/modules/bots/runtimeSessionPositionsRead.service.ts`
   - runtime position reads only list rows under `managementMode:
     'BOT_MANAGED'`
   - imported external rows can exist in takeover/positions APIs while still
     being absent from the bot runtime view if ownership is unresolved

2. `apps/api/src/modules/positions/livePositionReconciliation.service.ts`
   - when takeover is enabled but ownership status is not `OWNED`,
     reconciliation downgrades rows to `MANUAL_MANAGED` or `DRIFT`
   - result: fail-closed behavior is preserved, but the operator-visible path
     is split between takeover status, positions snapshot, and runtime view

3. `apps/api/src/modules/bots/runtimeExternalPositionOwner.service.ts`
   - ownership is explicitly classified as `OWNED` or `AMBIGUOUS`
   - result: the system already has an ownership vocabulary, but the exact
     drift between API-key and wallet management flags is not yet red-tested
     under one DB-backed contract

### WATCH_ITEM

1. `apps/web/src/features/dashboard-home/hooks/useManualOrderController.ts`
   - reference price estimation still falls back from manual-context mark price
     to symbol live price, open-position mark price, and finally entry price
   - risk: useful for estimation, but stronger than the backend execution truth
     if shown without explicit degraded semantics

2. `apps/api/src/modules/orders/orders.service.ts`
   - `PAPER MARKET` now resolves an immediate fill price from canonical manual
     context when possible
   - `LIVE` order submission already enforces inherited context and unresolved
     scope rejection
   - remaining gap: API + web still need one tighter regression pack around the
     exact user-reported lifecycle from submit through exchange-synced adoption

## Confirmed Test Baseline

The fresh baseline for `V1TAKE` is:

1. DB-backed takeover-status API coverage is green
   - `pnpm --filter api exec vitest run src/modules/positions/positions.takeover-status.e2e.test.ts`

2. Manual `LIVE MARKET` submitted-without-fill truth is green
   - `pnpm --filter api exec vitest run src/modules/orders/orders.service.test.ts -t "keeps LIVE MARKET order submitted when exchange placement returns OPEN without fill truth"`

3. Runtime adoption of manual `LIVE` -> exchange-synced open-order/position is green
   - `pnpm --filter api exec vitest run src/modules/orders/orders-positions.e2e.test.ts -t "keeps manual LIVE MARKET visibility truthful from submitted order through exchange-synced adoption|keeps LIVE open orders visible in runtime view when order was created before current session start"`

4. Repository guardrails are green after queue/context sync
   - `pnpm run quality:guardrails`

## Local Infra Status

The workspace is no longer blocked by a missing Docker engine:

- `docker info` reports a healthy Docker Desktop server
- `docker context ls` confirms `desktop-linux`
- `docker compose up -d postgres redis` failed only because `5432` was already
  allocated by an existing local Postgres container
- `docker ps -a` confirmed `cryptosparrow-postgres-1` is already bound to
  `0.0.0.0:5432`

Conclusion:
- DB-backed API validation can now be treated as available for this wave
- port collision must be handled as "check the existing Postgres first", not as
  proof that local DB validation is impossible

## First Red-Test Target For V1TAKE-02

The smallest honest next slice is:

- prove the exact takeover-management truth when:
  - `apiKey.syncExternalPositions = true`
  - `apiKey.manageExternalPositions = true|false`
  - `wallet.manageExternalPositions = true|false`
- lock which combination should yield:
  - takeover visibility,
  - owned `BOT_MANAGED` runtime eligibility,
  - fail-closed `MANUAL_MANAGED` or unresolved status

This is the highest-signal next target because it sits exactly at the
intersection of the user symptom and the currently split ownership contract.

## Non-Goals

- no new exchange integration
- no broad runtime refactor
- no UI redesign outside truthful state semantics
- no workaround that bypasses deterministic ownership proof

## Exit Criteria For V1TAKE-01

- `V1TAKE-02` has one explicit audit packet and test target
- supported scope is frozen as `BINANCE + FUTURES`
- DB-backed validation is confirmed available again for the wave
