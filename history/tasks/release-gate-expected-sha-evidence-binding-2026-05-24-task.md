# RELEASE-GATE-EXPECTED-SHA-EVIDENCE-BINDING-2026-05-24 Task Packet

## Context

The production preflight already checked Web build-info against the expected
deployment SHA, but several protected evidence artifacts could still be accepted
by date and content alone. For candidate-based release proof, artifacts that can
carry deployment identity must be tied to the expected SHA.

## Goal

Require activation audit, activation plan, LIVEIMPORT readback, and production
UI clickthrough evidence to include the expected deployment SHA when the release
gate/preflight is run with `--expected-sha`.

## Constraints

- Do not require SHA text for evidence families that currently do not carry it
  in their artifact contract.
- Do not weaken date freshness or content pass checks.
- Do not create ready protected evidence without approved auth/context.
- Do not expose secret values.

## Definition of Done

- Fresh activation artifacts for a different SHA fail closed.
- Release/preflight tests cover SHA mismatch.
- Production preflight for `380308d1` still passes build-info/public smoke and
  remains blocked on protected proof.

## Result Report

Status: `implemented, partially verified`

Files changed:

- `scripts/runV1ReleaseGate.mjs`
- `scripts/runV1ReleaseGate.test.mjs`
- `scripts/runV1FinalPreflight.mjs`

Implementation:

- Added expected-SHA content binding for evidence families that safely carry
  deployment identity:
  - activation audit
  - activation plan
  - `LIVEIMPORT-03` readback
  - production UI clickthrough
- Passed `expectedSha` from the V1 final preflight into release evidence
  readiness.
- Added a regression test for fresh activation artifacts tied to a different
  SHA.

Evidence:

- `node --test scripts/runV1ReleaseGate.test.mjs scripts/runV1FinalPreflight.test.mjs` passed `29/29`.
- First production preflight with SHA-binding wrote
  `history/releases/v1-preflight-production-expected-sha-evidence-2026-05-24.md`
  and observed a transient public `/ready` `503`.
- Follow-up public smoke passed API `/health`, API `/ready`, and Web `/`; five
  direct `/ready` reads returned `200`.
- Rerun production preflight wrote
  `history/releases/v1-preflight-production-expected-sha-evidence-rerun-2026-05-24.md`;
  build-info and public smoke passed, and the gate remained blocked on
  protected prerequisites plus stale/failed evidence.

Residual risk:

- Rollback and restore artifacts do not currently carry expected SHA in their
  documented artifact contract, so this task does not add SHA binding for those
  families.
