# LUC-2970 - Gap Register And Repair Lane Refresh (2026-06-08)

## Header
- ID: LUC-2970
- Title: Gap register and repair lane refresh
- Task Type: research
- Current Stage: verification
- Status: DONE
- Owner: Technical Solution Architect
- Priority: P0
- Module Confidence Rows: Architecture Evidence Graph / production proof helper traceability
- Requirement Rows: REQ-DOC-028 / REQ-DOC-031
- Risk Rows: protected production UI/UX proof helper conflation
- Operation Mode: ARCHITECT
- Mission ID: LUC-2970-GAP-REGISTER-AND-REPAIR-LANE-REFRESH-2026-06-08
- Mission Status: PARTIALLY_VERIFIED

## Context

Paperclip assigned [LUC-2970](/LUC/issues/LUC-2970) as a TSA heartbeat under the Soar V1 audit-to-completion loop. The current `docs/status/architecture-awareness-report.md` generated `2026-06-07T22:41:40.784Z` reports `159` actionable missing-test links, `0` actionable missing-doc links, `0` ownerless entities, and `0` disconnected entities.

Duplicate review found that [LUC-2957](/LUC/issues/LUC-2957) already added and verified local helper tests for `scripts/runProdUiModuleClickthroughAudit.mjs` and `scripts/runProdUxA11yMobileProof.mjs`, but the fresh report still listed those helpers because direct scanner-readable relation rows were missing for the covered anchors.

## Goal

Refresh the gap register by routing current missing-test findings to existing proof where possible, avoiding duplicate QA child issues, and repairing scanner-readable architecture relation rows for the helper anchors already covered by [LUC-2957](/LUC/issues/LUC-2957).

## Scope

- `docs/architecture/relations/priority-test-links.csv`
- `history/tasks/luc-2970-gap-register-and-repair-lane-refresh-2026-06-08-task.md`
- source-of-truth state files updated in this heartbeat

## Explicit Exclusions

- No production UI clickthrough, production UX/A11y proof, protected auth/session proof, account use, secret readback, deploy, push, restart, rollback, database mutation, exchange action, order, position, or live-trading mutation.
- No new duplicate QA child issue for helper coverage already completed by [LUC-2957](/LUC/issues/LUC-2957).
- No false relation rows for browser launch/navigation/screenshot side-effect helpers that were not locally unit-proved.

## Implementation Plan

1. Read Paperclip heartbeat context and current architecture-awareness report.
2. Dedupe top missing-test families against existing issues.
3. Verify [LUC-2957](/LUC/issues/LUC-2957) output and focused helper tests.
4. Add scanner-readable relation rows only for locally covered helpers.
5. Run direct relation readback, graph generation, guardrails, and focused tests.
6. Update source-of-truth state and close [LUC-2970](/LUC/issues/LUC-2970) with evidence.

## Acceptance Criteria

- [x] Current report metrics and duplicate ownership are recorded.
- [x] `priority-test-links.csv` contains direct rows for [LUC-2970](/LUC/issues/LUC-2970) covered helper anchors.
- [x] Focused local helper tests pass without protected production proof.
- [x] Architecture graph generation and repository guardrails pass.
- [x] Remaining risk is explicit.

## Validation Evidence

- Paperclip heartbeat-context readback for [LUC-2970](/LUC/issues/LUC-2970): PASS.
- Current report readback: generated `2026-06-07T22:41:40.784Z`, `159` actionable missing-test links, `0` actionable missing-doc links, `0` ownerless entities, `0` disconnected entities.
- [LUC-2957](/LUC/issues/LUC-2957) readback: DONE; focused helper proof command passed in its closure; architecture scanner refresh timed out there.
- `node --check scripts/runProdUiModuleClickthroughAudit.mjs; node --check scripts/runProdUxA11yMobileProof.mjs`: PASS.
- `node --test scripts/runProdUiModuleClickthroughAudit.test.mjs scripts/runProdUxA11yMobileProof.test.mjs`: PASS (`8/8`).
- Direct relation readback: PASS (`18` [LUC-2970](/LUC/issues/LUC-2970) rows).
- `pnpm run architecture:graph:generate`: PASS (`653` nodes / `842` relations / `27` chains).
- Full awareness refresh: BLOCKED in this checkout because `scripts/build-architecture-awareness-index.mjs` is absent.
- `pnpm run quality:guardrails`: PASS.

## Result Report

- Task summary: refreshed the gap register by deduping [LUC-2957](/LUC/issues/LUC-2957) helper coverage and adding direct scanner-readable architecture test-link rows for covered `runProdUiModuleClickthroughAudit` and safe `runProdUxA11yMobileProof` helpers.
- Files changed: `docs/architecture/relations/priority-test-links.csv`; this task packet; source-of-truth state files.
- How tested: focused Node helper tests, syntax checks, direct relation readback, graph generation, guardrails.
- What is incomplete: canonical `architecture-awareness-report.md` was not regenerated because the awareness builder script is absent in this checkout. Remaining top-list UX browser launch/navigation/screenshot helpers are intentionally not marked as locally unit-proved.
- Next steps: the next queue owner should run the available Softwarehouse architecture-awareness refresh and then continue with the next non-duplicate top missing-test family. Do not reopen `runProdUiModuleClickthroughAudit` helper coverage unless the refreshed report still lists anchors that are not covered by [LUC-2970](/LUC/issues/LUC-2970) relation rows or [LUC-2957](/LUC/issues/LUC-2957) tests.
