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
2. `codebase-map.md`
3. `traceability-matrix.md`
4. `01_overview-and-principles.md`
5. `02_system-topology.md`
6. `03_domain-model.md`
7. `04_runtime-contexts.md`
8. `05_strategy-signal-and-decision-flow.md`
9. `06_execution-lifecycle.md`
10. `07_modes-parity-and-data.md`
11. `08_operator-surfaces-and-routing.md`
12. `09_integrations-deployment-and-runtime-services.md`
13. `10_safety-entitlements-and-risk.md`
14. `11_assistant-runtime.md`
15. `12_documentation-governance.md`

## Architecture Rules
- One file = one responsibility.
- File order matches system understanding and execution flow.
- Resolved architecture decisions belong here, not in planning notes.
- Module docs may explain implementation, but they do not override this folder.
- If a rule matters for runtime safety, source-of-truth ownership, or parity, it must be explicit here.

## Supporting References
- `reference/` contains active supporting contracts for deeper detail.
- `codebase-map.md` maps current implementation surfaces to architecture and
  module docs.
- `traceability-matrix.md` maps core features across frontend, API, services,
  data, pipelines, tests, and docs.
- maintainability and quality remediation invariants live in
  `reference/maintainability-remediation-contract.md`.
- canonical exchange-access ownership for API modules lives in
  `reference/exchange-access-ownership-matrix.md`.
- `archive/` contains historical, superseded, and compatibility-only files.

The numbered files above remain the canonical architecture flow.
