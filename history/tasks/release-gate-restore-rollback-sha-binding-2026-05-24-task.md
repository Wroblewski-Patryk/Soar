# RELEASE-GATE-RESTORE-ROLLBACK-SHA-BINDING-2026-05-24 Task Packet

## Context

The release gate already bound activation, LIVEIMPORT, and UI clickthrough
evidence to `--expected-sha` when those artifacts can carry deployment
identity. Backup/restore and rollback proof generators did not yet write
candidate SHA metadata, and they wrote reports under `history/operations`
instead of the canonical release evidence buckets consumed by the gate.

## Goal

Make future restore and rollback proof artifacts candidate-aware and store them
in the canonical history buckets that release evidence readiness reads.

## Constraints

- Do not execute protected restore or rollback production proof without
  approved context.
- Do not weaken status/date checks.
- Keep `--expected-sha` optional for legacy/local workflows.
- Do not expose secret values.

## Definition of Done

- Restore drill evidence supports optional `--expected-sha`.
- Rollback proof evidence supports optional `--expected-sha`.
- Markdown reports include the expected SHA value or `not provided`.
- JSON payloads include `expectedSha`.
- New restore/rollback reports go to `history/evidence`; raw JSON artifacts go
  to `history/artifacts`.
- Release gate rejects fresh restore/rollback proof with a mismatched SHA when
  `--expected-sha` is provided.

## Result Report

Status: `implemented, partially verified`

Files changed:

- `scripts/runRestoreDrillEvidence.mjs`
- `scripts/runRollbackProofEvidence.mjs`
- `scripts/runV1ReleaseGate.mjs`
- `scripts/runV1ReleaseGate.test.mjs`
- `scripts/runV1FinalPreflight.mjs`

Evidence:

- `node --check scripts/runRestoreDrillEvidence.mjs; node --check scripts/runRollbackProofEvidence.mjs; node --check scripts/runV1ReleaseGate.mjs; node --check scripts/runV1FinalPreflight.mjs` passed.
- `node --test scripts/runV1ReleaseGate.test.mjs scripts/runV1FinalPreflight.test.mjs` passed `30/30`.
- `corepack pnpm run ops:release:v1:preflight -- --web-base-url https://soar.luckysparrow.ch --api-base-url https://api.soar.luckysparrow.ch --expected-sha 380308d10cf0fabb2ea629eb55e6f0ba7d980ed1 --json-output history/artifacts/v1-preflight-production-restore-rollback-sha-binding-2026-05-24.json --markdown-output history/releases/v1-preflight-production-restore-rollback-sha-binding-2026-05-24.md` passed build-info and public smoke, then remained blocked on protected prerequisites plus failed/stale evidence.

Residual risk:

- Existing restore/rollback artifacts from 2026-05-23 remain stale and do not
  prove the current candidate. This task only prepares future proof artifacts
  to be candidate-bound.
