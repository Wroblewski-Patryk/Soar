# LUC-2252 Repair Top Release/Ops Script Missing-Test Relations

## Header
- ID: LUC-2252
- Title: Repair top release/Ops script missing-test relations
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: QA/Test
- Priority: P1
- Mission ID: LUC-2252-RELEASE-OPS-SCRIPT-MISSING-TEST-RELATIONS-2026-06-05
- Mission Status: VERIFIED

## Context
Architecture-awareness report generated `2026-06-05T16:02:05.428Z` listed
top actionable missing-test rows for release/Ops scripts. The task required
scanner-readable test relations or explicit classification without running
protected production smoke, deploy, restart, environment mutation, or secret
readback.

## Goal
Repair direct test traceability for the named release/Ops scripts:

- `scripts/runProdUxA11yMobileProof.mjs`
- `scripts/runQaRepeatableSmokeE2e.mjs`
- `scripts/runRcRefreshSummaryStrict.mjs`
- `scripts/runRestoreDrillEvidence.mjs`
- `scripts/runRollbackProofEvidence.mjs`
- `scripts/runV1StaticIssueScan.mjs`
- `scripts/start-local-prod-like.mjs`
- `scripts/start-workers-prod.mjs`
- `scripts/summarizeRcGates.mjs`
- `scripts/syncRcChecklistFromGateStatus.mjs`
- `scripts/triageJourneyEvidence.mjs`
- `scripts/verifyLocalBackupRestore.mjs`
- `scripts/writeWebBuildMetadata.mjs`

## Scope
- Added focused static contract test:
  `scripts/releaseOpsScriptContracts.test.mjs`.
- Added direct scanner-readable rows in
  `docs/architecture/relations/priority-test-links.csv`.
- Refreshed architecture-awareness exports and architecture graph artifacts.

## Implementation Plan
1. Add a safe Node test that verifies package-script wiring and static command,
   safety, artifact, cleanup, and wrapper contracts without launching servers,
   workers, browsers, Docker, protected production checks, or smoke flows.
2. Link each named script to that test in `priority-test-links.csv`.
3. Run focused test, targeted relation readback, architecture-awareness
   refresh, report sample readback, graph generate, and strict graph drift.

## Acceptance Criteria
- Every named script has a direct `tests` relation or explicit classification.
- Focused script/test command passes.
- `pnpm run architecture:graph:generate` passes.
- `pnpm run architecture:graph:drift:strict` passes.
- Handoff reports files, commands, commit/push/deploy disposition, and
  residual risk.

## Definition of Done
- [x] Direct test relation rows added for all 13 target scripts.
- [x] Focused test proves local wrapper/package/safety contracts.
- [x] Architecture-awareness and graph checks pass.
- [x] Scope stayed local and non-mutating.

## Validation Evidence
- `node --test scripts/releaseOpsScriptContracts.test.mjs` -> PASS (`2/2`).
- Targeted relation readback -> PASS (`13` targets, `0` missing rows,
  `0` missing referenced files, `0` duplicate exact pairs).
- `node C:\Personal\Projekty\Aplikacje\Paperclip_Softwarehouse\scripts\build-architecture-awareness-index.mjs --project Soar --root C:\Personal\Projekty\Aplikacje\Soar`
  -> PASS (`14380` entities / `22584` relations), generated
  `2026-06-05T18:01:10.084Z`.
- Architecture-awareness report readback -> PASS:
  `actionableMissingTests=837`, `remainingInTopSample=[]` for all
  LUC-2252 target scripts.
- `pnpm run architecture:graph:generate` -> PASS (`651` nodes /
  `842` relations / `27` chains).
- `pnpm run architecture:graph:drift:strict` -> PASS (`827/827`,
  `0` missing).

## Architecture Evidence
- Architecture source reviewed:
  `docs/status/architecture-awareness-report.md`,
  `docs/architecture/relations/priority-test-links.csv`, and
  Softwarehouse `build-architecture-awareness-index.mjs`.
- Fits approved architecture: yes.
- Mismatch discovered: no.
- Decision required from user: no.
- Follow-up architecture doc updates: refreshed generated graph/status exports.

## Deployment / Ops Evidence
- Deploy impact: none.
- Env or secret changes: none.
- Health-check impact: none.
- Smoke steps updated: no.
- Rollback note: relation/test-only change; revert the test and CSV rows if
  needed.

## Security / Privacy Evidence
- Data classification: local source/test metadata only.
- Trust boundaries: protected production, secrets, browsers, Docker, deploy,
  database restore, and live-trading actions were excluded.
- Secret handling: no secret values read or printed.
- Fail-closed behavior: protected/prod scripts were statically checked only;
  no protected proof was claimed.

## Result Report
- Task summary: added focused release/Ops script contract coverage and direct
  scanner-readable test relations for all 13 named scripts.
- Files changed:
  - `scripts/releaseOpsScriptContracts.test.mjs`
  - `docs/architecture/relations/priority-test-links.csv`
  - refreshed generated architecture-awareness/graph outputs
  - this task record
- How tested: focused Node test, targeted relation readback, architecture
  awareness refresh, architecture graph generate, strict graph drift.
- What is incomplete: broader actionable missing-test rows remain
  (`837` after refresh); protected production proof collectors still require
  separate approved protected-input lanes.
- Next steps: none for LUC-2252.
- Decisions made: use a safe static contract test for launcher/wrapper scripts
  instead of starting long-running or protected release/Ops commands.
