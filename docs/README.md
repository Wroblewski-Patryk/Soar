# Documentation Index

This folder contains canonical project documentation grouped by responsibility.

## Structure
- `architecture/`: canonical description of how Soar works
- `engineering/`: local development and testing workflow
- `planning/`: active queue, execution plans, and unresolved decisions
- `product/`: mission, scope, glossary, limits, and product intent
- `operations/`: runbooks, smoke checks, deployment, rollback, and evidence
- `security/`: security and risk policy
- `ux/`: design-system and UX implementation guidance
- `ux/view-generation-prompt-pack.md`: ready prompt contract for AI-generated
  screen and dashboard work in this repository
- `governance/`: repository rules and agent workflow policies
- `governance/code-quality-guardrails.md`: temporary exception policy for
  maintainability debt that is actively being removed
- `governance/function-coverage-ledger-standard.md`: reusable function coverage
  and readiness ledger standard for release planning across projects
- `governance/function-coverage-ledger-template.csv`: copyable starter CSV for
  projects adopting the ledger standard
- `adr/`: architecture decision records when decisions need standalone history
- `modules/`: implementation-oriented deep-dives mapped to code ownership

## Recommended Reading Order
1. `product/autonomous-agent-vision.md`
2. `product/overview.md`
3. `product/product.md`
4. `architecture/README.md`
5. `architecture/01_overview-and-principles.md`
6. `architecture/02_system-topology.md`
7. `architecture/03_domain-model.md`
8. `architecture/04_runtime-contexts.md`
9. `architecture/05_strategy-signal-and-decision-flow.md`
10. `architecture/06_execution-lifecycle.md`
11. `architecture/07_modes-parity-and-data.md`
12. `architecture/08_operator-surfaces-and-routing.md`
13. `architecture/09_integrations-deployment-and-runtime-services.md`
14. `architecture/10_safety-entitlements-and-risk.md`
15. `architecture/11_assistant-runtime.md`
16. `architecture/12_documentation-governance.md`
17. `modules/system-modules.md`
18. `planning/mvp-execution-plan.md`
19. `planning/mvp-next-commits.md`
20. `planning/open-decisions.md`

## Source-of-Truth Rule
- Architecture truth belongs in `docs/architecture/`.
- Module deep-dives explain implementation and code ownership, not canonical behavior.
- Planning files describe change sequencing and unresolved work, not the long-term runtime truth.

## Notes
- Root directory stays minimal. Domain documentation belongs under `docs/` categories.
- Historical assumptions and rollout evidence should stay in planning and operations artifacts, not in the canonical architecture set.
## Template Sync: Shared Agent Standards

Additional cross-project standards synced from `!template`:

- `.agents/workflows/user-collaboration.md`
- `.agents/workflows/world-class-delivery.md`
- `docs/governance/world-class-product-engineering-standard.md`
- `docs/operations/service-reliability-and-observability.md`
- `docs/security/secure-development-lifecycle.md`
- `docs/ux/evidence-driven-ux-review.md`
