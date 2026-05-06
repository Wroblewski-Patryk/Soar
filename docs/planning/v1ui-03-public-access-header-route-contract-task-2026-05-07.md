# V1UI-03 Public Access Header Route Contract

## Header
- ID: V1UI-03
- Title: fix(web-public): hide auth CTAs while session state is loading
- Task Type: fix
- Current Stage: implementation
- Status: DONE
- Owner: Frontend Builder
- Depends on: V1UI-01, V1UI-02
- Priority: P1
- Iteration: 3
- Operation Mode: ARCHITECT

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
The canonical public/access route contract lists `/`, `/auth/login`,
`/auth/register`, and `/offline` as public entry surfaces. Recent V1 UI slices
closed login and register error feedback. The next smallest route-to-UI check
is the public shell header, because it decides whether a visitor sees
auth-entry CTAs or authenticated dashboard/admin CTAs.

## Goal
Prevent the public header from showing logged-out auth CTAs while session state
is still loading, and lock canonical auth routes in focused component coverage.

## Scope
- `apps/web/src/ui/layout/public/Header.tsx`
- `apps/web/src/ui/layout/public/Header.test.tsx`
- `apps/web/src/i18n/I18nProvider.tsx`
- `apps/web/src/i18n/I18nProvider.route-loading.test.tsx`
- `docs/planning/v1ui-03-public-access-header-route-contract-task-2026-05-07.md`
- `.codex/context/PROJECT_STATE.md`
- `.codex/context/TASK_BOARD.md`
- `docs/planning/mvp-next-commits.md`

## Success Signal
- User or operator problem: public entry should not momentarily invite login or
  register while the app is still determining whether a user is already
  authenticated.
- Expected product or reliability outcome: public shell CTA state is stable,
  route-canonical, and less confusing for authenticated users.
- How success will be observed: focused header tests and local rendered smoke
  prove unauthenticated header links are canonical and loading state has no
  premature auth/dashboard CTAs.
- Post-launch learning needed: no

## Deliverable For This Stage
Implement and verify the focused public header CTA contract.

## Constraints
- Reuse the existing public shell and auth context.
- Do not add new routing systems or aliases.
- Do not introduce `/login` or `/register` compatibility paths.
- Do not change authentication behavior or protected-route middleware.

## Implementation Plan
1. Confirm canonical route constraints in `dashboard-route-map.md`.
2. Add an explicit `showAuthCtas` decision that is true only after auth loading
   completes with no user.
3. Add focused component tests for logged-out canonical auth links and loading
   state suppression.
4. Run focused tests, Web typecheck, rendered public route smoke, guardrails,
   and diff check.
5. Sync task, planning, and project-state documents.

## Acceptance Criteria
- Logged-out public header links point to `/auth/login` and `/auth/register`.
- Loading public header does not show login, register, dashboard, or admin CTAs.
- Authenticated dashboard/admin CTA behavior remains unchanged.
- Local rendered public route smoke has no framework overlay, no relevant
  console errors, and no i18n missing-key warnings on desktop/mobile.

## Definition of Done
- [x] Focused header tests pass.
- [x] Web typecheck passes.
- [x] Rendered public route smoke passes for desktop and mobile.
- [x] Repository guardrails and diff check pass.
- [x] Source-of-truth docs are synchronized.

## Stage Exit Criteria
- [x] The output matches the declared `Current Stage`.
- [x] Work from later stages was not mixed in without explicit approval.
- [x] Risks and assumptions for this stage are stated clearly.

## Forbidden
- New systems without approval.
- Duplicated route logic.
- Temporary bypasses or compatibility aliases.
- Architecture changes without explicit approval.
- Silent downgrade of public visual assets.

## Validation Evidence
- Tests:
  - `pnpm --filter web run test -- src/ui/layout/public/Header.test.tsx src/i18n/I18nProvider.route-loading.test.tsx --run`
    => PASS (`7/7`).
  - `pnpm --filter web run typecheck` => PASS.
  - `pnpm --filter web run lint` => PASS, no warnings or errors.
  - `pnpm --filter web run build` => PASS.
  - `pnpm i18n:audit:route-reachable:web` => PASS (`findings=0`).
  - `pnpm run quality:guardrails` => PASS.
  - `git diff --check` => PASS.
- Manual checks:
  - Local rendered smoke on `http://127.0.0.1:3002/` desktop and mobile.
  - Desktop interaction: header Login link navigates to
    `http://127.0.0.1:3002/auth/login` and renders `Sign in to Soar`.
- Screenshots/logs:
  - `C:\Users\wrobl\AppData\Local\Temp\soar-v1ui03-public-smoke\desktop.png`
  - `C:\Users\wrobl\AppData\Local\Temp\soar-v1ui03-public-smoke\mobile.png`
- High-risk checks: no money-moving, API mutation, auth session validation, or
  permission boundary changed.

## Architecture Evidence
- Architecture source reviewed:
  `docs/architecture/reference/dashboard-route-map.md`.
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: none expected

## UX/UI Evidence
- Design source type: approved_snapshot
- Design source reference: current public shell implementation plus
  `docs/ux/screen-quality-checklist.md`.
- Canonical visual target: current `/` public shell and auth CTA placement.
- Fidelity target: structurally_faithful
- Stitch used: no
- Experience-quality bar reviewed: yes
- Visual-direction brief reviewed: not applicable for this narrow shell fix
- Existing shared pattern reused: public `Header` and existing button classes
- New shared pattern introduced: no
- Design-memory entry reused: public shell CTA contract
- Design-memory update required: no
- Visual gap audit completed: yes
- Background or decorative asset strategy: preserve existing landing imagery
- Canonical asset extraction required: no
- Screenshot comparison pass completed: yes
- Remaining mismatches: none in scoped public shell smoke
- Required states: loading, success
- Responsive checks: desktop, mobile
- Input-mode checks: pointer, keyboard
- Accessibility checks: links remain accessible by role and visible focus
- Parity evidence: desktop and mobile smoke preserve current public shell
  layout and canonical auth CTA placement.

## Deployment / Ops Evidence
- Deploy impact: low
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no
- Rollback note: revert `Header.tsx` and focused test change.
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: loading public header can currently render auth CTAs before session
  truth is known.
- Gaps: component coverage did not lock logged-out canonical auth links or
  loading-state CTA suppression.
- Inconsistencies: none in canonical route targets; the gap is state handling.
- Architecture constraints: `/auth/login` and `/auth/register` are canonical;
  no `/login` or `/register` alias should be added.

### 2. Select One Priority Task
- Selected task: V1UI-03 public access header route/state contract.
- Priority rationale: public access is a V1 entry path and session CTA drift is
  small, user-visible, and safely fixable.
- Why other candidates were deferred: deeper authenticated dashboard QA and
  live-money proof require separate vertical slices.

### 3. Plan Implementation
- Files or surfaces to modify: public header component and focused header test.
- Logic: render auth CTAs only when `!loading && !user`; preserve authenticated
  dashboard/admin CTA behavior.
- Edge cases: admin user still sees admin link; non-admin does not; loading
  state shows no premature CTA.

### 4. Execute Implementation
- Implementation notes:
  - Added `showAuthCtas` so auth CTAs render only after auth loading resolves
    with no user.
  - Updated route translations to use the current `usePathname()` value during
    render, with route state retained as fallback for history-event tests.
  - Added focused regression coverage for public header logged-out/loading
    states and public-to-auth client navigation i18n scope.

### 5. Verify and Test
- Validation performed: focused tests, Web typecheck, lint, production build,
  route-reachable i18n audit, local rendered smoke, guardrails, and diff check.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: only adding tests for existing routes, rejected
  because loading-state behavior was an actual visible gap.
- Technical debt introduced: no
- Scalability assessment: the explicit state booleans keep the shell decision
  readable and local.
- Refinements made: local smoke revealed a public-to-auth i18n route-scope
  flicker; fixed before closure and locked with test coverage.

### 7. Update Documentation and Knowledge
- Docs updated: this task file, `docs/planning/mvp-next-commits.md`, and
  `docs/planning/mvp-execution-plan.md`.
- Context updated: `.codex/context/TASK_BOARD.md` and
  `.codex/context/PROJECT_STATE.md`.
- Learning journal updated: not applicable

## Review Checklist
- [x] Process self-audit completed before implementation.
- [x] Autonomous loop evidence covers all seven steps.
- [x] Exactly one priority task was completed in this iteration.
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

## Integration Evidence
- `INTEGRATION_CHECKLIST.md` reviewed: not applicable for this UI-only shell
  state slice.
- Real API/service path used: not applicable
- Endpoint and client contract match: not applicable
- DB schema and migrations verified: not applicable
- Loading state verified: yes
- Error state verified: not applicable
- Refresh/restart behavior verified: yes
- Regression check performed: focused public header and i18n route-loading
  suites.

## Product / Discovery Evidence
- Problem validated: yes
- User or operator affected: public and authenticated users entering the app
- Existing workaround or pain: none; this prevents confusing transient CTA
  display.
- Smallest useful slice: public header state decision plus tests.
- Success metric or signal: no premature auth CTAs while session loads.
- Feature flag, staged rollout, or disable path: not applicable
- Post-launch feedback or metric check: no

## Reliability / Observability Evidence
- `docs/operations/service-reliability-and-observability.md` reviewed: not
  applicable
- Critical user journey: public entry to auth/dashboard
- SLI: not applicable
- SLO: not applicable
- Error budget posture: not applicable
- Health/readiness check: not applicable
- Logs, dashboard, or alert route: not applicable
- Smoke command or manual smoke: bundled Codex Node `v24.14.0` plus bundled
  Playwright against `http://127.0.0.1:3002/`.
- Rollback or disable path: revert the header/test change

## Security / Privacy Evidence
- `docs/security/secure-development-lifecycle.md` reviewed: not applicable
- Data classification: public shell only
- Trust boundaries: no API or session validation boundary changed
- Permission or ownership checks: existing `useAuth` context only
- Abuse cases: no new action or mutation path introduced
- Secret handling: none
- Security tests or scans: focused UI state and guardrails
- Fail-closed behavior: loading session state does not present auth or
  dashboard navigation until truth is known.
- Residual risk: low

## AI Testing Evidence
- `AI_TESTING_PROTOCOL.md` reviewed: not applicable
- Memory consistency scenarios: not applicable
- Multi-step context scenarios: not applicable
- Adversarial or role-break scenarios: not applicable
- Prompt injection checks: not applicable
- Data leakage and unauthorized access checks: not applicable
- Result: not applicable

## Result Report
- Task summary: Public header no longer shows logged-out auth CTAs while auth
  state is loading. Public-to-auth client navigation now uses the current route
  namespace during render, eliminating missing auth i18n warnings after clicking
  Login from `/`.
- Files changed:
  - `apps/web/src/ui/layout/public/Header.tsx`
  - `apps/web/src/ui/layout/public/Header.test.tsx`
  - `apps/web/src/i18n/I18nProvider.tsx`
  - `apps/web/src/i18n/I18nProvider.route-loading.test.tsx`
  - `docs/operations/_artifacts-l10nq-d-coverage-audit-latest.json`
  - planning/context docs
- How tested: focused tests (`7/7`), Web typecheck, lint, production build,
  route-reachable i18n audit (`findings=0`), local rendered desktop/mobile
  smoke, guardrails, and diff check.
- What is incomplete: API dev target was not started for this UI-only smoke;
  expected local `/auth/me` connection-refused resource messages were excluded
  from console failure classification.
- Next steps: continue V1 UI/runtime route sweeps with the next smallest
  authenticated dashboard surface.
- Decisions made: no route aliases were added; canonical `/auth/login` and
  `/auth/register` remain the only public auth entry links.
