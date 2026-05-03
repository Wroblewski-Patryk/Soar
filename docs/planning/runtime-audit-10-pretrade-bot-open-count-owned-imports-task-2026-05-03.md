# Task

## Header
- ID: RUNTIME-AUDIT-10
- Title: Count owned LIVE imports in pre-trade bot open-position caps
- Task Type: fix
- Current Stage: release
- Status: DONE
- Owner: Backend Builder
- Depends on: RUNTIME-AUDIT-09
- Priority: P0
- Iteration: 28
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
Operator runtime audit found another LIVE/PAPER position-management drift after
bot-scoped same-symbol pre-trade checks were fixed. `maxOpenPositionsPerBot`
still counted only direct `Position.botId` rows. LIVE imported exchange rows
that are deterministically owned by the selected bot are stored as
`EXCHANGE_SYNC` with `botId = null`, so the bot cap could undercount real LIVE
exposure.

## Goal
Make pre-trade bot open-position caps count the same bot-owned LIVE imported
positions that dashboard/runtime ownership paths already recognize.

## Scope
- `apps/api/src/modules/engine/preTrade.service.ts`
- `apps/api/src/modules/engine/preTrade.e2e.test.ts`
- `docs/modules/api-engine.md`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`
- `docs/planning/mvp-next-commits.md`

## Success Signal
- User or operator problem: LIVE bot decisions no longer ignore owned imported
  exchange positions when enforcing per-bot open-position caps.
- Expected product or reliability outcome: dashboard-visible owned LIVE imports
  and pre-trade risk decisions use one ownership model.
- How success will be observed: regression blocks a second LIVE open when an
  owned imported position already reaches `maxOpenPositionsPerBot`.
- Post-launch learning needed: no

## Deliverable For This Stage
Release-ready code, regression test, docs/context updates, and validation
evidence for this single pre-trade cap slice.

## Constraints
- Use existing external-position ownership index and owned-symbol resolver.
- Do not count ambiguous, manual-only, unowned, or off-wallet imported rows.
- Keep PAPER counts direct-bot scoped.
- Do not change DB schema or introduce a parallel ownership system.

## Implementation Plan
1. Extend pre-trade bot count reads with runtime mode.
2. Include LIVE owned `EXCHANGE_SYNC` / `BOT_MANAGED` rows in bot counts only
   when ownership proves the same bot/wallet/API key.
3. Keep bot-count cache separated by mode.
4. Add an e2e regression for owned imported LIVE rows reaching
   `maxOpenPositionsPerBot`.
5. Update engine and planning source-of-truth docs.
6. Run focused and broader runtime validations.

## Acceptance Criteria
- [x] PAPER bot counts remain direct `botId` counts.
- [x] LIVE bot counts include direct `botId` rows and owned imported rows.
- [x] Imported rows require `EXCHANGE_SYNC`, `BOT_MANAGED`, matching API key,
  matching wallet or null wallet, and deterministic ownership for that bot.
- [x] Focused pre-trade tests pass.

## Definition of Done
- [x] `DEFINITION_OF_DONE.md` considered for runtime safety.
- [x] No temporary solution or hidden bypass introduced.
- [x] Regression coverage added.
- [x] Relevant docs and context updated.
- [x] Relevant validations passed.

## Stage Exit Criteria
- [x] The output matches the declared `Current Stage`.
- [x] Work from later stages was not mixed in without explicit approval.
- [x] Risks and assumptions for this stage are stated clearly.

## Forbidden
- New ownership systems.
- Mock-only behavior.
- Counting ambiguous/manual-only external positions as bot exposure.
- Broad refactors outside the pre-trade cap path.

## Validation Evidence
- Tests:
  - `pnpm --filter api run test -- --run src/modules/engine/preTrade.service.test.ts src/modules/engine/preTrade.e2e.test.ts --sequence.concurrent=false` PASS (`24/24`)
  - `pnpm --filter api run test -- --run src/modules/engine/preTrade.service.test.ts src/modules/engine/preTrade.e2e.test.ts src/modules/engine/runtimeSignalLoopDefaults.test.ts src/modules/engine/runtimeSignalLoop.service.test.ts src/modules/backtests/backtests.e2e.test.ts --sequence.concurrent=false` PASS (`89/89`)
  - `pnpm run typecheck` PASS
  - `pnpm run quality:guardrails` PASS
  - `pnpm run lint` PASS
  - `git diff --check` PASS
- Manual checks:
  - Code audit confirms the bot cap cache key includes `PAPER`/`LIVE`.
- Screenshots/logs: not applicable.
- High-risk checks:
  - LIVE imported rows are counted only after deterministic ownership proof.

## Architecture Evidence
- Architecture source reviewed:
  - `docs/modules/api-engine.md`
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
- Rollback note: revert this commit to return to direct-only bot caps.
- Observability or alerting impact: pre-trade audit metrics can now show owned
  imported rows in `metrics.botOpenPositions`.
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: pre-trade bot caps counted direct rows only.
- Gaps: owned LIVE imported rows could be shown/managed elsewhere but ignored
  by `maxOpenPositionsPerBot`.
- Inconsistencies: same-symbol guard and runtime final-candle counts already
  used external ownership, bot cap did not.
- Architecture constraints: external ownership proof remains authoritative.

### 2. Select One Priority Task
- Selected task: `RUNTIME-AUDIT-10`.
- Priority rationale: money-impacting LIVE pre-trade exposure undercount.
- Why other candidates were deferred: user-global caps and wallet/dashboard
  flaps need separate slices to avoid scope bleed.

### 3. Plan Implementation
- Files or surfaces to modify: pre-trade read store, pre-trade e2e test, docs.
- Logic: add LIVE imported-owned count on top of direct bot count.
- Edge cases: PAPER direct-only, no wallet/API key, ambiguous ownership,
  external row with mismatched wallet/API key.

### 4. Execute Implementation
- Implementation notes: reused `resolveExternalPositionOwnershipIndex` and
  `listOwnedExternalSymbolsForBot`; no schema changes.

### 5. Verify and Test
- Validation performed: focused pre-trade service/e2e pack.
- Result: PASS (`24/24`), broader runtime/backtest pack PASS (`89/89`),
  typecheck PASS, guardrails PASS, lint PASS, diff check PASS.

### 6. Self-Review
- Simpler option considered: counting every imported row with matching symbol.
- Technical debt introduced: no
- Scalability assessment: bounded by owned symbol set and indexed position
  fields.
- Refinements made: cache key now includes mode to avoid PAPER/LIVE count
  reuse.

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
Pre-trade per-bot open-position limits now include deterministic owned LIVE
exchange imports in addition to direct bot positions. This closes the exposure
undercount where a bot could import and display a LIVE position but still treat
its per-bot cap as empty.
