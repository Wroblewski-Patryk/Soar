# BOTDRIFT-01 Bot Read Projection Canonical Context Task

## Header
- ID: BOTDRIFT-01
- Title: Keep bot list/get projection canonical-runtime scoped
- Task Type: fix
- Current Stage: DONE
- Status: DONE
- Owner: Backend Builder
- Depends on: DASHDRIFT-02
- Priority: P0
- Iteration: 13
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
The operator asked to continue finding dashboard/runtime mismatches. After the
dashboard modal display fix, the next confirmed drift was the API read model
feeding bot management and dashboard fallbacks: `listBots` / `getBot` still
returned direct `Bot.strategy` and `Bot.symbolGroup` relations first. If direct
bot projections became stale while canonical `BotMarketGroup` and
`MarketGroupStrategyLink` rows were correct, UI consumers could inherit stale
strategy or market context.

## Goal
Bot list/get responses must expose canonical primary market/strategy context
from active bot market-group topology before direct legacy bot projections.

## Scope
- `apps/api/src/modules/bots/bots.repository.ts`
- `apps/api/src/modules/bots/botResponseMapper.service.ts`
- `apps/api/src/modules/bots/bots.runtime-scope.e2e.test.ts`
- `docs/modules/api-bots.md`
- `docs/planning/mvp-next-commits.md`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`

## Implementation Plan
1. Extend bot read projection queries with canonical `botMarketGroups`,
   `symbolGroup`, and enabled strategy link strategy details.
2. Update bot response mapping to overlay canonical primary strategy and symbol
   group before direct `Bot.strategy` / `Bot.symbolGroup`.
3. Keep direct bot projections as compatibility fallback when canonical groups
   are unavailable.
4. Add a regression that intentionally stales direct `Bot.strategyId` and
   verifies list/get still return canonical primary strategy context.
5. Run focused and related bot read/write validation.

## Acceptance Criteria
- `GET /dashboard/bots` and `GET /dashboard/bots/:id` return canonical
  primary `strategyId`, `strategy`, `symbolGroupId`, and `symbolGroup` when
  canonical market-group topology exists.
- Stale direct `Bot.strategyId` cannot override canonical primary strategy in
  dashboard-facing read models.
- Direct fields remain fallback for legacy bots without canonical groups.
- Docs/context capture the read-model precedence.

## Definition of Done
- [x] Canonical list/get response overlay is implemented.
- [x] Stale direct projection regression passes.
- [x] Relevant docs/context are updated.
- [x] Validation evidence is recorded.

## Validation Evidence
- Tests:
  - `pnpm --filter api test -- src/modules/bots/bots.runtime-scope.e2e.test.ts --run --sequence.concurrent=false` => PASS (`10/10`).
  - `pnpm --filter api test -- src/modules/bots/bots.runtime-scope.e2e.test.ts src/modules/bots/bots.e2e.test.ts src/modules/bots/bots.duplicate-guard.e2e.test.ts --run --sequence.concurrent=false` => PASS (`3` files / `41` tests).
  - `pnpm --filter api run typecheck` => PASS.
  - `pnpm run lint` => PASS.
  - `pnpm run quality:guardrails` => PASS.
  - `pnpm docs:parity:check` => PASS.
- Manual checks:
  - Code review confirmed `botMarketGroups` is omitted from API response while
    its canonical context overlays legacy direct fields.
- High-risk checks:
  - Regression directly mutates `Bot.strategyId` stale while canonical link
    remains correct.

## Architecture Evidence
- Architecture source reviewed: `docs/architecture/04_runtime-contexts.md`,
  `docs/modules/api-bots.md`,
  `docs/planning/botmulti-01-post-v1-multi-strategy-contract-task-2026-05-03.md`.
- Fits approved architecture: yes.
- Mismatch discovered: yes, bot list/get read projection still exposed direct
  bot relations as primary display context.
- Decision required from user: no.
- Follow-up architecture doc updates: `docs/modules/api-bots.md`.

## Deployment / Ops Evidence
- Deploy impact: medium.
- Env or secret changes: none.
- Health-check impact: none.
- Smoke steps updated: no.
- Rollback note: revert this commit to restore direct-projection bot list/get
  response semantics; no schema or environment change.
- Observability or alerting impact: existing strategy-drift audit remains
  available for legacy-canonical diagnostics.
- Staged rollout or feature flag: none.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: bot list/get responses loaded direct `strategy` and `symbolGroup`
  relations without canonical primary overlay.
- Gaps: existing tests covered legacy `BotStrategy` divergence but not stale
  direct `Bot.strategyId`.
- Inconsistencies: runtime graph and runtime reads were canonical-first, while
  generic bot read responses could still feed stale fallback context to UI.
- Architecture constraints: selected-bot operator surfaces must reflect
  canonical runtime topology.

### 2. Select One Priority Task
- Selected task: BOTDRIFT-01 bot read projection canonical context.
- Priority rationale: bot list/get are upstream read models for dashboard and
  bot-management UI surfaces.
- Why other candidates were deferred: other UI direct-field references remain
  audit candidates, but this read-model fix removes stale data at the source.

### 3. Plan Implementation
- Files or surfaces to modify: bot repository include, response mapper,
  runtime-scope regression, API bot docs, planning/context files.
- Logic: canonical active market group and primary enabled strategy link
  overlay response fields; direct fields remain fallback.
- Edge cases: stale direct strategy, legacy bot without canonical groups,
  disabled/non-active canonical groups.

### 4. Execute Implementation
- Implementation notes: mapper strips `botMarketGroups` from response and uses
  it only to resolve canonical response context.

### 5. Verify and Test
- Validation performed: focused runtime-scope e2e PASS (`10/10`), wider bot
  read/write/safety pack PASS (`41/41`), API typecheck PASS, lint PASS,
  repository guardrails PASS, and docs parity PASS.
- Result: green.

### 6. Self-Review
- Simpler option considered: patch only web consumers to call runtime graph
  whenever they display strategy context.
- Technical debt introduced: no.
- Scalability assessment: centralizing canonical overlay in API read projection
  reduces UI-side fallback drift and supports future exchange expansion.
- Refinements made: canonical query includes full strategy/symbol-group objects
  so response object fields, not only ids, stay aligned.

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

## Production-Grade Required Contract

### Goal
Keep dashboard-facing bot read projection aligned with canonical runtime
topology.

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
- Task summary: bot list/get responses now overlay canonical primary market and
  strategy context from `BotMarketGroup` / `MarketGroupStrategyLink`.
- Files changed: listed in `Scope`.
- How tested: focused runtime-scope e2e PASS (`10/10`), wider bot
  read/write/safety pack PASS (`41/41`), API typecheck PASS, lint PASS,
  repository guardrails PASS, and docs parity PASS.
- What is incomplete: production deployment/readback remains outside this
  local iteration.
- Next steps: continue auditing UI surfaces that directly edit legacy bot
  context and migrate them to explicit canonical writes where needed.
- Decisions made: direct bot projections remain compatibility fallback only
  when canonical market-group topology is unavailable.
