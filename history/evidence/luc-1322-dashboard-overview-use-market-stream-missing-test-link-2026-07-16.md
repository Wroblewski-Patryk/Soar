# LUC-1322 Evidence

## Scope
- Issue: `LUC-1322`
- Lane: `QA/Test`
- Objective:
  close the generated Dashboard overview `missing_test_link` row for
  `apps/api/src/router/dashboard.routes.ts#/market-stream` using the smallest
  durable proof-link repair.

## Findings
- The repository already had focused executable route proof in
  `apps/api/src/modules/market-stream/marketStream.routes.e2e.test.ts`.
- The generator could not promote that proof to the router mount because
  `apps/api/src/router/dashboard.routes.ts#/market-stream` had no direct
  `priority-test-links.csv` relation and no matching verified override entry.

## Changes
- Added a direct proof relation in
  `docs/architecture/relations/priority-test-links.csv` from
  `apps/api/src/router/dashboard.routes.ts#/market-stream` to
  `apps/api/src/modules/market-stream/marketStream.routes.e2e.test.ts`.
- Added a matching verified entity override in
  `docs/architecture/scanner-overrides.json` with scope-accurate evidence and
  route-mount description for the market-stream surface.
- Regenerated architecture-awareness, app-completion, and project-truth
  exports.

## Verification
- `pnpm --filter api exec vitest run src/modules/market-stream/marketStream.routes.e2e.test.ts --run`
  -> PASS (`1` file, `2` tests)
- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-architecture-awareness-index.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar`
  -> PASS
- `pnpm run architecture:graph:drift:strict`
  -> PASS
- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-app-completion-index.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar`
  -> PASS
- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-project-truth-indexes.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar --apply`
  -> PASS

## Readback
- `docs/status/app-completion-index.json` now records
  `apps/api/src/router/dashboard.routes.ts#/market-stream` with:
  - `status: verified`
  - `owner: Test Automation Engineer`
  - `evidence.hasTest: true`
  - `risk: missing_doc_link`
  - `userFlow: Account access`
- `docs/status/app-completion-index.md` no longer lists
  `Dashboard overview | missing_test_link | api_endpoint | USE /market-stream`.
- The next Dashboard overview proof-owned gap advances to `USE /markets` as
  `missing_test_link`.

## Residual Risk
- The same endpoint now routes as
  `Account access / missing_doc_link`, so the proof lane is
  complete but docs linkage remains a separate follow-up lane.
- No runtime behavior, deploy state, or protected-browser evidence was changed
  or claimed in this heartbeat.
