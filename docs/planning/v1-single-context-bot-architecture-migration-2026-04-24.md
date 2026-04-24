# Task

## Header
- ID: V1BOT-A
- Title: Migrate Soar to the approved single-context bot architecture
- Status: IN_PROGRESS
- Owner: Planning Agent
- Depends on: V1ALIGN-A, V1SIG-A, V1CAP-A, V1RT-02
- Priority: P0

## Context
The current implementation still carries legacy multi-group and multi-strategy
bot topology (`Bot -> BotMarketGroup -> MarketGroupStrategyLink -> Strategy`).
The approved target architecture is now different:

```text
1 Bot = 1 Wallet + 1 SymbolGroup-derived market scope + 1 Strategy
```

The bot remains the runtime identity and activation boundary, but it must
inherit context from linked modules instead of owning duplicated truth:
- `Wallet` -> execution mode, capital policy, exchange credentials
- `SymbolGroup` / `MarketUniverse` -> exchange, marketType, baseCurrency, symbol scope
- `Strategy` -> interval, entry/exit/filter/risk config, leverage, max-position policy

This decision is user-approved on 2026-04-24 and must now be delivered as the
canonical V1 bot architecture rather than an optional cleanup.

## Goal
Replace the legacy multi-group/multi-strategy bot model with one canonical
single-context bot contract, while preserving fail-closed safety, runtime
parity, and operator clarity.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- preserve runtime safety and production truth during migration
- keep backward-compatible read/migration paths only as explicit temporary compatibility

## Definition of Done
- [ ] Canonical architecture, API, runtime, and UI contracts all treat the bot as
      one wallet + one symbol-group market scope + one strategy.
- [ ] Legacy multi-group/multi-strategy runtime ownership is removed from the
      canonical execution path.
- [ ] Existing data is migrated or explicitly blocked/fail-closed if incompatible.
- [ ] Backtest, paper, and live runtime context assembly is explained by one
      inherited-context contract.
- [ ] Operator surfaces expose only the approved single-context model.

## Forbidden
- new systems without approval
- duplicated logic or parallel implementations of the same contract
- temporary bypasses, hacks, or workaround-only paths
- architecture changes without explicit approval

## Validation Evidence
- Tests: to be attached per execution slice
- Manual checks: to be attached per execution slice
- Screenshots/logs: to be attached per execution slice
- High-risk checks:
  - fail-closed migration for bots with more than one market group or more than one strategy
  - runtime parity across backtest, paper, and live after inheritance switch
  - no silent fallback from bot-owned venue/mode/strategy fields after migration

## Architecture Evidence (required for architecture-impacting tasks)
- Architecture source reviewed:
  - `docs/architecture/02_system-topology.md`
  - `docs/architecture/03_domain-model.md`
  - `docs/architecture/04_runtime-contexts.md`
  - `docs/architecture/05_strategy-signal-and-decision-flow.md`
- Fits approved architecture: yes
- Mismatch discovered: yes
- Decision required from user: no
- Approval reference if architecture changed:
  - user decision in chat on 2026-04-24 approving the full single-context bot model
- Follow-up architecture doc updates:
  - `03_domain-model.md`
  - `04_runtime-contexts.md`
  - `05_strategy-signal-and-decision-flow.md`
  - bot/API/runtime module references as implementation lands

## UX/UI Evidence (required for UX tasks)
- Design source type: approved_snapshot
- Design source reference: existing dashboard bot UI already reflects the intended single-context interaction model per user confirmation
- Required states: loading | empty | error | success
- Responsive checks: desktop | tablet | mobile
- Accessibility checks: required during UI slices
- Parity evidence: bot create/edit/detail/monitoring surfaces must match the single-context architecture with no legacy topology controls exposed

## Review Checklist (mandatory)
- [ ] Architecture alignment confirmed.
- [ ] Existing systems were reused where applicable.
- [ ] No workaround paths were introduced.
- [ ] No logic duplication was introduced.
- [ ] Definition of Done evidence is attached.
- [ ] Relevant validations were run.
- [ ] Docs or context were updated if repository truth changed.
- [ ] Learning journal was updated if a recurring pitfall was confirmed.

## Notes
This wave intentionally changes canonical domain ownership. It must therefore
proceed in explicit, reversible slices with architecture/docs synced first and
runtime compatibility removed only after migration evidence exists.

## Detailed Migration Plan

### Slice 1 - Canonical contract freeze
- [x] `V1BOT-01 docs(architecture): freeze single-context bot contract`
  - update architecture docs so `BotMarketGroup` and `MarketGroupStrategyLink`
    are no longer canonical ownership
  - freeze inheritance rules:
    - wallet -> mode, capital, API-key/live execution context
    - symbol group / market universe -> exchange, marketType, baseCurrency, symbols
    - strategy -> interval, schema, leverage, risk, max positions
  - define temporary compatibility rule for legacy storage only

### Slice 2 - Data model migration foundation
- [x] `V1BOT-02 db(schema): add direct bot references for symbolGroup and strategy; classify legacy topology`
  - add direct `bot.symbolGroupId`
  - add direct `bot.strategyId`
  - decide whether bot keeps derived snapshot fields or computes on read
  - mark legacy `BotMarketGroup` and `MarketGroupStrategyLink` as compatibility-only
- [x] `V1BOT-03 db(migration): backfill single-context refs from legacy topology and fail-closed on incompatible bots`
  - backfill bots with exactly one active group and one active strategy link
  - classify incompatible bots:
    - multiple active groups
    - multiple active strategies
    - context mismatch between wallet and symbol group
  - incompatible bots must be blocked explicitly, not guessed

### Slice 3 - Command/API contract migration
- [x] `V1BOT-04 api(commands): collapse create/update validation onto inherited single-context contract`
  - `createBot` and `updateBot` accept only:
    - `walletId`
    - `marketGroupId` or `symbolGroupId` depending on final route naming
    - `strategyId`
    - bot-local activation/consent metadata
  - remove bot-owned venue/mode duplication from command truth
- [x] `V1BOT-05 api(reads): expose bot runtime context as inherited and singular`
  - one bot detail shape
  - no legacy topology collections in canonical web/API contract
  - explicit derived context block for operators

### Slice 4 - Runtime and execution migration
- `V1BOT-06 engine(runtime-topology): replace multi-group runtime topology with singular bot context`
  - runtime unit becomes one bot, one symbol group, one strategy
  - routing, signal evaluation, pre-trade, and execution use direct bot refs
  - remove group/strategy-link iteration from canonical decision path
- `V1BOT-07 engine(capital-strategy-inheritance): source runtime parameters from wallet and strategy modules`
  - wallet:
    - mode
    - API key/live entitlement context
    - capital allocation and reference balance
  - strategy:
    - interval
    - leverage
    - risk/max-position policy
    - entry/exit/filter schema
  - bot:
    - activation state
    - live consent
    - runtime identity

### Slice 5 - Web/UI migration
- `V1BOT-08 web(bot-crud): align create/edit/detail flows to the singular contract`
  - keep existing UX intent
  - remove legacy topology affordances from API wiring and data mapping
  - show inherited context explicitly in bot details:
    - wallet-derived execution context
    - market-group-derived venue context
    - strategy-derived runtime settings
- `V1BOT-09 web(runtime-surfaces): align monitoring, dashboard, and manual actions to singular bot context`
  - no assumptions about multiple groups or strategy links
  - selected-bot runtime surfaces show one consistent inherited context

### Slice 6 - Compatibility removal and closure
- `V1BOT-10 cleanup(legacy-runtime): remove legacy topology from canonical runtime path`
  - retain transitional migration helpers only where required for old rows
  - remove dead projection drift/bridge logic once data migration is complete
- `V1BOT-11 qa(closure): full parity and migration closure pack`
  - API e2e
  - runtime parity packs
  - web tests
  - build/typecheck/guardrails
  - production-safe migration/runbook evidence
