# Task

## Header
- ID: V1UI-30
- Title: Fail closed auth form submit before hydration
- Task Type: fix
- Current Stage: release
- Status: DONE
- Owner: Frontend Builder
- Depends on: V1UI-29
- Priority: P0
- Iteration: 30
- Operation Mode: TESTER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
Rendered auth smoke after `V1UI-29` showed that a very early Register submit in
dev could fall through to native browser form submission before hydration,
placing email and password in the URL query string. A hydrated success flow also
emitted `useInsertionEffect must not schedule updates` while showing a success
toast during auth redirect.

## Goal
Keep login and registration forms fail-closed before hydration and remove the
unnecessary success-toast side effect from successful auth redirects.

## Success Signal
- User or operator problem: auth credentials must not be exposed in the browser
  URL when a form is submitted before client hydration.
- Expected product or reliability outcome: auth entrypoints stay quiet in
  rendered smoke and redirect cleanly after successful session confirmation.
- How success will be observed: native pre-hydration submit no longer produces
  a query-string credential leak, hydrated register/login still redirects to
  dashboard, and console has no relevant auth success errors.
- Post-launch learning needed: yes if a recurring browser/runtime pitfall is
  confirmed.

## Deliverable For This Stage
Released auth form guard with focused regression tests and rendered evidence.

## Constraints
- use existing auth form and hook patterns
- do not change API auth endpoints or session-cookie semantics
- do not add a new notification system
- keep error toasts and inline errors intact
- keep repository artifacts in English

## Definition of Done
- [x] Login/Register native pre-hydration submit cannot leak credentials into
  the URL query string.
- [x] Successful login/register still confirms the session and redirects to
  `/dashboard`.
- [x] Successful login/register no longer emits a success toast during the
  redirect.
- [x] Focused auth tests pass.
- [x] Rendered auth smoke passes with no relevant console errors.

## Stage Exit Criteria
- [x] The output matches the declared `Current Stage`.
- [x] Work from later stages was not mixed in without explicit approval.
- [x] Risks and assumptions for this stage are stated clearly.

## Forbidden
- new systems without approval
- duplicated logic or parallel implementations of the same contract
- temporary bypasses, hacks, or workaround-only paths
- architecture changes without explicit approval
- implicit stage skipping

## Validation Evidence
- Tests:
  - `pnpm.cmd --filter web exec vitest run src/lib/navigation.test.ts src/features/auth/hooks/useRegisterForm.test.tsx src/features/auth/hooks/useLoginForm.test.tsx src/features/auth/components/RegisterForm.test.tsx src/features/auth/components/LoginForm.test.tsx --run`
    => PASS (`19/19`).
  - `pnpm.cmd --filter web run typecheck` => PASS.
  - `pnpm.cmd --filter web run lint` => PASS.
  - `pnpm.cmd i18n:audit:route-reachable:web` => PASS (`findings=0`).
  - `pnpm.cmd run quality:guardrails` => PASS.
  - `git diff --check` => PASS.
  - `pnpm.cmd run build` => PASS.
- Manual checks: rendered auth smoke PASS for SSR `/auth/register` and
  `/auth/login`, desktop register to `/dashboard`, and mobile login to
  `/dashboard`.
- Screenshots/logs:
  - `docs/operations/_artifacts-v1ui30-auth-smoke/register-desktop-dashboard.png`
  - `docs/operations/_artifacts-v1ui30-auth-smoke/login-mobile-dashboard.png`
  - `docs/operations/_artifacts-v1ui30-auth-smoke/report.json`
- High-risk checks: raw SSR HTML contains `method="post"` and disabled
  fieldsets/buttons before hydration; hydrated URL checks confirmed no
  `email` or `password` query-string leak.

## Architecture Evidence
- Architecture source reviewed:
  - `docs/architecture/01_overview-and-principles.md`
  - `docs/architecture/10_safety-entitlements-and-risk.md`
  - `docs/security/secure-development-lifecycle.md`
  - `docs/modules/system-modules.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: none; context/task/queue docs updated.

## UX/UI Evidence
- Design source type: existing_auth_form_pattern
- Design source reference: current Login/Register form layout
- Canonical visual target: unchanged
- Fidelity target: exact_behavioral_guard
- Stitch used: no
- Experience-quality bar reviewed: yes
- Visual-direction brief reviewed: not applicable
- Existing shared pattern reused: auth form disabled/submitting states
- New shared pattern introduced: no
- Design-memory entry reused: not applicable
- Design-memory update required: no
- Visual gap audit completed: yes; layout unchanged, only disabled state and
  redirect behavior changed.
- Background or decorative asset strategy: not applicable
- Screenshot comparison pass completed: yes; rendered desktop and mobile
  screenshots captured.
- Remaining mismatches: none known
- Required states: loading/pre-hydration, success, error
- Responsive checks: desktop and mobile rendered smoke pending
- Input-mode checks: pointer and keyboard/native submit pending
- Accessibility checks: disabled controls remain visible with existing labels
- Parity evidence: backend session-confirmed success is reflected in Web by
  document navigation to `/dashboard`; failed auth still uses inline error plus
  error toast.

## Deployment / Ops Evidence
- Deploy impact: low
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no
- Rollback note: revert this commit to restore previous auth success toast and
  native form behavior.
- Observability or alerting impact: no
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: pre-hydration auth form submit can become native GET; success auth
  redirect can emit a dev console error from the toast path.
- Gaps: auth forms rely on hydrated React `onSubmit` to prevent native
  submission.
- Inconsistencies: auth-sensitive UI is not fail-closed before hydration.
- Architecture constraints: auth/user data must fail closed and must not expose
  secrets or credentials to browser URLs.

### 2. Select One Priority Task
- Selected task: `V1UI-30 fix(web-auth): fail closed pre-hydration auth forms`.
- Priority rationale: credential exposure in URL is higher risk than pure UI
  polish.
- Why other candidates were deferred: runtime parity work is currently closed
  in canonical queue; this fresh rendered finding is small and auth-sensitive.

### 3. Plan Implementation
- Files or surfaces to modify:
  - `apps/web/src/features/auth/components/LoginForm.tsx`
  - `apps/web/src/features/auth/components/RegisterForm.tsx`
  - `apps/web/src/features/auth/hooks/useLoginForm.ts`
  - `apps/web/src/features/auth/hooks/useRegisterForm.ts`
  - focused auth tests and context docs
- Logic: make native form fallback use POST, disable submit until client
  hydration, and keep successful auth redirect free of success toast side
  effects.
- Edge cases: validation errors and failed auth still show inline error plus
  error toast.

### 4. Execute Implementation
- Implementation notes: added feature-local hydration readiness hook, guarded
  Login/Register controls before hydration, set native auth forms to `POST`,
  removed success auth redirect toasts, and extended the existing navigation
  helper with document navigation for session-boundary redirects.

### 5. Verify and Test
- Validation performed: focused auth/navigation tests, Web typecheck, Web
  lint, route-reachable i18n audit, repository guardrails, diff check, full
  workspace build, and rendered auth smoke.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: only remove success toast. Rejected because it
  would not address native pre-hydration credential leakage.
- Technical debt introduced: none known.
- Scalability assessment: feature-local hydration guard is tiny and reusable
  only inside auth; document navigation is exposed through the existing
  navigation helper instead of a parallel redirect path.
- Refinements made: `startTransition` kept for client navigation updates;
  auth success uses document navigation because session-cookie establishment is
  a browser document boundary.

### 7. Update Documentation and Knowledge
- Docs updated: this task file, task board, project state, and MVP queue.
- Context updated: yes.
- Learning journal updated: no new recurring pitfall beyond the already-known
  Browser plugin Node-version issue.

## Review Checklist
- [x] Process self-audit completed before implementation.
- [x] Autonomous loop evidence covers all seven steps.
- [x] Exactly one priority task was selected for this iteration.
- [x] Operation mode was selected according to iteration rotation.
- [x] Current stage is declared and respected.
- [x] Deliverable for the current stage is complete.
- [x] Architecture alignment confirmed.
- [x] Existing systems were reused where applicable.
- [x] No workaround paths were introduced.
- [x] No logic duplication was introduced.
- [x] Definition of Done evidence is attached.
- [x] Relevant validations were run.
- [x] Docs or context were updated if repository truth changed.
- [x] Learning journal was updated if a recurring pitfall was confirmed.

## Production-Grade Required Contract
- Goal: keep auth entrypoint forms fail-closed before hydration and quiet on
  successful redirect.
- Scope: Web auth forms, auth submit hooks, tests, task/context docs.
- Implementation Plan: native POST fallback, hydration-disabled submit,
  remove success redirect toasts, validate rendered flows.
- Acceptance Criteria: no credential query leak, redirects still work, no
  relevant console errors, focused tests pass.
- Definition of Done: see above.
- Result Report: Login/Register now fail closed before hydration, successful
  auth redirects are document navigations after session confirmation, and
  focused plus rendered validation passed.

## Security / Privacy Evidence
- `docs/security/secure-development-lifecycle.md` reviewed: yes
- Data classification: credentials and auth session state
- Trust boundaries: browser pre-hydration HTML to client React auth handler;
  API session cookie remains server-owned
- Permission or ownership checks: unchanged
- Abuse cases: early submit or scriptless submit must not expose credentials in
  URL
- Secret handling: credentials must not be written to query strings
- Security tests or scans: rendered SSR/native-submit HTML check and hydrated
  URL checks passed.
- Fail-closed behavior: pre-hydration controls render disabled and forms use
  native `POST`.
- Residual risk: unauthenticated `/auth/me` still produces an expected 401
  network response on public auth pages; smoke ignores that expected auth
  probe and fails on relevant console/page/5xx errors.
