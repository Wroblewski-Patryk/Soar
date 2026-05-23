# Task

## Header
- ID: V1UI-28
- Title: fix(web-runtime): show manual-order blocked reason
- Task Type: fix
- Current Stage: release
- Status: DONE
- Owner: Frontend Builder
- Depends on: V1UI-27
- Priority: P1
- Iteration: 28
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
The `UOLF` runtime diagnostics contract in `docs/modules/web-dashboard-home.md`
requires Dashboard Home manual-order operator-facing states to include a
`blocked reason`. The API already returns actionable error messages from
`POST /dashboard/orders/open`, but the Web manual-order flow currently shows
that reason only in a transient toast and clears the persistent action-state
panel.

## Goal
Keep manual-order blocked reasons visible in the Dashboard Home manual-order
panel after a failed backend submission, using existing error-resolution and
runtime-sidebar presenter patterns.

## Scope
- `apps/web/src/features/dashboard-home/hooks/useManualOrderController.ts`
- `apps/web/src/features/dashboard-home/components/HomeLiveWidgets.tsx`
- `apps/web/src/features/dashboard-home/components/home-live-widgets/runtimeSidebarPresenters.ts`
- `apps/web/src/features/dashboard-home/components/home-live-widgets/RuntimeSidebarSection.tsx`
- Focused Dashboard Home manual-order tests.
- Dashboard Home module documentation and canonical planning/context files.

## Success Signal
- User or operator problem: a failed manual order explains why it was blocked
  inside the runtime control panel instead of disappearing after the toast.
- Expected product or reliability outcome: money-impacting manual actions stay
  fail-closed and explainable.
- How success will be observed: focused Web test proves API error text appears
  in `manual-order-action-state` with blocked semantics.
- Post-launch learning needed: no

## Deliverable For This Stage
Implementation plus focused regression evidence for the blocked-state panel.

## Constraints
- Use existing `resolveUiErrorMessage`/`getAxiosMessage` behavior.
- Do not change API behavior, DB schema, or order command semantics.
- Do not add a new notification system or duplicate lifecycle mapping.
- Clear stale blocked reason when the operator edits the next manual-order
  draft.

## Implementation Plan
1. Store the latest manual-order submit error in the manual-order controller.
2. Clear both last response and last error when draft inputs change or selected
   bot changes.
3. Extend the sidebar manual-order presenter to map submit error into existing
   localized `manualOrderActionStateBlocked` copy and show the concrete backend
   reason as the description.
4. Add a tone prop so blocked action state renders with error semantics while
   success/submitted states keep info semantics.
5. Add focused component regression coverage.
6. Run relevant Web validation, guardrails, build, and rendered smoke.

## Acceptance Criteria
- Failed `POST /dashboard/orders/open` leaves a visible
  `manual-order-action-state`.
- The state label is localized as blocked.
- The state description includes the backend/API error message.
- The blocked state is cleared when the operator edits the next draft.
- Existing submitted/waiting/fill/opened behavior remains unchanged.

## Definition of Done
- [x] Focused manual-order tests pass.
- [x] Web typecheck and lint pass.
- [x] Route-reachable i18n audit passes.
- [x] Repository guardrails pass.
- [x] Full build passes.
- [x] Rendered dashboard smoke passes without console/page errors.
- [x] Canonical docs/context are updated.

## Forbidden
- New systems without approval.
- Duplicated lifecycle mapping.
- Temporary bypasses or mock-only behavior.
- API or DB behavior changes.

## Validation Evidence
- Tests:
  - `pnpm --filter web exec vitest run src/features/dashboard-home/hooks/useManualOrderController.test.tsx src/features/dashboard-home/components/RuntimeSidebarSection.test.tsx src/features/dashboard-home/components/HomeLiveWidgets.manual-order.test.tsx --run` => PASS (`25/25`).
  - `pnpm --filter web run typecheck` => PASS.
  - `pnpm --filter web run lint` => PASS.
  - `pnpm i18n:audit:route-reachable:web` => PASS (`findings=0`).
  - `pnpm run quality:guardrails` => PASS.
  - `pnpm run build` => PASS.
- Manual checks:
  - Browser plugin bootstrap attempted first and failed on local system Node
    `v22.13.0` requiring `>=22.22.0`.
  - Fallback bundled Node + Playwright rendered `/dashboard` smoke passed on
    desktop and mobile.
- Screenshots/logs:
  - `C:\Users\wrobl\AppData\Local\Temp\soar-v1ui28-smoke\dashboard-desktop.png`
  - `C:\Users\wrobl\AppData\Local\Temp\soar-v1ui28-smoke\dashboard-mobile.png`
- High-risk checks:
  - No API, DB, order-command, or money-execution behavior changed.
  - Submit error is resolved through the existing Web API error resolver and
    remains visible until the next manual-order draft edit.

## Architecture Evidence
- Architecture source reviewed:
  - `docs/architecture/architecture-source-of-truth.md`
  - `docs/architecture/reference/runtime-signal-merge-contract.md`
  - `docs/modules/web-dashboard-home.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: none expected

## UX/UI Evidence
- Design source type: approved_snapshot
- Design source reference: existing Dashboard Home runtime sidebar pattern
- Canonical visual target: current manual-order action-state panel
- Fidelity target: structurally_faithful
- Stitch used: no
- Experience-quality bar reviewed: yes
- Existing shared pattern reused: runtime sidebar manual-order action state
- New shared pattern introduced: no
- Required states: error
- Responsive checks: desktop, mobile rendered smoke
- Accessibility checks: `aria-live` action-state remains present
- Parity evidence: focused hook/sidebar tests and rendered dashboard smoke.

## Deployment / Ops Evidence
- Deploy impact: low
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no
- Rollback note: revert Web-only commit
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: API manual-order submit errors are not persisted in the manual-order
  lifecycle panel.
- Gaps: `blocked reason` is listed by UOLF but not visible after submit
  failure.
- Inconsistencies: submitted/success states are persistent; blocked state is
  toast-only.
- Architecture constraints: runtime diagnostics must avoid ambiguous silent
  no-op behavior.

### 2. Select One Priority Task
- Selected task: V1UI-28 manual-order blocked reason state.
- Priority rationale: money-impacting manual actions must be explainable and
  fail-closed.
- Why other candidates were deferred: production-only import/release evidence
  needs protected external access; larger parity audits are split into smaller
  Web-visible slices.

### 3. Plan Implementation
- Files or surfaces to modify: listed in Scope.
- Logic: carry latest submit error through controller -> presenter -> sidebar.
- Edge cases: stale blocked reason must clear on draft edits and bot switch.

### 4. Execute Implementation
- Implementation notes:
  - Added `manualOrderLastError` to the manual-order controller.
  - Existing input-change handlers now clear both stale response and stale
    blocked-error truth.
  - Runtime sidebar presenter maps a submit error to localized blocked state
    with the concrete backend/API message as description.
  - Runtime sidebar action-state panel now supports `info` and `error` tones.

### 5. Verify and Test
- Validation performed: focused tests, Web typecheck, lint, i18n audit,
  guardrails, full build, and rendered smoke.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: toast-only behavior rejected because UOLF requires
  persistent operator-facing blocked reason.
- Technical debt introduced: no
- Scalability assessment: keeps existing controller/presenter/sidebar
  ownership and does not introduce a parallel lifecycle system.
- Refinements made: narrowed rendered smoke overlay detection after the first
  fallback attempt counted an empty `nextjs-portal` as a false positive.

### 7. Update Documentation and Knowledge
- Docs updated:
  - `docs/modules/web-dashboard-home.md`
  - `docs/planning/mvp-next-commits.md`
  - this task report
- Context updated:
  - `.codex/context/PROJECT_STATE.md`
  - `.codex/context/TASK_BOARD.md`
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
- [x] Docs or context were updated.

## Notes
No API contract change is planned; this is a Web reflection/parity fix for an
existing backend error path.

## Result Report
- Task summary: Dashboard Home now shows backend/API manual-order submit
  failures as persistent blocked action state in the runtime sidebar.
- Files changed:
  - `apps/web/src/features/dashboard-home/hooks/useManualOrderController.ts`
  - `apps/web/src/features/dashboard-home/hooks/useManualOrderController.test.tsx`
  - `apps/web/src/features/dashboard-home/components/HomeLiveWidgets.tsx`
  - `apps/web/src/features/dashboard-home/components/RuntimeSidebarSection.test.tsx`
  - `apps/web/src/features/dashboard-home/components/home-live-widgets/RuntimeSidebarSection.tsx`
  - `apps/web/src/features/dashboard-home/components/home-live-widgets/runtimeSidebarPresenters.ts`
  - `docs/modules/web-dashboard-home.md`
  - `.codex/context/PROJECT_STATE.md`
  - `.codex/context/TASK_BOARD.md`
  - `docs/planning/mvp-next-commits.md`
- How tested: see Validation Evidence.
- What is incomplete: production-only protected evidence remains outside this
  local Web parity slice.
- Next steps: continue backend-to-Web parity scan for the next smallest
  runtime field/state mismatch.
- Decisions made: no architecture changes; Web-only reflection of existing API
  error truth.
