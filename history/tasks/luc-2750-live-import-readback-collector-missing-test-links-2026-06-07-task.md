# LUC-2750 Live Import Readback Collector Missing-Test Links

## Header
- ID: LUC-2750
- Title: [Soar][Test Automation][LUC-2749] Live import readback collector missing-test links
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: QA/Test
- Depends on: LUC-2749
- Priority: P0
- Module Confidence Rows: Release audit tooling / Architecture Evidence Graph relation confidence
- Requirement Rows: REQ-DOC-031
- Quality Scenario Rows: not changed
- Risk Rows: protected production gate boundaries unchanged
- Iteration: 2026-06-07 LUC-2750
- Operation Mode: TESTER
- Mission ID: LUC-2750-LIVE-IMPORT-READBACK-COLLECTOR-MISSING-TEST-LINKS-2026-06-07
- Mission Status: VERIFIED

## Process Self-Audit
- [x] All seven autonomous loop steps are represented.
- [x] Exactly one priority task was selected: cover/classify current `scripts/collectLiveImportReadbackEvidence.mjs` missing-test anchors.
- [x] Operation mode selected as TESTER for Test Automation ownership.
- [x] Source-of-truth files reviewed: AGENTS contract, Paperclip Test Automation role, `.agents/state/active-mission.md`, `.agents/state/next-steps.md`, `.codex/context/TASK_BOARD.md`, issue heartbeat context.
- [x] Affected confidence and requirement rows identified.
- [x] Task improves release confidence by adding local proof and scanner-readable traceability for protected-readback tooling without protected input use.

## Mission Block
- Mission objective: Add focused local proof and architecture relation rows for current `scripts/collectLiveImportReadbackEvidence.mjs` anchors.
- Release objective advanced: Soar V1 audit-to-completion traceability and release tooling confidence.
- Included slices: import-safe helper exports, focused Node tests, direct `priority-test-links.csv` rows, graph/readback proof.
- Explicit exclusions: protected production readback, production browser, deploy, push, restart, rollback, account, secret, exchange, database, live-trading, product runtime mutation.
- Checkpoint cadence: one heartbeat, close after local proof and relation readback.
- Stop conditions: test failure, architecture relation readback failure, or evidence requiring protected credentials.
- Handoff expectation: parent TSA/PM lane may refresh architecture-awareness and select the next non-duplicate family.

## Responsibility Lanes

| Lane | Owner | Owned files/surfaces | Output | Validation/proof | Status |
| --- | --- | --- | --- | --- | --- |
| QA/Test | Test Automation Engineer | `scripts/collectLiveImportReadbackEvidence.mjs`, `scripts/collectLiveImportReadbackEvidence.test.mjs` | Focused local helper and CLI-entrypoint proof | `node --test scripts/collectLiveImportReadbackEvidence.test.mjs` | DONE |
| Architecture Traceability | Test Automation Engineer | `docs/architecture/relations/priority-test-links.csv` | Nineteen direct relation rows for exact current anchors | `rg -n "LUC-2750" ...`; `pnpm run architecture:graph:generate` | DONE |
| Documentation/Memory | Test Automation Engineer | task/context/state files | Durable evidence and next action | This task packet and context updates | DONE |

## Context
[LUC-2749](/LUC/issues/LUC-2749) refreshed architecture-awareness after [LUC-2740](/LUC/issues/LUC-2740). The refreshed report generated `2026-06-07T09:34:54.277Z` listed `scripts/collectLiveImportReadbackEvidence.mjs` helper anchors as the current top actionable missing-test family.

## Goal
Cover or classify:
- `scripts/collectLiveImportReadbackEvidence.mjs#assertOptions`
- `scripts/collectLiveImportReadbackEvidence.mjs#collectAllPositions`
- `scripts/collectLiveImportReadbackEvidence.mjs#collectSymbolPositions`
- `scripts/collectLiveImportReadbackEvidence.mjs#discoverBots`
- `scripts/collectLiveImportReadbackEvidence.mjs#discoverSymbolsFromRuntimeReadback`
- `scripts/collectLiveImportReadbackEvidence.mjs#fetchJson`
- `scripts/collectLiveImportReadbackEvidence.mjs#hashId`
- `scripts/collectLiveImportReadbackEvidence.mjs#main`
- `scripts/collectLiveImportReadbackEvidence.mjs#normalizeBaseUrl`
- `scripts/collectLiveImportReadbackEvidence.mjs#normalizeSymbol`
- `scripts/collectLiveImportReadbackEvidence.mjs#printUsage`
- `scripts/collectLiveImportReadbackEvidence.mjs#readArgValue`
- `scripts/collectLiveImportReadbackEvidence.mjs#redactBot`
- `scripts/collectLiveImportReadbackEvidence.mjs#redactPosition`
- `scripts/collectLiveImportReadbackEvidence.mjs#redactSession`
- `scripts/collectLiveImportReadbackEvidence.mjs#resolveBuildInfo`
- `scripts/collectLiveImportReadbackEvidence.mjs#resolveOptions`
- `scripts/collectLiveImportReadbackEvidence.mjs#resolveSession`
- `scripts/collectLiveImportReadbackEvidence.mjs#splitCsv`

## Success Signal
- User or operator problem: architecture-awareness should not keep reporting current live import readback collector anchors as missing local test links after focused proof exists.
- Expected reliability outcome: protected-readback collector helper behavior is locally testable without invoking production readback or handling real secrets.
- How success will be observed: focused tests pass and relation rows are scanner-readable.
- Post-launch learning needed: no.

## Deliverable For This Stage
Verified local test coverage, relation rows, and source-of-truth evidence packet for [LUC-2750](/LUC/issues/LUC-2750).

## Constraints
- Use existing `node:test` pattern and architecture relation CSV.
- Do not introduce a new framework or release gate mechanism.
- Do not run protected production readback or request/persist secrets.
- Change collector behavior only if focused proof exposes a real defect.

## Definition of Done
- [x] `scripts/collectLiveImportReadbackEvidence.mjs` can be imported by focused tests while preserving CLI execution.
- [x] Focused Node proof covers current local helper anchors, no-secret/dry-run/help behavior, local readback success, and fail-closed missing-symbol behavior.
- [x] Nineteen direct `LUC-2750` relation rows exist in `docs/architecture/relations/priority-test-links.csv`.
- [x] Relation readback and architecture graph generation pass.
- [x] Repository guardrails pass.

## Forbidden
- Production/protected readback execution.
- Secret values in repo, logs, generated artifacts, or issue comments.
- Deploy, push, restart, rollback, account, exchange, database, or live-trading mutation.
- Temporary bypasses or parallel collector implementation.

## Validation Evidence
- Tests:
  - `node --check scripts/collectLiveImportReadbackEvidence.mjs` PASS.
  - `node --check scripts/collectLiveImportReadbackEvidence.test.mjs` PASS.
  - `node --test scripts/collectLiveImportReadbackEvidence.test.mjs` PASS (`7/7`).
  - `node scripts/collectLiveImportReadbackEvidence.mjs --help` PASS.
- Manual checks:
  - `rg -n "LUC-2750" docs/architecture/relations/priority-test-links.csv` PASS (`19` rows).
- Architecture/logs:
  - `pnpm run architecture:graph:generate` PASS (`653` nodes / `842` relations / `27` chains).
  - `pnpm run quality:guardrails` PASS.
- High-risk checks:
  - No protected production readback, deploy, push, restart, rollback, account, secret, exchange, database, or live-trading action occurred.
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
- Follow-up architecture doc updates: yes, parent TSA/PM should refresh full architecture-awareness because `docs/status/architecture-awareness-report.md` remains the pre-fix `2026-06-07T09:34:54.277Z` snapshot until the awareness index is regenerated.

## Deployment / Ops Evidence
- Deploy impact: none.
- Env or secret changes: none.
- Health-check impact: none.
- Smoke steps updated: no.
- Rollback note: revert `scripts/collectLiveImportReadbackEvidence.mjs`, `scripts/collectLiveImportReadbackEvidence.test.mjs`, and the `LUC-2750` relation rows if needed.
- Observability or alerting impact: none.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issue heartbeat context confirmed [LUC-2750](/LUC/issues/LUC-2750) scope and exact anchors.
- Existing script was CLI-only and ran `main()` at import time, preventing focused helper imports.
- Existing relation CSV had older aggregate [LUC-2198](/LUC/issues/LUC-2198) relation only, not direct current `LUC-2750` function anchors.

### 2. Select One Priority Mission Objective
- Selected `scripts/collectLiveImportReadbackEvidence.mjs` local proof and relation repair because it was the assigned critical issue and current top missing-test family.

### 3. Plan Implementation
- Export current helper functions.
- Add injectable seams for args, env, stdout, fetch, auth resolution, file writing, deterministic time, and help handling.
- Preserve direct CLI behavior.
- Add focused tests and nineteen relation rows.

### 4. Execute Implementation
- Made `scripts/collectLiveImportReadbackEvidence.mjs` import-safe.
- Added direct helper exports and injectable `main`.
- Added `scripts/collectLiveImportReadbackEvidence.test.mjs`.
- Added nineteen `LUC-2750` rows to `docs/architecture/relations/priority-test-links.csv`.

### 5. Verify and Test
- All focused syntax, unit, CLI-help, relation readback, graph, and guardrail checks passed.

### 6. Self-Review
- Existing collector logic was reused; no parallel implementation was introduced.
- Behavior change is limited to import-safe exports and injectable local test seams.
- Direct CLI execution remains available through the `fileURLToPath(import.meta.url)` guard.
- Tests use local HTTP fixtures and injected fake auth only; no protected runtime success is fabricated.

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
