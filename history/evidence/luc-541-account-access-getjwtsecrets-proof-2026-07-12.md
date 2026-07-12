# LUC-541 Account Access getJwtSecrets Proof

Date: 2026-07-12

## Scope

Test Automation Engineer proof closure for one Account access
`implemented_needs_proof` row:
`apps/api/src/modules/auth/auth.jwt.ts#getJwtSecrets`.

No runtime auth implementation, test logic, schema, migration, deployment,
restart, rollback, protected credential access, secret/account value readback,
DB/Redis mutation, exchange/payment/subscription mutation, order, position, or
LIVE trading action occurred.

## Change

- Added a scoped verified entity override for
  `apps/api/src/modules/auth/auth.jwt.ts#getJwtSecrets` in
  `docs/architecture/scanner-overrides.json`.
- Added the direct automated proof relation:
  `apps/api/src/modules/auth/auth.jwt.ts#getJwtSecrets,apps/api/src/modules/auth/auth.jwt.test.ts`
  in `docs/architecture/relations/priority-test-links.csv`.
- Regenerated architecture-awareness, app-completion, and project-truth status
  outputs.

## Verification

- `corepack pnpm --filter api exec vitest run src/modules/auth/auth.jwt.test.ts`
  - PASS
  - `1` test file passed
  - `3` tests passed
  - Covered primary signing/verification, previous secret acceptance during an
    open rotation window, and previous secret rejection after expiry.
- `corepack pnpm exec prettier --check docs/architecture/scanner-overrides.json`
  - PASS
- CSV readback:
  - `Import-Csv docs\architecture\relations\priority-test-links.csv`
  - PASS, row exists for `auth.jwt.ts#getJwtSecrets` pointing to
    `auth.jwt.test.ts`.
- `node C:\Personal\Projekty\Aplikacje\Paperclip_Softwarehouse\scripts\build-architecture-awareness-index.mjs --project Soar --root C:\Personal\Projekty\Aplikacje\Soar`
  - PASS
  - `entities=10712`
  - `relations=34911`
  - `entityOverridesApplied=11`
  - `relationOverridesApplied=2`
- `node C:\Personal\Projekty\Aplikacje\Paperclip_Softwarehouse\scripts\build-app-completion-index.mjs --project Soar --root C:\Personal\Projekty\Aplikacje\Soar`
  - PASS
  - `items=3558`
  - `missingDocLink=1992`
  - `implementedNeedsProof=113`
  - `riskItems=3531`
- `node C:\Personal\Projekty\Aplikacje\Paperclip_Softwarehouse\scripts\build-project-truth-indexes.mjs --project Soar --root C:\Personal\Projekty\Aplikacje\Soar --apply`
  - PASS
  - public probes passed: `web_home`, `web_build_info`, `api_health`,
    `api_ready`
  - first project-truth gap advanced to
    `apps/api/src/modules/auth/auth.jwt.ts#getPreviousSecretExpiry` as
    `missing_doc_link`.

## Result

`DONE / FOCUSED_JWT_PROOF_PASS / TEST_LINK_RESOLVED /
APP_COMPLETION_REFRESHED / PROJECT_TRUTH_ADVANCED / NO_RUNTIME_MUTATION`.

## Residual

The next Account access row is
`apps/api/src/modules/auth/auth.jwt.ts#getPreviousSecretExpiry`, owned by Docs
Memory Lead + Project Manager as a separate documentation-link row.
