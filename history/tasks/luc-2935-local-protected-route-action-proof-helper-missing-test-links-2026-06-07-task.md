# Task

## Header
- ID: LUC-2935
- Title: [Soar][Test Automation][LUC-2934] Local protected route action proof helper missing-test links
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: QA/Test
- Priority: P2
- Module Confidence Rows: Architecture Evidence Graph / local protected route proof tooling
- Requirement Rows: not applicable
- Quality Scenario Rows: regression evidence loop
- Risk Rows: local proof tooling ambiguity
- Iteration: 2026-06-07
- Operation Mode: TESTER
- Mission ID: LUC-2934
- Mission Status: VERIFIED

## Context
`docs/status/architecture-awareness-report.md` listed current
`scripts/runLocalProtectedRouteActionProof.mjs#...` helpers as actionable
missing-test links after the [LUC-2934](/LUC/issues/LUC-2934) refresh.

## Goal
Add focused local proof for non-mutating helper behavior in
`scripts/runLocalProtectedRouteActionProof.mjs` and add scanner-readable
test-link rows for the helpers that now have direct proof.

## Scope
- `scripts/runLocalProtectedRouteActionProof.mjs`
- `scripts/runLocalProtectedRouteActionProof.test.mjs`
- `docs/architecture/relations/priority-test-links.csv`
- project task/context ledgers

## Implementation Plan
1. Preserve CLI behavior while making the proof helper import-safe.
2. Export the helper functions needed for focused local `node:test` coverage.
3. Test non-mutating helpers with mocked CDP/fetch clients and temporary local
   file inputs.
4. Add relation rows for helpers with direct focused proof.
5. Record side-effect helper classification and verification evidence.

## Acceptance Criteria
- Direct CLI execution remains gated to `node scripts/runLocalProtectedRouteActionProof.mjs`.
- Focused local tests cover argument/options, mocked CDP location/navigation,
  dynamic fixture API responses, HTTP route proof, markdown rendering, waiting,
  and child cleanup.
- Relation CSV includes [LUC-2935](/LUC/issues/LUC-2935) rows for covered
  helper anchors.
- Side-effect helpers are classified without launching browsers, servers,
  protected production smoke, or external services.

## Definition of Done
- [x] Import-safe helper exports are present.
- [x] Focused `node:test` proof passes.
- [x] Relation rows are scanner-readable.
- [x] No production auth, deploy, restart, database, exchange, order, position,
      or live-trading action was performed.

## Forbidden
- Production auth or protected production smoke.
- Real account/session use.
- Exchange credentials, deploy, push, restart, rollback, database mutation,
  external service mutation, order, position, or live trading.
- Leaving browser/dev-server processes running.

## Validation Evidence
- Tests:
  - `node --check scripts/runLocalProtectedRouteActionProof.mjs` PASS.
  - `node --test scripts/runLocalProtectedRouteActionProof.test.mjs` PASS
    (`4/4`).
- Manual checks:
  - Direct relation readback PASS (`16` [LUC-2935](/LUC/issues/LUC-2935)
    rows).
  - `pnpm run architecture:graph:generate` PASS (`653` nodes / `842`
    relations / `27` chains).
  - Softwarehouse architecture-awareness refresh PASS (`15058` entities /
    `34534` relations / `9745` files); actionable missing-test links reduced
    to `218`. Only classified side-effect helpers remain for
    `scripts/runLocalProtectedRouteActionProof.mjs`: `createPage`,
    `launchBrowser`, `main`, `startWebServer`.
  - `pnpm run quality:guardrails` PASS.
- Screenshots/logs: not applicable.
- High-risk checks: local-only mocked CDP/fetch; no browser/server launched by
  the focused tests.
- Module confidence ledger updated: yes.
- Requirements matrix updated: not applicable.
- Quality scenarios updated: not applicable.
- Risk register updated: not applicable.
- Reality status: verified.

## Architecture Evidence
- Architecture source reviewed:
  `docs/status/architecture-awareness-report.md`,
  `docs/architecture/relations/priority-test-links.csv`.
- Fits approved architecture: yes.
- Mismatch discovered: no.
- Decision required from user: no.
- Follow-up architecture doc updates: relation CSV rows only.

## Helper Classification
- Direct focused proof added:
  `collectLocation`, `evaluate`, `findBrowserPath`, `httpRouteProof`,
  `installDynamicFixtureApi`, `jsonFixtureResponse`, `navigate`,
  `normalizeBaseUrl`, `readArgValue`, `renderMarkdown`,
  `resolveDynamicFixtureApi`, `resolveOptions`, `stopChild`,
  `verifyStaticMapping`, `wait`, `waitForPath`.
- Classified as side-effect orchestration not directly unit-invoked in this
  lane:
  `createPage`, `launchBrowser`, `startWebServer`, `main`.
  These helpers create CDP pages, launch browsers, start local web servers, or
  write full proof artifacts. This lane preserved syntax/import-safety and
  existing CLI behavior; end-to-end browser proof remains covered by the
  protected-route proof matrix lanes such as [LUC-2188](/LUC/issues/LUC-2188).

## Result Report
- Task summary: local protected-route proof helper is import-safe and has
  focused local proof for non-mutating helpers.
- Files changed:
  - `scripts/runLocalProtectedRouteActionProof.mjs`
  - `scripts/runLocalProtectedRouteActionProof.test.mjs`
  - `docs/architecture/relations/priority-test-links.csv`
  - `.agents/state/module-confidence-ledger.md`
  - `.codex/context/TASK_BOARD.md`
  - `history/tasks/luc-2935-local-protected-route-action-proof-helper-missing-test-links-2026-06-07-task.md`
- How tested:
  - `node --check scripts/runLocalProtectedRouteActionProof.mjs`
  - `node --test scripts/runLocalProtectedRouteActionProof.test.mjs`
  - direct [LUC-2935](/LUC/issues/LUC-2935) relation readback
  - `pnpm run architecture:graph:generate`
  - `node C:\Personal\Projekty\Aplikacje\Paperclip_Softwarehouse\scripts\build-architecture-awareness-index.mjs --project Soar --root C:\Personal\Projekty\Aplikacje\Soar`
  - `pnpm run quality:guardrails`
- What is incomplete:
  - No direct unit execution was added for side-effect orchestration helpers
    that create CDP pages, browsers, servers, or full proof artifacts.
- Next steps:
  - Parent gap-register lane can decide whether a separate browser orchestration
    proof/classification issue is worth opening for the remaining four helpers.
