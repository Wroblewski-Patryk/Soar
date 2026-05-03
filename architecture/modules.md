# Modules

## Module Catalogue

Each concrete project must list its modules using this format:

| Module | Responsibility | Owner agent | Inputs | Outputs | Dependencies | Pipelines | Tests | Docs |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Example module | Replace with real responsibility | builder | External request, stored state | Response, event, persisted state | API, database, queue | backend, testing, documentation | Unit, integration | Module deep dive |

## Function-Level Coverage

Every function or exported module must be traceable. Use this record in module docs or a dedicated ledger:

| Function/module | Purpose | Dependencies | Pipeline reference | Tests | Documentation status |
| --- | --- | --- | --- | --- | --- |
| `name` | What it does | What it calls or requires | `backend.pipeline.md` | Test file or gap task | Current / stale / missing |

## Dependency Rules

- Dependencies must be explicit, directional, and justified.
- Cross-module calls require an API or contract entry in `architecture/api.md`.
- Hidden dependencies discovered in code must create a task.
- Cycles require an architecture decision and a plan to remove or isolate them.

## Module Change Protocol

1. Update module responsibility and dependencies.
2. Update API and data-flow docs if contracts or state movement changed.
3. Update or create task references.
4. Update tests and AI behavior simulations where behavior changed.
5. Mark documentation status current.
