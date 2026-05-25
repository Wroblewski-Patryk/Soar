# OPERATOR-UNBLOCK-DEFAULT-CURRENT-PACKET-2026-05-24

## Context

The active production candidate is
`380308d10cf0fabb2ea629eb55e6f0ba7d980ed1`, and the current no-secret
operator unblock packet lives at
`history/artifacts/v1-operator-unblock-packet-380308d1-2026-05-24.json`.
The `ops:operator-unblock:check` CLI still defaulted to the older
`dd1a1faf` packet, so aggregate validation could pass while checking a stale
operator handoff unless the packet path was passed explicitly.

## Goal

Make the operator unblock validator select the latest dated packet by default,
while still allowing explicit `--packet` overrides.

## Constraints

- Keep validation no-secret.
- Do not infer release readiness from public smoke.
- Do not mutate production data or LIVE exchange state.
- Preserve explicit packet-path overrides for historical validation.

## Definition Of Done

- Default CLI packet selection picks the latest dated
  `v1-operator-unblock-packet-*.json` from `history/artifacts`.
- Tests prove latest-packet selection and fail-closed behavior when no packet
  exists.
- Current default validation checks the `380308d1` packet.
- Aggregate audit validation still passes.

## Forbidden

- Do not hardcode the current SHA as the new permanent default.
- Do not ignore packet evidence mismatches.
- Do not downgrade `NO-GO` status.

## Result Report

Status: **VERIFIED LOCAL**

Changed:

- `scripts/checkOperatorUnblockPacket.mjs`
- `scripts/checkOperatorUnblockPacket.test.mjs`

Validation:

- `node --check scripts/checkOperatorUnblockPacket.mjs scripts/checkOperatorUnblockPacket.test.mjs`
  => `PASS`
- `corepack pnpm run ops:operator-unblock:check:test` => `9/9 PASS`
- `corepack pnpm run ops:operator-unblock:check -- --json`
  => `PASS`, selected packet
  `history/artifacts/v1-operator-unblock-packet-380308d1-2026-05-24.json`
- `corepack pnpm run audit:manifest:verify` => `PASS`
- `node --test scripts/runV1ReleaseGate.test.mjs scripts/runV1FinalPreflight.test.mjs scripts/checkOperatorUnblockPacket.test.mjs`
  => `40/40 PASS`

Residual Risk:

- Full V1 readiness remains `NO-GO` until protected inputs and same-date
  protected evidence are available for the deployed target.
