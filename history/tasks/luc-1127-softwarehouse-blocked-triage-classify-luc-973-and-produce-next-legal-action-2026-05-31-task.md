# Task

## Header
- ID: LUC-1127
- Title: [Softwarehouse][Blocked Triage] Classify LUC-973 and produce next legal action
- Task Type: research
- Current Stage: verification
- Status: DONE
- Owner: Review
- Depends on: LUC-973
- Priority: P1
- Iteration: 1
- Operation Mode: BUILDER
- Mission ID: LUC-1127-BLOCKED-TRIAGE-2026-05-31
- Mission Status: VERIFIED

## Context
Wake payload assigned this heartbeat with `fallbackFetchNeeded=false`, no pending comments (`0/0`), and required concrete action for triage disposition. `LUC-973` already contains read-only deploy diagnostics and explicit blocker routing.

## Goal
Classify `LUC-973` from current durable evidence and publish the next legal action path without reopening implementation scope.

## Constraints
- Engineering Delivery Lead lane only (classification and routing; no feature coding).
- No deploy/restart/credentials mutation.
- Preserve fail-closed blocker handling.

## Definition of Done
- [x] `LUC-973` disposition classified from canonical evidence.
- [x] One legal next action path named with owner and unblock action.
- [x] Source-of-truth context files updated with this triage output.

## Validation Evidence
- Tests: not applicable (triage classification lane).
- Manual checks:
  - `rg -n "LUC-973|workers/ready|finish_successful_run_handoff|issue_commented" history/tasks .codex/context -S`
  - reviewed `history/tasks/luc-973-verify-last-failed-deploys-and-route-repair-2026-05-31-task.md`
  - reviewed `TASK_BOARD` and `PROJECT_STATE` canonical `LUC-973` entries.
- Reality status: verified.

## Result Report
- Classification:
  - `LUC-973` remains `blocked`.
  - Public SHA/health evidence exists, but protected `GET /workers/ready` proof remains blocked (`401` without approved read-only auth principal), and temp-domain recovery is not evidenced.
- Next legal action:
  1. Keep `LUC-973` blocked until Security/Test + credential owner provide approved read-only auth path for protected `/workers/ready`.
  2. Keep temp-domain lane blocked until Coolify operator/release controller provides recovery evidence or explicit accepted no-temp-stack decision.
  3. After both inputs, Ops executes exactly one read-only recheck sweep and publishes redaction-safe evidence.
- Commit: not committed (docs/state triage artifact only).
- Push: not needed.
- Deploy impact: none.
