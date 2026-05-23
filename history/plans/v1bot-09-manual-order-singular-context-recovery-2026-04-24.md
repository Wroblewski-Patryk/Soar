# Task

## Header
- ID: V1BOT-09
- Title: Recover dashboard manual-order truth and singular-context execution for PAPER and LIVE
- Status: READY
- Owner: Backend Builder + Frontend Builder
- Depends on: V1BOT-07, V1BOT-07B
- Priority: P0

## Context
The approved V1 target is now a singular bot contract:
- `1 bot = 1 wallet + 1 symbol-group market scope + 1 strategy`
- wallet owns execution mode and capital authority
- symbol group + market universe own venue and symbol scope
- strategy owns interval, leverage, and risk settings

Production investigation on `2026-04-24` confirmed the dashboard manual-order
surface is still drifting from that contract in two different ways:

1. `PAPER` manual `MARKET` orders can be accepted but stay at `Order.status=OPEN`
   with no fill and no opened position when the request omits an explicit
   `price`, even though the architecture requires paper execution to be the
   fill authority for paper mode.
2. The dashboard manual-order UX still behaves like a weak helper surface
   instead of a truthful lifecycle surface:
   - symbol availability is derived from currently surfaced runtime rows rather
     than strictly from the bot's attached symbol-group market scope
   - the operator is not shown an explicit `submitted -> waiting_for_fill ->
     position_opened` outcome model
   - `LIVE` and `PAPER` semantics are not clearly separated even though `LIVE`
     may legitimately wait for exchange fill while `PAPER` should resolve
     immediately for canonical `MARKET` orders

The current backend manual-context implementation also still resolves strategy
context primarily through legacy `botMarketGroup -> strategyLinks` and
`BotStrategy` compatibility paths instead of first using the singular bot
refs (`bot.symbolGroupId`, `bot.strategyId`) already approved and partially
implemented in the runtime rewrite.

## Goal
Make dashboard manual-order behavior truthful and executable under the approved
single-context bot architecture so:
- `PAPER` manual market orders open positions immediately using canonical paper
  fill authority
- `LIVE` manual opens remain lifecycle-correct and explicitly visible as
  submitted/open/filled depending on exchange truth
- the dashboard manual-order section is driven by the bot's attached market
  scope and inherited strategy/wallet context, not by fallback runtime noise or
  already-open positions

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- preserve the existing dashboard visual language; data wiring and state truth
  may improve, but this is not a redesign task
- manual order must stay inside the canonical lifecycle:
  `entry intent -> order created -> order status evolves -> fill confirmed -> position opened or updated`

## Definition of Done
- [ ] Manual-order context resolves first from singular bot context
      (`wallet + symbolGroup + strategy`) and only uses legacy topology as
      compatibility fallback when direct bot refs are absent.
- [ ] `PAPER` manual `MARKET` orders without an explicit request `price` use one
      canonical price authority for immediate fill application and open a
      position in the same lifecycle path.
- [ ] Dashboard manual-order symbol selection is sourced from the selected
      bot's attached symbol group, not from already-surfaced runtime rows or
      existing positions only.
- [ ] Dashboard manual-order UX exposes truthful states for `loading`, `ready`,
      `context unavailable`, `submitted`, `waiting for fill`, `position
      opened`, and `error`.
- [ ] `LIVE` manual-order success state tells the operator whether the result is
      an open order waiting for fill or an already-filled position, and refresh
      logic reads back authoritative open-order/open-position truth.
- [ ] Focused API and web regressions cover both `PAPER` and `LIVE` manual
      order semantics under the singular bot contract.

## Forbidden
- new systems without approval
- duplicated logic or parallel implementations of the same contract
- temporary bypasses, hacks, or workaround-only paths
- architecture changes without explicit approval
- a frontend-only fake success state that is not derived from authoritative
  order/position results

## Validation Evidence
- Tests: to attach during execution closure
- Manual checks:
  - authenticated production read of `/dashboard/orders/manual-context`
  - authenticated production `PAPER` manual open through `/dashboard/orders/open`
  - dashboard selected-bot verification for manual-order states after submit
- Screenshots/logs:
  - production API confirmation on `2026-04-24`:
    - `manual-context` for bot `dec24168-7bba-4c44-aac9-97b3c6c60ce1`
      returned singular bot ids plus strategy-derived `25x` leverage for
      `1000000BOBUSDT`
    - `POST /dashboard/orders/open` for a paper `MARKET` order returned `201`
      but persisted `status=OPEN`, `positionId=null`, and left the aggregate
      with no open positions
- High-risk checks:
  - `PAPER` must not wait for fill when canonical paper fill authority can
    resolve mark price
  - `LIVE` must not pretend a position is open before exchange/lifecycle truth
    confirms it
  - manual-order symbols must never escape the selected bot's canonical market
    scope

## Architecture Evidence (required for architecture-impacting tasks)
- Architecture source reviewed:
  - `docs/architecture/04_runtime-contexts.md`
  - `docs/architecture/06_execution-lifecycle.md`
  - `docs/architecture/07_modes-parity-and-data.md`
- Fits approved architecture: yes
- Mismatch discovered: yes
- Decision required from user: no
- Approval reference if architecture changed:
  - user-approved full singular bot target on `2026-04-24`
- Follow-up architecture doc updates:
  - `docs/architecture/06_execution-lifecycle.md` if the manual-order fill
    authority wording needs to become more explicit for paper market orders
  - `docs/architecture/08_operator-surfaces-and-routing.md` for truthful
    dashboard manual-order state expectations

## UX/UI Evidence (required for UX tasks)
- Design source type: approved_snapshot
- Design source reference: existing dashboard selected-bot manual-order section
- Required states: loading | empty | error | success
- Responsive checks: desktop | tablet | mobile
- Accessibility checks:
  - status copy must stay visible without color-only meaning
  - action disabled reasons should remain inferable from text/state labels
- Parity evidence:
  - preserve the existing dashboard sidebar composition
  - improve only state truth, symbol sourcing, and lifecycle feedback

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
Recommended execution slices:

1. `V1BOT-09A api(manual-context)`: switch manual-order context to singular
   bot refs first and fail closed on incompatible inherited wallet/market
   scope.
2. `V1BOT-09B api(paper-fill)`: make paper market manual open resolve one
   canonical fill price when request price is omitted and apply lifecycle
   immediately.
3. `V1BOT-09C web(symbol-source)`: source manual-order symbol options from the
   selected bot's direct symbol-group scope.
4. `V1BOT-09D web(lifecycle-ux)`: expose truthful submitted/waiting/opened
   states and mode-aware semantics for `PAPER` vs `LIVE`.
5. `V1BOT-09E qa(closure)`: run focused API/web/manual-order parity pack plus
   repo guardrails and production-safe verification notes.
