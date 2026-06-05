# Task

## Header
- ID: LUC-2107
- Title: Add generated route/API parity guardrail slice
- Task Type: feature
- Current Stage: verification
- Status: DONE
- Owner: QA/Test
- Priority: P2
- Module Confidence Rows: `LUC-2107-ROUTE-API-MATRIX-GUARDRAIL-2026-06-05`
- Requirement Rows: route/API documentation parity guardrail
- Quality Scenario Rows: architecture/docs drift prevention
- Risk Rows: route/API matrix drift
- Iteration: 2026-06-05
- Operation Mode: TESTER
- Mission ID: `LUC-2107-ROUTE-API-MATRIX-PARITY-2026-06-05`
- Mission Status: VERIFIED

## Context
[LUC-2107](/LUC/issues/LUC-2107) comes from [LUC-2104](/LUC/issues/LUC-2104) triage group `GMRT-03-ROUTE-API-MATRIX-AUTOMATION`. The active gap was that route/API parity was covered by docs and endpoint parity audits, but there was no small generated guardrail comparing live route inventories against `docs/architecture/traceability-matrix.md` and `docs/architecture/reference/dashboard-route-map.md`.

The wake payload reported the previous adapter run failed before useful repository progress because of an existing auth symlink setup error. This heartbeat resumed from the dirty workspace and verified the concrete implementation already present, then patched the checker's import resolution edge case.

## Goal
Create a project-native repeatable check that fails when generated Web routes or API endpoints are missing from the traceability matrix or dashboard route map.

## Scope
- `scripts/checkRouteApiMatrixParity.mjs`
- `scripts/checkRouteApiMatrixParity.test.mjs`
- `package.json`
- `docs/automation/guardrail-commands.md`
- `docs/architecture/traceability-matrix.md`
- `docs/architecture/reference/dashboard-route-map.md`
- architecture graph registry/generated outputs needed to keep strict drift green
- evidence artifacts under `history/artifacts/luc-2107-api-endpoint-docs-parity-2026-06-05/`

## Implementation Plan
1. Reuse existing docs parity and architecture graph patterns instead of adding a parallel framework.
2. Generate Web route inventory from `apps/web/src/app/**/page.tsx`.
3. Generate API endpoint inventory from the Express router tree.
4. Parse route/API coverage patterns from the traceability matrix and dashboard route map.
5. Fail on missing Web route, route-map inventory, API endpoint, or dashboard/admin API contract coverage.
6. Add focused node tests for parser behavior, passing coverage, failing gaps, and nested router import resolution.
7. Document the command in guardrail docs and capture evidence.

## Acceptance Criteria
- `pnpm run docs:parity:route-api-matrix:test` passes.
- `pnpm run docs:parity:route-api-matrix` passes with `gaps: 0`.
- Missing coverage produces actionable gap buckets in the unit test.
- Adjacent docs/architecture guardrails pass.
- Residual risk is documented.

## Definition of Done
- [x] Repeatable command exists in `package.json`.
- [x] Focused checker test exists and passes.
- [x] Live checker passes against current route/API inventory.
- [x] Relevant docs and graph sources are updated.
- [x] Evidence artifact records command results.

## Forbidden
- Runtime route behavior changes.
- Broad architecture tooling refactors.
- Deploy, secrets, protected production smoke, account mutation, or LIVE trading actions.

## Validation Evidence
- Tests: `pnpm run docs:parity:route-api-matrix:test` -> PASS (`5/5`).
- Manual checks: `pnpm run docs:parity:route-api-matrix` -> PASS (`37` Web routes / `109` API endpoints / `0` gaps).
- Guardrails:
  - `pnpm run docs:parity:check` -> PASS.
  - `pnpm run architecture:graph:generate` -> PASS (`651` nodes / `842` relations / `27` chains).
  - `pnpm run architecture:graph:drift:strict` -> PASS (`822/822` covered / `0` missing).
  - `pnpm run quality:guardrails` -> PASS.
- Screenshots/logs: not applicable; no browser/UI surface changed.
- High-risk checks: not applicable; no runtime, auth, money, account, exchange, or live-trading behavior changed.
- Module confidence ledger updated: yes.
- Requirements matrix updated: not applicable for this narrow tooling guardrail.
- Quality scenarios updated: not applicable.
- Risk register updated: not applicable; residual risk is recorded here.
- Reality status: verified.

## Architecture Evidence
- Architecture source reviewed: `docs/architecture/traceability-matrix.md`, `docs/architecture/reference/dashboard-route-map.md`, architecture graph registry.
- Fits approved architecture: yes.
- Mismatch discovered: no.
- Decision required from user: no.
- Follow-up architecture doc updates: route/API matrix command registered in guardrail docs and graph registry.

## Deployment / Ops Evidence
- Deploy impact: none.
- Env or secret changes: none.
- Health-check impact: none.
- Smoke steps updated: no runtime smoke change.
- Rollback note: remove the package scripts, checker/test, and docs/graph entries if the guardrail needs to be reverted.
- Observability or alerting impact: none.
- Staged rollout or feature flag: not applicable.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Existing endpoint docs parity passed separately, but the route/API matrix guardrail was missing as an executable command.
- Dirty workspace already contained most [LUC-2107](/LUC/issues/LUC-2107) files from the previous failed adapter run.
- Strict graph drift initially failed on two existing Web residual test files, so the graph registry was updated to keep the architecture guardrail green.

### 2. Select One Priority Mission Objective
- Selected task: finish [LUC-2107](/LUC/issues/LUC-2107) guardrail implementation and proof.
- Priority rationale: issue was already `in_progress`, actionable, and scoped to Test Automation.
- Deferred: full route-matrix generation and semantic DTO parity.

### 3. Plan Implementation
- Keep checker script project-native and file-based.
- Preserve route behavior.
- Patch import resolution to use the first existing candidate path so mounted routers that import directory indexes are covered.

### 4. Execute Implementation
- Added nested import resolution test.
- Patched checker import resolution.
- Added/verified command documentation and graph coverage.

### 5. Verify and Test
- Focused checker tests passed.
- Live checker passed with zero gaps.
- Docs parity, graph generation, strict graph drift, and repository guardrails passed.

### 6. Self-Review
- Simpler option considered: only check docs text for route strings. Rejected because it would not prove live inventory coverage.
- Technical debt introduced: no.
- Scalability assessment: acceptable for current route count; future semantic parity can extend the same checker if needed.

### 7. Update Documentation and Knowledge
- Docs updated: guardrail command docs, architecture route map/matrix, graph registry/generated outputs.
- Context updated: project state, task board, module confidence, system health.
- Learning journal updated: not applicable; no recurring pitfall confirmed.

## Result Report
- Task summary: implemented and verified a generated route/API matrix parity guardrail.
- Files changed: checker script/test, package scripts, architecture/docs/graph sources and generated outputs, evidence/task/state files.
- How tested: focused node tests, live parity check, docs parity, architecture graph generate/drift, quality guardrails.
- What is incomplete: full semantic API contract generation remains intentionally deferred.
- Next steps: make the command mandatory when Web routes, API routes, traceability matrix, or dashboard route map change.
- Decisions made: root ops endpoints are exempted from feature traceability rows; dashboard/admin endpoints are checked against dashboard route-map primary API contracts.
