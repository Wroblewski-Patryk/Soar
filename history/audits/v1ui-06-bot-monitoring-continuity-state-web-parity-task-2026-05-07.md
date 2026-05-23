# V1UI-06 Bot Monitoring Continuity State Web Parity

## Header
- ID: V1UI-06
- Title: fix(web-runtime): surface continuity state in bot monitoring positions
- Task Type: fix
- Current Stage: release
- Status: DONE
- Owner: Frontend Builder
- Depends on: V1RESTART-A
- Priority: P1
- Iteration: 6
- Operation Mode: ARCHITECT

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
The backend runtime positions payload exposes continuity/actionability truth
for recovered or degraded LIVE positions. Dashboard home renders this fail-
closed state, but `/dashboard/bots` monitoring open-position rows do not expose
the same operator-visible continuity state.

## Goal
Show backend continuity/actionability truth in bot monitoring open positions
without changing runtime behavior or action command paths.

## Scope
- `apps/web/src/features/bots/types/bot.type.ts`
- `apps/web/src/features/bots/components/bots-management/BotsMonitoringTab.tsx`
- `apps/web/src/features/bots/components/BotsManagement.test.tsx`
- dashboard-bots i18n namespace files
- planning/context/module docs

## Success Signal
- User or operator problem: recovered or non-actionable LIVE positions can look
  normal in bot monitoring.
- Expected reliability outcome: bot monitoring explicitly labels recovered,
  recovering, externally closed, repair-only, and strategy-context unresolved
  states.
- How success will be observed: focused bot monitoring test proves degraded
  state labels render from backend payload fields.
- Post-launch learning needed: no

## Deliverable For This Stage
Release-ready evidence for continuity/actionability labels in bot monitoring
open position rows.

## Constraints
- Reuse existing backend fields.
- Do not add runtime action behavior.
- Keep route-owned i18n under `dashboard.bots.*`.
- Preserve current dashboard-home behavior.

## Implementation Plan
1. Add missing Web type for `strategyAutomationContextResolved`.
2. Render compact runtime state labels in bot monitoring open positions.
3. Add localized dashboard-bots labels for continuity/actionability states.
4. Add focused regression coverage.
5. Run relevant Web validations and sync docs/context.

## Acceptance Criteria
- Open-position rows show continuity state from backend payload.
- Non-actionable rows show an explicit unavailable/action-blocked label.
- Unresolved strategy automation context is visible.
- Missing optional fields default to confirmed/actionable display.

## Definition of Done
- [x] Focused bot monitoring test passes.
- [x] Web typecheck passes.
- [x] i18n route audit passes.
- [x] Guardrails pass.
- [x] Source-of-truth docs are synchronized.

## Forbidden
- Backend/API behavior changes.
- New action controls.
- Hiding degraded states behind normal-looking rows.
- Live-money mutations.

## Validation Evidence
- Tests:
  - `pnpm --filter web run test -- src/features/bots/components/BotsManagement.test.tsx --run` PASS (`13/13`)
  - `pnpm --filter web run typecheck` PASS
  - `pnpm --filter web run lint` PASS
  - `pnpm --filter web run build` PASS
  - `pnpm i18n:audit:route-reachable:web` PASS (`findings=0`)
  - `pnpm run quality:guardrails` PASS
  - `git diff --check` PASS
- Manual checks:
  - Local API started on `http://localhost:3001` with process-only
    `API_KEY_ENCRYPTION_KEYS` / `API_KEY_ENCRYPTION_ACTIVE_VERSION` override.
  - Local Web started on `http://localhost:3002`.
  - Browser plugin attempt was made first and blocked by `node_repl` resolving
    workstation Node `v22.13.0` while requiring `>= v22.22.0`.
  - Fallback rendered smoke used bundled Codex Node plus Playwright against
    `/dashboard/bots`.
- Screenshots/logs:
  - Rendered smoke screenshot:
    `C:\Users\wrobl\AppData\Local\Temp\soar-v1ui06-bots-list.png`
  - Rendered smoke result: `/dashboard/bots` loaded with navigation, bot list
    empty state, no console errors.
- High-risk checks: no money mutation path is changed.

## Architecture Evidence
- Architecture source reviewed:
  - `docs/architecture/reference/live-position-restart-continuity-contract.md`
  - `docs/architecture/reference/live-runtime-lifecycle-parity-contract.md`
  - `docs/modules/web-bots.md`
  - `docs/modules/web-dashboard-home.md`
- Fits approved architecture: yes
- Mismatch discovered: yes, detailed bot monitoring does not expose backend
  continuity/actionability truth for open positions.
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: docs will record parity closure.

## UX/UI Evidence
- Design source type: existing implementation
- Design source reference: current bot monitoring table style and dashboard
  runtime continuity labels.
- Canonical visual target: compact runtime state cell in dense table.
- Fidelity target: structurally_faithful
- Existing shared pattern reused: badge-style table diagnostics.
- New shared pattern introduced: no
- Required states: confirmed, recovering, recovered non-actionable, externally
  closed, repair-only, strategy-context unresolved.
- Responsive checks: table remains horizontally scrollable as before.
- Accessibility checks: labels are text, not color-only.
- Parity evidence: focused component test renders recovered non-actionable and
  unresolved strategy-context labels from runtime payload fields; rendered
  smoke confirms the authenticated bots route loads without console errors.

## Deployment / Ops Evidence
- Deploy impact: low
- Env or secret changes: none
- Health-check impact: none
- Rollback note: revert Web display changes.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: bot monitoring open positions omit continuity/actionability truth.
- Gaps: dashboard-home open positions show continuity state, bot monitoring
  open positions do not.
- Inconsistencies: same runtime positions payload is interpreted differently
  across Web surfaces.
- Architecture constraints: degraded LIVE positions must remain visible and
  explicit.

### 2. Select One Priority Task
- Selected task: V1UI-06 bot monitoring continuity state parity.
- Priority rationale: fail-closed money-state diagnostics are operator-critical.
- Why other candidates were deferred: broader runtime UI parity work would mix
  multiple backend contracts.

### 3. Plan Implementation
- Files or surfaces to modify: listed in Scope.
- Logic: display payload continuity/actionability fields as compact labels.
- Edge cases: missing optional fields default to confirmed/actionable.

### 4. Execute Implementation
- Implementation notes: added Web typing for
  `strategyAutomationContextResolved`, rendered continuity/actionability state
  in bot monitoring open-position rows, added route-owned i18n labels, and
  covered degraded runtime state in `BotsManagement.test.tsx`.

### 5. Verify and Test
- Validation performed: focused Web test, Web typecheck, Web lint, Web build,
  route-reachable i18n audit, repository guardrails, diff check, and rendered
  authenticated bots-route smoke.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: rely on dashboard-home continuity column. Rejected
  because bot monitoring is the detailed operator route and must not hide
  degraded truth.
- Technical debt introduced: none known.
- Scalability assessment: display-only addition on existing runtime payload
  fields; no new backend contracts or action paths.
- Refinements made: duplicate i18n table keys were removed after typecheck
  caught them.

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
- Task summary: bot monitoring open positions now expose backend
  continuity/actionability truth, including recovered non-actionable and
  unresolved strategy-context states.
- Files changed: Web bot monitoring component, bot runtime types, bot route
  i18n namespaces, focused Web regression, planning/context/module docs, i18n
  audit artifact.
- How tested: focused Web test, typecheck, lint, production Web build, i18n
  audit, guardrails, diff check, rendered route smoke.
- What is incomplete: local seed admin password did not match the current
  database, so rendered smoke used a fresh authenticated smoke user and the
  degraded runtime row remains covered by component-level regression.
- Next steps: continue scanning runtime UI surfaces for backend payload fields
  that are still not operator-visible.
- Decisions made: no backend/API behavior change was needed.
