# LUC-790 Account Access closeBotRuntimeSessionPosition Doc-Link Evidence

## Scope

Prove whether `apps/api/src/modules/bots/bots.controller.ts#closeBotRuntimeSessionPosition`
is still a real Account access `missing_doc_link` gap or only stale/generated-state drift.

## Source-Truth Inputs Added

- Added a canonical classification row to `docs/modules/api-bots.md` for:
  - `apps/api/src/modules/bots/bots.controller.ts#closeBotRuntimeSessionPosition`
- Added the documentation-link registry row to
  `docs/architecture/relations/documentation-links.csv`.
- Added a `documents` relation override to
  `docs/architecture/scanner-overrides.json`.

## Verification Readback

- `pnpm run architecture:graph:generate`: PASS
- Direct readback after regeneration:
  - `docs/modules/api-bots.md` contains the new controller classification row.
  - `docs/architecture/relations/documentation-links.csv` contains:
    `apps/api/src/modules/bots/bots.controller.ts#closeBotRuntimeSessionPosition,docs/modules/api-bots.md`
  - `docs/architecture/scanner-overrides.json` contains the matching
    `documents` relation override.
  - `docs/graphs/architecture-awareness.json` still shows the function entity
    `function:closebotruntimesessionposition:0d9dc5a10d`, but no materialized
    `documents` relation from `docs/modules/api-bots.md` to the function.
  - `docs/status/app-completion-index.json` still reports the scoped row with
    `evidence.hasDoc=false` and `risk=missing_doc_link`.
  - `docs/status/project-truth-index.json` still includes:
    `Account access: closeBotRuntimeSessionPosition has app-completion risk missing_doc_link.`

## Diagnosis

The repo now contains the expected local doc-link inputs for the scoped
controller, but the current generated `architecture-awareness ->
app-completion -> project-truth` chain still fails to ingest them into a live
`documents` relation. This is proved generated-state/tooling drift, not a
remaining absence of local bot-module docs input.
