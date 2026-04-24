# Task

## Header
- ID: V1BOT-07
- Title: Source runtime execution context from wallet and market scope inheritance
- Status: DONE
- Owner: Backend Builder
- Depends on: V1BOT-06
- Priority: P0

## Context
`V1BOT-06` already collapsed canonical runtime topology to one direct bot
runtime context (`walletId + symbolGroupId + strategyId`), but key execution
paths still read venue or capital inputs from bot-owned snapshot fields:
- runtime active-bot topology still admitted bots through bot-owned mode/venue
- pre-trade checks still loaded mode/marketType from `Bot`
- runtime position automation still executed DCA/close logic from bot-owned
  mode/venue/paper baseline
- runtime capital context still supported bot-owned paper/api-key fallback

This left the singular bot rewrite incomplete and kept hidden legacy truth in
the critical execution path.

## Goal
Make runtime execution use inherited source-of-truth context:
- `Wallet` -> mode, paper baseline, LIVE credential ownership
- `SymbolGroup / MarketUniverse` -> exchange, marketType, baseCurrency
- `Bot` -> activation state and LIVE consent only

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic

## Definition of Done
- [x] Active runtime topology derives mode/venue/paper baseline from wallet +
      market scope and fails closed on compatibility drift.
- [x] Pre-trade execution config derives mode/marketType from wallet +
      market scope instead of bot snapshot fields.
- [x] Runtime position automation uses inherited wallet/market-scope context for
      DCA/close execution and skips unresolved bot contexts fail-closed.
- [x] Runtime capital context no longer falls back to bot-owned paper balance
      or bot-owned LIVE API key for canonical runtime execution.

## Forbidden
- new systems without approval
- duplicated logic or parallel implementations of the same contract
- temporary bypasses, hacks, or workaround-only paths
- architecture changes without explicit approval

## Validation Evidence
- Tests:
  - `pnpm --filter api exec vitest run src/modules/engine/runtimeCapitalContext.service.test.ts src/modules/engine/preTrade.service.test.ts src/modules/engine/preTrade.e2e.test.ts src/modules/engine/runtimeSignalLoopDefaults.test.ts src/modules/engine/runtimePositionAutomation.service.test.ts src/modules/engine/runtimeFinalCandleDecision.service.test.ts src/modules/engine/runtimeSignalLoop.service.test.ts`
  - `pnpm --filter api run typecheck`
- Manual checks:
  - repository guardrails after extracting the inherited execution helper and
    keeping `runtimePositionAutomation.service.ts` under the production line budget
- Screenshots/logs:
  - n/a
- High-risk checks:
  - fail-closed on wallet vs market-universe venue mismatch
  - LIVE pre-trade/runtime execution cannot silently reuse bot-owned API key truth
  - PAPER baseline remains wallet-authoritative when wallet is linked

## Architecture Evidence (required for architecture-impacting tasks)
- Architecture source reviewed:
  - `docs/architecture/04_runtime-contexts.md`
  - `docs/architecture/05_strategy-signal-and-decision-flow.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed:
  - existing user approval for the single-context bot model on 2026-04-24
- Follow-up architecture doc updates:
  - none required; implementation now catches up to existing architecture truth

## UX/UI Evidence (required for UX tasks)
- Design source type: approved_snapshot
- Design source reference: n/a
- Required states: n/a
- Responsive checks: n/a
- Accessibility checks: n/a
- Parity evidence: n/a

## Review Checklist (mandatory)
- [x] Architecture alignment confirmed.
- [x] Existing systems were reused where applicable.
- [x] No workaround paths were introduced.
- [x] No logic duplication was introduced.
- [x] Definition of Done evidence is attached.
- [x] Relevant validations were run.
- [x] Docs or context were updated if repository truth changed.
- [x] Learning journal was updated if a recurring pitfall was confirmed.

## Notes
- Added a tiny shared helper `runtimeBotExecutionContext.ts` to keep inherited
  wallet + venue compatibility logic explicit and to stay within repository
  line-budget guardrails.
