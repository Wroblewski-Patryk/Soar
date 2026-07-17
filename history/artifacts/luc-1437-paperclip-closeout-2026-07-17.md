# LUC-1437 Closeout

## Outcome

- Closed the dashboard backtests list route-wrapper browser-review lane for
  `apps/web/src/app/dashboard/backtests/list/page.tsx`.
- Captured fresh local browser proof and focused route-shell test evidence.
- Added the missing scanner override and module-document relation so generated
  source truth now clears the route-wrapper row consistently.

## Files Changed

- `docs/architecture/scanner-overrides.json`
- `history/evidence/luc-1437-dashboard-backtests-list-browser-review-2026-07-17.md`
- `history/tasks/luc-1437-dashboard-backtests-list-browser-review-2026-07-17-task.md`
- `.codex/context/PROJECT_STATE.md`
- regenerated `docs/graphs/*` and `docs/status/*` outputs

## Verification

- `corepack pnpm --filter web exec vitest run src/app/dashboard/backtests/list/page.test.tsx --reporter verbose`
  -> PASS (`1` file / `1` test)
- `node scripts/runLocalProtectedRouteActionProof.mjs --issue LUC-1437 --today 2026-07-17 --clusters backtests --dynamic-fixtures-only --intercept-fixture-api`
  -> PASS
- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-architecture-awareness-index.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar`
  -> PASS (`entityOverridesApplied=77`, `relationOverridesApplied=92`)
- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-app-completion-index.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar`
  -> PASS (`needsBrowserReview=39`)
- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-project-truth-indexes.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar --apply`
  -> PASS for index refresh; known unrelated public probe still reports
  `api_ready` `503`

## Readback

- `docs/status/app-completion-index.{md,json}` no longer list
  `apps/web/src/app/dashboard/backtests/list/page.tsx`.
- `docs/status/project-truth-index.{md,json}` no longer route the same path as
  `Dashboard overview / needs_browser_review`.

## Residual Risk

- This closes the route-wrapper browser-review row only.
- It does not claim production protected-session proof or feature-level browser
  closure for `apps/web/src/features/backtest/components/BacktestsListView.tsx`.
- No deploy, production login, backtest mutation, exchange action, or secret
  readback occurred.
