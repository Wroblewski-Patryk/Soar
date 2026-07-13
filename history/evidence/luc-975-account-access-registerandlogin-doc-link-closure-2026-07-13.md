# LUC-975 Evidence

- Issue: [LUC-975](/LUC/issues/LUC-975)
- Date: 2026-07-13
- Agent lane: Documentation Steward
- Scope: close the Account access `missing_doc_link` routing for
  `apps/api/src/modules/bots/bots.e2e.shared.ts#registerAndLogin` and
  `apps/api/src/modules/bots/bots.duplicate-guard.e2e.test.ts#registerAndLogin`.
- Boundary: no runtime code mutation, no new tests, no deploy, no push, no
  secret/account readback, no DB mutation, no protected smoke.

## Implemented and verified

- `docs/modules/api-bots.md` now documents the shared bots auth bootstrap
  helper and the duplicate-guard-specific auth bootstrap helper as real
  `/auth/register` plus `PROFESSIONAL` plan-upgrade setup used before protected
  bot scenarios.
- `docs/architecture/relations/documentation-links.csv` now maps both scoped
  `registerAndLogin` entities to `docs/modules/api-bots.md`.
- `docs/architecture/scanner-overrides.json` now adds matching `documents`
  relations for both scoped entities.

## Validation

- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-architecture-awareness-index.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar`
- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-app-completion-index.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar`
- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-project-truth-indexes.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar --apply`
- `pnpm run architecture:graph:drift:strict`
- `rg -n "bots\\.(duplicate-guard\\.e2e\\.test|e2e\\.shared)\\.ts#registerAndLogin|Account access: registerAndLogin has app-completion risk missing_doc_link" docs/status docs/graphs/architecture-awareness.json -S`
- `git diff --check`

## Readback

- `docs/graphs/architecture-awareness.json` now contains generated
  `documents` relations from `docs/modules/api-bots.md` to both scoped bots
  `registerAndLogin` entities.
- `docs/status/app-completion-index.md` no longer lists
  `apps/api/src/modules/bots/bots.duplicate-guard.e2e.test.ts#registerAndLogin`
  or `apps/api/src/modules/bots/bots.e2e.shared.ts#registerAndLogin` as
  `missing_doc_link`.
- `docs/status/project-truth-index.md` no longer routes the first Account
  access docs gap to those two bots auth-bootstrap helper rows.
- The authoritative sequential readback now classifies
  `apps/api/src/modules/bots/bots.e2e.shared.ts#registerAndLogin` as
  `implemented_needs_proof`, which means the docs gap is closed and the
  remaining first-gap owner is QA rather than DSM.
- The next docs-owned Account access gap is now
  `apps/api/src/modules/bots/bots.subscription-entitlements.e2e.test.ts#registerAndLogin`.

## Residual

- The repo already had unrelated local dirty state before this heartbeat. This
  issue closes only the scoped docs/generated truth lane and does not claim
  source-control closure for the broader worktree.
- Additional `registerAndLogin` helper rows remain in other modules and must be
  handled as separate docs-owned follow-ups.
