# Task

## Header
- ID: LUC-1717
- Title: Fix non-v1 local readiness keyring version inference
- Task Type: fix
- Current Stage: verification
- Status: VERIFIED
- Owner: 09 EDL
- Depends on: none
- Priority: P0
- Module Confidence Rows: not updated; scoped local dev helper fix
- Requirement Rows: not updated; existing local readiness contract aligned
- Quality Scenario Rows: not updated
- Risk Rows: not updated
- Iteration: 1
- Operation Mode: BUILDER
- Mission ID: LUC-1717-local-readiness-keyring-inference
- Mission Status: VERIFIED

## Context
`scripts/dev-backend.mjs` builds a process-local readiness overlay for API/worker child processes. When a local developer configured a valid non-`v1` single-version keyring without `API_KEY_ENCRYPTION_ACTIVE_VERSION`, the helper still overlaid `v1`, which caused child runtime readiness to fail against an otherwise valid local keyring.

## Goal
Keep local readiness fail-closed while correctly inferring the single configured keyring version for non-`v1` local keyrings.

## Constraints
- reuse the existing local readiness helper
- do not relax stage/prod secret requirements
- do not introduce a fallback that guesses across multi-version keyrings

## Definition of Done
- [x] local readiness overlay infers the single configured keyring version when active version is absent
- [x] production/API critical secret readiness semantics remain unchanged
- [x] focused automated script regression test proves the non-`v1` path

## Forbidden
- defaulting multi-version keyrings to an arbitrary version
- broad secret-readiness contract changes outside the local inference bug
- unrelated cleanup in existing dirty worktree files

## Validation Evidence
- Tests: `node --test scripts/dev-backend.test.mjs`
- Manual checks: code-path review of `buildLocalReadinessEnv()` and zero diff confirmation for `apps/api/src/config/criticalSecretsReadiness.*`
- Screenshots/logs: see `history/evidence/luc-1717-non-v1-local-readiness-keyring-version-inference-2026-07-23.md`
- High-risk checks: not applicable; local/dev readiness only
- Reality status: verified

## Result Report
- Added single-version keyring inference to the local backend/dev readiness overlay.
- Kept `apps/api/src/config/criticalSecretsReadiness.*` on `HEAD` semantics per board scope correction.
- Added the focused script regression test for the non-`v1` path.
