# Market Universe Symbol Contract Parity Plan (2026-04-19)

Status: ready-for-implementation  
Execution mode: tiny-commit only (exactly one task per commit)  
Primary audience: execution agent

## Source Analysis Summary
- Current symbol-resolution behavior diverges across modules (`markets`, `backtests`, `runtime`, `manual order context`).
- Existing implementation has several contract drifts:
  - backtests override by whitelist instead of union,
  - runtime can prefer whitelist-only path and bypass filter-derived set,
  - filter-off currently behaves like `all catalog symbols` instead of empty set,
  - web form blocks valid empty-result configuration by requiring minimum one symbol,
  - bot symbol-group auto-create can ignore volume filter.

## Target Contract (Locked for this Wave)
`final = unique(filter_result U whitelist) - blacklist`

Rules:
1. `filter_result` exists only when `minQuoteVolumeEnabled=true`.
2. `whitelist` and `blacklist` are optional.
3. If filter is disabled and whitelist is empty, result must be empty.
4. Blacklist-only configuration must not add symbols by itself (result stays empty).
5. The same resolver contract must be reused across:
   - web preview,
   - market universe sync,
   - bots runtime,
   - backtests,
   - manual order context.

## Scope
- API shared symbol resolver and all runtime/read/write consumers listed above.
- Web market universe preview and validation semantics.
- Contract and module docs synchronization.

## Scope Lock
1. No unrelated UX redesign in markets form (logic-only + validation semantics).
2. No opportunistic refactors outside symbol-resolution contract and required adapters.
3. Keep fail-closed behavior in runtime and order paths.

## Execution Groups
1. `MURC-A (commits MURC-01..MURC-04): contract freeze + shared resolver + market sync/auto-group adoption`
2. `MURC-B (commits MURC-05..MURC-07): backtest/runtime/manual-order adoption + integration parity`
3. `MURC-C (commits MURC-08..MURC-12): web preview/validation alignment + e2e smoke + docs + closure`

---

## Tiny-Commit Queue

### MURC-01
`docs(contract): freeze canonical market-universe symbol composition contract`
- Scope:
  - Publish canonical contract and edge-case semantics in decision/docs.
  - Explicitly deprecate implicit `all symbols` behavior for `filter off + empty whitelist`.
- Likely files:
  - `docs/planning/open-decisions.md`
  - `docs/modules/api-markets.md`
  - `docs/modules/api-bots.md`
  - `docs/modules/api-backtests.md`
  - `docs/modules/api-orders.md`
  - `docs/modules/web-markets.md`
- Done when:
  - One documented formula and edge-case matrix is authoritative.

### MURC-02
`test(api-red): add shared resolver unit matrix for filter/whitelist/blacklist combinations`
- Scope:
  - Add failing tests for:
    - filter-only,
    - whitelist-only,
    - filter+whitelist union,
    - blacklist-only,
    - none-selected.
- Likely files:
  - `apps/api/src/lib/symbols.test.ts`
  - (or new dedicated resolver test file under `apps/api/src/modules/markets`)
- Done when:
  - Red suite fails on current drifted semantics.

### MURC-03
`feat(api-shared-resolver): implement single-source symbol resolver for market-universe contract`
- Scope:
  - Implement reusable resolver utility with deterministic ordering/deduplication.
  - Expose one API-level helper to avoid duplicated per-module composition.
- Likely files:
  - `apps/api/src/lib/symbols.ts`
  - `apps/api/src/modules/markets/marketCatalogSymbolResolver.service.ts`
- Done when:
  - Shared resolver supports all contract cases and passes matrix tests.

### MURC-04
`refactor(api-markets): wire markets sync and bot auto-symbol-group creation to shared resolver`
- Scope:
  - Use shared resolver in market universe sync path.
  - Ensure bot auto-created symbol group from market universe honors filter+whitelist-blacklist contract.
- Likely files:
  - `apps/api/src/modules/markets/markets.service.ts`
  - `apps/api/src/modules/bots/services/botWriteValidation.service.ts`
- Done when:
  - Universe sync and auto-created symbol groups match shared resolver output.

### MURC-05
`test(api-red): add backtest/runtime/manual-order contract regressions for symbol-set parity`
- Scope:
  - Add failing regressions for:
    - backtest whitelist override bug,
    - runtime whitelist-only bypass path,
    - manual order context symbol ownership drift.
- Likely files:
  - `apps/api/src/modules/backtests/backtests.e2e.test.ts`
  - `apps/api/src/modules/bots/bots.runtime-scope.e2e.test.ts`
  - `apps/api/src/modules/orders/orders-positions.e2e.test.ts`
- Done when:
  - Tests fail until all consumers use shared resolver semantics.

### MURC-06
`refactor(api-consumers): adopt shared resolver in backtests runtime and manual-order context flows`
- Scope:
  - Replace custom composition branches in:
    - backtest symbol resolution,
    - runtime symbol-universe resolver chain,
    - manual order context selection path.
- Likely files:
  - `apps/api/src/modules/backtests/backtests.service.ts`
  - `apps/api/src/modules/engine/runtime/runtimeSymbolUniverse.service.ts`
  - `apps/api/src/modules/engine/runtime/runtimeSymbolCatalogResolver.service.ts`
  - `apps/api/src/modules/engine/runtime/runtimeSignalLoopDefaults.ts`
  - `apps/api/src/modules/orders/orders.service.ts`
- Done when:
  - All listed consumers read symbols through one contract path.

### MURC-07
`test(api-integration): lock cross-module parity for identical universe input`
- Scope:
  - Add integration/e2e assertion that same universe input yields identical symbol set in:
    - bots runtime,
    - backtest seed config,
    - manual order context.
- Likely files:
  - `apps/api/src/modules/bots/bots.e2e.test.ts`
  - `apps/api/src/modules/backtests/backtests.e2e.test.ts`
  - `apps/api/src/modules/orders/orders-positions.e2e.test.ts`
- Done when:
  - Contract parity is regression-locked end-to-end.

### MURC-08
`test(web-red): add markets form regressions for empty-result and union semantics`
- Scope:
  - Add failing web tests for:
    - `filter off + empty whitelist => empty preview`,
    - whitelist union with active filter,
    - blacklist subtract behavior.
- Likely files:
  - `apps/web/src/features/markets/components/MarketUniverseForm.test.tsx`
- Done when:
  - Red tests expose current preview/validation drift.

### MURC-09
`fix(web-markets): align preview and validation with shared contract without UI redesign`
- Scope:
  - Align preview computation to contract.
  - Remove minimum-one-symbol requirement for catalog-supported exchanges.
  - Keep name as required field.
- Likely files:
  - `apps/web/src/features/markets/components/MarketUniverseForm.tsx`
  - `apps/web/src/features/markets/utils/marketUniverseHelpers.ts`
- Done when:
  - Form allows valid empty result and preview matches API contract semantics.

### MURC-10
`test(e2e-smoke): add focused parity smoke for bots/backtests/manual-order under one universe`
- Scope:
  - Add smoke scenario:
    - same universe config,
    - validate same final symbol set across bots/backtests/manual order context.
- Likely files:
  - `apps/api/src/modules/bots/bots.e2e.test.ts`
  - `apps/api/src/modules/backtests/backtests.e2e.test.ts`
  - `apps/web/src/features/dashboard-home/components/HomeLiveWidgets.test.tsx` (if UI assertion needed)
- Done when:
  - Cross-feature smoke validates parity for key operator flow.

### MURC-11
`docs(sync): update trading logic and module docs to finalized contract`
- Scope:
  - Remove/replace stale wording suggesting implicit all-symbol fallback.
  - Synchronize module docs with one final formula.
- Likely files:
  - `docs/architecture/trading-logic.md`
  - `docs/modules/api-markets.md`
  - `docs/modules/web-markets.md`
  - `docs/modules/api-backtests.md`
  - `docs/modules/api-bots.md`
  - `docs/modules/api-orders.md`
- Done when:
  - Docs are consistent with implementation and acceptance contract.

### MURC-12
`qa(closure): run focused contract validation pack and sync canonical queue/context`
- Required commands:
  - `pnpm --filter api run test -- --run`
  - `pnpm --filter web run test -- --run`
  - `pnpm --filter api run typecheck`
  - `pnpm --filter web run typecheck`
  - `pnpm run quality:guardrails`
  - `pnpm i18n:audit:route-reachable:web` (if route copy changed)
- Done when:
  - Closure pack is green and queue/context docs are synchronized.

---

## Stage DoD

### Stage A DoD (`MURC-A`)
- Shared resolver exists and contract matrix is green.
- Markets sync and bot auto-group creation both consume the shared resolver.

### Stage B DoD (`MURC-B`)
- Backtests, runtime, and manual-order context all use the same symbol contract path.
- Integration regressions lock parity for identical universe input.

### Stage C DoD (`MURC-C`)
- Web preview/validation reflect contract semantics without layout redesign.
- Focused e2e smoke and closure pack pass.
- Docs are synchronized.

## Acceptance Criteria
1. For the same universe input, bots runtime, backtests, and dashboard/manual-order context resolve identical symbols.
2. `filter off + whitelist empty` yields empty symbol set (no implicit all-markets fallback).
3. Active filter + whitelist composes by union, not override.
4. Blacklist always subtracts from final result.
5. Backtest `seedConfig.symbols` follows the same resolver contract.
6. Manual order context respects the same final symbol assignment contract.

## Risks and Rollback

### Stage A Risk / Rollback
- Risk:
  - Existing flows may rely on legacy implicit-all behavior.
- Rollback:
  - Revert `MURC-03..MURC-04` while keeping failing contract tests to prevent silent drift.

### Stage B Risk / Rollback
- Risk:
  - Runtime and backtest parity changes can alter expected historical outputs.
- Rollback:
  - Revert `MURC-06` and keep red parity regressions from `MURC-05/07`.

### Stage C Risk / Rollback
- Risk:
  - Users may be surprised by now-valid empty symbol configuration.
- Rollback:
  - Revert `MURC-09` only if blocking issue appears, while keeping API contract and tests intact.
