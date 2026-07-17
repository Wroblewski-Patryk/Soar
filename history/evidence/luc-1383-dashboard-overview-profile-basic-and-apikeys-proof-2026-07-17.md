# LUC-1383 Evidence

## Scope
- Issue: `LUC-1383`
- Lane: `QA/Test`
- Objective:
  close the generated Dashboard overview `missing_test_link` rows for
  `apps/api/src/router/dashboard.routes.ts#/profile/basic` and
  `apps/api/src/router/dashboard.routes.ts#/profile/apiKeys` using the smallest
  durable proof-link repair.

## Findings
- The repository already had focused executable route proof in
  `apps/api/src/modules/profile/basic/basic.e2e.test.ts` and
  `apps/api/src/modules/profile/apiKey/apiKey.e2e.test.ts`.
- The generator could not promote that proof to the two router mounts because
  those exact mounted paths had no direct `priority-test-links.csv` relations
  and no matching verified override entries.

## Changes
- Added direct proof relations in
  `docs/architecture/relations/priority-test-links.csv` from
  `apps/api/src/router/dashboard.routes.ts#/profile/basic` to
  `apps/api/src/modules/profile/basic/basic.e2e.test.ts` and from
  `apps/api/src/router/dashboard.routes.ts#/profile/apiKeys` to
  `apps/api/src/modules/profile/apiKey/apiKey.e2e.test.ts`.
- Added matching verified entity overrides in
  `docs/architecture/scanner-overrides.json` with scope-accurate evidence and
  route-mount descriptions for both profile surfaces.
- Regenerated architecture-awareness, app-completion, and project-truth
  exports.

## Verification
- `pnpm --filter api exec vitest run src/modules/profile/basic/basic.e2e.test.ts --run`
  -> FAIL (`4` tests failed) because Prisma could not reach PostgreSQL at
  `localhost:5432`
- `pnpm --filter api exec vitest run src/modules/profile/apiKey/apiKey.e2e.test.ts --run`
  -> TIMED OUT in the current workstation session before a conclusive result
- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-architecture-awareness-index.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar`
  -> PASS
- `pnpm run architecture:graph:drift:strict`
  -> PASS
- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-app-completion-index.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar`
  -> PASS
- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-project-truth-indexes.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar --apply`
  -> PASS

## Readback
- `docs/status/app-completion-index.md` no longer lists
  `Dashboard overview | missing_test_link | api_endpoint | USE /profile/apiKeys`.
- `docs/status/app-completion-index.md` no longer lists
  `Dashboard overview | missing_test_link | api_endpoint | USE /profile/basic`.
- `docs/status/project-truth-index.md` now routes:
  - `Account access: USE /profile/apiKeys has app-completion risk missing_doc_link.`
  - `Dashboard overview: USE /profile/basic has app-completion risk missing_doc_link.`

## Residual Risk
- The proof-link repair is complete, but both mounts still require docs-owned
  follow-up because the refreshed queue now truthfully routes them as
  `missing_doc_link`.
- Local DB-backed replay is not fully reproducible on this workstation state
  because PostgreSQL is not reachable at `localhost:5432`.
- No runtime behavior, deploy state, or protected-browser evidence was changed
  or claimed in this heartbeat.
