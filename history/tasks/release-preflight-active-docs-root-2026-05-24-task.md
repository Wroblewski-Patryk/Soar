# RELEASE-PREFLIGHT-ACTIVE-DOCS-ROOT-2026-05-24 Task Packet

## Context

The production readiness mission had a false release-evidence signal after the
current documentation tree moved from `docs/operations` to `docs/operations`.
Several V1 release and RC helper scripts still used hard-coded
`docs/operations` defaults, so preflight reported current RC artifacts as
missing instead of reading the active operations docs.

## Goal

Make V1 release/preflight tooling resolve the active operations documentation
root without changing gate semantics, protected prerequisite rules, or runtime
behavior.

## Constraints

- Keep the change scoped to release/RC tooling path resolution.
- Do not weaken evidence freshness, pass/fail, or protected-auth requirements.
- Do not expose or require secret values.
- Do not run LIVE exchange mutation or protected production journeys.

## Implementation Plan

1. Add active docs-root resolution to V1 release/preflight and RC helper
   scripts.
2. Preserve test isolation by letting `evaluateEvidenceReadiness` receive an
   explicit current operations directory, defaulting to the supplied evidence
   directory for unit tests.
3. Re-run release/preflight tests and a no-secret production preflight.
4. Update mission state with the corrected evidence interpretation.

## Acceptance Criteria

- Release scripts read `docs/operations` when `docs/operations` is not
  present.
- Existing unit tests still pass.
- No-secret production preflight detects RC artifacts as stale rather than
  missing.
- Remaining blockers are explicit protected inputs or real missing/stale
  evidence.

## Result Report

Status: `implemented, partially verified`

Files changed:

- `scripts/runV1ReleaseGate.mjs`
- `scripts/runV1FinalPreflight.mjs`
- `scripts/buildRcExternalGateStatus.mjs`
- `scripts/buildRcSignoffRecord.mjs`
- `scripts/checkRcExternalGateEvidence.mjs`
- `scripts/summarizeRcGates.mjs`
- `scripts/syncRcChecklistFromGateStatus.mjs`

Evidence:

- `node --check` passed for all touched release/RC scripts.
- `node --test scripts/runV1ReleaseGate.test.mjs scripts/runV1FinalPreflight.test.mjs` passed `27/27`.
- `corepack pnpm run ops:release:v1:preflight -- --web-base-url https://soar.luckysparrow.ch --api-base-url https://api.soar.luckysparrow.ch --expected-sha 380308d10cf0fabb2ea629eb55e6f0ba7d980ed1 --json-output history/artifacts/v1-preflight-production-active-docs-rerun-2026-05-24.json --markdown-output history/releases/v1-preflight-production-active-docs-rerun-2026-05-24.md` passed build-info and public smoke, then correctly blocked on protected prerequisites and release evidence.

Residual risk:

- The task does not refresh RC sign-off/checklist dates and does not create
  activation, liveimport, UI clickthrough, backup/restore, or rollback proof.
  Those remain gated by protected auth/context and operator-approved evidence
  collection.
