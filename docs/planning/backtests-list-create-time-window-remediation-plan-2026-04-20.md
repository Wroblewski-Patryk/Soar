# Backtests List/Create Time-Window Remediation Plan (2026-04-20)

Status: ready-for-implementation  
Execution mode: tiny-commit only (exactly one task per commit)  
Primary audience: execution agent

## Source Analysis Summary
- Backtests list UI still uses old columns (`Symbol`, `Interval`) and does not satisfy requested operator layout.
- Create form lacks explicit `start datetime` and `end datetime`; current backend defaults to a rolling window from now when end is not provided.
- Current minimal candles threshold is `100`; required minimum is `250` (max should remain `10000`).
- Layout/context ergonomics in create form are not aligned with requested 3-column md+ structure and explicit strategy + market context visibility.

## Target Contract
1. Backtests list columns must be:
   - `Strategy`
   - `Markets`
   - `Init balance`
   - `Status`
   - `Start`
   - `Actions`
2. Create form must provide explicit time window:
   - `startAt`
   - `endAt` (cannot exceed now / last closed candle boundary)
3. Candles slider contract:
   - min `250`
   - max `10000`
4. Backtest execution must use explicit selected range (`startAt/endAt`) instead of implicit now-backward fallback.
5. Existing historical runs without new fields must remain backward compatible.

## Architecture Decision (for this wave)
- List data enrichment should be API-first (recommended) instead of multi-request web mapping.
- Reason:
  - fewer query round-trips,
  - deterministic table rendering,
  - easier regression coverage for one read-model contract.

## Scope
- Backtests list columns + API data contract enrich.
- Backtest create form UX/layout + validation + i18n.
- API DTO/repository/job/data-gateway range handling.
- Backward compatibility for older runs.

## Scope Lock
1. No unrelated dashboard visual refactors outside backtests list/create surfaces.
2. No strategy engine behavior changes beyond explicit time-range selection contract.
3. Preserve existing performance safeguards (adaptive max candles for multi-market runs).

## Execution Groups
1. `BTCF-A (commits BTCF-01..BTCF-04): contract freeze + list API enrich + list UI parity`
2. `BTCF-B (commits BTCF-05..BTCF-09): create form range/validation/layout + backend explicit range flow`
3. `BTCF-C (commits BTCF-10..BTCF-12): i18n/docs sync + closure validation + backward compatibility lock`

---

## Tiny-Commit Queue

### BTCF-01
`docs(contract): freeze backtests list columns and explicit time-window create contract`
- Scope:
  - lock requested list columns and create form range rules in canonical docs.
  - lock candles slider bounds (`250..10000`) and compatibility requirement for older runs.
- Likely files:
  - `docs/planning/open-decisions.md`
  - `docs/modules/web-backtests.md`
  - `docs/modules/api-backtests.md`
- Done when:
  - one explicit backtests list/create contract is canonical.

### BTCF-02
`test(api-red): add list contract regression for strategy/markets/initBalance enrich fields`
- Scope:
  - add failing API test for backtests list response including enriched fields required by table.
- Likely files:
  - `apps/api/src/modules/backtests/backtests.e2e.test.ts`
  - `apps/api/src/modules/backtests/backtests.repository.ts` (test helpers if needed)
- Done when:
  - API regression fails until enrich fields are exposed.

### BTCF-03
`feat(api-list-enrich): expose strategy/markets/initBalance fields for backtests list rows`
- Scope:
  - enrich list read-model on API side.
  - preserve deterministic ordering and ownership isolation.
- Likely files:
  - `apps/api/src/modules/backtests/backtests.service.ts`
  - `apps/api/src/modules/backtests/backtests.repository.ts`
  - `apps/api/src/modules/backtests/backtests.types.ts`
- Done when:
  - web can render required list columns from one payload contract.

### BTCF-04
`fix(web-list): replace Symbol/Interval columns with Strategy/Markets/Init balance`
- Scope:
  - update backtests list table columns and mapping to new API fields.
  - keep actions/status/start behavior unchanged.
- Likely files:
  - `apps/web/src/features/backtest/components/BacktestsRunsTable.tsx`
  - `apps/web/src/features/backtest/backtest.type.ts`
  - `apps/web/src/features/backtest/services/backtests.service.ts`
- Done when:
  - `/dashboard/backtests/list` displays exact requested column set.

### BTCF-05
`test(web-red): add create-form regressions for start/end fields, slider bounds, and 3-column md layout`
- Scope:
  - failing tests for:
    - start/end datetime controls present,
    - slider min=250 max=10000,
    - 3-column md+ layout hooks/classes,
    - strategy/market context visibility.
- Likely files:
  - `apps/web/src/features/backtest/components/BacktestCreateForm.test.tsx`
- Done when:
  - tests capture all requested create-form UX/validation expectations.

### BTCF-06
`feat(web-create): add startAt/endAt fields + deterministic sync rules + min 250 candles`
- Scope:
  - implement create form range fields and deterministic field synchronization.
  - enforce `start < end`, end<=now, interval-consistent range checks, and candles bounds.
- Likely files:
  - `apps/web/src/features/backtest/components/BacktestCreateForm.tsx`
  - `apps/web/src/features/backtest/backtest.type.ts`
  - `apps/web/src/features/backtest/services/backtests.service.ts`
- Done when:
  - create form supports explicit range and validation contract.

### BTCF-07
`refactor(web-create-layout): switch create form md+ structure to 3 columns with independent strategy/market contexts`
- Scope:
  - move to requested 3-column md+ arrangement.
  - keep context blocks for strategy and market group readable and independent.
- Likely files:
  - `apps/web/src/features/backtest/components/BacktestCreateForm.tsx`
- Done when:
  - md+ layout and context readability match requested behavior.

### BTCF-08
`test(api-red): add run DTO/job range regressions for explicit startAt/endAt semantics`
- Scope:
  - failing tests proving API/job must use explicit user range.
  - include regression for old runs without new fields.
- Likely files:
  - `apps/api/src/modules/backtests/backtests.e2e.test.ts`
  - `apps/api/src/modules/backtests/backtestRunJob.ts` (test file pair)
  - `apps/api/src/modules/backtests/backtestDataGateway.ts` (test file pair)
- Done when:
  - tests fail on implicit now-backward behavior.

### BTCF-09
`fix(api-range-flow): extend DTO/repository/job/gateway to persist and use explicit startAt/endAt`
- Scope:
  - extend create run DTO and persisted config with start/end range.
  - ensure job/gateway fetches candles for explicit range.
  - preserve adaptive max-candles safeguards.
- Likely files:
  - `apps/api/src/modules/backtests/backtests.types.ts`
  - `apps/api/src/modules/backtests/backtests.service.ts`
  - `apps/api/src/modules/backtests/backtests.repository.ts`
  - `apps/api/src/modules/backtests/backtestRunJob.ts`
  - `apps/api/src/modules/backtests/backtestDataGateway.ts`
- Done when:
  - run execution uses explicit selected time window deterministically.

### BTCF-10
`feat(i18n): add backtests list/create keys for new columns, labels, and validation messages`
- Scope:
  - add/update locale keys for backtests namespaces.
  - keep namespace parity in all active app locales.
- Likely files:
  - `apps/web/src/i18n/messages/dashboard-backtests.en.ts`
  - `apps/web/src/i18n/messages/dashboard-backtests.pl.ts`
  - `apps/web/src/i18n/messages/dashboard-backtests.pt.ts` (if present in active locales)
- Done when:
  - no hardcoded new copy and i18n keys resolve for new UI/validation states.

### BTCF-11
`docs(sync): update backtests module/logic docs for list contract and explicit time-window execution`
- Scope:
  - align docs with final implementation semantics.
  - remove wording implying implicit now-backward default in this flow.
- Likely files:
  - `docs/modules/web-backtests.md`
  - `docs/modules/api-backtests.md`
  - `docs/architecture/trading-logic.md`
- Done when:
  - docs match runtime and UI behavior for list/create range flow.

### BTCF-12
`qa(closure): run focused backtests remediation pack and sync canonical queue/context`
- Required commands:
  - `pnpm --filter api run test -- --run src/modules/backtests/backtests.e2e.test.ts`
  - `pnpm --filter web run test -- --run src/features/backtest/components/BacktestsRunsTable.test.tsx src/features/backtest/components/BacktestCreateForm.test.tsx`
  - `pnpm --filter api run typecheck`
  - `pnpm --filter web run typecheck`
  - `pnpm run quality:guardrails`
  - `pnpm i18n:audit:route-reachable:web` (if copy/routes changed)
- Done when:
  - focused pack is green and queue/context docs are synchronized.

---

## Stage DoD

### Stage A DoD (`BTCF-A`)
- Backtests list API exposes enriched fields required by requested table.
- UI table shows exact requested columns.

### Stage B DoD (`BTCF-B`)
- Create form supports explicit start/end range and validated slider bounds `250..10000`.
- Backend run path uses explicit range (`startAt/endAt`) end-to-end.

### Stage C DoD (`BTCF-C`)
- i18n and docs are synchronized.
- Backward compatibility for old runs is regression-locked.
- Closure validation pack passes.

## Acceptance Criteria
1. `/dashboard/backtests/list` shows exactly:
   - `Strategy`, `Markets`, `Init balance`, `Status`, `Start`, `Actions`.
2. Create form on md+ uses 3-column layout and exposes independent strategy + market contexts.
3. User can set `startAt/endAt`; `endAt` cannot exceed current allowed boundary.
4. Slider uses `250..10000`.
5. Backtest execution uses selected explicit time window, not implicit now-backward fallback.
6. Existing run history (without new range fields) remains compatible.

## Key Risks
1. Timezone/last-closed-candle boundary inconsistencies.
2. High compute load for large window + low interval + many markets.
3. Ambiguous source-of-truth between range fields and candles slider if sync rules are not explicit.
4. List contract drift if enrich is partially implemented in API and partially remapped in web.
