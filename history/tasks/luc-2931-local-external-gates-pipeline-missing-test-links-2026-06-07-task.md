# LUC-2931 Local External Gates Pipeline Missing-Test Links

## Header
- ID: LUC-2931
- Title: [Soar][QA/Test][LUC-2928] Local external gates pipeline missing-test links
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: QA/Test
- Depends on: LUC-2928
- Priority: P0
- Module Confidence Rows: Release audit tooling / Architecture Evidence Graph relation confidence
- Requirement Rows: REQ-DOC-031
- Quality Scenario Rows: not changed
- Risk Rows: protected production gate boundaries unchanged
- Iteration: 2026-06-07 LUC-2931
- Operation Mode: TESTER
- Mission ID: LUC-2931-LOCAL-EXTERNAL-GATES-PIPELINE-MISSING-TEST-LINKS-2026-06-07
- Mission Status: VERIFIED

## Process Self-Audit
- [x] All seven autonomous loop steps are represented.
- [x] Exactly one priority task was selected: cover/classify current `scripts/runLocalExternalGatesPipeline.mjs` missing-test anchors.
- [x] Operation mode selected as TESTER for QA/Verification ownership.
- [x] Source-of-truth files reviewed: AGENTS contract, Paperclip QA role, `.agents/state/active-mission.md`, `.agents/state/next-steps.md`, `.codex/context/TASK_BOARD.md`, `docs/status/architecture-awareness-report.md`.
- [x] Affected confidence and requirement rows identified.
- [x] Task improves release confidence by adding local proof and scanner-readable traceability for release gate tooling.

## Mission Block
- Mission objective: Add focused local proof and architecture relation rows for current `scripts/runLocalExternalGatesPipeline.mjs` anchors.
- Release objective advanced: Soar V1 audit-to-completion traceability and release tooling confidence.
- Included slices: import-safe helper exports, injectable local test seams, focused Node tests, direct `priority-test-links.csv` rows, graph/readback proof.
- Explicit exclusions: protected external gates, production auth, protected smoke, deploy, push, restart, rollback, account, secret, database, exchange, order, position, live-trading, and real local pipeline execution.
- Checkpoint cadence: one heartbeat, close after local proof and relation readback.
- Stop conditions: test failure, architecture relation readback failure, or evidence requiring protected credentials.
- Handoff expectation: parent TSA/PM lane may refresh architecture-awareness and select the next non-duplicate family.

## Responsibility Lanes

| Lane | Owner | Owned files/surfaces | Output | Validation/proof | Status |
| --- | --- | --- | --- | --- | --- |
| QA/Test | QA/Verification Engineer | `scripts/runLocalExternalGatesPipeline.mjs`, `scripts/runLocalExternalGatesPipeline.test.mjs` | Focused local helper and CLI-entrypoint proof | `node --test scripts/runLocalExternalGatesPipeline.test.mjs` | DONE |
| Architecture Traceability | QA/Verification Engineer | `docs/architecture/relations/priority-test-links.csv` | Twelve direct relation rows for exact current anchors plus introduced `printUsage` | relation readback; architecture-awareness refresh | DONE |
| Documentation/Memory | QA/Verification Engineer | task/context/state files | Durable evidence and next action | This task packet and context updates | DONE |

## Context
[LUC-2928](/LUC/issues/LUC-2928) created this child after the architecture-awareness report generated `2026-06-07T20:07:06.809Z` listed current `scripts/runLocalExternalGatesPipeline.mjs` helper anchors in Top Actionable Missing Test Links.

## Goal
Cover or classify:
- `scripts/runLocalExternalGatesPipeline.mjs#assertLatestSloObservationPassed`
- `scripts/runLocalExternalGatesPipeline.mjs#buildStatusWithOfflineFallback`
- `scripts/runLocalExternalGatesPipeline.mjs#canReachApi`
- `scripts/runLocalExternalGatesPipeline.mjs#expectedShaArgs`
- `scripts/runLocalExternalGatesPipeline.mjs#findLatestSloObservationArtifact`
- `scripts/runLocalExternalGatesPipeline.mjs#hasSloInputs`
- `scripts/runLocalExternalGatesPipeline.mjs#main`
- `scripts/runLocalExternalGatesPipeline.mjs#normalizeDbProfile`
- `scripts/runLocalExternalGatesPipeline.mjs#normalizeEnvironment`
- `scripts/runLocalExternalGatesPipeline.mjs#parseArgs`
- `scripts/runLocalExternalGatesPipeline.mjs#run`
- `scripts/runLocalExternalGatesPipeline.mjs#printUsage`

## Success Signal
- User or operator problem: architecture-awareness should not keep reporting current local external gate pipeline anchors as missing local test links after focused proof exists.
- Expected reliability outcome: release gate pipeline helper behavior is locally testable without invoking protected production gates or real local pipeline commands.
- How success will be observed: focused tests pass and the refreshed awareness report omits all `runLocalExternalGatesPipeline.mjs#...` rows from Top Actionable Missing Test Links.
- Post-launch learning needed: no.

## Constraints
- Use existing `node:test` pattern and architecture relation CSV.
- Do not introduce a new framework or release gate mechanism.
- Do not run protected external gates, production auth, or real local pipeline commands.
- Do not request or persist secrets.
- Change pipeline behavior only enough to preserve CLI behavior while enabling focused imports and dependency injection.

## Definition of Done
- [x] `scripts/runLocalExternalGatesPipeline.mjs` can be imported by focused tests while preserving direct CLI behavior.
- [x] Focused Node proof covers the current helper anchors, offline fallback, API reachability header propagation, secret-argv rejection, SLO artifact detection, `printUsage`, and offline `main` orchestration.
- [x] Twelve direct `LUC-2931` relation rows exist in `docs/architecture/relations/priority-test-links.csv`.
- [x] Relation readback, architecture graph generation, architecture-awareness refresh, and repository guardrails pass.

## Forbidden
- Protected external gates or production/protected smoke execution.
- Secret values in repo, logs, generated artifacts, or issue comments.
- Deploy, push, restart, rollback, account, exchange, database, order, position, or live-trading mutation.
- Temporary bypasses or parallel pipeline implementation.

## Validation Evidence
- Tests:
  - `node --check scripts/runLocalExternalGatesPipeline.mjs` PASS.
  - `node --check scripts/runLocalExternalGatesPipeline.test.mjs` PASS.
  - `node --test scripts/runLocalExternalGatesPipeline.test.mjs` PASS (`7/7`).
  - `node scripts/runLocalExternalGatesPipeline.mjs --help` PASS.
- Manual checks:
  - Direct relation readback PASS (`12` `LUC-2931` rows).
- Architecture/logs:
  - `pnpm run architecture:graph:generate` PASS (`653` nodes / `842` relations / `27` chains).
  - Softwarehouse architecture-awareness refresh PASS (`15050` entities / `34488` relations / `9741` files), generated `2026-06-07T20:42:55.740Z`.
  - Refreshed actionable missing-test links are `234`, and no `scripts/runLocalExternalGatesPipeline.mjs#...` anchor appears in Top Actionable Missing Test Links.
  - `pnpm run quality:guardrails` PASS.
- High-risk checks:
  - No protected external gates, production auth, protected smoke, deploy, push, restart, rollback, account, secret, exchange, database, order, position, or live-trading action occurred.
- Module confidence ledger updated: yes.
- Requirements matrix updated: yes.
- Quality scenarios updated: not applicable.
- Risk register updated: no, existing protected-boundary risk unchanged.
- Reality status: verified.

## Architecture Evidence
- Architecture source reviewed: `docs/architecture/relations/priority-test-links.csv`, `docs/status/architecture-awareness-report.md`, architecture graph generator.
- Fits approved architecture: yes.
- Mismatch discovered: no.
- Decision required from user: no.
- Follow-up architecture doc updates: parent TSA/PM may refresh architecture-awareness and pick the next current non-duplicate family.

## Deployment / Ops Evidence
- Deploy impact: none.
- Env or secret changes: none.
- Health-check impact: none.
- Smoke steps updated: no.
- Rollback note: revert `scripts/runLocalExternalGatesPipeline.mjs`, `scripts/runLocalExternalGatesPipeline.test.mjs`, and the `LUC-2931` relation rows if needed.
- Observability or alerting impact: none.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issue heartbeat context confirmed [LUC-2931](/LUC/issues/LUC-2931) scope and no pending comments.
- Current report generated `2026-06-07T20:07:06.809Z` listed eleven `runLocalExternalGatesPipeline` anchors as missing test links.
- Existing script was CLI-only and ran `main()` at import time, preventing focused helper imports.

### 2. Select One Priority Mission Objective
- Selected `scripts/runLocalExternalGatesPipeline.mjs` local proof and relation repair because it was the assigned high-priority QA issue and current top missing-test family.

### 3. Plan Implementation
- Export current helper functions.
- Add injectable `parseArgs`, `run`, `buildStatusWithOfflineFallback`, and `main` seams.
- Preserve direct CLI behavior through an import guard.
- Add focused local tests and exact relation rows.

### 4. Execute Implementation
- Added import-safe exports and dependency injection without changing the release gate command contract.
- Added `scripts/runLocalExternalGatesPipeline.test.mjs`.
- Added twelve `LUC-2931` rows to `docs/architecture/relations/priority-test-links.csv`.

### 5. Verify and Test
- All focused syntax, unit, CLI-help, relation readback, graph, awareness, and guardrail checks passed.

### 6. Self-Review
- Existing pipeline logic was reused; no parallel implementation was introduced.
- Behavior change is limited to import-safe exports and injectable test seams.
- Direct CLI execution remains available through the `pathToFileURL(process.argv[1]).href` guard.

### 7. Update Documentation and Knowledge
- Updated task packet, state/context summaries, requirements matrix, module confidence ledger, active mission, next steps, and task board.
- Learning journal update not needed; no recurring new pitfall was discovered.

## Result Report
- Task summary: Local external gates pipeline helper anchors now have deterministic local proof and scanner-readable architecture relations.
- Files changed: `scripts/runLocalExternalGatesPipeline.mjs`, `scripts/runLocalExternalGatesPipeline.test.mjs`, `docs/architecture/relations/priority-test-links.csv`, source-of-truth state/context files, this task packet.
- How tested: syntax checks, focused `node:test` (`7/7`), safe CLI help, relation readback, architecture graph generation, Softwarehouse awareness refresh, repository guardrails.
- What is incomplete: remaining missing-test families are separate generated-index, go-live smoke, protected-route/browser proof, and prod-auth browser proof helper families.
- Next steps: parent routing should select the next non-duplicate family; do not reopen this lane unless the local external gates pipeline changes again.
- Decisions made: treat this as local traceability proof only; no protected gate or production proof was attempted.
