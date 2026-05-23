# POSDRIFT-08 Wallet Update Canonical Market Scope Task

## Header
- ID: POSDRIFT-08
- Title: Keep wallet update validation on canonical bot market scope
- Task Type: fix
- Current Stage: DONE
- Status: DONE
- Owner: Backend Builder
- Depends on: POSDRIFT-07
- Priority: P0
- Iteration: 8
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
The operator asked to continue auditing wallet, markets, strategies, and
LIVE/PAPER position management drift. After `POSDRIFT-07`, the next confirmed
write-side drift was wallet update validation for existing bots:
`assertWalletContextMatchesExistingBotMarketGroups` checked the direct legacy
`Bot.symbolGroup` projection instead of active canonical `BotMarketGroup`
market scope.

## Goal
Changing a bot wallet must validate the target wallet against the bot's active
canonical market scope, so stale direct `Bot.symbolGroupId` cannot allow a
wallet whose venue does not match the real assigned market group.

## Scope
- `apps/api/src/modules/bots/botContextValidation.service.ts`
- `apps/api/src/modules/bots/botContextValidation.service.test.ts`
- `docs/modules/api-bots.md`
- `docs/planning/mvp-next-commits.md`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`

## Implementation Plan
1. Load active enabled canonical `BotMarketGroup.symbolGroup.marketUniverse`
   rows when validating wallet updates for an existing bot.
2. Validate the requested wallet against canonical scopes first.
3. Preserve direct legacy `Bot.symbolGroup` fallback only for bots without
   canonical groups.
4. Add DB-backed regression coverage for stale direct projection and legacy
   fallback.
5. Run focused and related bot write-validation checks.

## Acceptance Criteria
- Wallet update validation rejects a wallet that matches stale direct
  `Bot.symbolGroup` but mismatches the active canonical market group.
- Legacy bots without canonical market groups still validate against direct
  `Bot.symbolGroup`.
- Existing bot ownership and duplicate/live overlap validations remain green.
- Docs/context capture the new invariant and validation evidence.

## Definition of Done
- [x] Wallet update validation is canonical-first.
- [x] Stale direct projection regression passes.
- [x] Legacy fallback regression passes.
- [x] Relevant docs/context are updated.
- [x] Validation evidence is recorded.

## Validation Evidence
- Tests:
  - `pnpm --filter api exec vitest run src/modules/bots/botContextValidation.service.test.ts --run --sequence.concurrent=false` => PASS (`1` file / `2` tests).
  - `pnpm --filter api exec vitest run src/modules/bots/botContextValidation.service.test.ts src/modules/bots/botOwnership.service.test.ts src/modules/bots/bots.duplicate-guard.e2e.test.ts src/modules/bots/bots.e2e.test.ts --run --sequence.concurrent=false` => PASS (`4` files / `35` tests).
  - `pnpm --filter api run typecheck` => PASS.
  - `pnpm run lint` => PASS.
  - `pnpm run quality:guardrails` => PASS.
  - `pnpm docs:parity:check` => PASS.
- Manual checks:
  - Code review confirmed direct `Bot.symbolGroup` remains fallback only when
    no active canonical market group exists.
- High-risk checks:
  - Regression explicitly stales direct `Bot.symbolGroupId` to a SPOT group
    while the canonical active group remains FUTURES.

## Architecture Evidence
- Architecture source reviewed: `docs/architecture/04_runtime-contexts.md`,
  `docs/modules/api-bots.md`.
- Fits approved architecture: yes.
- Mismatch discovered: yes, wallet update validation used legacy direct market
  projection for existing bot market scope.
- Decision required from user: no.
- Follow-up architecture doc updates: `docs/modules/api-bots.md`.

## Deployment / Ops Evidence
- Deploy impact: medium.
- Env or secret changes: none.
- Health-check impact: none.
- Smoke steps updated: no.
- Rollback note: revert this commit to restore direct-projection-only wallet
  update validation; no schema or environment change.
- Observability or alerting impact: existing
  `WALLET_MARKET_CONTEXT_MISMATCH` domain error remains unchanged.
- Staged rollout or feature flag: none.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: wallet update validation checked only direct `Bot.symbolGroup`.
- Gaps: no regression covered stale direct bot market projection during wallet
  update validation.
- Inconsistencies: bot creation and runtime paths were canonical-first, while
  existing-bot wallet updates could validate against stale direct scope.
- Architecture constraints: active canonical `BotMarketGroup` is authoritative;
  direct bot fields are compatibility fallback only.

### 2. Select One Priority Task
- Selected task: POSDRIFT-08 wallet update canonical market scope.
- Priority rationale: wallet changes define PAPER/LIVE execution venue and are
  money-impacting.
- Why other candidates were deferred: manual context and response projection
  audit remain valid, but this was the first confirmed wallet/market write
  safety drift.

### 3. Plan Implementation
- Files or surfaces to modify: bot context validation service, focused service
  test, module docs, planning/context files.
- Logic: active canonical market group scopes first; direct legacy group only
  when no canonical scopes exist.
- Edge cases: stale direct projection, legacy bot without canonical group,
  multiple active scopes in corrupted raw data.

### 4. Execute Implementation
- Implementation notes: validation now iterates the resolved market scopes and
  keeps the existing mismatch error shape.

### 5. Verify and Test
- Validation performed: focused DB-backed context validation test PASS
  (`2/2`), wider bot write/runtime DB pack PASS (`35/35`), API typecheck PASS,
  lint PASS, repository guardrails PASS, and docs parity PASS.
- Result: green.

### 6. Self-Review
- Simpler option considered: check direct and canonical groups together.
- Technical debt introduced: no.
- Scalability assessment: canonical-first scope keeps future exchange support
  on the same wallet/market compatibility contract.
- Refinements made: retained legacy fallback for bots without canonical groups.

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
Keep wallet update safety aligned with canonical bot market scope.

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
- Task summary: existing-bot wallet update validation now checks active
  canonical market groups before legacy direct bot symbol groups.
- Files changed: listed in `Scope`.
- How tested: focused bot context validation test PASS (`2/2`), wider bot
  write/runtime DB pack PASS (`35/35`), API typecheck PASS, lint PASS,
  repository guardrails PASS, and docs parity PASS.
- What is incomplete: production deployment/readback remains outside this
  local iteration.
- Next steps: continue auditing manual-order context and dashboard response
  projection seams for legacy projection drift.
- Decisions made: preserve legacy direct fallback only for bots without active
  canonical market groups.
