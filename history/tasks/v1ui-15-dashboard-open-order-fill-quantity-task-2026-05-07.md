# Task

## Header
- ID: V1UI-15
- Title: Dashboard Open Order Filled Quantity Parity
- Task Type: fix
- Current Stage: release
- Status: DONE
- Owner: QA/Test
- Depends on: V1UI-14
- Priority: P1
- Iteration: 15
- Operation Mode: TESTER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
`BotRuntimeOpenOrderItem` includes `filledQuantity`. Bot monitoring already rendered that field, but the primary dashboard Open Orders table only rendered total `quantity`, leaving partial-fill progress hidden on the main runtime surface.

## Goal
Render backend open-order filled quantity on `/dashboard` Open Orders so the primary operator surface reflects the same order-fill truth as detailed bot monitoring.

## Scope
- `apps/web/src/features/dashboard-home/components/home-live-widgets/runtimeDataTablePresenters.tsx`
- `apps/web/src/features/dashboard-home/components/home-live-widgets/runtimeDataTablePresenters.test.tsx`
- `apps/web/src/i18n/namespaces/dashboard-home.*.ts`
- `docs/modules/web-dashboard-home.md`
- Canonical context and planning queue files for this iteration.

## Success Signal
- User or operator problem: operators should not need to leave the primary dashboard to see whether an open order has already filled partially.
- Expected product or reliability outcome: dashboard and bot monitoring expose the same backend open-order quantity truth.
- How success will be observed: focused presenter test verifies `filledQuantity` is rendered independently from total `quantity`.
- Post-launch learning needed: no

## Deliverable For This Stage
Ship and verify one TESTER-mode backend-to-Web parity fix for dashboard open-order fill quantity.

## Constraints
- Reuse existing Open Orders DataTable presenter.
- Do not change backend API contracts, database schema, or order command behavior.
- Do not add new monitoring systems or workaround paths.
- Preserve route-owned i18n namespaces.

## Implementation Plan
1. Add a `filledQuantity` column to dashboard Open Orders.
2. Add dashboard runtime `filled` label in all supported route locales.
3. Add focused presenter regression coverage.
4. Update module docs and canonical context.
5. Run focused and relevant full validations plus rendered route smoke.

## Acceptance Criteria
- Dashboard Open Orders table renders both `quantity` and `filledQuantity`.
- Existing source/status/cancel semantics remain unchanged.
- Focused tests, typecheck, lint, i18n audit, guardrails, build, and rendered `/dashboard` smoke pass.

## Definition of Done
- [x] Implementation is complete.
- [x] Tests cover the exposed backend field.
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
- Tests: focused presenter test (`10/10`), dashboard open-order regression tests (`3/3`), Web typecheck, Web lint, route-reachable i18n audit (`findings=0`), repository guardrails, and full workspace build.
- Manual checks: authenticated rendered `/dashboard` smoke passed with no post-auth console or page errors.
- Screenshots/logs: `C:\Users\wrobl\AppData\Local\Temp\soar-v1ui15-dashboard.png`.
- High-risk checks: no live-money or order mutation executed.

## Architecture Evidence (required for architecture-impacting tasks)
- Architecture source reviewed: `docs/architecture/reference/live-runtime-lifecycle-parity-contract.md`, `docs/modules/web-dashboard-home.md`, `docs/modules/web-bots.md`.
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: dashboard module records filled quantity parity.

## UX/UI Evidence (required for UX tasks)
- Design source type: approved_snapshot
- Design source reference: existing dashboard Open Orders DataTable pattern.
- Canonical visual target: structurally faithful table-column parity with existing runtime tables.
- Fidelity target: structurally_faithful
- Stitch used: no
- Experience-quality bar reviewed: yes
- Visual-direction brief reviewed: yes
- Existing shared pattern reused: runtime DataTable presenter.
- New shared pattern introduced: no
- Design-memory entry reused: no new pattern
- Design-memory update required: no
- Visual gap audit completed: yes
- Background or decorative asset strategy: not applicable
- Canonical asset extraction required: no
- Screenshot comparison pass completed: yes
- Remaining mismatches: none known
- Required states: loading | empty | error | success
- Responsive checks: desktop rendered route smoke; table remains horizontally scrollable.
- Input-mode checks: pointer/keyboard unaffected.
- Accessibility checks: existing table semantics preserved.
- Parity evidence: dashboard now renders the same backend filled quantity field already visible in bot monitoring.

## Deployment / Ops Evidence (required for runtime or infra tasks)
- Deploy impact: low
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no
- Rollback note: revert the UI column and locale labels.
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: dashboard Open Orders hid `filledQuantity`.
- Gaps: bot monitoring showed partial fill quantity, dashboard did not.
- Inconsistencies: same backend payload field had different UI visibility across runtime surfaces.
- Architecture constraints: lifecycle/fill truth must stay visible and fail-closed.

### 2. Select One Priority Task
- Selected task: dashboard open-order filled quantity parity.
- Priority rationale: it exposes existing backend truth on the primary money-management surface.
- Why other candidates were deferred: updated-at and order-action changes were less clearly tied to a current architecture parity gap.

### 3. Plan Implementation
- Files or surfaces to modify: dashboard runtime presenter, locale namespaces, focused test, module/context docs.
- Logic: render `row.filledQuantity` as a sortable column beside total quantity.
- Edge cases: zero filled quantity remains visible as `0`; no synthetic fallback values.

### 4. Execute Implementation
- Implementation notes: used the existing DataTable column pattern and existing number formatter.

### 5. Verify and Test
- Validation performed: focused Web tests, Web typecheck, Web lint, route-reachable i18n audit, repository guardrails, full workspace build, and authenticated rendered dashboard smoke.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: combining quantity and filled in one cell; rejected to preserve sortable field visibility.
- Technical debt introduced: no
- Scalability assessment: additive column on existing presenter; no new abstraction needed.
- Refinements made: kept bot monitoring unchanged because it already rendered the backend field.

### 7. Update Documentation and Knowledge
- Docs updated: this task file and `docs/modules/web-dashboard-home.md`.
- Context updated: yes.
- Learning journal updated: not applicable.

## Review Checklist (mandatory)
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
This task is UI-only and read-only. It does not execute order mutations or require live exchange access.

## Production-Grade Required Contract
- Goal: expose existing backend filled quantity truth on dashboard Open Orders.
- Scope: listed above.
- Implementation Plan: listed above.
- Acceptance Criteria: listed above.
- Definition of Done: use `DEFINITION_OF_DONE.md` standards through focused tests, docs, and validation evidence.
- Result Report: dashboard Open Orders now renders backend `filledQuantity` beside `quantity`; validation passed.

## Integration Evidence
- `INTEGRATION_CHECKLIST.md` reviewed: yes
- Real API/service path used: yes, existing runtime open-order payload contract.
- Endpoint and client contract match: yes
- DB schema and migrations verified: not applicable
- Loading state verified: unchanged existing route state.
- Error state verified: unchanged existing route state.
- Refresh/restart behavior verified: authenticated rendered route smoke passed after local API/Web restart.
- Regression check performed: focused presenter and dashboard open-order tests.

## Product / Discovery Evidence
- Problem validated: yes
- User or operator affected: runtime operator reviewing open order state.
- Existing workaround or pain: operator had to use detailed bot monitoring to see partial fill quantity.
- Smallest useful slice: one dashboard column.
- Success metric or signal: focused presenter regression plus rendered dashboard smoke.
- Feature flag, staged rollout, or disable path: not applicable
- Post-launch feedback or metric check: no

## Reliability / Observability Evidence
- `docs/operations/service-reliability-and-observability.md` reviewed: not applicable
- Critical user journey: inspect runtime open orders on primary dashboard.
- SLI: not applicable
- SLO: not applicable
- Error budget posture: not applicable
- Health/readiness check: unchanged
- Logs, dashboard, or alert route: not applicable
- Smoke command or manual smoke: authenticated rendered `/dashboard` smoke via bundled Codex Node and Playwright.
- Rollback or disable path: revert UI column and labels.

## AI Testing Evidence (required for AI features)
- Not applicable.

## Security / Privacy Evidence
- `docs/security/secure-development-lifecycle.md` reviewed: yes
- Data classification: authenticated runtime trading state.
- Trust boundaries: existing authenticated dashboard runtime read path.
- Permission or ownership checks: unchanged existing API/client path.
- Abuse cases: no mutation path changed.
- Secret handling: none.
- Security tests or scans: no new secret/auth logic.
- Fail-closed behavior: no synthetic filled values introduced.
- Residual risk: low UI-only display risk.

- `AI_TESTING_PROTOCOL.md` reviewed: not applicable
- Memory consistency scenarios: not applicable
- Multi-step context scenarios: not applicable
