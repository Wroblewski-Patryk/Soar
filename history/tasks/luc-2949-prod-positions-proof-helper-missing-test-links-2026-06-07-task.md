# Task

## Header
- ID: LUC-2949
- Title: Prod positions proof helper missing-test links
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: QA/Test
- Depends on: LUC-2946
- Priority: P0
- Module Confidence Rows: Architecture Evidence Graph / production positions proof tooling
- Requirement Rows: not applicable; traceability and local proof repair only
- Quality Scenario Rows: testability, production safety
- Risk Rows: protected production positions proof mutation risk
- Iteration: 2026-06-07
- Operation Mode: TESTER
- Mission ID: LUC-2949-PROD-POSITIONS-PROOF-HELPER-MISSING-TEST-LINKS-2026-06-07
- Mission Status: VERIFIED

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the assigned Test Automation lane.
- [x] The task is aligned with repository source-of-truth documents.
- [x] `.agents/core/project-memory-index.md` was represented through the active AGENTS/Paperclip wake contract and focused state readback.
- [x] `.agents/core/mission-control.md` was represented through the active mission packet.
- [x] Missing or template-like state tables were not bootstrapped because this was a focused child repair.
- [x] Affected module confidence rows were identified.
- [x] Affected requirement, quality scenario, and risk rows were identified or marked not applicable.
- [x] The task improves release confidence by reducing generated missing-test links for protected production proof tooling.

## Mission Block
- Mission objective: add safe local-only proof and scanner-readable test links for `scripts/runProdPositionsProof.mjs` helper anchors.
- Release objective advanced: Soar V1 audit-to-completion architecture-awareness closure.
- Included slices: import-safe helper exports, focused `node:test`, priority test relation rows, architecture-awareness refresh, state/evidence update.
- Explicit exclusions: no production positions proof, no approval flag, no production auth/session, no real account token/cookie, no exchange/order/position/live-trading mutation.
- Checkpoint cadence: one bounded heartbeat.
- Stop conditions: any protected runtime action required, production credential required, or local validation failure.
- Handoff expectation: close issue with evidence when local proof and generated report refresh pass.

## Responsibility Lanes

| Lane | Owner | Source docs/state | Owned files/surfaces | Output | Validation/proof | Status |
| --- | --- | --- | --- | --- | --- | --- |
| Coordinator | Active chat | AGENTS.md, Paperclip wake | Integration, state closure | Final issue disposition | Paperclip issue update | DONE |
| QA/Test | Test Automation Engineer | LUC-2949 | `scripts/runProdPositionsProof.mjs`, `.test.mjs` | Local helper proof | `node --test` | DONE |
| Architecture | Active chat | architecture-awareness report | `priority-test-links.csv`, generated graph/report | relation rows and refresh | graph generate + scanner refresh | DONE |
| Documentation/Memory | Active chat | task board, project state, ledger | history/state docs | durable evidence | state readback | DONE |

## Context
`docs/status/architecture-awareness-report.md` generated `2026-06-07T21:37:41.107Z` listed twelve actionable missing-test anchors for `scripts/runProdPositionsProof.mjs`: `assertStatus`, `extractItems`, `findCandidate`, `main`, `normalizeBaseUrl`, `printUsage`, `readArgValue`, `readJson`, `renderMarkdown`, `requestJson`, `resolveOptions`, and `toStep`.

## Goal
Cover or classify those helper anchors with safe local-only proof while preserving direct CLI behavior and the protected production approval guard.

## Success Signal
- User or operator problem: generated architecture-awareness missing-test links made protected positions proof tooling look unproved.
- Expected product or reliability outcome: helper behavior has deterministic local proof and scanner-readable relations without protected execution.
- How success will be observed: refreshed report no longer lists `runProdPositionsProof` anchors in Top Actionable Missing Test Links.
- Post-launch learning needed: no.

## Deliverable For This Stage
Verified local helper proof, relation rows, refreshed architecture-awareness evidence, and source-of-truth updates.

## Constraints
- Preserve existing CLI behavior.
- Do not run production positions proof.
- Do not pass `--i-understand-production-positions-proof`.
- Do not use production auth/session, real account tokens/cookies, exchange credentials, or secrets.
- Do not create, cancel, close, or mutate positions/orders/accounts.

## Definition of Done
- [x] Helper imports do not execute protected CLI behavior.
- [x] Focused local tests prove listed helper anchors through mocked/injected behavior.
- [x] Scanner-readable relation rows exist for covered anchors.
- [x] Architecture-awareness refresh removes the target anchors from the top actionable missing-test list.
- [x] Repository guardrails pass.

## Validation Evidence
- Tests:
  - `node --check scripts/runProdPositionsProof.mjs` PASS.
  - `node --check scripts/runProdPositionsProof.test.mjs` PASS.
  - `node --test scripts/runProdPositionsProof.test.mjs` PASS (`5/5`).
  - `node scripts/runProdPositionsProof.mjs --help` PASS.
  - direct `LUC-2949` relation readback PASS (`12` rows).
  - `pnpm run architecture:graph:generate` PASS (`653` nodes / `842` relations / `27` chains).
  - `node scripts/build-architecture-awareness-index.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar` from `C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse` PASS (`15072` entities / `34623` relations / `9752` files).
  - `pnpm run quality:guardrails` PASS.
- Manual checks:
  - `docs/status/architecture-awareness-report.md` generated `2026-06-07T22:06:01.945Z` reports `181` actionable implementation entities without inferred tests, down from `193`.
  - No `scripts/runProdPositionsProof.mjs#...` anchor remains in Top Actionable Missing Test Links.
- Screenshots/logs: command output recorded in this task and issue comment.
- High-risk checks: production proof not run; approval flag not passed; no secrets or protected credentials used.
- Module confidence ledger updated: yes.
- Reality status: verified.

## Architecture Evidence
- Architecture source reviewed: `docs/status/architecture-awareness-report.md`, `docs/architecture/relations/priority-test-links.csv`.
- Fits approved architecture: yes.
- Mismatch discovered: no.
- Decision required from user: no.
- Follow-up architecture doc updates: generated architecture-awareness exports refreshed.

## Deployment / Ops Evidence
- Deploy impact: none.
- Env or secret changes: none.
- Health-check impact: none.
- Smoke steps updated: no.
- Rollback note: revert the helper export guard, test file, and relation rows if needed.
- Observability or alerting impact: none.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: target helper anchors were listed as actionable missing-test links.
- Gaps: no local test file or relation rows for `runProdPositionsProof`.
- Inconsistencies: none found.
- Architecture constraints: relation rows must be scanner-readable.

### 2. Select One Priority Mission Objective
- Selected task: LUC-2949.
- Priority rationale: assigned critical Test Automation child from LUC-2946.
- Why other candidates were deferred: outside issue scope.

### 3. Plan Implementation
- Files or surfaces to modify: proof helper, new test file, relation CSV, evidence/state docs.
- Logic: import guard with named exports; mocked local tests only.
- Edge cases: invalid JSON, missing CLI args, empty nested item payloads, occupied symbols, safe help path.

### 4. Execute Implementation
- Implementation notes: added `pathToFileURL` guard and exported helpers; added five focused tests; added twelve relation rows.

### 5. Verify and Test
- Validation performed: syntax, safe help, focused node test, relation readback, architecture graph, architecture-awareness refresh, guardrails.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: relation-only classification. Rejected because safe helper exports and mocked tests provide stronger proof without protected execution.
- Technical debt introduced: no.
- Scalability assessment: follows existing local proof pattern from LUC-2939/LUC-2945.
- Refinements made: `findCandidate` tested through mocked HTTP route sequence.

### 7. Update Documentation and Knowledge
- Docs updated: this task, task board, project state, active mission, module confidence ledger, system health.
- Context updated: yes.
- Learning journal updated: not applicable.

## Review Checklist
- [x] Process self-audit completed before implementation.
- [x] Autonomous loop evidence covers all seven steps.
- [x] Exactly one priority task was completed in this iteration.
- [x] Current stage is declared and respected.
- [x] Deliverable for the current stage is complete.
- [x] Architecture alignment confirmed.
- [x] Existing systems were reused where applicable.
- [x] No workaround paths were introduced.
- [x] No logic duplication was introduced.
- [x] Definition of Done evidence is attached.
- [x] Relevant validations were run.
- [x] Docs or context were updated.
