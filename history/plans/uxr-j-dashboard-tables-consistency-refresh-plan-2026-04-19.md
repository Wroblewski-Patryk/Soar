# UXR-J Dashboard Tables Consistency Refresh Plan (2026-04-19)

Status: closed (2026-04-19, all tasks `UXR-J-01..UXR-J-08` completed)  
Execution mode: tiny-commit only (exactly one task per commit)  
Primary audience: execution agent

## Start Gate
- Do not interrupt active `NOW` task.
- Execute this wave after `UXR-I` closure (`UXR-I-14`) unless explicitly reprioritized.
- Keep one tiny commit per task (`UXR-J-01..UXR-J-08` in strict order).

## Source and Scope
- Planner input: `history/plans/dashboard-tables-consistency-planner-brief-2026-04-19.md`.
- Core shared components:
  - `apps/web/src/ui/components/TableUi.tsx`
  - `apps/web/src/ui/components/DataTable.tsx`
  - `apps/web/src/ui/components/DataTable.test.tsx`
- Primary consuming tables to regression-check:
  - `apps/web/src/features/bots/components/BotsListTable.tsx`
  - `apps/web/src/features/backtest/components/BacktestsRunsTable.tsx`
  - `apps/web/src/features/wallets/components/WalletsListTable.tsx`
  - `apps/web/src/features/strategies/components/StrategiesList.tsx`
  - `apps/web/src/features/markets/components/MarketUniversesTable.tsx`
  - `apps/web/src/features/profile/components/ApiKeysList.tsx`
  - `apps/web/src/features/logs/components/AuditTrailView.tsx`
  - `apps/web/src/features/dashboard-home/components/home-live-widgets/RuntimeDataSection.tsx`

## Objective
- Unify action-tone semantics and columns-panel behavior across dashboard tables.
- Keep global consistency between system actions and module-specific actions.
- Standardize columns dropdown behavior and icon-only trigger contract with a11y labels.

## Locked Implementation Contract
1. Action color semantics:
   - keep `edit` and `delete` as stable system actions,
   - `clone/copy` must be visually distinct from `edit/delete`,
   - `runtime` and `preview` must share the same dedicated module tone.
2. Columns dropdown behavior:
   - clicking column checkbox does not close dropdown,
   - close only via trigger click, outside click, or `Escape`.
3. Columns trigger visual contract:
   - icon-only by default in all DataTable contexts,
   - keep accessible naming (`aria-label`/`sr-only`).
4. Global-first strategy:
   - update shared presets/controls in one place where possible,
   - avoid per-table ad-hoc tone overrides unless strictly required.

## Execution Groups
1. `UXR-J-A (UXR-J-01..UXR-J-04): contract freeze + shared tone/dropdown/trigger behavior`
2. `UXR-J-B (UXR-J-05..UXR-J-07): focused regression alignment across shared + consuming tables`
3. `UXR-J-C (UXR-J-08): closure checks + canonical sync`

## Tiny-Commit Queue

### UXR-J-01
`docs(contract): freeze dashboard table action-color and columns-dropdown behavior contract`
- Scope:
  - freeze tone mapping and dropdown/trigger behavior rules.
  - lock module action tone parity for `runtime` and `preview`.
- Likely files:
  - `docs/planning/open-decisions.md`
  - `docs/modules/web-dashboard-home.md`
  - `docs/modules/web-bots.md` (if table action contract is documented there)
- Done when:
  - implementation target is unambiguous for shared-table system changes.

### UXR-J-02
`refactor(ui-table-actions): add dedicated module action tone and remap clone/runtime/preview presets`
- Scope:
  - update shared table action preset mapping in `TableUi`.
  - ensure `clone` differs from `edit/delete`.
  - align `runtime` + `preview` to same module tone.
- Likely files:
  - `apps/web/src/ui/components/TableUi.tsx`
- Done when:
  - consuming tables inherit expected tone semantics without per-module overrides.

### UXR-J-03
`refactor(ui-datatable-dropdown): keep columns dropdown open on checkbox toggles`
- Scope:
  - remove checkbox-toggle auto-close path.
  - preserve outside-click, trigger-toggle, and `Escape` close behavior.
- Likely files:
  - `apps/web/src/ui/components/DataTable.tsx`
- Done when:
  - multi-select column toggling works without dropdown dismissal.

### UXR-J-04
`refactor(ui-datatable-trigger): enforce icon-only columns trigger globally with a11y label`
- Scope:
  - set icon-only columns trigger as default contract.
  - preserve accessible text via `aria-label`/`sr-only`.
- Likely files:
  - `apps/web/src/ui/components/DataTable.tsx`
  - `apps/web/src/features/profile/components/ApiKeysList.tsx` (only if explicit override cleanup required)
- Done when:
  - all tables render icon-only trigger by default and remain accessible.

### UXR-J-05
`test(ui-datatable): add regression tests for dropdown persistence and icon-only trigger contract`
- Scope:
  - lock checkbox toggle persistence behavior.
  - lock close behavior (`outside click`, `Escape`, trigger).
  - lock icon-only + a11y label contract.
- Likely files:
  - `apps/web/src/ui/components/DataTable.test.tsx`
- Done when:
  - tests fail on old behavior and pass with new contract.

### UXR-J-06
`test(ui-table-actions): add preset tone regression tests for clone/runtime/preview mapping`
- Scope:
  - lock shared preset mapping semantics.
  - validate no accidental regression toward `edit` tones for module actions.
- Likely files:
  - `apps/web/src/ui/components/TableUi.test.tsx` (or nearest existing table-action suite)
- Done when:
  - tone semantics are deterministic under tests.

### UXR-J-07
`test(web-tables-focused): align bots/backtests/profile/runtime table suites to shared table behavior`
- Scope:
  - update focused feature table tests to match new shared contract.
  - ensure no per-module drift in actions/columns behavior.
- Likely files:
  - `apps/web/src/features/bots/components/BotsListTable.test.tsx`
  - `apps/web/src/features/backtest/components/BacktestsRunsTable.test.tsx`
  - `apps/web/src/features/profile/components/ApiKeysList.test.tsx`
  - `apps/web/src/features/dashboard-home/components/HomeLiveWidgets.test.tsx`
- Done when:
  - focused consuming-table suites are green with new shared behavior.

### UXR-J-08
`qa(web-table-closure): run focused suite + typecheck/build and sync queue/context`
- Mandatory checks:
  - `pnpm --filter web run test -- src/ui/components/DataTable.test.tsx src/features/bots/components/BotsListTable.test.tsx src/features/backtest/components/BacktestsRunsTable.test.tsx src/features/profile/components/ApiKeysList.test.tsx src/features/logs/components/AuditTrailView.test.tsx src/features/dashboard-home/components/HomeLiveWidgets.test.tsx --run`
  - `pnpm --filter web run typecheck`
  - `pnpm --filter web run build`
- Done when:
  - focused pack is green and canonical queue/context docs are synchronized.

## Stage Definition of Done

### Stage A DoD (`UXR-J-A`)
- Shared action-tone mapping contract is implemented.
- Columns dropdown behavior matches persistence contract.
- Columns trigger is icon-only by default with preserved a11y.

### Stage B DoD (`UXR-J-B`)
- Shared component tests lock behavior.
- Consuming table tests confirm no module drift.

### Stage C DoD (`UXR-J-C`)
- Focused suites, typecheck, and build pass.
- Queue/context closure notes are synchronized.

## Risks and Rollback
- Risk: module tone has low contrast on some themes.
  - Mitigation: use existing daisy semantic tokens and validate contrast quickly.
  - Rollback: revert only tone remap commit (`UXR-J-02`) while keeping behavior fixes.
- Risk: icon-only trigger breaks tests relying on visible label text.
  - Mitigation: assert by role and accessible name.
  - Rollback: restore prior default via single-commit revert of `UXR-J-04`.
- Risk: dropdown persistence regression for outside-click/Escape.
  - Mitigation: dedicated interaction tests in `UXR-J-05`.
  - Rollback: revert dropdown behavior commit only (`UXR-J-03`).

## Request-to-Task Mapping
- Action color semantics (`clone`, `runtime`, `preview`): `UXR-J-02`, `UXR-J-06`
- Dropdown persistence on checkbox clicks: `UXR-J-03`, `UXR-J-05`
- Global icon-only columns trigger with a11y: `UXR-J-04`, `UXR-J-05`
- Consuming table alignment + regression safety: `UXR-J-07`, `UXR-J-08`
