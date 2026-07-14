# LUC-1004 Evidence

- Issue: [LUC-1004](/LUC/issues/LUC-1004)
- Date: 2026-07-14
- Agent lane: Documentation Steward
- Scope: close the Account access `missing_doc_link` routing for
  `apps/api/src/modules/bots/bots.runtime-close-dca-authority.e2e.test.ts#seedTicker`.
- Boundary: no runtime code mutation, no new tests, no deploy, no push,
  no secret/account readback, no DB mutation, no protected smoke.

## Implemented and verified

- `docs/modules/api-bots.md` now documents the runtime close DCA-authority
  ticker-seeding helper that writes a trusted Binance Futures mark/last price
  into the runtime ticker store before protected close requests.
- `docs/modules/api-bots.md` now classifies `seedTicker` in the
  Architecture-Awareness Doc-Link table.
- `docs/architecture/relations/documentation-links.csv` now maps the scoped
  helper to `docs/modules/api-bots.md`.
- `docs/architecture/scanner-overrides.json` now adds the matching
  `documents` relation override.

## Validation

- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-architecture-awareness-index.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar` with stdout redirected to `history/artifacts/luc-1004-build-architecture-awareness-log.txt`
- `pnpm run architecture:graph:drift:strict`
- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-app-completion-index.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar`
- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-project-truth-indexes.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar --apply`
- `rg -n "seedTicker|missing_doc_link|Account access" docs/status/app-completion-index.md docs/status/project-truth-index.md -S`
- `git diff --check`

## Readback

- `docs/status/app-completion-index.md` no longer lists `seedTicker` as
  `missing_doc_link`.
- `docs/status/project-truth-index.md` no longer routes `seedTicker` as
  the first Account access docs gap.
- `missingDocLink` dropped from `1980` to `1979` after the serial generator
  refresh.
- The next docs-owned Account access routing advanced to
  `apps/api/src/modules/bots/bots.subscription-entitlements.e2e.test.ts#registerAndLogin`.

## Residual

- This issue closes only the scoped helper doc-link lane; adjacent docs/proof
  gaps remain separate follow-ups owned by the next routed lane.
- Paperclip closeout for [LUC-1004](/LUC/issues/LUC-1004) is handled separately
  from this durable repo evidence packet.
