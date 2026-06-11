# LUC-2878 Controlled Live Proof printUsage Missing-Test Link

## Header
- ID: LUC-2878
- Title: Controlled live proof printUsage missing-test link
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: QA/Test
- Priority: P1
- Module Confidence Rows: controlled LIVE proof tooling; Architecture Evidence Graph relation confidence
- Mission ID: LUC-2878-CONTROLLED-LIVE-PROOF-PRINTUSAGE-MISSING-TEST-LINK-2026-06-07
- Mission Status: VERIFIED

## Context
[LUC-2878](/LUC/issues/LUC-2878) was created from [LUC-2875](/LUC/issues/LUC-2875) to cover or classify the actionable architecture-awareness missing-test link for `scripts/runControlledLiveSessionProof.mjs#printUsage`.

## Goal
Prove `printUsage` with a local deterministic test and add a scanner-readable test relation so the architecture-awareness report no longer treats the helper as missing test coverage.

## Scope
- `scripts/runControlledLiveSessionProof.test.mjs`
- `docs/architecture/relations/priority-test-links.csv`
- generated architecture graph and awareness exports
- project state/evidence files

## Implementation Plan
1. Import `printUsage` into the existing focused test file.
2. Add an injected-stdout test that checks usage header, safety warning, live-risk flag, dry-run flag, and env hints.
3. Add one direct `LUC-2878` relation row for `scripts/runControlledLiveSessionProof.mjs#printUsage`.
4. Run focused syntax/test/proof commands and architecture-awareness refresh.
5. Update task/state evidence and close the issue with verified local proof.

## Constraints
- No controlled LIVE proof.
- No `--i-understand-live-risk`.
- No production auth, protected smoke, bot activation/deactivation, order, position, exchange, database, deploy, push, restart, rollback, secret, account, or live-trading mutation.
- Preserve existing direct CLI behavior.
- Do not refactor unrelated controlled LIVE proof helpers.

## Acceptance Criteria
- `printUsage` has a direct local test.
- `priority-test-links.csv` has exactly one `LUC-2878` row for `scripts/runControlledLiveSessionProof.mjs#printUsage`.
- Focused Node test passes.
- Architecture graph and awareness refresh pass.
- Refreshed awareness report no longer lists `scripts/runControlledLiveSessionProof.mjs#printUsage`.

## Definition of Done
- [x] Local deterministic test added.
- [x] Scanner-readable relation added.
- [x] Focused validation passed.
- [x] Architecture-awareness proof refreshed.
- [x] State/evidence packet updated.

## Validation Evidence
- `node --check scripts/runControlledLiveSessionProof.mjs` PASS.
- `node --check scripts/runControlledLiveSessionProof.test.mjs` PASS.
- `node scripts/runControlledLiveSessionProof.mjs --help` PASS.
- Direct relation readback PASS (`1` row).
- `node --test scripts/runControlledLiveSessionProof.test.mjs` PASS (`19/19`).
- `pnpm run architecture:graph:generate` PASS (`653` nodes / `842` relations / `27` chains).
- `node scripts/build-architecture-awareness-index.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar` from `C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse` PASS (`15012` entities / `34320` relations / `9720` files).
- Refreshed `docs/status/architecture-awareness-report.md` generated `2026-06-07T16:44:48.491Z`, actionable missing-test links `258`, and no `scripts/runControlledLiveSessionProof.mjs#printUsage` entry.
- `pnpm run quality:guardrails` PASS.

## Architecture Evidence
- Architecture source reviewed: `docs/architecture/relations/priority-test-links.csv`, `docs/status/architecture-awareness-report.md`.
- Fits approved architecture: yes.
- Mismatch discovered: no.
- Decision required from user: no.
- Follow-up architecture doc updates: generated graph/awareness exports refreshed by validation commands.

## Security / Privacy Evidence
- Data classification: local test/evidence only.
- Secret handling: no secret values read or stored.
- Trust boundaries: no production auth, protected endpoints, exchange APIs, bot activation, or live-trading path executed.
- Fail-closed behavior: safe CLI `--help` path and injected `printUsage` proof require no auth/network.
- Residual risk: remaining controlled live proof helper missing-test links are separate anchors (`redactBot`, `resolveBuildInfo`, `runCollector`, `runSimultaneousRuntimeReadback`, `sleep`, `updateBotActiveState`, `waitForRunningSession`).

## Result Report
- Task summary: added direct `printUsage` coverage and a `LUC-2878` architecture relation.
- Files changed:
  - `scripts/runControlledLiveSessionProof.test.mjs`
  - `docs/architecture/relations/priority-test-links.csv`
  - generated architecture-awareness/graph outputs
  - state/evidence files
- How tested: see Validation Evidence.
- What is incomplete: no production or controlled LIVE proof was run or claimed.
- Next steps: continue the remaining architecture-awareness missing-test queue through separate owner-scoped issues.
