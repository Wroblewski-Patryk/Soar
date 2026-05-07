# Task

## Header
- ID: V1UI-32
- Title: Close remaining dashboard-home route-owned copy leaks
- Task Type: fix
- Current Stage: release
- Status: DONE
- Owner: Frontend Builder
- Depends on: V1UI-31
- Priority: P1
- Iteration: 32
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
V1UI-31 moved Dashboard Home runtime history labels to route-owned
`dashboard.home.runtime.*` keys, but analysis found remaining Dashboard Home
runtime presentation copy still resolving from `dashboard.bots.*`.

## Goal
Remove the remaining Dashboard Home dependency on Bots translation keys for
runtime presentation labels while preserving the existing backend data flow and
shared runtime semantics.

## Scope
- `apps/web/src/features/dashboard-home/components/HomeLiveWidgets.tsx`
- `apps/web/src/features/dashboard-home/components/home-live-widgets/runtimeDataTablePresenters.tsx`
- `apps/web/src/features/dashboard-home/components/home-live-widgets/runtimeDataTablePresenters.test.tsx`
- `apps/web/src/features/dashboard-home/components/home-live-widgets/runtimeSidebarPresenters.ts`
- `apps/web/src/i18n/namespaces/dashboard-home.*.ts`
- `apps/web/src/i18n/translations.ts`
- `docs/modules/web-dashboard-home.md`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`
- `docs/planning/mvp-next-commits.md`

## Implementation Plan
1. Add dashboard-home runtime keys for placeholder badge, placeholder activation hint, strategy label, and mark-price source labels in all locales.
2. Replace remaining Dashboard Home consumers of `dashboard.bots.*` copy with `dashboard.home.runtime.*`.
3. Keep the shared Bots mark-price utility unchanged for Bots surfaces; use a Dashboard Home local label-key resolver in Dashboard Home presenters.
4. Update focused presenter tests so they assert route-owned keys.
5. Run focused Web tests, route-reachable i18n audit, typecheck/lint/guardrails/build, and rendered dashboard smoke.

## Acceptance Criteria
- No Dashboard Home source or focused Dashboard Home presenter test references `dashboard.bots.*`.
- Mark-price source labels on `/dashboard` resolve through Dashboard Home namespace keys.
- Placeholder capability warnings and strategy labels on `/dashboard` resolve through Dashboard Home namespace keys.
- Existing backend/API/runtime data flow remains unchanged.

## Definition of Done
- [x] `DEFINITION_OF_DONE.md` is satisfied for this slice with evidence.
- [x] Relevant automated checks pass.
- [x] Browser plugin is attempted before Playwright fallback for rendered validation.
- [x] Source-of-truth task/project/planning docs are updated.

## Deliverable For This Stage
Release-ready route-owned Dashboard Home copy closure with validation evidence.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within the declared current stage unless explicit approval changes it

## Forbidden
- new systems without approval
- duplicated logic or parallel implementations of the same contract
- temporary bypasses, hacks, or workaround-only paths
- architecture changes without explicit approval
- implicit stage skipping

## Validation Evidence
- Tests: PASS `pnpm.cmd --filter web exec vitest run src/features/dashboard-home/components/home-live-widgets/runtimeDataTablePresenters.test.tsx src/features/dashboard-home/components/RuntimeSidebarSection.test.tsx --run` (`25/25`), PASS `pnpm.cmd --filter web run typecheck`, PASS `pnpm.cmd --filter web run lint`, PASS `pnpm.cmd run quality:guardrails`, PASS `pnpm.cmd run build`, PASS `git diff --check`
- Manual checks: PASS authenticated rendered `/dashboard` smoke after API registration and `/auth/me` verification.
- Screenshots/logs: Playwright smoke captured the route and reported `hasDashboardCue=true`, `consoleErrors=[]`, `pageErrors=[]`; temporary screenshot artifact removed after evidence was recorded.
- High-risk checks: no money-moving logic changes; presentation-copy ownership only

## Architecture Evidence
- Architecture source reviewed: `docs/modules/web-dashboard-home.md`, `docs/architecture/08_operator-surfaces-and-routing.md`, `.codex/context/TASK_BOARD.md`, `docs/planning/mvp-next-commits.md`
- Fits approved architecture: yes
- Mismatch discovered: yes, remaining `/dashboard` runtime copy depended on `dashboard.bots.*`.
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: tighten dashboard-home route-owned copy note after verification

## UX/UI Evidence
- Design source type: approved_snapshot
- Design source reference: existing Dashboard Home runtime surface and route-owned i18n contract
- Canonical visual target: existing `/dashboard` live runtime workspace
- Fidelity target: structurally_faithful
- Stitch used: no
- Experience-quality bar reviewed: yes
- Visual-direction brief reviewed: not applicable
- Existing shared pattern reused: existing Dashboard Home runtime presenter seams
- New shared pattern introduced: no
- Design-memory entry reused: route-owned Dashboard Home module documentation
- Design-memory update required: no
- Visual gap audit completed: yes
- Background or decorative asset strategy: not applicable
- Canonical asset extraction required: no
- Screenshot comparison pass completed: structurally faithful smoke, no pixel target for this copy-ownership slice
- Remaining mismatches: none for this slice
- Required states: loading | empty | error | success
- Responsive checks: desktop smoke
- Input-mode checks: pointer
- Accessibility checks: no label removal; existing visible labels remain
- Parity evidence: no `dashboard.bots.*` references remain under Dashboard Home source/tests; backend runtime payload mapping unchanged.

## Deployment / Ops Evidence
- Deploy impact: low
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no
- Rollback note: revert this commit to restore previous copy resolution
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: Dashboard Home still referenced `dashboard.bots.*` for placeholder, strategy, and mark-price source labels.
- Gaps: Dashboard Home lacked route-owned equivalents for those runtime labels.
- Inconsistencies: Route UI copy ownership did not fully match the Dashboard Home module boundary.
- Architecture constraints: `/dashboard` may consume Bots runtime APIs, but its presentation copy should remain route-owned.

### 2. Select One Priority Task
- Selected task: V1UI-32 dashboard-home route-owned copy closure.
- Priority rationale: Small architecture-to-web cleanup that removes cross-route coupling from a money-observability surface.
- Why other candidates were deferred: Wider runtime parity gaps need separate backend/API inspection and should not mix with this route ownership slice.

### 3. Plan Implementation
- Files or surfaces to modify: dashboard-home presenters, locale namespaces, translation schema, focused tests, source-of-truth docs.
- Logic: Add route-owned keys and map Dashboard Home mark-price source labels locally without changing the shared Bots utility.
- Edge cases: All locales must define the new keys; unknown mark-price source must still show unavailable.

### 4. Execute Implementation
- Implementation notes: Added route-owned keys for placeholder badge/hint, strategy label, and mark-price sources; switched Dashboard Home usage to `dashboard.home.runtime.*`; kept the shared Bots mark-price resolver unchanged for Bots surfaces.

### 5. Verify and Test
- Validation performed: focused Dashboard Home presenter/sidebar tests, route-reachable i18n audit, Web typecheck, Web lint, repository guardrails, `git diff --check`, full workspace build, Browser plugin attempt, and Playwright authenticated `/dashboard` smoke.
- Result: PASS. Browser plugin attempt failed before page load because local `node_repl` resolved Node `v22.13.0` while requiring `>=22.22.0`; Playwright fallback with bundled Codex Node passed with no console/page errors.

### 6. Self-Review
- Simpler option considered: changing the shared Bots mark-price utility to return dashboard keys, rejected because Bots surfaces still own Bots namespace labels.
- Technical debt introduced: no
- Scalability assessment: Route-owned key resolver keeps shared runtime semantics while avoiding cross-route copy dependencies.
- Refinements made: Kept generated route-reachable i18n artifact out of the commit because only its timestamp changed during validation.

### 7. Update Documentation and Knowledge
- Docs updated: `docs/modules/web-dashboard-home.md`, `docs/planning/mvp-next-commits.md`, this task file.
- Context updated: `.codex/context/TASK_BOARD.md`, `.codex/context/PROJECT_STATE.md`.
- Learning journal updated: not applicable

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

## Notes
This is presentation ownership work only. It does not change API contracts,
database state, runtime command paths, or money-moving behavior.

## Production-Grade Required Contract
- Goal: close remaining Dashboard Home route-owned copy leaks.
- Scope: exact files listed above.
- Implementation Plan: listed above.
- Acceptance Criteria: listed above.
- Definition of Done: use `DEFINITION_OF_DONE.md` evidence for this slice.
- Result Report: pending.

## Integration Evidence
- `INTEGRATION_CHECKLIST.md` reviewed: yes
- Real API/service path used: unchanged
- Endpoint and client contract match: unchanged
- DB schema and migrations verified: not applicable
- Loading state verified: existing route smoke entered Dashboard Home route successfully
- Error state verified: existing behavior unchanged
- Refresh/restart behavior verified: local API and Web processes were started fresh for the smoke and then stopped
- Regression check performed: focused presenter/sidebar regression plus full build

## Product / Discovery Evidence
- Problem validated: yes
- User or operator affected: dashboard operator reading runtime state and warnings
- Existing workaround or pain: route UI copy borrowed Bots namespace keys
- Smallest useful slice: replace remaining Dashboard Home `dashboard.bots.*` copy references
- Success metric or signal: no `dashboard.bots.*` references remain under Dashboard Home source/tests
- Feature flag, staged rollout, or disable path: not applicable
- Post-launch feedback or metric check: no

## Reliability / Observability Evidence
- `docs/operations/service-reliability-and-observability.md` reviewed: not applicable
- Critical user journey: dashboard runtime observation
- SLI: not applicable
- SLO: not applicable
- Error budget posture: not applicable
- Health/readiness check: not applicable
- Logs, dashboard, or alert route: not applicable
- Smoke command or manual smoke: pending
- Rollback or disable path: revert commit

## AI Testing Evidence
- `AI_TESTING_PROTOCOL.md` reviewed: not applicable
- Memory consistency scenarios: not applicable
- Multi-step context scenarios: not applicable
- Adversarial or role-break scenarios: not applicable
- Prompt injection checks: not applicable
- Data leakage and unauthorized access checks: not applicable
- Result: not applicable

## Security / Privacy Evidence
- `docs/security/secure-development-lifecycle.md` reviewed: not applicable
- Data classification: non-sensitive UI labels
- Trust boundaries: unchanged
- Permission or ownership checks: unchanged
- Abuse cases: not applicable
- Secret handling: unchanged
- Security tests or scans: not applicable
- Fail-closed behavior: unchanged
- Residual risk: low, presentation-only

## Result Report
- Task summary: Dashboard Home no longer depends on `dashboard.bots.*` for its runtime presentation copy.
- Files changed: Dashboard Home presenters/tests, dashboard-home locale namespaces, translation schema, dashboard-home module doc, task board, project state, MVP queue, and this task file.
- How tested: focused tests (`25/25`), route-reachable i18n audit (`findings=0`), Web typecheck, Web lint, repository guardrails, `git diff --check`, full workspace build, and authenticated rendered `/dashboard` smoke.
- What is incomplete: nothing for this slice.
- Next steps: continue the next smallest architecture-to-code-to-UI parity audit item.
- Decisions made: Keep shared runtime semantics reusable, but keep Dashboard Home presentation copy route-owned.
