# Task

## Header
- ID: RUNTIME-AUDIT-11
- Title: Scope final-candle managed external-position guard to owner bot
- Task Type: fix
- Current Stage: release
- Status: DONE
- Owner: Backend Builder
- Depends on: RUNTIME-AUDIT-10
- Priority: P0
- Iteration: 29
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
After pre-trade same-symbol and bot-cap checks were scoped to the selected bot,
the final-candle runtime guard still built managed external-position keys as
`userId:symbol`. That could block a bot's signal because another bot owned an
imported LIVE `EXCHANGE_SYNC` position on the same symbol.

## Goal
Make final-candle `EXTERNAL_POSITION_ALREADY_OPEN` blocking use deterministic
owner bot scope instead of user-wide symbol scope.

## Scope
- `apps/api/src/modules/engine/runtimeFinalCandleDecision.service.ts`
- `apps/api/src/modules/engine/runtimeSignalLoop.repository.ts`
- `apps/api/src/modules/engine/runtimeSignalLoopDefaults.ts`
- `apps/api/src/modules/engine/runtimeFinalCandleDecision.service.test.ts`
- `apps/api/src/modules/engine/runtimeSignalLoopDefaults.test.ts`
- `docs/modules/api-engine.md`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`
- `docs/planning/mvp-next-commits.md`

## Success Signal
- User or operator problem: one bot's imported LIVE position no longer blocks
  another bot's runtime open signal on the same symbol.
- Expected product or reliability outcome: final-candle signal execution,
  pre-trade, and dashboard ownership use the same bot-scoped ownership model.
- How success will be observed: regression allows another bot to continue and
  blocks only the bot that owns the managed external position.
- Post-launch learning needed: no

## Deliverable For This Stage
Release-ready code, focused regressions, source-of-truth updates, and validation
evidence for this one final-candle guard slice.

## Constraints
- Reuse existing external-position ownership index.
- Do not introduce a new ownership model.
- Do not block by user+symbol when owner bot is known.
- Keep unresolved imported rows out of bot-scoped final-candle blocking.

## Implementation Plan
1. Extend runtime managed external-position payloads with `botId`, `walletId`,
   and `externalId`.
2. Hydrate owner bot for imported `botId=null` rows from
   `externalId -> apiKeyId -> resolveExternalPositionOwnershipIndex`.
3. Build final-candle managed external keys as `userId:botId:symbol`.
4. Add regressions for other-bot allow and owner-bot block.
5. Update engine docs and planning context.
6. Run focused and broader runtime validations.

## Acceptance Criteria
- [x] A managed external position owned by another bot does not block the
  selected bot's final-candle open signal.
- [x] A managed external position owned by the selected bot still blocks with
  `EXTERNAL_POSITION_ALREADY_OPEN`.
- [x] Imported `botId=null` rows are owner-hydrated using the shared ownership
  index.
- [x] Focused final-candle/defaults tests pass.

## Definition of Done
- [x] `DEFINITION_OF_DONE.md` considered for runtime safety.
- [x] No workaround or hidden bypass introduced.
- [x] Regression coverage added.
- [x] Relevant docs and context updated.
- [x] Relevant validations passed.

## Stage Exit Criteria
- [x] The output matches the declared `Current Stage`.
- [x] Work from later stages was not mixed in without explicit approval.
- [x] Risks and assumptions for this stage are stated clearly.

## Forbidden
- User-wide symbol blocking for known owner-bot imports.
- New ownership systems.
- Mock-only behavior without production path changes.
- Broad refactors outside final-candle managed external guards.

## Validation Evidence
- Tests:
  - `pnpm --filter api run test -- --run src/modules/engine/runtimeFinalCandleDecision.service.test.ts src/modules/engine/runtimeSignalLoopDefaults.test.ts --sequence.concurrent=false` PASS (`18/18`)
  - `pnpm --filter api run test -- --run src/modules/engine/runtimeFinalCandleDecision.service.test.ts src/modules/engine/runtimeSignalLoopDefaults.test.ts src/modules/engine/preTrade.service.test.ts src/modules/engine/preTrade.e2e.test.ts src/modules/engine/runtimeSignalLoop.service.test.ts src/modules/backtests/backtests.e2e.test.ts --sequence.concurrent=false` PASS (`100/100`)
  - `pnpm run typecheck` PASS
  - `pnpm run quality:guardrails` PASS
  - `pnpm run lint` PASS
  - `git diff --check` PASS
- Manual checks:
  - Final-candle managed external key now includes `botId`.
- Screenshots/logs: not applicable.
- High-risk checks:
  - Unresolved imported rows are not converted into selected-bot blocking keys.

## Architecture Evidence
- Architecture source reviewed:
  - `docs/modules/api-engine.md`
  - `docs/architecture/06_execution-lifecycle.md`
  - `docs/architecture/07_modes-parity-and-data.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: `docs/modules/api-engine.md`

## Deployment / Ops Evidence
- Deploy impact: low
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no
- Rollback note: revert this commit to restore previous user+symbol guard.
- Observability or alerting impact: existing `PRETRADE_BLOCKED` diagnostics are
  preserved, but false positives are reduced.
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: final-candle guard keyed managed external positions by user+symbol.
- Gaps: pre-trade and bot cap paths were bot-scoped, but this earlier guard was
  still user-wide.
- Inconsistencies: another bot's imported LIVE position could block the
  selected bot before bot-scoped pre-trade ran.
- Architecture constraints: use shared ownership proof.

### 2. Select One Priority Task
- Selected task: `RUNTIME-AUDIT-11`.
- Priority rationale: runtime open pipeline false-block in LIVE/PAPER parity
  path.
- Why other candidates were deferred: manual-order and orchestrator lookup
  follow-ups need separate proof and tests.

### 3. Plan Implementation
- Files or surfaces to modify: final-candle guard, runtime defaults mapping,
  repository select, focused tests, docs.
- Logic: hydrate owner bot and key managed external guards by user+bot+symbol.
- Edge cases: direct `botId` rows, imported `botId=null` rows, unresolved
  ownership, same symbol in another bot.

### 4. Execute Implementation
- Implementation notes: reused `parseApiKeyIdFromExternalPositionId`,
  `resolveExternalPositionOwnershipIndex`, and `getExternalPositionOwnership`.

### 5. Verify and Test
- Validation performed: focused final-candle/defaults pack.
- Result: PASS (`18/18`), broader runtime/pre-trade/backtest pack PASS
  (`100/100`), typecheck PASS, guardrails PASS, lint PASS, diff check PASS.

### 6. Self-Review
- Simpler option considered: remove the guard and rely only on pre-trade.
- Technical debt introduced: no
- Scalability assessment: ownership indexes are cached per user during the
  managed-position list hydration.
- Refinements made: unresolved rows remain unowned for this bot-scoped guard.

### 7. Update Documentation and Knowledge
- Docs updated: `docs/modules/api-engine.md`, this task doc.
- Context updated: task board, project state, next commits queue.
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
- [x] Docs or context were updated if repository truth changed.
- [x] Learning journal was updated if a recurring pitfall was confirmed.

## Result Report
Final-candle runtime managed external-position blocking now uses owner-bot
scope. This removes the user-wide `userId:symbol` false block while keeping the
owner bot protected from opening on a symbol it already owns through a managed
LIVE import.
