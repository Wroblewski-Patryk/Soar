# LUC-333 Docs And Memory Loop Checkpoint

Date: 2026-05-27
Lane: Docs Memory Lead
Scope: Soar docs known-state refresh, template parity re-check, stale marker review, and maintenance continuity.

## Evidence Snapshot

| Check | Result | Status |
| --- | --- | --- |
| `rg --files` docs inventory | `Soar docs = 1029`, `template docs = 118` | implemented and verified |
| Template parity (`Compare-Object`) | `onlyInTemplate = 0`, `onlyInSoar = 911` | implemented and verified |
| Architecture-awareness artifact freshness (`Get-Item`) | `docs/graphs/*awareness*`, `architecture-graph.md`, and `docs/status/architecture-awareness-report.md` updated `2026-05-27` | implemented and verified |
| Placeholder/staleness scan (`rg -n -i`) | Open `TBD` markers remain in `docs/ux/ui-scorecard.md` lines `95`, `98`, `101` | implemented and verified |

## Known-State Findings

1. Template parity remains structurally healthy: no template docs are missing from Soar.
2. The Soar-only delta (`911` files) remains expected for pilot depth; keep those docs project-scoped unless reuse evidence is explicit.
3. Architecture-awareness exports are fresh for today, so no scanner rerun was required in this checkpoint.
4. The only actionable stale marker from this lane remains unresolved UX scorecard `TBD` entries.

## Open Drift Items (Owner + Next Action)

| Item | Evidence | Owner | Next Action | Status |
| --- | --- | --- | --- | --- |
| `docs/ux/ui-scorecard.md` unresolved scoring rows | `TBD` markers at lines `95`, `98`, `101` | UX + Docs Memory | Replace `TBD` with measured values or explicit defer metadata (`owner`, `date`, `reason`). | present in code, behavior unknown |

## Maintenance Contract (Carry Forward)

1. Keep docs-memory checkpoints artifacted in `docs/analysis/` with issue id and date.
2. Re-run docs count parity and stale marker scan whenever `docs/` shape or UX quality docs change.
3. Keep unresolved stale markers mirrored in `docs/analysis/documentation-drift.md` with owner and action.
4. Re-run architecture-awareness scanner only when exports are stale or architecture-bearing files changed without fresh graph generation.

## Verification Commands

```powershell
rg --files C:/Personal/Projekty/Aplikacje/Soar/docs
rg --files C:/Personal/Projekty/Aplikacje/!template/docs
Compare-Object (
  rg --files C:/Personal/Projekty/Aplikacje/!template/docs | % { $_ -replace '^C:/Personal/Projekty/Aplikacje/!template/docs[\\/]', '' } | sort
) (
  rg --files C:/Personal/Projekty/Aplikacje/Soar/docs | % { $_ -replace '^C:/Personal/Projekty/Aplikacje/Soar/docs[\\/]', '' } | sort
)
Get-Item C:/Personal/Projekty/Aplikacje/Soar/docs/graphs/architecture-awareness.json,
         C:/Personal/Projekty/Aplikacje/Soar/docs/graphs/architecture-awareness.csv,
         C:/Personal/Projekty/Aplikacje/Soar/docs/graphs/architecture-graph.md,
         C:/Personal/Projekty/Aplikacje/Soar/docs/graphs/architecture-graph.mmd,
         C:/Personal/Projekty/Aplikacje/Soar/docs/status/architecture-awareness-report.md
rg -n -i "\b(TODO|TBD|FIXME|WIP|placeholder|coming soon|to be filled)\b" C:/Personal/Projekty/Aplikacje/Soar/docs --glob "*.md"
```
