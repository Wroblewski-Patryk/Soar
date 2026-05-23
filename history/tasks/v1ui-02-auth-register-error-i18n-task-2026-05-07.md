# V1UI-02 Auth Register Error And I18n Route Task

## Header

- ID: `V1UI-02`
- Title: `fix(web-auth): persist register errors and seed auth i18n route`
- Task Type: `fix`
- Current Stage: `verification`
- Status: `DONE`
- Owner: `Frontend Builder`
- Depends on: `V1UI-01`
- Priority: `P0`
- Iteration: `2026-05-07-10`
- Operation Mode: `BUILDER`

## Process Self-Audit

- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context

`/auth/register` is part of the canonical public access route contract. A local
rendered smoke found two V1 access-flow gaps: registration failures were only
shown through a toast, and the route-scoped i18n provider initially rendered
auth pages as `/`, causing dev-console missing-key warnings before client route
sync.

## Goal

Make registration failure state durable and accessible in the form, and seed
route-scoped i18n from the actual Next pathname so auth pages render without
namespace warnings.

## Scope

- `apps/web/src/features/auth/components/RegisterForm.tsx`
- `apps/web/src/features/auth/components/RegisterForm.test.tsx`
- `apps/web/src/features/auth/hooks/useRegisterForm.ts`
- `apps/web/src/features/auth/hooks/useRegisterForm.test.tsx`
- `apps/web/src/i18n/I18nProvider.tsx`
- `apps/web/vitest.setup.ts`
- `history/artifacts/_artifacts-l10nq-d-coverage-audit-latest.json`
- source-of-truth planning/context files

## Implementation Plan

1. Add `serverError` state to registration submit handling.
2. Render the registration server error inline with `role="alert"`.
3. Seed `I18nProvider` route path from `usePathname` and keep existing route
   transition syncing.
4. Update tests for register error state and route-aware test mocks.
5. Run focused tests, typecheck, rendered smoke, route i18n audit, guardrails,
   and diff check.

## Acceptance Criteria

- [x] Registration server errors persist inline in the form.
- [x] Registration server errors have `role="alert"`.
- [x] Auth route i18n loads the `auth` namespace without dev-console missing
  key warnings on `/auth/register`.
- [x] Desktop and mobile register views render.
- [x] Offline API fail-state returns to an actionable form with an inline
  error.

## Definition of Done

- [x] Focused tests pass.
- [x] Web typecheck passes.
- [x] Rendered smoke passes.
- [x] Route-reachable i18n audit passes.
- [x] Guardrails and diff check pass.
- [x] Context and planning docs are updated.

## Forbidden

- Do not change registration API behavior.
- Do not add new auth routes.
- Do not weaken route guards.
- Do not commit temporary smoke scripts or screenshots.

## Validation Evidence

- Tests:
  - `pnpm --filter web run test -- src/i18n/namespaceRegistry.test.ts src/i18n/routeLocaleSmoke.test.ts src/i18n/I18nProvider.route-loading.test.tsx src/features/auth/components/RegisterForm.test.tsx src/features/auth/hooks/useRegisterForm.test.tsx --run`
    -> PASS (`13/13`).
  - `pnpm --filter web run typecheck` -> PASS.
  - `pnpm i18n:audit:route-reachable:web` -> PASS (`findings=0`).
  - `pnpm run quality:guardrails` -> PASS.
  - `git diff --check` -> PASS.
- Rendered checks:
  - Browser plugin path remained blocked by old Node REPL runtime; fallback
    used bundled Codex Node `v24.14.0` plus bundled Playwright.
  - Local dev URL: `http://127.0.0.1:3002/auth/register`.
  - Desktop register default state: PASS.
  - Desktop register offline API fail-state: PASS, inline `.alert-error`
    text `Network Error`; `role="alert"` includes `Network Error`.
  - Mobile register first viewport: PASS.
  - i18n console warnings: PASS, none captured after the `usePathname` fix.
- Screenshots:
  - Temporary, not committed:
    `C:\Users\wrobl\AppData\Local\Temp\soar-v1-register-local-smoke\register-desktop.png`
    `C:\Users\wrobl\AppData\Local\Temp\soar-v1-register-local-smoke\register-error-alert-desktop.png`
    `C:\Users\wrobl\AppData\Local\Temp\soar-v1-register-local-smoke\register-mobile.png`
- High-risk checks:
  - API was intentionally offline for the local fail-state smoke; no real
    account, credentials, payment, exchange, or live-money action was used.

## Architecture Evidence

- Architecture source reviewed:
  - `docs/architecture/reference/dashboard-route-map.md`
  - `docs/ux/experience-quality-bar.md`
- Fits approved architecture: yes.
- Mismatch discovered: route-scoped i18n was not seeded from the actual auth
  route during first render.
- Decision required from user: no.
- Approval reference if architecture changed: not applicable.
- Follow-up architecture doc updates: none.

## UX/UI Evidence

- Design source type: approved_snapshot.
- Design source reference: current auth register page and shared form alert
  semantics.
- Canonical visual target: current `/auth/register` route styling.
- Fidelity target: structurally_faithful.
- Stitch used: no.
- Experience-quality bar reviewed: yes.
- Existing shared pattern reused: `alert-error` with `role="alert"`.
- New shared pattern introduced: no.
- Design-memory update required: no.
- Visual gap audit completed: yes, desktop and mobile first viewport.
- Required states: default and error.
- Responsive checks: desktop and mobile.
- Input-mode checks: keyboard-fill and checkbox through Playwright.
- Accessibility checks: inline server error has `role="alert"`.
- Parity evidence: no layout redesign; rendered smoke confirmed page remains
  structurally unchanged.

## Deployment / Ops Evidence

- Deploy impact: low.
- Env or secret changes: none.
- Health-check impact: none.
- Smoke steps updated: not needed.
- Rollback note: revert the register server-error state and i18n pathname
  seed if a broader auth/i18n provider refactor supersedes this.
- Observability or alerting impact: dev-console i18n warning noise reduced for
  auth routes.
- Staged rollout or feature flag: not applicable.

## Autonomous Loop Evidence

### 1. Analyze Current State

- Issues: Register errors were toast-only, and auth route i18n produced
  missing-key warnings on first render.
- Gaps: Browser plugin could not be used due the local Node REPL runtime
  version; Playwright fallback was required.
- Inconsistencies: Login had durable inline error after `V1UI-01`; register did
  not.
- Architecture constraints: `/auth/register` is a canonical public access
  route; route-scoped i18n must include the auth namespace.

### 2. Select One Priority Task

- Selected task: `V1UI-02`.
- Priority rationale: V1 access flows need durable, accessible failure states
  and clean route-localized rendering.
- Why other candidates were deferred: authenticated dashboard runtime views
  still require credentials or seeded API data.

### 3. Plan Implementation

- Files or surfaces to modify: register hook/component/tests and i18n provider
  route seed.
- Logic: mirror login's server-error pattern and use `usePathname` as the
  authoritative route seed for route-scoped namespaces.
- Edge cases: preserve history-patched route syncing for tests and client
  transitions.

### 4. Execute Implementation

- Implementation notes: Added `serverError` to `useRegisterForm`, rendered it
  in `RegisterForm`, added tests, and updated the i18n provider/test mock.

### 5. Verify and Test

- Validation performed: focused tests, typecheck, rendered smoke, i18n audit,
  guardrails, and diff check.
- Result: PASS.

### 6. Self-Review

- Simpler option considered: add only `serverError` to register. Rejected
  because rendered QA exposed a real route-i18n warning that would remain in UI
  podglad.
- Technical debt introduced: no.
- Scalability assessment: `usePathname` is the Next-native route source and
  reduces first-render namespace drift.
- Refinements made: kept existing route-change listener to preserve test and
  client navigation behavior.

### 7. Update Documentation and Knowledge

- Docs updated:
  - `history/tasks/v1ui-02-auth-register-error-i18n-task-2026-05-07.md`
  - `history/artifacts/_artifacts-l10nq-d-coverage-audit-latest.json`
- Context updated:
  - `.codex/context/PROJECT_STATE.md`
  - `.codex/context/TASK_BOARD.md`
  - `docs/planning/mvp-next-commits.md`
- Learning journal updated: not applicable.

## Result Report

`V1UI-02` is closed locally. Register failures now persist inline with
`role="alert"`, and auth route i18n starts from the actual route path instead
of `/`, removing first-render namespace warning noise in rendered auth UI smoke.
