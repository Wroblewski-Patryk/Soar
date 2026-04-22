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
1. `architecture-source-of-truth.md`
2. `01_overview-and-principles.md`
3. `02_system-topology.md`
4. `03_domain-model.md`
5. `04_runtime-contexts.md`
6. `05_strategy-signal-and-decision-flow.md`
7. `06_execution-lifecycle.md`
8. `07_modes-parity-and-data.md`
9. `08_operator-surfaces-and-routing.md`
10. `09_integrations-deployment-and-runtime-services.md`
11. `10_safety-entitlements-and-risk.md`
12. `11_assistant-runtime.md`
13. `12_documentation-governance.md`

## Architecture Rules
- One file = one responsibility.
- File order matches system understanding and execution flow.
- Resolved architecture decisions belong here, not in planning notes.
- Module docs may explain implementation, but they do not override this folder.
- If a rule matters for runtime safety, source-of-truth ownership, or parity, it must be explicit here.

## Supporting References
- `reference/` contains active supporting contracts for deeper detail.
- maintainability and quality remediation invariants live in
  `reference/maintainability-remediation-contract.md`.
- canonical exchange-access ownership for API modules lives in
  `reference/exchange-access-ownership-matrix.md`.
- `archive/` contains historical, superseded, and compatibility-only files.

The numbered files above remain the canonical architecture flow.
