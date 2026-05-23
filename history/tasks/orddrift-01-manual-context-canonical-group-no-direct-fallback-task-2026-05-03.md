# Task

## Header
- ID: ORDDRIFT-01
- Title: Prevent manual-order strategy fallback when canonical group exists
- Task Type: fix
- Current Stage: release
- Status: DONE
- Owner: Backend Builder
- Depends on: RUNTIME-AUDIT-02
- Priority: P1
- Iteration: 20
- Operation Mode: TESTER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
Manual-order strategy context is symbol-scoped and must follow active
canonical bot market-group topology before legacy compatibility fields. A
selected bot with active canonical market groups must not use direct
`Bot.strategyId` / `Bot.symbolGroupId` as a hidden fallback for symbols outside
canonical scope.

## Goal
Make manual-order strategy resolution return unresolved strategy context when
active canonical groups exist but none match the requested symbol or strategy
link criteria, instead of falling through to stale direct/legacy strategy
projection.

## Scope
- `apps/api/src/modules/orders/orders.manualContext.service.ts`
- `apps/api/src/modules/orders/orders.service.test.ts`
- `docs/modules/api-orders.md`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`
- `docs/planning/mvp-next-commits.md`

## Success Signal
- User or operator problem: manual order preview/open can inherit stale
  leverage/orderType from direct bot projection after market reassignment.
- Expected product or reliability outcome: manual order context remains
  canonical and fail-closed when active canonical groups exist.
- How success will be observed: a request for a stale direct symbol returns
  neutral defaults (`MARKET`, `CROSSED`, `1x`) instead of the stale direct
  strategy settings.
- Post-launch learning needed: no

## Deliverable For This Stage
Release-ready fix, regression coverage, and source-of-truth updates.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within the declared current stage unless explicit approval changes it

## Implementation Plan
1. Audit manual-order strategy resolver fallback order.
2. Add an active canonical group guard before direct/legacy fallback.
3. Add regression for canonical group plus stale direct strategy/symbol.
4. Run focused and broader orders/manual-order validations.
5. Update module and planning docs.

## Acceptance Criteria
- Direct `Bot.strategyId` is not used when active canonical groups exist.
- Existing canonical exact-match behavior remains unchanged.
- Existing unresolved-context defaults remain available for operator preview.
- LIVE manual open remains fail-closed through existing unresolved-scope guard.

## Definition of Done
- [x] `DEFINITION_OF_DONE.md` satisfied for this scoped manual-order fix.
- [x] Regression coverage added.
- [x] Relevant validations pass.
- [x] Docs and context updated.

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
  - `pnpm --filter api test -- src/modules/orders/orders.service.test.ts --run --sequence.concurrent=false` PASS (`26/26`)
  - `pnpm --filter api test -- src/modules/orders/orders.service.test.ts src/modules/orders/orders-positions.e2e.test.ts src/modules/orders/orders.manual-paper-market.e2e.test.ts --run --sequence.concurrent=false` PASS (`49/49`)
  - `pnpm --filter api run typecheck` PASS
  - `pnpm run lint` PASS
  - `pnpm run quality:guardrails` PASS
  - `pnpm run docs:parity:check` PASS
- Manual checks:
  - Reviewed manual context preview/open strategy resolution path.
- Screenshots/logs:
  - Not applicable.
- High-risk checks:
  - Regression confirms stale direct strategy settings do not leak through
    when active canonical group exists.

## Architecture Evidence
- Architecture source reviewed:
  - `docs/architecture/04_runtime-contexts.md`
  - `docs/architecture/06_execution-lifecycle.md`
  - `docs/modules/api-orders.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: not applicable

## UX/UI Evidence
- Design source type: approved_snapshot
- Design source reference: dashboard manual-order context contract.
- Canonical visual target: manual order preview reflects canonical selected-bot
  scope.
- Fidelity target: structurally_faithful
- Stitch used: no
- Experience-quality bar reviewed: yes
- Visual-direction brief reviewed: not applicable
- Existing shared pattern reused: manual-order context API.
- New shared pattern introduced: no
- Design-memory entry reused: not applicable
- Design-memory update required: no
- Visual gap audit completed: yes
- Background or decorative asset strategy: not applicable
- Canonical asset extraction required: no
- Screenshot comparison pass completed: not applicable
- Remaining mismatches: none known.
- Required states: unresolved strategy context uses existing neutral defaults.
- Responsive checks: desktop | tablet | mobile unchanged.
- Input-mode checks: touch | pointer | keyboard unchanged.
- Accessibility checks: no DOM changes.
- Parity evidence: service and e2e orders packs pass.

## Deployment / Ops Evidence
- Deploy impact: low
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no
- Rollback note: revert this commit to restore direct strategy fallback under
  active canonical groups.
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: manual-order strategy resolver could fall through to direct bot
  strategy when canonical groups existed but did not match the symbol.
- Gaps: regression covered no-match defaults but not stale direct matching the
  requested symbol.
- Inconsistencies: runtime topology already forbids direct fallback when
  canonical group exists.
- Architecture constraints: canonical group/link topology is authoritative.

### 2. Select One Priority Task
- Selected task: `ORDDRIFT-01`.
- Priority rationale: manual order preview/open affects operator commands and
  LIVE safety.
- Why other candidates were deferred: positions/trades off-scope filtering was
  not changed because direct bot-owned rows may need to remain visible for risk
  and history.

### 3. Plan Implementation
- Files or surfaces to modify:
  - `orders.manualContext.service.ts`
  - `orders.service.test.ts`
- Logic: after active canonical groups are evaluated, return unresolved context
  before direct/legacy fallback.
- Edge cases: legacy fallback still works when no active canonical groups
  exist.

### 4. Execute Implementation
- Implementation notes: added one guard line in resolver and one regression.

### 5. Verify and Test
- Validation performed: focused orders service test and broader orders/manual
  pack.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: removing direct/legacy fallback entirely.
- Technical debt introduced: no.
- Scalability assessment: consistent with migration compatibility policy.
- Refinements made: retained neutral defaults for preview when strategy context
  is unresolved.

### 7. Update Documentation and Knowledge
- Docs updated:
  - `docs/modules/api-orders.md`
  - `docs/planning/mvp-next-commits.md`
  - this task evidence file
- Context updated:
  - `.codex/context/TASK_BOARD.md`
  - `.codex/context/PROJECT_STATE.md`
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
- [x] Docs or context were updated if repository truth changed.
- [x] Learning journal was updated if a recurring pitfall was confirmed.

## Notes
The task id filename uses `orddrift-01`; the header id remains the canonical
tracking id.

## Production-Grade Required Contract

## Integration Evidence
- `INTEGRATION_CHECKLIST.md` reviewed: yes
- Real API/service path used: yes
- Endpoint and client contract match: yes
- DB schema and migrations verified: yes
- Loading state verified: not applicable
- Error state verified: not applicable
- Refresh/restart behavior verified: yes
- Regression check performed: yes

## Product / Discovery Evidence
- Problem validated: yes
- User or operator affected: manual order operator.
- Existing workaround or pain: stale direct strategy could change leverage,
  margin mode, and order type preview.
- Smallest useful slice: active canonical group fallback guard.
- Success metric or signal: focused and broader tests pass.
- Feature flag, staged rollout, or disable path: not applicable
- Post-launch feedback or metric check: no

## Reliability / Observability Evidence
- `docs/operations/service-reliability-and-observability.md` reviewed: yes
- Critical user journey: manual order preview and open.
- SLI: manual-order context strategy attribution correctness.
- SLO: not formally defined for this read/command helper.
- Error budget posture: not applicable
- Health/readiness check: unchanged
- Logs, dashboard, or alert route: unchanged
- Smoke command or manual smoke: focused regression.
- Rollback or disable path: revert commit.

## AI Testing Evidence
- `AI_TESTING_PROTOCOL.md` reviewed: not applicable
- Memory consistency scenarios: not applicable
- Multi-step context scenarios: not applicable
- Adversarial or role-break scenarios: not applicable
- Prompt injection checks: not applicable
- Data leakage and unauthorized access checks: not applicable
- Result: not applicable

## Security / Privacy Evidence
- `docs/security/secure-development-lifecycle.md` reviewed: yes
- Data classification: user-owned bot/order metadata.
- Trust boundaries: authenticated dashboard API.
- Permission or ownership checks: unchanged.
- Abuse cases: no new write or privilege path.
- Secret handling: no secrets touched.
- Security tests or scans: existing orders ownership coverage retained in
  broader pack.
- Fail-closed behavior: selected-bot manual strategy context remains
  unresolved instead of using stale direct/legacy projection.
- Residual risk: none known for this scoped resolver fix.

## Result Report
- Task summary: manual-order strategy context now blocks direct/legacy fallback
  when active canonical groups exist but do not resolve the requested symbol.
- Files changed:
  - `apps/api/src/modules/orders/orders.manualContext.service.ts`
  - `apps/api/src/modules/orders/orders.service.test.ts`
  - `docs/modules/api-orders.md`
  - `.codex/context/TASK_BOARD.md`
  - `.codex/context/PROJECT_STATE.md`
  - `docs/planning/mvp-next-commits.md`
- How tested: focused and broader orders/manual-order packs.
- What is incomplete: production deployment/readback not performed in this
  slice.
- Next steps: continue one-slice runtime/dashboard drift audit.
- Decisions made: active canonical groups block direct/legacy manual strategy
  fallback even when the stale direct symbol matches the request.
