# LUC-1431 Evidence

- Issue: [LUC-1431](/LUC/issues/LUC-1431)
- Date: 2026-07-17
- Agent lane: Documentation Steward
- Scope: close the Account access `missing_doc_link` routing for
  `apps/api/src/router/dashboard.routes.ts#/wallets`.
- Boundary: no runtime code mutation, no new tests, no deploy, no push,
  no secret/account readback, no DB mutation, and no protected smoke.

## Implemented and verified

- `docs/modules/api-wallets.md` now documents
  `apps/api/src/router/dashboard.routes.ts#/wallets` as the authenticated
  dashboard router mount that delegates the wallets API surface into the
  wallets module after the shared dashboard auth gate succeeds.
- `docs/architecture/relations/documentation-links.csv` now maps
  `apps/api/src/router/dashboard.routes.ts#/wallets` to
  `docs/modules/api-wallets.md`.
- `docs/architecture/scanner-overrides.json` now adds the matching
  `documents` relation override.

## Validation

- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-architecture-awareness-index.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar`
- `pnpm run architecture:graph:drift:strict`
- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-app-completion-index.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar`
- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-project-truth-indexes.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar --apply`
- `rg -n "USE /wallets|missing_doc_link|resolveSessionWindowEnd" docs/status/app-completion-index.md docs/status/app-completion-index.json docs/status/project-truth-index.md docs/status/project-truth-index.json -S`
- `git diff --check`

## Readback

- `docs/status/app-completion-index.md` no longer lists `USE /wallets` as
  `missing_doc_link` under Account access; the final readback shows
  `missingDocLink=2`.
- `docs/status/project-truth-index.md` no longer routes
  `Account access: USE /wallets` as a project-truth gap.
- The remaining generated doc-link rows narrow to `GET /alerts` and
  `GET /metrics`, and the next app-completion gap in project truth advances to
  `Dashboard overview: USE /dashboard` as `missing_test_link`.

## Validation results

- `build-architecture-awareness-index.mjs`
  - PASS
  - `15269` entities, `42126` relations, `91` relation overrides applied.
- `pnpm run architecture:graph:drift:strict`
  - PASS
  - `874/874 covered`, `0 missing`.
- `build-app-completion-index.mjs`
  - PASS
  - `missingDocLink=2`, `missingTestLink=13`, `needsBrowserReview=40`.
- `build-project-truth-indexes.mjs --apply`
  - PASS
  - `appCompletionGaps=55`, `missingDocLink=2`, first app-completion gap now
    `Dashboard overview: USE /dashboard`.
- `git diff --check`
  - PASS with line-ending warnings only.

## Residual

- This issue closes only the scoped dashboard wallets router doc-link lane;
  the remaining proof, runtime, and operations gaps are separate work.
- The generated project-truth packet may still report the unrelated live
  runtime blocker `api_ready ... /ready returned 503`, which remains owned
  outside this documentation issue.
