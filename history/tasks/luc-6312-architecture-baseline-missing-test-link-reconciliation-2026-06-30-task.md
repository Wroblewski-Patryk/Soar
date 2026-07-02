# LUC-6312 Architecture Baseline Missing Test-Link Reconciliation

## Header

- ID: LUC-6312
- Title: [Soar] Reconcile architecture baseline actionable missing test links
- Task Type: test automation / architecture evidence
- Current Stage: verification
- Status: `DONE / VERIFIED / ZERO_ACTIONABLE_MISSING_TEST_LINKS`
- Owner: Test Automation Engineer
- Parent: [LUC-6309](/LUC/issues/LUC-6309)
- Priority: high
- Mission ID: `LUC-6312-ARCHITECTURE-BASELINE-MISSING-TEST-LINKS-2026-06-30`

## Context

[LUC-6309](/LUC/issues/LUC-6309) produced a known-state architecture baseline
where `docs/status/architecture-awareness-report.md` listed eight actionable
missing-test-link rows. The task was to prove or reconcile those rows without
changing runtime behavior.

## Goal

Add or link the smallest sufficient automated proof for the eight named rows,
regenerate the architecture-awareness baseline, and leave zero actionable
missing-test-link rows for this scope.

## Scope

- Add a focused API helper proof test for API rows that lacked direct
  function-level proof.
- Reuse existing Web/script tests for rows that already had proof.
- Update architecture test-link registry inputs and regenerate graph outputs.
- Record task and evidence packets.

## Implementation Plan

1. Inspect the eight missing-test-link rows from the architecture report.
2. Reuse existing `SharedUiPrimitives.test.tsx` and
   `runProdAuthSessionBrowserProof.test.mjs` proof where adequate.
3. Add a focused API test covering capital allocation, no-store headers,
   indicator period coercion/clamping/warmup, and runtime client order IDs.
4. Add exact priority test-link rows.
5. Regenerate architecture-awareness outputs.
6. Run focused API proof and strict drift validation.
7. Update source-of-truth task/evidence state and Paperclip disposition.

## Acceptance Criteria

- The focused API proof passes.
- Existing Web/script proof links are represented in the architecture graph.
- Architecture-awareness regeneration succeeds.
- `Top Actionable Missing Test Links` is empty.
- `architecture:graph:drift:strict` passes.
- No production or live-trading boundary is crossed.

## Definition of Done

- [x] `apps/api/src/modules/architectureBaselineProof.test.ts` covers the API
      helper rows.
- [x] Exact priority test-link rows exist for all eight scoped functions.
- [x] Architecture-awareness outputs were regenerated.
- [x] Strict architecture drift passed.
- [x] Evidence packet exists.
- [x] Residual risk is documented.

## Forbidden

- Push, deploy, restart, production smoke, secret/account readback, exchange or
  payment mutation, order, position, subscription mutation, or live-trading
  action.
- Reverting unrelated dirty worktree changes.
- Broad refactors or scanner rewrites.

## Validation Evidence

- `pnpm --filter api exec vitest run src/modules/architectureBaselineProof.test.ts --run`
  - PASS: `1` file, `4` tests.
- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-architecture-awareness-index.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar`
  - PASS: `10199` entities, `32531` relations, `12436` files.
- `pnpm run architecture:graph:drift:strict`
  - PASS: `850/850` covered, `0` missing.
- `docs/status/architecture-awareness-report.md`
  - `Top Actionable Missing Test Links` is empty.

## Result Report

- Completed the LUC-6312 reconciliation.
- Added one focused API proof test file.
- Linked all eight scoped functions to automated proof.
- Regenerated architecture awareness and drift outputs.
- Source-control closure: not committed because this shared workspace already
  contains broad unrelated dirty changes from other lanes; no push or deploy
  was authorized.
- Deploy impact: none.
- Residual risk: none for the eight scoped missing-test-link rows.
