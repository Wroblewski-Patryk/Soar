# DASHDRIFT-02 Position Edit Strategy Display Task

## Header
- ID: DASHDRIFT-02
- Title: Keep position edit strategy label canonical-runtime scoped
- Task Type: fix
- Current Stage: DONE
- Status: DONE
- Owner: Frontend Builder
- Depends on: POSDRIFT-11
- Priority: P0
- Iteration: 12
- Operation Mode: ARCHITECT

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
The operator asked to continue finding display/runtime mismatches. After the
backend orphan-repair slice, the next confirmed dashboard drift was the
position edit modal strategy label in `HomeLiveWidgets`: it preferred
`selected.bot.strategy` from the bot list payload before the selected bot's
runtime graph. If a direct legacy bot strategy projection diverged from active
canonical runtime topology, the modal could show a stale strategy while the bot
actually ran under the canonical graph strategy.

## Goal
The dashboard position edit modal must display strategy context from selected
bot runtime graph first, using direct bot strategy only as a legacy fallback.

## Scope
- `apps/web/src/features/dashboard-home/components/HomeLiveWidgets.tsx`
- `apps/web/src/features/dashboard-home/components/HomeLiveWidgets.test.tsx`
- `docs/modules/web-dashboard-home.md`
- `docs/planning/mvp-next-commits.md`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`

## Implementation Plan
1. Change selected strategy display resolution to sort and inspect runtime graph
   market groups and strategy links before direct bot projection.
2. Prefer the enabled active runtime strategy matching graph/bot strategy id
   when available, otherwise fall back to the primary enabled active canonical
   strategy.
3. Keep direct `selected.bot.strategy` and legacy bot strategies as fallback
   only when runtime graph strategy context is unavailable.
4. Add a regression proving stale direct bot strategy does not override
   canonical runtime graph strategy.
5. Run focused web validation and standard repository gates.

## Acceptance Criteria
- Runtime graph strategy context wins over stale direct bot strategy.
- Direct bot strategy remains a compatibility fallback when no runtime graph
  strategy context is available.
- Position edit modal display logic remains deterministic.
- Docs/context capture the dashboard display contract.

## Definition of Done
- [x] Canonical runtime graph strategy display is implemented.
- [x] Stale direct projection regression passes.
- [x] Relevant docs/context are updated.
- [x] Validation evidence is recorded.

## Validation Evidence
- Tests:
  - `pnpm --filter web test -- src/features/dashboard-home/components/HomeLiveWidgets.test.tsx --run` => PASS (`18/18`).
  - `pnpm --filter web test -- src/features/dashboard-home/components/HomeLiveWidgets.test.tsx src/features/dashboard-home/components/RuntimeSidebarSection.test.tsx src/features/dashboard-home/hooks/useManualOrderController.test.tsx --run` => PASS (`3` files / `29` tests).
  - `pnpm --filter web run typecheck` => PASS.
  - `pnpm run lint` => PASS.
  - `pnpm run quality:guardrails` => PASS.
  - `pnpm docs:parity:check` => PASS.
- Manual checks:
  - Code review confirmed `selected.bot.strategy` is only reached after
    runtime graph strategy lookup returns no strategy name.
- High-risk checks:
  - Regression covers the exact stale direct strategy projection display drift.

## Architecture Evidence
- Architecture source reviewed: `docs/architecture/01_overview-and-principles.md`,
  `docs/modules/web-dashboard-home.md`,
  `docs/ux/screen-quality-checklist.md`.
- Fits approved architecture: yes.
- Mismatch discovered: yes, dashboard modal display trusted direct bot
  projection before runtime graph.
- Decision required from user: no.
- Follow-up architecture doc updates: `docs/modules/web-dashboard-home.md`.

## UX/UI Evidence
- Design source type: approved_snapshot.
- Design source reference: existing dashboard-home runtime modal layout.
- Canonical visual target: unchanged existing modal.
- Fidelity target: structurally_faithful.
- Stitch used: no.
- Experience-quality bar reviewed: not applicable for copy/layout-neutral fix.
- Visual-direction brief reviewed: not applicable.
- Existing shared pattern reused: existing `FormModal` and runtime table action.
- New shared pattern introduced: no.
- Design-memory update required: no.
- Visual gap audit completed: yes, no layout or styling change.
- Background or decorative asset strategy: not applicable.
- Required states: loading, empty, error, success unchanged.
- Responsive checks: desktop, tablet, mobile unaffected by logic-only change.
- Input-mode checks: pointer and keyboard modal flows unchanged.
- Accessibility checks: existing label text path unchanged.
- Parity evidence: regression asserts displayed strategy text uses runtime graph.

## Deployment / Ops Evidence
- Deploy impact: low.
- Env or secret changes: none.
- Health-check impact: none.
- Smoke steps updated: no.
- Rollback note: revert this commit to restore direct-first strategy label
  selection; no schema or API change.
- Observability or alerting impact: none.
- Staged rollout or feature flag: none.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: position edit modal strategy label preferred direct
  `selected.bot.strategy` before runtime graph.
- Gaps: no regression covered stale direct strategy display in dashboard home.
- Inconsistencies: backend runtime and dashboard sidebar were canonical-first,
  but this modal label still used a direct-first display path.
- Architecture constraints: operator-facing surfaces must reflect runtime truth.

### 2. Select One Priority Task
- Selected task: DASHDRIFT-02 position edit strategy display.
- Priority rationale: it is a dashboard-visible runtime truth mismatch on a
  position management surface.
- Why other candidates were deferred: broader dashboard audits remain valid,
  but this was the smallest confirmed display drift with a focused regression.

### 3. Plan Implementation
- Files or surfaces to modify: HomeLiveWidgets display helper, focused web
  test, dashboard-home docs, planning/context files.
- Logic: runtime graph active enabled strategy links first, direct bot strategy
  fallback second.
- Edge cases: stale direct strategy, missing runtime graph, disabled/non-active
  graph groups, legacy-only bots.

### 4. Execute Implementation
- Implementation notes: selected strategy display resolver now inspects sorted
  runtime graph groups and strategy links before legacy fields.

### 5. Verify and Test
- Validation performed: focused `HomeLiveWidgets.test.tsx` PASS (`18/18`),
  wider dashboard-home runtime display/controller pack PASS (`29/29`), web
  typecheck PASS, lint PASS, repository guardrails PASS, and docs parity PASS.
- Result: green.

### 6. Self-Review
- Simpler option considered: move only `selected.bot.strategy` below the
  existing graph-id lookup.
- Technical debt introduced: no.
- Scalability assessment: the resolver now follows the same canonical-first
  display pattern expected across dashboard runtime surfaces.
- Refinements made: primary enabled active graph strategy is used even when
  stale graph/bot strategy ids cannot be matched.

### 7. Update Documentation and Knowledge
- Docs updated: this task doc, `docs/modules/web-dashboard-home.md`,
  `docs/planning/mvp-next-commits.md`.
- Context updated: `.codex/context/TASK_BOARD.md`,
  `.codex/context/PROJECT_STATE.md`.
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
- [x] Learning journal was updated if needed.

## Production-Grade Required Contract

### Goal
Keep dashboard position edit strategy display aligned with selected bot runtime
graph truth.

### Scope
Listed above in `Scope`.

### Implementation Plan
Listed above in `Implementation Plan`.

### Acceptance Criteria
Listed above in `Acceptance Criteria`.

### Definition of Done
Reviewed against `DEFINITION_OF_DONE.md`; applicable code, validation, docs,
rollback, and reproducibility evidence are recorded.

### Result Report
- Task summary: position edit modal strategy display now resolves from runtime
  graph strategy context before direct legacy bot strategy.
- Files changed: listed in `Scope`.
- How tested: focused HomeLiveWidgets regression PASS (`18/18`), wider
  dashboard-home runtime display/controller pack PASS (`29/29`), web typecheck
  PASS, lint PASS, repository guardrails PASS, and docs parity PASS.
- What is incomplete: production deployment/readback remains outside this
  local iteration.
- Next steps: continue auditing dashboard runtime display surfaces that still
  reference direct bot projections.
- Decisions made: direct bot strategy is compatibility fallback only when
  runtime graph strategy context is unavailable.
