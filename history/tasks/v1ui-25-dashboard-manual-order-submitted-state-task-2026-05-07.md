# Task

## Header
- ID: V1UI-25
- Title: Show submitted manual-order state while request is in flight
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Frontend Builder
- Depends on: V1UI-23
- Priority: P1
- Iteration: 25
- Operation Mode: TESTER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
`UOLF` lists `order submitted` as an operator-facing manual-order lifecycle state. `V1UI-23` made post-response lifecycle truth visible, but while the request was still in flight the panel only showed the disabled `Opening...` button.

## Goal
Render the existing localized submitted action state while a manual-order request is in flight, then replace it with the backend response state once the API resolves.

## Success Signal
- User or operator problem: order submission no longer has a silent lifecycle gap between click and persisted response.
- Expected product or reliability outcome: the complete manual-order lifecycle is visible from submit through waiting/fill/position states.
- How success will be observed: focused component test asserts submitted state during the unresolved request and waiting-for-fill state after an `OPEN` response.
- Post-launch learning needed: no

## Scope
- `apps/web/src/features/dashboard-home/components/home-live-widgets/runtimeSidebarPresenters.ts`
- `apps/web/src/features/dashboard-home/components/HomeLiveWidgets.manual-order.test.tsx`
- `docs/modules/web-dashboard-home.md`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`
- `docs/planning/mvp-next-commits.md`

## Implementation Plan
1. Make the manual-order sidebar presenter derive `Submitted` when `isSubmittingManualOrder` is true and no response exists yet.
2. Keep response-derived states taking precedence once the API resolves.
3. Tighten the existing in-flight manual-order regression to assert the submitted state and absence of a response id before resolve.
4. Update UOLF documentation and canonical context.
5. Run focused and broader validation before commit.

## Acceptance Criteria
- In-flight manual-order submit renders `manualOrderActionStateSubmitted`.
- In-flight state does not show a fake order id.
- Resolved `OPEN` response still renders waiting-for-fill with the real order id.
- No API, DB, or order execution behavior changes.

## Definition of Done
- [x] In-flight submitted state is visible and tested.
- [x] Response-derived lifecycle state remains visible and tested.
- [x] Docs/context are synced.
- [x] Relevant validation passes.

## Validation Evidence
- Tests: `pnpm --filter web exec vitest run src/features/dashboard-home/components/HomeLiveWidgets.manual-order.test.tsx src/features/dashboard-home/components/RuntimeSidebarSection.test.tsx --run` (`19/19`), `pnpm --filter web run typecheck`, `pnpm --filter web run lint`, `pnpm i18n:audit:route-reachable:web` (`findings=0`), `pnpm run quality:guardrails`, `pnpm run build`.
- Manual checks: authenticated rendered `/dashboard` smoke on desktop and mobile.
- Screenshots/logs: `C:\Users\wrobl\AppData\Local\Temp\soar-v1ui25-smoke\dashboard-desktop.png`, `C:\Users\wrobl\AppData\Local\Temp\soar-v1ui25-smoke\dashboard-mobile.png`; no console warnings, console errors, or page errors.
- High-risk checks: display-only lifecycle state; no execution behavior changed.

## Architecture Evidence
- Architecture source reviewed: `docs/modules/web-dashboard-home.md`.
- Fits approved architecture: yes
- Mismatch discovered: yes, the first UOLF state was not operator-visible during request flight.
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: `docs/modules/web-dashboard-home.md`.

## UX/UI Evidence
- Design source type: approved_snapshot
- Design source reference: existing Dashboard Home manual-order panel.
- Canonical visual target: existing action-state block from `V1UI-23`.
- Fidelity target: structurally_faithful
- Stitch used: no
- Experience-quality bar reviewed: yes
- Visual-direction brief reviewed: not applicable
- Existing shared pattern reused: same action-state block and i18n keys as post-response lifecycle state.
- New shared pattern introduced: no
- Design-memory update required: no
- Required states: loading | success
- Responsive checks: desktop and mobile rendered `/dashboard` smoke passed.
- Accessibility checks: existing action-state block uses `aria-live="polite"`.
- Parity evidence: UOLF `order submitted` is now represented before backend response state arrives.

## Deployment / Ops Evidence
- Deploy impact: low
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no
- Rollback note: revert this Web-only commit.
- Observability or alerting impact: none

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: manual-order in-flight state used only a disabled button, not the UOLF action-state block.
- Gaps: `order submitted` was listed in docs but absent from Web during request flight.
- Inconsistencies: post-response states were explicit while pre-response state was implicit.
- Architecture constraints: keep the existing endpoint and lifecycle model.

### 2. Select One Priority Task
- Selected task: `V1UI-25`.
- Priority rationale: TESTER-mode review found a lifecycle visibility gap in a money-impacting action.
- Why other candidates were deferred: this is the smallest verified UOLF gap.

### 3. Plan Implementation
- Files or surfaces to modify: presenter, focused component test, docs/context.
- Logic: `isSubmittingManualOrder && !manualOrderLastResponse` maps to submitted state with no order id.
- Edge cases: once a response exists, response state wins; blocked/pre-submit states remain hidden.

### 4. Execute Implementation
- Implementation notes: UI presenter only; no API or hook state changes required.

### 5. Verify and Test
- Validation performed: focused manual-order and sidebar tests.
- Result: PASS, including focused manual-order/sidebar tests (`19/19`), Web typecheck, Web lint, route-reachable i18n audit (`findings=0`), repository guardrails, full workspace build, and authenticated rendered `/dashboard` desktop/mobile smoke with no console warnings, console errors, or page errors.

### 6. Self-Review
- Simpler option considered: relying on the `Opening...` button; rejected because UOLF requires lifecycle state clarity.
- Technical debt introduced: no
- Scalability assessment: same action-state mapping can accommodate future lifecycle response fields.
- Refinements made: test asserts no fake id is shown before response.

### 7. Update Documentation and Knowledge
- Docs updated: this task report plus module/context docs.
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
- Loading state verified: yes
- Error state verified: unchanged
- Refresh/restart behavior verified: response state still replaces submitted state after resolve
- Regression check performed: focused component test

## Security / Privacy Evidence
- `docs/security/secure-development-lifecycle.md` reviewed: yes
- Data classification: authenticated runtime action state
- Trust boundaries: no new data crossing; UI uses local request state until authenticated API response arrives.
- Permission or ownership checks: unchanged API authorization path.
- Abuse cases: no fake order id is displayed before backend persistence.
- Secret handling: none
- Security tests or scans: focused test only
- Fail-closed behavior: failed requests still use existing error path and clear submitting state.
- Residual risk: browser smoke covers dashboard load and console/page health, but not a real manual-order click against a funded LIVE account.

## Result Report
- Task summary: Dashboard manual-order panel now shows submitted action state while a request is in flight.
- Files changed: see Scope.
- How tested: focused manual-order/sidebar tests (`19/19`), Web typecheck, Web lint, route-reachable i18n audit (`findings=0`), repository guardrails, full workspace build, and rendered `/dashboard` desktop/mobile smoke.
- What is incomplete: nothing known for this slice.
- Next steps: continue the next smallest backend-to-Web parity review.
- Decisions made: submitted state is UI request state only and intentionally has no order id before backend response.
