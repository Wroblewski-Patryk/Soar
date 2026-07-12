# LUC-636 Account Access Session-Token Doc-Link Closure Evidence

Date: 2026-07-12
Owner: 04 DSM (Documentation Steward)
Issue: [LUC-636](/LUC/issues/LUC-636)

## Scope

Resolve Account access session-token `missing_doc_link` rows without runtime
mutation:

- `apps/api/src/modules/auth/auth.session.ts#getSessionJwtExpiresIn`
- `apps/api/src/modules/auth/auth.session.ts#getSessionTtlMs`
- `apps/api/src/modules/auth/sessionToken.ts#tokenIssuedAt`
- `apps/api/src/modules/auth/sessionToken.test.ts#makeRequest`
- `apps/api/src/modules/auth/sessionToken.test.ts#restoreEnv`
- `apps/api/src/modules/auth/sessionToken.test.ts#signCandidate`

## Changed

- Updated `docs/modules/api-auth.md` classification ownership to LUC-636 and
  added classifications for the four remaining `sessionToken` helper/test rows.
- Added documentation-link rows for the remaining `sessionToken` entities in
  `docs/architecture/relations/documentation-links.csv`.
- Added scanner `documents` relation overrides for the remaining
  `sessionToken` entities in `docs/architecture/scanner-overrides.json`.
- Regenerated architecture-awareness, app-completion, and project-truth
  outputs.

## Verification

- `corepack pnpm exec prettier --write docs/architecture/scanner-overrides.json docs/modules/api-auth.md`
  - PASS.
- CSV/direct source readback:
  - PASS: all six scoped paths are present in docs/source-truth inputs.
- `node C:\Personal\Projekty\Aplikacje\Paperclip_Softwarehouse\scripts\build-architecture-awareness-index.mjs --project Soar --root C:\Personal\Projekty\Aplikacje\Soar`
  - PASS.
  - `entities=10764`
  - `relations=35145`
  - `entityOverridesApplied=18`
  - `relationOverridesApplied=12`
- `node C:\Personal\Projekty\Aplikacje\Paperclip_Softwarehouse\scripts\build-app-completion-index.mjs --project Soar --root C:\Personal\Projekty\Aplikacje\Soar`
  - PASS.
  - `missingDocLink=1985`
  - `implementedNeedsProof=114`
  - `riskItems=3524`
- `node C:\Personal\Projekty\Aplikacje\Paperclip_Softwarehouse\scripts\build-project-truth-indexes.mjs --project Soar --root C:\Personal\Projekty\Aplikacje\Soar --apply`
  - PASS.
  - Public probes passed for Web `/`, Web `/api/build-info`, API `/health`,
    and API `/ready`.
  - First Account access gap is now
    `apps/api/src/modules/auth/sessionToken.ts#tokenIssuedAt` as
    `implemented_needs_proof`.
- `corepack pnpm run architecture:graph:drift:strict`
  - PASS: `853/853 covered`, `0 missing`.
- Focused generated readback:
  - PASS after correcting the script to use `priorityReviewItems`.
  - `tokenIssuedAt => implemented_needs_proof`.
  - `makeRequest`, `restoreEnv`, `signCandidate`,
    `getSessionJwtExpiresIn`, and `getSessionTtlMs` are no longer present in
    the priority `missing_doc_link` readback.
  - Initial readback attempt failed because it assumed `app.items`; the
    generated schema uses `priorityReviewItems`.

## Result

The six scoped rows no longer appear as `missing_doc_link` in the generated
priority readbacks. The first remaining Account access row is
`tokenIssuedAt` as `implemented_needs_proof`, which belongs to the
Test Automation follow-up [LUC-637](/LUC/issues/LUC-637).

## Boundary

No runtime auth code, deploy, push, restart, rollback, env edit, migration,
protected account/session smoke, protected credential access, secret/account
value readback, DB/Redis mutation, exchange/payment/subscription mutation,
order, position, bot activation, or LIVE trading action occurred.
