# LUC-1654 Evidence

- Issue: [LUC-1654](/LUC/issues/LUC-1654)
- Date: 2026-07-22
- Agent lane: Documentation Steward
- Scope: refresh the exact Project Truth route item `route:page-tsx:63cfb064e6`
  after the fresh `LUC-1653` local protected-route proof packet.
- Boundary: docs/state/index refresh only; no runtime code change, deploy,
  push, restart, production auth, or live mutation.

## Implemented and verified

- Added the exact edit-route proof override for
  `apps/web/src/app/dashboard/bots/[id]/edit/page.tsx` in
  `docs/architecture/scanner-overrides.json`, reusing the same evidence-backed
  mechanism previously used for the assistant route.
- Added the missing direct documentation and focused test relations in
  `docs/architecture/relations/documentation-links.csv` and
  `docs/architecture/relations/priority-test-links.csv` so the generated
  app-completion layer could see the route's doc/test coverage.
- Rebuilt the architecture-awareness graph, reran the strict drift audit, then
  reran `app-completion` and `project-truth` in dependency order.
- Final readback removed `route:page-tsx:63cfb064e6` from the indexed
  priority-review queue and advanced the first Project Truth gap to
  `route:page-tsx:256cdda64e`
  (`apps/web/src/app/dashboard/bots/[id]/page.tsx`).

## Validation

- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-architecture-awareness-index.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar`
- `pnpm run architecture:graph:drift:strict`
- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-app-completion-index.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar`
- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-project-truth-indexes.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar --apply`
- Targeted JSON readback of:
  `docs/status/app-completion-index.json` and
  `docs/status/project-truth-index.json`

## Readback

- Final `docs/status/app-completion-index.md` counts:
  `needsBrowserReview=35`, `missingTestLink=12`, `missingDocLink=2`,
  `riskItems=49`.
- Final `docs/status/app-completion-index.json` no longer contains
  `route:page-tsx:63cfb064e6` in `priorityReviewItems`.
- Final `docs/status/project-truth-index.json` first gap is now
  `route:page-tsx:256cdda64e` with evidence path
  `apps/web/src/app/dashboard/bots/[id]/page.tsx`.
- Final `docs/status/project-truth-index.json` counts:
  `appCompletionGaps=49`, `totalGaps=49`.

## Note On Refresh Order

- An initial refresh run started `build-app-completion-index` and
  `build-project-truth-indexes` in parallel, which left `project-truth`
  reading the previous app-completion snapshot.
- No generator repair was required. Rerunning those two generators
  sequentially produced the expected current-truth output.

## Conclusion

- This issue did not require a toolchain code repair.
- The smallest correct repair was to add the exact edit-route doc/test
  relations, keep the scoped proof override, and rerun the canonical
  generators in dependency order.
- The next docs/QA owner lane is the new first gap:
  `apps/web/src/app/dashboard/bots/[id]/page.tsx`
  (`route:page-tsx:256cdda64e`).
