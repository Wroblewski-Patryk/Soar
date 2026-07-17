# LUC-1422 Dashboard Backtests Detail Browser Review

- Agent: `09 FEW (Frontend Web Engineer)`
- Issue: `[LUC-1422](/LUC/issues/LUC-1422)`
- Scope: prove the `needs_browser_review` row for `apps/web/src/app/dashboard/backtests/[id]/page.tsx`.

## Result

- Classification: `implemented and verified`
- Verified proof basis:
  - fresh local protected-route browser proof on `2026-07-17`
  - fresh focused backtests detail route-shell test pass on `2026-07-17`
- Source-truth outcome:
  the `needs_browser_review` risk for
  `apps/web/src/app/dashboard/backtests/[id]/page.tsx` is cleared in the
  regenerated `app-completion` index. `project-truth` still emits the same row
  after the same refresh pass, which makes the remaining blocker a generated
  truth/tooling contradiction rather than an unproven FE surface.

## Evidence Readback

- `apps/web/src/app/dashboard/backtests/[id]/page.tsx` renders the route shell,
  localized breadcrumb, and delegates the selected run id into
  `BacktestRunDetails`.
- `history/evidence/luc-1422-local-protected-route-action-proof-matrix-2026-07-17.md`
  records:
  - unauthenticated `/dashboard/backtests/list` fails closed to `/auth/login`
  - synthetic fixture route `/dashboard/backtests/luc-2188-backtest-run`
    resolves to the expected detail page
  - list-page create action navigates to `/dashboard/backtests/create`
- `history/artifacts/luc-1422-local-protected-route-action-proof-matrix-2026-07-17.json`
  stores the raw browser-harness results for the same run.
- Fresh focused route proof on `2026-07-17`:
  `corepack pnpm --filter web exec vitest run src/app/dashboard/backtests/[id]/page.test.tsx --reporter verbose`
  passed (`1` file / `1` test), covering the canonical details heading,
  breadcrumb, and run-id handoff to `BacktestRunDetails`.
- Fresh generated readback on `2026-07-17`:
  - `docs/status/app-completion-index.md` no longer lists
    `apps/web/src/app/dashboard/backtests/[id]/page.tsx` in the priority review
    queue
  - `docs/status/project-truth-index.json` still emits
    `Dashboard overview: page.tsx has app-completion risk needs_browser_review`
    with evidence
    `apps/web/src/app/dashboard/backtests/[id]/page.tsx`

## Harness Note

- This packet intentionally closes the route-wrapper browser-review row only.
- The local protected-route harness uses synthetic IDs plus fixture API
  interception, which is sufficient for route/browser-review closure on the
  wrapper page but does not claim production auth/session proof or real
  backtest-run data.

## Residual Risk

- This packet does not claim production protected proof, real authenticated
  owner-session proof, or `BacktestRunDetails.tsx` feature-level closure beyond
  the route wrapper and shell handoff.
- The remaining contradiction is outside the FE/browser lane:
  `build-project-truth-indexes.mjs` still routes the stale wrapper row even
  though the refreshed `app-completion` queue is clean.
- No backtest creation, deletion, report mutation, deploy, push, production
  login, secret readback, or exchange action occurred.
