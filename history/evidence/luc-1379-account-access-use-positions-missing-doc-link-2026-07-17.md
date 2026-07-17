# LUC-1379 Evidence

- Issue: [LUC-1379](/LUC/issues/LUC-1379)
- Date: 2026-07-17
- Agent lane: Documentation Steward
- Scope: close the Account access `missing_doc_link` routing for
  `apps/api/src/router/dashboard.routes.ts#/positions`.
- Boundary: no runtime code mutation, no new tests, no deploy, no push,
  no secret/account readback, no DB mutation, no protected smoke.

## Implemented and verified

- `docs/modules/api-positions.md` now documents `USE /positions` as the
  authenticated dashboard router mount that delegates the positions API surface
  into the positions module after the shared dashboard auth gate succeeds.
- `docs/architecture/relations/documentation-links.csv` now maps
  `apps/api/src/router/dashboard.routes.ts#/positions` to
  `docs/modules/api-positions.md`.
- `docs/architecture/scanner-overrides.json` now adds the matching
  `documents` relation override.

## Validation

- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-architecture-awareness-index.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar`
- `pnpm run architecture:graph:drift:strict`
- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-app-completion-index.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar`
- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-project-truth-indexes.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar --apply`
- `rg -n "USE /positions|GET /alerts|GET /metrics|missing_doc_link|missing_test_link" docs/status/app-completion-index.md docs/status/project-truth-index.md -S`
- `git diff --check`

## Readback

- `docs/status/app-completion-index.md` no longer lists
  `USE /positions` as `missing_doc_link` under Account access.
- `docs/status/project-truth-index.md` no longer routes
  `Account access: USE /positions` as the first project-truth gap.
- The next generated docs-owned priority rows now advance to
  `USE /profile/apiKeys`, `USE /profile/security`, `USE /reports`, and
  `USE /profile/basic`.
- The remaining generated `missing_doc_link` rows also still include
  `apps/api/src/router/index.ts#/alerts` and
  `apps/api/src/router/index.ts#/metrics`.

## Residual

- This issue closes only the scoped dashboard positions router doc-link lane;
  other proof or browser-review gaps remain separate work.
- Paperclip closeout for [LUC-1379](/LUC/issues/LUC-1379) is handled
  separately from this durable repo evidence packet.
