# 10 Safety, Entitlements, and Risk

## Purpose
Define the fail-closed safety model that constrains Soar across product, runtime, and operator actions.

## Core Safety Rules
- no hidden fallback for critical trading context
- no automatic flip while a symbol already has an open position
- no live execution without explicit capability and consent checks
- no silent downgrade from exchange truth to guessed truth
- no runtime side effects without replay-safe semantics

## LIVE Guardrails
LIVE actions require:
- authenticated ownership
- compatible wallet and venue context
- explicit user consent where required
- risk acknowledgement for manual live-impacting commands
- exchange-side validation where relevant

## Entitlement Model
The canonical plan catalog is:
- `FREE`
- `ADVANCED`
- `PROFESSIONAL`

Legacy plan wording such as `simple` is non-canonical and must not be used as the architecture truth.

## Entitlement Responsibilities
Entitlements gate:
- bot counts
- live trading capability
- cadence options
- concurrent backtests
- selected premium features

## Cadence Policy
- cadence uses one global allowed interval catalog
- plan entitlements enable a subset of that catalog
- unavailable values may be visible, but they remain disabled
- no arbitrary free-form runtime cadence values

## Capital and Risk Rules
- wallet budget is authoritative for execution affordability
- insufficient funds reject commands; runtime does not guess smaller size
- lifecycle protections remain explicit and ordered

## Operator Safety
- risky actions require explicit confirmation
- blocked or degraded runtime states must stay visible
- no “nothing happened” ambiguity when a decision was blocked

## Example Fail-Closed Outcomes
- venue mismatch -> reject
- wallet mismatch -> reject
- insufficient funds -> reject
- merge ambiguity -> `NO_TRADE`
- live credential mismatch -> reject

## Supporting References
- `subscription-tier-entitlements-contract.md`
- `wallet-source-of-truth-contract.md`
- `live-fee-reconciliation-contract.md`
- `runtime-execution-idempotency-contract.md`

## Related Files
- [04 Runtime Contexts](./04_runtime-contexts.md)
- [06 Execution Lifecycle](./06_execution-lifecycle.md)
