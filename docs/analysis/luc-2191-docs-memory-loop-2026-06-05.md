# LUC-2191 Docs And Memory Loop Checkpoint

Date: 2026-06-05
Lane: Docs Memory Lead
Process: docs/memory loop
Scope: Soar documentation known-state refresh, template parity check, architecture-awareness freshness check, graph drift verification, portfolio index refresh, and source-control closure classification.

## Evidence Snapshot

| Check | Result | Status |
| --- | --- | --- |
| Paperclip control tick | `controlDecision=project_source_control_closure_needed`; recommended action is to route Soar source-control closure through `LUC-402`. Protected production gate `LUC-1768` still blocks deploy/restart/protected smoke, but local diff classification, validation, and commit/no-commit decisions remain allowed. | implemented and verified |
| Soar worktree baseline | Existing dirty groups were observed before this checkpoint: docs/graphs/status/module docs, history evidence/tasks/artifacts, agent state, product tests, scripts, and package metadata. This lane added only this checkpoint file and did not revert or stage unrelated work. | implemented and verified |
| Docs inventory parity | `rg --files` comparison found `Soar docs = 1085`, `template docs = 126`, `onlyInTemplate = 3`, and `onlyInSoar = 962`. | implemented and verified |
| Template-only artifacts | Same three template-only relative paths remain: `docs/maps/template-function-journey.canvas`, `docs/maps/template-obsidian-dashboard.canvas`, and `docs/obsidian/project-vault-dashboard.md`. | present in code, behavior unknown |
| Architecture-awareness exports | Required exports exist and were refreshed today: `docs/graphs/architecture-awareness.json`, `architecture-awareness.csv`, `architecture-graph.md`, `architecture-graph.mmd`, plus `docs/status/architecture-awareness-report.md`. The latest report was generated `2026-06-05T12:00:45.591Z`. | implemented and verified |
| Architecture-awareness counts | Fresh report shows `14505` entities across `3545` documents, `999` tasks, `376` tests, `346` routes, `97` components, `37` API endpoints, and `0` disconnected entities. | implemented and verified |
| Architecture graph drift | `pnpm run architecture:graph:drift` generated `823/823` covered and `0` missing graph path references. | implemented and verified |
| Stale marker scan | `rg -n -i "\b(TODO|TBD|FIXME|WIP|placeholder|coming soon|to be filled)\b" docs --glob "*.md"` returned `102` hits. The high-signal active items remain product known-state placeholder instructions and the UX scorecard `TBD` rows recorded in `docs/analysis/documentation-drift.md`; many other hits are historical ledger text or intentional placeholder-exchange/icon contracts. | present in code, behavior unknown |
| Portfolio root index | `C:/Personal/Projekty/Aplikacje/scripts/update-applications-index.ps1` completed and refreshed `APPLICATIONS_INDEX.md` and `APPLICATIONS_INDEX.csv`. | implemented and verified |

## Known-State Findings

1. Soar's documentation structure remains mapped through `docs/documentation-map.md`, `docs/documentation-overview.md`, and the Soar-specific `docs/soar-documentation-map.md`.
2. The architecture-awareness layer is current for this checkpoint and graph path coverage is clean.
3. Template parity drift is stable and bounded to three Obsidian/canvas relative-path substitutions. Soar has `docs/obsidian/soar-vault-dashboard.md`; the template has `docs/obsidian/project-vault-dashboard.md`.
4. The root portfolio index was stale since `2026-06-03 18:12 +02:00`; it has now been refreshed after this docs/status checkpoint.
5. The active unresolved docs-memory risk is no longer graph coverage. It is source-control closure for the broad dirty Soar worktree and active/current stale-marker interpretation for product known-state and UX scoring.

## Open Drift Items

| Item | Evidence | Owner | Next Action | Status |
| --- | --- | --- | --- | --- |
| Soar source-control closure | Control tick reports `project_source_control_closure_needed`; `git status --short` shows broad existing dirty docs, graph, history, tests, scripts, and package metadata. | Soar source-control closure lane (`LUC-402`) | Classify dirty groups, decide commit/no-commit, and keep push/deploy blocked until closure rules are satisfied. | blocked by source-control closure |
| Template Obsidian/canvas relative-path mismatch | Parity check still reports three `onlyInTemplate` artifacts. | Docs Memory Lead | Record an explicit substitution mapping or add project-local equivalents if the template-relative paths must be mirrored. | present in code, behavior unknown |
| Product known-state placeholder instruction | Stale marker scan still reports `docs/product/known-state.md` line 88 instructing placeholder product docs to be filled or removed from active dependencies. | Product + Docs Memory Lead | Confirm whether this is still an active gap; update product docs or mark the dependency historical/deferred. | present in code, behavior unknown |
| UX scorecard unresolved scoring rows | `docs/analysis/documentation-drift.md` still records `docs/ux/ui-scorecard.md` unresolved `TBD` scoring rows. | UX + Docs Memory Lead | Replace with measured values or explicit defer metadata (`owner`, `date`, `reason`). | present in code, behavior unknown |

## Maintenance Contract

1. Treat `docs/graphs/architecture-awareness.*`, `docs/graphs/architecture-graph.*`, and `docs/status/architecture-awareness-report.md` as the canonical architecture-awareness export set.
2. Re-run `node scripts/build-architecture-awareness-index.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar` when architecture-bearing code/docs or graph registries change materially.
3. Re-run `pnpm run architecture:graph:drift` after scanner, registry, graph, route, module, or test coverage changes; strict graph coverage should stay at `0` missing before readiness claims.
4. Keep docs/template parity findings explicit. Mirror reusable template artifacts or document project-specific substitutions instead of leaving silent relative-path drift.
5. Keep history/evidence separate from structural docs. Promote current truth into `docs/`, `.agents/state/`, or `.codex/context/` before relying on historical task artifacts.
6. After meaningful project audits or docs/status changes, refresh the root portfolio index with `C:/Personal/Projekty/Aplikacje/scripts/update-applications-index.ps1`.
7. Keep source-control closure out of docs-memory checkpoints unless the issue explicitly owns closure. Docs Memory may classify and preserve evidence; `LUC-402` owns dirty-group commit/no-commit decisions for the current Soar worktree.

## Verification Commands

```powershell
pnpm softwarehouse:control-tick
git status --short
rg --files C:/Personal/Projekty/Aplikacje/Soar/docs
rg --files C:/Personal/Projekty/Aplikacje/!template/docs
Compare-Object <template-relative-doc-paths> <soar-relative-doc-paths>
Get-Item C:/Personal/Projekty/Aplikacje/Soar/docs/graphs/architecture-awareness.json,
         C:/Personal/Projekty/Aplikacje/Soar/docs/graphs/architecture-awareness.csv,
         C:/Personal/Projekty/Aplikacje/Soar/docs/graphs/architecture-graph.md,
         C:/Personal/Projekty/Aplikacje/Soar/docs/graphs/architecture-graph.mmd,
         C:/Personal/Projekty/Aplikacje/Soar/docs/status/architecture-awareness-report.md
pnpm run architecture:graph:drift
rg -n -i "\b(TODO|TBD|FIXME|WIP|placeholder|coming soon|to be filled)\b" C:/Personal/Projekty/Aplikacje/Soar/docs --glob "*.md"
powershell -ExecutionPolicy Bypass -File C:/Personal/Projekty/Aplikacje/scripts/update-applications-index.ps1
```
