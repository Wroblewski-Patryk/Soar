# LUC-2886 Controlled Live Proof resolveBuildInfo Missing-Test Link

## Header
- ID: LUC-2886
- Title: Controlled live proof resolveBuildInfo missing-test link
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: QA/Test
- Priority: P1
- Module Confidence Rows: controlled LIVE proof tooling; Architecture Evidence Graph relation confidence
- Mission ID: LUC-2886-CONTROLLED-LIVE-PROOF-RESOLVEBUILDINFO-MISSING-TEST-LINK-2026-06-07
- Mission Status: VERIFIED

## Context
[LUC-2886](/LUC/issues/LUC-2886) was created from [LUC-2883](/LUC/issues/LUC-2883) to cover or classify the actionable architecture-awareness missing-test link for `scripts/runControlledLiveSessionProof.mjs#resolveBuildInfo`.

## Goal
Prove `resolveBuildInfo` with deterministic local tests and add a scanner-readable test relation so the architecture-awareness report no longer treats the helper as missing test coverage.

## Scope
- `scripts/runControlledLiveSessionProof.test.mjs`
- `docs/architecture/relations/priority-test-links.csv`
- generated architecture graph and awareness exports
- project state/evidence files

## Implementation Plan
1. Reuse the existing import-safe `resolveBuildInfo` export.
2. Add focused local coverage proving public build-info readback, expected SHA prefix matching, and mismatch reporting.
3. Add one direct `LUC-2886` relation row for `scripts/runControlledLiveSessionProof.mjs#resolveBuildInfo`.
4. Run focused syntax/test/proof commands and architecture-awareness refresh.
5. Update task/state evidence and close the issue with verified local proof.

## Constraints
- No controlled LIVE proof.
- No `--i-understand-live-risk`.
- No production auth, protected smoke, bot activation/deactivation, order, position, exchange, database, deploy, push, restart, rollback, secret, account, or live-trading mutation.
- Preserve existing direct CLI behavior.
- Do not refactor unrelated controlled LIVE proof helpers.

## Acceptance Criteria
- `resolveBuildInfo` has direct local test evidence.
- `priority-test-links.csv` has exactly one `LUC-2886` row for `scripts/runControlledLiveSessionProof.mjs#resolveBuildInfo`.
- Focused Node test passes.
- Architecture graph and awareness refresh pass.
- Refreshed awareness report no longer lists `scripts/runControlledLiveSessionProof.mjs#resolveBuildInfo` in Top Actionable Missing Test Links.

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
- `node --test scripts/runControlledLiveSessionProof.test.mjs` PASS (`22/22`).
- `pnpm run architecture:graph:generate` PASS (`653` nodes / `842` relations / `27` chains).
- `node scripts/build-architecture-awareness-index.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar` from `C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse` PASS (`15018` entities / `34345` relations / `9723` files).
- Refreshed `docs/status/architecture-awareness-report.md` generated `2026-06-07T17:04:43.730Z`, actionable missing-test links `256`, and no `scripts/runControlledLiveSessionProof.mjs#resolveBuildInfo` entry in Top Actionable Missing Test Links.
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
- Fail-closed behavior: `resolveBuildInfo` reports `matchesExpected=false` when public build-info does not match the requested SHA prefix; activation flow still throws before protected bot checks if the build-info helper reports mismatch.
- Residual risk: remaining controlled live proof helper missing-test links are separate anchors (`runCollector`, `runSimultaneousRuntimeReadback`, `sleep`, `updateBotActiveState`, `waitForRunningSession`).

## Result Report
- Task summary: added direct `resolveBuildInfo` coverage and a `LUC-2886` architecture relation.
- Files changed:
  - `scripts/runControlledLiveSessionProof.test.mjs`
  - `docs/architecture/relations/priority-test-links.csv`
  - generated architecture-awareness/graph outputs
  - state/evidence files
- How tested: see Validation Evidence.
- What is incomplete: no production or controlled LIVE proof was run or claimed.
- Next steps: parent queue can route the next non-duplicate anchor, currently `scripts/runControlledLiveSessionProof.mjs#runCollector`, through a separate owned lane if still release-critical.
