# LUC-306 Account Access Controller ClearSession Test-Link Evidence

Date: 2026-07-10

## Scope

- Issue: [LUC-306](/LUC/issues/LUC-306)
- Target row: `apps/api/src/modules/auth/auth.controller.ts#clearSession`
- Lane: Test Automation Engineer
- Boundary: local source-truth and test-link proof only. No runtime auth code
  change, deploy, restart, rollback, protected account/session readback, secret
  readback, DB/Redis mutation beyond attempted local test setup,
  exchange/payment/subscription mutation, order, position, or live-trading
  action.

## Result

`apps/api/src/modules/auth/auth.controller.ts#clearSession` moved off
`missing_test_link` after a scoped scanner override linked the existing
DB-backed auth route proof and the app-completion/project-truth indexes were
regenerated.

Fresh readback after sequential regeneration:

- Architecture awareness: `10643` entities, `34593` relations,
  `entityOverridesApplied=3`.
- App completion: `missingTestLink=980`, down from `981`; `missingDocLink=1995`;
  `implementedNeedsProof=113`.
- Project truth first gap is now the same controller entity as
  `missing_doc_link`, owned by Docs Memory Lead + Project Manager. This is a
  different lane than the [LUC-306](/LUC/issues/LUC-306) missing-test-link
  assignment.

## Behavior Proof Source

Existing DB-backed route coverage in
`apps/api/src/modules/auth/auth.e2e.test.ts` verifies the controller-level
session clearing behavior through public routes:

- `POST /auth/logout` returns `200` and a `token=; Expires=Thu, 01 Jan 1970`
  clearing cookie.
- Immediate `GET /auth/me` through the same agent returns `401 Missing token`.
- Reusing the stale pre-logout cookie returns `401 Session expired. Please sign
  in again.`
- Reusing the stale pre-logout bearer token returns `401 Session expired. Please
  sign in again.`
- Re-login creates a fresh accepted session.

Prior passing evidence:

- `history/evidence/luc-171-db-backed-auth-worker-runtime-freshness-2026-07-05.md`
  records DB-backed auth/origin tests passed: `2` files / `16` tests.

## Commands

Passed:

```text
node C:\Personal\Projekty\Aplikacje\Paperclip_Softwarehouse\scripts\build-architecture-awareness-index.mjs --project Soar --root C:\Personal\Projekty\Aplikacje\Soar
node C:\Personal\Projekty\Aplikacje\Paperclip_Softwarehouse\scripts\build-app-completion-index.mjs --project Soar --root C:\Personal\Projekty\Aplikacje\Soar
node C:\Personal\Projekty\Aplikacje\Paperclip_Softwarehouse\scripts\build-project-truth-indexes.mjs --project Soar --root C:\Personal\Projekty\Aplikacje\Soar --apply
corepack pnpm --filter api run typecheck
corepack pnpm run architecture:graph:drift:strict
corepack pnpm exec prettier --check docs/architecture/scanner-overrides.json
```

Attempted but blocked by local infrastructure:

```text
docker ps --format "{{.Names}} {{.Status}}"
corepack pnpm --filter api exec vitest run src/modules/auth/auth.e2e.test.ts --pool=forks --maxWorkers=1 --minWorkers=1 --test-timeout 30000
```

Failure reason:

- Docker Desktop Linux engine pipe was unavailable:
  `open //./pipe/dockerDesktopLinuxEngine: The system cannot find the file specified`.
- Focused DB-backed auth route proof could not reach PostgreSQL:
  `Can't reach database server at localhost:5432`.

## Residual

No remaining Test Automation action is required for the
`auth.controller.ts#clearSession` missing-test-link classification. The next
project-truth row is a documentation link gap for the same entity and belongs
to Docs Memory Lead + Project Manager.
