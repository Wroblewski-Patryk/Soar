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

### 2. Production PAPER manual close still fails before fresh deploy confirmation

The same authenticated production pass proved a remaining operator-visible
close drift:

- manual close on the open `PAPER` position returned `409`
- error code: `POSITION_CLOSE_PRICE_UNAVAILABLE`
- this happened even though runtime positions still displayed a valid
  `markPrice` (`0.1541`) for the same open position

This means the operator-visible read path had stronger price truth than the
command path.

## Code Remediation Prepared

To remove that drift, remediation on `main` now reuses two already approved
price sources in the close command path before it fails closed:

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
- `PAPER` manual close: `FAIL` on current live production response before fresh
  deploy confirmation
- full `V1EXCEL-03` remains incomplete because:
  - real UI walkthrough is still pending
  - `LIVE` exchange-authority scenarios are still pending
  - post-deploy confirmation for the manual-close fix is still pending
