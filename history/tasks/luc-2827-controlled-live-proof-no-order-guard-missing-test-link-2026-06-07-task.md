# LUC-2827 Controlled Live Proof No-Order Guard Missing-Test Link

## Header
- ID: LUC-2827-CONTROLLED-LIVE-PROOF-NO-ORDER-GUARD-MISSING-TEST-LINK-2026-06-07
- Title: Controlled live proof no-order guard missing-test link
- Task Type: test
- Current Stage: verification
- Status: DONE
- Owner: QA/Test
- Depends on: [LUC-2826](/LUC/issues/LUC-2826)
- Priority: P2
- Operation Mode: TESTER
- Mission ID: LUC-2827-CONTROLLED-LIVE-PROOF-NO-ORDER-GUARD-MISSING-TEST-LINK-2026-06-07
- Mission Status: VERIFIED

## Context
[LUC-2826](/LUC/issues/LUC-2826) selected
`scripts/runControlledLiveSessionProof.mjs#assertNoOrderGuardActive` as the
next non-duplicate Architecture Evidence Graph missing-test link after
excluding blocked generator-index and go-live smoke helper families.

## Goal
Cover the controlled LIVE proof no-order guard readiness check with local,
fake-fetch proof only, without running the protected controlled LIVE proof,
activating or deactivating bots, using production auth, or touching exchange
state.

## Scope
- `scripts/runControlledLiveSessionProof.mjs`
- `scripts/runControlledLiveSessionProof.test.mjs`
- `docs/architecture/relations/priority-test-links.csv`
- Generated architecture-awareness exports under `docs/graphs/` and
  `docs/status/`
- Project state/task evidence files

## Implementation Plan
1. Make the controlled proof runner import-safe while preserving direct CLI
   behavior.
2. Export narrow safety seams for local unit proof.
3. Add focused `node:test` coverage for no-order guard readiness, HTTP failure
   handling, unsafe option rejection, target bot safety, and activation payload
   construction.
4. Add scanner-readable relation rows for the covered anchors.
5. Refresh architecture graph and architecture-awareness exports.

## Acceptance Criteria
- `assertNoOrderGuardActive` accepts only readiness payloads where
  `globalKillSwitch`, `emergencyStop`, and `active` are all `true`.
- Missing/partial readiness payloads fail closed.
- Readiness HTTP errors are surfaced and are not treated as safe.
- Direct CLI `--help` still exits safely without network calls or activation.
- Architecture-awareness no longer lists
  `scripts/runControlledLiveSessionProof.mjs#assertNoOrderGuardActive` in Top
  Actionable Missing Test Links.

## Definition of Done
- [x] Focused local tests pass.
- [x] Scanner-readable relation rows exist and read back.
- [x] Architecture graph and architecture-awareness exports refreshed.
- [x] Repository guardrails pass.
- [x] No controlled LIVE proof, production auth, protected smoke, bot
      activation/deactivation, order, position, exchange, database, deploy,
      push, restart, rollback, secret, account, or live-trading mutation
      occurred.

## Validation Evidence
- `node --check scripts/runControlledLiveSessionProof.mjs` PASS.
- `node --check scripts/runControlledLiveSessionProof.test.mjs` PASS.
- `node scripts/runControlledLiveSessionProof.mjs --help` PASS and exited
  before any network call or LIVE activation path.
- `node --test scripts/runControlledLiveSessionProof.test.mjs` PASS (`6/6`).
- Direct relation readback PASS (`4` rows).
- `pnpm run architecture:graph:generate` PASS (`653` nodes / `842` relations /
  `27` chains).
- Softwarehouse architecture-awareness refresh PASS (`14971` entities /
  `24245` relations / `9701` files); refreshed report generated
  `2026-06-07T14:20:01.406Z` reports `297` actionable missing-test links and
  no longer lists
  `scripts/runControlledLiveSessionProof.mjs#assertNoOrderGuardActive` in Top
  Actionable Missing Test Links.
- `pnpm run quality:guardrails` PASS.
- Reality status: verified.

## Architecture Evidence
- Architecture source reviewed: `docs/status/architecture-awareness-report.md`,
  `docs/architecture/relations/priority-test-links.csv`.
- Fits approved architecture: yes.
- Mismatch discovered: no.
- Decision required from user: no.
- Follow-up architecture doc updates: generated architecture-awareness exports
  refreshed.

## Security / Privacy Evidence
- Data classification: local test/tooling only; fake URLs, fake auth header,
  fake bot data, and fake readiness payloads in tests.
- Secret handling: no secret values read, written, logged, or required.
- Fail-closed behavior: the guard still requires all three readiness flags
  before controlled LIVE activation can proceed, and target bot safety still
  rejects already-active or non-consented bots.
- Residual risk: this is local helper proof only; it does not claim a real
  protected controlled LIVE proof or production release gate.

## Result Report
- Task summary: made `scripts/runControlledLiveSessionProof.mjs` import-safe,
  added focused local safety tests, and linked the no-order guard anchor to
  Architecture Evidence Graph relations.
- Files changed:
  - `scripts/runControlledLiveSessionProof.mjs`
  - `scripts/runControlledLiveSessionProof.test.mjs`
  - `docs/architecture/relations/priority-test-links.csv`
  - generated architecture-awareness exports
  - state/evidence files for [LUC-2827](/LUC/issues/LUC-2827)
- What is incomplete: `scripts/runControlledLiveSessionProof.mjs#discoverTargetBot`
  remains a separate missing-test link in the refreshed report and should be
  selected or delegated by the parent queue if it is the next non-duplicate
  target.
- Next steps: parent queue can select the next non-duplicate missing-test link.
