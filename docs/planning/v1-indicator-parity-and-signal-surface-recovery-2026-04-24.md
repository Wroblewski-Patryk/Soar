# Task

## Header
- ID: V1IND-A
- Title: Recover canonical indicator parity and truthful signal surfaces for V1
- Status: CLOSED
- Owner: Planning Agent
- Depends on: V1BOT-A
- Priority: P0

## Context
Authenticated production inspection plus code audit confirmed that signal
surfaces are still not fully aligned with the approved architecture.

Observed production symptoms:
- `Configured only` rows still render condition cards that look like real
  runtime signal analysis.
- `Evaluated / no trade` rows can still show incomplete condition data.
- `X` appears instead of the latest closed-candle indicator value, even though
  runtime strategy evaluation already computes those values when a final candle
  is processed.

Root causes found in the repo:
- operator signal surfaces still use a local fallback formatter in
  `runtimeSignalConditionLines.service.ts`, which supports only a subset of
  indicators and writes `X` or `-` when values are unavailable.
- bot runtime signal read-models still seed venue context from `Bot.exchange`
  and `Bot.marketType` in places, instead of inheriting it only from
  `SymbolGroup -> MarketUniverse`.
- strategy builder metadata comes from standalone `indicators.data.ts`, while
  runtime/backtest truth comes from `strategyIndicatorKernel.ts` and
  `strategySignalEvaluator.ts`.
- architecture docs currently drift:
  - `indicator-registry-parity-contract.md` freezes a broad end-to-end
    registry contract,
  - `strategy-evaluation-parity-contract.md` still formally names only a narrow
    subset (`EMA`, `RSI`, `MOMENTUM`) as V1 parity scope.

This wave exists to stop further “around the edges” fixes and restore one
canonical indicator contract across:
- strategy create/edit,
- backtest,
- paper/live runtime,
- operator signal surfaces.

## Goal
Deliver one canonical indicator registry and one truthful signal-surface
contract so every indicator exposed in the strategy builder is either:
- fully supported end-to-end, or
- explicitly unavailable and hidden from canonical V1 paths.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- architecture docs must be reconciled before implementation changes rely on a
  disputed contract
- operator surfaces must fail closed and must not masquerade configured
  snapshots as accepted runtime signal truth

## Definition of Done
- [x] Architecture freezes one unambiguous V1 indicator parity scope and one
      canonical indicator registry owner.
- [x] Strategy builder metadata, runtime evaluator support, backtest evaluator
      support, and operator signal-surface rendering all derive from the same
      canonical registry.
- [x] Every builder-exposed indicator has explicit parity coverage or is
      removed/hidden from canonical V1 builder metadata.
- [x] Signal surfaces show real latest closed-candle values when data exists and
      explicit degraded state when it does not, never opaque `X` placeholders.
- [x] `Configured only`, `Evaluated / no trade`, `Signal active`, and
      `Position open` have distinct, truthful semantics in API and web.

## Forbidden
- new systems without approval
- duplicated logic or parallel implementations of the same contract
- temporary bypasses, hacks, or workaround-only paths
- architecture changes without explicit approval
- continuing to expose builder indicators that are not covered end-to-end

## Validation Evidence
- Tests: to be attached per execution slice
- Manual checks: production or local operator-surface verification against
  latest closed-candle values
- Screenshots/logs: signal-surface before/after evidence where relevant
- High-risk checks:
  - every builder-exposed indicator maps to runtime + backtest support
  - latest closed-candle indicator values match runtime evaluation values
  - configured snapshot and latest decision are visually and semantically
    distinct
  - derivatives-only indicators fail closed outside supported venue/data context

## Architecture Evidence (required for architecture-impacting tasks)
- Architecture source reviewed:
  - `docs/architecture/05_strategy-signal-and-decision-flow.md`
  - `docs/architecture/08_operator-surfaces-and-routing.md`
  - `docs/architecture/reference/indicator-registry-parity-contract.md`
  - `docs/architecture/reference/strategy-evaluation-parity-contract.md`
- Fits approved architecture: yes
- Mismatch discovered: resolved
- Decision required from user: no
- Approval reference if architecture changed:
  - 2026-04-24 user decision: keep one full canonical indicator set shared by
    builder, bot runtime (`PAPER`/`LIVE`), backtest, and operator surfaces
- Follow-up architecture doc updates:
  - `docs/architecture/reference/indicator-registry-parity-contract.md`
  - `docs/architecture/reference/strategy-evaluation-parity-contract.md`
  - `docs/architecture/05_strategy-signal-and-decision-flow.md`
  - `docs/architecture/08_operator-surfaces-and-routing.md`

## UX/UI Evidence (required for UX tasks)
- Design source type: approved_snapshot
- Design source reference: current dashboard/bot runtime surfaces with approved
  truth-first operator direction from `08_operator-surfaces-and-routing.md`
- Required states: loading | empty | error | success
- Responsive checks: desktop | tablet | mobile
- Accessibility checks: required during web surface slice
- Parity evidence:
  - `Configured only` = current closed-candle market snapshot, not accepted signal
  - `Evaluated / no trade` = latest runtime-evaluated closed candle
  - `Signal active` = accepted directional runtime signal
  - `Position open` = active position state

## Review Checklist (mandatory)
- [x] Architecture alignment confirmed.
- [x] Existing systems were reused where applicable.
- [x] No workaround paths were introduced.
- [x] No logic duplication was introduced.
- [x] Definition of Done evidence is attached.
- [x] Relevant validations were run.
- [x] Docs or context were updated if repository truth changed.
- [ ] Learning journal was updated if a recurring pitfall was confirmed.

## Notes
Current builder-exposed indicator set from
`apps/api/src/modules/strategies/indicators/indicators.data.ts` includes:
- `EMA`, `SMA`, `RSI`, `MOMENTUM`, `MACD`, `ROC`, `STOCHRSI`,
  `BOLLINGER_BANDS`, `ATR`, `CCI`, `ADX`, `STOCHASTIC`,
  `DONCHIAN_CHANNELS`
- `FUNDING_RATE`, `FUNDING_RATE_ZSCORE`, `OPEN_INTEREST`,
  `OPEN_INTEREST_DELTA`, `OPEN_INTEREST_MA`, `OPEN_INTEREST_ZSCORE`,
  `ORDER_BOOK_IMBALANCE`, `ORDER_BOOK_SPREAD_BPS`, `ORDER_BOOK_DEPTH_RATIO`
- candle patterns:
  `BULLISH_ENGULFING`, `BEARISH_ENGULFING`, `HAMMER`, `SHOOTING_STAR`, `DOJI`,
  `MORNING_STAR`, `EVENING_STAR`, `INSIDE_BAR`, `OUTSIDE_BAR`

The shared runtime/backtest kernel in
`apps/api/src/modules/engine/strategyIndicatorKernel.ts` appears to support the
same currently exposed families, which is good. The larger unresolved drift is
not missing evaluator support for those exposed indicators, but:
- stale architecture scope docs,
- non-canonical builder metadata ownership,
- non-canonical operator-surface condition rendering,
- and inherited venue-context drift in signal read models.

## Execution Plan

### Slice 1 - Architecture and registry freeze
- [x] `V1IND-01 docs(decision): reconcile indicator parity architecture and freeze one canonical V1 registry scope`
  - resolve the architecture mismatch between
    `indicator-registry-parity-contract.md` and
    `strategy-evaluation-parity-contract.md`
  - freeze one explicit list of builder-exposed V1 indicators and operators
  - freeze one canonical registry owner used by builder/runtime/backtest/surfaces

### Slice 2 - Canonical indicator registry ownership
- [x] `V1IND-02 api(registry): replace standalone strategy-builder indicator metadata with canonical registry-backed metadata`
  - stop treating `indicators.data.ts` as independent truth
  - expose builder metadata from the same canonical indicator registry used by
    runtime/backtest
  - carry explicit fields required by architecture:
    `group`, `type`, `dataRequirement`, `outputs`, `supportedModes`, `operators`

### Slice 3 - Signal-analysis and surface truth recovery
- [x] `V1IND-03 api(signal-analysis): remove subset fallback indicator formatter from signal read models and reuse canonical runtime analysis truth`
  - replace `runtimeSignalConditionLines.service.ts` as a source of business truth
  - surface canonical evaluation analysis from runtime where available
  - for non-evaluated configured snapshots, compute values through the shared
    indicator kernel only

- [x] `V1IND-04 api(read-model): derive signal-surface venue context only from inherited symbol-group market universe`
  - remove residual `bot.exchange` / `bot.marketType` authority from signal
    read-model paths
  - keep signal snapshot sourcing aligned with the singular bot architecture

### Slice 4 - Operator UX truth
- [x] `V1IND-05 web(signal-surface): distinguish configured market snapshot from evaluated runtime decision and remove opaque X placeholders`
  - rename/reshape configured-only content as market snapshot, not signal
  - show explicit degraded/no-data message instead of `X`
  - preserve existing layout intent while making the state semantics truthful

### Slice 5 - End-to-end parity coverage
- [x] `V1IND-06 test(parity-matrix): add explicit parity coverage for every builder-exposed indicator across builder metadata, runtime, and backtest`
  - one generated or table-driven pack proving every exposed indicator is
    supported in:
    - builder metadata
    - strategy parser/evaluator
    - runtime decision engine
    - backtest parity
  - fail closed if a builder-exposed indicator lacks support

- [x] `V1IND-07 qa(closure): run focused closure pack and sync canonical docs/context`
  - API tests
  - web tests
  - typecheck/build/guardrails
  - source-of-truth sync

## Closure Notes
- `V1IND-A` is closed on focused validation evidence:
  - `pnpm --filter api exec vitest run src/modules/engine/strategyIndicatorRegistryParity.test.ts src/modules/strategies/indicators/indicators.service.test.ts src/modules/bots/runtimeSymbolStatsReadModel.service.test.ts src/modules/engine/runtimeFinalCandleDecision.service.test.ts`
  - `pnpm --filter api run typecheck`
  - `pnpm --filter web exec vitest run src/features/strategies/components/StrategyFormSections/Indicators.test.tsx src/features/dashboard-home/components/HomeLiveWidgets.test.tsx src/features/dashboard-home/components/HomeLiveWidgets.preview-parity.test.tsx`
  - `pnpm --filter web exec vitest run src/i18n/translations.test.ts src/i18n/namespaceRegistry.test.ts`
  - `pnpm --filter web run test -- --run`
  - `pnpm --filter web run typecheck`
  - `pnpm run quality:guardrails`
  - `pnpm run build`
- Full `pnpm --filter api run test -- --run` remains red in 7 unrelated
  backtests/orders runtime-scope e2e cases that reflect post-`V1BOT`
  contract/test drift rather than indicator parity regressions. That follow-up
  remains separate from this wave and was not reopened under `V1IND-A`.
