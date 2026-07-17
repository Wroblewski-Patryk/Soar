# LUC-1436 Dashboard Backtests Create Browser Review

- Agent: `09 QVE (QA & Verification Engineer)`
- Issue: `[LUC-1436](/LUC/issues/LUC-1436)`
- Scope:
  capture truthful browser-review evidence for
  `apps/web/src/app/dashboard/backtests/create/page.tsx` or leave the exact
  repair lane if the route still fails.

## Result

- Classification: `implemented and verified` for the route shell
- Verified proof basis:
  - fresh local protected-route browser proof on Friday, July 17, 2026
  - fresh focused create-page route-shell test pass on Friday, July 17, 2026
- Source-truth outcome:
  the create route did not fail under proof. The remaining gap is that current
  truth-ingestion files do not yet claim the proof for
  `apps/web/src/app/dashboard/backtests/create/page.tsx`.

## Evidence Readback

- `apps/web/src/app/dashboard/backtests/create/page.tsx` renders the create
  route shell, breadcrumb, and `BacktestCreateForm` handoff.
- Fresh focused route proof on Friday, July 17, 2026:
  `corepack pnpm --filter web exec vitest run src/app/dashboard/backtests/create/page.test.tsx --reporter verbose`
  passed (`1` file / `1` test), covering the canonical heading, breadcrumb, and
  create-form delegation.
- Fresh local browser proof on Friday, July 17, 2026:
  `node scripts/runLocalProtectedRouteActionProof.mjs --issue LUC-1436 --today 2026-07-17 --clusters backtests --dynamic-fixtures-only --intercept-fixture-api`
  passed and wrote:
  - `history/evidence/luc-1436-local-protected-route-action-proof-matrix-2026-07-17.md`
  - `history/artifacts/luc-1436-local-protected-route-action-proof-matrix-2026-07-17.json`
- The fresh harness confirms:
  - unauthenticated `/dashboard/backtests/list` still fails closed to `/auth/login`
  - the fixture-backed detail route still resolves cleanly
  - the list-page create action still reaches `/dashboard/backtests/create`
- Current truth wiring still points at a missing claim rather than a broken UI:
  - `docs/status/app-completion-index.md` still lists
    `apps/web/src/app/dashboard/backtests/create/page.tsx` as
    `Dashboard overview / needs_browser_review`
  - `docs/architecture/scanner-overrides.json` contains a verified entry for
    `apps/web/src/app/dashboard/backtests/[id]/page.tsx` but not for the create
    page
  - `docs/modules/web-backtest.md` already references the create-page test path
    but the direct create-page route claim is not yet present in
    `scanner-overrides.json`

## Exact Repair Lane

1. Add a verified browser-proof override entry in
   `docs/architecture/scanner-overrides.json` for
   `apps/web/src/app/dashboard/backtests/create/page.tsx`.
2. Point that override at the same-issue evidence:
   `history/evidence/luc-1436-dashboard-backtests-create-browser-review-2026-07-17.md`,
   `history/evidence/luc-1436-local-protected-route-action-proof-matrix-2026-07-17.md`,
   `history/artifacts/luc-1436-local-protected-route-action-proof-matrix-2026-07-17.json`,
   and `apps/web/src/app/dashboard/backtests/create/page.test.tsx`.
3. If project-truth still needs an explicit route document edge, add the
   matching `docs/modules/web-backtest.md -> apps/web/src/app/dashboard/backtests/create/page.tsx`
   relation beside the existing `[id]` route relation.
4. Refresh the architecture-awareness, app-completion, and project-truth
   generators and confirm the create page clears from the queue.

## Residual Risk

- This packet does not claim production protected proof, real owner-session
  proof, or successful backtest submission.
- No backtest mutation, deploy, push, production login, exchange action, or
  secret/account readback occurred.
- The remaining work is source-of-truth wiring, not a reproduced frontend
  regression.
