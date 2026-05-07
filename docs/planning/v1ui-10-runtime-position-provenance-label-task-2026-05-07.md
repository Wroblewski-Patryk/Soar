# V1UI-10 Runtime Position Provenance Label Task

## Header
- ID: V1UI-10
- Title: Surface imported-position provenance in runtime open-position rows
- Task Type: fix
- Current Stage: release
- Status: DONE
- Owner: Frontend Builder
- Depends on: V1UI-09
- Priority: P1
- Iteration: 10
- Operation Mode: TESTER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
The API runtime positions read model exposes `origin`, `managementMode`,
`syncState`, and `takeoverStatus`, but open-position rows in `/dashboard` and
`/dashboard/bots` only show continuity/actionability labels. Imported or
exchange-adopted positions can therefore look like ordinary bot-origin rows.

## Goal
Render backend position provenance/adoption truth in open-position status cells
without changing runtime authority or close-action behavior.

## Scope
- Shared Web runtime provenance resolver.
- Dashboard home open-position status cell.
- Bot monitoring open-position status cell.
- i18n keys, focused tests, task/source-of-truth docs.

## Success Signal
- User or operator problem: adopted/imported exchange positions are explicitly
  visible in runtime tables.
- Expected product or reliability outcome: operator surfaces reflect backend
  provenance truth and avoid hiding adoption state behind normal automation UI.
- How success will be observed: focused tests prove labels for
  `EXCHANGE_SYNC`/takeover rows, and rendered smoke confirms the route loads.
- Post-launch learning needed: no.

## Deliverable For This Stage
One verified UI parity slice for runtime position provenance labels.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new runtime authority paths
- do not implement workarounds
- do not duplicate business logic
- stay within the declared current stage unless explicit approval changes it

## Definition of Done
- [x] Shared resolver maps backend provenance fields to display semantics.
- [x] `/dashboard` open-position rows show imported/adopted provenance.
- [x] `/dashboard/bots` monitoring open-position rows show imported/adopted
  provenance.
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
- Design source reference: existing compact uppercase runtime status labels
- Canonical visual target: status-cell secondary diagnostic labels
- Fidelity target: structurally_faithful
- Stitch used: no
- Experience-quality bar reviewed: yes
- Visual-direction brief reviewed: not applicable
- Existing shared pattern reused: secondary text label below runtime badge
- New shared pattern introduced: no
- Design-memory update required: no
- Required states: success
- Responsive checks: desktop
- Accessibility checks: text-visible provenance label
- Parity evidence: focused component tests plus rendered smoke planned.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: provenance/adoption fields are present in API payloads but not
  visible on open-position rows.
- Gaps: imported `EXCHANGE_SYNC` positions can look like normal bot-origin
  rows once continuity is confirmed.
- Inconsistencies: trade/history surfaces show origin/actor, but open runtime
  positions do not.
- Architecture constraints: imported positions must start at adoption point and
  missing provenance must remain visible as degraded telemetry.

### 2. Select One Priority Task
- Selected task: V1UI-10 runtime position provenance labels.
- Priority rationale: TESTER-mode gap on money-impacting operator surfaces.
- Why other candidates were deferred: broader production gate evidence remains
  separate; this is the smallest backend-to-web parity bug isolated.

### 3. Plan Implementation
- Files or surfaces to modify: shared runtime formatter, dashboard runtime
  presenter, bot monitoring status presenter, i18n, tests, docs/context.
- Logic: resolve noteworthy backend provenance fields into one display kind and
  render it as a secondary uppercase label.
- Edge cases: ordinary bot-origin rows remain unchanged; takeover status wins
  over generic exchange origin; non-`IN_SYNC` sync states are explicit.

### 4. Execute Implementation
- Implementation notes: added a shared runtime provenance resolver for
  `origin`, `syncState`, and `takeoverStatus`, rendered its display kind in
  dashboard home and bot monitoring open-position status cells, extracted the
  bot monitoring status cell into its own presenter, and added route-owned i18n
  keys for EN/PL/PT/de-CH.

### 5. Verify and Test
- Validation performed:
  - `pnpm --filter web run test -- src/features/shared/runtimeMonitoringFormatters.test.ts src/features/dashboard-home/components/home-live-widgets/runtimeDataTablePresenters.test.tsx src/features/bots/components/BotsManagement.test.tsx --run`
  - `pnpm --filter web run typecheck`
  - `pnpm i18n:audit:route-reachable:web`
  - `pnpm --filter web run lint`
  - `pnpm run quality:guardrails`
  - `pnpm --filter web run build`
  - authenticated rendered smoke for `/dashboard` and `/dashboard/bots` on
    local API/Web ports `3001/3002`
- Result: PASS. Focused Web tests passed (`25/25`), route-reachable i18n audit
  passed with `findings=0`, and rendered smoke found no console errors or
  framework overlay.

### 6. Self-Review
- Simpler option considered: show raw `origin`; rejected because
  `takeoverStatus` and `syncState` are more precise operator truth than raw
  origin alone.
- Technical debt introduced: no
- Scalability assessment: additive display helper, no API/runtime behavior
  change.
- Refinements made: bot monitoring status rendering was extracted from the
  large monitoring tab to preserve the existing container split guardrail.

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
- Task summary: Runtime open-position status cells now expose backend
  provenance/adoption truth from `origin`, `syncState`, and `takeoverStatus`
  in both `/dashboard` and `/dashboard/bots`.
- Files changed: shared runtime formatter/tests, dashboard runtime presenter
  and tests, bot monitoring status presenter/tests, dashboard-home and
  dashboard-bots i18n namespaces, module docs, planning/context docs.
- How tested: focused Web tests (`25/25`), Web typecheck, route-reachable i18n
  audit (`findings=0`), Web lint, repository guardrails, Web build, and local
  authenticated rendered smoke for `/dashboard` and `/dashboard/bots`.
- What is incomplete: no code gap remains in this slice; local smoke had no
  seeded `EXCHANGE_SYNC` open position, so the exact row label is covered by
  component tests rather than live seed data.
- Next steps: continue the next tiny backend-to-web parity sweep from the V1
  queue.
- Decisions made: use a display-kind resolver instead of raw `origin` labels so
  takeover and drift states remain more precise than source alone.
