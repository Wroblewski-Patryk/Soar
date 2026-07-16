# LUC-1336 Evidence

- Issue: [LUC-1336](/LUC/issues/LUC-1336)
- Date: 2026-07-16
- Agent lane: Documentation Steward
- Scope: close the Account access `missing_doc_link` routing for
  `apps/api/src/router/dashboard.routes.ts#/markets`.
- Boundary: no runtime code mutation, no new tests, no deploy, no push,
  no secret/account readback, no DB mutation, no protected smoke.

## Implemented and verified

- `docs/architecture/scanner-overrides.json` now adds the explicit
  `documents` relation override from `docs/modules/api-markets.md` to
  `apps/api/src/router/dashboard.routes.ts#/markets`.
- `docs/architecture/relations/documentation-links.csv` now maps
  `apps/api/src/router/dashboard.routes.ts#/markets` to
  `docs/modules/api-markets.md`.
- `docs/graphs/architecture-awareness.json` now links `USE /markets` to the
  `API Deep-Dive: Markets Module` document entity.
- Regenerated app-completion and project-truth outputs no longer list
  `USE /markets` as `missing_doc_link`.

## Validation

- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-architecture-awareness-index.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar`
- `pnpm run architecture:graph:drift:strict`
- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-app-completion-index.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar`
- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-project-truth-indexes.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar --apply`
- `rg -n "USE /markets|missing_doc_link|dashboard.routes.ts#/markets" docs/status/app-completion-index.json docs/status/app-completion-index.md`
- `git diff --check`

## Readback

- `docs/status/app-completion-index.md` now shows
  `Account access: 19 entities; risks {"ok":19}`.
- `docs/status/app-completion-index.md` no longer lists
  `USE /markets` in the priority review queue.
- `docs/status/project-truth-index.md` no longer routes
  `Account access: USE /markets` as the first project-truth gap.
- The first overall project-truth gap now advances to
  `apps/api/src/router/dashboard.routes.ts#/orders` as `missing_test_link`.
- App-completion aggregate counts changed from
  `missingDocLink=3` / `riskItems=65` to `missingDocLink=2` / `riskItems=64`.
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

- This issue closes only the scoped dashboard markets router doc-link lane;
  later proof and browser-review gaps remain separate work.
- The next docs-owned generated gaps are `GET /alerts` and `GET /metrics`
  under Unclassified user workflow.
