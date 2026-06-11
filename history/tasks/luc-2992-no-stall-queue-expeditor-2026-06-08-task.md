# LUC-2992 No-Stall Queue Expeditor

## Header
- ID: LUC-2992-NO-STALL-QUEUE-EXPEDITOR-2026-06-08
- Title: [Soar][PM] No-stall queue expeditor
- Task Type: coordination
- Current Stage: planning
- Status: DONE / DELEGATED
- Owner: Soar Product Manager
- Priority: P0
- Mission ID: LUC-2992-NO-STALL-QUEUE-EXPEDITOR-2026-06-08
- Mission Status: CHECKPOINTED

## Context
[LUC-2992](/LUC/issues/LUC-2992) woke as a critical Soar Product Manager routine execution under [LUC-12](/LUC/issues/LUC-12). The wake payload had no pending comments, `fallbackFetchNeeded=false`, and the checkout was already claimed by the harness.

## Goal
Inspect the current Soar V1 no-stall queue, avoid duplicate/protected-lane churn, and leave one clear owner-scoped handoff.

## Scope
- Paperclip issue context for [LUC-2992](/LUC/issues/LUC-2992).
- Current architecture-awareness report at `docs/status/architecture-awareness-report.md`.
- Existing source-truth and issue history for recent missing-test helper-family lanes.
- Paperclip child issue creation only.

## Implementation Plan
1. Read scoped Paperclip wake/heartbeat context.
2. Inspect current architecture-awareness actionable missing-test rows.
3. Filter duplicate/protected/browser helper families already covered by prior owner lanes.
4. Select the next local-safe owner-scoped gap.
5. Create a child issue for the responsible specialist.
6. Record evidence and close the PM heartbeat.

## Acceptance Criteria
- [LUC-2992](/LUC/issues/LUC-2992) has a terminal Paperclip disposition.
- One actionable next lane has a named owner, scope, proof contract, and safety boundary.
- No product code implementation, production proof, secret, deploy, push, restart, rollback, database mutation, exchange, order, position, account, payment/subscription, or live-trading mutation occurs.

## Definition of Done
- [x] Paperclip heartbeat context read.
- [x] Current architecture-awareness top rows inspected.
- [x] Duplicate/protected rows classified against prior lanes.
- [x] Child issue created for the next local-safe gap.
- [x] Project state/evidence updated.

## Validation Evidence
- `GET /api/issues/LUC-2992/heartbeat-context` passed: issue `in_progress`, priority `critical`, parent [LUC-12](/LUC/issues/LUC-12), zero comments, zero first-class blockers.
- `GET /api/issues/LUC-2992` passed: checkout/execution run owned by the current harness run, project `Soar`, goal `Soar V1 audit-to-completion loop`.
- `docs/status/architecture-awareness-report.md` generated `2026-06-08T00:08:49.364Z` reports `118` actionable implementation entities without inferred tests.
- Current top actionable rows include protected/browser helper families already covered or classified by prior lanes, plus `scripts/runQaRepeatableSmokeE2e.mjs#hasFlag`, `#readArgValue`, and `#runCheck`.
- Duplicate search found aggregate `runQaRepeatableSmokeE2e` evidence and wrapper-level relations, but `Test-Path scripts/runQaRepeatableSmokeE2e.test.mjs` returned `False`.
- `node --check scripts/runQaRepeatableSmokeE2e.mjs` passed.
- `corepack pnpm softwarehouse:control-tick` failed because the command is unavailable in this checkout: `Command "softwarehouse:control-tick" not found`.
- `GET /api/companies/{companyId}/agents` identified Test Automation Engineer `3496f8c7-b4e6-4078-8f7e-58a84a05cfb7` as idle.
- Created [LUC-2995](/LUC/issues/LUC-2995), assigned to Test Automation Engineer, to resolve or explicitly classify the repeatable QA smoke helper missing-test rows.

## Architecture Evidence
- Architecture source reviewed: `docs/status/architecture-awareness-report.md`, `docs/graphs/architecture-health.json`, `docs/architecture/relations/priority-test-links.csv`.
- Affected entities:
  - `scripts/runQaRepeatableSmokeE2e.mjs#hasFlag`
  - `scripts/runQaRepeatableSmokeE2e.mjs#readArgValue`
  - `scripts/runQaRepeatableSmokeE2e.mjs#runCheck`
- Fits approved architecture: yes.
- Mismatch discovered: no.
- Decision required from user: no.

## Result Report
- Task summary: PM routed the next local-safe no-stall gap to Test Automation instead of reopening protected/browser proof lanes or implementing code directly.
- Files changed: `history/tasks/luc-2992-no-stall-queue-expeditor-2026-06-08-task.md`, `.agents/state/active-mission.md`, `.agents/state/next-steps.md`, `.codex/context/PROJECT_STATE.md`, `.codex/context/TASK_BOARD.md`.
- Paperclip issue created: [LUC-2995](/LUC/issues/LUC-2995).
- Tests/checks run: Paperclip API readbacks, architecture report inspection, duplicate search, `Test-Path scripts/runQaRepeatableSmokeE2e.test.mjs`, `node --check scripts/runQaRepeatableSmokeE2e.mjs`.
- Not run: production smoke, protected proof, full go-live smoke, deploy, push, restart, rollback, database mutation, exchange/account/payment/live-trading actions.
- Residual risk: [LUC-2995](/LUC/issues/LUC-2995) must either add focused local helper proof/relation rows or explicitly classify why aggregate smoke artifacts are sufficient for the three helper anchors.
- Next owner: Test Automation Engineer.
