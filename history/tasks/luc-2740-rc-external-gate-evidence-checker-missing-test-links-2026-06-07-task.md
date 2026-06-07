# LUC-2740 RC External Gate Evidence Checker Missing-Test Links

## Header
- ID: LUC-2740
- Title: [Soar][Test Automation][LUC-2738] RC external gate evidence checker missing-test links
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: QA/Test
- Depends on: LUC-2738
- Priority: P0
- Module Confidence Rows: Release audit tooling / Architecture Evidence Graph relation confidence
- Requirement Rows: REQ-DOC-031
- Quality Scenario Rows: not changed
- Risk Rows: protected production gate boundaries unchanged
- Iteration: 2026-06-07 LUC-2740
- Operation Mode: TESTER
- Mission ID: LUC-2740-RC-EXTERNAL-GATE-EVIDENCE-CHECKER-MISSING-TEST-LINKS-2026-06-07
- Mission Status: VERIFIED

## Process Self-Audit
- [x] All seven autonomous loop steps are represented.
- [x] Exactly one priority task was selected: cover/classify current `scripts/checkRcExternalGateEvidence.mjs` missing-test anchors.
- [x] Operation mode selected as TESTER for Test Automation ownership.
- [x] Source-of-truth files reviewed: AGENTS contract, Paperclip Test Automation role, `.agents/state/active-mission.md`, `.agents/state/next-steps.md`, `.codex/context/TASK_BOARD.md`, `.agents/core/project-memory-index.md`, issue heartbeat context.
- [x] Affected confidence and requirement rows identified.
- [x] Task improves release confidence by adding local proof and scanner-readable traceability for release evidence tooling.

## Mission Block
- Mission objective: Add focused local proof and architecture relation rows for current `scripts/checkRcExternalGateEvidence.mjs` anchors.
- Release objective advanced: Soar V1 audit-to-completion traceability and release tooling confidence.
- Included slices: import-safe helper exports, focused Node tests, direct `priority-test-links.csv` rows, graph/readback proof.
- Explicit exclusions: production gates, protected smoke, deploy, push, restart, rollback, account, secret, exchange, database, live-trading, product runtime mutation.
- Checkpoint cadence: one heartbeat, close after local proof and relation readback.
- Stop conditions: test failure, architecture relation readback failure, or evidence requiring protected credentials.
- Handoff expectation: parent TSA/PM lane may refresh architecture-awareness and select the next non-duplicate family.

## Responsibility Lanes

| Lane | Owner | Owned files/surfaces | Output | Validation/proof | Status |
| --- | --- | --- | --- | --- | --- |
| QA/Test | Test Automation Engineer | `scripts/checkRcExternalGateEvidence.mjs`, `scripts/checkRcExternalGateEvidence.test.mjs` | Focused local helper and CLI-entrypoint proof | `node --test scripts/checkRcExternalGateEvidence.test.mjs` | DONE |
| Architecture Traceability | Test Automation Engineer | `docs/architecture/relations/priority-test-links.csv` | Seven direct relation rows for exact current anchors | `rg -n "LUC-2740" ...`; `pnpm run architecture:graph:generate` | DONE |
| Documentation/Memory | Test Automation Engineer | task/context/state files | Durable evidence and next action | This task packet and context updates | DONE |

## Context
[LUC-2738](/LUC/issues/LUC-2738) refreshed architecture-awareness after [LUC-2733](/LUC/issues/LUC-2733). The refreshed report generated `2026-06-07T09:05:01.622Z` listed `scripts/checkRcExternalGateEvidence.mjs` helper anchors as the current top actionable missing-test family.

## Goal
Cover or classify:
- `scripts/checkRcExternalGateEvidence.mjs#capture`
- `scripts/checkRcExternalGateEvidence.mjs#extractEvidenceValues`
- `scripts/checkRcExternalGateEvidence.mjs#main`
- `scripts/checkRcExternalGateEvidence.mjs#parseArgs`
- `scripts/checkRcExternalGateEvidence.mjs#parseGateLabel`
- `scripts/checkRcExternalGateEvidence.mjs#parseSignoffFields`
- `scripts/checkRcExternalGateEvidence.mjs#resolveDocsRoot`

## Success Signal
- User or operator problem: architecture-awareness should not keep reporting current RC evidence checker anchors as missing local test links after focused proof exists.
- Expected reliability outcome: release evidence checker helper behavior is locally testable without invoking protected production gates.
- How success will be observed: focused tests pass and relation rows are scanner-readable.
- Post-launch learning needed: no.

## Deliverable For This Stage
Verified local test coverage, relation rows, and source-of-truth evidence packet for `LUC-2740`.

## Constraints
- Use existing `node:test` pattern and architecture relation CSV.
- Do not introduce a new framework or release gate mechanism.
- Do not run protected production gates or request/persist secrets.
- Change checker behavior only if focused proof exposes a real defect.

## Definition of Done
- [x] `scripts/checkRcExternalGateEvidence.mjs` can be imported by focused tests while preserving CLI execution.
- [x] Focused Node proof covers the current helper anchors and strict missing-evidence behavior.
- [x] Seven direct `LUC-2740` relation rows exist in `docs/architecture/relations/priority-test-links.csv`.
- [x] Relation readback and architecture graph generation pass.
- [x] Repository guardrails pass.

## Forbidden
- Production/protected smoke execution.
- Secret values in repo, logs, generated artifacts, or issue comments.
- Deploy, push, restart, rollback, account, exchange, database, or live-trading mutation.
- Temporary bypasses or parallel checker implementation.

## Validation Evidence
- Tests:
  - `node --check scripts/checkRcExternalGateEvidence.mjs` PASS.
  - `node --check scripts/checkRcExternalGateEvidence.test.mjs` PASS.
  - `node --test scripts/checkRcExternalGateEvidence.test.mjs` PASS (`6/6`).
  - `node scripts/checkRcExternalGateEvidence.mjs --help` PASS.
- Manual checks:
  - `rg -n "LUC-2740" docs/architecture/relations/priority-test-links.csv` PASS (`7` rows).
- Architecture/logs:
  - `pnpm run architecture:graph:generate` PASS (`653` nodes / `842` relations / `27` chains).
  - `pnpm run quality:guardrails` PASS.
- High-risk checks:
  - No protected production gate, deploy, push, restart, rollback, account, secret, exchange, database, or live-trading action occurred.
- Module confidence ledger updated: yes.
- Requirements matrix updated: yes.
- Quality scenarios updated: not applicable.
- Risk register updated: no, existing protected-boundary risk unchanged.
- Reality status: verified.

## Architecture Evidence
- Architecture source reviewed: `docs/architecture/relations/priority-test-links.csv`, `docs/status/architecture-awareness-report.md`, project graph generator.
- Fits approved architecture: yes.
- Mismatch discovered: no.
- Decision required from user: no.
- Follow-up architecture doc updates: parent TSA/PM may refresh full architecture-awareness and pick the next current non-duplicate family.

## Deployment / Ops Evidence
- Deploy impact: none.
- Env or secret changes: none.
- Health-check impact: none.
- Smoke steps updated: no.
- Rollback note: revert `scripts/checkRcExternalGateEvidence.mjs`, `scripts/checkRcExternalGateEvidence.test.mjs`, and the `LUC-2740` relation rows if needed.
- Observability or alerting impact: none.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issue heartbeat context confirmed [LUC-2740](/LUC/issues/LUC-2740) scope and exact anchors.
- Existing script was CLI-only and ran `main()` at import time, preventing focused helper imports.
- Existing relation CSV had older aggregate relation only, not direct current `LUC-2740` function anchors.

### 2. Select One Priority Mission Objective
- Selected `scripts/checkRcExternalGateEvidence.mjs` local proof and relation repair because it was the assigned critical issue and current top missing-test family.

### 3. Plan Implementation
- Export current helper functions.
- Add injectable `main({ args, cwd, consoleImpl, exitOnHelp, exitOnStrictFailure })`.
- Preserve direct CLI behavior.
- Add focused tests and seven relation rows.

### 4. Execute Implementation
- Added top-level `capture` helper.
- Made `resolveDocsRoot`, `parseArgs`, and `main` injectable for tests.
- Added `scripts/checkRcExternalGateEvidence.test.mjs`.
- Added seven `LUC-2740` rows to `docs/architecture/relations/priority-test-links.csv`.

### 5. Verify and Test
- All focused syntax, unit, CLI-help, relation readback, graph, and guardrail checks passed.

### 6. Self-Review
- Existing checker logic was reused; no parallel implementation was introduced.
- Behavior change is limited to import-safe exports and injectable test seams.
- Direct CLI execution remains available through the `fileURLToPath(import.meta.url)` guard.

### 7. Update Documentation and Knowledge
- Updated task packet, state/context summaries, requirements matrix, module confidence ledger, active mission, next steps, and task board.
- Learning journal update not needed; no recurring new pitfall was discovered.

## Review Checklist
- [x] Process self-audit completed before implementation.
- [x] Autonomous loop evidence covers all seven steps.
- [x] Exactly one priority task was completed in this iteration.
- [x] Current stage is declared and respected.
- [x] Architecture alignment confirmed.
- [x] Existing systems were reused.
- [x] No workaround paths were introduced.
- [x] No logic duplication was introduced.
- [x] Definition of Done evidence is attached.
- [x] Relevant validations were run.
- [x] Docs/context/state were updated.
- [x] Required responsibility lanes were integrated.
