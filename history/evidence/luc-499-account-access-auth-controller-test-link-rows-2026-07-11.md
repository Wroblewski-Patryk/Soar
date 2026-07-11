# LUC-499 Account Access Auth Controller Test-Link Evidence

- Date: 2026-07-11
- Owner: 09 CBE (Core Backend Engineer)
- Status: VERIFIED_LOCAL_INDEX_LINK / DB_RERUN_BLOCKED_BY_LOCAL_INFRA
- Scope: Account access app-completion `missing_test_link` rows for `apps/api/src/modules/auth/auth.controller.ts`.

## Rows Handled

| Entity | Linked proof |
| --- | --- |
| `auth.controller.ts#clearSessionCookie` | `auth.e2e.test.ts` logout clears token cookie; `/auth/me` clears deleted/expired/stale session candidates. |
| `auth.controller.ts#login` | `auth.e2e.test.ts` login succeeds and sets short-lived or remember-me cookie TTLs. |
| `auth.controller.ts#logout` | `auth.e2e.test.ts` invalidates `sessionVersion`, clears cookie, rejects stale cookie and bearer token, and allows relogin. |
| `auth.controller.ts#me` | `auth.e2e.test.ts` verifies valid current-user readback, missing-token fail closed behavior, deleted-user clearing, expired JWT clearing, duplicate token precedence, and stale-session rejection. |
| `auth.controller.ts#register` | `auth.e2e.test.ts` verifies successful registration, public user payload shape, validation failures, duplicate email rejection, and session cookie bootstrap. |
| `auth.controller.ts#setSessionCookie` | `auth.e2e.test.ts` verifies register/login cookie setting, remember and short-lived TTLs, and `/auth/me` duplicate-cookie healing. |

## Validation

- Static source readback: `apps/api/src/modules/auth/auth.controller.ts`.
- Static test readback: `apps/api/src/modules/auth/auth.e2e.test.ts`.
- Prior DB-backed evidence: `history/evidence/luc-171-db-backed-auth-worker-runtime-freshness-2026-07-05.md`, where focused auth route proof passed (`2` files / `16` tests).
- Fresh local infra probe: `docker ps --format "{{.Names}} {{.Status}} {{.Ports}}"` failed because Docker Desktop Linux engine pipe was unavailable.
- `node C:\Personal\Projekty\Aplikacje\Paperclip_Softwarehouse\scripts\build-architecture-awareness-index.mjs --project Soar --root C:\Personal\Projekty\Aplikacje\Soar`: PASS, final rerun `10699` entities / `34853` relations, `entityOverridesApplied=10`.
- `node C:\Personal\Projekty\Aplikacje\Paperclip_Softwarehouse\scripts\build-app-completion-index.mjs --project Soar --root C:\Personal\Projekty\Aplikacje\Soar`: PASS, `missingTestLink=974`, down from `980`; total risk items `3533`.
- `node C:\Personal\Projekty\Aplikacje\Paperclip_Softwarehouse\scripts\build-project-truth-indexes.mjs --project Soar --root C:\Personal\Projekty\Aplikacje\Soar --apply`: PASS, first gap advanced to `apps/api/src/modules/auth/auth.e2e.test.ts#restoreEnv` as `missing_doc_link`.
- `corepack pnpm exec prettier --check docs/architecture/scanner-overrides.json`: PASS.
- `corepack pnpm run architecture:graph:drift:strict`: PASS, `850/850` covered, `0` missing.
- `corepack pnpm --filter api run typecheck`: initially failed because local generated Prisma client lacked schema exports; `corepack pnpm --filter api exec prisma generate` passed, and rerun API typecheck passed.
- `git diff --check`: PASS with CRLF normalization warnings only.

## Boundary

No runtime code, API behavior, schema, migration, production access, protected account/session readback, secret readback, deploy, push, restart, rollback, DB/Redis mutation outside unavailable test startup, exchange/payment/subscription mutation, order, position, or live-trading action occurred.

## Residual

Fresh DB-backed rerun remains blocked until local Docker/Postgres is available. The linked prior DB-backed route proof remains sufficient for resolving these generated missing-test-link rows through the approved scanner override mechanism. The next Account access project-truth row is `apps/api/src/modules/auth/auth.e2e.test.ts#restoreEnv` as `missing_doc_link`, owned by Docs Memory Lead + Project Manager.
