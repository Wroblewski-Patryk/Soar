# RELEASE-GATE-ACTIVATION-STATUS-HARDENING-2026-05-24 Task Packet

## Context

After the release/preflight tooling started resolving the active operations docs
root correctly, the remaining evidence families exposed another release-safety
gap: activation audit and activation plan artifacts were accepted by filename
and freshness alone. That made it possible for a current but blocked or empty
activation document to satisfy the release gate.

## Goal

Require activation audit and activation plan artifacts to explicitly report an
activation status of `READY` or `PASS` before they count as fresh release
evidence.

## Constraints

- Do not relax any existing release evidence checks.
- Do not create synthetic activation approval for the current production
  candidate.
- Do not run protected production journeys or LIVE exchange mutation.
- Keep the change scoped to release gate evidence semantics and tests.

## Definition of Done

- Fresh activation artifacts without a ready/pass status are rejected.
- Existing positive and negative release evidence tests still pass.
- Production preflight still blocks truthfully on protected prerequisites and
  real missing/stale evidence.

## Result Report

Status: `implemented, partially verified`

Files changed:

- `scripts/runV1ReleaseGate.mjs`
- `scripts/runV1ReleaseGate.test.mjs`

Implementation:

- Added `passPattern` checks for `activationAudit` and `activationPlan`.
- Added a regression test proving fresh `BLOCKED` activation artifacts fail
  closed.
- Updated existing release evidence fixtures to include explicit
  `Status: **READY**`.

Evidence:

- `node --check scripts/runV1ReleaseGate.mjs; node --check scripts/runV1ReleaseGate.test.mjs` passed.
- `node --test scripts/runV1ReleaseGate.test.mjs scripts/runV1FinalPreflight.test.mjs` passed `28/28`.
- `corepack pnpm run ops:release:v1:preflight -- --web-base-url https://soar.luckysparrow.ch --api-base-url https://api.soar.luckysparrow.ch --expected-sha 380308d10cf0fabb2ea629eb55e6f0ba7d980ed1 --json-output history/artifacts/v1-preflight-production-activation-status-gate-2026-05-24.json --markdown-output history/releases/v1-preflight-production-activation-status-gate-2026-05-24.md` passed build-info and public smoke, then remained blocked on protected prerequisites and true missing/stale release evidence.

Residual risk:

- This hardening does not create the missing 2026-05-24 activation audit/plan.
  Those should only be created as `READY` after the protected proof set is
  actually refreshed for the current production candidate.
