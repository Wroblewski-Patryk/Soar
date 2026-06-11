# LUC-2939 Prod Auth Session Browser Proof Helper Missing-Test Links

## Header

- ID: LUC-2939
- Title: [Soar][Test Automation][LUC-2936] Prod auth session browser proof helper missing-test links
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: QA/Test
- Depends on: [LUC-2936](/LUC/issues/LUC-2936)
- Priority: P1
- Module Confidence Rows: Architecture Evidence Graph / production auth session browser proof tooling
- Requirement Rows: not changed
- Quality Scenario Rows: local regression evidence for production auth proof helper safety
- Risk Rows: protected production auth/session remains out of scope
- Iteration: 2026-06-07
- Operation Mode: TESTER
- Mission ID: LUC-2939-PROD-AUTH-SESSION-BROWSER-PROOF-HELPER-MISSING-TEST-LINKS-2026-06-07
- Mission Status: VERIFIED

## Context

Parent [LUC-2936](/LUC/issues/LUC-2936) routed the next non-duplicate
architecture-awareness missing-test family to
`scripts/runProdAuthSessionBrowserProof.mjs#...`. Existing
[LUC-1756](/LUC/issues/LUC-1756) / [LUC-1774](/LUC/issues/LUC-1774) cover
protected production evidence/session blockers, not local helper relation proof.

## Goal

Make `scripts/runProdAuthSessionBrowserProof.mjs` import-safe for focused local
helper proof, add deterministic local tests for safe non-mutating helpers, and
add scanner-readable relation rows for covered helper anchors without executing
production auth/session browser proof.

## Scope

- `scripts/runProdAuthSessionBrowserProof.mjs`
- `scripts/runProdAuthSessionBrowserProof.test.mjs`
- `docs/architecture/relations/priority-test-links.csv`
- state and evidence ledgers required by Soar project policy

## Implementation Plan

1. Preserve direct CLI behavior behind an import-safe execution guard.
2. Export only helper surfaces needed for local deterministic proof.
3. Add mocked `node:test` coverage for argument/options parsing, base URL
   normalization, browser-path resolution, JSON parsing fallback, mocked CDP
   evaluate/navigation/location/auth cleanup/auth cookie behavior, fail-closed
   cookie setup, step formatting, markdown redaction, and wait.
4. Add direct [LUC-2939](/LUC/issues/LUC-2939) priority-test relation rows for
   helper anchors actually unit-invoked.
5. Classify side-effect helpers not unit-invoked because they launch Chrome/CDP
   pages or execute the full production auth proof.

## Acceptance Criteria

- Direct CLI behavior is preserved and imports do not run `main`.
- Local tests run without production auth tokens, cookies, accounts, or browser
  launch.
- Relation rows exist for directly covered helper anchors.
- Protected production auth proof is not executed.
- Remaining side-effect helper anchors are explicitly classified.

## Definition of Done

- [x] Code syntax checks pass.
- [x] Focused local helper test passes.
- [x] Direct relation readback confirms [LUC-2939](/LUC/issues/LUC-2939) rows.
- [x] Architecture graph generation passes.
- [x] Architecture-awareness refresh passes from the documented control-plane
      checkout.
- [x] Repository guardrails pass.
- [x] No production auth/session, protected browser proof, deploy, push,
      restart, rollback, account, secret, database, exchange, order, position,
      or live-trading mutation occurred.

## Validation Evidence

- `node --check scripts/runProdAuthSessionBrowserProof.mjs` -> PASS.
- `node --check scripts/runProdAuthSessionBrowserProof.test.mjs` -> PASS.
- `node --test scripts/runProdAuthSessionBrowserProof.test.mjs` -> PASS
  (`5/5`).
- `node scripts/runProdAuthSessionBrowserProof.mjs --help` -> PASS.
- Direct relation readback -> PASS (`13` [LUC-2939](/LUC/issues/LUC-2939)
  rows).
- `pnpm run architecture:graph:generate` -> PASS (`653` nodes / `842`
  relations / `27` chains).
- `node scripts/build-architecture-awareness-index.mjs --project Soar --root .`
  from the Soar checkout -> FAILED as expected because that scanner is not in
  this checkout (`MODULE_NOT_FOUND`).
- `node scripts/build-architecture-awareness-index.mjs --project Soar --root ../Soar`
  from `C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse` -> PASS
  (`15062` entities / `34562` relations / `9747` files).
- Refreshed `docs/status/architecture-awareness-report.md` generated
  `2026-06-07T21:06:25.826Z`; actionable implementation entities without
  inferred tests are now `205`.
- Covered `scripts/runProdAuthSessionBrowserProof.mjs#...` helper anchors no
  longer appear in Top Actionable Missing Test Links. Remaining top-list anchors
  for this script are classified side-effect helpers:
  `createPage`, `launchBrowser`, and `main`.
- `pnpm run quality:guardrails` -> PASS.
- `Get-Process chrome-headless-shell -ErrorAction SilentlyContinue` -> no
  validation process output.

## Architecture Evidence

- Architecture source reviewed: `docs/status/architecture-awareness-report.md`,
  `docs/architecture/relations/priority-test-links.csv`.
- Fits approved architecture: yes.
- Mismatch discovered: no.
- Decision required from user: no.
- Follow-up architecture doc updates: scanner-readable relation rows added for
  `clearAuth`, `collectLocation`, `evaluate`, `findBrowserPath`, `navigate`,
  `normalizeBaseUrl`, `readArgValue`, `readJson`, `renderMarkdown`,
  `resolveOptions`, `setAuthCookie`, `toStep`, and `wait`.

## Security / Privacy Evidence

- Data classification: local synthetic test data only.
- Trust boundaries: production auth/session proof remains approval-gated and
  was not run.
- Secret handling: tests use synthetic strings and assert markdown does not
  include fixture token text.
- Fail-closed behavior: `setAuthCookie` rejects when both host and shared-domain
  cookie writes report failure.
- Residual risk: full browser/CDP orchestration and production auth/session
  behavior remain protected proof concerns, not local helper proof claims.

## Result Report

- Task summary: added import-safe exports and focused local helper tests for
  safe non-mutating production auth browser proof helpers, plus direct
  architecture relation rows.
- Files changed:
  - `scripts/runProdAuthSessionBrowserProof.mjs`
  - `scripts/runProdAuthSessionBrowserProof.test.mjs`
  - `docs/architecture/relations/priority-test-links.csv`
  - `history/tasks/luc-2939-prod-auth-session-browser-proof-helper-missing-test-links-2026-06-07-task.md`
  - source-of-truth state/context ledgers
- What is incomplete: side-effect helpers `createPage`, `launchBrowser`, and
  `main` are intentionally not unit-invoked because they launch CDP/browser or
  execute full protected production proof.
- Deploy impact: none.
- Commit/push: not committed; dirty worktree contains many pre-existing
  unrelated lane changes, so this issue leaves source-control closure to the
  active batching/closure lane.
