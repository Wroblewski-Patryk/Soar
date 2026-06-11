# Task

## Header
- ID: LUC-2820
- Title: Cover runAud07 isolated DB runner main missing-test link
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: QA/Test
- Depends on: [LUC-2817](/LUC/issues/LUC-2817)
- Priority: P2
- Module Confidence Rows: local test tooling / Architecture Evidence Graph
- Requirement Rows: REQ-DATA-007
- Quality Scenario Rows: not applicable
- Risk Rows: RISK-032
- Iteration: 2026-06-07
- Operation Mode: TESTER
- Mission ID: LUC-2820-RUNAUD07-ISOLATED-DB-RUNNER-MAIN-MISSING-TEST-LINK-2026-06-07
- Mission Status: VERIFIED

## Context
[LUC-2817](/LUC/issues/LUC-2817) selected the next non-duplicate
architecture-awareness missing-test anchor:
`scripts/runAud07IsolatedDbPacks.mjs#main`. Existing aggregate tooling
coverage linked the script file, but the CLI entrypoint was not import-safe or
directly covered.

## Goal
Cover the isolated DB runner `main` anchor without starting Docker, running
real Prisma reset/migrate commands, mutating any database, or touching
production/protected environments.

## Scope
- `scripts/runAud07IsolatedDbPacks.mjs`
- `scripts/runAud07IsolatedDbPacks.test.mjs`
- `docs/architecture/relations/priority-test-links.csv`
- generated architecture graph / awareness artifacts
- local state evidence files

## Implementation Plan
1. Make the runner import-safe while preserving direct CLI behavior.
2. Export narrow injectable seams for `packs`, `pnpmArgs`, `run`, and `main`.
3. Add focused `node:test` coverage for `--list`, sequential pack
   orchestration, pnpm argument construction, and non-zero child exit handling.
4. Add scanner-readable relation rows for the covered function anchors.
5. Run focused checks, graph generation, architecture-awareness refresh, and
   guardrails.

## Acceptance Criteria
- `scripts/runAud07IsolatedDbPacks.mjs#main` no longer appears in Top
  Actionable Missing Test Links.
- Focused runner tests pass without executing real DB reset packs.
- Direct relation readback includes the `#main` anchor.
- Repository guardrails pass.

## Definition of Done
- Implemented and verified with focused local tests.
- No production, protected smoke, Docker Compose, real Prisma, DB, account,
  secret, exchange, deploy, push, restart, rollback, or live-trading mutation.
- Project state and Paperclip issue disposition updated with evidence.

## Validation Evidence
- `node --check scripts/runAud07IsolatedDbPacks.mjs` PASS.
- `node --check scripts/runAud07IsolatedDbPacks.test.mjs` PASS.
- `node scripts/runAud07IsolatedDbPacks.mjs --list` PASS; listed wallets,
  backtests, and runtime-repository packs only.
- `node --test scripts/runAud07IsolatedDbPacks.test.mjs` PASS (`4/4`).
- `rg -n "scripts/runAud07IsolatedDbPacks\.mjs#(main|pnpmArgs|run)" docs/architecture/relations/priority-test-links.csv`
  PASS (`3` rows).
- `pnpm run architecture:graph:generate` PASS (`653` nodes / `842` relations /
  `27` chains).
- `node scripts/build-architecture-awareness-index.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar`
  from `C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse` PASS
  (`14960` entities / `24213` relations / `9695` files).
- `docs/status/architecture-awareness-report.md` generated
  `2026-06-07T13:36:23.702Z`; actionable missing-test links dropped to `311`
  and `scripts/runAud07IsolatedDbPacks.mjs#main` is no longer listed.
- `pnpm run quality:guardrails` PASS.
- Reality status: verified.

## Architecture Evidence
- Architecture source reviewed: `docs/status/architecture-awareness-report.md`,
  `docs/architecture/relations/priority-test-links.csv`.
- Fits approved architecture: yes.
- Mismatch discovered: no.
- Decision required from user: no.
- Follow-up architecture doc updates: generated graph/awareness artifacts
  refreshed.

## Deployment / Ops Evidence
- Deploy impact: none.
- Env or secret changes: none.
- Health-check impact: none.
- Smoke steps updated: no.
- Rollback note: no runtime mutation; revert the scoped files if needed.
- Observability or alerting impact: none.

## Autonomous Loop Evidence

### 1. Analyze Current State
- The runner was direct-CLI only and executed `main()` at import time.
- Existing aggregate relation covered the script file, not the exact `#main`
  function anchor.

### 2. Select One Priority Mission Objective
- Selected [LUC-2820](/LUC/issues/LUC-2820), the assigned Test Automation lane.

### 3. Plan Implementation
- Add import-safe seams and focused tests with injected doubles.

### 4. Execute Implementation
- Exported runner seams, guarded direct CLI execution with `import.meta.url`,
  added focused tests, and added direct relation rows.

### 5. Verify and Test
- Focused syntax/test/list/readback checks passed.
- Architecture graph and architecture-awareness refresh passed.
- Repository guardrails passed.

### 6. Self-Review
- No workaround paths introduced.
- Direct CLI behavior preserved.
- Tests avoid real DB mutation and prove the runner behavior through injected
  command/process doubles.

### 7. Update Documentation and Knowledge
- Task evidence and project state files updated.
- Learning journal update not needed; no new recurring pitfall found.

## Result Report
- Task summary: covered the `runAud07IsolatedDbPacks` CLI entrypoint and helper
  anchors with focused local tests and scanner-readable architecture relations.
- Files changed: `scripts/runAud07IsolatedDbPacks.mjs`,
  `scripts/runAud07IsolatedDbPacks.test.mjs`,
  `docs/architecture/relations/priority-test-links.csv`, generated
  architecture artifacts, and local state evidence.
- How tested: see Validation Evidence.
- What is incomplete: no incomplete scope for [LUC-2820](/LUC/issues/LUC-2820).
- Next steps: parent queue can continue from the remaining generated
  journey-index / go-live smoke families already deduped to existing blocked
  lanes, or from the refreshed next top non-duplicate anchor.
- Decisions made: no real isolated DB audit pack was run because issue scope
  required safe local test doubles unless destructive DB action was explicitly
  proven safe.
