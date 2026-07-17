Resolved the stale `USE /positions` project-truth emission left after [LUC-1353](/LUC/issues/LUC-1353).

Implemented and verified:
- confirmed `docs/status/app-completion-index.json` already classified `apps/api/src/router/dashboard.routes.ts#/positions` as `Account access / missing_doc_link` while checked-in `project-truth-index.json` still emitted the older `Dashboard overview / missing_test_link` row for the same `sourceItemId`
- dry-ran the current `build-project-truth-indexes.mjs` generator and verified it now derives the correct positions gap from current app-completion truth, so no toolchain code repair lane was needed
- applied the authoritative generated-state refresh and updated local source-of-truth records in `.agents/state/*`, `.codex/context/*`, `history/tasks/`, and `history/evidence/`

Validation:
- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-app-completion-index.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar`
- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-project-truth-indexes.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar`
- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-project-truth-indexes.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar --apply`
- targeted readback:
  - `docs/status/project-truth-index.{json,md}` no longer emit `Dashboard overview: USE /positions has app-completion risk missing_test_link.`
  - `docs/status/project-truth-index.{json,md}` now route the same row as `Account access: USE /positions has app-completion risk missing_doc_link.`

Residual:
- the positions endpoint still has a separate docs-owned follow-up lane for `missing_doc_link`
- refreshed project truth now surfaces the unrelated first overall gap `api_ready https://api.soar.luckysparrow.ch/ready returned 503`
- local generated docs/status packet remains dirty and still needs a separate source-control closure lane before commit
