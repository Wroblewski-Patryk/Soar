# LUC-1673 Dashboard Bots New Page Browser Review

- Agent: `09 QVE (QA & Verification Engineer)`
- Issue: `[LUC-1673](/LUC/issues/LUC-1673)`
- Scope: prove the Dashboard overview `needs_browser_review` row for
  `apps/web/src/app/dashboard/bots/new/page.tsx`.

## Result

- Classification: `implemented and verified`
- Verified proof basis:
  - fresh focused alias-route redirect test pass on 2026-07-22
  - fresh same-day exact local protected-route proof row already captured under
    `LUC-1665`
- Source-truth outcome:
  the alias page now has exact QA evidence showing `/dashboard/bots/new`
  redirects into the canonical create route under the protected local browser
  harness.

## Evidence Readback

- `corepack pnpm --filter web exec vitest run src/app/dashboard/bots/new/page.test.tsx --reporter=verbose`
  passed (`1` file / `1` test), proving:
  - the page immediately calls `redirect("/dashboard/bots/create")`
- Targeted JSON readback from
  `history/artifacts/luc-1665-local-protected-route-action-proof-matrix-2026-07-22.json`
  confirms:
  - `SOAR-ACTION-VISIT-PAGE-BOT-NEW-ALIAS` for `/dashboard/bots/new` is `PASS`
  - `observedPath` is `/dashboard/bots/create`
  - notes: `redirect reached expected bots route with local cookie gate`

## Diagnosis

- `apps/web/src/app/dashboard/bots/new/page.tsx` is a legacy alias page, not an
  independent screen.
- The exact browser-review requirement for this row is satisfied when the alias
  route lands on `/dashboard/bots/create` inside the approved local protected
  route harness.
- A separate full browser rerun was unnecessary because the fresh same-day
  `LUC-1665` artifact already contains the exact alias route row.

## Residual Risk

- No production login, deploy, source-control closure, or runtime mutation was
  performed in this issue.
- This packet proves the local alias redirect only. If generated
  app-completion/project-truth indexes still need ingestion or regeneration,
  that remains a separate Documentation/Memory lane.
