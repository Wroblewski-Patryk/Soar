# LUC-2989 Go-Live Smoke Helper Proof Lane Disposition - 2026-06-08

## Header
- ID: LUC-2989-GO-LIVE-SMOKE-HELPER-PROOF-LANE-DISPOSITION-2026-06-08
- Title: Recover go-live smoke helper proof lane disposition
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: QA/Test
- Depends on: [LUC-2986](/LUC/issues/LUC-2986)
- Priority: P1
- Module Confidence Rows: Architecture Evidence Graph / go-live smoke wrapper
- Requirement Rows: not applicable
- Quality Scenario Rows: local release-tooling traceability
- Risk Rows: protected go-live smoke boundary remains separate
- Iteration: 2026-06-08
- Operation Mode: TESTER
- Mission ID: LUC-2989
- Mission Status: VERIFIED

## Context
[LUC-2989](/LUC/issues/LUC-2989) was created from [LUC-2986](/LUC/issues/LUC-2986)
because the current architecture-awareness report still listed
`scripts/goLiveSmoke.mjs` helper anchors while older owner lanes were stalled:
[LUC-2792](/LUC/issues/LUC-2792) was blocked without first-class blockers and
[LUC-2873](/LUC/issues/LUC-2873) was blocked with an active recovery action and
no live execution path.

## Goal
Provide local deterministic proof or precise classification for the
`scripts/goLiveSmoke.mjs` helper anchors without running the umbrella
`pnpm run test:go-live:smoke` command or any protected production/deploy flow.

## Scope
- `scripts/goLiveSmoke.mjs`
- `scripts/goLiveSmoke.test.mjs`
- `docs/architecture/relations/priority-test-links.csv`
- generated architecture-awareness and graph exports under `docs/graphs/` and
  `docs/status/`
- project state files that record the QA disposition

## Implementation Plan
1. Make `scripts/goLiveSmoke.mjs` import-safe by moving execution into exported
   `main()` guarded by `pathToFileURL(process.argv[1])`.
2. Preserve direct CLI behavior for `--target=api`, `--target=server`, and
   `--target=full`.
3. Add injected dependencies for `run`, `localInfraIsReachable`, console, and
   process so the helper behavior can be tested without starting Docker,
   migrations, or the full smoke pack.
4. Add focused `node:test` coverage for target parsing, child-process wrapper
   options, socket reachability, local infra aggregation, Prisma migration
   failure parsing/guidance, CLI orchestration, teardown, infra reuse, and
   unsupported-target fail-closed behavior.
5. Add scanner-readable relation rows for the covered anchors.
6. Refresh architecture graph and architecture-awareness outputs.

## Acceptance Criteria
- Focused helper tests pass locally.
- No umbrella go-live smoke, protected smoke, deploy, push, restart, secret,
  production auth/session, account, database mutation, exchange account, order,
  position, or live-trading mutation occurs.
- `scripts/goLiveSmoke.mjs` no longer appears in Top Actionable Missing Test
  Links.
- [LUC-2873](/LUC/issues/LUC-2873) has a recovered disposition, and
  [LUC-2792](/LUC/issues/LUC-2792) is treated as duplicate/superseded for this
  local helper-test family.

## Definition of Done
- [x] Code parses without syntax errors.
- [x] Focused local proof passes.
- [x] Architecture graph and awareness exports are refreshed.
- [x] Repository guardrails pass.
- [x] Evidence and source-of-truth files are updated.
- [x] Protected smoke remains explicitly out of scope.

## Validation Evidence
- `node --check scripts/goLiveSmoke.mjs` PASS.
- `node --check scripts/goLiveSmoke.test.mjs` PASS.
- `node --test scripts/goLiveSmoke.test.mjs` PASS (`11/11`).
- Direct relation readback PASS (`7` [LUC-2989](/LUC/issues/LUC-2989) rows):
  `canConnect`, `extractFailedMigrationName`, `finish`,
  `localInfraIsReachable`, `main`, `printLocalMigrationGuidance`, and `run`.
- `pnpm run architecture:graph:generate` PASS (`653` nodes / `842` relations /
  `27` chains).
- `node scripts/build-architecture-awareness-index.mjs --project Soar --root C:\Personal\Projekty\Aplikacje\Soar`
  PASS from `C:\Personal\Projekty\Aplikacje\Paperclip_Softwarehouse`
  (`9344` entities / `29497` relations / `9739` files).
- Refreshed architecture-awareness report generated
  `2026-06-08T00:08:49.364Z` reports `118` actionable missing-test links and
  no `scripts/goLiveSmoke.mjs` rows in Top Actionable Missing Test Links.
- `pnpm run quality:guardrails` PASS.
- `Get-Process chrome-headless-shell -ErrorAction SilentlyContinue` returned no
  process rows.

## Result Report
- Task summary: added import-safe local helper proof for `goLiveSmoke.mjs` and
  scanner-readable traceability for all covered helper anchors.
- Files changed: `scripts/goLiveSmoke.mjs`, `scripts/goLiveSmoke.test.mjs`,
  `docs/architecture/relations/priority-test-links.csv`, generated
  architecture graph/awareness outputs, and state/evidence docs.
- How tested: focused syntax checks, focused `node:test`, relation readback,
  architecture graph generation, architecture-awareness refresh, guardrails,
  and process hygiene check.
- What is incomplete: full `pnpm run test:go-live:smoke` remains protected and
  intentionally not run in this lane.
- Next steps: route the next non-duplicate top missing-test family separately;
  do not reopen `goLiveSmoke` local helper proof unless a future report adds a
  new exact anchor.
- Decisions made: [LUC-2873](/LUC/issues/LUC-2873) is recoverable and should be
  closed as fulfilled by this [LUC-2989](/LUC/issues/LUC-2989) implementation;
  [LUC-2792](/LUC/issues/LUC-2792) remains duplicate/superseded for this local
  helper-test family, while protected go-live smoke remains a separate release
  gate.
