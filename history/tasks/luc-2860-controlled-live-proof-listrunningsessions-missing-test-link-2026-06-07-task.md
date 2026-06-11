# Task

## Header
- ID: LUC-2860
- Title: Controlled live proof listRunningSessions missing-test link
- Task Type: test
- Current Stage: verification
- Status: DONE
- Owner: QA/Test
- Priority: P0
- Module Confidence Rows: controlled LIVE proof tooling; Architecture Evidence Graph relation confidence
- Requirement Rows: not applicable; local traceability repair only
- Quality Scenario Rows: local release-tooling regression confidence
- Risk Rows: protected LIVE proof boundary preserved
- Iteration: 2026-06-07
- Operation Mode: TESTER
- Mission ID: LUC-2860-CONTROLLED-LIVE-PROOF-LISTRUNNINGSESSIONS-MISSING-TEST-LINK-2026-06-07
- Mission Status: VERIFIED

## Context
[LUC-2860](/LUC/issues/LUC-2860) was assigned as a Test Automation child from [LUC-2857](/LUC/issues/LUC-2857). The wake payload had no pending comments and `fallbackFetchNeeded=false`; checkout was already claimed by the harness and was not repeated. Prior child [LUC-2847](/LUC/issues/LUC-2847) closed `hashId`; the refreshed architecture-awareness report then exposed `scripts/runControlledLiveSessionProof.mjs#listRunningSessions` as the next controlled LIVE proof helper missing a direct test link.

## Goal
Add local-only proof and scanner-readable architecture relation evidence for `scripts/runControlledLiveSessionProof.mjs#listRunningSessions` without running a controlled LIVE proof or touching production state.

## Scope
- `scripts/runControlledLiveSessionProof.mjs`
- `scripts/runControlledLiveSessionProof.test.mjs`
- `docs/architecture/relations/priority-test-links.csv`
- generated architecture graph and architecture-awareness exports under `docs/graphs/` and `docs/status/`
- project state/evidence files

## Implementation Plan
1. Export the existing `listRunningSessions` helper for focused local proof.
2. Add fake-fetch `node:test` coverage for the bounded `RUNNING&limit=1` runtime-session endpoint and fail-closed non-array payload handling.
3. Add a scanner-readable `LUC-2860` priority test relation row.
4. Run syntax checks, safe CLI help, focused tests, relation readback, architecture graph generation, Softwarehouse architecture-awareness refresh, and guardrails.
5. Update source-of-truth state and close the Paperclip issue with evidence.

## Acceptance Criteria
- `listRunningSessions` has direct local test coverage.
- `priority-test-links.csv` contains exactly one `LUC-2860` relation for the helper.
- Refreshed architecture-awareness report no longer contains `listRunningSessions` in Top Actionable Missing Test Links.
- No LIVE activation, protected smoke, secret, account, exchange, order, position, database, deploy, push, restart, rollback, or live-trading mutation occurs.

## Definition of Done
- [x] Local helper proof exists and passes.
- [x] Scanner-readable relation row exists and is visible to the architecture-awareness exporter.
- [x] Relevant generated architecture evidence and project state are refreshed.
- [x] Paperclip issue can be marked `done` with command evidence.

## Validation Evidence
- `node --check scripts/runControlledLiveSessionProof.mjs` PASS.
- `node --check scripts/runControlledLiveSessionProof.test.mjs` PASS.
- `node scripts/runControlledLiveSessionProof.mjs --help` PASS.
- `node --test scripts/runControlledLiveSessionProof.test.mjs` PASS (`16/16`).
- Direct relation readback PASS (`1` row).
- `pnpm run architecture:graph:generate` PASS (`653` nodes / `842` relations / `27` chains).
- `node C:\Personal\Projekty\Aplikacje\Paperclip_Softwarehouse\scripts\build-architecture-awareness-index.mjs --project Soar --root C:\Personal\Projekty\Aplikacje\Soar` PASS (`14988` entities / `34178` relations / `9708` files).
- `docs/status/architecture-awareness-report.md` generated `2026-06-07T15:35:25.877Z`; actionable missing-test links are `293`; `listRunningSessions` is absent from Top Actionable Missing Test Links.
- `pnpm run quality:guardrails` PASS.
- Reality status: verified.

## Architecture Evidence
- Architecture source reviewed: `docs/architecture/relations/priority-test-links.csv`, `docs/status/architecture-awareness-report.md`.
- Fits approved architecture: yes.
- Mismatch discovered: no.
- Decision required from user: no.
- Follow-up architecture doc updates: generated graph and awareness exports refreshed.

## Security / Privacy Evidence
- Data classification: local-only test doubles and metadata; no secret values.
- Trust boundaries: production controlled LIVE proof remains gated and was not invoked.
- Secret handling: no credential values read, stored, printed, or used.
- Fail-closed behavior: non-array runtime-session payload rejects instead of being treated as proof.
- Residual risk: production LIVEIMPORT/readback proof remains outside this local relation repair.

## Result Report
- Task summary: exported `listRunningSessions`, added direct fake-fetch tests for the runtime-session readback helper, and added a scanner-readable `LUC-2860` test relation.
- Files changed: `scripts/runControlledLiveSessionProof.mjs`, `scripts/runControlledLiveSessionProof.test.mjs`, `docs/architecture/relations/priority-test-links.csv`, generated architecture evidence, and state/evidence files.
- How tested: syntax checks, safe help, focused Node suite, relation readback, graph generation, architecture-awareness refresh, and guardrails.
- What is incomplete: broader generated journey-index helper gaps remain separate existing queue work; no production controlled LIVE proof was attempted.
- Next steps: parent queue can select the next non-duplicate actionable missing-test family from the refreshed report, currently generated function/user-action index helpers already deduped to existing blocked lanes.
- Decisions made: this was safe to implement directly as a single-lane Test Automation repair because it only exports an existing helper for local tests and does not change runtime behavior.
