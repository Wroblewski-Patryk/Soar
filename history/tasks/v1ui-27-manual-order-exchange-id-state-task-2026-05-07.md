# Task

## Header
- ID: V1UI-27
- Title: Show manual-order exchange id in lifecycle state
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Frontend Builder
- Depends on: V1UI-23, V1UI-26
- Priority: P1
- Iteration: 27
- Operation Mode: ARCHITECT

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
`POST /dashboard/orders/open` returns the persisted order row, including `exchangeOrderId` for LIVE exchange-backed submissions. Dashboard Home retained the response for lifecycle state, but the Web response type and action-state panel only exposed the local order id.

## Goal
Expose exchange-backed manual-order lifecycle truth in the Dashboard Home manual-order panel by typing and rendering `exchangeOrderId` from the backend response.

## Success Signal
- User or operator problem: after a LIVE manual order submit, the panel no longer hides the exchange-side order identity.
- Expected product or reliability outcome: manual-order lifecycle state clearly distinguishes local submitted/waiting state from exchange-backed open-order truth.
- How success will be observed: focused regressions assert imported-open-order state and visible Exchange ID.
- Post-launch learning needed: no

## Scope
- `apps/web/src/features/bots/types/bot.type.ts`
- `apps/web/src/features/dashboard-home/components/home-live-widgets/runtimeSidebarPresenters.ts`
- `apps/web/src/features/dashboard-home/components/home-live-widgets/RuntimeSidebarSection.tsx`
- `apps/web/src/features/dashboard-home/components/HomeLiveWidgets.manual-order.test.tsx`
- `apps/web/src/features/dashboard-home/components/RuntimeSidebarSection.test.tsx`
- `docs/modules/web-dashboard-home.md`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`
- `docs/planning/mvp-next-commits.md`

## Implementation Plan
1. Add optional `exchangeOrderId` to `DashboardManualOrderResponse`.
2. Extend the manual-order action-state presenter with `actionStateExchangeOrderId`.
3. Render Exchange ID in the `aria-live` action-state block when present.
4. Map `OPEN` response with exchange id to the existing imported-open-order lifecycle copy.
5. Add focused tests for presenter-integrated manual-order flow and sidebar rendering.
6. Run broader Web/repo validation plus rendered dashboard smoke.

## Acceptance Criteria
- Manual-order response type includes optional `exchangeOrderId`.
- Manual-order action-state block shows Exchange ID when backend response includes it.
- `OPEN` exchange-backed response uses imported-open-order state copy.
- In-flight submitted state still shows no fake exchange id.
- No API, DB, or order execution behavior changes.

## Definition of Done
- [x] Exchange ID is visible and tested in manual-order action state.
- [x] In-flight state still avoids fake ids.
- [x] Docs/context are synced.
- [x] Relevant validation passes.

## Validation Evidence
- Tests: `pnpm --filter web exec vitest run src/features/dashboard-home/components/HomeLiveWidgets.manual-order.test.tsx src/features/dashboard-home/components/RuntimeSidebarSection.test.tsx --run` (`20/20`), `pnpm --filter web run typecheck`, `pnpm --filter web run lint`, `pnpm i18n:audit:route-reachable:web` (`findings=0`), `pnpm run quality:guardrails`, `pnpm run build`.
- Manual checks: authenticated rendered `/dashboard` smoke on desktop and mobile.
- Screenshots/logs: `C:\Users\wrobl\AppData\Local\Temp\soar-v1ui27-smoke\dashboard-desktop.png`, `C:\Users\wrobl\AppData\Local\Temp\soar-v1ui27-smoke\dashboard-mobile.png`; no console warnings, console errors, or page errors.
- High-risk checks: display-only lifecycle response rendering; no execution behavior changed.

## Architecture Evidence
- Architecture source reviewed: `docs/modules/api-orders.md`, `docs/modules/web-dashboard-home.md`, `docs/architecture/04_runtime-contexts.md`, `docs/architecture/08_operator-surfaces-and-routing.md`.
- Fits approved architecture: yes
- Mismatch discovered: yes, backend manual-order exchange identity was not represented in the Web lifecycle panel.
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: `docs/modules/web-dashboard-home.md`.

## UX/UI Evidence
- Design source type: approved_snapshot
- Design source reference: existing Dashboard Home manual-order action-state block.
- Canonical visual target: existing `aria-live` action-state panel.
- Fidelity target: structurally_faithful
- Stitch used: no
- Experience-quality bar reviewed: yes
- Visual-direction brief reviewed: not applicable
- Existing shared pattern reused: same manual-order action-state block and existing `exchangeOrderId` label.
- New shared pattern introduced: no
- Design-memory update required: no
- Required states: loading | success
- Responsive checks: desktop and mobile rendered `/dashboard` smoke passed.
- Accessibility checks: action-state block keeps `aria-live="polite"`.
- Parity evidence: backend `exchangeOrderId` from manual-order response is now typed and rendered.

## Deployment / Ops Evidence
- Deploy impact: low
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no
- Rollback note: revert this Web-only commit.
- Observability or alerting impact: none

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: Web typed `DashboardManualOrderResponse` as only `id/status/positionId`.
- Gaps: LIVE exchange-backed manual order response `exchangeOrderId` was hidden in the action-state panel.
- Inconsistencies: Open Orders table now showed exchange identity, but the immediate manual-order lifecycle panel did not.
- Architecture constraints: keep `POST /dashboard/orders/open` as the canonical command and only render backend response truth.

### 2. Select One Priority Task
- Selected task: `V1UI-27`.
- Priority rationale: ARCHITECT-mode review found a response-contract mismatch in a money-impacting manual order flow.
- Why other candidates were deferred: production readback tasks need protected auth evidence; this is the smallest local contract-alignment slice.

### 3. Plan Implementation
- Files or surfaces to modify: shared Web order type, manual-order presenter/render, focused tests, docs/context.
- Logic: response `OPEN + exchangeOrderId` maps to imported-open-order lifecycle copy and renders exchange id beside local order id.
- Edge cases: in-flight state has no exchange id; missing response exchange id stays hidden.

### 4. Execute Implementation
- Implementation notes: display-only Web response handling; no API or command path changes.

### 5. Verify and Test
- Validation performed: focused manual-order/sidebar tests.
- Result: PASS, including focused manual-order/sidebar tests (`20/20`), Web typecheck, Web lint, route-reachable i18n audit (`findings=0`), repository guardrails, full workspace build, and authenticated rendered `/dashboard` desktop/mobile smoke with no console warnings, console errors, or page errors.

### 6. Self-Review
- Simpler option considered: only showing local order id; rejected because the backend response already carries exchange identity and V1UI-26 made that truth visible in Open Orders.
- Technical debt introduced: no
- Scalability assessment: action-state now has separate local and exchange id fields for future lifecycle states.
- Refinements made: `OPEN` exchange-backed response uses existing imported-open-order localized copy.

### 7. Update Documentation and Knowledge
- Docs updated: this task report plus module/context docs.
- Context updated: yes
- Learning journal updated: not applicable.

## Review Checklist
- [x] Process self-audit completed before implementation.
- [x] Autonomous loop evidence covers all seven steps.
- [x] Exactly one priority task was selected in this iteration.
- [x] Operation mode was selected according to iteration rotation.
- [x] Current stage is declared and respected.
- [x] Architecture alignment confirmed.
- [x] Existing systems were reused where applicable.
- [x] No workaround paths were introduced.
- [x] No logic duplication was introduced.
- [x] Definition of Done evidence is attached.
- [x] Relevant validations were run.
- [x] Docs or context were updated.

## Integration Evidence
- `INTEGRATION_CHECKLIST.md` reviewed: yes
- Real API/service path used: yes, existing `POST /dashboard/orders/open` response.
- Endpoint and client contract match: yes
- DB schema and migrations verified: not applicable
- Loading state verified: yes
- Error state verified: unchanged
- Refresh/restart behavior verified: rendered dashboard smoke passed after dev-server start
- Regression check performed: focused Web tests

## Security / Privacy Evidence
- `docs/security/secure-development-lifecycle.md` reviewed: yes
- Data classification: authenticated runtime order metadata
- Trust boundaries: existing protected manual-order API to authenticated Web.
- Permission or ownership checks: unchanged API authorization path.
- Abuse cases: in-flight state still avoids fake ids; missing exchange id stays hidden.
- Secret handling: none
- Security tests or scans: focused tests only
- Fail-closed behavior: failed requests still use existing error path.
- Residual risk: real exchange correlation still requires authenticated production evidence.

## Result Report
- Task summary: Dashboard Home manual-order action state now shows backend `exchangeOrderId` when present.
- Files changed: see Scope.
- How tested: focused manual-order/sidebar tests (`20/20`), Web typecheck, Web lint, route-reachable i18n audit (`findings=0`), repository guardrails, full workspace build, and rendered `/dashboard` desktop/mobile smoke.
- What is incomplete: nothing known for this slice.
- Next steps: continue the next smallest backend-to-Web parity review.
- Decisions made: exchange id is displayed only when the backend response provides it.
