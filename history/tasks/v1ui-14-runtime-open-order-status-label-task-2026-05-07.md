# Task

## Header
- ID: V1UI-14
- Title: Runtime Open Order Status Labels
- Task Type: fix
- Current Stage: release
- Status: DONE
- Owner: Frontend Builder
- Depends on: V1UI-13
- Priority: P1
- Iteration: 14
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
Dashboard open orders already translate backend statuses such as `OPEN` into operator lifecycle language such as "Waiting for fill". Bot monitoring open orders rendered raw backend status codes, creating a small runtime order parity gap.

## Goal
Render runtime open-order status lifecycle labels consistently across dashboard home and bot monitoring while preserving route-owned i18n namespaces.

## Scope
- `apps/web/src/features/shared/runtimeMonitoringFormatters.ts`
- `apps/web/src/features/dashboard-home/components/home-live-widgets/runtimeDataTablePresenters.tsx`
- `apps/web/src/features/bots/components/bots-management/BotsMonitoringTab.tsx`
- `apps/web/src/features/bots/components/BotsManagement.test.tsx`
- `apps/web/src/i18n/namespaces/dashboard-bots.*.ts`
- Source-of-truth docs and context files for this iteration.

## Success Signal
- User or operator problem: bot monitoring should not require operators to interpret raw order status codes during runtime supervision.
- Expected product or reliability outcome: open-order lifecycle status is explicit on both primary and detailed runtime surfaces.
- How success will be observed: focused tests assert shared status suffix mapping and bot monitoring rendering for `OPEN -> Waiting for fill`.
- Post-launch learning needed: no

## Deliverable For This Stage
Implement and verify one UI/runtime parity slice for open-order status labels.

## Constraints
- Reuse existing runtime formatter ownership.
- Keep dashboard and bots route text in their own namespaces.
- Do not change backend API contracts or command behavior.
- Unknown statuses must remain visible rather than being hidden.

## Implementation Plan
1. Add shared open-order status label suffix mapping.
2. Reuse that helper in dashboard open-order presenter.
3. Render bot monitoring open-order statuses through bot-owned labels.
4. Add bot monitoring i18n labels in all supported route locales.
5. Add focused tests and update source-of-truth docs.

## Acceptance Criteria
- `PENDING` and `OPEN` map to waiting-for-fill lifecycle wording.
- `PARTIALLY_FILLED` and `FILLED` map to explicit lifecycle labels.
- Unknown statuses remain visible as raw backend values.
- Focused web tests, typecheck, lint, i18n audit, guardrails, build, and rendered route smoke pass.

## Definition of Done
- [x] Implementation is complete.
- [x] Tests cover shared mapping and bot monitoring rendering.
- [x] Relevant docs and context are updated.
- [x] No architecture mismatch or workaround is introduced.

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
- Tests: `pnpm --filter web run test -- src/features/shared/runtimeMonitoringFormatters.test.ts src/features/dashboard-home/components/home-live-widgets/runtimeDataTablePresenters.test.tsx src/features/bots/components/BotsManagement.test.tsx --run` => `29/29 PASS`; `pnpm --filter web run typecheck` => PASS; `pnpm --filter web run lint` => PASS; `pnpm i18n:audit:route-reachable:web` => PASS (`findings=0`); `pnpm run quality:guardrails` => PASS; `pnpm --filter web run build` => PASS.
- Manual checks: authenticated rendered `/dashboard/bots` route smoke loaded the expected route with no console errors using local API + web.
- Screenshots/logs: `C:\Users\wrobl\AppData\Local\Temp\soar-v1ui14-dashboard-bots.png`.
- High-risk checks: unknown order statuses remain raw and visible; no command or backend path changed.

## Architecture Evidence
- Architecture source reviewed: `docs/architecture/reference/live-runtime-lifecycle-parity-contract.md`, `docs/architecture/08_operator-surfaces-and-routing.md`, `docs/modules/web-dashboard-home.md`, `docs/modules/web-bots.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: module docs/context after verification

## UX/UI Evidence
- Design source type: approved_snapshot
- Design source reference: existing dashboard open-orders lifecycle status labels
- Canonical visual target: route-owned runtime table labels
- Fidelity target: structurally_faithful
- Stitch used: no
- Experience-quality bar reviewed: yes
- Visual-direction brief reviewed: not applicable
- Existing shared pattern reused: shared runtime formatter suffix helpers
- New shared pattern introduced: no
- Design-memory entry reused: runtime table parity
- Design-memory update required: no
- Visual gap audit completed: yes
- Background or decorative asset strategy: not applicable
- Canonical asset extraction required: no
- Screenshot comparison pass completed: yes
- Remaining mismatches: no seeded local runtime open-order row for rendered screenshot; component test covers row-level status label parity.
- Required states: success, empty
- Responsive checks: desktop
- Input-mode checks: pointer
- Accessibility checks: table status remains text-visible under explicit header
- Parity evidence: pending

## Deployment / Ops Evidence
- Deploy impact: low
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: not required
- Rollback note: revert the UI/helper commit
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: bot monitoring open orders rendered raw `status` while dashboard rendered lifecycle labels.
- Gaps: detailed runtime order surface was less operator-readable than primary dashboard surface.
- Inconsistencies: open-order status mapping lived only in dashboard presenter.
- Architecture constraints: route-owned labels, shared runtime formatter semantics, unknown statuses remain visible.

### 2. Select One Priority Task
- Selected task: V1UI-14 Runtime Open Order Status Labels
- Priority rationale: small backend-to-Web runtime order parity gap on a money-impacting surface.
- Why other candidates were deferred: broader runtime/order UX work remains larger than one safe iteration.

### 3. Plan Implementation
- Files or surfaces to modify: shared formatter, dashboard presenter, bot monitoring table, bot i18n, tests, docs.
- Logic: map known active lifecycle statuses to shared suffixes; return raw values for unknown statuses.
- Edge cases: lowercase/mixed status strings normalize; unknown/null fallback stays explicit.

### 4. Execute Implementation
- Implementation notes: added `runtimeOpenOrderStatusLabelSuffix`, reused it in dashboard open-order labels, rendered bot monitoring open-order status through bot-owned lifecycle labels, and added EN/PL/PT/de-CH route labels.

### 5. Verify and Test
- Validation performed: focused tests, typecheck, lint, i18n route audit, guardrails, build, and rendered route smoke.
- Result: PASS

### 6. Self-Review
- Simpler option considered: bot-only status mapping; rejected to avoid drift from dashboard.
- Technical debt introduced: no
- Scalability assessment: shared status suffix helper can serve future runtime order surfaces.
- Refinements made: dashboard fallback behavior remains unchanged for unknown statuses.

### 7. Update Documentation and Knowledge
- Docs updated: `docs/modules/web-bots.md`, `docs/modules/web-dashboard-home.md`, `docs/planning/mvp-execution-plan.md`, `docs/planning/mvp-next-commits.md`.
- Context updated: `.codex/context/PROJECT_STATE.md`, `.codex/context/TASK_BOARD.md`.
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

## Notes
This is a display/parity change only. It does not alter order cancellation, lifecycle persistence, or API filtering.

## Production-Grade Required Contract

## Integration Evidence
- `INTEGRATION_CHECKLIST.md` reviewed: yes
- Real API/service path used: yes, existing runtime positions open-orders contract
- Endpoint and client contract match: yes
- DB schema and migrations verified: not applicable
- Loading state verified: not changed
- Error state verified: not changed
- Refresh/restart behavior verified: not changed
- Regression check performed: focused runtime formatter/dashboard/bot monitoring tests.

## Product / Discovery Evidence
- Problem validated: yes
- User or operator affected: runtime operator supervising active bot orders
- Existing workaround or pain: operator had to interpret raw backend status codes.
- Smallest useful slice: reuse lifecycle status labels in bot monitoring open orders.
- Success metric or signal: visible waiting-for-fill label and passing test.
- Feature flag, staged rollout, or disable path: not applicable
- Post-launch feedback or metric check: no

## Reliability / Observability Evidence
- `docs/operations/service-reliability-and-observability.md` reviewed: not applicable
- Critical user journey: supervise active bot runtime orders
- SLI: not applicable
- SLO: not applicable
- Error budget posture: not applicable
- Health/readiness check: not applicable
- Logs, dashboard, or alert route: not applicable
- Smoke command or manual smoke: authenticated rendered `/dashboard/bots` route smoke with local API/web and bundled Playwright.
- Rollback or disable path: revert commit

## Security / Privacy Evidence
- `docs/security/secure-development-lifecycle.md` reviewed: not applicable
- Data classification: operational trading metadata
- Trust boundaries: existing authenticated runtime API to web UI
- Permission or ownership checks: unchanged
- Abuse cases: unknown statuses must not be hidden by a generic normal label
- Secret handling: unchanged
- Security tests or scans: not applicable
- Fail-closed behavior: unknown statuses remain raw and visible
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
- Task summary: Runtime open-order status labels are now shared semantically across dashboard and bot monitoring, with bot monitoring using route-owned lifecycle text.
- Files changed: shared runtime formatter/tests, dashboard open-order presenter, bot monitoring table/test, bot i18n namespaces, and canonical docs/context.
- How tested: focused Web tests (`29/29`), Web typecheck, Web lint, route-reachable i18n audit, repository guardrails, Web build, rendered `/dashboard/bots` route smoke.
- What is incomplete: no seeded local runtime open-order row for rendered screenshot; component test covers row-level parity.
- Next steps: continue backend-to-web runtime parity discovery for remaining V1 gaps.
- Decisions made: unknown statuses remain raw and visible instead of being mapped to a misleading normal lifecycle label.
