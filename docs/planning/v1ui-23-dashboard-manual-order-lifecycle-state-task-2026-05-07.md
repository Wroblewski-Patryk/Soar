# Task

## Header
- ID: V1UI-23
- Title: Show dashboard manual-order lifecycle state after submit
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Frontend Builder
- Depends on: V1UI-22
- Priority: P1
- Iteration: 23
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
Dashboard Home already submits manual orders through `POST /dashboard/orders/open`, and the API returns the persisted order after lifecycle processing. `UOLF` requires operator-facing states to reflect lifecycle truth, but the Web hook discarded the response and showed only a success toast.

## Goal
Keep the backend manual-order response visible in the Dashboard Home manual-order panel so operators can see whether the submitted order is waiting for fill, filled, or already linked to an opened position.

## Success Signal
- User or operator problem: manual order submission no longer disappears into a toast-only success path.
- Expected product or reliability outcome: backend order lifecycle status is reflected on the primary runtime surface.
- How success will be observed: focused component test asserts that an `OPEN` response renders a waiting-for-fill state and order id.
- Post-launch learning needed: no

## Scope
- `apps/web/src/features/bots/types/bot.type.ts`
- `apps/web/src/features/bots/services/bots.service.ts`
- `apps/web/src/features/dashboard-home/hooks/useManualOrderController.ts`
- `apps/web/src/features/dashboard-home/components/HomeLiveWidgets.tsx`
- `apps/web/src/features/dashboard-home/components/home-live-widgets/RuntimeSidebarSection.tsx`
- `apps/web/src/features/dashboard-home/components/home-live-widgets/runtimeSidebarPresenters.ts`
- `apps/web/src/features/dashboard-home/components/HomeLiveWidgets.manual-order.test.tsx`
- `apps/web/src/features/dashboard-home/components/RuntimeSidebarSection.test.tsx`
- `docs/modules/web-dashboard-home.md`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`
- `docs/planning/mvp-next-commits.md`

## Implementation Plan
1. Type the manual-order API response with `id`, `status`, and optional `positionId`.
2. Store the latest successful response in the manual-order hook and clear stale state when the operator edits order inputs.
3. Map response status into existing localized UOLF labels in the sidebar presenter.
4. Render the action-state block in the manual-order panel with `aria-live`.
5. Add focused regression coverage and update canonical docs/context.

## Acceptance Criteria
- `OPEN` and `PARTIALLY_FILLED` responses show waiting/fill-progress state instead of toast-only success.
- `FILLED` with `positionId` shows the existing position-opened state.
- Stale state is cleared when the operator changes manual-order inputs.
- Focused tests and Web typecheck pass.

## Definition of Done
- [x] Concrete UI state is rendered from the real API response.
- [x] No new backend endpoint, duplicated lifecycle system, or workaround path was introduced.
- [x] Focused tests and typecheck are green.
- [x] Source-of-truth docs and context are updated.

## Validation Evidence
- Tests: `pnpm --filter web exec vitest run src/features/dashboard-home/components/HomeLiveWidgets.manual-order.test.tsx src/features/dashboard-home/hooks/useManualOrderController.test.tsx src/features/dashboard-home/components/RuntimeSidebarSection.test.tsx` (`22/22`), `pnpm --filter web run typecheck`, `pnpm --filter web run lint`, `pnpm i18n:audit:route-reachable:web` (`findings=0`), `pnpm run quality:guardrails`, `pnpm run build`.
- Manual checks: authenticated rendered `/dashboard` smoke on desktop and mobile.
- Screenshots/logs: `C:\Users\wrobl\AppData\Local\Temp\soar-v1ui23-smoke\dashboard-desktop.png`, `C:\Users\wrobl\AppData\Local\Temp\soar-v1ui23-smoke\dashboard-mobile.png`; no console warnings, console errors, or page errors.
- High-risk checks: UOLF state is display-only and uses existing authenticated API response; no order execution behavior changed.

## Architecture Evidence
- Architecture source reviewed: `docs/modules/web-dashboard-home.md`, `docs/architecture/reference/runtime-signal-merge-contract.md`.
- Fits approved architecture: yes
- Mismatch discovered: yes, Web discarded lifecycle response from an approved API.
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: `docs/modules/web-dashboard-home.md` now records the response-state rendering note.

## UX/UI Evidence
- Design source type: approved_snapshot
- Design source reference: existing Dashboard Home manual-order panel.
- Canonical visual target: existing sidebar panel style.
- Fidelity target: structurally_faithful
- Stitch used: no
- Experience-quality bar reviewed: yes
- Visual-direction brief reviewed: not applicable
- Existing shared pattern reused: localized status text in compact sidebar diagnostic block.
- New shared pattern introduced: no
- Design-memory update required: no
- Required states: success
- Responsive checks: desktop and mobile rendered `/dashboard` smoke passed.
- Accessibility checks: action-state block uses `aria-live="polite"`.
- Parity evidence: state labels reuse existing Dashboard Home runtime lifecycle strings.

## Deployment / Ops Evidence
- Deploy impact: low
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no
- Rollback note: revert this Web-only commit.
- Observability or alerting impact: none

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: manual order response was ignored after submit.
- Gaps: Dashboard Home did not show UOLF response state for newly submitted manual orders.
- Inconsistencies: API persisted lifecycle truth, Web only showed a toast.
- Architecture constraints: keep `POST /dashboard/orders/open`; do not add a parallel lifecycle path.

### 2. Select One Priority Task
- Selected task: `V1UI-23`.
- Priority rationale: manual order lifecycle visibility is money-impacting operator feedback.
- Why other candidates were deferred: this was the smallest verified backend-to-Web parity slice found.

### 3. Plan Implementation
- Files or surfaces to modify: Web service type, hook, presenter, sidebar UI, focused tests, docs/context.
- Logic: map response `status` and optional `positionId` into existing localized action-state labels.
- Edge cases: unknown statuses fall back to submitted; stale state clears on input edits.

### 4. Execute Implementation
- Implementation notes: no API behavior changed; Web now keeps the response returned by the existing endpoint.

### 5. Verify and Test
- Validation performed: focused Vitest pack and Web typecheck.
- Result: PASS, including focused tests (`22/22`), Web typecheck, Web lint, route-reachable i18n audit (`findings=0`), repository guardrails, full workspace build, and authenticated rendered `/dashboard` desktop/mobile smoke with no console warnings, console errors, or page errors.

### 6. Self-Review
- Simpler option considered: toast-only status text; rejected because it is transient and not operator-facing runtime state.
- Technical debt introduced: no
- Scalability assessment: additional lifecycle response fields can be added to `DashboardManualOrderResponse` without changing the UI contract.
- Refinements made: test assertion was aligned to existing Polish translation.

### 7. Update Documentation and Knowledge
- Docs updated: this task report, `docs/modules/web-dashboard-home.md`, task board, project state, MVP queue.
- Context updated: yes
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
- [x] Relevant validations were run.
- [x] Docs or context were updated.

## Integration Evidence
- `INTEGRATION_CHECKLIST.md` reviewed: yes
- Real API/service path used: yes
- Endpoint and client contract match: yes
- DB schema and migrations verified: not applicable
- Loading state verified: existing in-flight button state retained
- Error state verified: existing error toast path retained
- Refresh/restart behavior verified: state is retained while silent reload completes
- Regression check performed: focused manual-order/sidebar tests

## Security / Privacy Evidence
- `docs/security/secure-development-lifecycle.md` reviewed: yes
- Data classification: authenticated order metadata
- Trust boundaries: Web displays only the authenticated API response for the current operator session.
- Permission or ownership checks: unchanged API authorization path.
- Abuse cases: stale response state clears on input edits to avoid misleading next submit context.
- Secret handling: none
- Security tests or scans: focused tests and typecheck only
- Fail-closed behavior: execution behavior unchanged; invalid orders still fail through existing validation and API errors.
- Residual risk: browser smoke covers dashboard load and console/page health, but not a real manual-order click against a funded LIVE account.

## Result Report
- Task summary: Dashboard manual-order panel now renders backend response lifecycle state after successful submit.
- Files changed: see Scope.
- How tested: focused Vitest pack (`22/22`), Web typecheck, Web lint, route-reachable i18n audit (`findings=0`), repository guardrails, full workspace build, and rendered `/dashboard` desktop/mobile smoke.
- What is incomplete: nothing known for this slice.
- Next steps: continue the next smallest backend-to-Web parity review.
- Decisions made: response-only UI state is sufficient for this slice; no backend endpoint changes.
