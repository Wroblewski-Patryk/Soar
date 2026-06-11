# LUC-2808 Resolve Ops Auth Token Cookie Parser Missing-Test Link

## Header
- ID: LUC-2808
- Title: Cover resolveOpsAuthToken cookie parser missing-test link
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Test Automation Engineer
- Depends on: LUC-2807
- Priority: P1
- Module Confidence Rows: release tooling / architecture evidence graph relation confidence
- Requirement Rows: not applicable; regression evidence only
- Quality Scenario Rows: testability / release tooling regression resistance
- Risk Rows: protected ops auth remains production-gated
- Iteration: 2026-06-07
- Operation Mode: TESTER
- Mission ID: LUC-2808-RESOLVE-OPS-AUTH-TOKEN-COOKIE-PARSER-MISSING-TEST-LINK-2026-06-07
- Mission Status: VERIFIED

## Context
LUC-2807 selected `scripts/resolveOpsAuthToken.mjs#extractTokenFromSetCookie`
from the current architecture-awareness Top Actionable Missing Test Links list.
This child issue owns only the local Test Automation proof and scanner-readable
relation repair for that anchor.

Baseline dirty worktree note: before editing, the repository already had many
modified state/docs/generated graph files plus prior test/script artifacts from
earlier lanes. This task intentionally touched only the ops-auth parser script,
its new focused test file, the priority test-link relation CSV, refreshed
generated architecture-awareness exports, and local evidence/state files.

## Goal
Prove the ops-auth cookie token parser and login token extraction path locally,
then add direct architecture relation rows so the scanner no longer reports the
assigned anchor as an actionable missing-test link.

## Scope
- `scripts/resolveOpsAuthToken.mjs`
- `scripts/resolveOpsAuthToken.test.mjs`
- `docs/architecture/relations/priority-test-links.csv`
- generated architecture graph/awareness outputs under `docs/graphs/` and
  `docs/status/`
- project evidence/state files updated for closure

## Implementation Plan
1. Export the existing pure helpers from `scripts/resolveOpsAuthToken.mjs` so
   the parser can be tested directly without changing runtime behavior.
2. Add focused `node:test` coverage for:
   - decoded token cookie extraction;
   - missing/malformed cookie headers;
   - `getSetCookie()` precedence;
   - `resolveOpsAuthToken` login token extraction using injected `fetch`.
3. Add scanner-readable `LUC-2808` relation rows for
   `extractTokenFromSetCookie`, `readSetCookieHeaders`, and
   `resolveOpsAuthToken`.
4. Run focused syntax/tests, graph generation, Softwarehouse
   architecture-awareness refresh, and repository guardrails.

## Acceptance Criteria
- `extractTokenFromSetCookie` has direct local unit coverage.
- Login response cookie extraction is proven without network or secret usage.
- `docs/architecture/relations/priority-test-links.csv` contains direct
  `LUC-2808` relation rows for the assigned anchor.
- Refreshed architecture-awareness report no longer lists
  `scripts/resolveOpsAuthToken.mjs#extractTokenFromSetCookie` in Top
  Actionable Missing Test Links.

## Definition of Done
- Focused tests pass.
- Architecture relation readback passes.
- Architecture graph and Softwarehouse architecture-awareness refresh pass.
- Repository guardrails pass.
- No production, protected smoke, account, secret, exchange, database,
  deploy, push, restart, rollback, Docker Compose, or live-trading mutation
  occurs.
- Paperclip issue disposition is updated with evidence.

## Validation Evidence
- `node --check scripts/resolveOpsAuthToken.mjs` PASS.
- `node --check scripts/resolveOpsAuthToken.test.mjs` PASS.
- `node --test scripts/resolveOpsAuthToken.test.mjs` PASS (`4/4`).
- Direct relation readback PASS (`3` `LUC-2808` rows).
- `pnpm run architecture:graph:generate` PASS (`653` nodes / `842` relations /
  `27` chains).
- `node C:\Personal\Projekty\Aplikacje\Paperclip_Softwarehouse\scripts\build-architecture-awareness-index.mjs --project Soar --root C:\Personal\Projekty\Aplikacje\Soar`
  PASS (`14950` entities / `24191` relations / `9690` files).
- Refreshed `docs/status/architecture-awareness-report.md` generated
  `2026-06-07T12:50:57.059Z`, reports `315` actionable missing-test links, and
  no longer lists `extractTokenFromSetCookie` in Top Actionable Missing Test
  Links.
- `pnpm run quality:guardrails` PASS.

## Architecture Evidence
- Affected entities:
  - `scripts/resolveOpsAuthToken.mjs#extractTokenFromSetCookie`
  - `scripts/resolveOpsAuthToken.mjs#readSetCookieHeaders`
  - `scripts/resolveOpsAuthToken.mjs#resolveOpsAuthToken`
- Fits approved architecture: yes.
- Mismatch discovered: no.
- Architecture source reviewed: generated architecture-awareness report and
  priority test-link relation CSV.

## Security / Privacy Evidence
- Data classification: local fixture-only test data.
- Trust boundaries: no real production auth, no protected route smoke, no
  secret values.
- Secret handling: tests use non-secret fixture strings and injected `fetch`.
- Fail-closed behavior: existing `resolveOpsAuthToken` behavior still throws
  when login succeeds without a token cookie; this task did not weaken it.
- Residual risk: production protected auth binding remains owned by separate
  Security/Ops lanes.

## Result Report
- Task summary: added focused local coverage for the ops-auth set-cookie token
  parser and login token extraction path, plus scanner-readable direct
  relation rows for LUC-2808.
- Files changed:
  - `scripts/resolveOpsAuthToken.mjs`
  - `scripts/resolveOpsAuthToken.test.mjs`
  - `docs/architecture/relations/priority-test-links.csv`
  - generated architecture graph/awareness outputs
  - local evidence/state files
- How tested: syntax checks, focused `node:test`, relation readback,
  architecture graph generation, Softwarehouse architecture-awareness refresh,
  and repository guardrails.
- What is incomplete: no production protected auth proof was attempted or
  implied.
- Next steps: parent PM/TSA lane can continue from the refreshed top actionable
  missing-test list, currently headed by `scripts/dev-workers.mjs#handleWorkerExit`
  and generated journey index helpers.
- Decisions made: exported existing pure helper functions for direct local test
  coverage without changing runtime logic.
