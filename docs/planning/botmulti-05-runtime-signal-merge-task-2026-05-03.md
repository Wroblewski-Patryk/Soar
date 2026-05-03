# Task

## Header
- ID: BOTMULTI-05
- Title: runtime(signal-merge): execute deterministic multi-strategy evaluation per bot
- Task Type: feature
- Current Stage: verification
- Status: DONE
- Owner: Backend Builder
- Depends on: BOTMULTI-04
- Priority: P1
- Iteration: 2026-05-03 post-V1 BOTMULTI activation, iteration 5
- Operation Mode: TESTER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
`BOTMULTI-04` added API writes for multiple canonical strategy links. Runtime
topology still needs to consume that canonical link set instead of evaluating
only the compatibility `Bot.strategyId` projection.

## Goal
Execute final-candle runtime decisions by evaluating all eligible enabled
strategy links in the one active market scope and merging their votes through
the approved deterministic merge contract.

## Scope
- `apps/api/src/modules/engine/runtimeSignalLoop.repository.ts`
- `apps/api/src/modules/engine/runtimeSignalLoopDefaults.ts`
- `apps/api/src/modules/engine/runtimeSignalLoop.service.ts`
- `apps/api/src/modules/engine/runtimeFinalCandleDecision.service.ts`
- focused runtime tests
- BOTMULTI planning/context docs

## Success Signal
- User or operator problem: runtime would persist multi-strategy links but still
  execute only one projected strategy.
- Expected product or reliability outcome: runtime evaluates all enabled links,
  records merge provenance, and sizes/orders from the winning primary strategy.
- How success will be observed: focused runtime tests prove canonical links are
  used and merged deterministically.
- Post-launch learning needed: no.

## Deliverable For This Stage
Runtime topology and final-candle decision logic that uses the canonical
multi-strategy set.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within the declared current stage unless explicit approval changes it

## Definition of Done
- [x] Active runtime topology reads enabled canonical strategy links.
- [x] Final-candle decision evaluates all interval-eligible strategies.
- [x] Vote priority/weight comes from `MarketGroupStrategyLink`.
- [x] Winning strategy provenance drives signal/order context.
- [x] Focused validations pass and docs/context are synchronized.

## Forbidden
- runtime fallback that prefers legacy `Bot.strategyId` when canonical links exist
- parallel merge logic outside `mergeRuntimeStrategyVotes`
- silent execution without strategy provenance
- UI/API scope creep

## Validation Evidence
- Tests:
  - `pnpm --filter api run test -- --run src/modules/engine/runtimeSignalLoop.service.test.ts src/modules/engine/runtimeSignalLoopDefaults.test.ts src/modules/engine/runtimeSignalMerge.test.ts`
    PASS (`3` files / `50` tests).
  - `pnpm --filter api run typecheck` PASS.
  - `pnpm run docs:parity:check` PASS.
  - `pnpm run quality:guardrails` PASS.
- Manual checks: runtime repository now loads enabled canonical links from the
  active `BotMarketGroup`; default context uses canonical links before the
  legacy projection; final-candle decision evaluates all interval-matching
  runtime strategies and passes link priority/weight into
  `mergeRuntimeStrategyVotes`.
- Screenshots/logs: not applicable
- High-risk checks: no hidden single-strategy fallback when canonical links
  exist; direct `Bot.strategyId` remains fallback-only for legacy rows.

## Architecture Evidence
- Architecture source reviewed: domain model, runtime contexts, signal merge
  contract, execution lifecycle.
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: user approved safe
  architecture-first continuation on 2026-05-03.
- Follow-up architecture doc updates: runtime execution note if behavior
  changes.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: topology reads only direct bot strategy projection.
- Gaps: final-candle decision wraps a single strategy into the vote set.
- Inconsistencies: canonical API can persist N links, but runtime still
  executes one.
- Architecture constraints: one active market scope and deterministic merge.

### 2. Select One Priority Task
- Selected task: `BOTMULTI-05`.
- Priority rationale: runtime must use the canonical link set before lifecycle
  ownership and UI truth can be completed.
- Why other candidates were deferred: risk/lifecycle and UI depend on runtime
  provenance.

### 3. Plan Implementation
- Files or surfaces to modify: runtime topology query/default mapping, routing,
  final-candle decision, focused tests, planning docs.
- Logic: build `runtimeContext.strategies` from enabled canonical links ordered
  by lower numeric priority, fallback to direct projection only when no
  canonical links exist.
- Edge cases: no enabled links, interval mismatch, merged no-trade, winning
  strategy unavailable for sizing.

### 4. Execute Implementation
- Implementation notes: runtime topology query now includes active market
  groups and enabled strategy links, runtime defaults build
  `runtimeContext.strategies`, routing indexes all strategy intervals, and
  final-candle decision merges all eligible strategy votes through the existing
  merge helper.

### 5. Verify and Test
- Validation performed: focused runtime topology/merge tests, API typecheck,
  docs parity, and repository guardrails.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: call merge helper with the one projected strategy.
  Rejected because it would preserve the exact BOTMULTI drift.
- Technical debt introduced: no
- Scalability assessment: strategy list remains scoped to one active market
  group.
- Refinements made: legacy fixtures remain compatible through fallback
  defaults, while production canonical links are preferred whenever present.

### 7. Update Documentation and Knowledge
- Docs updated: architecture signal-flow note, BOTMULTI plan, MVP queue, MVP
  execution plan.
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

- Task summary: runtime now evaluates the enabled canonical strategy-link set
  for a bot's one active market scope and merges interval-eligible votes
  deterministically before orchestration.
- Files changed: runtime topology repository/defaults/service/final-candle
  decision, focused runtime tests, architecture and planning/context docs.
- How tested: focused runtime tests (`3` files / `50` tests), API typecheck,
  docs parity, and repository guardrails.
- What is incomplete: UI/operator exposure and lifecycle-risk ownership
  hardening remain for later BOTMULTI slices.
- Next steps: execute `BOTMULTI-06` runtime risk/lifecycle ownership slice.
- Decisions made: lower numeric strategy-link priority remains canonical;
  direct `Bot.strategyId` stays compatibility fallback only when no canonical
  enabled links exist.
