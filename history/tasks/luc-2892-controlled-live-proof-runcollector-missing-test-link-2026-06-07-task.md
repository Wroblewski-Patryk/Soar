# LUC-2892 Controlled Live Proof runCollector Missing-Test Link

## Context

[LUC-2892](/LUC/issues/LUC-2892) was assigned as a Test Automation child from
[LUC-2889](/LUC/issues/LUC-2889). The wake payload had no pending comments and
`fallbackFetchNeeded=false`; checkout was already claimed by the harness and was
not repeated. The active architecture-awareness report listed
`scripts/runControlledLiveSessionProof.mjs#runCollector` as the next
controlled LIVE proof helper missing a direct test link after
[LUC-2886](/LUC/issues/LUC-2886) closed `#resolveBuildInfo`.

## Goal

Cover `scripts/runControlledLiveSessionProof.mjs#runCollector` with the
smallest local-only Test Automation proof and add scanner-readable architecture
relation evidence.

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
needed to close the local Test Automation lane.

## Implementation Plan

1. Add an injectable child-process seam to `runCollector` while preserving the
   default `spawn`/`process.env`/`process.execPath` path.
2. Export `runCollector` for focused local proof.
3. Add local `node:test` coverage for collector invocation arguments,
   env-carried auth/ops values, and non-zero collector exit rejection.
4. Add one direct `LUC-2892` relation row for
   `scripts/runControlledLiveSessionProof.mjs#runCollector`.
5. Refresh graph/awareness evidence and run the smallest relevant gates.

## Acceptance Criteria

- `node --check scripts/runControlledLiveSessionProof.mjs` passes.
- `node --check scripts/runControlledLiveSessionProof.test.mjs` passes.
- `node scripts/runControlledLiveSessionProof.mjs --help` passes without
  protected execution.
- `node --test scripts/runControlledLiveSessionProof.test.mjs` passes.
- `priority-test-links.csv` has exactly one `LUC-2892` row for
  `scripts/runControlledLiveSessionProof.mjs#runCollector`.
- Refreshed awareness report no longer lists
  `scripts/runControlledLiveSessionProof.mjs#runCollector`.
- Repository guardrails pass.

## Definition Of Done

- Local proof and scanner-readable relation are committed to repo files.
- Generated graph/status evidence is refreshed.
- Project state files identify status, proof, residual risk, and next owner.
- Paperclip issue is updated to `done`.

## Result Report

- Added an injectable spawn/env/execPath seam to `runCollector` and exported it
  for focused proof.
- Added local tests proving collector child-process invocation uses bounded
  args, carries auth/ops values through child environment, preserves inherited
  env values, and rejects non-zero collector exits.
- Added one scanner-readable `LUC-2892` relation row:
  `scripts/runControlledLiveSessionProof.mjs#runCollector` ->
  `scripts/runControlledLiveSessionProof.test.mjs`.

## Verification Evidence

- `node --check scripts/runControlledLiveSessionProof.mjs` PASS.
- `node --check scripts/runControlledLiveSessionProof.test.mjs` PASS.
- `node scripts/runControlledLiveSessionProof.mjs --help` PASS.
- direct relation readback PASS (`1` row).
- `node --test scripts/runControlledLiveSessionProof.test.mjs` PASS (`24/24`).
- `pnpm run architecture:graph:generate` PASS (`653` nodes / `842`
  relations / `27` chains).
- `node scripts/build-architecture-awareness-index.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar`
  PASS from the Paperclip Softwarehouse workspace (`15022` entities / `34359`
  relations / `9725` files).
- `docs/status/architecture-awareness-report.md` generated
  `2026-06-07T17:33:58.207Z`; actionable missing-test links are now `255`;
  `scripts/runControlledLiveSessionProof.mjs#runCollector` is absent from Top
  Actionable Missing Test Links.
- `pnpm run quality:guardrails` PASS.

## Review And Refactor Check

- Architecture alignment: pass. The change adds direct relation evidence under
  the existing architecture evidence graph model.
- Existing systems reuse: pass. Used existing Node test file, graph generator,
  and architecture-awareness refresh.
- Workaround check: pass. No bypass or temporary path was introduced.
- Duplication check: pass. The proof follows the existing helper-test pattern
  in `scripts/runControlledLiveSessionProof.test.mjs`.

## Residual Risk

- Remaining controlled LIVE proof helper missing-test links are separate
  anchors, currently headed by
  `scripts/runControlledLiveSessionProof.mjs#runSimultaneousRuntimeReadback`.
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

Parent queue can route the next non-duplicate anchor, currently
`scripts/runControlledLiveSessionProof.mjs#runSimultaneousRuntimeReadback`,
through a separate owned lane if still release-critical.
