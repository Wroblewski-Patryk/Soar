LUC-1686 closeout

- Scope verified: `apps/web/src/app/dashboard/markets/[id]/edit/page.tsx`
- Focused test:
  `corepack pnpm --filter web exec vitest run src/app/dashboard/markets/[id]/edit/page.test.tsx --reporter=verbose`
  -> PASS (`1` file, `1` test)
- Browser proof source:
  `history/artifacts/luc-1686-local-protected-route-action-proof-matrix-2026-07-22.json`
  contains exact PASS row
  `SOAR-ACTION-VISIT-PAGE-MARKET-EDIT -> /dashboard/markets/luc-2188-market/edit`
- Residual risk:
  shared `markets` cluster packet also logged unrelated create CTA failure
  `SOAR-ACTION-VISIT-PAGE-MARKET-CREATE -> create/add button not found`; this
  does not invalidate the exact edit-page route proof but needs separate
  follow-up for the markets list/create path.
- Source control:
  no commit/push/deploy; QA packet only.
