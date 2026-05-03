# POSDRIFT-11 Legacy Position Repair Canonical Scope Task

## Header
- ID: POSDRIFT-11
- Title: Keep legacy open-position repair canonical-market scoped
- Task Type: fix
- Current Stage: DONE
- Status: DONE
- Owner: Backend Builder
- Depends on: POSDRIFT-10
- Priority: P0
- Iteration: 11
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
The operator asked to keep auditing LIVE/PAPER position management until the
dashboard reflects real runtime behavior. After the manual-order ambiguity
fix, the next confirmed drift was the local orphan repair path for open
positions with `botId = null`: it selected candidate bots from direct legacy
`Bot.symbolGroup` and wrote direct legacy `Bot.strategyId` back onto repaired
positions, even when active canonical `BotMarketGroup` and
`MarketGroupStrategyLink` rows existed.

## Goal
Legacy open-position repair must use active canonical market groups and enabled
strategy links before any direct legacy bot projections, and must not assign a
stale direct strategy to a repaired runtime position.

## Scope
- `apps/api/src/modules/positions/positions.service.ts`
- `apps/api/src/modules/positions/positions.service.test.ts`
- `docs/modules/api-positions.md`
- `docs/planning/mvp-next-commits.md`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`

## Implementation Plan
1. Load active enabled `BotMarketGroup` rows and enabled
   `MarketGroupStrategyLink` rows for repair candidates.
2. Match orphaned position symbols against canonical group symbols when any
   active canonical group exists, falling back to direct `Bot.symbolGroup` only
   for legacy bots without canonical groups.
3. Resolve repaired `strategyId` from existing position provenance or a single
   canonical enabled strategy link; leave it `null` instead of guessing when
   ambiguous or unavailable.
4. Add a regression proving canonical BTC repair succeeds while a stale direct
   ETH projection does not claim an orphan.
5. Run focused and related position ownership validation.

## Acceptance Criteria
- Active canonical market group symbols decide legacy open-position repair
  before direct bot projections.
- Stale direct bot market projections cannot claim unrelated orphan positions
  when canonical groups exist.
- Repaired positions receive canonical strategy provenance only when it is
  deterministic.
- Docs/context capture the canonical repair contract.

## Definition of Done
- [x] Canonical repair matching is implemented.
- [x] Stale direct projection regression passes.
- [x] Relevant docs/context are updated.
- [x] Validation evidence is recorded.

## Validation Evidence
- Tests:
  - `pnpm --filter api test -- src/modules/positions/positions.service.test.ts --run --sequence.concurrent=false` => PASS (`1/1`).
  - `pnpm --filter api test -- src/modules/positions/positions.service.test.ts src/modules/positions/positions.orphan-repair.e2e.test.ts src/modules/positions/positions.takeover-status.e2e.test.ts src/modules/positions/livePositionReconciliation.service.test.ts src/modules/bots/bots.runtime-takeover.e2e.test.ts --run --sequence.concurrent=false` => PASS (`5` files / `33` tests).
  - `pnpm --filter api run typecheck` => PASS.
  - `pnpm run lint` => PASS.
  - `pnpm run quality:guardrails` => PASS.
  - `pnpm docs:parity:check` => PASS.
- Manual checks:
  - Code review confirmed direct `Bot.symbolGroup` and `Bot.strategyId` are
    used only as legacy fallback when no active canonical repair group exists.
- High-risk checks:
  - Regression covers stale direct market and stale direct strategy projection.

## Architecture Evidence
- Architecture source reviewed: `docs/architecture/01_overview-and-principles.md`,
  `docs/modules/api-positions.md`,
  `docs/planning/botmulti-01-post-v1-multi-strategy-contract-task-2026-05-03.md`.
- Fits approved architecture: yes.
- Mismatch discovered: yes, local orphan repair still trusted direct bot
  projections before canonical runtime topology.
- Decision required from user: no.
- Follow-up architecture doc updates: `docs/modules/api-positions.md`.

## Deployment / Ops Evidence
- Deploy impact: medium.
- Env or secret changes: none.
- Health-check impact: none.
- Smoke steps updated: no.
- Rollback note: revert this commit to restore direct-projection orphan repair;
  no schema or environment change.
- Observability or alerting impact: existing repair response counters continue
  to expose `reboundToCanonicalBot`, `closedDetachedOrphans`, and `unresolved`.
- Staged rollout or feature flag: none.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: `repairLegacyOpenPositions` selected bots by direct
  `Bot.symbolGroup` and wrote direct `Bot.strategyId` to repaired positions.
- Gaps: no regression covered stale direct projections after canonical bot
  market/strategy changes.
- Inconsistencies: runtime ownership and manual-order flows were canonical, but
  the local repair path still used duplicated legacy fields.
- Architecture constraints: runtime ownership context must be explicit and must
  fail closed instead of guessing critical trading context.

### 2. Select One Priority Task
- Selected task: POSDRIFT-11 legacy open-position repair canonical scope.
- Priority rationale: orphan repair affects dashboard-visible positions and
  bot-managed lifecycle continuity for LIVE/PAPER runtime rows.
- Why other candidates were deferred: other dashboard projection audits remain
  valid, but this was the next confirmed write path that could persist wrong
  ownership/provenance.

### 3. Plan Implementation
- Files or surfaces to modify: position service, focused regression test,
  module docs, planning/context files.
- Logic: canonical active groups and enabled links are first-class repair
  context; direct fields are compatibility fallback only when canonical groups
  do not exist.
- Edge cases: stale direct market group, stale direct strategy, wallet-only
  orphan, single canonical strategy, ambiguous multi-strategy canonical scope.

### 4. Execute Implementation
- Implementation notes: repair matching now returns a resolved owner context,
  including the deterministic strategy to persist.

### 5. Verify and Test
- Validation performed: focused position repair regression PASS, wider
  positions/takeover/reconciliation pack PASS (`33/33`), API typecheck PASS,
  lint PASS, repository guardrails PASS, and docs parity PASS.
- Result: green.

### 6. Self-Review
- Simpler option considered: only change symbol matching and keep writing
  direct `Bot.strategyId`.
- Technical debt introduced: no.
- Scalability assessment: the resolved repair context can support future
  exchange-specific repair evidence without duplicating selection logic.
- Refinements made: strategy assignment now preserves existing position
  provenance or single canonical strategy instead of stale direct fallback.

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
Keep local open-position repair aligned with canonical bot runtime topology.

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
- Task summary: legacy open-position repair now resolves bot ownership and
  strategy provenance from active canonical market groups and enabled strategy
  links before direct legacy fields.
- Files changed: listed in `Scope`.
- How tested: focused position repair regression PASS, wider
  positions/takeover/reconciliation pack PASS (`33/33`), API typecheck PASS,
  lint PASS, repository guardrails PASS, and docs parity PASS.
- What is incomplete: production deployment/readback remains outside this
  local iteration.
- Next steps: continue auditing dashboard projection and runtime position
  continuity paths for stale direct-field fallback.
- Decisions made: direct `Bot.symbolGroup` and `Bot.strategyId` remain
  compatibility fallback only when no active canonical repair groups exist.
