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
1. `01_overview-and-principles.md`
2. `02_system-topology.md`
3. `03_domain-model.md`
4. `04_runtime-contexts.md`
5. `05_strategy-signal-and-decision-flow.md`
6. `06_execution-lifecycle.md`
7. `07_modes-parity-and-data.md`
8. `08_operator-surfaces-and-routing.md`
9. `09_integrations-deployment-and-runtime-services.md`
10. `10_safety-entitlements-and-risk.md`
11. `11_assistant-runtime.md`
12. `12_documentation-governance.md`

## Architecture Rules
- One file = one responsibility.
- File order matches system understanding and execution flow.
- Resolved architecture decisions belong here, not in planning notes.
- Module docs may explain implementation, but they do not override this folder.
- If a rule matters for runtime safety, source-of-truth ownership, or parity, it must be explicit here.

## Supporting References
Detailed supporting contracts remain in this folder for deeper reference, but the numbered files above are canonical summaries.

Historical or superseded files should be treated as non-canonical unless they explicitly state otherwise.
