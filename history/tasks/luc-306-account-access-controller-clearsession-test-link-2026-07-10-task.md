# LUC-306 Account Access Controller ClearSession Test-Link

## Header

- ID: LUC-306
- Title: Account Access controller clearSession missing-test-link proof
- Task Type: qa
- Current Stage: verification
- Status: DONE
- Owner: Test Automation Engineer
- Priority: P1
- Module Confidence Rows: Account access / API auth controller / app-completion truth
- Requirement Rows: Account access session invalidation and fail-closed stale-session handling
- Risk Rows: local DB-backed rerun blocked by unavailable Docker/Postgres
- Operation Mode: TESTER
- Mission ID: LUC-306-ACCOUNT-ACCESS-CONTROLLER-CLEARSESSION-TEST-LINK-2026-07-10
- Mission Status: VERIFIED_LOCAL_INDEX_LINK / DB_RERUN_BLOCKED_BY_LOCAL_INFRA

## Context

Project truth selected
`apps/api/src/modules/auth/auth.controller.ts#clearSession` as the first Account
access `missing_test_link` row after [LUC-263](/LUC/issues/LUC-263) resolved the
`requireAuth` row.

## Goal

Prove or link the smallest relevant automated verification for the controller
`clearSession` behavior so project truth no longer classifies that entity as
`missing_test_link`.

## Scope

- `docs/architecture/scanner-overrides.json`
- generated architecture/app-completion/project-truth indexes under
  `docs/graphs/` and `docs/status/`
- evidence and state records for [LUC-306](/LUC/issues/LUC-306)

No runtime auth code, API behavior, schema, deployment, protected session,
secret, account, exchange, payment, subscription, order, position, or
live-trading change was in scope.

## Implementation Plan

1. Inspect the current project-truth/app-completion row.
2. Confirm existing route tests cover the controller session-clearing behavior.
3. Add a scoped scanner override for only
   `apps/api/src/modules/auth/auth.controller.ts#clearSession`.
4. Regenerate architecture-awareness, app-completion, and project-truth indexes.
5. Run focused local validation where available and record blocked local infra
   honestly.
6. Update durable project state.

## Acceptance Criteria

- `auth.controller.ts#clearSession` is no longer classified as
  `missing_test_link`.
- The evidence cites a real automated test path, not a narrative-only claim.
- Validation commands and any blocked proof path are recorded.
- Remaining non-TAE gaps are handed to the correct lane.

## Definition of Done

- [x] Scoped metadata updated through the approved scanner override mechanism.
- [x] Generated status/index files refreshed.
- [x] API typecheck passed.
- [x] Architecture graph drift strict passed.
- [x] Local DB-backed rerun attempted and blocker recorded.
- [x] No runtime behavior change or production mutation occurred.

## Validation Evidence

- `node C:\Personal\Projekty\Aplikacje\Paperclip_Softwarehouse\scripts\build-architecture-awareness-index.mjs --project Soar --root C:\Personal\Projekty\Aplikacje\Soar`: PASS, `10643` entities / `34593` relations, `entityOverridesApplied=3`.
- `node C:\Personal\Projekty\Aplikacje\Paperclip_Softwarehouse\scripts\build-app-completion-index.mjs --project Soar --root C:\Personal\Projekty\Aplikacje\Soar`: PASS, `missingTestLink=980`.
- `node C:\Personal\Projekty\Aplikacje\Paperclip_Softwarehouse\scripts\build-project-truth-indexes.mjs --project Soar --root C:\Personal\Projekty\Aplikacje\Soar --apply`: PASS, first gap moved to `missing_doc_link` for `auth.controller.ts#clearSession`.
- `corepack pnpm --filter api run typecheck`: PASS.
- `corepack pnpm run architecture:graph:drift:strict`: PASS, `850/850` covered, `0` missing.
- `corepack pnpm exec prettier --check docs/architecture/scanner-overrides.json`: PASS.
- `corepack pnpm --filter api exec vitest run src/modules/auth/auth.e2e.test.ts --pool=forks --maxWorkers=1 --minWorkers=1 --test-timeout 30000`: BLOCKED by unavailable local PostgreSQL at `localhost:5432`.
- `docker ps --format "{{.Names}} {{.Status}}"`: BLOCKED by missing Docker Desktop Linux engine pipe.

## Architecture Evidence

- Architecture source reviewed: app-completion/project-truth generated indexes and existing scanner override mechanism.
- Fits approved architecture: yes.
- Mismatch discovered: no.
- Decision required from user: no.

## Security / Privacy Evidence

- Data classification: auth/session control path.
- Trust boundaries: no protected production account or secret readback.
- Permission or ownership checks: existing route tests verify stale cookie and stale bearer rejection.
- Secret handling: no secret values read or persisted.
- Fail-closed behavior: stale session candidates return `401`; auth service DB dependency failure was not mutated.
- Residual risk: fresh DB-backed rerun needs local Docker/Postgres restored, but prior [LUC-171](/LUC/issues/LUC-171) DB-backed proof remains the linked automated evidence.

## Result Report

- Task summary: resolved the [LUC-306](/LUC/issues/LUC-306) Account access
  `missing_test_link` classification for
  `apps/api/src/modules/auth/auth.controller.ts#clearSession`.
- Files changed: scanner override, generated architecture/status indexes, this
  task/evidence record, and project state records.
- How tested: API typecheck, architecture drift, status regeneration, formatter
  check, attempted focused DB-backed auth route proof.
- What is incomplete: the same entity is now a `missing_doc_link` project-truth
  row for Docs Memory Lead + Project Manager.
- Next steps: DSM/PM should link or update source-of-truth documentation for
  `auth.controller.ts#clearSession`; source-control owner should batch this
  scoped metadata/evidence change with the existing dirty generated-index set.
