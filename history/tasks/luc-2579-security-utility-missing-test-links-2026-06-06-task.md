# Task

## Header
- ID: LUC-2579
- Title: Cover architecture missing-test links for crypto/hash/error exposure utilities
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Security
- Depends on: [LUC-2574](/LUC/issues/LUC-2574)
- Priority: P1
- Module Confidence Rows: `SOAR-SECURITY-PRIVACY-001`, `SOAR-PROFILE-API-KEYS-001`, Architecture Evidence Graph
- Requirement Rows: `REQ-DOC-031`
- Quality Scenario Rows: `QA-005`, `QA-018`
- Risk Rows: `RISK-005`, `RISK-018`
- Iteration: 2026-06-06
- Operation Mode: BUILDER
- Mission ID: `LUC-2579-SECURITY-UTILITY-MISSING-TEST-LINKS-2026-06-06`
- Mission Status: VERIFIED

## Context
[LUC-2579](/LUC/issues/LUC-2579) was assigned to Security and Privacy Auditor
as an architecture-backed repair slice from [LUC-2574](/LUC/issues/LUC-2574).
The source report listed missing-test links for `apps/api/src/utils/crypto.ts`,
`errorExposure.ts`, `formatZodError.ts`, and `hash.ts`.

## Goal
Classify existing utility coverage, add focused local tests where meaningful,
and repair scanner-readable test links without exposing secrets or mutating
production/protected systems.

## Scope
- `apps/api/src/utils/securityUtilities.test.ts`
- `docs/architecture/relations/priority-test-links.csv`
- Regenerated architecture-awareness exports under `docs/graphs/` and
  `docs/status/`
- State/evidence updates in `.agents/state/*`, `.codex/context/*`, and this
  artifact

## Implementation Plan
1. Read the issue heartbeat context and classify existing tests.
2. Reuse existing `crypto.test.ts` coverage for AES-GCM versioned encrypt,
   decrypt, active-version failure, key version lookup, and legacy CBC decrypt.
3. Add focused local tests for production error exposure, validation
   formatting/no raw payload leakage, and bcrypt hash/compare behavior.
4. Add direct priority test links for the function anchors reported by the
   architecture-awareness top actionable missing-test list.
5. Refresh architecture-awareness exports and run focused verification.

## Acceptance Criteria
- Focused API utility tests pass.
- `priority-test-links.csv` contains direct rows for the requested utility
  function anchors.
- Refreshed architecture-awareness report no longer lists the targeted utility
  functions in top actionable missing-test links.
- No secret values, credentials, cookies, payment data, exchange credentials,
  production probes, deploy, protected smoke, account mutation, database
  mutation, or live-trading action occurs.

## Definition of Done
- [x] Existing coverage classified.
- [x] Focused utility tests added where meaningful coverage was absent.
- [x] Scanner-readable relations added.
- [x] Focused tests, graph checks, guardrails, and diff check run.
- [x] Source-of-truth state and task evidence updated.

## Validation Evidence
- Paperclip heartbeat-context readback for [LUC-2579](/LUC/issues/LUC-2579):
  PASS; issue had no comments and no blockers.
- Focused API tests: `pnpm --filter api exec vitest run src/utils/crypto.test.ts src/utils/securityUtilities.test.ts --run`
  - PASS: `2` files, `11` tests.
- Architecture-awareness refresh: `node scripts/build-architecture-awareness-index.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar`
  - PASS: `14700` entities, `23312` relations.
- Strict graph drift: `pnpm run architecture:graph:drift:strict`
  - PASS: `838/838` covered, `0` missing.
- Repository guardrails: `pnpm run quality:guardrails`
  - PASS.
- Diff check: `git diff --check`
  - PASS with existing Windows line-ending warnings only.
- Targeted report readback:
  - `rg -n "apps/api/src/utils/(crypto|errorExposure|formatZodError|hash)\\.ts" docs/status/architecture-awareness-report.md docs/graphs/architecture-awareness.csv docs/architecture/relations/priority-test-links.csv`
  - PASS: rows are present in relation/graph readback and absent from
    `docs/status/architecture-awareness-report.md` top actionable missing-test
    links.

## Architecture Evidence
- Architecture source reviewed: `docs/status/architecture-awareness-report.md`,
  `docs/graphs/architecture-awareness.csv`,
  `docs/architecture/relations/priority-test-links.csv`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Follow-up architecture doc updates: regenerated architecture-awareness
  exports after relation/test changes.

## Security / Privacy Evidence
- Data classification: secret-handling and error-disclosure utility proof.
- Trust boundaries: local unit tests only; no production or protected
  credential path used.
- Permission or ownership checks: not applicable to these pure utility tests.
- Abuse cases:
  - sensitive Prisma/network/database messages are classified as internal
    exposure risks;
  - production redaction returns generic fallback text for infrastructure
    errors;
  - Zod formatting returns field/message only and does not include raw payload
    values;
  - non-Zod validation errors return generic validation messages;
  - bcrypt compare succeeds only for matching plaintext.
- Secret handling: only synthetic local strings were used; no secret values,
  API keys, cookies, tokens, payment data, or exchange credentials were read,
  printed, stored, or attached.
- Fail-closed behavior: missing active crypto key remains covered by
  `crypto.test.ts`; production-sensitive error messages redact; incorrect
  password comparison fails.
- Residual risk: protected production credential/browser/exchange proof remains
  outside this issue and still belongs to existing protected-gate lanes.

## Result Report
- Task summary: closed the architecture missing-test utility slice with focused
  local tests, direct priority test links, refreshed architecture-awareness
  exports, and source-of-truth evidence.
- Files changed:
  - `apps/api/src/utils/securityUtilities.test.ts`
  - `docs/architecture/relations/priority-test-links.csv`
  - regenerated architecture-awareness exports under `docs/graphs/` and
    `docs/status/`
  - `.agents/state/active-mission.md`
  - `.agents/state/module-confidence-ledger.md`
  - `.agents/state/next-steps.md`
  - `.agents/state/requirements-verification-matrix.md`
  - `.codex/context/PROJECT_STATE.md`
  - `.codex/context/TASK_BOARD.md`
  - `history/tasks/luc-2579-security-utility-missing-test-links-2026-06-06-task.md`
- How tested: focused API Vitest, architecture-awareness refresh, strict graph
  drift, repository guardrails, diff check, and targeted report readback.
- What is incomplete: nothing remains for this local repair issue.
- Next steps: do not create duplicate repair lanes unless a future report or
  focused regression reopens a concrete utility gap.
- Decisions made: no production or protected proof was attempted because this
  issue only authorized local audit/test proof and relation repair.
