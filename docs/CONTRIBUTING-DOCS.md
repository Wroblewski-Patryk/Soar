# Contributing Docs

Updated: 2026-05-03

Purpose: keep documentation usable as an engineering system map, not loose
notes.

## Core Rule
Do not add or change important system behavior without updating the matching
documentation link in the same task.

## Required Updates By Change Type
| Change Type | Required Documentation |
|---|---|
| New feature or changed feature behavior | `docs/architecture/traceability-matrix.md`, relevant pipeline doc, relevant module docs. |
| New frontend route | `docs/architecture/reference/dashboard-route-map.md`, `docs/architecture/codebase-map.md`, traceability matrix, relevant web module doc. |
| New API route | Relevant API module doc, traceability matrix, pipeline doc, and API route map if dashboard/admin-facing. |
| New system flow | `docs/pipelines/index.md` plus one pipeline document. |
| New API module or web feature module | `docs/modules/index.md`, `docs/modules/module-doc-status-index.md`, a module deep dive from `module-deep-dive-template.md`. |
| Database model or migration change | `docs/architecture/03_domain-model.md`, `docs/architecture/codebase-map.md`, traceability matrix, relevant module docs. |
| Runtime/worker/deployment behavior change | Relevant architecture reference, pipeline doc, operations runbook/smoke doc, project state. |
| Test added or changed | The test should reference the feature, module, or pipeline it protects, either by name or in the related docs. |
| AI/assistant behavior change | `docs/architecture/reference/assistant-runtime-contract.md`, relevant bot/engine module docs, AI testing evidence when risk warrants it. |
| Security, API key, permissions, money, or LIVE trading behavior | Relevant security/architecture docs, threat or abuse-case evidence, fail-closed validation. |

## Documentation Placement
- Canonical behavior belongs in `docs/architecture/`.
- Implementation ownership belongs in `docs/modules/`.
- End-to-end flow belongs in `docs/pipelines/`.
- Temporary sequencing belongs in `docs/planning/`.
- Deployment/runbook/evidence belongs in `docs/operations/`.
- Product intent belongs in `docs/product/`.
- UX behavior and visual system rules belong in `docs/ux/`.

## Drift Rules
- If code and docs disagree, stop and identify the source of truth.
- If the intended behavior changed, update architecture first.
- If a doc describes code that no longer exists, mark it as historical or
  update it.
- If code exists without docs, add it to the traceability matrix or drift
  report before closing the task.
- If something cannot be verified from code, write
  `UNVERIFIED / NEEDS CONFIRMATION`.

## Review Checklist
Before closing a docs-sensitive task:
- `docs/index.md` still points to the correct entrypoints.
- `docs/architecture/codebase-map.md` matches touched structure.
- `docs/architecture/traceability-matrix.md` includes touched feature paths.
- `docs/pipelines/index.md` and relevant pipeline docs include touched flows.
- `docs/modules/index.md` and deep dives include touched modules.
- `docs/analysis/documentation-drift.md` records any remaining gaps.
- `.codex/context/TASK_BOARD.md` and `.codex/context/PROJECT_STATE.md` are
  synced when task status or repository truth changed.

## Validation
For docs-only changes, run at least:

```powershell
pnpm run quality:guardrails
pnpm run docs:parity:check
```

If routes, i18n, code, runtime, or deployment behavior changes, run the
stronger validation baseline required by the touched scope.
