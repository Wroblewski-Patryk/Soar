# Task

## Header
- ID: LUC-27
- Title: Soar build-to-production blocked parent closeout
- Task Type: release
- Current Stage: release
- Status: BLOCKED
- Owner: Ops/Release
- Priority: P0
- Iteration: 2026-07-23
- Operation Mode: BUILDER
- Mission ID: LUC-27-SOAR-BUILD-TO-PRODUCTION-BLOCKED-CLOSEOUT-2026-07-23
- Mission Status: BLOCKED

## Context
`LUC-27` is the parent Soar build-to-production mission. The runtime recovery
chain is green on production, generated project truth reports zero gaps, and
the deployed production SHA is known exactly. However, the current local
workspace `HEAD` is materially ahead of production, so the parent cannot close
as a released build-to-production success for the local candidate.

## Goal
Record a durable parent-level blocked disposition that preserves the green
runtime evidence while making the remaining release-parity gate explicit.

## Scope
- Integrate the final runtime, QA, security, docs, and release-truth evidence.
- State exactly why `LUC-27` cannot close as `done`.
- Name the unblock owner path for the local unreleased candidate.
- Refresh source-of-truth state files only.

## Constraints
- No push, deploy, restart, rollback, env edit, or production mutation.
- Do not misclassify the green production runtime as proof for unreleased local
  commits.
- Keep the blocker concrete and first-class.

## Implementation Plan
1. Re-read current repo source-of-truth for the parent mission.
2. Write a dedicated `LUC-27` blocked closeout task/evidence packet.
3. Align mission and state summaries to the real blocked disposition.
4. Run bounded packet validation.
5. Preserve the packet in local source control.

## Acceptance Criteria
- `LUC-27` has a dedicated parent closeout packet.
- The packet explicitly separates tested production SHA
  `b0b2c2ce9477a32fcda7717f447ad46aa4327589` from local `HEAD`
  `40cfb8f2cf913966f9c7159b49ae256b2aebbcaa`.
- The `142`-commit source/deploy gap is preserved as the first-class blocker.
- The unblock path names real owners/actions instead of leaving `in_progress`
  without a live continuation path.
- State files are consistent with the blocked parent disposition.

## Definition of Done
- [x] Parent blocked closeout task/evidence packet exists.
- [x] Source-of-truth summaries align to `blocked`.
- [x] Exact tested production SHA and local unreleased delta are explicit.
- [x] Unblock owner path is named.
- [x] Bounded validation passed.

## Forbidden
- closing `LUC-27` as `done` on runtime evidence alone
- treating local `HEAD` as production-tested
- vague “continue later” wording without a concrete unblock path
- hidden deploy or source-control mutation

## Validation Evidence
- Tests:
  `pnpm run quality:guardrails`
- Manual checks:
  `git diff --check`
  `git status --short`
- Screenshots/logs:
  not applicable
- High-risk checks:
  confirmed the parent packet preserves the exact Thursday, July 23, 2026
  tested SHA and the unreleased 142-commit local boundary.
- Module confidence ledger updated: not applicable
- Requirements matrix updated: not applicable
- Quality scenarios updated: not applicable
- Risk register updated: not applicable
- Reality status: blocked

## Result Report
- Outcome:
  `LUC-27` is now documented locally as
  `BLOCKED / RELEASE_PARITY_NOT_ACHIEVED`. Production runtime is green and
  project truth is clean, but the local release candidate is not yet reviewed,
  pushed, deployed, and re-verified on production.
- Blocker:
  local workspace `HEAD`
  `40cfb8f2cf913966f9c7159b49ae256b2aebbcaa` remains 142 commits ahead of the
  deployed/tested production SHA
  `b0b2c2ce9477a32fcda7717f447ad46aa4327589`.
- Unblock owner path:
  CRS/QVE/Security independently review exact candidate `40cfb8f2...`, then
  Release owner requests formal no-force push approval, verifies GitHub parity,
  requests component-specific production deployment approval, and reruns fresh
  public/protected smoke on the deployed candidate.
- Files changed:
  `history/tasks/luc-27-soar-build-to-production-blocked-closeout-2026-07-23-task.md`,
  `history/evidence/luc-27-soar-build-to-production-blocked-closeout-2026-07-23.md`,
  `.agents/state/active-mission.md`,
  `.agents/state/next-steps.md`,
  `.agents/state/system-health.md`,
  `.codex/context/TASK_BOARD.md`,
  `.codex/context/PROJECT_STATE.md`.
