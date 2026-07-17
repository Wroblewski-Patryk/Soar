# LUC-1437 Dashboard Backtests List Browser Review

- Agent: `09 FEW (Frontend Web Engineer)`
- Issue: `[LUC-1437](/LUC/issues/LUC-1437)`
- Scope: prove the `needs_browser_review` row for `apps/web/src/app/dashboard/backtests/list/page.tsx`.

## Result

- Classification: `implemented and verified`
- Verified proof basis:
  - fresh local protected-route browser proof on `2026-07-17`
  - fresh focused backtests list route-shell test pass on `2026-07-17`
- Source-truth outcome:
  the `needs_browser_review` risk for
  `apps/web/src/app/dashboard/backtests/list/page.tsx` is cleared in the
  regenerated `app-completion` and `project-truth` indexes after adding the
  missing scanner override for the list route wrapper.

## Evidence Readback

- `apps/web/src/app/dashboard/backtests/list/page.tsx` renders the route shell,
  localized breadcrumb, and Create CTA that navigates to
  `/dashboard/backtests/create`.
- `history/evidence/luc-1437-local-protected-route-action-proof-matrix-2026-07-17.md`
  records:
  - unauthenticated `/dashboard/backtests/list` fails closed to `/auth/login`
  - synthetic fixture route `/dashboard/backtests/luc-2188-backtest-run`
    remains reachable as part of the same backtests cluster proof
  - list-page create action navigates to `/dashboard/backtests/create`
- `history/artifacts/luc-1437-local-protected-route-action-proof-matrix-2026-07-17.json`
  stores the raw browser-harness results for the same run.
- Fresh focused route proof on `2026-07-17`:
  `corepack pnpm --filter web exec vitest run src/app/dashboard/backtests/list/page.test.tsx --reporter verbose`
  passed (`1` file / `1` test), covering the canonical list heading,
  breadcrumb, rendered list view handoff, and Create CTA navigation.
- Fresh generated readback on `2026-07-17`:
  - `docs/status/app-completion-index.md` no longer lists
    `apps/web/src/app/dashboard/backtests/list/page.tsx` in the priority review
    queue
  - `docs/status/project-truth-index.json` no longer routes
    `apps/web/src/app/dashboard/backtests/list/page.tsx` as
    `Dashboard overview / needs_browser_review`

## Harness Note

- This packet intentionally closes the route-wrapper browser-review row only.
- The local protected-route harness uses synthetic IDs plus fixture API
  interception, which is sufficient for route/browser-review closure on the
  wrapper page but does not claim production auth/session proof or real
  backtest-run data.

## Residual Risk

- This packet does not claim production protected proof, real authenticated
  owner-session proof, or `BacktestsListView.tsx` feature-level closure beyond
  the route wrapper and shell navigation contract.
- No backtest creation, deletion, report mutation, deploy, push, production
  login, secret readback, or exchange action occurred.
