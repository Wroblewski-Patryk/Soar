# Architecture Graph Web Runtime Surfaces Backfill - 2026-05-24

## Context

The architecture evidence graph is the Obsidian-first source of truth for
systemic feature, component, test, documentation, and dependency tracking. The
current drift audit still showed unmapped Web runtime surface files under
Dashboard Home and Bots monitoring after the API platform safety checkpoint.

## Goal

Backfill the Web runtime surfaces slice into the architecture graph so agents
can trace dashboard runtime and bot monitoring UI behavior through Web
components, helpers, runtime API boundaries, tests, docs, and execution chain
evidence.

## Scope

- Dashboard Home runtime sidebar, onboarding, signal, derivation, UI helper,
  trade metadata, and formatter surfaces.
- Bots monitoring tabs, monitoring sections, protection cells, attribution
  pills, future signals, portfolio history, labels, and formatters.
- Web runtime surface test coverage records.
- A chain record and Obsidian chain note for Web runtime surfaces.
- Source-of-truth state updates for graph coverage and drift status.

## Constraints

- Do not alter runtime product behavior.
- Keep documentation artifacts in English.
- Use existing architecture graph CSV schema and generator behavior.
- Preserve logical `docs/...` file paths even though this checkout currently
  stores canonical docs under `docs/`.
- Do not claim full repository coverage while drift gaps remain.

## Definition Of Done

- Web runtime surface nodes exist in graph CSV records.
- Relations connect Web runtime UI surfaces to parent components, helpers,
  runtime API service boundaries, tests, and docs.
- `CHAIN-WEB-RUNTIME-SURFACES` exists in chain CSV and Markdown form.
- Graph generation passes.
- Drift audit reports updated coverage and remaining missing paths.
- Project state files record the checkpoint and residual risk.

## Result Report

Status: `verified_local`

Implemented:

- Added Web runtime surface feature, component, utility, test, and workflow
  nodes.
- Added Web runtime surface relations for dashboard runtime composition, bot
  monitoring composition, Web service/API links, test proof links, and module
  docs links.
- Added `CHAIN-WEB-RUNTIME-SURFACES` in CSV and
  `docs/architecture/chains/CHAIN-WEB-RUNTIME-SURFACES.md`.
- Updated the architecture evidence graph coverage statement.

Validation:

- `pnpm run architecture:graph:generate` passed with `543` nodes, `624`
  relations, and `23` chains.
- `pnpm run architecture:graph:drift` passed with `510/796` covered and `286`
  missing representative files.

Residual Risk:

- Full repository graph coverage is still incomplete. The next backfill should
  continue through remaining Web components, auth tests, backtest copy/test
  surfaces, workers, migrations, prompts, and docs that remain in the drift
  report.
