# LUC-2910 Cutover Dry-Run Main Missing-Test Link - 2026-06-07

## Header
- ID: LUC-2910
- Title: Cutover dry-run main missing-test link
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: QA/Test
- Priority: P1
- Operation Mode: TESTER
- Mission ID: LUC-2910
- Mission Status: VERIFIED

## Context
[LUC-2910](/LUC/issues/LUC-2910) targeted the architecture-awareness missing-test
row for `scripts/runCutoverDryRun.mjs#main` and adjacent helper anchors. The
work had to stay local-only and avoid real cutover execution, Docker, deploy,
production auth, secrets, database, exchange, order, position, or live-trading
mutation.

## Goal
Add focused local proof for the cutover dry-run CLI orchestration and connect
the covered helper anchors through scanner-readable priority test links.

## Scope
- `scripts/runCutoverDryRun.mjs`
- `scripts/runCutoverDryRun.test.mjs`
- `docs/architecture/relations/priority-test-links.csv`
- generated architecture-awareness readback under `docs/status/` and
  `docs/graphs/`

## Implementation Plan
1. Make the CLI script import-safe using the existing `pathToFileURL` guard
   pattern used by adjacent ops scripts.
2. Export and inject-test the existing helpers without changing the real CLI
   command sequence.
3. Add local Node tests for argument parsing, timestamp rendering, child command
   result classification, markdown output, main orchestration, failure
   classification, teardown behavior, and help behavior.
4. Add direct priority test relation rows for the covered helper anchors.
5. Run focused proof and architecture/guardrail readback.

## Acceptance Criteria
- `scripts/runCutoverDryRun.test.mjs` proves `main` without starting Docker or
  executing real cutover commands.
- `docs/architecture/relations/priority-test-links.csv` contains direct rows
  for `main`, `nowStamp`, `parseArgs`, `renderMarkdown`, and `runStep`.
- Fresh architecture-awareness report no longer lists `scripts/runCutoverDryRun`
  in top actionable missing-test rows.
- Repository guardrails pass.

## Definition of Done
- Local proof is implemented and verified.
- Architecture-awareness relation repair is scanner-readable.
- Residual missing-test count is recorded.
- No protected operation, runtime service, secret, database, exchange, order,
  position, deploy, push, or live-trading mutation occurred.

## Result Report
- Task summary: Added import-safe/injectable local proof for
  `runCutoverDryRun` and direct test-link rows for the target helper anchors.
- Files changed:
  - `scripts/runCutoverDryRun.mjs`
  - `scripts/runCutoverDryRun.test.mjs`
  - `docs/architecture/relations/priority-test-links.csv`
  - architecture-awareness generated readback files
- How tested:
  - `node --test scripts/runCutoverDryRun.test.mjs` -> PASS (`7/7`)
  - `node scripts/build-architecture-awareness-index.mjs --project Soar --root ../Soar`
    from `C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse` refreshed
    report before the shell timeout; no scanner process remained afterward.
  - `Select-String docs/status/architecture-awareness-report.md` -> generated
    `2026-06-07T19:07:10.394Z`, actionable missing-test count `246`, and no
    `scripts/runCutoverDryRun` rows.
  - `pnpm run quality:guardrails` -> PASS.
- What is incomplete: broader missing-test backlog remains at `246` actionable
  rows and is outside this issue.
- Next steps: continue with the next non-duplicate architecture-awareness
  missing-test family through owned Paperclip lanes.
- Decisions made: export/injection was used to avoid fake cutover execution and
  preserve the real CLI behavior for `ops:cutover:dry-run`.

## Validation Evidence
- Tests: `node --test scripts/runCutoverDryRun.test.mjs` PASS (`7/7`).
- Manual checks: architecture report no longer lists `scripts/runCutoverDryRun`.
- Screenshots/logs: not applicable.
- High-risk checks: no Docker, deploy, production auth, secrets, database,
  exchange, order, position, or live-trading mutation occurred.
- Module confidence ledger updated: yes.
- Requirements matrix updated: not applicable.
- Quality scenarios updated: not applicable.
- Risk register updated: not applicable.
- Reality status: verified.

## Architecture Evidence
- Architecture source reviewed: `docs/status/architecture-awareness-report.md`;
  `docs/architecture/relations/priority-test-links.csv`.
- Fits approved architecture: yes.
- Mismatch discovered: no.
- Decision required from user: no.
- Follow-up architecture doc updates: generated architecture-awareness readback
  now reports `246` actionable missing-test rows.

## Security / Privacy Evidence
- Data classification: local test and documentation metadata only.
- Trust boundaries: protected cutover/runtime boundaries were not crossed.
- Secret handling: no secret values read, printed, or persisted.
- Fail-closed behavior: tests cover failure classification and infra teardown
  after successful startup.
- Residual risk: real protected release/cutover proof remains governed by
  existing release gates, not this local helper-link repair.
