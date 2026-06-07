# Task

## Header
- ID: LUC-2596
- Title: Cover API-side architecture missing-test links
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Core Backend Engineer
- Depends on: LUC-2595
- Priority: P1
- Module Confidence Rows: Architecture Evidence Graph, API seed/runtime freshness/runtime position state local proof
- Requirement Rows: REQ-DOC-031
- Quality Scenario Rows: Local traceability / regression evidence
- Risk Rows: V1 protected production proof remains separate
- Iteration: 2026-06-07
- Operation Mode: BUILDER
- Mission ID: LUC-2596-API-SIDE-ARCHITECTURE-MISSING-TEST-LINKS-2026-06-07
- Mission Status: VERIFIED

## Context

Parent [LUC-2595](/LUC/issues/LUC-2595) refreshed the architecture gap register from `docs/status/architecture-awareness-report.md` generated `2026-06-06T22:16:06.802Z`. The assigned API-side top missing-test anchors were:

- `apps/api/prisma/seed.ts#main`
- `apps/api/src/modules/engine/runtimePositionState.store.ts#toFiniteNonNegativeInt`
- `apps/api/src/observability/runtimeFreshness.ts#parseEnvDate`

## Goal

Add or map focused local proof for the listed API-side anchors and add scanner-readable architecture relation rows so the next architecture-awareness refresh no longer lists these anchors as top actionable missing-test links.

## Scope

- `apps/api/prisma/seed.ts`
- `apps/api/prisma/seed.test.ts`
- `apps/api/src/observability/runtimeFreshness.ts`
- `apps/api/src/observability/runtimeFreshness.test.ts`
- `apps/api/src/modules/engine/runtimePositionAutomationTelemetry.test.ts`
- `docs/architecture/relations/priority-test-links.csv`
- Generated architecture-awareness and graph/status outputs under `docs/graphs/` and `docs/status/`

## Implementation Plan

1. Make the Prisma seed entrypoint import-safe by exporting `main()` and running it only when invoked as the script entrypoint.
2. Add a mocked seed test that exercises owner bootstrap, subscription catalog setup, market universe/symbol group/strategy/wallet/bot creation, and market-group strategy link upserts without database mutation.
3. Export and test `parseEnvDate` directly for trimmed ISO timestamps and blank/malformed fail-closed values.
4. Reuse the existing runtime position state normalization test in `runtimePositionAutomationTelemetry.test.ts` for `toFiniteNonNegativeInt`.
5. Add direct scanner-readable rows to `docs/architecture/relations/priority-test-links.csv`.
6. Refresh architecture-awareness outputs and run focused verification.

## Acceptance Criteria

- Focused API tests cover or map all three assigned anchors.
- `priority-test-links.csv` contains direct LUC-2596 rows for all three anchors.
- Focused API tests pass.
- API typecheck passes.
- Architecture-awareness report no longer lists the three assigned anchors in `Top Actionable Missing Test Links`.
- Repository graph/guardrail checks pass for the touched relation surface.

## Definition of Done

- [x] Seed `main()` is import-safe and covered by mocked local proof.
- [x] Runtime freshness env-date parsing has focused local proof.
- [x] Runtime position non-negative integer normalization is directly mapped to existing focused local proof.
- [x] Architecture relation rows are present.
- [x] Focused tests and API typecheck pass.
- [x] Architecture-awareness refresh proves assigned anchors are no longer top actionable missing-test samples.
- [x] No production, deploy, push, restart, rollback, env/account/secret, protected-smoke, exchange, database, or live-trading mutation occurred.

## Validation Evidence

- `corepack pnpm --filter api exec vitest run prisma/seed.test.ts src/observability/runtimeFreshness.test.ts src/modules/engine/runtimePositionAutomationTelemetry.test.ts --run`  
  PASS: `3` files / `7` tests.
- `corepack pnpm --filter api run typecheck`  
  PASS.
- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-architecture-awareness-index.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar`  
  PASS: `14731` entities, `23431` relations, `9578` files.
- `corepack pnpm run architecture:graph:generate`  
  PASS: `653` nodes, `842` relations, `27` chains.
- `corepack pnpm run architecture:graph:drift:strict`  
  PASS: `845/845` covered, `0` missing.
- `corepack pnpm run quality:guardrails`  
  PASS.
- `git diff --check -- <touched files and generated architecture outputs>`  
  PASS with existing CRLF normalization warnings only.

## Architecture Evidence

- Architecture source reviewed: `docs/status/architecture-awareness-report.md`, `docs/architecture/relations/priority-test-links.csv`, `.agents/core/project-memory-index.md`, `.agents/core/mission-control.md`.
- Fits approved architecture: yes.
- Mismatch discovered: no.
- Decision required from user: no.
- Follow-up architecture doc updates: refreshed generated architecture-awareness outputs and graph/status exports.

## Autonomous Loop Evidence

### 1. Analyze Current State

- [LUC-2596](/LUC/issues/LUC-2596) was issue-scoped and actionable from the wake payload.
- Current report generated `2026-06-06T22:16:06.802Z` listed the three API anchors as the top missing-test links.
- Worktree was already dirty from prior Paperclip lanes; this task preserved unrelated changes.

### 2. Select One Priority Mission Objective

- Selected task: close exactly the three API-side anchors assigned by [LUC-2596](/LUC/issues/LUC-2596).
- Other candidates deferred: Web missing-test links are owned by [LUC-2597](/LUC/issues/LUC-2597).

### 3. Plan Implementation

- Add focused local proof where missing.
- Reuse existing local proof where already present.
- Add scanner-readable relations and refresh generated architecture awareness.

### 4. Execute Implementation

- Exported `seed.ts#main` and guarded script execution with `fileURLToPath(import.meta.url)`.
- Added `seed.test.ts` with mocked Prisma, bcrypt, and subscription dependencies.
- Exported `parseEnvDate` and added direct parser tests.
- Added three `LUC-2596` rows to `priority-test-links.csv`.

### 5. Verify and Test

- Focused tests, API typecheck, architecture-awareness refresh, graph generation, graph drift strict, and repository guardrails passed.
- Refreshed report generated `2026-06-06T22:54:09.465Z` reduced actionable missing-test links from `733` to `729` and no longer lists the assigned API anchors in top actionable missing-test links.

### 6. Self-Review

- Existing systems reused: Vitest, mocked import-safe script pattern, `priority-test-links.csv`, architecture-awareness generator.
- No workaround paths introduced.
- No logic duplication introduced.
- Technical debt introduced: no.

### 7. Update Documentation and Knowledge

- Updated this task artifact and source-of-truth state files.
- No recurring pitfall requiring learning-journal update was discovered in this lane.

## Result Report

- Task summary: implemented and verified local proof plus scanner-readable relation mapping for the three assigned API-side architecture missing-test anchors.
- Files changed: `apps/api/prisma/seed.ts`, `apps/api/prisma/seed.test.ts`, `apps/api/src/observability/runtimeFreshness.ts`, `apps/api/src/observability/runtimeFreshness.test.ts`, `docs/architecture/relations/priority-test-links.csv`, generated architecture outputs, and project state artifacts.
- How tested: focused API tests, API typecheck, architecture-awareness refresh, graph generation, graph drift strict, repository guardrails, and diff check.
- What is incomplete: production runtime/worker readiness remains outside this local traceability lane.
- Next steps: keep [LUC-2597](/LUC/issues/LUC-2597) and protected production proof gates separate; do not reopen these three API anchors unless a future architecture-awareness refresh reintroduces them.
- Decisions made: no product, architecture, security, deployment, or data-safety decision required.
