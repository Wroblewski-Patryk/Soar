# Task

## Header
- ID: LUC-2812
- Title: Cover dev-workers handleWorkerExit missing-test link
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: QA/Test
- Depends on: LUC-2809, LUC-2788
- Priority: P1
- Module Confidence Rows: local developer-tooling / Architecture Evidence Graph relation confidence
- Requirement Rows: REQ-DOC-031
- Quality Scenario Rows: not applicable
- Risk Rows: RISK-ARCH-DEV-TOOLING-TRACEABILITY-2026-06-07
- Iteration: 2026-06-07
- Operation Mode: TESTER
- Mission ID: LUC-2812-DEV-WORKERS-HANDLE-WORKER-EXIT-MISSING-TEST-LINK-2026-06-07
- Mission Status: VERIFIED

## Context
[LUC-2812](/LUC/issues/LUC-2812) was assigned as a Test Automation child under
[LUC-2809](/LUC/issues/LUC-2809). The current architecture-awareness report
generated `2026-06-07T12:50:57.059Z` listed
`scripts/dev-workers.mjs#handleWorkerExit` as the next actionable missing-test
link after prior dev-workers relation repairs.

## Goal
Cover or classify `scripts/dev-workers.mjs#handleWorkerExit` with the smallest
local, scanner-readable proof without starting real worker processes or touching
protected runtime gates.

## Scope
- `docs/architecture/relations/priority-test-links.csv`
- `scripts/dev-workers.mjs`
- `scripts/dev-workers.test.mjs`
- generated architecture graph exports under `docs/graphs/`
- generated architecture status exports under `docs/status/`

## Implementation Plan
1. Inspect current `scripts/dev-workers.mjs` and focused test coverage.
2. Reuse existing injected-seam `handleWorkerExit()` proof if sufficient.
3. Add only the missing scanner-readable relation row for
   `scripts/dev-workers.mjs#handleWorkerExit`.
4. Run focused syntax/proof, relation readback, architecture graph generation,
   Softwarehouse architecture-awareness refresh, and guardrails.
5. Update task/state evidence and close the Paperclip issue.

## Acceptance Criteria
- Focused syntax/proof for touched script and test files passes.
- Direct relation readback proves `scripts/dev-workers.mjs#handleWorkerExit`
  is linked to `scripts/dev-workers.test.mjs`.
- Architecture graph generation passes after relation change.
- Architecture-awareness refresh no longer lists `handleWorkerExit` in Top
  Actionable Missing Test Links.
- Repository guardrails pass.

## Definition of Done
- [x] Existing `handleWorkerExit()` test proof was confirmed sufficient.
- [x] Scanner-readable relation row was added.
- [x] Focused tests and graph/guardrail checks passed.
- [x] No forbidden runtime, deploy, protected smoke, account, secret, exchange,
      database, Docker Compose, or live-trading mutation occurred.

## Forbidden
- Do not start Docker Compose, DB, Redis, Prisma against a real database, dev
  worker processes, production browser, protected smoke, deploy, push, restart,
  rollback, account, secret, exchange, database, or live-trading work.
- Do not duplicate existing [LUC-2788](/LUC/issues/LUC-2788) coverage for
  dev-workers helper behavior.
- Do not claim product runtime readiness from this local developer-tooling proof.

## Validation Evidence
- `node --check scripts/dev-workers.mjs` PASS.
- `node --check scripts/dev-workers.test.mjs` PASS.
- `node --test scripts/dev-workers.test.mjs` PASS (`4/4`).
- `rg -n "scripts/dev-workers\\.mjs#handleWorkerExit.*LUC-2812|LUC-2812.*scripts/dev-workers\\.mjs#handleWorkerExit" docs/architecture/relations/priority-test-links.csv`
  PASS (`1` row).
- `pnpm run architecture:graph:generate` PASS (`653` nodes / `842` relations /
  `27` chains).
- `node scripts/build-architecture-awareness-index.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar`
  from `C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse` PASS
  (`14954` entities / `24198` relations / `9692` files).
- `docs/status/architecture-awareness-report.md` generated
  `2026-06-07T13:04:38.451Z`; actionable missing-test links are now `314`,
  and `handleWorkerExit` no longer appears in Top Actionable Missing Test Links.
- `pnpm run quality:guardrails` PASS.
- Reality status: verified.

## Architecture Evidence
- Architecture source reviewed:
  `docs/architecture/relations/priority-test-links.csv` and
  `docs/status/architecture-awareness-report.md`.
- Fits approved architecture: yes.
- Mismatch discovered: no.
- Decision required from user: no.
- Follow-up architecture doc updates: generated graph/report exports refreshed.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issue [LUC-2812](/LUC/issues/LUC-2812) targets only residual
  `scripts/dev-workers.mjs#handleWorkerExit`.
- Existing `scripts/dev-workers.test.mjs` already covers successful worker
  exits, fail-closed non-zero exits, child termination, stderr output, and exit
  code propagation through injected doubles.

### 2. Select One Priority Mission Objective
- Selected task: close the `dev-workers#handleWorkerExit` missing-test link.
- Other architecture-awareness families were deferred because this issue is
  scoped to the residual dev-workers anchor.

### 3. Plan Implementation
- Add a single relation row if proof is sufficient; do not add duplicate test
  behavior.

### 4. Execute Implementation
- Added:
  `scripts/dev-workers.mjs#handleWorkerExit,scripts/dev-workers.test.mjs,LUC-2812 direct worker exit fail-closed relation`.

### 5. Verify and Test
- Focused Node proof, direct relation readback, architecture graph generation,
  Softwarehouse architecture-awareness refresh, and repository guardrails all
  passed.

### 6. Self-Review
- Simpler option considered and used: no new test case was added because the
  existing `handleWorkerExit()` test already proves the scanner anchor.
- Technical debt introduced: no.

### 7. Update Documentation and Knowledge
- Task artifact and source-of-truth state were updated.
- Learning journal updated: not applicable; no recurring new pitfall found.

## Result Report
- Task summary: closed the residual `scripts/dev-workers.mjs#handleWorkerExit`
  missing-test link with a scanner-readable relation to the existing focused
  test.
- Files changed: `docs/architecture/relations/priority-test-links.csv`,
  generated architecture graph/report exports, this task artifact, and project
  state files.
- How tested: focused Node syntax/test proof, relation readback,
  architecture graph generation, Softwarehouse architecture-awareness refresh,
  and repository guardrails.
- What is incomplete: nothing for [LUC-2812](/LUC/issues/LUC-2812).
- Next steps: parent PM/TSA queue can continue from generated journey index
  helper anchors already deduped to [LUC-2791](/LUC/issues/LUC-2791).
- Decisions made: existing test coverage was sufficient; only relation repair
  was needed.
