# Task

## Header
- ID: V1-DASHBOARD-CRYPTO-ICONS-REGRESSION-2026-05-07
- Title: Restore dashboard crypto icon recovery
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Frontend Builder
- Depends on: none
- Priority: P1
- Iteration: 2026-05-07 dashboard runtime regression slice
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
Operator reported that cryptocurrency icons disappeared from the dashboard.
The architecture-approved icon module resolves symbols through the existing
`/dashboard/icons/lookup` path and the dashboard renders those results through
the shared `AssetSymbol` component.

## Goal
Restore icon rendering recovery when the dashboard receives a new symbol or
icon URL after a prior image load failure.

## Scope
- `apps/web/src/ui/components/AssetSymbol.tsx`
- `apps/web/src/ui/components/AssetSymbol.test.tsx`
- Canonical queue/context files required by repository workflow.

## Success Signal
- User or operator problem: dashboard asset rows no longer stay stuck on
  fallback letters after a previous icon load error.
- Expected product or reliability outcome: asynchronous icon lookup and row
  reuse recover to image rendering when a valid URL arrives.
- How success will be observed: focused regression test proves recovery.
- Post-launch learning needed: no

## Deliverable For This Stage
Code fix, focused regression coverage, validation evidence, and queue/context
sync for this single UI regression.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within the declared current stage unless explicit approval changes it

## Implementation Plan
1. Add a focused regression test for image failure followed by symbol/URL
   change.
2. Reset `AssetSymbol` image failure state when the normalized symbol or icon
   URL changes.
3. Run focused Web tests, typecheck, guardrails, docs parity, and diff check.
4. Update task board and project state with evidence.

## Acceptance Criteria
- [x] `AssetSymbol` renders the new image after a previous `img` error when
  `iconUrl` or `symbol` changes.
- [x] Existing loading, success, and error fallback behavior remains intact.
- [x] Focused Web test suite passes.

## Definition of Done
- [x] The implementation reuses the existing icon lookup/rendering system.
- [x] Focused regression coverage is ready to commit.
- [x] Relevant validation commands pass.
- [x] Canonical task/context docs are updated.

## Forbidden
- new icon providers or parallel icon lookup paths
- hardcoded dashboard-only icon overrides
- temporary bypasses or mocked production behavior
- architecture changes without explicit approval

## Validation Evidence
- Tests:
  - Pre-fix regression: `pnpm --filter web exec vitest run src/ui/components/AssetSymbol.test.tsx` failed because `ETHUSDT icon` did not render after the prior `BTCUSDT` image error.
  - Post-fix focused component: `pnpm --filter web exec vitest run src/ui/components/AssetSymbol.test.tsx` PASS, `4/4`.
  - Post-fix dashboard pack: `pnpm --filter web exec vitest run src/features/dashboard-home/components/HomeLiveWidgets.test.tsx src/features/dashboard-home/components/HomeLiveWidgets.open-orders-source.test.tsx src/ui/components/AssetSymbol.test.tsx` PASS, `25/25`.
- Manual checks: code review of existing dashboard icon flow through `useCoinIconLookup`, `HomeLiveWidgets`, and shared `AssetSymbol`.
- Screenshots/logs: not applicable for this focused component regression
- High-risk checks: no API, DB, exchange, deployment, or live-money path

## Architecture Evidence
- Architecture source reviewed: `docs/modules/api-icons.md`,
  `docs/architecture/08_operator-surfaces-and-routing.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: none

## UX/UI Evidence
- Design source type: approved_snapshot
- Design source reference: `docs/ux/dashboard-design-system.md`
- Canonical visual target: dashboard tables and runtime widgets show asset
  identity with icon plus symbol label.
- Fidelity target: structurally_faithful
- Stitch used: no
- Experience-quality bar reviewed: yes
- Visual-direction brief reviewed: no
- Existing shared pattern reused: `AssetSymbol`
- New shared pattern introduced: no
- Design-memory update required: no
- Required states: loading | error | success
- Responsive checks: not applicable to this component-state regression
- Accessibility checks: icon image retains symbol-specific alt text
- Parity evidence: focused regression test covers the recovered success state

## Deployment / Ops Evidence
- Deploy impact: low
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no
- Rollback note: revert this commit to restore previous component behavior
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: `AssetSymbol` keeps `imageFailed=true` after an image load error.
- Gaps: no regression test proved recovery when a new icon URL arrives.
- Inconsistencies: the API can resolve icons asynchronously, but the component
  could stay in fallback state after prior failure.
- Architecture constraints: keep the existing icon lookup contract and shared
  renderer.

### 2. Select One Priority Task
- Selected task: restore dashboard crypto icon recovery.
- Priority rationale: direct operator-reported dashboard regression.
- Why other candidates were deferred: bot live-import production evidence
  still requires protected auth; this UI regression is locally actionable.

### 3. Plan Implementation
- Files or surfaces to modify: `AssetSymbol` and focused test.
- Logic: reset failed-image state on symbol or icon URL change.
- Edge cases: preserve fallback when the current image actually fails.

### 4. Execute Implementation
- Implementation notes: added a focused regression and reset image failure
  state when `iconUrl` or normalized symbol changes.

### 5. Verify and Test
- Validation performed: focused pre-fix failure, focused post-fix component
  test, dashboard widget pack, Web typecheck, Web lint, repository guardrails,
  docs parity, and diff check.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: no new lookup path; component state recovery is
  the narrow cause.
- Technical debt introduced: no
- Scalability assessment: component-level fix covers all current consumers.
- Refinements made: kept the fix inside the shared renderer instead of adding
  dashboard-only icon behavior.

### 7. Update Documentation and Knowledge
- Docs updated: this task, `TASK_BOARD`, `PROJECT_STATE`,
  `mvp-next-commits`, and `system-health`.
- Context updated: yes
- Learning journal updated: not applicable

## Review Checklist
- [x] Process self-audit completed before implementation.
- [x] Autonomous loop evidence covers all seven steps.
- [x] Exactly one priority task was selected in this iteration.
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

## Result Report

- Task summary: fixed dashboard crypto icon recovery by resetting stale image
  error state when the rendered asset changes.
- Files changed: `apps/web/src/ui/components/AssetSymbol.tsx`,
  `apps/web/src/ui/components/AssetSymbol.test.tsx`,
  `.codex/context/PROJECT_STATE.md`, `.codex/context/TASK_BOARD.md`,
  `.agents/state/system-health.md`, `docs/planning/mvp-next-commits.md`, and
  this task file.
- How tested: focused regression failed before the fix; post-fix component and
  dashboard widget suites passed; Web typecheck, Web lint, guardrails, docs
  parity, and diff check passed.
- What is incomplete: rendered browser smoke was not run for this narrow
  component state fix; production still requires Coolify/manual deployment.
- Next steps: continue with bot live-import/runtime production evidence once
  protected auth/access is available, and otherwise keep closing local
  operator-reported V1 regressions one at a time.
- Decisions made: reuse the approved shared icon renderer and lookup path; no
  new icon system or dashboard-only override.
