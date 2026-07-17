# LUC-1362 Evidence

- Issue: [LUC-1362](/LUC/issues/LUC-1362)
- Date: 2026-07-17
- Agent lane: Engineering Delivery Lead
- Scope: reconcile the stale `USE /positions` project-truth gap left after the
  `LUC-1353` proof-link closure and determine whether a generator repair lane
  was still required.
- Boundary: no runtime code change, no deploy, no push, no restart, no secret
  access, no protected-account mutation, no cross-repo toolchain edit.

## Implemented and verified

- Confirmed a stale split state before refresh:
  `docs/status/app-completion-index.json` already recorded
  `apps/api/src/router/dashboard.routes.ts#/positions` as
  `Account access / missing_doc_link`, while
  `docs/status/project-truth-index.json` still routed the same
  `sourceItemId` as `Dashboard overview / missing_test_link`.
- Replayed the current Paperclip `build-project-truth-indexes.mjs` generator in
  dry-run mode and verified it now derives the correct positions gap directly
  from the current app-completion record.
- Applied the authoritative generated-state refresh with the current builders.
- Verified the refreshed `docs/status/project-truth-index.{json,md}` no longer
  contain the stale `Dashboard overview: USE /positions has app-completion risk
  missing_test_link.` summary.

## Validation

- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-app-completion-index.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar`
- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-project-truth-indexes.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar`
- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-project-truth-indexes.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar --apply`
- Targeted JSON/Markdown readback in:
  `docs/status/app-completion-index.{json,md}` and
  `docs/status/project-truth-index.{json,md}`

## Readback

- `docs/status/app-completion-index.json` records
  `api_endpoint:use-positions:e3a48a2408` with:
  - `userFlow: "Account access"`
  - `risk: "missing_doc_link"`
  - `path: "apps/api/src/router/dashboard.routes.ts#/positions"`
- `docs/status/project-truth-index.json` now records the same positions row as:
  `Account access: USE /positions has app-completion risk missing_doc_link.`
- `docs/status/project-truth-index.{json,md}` no longer emit the stale
  `Dashboard overview: USE /positions has app-completion risk missing_test_link.`
- The refreshed first overall gap is now the runtime readiness probe failure:
  `api_ready https://api.soar.luckysparrow.ch/ready returned 503:
  {"status":"not_ready","service":"api"}`.

## Conclusion

- This issue did not require a generator-code repair lane.
- The smallest valid repair was an authoritative generated-state refresh plus
  readback proof.
- The stale `USE /positions` project-truth gap from `LUC-1353` is cleared in
  the current local truth outputs.

## Residual

- The positions endpoint still has a separate docs-owned follow-up:
  `Account access / missing_doc_link` for
  `apps/api/src/router/dashboard.routes.ts#/positions`.
- Current project truth also surfaces an unrelated production readiness gap:
  `api_ready` on `https://api.soar.luckysparrow.ch/ready` returned `503` on
  2026-07-17.
- This heartbeat leaves a local generated docs/status dirty packet that still
  needs a separate source-control closure lane before commit.
