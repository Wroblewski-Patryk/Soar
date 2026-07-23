# LUC-1686 Dashboard Market Edit Page Browser Review

## Scope

- Issue: `LUC-1686`
- Indexed source item:
  `apps/web/src/app/dashboard/markets/[id]/edit/page.tsx`
- App completion row:
  `Dashboard overview | needs_browser_review | screen_or_route | page.tsx`
- Architecture entities:
  `SOAR-PAGE-MARKET-EDIT`, `SOAR-FEATURE-MARKETS`,
  `SOAR-COMP-MARKET-UNIVERSE-FORM`, `SOAR-TEST-MARKETS-WEB`
- User action:
  `SOAR-ACTION-VISIT-PAGE-MARKET-EDIT`

## Current-State Readback

- `docs/status/app-completion-index.md` still listed
  `apps/web/src/app/dashboard/markets/[id]/edit/page.tsx` as a live
  `needs_browser_review` gap before this heartbeat.
- The page already had focused route coverage in
  `apps/web/src/app/dashboard/markets/[id]/edit/page.test.tsx`.
- The local protected-route proof runner already contained a dynamic `markets`
  action for `SOAR-ACTION-VISIT-PAGE-MARKET-EDIT` using the synthetic fixture
  id `luc-2188-market`.

## Commands

```powershell
corepack pnpm --filter web exec vitest run src/app/dashboard/markets/[id]/edit/page.test.tsx --reporter=verbose
```

Result: `PASS` (`1` file, `1` test).

```powershell
node scripts/runLocalProtectedRouteActionProof.mjs --issue LUC-1686 --today 2026-07-22 --clusters markets --dynamic-fixtures-only --intercept-fixture-api --output-json history/artifacts/luc-1686-local-protected-route-action-proof-matrix-2026-07-22.json --output-md history/evidence/luc-1686-local-protected-route-action-proof-matrix-2026-07-22.md
```

Result: cluster `FAIL`, with exact target route row `PASS` and unrelated
create CTA row `FAIL`.

## Findings

### 1. Focused route-shell test is green

- `apps/web/src/app/dashboard/markets/[id]/edit/page.test.tsx` passed.
- The test proves the page requests `getMarketUniverse('market-55')`, renders
  a single H1, shows breadcrumb navigation, and mounts the shared
  `MarketUniverseForm` in `edit` mode with `formId='market-universe-form-edit'`.

### 2. Exact browser-review route proof is present

- The fresh same-day local protected-route packet contains:
  `SOAR-ACTION-VISIT-PAGE-MARKET-EDIT | /dashboard/markets/luc-2188-market/edit | PASS | /dashboard/markets/luc-2188-market/edit`
- This is sufficient exact route evidence for the source item targeted by
  `LUC-1686`.

### 3. Separate markets create CTA regression surfaced in the shared cluster run

- The same `markets` cluster packet also recorded:
  `SOAR-ACTION-VISIT-PAGE-MARKET-CREATE | markets list-page add action | FAIL | /dashboard/markets/list | create/add button not found`
- This failure is outside the exact route targeted by `LUC-1686`.
- Because the proof runner currently executes the shared create CTA when the
  `markets` cluster is selected, the packet is not a full family-green proof
  even though the exact edit route row passed.

## Evidence Files

- `history/tasks/luc-1686-dashboard-market-edit-page-browser-review-2026-07-22-task.md`
- `history/evidence/luc-1686-dashboard-market-edit-page-browser-review-2026-07-22.md`
- `history/evidence/luc-1686-local-protected-route-action-proof-matrix-2026-07-22.md`
- `history/artifacts/luc-1686-local-protected-route-action-proof-matrix-2026-07-22.json`

## Conclusion

- Exact issue scope status:
  `implemented and verified`
- Exact proof claim:
  `apps/web/src/app/dashboard/markets/[id]/edit/page.tsx` now has fresh
  route-specific QA evidence for `SOAR-ACTION-VISIT-PAGE-MARKET-EDIT`.
- Source control status:
  no commit, push, or deploy occurred in this QA-only lane.
- Residual risk:
  the shared markets cluster still exposes a separate list/create CTA browser
  regression, so Documentation/Memory should ingest the edit-page proof while a
  follow-up lane handles the list/create path independently.
