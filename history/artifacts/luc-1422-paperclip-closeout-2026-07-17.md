Frontend/browser proof for `apps/web/src/app/dashboard/backtests/[id]/page.tsx` is complete.

What changed:
- added a `scanner-overrides.json` browser-proof override for the backtests detail route wrapper
- added `history/tasks/luc-1422-dashboard-backtests-detail-browser-review-2026-07-17-task.md`
- added `history/evidence/luc-1422-dashboard-backtests-detail-browser-review-2026-07-17.md`
- captured fresh browser-harness output in
  `history/evidence/luc-1422-local-protected-route-action-proof-matrix-2026-07-17.md`
  and `history/artifacts/luc-1422-local-protected-route-action-proof-matrix-2026-07-17.json`
- updated `.codex/context/TASK_BOARD.md`, `.codex/context/PROJECT_STATE.md`,
  and `.agents/state/module-confidence-ledger.md`

Verification:
- `corepack pnpm --filter web exec vitest run src/app/dashboard/backtests/[id]/page.test.tsx --reporter verbose`
  -> PASS (`1` file / `1` test)
- `node scripts/runLocalProtectedRouteActionProof.mjs --issue LUC-1422 --today 2026-07-17 --clusters backtests --dynamic-fixtures-only --intercept-fixture-api`
  -> PASS
- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-architecture-awareness-index.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar`
  -> PASS
- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-app-completion-index.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar`
  -> PASS; `docs/status/app-completion-index.md` no longer lists
  `apps/web/src/app/dashboard/backtests/[id]/page.tsx`
- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-project-truth-indexes.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar --apply`
  -> PASS but still emits the stale wrapper row in
  `docs/status/project-truth-index.json`

Disposition:
- `blocked`

Blocker:
- owner: Engineering Delivery Lead / project-truth tooling owner
- unblock action: diagnose why `build-project-truth-indexes.mjs` still routes
  `apps/web/src/app/dashboard/backtests/[id]/page.tsx` as
  `needs_browser_review` after the refreshed `app-completion` queue is clean

Residual risk:
- no production protected proof, real owner-session proof, or feature-level
  `BacktestRunDetails.tsx` closure was claimed
- no backtest mutation, deploy, push, exchange action, or secret/account
  readback occurred
