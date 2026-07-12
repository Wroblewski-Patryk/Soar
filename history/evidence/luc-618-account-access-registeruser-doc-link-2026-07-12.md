# LUC-618 Account Access registerUser Doc-Link Evidence

Date: 2026-07-12
Owner: 04 DSM (Documentation Steward)
Issue: [LUC-618](/LUC/issues/LUC-618)

## Scope

Resolve the current project-truth Account access `missing_doc_link` row for
`apps/api/src/modules/auth/auth.service.ts#registerUser`.

## Changed

- Added `registerUser` source-truth classification to
  `docs/modules/api-auth.md`.
- Added `apps/api/src/modules/auth/auth.service.ts#registerUser` to
  `docs/architecture/relations/documentation-links.csv`.
- Added a scanner `documents` relation override from `docs/modules/api-auth.md`
  to `apps/api/src/modules/auth/auth.service.ts#registerUser`.
- Regenerated architecture-awareness, app-completion, and project-truth
  outputs.

## Verification

- `corepack pnpm exec prettier --write docs/architecture/scanner-overrides.json docs/modules/api-auth.md`
  - PASS
  - Note: CSV formatting was verified by direct row readback because Prettier
    cannot infer a parser for `documentation-links.csv`.
- `node C:\Personal\Projekty\Aplikacje\Paperclip_Softwarehouse\scripts\build-architecture-awareness-index.mjs --project Soar --root C:\Personal\Projekty\Aplikacje\Soar`
  - PASS
  - `entities=10741`
  - `relations=35039`
  - `relationOverridesApplied=6`
- `node C:\Personal\Projekty\Aplikacje\Paperclip_Softwarehouse\scripts\build-app-completion-index.mjs --project Soar --root C:\Personal\Projekty\Aplikacje\Soar`
  - PASS
  - `missingDocLink=1988`
  - `implementedNeedsProof=114`
  - `riskItems=3528`
- `node C:\Personal\Projekty\Aplikacje\Paperclip_Softwarehouse\scripts\build-project-truth-indexes.mjs --project Soar --root C:\Personal\Projekty\Aplikacje\Soar --apply`
  - PASS
  - public probe in the generator passed for Web `/`, Web `/api/build-info`,
    API `/health`, and API `/ready`
- first Account access gap changed to `registerUser`
  `implemented_needs_proof`
- next owner: `QA Regression Lead + Project Manager`
- next action: run and record fresh proof for the implemented behavior, then
  update completion/project-truth indexes.

Follow-up: [LUC-621](/LUC/issues/LUC-621) is assigned to Test Automation
Engineer for the focused `registerUser` proof row.

## Result

`apps/api/src/modules/auth/auth.service.ts#registerUser` is no longer the
current Account access `missing_doc_link` row. The same entity now requires QA
proof as `implemented_needs_proof`, which is outside DSM doc-link ownership.

## Boundary

No runtime auth code, deploy, push, restart, rollback, env edit, migration,
protected credential access, secret/account value disclosure, DB/Redis mutation,
account mutation, exchange/payment/subscription mutation, order, position, bot
activation, or LIVE trading action occurred.
