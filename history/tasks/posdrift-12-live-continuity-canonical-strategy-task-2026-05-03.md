# POSDRIFT-12 Live Continuity Canonical Strategy Task

## Header
- ID: POSDRIFT-12
- Title: Keep LIVE reconciliation continuity strategy canonical
- Task Type: fix
- Current Stage: DONE
- Status: DONE
- Owner: Backend Builder
- Depends on: BOTDRIFT-02
- Priority: P0
- Iteration: 15
- Operation Mode: TESTER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
The operator asked to keep auditing LIVE/PAPER position management until
dashboard and runtime truth match. In TESTER mode, the next confirmed edge was
LIVE exchange reconciliation continuity: the default continuity resolver used
direct `Bot.strategyId` when assigning strategy provenance to recovered or
imported exchange-synced positions. If direct bot projection was stale, imported
LIVE rows could receive stale strategy provenance even though canonical
`BotMarketGroup` and `MarketGroupStrategyLink` rows were correct.

## Goal
LIVE reconciliation must resolve bot continuity strategy provenance from active
canonical bot topology before direct legacy `Bot.strategyId`.

## Scope
- `apps/api/src/modules/positions/livePositionReconciliation.service.ts`
- `apps/api/src/modules/positions/livePositionReconciliation.service.test.ts`
- `docs/modules/api-positions.md`
- `docs/planning/mvp-next-commits.md`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`

## Implementation Plan
1. Extract/export the default canonical continuity resolver used by
   reconciliation.
2. Load canonical bot market groups and strategy links in that resolver.
3. Resolve strategy provenance through the canonical update-scope helper before
   direct bot fallback.
4. Add a DB-backed regression where direct `Bot.strategyId` is stale and the
   continuity resolver still returns the canonical strategy link.
5. Run focused and related position/reconciliation/runtime automation checks.

## Acceptance Criteria
- Default LIVE reconciliation continuity context returns canonical primary
  strategy when canonical market-group topology exists.
- Stale direct `Bot.strategyId` cannot label imported/recovered exchange-synced
  positions when canonical strategy links exist.
- Direct `Bot.strategyId` remains compatibility fallback for legacy bots
  without canonical groups.
- Docs/context capture the continuity precedence.

## Definition of Done
- [x] Canonical continuity resolver is implemented.
- [x] Stale direct strategy regression passes.
- [x] Relevant docs/context are updated.
- [x] Validation evidence is recorded.

## Validation Evidence
- Tests:
  - `pnpm --filter api test -- src/modules/positions/livePositionReconciliation.service.test.ts --run --sequence.concurrent=false` => PASS (`23/23`).
  - `pnpm --filter api test -- src/modules/positions/livePositionReconciliation.service.test.ts src/modules/positions/positions.service.test.ts src/modules/positions/positions.orphan-repair.e2e.test.ts src/modules/bots/bots.runtime-takeover.e2e.test.ts src/modules/engine/runtimePositionAutomation.defaultDeps.test.ts --run --sequence.concurrent=false` => PASS (`5` files / `29` tests).
  - `pnpm --filter api run typecheck` => PASS.
- Manual checks:
  - Code review confirmed default reconciliation deps use
    `resolveCanonicalBotContinuityContext`, which resolves canonical topology
    before direct bot fields.
- High-risk checks:
  - Regression mutates direct strategy stale and verifies canonical strategy
    provenance is returned.

## Architecture Evidence
- Architecture source reviewed: `docs/architecture/04_runtime-contexts.md`,
  `docs/modules/api-positions.md`,
  `docs/modules/api-bots.md`.
- Fits approved architecture: yes.
- Mismatch discovered: yes, LIVE reconciliation continuity strategy used direct
  bot projection as primary context.
- Decision required from user: no.
- Follow-up architecture doc updates: `docs/modules/api-positions.md`.

## Deployment / Ops Evidence
- Deploy impact: medium.
- Env or secret changes: none.
- Health-check impact: none.
- Smoke steps updated: no.
- Rollback note: revert this commit to restore direct bot strategy continuity
  fallback; no schema or environment change.
- Observability or alerting impact: existing reconciliation counters and logs
  are unchanged.
- Staged rollout or feature flag: none.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: default reconciliation continuity resolver selected direct
  `Bot.strategyId`.
- Gaps: no regression covered stale direct strategy in default continuity
  resolver.
- Inconsistencies: orphan repair and bot read/update guards were canonical, but
  LIVE exchange reconciliation still had direct strategy provenance.
- Architecture constraints: imported/recovered LIVE position provenance must be
  explicit and canonical when available.

### 2. Select One Priority Task
- Selected task: POSDRIFT-12 LIVE continuity canonical strategy.
- Priority rationale: exchange-synced LIVE rows feed dashboard visibility and
  runtime automation actionability.
- Why other candidates were deferred: UI inline bot edit cleanup remains valid,
  but reconciliation provenance is closer to money-impacting runtime behavior.

### 3. Plan Implementation
- Files or surfaces to modify: live reconciliation service/test,
  positions docs, planning/context files.
- Logic: canonical active market group strategy links first, direct bot
  strategy fallback only for legacy topology.
- Edge cases: stale direct strategy, no canonical groups, multiple strategy
  links using canonical primary order.

### 4. Execute Implementation
- Implementation notes: default deps now reuse exported
  `resolveCanonicalBotContinuityContext`.

### 5. Verify and Test
- Validation performed: focused live reconciliation test PASS (`23/23`),
  wider position/reconciliation/automation pack PASS (`29/29`), API typecheck
  PASS.
- Result: focused and related checks green.

### 6. Self-Review
- Simpler option considered: inline canonical query only inside `defaultDeps`.
- Technical debt introduced: no.
- Scalability assessment: exported resolver is directly testable and reusable
  by future reconciliation or continuity paths.
- Refinements made: resolver reuses existing canonical update-scope helper to
  avoid another local ordering rule.

### 7. Update Documentation and Knowledge
- Docs updated: this task doc, `docs/modules/api-positions.md`,
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
Keep LIVE exchange reconciliation continuity provenance aligned with canonical
bot runtime topology.

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
- Task summary: LIVE reconciliation continuity context now resolves strategy
  from canonical bot market-group strategy links before direct bot fallback.
- Files changed: listed in `Scope`.
- How tested: focused reconciliation PASS (`23/23`), wider
  position/reconciliation/automation pack PASS (`29/29`), API typecheck PASS.
- What is incomplete: production deployment/readback remains outside this
  local iteration.
- Next steps: continue auditing runtime continuity and UI inline bot edit
  payloads for stale direct-field fallback.
- Decisions made: direct `Bot.strategyId` remains compatibility fallback only
  when canonical topology is unavailable.
