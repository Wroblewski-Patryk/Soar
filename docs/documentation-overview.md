# Documentation Overview

This folder contains canonical project documentation grouped by responsibility.
Historical task records, dated plans, audits, release evidence, and raw
artifacts live in `../history/` so `docs/` stays focused on current source of
truth.
Guard note: history is evidence, not active owner.

## Engineering System Map
- `soar-documentation-map.md` is the central engineering documentation
  entrypoint. Start there when you need traceability across architecture,
  modules, pipelines, routes, data models, tests, deployment, and drift
  reports.
- The map includes work routes for common tasks: continuation, product
  questions, architecture changes, runtime safety, release proof, evidence
  lookup, and documentation moves.
- `maps/` contains small human/agent navigation hubs for Obsidian graph use.

## Structure
- [Architecture](./architecture/architecture-documentation.md): canonical description of how Soar works.
- [Analysis](./analysis/analysis-documentation.md): documentation inventory and drift reports.
- [Contracts](./contracts/contract-memory.md): agent-readable contract index pointing to canonical contracts.
- [Engineering](./engineering/local-development.md): local development and testing workflow.
- [Flows](./flows/flow-memory.md): agent-readable flow index pointing to canonical pipelines.
- [Pipelines](./pipelines/pipeline-registry.md): end-to-end system flow registry.
- [Planning](./planning/planning-documentation.md): active queue, durable plans, and unresolved decisions.
- [Product](./product/product-documentation.md): mission, scope, glossary, limits, and product intent.
- [Operations](./operations/operations-documentation.md): runbooks, smoke checks, deployment, rollback, and current operational procedures.
- [Maps](./maps/documentation-maps.md): Obsidian-friendly maps of product, architecture, runtime, operations, and agent work.
- [Security](./security/security-documentation.md): security and risk policy.
- [UX](./ux/ux-documentation.md): design-system and UX implementation guidance.
- [Governance](./governance/governance-documentation.md): repository rules and agent workflow policies.
- [Testing](./testing/testing-memory.md): agent-readable testing strategy and validation memory.
- [ADR](./adr/architecture-decision-records.md): architecture decision records when decisions need standalone history.
- [Modules](./modules/module-documentation.md): implementation-oriented deep-dives mapped to code ownership.

## Recommended Reading Order
1. [Autonomous agent vision](./product/autonomous-agent-vision.md)
2. [Product overview](./product/overview.md)
3. [Product specification](./product/product.md)
4. [Architecture Documentation](./architecture/architecture-documentation.md)
5. [Codebase map](./architecture/codebase-map.md)
6. [Traceability matrix](./architecture/traceability-matrix.md)
7. [Architecture evidence graph system](./architecture/architecture-evidence-graph-system.md)
8. [Pipeline registry](./pipelines/pipeline-registry.md)
9. [Module registry](./modules/module-registry.md)
10. [Architecture overview and principles](./architecture/01_overview-and-principles.md)
11. [System topology](./architecture/02_system-topology.md)
12. [Domain model](./architecture/03_domain-model.md)
13. [Runtime contexts](./architecture/04_runtime-contexts.md)
14. [Strategy, signal, and decision flow](./architecture/05_strategy-signal-and-decision-flow.md)
15. [Execution lifecycle](./architecture/06_execution-lifecycle.md)
16. [Modes, parity, and data](./architecture/07_modes-parity-and-data.md)
17. [Operator surfaces and routing](./architecture/08_operator-surfaces-and-routing.md)
18. [Integrations, deployment, and runtime services](./architecture/09_integrations-deployment-and-runtime-services.md)
19. [Safety, entitlements, and risk](./architecture/10_safety-entitlements-and-risk.md)
20. [Assistant runtime](./architecture/11_assistant-runtime.md)
21. [Documentation governance](./architecture/12_documentation-governance.md)
22. [System modules](./modules/system-modules.md)
23. [MVP execution plan](./planning/mvp-execution-plan.md)
24. [MVP next commits](./planning/mvp-next-commits.md)
25. [Open decisions](./planning/open-decisions.md)
26. `.agents/core/operating-system.md`
27. `.agents/core/execution-loop.md`
28. `.agents/core/anti-regression.md`
29. `.agents/core/quality-gates.md`

## Source-of-Truth Rule
- Architecture truth belongs in `docs/architecture/`.
- Module deep-dives explain implementation and code ownership, not canonical behavior.
- Planning files describe change sequencing and unresolved work, not the long-term runtime truth.

## Notes
- Root directory stays minimal. Domain documentation belongs under `docs/` categories.
- Historical assumptions and rollout evidence should stay in planning and operations artifacts, not in the canonical architecture set.
- Historical tasks, old plans, audits, generated evidence, release packets, and
  raw artifacts belong under `../history/`, not under canonical docs folders.
## Template Sync: Shared Agent Standards

Additional cross-project standards adopted for this repository:

- `.agents/workflows/user-collaboration.md`
- `.agents/workflows/world-class-delivery.md`
- `docs/governance/world-class-product-engineering-standard.md`
- `docs/governance/autonomous-engineering-loop.md`
- `docs/operations/service-reliability-and-observability.md`
- `docs/security/secure-development-lifecycle.md`
- `docs/ux/evidence-driven-ux-review.md`

## Existing Project Adoption

- [Existing project adoption playbook](./governance/existing-project-adoption-playbook.md)
- [Agent readiness checklist](./governance/agent-readiness-checklist.md)
- [Template adoption decision log](./governance/template-adoption-decision-log.md)

## Agent App-Building Docs

- [App creation playbook](./governance/app-creation-playbook.md)
- [User feedback loop](./governance/user-feedback-loop.md)
- `.codex/templates/app-blueprint-template.md`
- `.codex/templates/user-feedback-item-template.md`
- `.codex/templates/handoff-packet-template.md`
