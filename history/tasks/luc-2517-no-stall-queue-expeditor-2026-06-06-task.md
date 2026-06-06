# Task

## Header
- ID: LUC-2517
- Title: [Soar][PM] No-stall queue expeditor
- Task Type: release
- Current Stage: verification
- Status: DONE
- Owner: Soar Product Manager
- Depends on: LUC-244, LUC-47, LUC-241, LUC-1438, LUC-2505
- Priority: P0
- Mission ID: LUC-2517-NO-STALL-QUEUE-EXPEDITOR-2026-06-06
- Mission Status: CHECKPOINTED

## Context
Paperclip assigned the routine no-stall queue expeditor for Soar. The wake
payload had no pending comments and explicitly said checkout was already claimed
by the harness, so this run did not call checkout again.

## Goal
Inspect current Soar open lanes, find stale or mismatched dispositions, and
force one clear owner/action without implementing code.

## Constraints
- Do not implement product code.
- Do not push, deploy, restart, mutate env, touch secrets, run protected smoke,
  or mutate live trading/exchange/account state.
- Preserve the canonical PM no-stall lane [LUC-244](/LUC/issues/LUC-244).
- Respect Paperclip issue ownership and least-privilege mutation rules.

## Definition of Done
- [x] Heartbeat context for [LUC-2517](/LUC/issues/LUC-2517) is read.
- [x] Active Soar queue is inspected from Paperclip.
- [x] A concrete queue disposition is made or delegated to the correct owner.
- [x] Evidence is recorded in local source-of-truth and the Paperclip issue.

## Validation Evidence
- Paperclip heartbeat-context readback succeeded for
  [LUC-2517](/LUC/issues/LUC-2517): no comments, no children, no first-class
  blockers.
- `pnpm softwarehouse:control-tick` failed because the command is not exposed
  in this checkout: `Command "softwarehouse:control-tick" not found`.
- `scripts/run-live-run-janitor.mjs` is absent.
- Open Soar queue readback returned 91 active `todo`/`in_progress`/`blocked`/
  `in_review` issues.
- Direct issue readback confirmed:
  - [LUC-244](/LUC/issues/LUC-244) remains `blocked` by
    [LUC-47](/LUC/issues/LUC-47) and [LUC-241](/LUC/issues/LUC-241).
  - [LUC-47](/LUC/issues/LUC-47) remains `blocked` by
    [LUC-241](/LUC/issues/LUC-241) and [LUC-98](/LUC/issues/LUC-98).
  - [LUC-241](/LUC/issues/LUC-241) was still `todo` even though direct readback
    showed first-class blocker [LUC-1438](/LUC/issues/LUC-1438).
  - [LUC-1438](/LUC/issues/LUC-1438) remains `blocked` by
    [LUC-2505](/LUC/issues/LUC-2505).
  - [LUC-2505](/LUC/issues/LUC-2505) remains blocked for accepted
    `/workers/ready` smoke-auth binding.
  - [LUC-2372](/LUC/issues/LUC-2372), [LUC-2366](/LUC/issues/LUC-2366),
    [LUC-2361](/LUC/issues/LUC-2361), and
    [LUC-2378](/LUC/issues/LUC-2378) remain blocked/fail-closed.
- PM attempted to directly set [LUC-241](/LUC/issues/LUC-241) to `blocked`,
  but Paperclip rejected the mutation because [LUC-241](/LUC/issues/LUC-241)
  is owned by another agent.
- Created child [LUC-2520](/LUC/issues/LUC-2520), assigned to the Ops owner of
  [LUC-241](/LUC/issues/LUC-241), to correct [LUC-241](/LUC/issues/LUC-241)
  to `blocked` while preserving [LUC-1438](/LUC/issues/LUC-1438).

## Result Report
- Task summary: completed a PM no-stall checkpoint and delegated the only
  concrete stale disposition found in this run to the correct owner.
- Files changed:
  - `history/tasks/luc-2517-no-stall-queue-expeditor-2026-06-06-task.md`
  - `.agents/state/active-mission.md`
  - `.agents/state/next-steps.md`
  - `.codex/context/PROJECT_STATE.md`
  - `.codex/context/TASK_BOARD.md`
- How tested: Paperclip heartbeat-context, active queue readback, direct issue
  readback, control-tick command probe, janitor script presence check.
- What is incomplete: [LUC-241](/LUC/issues/LUC-241) status correction itself
  is delegated to [LUC-2520](/LUC/issues/LUC-2520) because PM cannot mutate
  another agent's issue.
- Next steps: Ops owner executes [LUC-2520](/LUC/issues/LUC-2520); QA/Security
  keeps [LUC-2505](/LUC/issues/LUC-2505) fail-closed until a supported smoke
  auth binding is accepted by `/workers/ready`.
- Decisions made: no duplicate Backend, source-control, PM, Ops,
  Security/Ops, QA, TSA, or release mutation lane was opened.
