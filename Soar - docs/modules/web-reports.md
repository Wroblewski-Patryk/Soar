# Web Deep-Dive: Reports Module

## Metadata
- Module name: `reports`
- Layer: `web`
- Source path: `apps/web/src/features/reports`
- Owner: frontend/reporting
- Last updated: 2026-05-21
- Related planning task: `FRONTEND-ENGINE-UX-DCA-SWEEP-2026-05-21`

## 1. Purpose and Scope
- Renders performance analytics page under `/dashboard/reports`.
- Combines:
  - cross-mode performance summary (BACKTEST/PAPER/LIVE)
  - aggregated per-run performance statistics

Out of scope:
- Raw backtest timeline detail rendering (backtest module).
- Persistent reporting export pipelines.

## 2. Boundaries and Dependencies
- Route entrypoint:
  - `/dashboard/reports`
- Depends on:
  - reports API service (`/dashboard/reports/cross-mode-performance`)
  - backtest APIs for completed runs and reports
  - shared locale formatting helpers

## 3. Data and Contract Surface
- API contracts:
  - `getCrossModePerformance()`
  - `listBacktestRuns("COMPLETED")`
  - `getBacktestRunReport(runId)`
- UI metrics:
  - reports count
  - average net pnl
  - average win rate
  - best run summary

## 4. Runtime Flows
- Load flow:
  1. Fetch completed runs and cross-mode performance in parallel.
  2. Resolve report payload for recent runs with per-run partial degradation.
  3. Compute dashboard summary metrics.
  4. Render mode comparison and per-run performance tables.

## 5. UI Integration
- Main component:
  - `PerformanceReportsView`
- State model:
  - loading
  - error
  - empty (no reports)
  - success (cards + tables)

## 6. Security and Risk Guardrails
- All report data is sourced through authenticated dashboard API client.
- Missing report rows are safely filtered out of run table rendering.
- A failed individual backtest report request must not take down the full
  reports page when other completed run reports and cross-mode data remain
  available.

## 7. Observability and Operations
- Cross-mode table gives operator-level parity snapshot for runtime/backtest outcomes.
- Error state includes retry path for transient backend outages.
- Per-run report fanout uses partial success semantics; page-level error is
  reserved for completed-runs or cross-mode summary failures.

## 8. Test Coverage and Evidence
- Primary tests:
  - `PerformanceReportsView.test.tsx`
  - `app/dashboard/reports/page.test.tsx`
- 2026-05-21 resilience proof:
  - `PerformanceReportsView.test.tsx` verifies that one failed per-run report
    request still renders available reports instead of showing the global error
    state.
- Suggested validation command:
```powershell
pnpm --filter web test -- src/features/reports/components/PerformanceReportsView.test.tsx src/app/dashboard/reports/page.test.tsx
```

## 9. Open Issues and Follow-Ups
- Continue i18n hardening for remaining static labels in report cards/tables.
- Consider report query filters (date range, bot, market, strategy) for larger datasets.
