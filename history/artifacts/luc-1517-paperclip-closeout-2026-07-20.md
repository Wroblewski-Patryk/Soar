# LUC-1517 Closeout

- Issue: `LUC-1517`
- Date: `2026-07-20`
- Final status: `done`

## Outcome

`apps/web/src/app/dashboard/page.tsx` is now cleared from the app-completion
`needs_browser_review` gap after fresh local browser-backed proof, focused
dashboard route-shell verification, and source-of-truth regeneration.

## Verification

- `node --test scripts/runLocalProtectedRouteActionProof.test.mjs`
  - passed (`8/8`)
- `corepack pnpm --filter web exec vitest run src/app/dashboard/dashboard.a11y.smoke.test.tsx --reporter verbose`
  - passed (`1` file / `5` tests)
- `node scripts/runLocalProtectedRouteActionProof.mjs --issue LUC-1517 --today 2026-07-20 --clusters dashboard --intercept-fixture-api --output-json history/artifacts/luc-1517-local-protected-route-action-proof-matrix-2026-07-20.json --output-md history/evidence/luc-1517-local-protected-route-action-proof-matrix-2026-07-20.md`
  - passed; unauthenticated `/dashboard` still fails closed to `/auth/login`
  - passed; authenticated synthetic-cookie `/dashboard` remains on `/dashboard`
- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-architecture-awareness-index.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar`
  - passed
- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-app-completion-index.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar`
  - passed; dashboard root route no longer appears in the app-completion risk table
- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-project-truth-indexes.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar --apply`
  - passed; dashboard root route no longer appears as a routed app-completion gap

## Evidence

- `history/evidence/luc-1517-dashboard-overview-page-browser-review-2026-07-20.md`
- `history/evidence/luc-1517-local-protected-route-action-proof-matrix-2026-07-20.md`
- `history/evidence/luc-1519-local-protected-route-action-proof-matrix-2026-07-20.md`
- `history/tasks/luc-1517-dashboard-overview-page-browser-review-2026-07-20-task.md`
- `docs/architecture/scanner-overrides.json`
- `docs/modules/system-modules.md`

## Residual Risk

- This issue proves the local dashboard route wrapper only.
- External public probe still reports `https://api.soar.luckysparrow.ch/ready`
  as `503 {"status":"not_ready","service":"api"}`; that runtime gap remains
  outside `LUC-1517`.
