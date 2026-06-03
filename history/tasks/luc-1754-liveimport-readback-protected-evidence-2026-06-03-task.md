# Task

## Header
- ID: LUC-1754-LIVEIMPORT-READBACK-PROTECTED-EVIDENCE-2026-06-03
- Title: Produce LIVEIMPORT_READBACK protected evidence
- Task Type: release
- Current Stage: verification
- Status: BLOCKED
- Owner: Integration Trading Engineer
- Depends on: approved transient read-only production app auth/session for `LIVEIMPORT_READBACK_*`
- Priority: P0
- Module Confidence Rows: SOAR-OPERATIONS-001
- Requirement Rows: REQ-FUNC-021
- Quality Scenario Rows: operations release safety
- Risk Rows: RISK-021
- Iteration: 2026-06-03 LUC-1754 heartbeat
- Operation Mode: TESTER
- Mission ID: LUC-1754-LIVEIMPORT-READBACK-PROTECTED-EVIDENCE-2026-06-03
- Mission Status: BLOCKED

## Context

`LUC-1754` asks for redaction-safe read-only protected runtime/imported-position evidence tied to the current expected SHA/date. The wake payload had no pending comments and no fallback fetch requirement. The issue was already checked out by the harness and remained `in_progress`.

## Goal

Run the smallest existing proof path for `LIVEIMPORT_READBACK`, capture the actual result without secrets, and leave the issue in a truthful final disposition.

## Scope

- `history/artifacts/luc-1754-protected-input-readiness-6839cd6b-2026-06-03.json`
- `history/evidence/luc-1754-protected-input-readiness-6839cd6b-2026-06-03.md`
- `history/artifacts/luc-1754-liveimport-readback-failclosed-6839cd6b-2026-06-03.json`
- `history/evidence/luc-1754-liveimport-readback-failclosed-6839cd6b-2026-06-03.md`
- `.agents/state/active-mission.md`
- `.agents/state/module-confidence-ledger.md`
- `.codex/context/PROJECT_STATE.md`
- `.codex/context/TASK_BOARD.md`

## Implementation Plan

1. Read the scoped Paperclip heartbeat context for `LUC-1754`.
2. Check current production build-info.
3. Run protected input readiness for the current SHA/date.
4. Run existing `LIVEIMPORT_READBACK` collector with auto symbol discovery.
5. Record pass or fail-closed evidence without secret values.
6. Update source-of-truth files and block/delegate if protected auth is absent.

## Acceptance Criteria

- Evidence identifies current production SHA/date.
- Evidence reports command/probe results and redaction checks.
- No secret values are stored.
- If protected session/principal is absent, the issue is blocked with a named owner/action.

## Definition of Done

- [x] Current build-info SHA is recorded.
- [x] Protected input readiness is recorded.
- [x] `LIVEIMPORT_READBACK` collector was attempted and failed closed before protected runtime/imported-position readback.
- [x] Source-of-truth files are updated.
- [x] Paperclip issue is moved to final blocked disposition with first-class blocker `LUC-1765`.

## Forbidden

- Exchange mutation, order placement, account setting changes, secret disclosure, deploy, restart, rollback, DB write, or fabricated proof.

## Validation Evidence

- `GET /api/issues/LUC-1754/heartbeat-context` -> pass; issue read as `in_progress`, critical, assigned, and unblocked.
- `Invoke-RestMethod https://soar.luckysparrow.ch/api/build-info` -> PASS, `gitSha=6839cd6b8884e26eca735ce32cea98c1dadccfbe`, `gitRef=main`, `checkedAt=2026-06-03T13:12:53.834Z`.
- `node scripts/checkProtectedInputReadiness.mjs --today 2026-06-03 --expected-sha 6839cd6b8884e26eca735ce32cea98c1dadccfbe --git-ref main --build-info-checked-at 2026-06-03T13:12:53.834Z --json-output history/artifacts/luc-1754-protected-input-readiness-6839cd6b-2026-06-03.json --markdown-output history/evidence/luc-1754-protected-input-readiness-6839cd6b-2026-06-03.md` -> BLOCKED, `0` matching protected input names.
- `node scripts/collectLiveImportReadbackEvidence.mjs --expected-sha 6839cd6b8884e26eca735ce32cea98c1dadccfbe --symbols auto --output history/artifacts/luc-1754-liveimport-readback-6839cd6b-2026-06-03.json` -> expected exit `1`, fail-closed before protected runtime readback because `LIVEIMPORT_READBACK_AUTH_TOKEN` or `LIVEIMPORT_READBACK_AUTH_EMAIL` + `LIVEIMPORT_READBACK_AUTH_PASSWORD` are absent.

## Security / Privacy Evidence

- Data classification: production build metadata and protected-input name presence only.
- Secret handling: no raw secrets printed or stored.
- Fail-closed behavior: collector exited `1` before protected runtime/imported-position readback.
- Residual risk: `LIVEIMPORT_READBACK` evidence remains absent until approved protected auth/session is provided.

## Result Report

- Task summary: Current production build-info is `6839cd6b8884e26eca735ce32cea98c1dadccfbe`; protected input readiness for this SHA/date is `BLOCKED` with `0` matching names; `LIVEIMPORT_READBACK` collector fails closed before runtime/imported-position readback because the required read-only production auth/session is absent.
- Files changed: task artifact; fail-closed evidence artifact; protected-input readiness artifact; project state/task board/active mission/module confidence ledger updates.
- How tested: public build-info readback, `checkProtectedInputReadiness`, and `collectLiveImportReadbackEvidence` fail-closed run.
- What is incomplete: actual protected runtime/imported-position readback.
- Next steps: Security/Ops owner path must complete `LUC-1765` by providing or binding an approved transient read-only production principal/session in `LIVEIMPORT_READBACK_*`, then rerun the collector against the current production SHA.
- Decisions made: current proof target follows production `/api/build-info` (`6839cd6b...`), not historical `71b8d503...`.
