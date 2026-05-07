# Task

## Header
- ID: V1UI-21
- Title: Dashboard aggregate wallet strict capital parity
- Task Type: fix
- Current Stage: release
- Status: DONE
- Owner: Frontend Builder
- Depends on: V1UI-20
- Priority: P1
- Iteration: 21
- Operation Mode: ARCHITECT

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
`DAWR` requires LIVE wallet capital on aggregate-success Dashboard Home reads to come from aggregate `positions.summary.referenceBalance` and `positions.summary.freeCash`. The shared runtime helper still allowed legacy compatibility fields such as `accountBalance` and `availableBalance`, which is valid for non-aggregate fallback reads but can mask missing aggregate contract fields.

## Goal
Keep aggregate-success Dashboard Home wallet values strict to aggregate capital fields while preserving compatibility capital fallback for true non-aggregate/session fallback paths.

## Scope
- `apps/web/src/features/bots/utils/runtimeSurfaceTruth.ts`
- `apps/web/src/features/bots/utils/runtimeSurfaceTruth.test.ts`
- `apps/web/src/features/dashboard-home/components/HomeLiveWidgets.aggregate-wallet.test.tsx`
- `apps/web/src/features/dashboard-home/components/home-live-widgets/useRuntimeSelectionViewModel.ts`
- `apps/web/src/features/dashboard-home/components/home-live-widgets/RuntimeSidebarSection.tsx`
- Dashboard Home docs and canonical execution context.

## Success Signal
- User or operator problem: missing aggregate capital fields no longer look valid because older compatibility fields happened to be present.
- Expected product or reliability outcome: Dashboard Home fails visibly closed for unresolved aggregate wallet capital instead of masking the API contract gap.
- How success will be observed: aggregate wallet tests assert `referenceBalance/freeCash: null` render as missing even when `accountBalance/availableBalance` exist.
- Post-launch learning needed: no

## Deliverable For This Stage
One verified ARCHITECT-mode realignment slice with tests, docs, and rendered smoke evidence.

## Constraints
- use existing runtime surface helper module
- do not remove compatibility fallback from non-aggregate/session fallback paths
- do not change backend/API contracts
- do not introduce a new runtime read model
- no temporary bypasses or mock-only behavior

## Implementation Plan
1. Add aggregate-strict capital helper functions beside existing compatibility helpers.
2. Route Dashboard Home selected aggregate snapshots through the strict helpers.
3. Keep non-aggregate selected snapshots on the compatibility helper path.
4. Add focused regression coverage for aggregate strictness and non-aggregate compatibility.
5. Update Dashboard Home DAWR docs and canonical context.
6. Run focused tests, broader Dashboard Home tests, Web quality gates, build, and rendered smoke.

## Acceptance Criteria
- Aggregate-success selected runtime wallet capital reads only `referenceBalance/freeCash` for the Dashboard Home wallet KPI/sidebar.
- Legacy `accountBalance/availableBalance` do not mask missing aggregate `referenceBalance/freeCash`.
- Non-aggregate fallback reads still support compatibility capital fields.
- Relevant tests and quality gates pass.

## Definition of Done
- [x] `DEFINITION_OF_DONE.md` satisfied for this slice.
- [x] Architecture source reviewed and no approved contract change required.
- [x] Existing systems reused.
- [x] No workaround or duplicate runtime read model introduced.
- [x] Validation evidence attached.
- [x] Docs/context updated.

## Validation Evidence
- Tests:
  - PASS `pnpm --filter web exec vitest run src/features/bots/utils/runtimeSurfaceTruth.test.ts src/features/dashboard-home/components/HomeLiveWidgets.aggregate-wallet.test.tsx src/features/dashboard-home/components/RuntimeSidebarSection.test.tsx --run` (`13/13`)
  - PASS `pnpm --filter web exec vitest run src/features/dashboard-home/components/HomeLiveWidgets.test.tsx --run` (`20/20`)
  - PASS `pnpm --filter web run typecheck`
  - PASS `pnpm --filter web run lint`
  - PASS `pnpm i18n:audit:route-reachable:web` (`findings=0`)
  - PASS `pnpm run quality:guardrails`
  - PASS `pnpm run build`
- Manual checks:
  - PASS authenticated rendered `/dashboard` smoke via bundled Codex Node and Playwright. API register returned `201`, desktop and mobile Dashboard rendered onboarding content, framework overlay was empty, `messages=[]`, and `pageErrors=[]`.
- Screenshots/logs:
  - Desktop screenshot: `C:/Users/wrobl/AppData/Local/Temp/soar-v1ui21-smoke/dashboard-desktop-clean.png`
  - Mobile screenshot: `C:/Users/wrobl/AppData/Local/Temp/soar-v1ui21-smoke/dashboard-mobile-clean.png`
- High-risk checks:
  - Money-impacting wallet display now fails closed for missing aggregate capital fields; no order or mutation path changed.

## Architecture Evidence
- Architecture source reviewed:
  - `docs/governance/autonomous-engineering-loop.md`
  - `docs/modules/web-dashboard-home.md`
  - `docs/architecture/reference/runtime-signal-merge-contract.md`
- Fits approved architecture: yes
- Mismatch discovered: yes, Web could use compatibility capital fields inside aggregate-success wallet presentation.
- Decision required from user: no, implementation realigned code to approved `DAWR` contract.
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: `docs/modules/web-dashboard-home.md`

## UX/UI Evidence
- Design source type: approved_snapshot
- Design source reference: existing Dashboard Home wallet KPI/sidebar behavior.
- Canonical visual target: unresolved aggregate wallet capital renders as `-`.
- Fidelity target: structurally_faithful
- Stitch used: no
- Experience-quality bar reviewed: yes
- Visual-direction brief reviewed: yes
- Existing shared pattern reused: wallet KPI/sidebar formatting and runtime surface helper module.
- New shared pattern introduced: no
- Design-memory entry reused: existing Dashboard Home wallet conventions.
- Design-memory update required: no
- Visual gap audit completed: yes
- Background or decorative asset strategy: not applicable
- Canonical asset extraction required: no
- Screenshot comparison pass completed: yes
- Remaining mismatches: none known in this slice.
- Required states: loading, empty, error, success remain inherited.
- Responsive checks: desktop and mobile rendered smoke; no layout structure changed.
- Input-mode checks: not applicable, read-only KPI display.
- Accessibility checks: no semantic structure changed.
- Parity evidence: aggregate wallet regression covers strict field behavior.

## Deployment / Ops Evidence
- Deploy impact: low
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no
- Rollback note: revert the frontend helper routing if aggregate strictness must be relaxed after an approved architecture decision.
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: shared wallet helper supported compatibility capital fields in all contexts.
- Gaps: `DAWR` requires aggregate-success reads to show unresolved `referenceBalance/freeCash` as missing, not masked.
- Inconsistencies: non-aggregate compatibility and aggregate strictness needed different semantics.
- Architecture constraints: aggregate endpoint success is the source of truth; session fallback is only for aggregate failure.

### 2. Select One Priority Task
- Selected task: `V1UI-21 dashboard aggregate wallet strict capital parity`.
- Priority rationale: ARCHITECT-mode review found a source-of-truth boundary that can affect money-facing wallet display.
- Why other candidates were deferred: runtime table additions are lower priority than preventing wallet capital masking.

### 3. Plan Implementation
- Files or surfaces to modify: shared runtime helper, Dashboard Home selected view model, sidebar fallback, focused tests, docs/context.
- Logic: use strict aggregate helpers only when selected positions have `sessionId: "AGGREGATE"`.
- Edge cases: aggregate `freeCash` can still derive portfolio with used margin, but aggregate free funds requires `freeCash` itself.

### 4. Execute Implementation
- Implementation notes: added strict aggregate helpers and kept the existing compatibility helpers unchanged for fallback reads.

### 5. Verify and Test
- Validation performed: focused helper/dashboard/sidebar tests, broad Dashboard Home regression test, Web typecheck, Web lint, i18n audit, guardrails, build, and rendered smoke.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: changing the existing helper globally.
- Technical debt introduced: no
- Scalability assessment: explicit aggregate helper names make future DAWR usage reviewable.
- Refinements made: regression now includes legacy fields in the aggregate payload to prove they do not mask null contract fields.

### 7. Update Documentation and Knowledge
- Docs updated: `docs/modules/web-dashboard-home.md`, `docs/planning/mvp-next-commits.md`, this task report.
- Context updated: `.codex/context/PROJECT_STATE.md`, `.codex/context/TASK_BOARD.md`.
- Learning journal updated: not applicable.

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
- [x] Full validation gates and rendered smoke complete.
- [x] Docs or context were updated if repository truth changed.
- [x] Learning journal was updated if a recurring pitfall was confirmed.

## Result Report
Dashboard Home aggregate wallet capital now uses strict aggregate helpers for `AGGREGATE` selected snapshots, so missing `referenceBalance/freeCash` stays visible as unresolved instead of being filled from compatibility fields. Non-aggregate fallback reads still support legacy compatibility fields.

## Integration Evidence
- `INTEGRATION_CHECKLIST.md` reviewed: yes
- Real API/service path used: yes, existing aggregate runtime read model.
- Endpoint and client contract match: yes
- DB schema and migrations verified: not applicable
- Loading state verified: inherited from Dashboard Home runtime loading state.
- Error state verified: inherited from Dashboard Home runtime error state.
- Refresh/restart behavior verified: rendered `/dashboard` smoke after dev server restart.
- Regression check performed: aggregate strictness plus non-aggregate compatibility tests.

## Product / Discovery Evidence
- Problem validated: yes
- User or operator affected: Dashboard operator reviewing LIVE wallet capital.
- Existing workaround or pain: aggregate capital gaps could appear as valid wallet numbers.
- Smallest useful slice: strict aggregate helper routing for selected Dashboard Home wallet values.
- Success metric or signal: unresolved aggregate `referenceBalance/freeCash` renders as `-`.
- Feature flag, staged rollout, or disable path: not applicable
- Post-launch feedback or metric check: no

## Reliability / Observability Evidence
- `docs/operations/service-reliability-and-observability.md` reviewed: not applicable
- Critical user journey: review selected LIVE bot wallet capital.
- SLI: not applicable
- SLO: not applicable
- Error budget posture: not applicable
- Health/readiness check: no impact
- Logs, dashboard, or alert route: no impact
- Smoke command or manual smoke: authenticated rendered `/dashboard` smoke via bundled Codex Node and Playwright.
- Rollback or disable path: revert frontend helper routing.

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
- Data classification: runtime wallet and position read model.
- Trust boundaries: existing authenticated Dashboard API boundary unchanged.
- Permission or ownership checks: unchanged.
- Abuse cases: no mutation path changed.
- Secret handling: none.
- Security tests or scans: not applicable.
- Fail-closed behavior: unresolved aggregate capital remains missing instead of being masked.
- Residual risk: aggregate wallet strictness is covered by automated tests; local rendered smoke used an empty-dashboard account, so live aggregate data remains covered at unit/component level rather than by live-money runtime data.
