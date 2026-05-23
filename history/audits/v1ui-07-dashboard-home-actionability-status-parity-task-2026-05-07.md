# V1UI-07 Dashboard Home Actionability Status Web Parity

## Header
- ID: V1UI-07
- Title: fix(web-runtime): show actionability details in dashboard open positions
- Task Type: fix
- Current Stage: release
- Status: DONE
- Owner: Frontend Builder
- Depends on: V1UI-06
- Priority: P1
- Iteration: 7
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
The bot monitoring route now exposes backend continuity, actionability, and
strategy-context truth for open runtime positions. Dashboard home already
renders continuity state and disables actions when `actionable=false`, but the
main operator surface does not show the same action-blocked and unresolved
strategy-context details in the status cell.

## Goal
Make dashboard home open-position status reflect the same backend
actionability diagnostics as bot monitoring without changing any runtime
command behavior.

## Scope
- `apps/web/src/features/dashboard-home/components/home-live-widgets/runtimeDataTablePresenters.tsx`
- `apps/web/src/features/dashboard-home/components/HomeLiveWidgets.test.tsx`
- `apps/web/src/i18n/namespaces/dashboard-home.{en,pl,pt,de-CH}.ts`
- planning/context/module docs

## Success Signal
- User or operator problem: blocked LIVE rows on dashboard home can look less
  explicit than the detailed bot monitoring route.
- Expected product or reliability outcome: dashboard home tells operators when
  position actions are blocked and when strategy automation context is
  unresolved.
- How success will be observed: focused dashboard-home test proves both labels
  render from backend payload fields.
- Post-launch learning needed: no

## Deliverable For This Stage
Release-ready evidence for actionability detail labels in dashboard home
open-position status cells.

## Constraints
- Reuse existing backend payload fields and Web row derivation.
- Do not add runtime action behavior or new command paths.
- Keep labels inside the dashboard-home namespace.
- Preserve existing action disable behavior.

## Implementation Plan
1. Extend dashboard home status-cell rendering with compact detail labels for
   `actionable=false` and `strategyAutomationContextResolved=false`.
2. Add dashboard-home localized labels.
3. Extend focused dashboard-home regression coverage.
4. Run relevant Web validations and sync docs/context.

## Acceptance Criteria
- Dashboard home status cell keeps existing continuity badge.
- Non-actionable open positions show an explicit action-blocked label.
- Unresolved strategy automation context is visible.
- Action buttons remain fail-closed for non-actionable rows.

## Definition of Done
- [x] Focused dashboard-home test passes.
- [x] Web typecheck passes.
- [x] i18n route audit passes.
- [x] Guardrails pass.
- [x] Source-of-truth docs are synchronized.

## Forbidden
- Backend/API behavior changes.
- New action controls.
- Hidden bypasses for non-actionable rows.
- Live-money mutations.

## Validation Evidence
- Tests:
  - `pnpm --filter web run test -- src/features/dashboard-home/components/home-live-widgets/runtimeDataTablePresenters.test.tsx --run` PASS (`6/6`)
  - `pnpm --filter web run test -- src/features/dashboard-home/components/HomeLiveWidgets.test.tsx --run` PASS (`20/20`)
  - `pnpm --filter web run typecheck` PASS
  - `pnpm --filter web run lint` PASS
  - `pnpm --filter web run build` PASS
  - `pnpm i18n:audit:route-reachable:web` PASS (`findings=0`)
  - `pnpm run quality:guardrails` PASS
  - `git diff --check` PASS
- Manual checks:
  - Browser plugin attempt was made first and blocked by `node_repl` resolving
    workstation Node `v22.13.0` while requiring `>= v22.22.0`.
  - Fallback rendered smoke used bundled Codex Node plus Playwright against
    `/dashboard`.
- Screenshots/logs:
  - Rendered smoke screenshot:
    `C:\Users\wrobl\AppData\Local\Temp\soar-v1ui07-dashboard.png`
  - Rendered smoke result: `/dashboard` loaded with no console errors.
- High-risk checks: no money mutation path is changed.

## Architecture Evidence
- Architecture source reviewed:
  - `docs/architecture/reference/live-runtime-lifecycle-parity-contract.md`
  - `docs/architecture/reference/live-position-restart-continuity-contract.md`
  - `docs/modules/web-dashboard-home.md`
  - `docs/modules/web-bots.md`
- Fits approved architecture: yes
- Mismatch discovered: yes, dashboard home shows continuity but not all
  actionability detail labels that bot monitoring now exposes.
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: docs will record parity closure.

## UX/UI Evidence
- Design source type: existing implementation
- Design source reference: dashboard home open-positions table status cell and
  `V1UI-06` bot-monitoring diagnostic labels.
- Canonical visual target: compact table status cell with text labels, not
  color-only state.
- Fidelity target: structurally_faithful
- Existing shared pattern reused: badge-style runtime diagnostics.
- New shared pattern introduced: no
- Required states: confirmed, recovering, recovered non-actionable, externally
  closed, repair-only, action blocked, strategy-context unresolved.
- Responsive checks: table remains horizontally scrollable as before.
- Accessibility checks: status details are text labels.
- Parity evidence: presenter test renders action-blocked and unresolved
  strategy-context labels from backend payload fields; rendered smoke confirms
  dashboard route health.

## Deployment / Ops Evidence
- Deploy impact: low
- Env or secret changes: none
- Health-check impact: none
- Rollback note: revert Web display changes.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: dashboard home status cell does not expose all backend
  actionability diagnostics.
- Gaps: bot monitoring and dashboard home interpret the same runtime row with
  different detail depth.
- Inconsistencies: non-actionable and unresolved strategy-context truth is
  more explicit in `/dashboard/bots` than `/dashboard`.
- Architecture constraints: fail-closed runtime skips and unresolved strategy
  context must remain operator-visible.

### 2. Select One Priority Task
- Selected task: V1UI-07 dashboard home actionability status parity.
- Priority rationale: dashboard home is the primary operator surface and must
  not under-explain fail-closed money-state rows.
- Why other candidates were deferred: broader dashboard visual polish would
  mix multiple UI concerns.

### 3. Plan Implementation
- Files or surfaces to modify: listed in Scope.
- Logic: add detail labels below the existing continuity badge.
- Edge cases: missing optional fields keep the existing confirmed/actionable
  display.

### 4. Execute Implementation
- Implementation notes: dashboard home open-position status cells now render
  action-blocked and unresolved strategy-context detail labels under the
  continuity badge. Existing action disable behavior is unchanged.

### 5. Verify and Test
- Validation performed: focused dashboard presenter test, dashboard integration
  test, Web typecheck, Web lint, Web build, route-reachable i18n audit,
  repository guardrails, diff check, and rendered dashboard smoke.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: rely only on disabled action buttons. Rejected
  because the operator should see the reason without hovering controls.
- Technical debt introduced: no.
- Scalability assessment: display-only addition on existing runtime payload
  fields and existing dashboard table presenter.
- Refinements made: payload-specific assertions were placed in the table
  presenter test, while the full dashboard test remains integration coverage.

### 7. Update Documentation and Knowledge
- Docs updated: task evidence, MVP planning, module documentation.
- Context updated: project state and task board.
- Learning journal updated: not applicable

## Review Checklist
- [x] Process self-audit completed before implementation.
- [x] Autonomous loop evidence covers all seven steps.
- [x] Exactly one priority task was selected.
- [x] Operation mode was selected according to iteration rotation.
- [x] Current stage is declared and respected.
- [x] Architecture alignment confirmed.
- [x] Definition of Done evidence is attached.
- [x] Relevant validations were run.
- [x] Docs or context were updated if repository truth changed.

## Result Report
- Task summary: dashboard home open positions now expose backend actionability
  detail labels below the continuity badge.
- Files changed: dashboard runtime table presenter, dashboard-home i18n
  namespaces, dashboard-home tests, planning/context/module docs, i18n audit
  artifact.
- How tested: focused presenter test, dashboard integration test, typecheck,
  lint, build, i18n audit, guardrails, diff check, rendered route smoke.
- What is incomplete: rendered smoke used an empty fresh-account dashboard; the
  degraded runtime row is covered by component-level presenter evidence.
- Next steps: continue scanning dashboard and bot runtime tables for remaining
  backend fields that are still not operator-visible.
- Decisions made: no backend/API behavior change was needed.
