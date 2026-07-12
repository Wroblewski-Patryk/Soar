# LUC-564 Account Access signAuthToken Doc-Link Evidence

Date: 2026-07-12

## Scope

DSM source-truth repair for `apps/api/src/modules/auth/auth.jwt.ts#signAuthToken`.

No runtime code, deploy, push, restart, rollback, secret/account readback,
db/schema migration, exchange/payment/subscription mutation, order, position,
bot activation, or LIVE trading action occurred.

## Change

- Added `auth.jwt.ts#signAuthToken` classification row to
  `docs/modules/api-auth.md` under architecture-awareness doc-link table.
- Linked the row in `docs/architecture/relations/documentation-links.csv`.
- Added a scanner `documents` override for the same relation in
  `docs/architecture/scanner-overrides.json`.

## Validation

- `build-architecture-awareness-index.mjs --project Soar --root
  C:/Personal/Projekty/Aplikacje/Soar`
  - PASS
  - `10718` entities, `34939` relations
- `build-app-completion-index.mjs --project Soar --root
  C:/Personal/Projekty/Aplikacje/Soar`
  - PASS
  - `missingDocLink=1990`
- `build-project-truth-indexes.mjs --project Soar --root
  C:/Personal/Projekty/Aplikacje/Soar --apply`
  - PASS
  - first Project Truth risk for
    `apps/api/src/modules/auth/auth.jwt.ts#signAuthToken` advanced to
    `implemented_needs_proof`.
- `git diff --check`
  - PASS (CRLF normalization only)

## Result

- `apps/api/src/modules/auth/auth.jwt.ts#signAuthToken` is now linked to
  `docs/modules/api-auth.md` as a documented Account access source-of-truth row.
- Project truth has advanced this row from `missing_doc_link` to
  `implemented_needs_proof`; next owner for behavioral proof is
  `QA Regression Lead + Project Manager`.
