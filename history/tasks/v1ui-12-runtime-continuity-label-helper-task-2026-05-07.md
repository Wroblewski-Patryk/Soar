# V1UI-12 Runtime Continuity Label Helper Task

## Header
- ID: V1UI-12
- Title: Centralize runtime continuity label semantics for Web operator surfaces
- Task Type: refactor
- Current Stage: release
- Status: DONE
- Owner: Frontend Builder
- Depends on: V1UI-11
- Priority: P1
- Iteration: 12
- Operation Mode: ARCHITECT

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
Dashboard home and bot monitoring now both expose backend runtime position
continuity truth, but each presenter maps the same `continuityState` values to
local i18n keys independently. That duplicated semantic mapping can drift as
backend continuity states evolve.

## Goal
Centralize Web runtime continuity label semantics while preserving route-owned
i18n namespaces and unchanged UI output.

## Scope
- Shared Web runtime continuity label suffix helper.
- Dashboard home open-position status cell.
- Bot monitoring open-position status cell.
- Focused tests and source-of-truth docs.

## Implementation Plan
1. Add a shared continuity-state label suffix helper to the runtime monitoring
   formatter.
2. Reuse the helper in dashboard and bot monitoring status cells.
3. Add focused unit coverage for the helper.
4. Run focused Web tests and relevant quality gates.
5. Update module docs, planning, and canonical context.

## Acceptance Criteria
- Dashboard and bot monitoring status cells derive continuity labels from one
  shared semantic helper.
- Route-owned i18n prefixes remain unchanged.
- Existing visible labels and tests remain green.

## Definition of Done
- [x] Shared helper maps continuity states to route-neutral i18n suffixes.
- [x] Dashboard home uses the shared helper for continuity labels.
- [x] Bot monitoring uses the shared helper for continuity labels.
- [x] Focused tests and relevant quality gates pass.
- [x] Docs and context are updated with evidence.

## Forbidden
- new runtime authority paths
- route namespace leakage between dashboard and bots
- temporary bypasses or duplicated semantic maps
- unrelated UI or API changes

## Architecture Evidence
- Architecture source reviewed:
  `docs/architecture/reference/live-runtime-lifecycle-parity-contract.md`,
  `docs/architecture/08_operator-surfaces-and-routing.md`,
  `docs/modules/web-dashboard-home.md`, `docs/modules/web-bots.md`.
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: module docs only.

## UX/UI Evidence
- Design source type: approved_snapshot
- Design source reference: existing open-position status labels
- Canonical visual target: unchanged compact status cells
- Fidelity target: structurally_faithful
- Stitch used: no
- Experience-quality bar reviewed: yes
- Visual-direction brief reviewed: not applicable
- Existing shared pattern reused: route-owned prefix plus shared suffix helper
- New shared pattern introduced: no
- Design-memory update required: no
- Required states: success
- Responsive checks: desktop
- Accessibility checks: unchanged text labels
- Parity evidence: focused component/unit tests plus rendered smoke.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: same backend continuity state semantics are mapped separately in two
  Web presenters.
- Gaps: future backend continuity additions could be reflected differently in
  dashboard and bot monitoring.
- Inconsistencies: provenance already uses a shared suffix helper, continuity
  still does not.
- Architecture constraints: operator-visible fail-closed diagnostics must stay
  consistent across runtime surfaces.

### 2. Select One Priority Task
- Selected task: V1UI-12 runtime continuity label helper.
- Priority rationale: ARCHITECT-mode cleanup that reduces runtime diagnostic
  drift without changing behavior.
- Why other candidates were deferred: broader attribution and trade-origin
  helpers are lower priority and would broaden the slice.

### 3. Plan Implementation
- Files or surfaces to modify: shared runtime formatter, dashboard runtime
  table presenter, bot monitoring state cell, tests, docs/context.
- Logic: map backend continuity state to a route-neutral suffix, then compose
  route-owned translation keys locally.
- Edge cases: missing/unknown continuity state remains confirmed/default.

### 4. Execute Implementation
- Implementation notes: added shared `runtimeContinuityLabelSuffix`, rewired
  dashboard home and bot monitoring open-position status label composition to
  derive backend continuity semantics from that helper, and kept route-owned
  translation prefixes intact.

### 5. Verify and Test
- Validation performed:
  - `pnpm --filter web run test -- src/features/shared/runtimeMonitoringFormatters.test.ts src/features/dashboard-home/components/home-live-widgets/runtimeDataTablePresenters.test.tsx src/features/bots/components/BotsManagement.test.tsx --run`
  - `pnpm --filter web run typecheck`
  - `pnpm --filter web run lint`
  - `pnpm i18n:audit:route-reachable:web`
  - `pnpm run quality:guardrails`
  - `pnpm --filter web run build`
  - authenticated rendered `/dashboard/bots` smoke on local API/Web ports
    `3001/3002`
- Result: PASS. Focused Web tests passed (`27/27`), route-reachable i18n audit
  passed with `findings=0`, and rendered smoke found no console errors or
  framework overlay.

### 6. Self-Review
- Simpler option considered: leave both local maps; rejected because this is
  the same class of drift just fixed for provenance.
- Technical debt introduced: no
- Scalability assessment: additive helper, no API/runtime behavior change.
- Refinements made: bot monitoring keeps its route-owned `runtimeState*` key
  names while sharing the backend-state suffix decision.

### 7. Update Documentation and Knowledge
- Docs updated: module docs, MVP planning queue, MVP execution progress, and
  this task record.
- Context updated: project state and task board.
- Learning journal updated: not applicable.

## Review Checklist
- [x] Process self-audit completed before implementation.
- [x] Autonomous loop evidence covers all seven steps.
- [x] Exactly one priority task was selected for this iteration.
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
- [ ] Learning journal was updated if a recurring pitfall was confirmed.

## Result Report
- Task summary: Web continuity-state label semantics are now centralized in
  the shared runtime formatter and reused by dashboard home and bot monitoring.
- Files changed: shared runtime formatter/tests, dashboard runtime table
  presenter, bot monitoring state cell, module docs, and planning/context docs.
- How tested: focused Web tests (`27/27`), Web typecheck, Web lint,
  route-reachable i18n audit (`findings=0`), repository guardrails, Web build,
  and local authenticated rendered `/dashboard/bots` smoke.
- What is incomplete: no code gap remains in this slice; it is a behavior-
  preserving architecture cleanup.
- Next steps: continue the next tiny backend-to-web parity sweep from the V1
  queue.
- Decisions made: centralize backend continuity state semantics as route-neutral
  suffixes while preserving dashboard and bot namespace ownership.
