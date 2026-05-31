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
| adr | 3 | [[adr/README.md\|adr/README.md]] | Supporting documentation folder. |
| analysis | 12 | [[analysis/README.md\|analysis/README.md]] | Supporting documentation folder. |
| architecture | 744 | [[architecture/README.md\|architecture/README.md]] | Canonical runtime, graph, contracts, and ownership truth. |
| automation | 3 | [[automation/README.md\|automation/README.md]] | Supporting documentation folder. |
| contracts | 2 | [[contracts/README.md\|contracts/README.md]] | Supporting documentation folder. |
| decisions | 2 | [[decisions/README.md\|decisions/README.md]] | Supporting documentation folder. |
| engineering | 3 | [[engineering/README.md\|engineering/README.md]] | Supporting documentation folder. |
| flows | 2 | [[flows/README.md\|flows/README.md]] | Supporting documentation folder. |
| governance | 21 | [[governance/README.md\|governance/README.md]] | Supporting documentation folder. |
| graphs | 2 | [[graphs/README.md\|graphs/README.md]] | Supporting documentation folder. |
| maps | 7 | [[maps/README.md\|maps/README.md]] | Human/agent navigation maps and canvas surfaces. |
| modules | 47 | [[modules/README.md\|modules/README.md]] | Implementation-facing module ownership and tests. |
| obsidian | 8 | [[obsidian/README.md\|obsidian/README.md]] | Obsidian-first dashboard, AI brief, and cleanup layer. |
| operations | 70 | [[operations/README.md\|operations/README.md]] | Runbooks, deploy, rollback, proof, and operator workflows. |
| pipelines | 11 | [[pipelines/README.md\|pipelines/README.md]] | Supporting documentation folder. |
| planning | 18 | [[planning/README.md\|planning/README.md]] | Plans, open decisions, queues, and work packages. |
| product | 17 | [[product/README.md\|product/README.md]] | Product intent, scope, users, roadmap, and limits. |
| quality | 2 | [[quality/README.md\|quality/README.md]] | Supporting documentation folder. |
| releases | 3 | [[releases/README.md\|releases/README.md]] | Supporting documentation folder. |
| security | 9 | [[security/README.md\|security/README.md]] | Supporting documentation folder. |
| status | 10 | [[status/README.md\|status/README.md]] | Generated current-state snapshots and proof status. |
| testing | 2 | [[testing/README.md\|testing/README.md]] | Supporting documentation folder. |
| ux | 22 | [[ux/README.md\|ux/README.md]] | Design system, quality bar, and visual workflow. |

## Obsidian Use

Open the canvas files directly from this note, or use graph view and filter to:

- `path:architecture` for architecture and graph node docs;
- `path:obsidian` for the command layer;
- `path:maps` for curated map entrypoints;
- `-path:history` when you want only current source-of-truth docs.
