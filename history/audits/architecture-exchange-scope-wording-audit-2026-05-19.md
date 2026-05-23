# Architecture Exchange Scope Wording Audit - 2026-05-19

## Scope

Audit IDs: `AUD-01`, `AUD-ARCH-001`

Purpose: verify whether architecture source-of-truth files describe the current
exchange support scope consistently.

This audit inspected:

- architecture reading order and source-of-truth policy
- overview and domain-model exchange scope wording
- runtime context and exchange integration contracts
- exchange access ownership matrix
- current shared/code-supported exchange options
- prior architecture-code discrepancy findings

## Result

Status: `current after accepted Binance + Gate.io architecture decision`

This audit originally found older high-level architecture files implying a
narrower exchange baseline than newer architecture contracts and current code
support. `DEC-AUD-001` resolved the discrepancy on 2026-05-19: current
implementation scope is Binance + Gate.io, not Binance-only, while
production/live readiness remains evidence-bound by exact exchange, market
type, and operation.

## Drift Found

| Source | Current Wording / Truth | Status |
| --- | --- | --- |
| `docs/architecture/01_overview-and-principles.md` | `Current canonical baseline` now says Binance and Gate.io exchange implementation scope, with production/live readiness evidence-bound by exact exchange, market type, and operation. | Current after `DEC-AUD-001`. |
| `docs/architecture/03_domain-model.md` | `Current baseline` now says Binance and Gate.io implementation scope with evidence-bound production/live readiness. | Current after `DEC-AUD-001`. |
| `docs/architecture/04_runtime-contexts.md` | `ExchangeContext` includes `BINANCE`, `GATEIO`, `BYBIT`, `OKX`, `KRAKEN`, `COINBASE`; explicitly says `GATEIO + FUTURES` is distinct from `BINANCE + FUTURES`. | Current exact-context architecture. |
| `docs/architecture/09_integrations-deployment-and-runtime-services.md` | Canonical integration key is `ExchangeContext = (exchange, marketType)`; exchange behavior resolves through exact pair. | Current exact-context architecture. |
| `docs/architecture/reference/exchange-access-ownership-matrix.md` | Compatibility-stage support lists `BINANCE` and `GATEIO` as supported for broad exchange capabilities; exact-stage matrix also lists `GATEIO` operations as supported. | Current detailed exchange contract. |
| `libs/shared/index.js` | `EXCHANGE_OPTIONS` includes `BINANCE`, `BYBIT`, `OKX`, `KRAKEN`, `COINBASE`, `GATEIO`; Gate.io broad capability flags are enabled. | Code-supported exchange option set. |

## Code Reality Checked

Current code and local proof support Binance and Gate.io at least through the
documented exchange-boundary scope:

- shared exchange options include `GATEIO`
- API exchange capability/registry/boundary tests passed in `AUD-09`
- Web exchange capability tests passed in `AUD-09`
- exchange adapter registry accepts exact `(exchange, marketType)` context
- production-safe historical proof covers read-only/fail-closed exchange scope,
  not unrestricted live-money mutation

## Impact

This is a documentation-source risk, not a runtime test failure.

Future agents may start from the architecture reading order, read
`01_overview-and-principles.md` or `03_domain-model.md`, and plan exchange work
as if Gate.io code were non-canonical or out-of-scope. That conflicts with the
newer exchange contracts and current code evidence.

## Accepted Decision

`DEC-AUD-001` was accepted on 2026-05-19:

- current exchange implementation scope is Binance + Gate.io, not Binance-only;
- production/live readiness remains evidence-bound by exact exchange, market
  type, and operation;
- no LIVE or exchange-side mutation is authorized by this decision.

The considered options were:

Valid options:

1. **Update overview/domain to current implementation truth.**
   - `01_overview-and-principles.md` and `03_domain-model.md` would say the
     implementation supports Binance and Gate.io through approved exchange
     boundaries, while production proof remains scoped by current evidence and
     explicit LIVE mutation approval.
   - Best if Gate.io is considered canonical supported implementation scope.

2. **Mark Gate.io as transitional but approved adapter scope.**
   - Overview/domain would keep a narrow production baseline, but explicitly
     state that Gate.io is an approved staged adapter with code support and
     limited production proof.
   - Best if product/release scope intentionally treats Gate.io as staged.

3. **Narrow newer exchange contracts back to Binance-only.**
   - This would require revising `04_runtime-contexts`, `09_integrations`, the
     exchange ownership matrix, module docs, and code expectations.
   - Highest churn and conflicts with current implemented Gate.io support.

## Validation

This audit is documentation/source inspection. No runtime command is required to
prove the wording drift, but it reuses evidence from:

- `history/audits/exchange-capability-truth-audit-2026-05-19.md`
- `history/audits/architecture-code-discrepancy-audit-2026-05-17.md`

## Safety Notes

- No production journey was run.
- No LIVE order, cancel, close, or exchange-side mutation was run.
- No existing production data was mutated.
- No code behavior was changed.
- No architecture repair was applied in this audit.

## Current Reusable Audit State

`AUD-01` is current for the accepted architecture truth after the overview and
domain-model source-of-truth files were updated.
