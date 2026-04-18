# UXR-G Dashboard Wallet + Manual Order Layout Plan (2026-04-18)

Status: queued-after-current-phase  
Execution mode: tiny-commit only (one task per commit)  
Primary audience: execution agent

## Start Gate
- Do not start this wave before active `BRS` queue is closed.
- When `BRS` is closed, execute `UXR-G-01..UXR-G-06` in order.

## Source Request (condensed)
- Move `Manual order` out of Wallet internals and render it as its own section directly below Wallet (same hierarchy level in dashboard runtime sidebar).
- Restyle Wallet `Portfolio` KPI row to match the simple inline summary row style used by rows like `Allocation`.
- Render `Free funds` and `In positions` KPI blocks at `50% / 50%` width.
- Move `Delta from start` row higher, directly below `Allocation`.

## Locked Implementation Decisions
1. Manual-order behavior must stay unchanged:
   - keep the same backend command path and payload semantics,
   - this wave changes layout/ergonomics only.
2. Wallet KPI visual contract:
   - `Portfolio` uses plain summary-row style (no card-like border/background treatment),
   - `Free funds` and `In positions` remain emphasized rows but split evenly into two columns.
3. Order of summary rows:
   - `Allocation` first,
   - `Delta from start` directly after `Allocation`,
   - then remaining summary content.
4. Responsive rule:
   - keep two-column (`50/50`) layout for `Free funds` and `In positions` in the runtime sidebar container.

## Execution Groups (commit batches)
1. `UXR-G-A (commits UXR-G-01..UXR-G-03): contract freeze + section hierarchy + wallet row order/style`
2. `UXR-G-B (commits UXR-G-04..UXR-G-06): 50/50 KPI split + regression + closure`

## Tiny-Commit Queue

### UXR-G-01
`docs(contract): freeze dashboard wallet/manual-order layout and row-order contract`
- Scope:
  - lock final layout contract and acceptance criteria for this wave.
- Likely files:
  - `docs/planning/open-decisions.md`
  - `docs/modules/web-dashboard-home.md`
- Done when:
  - implementation has one unambiguous layout target.

### UXR-G-02
`refactor(web-dashboard-sidebar): place manual-order section below wallet as peer section`
- Scope:
  - move `Manual order` rendering so it is not nested as wallet internals,
  - keep data flow and submit behavior intact.
- Likely files:
  - `apps/web/src/features/dashboard-home/components/HomeLiveWidgets.tsx`
  - `apps/web/src/features/dashboard-home/components/home-live-widgets/RuntimeSidebarSection.tsx`
- Done when:
  - runtime sidebar shows Wallet section, then Manual order section directly under it.

### UXR-G-03
`refactor(web-wallet-kpi): simplify portfolio row style and move delta directly under allocation`
- Scope:
  - `Portfolio` row uses same visual language as simple summary rows (`Allocation` style),
  - reorder summary rows so `Delta from start` appears right below `Allocation`.
- Likely files:
  - `apps/web/src/features/dashboard-home/components/home-live-widgets/RuntimeSidebarSection.tsx`
  - `apps/web/src/features/dashboard-home/components/HomeLiveWidgets.test.tsx`
- Done when:
  - row order and style match requested structure.

### UXR-G-04
`refactor(web-wallet-kpi-layout): enforce 50/50 width for free-funds and in-positions rows`
- Scope:
  - layout update for `Free funds` and `In positions` to equal two-column split.
- Likely files:
  - `apps/web/src/features/dashboard-home/components/home-live-widgets/RuntimeSidebarSection.tsx`
  - `apps/web/src/features/dashboard-home/components/HomeLiveWidgets.test.tsx`
- Done when:
  - both KPI blocks render at equal half-width in the sidebar layout.

### UXR-G-05
`test(web-dashboard-home): lock manual-order placement and wallet KPI order/layout regressions`
- Scope:
  - add/update focused tests for:
    - manual-order section placement below wallet,
    - portfolio row style contract,
    - delta row order,
    - 50/50 split contract for free/in-positions.
- Suggested files:
  - `apps/web/src/features/dashboard-home/components/HomeLiveWidgets.test.tsx`
- Done when:
  - regressions fail on old layout and pass on new layout.

### UXR-G-06
`qa(web-closure): run focused dashboard-home pack + typecheck/build and sync queue notes`
- Mandatory checks:
  - `pnpm --filter web test -- src/features/dashboard-home/components/HomeLiveWidgets.test.tsx`
  - `pnpm --filter web run typecheck`
  - `pnpm --filter web run build`
- Done when:
  - focused tests and closure checks are green, and canonical queue docs are updated.

## Definition of Done (Wave)
- Manual order appears as a standalone section below Wallet in runtime sidebar.
- Portfolio row style is aligned to simple inline summary rows.
- `Free funds` and `In positions` render in equal half-width layout.
- `Delta from start` is directly below `Allocation`.
- Focused dashboard-home regression coverage and web closure checks pass.

## Risk and Rollback
- Risk:
  - layout refactor can accidentally break action wiring for manual order controls.
- Mitigation:
  - keep logic untouched, change rendering hierarchy only, lock with focused test.
- Rollback:
  - revert only the latest tiny commit affecting layout if regression appears; keep docs contract commit.

## Request-to-Task Mapping
- Manual order moved below wallet (same level): `UXR-G-02`
- Portfolio row style aligned with allocation-style row: `UXR-G-03`
- Free funds + in positions at 50% each: `UXR-G-04`
- Delta from start moved under allocation: `UXR-G-03`
- Regression safety + closure: `UXR-G-05`, `UXR-G-06`
