# Task

## Header
- ID: V1-PREFLIGHT-RELEASE-GATE-GRAPH-REFRESH-2026-05-24
- Title: Map V1 preflight and release gate runners into the architecture graph
- Task Type: documentation
- Current Stage: verification
- Status: DONE
- Owner: Ops/Release
- Priority: P1
- Module Confidence Rows: SOAR-OPERATIONS-001; ARCH-EVIDENCE-GRAPH-SYSTEM-2026-05-24
- Requirement Rows: REQ-DOC-029; REQ-FUNC-021
- Risk Rows: RISK-DOC-005; RISK-FULL-READINESS-2026-05-23
- Mission ID: SOAR-FULL-READINESS-COORDINATION-2026-05-23
- Mission Status: PARTIALLY_VERIFIED

## Context
The no-secret V1 production preflight is the current release truth gate for the deployed `380308d1` candidate. Public build-info and smoke pass, but the release remains blocked on protected inputs and stale/failed protected evidence. The preflight and release gate scripts were covered by tests but were not explicit architecture graph nodes.

## Goal
Refresh no-secret preflight evidence and make the V1 preflight/release gate runners first-class graph nodes linked to tests, operator packet validation, docs, and the release audit tooling chain.

## Scope
- `Soar - docs/architecture/registry/nodes.csv`
- `Soar - docs/architecture/registry/features.csv`
- `Soar - docs/architecture/registry/functions.csv`
- `Soar - docs/architecture/registry/tests.csv`
- `Soar - docs/architecture/registry/workflows.csv`
- `Soar - docs/architecture/relations/dependencies.csv`
- `Soar - docs/architecture/chains/chains.csv`
- generated architecture graph outputs
- `history/artifacts/v1-preflight-production-no-secret-refresh-2026-05-24.json`
- `history/releases/v1-preflight-production-no-secret-refresh-2026-05-24.md`
- state/context files

## Implementation Plan
1. Run no-secret V1 final preflight for the current deployed SHA.
2. Record the blocked status and exact blockers.
3. Add graph records for `scripts/runV1FinalPreflight.mjs` and `scripts/runV1ReleaseGate.mjs`.
4. Link those tools to release audit tooling, operator packet validation, tests, docs, and chain mapping.
5. Regenerate graph outputs and run validation.

## Acceptance Criteria
- No-secret preflight reports public build-info and public smoke status for the current SHA.
- Preflight/release gate scripts are present as graph nodes.
- The release audit tooling chain includes preflight and release gate runners.
- Graph generation, strict drift, and focused release tests pass.
- V1 remains `NO-GO` unless protected evidence exists.

## Definition of Done
- [x] No-secret preflight artifact refreshed.
- [x] Graph CSV source-of-truth updated.
- [x] Generated graph outputs refreshed.
- [x] Tests and guardrails run.
- [x] State files updated.

## Validation Evidence
- Tests:
  - `corepack pnpm run ops:release:v1:preflight -- --web-base-url https://soar.luckysparrow.ch --api-base-url https://api.soar.luckysparrow.ch --expected-sha 380308d10cf0fabb2ea629eb55e6f0ba7d980ed1 --json-output history/artifacts/v1-preflight-production-no-secret-refresh-2026-05-24.json --markdown-output history/releases/v1-preflight-production-no-secret-refresh-2026-05-24.md` returned blocked as expected after build-info PASS and public smoke PASS.
  - `corepack pnpm run architecture:graph:generate` PASS, `643` nodes, `798` relations, `27` chains.
  - `corepack pnpm run architecture:graph:drift:strict` PASS, `796/796` covered, `0` missing.
  - `node --test scripts/runV1FinalPreflight.test.mjs scripts/runV1ReleaseGate.test.mjs scripts/checkOperatorUnblockPacket.test.mjs` PASS, `40/40`.
  - `corepack pnpm run ops:operator-unblock:check` PASS and correctly keeps `Status NO-GO: yes`.
- Manual checks:
  - Environment name sweep found only `FIGMA_OAUTH_TOKEN`, no required protected release input names.
- Reality status: partially verified

## Result Report
- Task summary: The current V1 preflight/release gate decision path is now visible in the architecture evidence graph, and the latest no-secret preflight confirms public health while preserving protected blockers.
- Files changed: architecture graph CSVs/generated outputs, release artifacts, and state/context docs.
- How tested: graph generation, strict drift, focused release tests, operator packet check, no-secret preflight.
- What is incomplete: protected production app auth, rollback guard auth, admin/dashboard UI auth, DB restore context, current RC proof, LIVEIMPORT readback, UI clickthrough, restore drill, and rollback proof.
- Next steps: execute the operator unblock packet only after approved protected inputs and real approver context exist.
