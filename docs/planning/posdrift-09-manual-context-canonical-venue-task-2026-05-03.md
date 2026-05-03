# POSDRIFT-09 Manual Context Canonical Venue Task

## Header
- ID: POSDRIFT-09
- Title: Keep manual-order context venue on canonical bot market scope
- Task Type: fix
- Current Stage: DONE
- Status: DONE
- Owner: Backend Builder
- Depends on: POSDRIFT-08
- Priority: P0
- Iteration: 9
- Operation Mode: ARCHITECT

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
The operator asked to keep auditing LIVE/PAPER opening, management, closing,
wallet, markets, strategies, and dashboard truth. After wallet and LIVE overlap
write guards were aligned with canonical market scope, the next architecture
drift was in the manual-order context read path: strategy context was already
canonical-first, but venue-dependent leverage, margin mode, exchange rules, and
mark-price connector selection still used duplicated `Bot.exchange/marketType`.

## Goal
Manual-order context must resolve venue from active canonical
`BotMarketGroup.symbolGroup.marketUniverse` before legacy bot projections, so
dashboard manual-order previews and PAPER market-fill helpers use the same venue
contract as manual open execution.

## Scope
- `apps/api/src/modules/orders/orders.manualContext.service.ts`
- `apps/api/src/modules/orders/orders.service.test.ts`
- `docs/modules/api-orders.md`
- `docs/planning/mvp-next-commits.md`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`

## Implementation Plan
1. Load active canonical market groups in manual-order context bot lookup.
2. Resolve venue through `resolveCanonicalRuntimeVenueContext`.
3. Use resolved venue for leverage/margin-mode semantics, public connector
   selection, and exchange metadata fallback.
4. Preserve duplicated bot venue fallback only for legacy bots without
   canonical groups, and fail closed when canonical groups are ambiguous.
5. Extend existing manual-context regression so stale direct `Bot.marketType`
   cannot override canonical venue.

## Acceptance Criteria
- Manual-order context uses canonical venue for connector/rules/price lookup.
- Manual-order context uses canonical market type for leverage and margin-mode
  semantics.
- Stale direct `Bot.marketType=SPOT` cannot downgrade a canonical FUTURES
  manual context to `1x/NONE`.
- Existing manual-order context behavior remains green.

## Definition of Done
- [x] Manual-order context venue is canonical-first.
- [x] Stale direct venue regression passes.
- [x] Relevant docs/context are updated.
- [x] Validation evidence is recorded.

## Validation Evidence
- Tests:
  - `pnpm --filter api exec vitest run src/modules/orders/orders.service.test.ts --run -t "getManualOrderContext" --sequence.concurrent=false` => PASS (`5` tests, `19` skipped).
  - `pnpm --filter api exec vitest run src/modules/orders/orders.service.test.ts src/modules/orders/orders-positions.e2e.test.ts src/modules/bots/bots.market-universe-contract.e2e.test.ts --run --sequence.concurrent=false` => PASS (`3` files / `48` tests).
  - `pnpm --filter api run typecheck` => PASS.
  - `pnpm run lint` => PASS.
  - `pnpm run quality:guardrails` => PASS.
  - `pnpm docs:parity:check` => PASS.
- Manual checks:
  - Code review confirmed the service uses the shared canonical venue resolver
    and keeps duplicated bot venue only as legacy fallback.
- High-risk checks:
  - Regression explicitly sets direct `Bot.marketType=SPOT` while canonical
    active market group remains FUTURES.

## Architecture Evidence
- Architecture source reviewed: `docs/architecture/04_runtime-contexts.md`,
  `docs/modules/api-orders.md`, `docs/modules/api-bots.md`.
- Fits approved architecture: yes.
- Mismatch discovered: yes, manual-order context had a parallel venue source
  from duplicated bot fields.
- Decision required from user: no.
- Follow-up architecture doc updates: `docs/modules/api-orders.md`.

## Deployment / Ops Evidence
- Deploy impact: medium.
- Env or secret changes: none.
- Health-check impact: none.
- Smoke steps updated: no.
- Rollback note: revert this commit to restore duplicated bot venue use in
  manual-order context; no schema or environment change.
- Observability or alerting impact: none; existing read-path degraded rules and
  price behavior remains unchanged.
- Staged rollout or feature flag: none.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: manual-order context used duplicated bot venue for exchange connector,
  metadata fallback, leverage, and margin-mode semantics.
- Gaps: no regression covered stale direct `Bot.marketType` while canonical
  market group used a different market type.
- Inconsistencies: manual open execution was canonical venue aligned, but the
  dashboard context preview was not.
- Architecture constraints: active canonical market universe owns venue context;
  duplicated bot venue fields are compatibility projections only.

### 2. Select One Priority Task
- Selected task: POSDRIFT-09 manual context canonical venue.
- Priority rationale: dashboard manual-order previews influence operator order
  inputs and PAPER market-fill fallback.
- Why other candidates were deferred: multi-strategy manual ambiguity remains a
  valid audit target, but this venue drift had a smaller confirmed fix and
  direct regression.

### 3. Plan Implementation
- Files or surfaces to modify: manual-order context service, order service
  tests, module docs, planning/context files.
- Logic: shared canonical venue resolver first; legacy duplicated bot venue
  only when no canonical groups exist; ambiguous canonical groups fail closed.
- Edge cases: stale direct SPOT vs canonical FUTURES, legacy no canonical
  groups, unavailable rules/price fetch.

### 4. Execute Implementation
- Implementation notes: connector selection, metadata fallback, leverage, and
  margin mode now use resolved venue.

### 5. Verify and Test
- Validation performed: focused manual-order context tests PASS (`5` tests),
  wider orders/manual-context DB pack PASS (`48/48`), API typecheck PASS, lint
  PASS, repository guardrails PASS, and docs parity PASS.
- Result: green.

### 6. Self-Review
- Simpler option considered: only change connector selection.
- Technical debt introduced: no.
- Scalability assessment: venue resolution now stays centralized for future
  exchange support.
- Refinements made: ambiguous canonical venue input returns no context instead
  of falling back to duplicated bot fields.

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
Keep manual-order preview/read context aligned with canonical execution venue.

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
- Task summary: manual-order context now resolves venue from canonical bot
  market scope before duplicated bot fields.
- Files changed: listed in `Scope`.
- How tested: focused manual-order context test pack PASS, wider
  orders/manual-context DB pack PASS (`48/48`), API typecheck PASS, lint PASS,
  repository guardrails PASS, and docs parity PASS.
- What is incomplete: production deployment/readback remains outside this
  local iteration.
- Next steps: continue auditing manual-order multi-strategy ambiguity and
  dashboard response projection seams.
- Decisions made: ambiguous canonical venue input fails closed instead of
  falling back to duplicated bot venue.
