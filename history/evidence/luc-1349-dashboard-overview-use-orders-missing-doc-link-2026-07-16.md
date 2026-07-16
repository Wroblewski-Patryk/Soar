# LUC-1349 Evidence

- Issue: [LUC-1349](/LUC/issues/LUC-1349)
- Date: 2026-07-16
- Agent lane: Documentation Steward
- Scope: close the Dashboard overview `missing_doc_link` routing for
  `apps/api/src/router/dashboard.routes.ts#/orders`.
- Boundary: no runtime code mutation, no new tests, no deploy, no push,
  no secret/account readback, no DB mutation, no protected smoke.

## Implemented and verified

- `docs/modules/api-orders.md` now records the authenticated dashboard mount
  contract for `apps/api/src/router/dashboard.routes.ts#/orders`, clarifying
  that the route delegates runtime open-orders reads and manual-order
  command/read endpoints to the canonical orders module.
- `docs/architecture/relations/documentation-links.csv` now maps
  `apps/api/src/router/dashboard.routes.ts#/orders` to
  `docs/modules/api-orders.md`.
- `docs/architecture/scanner-overrides.json` now adds the matching
  `documents` relation override from the orders module doc to the dashboard
  router mount.
- Regenerated architecture-awareness, app-completion, and project-truth
  outputs no longer list `USE /orders` as `missing_doc_link`.

## Validation

- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-architecture-awareness-index.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar`
- `pnpm run architecture:graph:drift:strict`
- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-app-completion-index.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar`
- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-project-truth-indexes.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar --apply`
- `rg -n "USE /orders|USE /positions|missing_doc_link|missing_test_link" docs/status/app-completion-index.md docs/status/project-truth-index.md -S`
- `git diff --check`

## Readback

- `docs/status/app-completion-index.md` no longer lists
  `USE /orders` in the priority review queue.
- Dashboard overview flow summary now shows
  `{"ok":3,"missing_test_link":8,"needs_browser_review":30}` and no remaining
  `missing_doc_link` rows.
- `docs/status/project-truth-index.md` no longer routes
  `Dashboard overview: USE /orders` as the first project-truth gap.
- The first overall project-truth gap now advances to
  `apps/api/src/router/dashboard.routes.ts#/positions` as `missing_test_link`.
- App-completion aggregate counts changed from
  `missingDocLink=3` / `riskItems=64` to `missingDocLink=2` / `riskItems=63`.
- The only remaining generated `missing_doc_link` rows are now
  `apps/api/src/router/index.ts#/alerts` and
  `apps/api/src/router/index.ts#/metrics`.

## Source-control and release status

- Local commit SHA: none.
- No-commit reason: this heartbeat performed scoped documentation/index repair
  and validation only; commit/push/deploy were not requested in this run.
- Push status: not pushed.
- Deploy impact: none.

## Residual

- This issue closes only the scoped dashboard orders router doc-link lane;
  later proof and browser-review gaps remain separate work.
- The next docs-owned generated gaps are `GET /alerts` and `GET /metrics`
  under Unclassified user workflow.
