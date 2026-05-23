# Task

## Header
- ID: V1POSTBOT-A
- Title: Recover full API contract parity after single-context bot migration
- Status: CLOSED
- Owner: Planning Agent
- Depends on: V1BOT-A
- Priority: P0

## Context
`V1BOT-A` closed the canonical singular bot architecture:

```text
1 bot = 1 wallet + 1 symbol-group market scope + 1 strategy
```

The canonical runtime, manual-order, dashboard, and indicator surfaces now
consume inherited context from those linked modules instead of reconstructing
primary truth from legacy topology.

After `V1IND-A` closure, the remaining red full-API suite failures are not
indicator regressions. They cluster in older `backtests/orders` e2e paths and
look like post-`V1BOT` drift between:
- older test fixtures that still create partially configured LIVE bots,
- pre-trade admission semantics under the singular bot contract,
- order persistence that should inherit direct `walletId + strategyId`,
- runtime session positions reads/commands for carryover open orders and
  `EXCHANGE_SYNC BOT_MANAGED` ownership.

Current failing areas from full `pnpm --filter api run test -- --run`:
- `src/modules/backtests/backtests.e2e.test.ts`
  - expects `live_opt_in_required` on a LIVE bot with no singular context,
  - expects free-symbol allow path after reconciliation that now appears
    blocked under the singular execution contract.
- `src/modules/orders/orders-positions.e2e.test.ts`
  - persisted manual-order row still misses `strategyId` in one selected-bot
    context case,
  - runtime positions endpoint returns `404` for some carryover/open-order and
    exchange-owned LIVE position cases,
  - close command returns `ignored` for a runtime-owned exchange-synced
    position that should close successfully.

This wave exists to finish the architectural migration honestly:
- no legacy fixture assumptions left in critical-path e2e,
- no runtime read/write path still half-speaking the pre-`V1BOT` contract,
- full API suite green again under the singular bot model.

## Goal
Restore full API contract parity after `V1BOT-A` by aligning pre-trade,
backtests, orders, runtime session positions, and the affected e2e fixtures to
one canonical singular bot context.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- keep the approved single-context bot architecture intact
- do not reopen indicator/signal-surface logic unless a failing test proves a
  direct dependency

## Definition of Done
- [x] Full API e2e no longer contains the current post-`V1BOT` drift failures
      in `backtests/orders` runtime-scope suites.
- [x] Pre-trade and backtest/live reconciliation expectations are explicit and
      aligned with the singular bot contract.
- [x] Manual-order persistence and runtime session positions read/write paths
      use inherited singular bot context consistently for `walletId`,
      `strategyId`, carryover open orders, and `EXCHANGE_SYNC BOT_MANAGED`
      ownership.
- [x] `pnpm --filter api run test -- --run` is green with the required
      encryption env.

## Forbidden
- new systems without approval
- duplicated logic or parallel implementations of the same contract
- temporary bypasses, hacks, or workaround-only paths
- architecture changes without explicit approval
- muting or deleting failing e2e without either fixing the code or updating the
  test to the approved singular contract

## Validation Evidence
- Tests:
  - `pnpm --filter api exec vitest run src/modules/backtests/backtests.e2e.test.ts`
  - `pnpm --filter api exec vitest run src/modules/orders/orders-positions.e2e.test.ts`
  - `pnpm --filter api run test -- --run`
  - `pnpm --filter api run typecheck`
  - `pnpm run quality:guardrails`
- Manual checks:
  - verify the recovered reasoning for LIVE pre-trade on singular bot fixtures
  - verify runtime positions read payload includes carryover open orders and
    owned exchange-synced LIVE positions
- Screenshots/logs:
  - before/after failure list from full API pack
- High-risk checks:
  - no regression in manual-order singular context persistence
  - no regression in exchange-synced ownership fail-closed rules
  - no regression in LIVE opt-in and consent enforcement

## Architecture Evidence (required for architecture-impacting tasks)
- Architecture source reviewed:
  - `docs/architecture/03_domain-model.md`
  - `docs/architecture/04_runtime-contexts.md`
  - `docs/architecture/05_strategy-signal-and-decision-flow.md`
  - `docs/architecture/06_execution-lifecycle.md`
  - `docs/architecture/08_operator-surfaces-and-routing.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed:
  - n/a
- Follow-up architecture doc updates:
  - only if a hidden contract drift is discovered during execution

## UX/UI Evidence (required for UX tasks)
- Design source type: approved_snapshot
- Design source reference: runtime positions and manual-order operator surfaces
  already approved under the singular bot model
- Required states: loading | empty | error | success
- Responsive checks: desktop | tablet | mobile
- Accessibility checks: not primary for this API recovery wave unless web copy
  changes are required by contract alignment
- Parity evidence:
  - selected-bot runtime views must continue to show the same carryover
    positions/orders that API runtime endpoints expose

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
The likely execution order is:
- fix or reclassify pre-trade/backtests assumptions around incomplete LIVE bots,
- then repair the remaining singular-context persistence/read/write drifts in
  orders/runtime positions,
- then rerun the full API pack and close the wave.

## Execution Plan

### Slice 1 - Pre-trade and backtest contract alignment
- [x] `V1POSTBOT-01 audit(pretrade): classify failing pre-trade/backtest expectations against the approved singular bot contract`
  - confirm which failing e2e expectations are legacy fixture drift versus code
    drift
  - freeze the expected semantics for:
    - LIVE bot with missing singular context
    - reconciled external position ownership under one linked wallet

- [x] `V1POSTBOT-02 fix(api-backtests-pretrade): align backtests/pre-trade behavior and fixtures to the singular bot contract`
  - update code and/or fixtures so LIVE gating reasons and free-symbol
    allow/block behavior match the approved architecture

### Slice 2 - Orders and runtime positions recovery
- [x] `V1POSTBOT-03 fix(api-orders): keep singular manual-order persistence deterministic for bot, wallet, and strategy ownership`
  - ensure manual-order write path persists inherited `walletId` and
    `strategyId` deterministically from selected bot context

- [x] `V1POSTBOT-04 fix(api-runtime-positions): recover runtime positions read/close parity for carryover open orders and exchange-synced LIVE ownership`
  - keep `EXCHANGE_SYNC BOT_MANAGED` positions visible for the owning LIVE bot
  - keep carryover open orders visible in runtime session views
  - make dashboard close command succeed for owned exchange-synced runtime
    positions

### Slice 3 - Closure
- [x] `V1POSTBOT-05 qa(closure): rerun focused failing suites plus full API pack and sync canonical docs/context`
  - rerun the focused failing suites first
  - rerun full `api` pack with required encryption env
  - close the wave in queue/context if green

## Closure Notes
- Root cause classification:
  - no new architecture mismatch was found after `V1BOT-A`
  - the remaining red full-API cases were mostly stale fixtures still creating
    bots without direct `walletId/symbolGroupId/strategyId` truth while
    expecting singular-context runtime behavior
- Code/test outcome:
  - updated affected `backtests/orders` e2e fixtures so LIVE and PAPER bots
    carry the same singular context expected by canonical runtime reads and
    pre-trade
  - this restored deterministic runtime-session positions visibility for
    carryover open orders and owned `EXCHANGE_SYNC BOT_MANAGED` positions
  - manual-order selected-bot persistence expectations now align with direct
    singular bot refs
- Validation PASS:
  - `pnpm --filter api exec vitest run src/modules/backtests/backtests.e2e.test.ts src/modules/orders/orders-positions.e2e.test.ts`
  - `pnpm --filter api run test -- --run` with
    `API_KEY_ENCRYPTION_KEYS='v1:test-key-material'` and
    `API_KEY_ENCRYPTION_ACTIVE_VERSION='v1'`
  - `pnpm --filter api run typecheck`
  - `pnpm run quality:guardrails`
