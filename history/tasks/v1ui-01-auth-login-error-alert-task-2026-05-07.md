# V1UI-01 Auth Login Error Alert Task

## Header

- ID: `V1UI-01`
- Title: `fix(web-auth): announce login server errors`
- Task Type: `fix`
- Current Stage: `verification`
- Status: `DONE`
- Owner: `Frontend Builder`
- Depends on: `V1MANUAL-01`
- Priority: `P0`
- Iteration: `2026-05-07-09`
- Operation Mode: `BUILDER`

## Process Self-Audit

- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context

The V1 route contract lists `/auth/login` as the canonical public login route
and `/dashboard` as protected. A rendered UI smoke confirmed unauthenticated
`/dashboard` redirects to `/auth/login`, and invalid credentials produce a
visible inline server error. The inline error used `alert alert-error` styling
but did not expose `role="alert"`, unlike shared form alert components.

## Goal

Make the login server-error state accessible and test-covered without changing
auth behavior, routing, API contracts, or visual layout.

## Scope

- `apps/web/src/features/auth/components/LoginForm.tsx`
- `apps/web/src/features/auth/components/LoginForm.test.tsx`
- `history/tasks/v1ui-01-auth-login-error-alert-task-2026-05-07.md`
- `.codex/context/PROJECT_STATE.md`
- `.codex/context/TASK_BOARD.md`
- `docs/planning/mvp-next-commits.md`

## Implementation Plan

1. Verify architecture route target for `/auth/login` and `/dashboard`.
2. Render-smoke production/local login behavior to identify the UI gap.
3. Add `role="alert"` to the inline server-error state.
4. Add a focused component regression.
5. Run focused tests, typecheck, guardrails, and local rendered smoke.

## Acceptance Criteria

- [x] Login server errors render in an element with `role="alert"`.
- [x] Existing password visibility and i18n login behavior stay covered.
- [x] Local rendered smoke proves `/dashboard` redirects to `/auth/login`.
- [x] Local rendered smoke proves the login fail state returns to an actionable
  form and exposes an inline `.alert-error`.
- [x] Mobile login first viewport renders without a framework overlay.

## Definition of Done

- [x] Code change is minimal and uses existing UI alert semantics.
- [x] Focused auth component tests pass.
- [x] Web typecheck passes.
- [x] Repository guardrails and diff check pass.
- [x] Documentation/context is updated.

## Forbidden

- Do not change auth API behavior.
- Do not bypass route guards.
- Do not add new auth routes.
- Do not commit screenshots or temporary smoke scripts.

## Validation Evidence

- Tests:
  - `pnpm --filter web run test -- src/features/auth/components/LoginForm.test.tsx --run`
    -> PASS (`4/4`).
  - `pnpm --filter web run typecheck` -> PASS.
  - `pnpm run quality:guardrails` -> PASS.
  - `git diff --check` -> PASS.
- Rendered checks:
  - Browser plugin path: blocked because the Node REPL runtime resolved
    `C:\Program Files\nodejs\node.exe` at `v22.13.0`, while Browser requires
    `>=22.22.0`.
  - Fallback: bundled Codex Node `v24.14.0` plus bundled Playwright package,
    without changing project dependencies.
  - Local dev URL: `http://127.0.0.1:3002/auth/login`.
  - Desktop `/dashboard` redirect: PASS, final URL
    `http://127.0.0.1:3002/auth/login`.
  - Desktop login fail state with API offline: PASS, inline `.alert-error`
    text `Network Error`; `role="alert"` text includes `Network Error`.
  - Mobile login first viewport: PASS, email/password inputs present.
- Screenshots:
  - Temporary, not committed:
    `C:\Users\wrobl\AppData\Local\Temp\soar-v1-login-local-smoke\dashboard-redirect-desktop.png`
    `C:\Users\wrobl\AppData\Local\Temp\soar-v1-login-local-smoke\login-error-alert-desktop.png`
    `C:\Users\wrobl\AppData\Local\Temp\soar-v1-login-local-smoke\login-mobile.png`
- High-risk checks:
  - API was intentionally not started for the local fail-state smoke; no
    credentials, secrets, or live-money actions were used.

## Architecture Evidence

- Architecture source reviewed:
  - `docs/architecture/reference/dashboard-route-map.md`
  - `docs/ux/experience-quality-bar.md`
- Fits approved architecture: yes.
- Mismatch discovered: no route mismatch; an accessibility/error-state gap was
  found in the login UI.
- Decision required from user: no.
- Approval reference if architecture changed: not applicable.
- Follow-up architecture doc updates: none.

## UX/UI Evidence

- Design source type: approved_snapshot.
- Design source reference:
  - existing `LoginForm` and shared form alert semantics.
- Canonical visual target: current login route styling.
- Fidelity target: structurally_faithful.
- Stitch used: no.
- Experience-quality bar reviewed: yes.
- Visual-direction brief reviewed: not applicable; no visual redesign.
- Existing shared pattern reused: `role="alert"` error semantics from shared
  form alert components.
- New shared pattern introduced: no.
- Design-memory update required: no.
- Visual gap audit completed: yes, for desktop and mobile login first viewport.
- Required states: error and default login form.
- Responsive checks: desktop and mobile.
- Input-mode checks: keyboard-fill via Playwright.
- Accessibility checks: server error now has `role="alert"`.
- Parity evidence: no layout change; rendered smoke verified unchanged first
  viewport structure.

## Deployment / Ops Evidence

- Deploy impact: low.
- Env or secret changes: none.
- Health-check impact: none.
- Smoke steps updated: not needed.
- Rollback note: revert the `role="alert"` attribute and test if a broader
  auth form alert refactor supersedes this.
- Observability or alerting impact: none.
- Staged rollout or feature flag: not applicable.

## Autonomous Loop Evidence

### 1. Analyze Current State

- Issues: Login server error was visible but not announced as an alert.
- Gaps: Browser plugin could not run in this environment due old Node REPL
  runtime; Playwright fallback was required.
- Inconsistencies: Shared form alerts use `role="alert"`, but `LoginForm`
  inline server error did not.
- Architecture constraints: `/auth/login` is canonical; `/dashboard` must
  redirect fail-closed when unauthenticated.

### 2. Select One Priority Task

- Selected task: `V1UI-01`.
- Priority rationale: login/session feedback is a V1 access gate and must be
  robust before protected/manual matrix work.
- Why other candidates were deferred: authenticated dashboard smoke needs
  credentials; money-path runtime views need protected production or seeded
  local API data.

### 3. Plan Implementation

- Files or surfaces to modify: `LoginForm` and focused test.
- Logic: add alert role to the existing error container and assert it.
- Edge cases: API offline local fail state should return to an actionable form
  and expose a readable error.

### 4. Execute Implementation

- Implementation notes: Added `role="alert"` to the server-error container and
  a component regression for announced server errors.

### 5. Verify and Test

- Validation performed: focused component tests, web typecheck, rendered local
  smoke, guardrails, and diff check.
- Result: PASS.

### 6. Self-Review

- Simpler option considered: docs-only UI smoke. Rejected because a tiny code
  fix aligned the component with existing form semantics.
- Technical debt introduced: no.
- Scalability assessment: This is compatible with any later move to shared
  `FormAlert`.
- Refinements made: No layout/copy/API behavior changed.

### 7. Update Documentation and Knowledge

- Docs updated:
  - `history/tasks/v1ui-01-auth-login-error-alert-task-2026-05-07.md`
- Context updated:
  - `.codex/context/PROJECT_STATE.md`
  - `.codex/context/TASK_BOARD.md`
  - `docs/planning/mvp-next-commits.md`
- Learning journal updated: not applicable.

## Result Report

`V1UI-01` is closed locally. Login server errors are still rendered with the
same visual alert styling, but now expose `role="alert"` for accessibility.
Rendered desktop/mobile smoke verifies the protected redirect and login
fail-state path without changing auth behavior.
