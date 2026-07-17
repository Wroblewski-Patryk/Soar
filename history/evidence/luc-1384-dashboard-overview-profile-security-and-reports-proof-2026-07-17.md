# LUC-1384 Evidence

## Scope
- Issue: `LUC-1384`
- Lane: `QA/Test`
- Objective:
  close the generated Dashboard overview `missing_test_link` rows for
  `apps/api/src/router/dashboard.routes.ts#/profile/security` and
  `apps/api/src/router/dashboard.routes.ts#/reports` using the smallest durable
  proof-link repair.

## Findings
- The repository already contained focused executable API proof for both
  router mounts:
  - `apps/api/src/modules/profile/security/security.e2e.test.ts`
  - `apps/api/src/modules/profile/stage-abuse-throttling.e2e.test.ts`
  - `apps/api/src/modules/reports/reports.e2e.test.ts`
- The reports feature also already had route-shell and component-level Web
  proof in:
  - `apps/web/src/features/reports/components/PerformanceReportsView.test.tsx`
  - `apps/web/src/app/dashboard/reports/page.test.tsx`
- The generator could not promote that proof to the two dashboard router mounts
  because neither route had a direct `priority-test-links.csv` relation nor a
  matching verified route override.

## Changes
- Added direct proof relations in
  `docs/architecture/relations/priority-test-links.csv` from:
  - `apps/api/src/router/dashboard.routes.ts#/profile/security` to
    `apps/api/src/modules/profile/security/security.e2e.test.ts`
  - `apps/api/src/router/dashboard.routes.ts#/reports` to
    `apps/api/src/modules/reports/reports.e2e.test.ts`
- Added matching verified entity overrides in
  `docs/architecture/scanner-overrides.json` with scope-accurate descriptions
  and evidence for both router mounts.
- Added matching test relation overrides for:
  - `api_endpoint:use-profile-security:61552c894b`
  - `api_endpoint:use-reports:cc94abde59`
- Regenerated architecture-awareness, app-completion, and project-truth
  exports.

## Verification
- `pnpm --filter api exec vitest run src/modules/profile/security/security.e2e.test.ts --run`
  -> BLOCKED BY LOCAL DB (`localhost:5432` unreachable during Prisma setup)
- `pnpm --filter api exec vitest run src/modules/reports/reports.e2e.test.ts --run`
  -> PARTIAL: unauthenticated fail-closed case passed, DB-backed authenticated cases blocked because `localhost:5432` was unreachable during Prisma setup
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
  `apps/api/src/router/dashboard.routes.ts#/profile/security` with:
  - `status: verified`
  - `owner: Test Automation Engineer`
  - `evidence.hasTest: true`
  - `risk: missing_doc_link`
- `docs/status/app-completion-index.json` now records
  `apps/api/src/router/dashboard.routes.ts#/reports` with:
  - `status: verified`
  - `owner: Test Automation Engineer`
  - `evidence.hasTest: true`
  - `risk: missing_doc_link`
- `docs/status/app-completion-index.md` no longer lists
  `Dashboard overview | missing_test_link | api_endpoint | USE /profile/security`
  or `USE /reports`.
- `docs/status/project-truth-index.{json,md}` no longer emit
  `Dashboard overview: USE /profile/security has app-completion risk missing_test_link.`
  or
  `Dashboard overview: USE /reports has app-completion risk missing_test_link.`

## Residual Risk
- This packet closes only the direct automated proof-link gaps for the two
  Dashboard overview API router mounts.
- Fresh replay of the DB-backed API e2e packs was not possible in this
  heartbeat because local PostgreSQL on `localhost:5432` was unavailable; the
  closure therefore relies on existing durable proof plus fresh
  graph/index/readback confirmation rather than a same-run full e2e replay.
- `apps/web/src/app/dashboard/reports/page.tsx` and
  `apps/web/src/features/reports/components/PerformanceReportsView.tsx` remain
  separate `needs_browser_review` surfaces and are not claimed as browser-proof
  complete by this heartbeat.
- Both API mounts now advance to docs-owned follow-up classification
  `missing_doc_link`, which is separate from QA proof-link closure.
