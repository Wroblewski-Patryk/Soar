# LUC-1027 RegisterPage Frontend Proof

Date: 2026-07-14
Owner: 09 FEW (Frontend Web Engineer)
Issue: [LUC-1027](/LUC/issues/LUC-1027)

## Scope

Close the direct frontend proof gap for:

- `apps/web/src/features/auth/pages/RegisterPage.tsx#RegisterPage`

## Changed

- Added `apps/web/src/features/auth/pages/RegisterPage.test.tsx` with direct
  page-level proof for:
  - signed-out visitors seeing the register heading and page form entrypoint
  - authenticated visitors being redirected to `/dashboard`
- Added the direct proof relation in
  `docs/architecture/relations/priority-test-links.csv`.

## Verification

- Focused page proof:
  - PASS:
    `pnpm --filter web exec vitest run src/features/auth/pages/RegisterPage.test.tsx`
  - Result: `1` file passed, `2` tests passed.
- Adjacent auth proof safety:
  - PASS:
    `pnpm --filter web exec vitest run src/features/auth/pages/RegisterPage.test.tsx src/features/auth/components/RegisterForm.test.tsx src/features/auth/hooks/useRegisterForm.test.tsx`
  - Result: `3` files passed, `10` tests passed.
  - Note: existing SSR i18n fallback warnings from `RegisterForm.test.tsx`
    still appear on stderr for route `/`; no new failure was introduced.

## Readback

- `apps/web/src/features/auth/pages/RegisterPage.test.tsx` now gives
  `RegisterPage` a direct proof path instead of relying only on neighboring
  hook/component tests.
- `docs/architecture/relations/priority-test-links.csv` now contains the
  direct `LUC-1027` relation row from
  `apps/web/src/features/auth/pages/RegisterPage.tsx#RegisterPage` to
  `apps/web/src/features/auth/pages/RegisterPage.test.tsx`.

## Result

The page-level proof gap is closed in code and source-truth linkage.
Generated `app-completion` and `project-truth` readback now matches the new
direct proof relation for `RegisterPage`; the page no longer routes as a
`missing_test_link` row, and the remaining backlog stays on the broader
Account access queue.

## Boundary

No runtime code, deploy, push, restart, rollback, env edit, protected
account/session smoke, secret/account readback, DB/Redis mutation,
exchange/payment/subscription mutation, order, position, bot activation, or
LIVE trading action occurred.
