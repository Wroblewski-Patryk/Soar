# POSDRIFT-06 Runtime Signal Loop Canonical Venue Task

## Header
- ID: POSDRIFT-06
- Title: Keep runtime signal-loop inherited venue on shared canonical resolver
- Task Type: fix
- Current Stage: DONE
- Status: DONE
- Owner: Backend Builder
- Depends on: POSDRIFT-05
- Priority: P0
- Iteration: 6
- Operation Mode: ARCHITECT

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
The operator asked to continue auditing LIVE/PAPER position opening,
management, and dashboard truth after the canonical execution venue work in
`POSDRIFT-05`. The next architecture drift found was in runtime signal-loop
topology assembly: it still selected the venue with a local
`botMarketGroups[0] ?? bot.symbolGroup` expression instead of the shared
canonical venue resolver.

## Goal
Runtime signal-loop topology must use the same canonical venue resolver as
pre-trade, manual open, position reads, and position automation, so PAPER/LIVE
open decisions fail closed on ambiguous canonical venues and do not keep a
parallel venue-selection contract.

## Scope
- `apps/api/src/modules/engine/runtimeSignalLoopDefaults.ts`
- `apps/api/src/modules/engine/runtimeSignalLoopDefaults.test.ts`
- `docs/modules/api-bots.md`
- `docs/planning/mvp-next-commits.md`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`

## Implementation Plan
1. Replace the runtime signal-loop local venue expression with
   `resolveCanonicalRuntimeVenueContext`.
2. Add a focused regression proving runtime topology fails closed when mocked
   raw topology exposes multiple canonical venues.
3. Update module and planning docs so future work treats runtime signal open
   topology as part of the same canonical venue contract.
4. Run focused runtime-loop validation and repository safety checks.

## Acceptance Criteria
- Runtime signal-loop inherited execution context uses the shared canonical
  venue resolver.
- Multiple canonical venues in raw topology exclude the bot from active runtime
  topology instead of silently selecting one.
- Legacy direct `Bot.symbolGroup` remains fallback only when no canonical group
  exists, through the shared resolver.
- Docs and canonical context files record the completed slice.

## Definition of Done
- [x] Runtime signal-loop code uses the shared resolver.
- [x] Focused regression passes.
- [x] Relevant docs/context are updated.
- [x] Validation evidence is recorded.

## Validation Evidence
- Tests:
  - `pnpm --filter api exec vitest run src/modules/engine/runtimeSignalLoopDefaults.test.ts --run` => PASS (`1` file / `6` tests).
  - `pnpm --filter api exec vitest run src/modules/engine/runtimeSignalLoopDefaults.test.ts src/modules/engine/runtimeSignalLoop.service.test.ts --run` => PASS (`2` files / `50` tests).
  - `pnpm --filter api run typecheck` => PASS.
  - `pnpm run lint` => PASS.
  - `pnpm run quality:guardrails` => PASS.
  - `pnpm docs:parity:check` => PASS.
  - `git diff --check` => PASS.
- Manual checks:
  - Code review confirmed no new venue-selection helper was introduced.
- High-risk checks:
  - Ambiguous canonical venues fail closed in the regression fixture.

## Architecture Evidence
- Architecture source reviewed: `docs/architecture/04_runtime-contexts.md`,
  `docs/modules/api-bots.md`, `history/tasks/posdrift-05-canonical-execution-venue-task-2026-05-03.md`.
- Fits approved architecture: yes.
- Mismatch discovered: yes, runtime signal-loop had a parallel local venue
  expression.
- Decision required from user: no.
- Follow-up architecture doc updates: `docs/modules/api-bots.md`.

## Deployment / Ops Evidence
- Deploy impact: medium.
- Env or secret changes: none.
- Health-check impact: none.
- Smoke steps updated: no.
- Rollback note: revert this commit to restore the previous local venue
  expression; no schema or environment change.
- Observability or alerting impact: existing runtime no-open and signal-loop
  telemetry remain unchanged.
- Staged rollout or feature flag: none.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: runtime signal-loop topology still used a local venue-selection
  expression after shared canonical resolver adoption elsewhere.
- Gaps: no regression covered ambiguous canonical venues in runtime topology
  input.
- Inconsistencies: pre-trade, manual open, position reads, and automation used
  the shared resolver, while signal-loop open topology did not.
- Architecture constraints: active canonical `BotMarketGroup` is authoritative;
  direct bot fields are compatibility fallback only.

### 2. Select One Priority Task
- Selected task: POSDRIFT-06 runtime signal-loop canonical venue.
- Priority rationale: PAPER/LIVE open-position decisions sit on the
  money-impacting path reported by the operator.
- Why other candidates were deferred: wider dashboard/read-model sweeps remain
  valid, but this was the smallest confirmed architecture drift in the core
  open pipeline.

### 3. Plan Implementation
- Files or surfaces to modify: runtime signal-loop defaults, focused unit test,
  module docs, planning/context files.
- Logic: call `resolveCanonicalRuntimeVenueContext(bot)` before inherited
  wallet/venue context validation.
- Edge cases: multiple canonical venues, stale direct legacy symbol group,
  legacy bots without canonical groups.

### 4. Execute Implementation
- Implementation notes: runtime signal-loop now reuses the shared resolver and
  does not maintain a second venue-selection contract.

### 5. Verify and Test
- Validation performed: focused runtime signal-loop defaults and runtime loop
  service pack PASS (`50/50`), API typecheck PASS, lint PASS, repository
  guardrails PASS, docs parity PASS, and whitespace check PASS.
- Result: green.

### 6. Self-Review
- Simpler option considered: keep local expression and only document it.
- Technical debt introduced: no.
- Scalability assessment: shared resolver keeps future exchange additions on
  one venue contract.
- Refinements made: added fail-closed ambiguous topology regression.

### 7. Update Documentation and Knowledge
- Docs updated: this task doc, `docs/modules/api-bots.md`,
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

## Notes
- Production deployment/readback is not performed in this local slice.
- `LIVEIMPORT-03` remains the explicit production release/readback task.

## Production-Grade Required Contract

### Goal
Keep runtime signal-loop venue resolution aligned with the shared canonical
runtime venue contract.

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
- Task summary: runtime signal-loop inherited execution context now uses the
  shared canonical runtime venue resolver and fails closed on multiple
  canonical venues.
- Files changed: listed in `Scope`.
- How tested: focused runtime-loop pack PASS (`50/50`), API typecheck PASS,
  lint PASS, repository guardrails PASS, docs parity PASS, and whitespace check
  PASS.
- What is incomplete: production deployment/readback remains outside this
  local iteration.
- Next steps: continue auditing remaining runtime/dashboard drift surfaces for
  local legacy projection reads.
- Decisions made: preserve legacy direct symbol-group fallback only through the
  shared resolver.
