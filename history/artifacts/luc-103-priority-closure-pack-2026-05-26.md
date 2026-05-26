# LUC-103 Priority Closure Pack (2026-05-26)

Generated from:
- `history/artifacts/luc-103-remaining-closure-queue-2026-05-26.json`
- `history/artifacts/luc-103-p5-owner-manifest-2026-05-26.json`

| Lane | Owner | Tracked | Untracked | Total | Minimal Verification |
| --- | --- | ---: | ---: | ---: | --- |
| NO_LUC | Unknown | 5 | 28 | 33 | provenance/path-owner review + json parse spot-check for *.json + markdown sanity |
| LUC-86 | Ops | 0 | 12 | 12 | owner-scope diff review + smallest lane-relevant check (docs/evidence syntax/provenance) |
| LUC-47 | Unknown | 0 | 5 | 5 | owner-scope diff review + smallest lane-relevant check (docs/evidence syntax/provenance) |
| LUC-107 | Ops | 0 | 4 | 4 | owner-scope diff review + smallest lane-relevant check (docs/evidence syntax/provenance) |
| LUC-19 | Unknown | 0 | 4 | 4 | owner-scope diff review + smallest lane-relevant check (docs/evidence syntax/provenance) |
| LUC-103 | Delivery | 1 | 2 | 3 | owner-scope diff review + smallest lane-relevant check (docs/evidence syntax/provenance) |
| LUC-45 | Delivery | 3 | 0 | 3 | owner-scope diff review + smallest lane-relevant check (docs/evidence syntax/provenance) |
| LUC-98 | Ops | 0 | 3 | 3 | owner-scope diff review + smallest lane-relevant check (docs/evidence syntax/provenance) |
| LUC-48 | Frontend | 2 | 0 | 2 | owner-scope diff review + smallest lane-relevant check (docs/evidence syntax/provenance) |
| LUC-49 | QA | 2 | 0 | 2 | owner-scope diff review + smallest lane-relevant check (docs/evidence syntax/provenance) |
| LUC-64 | Backend | 2 | 0 | 2 | owner-scope diff review + smallest lane-relevant check (docs/evidence syntax/provenance) |
| LUC-88 | Delivery | 0 | 2 | 2 | owner-scope diff review + smallest lane-relevant check (docs/evidence syntax/provenance) |

Execution rule:
- One lane per commit/no-commit decision; no mixed-lane staging.
- If lane cannot be safely committed now, record explicit no-commit provenance reason.
