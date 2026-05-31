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
| Feature matrix | [[obsidian/feature-index.md|Feature Index]] |
| Route/action matrix | [[obsidian/route-action-map.md|Route Action Map]] |
| Proof gap register | [[obsidian/proof-gap-register.md|Proof Gap Register]] |
| Docs health report | [[obsidian/docs-health-report.md|Docs Health Report]] |
| Function/action proof gaps | [[obsidian/function-journey-hotlist.md|Function Journey Hotlist]] |
| Visual canvas maps | [[obsidian/visual-map-index.md|Visual Map Index]] |
| Product intent | [[maps/product-map.md|Product Map]] |
| Architecture map | [[maps/architecture-map.md|Architecture Map]] |
| Release and ops map | [[maps/release-ops-map.md|Release/Ops Map]] |
| Agent work map | [[maps/agent-work-map.md|Agent Work Map]] |
| Paperclip cleanup contract | [[obsidian/paperclip-cleanup-brief.md|Paperclip Cleanup Brief]] |

## Vault Inventory

- Markdown files: 1025
- CSV indexes/registries: 28
- JSON graph/status exports: 7
- Canvas maps: 5
- Architecture registry nodes: 645
- Function chains: 27
- User action rows: 39
- Web journey rows: 36
- API surface rows: 96

## Folders

| Folder | Files | Entry |
| --- | --- | --- |
| . | 5 | [[README.md]] |
| adr | 3 | [[adr/README.md]] |
| analysis | 12 | [[analysis/README.md]] |
| architecture | 744 | [[architecture/README.md]] |
| automation | 3 | [[automation/README.md]] |
| contracts | 2 | [[contracts/README.md]] |
| decisions | 2 | [[decisions/README.md]] |
| engineering | 3 | [[engineering/README.md]] |
| flows | 2 | [[flows/README.md]] |
| governance | 21 | [[governance/README.md]] |
| graphs | 2 | [[graphs/README.md]] |
| maps | 7 | [[maps/README.md]] |
| modules | 47 | [[modules/README.md]] |
| obsidian | 8 | [[obsidian/README.md]] |
| operations | 70 | [[operations/README.md]] |
| pipelines | 11 | [[pipelines/README.md]] |
| planning | 18 | [[planning/README.md]] |
| product | 17 | [[product/README.md]] |
| quality | 2 | [[quality/README.md]] |
| releases | 3 | [[releases/README.md]] |
| security | 9 | [[security/README.md]] |
| status | 10 | [[status/README.md]] |
| testing | 2 | [[testing/README.md]] |
| ux | 22 | [[ux/README.md]] |

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

## Visual Maps

| Map | Use |
| --- | --- |
| [[maps/soar-obsidian-dashboard.canvas]] | Start here; shows the docs command layer and AI/Paperclip entrypoints. |
| [[maps/soar-function-journey.canvas]] | Shows the evidence flow from product intent to action, chain, API, web, and proof gaps. |
| [[maps/soar-chain-map.canvas]] | Shows all generated function chains grouped by feature and status. |
| [[maps/soar-action-proof-map.canvas]] | Shows high-risk user actions and their proof boundaries. |
| [[maps/soar-docs-folder-map.canvas]] | Shows top-level docs folders and their entry notes. |

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
