# LUC-1026 Account Access useAuth Local Proof

- Date: 2026-07-14
- Owner: 09 TAE (Test Automation Engineer)
- Status: VERIFIED_LOCAL_INDEX_LINK
- Scope: Account access `apps/web/src/context/AuthContext.tsx#useAuth` local automated proof linkage.

## Result

The dispatched [LUC-1026](/LUC/issues/LUC-1026) `useAuth` proof slice now has
an explicit direct local relation to executable Web auth-context proof.

## Evidence

- Focused hook proof:
  `apps/web/src/context/AuthContext.test.tsx` now includes a direct
  providerless `useAuth` contract assertion in addition to the existing
  provider-backed session bootstrap, unauthorized refetch, protected-route
  expiry, and logout flows.
- Direct relation:
  `docs/architecture/relations/priority-test-links.csv` now maps
  `apps/web/src/context/AuthContext.tsx#useAuth` to
  `apps/web/src/context/AuthContext.test.tsx`.
- Validation:
  - `corepack pnpm --filter web exec vitest run src/context/AuthContext.test.tsx` -> PASS (`1` file / `5` tests)
  - `corepack pnpm --filter web run typecheck` -> PASS
  - `node C:\Personal\Projekty\Aplikacje\Paperclip_Softwarehouse\scripts\build-architecture-awareness-index.mjs --project Soar --root C:\Personal\Projekty\Aplikacje\Soar` -> PASS (`10928` entities / `36121` relations / `entityOverridesApplied=33`)
  - `node C:\Personal\Projekty\Aplikacje\Paperclip_Softwarehouse\scripts\build-app-completion-index.mjs --project Soar --root C:\Personal\Projekty\Aplikacje\Soar` -> PASS (`missingTestLink=963`, down from `964`)
  - `node C:\Personal\Projekty\Aplikacje\Paperclip_Softwarehouse\scripts\build-project-truth-indexes.mjs --project Soar --root C:\Personal\Projekty\Aplikacje\Soar --apply` -> PASS
- Generated readback:
  - architecture-awareness/app-completion/project-truth were regenerated after
    the relation update
  - targeted app-completion readback now shows
    `apps/web/src/context/AuthContext.tsx#useAuth` with `hasTest=true`,
    `hasDoc=false`, and `risk=missing_doc_link`
  - targeted `project-truth-index.md` grep returns no `useAuth` row, so the
    issue no longer surfaces as a priority proof gap

## QA Acceptance

Pass:

- **Given** `useAuth` is consumed outside `AuthProvider`, **when** the hook is
  read through a probe, **then** it returns the default fail-closed contract:
  `loading=true`, `sessionExpired=false`, `user=null`, and a callable
  `refetchUser`.
- **Given** `useAuth` is consumed inside `AuthProvider`, **when** `/auth/me`
  succeeds, expires, or logout runs, **then** the local auth state continues to
  follow the existing regression pack for bootstrap, unauthorized refetch,
  protected-route expiry, and logout redirect behavior.

Fail:

- none after final verification

Blocked:

- none for the proof-link lane; any remaining direct documentation gap is a
  separate Docs Memory follow-up, not a TAE blocker

## Boundary

No runtime auth logic, production protected auth/session proof, deploy, push,
restart, rollback, env edits, DB/Redis mutation, exchange/payment/subscription
mutation, order, position, or live-trading action occurred.

## Residual

If refreshed app-completion advances `useAuth` from `missing_test_link` to
`missing_doc_link`, the next owner is Docs Memory Lead + Project Manager. This
heartbeat closes only the local proof lane.
