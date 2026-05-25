# LUC-20 Docs/index/template feedback audit

Context: `Soar` pilot docs memory lane mission
Goal: create a known-state documentation audit for `docs` inventory, template parity, stale/placeholder risk, and reusable template candidates.
Constraints: read-only code behavior, docs-only changes, no broad framework changes, no repo-wide tests/build.
Definition of Done:
- documented inventory and template parity state with evidence
- missing/stale items listed with owner + next action
- template feedback candidates identified and ordered by adoption confidence
- minimal source-of-truth map updates applied
Forbidden: inventing claims without evidence; mutating unrelated product/runtime files.

## Evidence Snapshot (this run)

| Source | Result |
| --- | --- |
| `rg --files docs` vs `rg --files !template/docs` | Soar docs: `1011`; template docs: `118`; shared (`intersect`) = `118`; `onlyInSoar = 893`; `onlyInTemplate = 0` |
| Link integrity scan (`rg` for Markdown links across docs) | `TOTAL_LINKS_MISSING = 0` |
| Placeholder/date scan in map files | `docs/documentation-map.md` contained `Updated: YYYY-MM-DD` |

## Findings

1. `docs` structure is known and mostly coherent.
   - Full set of template docs is already present in Soar.
   - No template docs are currently missing from Soar (`onlyInTemplate = 0`).
2. Soar has substantial added documentation volume (`893` docs), mostly project-specific lifecycle and quality artifacts.
   - This is expected for a seeded pilot but needs explicit template review where reusable.
3. No unresolved link-level drift detected in current docs pass.
   - `TOTAL_LINKS_MISSING = 0` for scanned markdown link targets.
4. Staleness gap discovered:
   - `docs/documentation-map.md` had unresolved placeholder date (`Updated: YYYY-MM-DD`).

## Missing / Stale Docs and Owners

| Item | Status | Owner | Next Action |
| --- | --- | --- | --- |
| `docs/documentation-map.md` | stale placeholder date | Docs Memory Lead | replace with real date and keep updated on map edits |
| Product template debt artifacts (`docs/product/*` entries identified as evidence placeholders in `docs/product/known-state.md`) | `implemented and verified` for detection only, not closed by design intent | Product docs owner (current lane: Docs + Product) | convert to evidence-backed docs before treating as canonical product truth |

## Template Feedback Candidates (Soar-only additions)

Priority by adoption confidence:

1. High confidence
- `docs/analysis/documentation-drift.md`
- `docs/analysis/documentation-inventory.md`
- `docs/analysis/reusable-audit-registry.md`
- `docs/CONTRIBUTING-DOCS.md`

2. Medium confidence
- `docs/analysis/analysis-documentation.md`
- `docs/status/template-propagation-index-2026-05-25.md`
- `docs/analysis` folder audit pattern (template adoption process only) to reuse with Soar-style governance

3. Low confidence / pilot-specific
- deep `docs/product/` and product-specific historical/operational additions tied to Soar's current scope

## Maintenance Contract (short)

- Keep `docs/documentation-map.md` as the active docs entry with a real update date.
- New doc additions touching process/verification must be linked from `docs/analysis/analysis-documentation.md`.
- Before any large feature scope, run a small `LUC-20`-style check:
  - docs inventory count and template diff
  - link integrity scan
  - placeholder/date scan for key map files
  - update `docs/analysis/documentation-drift.md` with findings.
- Do not treat Soar-only documentation as template truth until approved via `docs/analysis/reusable-audit-registry.md` lane.
- Keep unresolved stale items and product-template debt in `docs/analysis/documentation-drift.md`.

## Authenticated App-Journey Triage Run (liveness continuation)

Executed:
- `node scripts/triageJourneyEvidence.mjs --query "/dashboard"`
- `node scripts/triageJourneyEvidence.mjs --query "login"`

Observed:
- `/dashboard` query returned verified evidence for 30 actions and 28 web journeys, with primary action `SOAR-ACTION-UI-MANUAL-ORDER-SUBMIT` and high-severity gaps still open:
  - `local_only_without_fresh_browser_or_production_proof`
  - `protected_or_money_path_needs_fresh_browser_or_production_proof`
- `login` query returned action `SOAR-ACTION-UI-LOGIN-SUBMIT` with status `verified_local_only`.
  - Base auth chain `CHAIN-AUTH-SESSION` is `verified`
  - Deep auth/longitudinal chain remains `verified_local` with gap:
    - `missing_proof:Fresh production auth browser proof remains separate; production_or_browser_proof_not_implied`

Disposition for docs lane: the journey-triage step is now executed and recorded; no new doc-template delta discovered from this evidence pass.
