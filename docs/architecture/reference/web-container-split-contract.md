# Web Container Split Contract (`SCALE-11`)

Status: Active  
Last updated: 2026-04-22 (`SCALE-17`)  
Scope: `HomeLiveWidgets` and `BacktestRunDetails`

## Purpose

Freeze one ownership contract for large web containers so future work extends
stable seams instead of re-growing mixed controller/view-model/presenter logic
inside route-level components.

## Shared Rules

- Route container owns composition only:
  - route-level loading/error/onboarding branching
  - high-level section assembly
  - wiring translated copy + formatting adapters into child seams
- Controller hooks own async orchestration and command paths:
  - fetch/poll/stream subscriptions
  - in-flight/caching state machines
  - submit/update/close command lifecycles
- View-model utilities own deterministic derivations only:
  - no network calls
  - no side effects
  - pure transforms over fetched data
- Presenter sections own markup and section-local interaction rendering only:
  - table/chart/summary visual composition
  - no direct API access
  - no duplicated domain fallback policy

## `HomeLiveWidgets` Ownership

### Container (`HomeLiveWidgets.tsx`)

- Keeps:
  - top-level runtime state branching and section composition
  - wiring i18n labels/formatters into presenters and hooks
  - local modal-only UI draft state (position-edit modal shell)
- Must not add:
  - new manual-order state machines
  - new runtime polling/stream orchestration
  - new table/summary derivation blocks

### Controller Hooks

- `useHomeLiveWidgetsController`:
  - runtime snapshot loading/polling/selection/filters
- `useManualOrderController`:
  - manual-order symbol/side/qty/price state, context loading, slider math,
    submit lifecycle
- `useCloseRuntimePositionAction`:
  - close-position command lifecycle + toasts

### View-model and Presenter Seams

- `useRuntimeSelectionViewModel` and `runtimeDerivations`:
  - deterministic selected-bot runtime derivations
- `RuntimeDataSection`, `RuntimeSignalsSection`, `RuntimeSidebarSection`:
  - visual section ownership
- `SCALE-13` closure (2026-04-22):
  - runtime table-column configs moved to
    `runtimeDataTablePresenters.tsx`
  - selected-bot sidebar summary/manual-order presenter assembly moved to
    `runtimeSidebarPresenters.ts`.

## `BacktestRunDetails` Ownership

### Container (`BacktestRunDetails.tsx`)

- Keeps:
  - route-level loading/error branching
  - tab-level composition and section switching
  - wiring copy + locale formatters into child seams
- Must not add:
  - new timeline paging/cache orchestration inline
  - new trades analytics/statistics derivation blocks inline
  - new large tab presenter blocks inline

### Existing Seams (already canonical)

- `useBacktestRunCoreData`:
  - core run/report/trades fetch + retry ownership
- `backtestRunDetailsViewModel.ts`:
  - pure derivations (daily performance, synthetic trades, filtering, labels)
- `backtestRunDetailsCharts.tsx`:
  - reusable chart presenters

### `SCALE-14..SCALE-16` Closure Snapshot

- `SCALE-14`:
  - timeline orchestration moved to `useBacktestTimelineOrchestration`
  - scope: chunk loading, cursor progression, cache merge, in-flight locks,
    parity-failed symbol handling
- `SCALE-15`:
  - trades analytics moved to `useBacktestTradesAnalytics`
  - summary/markets/trades/raw tab rendering moved to
    `BacktestRunDetailsTabPanels`
- `SCALE-16`:
  - focused parity/regression pack passed for dashboard + backtests seams,
    with guardrails/build/typecheck gates green

## Future-Agent Coding Rules (`SCALE-17`)

When extending `HomeLiveWidgets` or `BacktestRunDetails`:

1. add async lifecycle or command behavior only in controller hooks,
2. add deterministic transforms only in view-model utilities/hooks,
3. add UI blocks only in presenter modules (tab/section-level),
4. keep route container files as composition shells and avoid new inline
   analytics/presenter growth.

If a change cannot follow this split, document the exception in this file and
link it from task closure evidence in the same task.
