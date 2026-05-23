# Task

## Header
- ID: LIVEIMPORT-01
- Title: Restore wallet-first LIVE imported position ownership
- Task Type: fix
- Current Stage: release
- Status: DONE
- Owner: Backend Builder
- Depends on: ETHDCA-01
- Priority: P0
- Iteration: 2026-05-03
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
The operator reported that new exchange-side positions were not being pulled
under a LIVE bot even when the market was connected to bot management, including
after editing the market list and after opening a position on an older market.
Architecture requires deterministic imported-position ownership from exact API
key plus symbol scope, and the bot write contract is wallet-first: bot execution
context is derived from the assigned wallet, while `Bot.apiKeyId` is legacy.

## Goal
Ensure `EXCHANGE_SYNC` open positions can be deterministically rebound to the
correct LIVE bot when the bot's canonical API key lives on the assigned wallet
and when the managed symbol is attached through an active `BotMarketGroup`.

## Scope
- `apps/api/src/modules/bots/runtimeExternalPositionOwner.service.ts`
- `apps/api/src/modules/bots/runtimeExternalPositionOwner.service.test.ts`
- `apps/api/src/modules/positions/positions.takeover-status.e2e.test.ts`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`
- `.codex/context/LEARNING_JOURNAL.md`

## Implementation Plan
1. Keep the existing external ownership index and fail-closed status model.
2. Resolve the LIVE ownership API key from `bot.wallet.apiKeyId`, falling back
   to legacy `bot.apiKeyId` only for old rows.
3. Build ownership symbol scope from both the primary legacy `symbolGroup` and
   active canonical `botMarketGroups`.
4. Preserve ambiguity and manual-only handling.
5. Add unit and e2e regression coverage.

## Acceptance Criteria
- LIVE imported ownership works when `Bot.apiKeyId` is null but wallet has the
  exchange API key used in `Position.externalId`.
- LIVE imported ownership includes active added market groups, not only the
  legacy primary symbol group.
- Existing ambiguous, manual-only, and unowned outcomes remain fail-closed.
- Focused tests, API typecheck, API build, and guardrails pass before commit.

## Definition of Done
- [x] `DEFINITION_OF_DONE.md` constraints are satisfied for this backend slice.
- [x] No new ownership system or bypass was introduced.
- [x] Tests prove the operator-reported old-market and added-market failure
  modes.
- [x] Source-of-truth context files are updated.
- [x] Commit created only after validation passed.

## Constraints
- Use existing imported-position ownership and takeover-rebind mechanisms.
- Do not infer ownership by symbol only.
- Do not let ambiguous bot scopes become actionable.
- Do not use API-key, wallet, or exchange-management flags outside the existing
  contracts.

## Forbidden
- Symbol-only ownership guessing.
- Rebinding `BOT` origin orphan positions without explicit proof.
- Temporary import bypasses or mock-only behavior.
- New importer or reconciliation system.

## Validation Evidence
- Tests:
  - `pnpm --filter api exec vitest run src/modules/bots/runtimeExternalPositionOwner.service.test.ts src/modules/positions/positions.takeover-status.e2e.test.ts`
  - `pnpm --filter api run typecheck`
  - `pnpm --filter api run build`
  - `pnpm run quality:guardrails`
- Manual checks: code review of ownership index, wallet-first contract, and
  active bot market group scope.
- High-risk checks: ownership remains keyed by `apiKeyId:symbol`; ambiguous and
  manual-only states remain non-actionable.

## Architecture Evidence
- Architecture source reviewed:
  - `docs/architecture/reference/live-position-restart-continuity-contract.md`
  - `docs/architecture/reference/live-runtime-lifecycle-parity-contract.md`
  - `apps/api/src/modules/bots/bots.wallet-contract.e2e.test.ts`
- Fits approved architecture: yes
- Mismatch discovered: yes, implementation still relied on legacy
  `Bot.apiKeyId` and ignored canonical active market groups for imported
  ownership.
- Decision required from user: no
- Follow-up architecture doc updates: none

## Deployment / Ops Evidence
- Deploy impact: medium
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: not required
- Rollback note: revert this commit to restore prior ownership behavior.
- Observability or alerting impact: takeover-status/rebind counts expose
  `OWNED_AND_MANAGED`, `UNOWNED`, `AMBIGUOUS`, and `MANUAL_ONLY` outcomes.
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: imported ownership index skipped LIVE bots when `Bot.apiKeyId` was
  null and only enumerated legacy primary symbol groups.
- Gaps: wallet-first write contract and canonical bot market group scope were
  not represented in imported-position ownership.
- Architecture constraints: exact API key plus symbol proof, fail-closed on
  ambiguity, no symbol-only guessing.

### 2. Select One Priority Task
- Selected task: fix imported ownership proof for wallet-first LIVE bots and
  active market groups.
- Priority rationale: money-impacting LIVE bot management path.
- Why other candidates were deferred: broader exchange polling/import cadence
  was not changed because the observed proof gap is sufficient and smaller.

### 3. Plan Implementation
- Files or surfaces to modify: ownership service plus focused tests and context
  docs.
- Logic: resolve effective API key from wallet first, enumerate primary and
  canonical active symbol groups, de-duplicate symbols, preserve existing
  ownership status semantics.
- Edge cases: ambiguous multiple managed bots, manual-only disabled management,
  missing wallet/API key, legacy bots with `Bot.apiKeyId`.

### 4. Execute Implementation
- Implementation notes: reused `resolveEffectiveSymbolGroupSymbols` and the
  existing `apiKeyId:symbol` ownership key.

### 5. Verify and Test
- Validation performed: focused unit/e2e tests plus API typecheck, API build,
  and guardrails.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: only fall back from `Bot.apiKeyId` to wallet API
  key. It would not cover edited/added canonical market groups.
- Technical debt introduced: no
- Scalability assessment: ownership index still builds once per user and
  de-duplicates per bot/symbol.
- Refinements made: tests cover wallet-first and added-market-group ownership
  together.

### 7. Update Documentation and Knowledge
- Docs updated: this task file, project state, task board, learning journal.
- Context updated: yes
- Learning journal updated: yes

## Result Report
- Task summary: imported LIVE position ownership now follows wallet-first API
  key truth and active bot market groups.
- Files changed: see Scope.
- How tested: see Validation Evidence.
- What is incomplete: production readback after deploy is still needed to
  confirm the operator's live account imports on the affected markets.
- Next steps: deploy and run takeover-status/rebind smoke on the affected LIVE
  user.
