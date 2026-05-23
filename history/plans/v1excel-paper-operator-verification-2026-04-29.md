# V1EXCEL PAPER Operator Verification

Status: partial  
Date: 2026-04-29  
Owner: Codex Execution Agent

## Purpose

Record the first authenticated production operator pass that became possible
once real Soar admin credentials were available during `V1EXCEL-03`.

## Scope Executed

- authenticated production login through the real Soar API
- production `PAPER` bot runtime/session inspection
- production manual-order context verification
- production manual same-side add on an existing `PAPER` managed position
- production manual close attempt on that same `PAPER` managed position
- fresh post-deploy production manual close confirmation on the same paper bot
- fresh authenticated production dashboard UI walkthrough for the same paper bot

## Production Context

- user: `wroblewskipatryk@gmail.com`
- authenticated role: `ADMIN`
- paper bot: `073545b5-33cf-4014-9064-d4120a39ea93`
- paper runtime session: `8323931b-812d-48b8-9ab6-07be5cf62d04`
- tested position before add: `c7d184a3-3c11-4a52-b2ed-20b88011295f`

## Findings

### 1. Production PAPER manual add is truthful

Authenticated production API execution proved that one operator-driven
same-side `PAPER` market order is handled truthfully for an already open
managed position:

- manual-order context resolved correctly for `1000000MOGUSDT SELL`
- submitted order `5df52d19-0442-42b4-980d-864581a888b0` returned `201 CREATED`
- order status was `FILLED`
- order linked to the existing open position
- runtime positions remained truthful:
  - `openCount` stayed `1`
  - `openOrdersCount` stayed `0`
  - open position quantity increased from `6526.454344629999` to
    `6560.454344629999`

This is strong production evidence that the canonical `filled order -> existing
position merge` path is working for `PAPER`.

### 2. Production PAPER manual close now passes after deploy

After the latest production deploy, the same authenticated protected API path
was rerun against the active paper runtime session and the previously failing
manual close path now behaved truthfully:

- before close:
  - `openCount` was `1`
  - open position id was `c7d184a3-3c11-4a52-b2ed-20b88011295f`
  - runtime row was actionable and had visible `markPrice=0.1541`
- manual close returned `200 OK`
- response payload:
  - `status: closed`
  - `orderId: 27504a61-94d2-4ffa-9f28-beb0b39e40ba`
  - `positionId: c7d184a3-3c11-4a52-b2ed-20b88011295f`
- after close:
  - `openCount` became `0`
  - `historyItems[0]` is the just-closed position
  - `closeReason` is `MANUAL`
  - `closeInitiator` is `USER_APP`
  - `closedAt` is `2026-04-29T22:14:21.116Z`
  - `exitPrice` is `0.1492`
  - `tradesCount` is `3`
  - capital summary moved realized profit into runtime truth:
    - `realizedPnl: 12.482282366594582`
    - `unrealizedPnl: 0`
    - `freeCash: 1012.4822823665946`

This is strong production evidence that the post-deploy `PAPER` manual-close
path now uses sufficient close-price authority and records truthful history
plus capital outcomes.

### 3. Production PAPER dashboard UI is now aligned with the API truth

Authenticated browser automation against the real production dashboard now
confirms the same operator-visible truth directly in UI:

- switching the selected bot from `live` to `Peper bot` succeeds in the
  dashboard
- `Positions` shows `No open positions.`
- wallet summary shows:
  - `Delta from start: 1.25% | 12.48 USDT`
  - `Portfolio: 1,012.48 USDT`
  - `FREE FUNDS: 1,012.48 USDT`
  - `IN POSITIONS: 0.00 USDT`
- `History` shows the expected closed `1000000MOGUSDT` lifecycle row at the
  top of the table:
  - `Action: Close`
  - `Reason: Manual`
  - `Closed by: User in app`
  - `Price: 0.1492`
  - `Realized PnL [USDT]: 23.07`

This confirms that the operator-visible production dashboard is no longer
lagging behind the fixed protected API path for this `PAPER` close flow.

## Code Remediation Confirmed

The deployed remediation proved effective. The close command now successfully
reuses the approved price-authority seams that had already been prepared on
`main`:

- `runtimeMarketDataFallback`
- the same public exchange connector family already used by manual-order
  context

This keeps the command path closer to the operator-visible price truth that is
already available elsewhere in production. Focused validation PASS:

- `pnpm --filter api exec vitest run src/modules/bots/runtimeSessionPositionCommand.service.test.ts`
- `pnpm --filter api run typecheck`
- `pnpm run quality:guardrails`

## Current Classification

- authenticated production `PAPER` operator evidence: `PARTIAL`
- `PAPER` manual add: `PASS`
- `PAPER` manual close: `PASS` after fresh production deploy confirmation
- `PAPER` dashboard real-UI walkthrough: `PARTIAL PASS`
- full `V1EXCEL-03` remains incomplete because:
  - `LIVE` exchange-authority scenarios are still pending
  - restart/recovery and mixed-origin `LIVE` scenarios are still pending
  - `PAPER` UI walkthrough is not yet a full trade-placement walkthrough from
    the browser itself, only an authenticated operator-state verification
