# LUC-1679 Dashboard Bots Runtime Page Browser Review

- Agent: `09 QVE (QA & Verification Engineer)`
- Issue: `[LUC-1679](/LUC/issues/LUC-1679)`
- Scope: prove the Dashboard overview `needs_browser_review` row for
  `apps/web/src/app/dashboard/bots/runtime/page.tsx`.

## Result

- Classification: `implemented and verified`
- Verified proof basis:
  - fresh focused page test pass on 2026-07-22 for
    `apps/web/src/app/dashboard/bots/runtime/page.test.tsx`
  - fresh same-day exact protected-route proof row already captured under
    `LUC-1665` for `/dashboard/bots/runtime`
- Source-truth outcome:
  the legacy runtime helper page now has exact QA evidence showing
  authenticated local access reaches `/dashboard/bots/runtime` and resolves to
  `/dashboard/bots` under the protected cookie gate.

## Evidence Readback

- `corepack pnpm --filter web exec vitest run src/app/dashboard/bots/runtime/page.test.tsx --reporter=verbose`
  passed (`1` file / `4` tests), proving:
  - `botId` redirects to `/dashboard/bots/<id>/preview`
  - empty query falls back to `/dashboard/bots`
  - legacy `orders` redirects to `/dashboard#orders`
  - legacy `positions` redirects to `/dashboard#positions`
- Targeted JSON readback from
  `history/artifacts/luc-1665-local-protected-route-action-proof-matrix-2026-07-22.json`
  confirms the exact row for `SOAR-ACTION-VISIT-PAGE-BOT-RUNTIME`:
  - route: `/dashboard/bots/runtime`
  - result: `PASS`
  - observedPath: `/dashboard/bots`
  - notes: `redirect reached expected bots route with local cookie gate`

## Diagnosis

- `apps/web/src/app/dashboard/bots/runtime/page.tsx` is a legacy helper route,
  not a stateful page surface.
- The exact browser-review requirement for this row is satisfied when the
  protected local harness proves authenticated access reaches the helper route
  and resolves to the canonical bots route, while the focused page test proves
  the redirect branches remain wired to the expected destinations.
- A separate broad harness rerun was unnecessary because the fresh same-day
  `LUC-1665` artifact already contains the exact page-bound route row for
  `/dashboard/bots/runtime`.

## Residual Risk

- No production login, deploy, source-control closure, or runtime mutation was
  performed in this issue.
- This packet proves the local runtime helper route only. If generated
  app-completion/project-truth indexes still need ingestion or regeneration,
  that remains a separate Documentation/Memory lane.
