# LUC-1031 Account Access fetchAuthenticatedBalancePreview Proof

Date: 2026-07-14
Owner: 09 IDE (Integration Domain Engineer)
Issue: [LUC-1031](/LUC/issues/LUC-1031)

## Scope

Close the Account access `missing_test_link` routing for:

- `apps/api/src/modules/wallets/wallets.service.ts#fetchAuthenticatedBalancePreview`

## Changed

- Exported the existing helper from
  `apps/api/src/modules/wallets/wallets.service.ts` for direct focused proof.
- Added focused no-DB proof in
  `apps/api/src/modules/wallets/wallets.service.test.ts` covering:
  - test-runtime balance fallback
  - free-balance capping to account balance
  - normalized base-currency lookup
  - authenticated exchange payload extraction
- Added the direct proof relation in
  `docs/architecture/relations/priority-test-links.csv`.
- Added a `verified` entity override for the helper in
  `docs/architecture/scanner-overrides.json`.
- Refreshed architecture-awareness, app-completion, and project-truth outputs
  in the required serial order.

## Verification

- Focused helper proof:
  - PASS:
    `corepack pnpm --filter api exec vitest run src/modules/wallets/wallets.service.test.ts --run --reporter=dot`
  - Result: `1` file passed, `7` tests passed.
- Sequential source-truth refresh:
  - PASS:
    `node C:\Personal\Projekty\Aplikacje\Paperclip_Softwarehouse\scripts\build-architecture-awareness-index.mjs --project Soar --root C:\Personal\Projekty\Aplikacje\Soar`
  - PASS:
    `pnpm run architecture:graph:drift:strict`
  - PASS:
    `node C:\Personal\Projekty\Aplikacje\Paperclip_Softwarehouse\scripts\build-app-completion-index.mjs --project Soar --root C:\Personal\Projekty\Aplikacje\Soar`
  - PASS:
    `node C:\Personal\Projekty\Aplikacje\Paperclip_Softwarehouse\scripts\build-project-truth-indexes.mjs --project Soar --root C:\Personal\Projekty\Aplikacje\Soar --apply`
  - Readback:
    `missingTestLink` dropped from `963` to `962`.
- Source-control safety:
  - PASS:
    `git diff --check`
    with working-copy LF/CRLF warnings only.

## Readback

- `docs/architecture/relations/priority-test-links.csv` now contains the
  direct `LUC-1031` relation row from `fetchAuthenticatedBalancePreview` to
  `wallets.service.test.ts`.
- `docs/architecture/scanner-overrides.json` now marks
  `apps/api/src/modules/wallets/wallets.service.ts#fetchAuthenticatedBalancePreview`
  `status=verified`.
- `docs/status/app-completion-index.json` now records the helper as
  `status=verified`, `hasTest=true`, `hasDoc=false`,
  `risk=missing_doc_link`.
- `docs/status/project-truth-index.json` now routes the same helper as a
  docs-owned `missing_doc_link` follow-up instead of a proof gap.

## Result

The `fetchAuthenticatedBalancePreview` test gap is closed locally. The helper
is now advanced to the next expected state:
`hasTest=true`, `hasDoc=false`, `risk=missing_doc_link`.

## Boundary

No deploy, push, restart, rollback, protected account/session smoke,
secret/account readback, DB/Redis mutation, exchange/payment/subscription
mutation, order, position, bot activation, or LIVE trading action occurred.
