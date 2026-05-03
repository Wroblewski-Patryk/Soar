# Task

## Header
- ID: LIVEIMPORT-02
- Title: Recover single-strategy provenance for imported LIVE position automation
- Task Type: fix
- Current Stage: release
- Status: DONE
- Owner: Backend Builder
- Depends on: LIVEIMPORT-01
- Priority: P0
- Iteration: 2026-05-03
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
The operator reported that LIVE ETH/DOGE imported positions were inconsistent:
one position showed TTP while another did not, and exchange-side positions were
not always imported into the bot scope. `LIVEIMPORT-01` fixed wallet-first
ownership proof, but bot-owned or ownership-hydrated `EXCHANGE_SYNC` rows can
still lack `position.strategyId`. Without a strategy context, TTP/DCA display
and automation cannot read the advanced close configuration.

## Goal
Let imported LIVE positions without persisted `strategyId` use the bot's single
enabled canonical strategy link for read-model and automation behavior, while
preserving the existing multi-strategy fail-closed guard.

## Scope
- `apps/api/src/modules/engine/runtimePositionAutomation.service.ts`
- `apps/api/src/modules/engine/runtimePositionAutomation.helpers.ts`
- `apps/api/src/modules/engine/runtimeImportedPositionOwnership.ts`
- `apps/api/src/modules/bots/runtimeSessionPositionsRead.repository.ts`
- `apps/api/src/modules/bots/runtimeSessionPositionsRead.service.ts`
- Focused API regression tests for runtime automation and operator TTP display.
- Canonical queue/context/learning docs.

## Implementation Plan
1. Reuse the existing canonical bot market-group strategy links.
2. Resolve an effective strategy only when exactly one enabled canonical
   strategy is available, or when the position already has `strategyId`.
3. Keep multi-strategy missing-provenance positions blocked.
4. Apply the effective strategy to TTP/DCA automation, DCA continuity, close
   telemetry, and operator read-model dynamic-stop display.
5. Verify with focused runtime and e2e tests, typecheck, and guardrails.

## Acceptance Criteria
- Imported LIVE position automation can evaluate TTP when `position.strategyId`
  is missing but the owning bot has exactly one enabled strategy link.
- Operator runtime positions show dynamic TTP and actionable truth in the same
  single-strategy case.
- Multi-strategy missing-provenance behavior remains fail-closed.
- No symbol-only ownership inference or temporary bypass is introduced.

## Definition of Done
- [x] `DEFINITION_OF_DONE.md` constraints are satisfied for this backend slice.
- [x] Existing ownership and runtime systems are reused.
- [x] Focused tests prove the single-strategy recovery and multi-strategy guard.
- [x] API typecheck and repository guardrails pass.
- [x] Source-of-truth docs are synchronized.

## Constraints
- Do not infer ownership by symbol only.
- Do not guess among multiple strategies.
- Do not create a second importer or a separate protection path.
- Keep LIVE behavior fail-closed when provenance is ambiguous.

## Forbidden
- Multi-strategy fallback selection without explicit provenance.
- Temporary strategy defaults.
- Mock-only behavior.
- New architecture without approval.

## Validation Evidence
- Tests:
  - `pnpm --filter api exec vitest run src/modules/engine/runtimePositionAutomation.service.test.ts src/modules/engine/runtimePositionAutomation.defaultDeps.test.ts --run` => PASS (`33/33`)
  - `pnpm --filter api exec vitest run src/modules/bots/bots.dynamic-stop-operator-truth.e2e.test.ts --run` => PASS (`2/2`)
  - `pnpm --filter api run typecheck` => PASS
  - `pnpm run quality:guardrails` => PASS
- Manual checks:
  - Public production `/health` and `/ready` were healthy.
  - Public production web build-info still reports deployed SHA
    `26962ea1dbb0981d3885779d01e58485d7e9fd6c`, so this local fix still needs
    production promotion before operator readback.
- High-risk checks: multi-strategy missing provenance still records
  `multi_strategy_position_provenance_missing` and does not execute.

## Architecture Evidence
- Architecture source reviewed:
  - `docs/architecture/reference/runtime-signal-merge-contract.md`
  - `docs/architecture/reference/runtime-signal-merge-contract.md` lifecycle
    provenance section
  - `docs/planning/live-import-ownership-wallet-scope-task-2026-05-03.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Follow-up architecture doc updates: none

## Deployment / Ops Evidence
- Deploy impact: medium
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: not required
- Rollback note: revert this commit to restore the prior strict
  `position.strategyId` behavior for imported protection automation.
- Observability or alerting impact: existing protection-close telemetry and
  skip telemetry are reused.
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: imported or ownership-hydrated LIVE rows can be owned by one bot but
  still lack `strategyId`, which hides TTP/DCA configuration and prevents
  automation from applying the intended advanced close strategy.
- Gaps: `runtimeImportedPositionOwnership` did not load canonical strategy
  links for hydrated bot context, and runtime/read-model code treated missing
  position strategy as always unresolved.
- Inconsistencies: single-strategy bot topology is unambiguous, while the
  implementation handled it like an ambiguous multi-strategy position.
- Architecture constraints: use primary strategy provenance, fail closed for
  multiple enabled strategies, no symbol-only guessing.

### 2. Select One Priority Task
- Selected task: `LIVEIMPORT-02`.
- Priority rationale: it affects LIVE position protection visibility and
  close/DCA automation.
- Why other candidates were deferred: paper signal and wallet intermittent
  display issues need their own evidence-backed follow-up tasks.

### 3. Plan Implementation
- Files or surfaces to modify: runtime automation, imported ownership
  hydration, runtime positions read repository/service, focused tests, docs.
- Logic: resolve an effective strategy from `position.strategyId` first, then a
  single enabled canonical strategy link, otherwise null.
- Edge cases: direct position strategy wins; exactly one link can be used;
  multiple links keep the existing fail-closed skip.

### 4. Execute Implementation
- Implementation notes: reused bot market-group strategy links already loaded
  for BOTMULTI runtime topology and kept telemetry/close paths unchanged except
  for passing the effective strategy id.

### 5. Verify and Test
- Validation performed: focused runtime tests, focused e2e read-model test,
  API typecheck, repository guardrails.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: only change the read-model display. Rejected
  because it would leave LIVE automation unable to close by TTP.
- Technical debt introduced: no
- Scalability assessment: strategy resolution uses already-loaded bot links and
  avoids extra per-position queries.
- Refinements made: helper moved out of the production monolith to satisfy
  guardrails.

### 7. Update Documentation and Knowledge
- Docs updated: this task file, task board, project state, learning journal.
- Context updated: yes
- Learning journal updated: yes.

## Result Report
- Task summary: imported LIVE positions without persisted strategy provenance
  now recover the bot's single canonical strategy for TTP/DCA display and
  automation, while multi-strategy ambiguity remains blocked.
- Files changed: see Scope.
- How tested: see Validation Evidence.
- What is incomplete: authenticated production readback for the reported ETH
  and DOGE rows still needs operator credentials/session after deployment.
- Next steps: queue separate evidence tasks for PAPER signal execution parity
  and intermittent wallet balance display.
