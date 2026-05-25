# Architecture Registry Guide

This folder contains CSV node registries for the Soar architecture evidence
graph.

The canonical master node set is `nodes.csv`. The typed CSV files such as
`features.csv`, `functions.csv`, `components.csv`, `api_routes.csv`, and
`tests.csv` are focused working views that make backfill easier for humans and
agents. Keep shared row IDs identical across views.

Use `docs/architecture/relations/dependencies.csv` for edges and
`docs/architecture/chains/chains.csv` for execution-chain records.

Run:

```powershell
pnpm run architecture:graph:generate
```

The generator validates required columns, missing node references, and missing
file references for `nodes.csv`, then writes Obsidian node notes plus graph
exports.

Current coverage is intentionally a seed. Missing entries are not assumed
complete; they are backfill work.
