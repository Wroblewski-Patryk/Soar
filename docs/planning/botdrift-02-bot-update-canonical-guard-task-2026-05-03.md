# BOTDRIFT-02 Bot Update Canonical Guard Task

## Header
- ID: BOTDRIFT-02
- Title: Keep bot update safety guards canonical-context scoped
- Task Type: fix
- Current Stage: DONE
- Status: DONE
- Owner: Backend Builder
- Depends on: BOTDRIFT-01
- Priority: P0
- Iteration: 14
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
The operator asked to keep finding LIVE/PAPER bot-management mismatches. After
bot list/get read projections became canonical-first, the next confirmed drift
was the update guard path: when a bot was saved or activated without explicitly
changing strategy/market fields, duplicate-active and LIVE overlap validation
could still derive target scope from stale direct `Bot.strategyId` /
`Bot.symbolGroupId` instead of active canonical `BotMarketGroup` and
`MarketGroupStrategyLink` state.

## Goal
Bot update safety guards must resolve default target strategy and symbol-group
scope from canonical active bot topology before direct legacy bot fields.

## Scope
- `apps/api/src/modules/bots/botsCommand.service.ts`
- `apps/api/src/modules/bots/botCanonicalUpdateScope.service.ts`
- `apps/api/src/modules/bots/bots.duplicate-guard.e2e.test.ts`
- `docs/modules/api-bots.md`
- `docs/planning/mvp-next-commits.md`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`

## Implementation Plan
1. Add a shared helper that resolves existing bot update scope from active
   canonical market groups and enabled strategy links.
2. Use that helper for duplicate active bot validation when update payload does
   not explicitly replace strategy or market group.
3. Use that helper for LIVE symbol overlap validation and direct projection
   persistence fallback during update.
4. Add a regression where stale direct fields conflict with canonical scope and
   activation must still fail closed.
5. Run focused and related bot write/runtime validations.

## Acceptance Criteria
- Bot activation/update duplicate guard uses canonical active scope when direct
  fields are stale.
- LIVE overlap validation uses canonical symbol-group scope when no new market
  group is supplied.
- Direct bot projection persistence is re-aligned to canonical scope during
  ordinary updates.
- Docs/context capture the update-guard precedence.

## Definition of Done
- [x] Canonical update-scope resolver is implemented.
- [x] Stale direct update activation regression passes.
- [x] Relevant docs/context are updated.
- [x] Validation evidence is recorded.

## Validation Evidence
- Tests:
  - `pnpm --filter api test -- src/modules/bots/bots.duplicate-guard.e2e.test.ts --run --sequence.concurrent=false` => PASS (`6/6`).
  - `pnpm --filter api test -- src/modules/bots/bots.duplicate-guard.e2e.test.ts src/modules/bots/bots.runtime-scope.e2e.test.ts src/modules/bots/bots.e2e.test.ts src/modules/bots/bots.multi-strategy-write.e2e.test.ts --run --sequence.concurrent=false` => PASS (`4` files / `43` tests).
  - `pnpm --filter api run typecheck` => PASS.
  - `pnpm run lint` => PASS before helper extraction.
  - `pnpm run quality:guardrails` => PASS after helper extraction.
  - `pnpm docs:parity:check` => PASS.
- Manual checks:
  - Code review confirmed update guard fallback reads canonical topology first
    and direct fields only when canonical groups are unavailable.
- High-risk checks:
  - Regression mutates direct `Bot.strategyId` and `Bot.symbolGroupId` stale
    before activation; duplicate guard still rejects activation.

## Architecture Evidence
- Architecture source reviewed: `docs/architecture/04_runtime-contexts.md`,
  `docs/modules/api-bots.md`,
  `docs/planning/botmulti-01-post-v1-multi-strategy-contract-task-2026-05-03.md`.
- Fits approved architecture: yes.
- Mismatch discovered: yes, update safety guard target scope could still come
  from direct bot fields.
- Decision required from user: no.
- Follow-up architecture doc updates: `docs/modules/api-bots.md`.

## Deployment / Ops Evidence
- Deploy impact: medium.
- Env or secret changes: none.
- Health-check impact: none.
- Smoke steps updated: no.
- Rollback note: revert this commit to restore direct-field update guard
  fallback; no schema or environment change.
- Observability or alerting impact: existing duplicate/overlap error contracts
  are reused.
- Staged rollout or feature flag: none.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: update safety guards used `existing.strategyId` /
  `existing.symbolGroupId` when payload did not include a new strategy/market.
- Gaps: no regression covered stale direct fields during activation update.
- Inconsistencies: read and runtime paths were canonical-first, but update
  guard target derivation still had a direct-field fallback too early.
- Architecture constraints: activation and LIVE overlap must fail closed.

### 2. Select One Priority Task
- Selected task: BOTDRIFT-02 bot update canonical guard.
- Priority rationale: activation and LIVE overlap validation are safety and
  money-impacting guard paths.
- Why other candidates were deferred: UI inline edit cleanup remains valid, but
  backend safety target derivation has higher blast radius.

### 3. Plan Implementation
- Files or surfaces to modify: bot command service, extracted canonical update
  scope helper, duplicate guard e2e, API bot docs, planning/context files.
- Logic: canonical active market group and enabled strategy links define
  default update target; direct bot fields are compatibility fallback only.
- Edge cases: stale direct strategy, stale direct symbol group, multi-strategy
  enabled links, legacy bot without canonical groups.

### 4. Execute Implementation
- Implementation notes: helper was extracted to keep command service below
  repository monolith guardrail limits.

### 5. Verify and Test
- Validation performed: focused duplicate guard PASS (`6/6`), wider bot
  write/runtime pack PASS (`43/43`), API typecheck PASS, lint PASS before
  extraction, guardrails PASS after extraction, docs parity PASS.
- Result: green after helper extraction.

### 6. Self-Review
- Simpler option considered: patch only duplicate guard target ids locally.
- Technical debt introduced: no.
- Scalability assessment: extracted helper centralizes canonical update target
  resolution for future bot write validations.
- Refinements made: direct projection persistence now also realigns to
  canonical primary context during ordinary updates.

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
Keep bot update safety guards aligned with canonical runtime topology.

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
- Task summary: bot update duplicate/overlap guards now derive default target
  scope from canonical active market-group topology before direct bot fields.
- Files changed: listed in `Scope`.
- How tested: focused duplicate guard PASS (`6/6`), wider bot write/runtime
  pack PASS (`43/43`), API typecheck PASS, lint PASS, guardrails PASS, docs
  parity PASS.
- What is incomplete: production deployment/readback remains outside this
  local iteration.
- Next steps: continue auditing UI inline bot edit payloads and remaining
  runtime continuity fallback paths.
- Decisions made: direct bot fields remain compatibility fallback only when no
  canonical market-group topology is available.
