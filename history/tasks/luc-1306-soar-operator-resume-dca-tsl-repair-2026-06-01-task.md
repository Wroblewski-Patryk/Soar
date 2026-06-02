# Task

## Header
- ID: LUC-1306
- Title: [Soar][Operator] Wznowic naprawe DCA/TSL i doprowadzic aplikacje do poprawnego dzialania
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Soar Project Manager (Coordinator)
- Priority: P0
- Mission ID: SOAR-FULL-READINESS-COORDINATION-2026-05-23
- Mission Status: CHECKPOINTED

## Context
Operator requested resuming DCA/TSL repair. Local runtime DCA/TSL parity signal was required first.

## Goal
Restore reliable DCA/TSL parity proof path by removing false-negative test timeouts and keeping the next runtime validation step executable.

## Scope
- `apps/api/src/modules/engine/runtimePositionAutomation.dcaTpParity.test.ts`
- `history/evidence/luc-1306-dca-tsl-runtime-parity-checkpoint-2026-06-01.md`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`

## Implementation Plan
1. Reproduce DCA/TSL focused test failures.
2. Isolate root cause (logic regression vs test-runtime dependency leak).
3. Apply minimal fix.
4. Re-run focused verification.
5. Record evidence and next live step.

## Acceptance Criteria
- Focused DCA/TSL parity suite executes without timeout.
- Assertions still verify DCA-first TP/SL behavior.
- Evidence and project state updated.

## Definition of Done
- [x] Repro performed and root cause identified.
- [x] Fix implemented in scope.
- [x] Focused validation passed.
- [x] Source-of-truth state updated.

## Validation Evidence
- `pnpm --filter api exec vitest run src/modules/engine/runtimePositionAutomation.dcaTpParity.test.ts --reporter=verbose` -> PASS (2/2)
- Earlier failure reproduced: same suite timed out at 5000ms due DB-backed state-store path in test runtime.
- Supplemental route-level e2e (`bots.runtime-close-dca-authority.e2e.test.ts`) remains blocked locally without PostgreSQL at `localhost:5432`.
- Reality status: partially verified

## Result Report
- Task summary: Repaired DCA/TSL parity test reliability by mocking runtime position state store methods in the focused parity test. This removes Prisma/DB dependency from unit-level parity proofs and unblocks deterministic local verification.
- Files changed:
  - `apps/api/src/modules/engine/runtimePositionAutomation.dcaTpParity.test.ts`
- How tested:
  - Focused DCA/TSL parity suite rerun and passed.
- What is incomplete:
  - DB-backed route e2e close-authority pack still requires running local PostgreSQL.
- Next steps:
  1. Bring up local DB and run `bots.runtime-close-dca-authority.e2e.test.ts`.
  2. If green, continue with broader app-level DCA/TSL journey proof.

## 2026-06-01 continuation [finish_successful_run_handoff]
- Wake `finish_successful_run_handoff` acknowledged from inline payload (`fallbackFetchNeeded=false`, comments `0/0`, latest comment id `unknown`).
- Concrete action in this heartbeat:
  - attempted to advance the live continuation gate by running DB-backed route-level DCA/TSL close-authority proof.
  - command: `pnpm --filter api exec vitest run src/modules/bots/bots.runtime-close-dca-authority.e2e.test.ts --reporter=verbose`.
- Result:
  - FAIL (`2/2`) before route assertions due runtime dependency block:
  - `PrismaClientInitializationError: Can't reach database server at localhost:5432` from `resetBotsE2eState`.
  - local environment check confirms no Docker engine and no local PostgreSQL binaries/services available in this runner.
- Final disposition for this wake: `blocked`.
- First-class unblock owner/action:
  1. Ops/Environment owner: provide runnable local DB path for this lane (`postgres` on `localhost:5432` or equivalent approved test DB) in the Paperclip execution environment.
  2. Backend+QA owner: rerun `bots.runtime-close-dca-authority.e2e.test.ts` and attach passing closure proof for both route-level DCA-first cases.

## 2026-06-02 continuation [issue_status_changed]
- Wake acknowledged from inline resume delta (`fallbackFetchNeeded=false`, comments `0/0`, latest comment id `unknown`).
- Concrete action in this heartbeat:
  - rechecked runner infra: Docker engine unavailable, no local PostgreSQL binaries/services, and `localhost:5432` unreachable;
  - reran deterministic unit-level DCA/TSL parity proof:
    - `pnpm --filter api exec vitest run src/modules/engine/runtimePositionAutomation.dcaTpParity.test.ts --reporter=verbose` -> PASS (`2/2`);
  - read Paperclip heartbeat context and confirmed LUC-1306 was still `in_progress` without first-class blockers;
  - identified existing route-level owner lane `LUC-1196` as the correct blocker for DB-backed DCA-first close-authority route proof.
- Result:
  - unit-level DCA/TSL parity remains verified;
  - route-level proof remains blocked before assertions by missing DB runtime, not by a newly observed close-authority assertion failure.
- Final disposition for this wake: `blocked`.
- First-class blocker:
  - `LUC-1196` (`1244f931-5304-4d58-99a0-ebceda942196`).
- Unblock owner/action:
  1. Backend test-infra / Ops environment owner: provide deterministic DB-backed Soar API e2e runtime (`localhost:5432` PostgreSQL or approved embedded/test DB harness).
  2. Backend QA owner: rerun `pnpm --filter api exec vitest run src/modules/bots/bots.runtime-close-dca-authority.e2e.test.ts --reporter=verbose` and attach closure evidence.

## 2026-06-02 continuation [issue_blockers_resolved]
- Wake acknowledged from inline resume delta (`fallbackFetchNeeded=false`, comments `0/0`, latest comment id `unknown`).
- Blocker status:
  - Paperclip heartbeat context reports `LUC-1196` as `done`.
  - Local runtime now has Docker engine available and `localhost:5432` reachable.
- Concrete action in this heartbeat:
  - ran route-level DCA-first close-authority proof:
    - `pnpm --filter api exec vitest run src/modules/bots/bots.runtime-close-dca-authority.e2e.test.ts --reporter=verbose` -> PASS (`2/2`);
  - reran unit-level DCA/TSL parity proof:
    - `pnpm --filter api exec vitest run src/modules/engine/runtimePositionAutomation.dcaTpParity.test.ts --reporter=verbose` -> PASS (`2/2`).
- Acceptance closure:
  - DCA decision/affordability is locally proven before TP/SL/TTP/TSL close authority for the covered runtime and route-level cases.
  - Route-level close path covers both pending-DCA fill-based behavior and no-pending-DCA allow-close behavior.
- Source-control/deploy disposition:
  - direct code changes in this heartbeat: none;
  - commit: not created in this coordinator heartbeat;
  - push: not needed;
  - deploy/restart/env/database/account/live-trading mutation: none.
- Final disposition for this wake: `done`.
