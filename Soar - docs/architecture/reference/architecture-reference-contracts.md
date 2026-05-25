# Architecture Reference

This folder contains active supporting contracts for the canonical architecture.

Use these files when you need deeper detail than the numbered architecture core
provides, for example:
- transport specifics,
- parity matrices,
- UI/display contracts,
- detailed source-of-truth ownership contracts.

These files are still active documentation, but they do not replace the
numbered architecture flow in `docs/architecture/`.

Read order:
1. [Architecture Documentation](../architecture-documentation.md)
2. [Overview and principles](../01_overview-and-principles.md) through
   [Documentation governance](../12_documentation-governance.md)
3. only then use the files in this folder as supporting detail

## Contract Index

| Area | Contracts |
| --- | --- |
| Runtime lifecycle and parity | [execution-lifecycle-parity-contract.md](./execution-lifecycle-parity-contract.md), [live-runtime-lifecycle-parity-contract.md](./live-runtime-lifecycle-parity-contract.md), [position-lifecycle-parity-matrix.md](./position-lifecycle-parity-matrix.md), [position-management-pnl-lifecycle-contract.md](./position-management-pnl-lifecycle-contract.md), [runtime-execution-idempotency-contract.md](./runtime-execution-idempotency-contract.md), [runtime-signal-merge-contract.md](./runtime-signal-merge-contract.md), [strategy-evaluation-parity-contract.md](./strategy-evaluation-parity-contract.md) |
| Exchange, venue, and live safety | [exchange-access-ownership-matrix.md](./exchange-access-ownership-matrix.md), [live-exchange-protection-order-contract.md](./live-exchange-protection-order-contract.md), [live-fee-reconciliation-contract.md](./live-fee-reconciliation-contract.md), [live-futures-lifecycle-price-contract.md](./live-futures-lifecycle-price-contract.md), [live-paper-runtime-safety-contract.md](./live-paper-runtime-safety-contract.md), [live-position-restart-continuity-contract.md](./live-position-restart-continuity-contract.md), [live-protection-state-parity-contract.md](./live-protection-state-parity-contract.md), [live-safety-and-contract-truth-remediation-contract.md](./live-safety-and-contract-truth-remediation-contract.md), [venue-context-source-of-truth-contract.md](./venue-context-source-of-truth-contract.md), [v1-production-activation-contract.md](./v1-production-activation-contract.md) |
| Dashboard and UX contracts | [admin-frontend-architecture.md](./admin-frontend-architecture.md), [app-shell-template-split-contract.md](./app-shell-template-split-contract.md), [coin-icon-source-contract.md](./coin-icon-source-contract.md), [dashboard-loading-ux-contract.md](./dashboard-loading-ux-contract.md), [dashboard-route-map.md](./dashboard-route-map.md), [dashboard-signal-panel-ia-contract.md](./dashboard-signal-panel-ia-contract.md), [dashboard-trade-history-financial-semantics-contract.md](./dashboard-trade-history-financial-semantics-contract.md), [dca-ladder-display-contract.md](./dca-ladder-display-contract.md), [dynamic-stop-display-contract.md](./dynamic-stop-display-contract.md), [numeric-input-policy.md](./numeric-input-policy.md), [position-close-attribution-contract.md](./position-close-attribution-contract.md) |
| Data, wallets, and entitlements | [live-wallet-cashflow-ledger-contract.md](./live-wallet-cashflow-ledger-contract.md), [subscription-tier-entitlements-contract.md](./subscription-tier-entitlements-contract.md), [wallet-source-of-truth-contract.md](./wallet-source-of-truth-contract.md) |
| Platform, maintainability, and transport | [assistant-runtime-contract.md](./assistant-runtime-contract.md), [indicator-registry-parity-contract.md](./indicator-registry-parity-contract.md), [maintainability-remediation-contract.md](./maintainability-remediation-contract.md), [scalability-anti-drift-delivery-contract.md](./scalability-anti-drift-delivery-contract.md), [stream-transport-contract.md](./stream-transport-contract.md), [web-container-split-contract.md](./web-container-split-contract.md) |
