# XADAPT-06 Readiness Packet

Status: Closed 2026-04-25  
Updated: 2026-04-25

## Purpose

Publish one staged readiness packet for the first post-Binance exchange
rollout, now that the repository has:

- one frozen exchange capability matrix
- one explicit audit of Binance-specific assumptions
- one feature-facing exchange adapter boundary
- one focused closure pack proving the boundary stays honest for V1

This packet is planning-only. It does not authorize or implement a second
exchange yet.

## Chosen Next Exchange

`BYBIT`

## Why BYBIT First

`BYBIT` is the most suitable next target from the currently declared exchange
set because:

1. it already exists in the enum and capability surfaces, so we are not adding
   a brand-new product vocabulary
2. it is futures-relevant, which matches the current Binance-first live runtime
   shape more closely than `KRAKEN` or `COINBASE`
3. the new boundary and capability matrix can absorb it incrementally without
   reopening architecture for a different market model first

This is still a planning choice, not an implementation commitment.

## Frozen Rollout Rule

Do not ship `BYBIT` as a single all-at-once "supported exchange".

Rollout must move strictly in this order:

1. `API_KEY_PROBE`
2. `BALANCE_PREVIEW`
3. `POSITIONS_SNAPSHOT`
4. `OPEN_ORDERS_SNAPSHOT`
5. `LIVE_ORDER_SUBMIT`

`LIVE_ORDER_CANCEL` stays explicitly unsupported and out of scope for the
entire rollout unless architecture and code add a canonical exchange-cancel
boundary first.

## Stage Definitions

### Stage 0 - Readiness Audit Only

Goal:
- confirm which Binance assumptions still block `BYBIT`

Must inventory:
- connector bootstrap assumptions
- symbol format normalization assumptions
- futures-only mark-price and trading-rules expectations
- reconciliation ownership assumptions tied to Binance-only runtime scope
- any API-key onboarding or permission copy that is Binance-specific

Deliverable:
- one concrete blocker matrix with file ownership and follow-up task list

### Stage 1 - `API_KEY_PROBE`

Goal:
- verify `BYBIT` credentials can be tested safely and deterministically

Minimum contract:
- explicit pass/fail result for valid credentials
- explicit permission/auth/network error mapping
- no persistence of raw secrets
- no implied support for balance, reads, or live submit yet

Validation:
- focused API-key probe tests
- manual settings/API-key flow smoke

### Stage 2 - `BALANCE_PREVIEW`

Goal:
- enable wallet preview only after probe contract exists

Minimum contract:
- `BYBIT` enabled only for `BALANCE_PREVIEW`
- wallet preview remains fail-closed for unsupported market type or currency
- no inference from `LIVE_EXECUTION`

Validation:
- focused wallet preview tests
- manual browser flow in settings/wallet creation

### Stage 3 - `POSITIONS_SNAPSHOT`

Goal:
- enable authenticated external position reads

Minimum contract:
- explicit source labeling
- deterministic `apiKeyId` ownership handling
- fail-closed on ambiguity
- no runtime takeover/reconciliation broadening yet

Validation:
- focused snapshot tests
- manual positions view smoke using the exchange-snapshot path

### Stage 4 - `OPEN_ORDERS_SNAPSHOT`

Goal:
- enable authenticated open-order reads

Minimum contract:
- same ownership and ambiguity contract as positions snapshot
- truthful normalization of side/type/status/remaining quantity
- no reconciliation adoption yet

Validation:
- focused snapshot tests
- manual positions/orders snapshot smoke

### Stage 5 - `LIVE_ORDER_SUBMIT`

Goal:
- only after the earlier read-side stages are stable

Minimum contract:
- explicit capability enablement only for `BYBIT`
- live submit path uses the existing boundary, not direct feature-module wiring
- pretrade guards and leverage convergence remain fail-closed
- no exchange-side cancel implied

Validation:
- focused submit-contract tests
- adversarial fail-closed tests
- operator smoke on manual LIVE open

## Blocker Matrix

### Blocker A - Binance-only reconciliation scope

Current truth:
- `livePositionReconciliation.service.ts` and takeover-oriented ownership logic
  still intentionally hard-filter `BINANCE` / `FUTURES`

Impact:
- `BYBIT` must not be wired into reconciliation or takeover just because
  snapshots become available

Rule:
- treat reconciliation broadening as a separate post-readiness wave

### Blocker B - Generic low-level connector factory

Current truth:
- `exchangeConnectorFactory.service.ts` can instantiate any exchange enum

Impact:
- unsupported exchanges can look executable if capability gates are skipped

Rule:
- all new `BYBIT` work must enter through the boundary and matrix first

### Blocker C - Symbol and market-shape assumptions

Current truth:
- current normalization and test fixtures are heavily shaped by Binance futures

Impact:
- `BYBIT` may require explicit normalization and fixture additions before read
  parity can be trusted

Rule:
- add targeted normalization tests before broadening any read capability

### Blocker D - Capability inference drift

Current truth:
- broad `LIVE_EXECUTION` still exists in shared metadata for eligibility flows

Impact:
- future code could infer read or cancel support from that flag

Rule:
- every `BYBIT` stage must change the explicit family-specific matrix and tests
  first, not rely on shared broad capability metadata

## Non-Goals

- no `BYBIT` implementation in this packet
- no reconciliation takeover support for non-Binance exchanges
- no exchange-side cancel support
- no multi-exchange runtime fan-out redesign

## Recommended Execution Order

When this packet is actually executed later, the next wave should be:

1. `BYBIT-01 audit(blockers): inventory Bybit-specific gaps against the frozen boundary`
2. `BYBIT-02 test(api-key-probe-red): lock probe contract and unsupported cases`
3. `BYBIT-03 fix(api-key-probe): enable probe support through the current exchange boundary`
4. `BYBIT-04 test(balance-preview-red): lock wallet preview contract for Bybit`
5. `BYBIT-05 fix(balance-preview): enable wallet preview only`
6. `BYBIT-06 test(snapshot-red): lock positions/open-orders snapshot contracts`
7. `BYBIT-07 fix(snapshot): enable authenticated snapshot reads without reconciliation broadening`
8. `BYBIT-08 decision(live-submit-gate): re-evaluate whether live submit is safe to queue`

## Exit Criteria For XADAPT-A

The exchange hardening wave is complete when:

- Binance truth is frozen, narrowed, and closure-tested
- the repository has one explicit next-exchange target
- staged rollout order is fixed
- blockers and non-goals are documented before any real second-exchange coding

That state is now achieved by this packet.
