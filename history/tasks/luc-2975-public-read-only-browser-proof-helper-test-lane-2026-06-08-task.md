# LUC-2975 Public Read-Only Browser Proof Helper Test Lane

## Header

- ID: LUC-2975 / LUC-2958
- Title: Resume public read-only browser proof helper-test lane
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: QA/Test
- Priority: P1
- Mission ID: LUC-2975-PUBLIC-READ-ONLY-BROWSER-PROOF-HELPER-TEST-LANE-2026-06-08
- Mission Status: VERIFIED

## Context

[LUC-2975](/LUC/issues/LUC-2975) asked QA/Test to resume or correctly re-block
[LUC-2958](/LUC/issues/LUC-2958). [LUC-2958](/LUC/issues/LUC-2958) was
`blocked` only by duplicate live-run janitor comments and had no first-class
`blockedBy` issue or active recovery action. The actionable work was the
original local-only helper-test lane for
`scripts/runPublicReadOnlyBrowserProof.mjs`.

## Goal

Add deterministic local Node proof for safe helper behavior in
`scripts/runPublicReadOnlyBrowserProof.mjs` and make the architecture-awareness
scanner see the covered helper-test relations without running production
browser proof.

## Scope

- `scripts/runPublicReadOnlyBrowserProof.mjs`
- `scripts/runPublicReadOnlyBrowserProof.test.mjs`
- `docs/architecture/relations/priority-test-links.csv`
- Generated architecture-awareness outputs under `docs/graphs/` and
  `docs/status/`

## Implementation Plan

1. Preserve direct CLI behavior while adding named exports and an import guard.
2. Add mocked `node:test` coverage for local URL guard behavior, option
   normalization, issue filtering, route issue filtering, mocked CDP
   evaluation/navigation/page-state helpers, password-toggle interpretation,
   route aggregation, markdown rendering, and safe `--help`.
3. Add scanner-readable direct relation rows for the safe helper anchors.
4. Run focused proof, graph generation, and architecture-awareness refresh.

## Acceptance Criteria

- `node --test scripts/runPublicReadOnlyBrowserProof.test.mjs` passes.
- Direct relation readback shows [LUC-2958](/LUC/issues/LUC-2958) rows.
- The refreshed architecture-awareness report no longer lists the covered
  safe helper anchors as top actionable missing-test rows.
- No protected production smoke, real browser launch, credentials, deploy,
  restart, database, exchange, order, position, or live-trading mutation occurs.

## Definition Of Done

- Focused helper tests are implemented and verified.
- Architecture relation/readback evidence is recorded.
- Residual browser/process helper risk is explicitly classified.
- Paperclip issues receive a final disposition with evidence.

## Validation Evidence

- `node --check scripts/runPublicReadOnlyBrowserProof.mjs` PASS.
- `node --check scripts/runPublicReadOnlyBrowserProof.test.mjs` PASS.
- `node scripts/runPublicReadOnlyBrowserProof.mjs --help` PASS.
- `node --test scripts/runPublicReadOnlyBrowserProof.test.mjs` PASS (`5/5`).
- Direct relation readback PASS (`16` [LUC-2958](/LUC/issues/LUC-2958) rows).
- `pnpm run architecture:graph:generate` PASS (`653` nodes / `842` relations /
  `27` chains).
- External Softwarehouse architecture-awareness refresh PASS (`9328` entities /
  `29432` relations / `9732` files), report generated
  `2026-06-07T23:10:42.686Z`.
- Refreshed actionable missing-test links: `125`, down from `141` at the
  [LUC-2975](/LUC/issues/LUC-2975) PM readback.
- No leftover `chrome-headless-shell` validation process found.

## Result Report

- Task summary: [LUC-2958](/LUC/issues/LUC-2958) was resumed and completed with
  local helper proof; [LUC-2975](/LUC/issues/LUC-2975) can close as the resume
  lane.
- Files changed:
  - `scripts/runPublicReadOnlyBrowserProof.mjs`
  - `scripts/runPublicReadOnlyBrowserProof.test.mjs`
  - `docs/architecture/relations/priority-test-links.csv`
  - generated architecture-awareness graph/status outputs
- What is incomplete: `createPage`, `killProcessTree`, and `launchBrowser`
  remain in Top Actionable Missing Test Links because they are real browser or
  OS process orchestration helpers. They were intentionally not unit-claimed by
  this local helper-test lane.
- Commit/push/deploy: not committed, not pushed, no deploy.
- Residual risk: broader missing-test backlog remains outside this focused
  lane; protected/authenticated production browser proof remains separately
  gated.
