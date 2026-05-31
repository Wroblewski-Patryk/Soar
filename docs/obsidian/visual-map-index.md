# Visual Map Index

Updated: 2026-05-31

Use this note when you want to browse Soar as node maps rather than as long markdown files.

## Canvas Maps

| Map | Use |
| --- | --- |
| [[maps/soar-obsidian-dashboard.canvas\|Dashboard Canvas]] | Start here; shows the docs command layer and AI/Paperclip entrypoints. |
| [[maps/soar-function-journey.canvas\|Function Journey Canvas]] | Shows the evidence flow from product intent to action, chain, API, web, and proof gaps. |
| [[maps/soar-chain-map.canvas\|Chain Map]] | Shows all generated function chains grouped by feature and status. |
| [[maps/soar-action-proof-map.canvas\|Action Proof Map]] | Shows high-risk user actions and their proof boundaries. |
| [[maps/soar-docs-folder-map.canvas\|Docs Folder Map]] | Shows top-level docs folders and their entry notes. |

## Generated Graph Files

| File | Use |
| --- | --- |
| [[graphs/architecture-graph.md|architecture-graph.md]] | Mermaid-rendered architecture graph in Markdown. |
| [[graphs/architecture-graph.mmd|architecture-graph.mmd]] | Mermaid source for external rendering or editing. |
| [[graphs/architecture-graph.json|architecture-graph.json]] | Machine-readable architecture graph export. |
| [[graphs/function-journey-index.json|function-journey-index.json]] | Machine-readable journey proof index. |
| [[graphs/user-action-index.json|user-action-index.json]] | Machine-readable user action proof index. |

## Folder Entries

| Folder | Files | Entry | Role |
| --- | --- | --- | --- |
| . | 5 | [[README.md\|README.md]] | Root entrypoints and documentation policy. |
| adr | 2 | [[adr/0001-agent-governance-baseline.md\|adr/0001-agent-governance-baseline.md]] | Supporting documentation folder. |
| analysis | 11 | [[analysis/analysis-documentation.md\|analysis/analysis-documentation.md]] | Supporting documentation folder. |
| architecture | 744 | [[architecture/README.md\|architecture/README.md]] | Canonical runtime, graph, contracts, and ownership truth. |
| automation | 2 | [[automation/guardrail-commands.md\|automation/guardrail-commands.md]] | Supporting documentation folder. |
| contracts | 1 | [[contracts/contract-memory.md\|contracts/contract-memory.md]] | Supporting documentation folder. |
| decisions | 2 | [[decisions/README.md\|decisions/README.md]] | Supporting documentation folder. |
| engineering | 2 | [[engineering/local-development.md\|engineering/local-development.md]] | Supporting documentation folder. |
| flows | 1 | [[flows/flow-memory.md\|flows/flow-memory.md]] | Supporting documentation folder. |
| governance | 20 | [[governance/governance-documentation.md\|governance/governance-documentation.md]] | Supporting documentation folder. |
| graphs | 1 | [[graphs/architecture-graph.md\|graphs/architecture-graph.md]] | Supporting documentation folder. |
| maps | 6 | [[maps/agent-work-map.md\|maps/agent-work-map.md]] | Human/agent navigation maps and canvas surfaces. |
| modules | 47 | [[modules/README.md\|modules/README.md]] | Implementation-facing module ownership and tests. |
| obsidian | 8 | [[obsidian/README.md\|obsidian/README.md]] | Obsidian-first dashboard, AI brief, and cleanup layer. |
| operations | 69 | [[operations/operations-documentation.md\|operations/operations-documentation.md]] | Runbooks, deploy, rollback, proof, and operator workflows. |
| pipelines | 10 | [[pipelines/access-session.md\|pipelines/access-session.md]] | Supporting documentation folder. |
| planning | 17 | [[planning/planning-documentation.md\|planning/planning-documentation.md]] | Plans, open decisions, queues, and work packages. |
| product | 16 | [[product/product-documentation.md\|product/product-documentation.md]] | Product intent, scope, users, roadmap, and limits. |
| quality | 1 | [[quality/quality-attribute-scenarios.md\|quality/quality-attribute-scenarios.md]] | Supporting documentation folder. |
| releases | 2 | [[releases/release-template.md\|releases/release-template.md]] | Supporting documentation folder. |
| security | 8 | [[security/security-documentation.md\|security/security-documentation.md]] | Supporting documentation folder. |
| status | 9 | [[status/advanced-template-propagation-index-2026-05-25.md\|status/advanced-template-propagation-index-2026-05-25.md]] | Generated current-state snapshots and proof status. |
| testing | 1 | [[testing/testing-memory.md\|testing/testing-memory.md]] | Supporting documentation folder. |
| ux | 21 | [[ux/ux-documentation.md\|ux/ux-documentation.md]] | Design system, quality bar, and visual workflow. |

## Obsidian Use

Open the canvas files directly from this note, or use graph view and filter to:

- `path:architecture` for architecture and graph node docs;
- `path:obsidian` for the command layer;
- `path:maps` for curated map entrypoints;
- `-path:history` when you want only current source-of-truth docs.
