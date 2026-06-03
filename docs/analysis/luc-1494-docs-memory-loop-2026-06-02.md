# LUC-1494 Docs And Memory Loop Checkpoint

Date: 2026-06-02
Lane: Docs Memory Lead
Process: docs/memory loop
Scope: Soar documentation known-state refresh, template parity re-check, graph freshness check, root-index posture, and source-control constraint classification.

## Evidence Snapshot

| Check | Result | Status |
| --- | --- | --- |
| Paperclip control tick | `controlDecision=operating_source_control_closure_needed`; recommended action is to classify or close Paperclip OS dirty scope before broad delivery. | implemented and verified |
| Paperclip OS dirty scope | One modified operating file: `scripts/start-luckysparrow-softwarehouse.ps1`. Diff changes process startup/output capture behavior. | present in code, behavior unknown |
| Soar worktree baseline | Existing dirty Soar docs/state/evidence from Ops and state lanes observed before this docs checkpoint; no unrelated files were reverted. | implemented and verified |
| `rg --files docs` inventory | `Soar docs = 1075`, `template docs = 126`. | implemented and verified |
| Template parity (`Compare-Object`) | `onlyInTemplate = 3`, `onlyInSoar = 952`. Missing from Soar by matching relative path: `docs/maps/template-function-journey.canvas`, `docs/maps/template-obsidian-dashboard.canvas`, `docs/obsidian/project-vault-dashboard.md`. | implemented and verified |
| Architecture-awareness artifact freshness | Required exports exist: `docs/graphs/architecture-awareness.json`, `architecture-awareness.csv`, `architecture-graph.md`, `architecture-graph.mmd`, and `docs/status/architecture-awareness-report.md`; latest report generated `2026-06-01T06:58:07.926Z`. | implemented and verified |
| Architecture graph drift | `docs/status/architecture-graph-drift.md` reports `816` inventoried files, `812` covered, `4` missing graph path references, all in API tests. | implemented and verified |
| Placeholder/staleness scan | Open stale markers remain in prior analysis docs and in active/current docs for UX scorecard, mobile scaffold wording, product known-state placeholders, and legitimate placeholder-exchange/icon contracts. | implemented and verified |

## Known-State Findings

1. Soar documentation remains structurally rich and current-entrypoint driven, with `docs/documentation-map.md` and `docs/documentation-overview.md` present.
2. Template parity is no longer a clean superset: the current template has three Obsidian/canvas artifacts that Soar lacks under the same relative paths.
3. Soar has a project-specific Obsidian dashboard at `docs/obsidian/soar-vault-dashboard.md`; the template equivalent is `docs/obsidian/project-vault-dashboard.md`. This is probably a naming/substitution delta, not necessarily missing capability.
4. Architecture-awareness exports are present and fresh enough for this checkpoint; no scanner rerun was required.
5. Graph drift remains bounded to four API test files missing graph references:
   - `apps/api/src/middleware/requireRole.test.ts`
   - `apps/api/src/modules/bots/bots.runtime-close-authority.route-pack.e2e.test.ts`
   - `apps/api/src/modules/bots/bots.runtime-close-dca-authority.e2e.test.ts`
   - `apps/api/src/modules/positions/positions.orphan-repair.contract.e2e.test.ts`
6. The active project remains production-gated by protected/operator evidence, while this docs lane stayed non-production and read-only except for this evidence file.

## Open Drift Items

| Item | Evidence | Owner | Next Action | Status |
| --- | --- | --- | --- | --- |
| Template Obsidian/canvas artifacts not mirrored in Soar by relative path | `Compare-Object` reports three `onlyInTemplate` docs. | Docs Memory Lead | Decide whether to add project-local equivalents or intentionally map `project-vault-dashboard.md` to `soar-vault-dashboard.md` in template adoption notes. | present in code, behavior unknown |
| Architecture graph missing references for four API tests | `docs/status/architecture-graph-drift.md` reports four missing API test paths. | CTO Architect + Docs Memory Lead | Add graph references or scanner coverage for the four tests, then rerun `pnpm run architecture:graph:drift`. | present in code, behavior unknown |
| UX scorecard unresolved `TBD` scoring rows | `docs/analysis/documentation-drift.md` still records `docs/ux/ui-scorecard.md` lines 95, 98, 101. | UX + Docs Memory Lead | Replace with measured values or explicit defer metadata (`owner`, `date`, `reason`). | present in code, behavior unknown |
| Product known-state placeholder product-doc instruction remains open | `docs/product/known-state.md` still says to fill placeholder product docs or remove active dependencies. | Product + Docs Memory Lead | Confirm whether the instruction is historical carry-forward or an active docs gap, then update the owning product docs. | present in code, behavior unknown |
| Paperclip OS source-control closure needed | `pnpm softwarehouse:control-tick` reported `operating_source_control_closure_needed`; Paperclip worktree has one modified startup script. | Engineering Delivery Lead / Paperclip OS owner | Classify, verify, and commit or revert the startup-script change before broad Softwarehouse delivery is treated as stable. | blocked by source-control closure |

## Maintenance Contract

1. Keep docs-memory checkpoints artifacted in `docs/analysis/` with issue id and date.
2. Re-run docs count parity and stale marker scan whenever `docs/` shape, template Obsidian artifacts, or UX quality docs change.
3. Keep template-only artifacts mirrored as either project-local files or explicit substitution mappings; do not leave relative-path drift unexplained.
4. Re-run architecture-awareness scanner only when architecture-bearing files changed or graph exports are stale; rerun graph drift after scanner/registry edits.
5. Treat history as evidence, not active owner; promote current truth into `docs/`, `.agents/state/`, or `.codex/context/` before relying on it.

## Verification Commands

```powershell
pnpm softwarehouse:control-tick
git status --short
git diff -- scripts/start-luckysparrow-softwarehouse.ps1
rg --files C:/Personal/Projekty/Aplikacje/Soar/docs
rg --files C:/Personal/Projekty/Aplikacje/!template/docs
Compare-Object <template-relative-doc-paths> <soar-relative-doc-paths>
Get-Item C:/Personal/Projekty/Aplikacje/Soar/docs/graphs/architecture-awareness.json,
         C:/Personal/Projekty/Aplikacje/Soar/docs/graphs/architecture-awareness.csv,
         C:/Personal/Projekty/Aplikacje/Soar/docs/graphs/architecture-graph.md,
         C:/Personal/Projekty/Aplikacje/Soar/docs/graphs/architecture-graph.mmd,
         C:/Personal/Projekty/Aplikacje/Soar/docs/status/architecture-awareness-report.md
rg -n -i "\b(TODO|TBD|FIXME|WIP|placeholder|coming soon|to be filled)\b" C:/Personal/Projekty/Aplikacje/Soar/docs --glob "*.md"
```
