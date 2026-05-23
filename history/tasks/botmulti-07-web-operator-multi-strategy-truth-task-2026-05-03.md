# Task

## Header
- ID: BOTMULTI-07
- Title: web(ui+operator): expose multi-strategy bot management and runtime truth
- Task Type: feature
- Current Stage: verification
- Status: DONE
- Owner: Frontend Builder
- Depends on: BOTMULTI-06
- Priority: P1
- Iteration: 2026-05-03 post-V1 BOTMULTI activation, iteration 7
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
API writes and runtime now support canonical multi-strategy bots. The web bot
create/edit form still presents and submits a single strategy-only payload,
which hides the post-V1 BOTMULTI operator contract.

## Goal
Expose canonical multi-strategy bot management in the existing bot create/edit
form without introducing a new UI system or hiding primary strategy provenance.

## Scope
- `apps/web/src/features/bots/components/BotCreateEditForm.tsx`
- `apps/web/src/features/bots/components/BotCreateEditForm.test.tsx`
- `apps/web/src/features/bots/types/bot.type.ts`
- `apps/web/src/i18n/namespaces/dashboard-bots.*.ts`
- BOTMULTI planning/context docs

## Implementation Plan
1. Extend web bot payload types with canonical `strategies[]` link inputs.
2. Keep a primary strategy selector and add additional strategy checkboxes
   inside the existing strategy section.
3. Submit ordered enabled `strategies[]`, with the primary strategy first and
   lower numeric priority values in display order.
4. Prefill edit mode from runtime graph canonical strategy links when present,
   falling back to direct `strategyId`.
5. Add focused web regression coverage and run web tests/typecheck plus
   repository docs/guardrail validation.

## Acceptance Criteria
- Bot create/update submits `strategies[]` with primary strategy first.
- The primary strategy remains explicit and included in the enabled set.
- Edit mode can prefill existing canonical runtime graph strategy links.
- Existing single-strategy create/edit flows remain compatible.
- Focused tests and validation pass.

## Success Signal
- User or operator problem: web bot management cannot express the canonical
  multi-strategy bot contract.
- Expected product or reliability outcome: operator intent reaches the API as
  explicit ordered strategy links.
- How success will be observed: focused form tests assert multi-strategy
  payload shape and edit-mode prefill.
- Post-launch learning needed: no.

## Deliverable For This Stage
Existing bot create/edit form supports ordered multi-strategy link submission.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within the declared current stage unless explicit approval changes it

## Definition of Done
- [x] Web payload types include canonical strategy link inputs.
- [x] Bot form operator controls expose primary plus additional strategies.
- [x] Create/update payload includes ordered enabled `strategies[]`.
- [x] Focused web tests and typecheck pass.
- [x] Docs/context are synchronized.

## Forbidden
- silently choosing secondary strategies
- replacing the existing bot form architecture
- adding a parallel API client
- changing runtime behavior in this task

## Validation Evidence
- Tests:
  - `pnpm --filter web run test -- --run src/features/bots/components/BotCreateEditForm.test.tsx`
    PASS (`7` tests).
  - `pnpm --filter web run typecheck` PASS.
  - `pnpm i18n:audit:route-reachable:web` PASS (`0` findings).
  - `pnpm run docs:parity:check` PASS.
  - `pnpm run quality:guardrails` PASS.
- Manual checks: bot form keeps a primary strategy select, renders labelled
  enabled-strategy checkboxes, submits primary-first ordered `strategies[]`,
  and edit mode prefers canonical runtime graph strategy links when present.
- Screenshots/logs: not applicable for this narrow form contract
- High-risk checks: primary strategy must be explicit and included in payload

## Architecture Evidence
- Architecture source reviewed: runtime contexts and BOTMULTI plan.
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: none expected

## UX/UI Evidence
- Design source type: approved_snapshot
- Design source reference: existing bot form shared `ui/forms` pattern
- Canonical visual target: structurally faithful existing form section
- Fidelity target: structurally_faithful
- Stitch used: no
- Experience-quality bar reviewed: yes
- Visual-direction brief reviewed: not applicable
- Existing shared pattern reused: form section, select field, checkbox/toggle
  style
- New shared pattern introduced: no
- Design-memory entry reused: not applicable
- Design-memory update required: no
- Visual gap audit completed: focused component regression
- Background or decorative asset strategy: not applicable
- Canonical asset extraction required: no
- Screenshot comparison pass completed: not applicable
- Remaining mismatches: none in this scoped form contract.
- Required states: loading, empty, error, success
- Responsive checks: existing form grid behavior
- Input-mode checks: pointer, keyboard
- Accessibility checks: labelled strategy checkboxes
- Parity evidence: focused component tests cover create payload and edit-mode
  canonical graph prefill.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: form state and payload are single `strategyId`.
- Gaps: canonical `strategies[]` API write support is not exposed in web.
- Inconsistencies: runtime supports multiple enabled links, operator form does
  not.
- Architecture constraints: primary strategy provenance must remain explicit.

### 2. Select One Priority Task
- Selected task: `BOTMULTI-07`.
- Priority rationale: operator management must express the contract before
  closure QA.
- Why other candidates were deferred: closure pack depends on UI/API/runtime
  parity.

### 3. Plan Implementation
- Files or surfaces to modify: bot form, bot web types, focused tests, i18n,
  planning docs.
- Logic: derive selected strategy ids, keep primary first, submit ordered
  enabled strategy links.
- Edge cases: primary changed, all secondaries unchecked, edit prefill missing
  runtime graph, no strategies.

### 4. Execute Implementation
- Implementation notes: added web payload typing for strategy links, extended
  bot form state with selected strategy ids, reused the primary strategy select
  plus additional checkboxes, submitted ordered enabled `strategies[]`, and
  prefills edit mode from runtime graph canonical links.

### 5. Verify and Test
- Validation performed: focused bot form tests, web typecheck, route-reachable
  i18n audit, docs parity, repository guardrails.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: send one-item `strategies[]` only. Rejected
  because it would not expose multi-strategy operator control.
- Technical debt introduced: no
- Scalability assessment: form state remains local and bounded by strategy
  list size.
- Refinements made: primary strategy is disabled in the checkbox list so it
  remains explicitly included and cannot be unchecked accidentally.

### 7. Update Documentation and Knowledge
- Docs updated: BOTMULTI plan, MVP queue, MVP execution plan.
- Context updated: task board and project state synchronized.
- Learning journal updated: not applicable.

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

- Task summary: bot create/edit now exposes canonical multi-strategy selection
  with explicit primary strategy provenance and submits ordered enabled
  `strategies[]` to the API.
- Files changed: bot form component/test, bot web payload types, dashboard-bots
  i18n namespaces, planning/context docs.
- How tested: focused bot form tests, web typecheck, route-reachable i18n
  audit, docs parity, repository guardrails.
- What is incomplete: final architecture-to-runtime closure pack remains in
  `BOTMULTI-08`.
- Next steps: execute `BOTMULTI-08` closure evidence pack.
- Decisions made: keep primary strategy as the first ordered link and disable
  its checkbox mirror so it cannot be removed from the enabled set.
