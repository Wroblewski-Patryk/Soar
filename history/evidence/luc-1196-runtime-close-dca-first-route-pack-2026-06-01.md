# LUC-1196 - Runtime Close DCA-First Route-Level Pack

Date: 2026-06-01
Owner lane: Backend API Engineer

## Implemented Pack

Added focused route-level e2e pack:
- `apps/api/src/modules/bots/bots.runtime-close-dca-authority.e2e.test.ts`

Coverage in this pack:
1. `pending DCA exists`:
- endpoint: `POST /dashboard/bots/:id/runtime-sessions/:sessionId/positions/:positionId/close`
- expected behavior: close remains fill-based (`status=submitted`), position remains `OPEN`.

2. `no pending DCA exists`:
- endpoint: `POST /dashboard/bots/:id/runtime-sessions/:sessionId/positions/:positionId/close`
- expected behavior: close completes (`status=closed`), position transitions to `CLOSED`.

## Verification

Executed command:
- `pnpm --filter api exec vitest run src/modules/bots/bots.runtime-close-dca-authority.e2e.test.ts --reporter=verbose`

Result:
- `FAIL` (both tests blocked before route assertions)
- blocker: `PrismaClientInitializationError` -> `Can't reach database server at localhost:5432`

## Disposition

- Status: `blocked`
- Unblock owner/action:
  1. Backend/Ops lane: provide local PostgreSQL test dependency on `localhost:5432`.
  2. Backend QA lane: rerun the same focused suite and attach pass/fail packet.

## Continuation 2026-06-01 (issue_reopened_via_comment)

Comment `8dfbe42c-c0ae-4995-b86a-a65fcb323353` impact applied first:
- tried to adopt deterministic DB-backed path from `LUC-1315`.
- in this Soar checkout, the referenced route-test file and helper are not present as provided (`server/src/__tests__/issue-scheduled-retry-routes.test.ts`, `@paperclipai/db` `startEmbeddedPostgresTestDatabase`).

Concrete delta in this heartbeat:
- extended route-level pack in `apps/api/src/modules/bots/bots.runtime-close-authority.route-pack.e2e.test.ts` with explicit DCA-exhausted allow-close scenario.

Focused verification rerun:
- command: `pnpm --filter api exec vitest run src/modules/bots/bots.runtime-close-authority.route-pack.e2e.test.ts --reporter=verbose`
- result: `FAIL` (`3` tests blocked)
- blocker: `PrismaClientInitializationError` -> `Can't reach database server at localhost:5432` in `resetBotsE2eState`.

Disposition:
- `blocked`
- unblock owner/action:
  1. Backend test-infra owner ports/adapts deterministic embedded-Postgres harness into Soar API tests.
  2. Backend QA reruns focused route pack and closes evidence.

## Continuation 2026-06-01 (issue_continuation_needed)

Concrete recovery/unblock attempt executed:
- verified DB endpoint `127.0.0.1:5432` is closed;
- verified no native `postgres` / `redis` Windows services are available;
- verified Docker engine is unavailable (`dockerDesktopLinuxEngine` pipe missing);
- attempted to start `com.docker.service` and it failed (`CouldNotStartService`).

Outcome:
- focused route-level proof remains environment-blocked before test bootstrap.

Disposition:
- `blocked`

Unblock owner/action:
1. Ops/Environment owner restores local container runtime or provides local PostgreSQL/Redis for API e2e lane.
2. Backend QA reruns focused route-pack proof command and attaches closure evidence.

## Continuation 2026-06-02 (issue_status_changed)

Issue status changed back to `in_progress`, so the environment blocker was rechecked.

Concrete action:
- checked `127.0.0.1:5432`: still closed;
- checked Docker engine: still unavailable (`dockerDesktopLinuxEngine` pipe missing);
- reran focused route pack:
  - `pnpm --filter api exec vitest run src/modules/bots/bots.runtime-close-authority.route-pack.e2e.test.ts --reporter=verbose`.

Result:
- `FAIL` before endpoint assertions;
- `3` tests blocked in `resetBotsE2eState`;
- blocker remains `PrismaClientInitializationError`: `Can't reach database server at localhost:5432`.

Disposition:
- `blocked`

Unblock owner/action:
1. Ops/Environment owner restores a runnable DB-backed API e2e runtime.
2. Backend QA reruns the focused route-pack command and updates the `LUC-1188` close-authority row only after a passing proof.

## Continuation 2026-06-02 (issue_continuation_needed)

Concrete action:
- ran `pnpm --filter api run typecheck` to validate the route-pack code path independently from the unavailable database runtime;
- fixed the `LUC-1196` test seed shape by removing unsupported `Order.mode`;
- fixed the related runtime-close pending-DCA scenario in `bots.e2e.test.ts` to use existing shared helpers instead of missing local helpers.

Typecheck result after fixes:
- `FAIL`, but no remaining errors from `LUC-1196` files or runtime close pack files;
- remaining errors are outside this issue scope:
  - `src/modules/positions/positions.orphan-repair.contract.e2e.test.ts`;
  - `src/router/workers-health-readiness.test.ts`.

Disposition:
- `blocked`

Blocking condition:
- endpoint proof still requires DB-backed e2e runtime, and `localhost:5432` / Docker remain unavailable in this session.

## Continuation 2026-06-02 (source_scoped_recovery_action)

Wake impact:
- scoped recovery wake reopened actionable work under `LUC-1196`;
- no pending comments were provided, so the next action was direct revalidation and blocker hardening.

Concrete action:
- checked route implementation linkage:
  - `apps/api/src/modules/bots/bots.routes.ts` routes
    `POST /dashboard/bots/:id/runtime-sessions/:sessionId/positions/:positionId/close`
    to `closeBotRuntimeSessionPosition`;
  - `apps/api/src/modules/bots/bots.controller.ts` maps missing `riskAck`
    to the expected `400` message;
  - `apps/api/src/modules/bots/runtimeSessionPositionCommand.service.ts`
    delegates close authority through `orchestrateRuntimeSignal`.
- reran route-level pack:
  - `pnpm --filter api exec vitest run src/modules/bots/bots.runtime-close-authority.route-pack.e2e.test.ts --reporter=verbose`.
- ran DB-independent close command service proof:
  - `pnpm --filter api exec vitest run src/modules/bots/runtimeSessionPositionCommand.service.test.ts --reporter=verbose`.
- rechecked environment:
  - `Test-NetConnection 127.0.0.1 -Port 5432`;
  - `docker version --format '{{.Server.Version}}'`.

Results:
- route-level pack: `FAIL` before endpoint assertions; `3/3` tests blocked in
  `resetBotsE2eState` because Prisma cannot reach `localhost:5432`.
- command service pack: `PASS` (`11/11`).
- local DB: `TcpTestSucceeded=false` for `127.0.0.1:5432`.
- Docker server: unavailable.

Disposition:
- `blocked`.

First-class unblock issue:
- `LUC-1419` - Ops restores local DB-backed API e2e runtime or an approved
  deterministic harness, then reruns the focused route pack.

Blocking condition:
- acceptance still requires focused endpoint proof to pass. Current evidence
  proves the command seam is healthy, but the route-level e2e proof cannot
  start without local PostgreSQL/Docker-backed test infrastructure.

## Continuation 2026-06-02 (issue_blockers_resolved)

Wake impact:
- first-class blocker `LUC-1419` resolved and local PostgreSQL was reachable;
- the route-level pack could run to endpoint assertions.

Implementation delta:
- `runtimeExecutionDedupeService` now exposes
  `getPendingSubmittedDcaOrderIdForPosition(positionId)`.
- `closeBotRuntimeSessionPosition` now checks for a fresh submitted DCA order
  before close orchestration and returns `submitted` with that order id instead
  of creating/executing a close while DCA is still pending fill.
- route fixtures now seed the production-shaped DCA state: active order plus
  pending `RuntimeExecutionDedupe` row.

Verification:
- `Test-NetConnection 127.0.0.1 -Port 5432` -> `TcpTestSucceeded=true`.
- `pnpm --filter api exec vitest run src/modules/bots/bots.runtime-close-authority.route-pack.e2e.test.ts --reporter=verbose`
  -> PASS (`3/3`).
- `pnpm --filter api exec vitest run src/modules/bots/bots.runtime-close-dca-authority.e2e.test.ts --reporter=verbose`
  -> PASS (`2/2`).
- `pnpm --filter api exec vitest run src/modules/bots/bots.e2e.test.ts -t "keeps runtime close authority fill-based when a pending DCA order is still open for the same position" --reporter=verbose`
  -> PASS (`1/1`, `26` skipped).
- `pnpm --filter api exec vitest run src/modules/engine/runtimeExecutionDedupe.service.test.ts src/modules/bots/runtimeSessionPositionCommand.service.test.ts --reporter=verbose`
  -> PASS (`26/26`).
- `pnpm --filter api run typecheck` -> FAIL, but only in separate active lanes:
  - `src/modules/positions/positions.orphan-repair.contract.e2e.test.ts`;
  - `src/router/workers-health-readiness.test.ts`.

Disposition:
- `done` for the `LUC-1196` acceptance scope.

Residual risk:
- Full API typecheck remains blocked by unrelated test type drift outside
  `LUC-1196`; no `LUC-1196` files appear in the typecheck error list.
