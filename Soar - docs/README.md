# Documentation Index

Use `docs/` as the canonical home for project documentation.

## Recommended Structure

- `architecture/`
  system design, modules, integration boundaries, deployment topology
- `engineering/`
  local development, technical workflows, stack-specific implementation notes
- `modules/`
  optional implementation-facing deep-dives for code ownership, routes,
  dependencies, and tests
- `governance/`
  rules for language, repository layout, delegation, and working agreements
- `operations/`
  deploy, smoke, rollback, backups, monitoring, and operator runbooks
- `planning/`
  execution plan, next commits queue, open decisions
- `product/`
  overview, product rules, scope, user value, roadmap inputs
- `security/`
  baseline security expectations and sensitive-area notes
- `ux/`
  source-of-truth policy, experience quality bar, reusable pattern memory, and
  design evidence rules

## Index Rules

- Update this file when new canonical docs are added, moved, or renamed.
- Prefer repository-relative links.
- Keep project docs in English.

## Agent Operating Docs

These files live outside `docs/` because they are execution state, not product
or architecture truth:

- `.agents/core/operating-system.md`
- `.agents/core/execution-loop.md`
- `.agents/core/anti-regression.md`
- `.agents/core/quality-gates.md`
- `.agents/state/current-focus.md`
- `.agents/state/known-issues.md`
- `.agents/state/regression-log.md`
- `.agents/state/system-health.md`
- `.agents/state/next-steps.md`

## Starter Canonical Docs

- Main Map:
  - `documentation-map.md`
  - `maps/documentation-maps.md`
  - `maps/agent-work-map.md`
  - `maps/architecture-map.md`
  - `maps/product-map.md`
  - `maps/release-ops-map.md`
- Product:
  - `product/overview.md`
  - `product/product.md`
  - `product/mvp_scope.md`
  - `product/problem-statement.md`
  - `product/user-model.md`
  - `product/success-metrics.md`
  - `product/non-goals.md`
  - `product/capability-map.md`
- Architecture:
  - `architecture/README.md`
  - `architecture/system-architecture.md`
  - `architecture/tech-stack.md`
  - `architecture/architecture-source-of-truth.md`
  - `architecture/agent-system-primitives.md` (optional for agent-heavy apps)
  - `architecture/codebase-map.md`
  - `architecture/traceability-matrix.md`
  - `architecture/capability-to-implementation-map.csv`
  - `architecture/data-ownership-map.md`
  - `architecture/data-lifecycle-map.csv`
  - `architecture/architecture-evidence-graph-system.md` (optional for larger
    projects)
  - `architecture/registry/README.md` and `architecture/registry/*.csv`
  - `architecture/relations/dependencies.csv`
  - `architecture/chains/chains.csv`
- Engineering:
  - `engineering/local-development.md`
  - `engineering/testing.md`
- Modules (optional for larger repositories):
  - `modules/README.md`
  - `modules/system-modules.md`
  - `modules/module-deep-dive-template.md`
  - `modules/module-doc-status-index.md`
- Planning:
  - `planning/mvp-execution-plan.md`
  - `planning/mvp-next-commits.md`
  - `planning/open-decisions.md`
  - `planning/planning-catalog-index.md` (optional)
  - `planning/idea-to-function-chain-playbook.md`
  - `planning/idea-ledger.csv`
  - `planning/work-package-index.csv`
  - `planning/work-package-template.md`
- Decisions:
  - `decisions/README.md`
  - `decisions/decision-register.csv`
  - `decisions/ADR-000-template.md`
- Pipelines:
  - `pipelines/pipeline-registry.md`
  - `pipelines/pipeline-template.md`
- Releases:
  - `releases/release-train.md`
  - `releases/release-index.csv`
  - `releases/release-template.md`
- Governance:
  - `governance/working-agreements.md`
  - `governance/language-policy.md`
  - `governance/repository-structure-policy.md`
  - `governance/subagent-delegation-policy.md`
  - `governance/code-quality-guardrails.md` (optional)
  - `governance/template-usage.md`
  - `governance/existing-project-adoption-playbook.md`
  - `governance/agent-readiness-checklist.md`
  - `governance/template-adoption-decision-log.md` (optional for existing repos)
  - `governance/agent-setup-blueprint.md` (optional)
  - `governance/app-creation-playbook.md`
  - `governance/user-feedback-loop.md`
  - `governance/world-class-product-engineering-standard.md`
  - `governance/autonomous-engineering-loop.md`
  - `governance/function-coverage-ledger-standard.md`
  - `governance/function-coverage-ledger-template.csv`
  - `governance/agent-runtime-contract.md` (optional for architecture-heavy or
    agent-heavy apps)
- Operations:
  - `operations/coolify-vps-deployment-contract.md`
  - `operations/deployment-template-local-stage-production.md` (optional for
    local/stage/prod promotion workflows)
  - `operations/environment-matrix.md`
  - `operations/service-topology.md`
  - `operations/runtime-config-ledger.csv`
  - `operations/post-deploy-smoke.md`
  - `operations/project-control-system.md` (optional for larger or long-running
    autonomous builds)
  - `operations/rollback-and-recovery.md`
  - `operations/service-reliability-and-observability.md`
  - `operations/persistent-agent-runtime-playbook.md` (optional for heartbeat,
    scheduled, or resumable agents)
  - `operations/approval-aware-agent-command-flow.md` (optional for agent
    tools, MCP, provider actions, or command routes)
  - `operations/external-operational-memory-agent-playbook.md` (optional for
    agents that write durable memory to external systems)
- Security:
  - `security/security-baseline.md`
  - `security/secure-development-lifecycle.md`
- Quality:
  - `quality/quality-attribute-scenarios.md`
- Automation:
  - `automation/tooling-contract.md`
  - `automation/agent-command-catalog.csv`
  - `automation/guardrail-commands.md`
- UX:
  - `ux/ux-ui-mcp-collaboration.md`
  - `ux/stitch-mcp-playbook.md`
  - `ux/design-system-contract.md`
  - `ux/experience-quality-bar.md`
  - `ux/design-memory.md`
  - `ux/visual-direction-brief.md`
  - `ux/ui-scorecard.md`
  - `ux/pattern-gallery.md`
  - `ux/screen-quality-checklist.md`
  - `ux/anti-patterns.md`
  - `ux/brand-personality-tokens.md`
  - `ux/canonical-visual-implementation-workflow.md`
  - `ux/background-and-decorative-asset-strategy.md`
  - `ux/evidence-driven-ux-review.md`

## History

Historical task files, plans, audits, evidence, release packets, and raw
artifacts belong in `../history/`, starting with `../history/history-overview.md`.
Do not mix historical work records into current source-of-truth docs.
