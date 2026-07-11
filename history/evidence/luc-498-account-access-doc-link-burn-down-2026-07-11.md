# LUC-498 Account Access Doc-Link Burn-Down Evidence

Date: 2026-07-11

## Scope

- Issue: [LUC-498](/LUC/issues/LUC-498)
- Stage: verification
- Owner role: Documentation Steward
- Boundary: local documentation/source-truth repair only. No production smoke, protected credential access, secret readback, deploy, restart, rollback, database mutation, account mutation, exchange/payment/subscription mutation, order, position, or LIVE trading action.

## Rows Closed

The following Account access rows were removed from the app-completion/project-truth priority gap queue:

- `apps/api/src/modules/auth/auth.cookie.ts#getSessionCookieBaseOptions`
- `apps/api/src/modules/auth/auth.controller.ts#clearSessionCookie`
- `apps/api/src/modules/auth/auth.controller.ts#login`
- `apps/api/src/modules/auth/auth.controller.ts#logout`
- `apps/api/src/modules/auth/auth.controller.ts#me`
- `apps/api/src/modules/auth/auth.controller.ts#register`
- `apps/api/src/modules/auth/auth.controller.ts#setSessionCookie`

## Source Truth Updates

- `docs/modules/api-auth.md` now classifies the cookie helper and auth controller handler batch.
- `docs/architecture/relations/documentation-links.csv` now maps those source entities to `docs/modules/api-auth.md`.
- `docs/architecture/relations/priority-test-links.csv` now maps `getSessionCookieBaseOptions` to `auth.cookie.test.ts`.
- `docs/architecture/scanner-overrides.json` now marks `getSessionCookieBaseOptions` verified from the focused cookie-helper proof.

## Validation

- `node C:\Personal\Projekty\Aplikacje\Paperclip_Softwarehouse\scripts\build-architecture-awareness-index.mjs --project Soar --root C:\Personal\Projekty\Aplikacje\Soar`
  - PASS
  - `entities=10694`
  - `relations=34822`
  - `entityOverridesApplied=10`
  - `relationOverridesApplied=1`
- `node C:\Personal\Projekty\Aplikacje\Paperclip_Softwarehouse\scripts\build-app-completion-index.mjs --project Soar --root C:\Personal\Projekty\Aplikacje\Soar`
  - PASS
  - `items=3558`
  - `missingDocLink=1994`
  - `missingTestLink=974`
  - `implementedNeedsProof=113`
  - `riskItems=3533`
- `node C:\Personal\Projekty\Aplikacje\Paperclip_Softwarehouse\scripts\build-project-truth-indexes.mjs --project Soar --root C:\Personal\Projekty\Aplikacje\Soar --apply`
  - PASS
  - `firstGap` advanced to `apps/api/src/modules/auth/auth.e2e.test.ts#restoreEnv` as `missing_doc_link`
- `corepack pnpm --filter api exec vitest src/modules/auth/auth.cookie.test.ts --run`
  - PASS
  - `1` file / `5` tests
- Targeted readback:
  - target rows in priority queue: `[]`
  - target project-truth gaps: `[]`
- `git diff --check`
  - PASS with CRLF normalization warnings only

## Residual

The next Account access doc-link row is `apps/api/src/modules/auth/auth.e2e.test.ts#restoreEnv`. It is a test helper/source-truth documentation row for Docs Memory Lead + Project Manager and should be handled in a separate bounded issue if selected.
