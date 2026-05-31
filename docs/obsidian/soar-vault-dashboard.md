# Soar Vault Dashboard

Updated: 2026-05-31

## Purpose

Use this as the first opened note in Obsidian. It connects the repository, generated graph data, user actions, function journeys, and AI operating memory into one surface.

## Fast Routes

| Need | Open |
| --- | --- |
| Current documentation map | [[documentation-map.md|Documentation Map]] |
| Engineering traceability hub | [[soar-documentation-map.md|Soar Documentation Map]] |
| Obsidian-specific atlas | [[obsidian/code-to-docs-atlas.md|Code To Docs Atlas]] |
| Function/action proof gaps | [[obsidian/function-journey-hotlist.md|Function Journey Hotlist]] |
| Product intent | [[maps/product-map.md|Product Map]] |
| Architecture map | [[maps/architecture-map.md|Architecture Map]] |
| Release and ops map | [[maps/release-ops-map.md|Release/Ops Map]] |
| Agent work map | [[maps/agent-work-map.md|Agent Work Map]] |
| Paperclip cleanup contract | [[obsidian/paperclip-cleanup-brief.md|Paperclip Cleanup Brief]] |

## Vault Inventory

- Markdown files: 1004
- CSV indexes/registries: 28
- JSON graph/status exports: 7
- Canvas maps: 4
- Architecture registry nodes: 645
- Function chains: 27
- User action rows: 39
- Web journey rows: 36
- API surface rows: 96

## Folders

| Folder | Files | Entry |
| --- | --- | --- |
| . | 5 | [[README.md\|README.md]] |
| adr | 2 | [[adr/0001-agent-governance-baseline.md\|adr/0001-agent-governance-baseline.md]] |
| analysis | 11 | [[analysis/analysis-documentation.md\|analysis/analysis-documentation.md]] |
| architecture | 744 | [[architecture/README.md\|architecture/README.md]] |
| automation | 2 | [[automation/guardrail-commands.md\|automation/guardrail-commands.md]] |
| contracts | 1 | [[contracts/contract-memory.md\|contracts/contract-memory.md]] |
| decisions | 2 | [[decisions/README.md\|decisions/README.md]] |
| engineering | 2 | [[engineering/local-development.md\|engineering/local-development.md]] |
| flows | 1 | [[flows/flow-memory.md\|flows/flow-memory.md]] |
| governance | 20 | [[governance/governance-documentation.md\|governance/governance-documentation.md]] |
| graphs | 1 | [[graphs/architecture-graph.md\|graphs/architecture-graph.md]] |
| maps | 6 | [[maps/agent-work-map.md\|maps/agent-work-map.md]] |
| modules | 47 | [[modules/README.md\|modules/README.md]] |
| obsidian | 6 | [[obsidian/README.md\|obsidian/README.md]] |
| operations | 69 | [[operations/operations-documentation.md\|operations/operations-documentation.md]] |
| pipelines | 10 | [[pipelines/access-session.md\|pipelines/access-session.md]] |
| planning | 17 | [[planning/planning-documentation.md\|planning/planning-documentation.md]] |
| product | 16 | [[product/product-documentation.md\|product/product-documentation.md]] |
| quality | 1 | [[quality/quality-attribute-scenarios.md\|quality/quality-attribute-scenarios.md]] |
| releases | 2 | [[releases/release-template.md\|releases/release-template.md]] |
| security | 8 | [[security/security-documentation.md\|security/security-documentation.md]] |
| status | 9 | [[status/advanced-template-propagation-index-2026-05-25.md\|status/advanced-template-propagation-index-2026-05-25.md]] |
| testing | 1 | [[testing/testing-memory.md\|testing/testing-memory.md]] |
| ux | 21 | [[ux/ux-documentation.md\|ux/ux-documentation.md]] |

## Graph Data

### Node Types

| Type | Count |
| --- | --- |
| service | 139 |
| test | 102 |
| api_route | 96 |
| documentation | 53 |
| component | 48 |
| page | 36 |
| feature | 27 |
| database_model | 23 |
| utility | 21 |
| workflow | 19 |
| controller | 17 |
| config | 12 |
| hook | 12 |
| validation | 12 |
| middleware | 6 |
| validator | 4 |
| model | 3 |
| router | 3 |
| type | 3 |
| agent | 2 |
| worker | 2 |
| context | 1 |
| pipeline | 1 |
| prompt | 1 |
| queue | 1 |
| ui_element | 1 |

### Node Layers

| Layer | Count |
| --- | --- |
| backend | 285 |
| frontend | 133 |
| testing | 102 |
| documentation | 54 |
| fullstack | 26 |
| data | 23 |
| tooling | 13 |
| operations | 5 |
| agent-system | 3 |
| ci | 1 |

### Chain Statuses

| Status | Count |
| --- | --- |
| verified_local | 25 |
| partially_verified | 1 |
| verified | 1 |

### Action Gap Severity

| Severity | Count |
| --- | --- |
| high | 37 |
| none | 2 |

## Dataview: Current Project Docs

```dataview
TABLE file.folder AS Folder, length(file.outlinks) AS Outlinks, length(file.inlinks) AS Inlinks
FROM "architecture" OR "modules" OR "pipelines" OR "operations" OR "product"
SORT file.folder ASC, file.name ASC
LIMIT 80
```

## Dataview: Open Tasks In Docs

```dataview
TASK
FROM ""
WHERE !completed
SORT file.path ASC
LIMIT 80
```
