# Docs Health Report

Updated: 2026-05-31

This report focuses on documentation structure, generated sources, and cleanup candidates.

## Folder Entries

| Folder | Files | Entry | Role |
| --- | --- | --- | --- |
| . | 5 | [[README.md]] | Root entrypoints and documentation policy. |
| adr | 3 | [[adr/README.md]] | Supporting documentation folder. |
| analysis | 12 | [[analysis/README.md]] | Supporting documentation folder. |
| architecture | 744 | [[architecture/README.md]] | Canonical runtime, graph, contracts, and ownership truth. |
| automation | 3 | [[automation/README.md]] | Supporting documentation folder. |
| contracts | 2 | [[contracts/README.md]] | Supporting documentation folder. |
| decisions | 2 | [[decisions/README.md]] | Supporting documentation folder. |
| engineering | 3 | [[engineering/README.md]] | Supporting documentation folder. |
| flows | 2 | [[flows/README.md]] | Supporting documentation folder. |
| governance | 21 | [[governance/README.md]] | Supporting documentation folder. |
| graphs | 2 | [[graphs/README.md]] | Supporting documentation folder. |
| maps | 7 | [[maps/README.md]] | Human/agent navigation maps and canvas surfaces. |
| modules | 47 | [[modules/README.md]] | Implementation-facing module ownership and tests. |
| obsidian | 8 | [[obsidian/README.md]] | Obsidian-first dashboard, AI brief, and cleanup layer. |
| operations | 70 | [[operations/README.md]] | Runbooks, deploy, rollback, proof, and operator workflows. |
| pipelines | 11 | [[pipelines/README.md]] | Supporting documentation folder. |
| planning | 18 | [[planning/README.md]] | Plans, open decisions, queues, and work packages. |
| product | 17 | [[product/README.md]] | Product intent, scope, users, roadmap, and limits. |
| quality | 2 | [[quality/README.md]] | Supporting documentation folder. |
| releases | 3 | [[releases/README.md]] | Supporting documentation folder. |
| security | 9 | [[security/README.md]] | Supporting documentation folder. |
| status | 10 | [[status/README.md]] | Generated current-state snapshots and proof status. |
| testing | 2 | [[testing/README.md]] | Supporting documentation folder. |
| ux | 22 | [[ux/README.md]] | Design system, quality bar, and visual workflow. |

## Graph Sources

| Source | Rows | Owns |
| --- | --- | --- |
| [[architecture/registry/nodes.csv]] | 645 | features, pages, APIs, services, data, tests, docs, and agent nodes |
| [[architecture/chains/chains.csv]] | 27 | end-to-end function chains |
| [[architecture/relations/dependencies.csv]] | 807 | directed dependency and usage relations |
| [[architecture/indices/user-action-index.csv]] | 39 | user-visible action proof mapping |
| [[architecture/indices/function-chain-evidence-index.csv]] | 27 | generated chain evidence summary |

## Dated Docs Review Queue

These files are not automatically wrong. They are candidates to review because their names suggest historical task, audit, or proof material. If they still describe current truth, distill that truth into the owning current doc and keep or move the dated file deliberately.

| File | Folder | Review reason |
| --- | --- | --- |
| [[analysis/luc-113-docs-analysis-provenance-closure-2026-05-26.md]] | analysis | dated task-style doc |
| [[analysis/luc-197-docs-memory-loop-2026-05-26.md]] | analysis | dated task-style doc |
| [[analysis/luc-20-docs-index-template-feedback-audit-2026-05-25.md]] | analysis | dated task-style doc |
| [[analysis/luc-333-docs-memory-loop-2026-05-27.md]] | analysis | dated task-style doc |
| [[analysis/luc-48-autonomous-map-inventory-and-ui-polish-readiness-gate-2026-05-25.md]] | analysis | dated task-style doc |
| [[analysis/luc-49-ui-state-browser-proof-matrix-2026-05-25.md]] | analysis | dated task-style doc |
| [[analysis/luc-81-docs-memory-loop-2026-05-26.md]] | analysis | dated task-style doc |
| [[analysis/reusable-audit-registry.md]] | analysis | dated/audit/proof naming |
| [[architecture/chains/CHAIN-LOGS-AUDIT.md]] | architecture | dated/audit/proof naming |
| [[architecture/chains/CHAIN-RELEASE-AUDIT-TOOLING.md]] | architecture | dated/audit/proof naming |
| [[architecture/nodes/SOAR-COMP-AUDIT-TRAIL-VIEW.md]] | architecture | dated/audit/proof naming |
| [[architecture/nodes/SOAR-FEATURE-LOGS-AUDIT.md]] | architecture | dated/audit/proof naming |
| [[architecture/nodes/SOAR-FEATURE-RELEASE-AUDIT-TOOLING.md]] | architecture | dated/audit/proof naming |
| [[architecture/nodes/SOAR-TEST-RELEASE-AUDIT-TOOLING.md]] | architecture | dated/audit/proof naming |
| [[architecture/nodes/SOAR-TOOL-REUSABLE-AUDIT-CHECKERS.md]] | architecture | dated/audit/proof naming |
| [[architecture/nodes/SOAR-WORKFLOW-LOGS-AUDIT-CHAIN.md]] | architecture | dated/audit/proof naming |
| [[architecture/nodes/SOAR-WORKFLOW-RELEASE-AUDIT-TOOLING-CHAIN.md]] | architecture | dated/audit/proof naming |
| [[operations/api-endpoint-docs-parity-2026-05-26/api-endpoint-docs-parity-2026-05-26.md]] | operations | dated/audit/proof naming |
| [[operations/api-endpoint-docs-parity-2026-05-27/api-endpoint-docs-parity-2026-05-27.md]] | operations | dated/audit/proof naming |
| [[operations/i18n-route-reachable-audit-contract.md]] | operations | dated/audit/proof naming |
| [[operations/prod-ui-module-clickthrough-2026-05-26.md]] | operations | dated/audit/proof naming |
| [[pipelines/reporting-and-audit-read.md]] | pipelines | dated/audit/proof naming |
| [[planning/application-completion-audit-task-contract-template.md]] | planning | dated/audit/proof naming |
| [[status/advanced-template-propagation-index-2026-05-25.md]] | status | dated/audit/proof naming |
| [[status/template-propagation-index-2026-05-25.md]] | status | dated/audit/proof naming |

## Inbox

Unnamed Obsidian scratch files were moved to [[obsidian/_inbox/README.md|Obsidian Inbox]]. Review before deleting.
