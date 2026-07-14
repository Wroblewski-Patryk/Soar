# LUC-1032 resolveOpsAuthToken and runControlledLiveSessionProof runtime proof refresh

## Header
- ID: LUC-1032
- Title: [Soar][Account access][Runtime Proof] Refresh local proof for resolveOpsAuthToken and runControlledLiveSessionProof
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Runtime & Adapter Engineer
- Depends on: none
- Priority: P0
- Module Confidence Rows: Account access / Runtime ops auth token resolution proof; Account access / Runtime controlled live session proof runner proof
- Requirement Rows: not applicable; local proof refresh only
- Quality Scenario Rows: not applicable; no runtime behavior change
- Risk Rows: project-truth drift for account-access runtime proof rows
- Iteration: 2026-07-14 heartbeat
- Operation Mode: BUILDER
- Mission ID: LUC-1032-RUNTIME-PROOF-REFRESH-2026-07-14
- Mission Status: VERIFIED

## Context
[LUC-1032](/LUC/issues/LUC-1032) targeted two Account access script-level
`implemented_needs_proof` rows still present in generated truth:
`scripts/resolveOpsAuthToken.mjs` and
`scripts/runControlledLiveSessionProof.mjs`. Focused tests already existed for
both scripts, but generated proof metadata still lacked direct feature-level
relations and scoped scanner evidence.

## Goal
Close the local proof-routing gaps for `scripts/resolveOpsAuthToken.mjs` and
`scripts/runControlledLiveSessionProof.mjs` without changing runtime behavior.

## Constraints
- Reuse existing focused tests and truth-generation systems.
- No production account mutation, secret mutation, deploy, migration, or live
  trading action.
- Keep scope limited to proof metadata, focused verification, and state sync.

## Definition of Done
- Both script feature rows are no longer routed as `implemented_needs_proof` in
  generated truth.
- Direct feature-level relations exist in
  `docs/architecture/relations/priority-test-links.csv`.
- `docs/architecture/scanner-overrides.json` contains scoped evidence-backed
  overrides for both script entities.
- Focused tests and truth generators pass.
- Task/evidence packet and source-of-truth notes are updated.

## Forbidden
- No runtime logic changes.
- No opportunistic cleanup outside the two scoped proof rows.
- No deploy, restart, rollback, or external account/session mutation.

## Scope
- `docs/architecture/relations/priority-test-links.csv`
- `docs/architecture/scanner-overrides.json`
- `history/tasks/luc-1032-runtime-proof-refresh-2026-07-14-task.md`
- `history/evidence/luc-1032-runtime-proof-refresh-2026-07-14.md`
- `.codex/context/PROJECT_STATE.md`
- `.codex/context/TASK_BOARD.md`
- `.agents/state/module-confidence-ledger.md`
- generated truth artifacts refreshed by the standard project scripts

## Implementation Plan
1. Confirm the exact feature-level truth gaps and existing focused test assets.
2. Add direct feature-level test-link rows for both scripts.
3. Add scoped scanner overrides pointing to the existing tests and new evidence
   packet.
4. Run the smallest sufficient local verification and regenerate generated
   truth.
5. Read back the generated status and sync project state/context.

## Acceptance Criteria
- [x] `priority-test-links.csv` contains a direct row from
      `scripts/resolveOpsAuthToken.mjs` to
      `scripts/resolveOpsAuthToken.test.mjs`.
- [x] `priority-test-links.csv` contains a direct row from
      `scripts/runControlledLiveSessionProof.mjs` to
      `scripts/runControlledLiveSessionProof.test.mjs`.
- [x] Focused proof for both scripts passes locally.
- [x] Generated app-completion count drops by two
      `implementedNeedsProof` rows.
- [x] Generated project truth no longer reports these two script features as
      `implemented_needs_proof`.

## Validation Evidence
- Syntax:
  `node --check scripts/resolveOpsAuthToken.mjs` -> PASS.
- Syntax:
  `node --check scripts/runControlledLiveSessionProof.mjs` -> PASS.
- Focused proof:
  `node --test scripts/resolveOpsAuthToken.test.mjs scripts/runControlledLiveSessionProof.test.mjs`
  -> PASS (`34` tests).
- CLI smoke:
  `node scripts/runControlledLiveSessionProof.mjs --help` -> PASS.
- Architecture graph:
  `pnpm run architecture:graph:generate` -> PASS (`656` nodes / `842`
  relations / `27` chains).
- Architecture awareness:
  `build-architecture-awareness-index.mjs` -> PASS (`10937` entities /
  `36176` relations / `entityOverridesApplied=40` /
  `relationOverridesApplied=39`).
- App completion:
  `build-app-completion-index.mjs` -> PASS (`implementedNeedsProof=111`, down
  from `113`).
- Project truth:
  `build-project-truth-indexes.mjs --apply` -> PASS; the first Account access
  gap advances to
  `apps/api/src/modules/bots/runtimeSessionOpenOrdersReadModel.service.ts#resolveRuntimeTakeoverStatus`
  as `missing_doc_link`.
- Diff hygiene:
  `git diff --check` -> line-ending warnings only; no content errors.

## Architecture Evidence
- Architecture source reviewed:
  `docs/architecture/relations/priority-test-links.csv`,
  `docs/architecture/scanner-overrides.json`,
  `docs/status/project-truth-index.json`,
  `docs/status/app-completion-index.json`.
- Fits approved architecture: yes; this work only repairs traceability and
  verification metadata inside approved generator pipelines.
- Mismatch discovered: no.
- Decision required from user: no.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Both script files had focused local tests already present.
- Function-level truth was mainly blocked by `missing_doc_link`, but the
  feature-level script entities still routed as `implemented_needs_proof`.

### 2. Select One Priority Mission Objective
- Close the two assigned script-level proof rows for Account access runtime
  proof refresh.

### 3. Plan Implementation
- Add direct feature-level relation rows, add scoped overrides, rerun focused
  proof, regenerate truth, and read back results.

### 4. Execute Implementation
- Added direct feature-level CSV rows for both scripts.
- Added scoped scanner overrides promoting both script entities to `verified`
  with test and evidence references.

### 5. Verify and Test
- Focused Node proof passed.
- Architecture awareness, app completion, and project truth generators passed.
- Generated readback confirms both feature-level proof rows are closed.

### 6. Self-Review
- Existing systems reused: focused Node tests, scanner overrides, relation CSV,
  and standard generators.
- No workaround, duplicate runtime logic, or behavioral drift introduced.

### 7. Update Documentation and Knowledge
- Added this task file, paired evidence file, and synced project state/context.
- Learning journal update not required; no new recurring pitfall was confirmed.

## Review Checklist
- [x] Process self-audit completed before implementation.
- [x] One bounded mission objective completed in this heartbeat.
- [x] Current stage is declared and respected.
- [x] Architecture alignment confirmed.
- [x] Existing systems were reused.
- [x] No workaround paths were introduced.
- [x] No logic duplication was introduced.
- [x] Definition of Done evidence is attached.
- [x] Relevant validation was run.
- [x] Docs/context were updated.

## Result Report
- Task summary:
  closed the local proof-routing gaps for `resolveOpsAuthToken` and
  `runControlledLiveSessionProof` by wiring existing focused tests into the
  generator-readable traceability path.
- Files changed:
  `docs/architecture/relations/priority-test-links.csv`,
  `docs/architecture/scanner-overrides.json`,
  this task file, the paired evidence file, and project state/context files.
- How tested:
  focused Node proof, CLI help smoke, architecture graph generation,
  architecture-awareness refresh, app-completion refresh, and project-truth
  refresh.
- What is incomplete:
  function-level `missing_doc_link` follow-up remains for adjacent rows; this
  issue does not solve docs-owned gaps.
- Next steps:
  route the new first Account access docs gap
  `resolveRuntimeTakeoverStatus` to Docs Memory Lead + Project Manager.
- Decisions made:
  classify LUC-1032 as local proof-metadata closure only, not runtime behavior
  or release-readiness expansion.
