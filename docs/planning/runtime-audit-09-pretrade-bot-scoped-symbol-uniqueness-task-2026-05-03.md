# RUNTIME-AUDIT-09 Pre-Trade Bot-Scoped Symbol Uniqueness

## Header
- ID: RUNTIME-AUDIT-09
- Title: Scope pre-trade same-symbol checks to the runtime bot when botId is present
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Backend Builder
- Depends on: RUNTIME-AUDIT-08
- Priority: P1
- Iteration: 27
- Operation Mode: ARCHITECT

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
The pre-trade one-position-per-symbol guard used a global `userId + symbol + OPEN` lookup. That global behavior is still correct for manual/global checks without a bot context, but runtime bot decisions pass `botId` and should not be blocked by another bot's open position on the same symbol.

## Goal
Keep global symbol uniqueness for no-bot pre-trade checks while making bot-scoped PAPER/LIVE runtime checks evaluate same-symbol ownership for the selected bot only.

## Scope
- `apps/api/src/modules/engine/preTrade.service.ts`
- `apps/api/src/modules/engine/preTrade.e2e.test.ts`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`
- `docs/planning/mvp-next-commits.md`
- `docs/modules/api-engine.md`

## Implementation Plan
1. Extend the pre-trade read-store symbol check input with `botId` and `mode`.
2. Preserve global lookup when no `botId` is provided.
3. For bot-scoped checks, look for direct open positions owned by that bot.
4. For LIVE bot-scoped checks, also include unclaimed exchange-synced rows only when the external ownership index proves the API-key+symbol belongs to that same bot and wallet.
5. Add an e2e regression proving another PAPER bot's open same-symbol position does not block a target PAPER bot, while the no-bot global check still blocks.

## Acceptance Criteria
- PAPER runtime pre-trade with `botId` is not blocked by another bot's open position on the same symbol.
- Global no-bot pre-trade checks still block on any open position for the user's symbol.
- LIVE bot-scoped checks still block owned imported exchange-synced rows for the same bot.
- Existing backtest/runtime/pre-trade parity tests continue to pass.

## Definition of Done
- [x] `DEFINITION_OF_DONE.md` satisfied for the touched runtime decision slice.
- [x] Bot-scoped behavior covered by e2e regression.
- [x] Existing global behavior preserved.
- [x] Docs and context updated.
- [x] Validation evidence recorded.

## Forbidden
- Allowing duplicate same-symbol positions inside the same runtime bot.
- Letting a stale/open position from another bot block a bot-scoped pre-trade decision.
- Removing the global no-bot pre-trade guard.
- Treating ambiguous external ownership as owned.

## Validation Evidence
- Tests:
  - `pnpm --filter api run test -- --run src/modules/engine/preTrade.service.test.ts src/modules/engine/preTrade.e2e.test.ts --sequence.concurrent=false` PASS (`23/23`).
  - `pnpm --filter api run test -- --run src/modules/engine/preTrade.service.test.ts src/modules/engine/preTrade.e2e.test.ts src/modules/engine/runtimeSignalLoopDefaults.test.ts src/modules/engine/runtimeSignalLoop.service.test.ts src/modules/backtests/backtests.e2e.test.ts --sequence.concurrent=false` PASS (`88/88`).
  - `pnpm --filter api run typecheck` PASS.
- Manual checks: reviewed runtime signal loop and backtest calls to `analyzePreTrade`; runtime bot calls include `botId`.
- Screenshots/logs: not applicable.
- High-risk checks: open-position duplicate guard remains active for same bot and for owned LIVE imports.

## Architecture Evidence
- Architecture source reviewed:
  - `docs/architecture/05_strategy-signal-and-decision-flow.md`
  - `docs/architecture/06_execution-lifecycle.md`
  - `docs/modules/api-engine.md`
- Fits approved architecture: yes.
- Mismatch discovered: no.
- Decision required from user: no.
- Approval reference if architecture changed: not applicable.
- Follow-up architecture doc updates: not required; module contract updated.

## Deployment / Ops Evidence
- Deploy impact: low.
- Env or secret changes: none.
- Health-check impact: none.
- Smoke steps updated: not required for this small backend decision guard.
- Rollback note: revert this commit to restore previous global same-symbol pre-trade lookup.
- Observability or alerting impact: fewer false `open_position_on_symbol_exists` blocks for bot-scoped PAPER/LIVE runtime decisions.
- Staged rollout or feature flag: not applicable.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: pre-trade symbol uniqueness ignored bot context even when runtime passed `botId`.
- Gaps: no e2e test covered another bot's same-symbol position during a bot-scoped PAPER decision.
- Inconsistencies: dashboard/runtime read scope had been made bot-aware, but pre-trade still used user-global symbol existence.
- Architecture constraints: runtime bot decisions must be scoped to selected bot ownership; no-bot/manual checks may remain user-global.

### 2. Select One Priority Task
- Selected task: make same-symbol pre-trade checks bot-scoped when `botId` is present.
- Priority rationale: this can directly explain PAPER bots not opening positions despite strategy conditions when another bot/user position exists on the same symbol.
- Why other candidates were deferred: wallet-balance flicker and other dashboard-only issues need separate read-path evidence.

### 3. Plan Implementation
- Files or surfaces to modify: pre-trade service/e2e and planning/context/module docs.
- Logic: preserve global no-bot query; for bot-scoped decisions check direct bot positions and, for LIVE, owned imported exchange-synced rows only.
- Edge cases: LIVE imported botId-null rows, ambiguous ownership, missing wallet/API key, no-bot global checks.

### 4. Execute Implementation
- Implementation notes: extended the read-store method input and reused the external ownership index for LIVE imported rows.

### 5. Verify and Test
- Validation performed: focused pre-trade tests, broader runtime/backtest pack, API typecheck.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: filtering only by `botId`; refined because LIVE imported `botId=null` rows owned by the same bot must still block duplicates.
- Technical debt introduced: no.
- Scalability assessment: extra ownership lookup only runs for bot-scoped LIVE decisions after no direct bot position is found.
- Refinements made: Prisma nullable wallet filter uses explicit `OR` for type safety.

### 7. Update Documentation and Knowledge
- Docs updated: this task doc and `docs/modules/api-engine.md`.
- Context updated: `.codex/context/TASK_BOARD.md`, `.codex/context/PROJECT_STATE.md`, `docs/planning/mvp-next-commits.md`.
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

## Production-Grade Required Contract
- Goal: prevent false same-symbol pre-trade blocks for bot-scoped runtime decisions.
- Scope: listed above.
- Implementation Plan: listed above.
- Acceptance Criteria: listed above.
- Definition of Done: satisfied with validation evidence.
- Result Report: pre-trade same-symbol checks are global only without `botId`; runtime bot decisions are scoped to the selected bot and its owned LIVE imports.

## Integration Evidence
- `INTEGRATION_CHECKLIST.md` reviewed: yes.
- Real API/service path used: yes, runtime/backtest calls to `analyzePreTrade`.
- Endpoint and client contract match: not applicable.
- DB schema and migrations verified: no schema change.
- Loading state verified: not applicable.
- Error state verified: same-bot duplicate and global no-bot block remain covered.
- Refresh/restart behavior verified: runtime signal-loop tests cover decision flow.
- Regression check performed: focused and broader runtime/backtest packs.

## Security / Privacy Evidence
- `docs/security/secure-development-lifecycle.md` reviewed: not applicable for auth changes; ownership and money-impacting fail-closed behavior reviewed.
- Data classification: trading runtime and position metadata.
- Trust boundaries: bot ownership, LIVE wallet/API key ownership, exchange-synced imported rows.
- Permission or ownership checks: bot-scoped symbol checks require selected bot ownership; imported LIVE rows require deterministic external ownership proof.
- Abuse cases: another bot's stale/open row cannot block a target bot's runtime open decision.
- Secret handling: no secrets touched.
- Security tests or scans: typecheck and runtime regression tests.
- Fail-closed behavior: ambiguous or unowned imported rows do not count as selected-bot owned.
- Residual risk: user-global no-bot pre-trade checks intentionally remain broad.
