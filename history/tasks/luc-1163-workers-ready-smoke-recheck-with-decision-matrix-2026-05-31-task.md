# Task

## Header
- ID: LUC-1163
- Title: [Soar][LUC-241][QA] Run /workers/ready smoke recheck with decision matrix
- Task Type: release
- Current Stage: verification
- Status: BLOCKED
- Owner: QA/Test
- Depends on: LUC-241, LUC-1145
- Priority: P1
- Module Confidence Rows: workers readiness protected gate
- Requirement Rows: protected /workers/ready production smoke proof
- Quality Scenario Rows: release readiness / protected route authz
- Risk Rows: authz proof gap on protected readiness route
- Iteration: 1
- Operation Mode: TESTER
- Mission ID: SOAR-FULL-READINESS-COORDINATION-2026-05-23
- Mission Status: BLOCKED

## Context
Issue requested a fresh QA smoke recheck for protected `GET /workers/ready` with a decision matrix, using current production hosts and redaction-safe evidence.

## Goal
Run one production smoke recheck and produce an explicit pass/block decision matrix for `/workers/ready` release evidence.

## Scope
- `history/artifacts/luc-1163-workers-ready-smoke-recheck-2026-05-31.json`
- `history/tasks/luc-1163-workers-ready-smoke-recheck-with-decision-matrix-2026-05-31-task.md`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`

## Implementation Plan
1. Execute production smoke check on canonical API/Web hosts.
2. Capture current build-info metadata (SHA/build id/time).
3. Build decision matrix with evidence statuses and owner/action for unblock.
4. Persist task evidence and sync project context files.

## Acceptance Criteria
- Smoke command executed once with output captured.
- Decision matrix includes explicit status for public probes and protected `/workers/ready`.
- Artifact and task report saved under `history/` with date.
- Project source-of-truth context files updated with this checkpoint.

## Constraints
- Read-only verification only; no deploy/runtime mutation.
- No secret values or auth material stored.
- Reuse existing smoke scripts and prior security packet constraints.

## Definition of Done
- [x] Production smoke recheck run completed and result captured.
- [x] Decision matrix recorded with concrete evidence and unblock owner/action.
- [x] Task checkpoint documented in durable repo artifacts.

## Validation Evidence
- Tests:
  - `corepack pnpm run -s ops:deploy:smoke -- --api-base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch` => FAIL (`API /workers/ready -> 401`; all public checks PASS)
- Manual checks:
  - `Invoke-RestMethod https://soar.luckysparrow.ch/api/build-info` => `gitSha=6839cd6b8884e26eca735ce32cea98c1dadccfbe`
- Screenshots/logs:
  - Command summary in this task + JSON artifact.
- High-risk checks:
  - Protected endpoint auth boundary remains fail-closed (`401`).
- Reality status: blocked

## Decision Matrix
| Gate | Status | Evidence | Decision |
| --- | --- | --- | --- |
| Public API/Web reachability | implemented and verified | `/health`, `/ready`, `/`, `/api/build-info` all `200` | PASS |
| Protected worker readiness | blocked by error | `/workers/ready` returns `401` | FAIL |
| Read-only permission contract | implemented and verified | `history/releases/luc-1145-workers-ready-read-only-permission-decision-packet-2026-05-31.md` | PASS (policy), not sufficient for runtime proof |
| Release gate for workers-ready | blocked | protected proof absent (`401`) | NO-GO |

## Deployment / Ops Evidence
- Deploy impact: none
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no
- Rollback note: not applicable
- Observability or alerting impact: none

## Result Report
- Task summary:
  - Executed one canonical production smoke recheck and captured a fresh decision matrix.
  - Public production endpoints remain healthy.
  - Protected `/workers/ready` remains blocked by `401`.
- Files changed:
  - `history/artifacts/luc-1163-workers-ready-smoke-recheck-2026-05-31.json`
  - `history/tasks/luc-1163-workers-ready-smoke-recheck-with-decision-matrix-2026-05-31-task.md`
  - `.codex/context/TASK_BOARD.md`
  - `.codex/context/PROJECT_STATE.md`
- How tested:
  - production smoke command + build-info readback.
- What is incomplete:
  - authenticated protected readiness proof (`GET /workers/ready` -> `200`).
- Next steps:
  1. Ops Release Lead + auth credential owner provide/validate fresh approved read-only auth path for `/workers/ready`.
  2. Run exactly one protected smoke recheck with that auth path and publish redaction-safe result.
- Decisions made:
  - Issue remains `blocked` on protected authz evidence; no deploy/runtime changes authorized in this lane.

## Continuation Checkpoint (issue_continuation_needed)
- Wake acknowledged from inline payload (`fallbackFetchNeeded=false`, comments `0/0`, latest comment id `unknown`).
- Concrete action in this heartbeat:
  - reran exactly one canonical production smoke check:
    - `corepack pnpm run -s ops:deploy:smoke -- --api-base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch`
  - refreshed build-info readback:
    - `gitSha=6839cd6b8884e26eca735ce32cea98c1dadccfbe`
    - `buildId=9_MzvzTWKAhz25Nco5xPY`
    - `metadataGeneratedAt=2026-05-31T15:39:59.210Z`
- Recheck result:
  - public checks remain `PASS` (`/health`, `/ready`, `/`, `/api/build-info` all `200`)
  - protected `GET /workers/ready` remains `FAIL` (`401`)
- Continuation disposition: `blocked` (no unblock evidence delta in this wake).
