# LUC-1030 PasswordVisibilityToggle and useHydrationReady Frontend Proof

Date: 2026-07-14
Owner: 09 FEW (Frontend Web Engineer)
Issue: [LUC-1030](/LUC/issues/LUC-1030)

## Scope

Close the direct frontend proof gaps for:

- `apps/web/src/features/auth/components/PasswordVisibilityToggle.tsx#PasswordVisibilityToggle`
- `apps/web/src/features/auth/hooks/useHydrationReady.ts`
- `apps/web/src/features/auth/hooks/useHydrationReady.ts#useHydrationReady`

## Changed

- Added `apps/web/src/features/auth/components/PasswordVisibilityToggle.test.tsx`
  with direct component proof for:
  - localized `show password` label
  - localized `hide password` label
  - enabled toggle callback behavior
  - disabled fail-closed behavior
- Added `apps/web/src/features/auth/hooks/useHydrationReady.test.tsx` with
  direct hook proof for:
  - fail-closed server rendering (`pending`)
  - client hydration readiness transition (`ready`)
- Added direct proof relations in
  `docs/architecture/relations/priority-test-links.csv`.
- Added scoped verified overrides in
  `docs/architecture/scanner-overrides.json`.

## Verification

- Focused frontend proof:
  - PASS:
    `corepack pnpm --filter web exec vitest run src/features/auth/components/PasswordVisibilityToggle.test.tsx src/features/auth/hooks/useHydrationReady.test.tsx`
  - Result: `2` files passed, `4` tests passed.
- Web typecheck:
  - PASS:
    `corepack pnpm --filter web run typecheck`
- Generated truth refresh:
  - PASS:
    `node C:\Personal\Projekty\Aplikacje\Paperclip_Softwarehouse\scripts\build-architecture-awareness-index.mjs --project Soar --root C:\Personal\Projekty\Aplikacje\Soar`
    -> `10934` entities, `36157` relations, `entityOverridesApplied=40`
  - PASS:
    `node C:\Personal\Projekty\Aplikacje\Paperclip_Softwarehouse\scripts\build-app-completion-index.mjs --project Soar --root C:\Personal\Projekty\Aplikacje\Soar`
    -> `missingTestLink=959`
  - PASS:
    `node C:\Personal\Projekty\Aplikacje\Paperclip_Softwarehouse\scripts\build-project-truth-indexes.mjs --project Soar --root C:\Personal\Projekty\Aplikacje\Soar --apply`
- Readback:
  - `PasswordVisibilityToggle` now reads as `status=verified`,
    `hasTest=true`, `hasDoc=false`, `risk=missing_doc_link`.
  - `useHydrationReady.ts` now reads as `status=verified`,
    `hasTest=true`, `hasDoc=false`, `risk=missing_doc_link`.
  - `useHydrationReady` now reads as `status=verified`,
    `hasTest=true`, `hasDoc=false`, `risk=missing_doc_link`.
  - `project-truth-index.json` no longer routes the scoped rows as
    `missing_test_link`; the next owner is
    `Docs Memory Lead + Project Manager`.

## Result

The frontend proof gap is closed in code and indexed truth for the scoped auth
control and hook. The remaining work is documentation-link closure, not
frontend proof.

## Boundary

No runtime code, deploy, push, restart, rollback, env edit, protected
account/session smoke, secret/account readback, DB/Redis mutation,
exchange/payment/subscription mutation, order, position, bot activation, or
LIVE trading action occurred.
