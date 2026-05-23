# Task

## Header
- ID: V1UI-31
- Title: Keep dashboard-home runtime labels route-owned
- Task Type: fix
- Current Stage: release
- Status: DONE
- Owner: Frontend Builder
- Depends on: DASHDRIFT-02, V1UI-30
- Priority: P1
- Iteration: 31
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
Dashboard Home is the canonical `/dashboard` runtime overview surface. During the architecture-to-web parity audit, the route-owned dashboard presenter still reused `dashboard.bots.monitoring.*` translation keys for closed-position history entry/exit columns and the advanced options label.

## Goal
Move those Dashboard Home UI labels to `dashboard.home.runtime.*` keys so the route owns its presentation copy while continuing to render the same backend runtime data.

## Scope
- `apps/web/src/features/dashboard-home/components/HomeLiveWidgets.tsx`
- `apps/web/src/features/dashboard-home/components/home-live-widgets/runtimeDataTablePresenters.tsx`
- `apps/web/src/features/dashboard-home/components/home-live-widgets/runtimeDataTablePresenters.test.tsx`
- `apps/web/src/i18n/namespaces/dashboard-home.*.ts`
- `docs/modules/web-dashboard-home.md`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`
- `docs/planning/mvp-next-commits.md`

## Implementation Plan
1. Add missing dashboard-home runtime translation keys for `exit` and `advancedOptions` in all dashboard-home locales.
2. Replace Dashboard Home consumers of `dashboard.bots.monitoring.table.entry`, `dashboard.bots.monitoring.table.exit`, and `dashboard.bots.monitoring.advancedOptions`.
3. Update focused presenter tests so they assert dashboard-owned keys.
4. Run focused web tests, i18n route audit, lint/typecheck/guardrails/build, and rendered dashboard smoke.
5. Update task and source-of-truth docs with verification evidence.

## Acceptance Criteria
- Dashboard Home runtime/history presenters no longer consume `dashboard.bots.monitoring.*` translation keys.
- All supported dashboard-home locales define the new route-owned labels.
- Existing runtime table behavior stays unchanged apart from translation ownership.
- Validation evidence is recorded before marking DONE.

## Definition of Done
- [x] `DEFINITION_OF_DONE.md` is satisfied for this slice with evidence.
- [x] Relevant automated checks pass.
- [x] Dashboard route rendered smoke is attempted with Browser plugin first and Playwright fallback if required.
- [x] Source-of-truth task/project/planning docs are updated.

## Deliverable For This Stage
Release-ready implementation, validation, and documentation for route-owned Dashboard Home runtime labels.

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
- Tests: PASS `pnpm.cmd --filter web exec vitest run src/features/dashboard-home/components/home-live-widgets/runtimeDataTablePresenters.test.tsx --run` (`15/15`), PASS `pnpm.cmd --filter web run typecheck`, PASS `pnpm.cmd --filter web run lint`, PASS `pnpm.cmd run quality:guardrails`, PASS `pnpm.cmd run build`, PASS `git diff --check`
- Manual checks: PASS authenticated rendered `/dashboard` smoke after API registration and `/auth/me` verification.
- Screenshots/logs: Playwright smoke captured the route and reported `hasDashboardCue=true`, `consoleErrors=[]`, `pageErrors=[]`; temporary artifact removed after evidence was recorded.
- High-risk checks: no money-moving logic changes; presentation-only route ownership fix

## Architecture Evidence
- Architecture source reviewed: `docs/architecture/08_operator-surfaces-and-routing.md`, `docs/modules/web-dashboard-home.md`, `.codex/context/TASK_BOARD.md`, `docs/planning/mvp-next-commits.md`
- Fits approved architecture: yes
- Mismatch discovered: yes, Dashboard Home reused Bots namespace labels for route-owned runtime presentation.
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: dashboard-home module note if verification confirms closure

## UX/UI Evidence
- Design source type: approved_snapshot
- Design source reference: existing Dashboard Home runtime surface and route-owned i18n contract
- Canonical visual target: existing `/dashboard` live runtime workspace
- Fidelity target: structurally_faithful
- Stitch used: no
- Experience-quality bar reviewed: yes
- Visual-direction brief reviewed: not applicable
- Existing shared pattern reused: existing dashboard-home runtime table presenters and sidebar labels
- New shared pattern introduced: no
- Design-memory entry reused: route-owned Dashboard Home module documentation
- Design-memory update required: no
- Visual gap audit completed: yes
- Background or decorative asset strategy: not applicable
- Canonical asset extraction required: no
- Screenshot comparison pass completed: structurally faithful smoke, no pixel target for this label-ownership slice
- Remaining mismatches: none for this slice
- Required states: loading | empty | error | success
- Responsive checks: desktop smoke
- Input-mode checks: pointer
- Accessibility checks: no label removal; text remains visible through existing controls
- Parity evidence: Dashboard Home presenters now resolve closed-position entry/exit and advanced-options labels via `dashboard.home.runtime.*`; backend runtime payload mapping unchanged.

## Deployment / Ops Evidence
- Deploy impact: low
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no
- Rollback note: revert this commit to restore previous translation keys
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: Dashboard Home still referenced Bots translation namespace for runtime history entry/exit and advanced options labels.
- Gaps: Missing route-owned `dashboard.home.runtime.exit` and `dashboard.home.runtime.advancedOptions` keys.
- Inconsistencies: UI copy ownership did not match route/module ownership.
- Architecture constraints: Dashboard Home owns `/dashboard` presentation while consuming approved backend runtime APIs.

### 2. Select One Priority Task
- Selected task: V1UI-31 dashboard-home route-owned runtime labels.
- Priority rationale: Small surface drift between backend runtime presentation and web route ownership; low-risk v1 alignment.
- Why other candidates were deferred: Broader UI polish and data-flow audits remain larger than one autonomous iteration.

### 3. Plan Implementation
- Files or surfaces to modify: dashboard-home presenters, locale namespaces, focused tests, source-of-truth docs.
- Logic: Keep all data mapping unchanged; only replace translation ownership.
- Edge cases: All locales must have the new keys so i18n audit stays route-reachable.

### 4. Execute Implementation
- Implementation notes: Added `dashboard.home.runtime.exit` and `dashboard.home.runtime.advancedOptions` to all dashboard-home locales, switched Dashboard Home consumers away from `dashboard.bots.monitoring.*`, and updated focused presenter tests to use route-owned keys.

### 5. Verify and Test
- Validation performed: focused presenter tests, route-reachable i18n audit, Web typecheck, Web lint, repository guardrails, `git diff --check`, full workspace build, Browser plugin attempt, and Playwright authenticated `/dashboard` smoke.
- Result: PASS. Browser plugin attempt failed before page load because local `node_repl` resolved Node `v22.13.0` while requiring `>=22.22.0`; Playwright fallback with bundled Codex Node passed with no console/page errors.

### 6. Self-Review
- Simpler option considered: keep Bots keys and document as shared copy, rejected because route-level namespace ownership is the approved Dashboard Home pattern.
- Technical debt introduced: no
- Scalability assessment: Route-owned keys avoid future cross-surface coupling.
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
This is presentation ownership work only. No API, DB, command, or money-moving runtime behavior is changed.

## Production-Grade Required Contract
- Goal: keep Dashboard Home runtime labels owned by the Dashboard Home namespace.
- Scope: exact files listed above.
- Implementation Plan: listed above.
- Acceptance Criteria: listed above.
- Definition of Done: use `DEFINITION_OF_DONE.md` evidence for this slice.
- Result Report: pending.

## Integration Evidence
- `INTEGRATION_CHECKLIST.md` reviewed: yes
- Real API/service path used: not applicable
- Endpoint and client contract match: unchanged
- DB schema and migrations verified: not applicable
- Loading state verified: existing route smoke entered Dashboard Home route successfully
- Error state verified: existing behavior unchanged
- Refresh/restart behavior verified: local API and Web processes were started fresh for the smoke and then stopped
- Regression check performed: focused presenter regression plus full build

## Product / Discovery Evidence
- Problem validated: yes
- User or operator affected: dashboard operator reviewing backend runtime history in web
- Existing workaround or pain: route UI borrowed Bots copy keys
- Smallest useful slice: replace three translation consumers and add route-owned labels
- Success metric or signal: tests and i18n audit pass with no `dashboard.bots.monitoring.*` usage in Dashboard Home runtime presenters
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
- Task summary: Dashboard Home runtime/history labels now stay route-owned instead of referencing Bots monitoring copy.
- Files changed: Dashboard Home runtime presenters/tests, dashboard-home locale namespaces, translation schema, dashboard-home module doc, task board, project state, MVP queue, and this task file.
- How tested: focused presenter tests (`15/15`), route-reachable i18n audit (`findings=0`), Web typecheck, Web lint, repository guardrails, `git diff --check`, full workspace build, and authenticated rendered `/dashboard` smoke.
- What is incomplete: nothing for this slice.
- Next steps: continue the next smallest architecture-to-code-to-UI parity audit item.
- Decisions made: Treat Dashboard Home presentation copy as route-owned even when the displayed data originates from runtime/Bots APIs.
