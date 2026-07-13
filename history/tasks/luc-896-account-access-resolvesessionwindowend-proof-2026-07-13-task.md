# Task

## Header
- ID: LUC-896
- Title: Account access `resolveSessionWindowEnd` proof
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: QA Regression Lead
- Depends on: none
- Priority: P1
- Iteration: 1
- Operation Mode: BUILDER
- Mission ID: LUC-896-ACCOUNT-ACCESS-RESOLVESESSIONWINDOWEND-PROOF-2026-07-13

## Context

`docs/status/project-truth-index.md` routes the first Account access
`implemented_needs_proof` gap to
`apps/api/src/modules/bots/botOwnership.service.ts#resolveSessionWindowEnd`.
The prior heartbeat was cancelled by the control plane, so the required next
step was to rerun the smallest executable proof locally.

## Goal

Prove the implemented session-window boundary behavior for
`resolveSessionWindowEnd`.

## Constraints

- Use the existing API test surface.
- No runtime code, deploy, push, restart, rollback, env edits, or protected
  account/session checks.
- Keep the scope to the single helper proof row.

## Definition of Done

- [x] Direct executable proof covers finished, running, and stale session
      behavior.
- [x] Focused test run passes.
- [x] Durable evidence records the proof outcome.

## Validation Evidence

- Tests:
  - `pnpm --filter api exec vitest run src/modules/bots/botOwnership.service.test.ts --run --reporter=dot`
- Reality status: verified

## Result Report

- Task summary:
  - added direct helper tests and verified the helper's fallback behavior with
    a deterministic clock.
- Files changed:
  - `apps/api/src/modules/bots/botOwnership.service.test.ts`
  - `history/evidence/luc-896-account-access-resolvesessionwindowend-proof-2026-07-13.md`
  - `history/tasks/luc-896-account-access-resolvesessionwindowend-proof-2026-07-13-task.md`
- How tested:
  - focused Vitest run for the bot ownership spec file.
- What is incomplete:
  - generated truth still routes the helper as `implemented_needs_proof` until
    the local state bridge is refreshed.
- Next steps:
  - sync the proof result into the local project truth/state files if the
    current run needs that bridge updated.
