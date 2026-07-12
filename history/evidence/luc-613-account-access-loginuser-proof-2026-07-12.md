# LUC-613 Account Access loginUser Proof Evidence

Date: 2026-07-12
Owner: 09 TAE (Test Automation Engineer)
Issue: [LUC-613](/LUC/issues/LUC-613)

## Scope

Prove `apps/api/src/modules/auth/auth.service.ts#loginUser` for the current
Account access `implemented_needs_proof` project-truth row.

## Changed

- Added `apps/api/src/modules/auth/auth.loginUser.test.ts` as a focused no-DB
  unit proof for `loginUser`.
- Added a direct priority test-link row from
  `apps/api/src/modules/auth/auth.service.ts#loginUser` to
  `apps/api/src/modules/auth/auth.loginUser.test.ts`.
- Added a verified scanner override for
  `apps/api/src/modules/auth/auth.service.ts#loginUser`.
- Regenerated architecture-awareness, app-completion, and project-truth
  outputs.

## Verification

- `corepack pnpm --filter api exec vitest run src/modules/auth/auth.loginUser.test.ts`
  - PASS
  - `1` file / `3` tests
  - Covers valid credential login, missing-user rejection, invalid-password
    rejection, generic credentials error, public response password stripping,
    token payload inputs, `sessionVersion`, and short versus remember-aware
    token lifetime selection.
- `corepack pnpm exec prettier --check apps/api/src/modules/auth/auth.loginUser.test.ts docs/architecture/scanner-overrides.json`
  - PASS
- `node C:\Personal\Projekty\Aplikacje\Paperclip_Softwarehouse\scripts\build-architecture-awareness-index.mjs --project Soar --root C:\Personal\Projekty\Aplikacje\Soar`
  - PASS
  - `entities=10738`
  - `relations=35024`
  - `entityOverridesApplied=14`
  - `relationOverridesApplied=5`
- `node C:\Personal\Projekty\Aplikacje\Paperclip_Softwarehouse\scripts\build-app-completion-index.mjs --project Soar --root C:\Personal\Projekty\Aplikacje\Soar`
  - PASS
  - `implementedNeedsProof=113`
  - `riskItems=3528`
- `node C:\Personal\Projekty\Aplikacje\Paperclip_Softwarehouse\scripts\build-project-truth-indexes.mjs --project Soar --root C:\Personal\Projekty\Aplikacje\Soar --apply`
  - PASS
  - First gap advanced to
    `Account access: registerUser has app-completion risk missing_doc_link`.

## Attempted But Not Used As Proof

- `corepack pnpm --filter api exec vitest run src/modules/auth/auth.service.test.ts`
  - FAIL / blocked by local infrastructure
  - Local PostgreSQL was not reachable at `localhost:5432`.
- `docker ps`
  - FAIL / Docker Desktop Linux engine pipe was unavailable.

## Result

`apps/api/src/modules/auth/auth.service.ts#loginUser` left
`implemented_needs_proof` in app-completion/project-truth after the focused
local proof and generated index refresh.

## Boundary

No runtime auth implementation change, production deploy, push, restart,
rollback, env edit, migration, protected credential readback, secret/account
value disclosure, DB/Redis mutation beyond failed local test connection
attempt, exchange/payment/subscription mutation, order, position, bot
activation, or LIVE trading action occurred.
