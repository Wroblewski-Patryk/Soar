# Task

## Header
- ID: LUC-2790-ROLLBACK-GUARD-HELPER-MISSING-TEST-LINKS-2026-06-07
- Title: Rollback guard helper missing-test links
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: QA/Test
- Depends on: [LUC-2789](/LUC/issues/LUC-2789)
- Priority: P1
- Module Confidence Rows: release tooling / architecture relation confidence
- Requirement Rows: REQ-DOC-031
- Quality Scenario Rows: not applicable
- Risk Rows: local traceability only; no production/runtime risk changed
- Iteration: 2026-06-07
- Operation Mode: TESTER
- Mission ID: LUC-2790
- Mission Status: VERIFIED

## Context
[LUC-2790](/LUC/issues/LUC-2790) was created after the architecture-awareness
report generated `2026-06-07T11:35:58.461Z` listed
`scripts/evaluateRollbackGuard.mjs#fetchWithTimeout`,
`#isRollbackCriticalAlert`, `#main`, `#parseArgs`, and `#printUsage` as the
current top actionable missing-test links.

## Goal
Cover the current rollback guard helper anchors with focused local proof and
scanner-readable architecture relation rows without deploying, restarting,
running protected smoke, accessing secrets, or mutating production/account/
exchange/database/live-trading state.

## Scope
- `scripts/evaluateRollbackGuard.mjs`
- `scripts/evaluateRollbackGuard.test.mjs`
- `docs/architecture/relations/priority-test-links.csv`
- generated architecture-awareness exports under `docs/graphs/` and
  `docs/status/`
- local state/context evidence files

## Implementation Plan
1. Make `scripts/evaluateRollbackGuard.mjs` import-safe while preserving direct
   CLI execution.
2. Export narrow helper seams for `parseArgs`, `printUsage`,
   `fetchWithTimeout`, `isRollbackCriticalAlert`, and `main`.
3. Add focused `node:test` coverage with injected fetch/auth/header/process/
   console seams and no real network dependency.
4. Add direct `LUC-2790` rows to `priority-test-links.csv`.
5. Run focused proof, graph generation, architecture-awareness refresh, and
   guardrails.

## Acceptance Criteria
- `node --check scripts/evaluateRollbackGuard.mjs` passes.
- `node --check scripts/evaluateRollbackGuard.test.mjs` passes.
- `node --test scripts/evaluateRollbackGuard.test.mjs` passes.
- Direct relation readback shows the current rollback guard anchors.
- `pnpm run architecture:graph:generate` passes.
- Softwarehouse architecture-awareness refresh passes and removes
  `scripts/evaluateRollbackGuard.mjs` from Top Actionable Missing Test Links.
- `pnpm run quality:guardrails` passes.

## Definition of Done
- [x] Focused local proof exists for assigned helper anchors.
- [x] Scanner-readable relation rows exist.
- [x] Architecture graph and architecture-awareness exports were refreshed.
- [x] Repository guardrails passed.
- [x] No runtime, deploy, secret, production, database, exchange, or
      live-trading mutation occurred.

## Forbidden
- Deploy, restart, rollback, protected smoke, production mutation, secret
  access, live account use, exchange action, database mutation, Docker Compose,
  or live-trading work.
- Broad release readiness claims from this local helper proof.

## Validation Evidence
- `node --check scripts/evaluateRollbackGuard.mjs` => PASS.
- `node --check scripts/evaluateRollbackGuard.test.mjs` => PASS.
- `node --test scripts/evaluateRollbackGuard.test.mjs` => PASS (`7/7`).
- `rg -n "LUC-2790|scripts/evaluateRollbackGuard\\.mjs#(fetchWithTimeout|isRollbackCriticalAlert|main|parseArgs|printUsage)" docs/architecture/relations/priority-test-links.csv`
  => PASS (`5` direct rows).
- `node scripts/evaluateRollbackGuard.mjs --help` => PASS; usage prints env
  variable names only, not secret values.
- `pnpm run architecture:graph:generate` => PASS (`653` nodes / `842`
  relations / `27` chains).
- `node scripts/build-architecture-awareness-index.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar`
  from `C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse` => PASS
  (`14935` entities / `24161` relations / `9682` files).
- `docs/status/architecture-awareness-report.md` generated
  `2026-06-07T11:58:47.402Z`: actionable missing-test links reduced to `320`,
  and `scripts/evaluateRollbackGuard.mjs` no longer appears in Top Actionable
  Missing Test Links.
- `pnpm run quality:guardrails` => PASS.

## Architecture Evidence
- Architecture source reviewed: `docs/status/architecture-awareness-report.md`,
  `docs/architecture/relations/priority-test-links.csv`, generated graph
  exports, and project graph generator.
- Fits approved architecture: yes.
- Mismatch discovered: no.
- Decision required from user: no.
- Follow-up architecture doc updates: generated graph/status exports refreshed.

## Deployment / Ops Evidence
- Deploy impact: none.
- Env or secret changes: none.
- Health-check impact: none.
- Smoke steps updated: no.
- Rollback note: no runtime/deploy change; revert local script/test/relation
  edits if needed.
- Observability or alerting impact: none.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issue: rollback guard helper functions were listed as missing focused test
  links.
- Gap: script executed at import time and needed injectable seams for local
  proof.
- Architecture constraints: use existing direct relation CSV mechanism.

### 2. Select One Priority Mission Objective
- Selected task: [LUC-2790](/LUC/issues/LUC-2790).
- Priority rationale: active assigned Test Automation lane for the current top
  actionable family.
- Deferred: unrelated generated journey index helper families.

### 3. Plan Implementation
- Files modified: `scripts/evaluateRollbackGuard.mjs`,
  `scripts/evaluateRollbackGuard.test.mjs`,
  `docs/architecture/relations/priority-test-links.csv`, generated
  architecture exports, local evidence/state files.
- Edge cases: secret CLI flags, help output, injected fetch abort signal,
  healthy rollback decision, protected endpoint `401`, failed freshness, and
  SEV-1 critical alert classification.

### 4. Execute Implementation
- Made the helper import-safe and injectable.
- Added focused `node:test` coverage with fake fetch/auth/header/process
  dependencies.
- Added direct relation rows for all five assigned anchors.

### 5. Verify and Test
- Validation performed: syntax, focused Node test, help command, relation
  readback, graph generation, Softwarehouse architecture-awareness refresh,
  guardrails.
- Result: all passed.

### 6. Self-Review
- Simpler option considered: relation rows only. Rejected because the script
  lacked import-safe focused helper proof for the exact anchors.
- Technical debt introduced: no.
- Scalability assessment: matches the recent script helper proof pattern.

### 7. Update Documentation and Knowledge
- Docs updated: this task evidence, project state/context, module confidence,
  system health, next steps, generated architecture exports.
- Learning journal updated: not applicable; no recurring tooling pitfall found.

## Review Checklist
- [x] Process self-audit completed before implementation.
- [x] Exactly one priority task was completed.
- [x] Current stage is declared and respected.
- [x] Architecture alignment confirmed.
- [x] Existing relation/test systems reused.
- [x] No workaround paths were introduced.
- [x] No logic duplication was introduced.
- [x] Definition of Done evidence is attached.
- [x] Relevant validations were run.
- [x] Source-of-truth files were updated.

## Result Report
- Task summary: `scripts/evaluateRollbackGuard.mjs` is import-safe, focused
  helper proof exists, and direct architecture relation rows cover the assigned
  rollback guard family.
- Files changed: `scripts/evaluateRollbackGuard.mjs`,
  `scripts/evaluateRollbackGuard.test.mjs`,
  `docs/architecture/relations/priority-test-links.csv`, generated
  architecture exports/status files, and local project evidence/state files.
- How tested: syntax, focused Node test, CLI help, relation readback,
  architecture graph generation, Softwarehouse architecture-awareness refresh,
  repository guardrails.
- What is incomplete: no incomplete work for [LUC-2790](/LUC/issues/LUC-2790).
  The refreshed report now surfaces unrelated `scripts/dev-workers.mjs#main`
  and generated journey index helpers.
- Next steps: parent PM/TSA lane may select the next non-duplicate current
  architecture-awareness family.
- Decisions made: no product/runtime decision; traceability-only local proof.
