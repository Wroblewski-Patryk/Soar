# 08 Operator Surfaces and Routing

## Purpose
Define the operator-facing architecture: what each surface is for, how runtime scope is presented, and how routing is organized.

## Primary Surfaces
### Dashboard
- global control center
- first place for risk, status, stale-data, and onboarding visibility
- selected-bot runtime snapshot

### Bots
- runtime operations workspace
- bot-specific monitoring, assistant configuration, and detailed runtime views

### Adjacent setup modules
- exchanges or profile integrations
- wallets
- markets
- strategies
- backtests
- reports
- logs

## Wallet-First IA
The canonical setup order is:
1. Exchanges and credentials
2. Wallets
3. Markets
4. Strategies
5. Bots
6. Backtests and reports

Wallets come before bot creation because wallet context owns mode and capital semantics.

## Runtime Surface Rules
- dashboard runtime is selected-bot scoped
- selected-bot data must remain strict and fail-closed
- empty runtime tables are valid states, not a reason to hide surfaces
- dashboard and bot preview must stay parity-compatible for the same bot where the product contract says they should

## Canonical View States
All operator surfaces must use explicit:
- `loading`
- `empty`
- `degraded`
- `error`
- `success`

## Routing Role
Routes exist to expose consistent operator entrypoints, not to redefine business rules.

Route truth belongs to:
- canonical route inventory
- surface ownership
- guarded redirects for historical aliases

## Canonical Split
- `dashboard` = global overview and action funnel
- `bots` = runtime monitoring center
- `profile` and `exchanges` = credentials and account settings

## Out of Scope
- low-level component implementation details
- detailed UI styling rules

## Supporting References
- `dashboard-route-map.md`
- `app-shell-template-split-contract.md`
- `dashboard-loading-ux-contract.md`

## Related Files
- [02 System Topology](./02_system-topology.md)
- [10 Safety, Entitlements, and Risk](./10_safety-entitlements-and-risk.md)
