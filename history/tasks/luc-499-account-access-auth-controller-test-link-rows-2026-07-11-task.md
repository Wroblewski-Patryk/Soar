# LUC-499 Account Access Auth Controller Test-Link Rows

## Header

- ID: LUC-499
- Title: Account access auth controller missing-test-link row repair
- Task Type: qa
- Current Stage: verification
- Status: DONE
- Owner: Core Backend Engineer
- Priority: P1
- Module Confidence Rows: Account access / API auth controller / app-completion truth
- Requirement Rows: Account access auth controller route/session behavior must have linked automated proof
- Risk Rows: generated app-completion can over-route proven auth controller rows as missing test links
- Operation Mode: BUILDER
- Mission ID: LUC-499-ACCOUNT-ACCESS-AUTH-CONTROLLER-TEST-LINK-ROWS-2026-07-11
- Mission Status: VERIFIED_LOCAL_INDEX_LINK / DB_RERUN_BLOCKED_BY_LOCAL_INFRA

## Context

[LUC-499](/LUC/issues/LUC-499) was assigned to prove or repair Account access
`missing_test_link` rows. Current project truth selected
`apps/api/src/modules/auth/auth.controller.ts#clearSessionCookie` first, and
the app-completion row set also listed controller rows for `login`, `logout`,
`me`, `register`, and `setSessionCookie`.

## Goal

Resolve the auth-controller `missing_test_link` rows by linking the smallest
real automated proof already present in the repository, without changing
runtime auth behavior.

## Scope

- `docs/architecture/scanner-overrides.json`
- generated architecture/app-completion/project-truth indexes under `docs/`
- project state ledgers for this Account access source-truth update
- this task and evidence packet

No API runtime code, schema, migration, production access, protected proof,
secret/account readback, deployment, exchange/payment/subscription mutation,
order, position, or live-trading action was in scope.

## Implementation Plan

1. Inspect the generated Account access project-truth/app-completion rows.
2. Read the auth controller and DB-backed auth route tests.
3. Confirm whether existing tests cover each row or whether new tests are required.
4. Add scoped scanner entity overrides only for verified controller rows.
5. Regenerate architecture-awareness, app-completion, and project-truth indexes.
6. Run focused validation available in this runner and record local infra blockers honestly.
7. Update source-of-truth state and report final disposition to Paperclip.

## Acceptance Criteria

- The current `auth.controller.ts#clearSessionCookie` missing-test-link row is no longer a missing-test-link row after refresh.
- `login`, `logout`, `me`, `register`, and `setSessionCookie` also have explicit test evidence links if they are covered.
- Evidence points to executable tests, not narrative-only assertions.
- Any blocked DB-backed rerun is recorded with the exact blocker.

## Definition of Done

- [x] Existing auth route proof inspected and mapped to controller rows.
- [x] Scoped scanner overrides added.
- [x] Generated status/index files refreshed.
- [x] Local validation commands run or blocker recorded.
- [x] Module confidence, requirement, risk, and task-board state updated.
- [x] No runtime behavior or production state changed.

## Validation Evidence

- `docker ps --format "{{.Names}} {{.Status}} {{.Ports}}"`: BLOCKED, Docker Desktop Linux engine pipe unavailable.
- Static proof mapping: `apps/api/src/modules/auth/auth.e2e.test.ts`.
- Prior DB-backed proof: `history/evidence/luc-171-db-backed-auth-worker-runtime-freshness-2026-07-05.md`.
- `node C:\Personal\Projekty\Aplikacje\Paperclip_Softwarehouse\scripts\build-architecture-awareness-index.mjs --project Soar --root C:\Personal\Projekty\Aplikacje\Soar`: PASS, final rerun `10699` entities / `34853` relations, `entityOverridesApplied=10`.
- `node C:\Personal\Projekty\Aplikacje\Paperclip_Softwarehouse\scripts\build-app-completion-index.mjs --project Soar --root C:\Personal\Projekty\Aplikacje\Soar`: PASS, `missingTestLink=974`, down from `980`; total risk items `3533`.
- `node C:\Personal\Projekty\Aplikacje\Paperclip_Softwarehouse\scripts\build-project-truth-indexes.mjs --project Soar --root C:\Personal\Projekty\Aplikacje\Soar --apply`: PASS, first gap advanced to `apps/api/src/modules/auth/auth.e2e.test.ts#restoreEnv` as `missing_doc_link`.
- `corepack pnpm exec prettier --check docs/architecture/scanner-overrides.json`: PASS.
- `corepack pnpm run architecture:graph:drift:strict`: PASS, `850/850` covered, `0` missing.
- `corepack pnpm --filter api exec prisma generate`: PASS.
- `corepack pnpm --filter api run typecheck`: PASS after Prisma client regeneration. The first attempt failed because local generated Prisma client exports were stale/missing.
- `git diff --check`: PASS with CRLF normalization warnings only.

## Architecture Evidence

- Architecture source reviewed: generated app-completion/project-truth indexes and scanner override mechanism.
- Fits approved architecture: yes.
- Mismatch discovered: no.
- Decision required from user: no.

## Security / Privacy Evidence

- Data classification: auth/session behavior and generated metadata.
- Trust boundaries: local source-truth only; no protected production auth/session readback.
- Permission or ownership checks: route tests cover sessionVersion invalidation and stale token rejection.
- Secret handling: no secret values read or persisted.
- Fail-closed behavior: existing tests cover missing, deleted, expired, and stale sessions returning `401`.
- Residual risk: fresh DB-backed rerun is blocked until local Docker/Postgres is available.

## Result Report

- Task summary: linked existing DB-backed auth route proof to six auth-controller Account access `missing_test_link` rows.
- Files changed: scanner override, generated source-truth indexes, evidence/task/state files.
- How tested: static source/test readback, prior DB-backed evidence readback, Docker availability probe, generated-index refresh, typecheck/format/drift checks where available.
- What is incomplete: fresh DB-backed route rerun is blocked by unavailable Docker/Postgres in this runner.
- Next steps: handle the remaining `apps/api/src/modules/auth/auth.e2e.test.ts#restoreEnv` documentation-link row separately through Docs Memory Lead + Project Manager ownership.
