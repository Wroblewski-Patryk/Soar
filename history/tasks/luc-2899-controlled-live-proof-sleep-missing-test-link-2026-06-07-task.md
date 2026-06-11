# LUC-2899 Controlled Live Proof sleep Missing-Test Link

## Context

[LUC-2899](/LUC/issues/LUC-2899) was assigned as a QA/Test child from
[LUC-2898](/LUC/issues/LUC-2898). The wake payload had no pending comments and
`fallbackFetchNeeded=false`; checkout was already claimed by the harness and was
not repeated. The active architecture-awareness report listed
`scripts/runControlledLiveSessionProof.mjs#sleep` as the next controlled LIVE
proof helper missing a direct test link after [LUC-2896](/LUC/issues/LUC-2896)
closed `#runSimultaneousRuntimeReadback`.

## Goal

Cover `scripts/runControlledLiveSessionProof.mjs#sleep` with the smallest
local-only QA/Test proof and add scanner-readable architecture relation
evidence.

## Scope

- `scripts/runControlledLiveSessionProof.mjs`
- `scripts/runControlledLiveSessionProof.test.mjs`
- `docs/architecture/relations/priority-test-links.csv`
- generated architecture graph/awareness exports
- source-of-truth state/evidence files

## Constraints

- Do not run the controlled LIVE proof.
- Do not pass `--i-understand-live-risk`.
- Do not use production auth or protected smoke.
- Do not activate/deactivate bots, create orders, touch positions, exchange
  state, database state, secrets, accounts, deploys, pushes, restarts, or
  rollbacks.
- Preserve direct CLI behavior.

## Stage

`verification` - implementation is complete and this packet records the proof
needed to close the local QA/Test lane.

## Implementation Plan

1. Export `sleep` for focused local proof without changing call behavior.
2. Add deterministic local `node:test` coverage using Node mock timers.
3. Add one direct `LUC-2899` relation row for
   `scripts/runControlledLiveSessionProof.mjs#sleep`.
4. Refresh graph/awareness evidence and run the smallest relevant gates.

## Acceptance Criteria

- `node --check scripts/runControlledLiveSessionProof.mjs` passes.
- `node --check scripts/runControlledLiveSessionProof.test.mjs` passes.
- `node scripts/runControlledLiveSessionProof.mjs --help` passes without
  protected execution.
- `node --test scripts/runControlledLiveSessionProof.test.mjs` passes.
- `priority-test-links.csv` has exactly one `LUC-2899` row for
  `scripts/runControlledLiveSessionProof.mjs#sleep`.
- Refreshed awareness report no longer lists
  `scripts/runControlledLiveSessionProof.mjs#sleep`.
- Repository guardrails pass.

## Definition Of Done

- Local proof and scanner-readable relation are present in repo files.
- Generated graph/status evidence is refreshed.
- Project state files identify status, proof, residual risk, and next owner.
- Paperclip issue is updated to `done`.

## Result Report

- Exported `sleep` from `scripts/runControlledLiveSessionProof.mjs` for focused
  local proof while preserving runtime behavior.
- Added a deterministic fake-timer test proving `sleep` resolves only after the
  requested timeout elapses.
- Added one scanner-readable `LUC-2899` relation row:
  `scripts/runControlledLiveSessionProof.mjs#sleep` ->
  `scripts/runControlledLiveSessionProof.test.mjs`.

## Verification Evidence

- `node --check scripts/runControlledLiveSessionProof.mjs` PASS.
- `node --check scripts/runControlledLiveSessionProof.test.mjs` PASS.
- `node scripts/runControlledLiveSessionProof.mjs --help` PASS.
- direct relation readback PASS (`1` row).
- `node --test scripts/runControlledLiveSessionProof.test.mjs` PASS
  (`28/28`).
- `pnpm run architecture:graph:generate` PASS (`653` nodes / `842`
  relations / `27` chains).
- Softwarehouse architecture-awareness final post-state refresh PASS (`15032`
  entities / `34400` relations / `9730` files).
- `docs/status/architecture-awareness-report.md` generated
  `2026-06-07T18:22:57.549Z`; actionable missing-test links are now `253`;
  `scripts/runControlledLiveSessionProof.mjs#sleep` is absent from Top
  Actionable Missing Test Links.
- `pnpm run quality:guardrails` PASS.

## Review And Refactor Check

- Architecture alignment: pass. The change adds direct relation evidence under
  the existing architecture evidence graph model.
- Existing systems reuse: pass. Used the existing Node test file, graph
  generator, and architecture-awareness relation model.
- Workaround check: pass. No bypass or temporary path was introduced.
- Duplication check: pass. The proof follows the existing helper-test pattern
  in `scripts/runControlledLiveSessionProof.test.mjs`.

## Residual Risk

- Remaining controlled LIVE proof helper missing-test links are separate
  anchors: `updateBotActiveState` and `waitForRunningSession`.
- This task did not run a protected controlled LIVE proof and does not provide
  production runtime readiness.

## Files Changed

- `scripts/runControlledLiveSessionProof.mjs`
- `scripts/runControlledLiveSessionProof.test.mjs`
- `docs/architecture/relations/priority-test-links.csv`
- generated architecture evidence/status exports
- source-of-truth state files
- this task record

## Next Steps

Parent queue can route the next non-duplicate controlled LIVE proof helper
anchor, currently `scripts/runControlledLiveSessionProof.mjs#updateBotActiveState`
or `scripts/runControlledLiveSessionProof.mjs#waitForRunningSession`, through a
separate owned lane if still release-critical.
