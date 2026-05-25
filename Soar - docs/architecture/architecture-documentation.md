# Architecture Documentation for Soar

This folder is the canonical source of truth for how Soar works.

Use these files when the question is:
- what the system is,
- how the runtime flows work,
- which entity owns which context,
- which invariants are fail-closed,
- how backtest, paper, and live must stay aligned.

Do not use this folder for:
- execution plans,
- rollout waves,
- closure notes,
- evidence packs,
- module inventory,
- implementation task history.

Those belong elsewhere:
- `docs/planning/` for change sequencing and open work
- `docs/modules/` for code ownership and implementation deep-dives
- `docs/operations/` for runbooks, smoke checks, and evidence
- `docs/product/` for product intent and scope

## Reading Order
1. [Architecture source of truth](./architecture-source-of-truth.md)
2. [Codebase map](./codebase-map.md)
3. [Traceability matrix](./traceability-matrix.md)
4. [Architecture evidence graph system](./architecture-evidence-graph-system.md)
5. [Overview and principles](./01_overview-and-principles.md)
6. [System topology](./02_system-topology.md)
7. [Domain model](./03_domain-model.md)
8. [Runtime contexts](./04_runtime-contexts.md)
9. [Strategy, signal, and decision flow](./05_strategy-signal-and-decision-flow.md)
10. [Execution lifecycle](./06_execution-lifecycle.md)
11. [Modes, parity, and data](./07_modes-parity-and-data.md)
12. [Operator surfaces and routing](./08_operator-surfaces-and-routing.md)
13. [Integrations, deployment, and runtime services](./09_integrations-deployment-and-runtime-services.md)
14. [Safety, entitlements, and risk](./10_safety-entitlements-and-risk.md)
15. [Assistant runtime](./11_assistant-runtime.md)
16. [Documentation governance](./12_documentation-governance.md)

## Architecture Rules
- One file = one responsibility.
- File order matches system understanding and execution flow.
- Resolved architecture decisions belong here, not in planning notes.
- Module docs may explain implementation, but they do not override this folder.
- If a rule matters for runtime safety, source-of-truth ownership, or parity, it must be explicit here.

## Supporting References
- [Reference contracts](./reference/architecture-reference-contracts.md) contains active supporting contracts for deeper detail.
- [Codebase map](./codebase-map.md) maps current implementation surfaces to architecture and
  module docs.
- [Traceability matrix](./traceability-matrix.md) maps core features across frontend, API, services,
  data, pipelines, tests, and docs.
- [Architecture evidence graph system](./architecture-evidence-graph-system.md)
  defines the Obsidian-first CSV graph registry, generated node notes,
  relation records, function-chain records, and graph exports.
- maintainability and quality remediation invariants live in
  [maintainability remediation contract](./reference/maintainability-remediation-contract.md).
- canonical exchange-access ownership for API modules lives in
  [exchange access ownership matrix](./reference/exchange-access-ownership-matrix.md).
- PnL/ROI-percent position management behavior for DCA, `TP`, `SL`, `TTP`,
  and `TSL` lives in
  [position management PnL lifecycle contract](./reference/position-management-pnl-lifecycle-contract.md).
- [Archive](./archive/architecture-archive.md) contains historical, superseded, and
  compatibility-only files. Do not use it as current architecture truth.

The numbered files above remain the canonical architecture flow.
