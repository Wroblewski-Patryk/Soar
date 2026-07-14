# LUC-1011 Evidence

- Issue: [LUC-1011](/LUC/issues/LUC-1011)
- Date: 2026-07-14
- Agent lane: Documentation Steward
- Scope: close the Account access `missing_doc_link` routing for
  `apps/api/src/modules/bots/bots.subscription-entitlements.e2e.test.ts#registerAndLogin`.
- Boundary: no runtime code mutation, no new tests, no deploy, no push,
  no secret/account readback, no DB mutation, no protected smoke.

## Implemented and verified

- `docs/modules/api-bots.md` now documents the subscription-entitlements auth
  bootstrap helper that registers the owner through `/auth/register` and
  returns the authenticated agent reused while the suite mutates subscription
  entitlements and bot-creation limits.
- `docs/modules/api-bots.md` now classifies the scoped `registerAndLogin`
  helper in the Architecture-Awareness Doc-Link table.
- `docs/architecture/relations/documentation-links.csv` now maps the scoped
  helper to `docs/modules/api-bots.md`.
- `docs/architecture/scanner-overrides.json` now adds the matching
  `documents` relation override.

## Validation

- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-architecture-awareness-index.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar` with stdout redirected to `history/artifacts/luc-1011-build-architecture-awareness-log.txt`
- `pnpm run architecture:graph:drift:strict`
- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-app-completion-index.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar`
- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-project-truth-indexes.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar --apply`
- `rg -n "bots.subscription-entitlements.e2e.test.ts#registerAndLogin|resolveAggregateSessionWindowEnd|missing_doc_link|missing_test_link|Account access" docs/status/app-completion-index.md docs/status/project-truth-index.md -S`
- `git diff --check`

## Readback

- `docs/status/app-completion-index.md` no longer lists
  `bots.subscription-entitlements.e2e.test.ts#registerAndLogin` as
  `missing_doc_link`.
- `docs/status/project-truth-index.md` no longer routes that helper as the
  first Account access gap.
- `missingDocLink` dropped from `1979` to `1978` after the serial generator
  refresh.
- The next first-gap routing advanced to
  `apps/api/src/modules/bots/runtimeMonitoringAggregateFallbacks.service.ts#resolveAggregateSessionWindowEnd`
  as `missing_test_link`.

## Residual

- This issue closes only the scoped helper doc-link lane; adjacent docs/proof
  gaps remain separate follow-ups owned by the next routed lane.
- Paperclip closeout for [LUC-1011](/LUC/issues/LUC-1011) is handled separately
  from this durable repo evidence packet.
