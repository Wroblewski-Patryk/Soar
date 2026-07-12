# LUC-549 Account Access getPreviousSecretExpiry Proof

Date: 2026-07-12

## Scope

Test Automation Engineer proof closure for one Account access
`implemented_needs_proof` row:
`apps/api/src/modules/auth/auth.jwt.ts#getPreviousSecretExpiry`.

No production deploy, restart, rollback, protected account readback, secret
value disclosure, DB/Redis mutation, account mutation,
exchange/payment/subscription mutation, order, position, bot activation, or
LIVE trading action occurred.

## Change

- Extended `apps/api/src/modules/auth/auth.jwt.test.ts` to cover:
  - previous-secret acceptance when no rotation expiry is configured;
  - invalid `JWT_SECRET_PREVIOUS_UNTIL` fail-closed behavior.
- Added a scoped verified entity override for
  `apps/api/src/modules/auth/auth.jwt.ts#getPreviousSecretExpiry` in
  `docs/architecture/scanner-overrides.json`.
- Added the direct automated proof relation:
  `apps/api/src/modules/auth/auth.jwt.ts#getPreviousSecretExpiry,apps/api/src/modules/auth/auth.jwt.test.ts`
  in `docs/architecture/relations/priority-test-links.csv`.
- Regenerated architecture-awareness, app-completion, and project-truth status
  outputs.

## Verification

- `corepack pnpm --filter api exec vitest run src/modules/auth/auth.jwt.test.ts`
  - PASS
  - `1` test file passed
  - `5` tests passed
  - Covered primary signing/verification, previous secret acceptance during an
    open rotation window, previous secret acceptance when no expiry is
    configured, previous secret rejection after expiry, and invalid expiry
    fail-closed behavior.
- `corepack pnpm exec prettier --check docs/architecture/scanner-overrides.json apps/api/src/modules/auth/auth.jwt.test.ts`
  - PASS
- CSV readback:
  - `Import-Csv docs\architecture\relations\priority-test-links.csv`
  - PASS, row exists for `auth.jwt.ts#getPreviousSecretExpiry` pointing to
    `auth.jwt.test.ts`.
- `node C:\Personal\Projekty\Aplikacje\Paperclip_Softwarehouse\scripts\build-architecture-awareness-index.mjs --project Soar --root C:\Personal\Projekty\Aplikacje\Soar`
  - PASS
  - `entities=10718`
  - `relations=34938`
  - `entityOverridesApplied=12`
  - `relationOverridesApplied=3`
- `node C:\Personal\Projekty\Aplikacje\Paperclip_Softwarehouse\scripts\build-app-completion-index.mjs --project Soar --root C:\Personal\Projekty\Aplikacje\Soar`
  - PASS
  - `items=3558`
  - `missingDocLink=1991`
  - `implementedNeedsProof=113`
  - `riskItems=3530`
- `node C:\Personal\Projekty\Aplikacje\Paperclip_Softwarehouse\scripts\build-project-truth-indexes.mjs --project Soar --root C:\Personal\Projekty\Aplikacje\Soar --apply`
  - PASS
  - public probes passed: `web_home`, `web_build_info`, `api_health`,
    `api_ready`
  - first project-truth gap advanced to
    `apps/api/src/modules/auth/auth.jwt.ts#signAuthToken` as
    `missing_doc_link`.
- `corepack pnpm run architecture:graph:drift:strict`
  - PASS
  - `850/850` covered
  - `0` missing
- `git diff --check`
  - PASS
  - CRLF normalization warnings only

## Result

`DONE / FOCUSED_JWT_EXPIRY_PROOF_PASS / TEST_LINK_RESOLVED /
APP_COMPLETION_REFRESHED / PROJECT_TRUTH_ADVANCED / NO_RUNTIME_MUTATION`.

## Residual

The next Account access row is
`apps/api/src/modules/auth/auth.jwt.ts#signAuthToken`, owned by Docs Memory Lead
and Project Manager as a separate documentation-link row.
