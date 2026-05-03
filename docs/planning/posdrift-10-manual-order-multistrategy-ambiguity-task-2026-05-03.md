# POSDRIFT-10 Manual Order Multi-Strategy Ambiguity Task

## Header
- ID: POSDRIFT-10
- Title: Fail closed for manual-order multi-strategy ambiguity
- Task Type: fix
- Current Stage: DONE
- Status: DONE
- Owner: Backend Builder
- Depends on: POSDRIFT-09
- Priority: P0
- Iteration: 10
- Operation Mode: TESTER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
The operator asked to continue hardening LIVE/PAPER position opening and
management. In TESTER mode, the next confirmed edge-case was manual-order
multi-strategy ambiguity: canonical strategy matching still selected
`strategyLinks[0]` when more than one enabled strategy covered the requested
symbol, despite the BOTMULTI architecture requiring fail-closed behavior unless
an explicit strategy is provided.

## Goal
Manual-order strategy context must resolve only when exactly one enabled
canonical strategy link matches the requested symbol. Multiple enabled matching
links must remain unresolved so LIVE manual open fails closed.

## Scope
- `apps/api/src/modules/orders/orders.manualContext.service.ts`
- `apps/api/src/modules/orders/orders.service.test.ts`
- `docs/modules/api-orders.md`
- `docs/planning/mvp-next-commits.md`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`

## Implementation Plan
1. Change canonical manual-order strategy resolution to return a strategy only
   when the matching canonical group has exactly one enabled strategy link.
2. Return unresolved context for zero or multiple enabled matching links instead
   of falling through to direct or legacy strategy fallback.
3. Add a LIVE manual order regression proving multiple enabled canonical
   strategies produce `LIVE_MANUAL_SCOPE_UNRESOLVED` and do not execute.
4. Run focused and related order/manual context validation.

## Acceptance Criteria
- Multi-strategy canonical manual-order scope does not silently select the
  first strategy.
- LIVE manual open with ambiguous matching canonical strategies fails closed
  before exchange execution.
- Single-strategy canonical manual-order context remains unchanged.
- Docs/context capture the fail-closed behavior.

## Definition of Done
- [x] Multi-strategy manual context is unresolved without explicit strategy.
- [x] LIVE fail-closed regression passes.
- [x] Relevant docs/context are updated.
- [x] Validation evidence is recorded.

## Validation Evidence
- Tests:
  - `pnpm --filter api exec vitest run src/modules/orders/orders.service.test.ts --run -t "LIVE_MANUAL_SCOPE_UNRESOLVED|multiple enabled strategies" --sequence.concurrent=false` => PASS (`1` selected test).
  - `pnpm --filter api exec vitest run src/modules/orders/orders.service.test.ts src/modules/orders/orders-positions.e2e.test.ts src/modules/bots/bots.multi-strategy-write.e2e.test.ts src/modules/bots/bots.runtime-scope.e2e.test.ts --run --sequence.concurrent=false` => PASS (`4` files / `56` tests).
  - `pnpm --filter api run typecheck` => PASS.
  - `pnpm run lint` => PASS.
  - `pnpm run quality:guardrails` => PASS.
  - `pnpm docs:parity:check` => PASS.
- Manual checks:
  - Code review confirmed exact-symbol direct/legacy fallback is not used after
    a matching canonical group is ambiguous.
- High-risk checks:
  - Regression asserts exchange execution dependency is not called.

## Architecture Evidence
- Architecture source reviewed: `docs/architecture/04_runtime-contexts.md`,
  `docs/planning/botmulti-01-post-v1-multi-strategy-contract-task-2026-05-03.md`,
  `docs/modules/api-orders.md`.
- Fits approved architecture: yes.
- Mismatch discovered: yes, manual-order context selected the first enabled
  canonical strategy link.
- Decision required from user: no.
- Follow-up architecture doc updates: `docs/modules/api-orders.md`.

## Deployment / Ops Evidence
- Deploy impact: medium.
- Env or secret changes: none.
- Health-check impact: none.
- Smoke steps updated: no.
- Rollback note: revert this commit to restore first-link manual strategy
  selection; no schema or environment change.
- Observability or alerting impact: existing
  `LIVE_MANUAL_SCOPE_UNRESOLVED` error path is reused.
- Staged rollout or feature flag: none.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: manual-order strategy context selected `strategyLinks[0]` when more
  than one enabled canonical strategy matched the requested symbol.
- Gaps: no LIVE regression covered ambiguous multi-strategy manual open.
- Inconsistencies: runtime merge supports multi-strategy evaluation, but manual
  order lacks explicit strategy selection and must not guess.
- Architecture constraints: money-impacting ambiguity must fail closed.

### 2. Select One Priority Task
- Selected task: POSDRIFT-10 manual-order multi-strategy ambiguity.
- Priority rationale: LIVE manual opens are money-impacting and must not infer a
  strategy under ambiguous canonical topology.
- Why other candidates were deferred: dashboard display projection audit remains
  valid, but this was the first confirmed TESTER edge-case on a write path.

### 3. Plan Implementation
- Files or surfaces to modify: manual-order context service, order service
  regression test, module docs, planning/context files.
- Logic: exactly one enabled canonical strategy link resolves; zero or multiple
  links return unresolved for the matching canonical group.
- Edge cases: matching canonical group with multiple enabled strategies,
  matching canonical group with no links, legacy bot without canonical groups.

### 4. Execute Implementation
- Implementation notes: matching canonical ambiguity returns `null` before
  direct or legacy fallbacks can guess.

### 5. Verify and Test
- Validation performed: focused LIVE ambiguous manual-order regression PASS,
  wider orders/multi-strategy runtime DB pack PASS (`56/56`), API typecheck
  PASS, lint PASS, repository guardrails PASS, and docs parity PASS.
- Result: green.

### 6. Self-Review
- Simpler option considered: keep first-link behavior because runtime has
  priority order.
- Technical debt introduced: no.
- Scalability assessment: explicit unresolved state leaves room for a future UI
  strategy selector without unsafe inference.
- Refinements made: no new error code; existing unresolved manual scope error
  is reused.

### 7. Update Documentation and Knowledge
- Docs updated: this task doc, `docs/modules/api-orders.md`,
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
Keep manual LIVE order execution fail-closed under multi-strategy ambiguity.

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
- Task summary: manual-order strategy context now resolves canonical strategy
  only when exactly one enabled matching link exists.
- Files changed: listed in `Scope`.
- How tested: focused LIVE ambiguous manual-order regression PASS, wider
  orders/multi-strategy runtime DB pack PASS (`56/56`), API typecheck PASS,
  lint PASS, repository guardrails PASS, and docs parity PASS.
- What is incomplete: production deployment/readback remains outside this
  local iteration.
- Next steps: continue auditing dashboard response projection seams and
  strategy-selector UX gaps.
- Decisions made: reuse `LIVE_MANUAL_SCOPE_UNRESOLVED` for ambiguous manual
  LIVE order scope.
