# LUC-2896 Controlled Live Proof runSimultaneousRuntimeReadback Missing-Test Link

## Context

[LUC-2896](/LUC/issues/LUC-2896) was assigned as a QA/Test child from
[LUC-2893](/LUC/issues/LUC-2893). The wake payload had no pending comments and
`fallbackFetchNeeded=false`; checkout was already claimed by the harness and was
not repeated. The active architecture-awareness report listed
`scripts/runControlledLiveSessionProof.mjs#runSimultaneousRuntimeReadback` as
the next controlled LIVE proof helper missing a direct test link after
[LUC-2892](/LUC/issues/LUC-2892) closed `#runCollector`.

## Goal

Cover `scripts/runControlledLiveSessionProof.mjs#runSimultaneousRuntimeReadback`
with the smallest local-only QA/Test proof and add scanner-readable
architecture relation evidence.

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

1. Add an injectable child-process seam to `runSimultaneousRuntimeReadback`
   while preserving the default `spawn`/`process.env`/`process.execPath` path.
2. Export `runSimultaneousRuntimeReadback` for focused local proof.
3. Add local `node:test` coverage for skip-without-output, collector invocation
   env, artifact paths, and non-zero collector exit rejection.
4. Add one direct `LUC-2896` relation row for
   `scripts/runControlledLiveSessionProof.mjs#runSimultaneousRuntimeReadback`.
5. Refresh graph/awareness evidence and run the smallest relevant gates.

## Acceptance Criteria

- `node --check scripts/runControlledLiveSessionProof.mjs` passes.
- `node --check scripts/runControlledLiveSessionProof.test.mjs` passes.
- `node scripts/runControlledLiveSessionProof.mjs --help` passes without
  protected execution.
- `node --test scripts/runControlledLiveSessionProof.test.mjs` passes.
- `priority-test-links.csv` has exactly one `LUC-2896` row for
  `scripts/runControlledLiveSessionProof.mjs#runSimultaneousRuntimeReadback`.
- Refreshed awareness report no longer lists
  `scripts/runControlledLiveSessionProof.mjs#runSimultaneousRuntimeReadback`.
- Repository guardrails pass.

## Definition Of Done

- Local proof and scanner-readable relation are committed to repo files.
- Generated graph/status evidence is refreshed.
- Project state files identify status, proof, residual risk, and next owner.
- Paperclip issue is updated to `done`.

## Result Report

- Added an injectable spawn/env/execPath seam to
  `runSimultaneousRuntimeReadback` and exported it for focused proof.
- Added local tests proving the helper skips collector execution when no
  simultaneous readback output is requested, spawns the non-Gate.io readback
  collector with bounded env-carried auth and artifact paths, and rejects
  non-zero collector exits.
- Added one scanner-readable `LUC-2896` relation row:
  `scripts/runControlledLiveSessionProof.mjs#runSimultaneousRuntimeReadback` ->
  `scripts/runControlledLiveSessionProof.test.mjs`.

## Verification Evidence

- `node --check scripts/runControlledLiveSessionProof.mjs` PASS.
- `node --check scripts/runControlledLiveSessionProof.test.mjs` PASS.
- `node scripts/runControlledLiveSessionProof.mjs --help` PASS.
- direct relation readback PASS (`1` row).
- `node --test scripts/runControlledLiveSessionProof.test.mjs` PASS
  (`27/27`).
- `pnpm run architecture:graph:generate` PASS (`653` nodes / `842`
  relations / `27` chains).
- First Softwarehouse architecture-awareness refresh attempt timed out at
  `180s`; retry with a longer timeout PASS, then final post-state refresh PASS
  (`15028` entities / `34382` relations / `9728` files).
- `docs/status/architecture-awareness-report.md` generated
  `2026-06-07T18:13:10.381Z`; actionable missing-test links are now `254`;
  `scripts/runControlledLiveSessionProof.mjs#runSimultaneousRuntimeReadback`
  is absent from Top Actionable Missing Test Links.
- `pnpm run quality:guardrails` PASS.

## Review And Refactor Check

- Architecture alignment: pass. The change adds direct relation evidence under
  the existing architecture evidence graph model.
- Existing systems reuse: pass. Used existing Node test file, graph generator,
  and architecture-awareness relation model.
- Workaround check: pass. No bypass or temporary path was introduced.
- Duplication check: pass. The proof follows the existing helper-test pattern
  in `scripts/runControlledLiveSessionProof.test.mjs`.

## Residual Risk

- Remaining controlled LIVE proof helper missing-test links, if any, are
  separate anchors.
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

Parent queue can route the next non-duplicate architecture-awareness anchor if
one remains release-critical after this helper is removed from the report.
