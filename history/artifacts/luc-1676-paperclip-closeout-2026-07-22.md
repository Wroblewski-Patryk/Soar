Done

- Verified the exact Dashboard overview `needs_browser_review` row for
  `apps/web/src/app/dashboard/bots/page.tsx`.
- `corepack pnpm --filter web exec vitest run src/app/dashboard/bots/page.test.tsx --reporter=verbose`
  passed on Wednesday, July 22, 2026 (`1/1`).
- Read back the same-day protected-route artifact
  `history/artifacts/luc-1665-local-protected-route-action-proof-matrix-2026-07-22.json`
  and confirmed the exact authenticated row
  `SOAR-ACTION-VISIT-PAGE-BOTS-LIST` passes on `/dashboard/bots` with
  `observedPath=/dashboard/bots`.
- The paired unauthenticated row fails closed as expected for a protected
  dashboard route; that is guardrail evidence, not a blocker against the
  authenticated browser proof.
- Added the durable QA packet:
  `history/tasks/luc-1676-dashboard-bots-page-browser-review-2026-07-22-task.md`
  and
  `history/evidence/luc-1676-dashboard-bots-page-browser-review-2026-07-22.md`.
- No runtime code, deploy state, production auth, or exchange state changed.
- Residual: generated app-completion/project-truth indexes still require a
  separate Documentation/Memory ingest lane if this row should disappear from
  generated backlog outputs.
