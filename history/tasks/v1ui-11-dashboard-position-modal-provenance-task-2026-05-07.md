# V1UI-11 Dashboard Position Modal Provenance Task

## Header
- ID: V1UI-11
- Title: Surface imported-position provenance in dashboard position modal
- Task Type: fix
- Current Stage: release
- Status: DONE
- Owner: Frontend Builder
- Depends on: V1UI-10
- Priority: P1
- Iteration: 11
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
V1UI-10 made backend position provenance visible in open-position table status
cells. The dashboard position edit modal still compresses `EXCHANGE_SYNC`
positions to the generic `Imported` source label, even though the same backend
payload includes `syncState` and `takeoverStatus`.

## Goal
Render the same imported/adopted exchange provenance truth inside the dashboard
position edit modal without changing runtime authority or command behavior.

## Scope
- Shared Web runtime provenance label suffix helper.
- Dashboard home position edit modal.
- Focused Web tests and source-of-truth docs.

## Implementation Plan
1. Move the provenance-kind label suffix mapping into the shared runtime
   formatter.
2. Reuse the helper in dashboard and bot monitoring status cells.
3. Render modal provenance beside the existing source label when noteworthy
   backend provenance exists.
4. Add a focused dashboard test for an exchange-adopted position edit modal.
5. Run focused tests plus relevant Web gates and update docs/context.

## Acceptance Criteria
- `/dashboard` position edit modal shows imported/adopted provenance for
  `EXCHANGE_SYNC` rows.
- Existing table provenance labels still render through the same helper.
- Ordinary bot-origin rows remain unchanged.
- Focused tests and quality gates pass.

## Definition of Done
- [x] Shared helper maps provenance kinds to route-owned i18n suffixes.
- [x] Dashboard position modal shows provenance for exchange-adopted rows.
- [x] Focused tests and relevant quality gates pass.
- [x] Docs and context are updated with evidence.

## Forbidden
- new systems without approval
- duplicated logic or parallel implementations of the same contract
- temporary bypasses, hacks, or workaround-only paths
- architecture changes without explicit approval
- implicit stage skipping

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
- Design source reference: existing dashboard position edit modal summary grid
- Canonical visual target: compact summary text in modal header
- Fidelity target: structurally_faithful
- Stitch used: no
- Experience-quality bar reviewed: yes
- Visual-direction brief reviewed: not applicable
- Existing shared pattern reused: provenance label from runtime status cells
- New shared pattern introduced: no
- Design-memory update required: no
- Required states: success
- Responsive checks: desktop
- Accessibility checks: text-visible diagnostic in modal summary
- Parity evidence: focused component test plus rendered smoke.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: dashboard open-position table shows provenance, but the edit modal
  still shows only generic source.
- Gaps: action-time modal context can hide adoption/drift/orphan truth.
- Inconsistencies: provenance mapping is duplicated between dashboard and bot
  monitoring presenters.
- Architecture constraints: imported-position provenance must remain visible as
  degraded/operator telemetry and must not imply stronger runtime authority.

### 2. Select One Priority Task
- Selected task: V1UI-11 dashboard position modal provenance.
- Priority rationale: action-time operator surface should reflect backend
  ownership/provenance truth.
- Why other candidates were deferred: broader runtime parity sweeps remain
  separate; this is the smallest visible gap after V1UI-10.

### 3. Plan Implementation
- Files or surfaces to modify: shared runtime formatter, dashboard table
  presenter, bot monitoring state cell, dashboard modal, focused tests,
  docs/context.
- Logic: resolve provenance kind from existing backend fields and translate via
  route-owned key prefix plus shared suffix.
- Edge cases: ordinary bot-origin positions do not show provenance; degraded
  sync states still win over generic exchange origin.

### 4. Execute Implementation
- Implementation notes: added shared
  `runtimePositionProvenanceLabelSuffix`, reused it in dashboard and bot
  monitoring provenance label composition, and rendered modal provenance below
  the existing dashboard position source label when the backend fields resolve
  to a noteworthy imported/sync state.

### 5. Verify and Test
- Validation performed:
  - `pnpm --filter web run test -- src/features/shared/runtimeMonitoringFormatters.test.ts src/features/dashboard-home/components/HomeLiveWidgets.test.tsx src/features/dashboard-home/components/home-live-widgets/runtimeDataTablePresenters.test.tsx src/features/bots/components/BotsManagement.test.tsx --run`
  - `pnpm --filter web run typecheck`
  - `pnpm --filter web run lint`
  - `pnpm i18n:audit:route-reachable:web`
  - `pnpm run quality:guardrails`
  - `pnpm --filter web run build`
  - authenticated rendered `/dashboard` smoke on local API/Web ports
    `3001/3002`
- Result: PASS. Focused Web tests passed (`46/46`), route-reachable i18n audit
  passed with `findings=0`, and rendered smoke found no console errors or
  framework overlay.

### 6. Self-Review
- Simpler option considered: add another local dashboard-only mapper; rejected
  because two existing route mappers already encoded the same suffix logic.
- Technical debt introduced: no
- Scalability assessment: additive shared suffix helper, no API/runtime change.
- Refinements made: focused test assertion was adjusted to account for the
  expected table-plus-modal duplicate provenance label on the same screen.

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
- Task summary: Dashboard position edit modal now surfaces imported/adopted
  provenance from backend runtime position fields.
- Files changed: shared runtime formatter/tests, dashboard home modal/test,
  dashboard and bot monitoring provenance label composition, module docs, and
  planning/context docs.
- How tested: focused Web tests (`46/46`), Web typecheck, Web lint,
  route-reachable i18n audit (`findings=0`), repository guardrails, Web build,
  and local authenticated rendered `/dashboard` smoke.
- What is incomplete: no code gap remains in this slice; rendered smoke uses
  empty local seed data, while the modal provenance row is covered by component
  tests.
- Next steps: continue the next tiny backend-to-web parity sweep from the V1
  queue.
- Decisions made: use a shared i18n suffix helper so route-owned namespaces can
  keep their own prefixes without duplicating provenance-kind semantics.
