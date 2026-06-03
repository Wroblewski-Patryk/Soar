# LUC-1740 Docs And Memory Loop Checkpoint

Date: 2026-06-03
Lane: Docs Memory Lead
Process: docs/memory loop
Scope: Soar documentation known-state refresh, architecture-awareness export refresh, graph drift verification, template parity check, and Softwarehouse control posture.

## Evidence Snapshot

| Check | Result | Status |
| --- | --- | --- |
| Paperclip control tick | `controlDecision=supervise_active_runs`; `controlBrief.deliveryPermission.projectRepoMutationAllowed=true`; forbidden actions remain push, deploy, production mutation, secret disclosure, and duplicate source-control cleanup. | implemented and verified |
| Soar worktree baseline | Pre-existing dirty files observed before this docs checkpoint: `.agents/state/active-mission.md`, `.codex/context/PROJECT_STATE.md`, `.codex/context/TASK_BOARD.md`, and `history/tasks/luc-1734-restore-owner-path-for-coolify-inventory-lane-2026-06-03-task.md`. They were not edited by this lane. | implemented and verified |
| Architecture-awareness scanner | `node scripts/build-architecture-awareness-index.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar` completed and refreshed required exports under `docs/graphs/` and `docs/status/`. | implemented and verified |
| Architecture-awareness counts | Fresh report generated `2026-06-03T12:02:27.201Z`: `13901` entities, `21383` relations, `6584` files. Type counts include `3331` documents, `871` tasks, `860` verified entities, and `0` disconnected entities. | implemented and verified |
| Architecture graph drift | `pnpm run architecture:graph:drift` generated `816/816` covered and `0` missing graph path references. This closes the previous four API-test graph-reference gap from the 2026-06-02 checkpoint. | implemented and verified |
| Docs/template parity | `Soar docs = 1078`, `template docs = 126`, `onlyInTemplate = 3`, `onlyInSoar = 955`. Template-only relative paths remain `docs/maps/template-function-journey.canvas`, `docs/maps/template-obsidian-dashboard.canvas`, and `docs/obsidian/project-vault-dashboard.md`. | implemented and verified |

## Known-State Findings

1. Soar's architecture-awareness exports are current as of this checkpoint and include the required JSON, CSV, proof register, graph, health, dependency, ownership, and task-synchronization outputs.
2. Graph drift is clean after refresh: all representative API route/service/test, web page/component/hook/test, module doc, architecture doc, config, and pipeline paths are covered.
3. The previous template parity finding still stands: Soar uses project-specific Obsidian/canvas names and lacks three same-relative-path template artifacts. This is a substitution/mapping decision, not proven missing functionality.
4. The active Softwarehouse posture still blocks push/deploy/protected production actions. This docs lane stayed within local docs/status refresh and Paperclip evidence.
5. Pre-existing source-control closure work remains outside this lane and should be classified by the Soar Project Manager / CTO Architect source-control lane before commit/push decisions.

## Open Drift Items

| Item | Evidence | Owner | Next Action | Status |
| --- | --- | --- | --- | --- |
| Template Obsidian/canvas relative-path mismatch | Parity check still reports three `onlyInTemplate` artifacts. | Docs Memory Lead | Decide whether to add Soar-local equivalents or record the explicit substitution from template dashboard/canvas names to Soar-specific names. | present in code, behavior unknown |
| Architecture missing inferred test/doc links | Fresh architecture-awareness report still lists top missing test/doc links for API endpoints and some components, despite graph path coverage being clean. | CTO Architect + Docs Memory Lead | Promote or correct important relations in scanner overrides, module docs, or graph registries where the inferred links are materially wrong. | present in code, behavior unknown |
| Soar source-control closure | Control tick reports Soar dirty groups: `codex-context`, `agent-state`, and `history-evidence`. | Soar Project Manager + CTO Architect source-control lane | Classify dirty state/evidence paths, decide commit/no-commit, and avoid push/deploy until closure rules are met. | blocked by source-control closure |

## Maintenance Contract

1. Re-run the architecture-awareness scanner when architecture-bearing files or docs/status evidence changes materially.
2. Re-run `pnpm run architecture:graph:drift` after scanner, registry, or graph path changes; strict mode should remain clean before guardrail claims.
3. Keep docs/template parity findings explicit: mirror reusable template artifacts or document intentional project-specific substitutions.
4. Keep source-control closure separate from docs-memory evidence. Docs Memory may refresh maps and ledgers, but commit/push decisions need the source-control lane's classification.

## Verification Commands

```powershell
pnpm softwarehouse:control-tick
node scripts/build-architecture-awareness-index.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar
pnpm run architecture:graph:drift
Compare-Object <template-relative-doc-paths> <soar-relative-doc-paths>
git status --short
```
