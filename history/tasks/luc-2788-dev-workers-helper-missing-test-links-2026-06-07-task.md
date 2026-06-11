# Task

## Header
- ID: LUC-2788-DEV-WORKERS-HELPER-MISSING-TEST-LINKS-2026-06-07
- Title: Cover dev-workers helper missing-test links
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: QA/Test
- Depends on: [LUC-2783](/LUC/issues/LUC-2783)
- Priority: P1
- Module Confidence Rows: local developer tooling / architecture relation confidence
- Requirement Rows: REQ-DOC-031
- Quality Scenario Rows: not applicable
- Risk Rows: local traceability only; no production/runtime risk changed
- Iteration: 2026-06-07
- Operation Mode: TESTER
- Mission ID: LUC-2788
- Mission Status: VERIFIED

## Context
[LUC-2788](/LUC/issues/LUC-2788) was created from the V1 audit-to-completion
loop after the architecture-awareness report generated
`2026-06-07T11:12:18.981Z` listed `scripts/dev-workers.mjs#prefixLog` and
`scripts/dev-workers.mjs#shutdown` as the next top actionable missing-test
anchors.

## Goal
Cover the current `scripts/dev-workers.mjs` helper anchors with focused local
proof and scanner-readable architecture relation rows without starting worker,
database, production, secret, exchange, or live-trading systems.

## Scope
- `scripts/dev-workers.mjs`
- `scripts/dev-workers.test.mjs`
- `docs/architecture/relations/priority-test-links.csv`
- generated architecture-awareness exports under `docs/graphs/` and
  `docs/status/`
- local state/context files updated with this evidence

## Implementation Plan
1. Make `scripts/dev-workers.mjs` import-safe while preserving direct CLI
   execution.
2. Export testable helper seams for `prefixLog`, `shutdown`, worker exit
   handling, and `main`.
3. Add focused `node:test` coverage using child-process doubles and injected
   process/stream seams.
4. Add direct `LUC-2788` relation rows for `prefixLog`, `shutdown`, and the
   scanner-discovered `shutdownImpl` signal closure.
5. Run focused syntax/proof, architecture graph generation, Softwarehouse
   architecture-awareness refresh, and guardrails.

## Acceptance Criteria
- `node --check scripts/dev-workers.mjs` passes.
- `node --check scripts/dev-workers.test.mjs` passes.
- `node --test scripts/dev-workers.test.mjs` passes.
- Direct relation readback shows the current `scripts/dev-workers.mjs` anchors.
- `pnpm run architecture:graph:generate` passes.
- Softwarehouse architecture-awareness refresh passes and removes the
  `dev-workers` family from Top Actionable Missing Test Links.
- `pnpm run quality:guardrails` passes.

## Definition of Done
- [x] Focused local proof exists for assigned helper anchors.
- [x] Scanner-readable relation rows exist.
- [x] Architecture graph and architecture-awareness exports were refreshed.
- [x] Repository guardrails passed.
- [x] No runtime, deploy, secret, production, database, exchange, or
      live-trading mutation occurred.

## Forbidden
- Docker Compose, DB, Redis, real Prisma, dev worker process startup,
  production browser, protected smoke, deploy, push, restart, rollback,
  account, secret, exchange, database, or live-trading work.
- Broad dev-backend work already closed by [LUC-2775](/LUC/issues/LUC-2775) and
  [LUC-2781](/LUC/issues/LUC-2781).
- Product runtime readiness claims from this local proof.

## Validation Evidence
- `node --check scripts/dev-workers.mjs` => PASS.
- `node --check scripts/dev-workers.test.mjs` => PASS.
- `node --test scripts/dev-workers.test.mjs` => PASS (`4/4`).
- `rg -n "LUC-2788|scripts/dev-workers\\.mjs#(prefixLog|shutdown|shutdownImpl)" docs/architecture/relations/priority-test-links.csv`
  => PASS (`3` rows).
- `pnpm run architecture:graph:generate` => PASS (`653` nodes / `842`
  relations / `27` chains).
- `node scripts/build-architecture-awareness-index.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar`
  from `C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse` => PASS
  (`14927` entities / `24144` relations / `9678` files).
- `docs/status/architecture-awareness-report.md` generated
  `2026-06-07T11:35:58.461Z`: actionable missing-test links reduced from
  `325` to `324` during the final relation refresh, and the `dev-workers`
  family no longer appears in Top Actionable Missing Test Links. Next top
  family is `scripts/evaluateRollbackGuard.mjs`.
- `pnpm run quality:guardrails` => PASS.
- `Get-Process chrome-headless-shell -ErrorAction SilentlyContinue` => no
  rows; no browser validation process was started.

## Architecture Evidence
- Architecture source reviewed: `docs/status/architecture-awareness-report.md`,
  `docs/architecture/relations/priority-test-links.csv`, generated
  architecture-awareness exports.
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
- Issues: `scripts/dev-workers.mjs#prefixLog` and `#shutdown` were listed as
  missing local test links.
- Gaps: script executed at import time and needed injectable seams for focused
  proof.
- Architecture constraints: use existing direct relation CSV mechanism.

### 2. Select One Priority Mission Objective
- Selected task: [LUC-2788](/LUC/issues/LUC-2788).
- Priority rationale: current top actionable missing-test family after
  completed [LUC-2781](/LUC/issues/LUC-2781).
- Deferred: `scripts/evaluateRollbackGuard.mjs` and generated journey index
  families.

### 3. Plan Implementation
- Files modified: `scripts/dev-workers.mjs`, `scripts/dev-workers.test.mjs`,
  `docs/architecture/relations/priority-test-links.csv`, generated
  architecture exports, local evidence/state files.
- Edge cases: multi-line log chunks, blank lines, stderr routing, non-zero
  worker exits, signal-triggered shutdown.

### 4. Execute Implementation
- Made the helper import-safe and injectable.
- Added focused `node:test` coverage with event-emitter child doubles.
- Added direct relation rows for `prefixLog`, `shutdown`, and `shutdownImpl`.

### 5. Verify and Test
- Validation performed: focused syntax/test/readback, graph generation,
  Softwarehouse architecture-awareness refresh, guardrails.
- Result: all passed.

### 6. Self-Review
- Simpler option considered: relation rows only. Rejected because the script
  had no existing focused import-safe proof.
- Technical debt introduced: no.
- Scalability assessment: same pattern as recent script helper proof lanes.

### 7. Update Documentation and Knowledge
- Docs updated: this task evidence, project state/context, module confidence,
  requirements matrix, system health, next steps, generated architecture
  exports.
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
- Task summary: `scripts/dev-workers.mjs` is import-safe, focused helper proof
  exists, and direct architecture relation rows cover the assigned family.
- Files changed: `scripts/dev-workers.mjs`, `scripts/dev-workers.test.mjs`,
  `docs/architecture/relations/priority-test-links.csv`, generated
  architecture exports/status files, and local project evidence/state files.
- How tested: syntax, focused Node test, relation readback, architecture graph
  generation, Softwarehouse architecture-awareness refresh, repository
  guardrails.
- What is incomplete: no incomplete work for [LUC-2788](/LUC/issues/LUC-2788).
  The next unrelated top actionable family is `scripts/evaluateRollbackGuard.mjs`.
- Next steps: parent PM/TSA lane may select the next non-duplicate
  `scripts/evaluateRollbackGuard.mjs` repair lane.
- Decisions made: no product/runtime decision; traceability-only local proof.
