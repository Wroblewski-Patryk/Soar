# LUC-197 Docs And Memory Loop Checkpoint

Date: 2026-05-26
Lane: Docs Memory Lead
Scope: Soar docs known-state refresh, template parity re-check, stale marker review, and maintenance continuity.

## Evidence Snapshot

| Check | Result | Status |
| --- | --- | --- |
| Soar docs root inventory (`Get-ChildItem docs`) | `29` top-level entries (folders + root docs files) | implemented and verified |
| Template docs root inventory (`Get-ChildItem !template/docs`) | `18` top-level entries | implemented and verified |
| Top-level folder parity (`Compare-Object`) | Soar-only folders: `.obsidian`, `adr`, `analysis`, `contracts`, `flows`, `graphs`, `testing`; template-only: none | implemented and verified |
| Architecture-awareness artifacts freshness | `docs/graphs/architecture-awareness.json` and `docs/status/architecture-awareness-report.md` last updated `2026-05-26` | implemented and verified |
| Placeholder scan (`rg -n`) | Open `TBD` values remain in `docs/ux/ui-scorecard.md` | implemented and verified |

## Known-State Findings

1. Template parity at the top-level structure remains healthy: there are no template folders missing in Soar.
2. Soar-specific folders are expected pilot memory lanes and should not be promoted to template without explicit reuse proof.
3. Architecture-awareness exports are fresh today, so no scanner rerun was required in this checkpoint.
4. The main unresolved stale marker remains UX scorecard `TBD` values.

## Open Drift Items (Owner + Next Action)

| Item | Evidence | Owner | Next Action | Status |
| --- | --- | --- | --- | --- |
| `docs/ux/ui-scorecard.md` unresolved scoring entries | `TBD` markers at lines `95`, `98`, `101` | UX + Docs Memory | Replace with measured values or explicit defer metadata (`owner`, `date`, `reason`). | present in code, behavior unknown |

## Maintenance Contract (Carry Forward)

1. Keep docs-memory checkpoints artifacted in `docs/analysis/` with issue id and date.
2. Re-run top-level parity and stale marker scan whenever `docs/` structure or quality docs change.
3. Keep unresolved stale markers mirrored in `docs/analysis/documentation-drift.md` with owner and action.
4. Re-run architecture-awareness scanner only when exports are stale or when architecture-bearing files change.

## Verification Commands

```powershell
Get-ChildItem -Name C:/Personal/Projekty/Aplikacje/Soar/docs
Get-ChildItem -Name C:/Personal/Projekty/Aplikacje/!template/docs
Compare-Object (Get-ChildItem -Directory C:/Personal/Projekty/Aplikacje/!template/docs | Select-Object -ExpandProperty Name) (Get-ChildItem -Directory C:/Personal/Projekty/Aplikacje/Soar/docs | Select-Object -ExpandProperty Name)
Get-Item C:/Personal/Projekty/Aplikacje/Soar/docs/graphs/architecture-awareness.json
Get-Item C:/Personal/Projekty/Aplikacje/Soar/docs/status/architecture-awareness-report.md
rg -n "TODO|TBD|placeholder|WIP|FIXME|coming soon|to be filled" C:/Personal/Projekty/Aplikacje/Soar/docs -S --glob "*.md"
```
