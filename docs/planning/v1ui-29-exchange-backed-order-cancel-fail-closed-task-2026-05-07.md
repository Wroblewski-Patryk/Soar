# Task

## Header
- ID: V1UI-29
- Title: Fail closed for exchange-backed local order cancel
- Task Type: fix
- Current Stage: release
- Status: DONE
- Owner: Backend Builder
- Depends on: XADAPT-03, XADAPT-04, RUNTIME-AUDIT-74
- Priority: P0
- Iteration: 29
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
`docs/planning/xadapt-03-exchange-adapter-boundary-task-2026-04-25.md`
and `xadapt-04` keep `LIVE_ORDER_CANCEL` explicitly unsupported. Dashboard
Open Orders still rendered a local cancel affordance for rows with
`exchangeOrderId`, and the API cancel path could mark such rows locally
`CANCELED` without exchange-side confirmation.

## Goal
Keep exchange-backed open-order actions fail-closed across API and Web until a
canonical exchange-cancel boundary exists.

## Success Signal
- User or operator problem: a LIVE exchange-backed order must not look locally
  cancelable when the exchange-side action is unsupported.
- Expected product or reliability outcome: UI and API reflect the same
  unsupported capability truth.
- How success will be observed: API refuses local cancel/close mutation and Web
  renders an explicit blocked action state.
- Post-launch learning needed: no

## Deliverable For This Stage
Verified code and source-of-truth updates for the selected vertical slice.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within the declared current stage unless explicit approval changes it

## Definition of Done
- [x] API cancel refuses exchange-backed open orders with a clear unsupported
  capability error.
- [x] API close refuses exchange-backed open orders instead of marking them
  filled locally.
- [x] Dashboard Open Orders renders unsupported-cancel state instead of a local
  cancel button for rows carrying `exchangeOrderId`.

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
  - PASS `pnpm.cmd --filter api exec vitest run src/modules/orders/orders.service.test.ts --run` (`38/38`)
  - PASS `pnpm.cmd --filter web exec vitest run src/features/dashboard-home/components/home-live-widgets/runtimeDataTablePresenters.test.tsx --run` (`15/15`)
- Typecheck:
  - PASS `pnpm.cmd --filter api run typecheck`
  - PASS `pnpm.cmd --filter web run typecheck`
- Lint:
  - PASS `pnpm.cmd --filter web run lint`
- Repository gates:
  - PASS `pnpm.cmd i18n:audit:route-reachable:web` (`findings=0`)
  - PASS `pnpm.cmd run quality:guardrails`
  - PASS `pnpm.cmd run build`
- Manual checks:
  - PASS authenticated rendered `/dashboard` smoke through real API session
    cookie using bundled Codex Node `v24.14.0` plus Playwright.
- Screenshots/logs:
  - Desktop: `C:\Users\wrobl\AppData\Local\Temp\soar-v1ui29-smoke\dashboard-desktop.png`
  - Mobile: `C:\Users\wrobl\AppData\Local\Temp\soar-v1ui29-smoke\dashboard-mobile.png`
  - Smoke result: `C:\Users\wrobl\AppData\Local\Temp\soar-v1ui29-smoke\smoke-result.json`
  - Browser plugin note: attempted first, but local `node_repl` resolved
    Node `v22.13.0` and requires `>=22.22.0`; fallback used bundled Node.
  - Result: no console errors, no page errors, no 5xx responses.
- High-risk checks: exchange-backed cancel/close now fail closed before DB
  mutation.

## Architecture Evidence
- Architecture source reviewed:
  - `docs/planning/xadapt-03-exchange-adapter-boundary-task-2026-04-25.md`
  - `docs/planning/xadapt-04-binance-adapter-contract-tests-task-2026-04-25.md`
  - `docs/modules/api-orders.md`
  - `docs/modules/web-dashboard-home.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: API/Web module notes updated.

## UX/UI Evidence
- Design source type: approved_snapshot
- Design source reference: existing Dashboard Home runtime table pattern
- Canonical visual target: existing compact runtime action column
- Fidelity target: structurally_faithful
- Stitch used: no
- Experience-quality bar reviewed: yes
- Visual-direction brief reviewed: not applicable
- Existing shared pattern reused: table action/blocked text in existing runtime table
- New shared pattern introduced: no
- Design-memory entry reused: not applicable
- Design-memory update required: no
- Visual gap audit completed: yes
- Background or decorative asset strategy: not applicable
- Canonical asset extraction required: no
- Screenshot comparison pass completed: yes
- Remaining mismatches: none known
- Required states: success, error
- Responsive checks: desktop, mobile passed
- Input-mode checks: pointer, keyboard by native button removal
- Accessibility checks: unsupported state is text-visible; no inactive button
  remains in the tab/action target.
- Parity evidence: Web no longer exposes an action that API rejects.

## Deployment / Ops Evidence
- Deploy impact: low
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no
- Rollback note: revert this commit to restore previous local cancel behavior.
- Observability or alerting impact: API returns explicit unsupported capability
  error for direct requests.
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: Web open-order action column showed local cancel affordance for
  exchange-backed rows.
- Gaps: API cancel could locally mark exchange-backed rows canceled despite
  `LIVE_ORDER_CANCEL` being unsupported.
- Inconsistencies: exchange boundary truth and operator-facing Web action
  affordance did not match.
- Architecture constraints: do not introduce exchange-cancel support in this
  slice; unsupported capability families must fail closed.

### 2. Select One Priority Task
- Selected task: `V1UI-29 fix(runtime-orders): fail closed for exchange-backed local cancel`.
- Priority rationale: money-impacting LIVE order state must not be mutated
  locally as if an exchange-side cancel happened.
- Why other candidates were deferred: production readback tasks require
  authenticated production evidence; this local safety mismatch was executable
  and higher risk than display polish.

### 3. Plan Implementation
- Files or surfaces to modify:
  - `apps/api/src/modules/orders/orders.service.ts`
  - `apps/api/src/modules/orders/orders.errors.ts`
  - `apps/api/src/modules/orders/orders.controller.ts`
  - `apps/api/src/modules/orders/orders.service.test.ts`
  - `apps/web/src/features/dashboard-home/components/HomeLiveWidgets.tsx`
  - `apps/web/src/features/dashboard-home/components/home-live-widgets/runtimeDataTablePresenters.tsx`
  - dashboard-home i18n namespaces and translation type
  - source-of-truth docs
- Logic: detect `exchangeOrderId` as exchange-backed order truth; refuse local
  cancel/close mutation; render unsupported state instead of cancel button.
- Edge cases: terminal/non-sync checks stay unchanged; local/PAPER non-exchange
  open orders remain cancelable.

### 4. Execute Implementation
- Implementation notes: added API unsupported cancel error, fail-closed close
  guard, Web unsupported label, and focused regressions.

### 5. Verify and Test
- Validation performed: focused API orders and Web runtime presenter tests.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: Web-only hide. Rejected because direct API would
  still allow unsafe local mutation.
- Technical debt introduced: no
- Scalability assessment: compatible with future exchange-cancel support; when
  the boundary adds real support this guard can move to a capability call.
- Refinements made: aligned an existing PAPER test fixture to current
  bot-scoped `walletId=null` position contract so the touched API suite is
  meaningful again.

### 7. Update Documentation and Knowledge
- Docs updated: this task file, `docs/modules/api-orders.md`,
  `docs/modules/web-dashboard-home.md`.
- Context updated: yes.
- Learning journal updated: yes, added Windows Browser plugin Node fallback
  guardrail after the same `node_repl` version gate recurred.

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

## Notes
This task does not add exchange-side cancel support. It only prevents the UI
and API from presenting or applying local state changes as a substitute for
that missing capability.

## Production-Grade Required Contract
- Goal: keep exchange-backed order actions fail-closed until real exchange
  cancel support exists.
- Scope: API orders service/controller/errors/tests, Dashboard Home Open
  Orders action presenter, dashboard-home i18n, API/Web module docs.
- Implementation Plan: add fail-closed guards, adjust Web action state, add
  focused regressions, run relevant gates, update source of truth.
- Acceptance Criteria: API refuses exchange-backed cancel/close; Web does not
  show cancel button; focused API/Web tests pass.
- Definition of Done: see above.
- Result Report: API and Web now share the same unsupported exchange-cancel
  truth. Exchange-backed open orders cannot be locally canceled or locally
  marked filled through direct API calls, and Dashboard Home no longer renders
  the local cancel button for those rows. Focused tests, typechecks, lint,
  guardrails, i18n audit, full build, and rendered dashboard smoke passed.

## Integration Evidence
- `INTEGRATION_CHECKLIST.md` reviewed: yes
- Real API/service path used: yes
- Endpoint and client contract match: yes
- DB schema and migrations verified: yes, no schema change
- Loading state verified: not applicable
- Error state verified: API unsupported error, Web blocked state
- Refresh/restart behavior verified: authenticated dashboard reload passed on
  mobile viewport during rendered smoke.
- Regression check performed: focused API/Web tests

## Security / Privacy Evidence
- `docs/security/secure-development-lifecycle.md` reviewed: not applicable
- Data classification: order identifiers and runtime state, no secrets
- Trust boundaries: Web cannot infer unsupported exchange mutation support;
  API remains authoritative.
- Permission or ownership checks: existing user/order ownership preserved.
- Abuse cases: direct API request cannot locally cancel exchange-backed order.
- Secret handling: unchanged
- Security tests or scans: focused API fail-closed regressions
- Fail-closed behavior: yes
- Residual risk: real exchange-cancel support remains out of scope.
