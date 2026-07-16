# LUC-1353 heartbeat update

Mode: `Execute`

## Outcome

- Implemented the smallest durable proof-link repair for
  `apps/api/src/router/dashboard.routes.ts#/positions`.
- Added direct evidence linkage from the dashboard router mount to
  `apps/api/src/modules/positions/positions.list.e2e.test.ts`.
- Recorded the closure attempt in:
  - `history/evidence/luc-1353-dashboard-overview-use-positions-missing-test-link-2026-07-16.md`
  - `history/tasks/luc-1353-dashboard-overview-use-positions-missing-test-link-2026-07-16-task.md`

## Files changed

- `docs/architecture/relations/priority-test-links.csv`
- `docs/architecture/scanner-overrides.json`
- `docs/graphs/architecture-awareness.{json,csv}`
- `docs/graphs/architecture-proof-register.csv`
- `docs/status/app-completion-index.{json,md}`
- `docs/status/project-truth-index.{json,md}`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`
- `history/evidence/luc-1353-dashboard-overview-use-positions-missing-test-link-2026-07-16.md`
- `history/tasks/luc-1353-dashboard-overview-use-positions-missing-test-link-2026-07-16-task.md`

## Verification

- `pnpm --filter api exec vitest run src/modules/positions/positions.list.e2e.test.ts --run`
  -> PASS (`2` tests)
- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-architecture-awareness-index.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar`
  -> PASS
- `pnpm run architecture:graph:drift:strict`
  -> PASS
- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-app-completion-index.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar`
  -> PASS
- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-project-truth-indexes.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar --apply`
  -> PASS, but output is stale for this issue

## Readback

- `docs/graphs/architecture-proof-register.csv` now marks
  `api_endpoint:use-positions:e3a48a2408` as `verified` with direct test and
  evidence rows.
- `docs/status/app-completion-index.json` now marks `USE /positions` as:
  - `status: verified`
  - `owner: Test Automation Engineer`
  - `userFlow: Account access`
  - `risk: missing_doc_link`
  - `evidence.hasTest: true`
- `docs/status/app-completion-index.md` no longer lists
  `Dashboard overview | missing_test_link | api_endpoint | USE /positions`.

## Blocker

- `docs/status/project-truth-index.{json,md}` still emits stale
  `Dashboard overview: USE /positions has app-completion risk missing_test_link`
  even though the refreshed architecture graph and app-completion outputs show
  the endpoint as verified and moved to `Account access / missing_doc_link`.
- This is no longer a TAE proof gap. It is a project-truth generator or
  refresh consistency issue outside the scope of the positions test lane.

## Requested next owner/action

- Owner: `Engineering Delivery Lead` or the owner of the project-truth rebuild
  lane.
- Action: reconcile why `build-project-truth-indexes.mjs --apply` keeps the
  stale `USE /positions / missing_test_link` gap after app-completion has
  already advanced the endpoint to `missing_doc_link`.

Knowledge change: `evidence attached only`
