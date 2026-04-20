# Dashboard Open Orders Source Column Plan (2026-04-20)

Status: in progress (`OOSC-01` closed; executor-ready for `OOSC-02`)  
Execution mode: tiny-commit only (exactly one task per commit)  
Primary audience: execution agent

## Source Analysis Summary
- Manual order command path (`POST /dashboard/orders/open`) is intentionally `order-only` and must stay unchanged in this wave.
- Dashboard Open Orders table shows active orders only (`PENDING`, `OPEN`, `PARTIALLY_FILLED`) from runtime aggregate scope; this active-only contract must be preserved.
- `Order` already has `origin` (`BOT | USER | EXCHANGE_SYNC | BACKTEST`), but manual-order writes currently rely on default origin and are not explicitly marked as `USER`.
- Runtime open-order projection currently does not expose `origin`, so web cannot render a `Source` column yet.

## Scope
- Add `Source` column in dashboard Open Orders table (no new table).
- Source labels required by product:
  - `Manual`
  - `Bot`
  - `Imported`
- Keep Open Orders table active-only (no history rows).
- Preserve manual-order semantic contract as `order-only`.

## Scope Lock
1. No change to signal cards/context-source behavior in this wave.
2. No new history table for orders in dashboard.
3. No change to status filtering semantics for Open Orders beyond existing active-only contract.
4. No runtime execution behavior rewrite (open/close orchestration untouched).

## Target Contract
1. Dashboard Open Orders includes a `Source` column.
2. `Source` value mapping:
   - `USER -> Manual`
   - `BOT -> Bot`
   - `EXCHANGE_SYNC -> Imported`
   - `BACKTEST -> Imported` (defensive fallback; should not normally appear in this runtime view)
3. Manual orders created from dashboard are persisted with explicit `origin=USER`.
4. Open Orders list remains active-only:
   - `PENDING`
   - `OPEN`
   - `PARTIALLY_FILLED`
5. Manual-order flow remains `order-only` (no direct position creation in this scope).

## Execution Groups
1. `OOSC-A (commits OOSC-01..OOSC-03): contract freeze + API origin/source plumbing`
2. `OOSC-B (commits OOSC-04..OOSC-06): web source column + mapping + regressions`
3. `OOSC-C (commits OOSC-07..OOSC-08): docs sync + closure validation`

## Execution Progress
- 2026-04-20: Closed `OOSC-01` by freezing canonical contract in:
  - `docs/planning/open-decisions.md`
  - `docs/modules/api-orders.md`
  - `docs/modules/web-dashboard-home.md`

---

## Tiny-Commit Queue

### OOSC-01
`docs(contract): freeze dashboard open-orders source-column and active-only status contract`
- Scope:
  - Lock `Source` column semantics for dashboard Open Orders.
  - Lock active-only statuses as unchanged contract.
  - Lock manual-order path as `order-only` in this wave.
- Likely files:
  - `docs/planning/open-decisions.md`
  - `docs/modules/api-orders.md`
  - `docs/modules/web-dashboard-home.md`
- Done when:
  - One canonical contract defines `Source` mapping and active-only status scope.

### OOSC-02
`test(api-red): add regressions for manual-order origin=USER and runtime open-orders origin projection`
- Scope:
  - Add failing regression for manual-order write origin (`USER`).
  - Add failing regression that runtime open-orders payload exposes origin per row.
- Likely files:
  - `apps/api/src/modules/orders/orders-positions.e2e.test.ts`
  - `apps/api/src/modules/bots/bots.monitoring-aggregate.e2e.test.ts`
- Done when:
  - Tests fail on current behavior (manual path default origin / missing origin in projection).

### OOSC-03
`fix(api): persist manual-order origin as USER and expose origin in open-orders runtime payload`
- Scope:
  - Set `origin: 'USER'` in manual order create path.
  - Include `origin` in runtime open-orders select/serialization.
  - Keep active-only status filter unchanged.
- Likely files:
  - `apps/api/src/modules/orders/orders.service.ts`
  - `apps/api/src/modules/bots/runtimeSessionPositionsRead.repository.ts`
  - `apps/web/src/features/bots/types/bot.type.ts` (shared contract typing if needed)
- Done when:
  - API returns active open orders with origin field and manual orders persist as `USER`.

### OOSC-04
`test(web-red): add dashboard open-orders source-column regression with label mapping`
- Scope:
  - Add failing web regression for new `Source` column in Open Orders table.
  - Assert mapping `USER/BOT/EXCHANGE_SYNC -> Manual/Bot/Imported`.
- Likely files:
  - `apps/web/src/features/dashboard-home/components/HomeLiveWidgets.test.tsx`
- Done when:
  - Test fails until source column + mapping exists.

### OOSC-05
`fix(web-dashboard): add open-orders source column and render mapped labels`
- Scope:
  - Add `Source` column in Open Orders table.
  - Render short labels required by product.
  - Keep existing columns and sort behavior stable.
- Likely files:
  - `apps/web/src/features/dashboard-home/components/HomeLiveWidgets.tsx`
- Done when:
  - Dashboard Open Orders visibly shows `Source` with correct mapped values.

### OOSC-06
`feat(i18n): add open-orders source-column labels in dashboard namespaces (en/pl/pt)`
- Scope:
  - Add/align i18n keys for `Source`, `Manual`, `Bot`, `Imported`.
  - Use these keys in Open Orders table rendering.
- Likely files:
  - `apps/web/src/i18n/namespaces/dashboard-home.en.ts`
  - `apps/web/src/i18n/namespaces/dashboard-home.pl.ts`
  - `apps/web/src/i18n/namespaces/dashboard-home.pt.ts`
- Done when:
  - No hardcoded source labels in dashboard Open Orders UI.

### OOSC-07
`docs(sync): update module docs and planner artifacts after source-column rollout`
- Scope:
  - Sync implementation outcome to module docs and planner records.
  - Keep canonical queue/context parity.
- Likely files:
  - `docs/modules/api-orders.md`
  - `docs/modules/web-dashboard-home.md`
  - `.codex/context/TASK_BOARD.md`
  - `.codex/context/PROJECT_STATE.md`
- Done when:
  - Docs reflect final contract and queue/context are synchronized.

### OOSC-08
`qa(closure): run focused open-orders source-column pack and finalize queue/context`
- Required commands:
  - `pnpm --filter api run test -- --run src/modules/orders/orders-positions.e2e.test.ts src/modules/bots/bots.monitoring-aggregate.e2e.test.ts`
  - `pnpm --filter web run test -- --run src/features/dashboard-home/components/HomeLiveWidgets.test.tsx`
  - `pnpm --filter api run typecheck`
  - `pnpm --filter web run typecheck`
  - `pnpm run quality:guardrails`
- Done when:
  - Focused pack is green and canonical queue/context are synchronized.

---

## Stage DoD

### Stage A DoD (`OOSC-A`)
- Contract is frozen for source mapping + active-only statuses.
- API persists manual-origin correctly and exposes origin in runtime open-orders payload.

### Stage B DoD (`OOSC-B`)
- Dashboard Open Orders shows `Source` column with mapped labels.
- Web regressions lock the column behavior.
- i18n coverage exists for all supported dashboard locales.

### Stage C DoD (`OOSC-C`)
- Module docs and canonical queue/context are synchronized.
- Focused closure validation pack is green.

## Acceptance Criteria
1. Open Orders table includes `Source` and no new table is introduced.
2. Source labels are short and mapped as `Manual/Bot/Imported`.
3. Manual dashboard orders are persisted with `origin=USER`.
4. Open Orders remains active-only (`PENDING`, `OPEN`, `PARTIALLY_FILLED`) and does not show history statuses.
5. Manual-order path remains `order-only` in behavior and contract.
