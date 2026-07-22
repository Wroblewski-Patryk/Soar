Done

- Ingested the exact Dashboard overview proof for
  `apps/web/src/app/dashboard/bots/page.tsx`
  (`route:page-tsx:0101cdb776`) into the canonical docs-memory inputs.
- Added the direct doc link in
  `docs/architecture/relations/documentation-links.csv`, the direct focused
  test link in `docs/architecture/relations/priority-test-links.csv`, and the
  scoped verified route override in `docs/architecture/scanner-overrides.json`.
- Reused the fresh `LUC-1676` QA packet plus the same-day authenticated route
  proof row `SOAR-ACTION-VISIT-PAGE-BOTS-LIST` from
  `history/artifacts/luc-1665-local-protected-route-action-proof-matrix-2026-07-22.json`.
- Reran the canonical generator chain in order:
  `build-architecture-awareness-index -> build-app-completion-index -> build-project-truth-indexes --apply`.
- Durable packet added:
  `history/tasks/luc-1677-ingest-dashboard-bots-overview-proof-2026-07-22-task.md`
  and
  `history/evidence/luc-1677-ingest-dashboard-bots-overview-proof-2026-07-22.md`.
- No runtime code, deploy state, production auth, or exchange state changed.
- Residual: this closes the exact docs-memory ingest only; any remaining
  dashboard browser-review rows are separate follow-up routes.
