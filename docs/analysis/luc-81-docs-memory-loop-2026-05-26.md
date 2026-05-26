# LUC-81 Docs And Memory Loop Audit

Date: 2026-05-26
Lane: Docs Memory Lead
Scope: Soar documentation known-state refresh, template parity check, stale/placeholder scan, and maintenance contract refresh.

## Evidence Snapshot

| Check | Result | Status |
| --- | --- | --- |
| `rg --files docs` (Soar) | `1017` docs files | implemented and verified |
| `rg --files !template/docs` (template) | `118` docs files | implemented and verified |
| Template parity (`Compare-Object`) | `onlyInTemplate = 0`, `onlyInSoar = 899` | implemented and verified |
| Required docs-memory sources | All required files from shared contract list read this run | implemented and verified |
| Placeholder/staleness scan (`rg -n -i ...`) | Open `TBD` markers in `docs/ux/ui-scorecard.md` | implemented and verified |

## Known-State Map (Current Soar Docs)

Top-level docs folder counts (sampled via `rg --files docs` grouping):

- `architecture`: 764
- `operations`: 67
- `modules`: 45
- `governance`: 21
- `ux`: 21
- `planning`: 19
- `product`: 16
- `analysis`: 7
- `status`: 7
- `maps`: 6
- `_root`: 5
- remaining folders: 39 combined

Interpretation: Soar documentation volume remains architecture-heavy and substantially above template baseline, which is expected for pilot hardening but requires continued curation to avoid drift.

## Missing/Stale Items With Owner

| Item | Finding | Owner | Next Action | Status |
| --- | --- | --- | --- | --- |
| `docs/ux/ui-scorecard.md` | `TBD` rows at lines `95`, `98`, `101` | UX + Docs Memory | Replace `TBD` with evidence-backed values or explicit scoped defer with owner/date. | present in code, behavior unknown |
| Soar-only docs set (`899` files) | Reusable-vs-project-specific boundary not fully re-reviewed after latest growth | Docs Memory | Keep propagation candidates explicit in status/index docs; do not promote Soar-only docs into template without evidence-backed reuse case. | implemented but not verified |

## Template Feedback Candidates (Current Pass)

High-confidence reusable process artifacts:

1. `docs/analysis/documentation-inventory.md`
2. `docs/analysis/documentation-drift.md`
3. `docs/analysis/reusable-audit-registry.md`
4. `docs/analysis` dated-audit pattern (`luc-*` docs-memory audits)

Medium-confidence candidates:

1. `docs/status/template-propagation-index-2026-05-25.md`
2. `docs/status/advanced-template-propagation-index-2026-05-25.md`

Low-confidence / Soar-specific:

1. Most of `docs/architecture/nodes/*` and runtime-specific operations/playbooks.

## Minimal Maintenance Contract (For Next Agents)

1. On each docs-memory checkpoint, run:
   - docs count and template diff
   - stale/placeholder scan
   - targeted drift doc update
2. Keep `docs/analysis/analysis-documentation.md` updated with the latest dated docs-memory audit.
3. Keep open stale docs in `docs/analysis/documentation-drift.md` with named owner and explicit next action.
4. Treat Soar-only docs as project memory unless a reusable template proposition is evidence-backed.
5. Do not close docs-memory checkpoints without at least one durable artifact update (analysis/drift/status/index).

## Verification Commands (This Run)

```powershell
rg --files docs
rg --files C:/Personal/Projekty/Aplikacje/!template/docs
rg -n -i "\b(TODO|TBD|FIXME|WIP|placeholder|lorem ipsum)\b" docs
```

## Continuation Evidence (Auth-Repair Resume)

Follow-up docs-memory checkpoint after local auth recovery and lane resume:

| Check | Result | Status |
| --- | --- | --- |
| `node scripts/auditApiEndpointDocsParity.mjs --date 2026-05-26` | `PASS` (`109` endpoints, `109` documented, `0` gaps) | implemented and verified |
| Generated parity artifacts | `docs/operations/api-endpoint-docs-parity-2026-05-26/api-endpoint-docs-parity-2026-05-26.md` and `.json` | implemented and verified |
| `node scripts/triageJourneyEvidence.mjs --query api` | Returned `39` actions, `31` web journeys, `24` chains, `96` APIs; high-severity fresh-proof gaps remain explicitly tracked for protected/live paths | implemented and verified |

This continuation run required no code-path changes; it refreshes documentation/process evidence and keeps the docs-memory trail current.
