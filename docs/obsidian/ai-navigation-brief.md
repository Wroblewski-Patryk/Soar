# AI Navigation Brief

Updated: 2026-05-31

## Mission

Help an AI agent understand Soar quickly without flattening the project into vague summaries. The agent must preserve source-of-truth boundaries and update graph records when behavior changes.

## Read Order

1. [[obsidian/soar-vault-dashboard.md|Soar Vault Dashboard]]
2. [[documentation-map.md|Documentation Map]]
3. [[soar-documentation-map.md|Soar Documentation Map]]
4. [[maps/architecture-map.md|Architecture Map]]
5. [[obsidian/code-to-docs-atlas.md|Code To Docs Atlas]]
6. [[obsidian/function-journey-hotlist.md|Function Journey Hotlist]]
7. [[governance/autonomous-engineering-loop.md|Autonomous Engineering Loop]]
8. [[operations/project-control-system.md|Project Control System]]

## Before Editing

- Identify the affected feature, chain, action, API route, page, module, data model, and tests.
- Check whether the action is protected, destructive, money-facing, or exchange-facing.
- Do not claim production truth from local-only proof.
- Keep history in `../history`; keep current truth in `docs`.

## After Editing

Run the smallest relevant verification first, then update docs:

1. Source code and tests.
2. Module or architecture owner docs.
3. Graph registry CSVs if ownership, routes, functions, APIs, tests, or docs changed.
4. Generated indexes.
5. Status or planning note if proof remains open.
