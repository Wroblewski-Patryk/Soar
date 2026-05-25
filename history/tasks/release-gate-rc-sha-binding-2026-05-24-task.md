# RELEASE-GATE-RC-SHA-BINDING-2026-05-24 Task Packet

## Context

The release evidence gate had candidate SHA binding for activation, liveimport,
UI clickthrough, restore, and rollback proof. RC current docs are also release
approval artifacts and must not be reusable across deployment candidates when
the gate is run with `--expected-sha`.

## Goal

Make RC external gate status, RC sign-off, and RC checklist artifacts
candidate-aware and require expected SHA binding for fresh RC evidence when an
expected SHA is provided.

## Constraints

- Do not mark stale RC evidence ready.
- Do not run protected production proof.
- Keep `--expected-sha` optional for legacy/local workflows.
- Do not expose secret values.

## Definition of Done

- RC status builder supports optional `--expected-sha`.
- RC sign-off builder supports optional `--expected-sha`.
- RC checklist sync supports optional `--expected-sha`.
- RC gate pipeline passes expected SHA into status/checklist and restore drill
  helpers.
- Release gate rejects fresh RC artifacts tied to a different expected SHA.

## Result Report

Status: `implemented, partially verified`

Files changed:

- `scripts/buildRcExternalGateStatus.mjs`
- `scripts/buildRcSignoffRecord.mjs`
- `scripts/syncRcChecklistFromGateStatus.mjs`
- `scripts/runLocalExternalGatesPipeline.mjs`
- `scripts/runV1ReleaseGate.mjs`
- `scripts/runV1ReleaseGate.test.mjs`
- `scripts/runV1FinalPreflight.mjs`

Evidence:

- `node --check` passed for the touched RC/release scripts.
- `node --test scripts/runV1ReleaseGate.test.mjs scripts/runV1FinalPreflight.test.mjs` passed `31/31`.
- `corepack pnpm run ops:release:v1:preflight -- --web-base-url https://soar.luckysparrow.ch --api-base-url https://api.soar.luckysparrow.ch --expected-sha 380308d10cf0fabb2ea629eb55e6f0ba7d980ed1 --json-output history/artifacts/v1-preflight-production-rc-pipeline-sha-binding-2026-05-24.json --markdown-output history/releases/v1-preflight-production-rc-pipeline-sha-binding-2026-05-24.md` passed build-info and public smoke, then remained blocked on protected prerequisites plus stale/failed release evidence.

Residual risk:

- Current RC artifacts remain stale for 2026-05-23. This task prepares future
  RC refreshes to be bound to the current deployment candidate.
