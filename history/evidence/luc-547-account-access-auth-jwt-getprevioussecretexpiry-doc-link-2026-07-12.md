# LUC-547 Account Access Auth JWT getPreviousSecretExpiry Doc-Link Evidence

Date: 2026-07-12

## Scope

DSM source-truth repair for
`apps/api/src/modules/auth/auth.jwt.ts#getPreviousSecretExpiry`.

No runtime code, deploy, push, restart, rollback, env edit, migration,
protected credential access, secret/account value readback, DB/Redis mutation,
exchange/payment/subscription mutation, order, position, bot activation, or LIVE
trading action occurred.

## Change

- Added the helper classification to `docs/modules/api-auth.md`.
- Linked the helper through `docs/architecture/relations/documentation-links.csv`.
- Added a scanner `documents` relation override in
  `docs/architecture/scanner-overrides.json`.

## Validation

- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-architecture-awareness-index.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar`
  - PASS
  - `10715` entities, `34925` relations
  - `relationOverridesApplied=3`
- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-app-completion-index.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar`
  - PASS
  - `missingDocLink=1991`, down from `1992`
  - `implementedNeedsProof=114`
- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-project-truth-indexes.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar --apply`
  - PASS
  - first Account access gap advanced from `missing_doc_link` to
    `implemented_needs_proof` for the same helper
- `pnpm run architecture:graph:drift:strict`
  - PASS: `850/850` covered, `0` missing
- `git diff --check`
  - PASS with line-ending warnings only

## Follow-Up

[LUC-549](/LUC/issues/LUC-549) was created for
`09 TAE (Test Automation Engineer)` to run focused JWT rotation-window proof and
link `getPreviousSecretExpiry` to executable proof if needed.
